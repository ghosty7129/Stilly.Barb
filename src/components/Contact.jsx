import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'
import Reveal from './Reveal'

const Contact = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const mapsUrl = 'https://maps.app.goo.gl/1yu3jhKxN7nKA8pi8?g_st=ic'

  // "Monday - Friday: 10:00 - 19:00" -> label / time, with a safe fallback.
  const splitHours = (value) => {
    const separator = value.indexOf(': ')
    if (separator === -1) return { label: value, time: '' }
    return { label: value.slice(0, separator), time: value.slice(separator + 2) }
  }

  const weekdayHours = splitHours(t('mondayFriday'))
  const weekendHours = splitHours(t('saturdaySunday'))

  const intro = t('contactIntro')

  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-20 sm:py-28 lg:py-32">
      {/* Ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 65%)' }}
      />

      <div className="container-custom relative z-10">
        {/* Section head */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <div className="flex items-center gap-3 text-white/40">
              <span className="eyebrow">04</span>
              <span className="h-px w-10 bg-hairline-bright" />
              <span className="eyebrow">{t('contact')}</span>
            </div>
            <h2 className="section-title mt-6 text-white">{t('getInTouch')}</h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 lg:pb-2">
            <p className="text-base leading-relaxed text-white/55">{intro}</p>
          </Reveal>
        </div>

        {/* Hairline info grid */}
        <Reveal delay={0.05} className="mt-14">
          <div className="hairline-grid-light grid grid-cols-1 overflow-hidden rounded-2xl border border-hairline-light md:grid-cols-3">
            {/* Location */}
            <div className="flex flex-col justify-between gap-7 bg-ink p-5 sm:gap-8 sm:p-9">
              <div>
                <div className="flex items-center gap-3 text-white/40">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="eyebrow">{t('locationLabel')}</span>
                </div>
                <p className="mt-5 font-display text-xl font-semibold text-white sm:text-2xl">{t('addressLine1')}</p>
                <p className="mt-2 text-sm text-white/55">{t('addressLine2')}</p>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('openLocation')}
                className="group inline-flex w-fit max-w-full items-center gap-2.5 rounded-full border border-hairline-bright px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider2 text-white transition-all duration-300 ease-editorial hover:bg-white hover:text-ink sm:gap-3 sm:px-5 sm:py-3 sm:text-[11px] sm:tracking-eyebrow"
              >
                {t('openLocation')}
                <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                </svg>
              </a>
            </div>

            {/* Hours */}
            <div className="flex flex-col justify-between gap-7 bg-ink p-5 sm:gap-8 sm:p-9">
              <div>
                <div className="flex items-center gap-3 text-white/40">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="eyebrow">{t('businessHours')}</span>
                </div>

                <dl className="mt-5 space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hairline-light pb-3">
                    <dt className="text-sm text-white/55">{weekdayHours.label}</dt>
                    <dd className="font-display text-base font-semibold text-white">{weekdayHours.time}</dd>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <dt className="text-sm text-white/55">{weekendHours.label}</dt>
                    <dd className="font-display text-base font-semibold text-white">{weekendHours.time}</dd>
                  </div>
                </dl>
              </div>

              <Link to="/book" className="btn-light w-fit">
                {t('bookNow')}
              </Link>
            </div>

            {/* Direct contact */}
            <div className="flex flex-col justify-between gap-7 bg-ink p-5 sm:gap-8 sm:p-9">
              <div>
                <div className="flex items-center gap-3 text-white/40">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="eyebrow">{t('contact')}</span>
                </div>

                <div className="mt-5 space-y-4">
                  <a
                    href="https://www.instagram.com/stilly.barb/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 border-b border-hairline-light pb-3 text-white/75 transition-colors hover:text-white"
                  >
                    <span className="text-sm">{t('instagramHandle')}</span>
                    <svg className="h-3.5 w-3.5 flex-shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                    </svg>
                  </a>

                  <a
                    href={`mailto:${t('emailAddress')}`}
                    className="group flex items-center justify-between gap-3 border-b border-hairline-light pb-3 text-white/75 transition-colors hover:text-white"
                  >
                    <span className="break-all text-sm">{t('emailAddress')}</span>
                    <svg className="h-3.5 w-3.5 flex-shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                    </svg>
                  </a>

                  <a
                    href={`tel:${t('phoneNumberDisplay')}`}
                    className="group flex items-center justify-between gap-3 text-white/75 transition-colors hover:text-white"
                  >
                    <span className="font-display text-lg font-semibold">{t('phoneNumberDisplay')}</span>
                    <svg className="h-3.5 w-3.5 flex-shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Contact
