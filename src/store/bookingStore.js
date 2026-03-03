import { create } from 'zustand'
import { appointmentAPI } from '../services/api'

// Database key for localStorage (fallback)
const DB_KEY = 'barber_reservations'

// Initialize database with existing data or empty array
const initializeDatabase = () => {
  const stored = localStorage.getItem(DB_KEY)
  return stored ? JSON.parse(stored) : []
}

// Save bookings to localStorage (fallback)
const saveToDatabase = (bookings) => {
  localStorage.setItem(DB_KEY, JSON.stringify(bookings))
}

const useBookingStore = create((set, get) => ({
  bookings: initializeDatabase(),
  loading: false,
  error: null,
  
  /**
   * Load bookings from backend API
   */
  loadBookings: async () => {
    set({ loading: true, error: null })
    try {
      const bookings = await appointmentAPI.getAllAppointments()
      set({ bookings, loading: false })
      // Also save to localStorage as backup
      saveToDatabase(bookings)
      return bookings
    } catch (error) {
      console.error('Failed to load bookings:', error)
      // Fallback to localStorage
      const localBookings = initializeDatabase()
      set({ bookings: localBookings, loading: false, error: error.message })
      return localBookings
    }
  },
  
  /**
   * Add a new booking with validation for max 2 reservations per month
   * @param {Object} booking - Booking object
   * @returns {Object} { success: boolean, message: string }
   */
  addBooking: async (booking) => {
    const state = get()
    const { name, phone, date } = booking
    
    // Check for maximum 2 reservations per month
    const bookingDate = new Date(date)
    const currentMonth = bookingDate.getFullYear() * 12 + bookingDate.getMonth()
    
    const bookingsThisMonth = state.bookings.filter(b => {
      const bDate = new Date(b.date)
      const bMonth = bDate.getFullYear() * 12 + bDate.getMonth()
      const bookingName = b.customer_name || b.name
      return bMonth === currentMonth && bookingName === name && b.phone === phone
    })
    
    if (bookingsThisMonth.length >= 2) {
      return {
        success: false,
        message: 'Maximum 2 reservations per month reached for this name and phone number'
      }
    }
    
    try {
      // Create booking via API
      const selectedAddons = Array.isArray(booking.addons) ? booking.addons : []
      const appointmentData = {
        customerName: name,
        email: booking.email,
        phone: phone,
        service: booking.service,
        serviceName: booking.serviceName,
        addons: selectedAddons,
        addonNames: booking.addonNames || [],
        date: date,
        time: booking.time,
        notes: booking.notes || ''
      }
      
      const newBooking = await appointmentAPI.createAppointment(appointmentData)
      
      // Update local state
      const updatedBookings = [...state.bookings, newBooking]
      set({ bookings: updatedBookings })
      saveToDatabase(updatedBookings)
      
      return {
        success: true,
        message: 'Reservation saved successfully. Confirmation email sent!',
        booking: newBooking
      }
    } catch (error) {
      console.error('Failed to create booking:', error)
      return {
        success: false,
        message: 'Failed to save booking. Please try again.'
      }
    }
  },
  
  removeBooking: async (id) => {
    try {
      await appointmentAPI.deleteAppointment(id)
      
      set((state) => {
        const updatedBookings = state.bookings.filter(b => b.id !== id)
        saveToDatabase(updatedBookings)
        return { bookings: updatedBookings }
      })
      
      return { success: true }
    } catch (error) {
      console.error('Failed to delete booking:', error)
      return { success: false, message: 'Failed to delete booking' }
    }
  },
  
  getBookingsByDate: (date) => {
    const state = get()
    return state.bookings.filter(b => b.date === date)
  },
  
  /**
   * Get bookings for a specific name and phone number in a given month
   */
  getBookingsByNameAndPhone: (name, phone, month) => {
    const state = get()
    return state.bookings.filter(b => {
      const bDate = new Date(b.date)
      const bMonth = bDate.getFullYear() * 12 + bDate.getMonth()
      return b.name === name && b.phone === phone && bMonth === month
    })
  },
  
  /**
   * Check if a time slot is booked
   */
  isTimeSlotBooked: (date, time) => {
    const state = get()
    return state.bookings.some(b => b.date === date && b.time === time)
  },
  
  /**
   * Get all bookings
   */
  getAllBookings: () => {
    return get().bookings
  },
  
  /**
   * Load bookings from database (useful when starting the app)
   */
  loadFromDatabase: () => {
    const stored = localStorage.getItem(DB_KEY)
    const bookings = stored ? JSON.parse(stored) : []
    set({ bookings })
    return bookings
  }
}))

export default useBookingStore
