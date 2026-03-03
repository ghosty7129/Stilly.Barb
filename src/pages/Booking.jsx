import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, isSameDay } from 'date-fns'
import { SERVICES, ADDONS, generateTimeSlots, isValidBookingDate, formatTime } from '../services/appointmentService'
import useBookingStore from '../store/bookingStore'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'
import { analytics } from '../services/analytics'

const Booking = () => {
  const navigate = useNavigate()
  const { addBooking, getBookingsByDate } = useBookingStore()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
    addons: [] // Array of addon IDs
  })
  
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])

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
    
    // Get existing bookings for this date
    const existingBookings = getBookingsByDate(dateString)
    const totalDuration = calculateTotalDuration()
    const slots = generateTimeSlots(dateString, existingBookings, totalDuration)
    setAvailableSlots(slots)
  }

  const handleTimeSelect = (time) => {
    setFormData({ ...formData, time })
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
      const existingBookings = getBookingsByDate(dateString)
      
      // Calculate duration with new service
      const selectedServiceObj = SERVICES.find(s => s.id === newService)
      let totalDuration = selectedServiceObj ? selectedServiceObj.duration : 60
      newAddons.forEach(addonId => {
        const addon = ADDONS.find(a => a.id === addonId)
        if (addon) totalDuration += addon.duration
      })
      
      const slots = generateTimeSlots(dateString, existingBookings, totalDuration)
      setAvailableSlots(slots)
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
      const existingBookings = getBookingsByDate(dateString)
      
      // Calculate duration with new addons
      const selectedService = SERVICES.find(s => s.id === formData.service)
      let totalDuration = selectedService ? selectedService.duration : 60
      newAddons.forEach(id => {
        const addon = ADDONS.find(a => a.id === id)
        if (addon) totalDuration += addon.duration
      })
      
      const slots = generateTimeSlots(dateString, existingBookings, totalDuration)
      setAvailableSlots(slots)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time) {
      alert(t('fillAllFields'))
      return
    }
    
    // Track analytics
    analytics.trackBooking(formData.service, formData.date)

    const selectedService = SERVICES.find(s => s.id === formData.service)
    const selectedAddonNames = (formData.addons || [])
      .map(addonId => ADDONS.find(a => a.id === addonId)?.name)
      .filter(Boolean)
    
    // Add booking via API
    const result = await addBooking({
      ...formData,
      serviceName: selectedService?.name,
      addonNames: selectedAddonNames
    })
    
    if (!result.success) {
      alert(result.message || t('maximumReservationsReached'))
      return
    }
    
    // Navigate to confirmation
    navigate('/confirmation', { state: { booking: result.booking || formData } })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white font-display text-2xl">S</span>
              </div>
              <span className="font-display text-2xl font-bold">stilly.barb</span>
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-accent-gold transition-colors">
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </header>

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
                      {t('fullName')} {t('requiredField')}
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
                      className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-accent-gold transition-colors"
                      placeholder="+359 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">{t('selectService')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SERVICES.map((service) => (
                    <label
                      key={service.id}
                      className={`relative border-2 rounded-sm p-4 cursor-pointer transition-all ${
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
                      <div className="flex flex-col items-center text-center">
                        <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                        <p className="text-sm text-neutral-600 mb-2">{service.duration} min</p>
                        <span className="text-xl font-bold text-accent-gold">${service.price}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Add-ons Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">{t('addons')}</h2>
                <p className="text-neutral-600 mb-6">{t('addonsDescription')}</p>
                <div className="space-y-4">
                  {ADDONS.map((addon) => {
                    // Disable beard addon if Beard service is selected
                    const isDisabled = addon.id === 'beard-addon' && formData.service === 'beard'
                    const isChecked = formData.addons.includes(addon.id)
                    
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between p-6 bg-white border-2 rounded-sm transition-all ${
                          isDisabled 
                            ? 'border-neutral-200 bg-neutral-50 cursor-not-allowed opacity-50' 
                            : isChecked
                            ? 'border-accent-gold shadow-md'
                            : 'border-neutral-300 cursor-pointer hover:border-accent-gold/50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          {/* Custom Checkbox */}
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => !isDisabled && handleAddonToggle(addon.id)}
                              disabled={isDisabled}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded border-2 transition-all duration-300 ${
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
                          <div>
                            <h3 className="font-semibold text-lg">{addon.name}</h3>
                            <p className="text-sm text-neutral-600">
                              {addon.displayDuration || addon.duration} min
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-accent-gold">+${addon.price}</span>
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
                        <span className="text-accent-gold">${calculateTotalPrice()}</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Date Selection */}
              <div>
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

              {/* Time Selection */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-primary py-4 text-lg"
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
