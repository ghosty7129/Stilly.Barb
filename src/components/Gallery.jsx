import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const images = [
    {
      id: 1,
      url: `${apiUrl}/images/gallery_images/IMG_0086.JPG`,
      alt: 'Burst fade',
      focalPosition: '50% 45%'

    },
    {
      id: 2,
      url: `${apiUrl}/images/gallery_images/IMG_0007.JPEG`,
      alt: 'Buzzcut',
      focalPosition: '50% 70%'

    },
    {
      id: 3,
      url: `${apiUrl}/images/gallery_images/IMG_0044.JPEG`,
      alt: 'Flow hairstyle',
      focalPosition: '50% 80%'

    },
    {
      id: 4,
      url: `${apiUrl}/images/gallery_images/IMG_0087.PNG`,
      alt: 'Beard trim',
      focalPosition: '50% 50%'

    },
    {
      id: 5,
      url: `${apiUrl}/images/gallery_images/IMG_0034.JPEG`,
      alt: 'Buzzcut',
      focalPosition: '50% -10%'
    },
    {
      id: 6,
      url: `${apiUrl}/images/gallery_images/IMG_0088.PNG`,
      alt: 'Beard trim',
      focalPosition: '50% 45%'

    }
  ]

  return (
    <section id="gallery" className="py-24 bg-neutral-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('gallery')}</h2>
          <p className="section-subtitle mx-auto">
            {t('gallerySubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              onClick={() => setSelectedImage(image)}
              className="relative aspect-square overflow-hidden rounded-sm cursor-pointer group"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover transform-gpu scale-105 group-hover:scale-115 transition-transform duration-500"
                style={{ willChange: 'transform', backfaceVisibility: 'hidden', transformOrigin: 'center', objectPosition: image.focalPosition || '50% 35%' }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-medium">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://www.instagram.com/stilly.barb/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-lg font-medium hover:text-accent-gold transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>{t('followUsInsta')}</span>
          </a>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              aria-label="Close image preview"
              className="absolute top-4 right-4 z-60 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </motion.div>
      )}
    </section>
  )
}

export default Gallery
