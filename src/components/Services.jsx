import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DISPLAY_SERVICES } from '../services/appointmentService'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section id="services" className="py-24 bg-neutral-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('ourServices')}</h2>
          <p className="section-subtitle mx-auto">
            {t('serviceDescription')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3 md:gap-6"
        >
          <motion.button
            type="button"
            variants={itemVariants}
            onClick={() => navigate('/book')}
            className="group relative col-span-2 flex min-h-[132px] sm:min-h-[150px] cursor-pointer overflow-hidden rounded-sm border border-neutral-300 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:col-span-2 md:items-center md:justify-between md:p-5 lg:col-span-2"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.75),transparent_45%)]" />
            <div className="relative z-10 flex h-full w-full flex-col justify-between gap-3 md:flex-row md:items-center md:gap-6">
              <div className="max-w-xl">
                <p className="font-display text-xl leading-snug text-neutral-800 sm:text-2xl">
                  {t('makeYourComboDescription')}
                </p>
              </div>

              <div className="flex items-center gap-3 self-start rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors group-hover:border-neutral-400 group-hover:bg-neutral-50 md:self-center">
                <span>{t('bookNow')}</span>
                <motion.span
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-primary text-white transition-transform duration-300 group-hover:translate-x-0.5"
                  whileHover={{ x: 2 }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.span>
              </div>
            </div>
          </motion.button>

          {DISPLAY_SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => handleServiceClick(service.id)}
              className="group relative flex h-full min-h-[180px] cursor-pointer overflow-hidden rounded-sm border border-neutral-200 bg-white p-2.5 sm:p-3.5 md:p-5 transition-all duration-300 hover:border-neutral-400 hover:shadow-2xl"
            >
              {/* Hover background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-neutral-100/50 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10 flex h-full w-full flex-col">
                <div className="mb-2.5 sm:mb-4 flex min-h-[100px] sm:min-h-[120px] flex-col text-center">
                  <h3 className="flex min-h-[56px] sm:min-h-[78px] items-center justify-center font-display text-base sm:text-2xl font-semibold text-neutral-700 group-hover:text-neutral-900 transition-colors leading-tight">
                    {service.name}
                  </h3>
                  {(service.price !== null && service.price !== undefined && service.price !== '') && (
                    <>
                      <span className="mt-1.5 sm:mt-2.5 flex h-8 sm:h-9 items-center justify-center text-base sm:text-xl font-bold text-accent-gold">
                        {typeof service.price === 'number' ? `€${service.price}` : service.price}
                      </span>
                      {service.id === 'beard' && (
                        <span className="mt-0.5 text-xs sm:text-sm text-neutral-500">
                          (при комбо - 7€)
                        </span>
                      )}
                      {service.id === 'eyebrows' && (
                        <span className="mt-0.5 text-xs sm:text-sm text-neutral-500">
                          (10 мин)
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between pt-2.5 sm:pt-4 pr-10 sm:pr-12 text-xs sm:text-sm text-neutral-500">
                  <div>
                    {service.duration > 0 ? (
                      <span className="flex items-center">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {service.duration} min
                      </span>
                    ) : service.duration === 0 ? (
                      <span />
                    ) : (
                      <span className="text-left text-xs sm:text-sm font-medium text-neutral-600 max-w-[80%]">
                        {t('contactBarberForDetails')}
                      </span>
                    )}
                  </div>

                  {/* action button positioned to avoid squeezing content */}
                  <motion.div
                    className="absolute right-2.5 bottom-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-primary bg-white shadow-sm flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary z-10"
                    whileHover={{ rotate: 90 }}
                  >
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Services
