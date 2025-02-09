/**
 * 以下のコードは、Header による夜のイメージをサイト全体により溶け込ませるため、
 * 背景レイヤーやセクション部分のスタイルを調整し、CosmicDance 背景をメイン
 * コンテンツ全体にシームレスに馴染ませています。
 */

// Start of Selection
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
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    const checkReducedMotion = () => {
      setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }

    checkMobile()
    checkReducedMotion()

    window.addEventListener('resize', checkMobile)
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionMediaQuery.addEventListener('change', checkReducedMotion)

    return () => {
      window.removeEventListener('resize', checkMobile)
      motionMediaQuery.removeEventListener('change', checkReducedMotion)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-black">
      {/* 背景 - CosmicDance を全面的に使用し、夜のイメージをサイト全体に統一 */}
      <div
        className="fixed inset-0 z-0"
        aria-hidden="true"
        role="presentation"
      >
        <CosmicDance isReducedMotion={isReducedMotion} isMobile={isMobile} />
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header transparent />

        <main className="flex-grow">
          {/* ヒーローセクション：背景に夜のイメージが溶け込むよう、グラデーションを追加 */}
          <div className="relative w-full h-[60vh] md:h-screen">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
            <div className="absolute inset-0 flex flex-col justify-center items-center px-4 md:px-8 text-white">
              <div className="max-w-3xl mx-auto text-center">
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

          {/* コンテンツ部分：背景を透過させ、Header の夜のイメージを全面に */}
          <div className="relative max-w-[1000px] mx-auto px-4 md:px-8 mb-16 mt-8">
            <div className="bg-black/40 backdrop-blur-md rounded-md p-6 shadow-md border border-white/10 text-white">
              {children}
            </div>
          </div>
        </main>

        {/* フッター */}
        <footer className="relative mt-auto">
          <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 md:py-16 border-t border-white/10 text-white">
            <Footer />
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LayoutWrapper
