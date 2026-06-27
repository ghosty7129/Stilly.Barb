import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import About from '../components/About'
import Gallery from '../components/Gallery'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

const AbsenceModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative bg-white rounded-sm shadow-2xl max-w-md w-full p-8 z-10">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors text-xl leading-none"
        aria-label="Затвори"
      >
        ✕
      </button>
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-lg font-bold text-neutral-900">Важно съобщение</h2>
      </div>
      <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
        {`Уважаеми клиенти,\n\nЩе отсъствам от 8 до 15 юли. Моля, запишете своя час преди или след този период, тъй като местата са ограничени.`}
      </p>
      <button
        onClick={onClose}
        className="mt-6 w-full py-2.5 bg-neutral-900 text-white font-semibold rounded-sm hover:bg-neutral-700 transition-colors"
      >
        Разбрах
      </button>
    </div>
  </div>
)

const Home = () => {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('absenceNoticeSeen')) {
      setShowModal(true)
    }
  }, [])

  const handleClose = () => {
    sessionStorage.setItem('absenceNoticeSeen', '1')
    setShowModal(false)
  }

  return (
    <>
      {showModal && <AbsenceModal onClose={handleClose} />}
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default Home
