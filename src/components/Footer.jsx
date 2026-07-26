import { useLanguage } from '../i18n/LanguageContext'
import { getTranslation } from '../i18n/translations'
import { Link } from 'react-router-dom'

const Footer = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  const quickLinks = [
    { href: '#services', label: t('services') },
    { href: '#about', label: t('about') },
    { href: '#gallery', label: t('gallery') },
    { href: '#contact', label: t('contact') }
  ]

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="rule-light" />

      <div className="container-custom pt-16 sm:pt-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-2xl font-bold tracking-tight">{t('brandName')}</h3>
            <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-white/50">{t('tagline')}</p>

            <a
              href="https://www.instagram.com/nikola.n.ivanov/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex flex-col gap-1.5 text-xs text-white/50 transition-colors hover:text-white"
            >
              <span className="eyebrow text-white/30">{t('websiteCreatedBy')}</span>
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8zm5-3.65a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
                </svg>
                <span className="relative">
                  nikola.n.ivanov
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-editorial group-hover:scale-x-100" />
                </span>
              </span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="eyebrow text-white/35">{t('quickLinks')}</h4>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
                    <span className="h-px w-0 bg-white transition-all duration-300 ease-editorial group-hover:w-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="eyebrow text-white/35">{t('businessHours')}</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              <li>{t('mondayFriday')}</li>
              <li>{t('saturdaySunday')}</li>
            </ul>
          </div>

          {/* Social + contact */}
          <div>
            <h4 className="eyebrow text-white/35">{t('followUs')}</h4>
            <div className="mt-5 flex gap-2.5">
              <a
                href="https://www.instagram.com/stilly.barb/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-light text-white transition-all duration-300 ease-editorial hover:-translate-y-0.5 hover:bg-white hover:text-ink"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8zm5-3.65a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@stilly.barb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-light text-white transition-all duration-300 ease-editorial hover:-translate-y-0.5 hover:bg-white hover:text-ink"
                aria-label="TikTok"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.53.02c1.31-.02 2.63-.01 3.94-.02.08 1.53.63 3.01 1.6 4.2.97 1.19 2.32 2.04 3.9 2.43v3.03c-1.46-.05-2.92-.35-4.26-.94-.55-.25-1.07-.55-1.55-.91v6.61c-.06 1.36-.49 2.68-1.27 3.79a6.57 6.57 0 0 1-3.18 2.63 7.03 7.03 0 0 1-4.17.57 6.8 6.8 0 0 1-3.84-1.82 6.87 6.87 0 0 1-2.22-3.55 6.92 6.92 0 0 1 .05-4.14 6.89 6.89 0 0 1 2.35-3.31 6.88 6.88 0 0 1 3.84-1.29v3.14a3.99 3.99 0 0 0-2.46 1.04 3.88 3.88 0 0 0-1.14 2.4c-.06.91.24 1.84.84 2.53.6.69 1.49 1.12 2.41 1.21.91.09 1.84-.17 2.59-.67a3.98 3.98 0 0 0 1.59-2.12c.28-.86.25-1.78.25-2.67.01-4.09-.01-8.19.01-12.28z" />
                </svg>
              </a>
            </div>

            <a
              href={`tel:${t('phoneNumberDisplay')}`}
              className="mt-6 block font-display text-lg font-semibold text-white/85 transition-colors hover:text-white"
            >
              {t('phoneNumberDisplay')}
            </a>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div className="mt-16 select-none overflow-hidden" aria-hidden="true">
          <p
            className="font-display font-extrabold uppercase leading-[0.8] tracking-[-0.05em] text-white/[0.07]"
            style={{ fontSize: 'clamp(1.6rem, 10.8vw, 9.9rem)' }}
          >
            {t('brandName')}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-hairline-light">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-[10px] uppercase tracking-wider2 text-white/40 sm:text-[11px]">
            © 2026 {t('brandName')} — {t('allRightsReserved')}
          </p>

          <Link
            to="/privacy-policy"
            className="group inline-flex max-w-full items-center justify-center gap-2 text-[10px] uppercase tracking-wider2 text-white/55 transition-colors hover:text-white sm:text-[11px]"
          >
            {t('privacyPolicy')}
            <svg className="hidden h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 sm:block" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
