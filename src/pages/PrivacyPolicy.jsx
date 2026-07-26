import { useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

const sections = [
  {
    title: 'Администратор на данни',
    body: [
      'Barbershop Unusual обработва лични данни за целите на резервации и клиентска комуникация.'
    ]
  },
  {
    title: 'Какви данни събираме',
    body: ['При резервация обработваме следните данни:'],
    list: [
      'Име',
      'Имейл адрес',
      'Телефонен номер',
      'Избрана услуга, дата и час',
      'Допълнителни бележки (ако са предоставени)'
    ]
  },
  {
    title: 'Цел на обработването',
    body: ['Данните се използват само за:'],
    list: [
      'управление и потвърждение на резервации',
      'комуникация с клиента при необходимост',
      'административно управление на графика'
    ]
  },
  {
    title: 'Срок за съхранение',
    body: [
      'Личните данни се съхраняват за период, необходим за изпълнение на услугата и законовите изисквания, след което се изтриват или анонимизират.'
    ]
  },
  {
    title: 'Споделяне на данни',
    body: [
      'Данните не се продават и не се предоставят на трети лица, освен когато това е необходимо по закон или за техническо предоставяне на услугата.'
    ]
  },
  {
    title: 'Вашите права',
    body: ['Имате право на:'],
    list: [
      'достъп до вашите лични данни',
      'корекция на неточни данни',
      'изтриване на данни (когато е приложимо)',
      'ограничаване на обработването'
    ]
  },
  {
    title: 'Контакт',
    body: [
      'За въпроси относно тази политика и обработването на лични данни, свържете се с нас на имейл: Barbershopunusual@gmail.com.'
    ]
  }
]

const PrivacyPolicy = () => {
  const topRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const scrollTimer = setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'auto', block: 'start' })
      }
    }, 50)

    return () => clearTimeout(scrollTimer)
  }, [])

  return (
    <div ref={topRef} className="min-h-screen bg-paper-soft pt-28 sm:pt-24">
      <Header />
      <main>
        <section className="pb-20 pt-10 sm:pb-28 sm:pt-16">
          <div className="container-custom max-w-4xl">
            {/* Head */}
            <Reveal>
              <div className="flex items-center gap-3 text-neutral-400">
                <span className="h-1.5 w-1.5 rotate-45 bg-ink" />
                <span className="eyebrow text-neutral-500">Legal</span>
              </div>
              <h1 className="section-title mt-5 text-ink">
                Политика за поверителност на личните данни
              </h1>
              <p className="mt-5 text-[11px] uppercase tracking-wider2 text-neutral-400">
                Последна актуализация: 02.05.2026 г.
              </p>
            </Reveal>

            {/* Article */}
            <Reveal delay={0.08} className="mt-10">
              <article className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
                {sections.map((section, index) => (
                  <section
                    key={section.title}
                    className={`p-6 sm:p-10 ${index > 0 ? 'border-t border-hairline' : ''}`}
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-8">
                      <div className="sm:col-span-3">
                        <span className="eyebrow text-neutral-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h2 className="mt-2 font-display text-lg font-bold leading-tight text-ink">
                          {section.title}
                        </h2>
                      </div>

                      <div className="space-y-3 sm:col-span-9">
                        {section.body.map((paragraph) => (
                          <p key={paragraph} className="text-[15px] leading-relaxed text-neutral-600">
                            {paragraph}
                          </p>
                        ))}

                        {section.list && (
                          <ul className="space-y-2 pt-1">
                            {section.list.map((item) => (
                              <li key={item} className="flex items-start gap-3 text-[15px] text-neutral-600">
                                <span className="mt-2 h-1 w-1 flex-shrink-0 rotate-45 bg-neutral-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </section>
                ))}
              </article>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy
