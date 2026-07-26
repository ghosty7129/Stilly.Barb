import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfDay } from 'date-fns'
import useBookingStore from '../store/bookingStore'
import { SERVICES, ADDONS, formatTime, isValidBookingDate } from '../services/appointmentService'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const Admin = () => {
  const { bookings, removeBooking, loadBookings } = useBookingStore()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const apiUrl = import.meta.env.VITE_API_URL
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date())
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Reload bookings from backend when admin page mounts or when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadBookings()
    }
  }, [isAuthenticated, loadBookings])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setIsLoading(true)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
        setUsername('')
        setPassword('')
      } else {
        setLoginError(data.message || 'Invalid username or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
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

  const generateDatesForMonth = (monthDate) => {
    const start = startOfMonth(monthDate)
    const end = endOfMonth(monthDate)
    const today = startOfDay(new Date())

    const adjustedStart = isBefore(start, today) ? today : start

    let dates = eachDayOfInterval({ start: adjustedStart, end: end })

    const maxDate = startOfDay(addDays(new Date(), 90))
    dates = dates.filter(date => {
      const d = startOfDay(date)
      return isValidBookingDate(date) && !isBefore(d, today) && !isBefore(maxDate, d)
    })

    return dates
  }

  const goToNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))
  }

  const goToPreviousMonth = () => {
    const today = new Date()
    const newMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    if (newMonth.getFullYear() > today.getFullYear() || (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() >= today.getMonth())) {
      setCurrentMonthDate(newMonth)
    }
  }

  const canGoForward = () => {
    const maxDate = addDays(new Date(), 90)
    const nextMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 2, 1)
    return !isBefore(maxDate, nextMonth)
  }

  const canGoBackward = () => {
    const today = new Date()
    return !(currentMonthDate.getFullYear() === today.getFullYear() && currentMonthDate.getMonth() === today.getMonth())
  }

  // Get bookings for selected date
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd')
  const dateBookings = bookings.filter(b => b.date === selectedDateString)

  const handleBlockDay = async () => {
    if (!window.confirm('Block entire day? This will reserve all available slots for the selected date.')) return;

    try {
      const resp = await fetch(`${apiUrl}/appointments/block-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDateString })
      })

      const data = await resp.json()
      if (!resp.ok) {
        alert(data.error || 'Failed to block the day')
        return
      }

      // Reload bookings to reflect blocked slots
      await loadBookings()
      alert(`Day blocked — ${data.createdCount} slots reserved.`)
    } catch (err) {
      console.error('Block day error:', err)
      alert('Network error while blocking the day')
    }
  }

  const handleUnblockDay = async () => {
    if (!window.confirm('Unblock entire day? This will remove admin-blocked reservations for the selected date.')) return;

    try {
      const resp = await fetch(`${apiUrl}/appointments/unblock-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDateString })
      })

      const data = await resp.json()
      if (!resp.ok) {
        alert(data.error || 'Failed to unblock the day')
        return
      }

      await loadBookings()
      alert(`Unblocked ${data.removedCount} admin-blocked slots.`)
    } catch (err) {
      console.error('Unblock day error:', err)
      alert('Network error while unblocking the day')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 65%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative w-full max-w-md rounded-2xl border border-hairline-light bg-ink-soft p-8 sm:p-10"
        >
          <div className="mb-9">
            <img
              src={`${apiUrl}/images/logos/UNUSUAL STILLY BARB TRANSPARENT DESIGN 2.png`}
              alt="Unusual Stilly Barb"
              className="mb-8 h-12 w-auto object-contain"
            />
            <p className="eyebrow text-white/35">Restricted</p>
            <h1 className="section-title-sm mt-3 text-white">Admin Panel</h1>
            <p className="mt-3 text-sm text-white/50">Enter your credentials</p>
          </div>

          {loginError && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-7">
            <div>
              <label htmlFor="username" className="mb-2.5 block text-[10px] font-medium uppercase tracking-eyebrow text-white/40">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full border-0 border-b border-hairline-bright bg-transparent px-0 py-3 text-base text-white transition-colors placeholder:text-white/25 focus:border-white focus:outline-none disabled:opacity-50"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2.5 block text-[10px] font-medium uppercase tracking-eyebrow text-white/40">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full border-0 border-b border-hairline-bright bg-transparent px-0 py-3 pr-12 text-base text-white transition-colors placeholder:text-white/25 focus:border-white focus:outline-none disabled:opacity-50"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-light w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>

            <Link to="/" className="block text-center text-[10px] uppercase tracking-eyebrow text-white/40 transition-colors hover:text-white">
              Back to Home
            </Link>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper-soft">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-hairline-light bg-ink">
        <div className="container-custom">
          <div className="flex h-[68px] items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={`${apiUrl}/images/logos/UNUSUAL STILLY BARB TRANSPARENT DESIGN 2.png`}
                alt="Unusual Stilly Barb"
                className="h-9 w-auto object-contain"
              />
              <span className="hidden text-[10px] uppercase tracking-eyebrow text-white/45 sm:inline">
                Admin Panel
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-[10px] uppercase tracking-eyebrow text-white/60 transition-colors hover:text-white">
                View Site
              </Link>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="rounded-full border border-hairline-bright px-4 py-2 text-[10px] uppercase tracking-eyebrow text-white transition-colors hover:bg-white hover:text-ink"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-10 sm:py-14">
        <div className="container-custom max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow text-neutral-400">Overview</span>
                <h1 className="section-title mt-3 text-ink">Reservations</h1>
              </div>
              <div className="rounded-xl border border-hairline bg-white px-5 py-3">
                <p className="eyebrow text-neutral-400">Total bookings</p>
                <p className="mt-1 font-display text-2xl font-bold text-ink">{bookings.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Calendar */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl border border-hairline bg-white p-4 shadow-card sm:p-6">
                  <h2 className="eyebrow mb-5 text-neutral-400">Select Date</h2>

                  <div className="mb-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={goToPreviousMonth}
                      disabled={!canGoBackward()}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <h3 className="flex-1 text-center font-display text-base font-bold uppercase tracking-tight text-ink">
                      {format(currentMonthDate, 'MMMM yyyy')}
                    </h3>

                    <button
                      type="button"
                      onClick={goToNextMonth}
                      disabled={!canGoForward()}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {generateDatesForMonth(currentMonthDate).map((date) => (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`rounded-lg py-2 text-center text-sm font-semibold transition-all duration-300 ${
                          isSameDay(date, selectedDate)
                            ? 'bg-ink text-white'
                            : 'border border-hairline bg-white text-ink hover:border-ink'
                        }`}
                      >
                        <div className={`text-[9px] uppercase tracking-wider2 ${
                          isSameDay(date, selectedDate) ? 'text-white/55' : 'text-neutral-400'
                        }`}>{format(date, 'EEE').slice(0, 1)}</div>
                        <div className="font-display">{format(date, 'd')}</div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl bg-ink p-5 text-white">
                    <p className="eyebrow text-white/40">Selected</p>
                    <p className="mt-2 font-display text-lg font-bold">
                      {format(selectedDate, 'MMM d, yyyy')}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleBlockDay}
                        className="rounded-full border border-hairline-bright px-4 py-2 text-[10px] uppercase tracking-eyebrow text-white transition-colors hover:bg-white hover:text-ink"
                      >
                        Make Day Off
                      </button>
                      <button
                        type="button"
                        onClick={handleUnblockDay}
                        className="rounded-full border border-hairline-bright px-4 py-2 text-[10px] uppercase tracking-eyebrow text-white transition-colors hover:bg-white hover:text-ink"
                      >
                        Unblock Day
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSelectedDate(new Date()); loadBookings() }}
                        className="px-2 py-2 text-[10px] uppercase tracking-eyebrow text-white/50 transition-colors hover:text-white"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reservations */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-hairline bg-white p-4 shadow-card sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rotate-45 bg-ink" />
                    <h2 className="eyebrow text-neutral-500">
                      Reservations for {format(selectedDate, 'MMM d, yyyy')}
                    </h2>
                  </div>

                  {dateBookings.length === 0 ? (
                    <div className="flex flex-col items-center py-16 text-center">
                      <img
                        src={`${apiUrl}/images/logos/UNUSUAL STILLY BARB BLACK.png`}
                        alt="Unusual Stilly Barb"
                        className="mb-5 h-12 w-auto object-contain opacity-25"
                      />
                      <p className="text-sm text-neutral-400">No reservations for this date</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dateBookings.sort((a, b) => a.time.localeCompare(b.time)).map((booking, index) => {
                        const addonNames = getAddonNames(booking)

                        return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.06 }}
                          className="group rounded-xl border border-hairline p-5 transition-all duration-300 ease-editorial hover:border-ink sm:p-6"
                        >
                          <div className="mb-5 flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <span className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-ink text-white">
                                <span className="font-display text-sm font-bold leading-none">
                                  {formatTime(booking.time)}
                                </span>
                              </span>
                              <div className="min-w-0">
                                <h3 className="font-display text-lg font-bold leading-tight text-ink">
                                  {booking.name || booking.customer_name}
                                </h3>
                                <p className="mt-0.5 text-sm text-neutral-500">{booking.phone}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDelete(booking.id)}
                              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-neutral-400 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white"
                              title="Delete appointment"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <dl className="grid grid-cols-1 gap-4 border-t border-hairline pt-4 sm:grid-cols-2">
                            <div>
                              <dt className="text-[10px] uppercase tracking-eyebrow text-neutral-400">Service</dt>
                              <dd className="mt-1 font-medium text-ink">{booking.service_name || getServiceName(booking.service)}</dd>
                            </div>
                            <div>
                              <dt className="text-[10px] uppercase tracking-eyebrow text-neutral-400">Total Price</dt>
                              <dd className="mt-1 font-display text-lg font-bold text-ink">
                                ${getTotalPrice(booking)}
                              </dd>
                            </div>

                            {addonNames.length > 0 && (
                              <div className="sm:col-span-2">
                                <dt className="text-[10px] uppercase tracking-eyebrow text-neutral-400">Add-services</dt>
                                <dd className="mt-1 font-medium text-ink">{addonNames.join(', ')}</dd>
                              </div>
                            )}

                            <div className="sm:col-span-2">
                              <dt className="text-[10px] uppercase tracking-eyebrow text-neutral-400">Email</dt>
                              <dd className="mt-1 break-words text-sm text-neutral-600">{booking.email}</dd>
                            </div>

                            {booking.notes && (
                              <div className="sm:col-span-2">
                                <dt className="text-[10px] uppercase tracking-eyebrow text-neutral-400">Notes</dt>
                                <dd className="mt-1 text-sm text-neutral-600">{booking.notes}</dd>
                              </div>
                            )}
                          </dl>
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
