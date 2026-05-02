import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, isSameDay } from 'date-fns'
import { SERVICES, ADDONS, generateTimeSlots, isValidBookingDate, formatTime } from '../services/appointmentService'
import useBookingStore from '../store/bookingStore'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'
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

  // Generate next 30 days for date selection
  const generateDates = () => {
    const dates = []
    for (let i = 0; i < 30; i++) {
      const date = addDays(new Date(), i)
      if (isValidBookingDate(date)) {
        dates.push(date)
      }
    }
    return dates
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

  return (
    <div ref={topRef} className="min-h-screen bg-neutral-50 pt-28 sm:pt-24">
      <Header />

      {/* Booking Form */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-title text-center mb-4">{t('bookYourAppointment')}</h1>
            <p className="text-center text-neutral-600 mb-12">
              {t('selectYourPreferences')}
            </p>

            <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-lg p-8 space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">{t('personalInformation')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Име и Фамилия
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-accent-gold transition-colors"
                      placeholder={t('fullName')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t('email')} {t('requiredField')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-accent-gold transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
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
                      className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-accent-gold transition-colors"
                      placeholder="0886462500"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">{t('selectService')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SERVICES.map((service) => (
                    <label
                      key={service.id}
                      className={`relative border-2 rounded-sm p-3.5 sm:p-4 cursor-pointer transition-all ${
                        formData.service === service.id
                          ? 'border-accent-gold bg-accent-gold/5'
                          : 'border-neutral-300 hover:border-accent-gold/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={formData.service === service.id}
                        onChange={handleServiceChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center text-center gap-1">
                        <h3 className="font-semibold text-base sm:text-lg leading-snug">{service.name}</h3>
                        <p className="text-xs sm:text-sm text-neutral-600">{service.duration} min</p>
                        <span className="text-lg sm:text-xl font-bold text-accent-gold">€{service.price}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Add-ons Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">{t('addons')}</h2>
                <p className="text-neutral-600 mb-6">{t('addonsDescription')}</p>
                <div className="space-y-3">
                  {ADDONS.map((addon) => {
                    // Disable beard addon if Beard service is selected
                    const isDisabled = addon.id === 'beard-addon' && formData.service === 'beard'
                    const isChecked = formData.addons.includes(addon.id)
                    
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between p-4 sm:p-5 bg-white border-2 rounded-sm transition-all ${
                          isDisabled 
                            ? 'border-neutral-200 bg-neutral-50 cursor-not-allowed opacity-50' 
                            : isChecked
                            ? 'border-accent-gold shadow-md'
                            : 'border-neutral-300 cursor-pointer hover:border-accent-gold/50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          {/* Custom Checkbox */}
                          <div className="relative flex-shrink-0 mt-0.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => !isDisabled && handleAddonToggle(addon.id)}
                              disabled={isDisabled}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 transition-all duration-300 ${
                              isChecked
                                ? 'bg-accent-gold border-accent-gold'
                                : 'bg-white border-neutral-300'
                            }`}>
                              {isChecked && (
                                <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <h3 className="font-semibold text-base sm:text-lg leading-snug">{addon.name}</h3>
                            <p className="text-xs sm:text-sm text-neutral-600">
                              {(addon.displayDuration || addon.duration) > 0
                                ? `${addon.displayDuration || addon.duration} min`
                                : t('noExtraTime')}
                            </p>
                          </div>
                        </div>
                        <span className="text-base sm:text-lg font-bold text-accent-gold ml-3 flex-shrink-0">+€{addon.price}</span>
                      </label>
                    )
                  })}
                </div>
                <AnimatePresence>
                  {formData.addons.length > 0 && (
                    <motion.div
                      key="total-price"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="mt-6 p-4 bg-accent-gold/10 rounded-sm border border-accent-gold/30"
                    >
                      <motion.div 
                        className="flex justify-between items-center text-lg font-semibold"
                        key={calculateTotalPrice()}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <span>{t('totalPrice')}:</span>
                        <span className="text-accent-gold">€{calculateTotalPrice()}</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Date Selection */}
              {/* Desktop: keep existing grid */}
              <div className="hidden md:block">
                <h2 className="text-2xl font-semibold mb-6">{t('selectDate')}</h2>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {generateDates().map((date) => (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      className={`p-3 rounded-sm border-2 transition-all ${
                        selectedDate && isSameDay(date, selectedDate)
                          ? 'border-accent-gold bg-accent-gold text-white'
                          : 'border-neutral-300 hover:border-accent-gold/50'
                      }`}
                    >
                      <div className="text-xs font-medium">{format(date, 'EEE')}</div>
                      <div className="text-lg font-bold">{format(date, 'd')}</div>
                      <div className="text-xs">{format(date, 'MMM')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile: buttons that toggle pickers */}
              <div className="md:hidden space-y-4">
                {/* Date Section */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4">{t('selectDate')}</h2>
                  <div className="space-y-2">
                    {chosenDateLabel ? (
                      <div className="flex items-center justify-between bg-white p-3 rounded-sm border">
                        <div className="text-base font-semibold text-neutral-900">{chosenDateLabel}</div>
                        <button
                          type="button"
                          className="text-sm text-accent-gold hover:underline ml-2 flex-shrink-0"
                          onClick={() => setShowDatePicker(true)}
                        >
                          {t('selectDate')}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setShowDatePicker(true); setShowTimePicker(false) }}
                        className="w-full py-3 bg-white border rounded-sm text-left px-4 font-semibold"
                      >
                        {t('selectDate')}
                      </button>
                    )}

                    <AnimatePresence>
                      {showDatePicker && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-y-auto overflow-x-hidden max-h-96 bg-white p-4 rounded-sm border w-full"
                        >
                          <div className="grid grid-cols-5 gap-3">
                            {generateDates().map((date) => (
                              <button
                                key={date.toISOString()}
                                type="button"
                                onClick={() => { handleDateSelect(date) }}
                                className={`min-w-0 h-16 px-1 py-2 rounded-sm text-center flex flex-col items-center justify-center leading-tight ${
                                  selectedDate && isSameDay(date, selectedDate)
                                    ? 'bg-accent-gold text-white'
                                    : 'bg-white border'
                                }`}
                              >
                                <div className="font-bold text-base">{format(date, 'd')}</div>
                                <div className={`text-xs ${
                                  selectedDate && isSameDay(date, selectedDate)
                                    ? 'text-white'
                                    : 'text-neutral-500'
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
                          <div className="flex items-center justify-between bg-white p-3 rounded-sm border">
                            <div className="text-base font-semibold text-neutral-900">{chosenTimeLabel}</div>
                            <button
                              type="button"
                              className="text-sm text-accent-gold hover:underline ml-2 flex-shrink-0"
                              onClick={() => setShowTimePicker(true)}
                            >
                              {t('selectTime')}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setShowTimePicker(true); setShowDatePicker(false) }}
                            className="w-full py-3 bg-white border rounded-sm text-left px-4 font-semibold"
                          >
                            {t('selectTime')}
                          </button>
                        )}

                        <AnimatePresence>
                          {showTimePicker && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-y-auto overflow-x-hidden max-h-96 bg-white p-4 rounded-sm border w-full"
                            >
                              <div className="grid grid-cols-3 gap-3">
                                {availableSlots.map((slot) => (
                                  <button
                                    key={slot.time}
                                    type="button"
                                    onClick={() => { handleTimeSelect(slot.time) }}
                                    disabled={!slot.available}
                                    className={`min-w-0 h-12 px-1 rounded-sm text-xs font-medium whitespace-nowrap flex items-center justify-center text-center ${
                                      formData.time === slot.time
                                        ? 'bg-accent-gold text-white'
                                        : slot.available
                                        ? 'bg-white border'
                                        : 'bg-neutral-100 text-neutral-400'
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
                  <h2 className="text-2xl font-semibold mb-6">{t('selectTime')}</h2>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`py-3 px-4 rounded-sm border-2 font-medium transition-all ${
                          formData.time === slot.time
                            ? 'border-accent-gold bg-accent-gold text-white'
                            : slot.available
                            ? 'border-neutral-300 hover:border-accent-gold/50'
                            : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        }`}
                      >
                        {formatTime(slot.time)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">
                  {t('additionalNotes')}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-accent-gold transition-colors resize-none"
                  placeholder={t('optionalNotes')}
                />
              </div>

              {/* Privacy Policy Consent */}
              <div className="rounded-sm border border-neutral-300 bg-neutral-50 p-3 sm:p-5">
                <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-accent-gold focus:ring-accent-gold"
                  />
                  <span className="text-xs sm:text-sm text-neutral-700 leading-snug sm:leading-relaxed">
                    Запознат/а съм с{' '}
                    <Link to="/privacy-policy" className="font-semibold text-accent-gold hover:underline">
                      Политиката за поверителност
                    </Link>{' '}
                    и съм съгласен/съгласна с нея, за да завърша резервацията си.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full btn-primary py-4 text-lg ${!formData.privacyAccepted ? 'opacity-60 cursor-not-allowed hover:scale-100' : ''}`}
                disabled={!formData.privacyAccepted}
              >
                {t('confirmAppointment')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Booking
