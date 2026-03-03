import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, addDays, isSameDay } from 'date-fns'
import useBookingStore from '../store/bookingStore'
import { SERVICES, ADDONS, formatTime } from '../services/appointmentService'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

// Simple password hashing for demo purposes
const hashPassword = (pwd) => {
  let hash = 0
  for (let i = 0; i < pwd.length; i++) {
    const char = pwd.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

// Admin credentials (hashed)
const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'admin'
const ADMIN_PASS_HASH = hashPassword(import.meta.env.VITE_ADMIN_PASSWORD || 'ChangeThisAdminPassword123!')

const Admin = () => {
  const { bookings, removeBooking, loadBookings } = useBookingStore()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loginError, setLoginError] = useState('')

  // Reload bookings from backend when admin page mounts or when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadBookings()
    }
  }, [isAuthenticated, loadBookings])

  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')
    
    if (username === ADMIN_USER && hashPassword(password) === ADMIN_PASS_HASH) {
      setIsAuthenticated(true)
      setUsername('')
      setPassword('')
    } else {
      setLoginError('Invalid username or password')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const result = await removeBooking(id)
      if (result.success) {
        // Reload bookings to reflect the change
        await loadBookings()
      } else {
        alert('Failed to delete appointment')
      }
    }
  }

  const getServiceName = (serviceId) => {
    return SERVICES.find(s => s.id === serviceId)?.name || 'Unknown'
  }

  const getAddonNames = (booking) => {
    if (Array.isArray(booking.addon_names) && booking.addon_names.length > 0) {
      return booking.addon_names
    }

    if (!Array.isArray(booking.addons)) {
      return []
    }

    return booking.addons
      .map(addonId => ADDONS.find(a => a.id === addonId)?.name)
      .filter(Boolean)
  }

  const getTotalPrice = (booking) => {
    const basePrice = SERVICES.find(s => s.id === booking.service)?.price || 0
    const addonsPrice = Array.isArray(booking.addons)
      ? booking.addons.reduce((sum, addonId) => {
          const addonPrice = ADDONS.find(a => a.id === addonId)?.price || 0
          return sum + addonPrice
        }, 0)
      : 0

    return basePrice + addonsPrice
  }

  // Generate dates for calendar (90 days range)
  const generateDates = () => {
    const dates = []
    for (let i = -30; i < 60; i++) {
      dates.push(addDays(new Date(), i))
    }
    return dates
  }

  // Get bookings for selected date
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd')
  const dateBookings = bookings.filter(b => b.date === selectedDateString)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-sm shadow-lg max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-sm flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-display text-3xl">S</span>
            </div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-neutral-600 mt-2">Enter your credentials</p>
          </div>
          
          {loginError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-accent-gold"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-accent-gold"
                placeholder="Enter password"
              />
            </div>
            
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
            
            <Link to="/" className="block text-center text-sm text-neutral-600 hover:text-accent-gold">
              Back to Home
            </Link>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white font-display text-2xl">S</span>
              </div>
              <span className="font-display text-2xl font-bold">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-sm font-medium hover:text-accent-gold transition-colors">
                View Site
              </Link>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">Reservations</h1>
            <p className="text-neutral-600 mb-8">
              Total bookings: <span className="font-semibold">{bookings.length}</span>
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-sm shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Select Date</h2>
                  <div className="grid grid-cols-7 gap-2">
                    {generateDates().map((date) => (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`p-2 rounded text-center text-sm font-medium transition-all ${
                          isSameDay(date, selectedDate)
                            ? 'bg-accent-gold text-white'
                            : 'bg-neutral-100 hover:bg-neutral-200'
                        }`}
                      >
                        <div className="text-xs">{format(date, 'EEE').slice(0, 1)}</div>
                        <div>{format(date, 'd')}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-accent-gold/10 rounded border border-accent-gold/30">
                    <p className="text-sm text-neutral-600">Selected:</p>
                    <p className="text-lg font-semibold">
                      {format(selectedDate, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reservations */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-sm shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Reservations for {format(selectedDate, 'MMM d, yyyy')}
                  </h2>
                  
                  {dateBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-neutral-600">No reservations for this date</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dateBookings.sort((a, b) => a.time.localeCompare(b.time)).map((booking, index) => {
                        const addonNames = getAddonNames(booking)

                        return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-2 border-neutral-200 rounded-sm p-6 hover:border-accent-gold/50 transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.name || booking.customer_name}</h3>
                              <p className="text-sm text-neutral-600">{booking.phone}</p>
                            </div>
                            <button
                              onClick={() => handleDelete(booking.id)}
                              className="w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                              title="Delete appointment"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-neutral-500 mb-1">Time</p>
                              <p className="font-semibold text-accent-gold">{formatTime(booking.time)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500 mb-1">Service</p>
                              <p className="font-semibold">{booking.service_name || getServiceName(booking.service)}</p>
                            </div>
                          </div>

                          {addonNames.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-neutral-500 mb-1">Add-services</p>
                              <p className="font-semibold">{addonNames.join(', ')}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-neutral-500 mb-1">Email</p>
                              <p className="text-sm">{booking.email}</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500 mb-1">Total Price</p>
                              <p className="text-lg font-bold text-accent-gold">
                                ${getTotalPrice(booking)}
                              </p>
                            </div>
                          </div>

                          {booking.notes && (
                            <div>
                              <p className="text-xs text-neutral-500 mb-1">Notes</p>
                              <p className="text-sm text-neutral-600">{booking.notes}</p>
                            </div>
                          )}
                        </motion.div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Admin
