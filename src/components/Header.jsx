import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollOpacity, setScrollOpacity] = useState(1)
  const location = useLocation()
  const { language, toggleLanguage } = useLanguage()
  const t = (key) => getTranslation(language, key)

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
        backgroundColor: `rgba(255, 255, 255, ${0.9 * scrollOpacity})`,
        backdropFilter: `blur(${8 - scrollOpacity * 8}px)`,
        boxShadow: `0 1px 3px rgba(0, 0, 0, ${0.1 * scrollOpacity})`
      }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-display text-2xl">S</span>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">
              stilly.barb
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('services')}
              className="text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              {t('services')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              {t('about')}
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              {t('gallery')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              {t('contact')}
            </button>
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-sm bg-accent-gold/10 text-primary font-semibold hover:bg-accent-gold/20 transition-colors text-sm"
            >
              {language === 'en' ? 'БГ' : 'EN'}
            </button>
            
            <Link to="/book" className="btn-primary">
              {t('bookNow')}
            </Link>
          </nav>

          {/* Mobile Menu Button & Language Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-sm bg-accent-gold/10 text-primary font-semibold hover:bg-accent-gold/20 transition-colors text-xs"
            >
              {language === 'en' ? 'БГ' : 'EN'}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center space-y-1.5"
            >
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-primary block transition-all"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-primary block transition-all"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-primary block transition-all"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <nav className="container-custom py-6 flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('services')}
                className="text-lg font-semibold text-left text-neutral-800 hover:text-neutral-900 transition-colors"
              >
                {t('services')}
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-lg font-semibold text-left text-neutral-800 hover:text-neutral-900 transition-colors"
              >
                {t('about')}
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-lg font-semibold text-left text-neutral-800 hover:text-neutral-900 transition-colors"
              >
                {t('gallery')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-lg font-semibold text-left text-neutral-800 hover:text-neutral-900 transition-colors"
              >
                {t('contact')}
              </button>
              <Link to="/book" className="btn-primary text-center">
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
