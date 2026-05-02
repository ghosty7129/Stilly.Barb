import { Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { SERVICES, ADDONS, formatTime } from '../services/appointmentService'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const Confirmation = () => {
  const location = useLocation()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const topRef = useRef(null)

  const booking = useMemo(() => {
    if (location.state?.booking) {
      return location.state.booking
    }

    try {
      const storedBooking = sessionStorage.getItem('latestBooking')
      return storedBooking ? JSON.parse(storedBooking) : null
    } catch (error) {
      return null
    }
  }, [location.state])
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const scrollTimer = setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'auto', block: 'start' })
      }
    }, 50)

    return () => clearTimeout(scrollTimer)
  }, [])

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-xl mb-4">{t('noBookingFound')}</p>
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
    <div ref={topRef} className="min-h-screen bg-neutral-50 flex items-start justify-center py-8 sm:py-16 pt-28 sm:pt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-3xl mx-4 sm:mx-6"
      >
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-accent-gold to-accent-silver px-6 py-7 text-center text-white sm:px-10 sm:py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg sm:h-20 sm:w-20"
            >
              <svg className="h-8 w-8 text-accent-gold sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('confirmationTitle')}</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
              {t('confirmationMessage')}
            </p>
          </div>

          {/* Booking Details */}
          <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">{t('appointmentDetails')}</h2>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 shadow-sm">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white text-accent-gold shadow-sm ring-1 ring-neutral-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t('fullName')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 shadow-sm">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white text-accent-gold shadow-sm ring-1 ring-neutral-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t('email')}</p>
                  <p className="mt-1 break-words text-base font-semibold text-neutral-900">{booking.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 shadow-sm">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white text-accent-gold shadow-sm ring-1 ring-neutral-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t('phoneNumber')}</p>
                  <p className="mt-1 break-words text-base font-semibold text-neutral-900">{booking.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 shadow-sm">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white text-accent-gold shadow-sm ring-1 ring-neutral-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t('selectService')}</p>
                  <p className="mt-1 break-words text-base font-semibold text-neutral-900">{resolvedServiceName}</p>
                  <p className="mt-1 text-sm text-neutral-500">{service?.duration} minutes • €{service?.price}</p>
                </div>
              </div>

              {resolvedAddons.length > 0 && (
                <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 shadow-sm">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white text-accent-gold shadow-sm ring-1 ring-neutral-200">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v2m0 6v2a2 2 0 002 2h2m6 0h2a2 2 0 002-2v-2m0-6V7a2 2 0 00-2-2h-2" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t('addons')}</p>
                    <p className="mt-1 break-words text-base font-semibold text-neutral-900">{resolvedAddons.join(', ')}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 rounded-xl border border-accent-gold/30 bg-accent-gold/10 p-4 shadow-sm">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-accent-gold text-white shadow-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t('dateTime')}</p>
                  <p className="mt-1 text-base font-semibold text-neutral-900">{format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}</p>
                  <p className="text-sm font-semibold text-accent-gold">{formatTime(booking.time)}</p>
                </div>
              </div>

              {booking.notes && (
                <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 shadow-sm">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white text-accent-gold shadow-sm ring-1 ring-neutral-200">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t('additionalNotes')}</p>
                    <p className="mt-1 break-words text-base font-medium text-neutral-900">{booking.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Total Price */}
            {(() => {
              const servicePrice = service?.price || 0
              const addonPrices = (Array.isArray(booking.addons) ? booking.addons : []).reduce((sum, addonId) => {
                const addon = ADDONS.find(a => a.id === addonId)
                return sum + (addon?.price || 0)
              }, 0)
              const totalPrice = servicePrice + addonPrices
              return (
                <div className="mt-2 rounded-xl border border-accent-gold/30 bg-gradient-to-r from-accent-gold/15 to-accent-silver/15 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-semibold text-neutral-800 sm:text-lg">{t('totalPrice')}:</p>
                    <p className="text-2xl font-bold text-accent-gold">€{totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              )
            })()}

            {/* Action Buttons */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link to="/" className="btn-primary w-full text-center block">
                {t('backToHome')}
              </Link>
              <Link to="/book" className="btn-secondary w-full text-center block">
                {t('backToBooking')}
              </Link>
            </div>

            {/* Additional Info */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm leading-relaxed text-blue-800">
                <strong>{language === 'bg' ? 'Бележка:' : 'Note:'}</strong>{' '}
                {t('confirmationEmailNote')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Confirmation
