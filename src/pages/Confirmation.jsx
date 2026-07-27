import { Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { SERVICES, ADDONS, formatTime } from '../services/appointmentService'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation, getServiceLabel } from '../i18n/translations'

const DetailRow = ({ label, children, icon }) => (
  <div className="flex items-start gap-4 border-t border-hairline py-5 first:border-t-0 first:pt-0">
    <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-neutral-400">
      {icon}
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-medium uppercase tracking-eyebrow text-neutral-400">{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  </div>
)

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
      <div className="flex min-h-screen items-center justify-center bg-paper-soft px-6">
        <div className="text-center">
          <p className="section-title-sm mb-8 text-ink">{t('noBookingFound')}</p>
          <Link to="/book" className="btn-primary">
            {t('bookNow')}
          </Link>
        </div>
      </div>
    )
  }

  const service = SERVICES.find(s => s.id === booking.service)
  const bookingName = booking.name || booking.customer_name
  const storedServiceName = booking.service_name || service?.name || booking.service
  const resolvedServiceName = getServiceLabel(language, booking.service, storedServiceName)
  const resolvedAddons = Array.isArray(booking.addons) && booking.addons.length > 0
    ? booking.addons
        .map(addonId => {
          const addon = ADDONS.find(a => a.id === addonId)
          return addon ? getServiceLabel(language, addon.id, addon.name) : null
        })
        .filter(Boolean)
    : (booking.addon_names || [])

  return (
    <div ref={topRef} className="flex min-h-screen items-start justify-center bg-paper-soft py-10 pt-28 sm:py-16 sm:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        className="mx-4 w-full max-w-3xl sm:mx-6"
      >
        <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
          {/* Success Header */}
          <div className="relative overflow-hidden bg-ink px-6 py-10 text-center sm:px-12 sm:py-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-60 blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)' }}
            />

            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 14 }}
              className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white"
            >
              <svg className="h-7 w-7 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <p className="eyebrow relative text-white/40">{t('brandName')}</p>
            <h1 className="section-title-sm relative mt-4 text-white">{t('confirmationTitle')}</h1>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60">
              {t('confirmationMessage')}
            </p>
          </div>

          {/* Booking Details */}
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rotate-45 bg-ink" />
              <h2 className="eyebrow text-neutral-500">{t('appointmentDetails')}</h2>
            </div>

            <div>
              <DetailRow
                label={t('fullName')}
                icon={(
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              >
                <p className="break-words font-display text-lg font-semibold text-ink">{bookingName}</p>
              </DetailRow>

              <DetailRow
                label={t('email')}
                icon={(
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              >
                <p className="break-words text-base font-medium text-ink">{booking.email}</p>
              </DetailRow>

              <DetailRow
                label={t('phoneNumber')}
                icon={(
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                )}
              >
                <p className="break-words text-base font-medium text-ink">{booking.phone}</p>
              </DetailRow>

              <DetailRow
                label={t('selectService')}
                icon={(
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              >
                <p className="break-words font-display text-lg font-semibold text-ink">{resolvedServiceName}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider2 text-neutral-400">
                  {service?.duration} {t('minutes')} • €{service?.price}
                </p>
              </DetailRow>

              {resolvedAddons.length > 0 && (
                <DetailRow
                  label={t('addons')}
                  icon={(
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 5H7a2 2 0 00-2 2v2m0 6v2a2 2 0 002 2h2m6 0h2a2 2 0 002-2v-2m0-6V7a2 2 0 00-2-2h-2" />
                    </svg>
                  )}
                >
                  <p className="break-words text-base font-medium text-ink">{resolvedAddons.join(', ')}</p>
                </DetailRow>
              )}

              {booking.notes && (
                <DetailRow
                  label={t('additionalNotes')}
                  icon={(
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                >
                  <p className="break-words text-base text-neutral-600">{booking.notes}</p>
                </DetailRow>
              )}
            </div>

            {/* Date & time highlight */}
            <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow text-white/40">{t('dateTime')}</p>
                <p className="mt-3 font-display text-xl font-bold leading-tight sm:text-2xl">
                  {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <span className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {formatTime(booking.time)}
                </span>
              </div>
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
                <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-hairline bg-paper-soft px-6 py-5">
                  <p className="eyebrow text-neutral-500">{t('totalPrice')}</p>
                  <p className="font-display text-2xl font-bold text-ink">€{totalPrice.toFixed(2)}</p>
                </div>
              )
            })()}

            {/* Additional Info */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-hairline bg-white px-5 py-4">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink text-white">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <p className="text-sm leading-relaxed text-neutral-600">
                <strong className="font-semibold text-ink">{t('noteLabel')}</strong>{' '}
                {t('confirmationEmailNote')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link to="/" className="btn-primary w-full">
                {t('backToHome')}
              </Link>
              <Link to="/book" className="btn-secondary w-full">
                {t('backToBooking')}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Confirmation
