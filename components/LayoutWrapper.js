import siteMetadata from '@/data/siteMetadata'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import Header from './Header'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import CosmicDance from './CosmicBackground'

const LayoutWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <CosmicDance />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <div className="relative w-full h-[60vh] md:h-screen">
            <div className="absolute inset-0 flex flex-col justify-center items-center px-4 md:px-8">
              <div className="max-w-3xl mx-auto text-center text-white">
                <h1 className="text-3xl md:text-6xl font-extralight tracking-[0.2em] mb-4 md:mb-8">
                  {siteMetadata.title}
                </h1>
                <p className="text-base md:text-xl font-light tracking-wider leading-relaxed">
                  {siteMetadata.description}
                </p>
              </div>
            </div>
            
            {!isMobile && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white">
                <span className="text-sm font-light mb-4">Scroll to explore</span>
                <div className="w-px h-16 bg-white/50"></div>
              </div>
            )}
          </div>

          <div className="relative max-w-[1000px] mx-auto px-4 md:px-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-white/10">
              {children}
            </div>
          </div>
        </main>

        <footer className="mt-16 md:mt-32 relative">
          <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 md:py-16 border-t border-white/10">
            <Footer />
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LayoutWrapper