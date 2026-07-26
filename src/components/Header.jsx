import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const apiUrl = import.meta.env.VITE_API_URL

  // Only the home page has a full-bleed dark hero to float over.
  const isHome = location.pathname === '/'
  const isSolid = !isHome || isScrolled || isMenuOpen

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  const scrollToSection = (id) => {
    setIsMenuOpen(false)

    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      return
    }

    // Section lives on the home page — go there first, then scroll to it.
    navigate('/')
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 350)
  }

  const navItems = [
    { id: 'services', label: t('services') },
    { id: 'about', label: t('about') },
    { id: 'gallery', label: t('gallery') },
    { id: 'contact', label: t('contact') }
  ]

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-editorial ${
          isSolid
            ? 'border-b border-hairline-light bg-ink/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className={`flex items-center justify-between transition-all duration-500 ${isSolid ? 'h-[68px]' : 'h-20 sm:h-24'}`}>
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3" aria-label={t('brandName')}>
              <img
                src={`${apiUrl}/images/logos/UNUSUAL STILLY BARB TRANSPARENT DESIGN 2.png`}
                alt={t('brandName')}
                className={`w-auto object-contain transition-all duration-500 group-hover:opacity-80 ${
                  isSolid ? 'h-10 max-w-[110px]' : 'h-12 max-w-[140px] sm:h-14'
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-9 md:flex">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="group relative py-2 text-[11px] font-medium uppercase tracking-eyebrow text-white/70 transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 ease-editorial group-hover:w-full" />
                </button>
              ))}

              <Link
                to="/book"
                className="rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-eyebrow text-ink transition-all duration-300 ease-editorial hover:-translate-y-0.5 hover:bg-white/90"
              >
                {t('bookNow')}
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-hairline-bright text-white transition-colors duration-300 hover:bg-white/10 md:hidden"
            >
              <motion.span
                animate={isMenuOpen ? { y: 0, rotate: 45 } : { y: -4, rotate: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute h-[1.5px] w-5 bg-white"
              />
              <motion.span
                animate={isMenuOpen ? { y: 0, rotate: -45 } : { y: 4, rotate: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute h-[1.5px] w-5 bg-white"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink md:hidden"
          >
            <div className="container-custom flex h-full flex-col justify-between pb-12 pt-32">
              <nav className="flex flex-col">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * index + 0.05, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                    onClick={() => scrollToSection(item.id)}
                    className="group flex items-baseline justify-between border-b border-hairline-light py-5 text-left"
                  >
                    <span className="font-display text-3xl font-bold tracking-tight text-white">
                      {item.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-eyebrow text-white/35">
                      0{index + 1}
                    </span>
                  </motion.button>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-6"
              >
                <Link
                  to="/book"
                  className="flex w-full items-center justify-center rounded-full bg-white px-8 py-4 text-[12px] font-semibold uppercase tracking-eyebrow text-ink"
                >
                  {t('bookNow')}
                </Link>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-eyebrow text-white/40">
                  <span>{t('addressLine1')}</span>
                  <span>@stilly.barb</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
