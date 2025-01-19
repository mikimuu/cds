import siteMetadata from '@/data/siteMetadata'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import Header from './Header'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const LayoutWrapper = ({ children }) => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-cosmic-darkgray">
      <Header />

      {/* メインコンテンツ */}
      <main>
        <div className="relative w-full h-screen">
          <div 
            className="absolute inset-0 flex flex-col justify-center items-center"
            style={{
              opacity: 1 - scrollY * 0.002,
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            <div className="max-w-3xl mx-auto px-8 text-center text-white">
              <h1 
                className="text-4xl md:text-6xl font-extralight tracking-[0.2em] mb-8 transition-all duration-1000"
                style={{
                  transform: `translateY(${scrollY * -0.2}px)`,
                }}
              >
                {siteMetadata.title}
              </h1>
              <p 
                className="text-lg md:text-xl font-light tracking-wider leading-relaxed transition-all duration-1000"
                style={{
                  transform: `translateY(${scrollY * -0.1}px)`,
                }}
              >
                {siteMetadata.description}
              </p>
            </div>
          </div>
          {/* スクロールインジケーター */}
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white"
            style={{
              opacity: 1 - scrollY * 0.005,
            }}
          >
            <span className="text-sm font-light mb-4">Scroll to explore</span>
            <div className="w-px h-16 bg-white/50 relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 w-full bg-white animate-scroll-down"
                style={{ height: '30%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* コンテンツエリア: 建築的な秩序と余白 */}
        <div className="relative max-w-[1000px] mx-auto px-8">
          {/* 装飾的な線: スクロールに応じて現れる */}
          <div 
            className="absolute -left-4 top-0 w-px h-full bg-cosmic-lightgray/30 transition-transform duration-1000"
            style={{
              transform: `scaleY(${Math.min(1, (scrollY - 500) * 0.002)})`,
              opacity: Math.min(1, (scrollY - 500) * 0.002),
            }}
          ></div>
          <div 
            className="absolute -right-4 top-0 w-px h-full bg-cosmic-lightgray/30 transition-transform duration-1000"
            style={{
              transform: `scaleY(${Math.min(1, (scrollY - 500) * 0.002)})`,
              opacity: Math.min(1, (scrollY - 500) * 0.002),
            }}
          ></div>
          {children}
        </div>
      </main>

      {/* フッター */}
      <footer className="mt-32 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-cosmic-lightgray/5 transform transition-transform duration-1000"
          style={{
            transform: `translateY(${Math.min(0, (scrollY - 1000) * 0.1)}px)`,
          }}
        ></div>
        <div className="max-w-[1000px] mx-auto px-8 py-16 border-t border-cosmic-lightgray">
          <Footer />
        </div>
      </footer>
    </div>
  )
}

export default LayoutWrapper