import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import About from '../components/About'
import Gallery from '../components/Gallery'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import SiteNotices from '../components/SiteNotices'

const Home = () => {
  return (
    <>
      <SiteNotices />
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
