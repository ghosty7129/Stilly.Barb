import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const LANGUAGES = [
  { id: 'bg', label: 'BG' },
  { id: 'en', label: 'EN' }
]

/**
 * Segmented BG/EN switch. `variant` picks the palette:
 * "light" for dark backgrounds (hero/header/footer), "dark" for paper.
 * `layoutGroup` must be unique per rendered instance so the sliding
 * indicator never animates between two copies of the toggle.
 */
const LanguageToggle = ({ variant = 'light', size = 'sm', layoutGroup = 'nav', className = '' }) => {
  const { language, changeLanguage } = useLanguage()
  const t = (key) => getTranslation(language, key)

  const isLight = variant === 'light'
  const isLarge = size === 'lg'

  return (
    <div
      role="group"
      aria-label={t('switchLanguage')}
      className={`relative inline-flex items-center rounded-full border p-0.5 ${
        isLight ? 'border-hairline-bright bg-white/5' : 'border-hairline bg-white'
      } ${className}`}
    >
      {LANGUAGES.map((item) => {
        const isActive = language === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => changeLanguage(item.id)}
            aria-pressed={isActive}
            aria-label={`${t('switchLanguage')}: ${item.label}`}
            className={`relative rounded-full font-semibold uppercase tracking-wider2 transition-colors duration-300 ease-editorial ${
              isLarge ? 'px-5 py-2.5 text-xs' : 'px-3 py-1.5 text-[10px]'
            } ${
              isActive
                ? isLight ? 'text-ink' : 'text-white'
                : isLight ? 'text-white/55 hover:text-white' : 'text-neutral-500 hover:text-ink'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={`language-pill-${layoutGroup}`}
                className={`absolute inset-0 rounded-full ${isLight ? 'bg-white' : 'bg-ink'}`}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default LanguageToggle
