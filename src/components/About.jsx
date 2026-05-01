import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const splitParagraphs = (text) => {
  if (!text) return []
  return text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
}

const About = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  const aboutParagraphs = [
    t('aboutParagraph1'),
    t('aboutParagraph2'),
    ...splitParagraphs(t('aboutParagraph3')),
  ].filter(Boolean)

  const imageInsertIndex = Math.min(
    3,
    Math.max(0, aboutParagraphs.findIndex((paragraph) => paragraph.includes('Всеки човек е различен')) + 1 || 3)
  )

  const topParagraphs = aboutParagraphs.slice(0, imageInsertIndex)
  const bottomParagraphs = aboutParagraphs.slice(imageInsertIndex)

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-start-1"
          >
            <h2 className="section-title mb-6">{t('aboutHeadingShort')}</h2>

            <div className="space-y-6 text-lg text-neutral-600 leading-relaxed">
              {topParagraphs.map((paragraph, index) => (
                <p key={`top-${index}`}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          <div className="relative lg:col-start-2 lg:row-span-2">
            <div className="aspect-[4/5] bg-neutral-200 rounded-sm overflow-hidden">
              <img
                src={`${import.meta.env.VITE_API_URL}/images/information-image/Unusual-4.jpg`}
                alt="Barbershop interior"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 w-48 h-48 border-4 border-accent-gold rounded-sm -z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-lg text-neutral-600 leading-relaxed lg:col-start-1"
          >
            {bottomParagraphs.map((paragraph, index) => (
              <p key={`bottom-${index}`}>{paragraph}</p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
