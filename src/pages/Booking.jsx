import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfDay } from 'date-fns'
import { SERVICES, ADDONS, generateTimeSlots, isValidBookingDate, formatTime } from '../services/appointmentService'
import useBookingStore from '../store/bookingStore'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation, getServiceLabel } from '../i18n/translations'
import { analytics } from '../services/analytics'

const Booking = () => {
  const navigate = useNavigate()
  const { addBooking, getBookingsByDate, loadBookings } = useBookingStore()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const topRef = useRef(null)

  // Scroll to top when component mounts
  useEffect(() => {
    // Use a small delay to ensure page is fully rendered
    const scrollTimer = setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'auto', block: 'start' })
      }
    }, 50)

    return () => clearTimeout(scrollTimer)
  }, [])

  // Detect mobile viewport (match Tailwind's md breakpoint)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    if (mq.addEventListener) mq.addEventListener('change', update)
    else mq.addListener(update)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update)
      else mq.removeListener(update)
    }
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
    privacyAccepted: false,
    addons: [] // Array of addon IDs
  })

  const [selectedDate, setSelectedDate] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [chosenDateLabel, setChosenDateLabel] = useState('')
  const [chosenTimeLabel, setChosenTimeLabel] = useState('')
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const credentialsFilled = Boolean(
    formData.name.trim() &&
    formData.email.trim() &&
    formData.phone.length === 10 &&
    formData.service
  )

  // Calculate total duration based on service + addons
  const calculateTotalDuration = () => {
    const selectedService = SERVICES.find(s => s.id === formData.service)
    if (!selectedService) return 60 // default

    let total = selectedService.duration
    formData.addons.forEach(addonId => {
      const addon = ADDONS.find(a => a.id === addonId)
      if (addon) total += addon.duration
    })
    return total
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    const selectedService = SERVICES.find(s => s.id === formData.service)
    if (!selectedService) return 0

    let total = selectedService.price
    formData.addons.forEach(addonId => {
      const addon = ADDONS.find(a => a.id === addonId)
      if (addon) total += addon.price
    })
    return total
  }

  const isAbsentDate = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() // 0-indexed; July = 6
    const day = date.getDate()
    return year === 2026 && month === 6 && day >= 10 && day <= 15
  }

  // Generate dates for the current month view
  const generateDatesForMonth = (monthDate) => {
    const start = startOfMonth(monthDate)
    const end = endOfMonth(monthDate)
    const today = startOfDay(new Date())

    // If month is before today, adjust to start from today
    const adjustedStart = isBefore(start, today) ? today : start

    let dates = eachDayOfInterval({
      start: adjustedStart,
      end: end
    })

    // Filter to only valid booking dates within the 90-day window
    const maxDate = startOfDay(addDays(new Date(), 90))
    dates = dates.filter(date => {
      const d = startOfDay(date)
      return isValidBookingDate(date) && !isBefore(d, today) && !isBefore(maxDate, d)
    })

    return dates
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const today = new Date()
    const newMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    // Don't allow going before current month
    if (newMonth.getFullYear() > today.getFullYear() ||
        (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() >= today.getMonth())) {
      setCurrentMonthDate(newMonth)
    }
  }

  // Check if we can navigate forward (within 3 months)
  const canGoForward = () => {
    const maxDate = addDays(new Date(), 90)
    const nextMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 2, 1)
    return !isBefore(maxDate, nextMonth)
  }

  // Check if we can navigate backward
  const canGoBackward = () => {
    const today = new Date()
    return !(currentMonthDate.getFullYear() === today.getFullYear() && currentMonthDate.getMonth() === today.getMonth())
  }

  const handleDateSelect = (date) => {
    const dateString = format(date, 'yyyy-MM-dd')
    setSelectedDate(date)
    setFormData({ ...formData, date: dateString, time: '' })
    setChosenDateLabel(format(date, 'PPP'))
    setChosenTimeLabel('')

    // Refresh from backend so the slot list reflects other people's reservations too.
    loadBookings()
      .then((freshBookings) => {
        const existingBookings = (freshBookings || []).filter((booking) => booking.date === dateString)
        const totalDuration = calculateTotalDuration()
        const slots = generateTimeSlots(dateString, existingBookings, totalDuration)
        setAvailableSlots(slots)
      })
      .catch(() => {
        const existingBookings = getBookingsByDate(dateString)
        const totalDuration = calculateTotalDuration()
        const slots = generateTimeSlots(dateString, existingBookings, totalDuration)
        setAvailableSlots(slots)
      })

    if (isMobile) {
      // close mobile calendar after selection and reveal time button
      setShowDatePicker(false)
      setShowTimePicker(false)
    }
  }

  const handleTimeSelect = (time) => {
    setFormData({ ...formData, time })
    setChosenTimeLabel(formatTime(time))
    if (isMobile) setShowTimePicker(false)
  }

  const handleServiceChange = (e) => {
    const newService = e.target.value

    // Remove beard addon if switching to Beard service
    const newAddons = newService === 'beard'
      ? formData.addons.filter(id => id !== 'beard-addon')
      : formData.addons

    setFormData({ ...formData, service: newService, addons: newAddons, time: '' })

    // Regenerate time slots if date is selected
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd')
      loadBookings()
        .then((freshBookings) => {
          const existingBookings = (freshBookings || []).filter((booking) => booking.date === dateString)

          // Calculate duration with new service
          const selectedServiceObj = SERVICES.find(s => s.id === newService)
          let totalDuration = selectedServiceObj ? selectedServiceObj.duration : 60
          newAddons.forEach(addonId => {
            const addon = ADDONS.find(a => a.id === addonId)
            if (addon) totalDuration += addon.duration
          })

          const slots = generateTimeSlots(dateString, existingBookings, totalDuration)
          setAvailableSlots(slots)
        })
        .catch(() => {
          const existingBookings = getBookingsByDate(dateString)

          const selectedServiceObj = SERVICES.find(s => s.id === newService)
          let totalDuration = selectedServiceObj ? selectedServiceObj.duration : 60
          newAddons.forEach(addonId => {
            const addon = ADDONS.find(a => a.id === addonId)
            if (addon) totalDuration += addon.duration
          })

          const slots = generateTimeSlots(dateString, existingBookings, totalDuration)
          setAvailableSlots(slots)
        })
    }
  }

  const handleAddonToggle = (addonId) => {
    const newAddons = formData.addons.includes(addonId)
      ? formData.addons.filter(id => id !== addonId)
      : [...formData.addons, addonId]

    setFormData({ ...formData, addons: newAddons, time: '' })

    // Regenerate time slots if date is selected
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd')
      loadBookings()
        .then((freshBookings) => {
          const existingBookings = (freshBookings || []).filter((booking) => booking.date === dateString)

          // Calculate duration with new addons
          const selectedService = SERVICES.find(s => s.id === formData.service)
          let totalDuration = selectedService ? selectedService.duration : 60
          newAddons.forEach(id => {
            const addon = ADDONS.find(a => a.id === id)
            if (addon) totalDuration += addon.duration
          })

          const slots = generateTimeSlots(dateString, existingBookings, totalDuration)
          setAvailableSlots(slots)
        })
        .catch(() => {
          const existingBookings = getBookingsByDate(dateString)

          const selectedService = SERVICES.find(s => s.id === formData.service)
          let totalDuration = selectedService ? selectedService.duration : 60
          newAddons.forEach(id => {
            const addon = ADDONS.find(a => a.id === id)
            if (addon) totalDuration += addon.duration
          })

          const slots = generateTimeSlots(dateString, existingBookings, totalDuration)
          setAvailableSlots(slots)
        })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    // Validate all required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time) {
      alert(t('fillAllFields'))
      return
    }

    if (!formData.privacyAccepted) {
      alert('Please confirm that you have read the Privacy Policy to continue.')
      return
    }

    // Validate phone number is exactly 10 digits
    if (formData.phone.length !== 10) {
      alert('Phone number must be exactly 10 digits')
      return
    }

    setIsSubmitting(true)

    // Track analytics
    analytics.trackBooking(formData.service, formData.date)

    // Refresh bookings right before submit so the server is checked against the latest state.
    try {
      await loadBookings()
    } catch (error) {
      console.warn('Could not refresh bookings before submit:', error)
    }

    const selectedService = SERVICES.find(s => s.id === formData.service)
    const selectedAddonDetails = (formData.addons || [])
      .map(addonId => {
        const addon = ADDONS.find(a => a.id === addonId)
        if (!addon) return null

        return {
          id: addon.id,
          name: addon.name,
          duration: addon.displayDuration ?? addon.duration ?? 0,
          price: addon.price || 0
        }
      })
      .filter(Boolean)

    const selectedAddonNames = selectedAddonDetails.map(addon => addon.name)
    const selectedServiceDuration = selectedService?.duration || 0
    const selectedServicePrice = selectedService?.price || 0
    const totalDuration = selectedServiceDuration + selectedAddonDetails.reduce((sum, addon) => sum + addon.duration, 0)
    const totalPrice = selectedServicePrice + selectedAddonDetails.reduce((sum, addon) => sum + addon.price, 0)

    // Add booking via API
    const result = await addBooking({
      ...formData,
      serviceName: selectedService?.name,
      serviceDuration: selectedServiceDuration,
      servicePrice: selectedServicePrice,
      addonNames: selectedAddonNames,
      addonDetails: selectedAddonDetails,
      totalDuration,
      totalPrice,
      language
    })

    if (!result.success) {
      setIsSubmitting(false)
      alert(result.message || t('errorSavingReservation'))
      return
    }

    // Persist booking for the confirmation page, then force a full page load.
    const confirmationBooking = result.booking || formData
    sessionStorage.setItem('latestBooking', JSON.stringify(confirmationBooking))
    window.location.assign('/confirmation')
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // Validate phone number - only allow digits and limit to 10
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length <= 10) {
        setFormData({
          ...formData,
          [name]: digitsOnly
        })
      }
      return
    }

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const stepHeading = (index, title) => (
    <div className="mb-7 flex items-center gap-3">
      <span className="text-[10px] font-medium tracking-eyebrow text-neutral-400">
        {String(index).padStart(2, '0')}
      </span>
      <span className="h-px w-6 bg-hairline-strong" />
      <h2 className="section-title-sm text-ink">{title}</h2>
    </div>
  )

  return (
    <div ref={topRef} className="min-h-screen bg-paper-soft pt-28 sm:pt-24">
      <Header />

      {/* Booking Form */}
      <section className="pb-20 pt-10 sm:pb-28 sm:pt-14">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {/* Page head */}
            <div className="mb-10 sm:mb-14">
              <div className="flex items-center gap-3 text-neutral-400">
                <span className="h-1.5 w-1.5 rotate-45 bg-ink" />
                <span className="eyebrow text-neutral-500">{t('brandName')}</span>
              </div>
              <h1 className="section-title mt-5 text-ink">{t('bookYourAppointment')}</h1>
              <p className="section-subtitle mt-5">{t('selectYourPreferences')}</p>
            </div>

            <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
              {/* Personal Information */}
              <div className="p-6 sm:p-9">
                {stepHeading(1, t('personalInformation'))}

                <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="field-label">
                      {t('fullNameLabel')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="field-input"
                      placeholder={t('fullName')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="field-label">
                      {t('email')} {t('requiredField')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="field-input"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="field-label">
                      {t('phoneNumber')} {t('requiredField')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      maxLength="10"
                      className="field-input"
                      placeholder="0886462500"
                    />
                  </div>
                </div>
              </div>

              <div className="rule" />

              {/* Service Selection */}
              <div className="p-6 sm:p-9">
                {stepHeading(2, t('selectService'))}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {SERVICES.map((service) => {
                    const isSelected = formData.service === service.id

                    return (
                      <label
                        key={service.id}
                        className={`group relative flex cursor-pointer flex-col justify-between gap-5 rounded-xl border p-5 transition-all duration-300 ease-editorial ${
                          isSelected
                            ? 'border-ink bg-ink text-white shadow-ink'
                            : 'border-hairline bg-white hover:border-hairline-strong hover:-translate-y-0.5'
                        }`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service.id}
                          checked={isSelected}
                          onChange={handleServiceChange}
                          className="sr-only"
                        />

                        <div className="flex items-start justify-between gap-3">
                          <span className={`text-[10px] uppercase tracking-wider2 ${isSelected ? 'text-white/50' : 'text-neutral-400'}`}>
                            {service.duration} min
                          </span>
                          <span
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                              isSelected ? 'border-white bg-white' : 'border-hairline-strong'
                            }`}
                          >
                            {isSelected && (
                              <svg className="h-3 w-3 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                        </div>

                        <div>
                          <h3 className={`font-display text-base font-semibold leading-snug sm:text-lg ${isSelected ? 'text-white' : 'text-ink'}`}>
                            {getServiceLabel(language, service.id, service.name)}
                          </h3>
                          <span className={`mt-2 block font-display text-xl font-bold ${isSelected ? 'text-white' : 'text-ink'}`}>
                            €{service.price}
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="rule" />

              {/* Add-ons Section */}
              <div className="p-6 sm:p-9">
                {stepHeading(3, t('addons'))}
                <p className="-mt-3 mb-6 text-sm text-neutral-500">{t('addonsDescription')}</p>

                <div className="overflow-hidden rounded-xl border border-hairline">
                  {ADDONS.map((addon, index) => {
                    // Disable beard addon if Beard service is selected
                    const isDisabled = addon.id === 'beard-addon' && formData.service === 'beard'
                    const isChecked = formData.addons.includes(addon.id)

                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between gap-4 p-4 transition-colors duration-300 sm:p-5 ${
                          index > 0 ? 'border-t border-hairline' : ''
                        } ${
                          isDisabled
                            ? 'cursor-not-allowed bg-neutral-50 opacity-45'
                            : isChecked
                              ? 'cursor-pointer bg-neutral-100'
                              : 'cursor-pointer bg-white hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex flex-1 items-center gap-4">
                          {/* Custom Checkbox */}
                          <div className="relative flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => !isDisabled && handleAddonToggle(addon.id)}
                              disabled={isDisabled}
                              className="sr-only"
                            />
                            <div className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all duration-300 ${
                              isChecked
                                ? 'border-ink bg-ink'
                                : 'border-hairline-strong bg-white'
                            }`}>
                              {isChecked && (
                                <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.3 }}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-display text-base font-semibold leading-snug text-ink">{getServiceLabel(language, addon.id, addon.name)}</h3>
                            <p className="mt-0.5 text-[11px] uppercase tracking-wide text-neutral-400">
                              {(addon.displayDuration || addon.duration) > 0
                                ? `${addon.displayDuration || addon.duration} min`
                                : t('noExtraTime')}
                            </p>
                          </div>
                        </div>

                        <span className="flex-shrink-0 font-display text-base font-bold text-ink sm:text-lg">+€{addon.price}</span>
                      </label>
                    )
                  })}
                </div>

                <AnimatePresence>
                  {formData.addons.length > 0 && (
                    <motion.div
                      key="total-price"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-ink px-5 py-4 text-white"
                    >
                      <span className="eyebrow text-white/50">{t('totalPrice')}</span>
                      <motion.span
                        key={calculateTotalPrice()}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="font-display text-2xl font-bold"
                      >
                        €{calculateTotalPrice()}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="rule" />

              {/* Date + Time Selection */}
              <div className="relative p-6 sm:p-9">
                {!credentialsFilled && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-none bg-white/85 backdrop-blur-[3px]">
                    <div className="mx-6 flex max-w-sm flex-col items-center gap-3 text-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-neutral-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                      <p className="text-sm font-medium leading-relaxed text-neutral-500">
                        {t('lockedNotice')}
                      </p>
                    </div>
                  </div>
                )}

              {/* Desktop: month view with navigation */}
              <div className="hidden md:block">
                {stepHeading(4, t('selectDate'))}

                {/* Month Navigation */}
                <div className="mb-6 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    disabled={!canGoBackward()}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-strong text-ink transition-all duration-300 ease-editorial hover:border-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <h3 className="min-w-48 text-center font-display text-lg font-bold uppercase tracking-tight text-ink">
                    {format(currentMonthDate, 'MMMM yyyy')}
                  </h3>

                  <button
                    type="button"
                    onClick={goToNextMonth}
                    disabled={!canGoForward()}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-strong text-ink transition-all duration-300 ease-editorial hover:border-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {generateDatesForMonth(currentMonthDate).map((date) => (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => isAbsentDate(date) ? null : handleDateSelect(date)}
                      disabled={isAbsentDate(date)}
                      className={`rounded-xl border p-3 transition-all duration-300 ease-editorial ${
                        isAbsentDate(date)
                          ? 'cursor-not-allowed border-red-200 bg-red-50 text-red-400 line-through'
                          : selectedDate && isSameDay(date, selectedDate)
                            ? 'border-ink bg-ink text-white shadow-ink'
                            : 'border-hairline bg-white hover:-translate-y-0.5 hover:border-ink'
                      }`}
                    >
                      <div className={`text-[10px] uppercase tracking-wider2 ${
                        selectedDate && isSameDay(date, selectedDate) ? 'text-white/55' : 'text-neutral-400'
                      }`}>{format(date, 'EEE')}</div>
                      <div className="mt-0.5 font-display text-lg font-bold">{format(date, 'd')}</div>
                      <div className={`text-[10px] uppercase tracking-wider2 ${
                        selectedDate && isSameDay(date, selectedDate) ? 'text-white/55' : 'text-neutral-400'
                      }`}>{format(date, 'MMM')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile: buttons that toggle pickers */}
              <div className="space-y-4 md:hidden">
                {/* Date Section */}
                <div>
                  {stepHeading(4, t('selectDate'))}
                  <div className="space-y-2">
                    {chosenDateLabel ? (
                      <div className="flex items-center justify-between rounded-xl border border-ink bg-ink p-4 text-white">
                        <div className="font-display text-base font-semibold">{chosenDateLabel}</div>
                        <button
                          type="button"
                          className="ml-2 flex-shrink-0 text-[10px] uppercase tracking-eyebrow text-white/60 underline-offset-4 hover:text-white hover:underline"
                          onClick={() => setShowDatePicker(true)}
                        >
                          {t('selectDate')}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setShowDatePicker(true); setShowTimePicker(false) }}
                        className="flex w-full items-center justify-between rounded-xl border border-hairline bg-white px-4 py-4 text-left font-display text-base font-semibold text-ink"
                      >
                        {t('selectDate')}
                        <svg className="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}

                    <AnimatePresence>
                      {showDatePicker && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="w-full overflow-hidden rounded-xl border border-hairline bg-white p-4"
                        >
                          {/* Mobile Month Navigation */}
                          <div className="mb-4 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={goToPreviousMonth}
                              disabled={!canGoBackward()}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>

                            <h4 className="flex-1 text-center font-display text-sm font-bold uppercase tracking-wider2 text-ink">
                              {format(currentMonthDate, 'MMM yyyy')}
                            </h4>

                            <button
                              type="button"
                              onClick={goToNextMonth}
                              disabled={!canGoForward()}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>

                          <div className="grid max-h-64 grid-cols-5 gap-2 overflow-y-auto">
                            {generateDatesForMonth(currentMonthDate).map((date) => (
                              <button
                                key={date.toISOString()}
                                type="button"
                                onClick={() => { if (!isAbsentDate(date)) handleDateSelect(date) }}
                                disabled={isAbsentDate(date)}
                                className={`flex h-16 min-w-0 flex-col items-center justify-center rounded-lg px-1 py-2 text-center leading-tight transition-colors ${
                                  isAbsentDate(date)
                                    ? 'cursor-not-allowed border border-red-200 bg-red-50 text-red-400 line-through'
                                    : selectedDate && isSameDay(date, selectedDate)
                                      ? 'bg-ink text-white'
                                      : 'border border-hairline bg-white text-ink'
                                }`}
                              >
                                <div className="font-display text-base font-bold">{format(date, 'd')}</div>
                                <div className={`text-[10px] uppercase tracking-wider2 ${
                                  isAbsentDate(date)
                                    ? 'text-red-300'
                                    : selectedDate && isSameDay(date, selectedDate)
                                      ? 'text-white/60'
                                      : 'text-neutral-400'
                                }`}>{format(date, 'EEE')}</div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Time button & picker (mobile) - separate from date section */}
                <AnimatePresence>
                  {chosenDateLabel && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-2">
                        {chosenTimeLabel ? (
                          <div className="flex items-center justify-between rounded-xl border border-ink bg-ink p-4 text-white">
                            <div className="font-display text-base font-semibold">{chosenTimeLabel}</div>
                            <button
                              type="button"
                              className="ml-2 flex-shrink-0 text-[10px] uppercase tracking-eyebrow text-white/60 underline-offset-4 hover:text-white hover:underline"
                              onClick={() => setShowTimePicker(true)}
                            >
                              {t('selectTime')}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setShowTimePicker(true); setShowDatePicker(false) }}
                            className="flex w-full items-center justify-between rounded-xl border border-hairline bg-white px-4 py-4 text-left font-display text-base font-semibold text-ink"
                          >
                            {t('selectTime')}
                            <svg className="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}

                        <AnimatePresence>
                          {showTimePicker && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="max-h-96 w-full overflow-y-auto overflow-x-hidden rounded-xl border border-hairline bg-white p-4"
                            >
                              <div className="grid grid-cols-3 gap-2">
                                {availableSlots.map((slot) => (
                                  <button
                                    key={slot.time}
                                    type="button"
                                    onClick={() => { handleTimeSelect(slot.time) }}
                                    disabled={!slot.available}
                                    className={`flex h-12 min-w-0 items-center justify-center whitespace-nowrap rounded-lg px-1 text-center text-xs font-semibold transition-colors ${
                                      formData.time === slot.time
                                        ? 'bg-ink text-white'
                                        : slot.available
                                        ? 'border border-hairline bg-white text-ink'
                                        : 'bg-neutral-100 text-neutral-300 line-through'
                                    }`}
                                  >
                                    {formatTime(slot.time)}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Time Selection (Desktop only) */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="hidden md:block"
                >
                  <div className="mt-10">
                    {stepHeading(5, t('selectTime'))}
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 md:grid-cols-5">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`rounded-full border px-4 py-3 text-sm font-semibold transition-all duration-300 ease-editorial ${
                          formData.time === slot.time
                            ? 'border-ink bg-ink text-white shadow-ink'
                            : slot.available
                            ? 'border-hairline bg-white text-ink hover:-translate-y-0.5 hover:border-ink'
                            : 'cursor-not-allowed border-transparent bg-neutral-100 text-neutral-300 line-through'
                        }`}
                      >
                        {formatTime(slot.time)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              </div>

              <div className="rule" />

              {/* Additional Notes + consent + submit */}
              <div className="space-y-8 p-6 sm:p-9">
                <div>
                  <label htmlFor="notes" className="field-label">
                    {t('additionalNotes')}
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-hairline bg-paper-soft px-4 py-3.5 text-base text-ink transition-colors duration-300 placeholder:text-neutral-400 focus:border-ink focus:outline-none"
                    placeholder={t('optionalNotes')}
                  />
                </div>

                {/* Privacy Policy Consent */}
                <div className="rounded-xl border border-hairline bg-paper-soft p-4 sm:p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="privacyAccepted"
                      checked={formData.privacyAccepted}
                      onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-ink accent-ink focus:ring-ink"
                    />
                    <span className="text-xs leading-relaxed text-neutral-600 sm:text-sm">
                      {t('consentPrefix')}{' '}
                      <Link to="/privacy-policy" className="font-semibold text-ink underline underline-offset-4 hover:opacity-70">
                        {t('consentLinkText')}
                      </Link>{' '}
                      {t('consentSuffix')}
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`btn-primary w-full py-5 ${!formData.privacyAccepted || isSubmitting ? 'cursor-not-allowed opacity-40' : ''}`}
                  disabled={!formData.privacyAccepted || isSubmitting}
                >
                  {isSubmitting ? t('saving') : t('confirmAppointment')}
                  {!isSubmitting && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Booking
