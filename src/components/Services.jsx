import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { DISPLAY_SERVICES } from '../services/appointmentService'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'
import Reveal from './Reveal'

const Services = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  const handleServiceClick = (serviceId) => {
    if (serviceId === 'hair-dye') {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    navigate('/book')
  }

  // Real durations sit in the top rail; services that need a chat instead show
  // the contact hint down in the body where the price would be.
  const renderDuration = (service) => {
    if (service.duration > 0) {
      return `${service.duration} min`
    }
    if (service.id === 'eyebrows') {
      return '10 min'
    }
    return null
  }

  return (
    <section id="services" className="relative bg-paper-soft py-20 sm:py-28 lg:py-32">
      <div className="container-custom">
        {/* Section head */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <div className="flex items-center gap-3 text-neutral-400">
              <span className="eyebrow">01</span>
              <span className="h-px w-10 bg-hairline-strong" />
              <span className="eyebrow text-neutral-500">{t('services')}</span>
            </div>
            <h2 className="section-title mt-6 text-ink">{t('ourServices')}</h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 lg:pb-2">
            <p className="section-subtitle">{t('serviceDescription')}</p>
          </Reveal>
        </div>

        {/* Hairline grid of services */}
        <Reveal delay={0.05} className="mt-12 sm:mt-16">
          <div className="hairline-grid grid grid-cols-2 overflow-hidden rounded-2xl border border-hairline lg:grid-cols-3">
            {/* Combo banner */}
            <motion.button
              type="button"
              onClick={() => navigate('/book')}
              className="group relative col-span-2 flex flex-col justify-between gap-5 bg-ink p-5 text-left transition-colors duration-500 hover:bg-ink-raised sm:gap-6 sm:p-8 lg:col-span-3 lg:flex-row lg:items-center"
            >
              <div className="max-w-2xl">
                <span className="eyebrow text-white/40">Combo</span>
                <p className="mt-3 font-display text-lg font-semibold leading-snug text-white sm:text-2xl lg:text-3xl">
                  {t('makeYourComboDescription')}
                </p>
              </div>

              <span className="inline-flex w-fit flex-shrink-0 items-center gap-2.5 rounded-full border border-hairline-bright px-4 py-2.5 text-[10px] font-semibold uppercase tracking-eyebrow text-white transition-all duration-300 ease-editorial group-hover:bg-white group-hover:text-ink sm:gap-3 sm:px-5 sm:py-3 sm:text-[11px]">
                {t('bookNow')}
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                </svg>
              </span>
            </motion.button>

            {/* Service cells */}
            {DISPLAY_SERVICES.map((service, index) => {
              const duration = renderDuration(service)
              const hasPrice = service.price !== null && service.price !== undefined && service.price !== ''
              const needsContact = !hasPrice || service.contactRequired

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleServiceClick(service.id)}
                  className="group relative flex min-h-[180px] flex-col bg-paper p-3.5 text-left transition-colors duration-500 hover:bg-white sm:min-h-[230px] sm:p-6 lg:min-h-[260px] lg:p-8"
                >
                  {/* Sliding ink wash on hover */}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-neutral-100 transition-all duration-500 ease-editorial group-hover:h-full" />

                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <span className="text-[10px] font-medium tracking-eyebrow text-neutral-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {duration && (
                      <span className="whitespace-nowrap text-right text-[10px] uppercase tracking-wider2 text-neutral-400 sm:text-[11px]">
                        {duration}
                      </span>
                    )}
                  </div>

                  {/* Name sits in a fixed two-line box so every card's title and
                      price land on exactly the same baseline. */}
                  <h3 className="relative z-10 mt-auto flex min-h-[2.5em] items-end hyphens-auto break-words pt-5 font-display text-[15px] font-semibold leading-tight text-ink transition-colors sm:text-xl lg:text-2xl">
                    {service.name}
                  </h3>

                  <div className="relative z-10 mt-3 flex h-[46px] items-start justify-between gap-2 sm:mt-4 sm:h-[58px] sm:gap-3">
                    <div className="min-w-0">
                      {hasPrice && (
                        <span className="font-display text-lg font-bold leading-none text-ink sm:text-2xl">
                          {typeof service.price === 'number' ? `€${service.price}` : service.price}
                        </span>
                      )}
                      {service.id === 'beard' && (
                        <span className="mt-1.5 block text-[10px] leading-tight text-neutral-500 sm:text-[11px]">
                          (при комбо - 7€)
                        </span>
                      )}
                      {needsContact && (
                        <span className="block text-[10px] leading-snug text-neutral-500 sm:text-[11px]">
                          {t('contactBarberForDetails')}
                        </span>
                      )}
                    </div>

                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-hairline-strong text-ink transition-all duration-300 ease-editorial group-hover:border-ink group-hover:bg-ink group-hover:text-white sm:h-10 sm:w-10">
                      <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                      </svg>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Services
