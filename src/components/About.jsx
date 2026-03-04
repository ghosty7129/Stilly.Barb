import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const About = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title mb-6">
              {t('whereTraditionMeets')}
              <br />
              {t('meetsInnovation')} <span className="text-gradient">Innovation</span>
            </h2>
            
            <div className="space-y-6 text-lg text-neutral-600 leading-relaxed">
              <p>
                {t('aboutParagraph1')}
              </p>
              
              <p>
                {t('aboutParagraph2')}
              </p>
              
              <p>
                {t('aboutParagraph3')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-gold mb-2">3+</div>
                <div className="text-sm text-neutral-600">{t('yearsExperience')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-gold mb-2">300+</div>
                <div className="text-sm text-neutral-600">{t('happyClients')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-gold mb-2">99%+</div>
                <div className="text-sm text-neutral-600">{t('satisfaction')}</div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-neutral-200 rounded-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800"
                alt="Barbershop interior"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border-4 border-accent-gold rounded-sm -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
