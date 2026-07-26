import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const ease = [0.2, 0.7, 0.2, 1]

const Hero = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  const headingWords = t('heroHeading').split(' ')

  return (
    <section
      className="relative flex min-h-screen flex-col overflow-hidden bg-ink"
      style={{ minHeight: '100svh' }}
    >
      {/* Background image + cinematic grading */}
      <div className="grain absolute inset-0">
        <motion.img
          src={`${import.meta.env.VITE_API_BASE_URL}/images/background-image-mainpage/Unusual-8.jpg`}
          alt=""
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 1.8, ease }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-transparent to-transparent" />
      </div>

      {/* Content — copy is vertically centred in the hero (auto margins split the
          free space), while the hours rail stays anchored to the bottom. */}
      <div className="container-custom relative z-10 flex flex-1 flex-col pb-10 pt-24 sm:pb-14 sm:pt-28 xl:grid xl:grid-cols-12 xl:items-center xl:gap-12">
        <div className="my-auto xl:col-span-9 xl:my-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease }}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white/60"
          >
            <span className="h-1.5 w-1.5 rotate-45 bg-white/70" />
            <span className="eyebrow">{t('addressLine1')}</span>
            <span className="hidden h-px w-8 bg-white/25 sm:block" />
            <span className="eyebrow hidden sm:inline">Est. Unusual</span>
          </motion.div>

          <h1 className="display-hero mt-5 text-white sm:mt-6">
            {headingWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.09, duration: 0.9, ease }}
                className="block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease }}
            className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
          >
            <Link to="/book" className="btn-light w-full sm:w-auto">
              {t('bookNow')}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
              </svg>
            </Link>
            <button
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost-light w-full sm:w-auto"
            >
              {t('exploreSevices')}
            </button>
          </motion.div>
        </div>

        {/* Side rail: hours + socials */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease }}
          className="mt-10 xl:col-span-3 xl:mt-0"
        >
          <div className="border-t border-hairline-light pt-5">
            <p className="eyebrow text-white/40">{t('businessHours')}</p>
            <p className="mt-3 text-[13px] text-white/80 sm:text-sm">{t('mondayFriday')}</p>
            <p className="mt-1 text-[13px] text-white/80 sm:text-sm">{t('saturdaySunday')}</p>

            <div className="mt-5 flex items-center gap-3 sm:mt-6">
              <a
                href="https://www.instagram.com/stilly.barb/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-bright text-white transition-all duration-300 ease-editorial hover:-translate-y-0.5 hover:bg-white hover:text-ink"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8zm5-3.65a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@stilly.barb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-bright text-white transition-all duration-300 ease-editorial hover:-translate-y-0.5 hover:bg-white hover:text-ink"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.53.02c1.31-.02 2.63-.01 3.94-.02.08 1.53.63 3.01 1.6 4.2.97 1.19 2.32 2.04 3.9 2.43v3.03c-1.46-.05-2.92-.35-4.26-.94-.55-.25-1.07-.55-1.55-.91v6.61c-.06 1.36-.49 2.68-1.27 3.79a6.57 6.57 0 0 1-3.18 2.63 7.03 7.03 0 0 1-4.17.57 6.8 6.8 0 0 1-3.84-1.82 6.87 6.87 0 0 1-2.22-3.55 6.92 6.92 0 0 1 .05-4.14 6.89 6.89 0 0 1 2.35-3.31 6.88 6.88 0 0 1 3.84-1.29v3.14a3.99 3.99 0 0 0-2.46 1.04 3.88 3.88 0 0 0-1.14 2.4c-.06.91.24 1.84.84 2.53.6.69 1.49 1.12 2.41 1.21.91.09 1.84-.17 2.59-.67a3.98 3.98 0 0 0 1.59-2.12c.28-.86.25-1.78.25-2.67.01-4.09-.01-8.19.01-12.28z" />
                </svg>
              </a>

              <span className="ml-1 hidden text-[10px] uppercase tracking-eyebrow text-white/40 sm:inline">
                @stilly.barb
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
