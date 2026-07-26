import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'
import Reveal from './Reveal'

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

  // On desktop the first frame runs as a 2x2 hero tile, so the 3-column grid
  // still resolves to a perfect 3x3 block.
  const spanClass = (index) => (index === 0 ? 'md:col-span-2 md:row-span-2' : '')

  useEffect(() => {
    if (!selectedImage) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedImage(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedImage])

  return (
    <section id="gallery" className="relative bg-paper-soft py-20 sm:py-28 lg:py-32">
      <div className="container-custom">
        {/* Section head */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <div className="flex items-center gap-3 text-neutral-400">
              <span className="eyebrow">03</span>
              <span className="h-px w-10 bg-hairline-strong" />
              <span className="eyebrow text-neutral-500">{t('gallery')}</span>
            </div>
            <h2 className="section-title mt-6 text-ink">{t('gallery')}</h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 lg:pb-2">
            <p className="section-subtitle">{t('gallerySubtitle')}</p>
            <a
              href="https://www.instagram.com/stilly.barb/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-eyebrow text-ink"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8zm5-3.65a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
              </svg>
              <span className="relative">
                {t('followUsInsta')}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-300 ease-editorial group-hover:scale-x-100" />
              </span>
            </a>
          </Reveal>
        </div>

        {/* Asymmetric photo grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5">
          {images.map((image, index) => (
            <Reveal
              key={image.id}
              delay={index * 0.05}
              y={18}
              className={spanClass(index)}
            >
              <button
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={image.alt}
                className={`group relative block w-full overflow-hidden rounded-xl bg-neutral-100 ${
                  index === 0 ? 'aspect-square md:aspect-auto md:h-full' : 'aspect-square'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.07]"
                  style={{ objectPosition: image.focalPosition || '50% 35%' }}
                />

                {/* Hover veil + caption */}
                <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between gap-2 p-4 opacity-0 transition-all duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-[10px] uppercase tracking-eyebrow text-white sm:text-[11px]">
                    {image.alt}
                  </span>
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-hairline-bright text-white">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7" />
                    </svg>
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              aria-label="Close image preview"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-hairline-bright text-white transition-colors hover:bg-white hover:text-ink"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <motion.figure
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
              className="flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.alt}
                className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain"
              />
              <figcaption className="text-[10px] uppercase tracking-eyebrow text-white/60">
                {selectedImage.alt}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Gallery
