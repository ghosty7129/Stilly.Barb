import { useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

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
    <div ref={topRef} className="min-h-screen bg-neutral-50 pt-28 sm:pt-24">
      <Header />
      <main>
        <section className="py-16">
          <div className="container-custom max-w-4xl">
            <article className="bg-white rounded-sm shadow-lg p-8 md:p-12 space-y-8">
              <header>
                <h1 className="section-title mb-4">Политика за поверителност на личните данни</h1>
                <p className="text-neutral-600">
                  Последна актуализация: 02.05.2026 г.
                </p>
              </header>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold">1. Администратор на данни</h2>
                <p className="text-neutral-700">
                  Barbershop Unusual обработва лични данни за целите на резервации и клиентска комуникация.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold">2. Какви данни събираме</h2>
                <p className="text-neutral-700">При резервация обработваме следните данни:</p>
                <ul className="list-disc pl-6 text-neutral-700 space-y-1">
                  <li>Име</li>
                  <li>Имейл адрес</li>
                  <li>Телефонен номер</li>
                  <li>Избрана услуга, дата и час</li>
                  <li>Допълнителни бележки (ако са предоставени)</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold">3. Цел на обработването</h2>
                <p className="text-neutral-700">Данните се използват само за:</p>
                <ul className="list-disc pl-6 text-neutral-700 space-y-1">
                  <li>управление и потвърждение на резервации</li>
                  <li>комуникация с клиента при необходимост</li>
                  <li>административно управление на графика</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold">4. Срок за съхранение</h2>
                <p className="text-neutral-700">
                  Личните данни се съхраняват за период, необходим за изпълнение на услугата и законовите изисквания,
                  след което се изтриват или анонимизират.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold">5. Споделяне на данни</h2>
                <p className="text-neutral-700">
                  Данните не се продават и не се предоставят на трети лица, освен когато това е необходимо по закон
                  или за техническо предоставяне на услугата.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold">6. Вашите права</h2>
                <p className="text-neutral-700">Имате право на:</p>
                <ul className="list-disc pl-6 text-neutral-700 space-y-1">
                  <li>достъп до вашите лични данни</li>
                  <li>корекция на неточни данни</li>
                  <li>изтриване на данни (когато е приложимо)</li>
                  <li>ограничаване на обработването</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold">7. Контакт</h2>
                <p className="text-neutral-700">
                  За въпроси относно тази политика и обработването на лични данни, свържете се с нас на
                  имейл: Barbershopunusual@gmail.com.
                </p>
              </section>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy
