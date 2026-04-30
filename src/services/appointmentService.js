// Business hours per day of week
// Weekdays (Mon-Fri): 10:00 - 19:00
// Weekends (Sat-Sun): 11:00 - 17:00
// Each appointment slot is 30 minutes

export const BUSINESS_HOURS = {
  weekday: { start: 10, end: 19 },    // Mon-Fri: 10:00 AM - 7 PM
  weekend: { start: 11, end: 17 }     // Sat-Sun: 11:00 AM - 5 PM
}

// Legacy fallback for compatibility
export const APPOINTMENT_DURATION = 30 // Base slot duration in minutes

// Hairstyle durations
export const HAIRSTYLE_DURATION = {
  buzzcut: 30,  // Buzzcut = 30 minutes
  other: 60     // Other hairstyles = 1 hour (2 slots)
}

// Services for booking (actual services)
export const SERVICES = [
  { id: 'normal', name: 'Подстрижка на Средна/Дълга коса', duration: 60, price: 15 },
  { id: 'buzzcut', name: 'Къса коса / Фейд', duration: 30, price: 12 },
  { id: 'beard', name: 'Оформяне на брада', duration: 30, price: 12 }
]

// Display services for home page (decorative)
export const DISPLAY_SERVICES = [
  { id: 'fade', name: 'Подстрижка на Средна/Дълга коса', duration: 60, price: 15 },
  { id: 'buzzcut', name: 'Къса коса / Фейд', duration: 30, price: 12 },
  { id: 'beard', name: 'Оформяне на брада', duration: 30, price: 12 },
  { id: 'eyebrows', name: 'Оформяне на вежди', duration: 15, price: 3 },
  { id: 'hair-wash', name: 'Измиване на коса', duration: 0, price: 2 },
  { id: 'hair-dye', name: 'Боядисване на коса', duration: null, price: '', contactRequired: true },

]

export const ADDONS = [
  { id: 'beard-addon', name: 'Оформяне на брада', duration: 30, price: 7 },
  { id: 'eyebrows', name: 'Оформяне на вежди', duration: 30, displayDuration: 15, price: 3 },
  { id: 'hair-wash', name: 'Измиване на коса', duration: 0, price: 2 }
]

/**
 * Get business hours for a specific date based on day of week
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Object} {start: hour, end: hour} for that day
 */
const getBusinessHoursForDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00Z')
  const dayOfWeek = date.getUTCDay() // 0=Sunday, 1=Monday, ..., 6=Saturday
  
  // Saturday (6) or Sunday (0) = weekend
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return BUSINESS_HOURS.weekend
  }
  // Monday-Friday = weekday
  return BUSINESS_HOURS.weekday
}

/**
 * Generate available time slots for a given date and total duration
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array} existingBookings - Array of existing bookings for the date
 * @param {number} duration - Total duration in minutes (service + addons)
 * @returns {Array} Array of time slots with availability status
 */
export const generateTimeSlots = (date, existingBookings = [], duration = 60) => {
  const slots = []
  const slotDuration = 30 // Each slot is 30 minutes
  const businessHours = getBusinessHoursForDate(date)
  const totalSlots = (businessHours.end - businessHours.start) * 2 // 2 slots per hour
  
  // Helper function to check if a specific time slot is occupied by any existing booking
  const isTimeSlotOccupied = (checkTimeSlot) => {
    return existingBookings.some(booking => {
      // Get the booking's duration using service + addons
      const bookingService = SERVICES.find(s => s.id === booking.service)
      let bookingDuration = bookingService?.duration || 60
      
      if (booking.addons && Array.isArray(booking.addons)) {
        booking.addons.forEach(addonId => {
          const addon = ADDONS.find(a => a.id === addonId)
          if (addon) bookingDuration += addon.duration
        })
      }
      
      // Parse times to minutes since start of day
      const [bookingHour, bookingMin] = booking.time.split(':').map(Number)
      const bookingStartMinutes = (bookingHour - businessHours.start) * 60 + bookingMin
      const bookingEndMinutes = bookingStartMinutes + bookingDuration
      
      const [checkHour, checkMin] = checkTimeSlot.split(':').map(Number)
      const checkStartMinutes = (checkHour - businessHours.start) * 60 + checkMin
      
      // Check if this slot falls within the booking's duration
      return checkStartMinutes >= bookingStartMinutes && checkStartMinutes < bookingEndMinutes
    })
  }
  
  for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
    const hour = businessHours.start + Math.floor(slotIndex / 2)
    const minutes = (slotIndex % 2) * 30
    const timeSlot = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    
    // Check if this slot and required consecutive slots are available
    const requiredSlots = Math.ceil(duration / slotDuration)
    let isAvailable = true
    let reasonUnavailable = null
    
    // First check: would this appointment extend beyond business hours?
    const appointmentEndHour = hour + Math.floor((minutes + duration) / 60)
    const appointmentEndMinutes = (minutes + duration) % 60
    const totalMinutesFromStart = (hour - businessHours.start) * 60 + minutes
    const totalMinutesEnd = totalMinutesFromStart + duration
    const businessMinutesEnd = (businessHours.end - businessHours.start) * 60
    
    if (totalMinutesEnd > businessMinutesEnd) {
      isAvailable = false
      reasonUnavailable = 'exceeds_workday'
    }
    
    // Second check: is this slot occupied by existing bookings?
    if (isAvailable) {
      for (let i = 0; i < requiredSlots; i++) {
        const checkSlotIndex = slotIndex + i
        const checkHour = businessHours.start + Math.floor(checkSlotIndex / 2)
        const checkMinutes = (checkSlotIndex % 2) * 30
        const checkTimeSlot = `${String(checkHour).padStart(2, '0')}:${String(checkMinutes).padStart(2, '0')}`
        
        if (isTimeSlotOccupied(checkTimeSlot)) {
          isAvailable = false
          reasonUnavailable = 'occupied'
          break
        }
      }
    }
    
    // Always add the slot, but mark availability status
    slots.push({
      time: timeSlot,
      available: isAvailable,
      duration: duration,
      reason: reasonUnavailable // 'exceeds_workday' or 'occupied'
    })
  }
  
  return slots
}

/**
 * Validate if a date is valid for booking
 * @param {Date} date - Date to validate
 * @returns {boolean} True if date is valid
 */
export const isValidBookingDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const selectedDate = new Date(date)
  selectedDate.setHours(0, 0, 0, 0)
  
  // Can't book in the past
  if (selectedDate < today) return false
  
  // Can't book more than 60 days in advance
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60)
  if (selectedDate > maxDate) return false
  
  return true
}

/**
 * Format time for display
 * @param {string} time - Time in HH:MM format
 * @returns {string} Formatted time
 */
export const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}
