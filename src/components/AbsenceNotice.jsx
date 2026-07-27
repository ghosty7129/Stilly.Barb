import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useBookingStore from '../store/bookingStore'
import { getActiveAnnouncement } from '../services/vacationApi'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const formatDay = (dateKey) => {
  const [year, month, day] = dateKey.split('-')
  return `${day}.${month}.${year}`
}

/**
 * Shown once per session when the barber has scheduled leave *and* ticked
 * "announce". Silent otherwise.
 */
const AbsenceNotice = () => {
  const vacations = useBookingStore((state) => state.vacations)
  const loadVacations = useBookingStore((state) => state.loadVacations)
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    loadVacations()
  }, [loadVacations])

  const announcement = getActiveAnnouncement(vacations)

  useEffect(() => {
    if (!announcement) return
    const seenKey = `absenceNoticeSeen:${announcement.id}`
    setDismissed(Boolean(sessionStorage.getItem(seenKey)))
  }, [announcement])

  const close = () => {
    if (announcement) sessionStorage.setItem(`absenceNoticeSeen:${announcement.id}`, '1')
    setDismissed(true)
  }

  const isOpen = Boolean(announcement) && !dismissed

  const custom = language === 'en' ? announcement?.messageEn : announcement?.messageBg
  const body = custom && custom.trim()
    ? custom
    : t('absenceNoticeBody')
        .replace('{start}', announcement ? formatDay(announcement.startDate) : '')
        .replace('{end}', announcement ? formatDay(announcement.endDate) : '')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="absence-notice-title"
        >
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={close} />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="bg-ink px-7 py-6 text-white">
              <div className="flex items-center gap-3 text-white/45">
                <span className="h-1.5 w-1.5 rotate-45 bg-white/70" />
                <span className="eyebrow">{t('brandName')}</span>
              </div>
              <h2 id="absence-notice-title" className="section-title-sm mt-3 text-white">
                {t('absenceNoticeTitle')}
              </h2>
            </div>

            <div className="px-7 py-7">
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-neutral-600">
                {body}
              </p>

              {announcement && (
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-hairline bg-paper-soft px-4 py-3">
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                  <span className="font-display text-base font-bold text-ink">
                    {formatDay(announcement.startDate)} — {formatDay(announcement.endDate)}
                  </span>
                </div>
              )}

              <button type="button" onClick={close} className="btn-primary mt-7 w-full">
                {t('absenceUnderstood')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AbsenceNotice
