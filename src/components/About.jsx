import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'
import Reveal from './Reveal'

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

  const [leadParagraph, ...restParagraphs] = aboutParagraphs

  return (
    <section id="about" className="relative overflow-hidden bg-paper py-20 sm:py-28 lg:py-32">
      <div className="container-custom">
        {/* Section head */}
        <Reveal>
          <div className="flex items-center gap-3 text-neutral-400">
            <span className="eyebrow">02</span>
            <span className="h-px w-10 bg-hairline-strong" />
            <span className="eyebrow text-neutral-500">{t('about')}</span>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left rail: heading + lead */}
          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
              <h2 className="section-title text-ink">{t('aboutHeadingShort')}</h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 border-l border-ink pl-6 text-lg font-medium leading-relaxed text-ink sm:text-xl">
                {leadParagraph}
              </p>
            </Reveal>

            <div className="mt-10 space-y-6">
              {restParagraphs.map((paragraph, index) => (
                <Reveal key={`about-p-${index}`} delay={0.06 * index} as="p" className="text-base leading-relaxed text-neutral-500 sm:text-[17px]">
                  {paragraph}
                </Reveal>
              ))}
            </div>

            {/* Signature rail */}
            <Reveal delay={0.1} className="mt-12">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-hairline pt-6">
                <span className="eyebrow text-neutral-400">{t('brandName')}</span>
                <span className="eyebrow text-neutral-400">{t('addressLine2')}</span>
                <a
                  href="https://www.instagram.com/stilly.barb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow text-ink underline-offset-4 transition-opacity hover:opacity-60"
                >
                  @stilly.barb
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right rail: sticky portrait */}
          <div className="lg:col-span-5">
            <Reveal delay={0.12} className="lg:sticky lg:top-28">
              <figure className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/images/information-image/Unusual-4.jpg`}
                    alt="Barbershop interior"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
                </div>

                {/* Offset hairline frame */}
                <div className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-40 w-40 rounded-2xl border border-hairline-strong sm:h-56 sm:w-56" />

                <figcaption className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-eyebrow text-neutral-400">
                  <span>{t('brandName')} — Studio</span>
                  <span>{t('addressLine1')}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
