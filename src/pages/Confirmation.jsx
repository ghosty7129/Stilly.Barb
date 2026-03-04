import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { SERVICES, ADDONS, formatTime } from '../services/appointmentService'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const Confirmation = () => {
  const location = useLocation()
  const booking = location.state?.booking
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-xl mb-4">No booking information found</p>
          <Link to="/book" className="btn-primary">
            {t('bookNow')}
          </Link>
        </div>
      </div>
    )
  }

  const service = SERVICES.find(s => s.id === booking.service)
  const bookingName = booking.name || booking.customer_name
  const resolvedServiceName = booking.service_name || service?.name || booking.service
  const resolvedAddons = (booking.addon_names && booking.addon_names.length > 0)
    ? booking.addon_names
    : (Array.isArray(booking.addons)
      ? booking.addons
          .map(addonId => ADDONS.find(a => a.id === addonId)?.name)
          .filter(Boolean)
      : [])

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full mx-6"
      >
        <div className="bg-white rounded-sm shadow-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-accent-gold to-accent-silver p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg className="w-10 h-10 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">{t('confirmationTitle')}</h1>
            <p className="text-white/90">{t('confirmationMessage')}</p>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6">{t('appointmentDetails')}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-sm">
                <div className="w-10 h-10 bg-accent-gold/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">{t('fullName')}</p>
                  <p className="font-semibold">{bookingName}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-sm">
                <div className="w-10 h-10 bg-accent-gold/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">{t('email')}</p>
                  <p className="font-semibold">{booking.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-sm">
                <div className="w-10 h-10 bg-accent-gold/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">{t('phoneNumber')}</p>
                  <p className="font-semibold">{booking.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-sm">
                <div className="w-10 h-10 bg-accent-gold/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">{t('selectService')}</p>
                  <p className="font-semibold">{resolvedServiceName}</p>
                  <p className="text-sm text-neutral-500">{service?.duration} minutes • €{service?.price}</p>
                </div>
              </div>

              {resolvedAddons.length > 0 && (
                <div className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-sm">
                  <div className="w-10 h-10 bg-accent-gold/10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v2m0 6v2a2 2 0 002 2h2m6 0h2a2 2 0 002-2v-2m0-6V7a2 2 0 00-2-2h-2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Add-services</p>
                    <p className="font-semibold">{resolvedAddons.join(', ')}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-4 p-4 bg-accent-gold/10 rounded-sm border-2 border-accent-gold">
                <div className="w-10 h-10 bg-accent-gold rounded-sm flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Date & Time</p>
                  <p className="font-semibold text-lg">
                    {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-accent-gold font-semibold">{formatTime(booking.time)}</p>
                </div>
              </div>

              {booking.notes && (
                <div className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-sm">
                  <div className="w-10 h-10 bg-accent-gold/10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">{t('additionalNotes')}</p>
                    <p className="font-medium">{booking.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <Link to="/" className="btn-primary w-full text-center block">
                Back to Home
              </Link>
              <Link to="/book" className="btn-secondary w-full text-center block">
                {t('backToBooking')}
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-sm">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> A confirmation email has been sent to {booking.email}. 
                Please arrive 5 minutes early for your appointment.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Confirmation
