import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const Hero = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary">
      {/* Background Video/Image */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-10" />
        <img src={`${import.meta.env.VITE_API_URL}/images/background-image-mainpage/Unusual-8.jpg`} alt="Hero background" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)]"
            style={{
              WebkitTextStroke: '1.5px rgba(209, 213, 219, 0.7)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            {t('heroHeading')}
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Link
              to="/book"
              className="w-full sm:w-80 bg-white text-primary px-12 py-5 rounded-sm font-semibold text-xl text-center hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {t('bookNow')}
            </Link>
            <button
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-80 border-2 border-white/70 bg-white/10 backdrop-blur-sm text-white px-12 py-5 rounded-sm font-semibold text-xl text-center hover:bg-white/20 hover:text-primary transition-all duration-300"
            >
              {t('exploreSevices')}
            </button>
          </motion.div>

          <motion.div
            className="mt-8 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <a
              href="https://www.instagram.com/stilly.barb/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-14 h-14 bg-white/10 border border-white/35 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-white hover:text-primary hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8zm5-3.65a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
              </svg>
            </a>

            <a
              href="https://www.tiktok.com/@stilly.barb"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-14 h-14 bg-white/10 border border-white/35 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-white hover:text-primary hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.53.02c1.31-.02 2.63-.01 3.94-.02.08 1.53.63 3.01 1.6 4.2.97 1.19 2.32 2.04 3.9 2.43v3.03c-1.46-.05-2.92-.35-4.26-.94-.55-.25-1.07-.55-1.55-.91v6.61c-.06 1.36-.49 2.68-1.27 3.79a6.57 6.57 0 0 1-3.18 2.63 7.03 7.03 0 0 1-4.17.57 6.8 6.8 0 0 1-3.84-1.82 6.87 6.87 0 0 1-2.22-3.55 6.92 6.92 0 0 1 .05-4.14 6.89 6.89 0 0 1 2.35-3.31 6.88 6.88 0 0 1 3.84-1.29v3.14a3.99 3.99 0 0 0-2.46 1.04 3.88 3.88 0 0 0-1.14 2.4c-.06.91.24 1.84.84 2.53.6.69 1.49 1.12 2.41 1.21.91.09 1.84-.17 2.59-.67a3.98 3.98 0 0 0 1.59-2.12c.28-.86.25-1.78.25-2.67.01-4.09-.01-8.19.01-12.28z" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
