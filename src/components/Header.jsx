import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollOpacity, setScrollOpacity] = useState(1)
  const location = useLocation()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight // Hero is h-screen
      const scrollPosition = window.scrollY
      
      // Calculate opacity: starts at 1 (opaque), becomes 0 when reaching bottom of hero
      // Transition happens from 0 to heroHeight scroll
      const opacity = Math.max(1 - scrollPosition / heroHeight, 0)
      setScrollOpacity(opacity)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      style={{
        backgroundColor: `rgba(128, 126, 126, ${0.78 * scrollOpacity + 0.12})`,
        backdropFilter: `blur(${8 - scrollOpacity * 8}px)`,
        boxShadow: `0 1px 2px rgba(0, 0, 0, ${0.08 * scrollOpacity})`
      }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 py-2 sm:py-0">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={`${apiUrl}/images/logos/UNUSUAL STILLY BARB TRANSPARENT DESIGN 2.png`}
              alt={t('brandName')}
              className="h-14 sm:h-16 w-auto max-w-[150px] object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <button
              onClick={() => scrollToSection('services')}
              className="px-2 py-1.5 rounded-sm text-sm font-semibold tracking-wide text-neutral-100 hover:bg-white/10 transition-colors"
            >
              {t('services')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-2 py-1.5 rounded-sm text-sm font-semibold tracking-wide text-neutral-100 hover:bg-white/10 transition-colors"
            >
              {t('about')}
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="px-2 py-1.5 rounded-sm text-sm font-semibold tracking-wide text-neutral-100 hover:bg-white/10 transition-colors"
            >
              {t('gallery')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-2 py-1.5 rounded-sm text-sm font-semibold tracking-wide text-neutral-100 hover:bg-white/10 transition-colors"
            >
              {t('contact')}
            </button>
            
            {/* Language Toggle removed temporarily */}
            
            <Link to="/book" className="bg-white text-neutral-600 px-6 py-3 rounded-md font-semibold tracking-wide shadow-sm border border-neutral-300 transition-colors hover:bg-neutral-50 hover:text-neutral-700">
              {t('bookNow')}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              className="relative w-10 h-10 -mr-1 rounded-sm bg-white/25 border border-white/20 flex items-center justify-center"
            >
              <motion.span
                animate={isMenuOpen ? { y: 0, rotate: 45 } : { y: -10, rotate: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute h-[2px] w-6 bg-neutral-100"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute h-[2px] w-6 bg-neutral-100"
              />
              <motion.span
                animate={isMenuOpen ? { y: 0, rotate: -45 } : { y: 10, rotate: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute h-[2px] w-6 bg-neutral-100"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden bg-[rgba(128,126,126,0.92)] border-t border-neutral-300"
          >
            <nav className="container-custom py-6 flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('services')}
                className="text-lg font-semibold tracking-wide text-left text-white hover:text-white/90 transition-colors"
              >
                {t('services')}
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-lg font-semibold tracking-wide text-left text-white hover:text-white/90 transition-colors"
              >
                {t('about')}
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-lg font-semibold tracking-wide text-left text-white hover:text-white/90 transition-colors"
              >
                {t('gallery')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-lg font-semibold tracking-wide text-left text-white hover:text-white/90 transition-colors"
              >
                {t('contact')}
              </button>
              <Link to="/book" className="bg-white text-neutral-600 px-6 py-3 rounded-md font-semibold tracking-wide text-center shadow-sm border border-neutral-300 transition-colors hover:bg-neutral-50 hover:text-neutral-700">
                {t('bookNow')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
