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
import { useRouter } from 'next/router'
import CosmicBackground from './CosmicBackground'
import EnhancedHero from './EnhancedHero'

const LayoutWrapper = ({ children }) => {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [performanceMode, setPerformanceMode] = useState('medium') // 'high', 'medium', 'low', 'auto'
  const [isHomepage, setIsHomepage] = useState(false)

  useEffect(() => {
    // ホームページかどうかを確認
    setIsHomepage(router.pathname === '/')

    // ローカルストレージからパフォーマンス設定を取得
    const savedPerformanceMode = localStorage.getItem('performanceMode') || 'medium'
    setPerformanceMode(savedPerformanceMode)

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
  }, [router.pathname])

  // パフォーマンスモードを切り替える関数
  const togglePerformanceMode = () => {
    const modes = ['auto', 'high', 'medium', 'low']
    const currentIndex = modes.indexOf(performanceMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setPerformanceMode(nextMode)
    localStorage.setItem('performanceMode', nextMode)
  }

  // パフォーマンスモードに基づいて表示するコンポーネントを決定
  const shouldRenderCosmicDance = () => {
    if (performanceMode === 'low') return false
    if (performanceMode === 'medium') return isHomepage
    if (performanceMode === 'high') return true
    // auto モードでは、モバイルではホームページのみ、それ以外では常に表示
    return isMobile ? isHomepage : true
  }

  const shouldRenderEnhancedHero = () => {
    if (performanceMode === 'low') return false
    if (performanceMode === 'medium' || performanceMode === 'high') return isHomepage
    // auto モードでは、ホームページのみ表示
    return isHomepage
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* パフォーマンスモード切り替えボタン */}
      <button 
        onClick={togglePerformanceMode}
        className="fixed bottom-2 xs:bottom-3 sm:bottom-4 right-2 xs:right-3 sm:right-4 z-50 bg-black/70 text-white px-2 xs:px-3 py-1 xs:py-2 rounded-full text-[10px] xs:text-xs backdrop-blur-md border border-white/20"
      >
        {performanceMode === 'auto' ? 'Auto' : 
         performanceMode === 'high' ? 'High Quality' : 
         performanceMode === 'medium' ? 'Medium Quality' : 'Low Quality'}
      </button>

      {/* 背景 - CosmicDance はパフォーマンスモードに応じて表示 */}
      {shouldRenderCosmicDance() && (
        <div
          className="fixed inset-0 z-0"
          aria-hidden="true"
          role="presentation"
        >
          <CosmicBackground isReducedMotion={isReducedMotion} isMobile={isMobile} />
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header transparent />

        <main className="flex-grow">
          {/* 拡張ヒーローセクション - パフォーマンスモードに応じて表示 */}
          {shouldRenderEnhancedHero() && (
            <EnhancedHero 
              title={siteMetadata.title}
              description={siteMetadata.description}
              scrollIndicatorText="Scroll to the Cosmos"
            />
          )}

          {/* 通常のヒーローセクション - EnhancedHero が表示されない場合 */}
          {!shouldRenderEnhancedHero() && isHomepage && (
            <div className="max-w-[1000px] lg:max-w-[1200px] xl:max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-24 text-center text-white">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {siteMetadata.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl opacity-80 max-w-3xl mx-auto">
                {siteMetadata.description}
              </p>
            </div>
          )}

          {/* コンテンツ部分 */}
          <div className="relative max-w-[1000px] lg:max-w-[1200px] xl:max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 mb-12 md:mb-16 mt-6 md:mt-8">
            <div className={`${!shouldRenderCosmicDance() ? 'bg-black' : 'bg-black/40 backdrop-blur-md'} rounded-md p-4 sm:p-6 shadow-md border border-white/10 text-white`}>
              {children}
            </div>
          </div>
        </main>

        {/* フッター */}
        <footer className="relative mt-auto">
          <div className="max-w-[1000px] lg:max-w-[1200px] xl:max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-16 border-t border-white/10 text-white">
            <Footer />
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LayoutWrapper
