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

  // Map service names to translation keys
  const getServiceDescription = (serviceId) => {
    const descriptionMap = {
      'buzzcut': language === 'en' ? 'Professional buzzcut service delivered with precision and care.' : 'Професионална buzzcut услуга с прецизност и грижа.',
      'fade': language === 'en' ? 'Professional fade service delivered with precision and care.' : 'Професионална fade услуга с прецизност и грижа.',
      'beard': language === 'en' ? 'Professional beard service delivered with precision and care.' : 'Професионално оформяне на брада с прецизност и грижа.',
    }
    return descriptionMap[serviceId] || ''
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {DISPLAY_SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => navigate('/book')}
              className="group relative bg-white p-8 rounded-sm hover:shadow-2xl transition-all duration-300 border border-neutral-200 hover:border-neutral-400 overflow-hidden cursor-pointer"
            >
              {/* Hover background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-neutral-100/50 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-2xl font-semibold text-neutral-700 group-hover:text-neutral-900 transition-colors">
                    {service.name}
                  </h3>
                  <span className="text-2xl font-bold text-accent-gold">
                    €{service.price}
                  </span>
                </div>

                <p className="text-neutral-600 mb-4 leading-relaxed">
                  {getServiceDescription(service.id)}
                </p>

                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.duration} min
                  </span>
                  
                  <motion.div
                    className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all"
                    whileHover={{ rotate: 90 }}
                  >
                    <svg className="w-4 h-4 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
