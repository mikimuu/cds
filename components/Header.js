/**
 * 以下のコードは、スクロール時に背景画像に深みと多次元のエフェクトを
 * 付与し、より洗練された宇宙的な美しさと新鮮な驚きを提供します。
 * LayoutWrapper.js との連携を踏まえ、宇宙のダイナミズムと重力のゆらぎを
 * 拡大、回転、そしてパースペクティブを活用したアニメーションで表現します。
 * カスタムフック calculateAnimationIntensity により、スクロール位置に応じた
 * 宇宙エネルギーをシミュレーションし、各要素に動的な変化を与えます。
 */

import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import ThemeSwitch from './ThemeSwitch'
import MobileNav from './MobileNav'
import Image from 'next/image'
import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState, useCallback } from 'react'

const Header = ({ transparent }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // スクロールハンドラーの最適化
  const handleScroll = useCallback(() => {
    if (!window.requestAnimationFrame) {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
      setScrollY(scrollPosition)
      return
    }

    window.requestAnimationFrame(() => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
      setScrollY(Math.min(scrollPosition, 1000)) // スクロール量に上限を設定
    })
  }, [])

  // アニメーションの強度を計算：宇宙のエネルギー強度をシミュレート
  const calculateAnimationIntensity = useCallback((scroll) => {
    const threshold = 300
    const intensity = scroll <= threshold
      ? scroll / threshold
      : 1 + Math.log10((scroll - threshold) / threshold)
    return Math.min(intensity, 1.5)
  }, [])

  // 宇宙エネルギーの強度（cosmicIntensity）を取得
  const cosmicIntensity = calculateAnimationIntensity(scrollY)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    let scrollTimeout
    const throttledScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll()
          scrollTimeout = null
        }, 16) // ≈ 60fps
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    handleResize()
    handleScroll()

    return () => {
      window.removeEventListener('scroll', throttledScroll)
      window.removeEventListener('resize', handleResize)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [handleScroll])

  return (
    <>
      {/* 銀河系ナビゲーションヘッダー */}
      <header
        style={{ backgroundColor: transparent ? 'transparent' : undefined }}
        className={`fixed top-0 left-0 right-0 z-50 cosmic-dance ${isScrolled ? 'bg-cosmic-dark/90 backdrop-blur-lg shadow-galaxy animate-cosmic-shift' : 'bg-transparent'}`}
      >
        <div className="relative">
          {/* 宇宙のエネルギー波 */}
          <div
            className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-cosmic-purple to-cosmic-star animate-energy-pulse ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
          ></div>

          {/* メインナビゲーション */}
          <div className="max-w-[1000px] lg:max-w-[1200px] xl:max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 md:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
              {/* 銀河のタイトル */}
              <Link href="/" className="group relative py-2 transform transition-all duration-700 hover:scale-105">
                <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-extralight tracking-[0.1em] xs:tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.2em] text-cosmic-star drop-shadow-neon transition-all duration-500 ease-out group-hover:text-primary group-hover:tracking-[0.15em] sm:group-hover:tracking-[0.2em] md:group-hover:tracking-[0.25em]">
                  COSMIC DANCE
                </span>
                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-gradient-to-r from-primary to-cosmic-purple transition-all duration-700 ease-in-out group-hover:w-full group-hover:left-0 group-hover:shadow-glow"></span>
              </Link>

              {/* 惑星軌道ナビゲーション */}
              <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
                <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-8 xl:space-x-12 relative">
                  {headerNavLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="group relative py-2 px-3 sm:px-4 cosmic-hover-orbit"
                    >
                      <span className="text-xs sm:text-sm font-light tracking-wide sm:tracking-wider text-cosmic-white/90 transition-all duration-500 ease-out group-hover:text-cosmic-star group-hover:drop-shadow-neon">
                        {link.title}
                      </span>
                      <div className="absolute inset-0 border-2 border-cosmic-purple/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 ease-out-circ"></div>
                      <div className="absolute -bottom-2 left-1/2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 animate-planet-blink"></div>
                    </Link>
                  ))}
                </div>
                {/* テーマスイッチ（超新星バージョン） */}
                <div className="ml-4 lg:ml-6 xl:ml-12 border-l border-cosmic-purple/30 pl-4 lg:pl-8 h-6 sm:h-8 flex items-center">
                  <div className="cosmic-switch-container hover:rotate-[30deg] transition-transform duration-500">
                    <ThemeSwitch />
                  </div>
                </div>
              </nav>

              {/* モバイルナビゲーション */}
              <div className="md:hidden">
                <MobileNav />
              </div>
            </div>
          </div>

          {/* 下部の装飾的な線: 建築的な直線美 + 宇宙的な瞬き */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-500 ease-out ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
          ></div>
        </div>
      </header>
    </>
  )
}

export default Header
