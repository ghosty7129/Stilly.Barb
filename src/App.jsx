import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Confirmation from './pages/Confirmation'
import Admin from './pages/Admin'
import { analytics } from './services/analytics'
import useBookingStore from './store/bookingStore'

function App() {
  const location = useLocation()
  const loadBookings = useBookingStore(state => state.loadBookings)

  // Track page views
  useEffect(() => {
    const pageTitles = {
      '/': 'Home',
      '/book': 'Booking',
      '/confirmation': 'Confirmation',
      '/admin': 'Admin'
    }
    analytics.trackPageView(location.pathname, pageTitles[location.pathname] || 'Unknown')
  }, [location])

  // Load bookings from backend on app start
  useEffect(() => {
    loadBookings()
  }, [])

  return (
    <div className="App min-h-screen w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App
