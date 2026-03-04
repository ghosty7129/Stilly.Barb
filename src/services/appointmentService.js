// Business hours: 09:00 - 19:00 (7 PM)
// Each appointment slot is 30 minutes
// Duration depends on hairstyle: Buzzcut = 30min, Other = 60min

export const BUSINESS_HOURS = {
  start: 9,
  end: 19 // 7 PM
}

export const APPOINTMENT_DURATION = 30 // Base slot duration in minutes

// Hairstyle durations
export const HAIRSTYLE_DURATION = {
  buzzcut: 30,  // Buzzcut = 30 minutes
  other: 60     // Other hairstyles = 1 hour (2 slots)
}

// Services for booking (actual services)
export const SERVICES = [
  { id: 'normal', name: 'Подстрижка', duration: 60, price: 15 },
  { id: 'buzzcut', name: 'Buzzcut', duration: 30, price: 15 },
  { id: 'beard', name: 'Оформяне на брада', duration: 30, price: 7 }
]

// Display services for home page (decorative)
export const DISPLAY_SERVICES = [
  { id: 'fade', name: 'Подстрижка', duration: 60, price: 15 },
  { id: 'buzzcut', name: 'Buzzcut', duration: 30, price: 15 },
  { id: 'beard', name: 'Оформяне на брада', duration: 30, price: 7 },

]

export const ADDONS = [
  { id: 'beard-addon', name: 'Оформяне на брада', duration: 30, price: 7 },
  { id: 'eyebrows', name: 'Оформяне на вежди', duration: 30, displayDuration: 15, price: 5 }
]

/**
 * Generate available time slots for a given date and total duration
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array} existingBookings - Array of existing bookings for the date
 * @param {number} duration - Total duration in minutes (service + addons)
 * @returns {Array} Array of available time slots
 */
export const generateTimeSlots = (date, existingBookings = [], duration = 60) => {
  const slots = []
  const slotDuration = 30 // Each slot is 30 minutes
  const totalSlots = (BUSINESS_HOURS.end - BUSINESS_HOURS.start) * 2 // 2 slots per hour
  
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
      const bookingStartMinutes = (bookingHour - BUSINESS_HOURS.start) * 60 + bookingMin
      const bookingEndMinutes = bookingStartMinutes + bookingDuration
      
      const [checkHour, checkMin] = checkTimeSlot.split(':').map(Number)
      const checkStartMinutes = (checkHour - BUSINESS_HOURS.start) * 60 + checkMin
      
      // Check if this slot falls within the booking's duration
      return checkStartMinutes >= bookingStartMinutes && checkStartMinutes < bookingEndMinutes
    })
  }
  
  for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
    const hour = BUSINESS_HOURS.start + Math.floor(slotIndex / 2)
    const minutes = (slotIndex % 2) * 30
    const timeSlot = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    
    // Check if this slot and required consecutive slots are available
    const requiredSlots = Math.ceil(duration / slotDuration)
    let isAvailable = true
    
    for (let i = 0; i < requiredSlots; i++) {
      const checkSlotIndex = slotIndex + i
      const checkHour = BUSINESS_HOURS.start + Math.floor(checkSlotIndex / 2)
      const checkMinutes = (checkSlotIndex % 2) * 30
      const checkTimeSlot = `${String(checkHour).padStart(2, '0')}:${String(checkMinutes).padStart(2, '0')}`
      
      if (isTimeSlotOccupied(checkTimeSlot)) {
        isAvailable = false
        break
      }
    }
    
    // Always add the slot, but mark availability status
    slots.push({
      time: timeSlot,
      available: isAvailable,
      duration: duration
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
