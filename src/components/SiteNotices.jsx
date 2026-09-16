import { useState, useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useBookingStore from '../store/bookingStore'
import { getActiveAnnouncement } from '../services/vacationApi'
import { getLiveAnnouncements, announcementText } from '../services/announcementApi'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'
import NoticeModal from './NoticeModal'

const SEEN_PREFIX = 'siteNoticeSeen:'

const formatDay = (dateKey) => {
  const [year, month, day] = dateKey.split('-')
  return `${day}.${month}.${year}`
}

// sessionStorage throws in some privacy modes — a notice that cannot remember
// being closed is better than a page that will not render.
const wasSeen = (key) => {
  try {
    return Boolean(sessionStorage.getItem(SEEN_PREFIX + key))
  } catch {
    return false
  }
}

const markSeen = (key) => {
  try {
    sessionStorage.setItem(SEEN_PREFIX + key, '1')
  } catch {
    /* ignore */
  }
}

/**
 * Everything the barber wants visitors to read: the optional leave notice and
 * any standalone messages. Popups show one at a time; banners stack along the
 * bottom of the page. Both stay closed for the rest of the session.
 */
const SiteNotices = () => {
  const vacations = useBookingStore((state) => state.vacations)
  const loadVacations = useBookingStore((state) => state.loadVacations)
  const announcements = useBookingStore((state) => state.announcements)
  const loadAnnouncements = useBookingStore((state) => state.loadAnnouncements)

  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  const [dismissed, setDismissed] = useState(() => new Set())
  const bannerStack = useRef(null)

  useEffect(() => {
    loadVacations()
    loadAnnouncements()
  }, [loadVacations, loadAnnouncements])

  // The leave notice, only when the barber ticked "announce".
  const vacationNotice = useMemo(() => {
    const announcement = getActiveAnnouncement(vacations)
    if (!announcement) return null

    const custom = language === 'en' ? announcement.messageEn : announcement.messageBg

    return {
      key: `vacation:${announcement.id}`,
      style: 'popup',
      title: t('absenceNoticeTitle'),
      body: custom && custom.trim()
        ? custom
        : t('absenceNoticeBody')
            .replace('{start}', formatDay(announcement.startDate))
            .replace('{end}', formatDay(announcement.endDate)),
      badge: `${formatDay(announcement.startDate)} — ${formatDay(announcement.endDate)}`
    }
  }, [vacations, language])

  const messageNotices = useMemo(() => (
    getLiveAnnouncements(announcements)
      .map((announcement) => {
        const { title, body } = announcementText(announcement, language)
        return {
          key: `message:${announcement.id}`,
          style: announcement.style === 'popup' ? 'popup' : 'banner',
          title: title || t('noticeDefaultTitle'),
          body
        }
      })
      .filter((notice) => notice.body)
  ), [announcements, language])

  const notices = useMemo(
    () => (vacationNotice ? [vacationNotice, ...messageNotices] : messageNotices),
    [vacationNotice, messageNotices]
  )

  // Re-seed from the session whenever the set of notices changes, so a message
  // closed before a reload stays closed.
  const noticeKeys = notices.map((notice) => notice.key).join('|')
  useEffect(() => {
    setDismissed(new Set(notices.filter((notice) => wasSeen(notice.key)).map((notice) => notice.key)))
  }, [noticeKeys])

  const close = (key) => {
    markSeen(key)
    setDismissed((current) => new Set(current).add(key))
  }

  const visible = notices.filter((notice) => !dismissed.has(notice.key))
  const popup = visible.find((notice) => notice.style === 'popup')
  const banners = visible.filter((notice) => notice.style === 'banner')

  // The banners are fixed to the bottom, so on a phone they would sit on top of
  // whatever ends the page — the booking form's submit button, for one. Pad the
  // page by however tall the stack actually is.
  useEffect(() => {
    const node = bannerStack.current
    if (!node) {
      document.body.style.paddingBottom = ''
      return
    }

    const apply = () => {
      document.body.style.paddingBottom = `${node.offsetHeight}px`
    }

    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(node)

    return () => {
      observer.disconnect()
      document.body.style.paddingBottom = ''
    }
  }, [banners.length])

  return (
    <>
      <AnimatePresence>
        {popup && (
          <NoticeModal
            key={popup.key}
            title={popup.title}
            body={popup.body}
            badge={popup.badge}
            onClose={() => close(popup.key)}
          />
        )}
      </AnimatePresence>

      {/* Banners sit along the bottom so they never collide with the header. */}
      {banners.length > 0 && (
        <div ref={bannerStack} className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col gap-2 p-3 sm:p-5">
          <AnimatePresence initial={false}>
            {banners.map((notice) => (
              <motion.div
                key={notice.key}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                className="pointer-events-auto mx-auto flex w-full max-w-2xl items-start gap-3 rounded-2xl bg-ink px-4 py-3.5 text-white shadow-lift sm:gap-4 sm:px-5 sm:py-4"
                role="status"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rotate-45 bg-white/70" />

                <div className="min-w-0 flex-1">
                  <p className="eyebrow break-words text-white/45">{notice.title}</p>
                  <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-white/90">
                    {notice.body}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => close(notice.key)}
                  aria-label={t('noticeDismiss')}
                  title={t('noticeDismiss')}
                  className="-mr-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}

export default SiteNotices
