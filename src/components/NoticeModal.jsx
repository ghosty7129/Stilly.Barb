import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

/**
 * The centred notice dialog. Used for whatever the barber wants read before
 * anything else — a period of leave, or a plain message.
 */
const NoticeModal = ({ title, body, badge, actionLabel, onClose }) => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-notice-title"
    >
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />

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
          <h2 id="site-notice-title" className="section-title-sm mt-3 text-white">
            {title}
          </h2>
        </div>

        <div className="px-7 py-7">
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-neutral-600">
            {body}
          </p>

          {badge && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-hairline bg-paper-soft px-4 py-3">
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
              <span className="font-display text-base font-bold text-ink">{badge}</span>
            </div>
          )}

          <button type="button" onClick={onClose} className="btn-primary mt-7 w-full">
            {actionLabel || t('absenceUnderstood')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default NoticeModal
