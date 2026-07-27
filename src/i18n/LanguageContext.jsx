import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const LanguageContext = createContext()

const SWITCH_FADE_MS = 190

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to Bulgarian
    return localStorage.getItem('barberLanguage') || 'bg'
  })
  // Drives the brief fade so copy never visibly "pops" between languages.
  const [isSwitching, setIsSwitching] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    // Save language preference
    localStorage.setItem('barberLanguage', language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const changeLanguage = useCallback((next) => {
    if (next === language || isSwitching) return

    setIsSwitching(true)
    timers.current.push(
      setTimeout(() => {
        setLanguage(next)
        // Clear on the next tick so the new copy is painted before it fades in.
        timers.current.push(setTimeout(() => setIsSwitching(false), 30))
      }, SWITCH_FADE_MS)
    )
  }, [language, isSwitching])

  const toggleLanguage = useCallback(() => {
    changeLanguage(language === 'en' ? 'bg' : 'en')
  }, [changeLanguage, language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, changeLanguage, toggleLanguage, isSwitching }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
