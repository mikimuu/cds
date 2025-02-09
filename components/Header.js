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
      {/* ヒーローセクション */}
      <div className="relative w-full h-[100svh] overflow-hidden">
        {/* 背景画像 (夜の街 -> 宇宙のパノラマ) */}
        <Image
          src="/static/images/home.jpg"
          alt="Cosmic Dance"
          fill
          priority
          className="object-cover brightness-[0.7] cosmic-dance"
          style={{
            transform: `
              perspective(1200px)
              scale(${1 + cosmicIntensity * 0.15 + 0.03 * Math.sin(scrollY * 0.0015)})
              rotateY(${Math.sin(scrollY * 0.001) * cosmicIntensity * 5}deg)
              rotateZ(${cosmicIntensity * 3}deg)
              translateY(${Math.cos(scrollY * 0.004) * cosmicIntensity * 18}px)
              translateX(${Math.cos(scrollY * 0.003) * cosmicIntensity * 8}px)
            `,
          }}
        />

        {/* ヒーロー内テキスト */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center cosmic-dance px-4 sm:px-6 md:px-8"
          style={{
            opacity: Math.max(0, 1 - cosmicIntensity * 0.3),
            transform: `
              translateY(${Math.sin(scrollY * 0.003) * cosmicIntensity * 3}px)
              rotate(${Math.sin(scrollY * 0.002) * cosmicIntensity}deg)
            `
          }}
        >
          <div className="max-w-3xl mx-auto text-center text-white cosmic-float">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6 md:mb-8 animate-star-twinkle">
              {siteMetadata.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-light tracking-wide sm:tracking-wider leading-relaxed px-4 sm:px-0">
              {siteMetadata.description}
            </p>
          </div>
        </div>

        {/* 宇宙的なスクロールインジケーター */}
        <div
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cosmic-dance"
          style={{
            opacity: Math.max(0, 1 - cosmicIntensity * 0.4),
            transform: `translateY(${Math.sin(scrollY * 0.005) * cosmicIntensity * 3}px)`
          }}
        >
          <span className="text-xs sm:text-sm font-light mb-2 sm:mb-4 cosmic-pulse text-cosmic-star">
            ✦ Scroll to the Cosmos ✦
          </span>
          <div className="relative h-16 sm:h-24 md:h-32 w-px">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-cosmic-purple/50 to-transparent cosmic-float"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full animate-star-twinkle shadow-glow"></div>
          </div>
        </div>
      </div>

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
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
              {/* 銀河のタイトル */}
              <Link href="/" className="group relative py-2 transform transition-all duration-700 hover:scale-105">
                <span className="text-lg sm:text-xl font-extralight tracking-[0.2em] sm:tracking-[0.25em] text-cosmic-star drop-shadow-neon transition-all duration-500 ease-out group-hover:text-primary group-hover:tracking-[0.25em] sm:group-hover:tracking-[0.3em]">
                  COSMIC DANCE
                </span>
                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-gradient-to-r from-primary to-cosmic-purple transition-all duration-700 ease-in-out group-hover:w-full group-hover:left-0 group-hover:shadow-glow"></span>
              </Link>

              {/* 惑星軌道ナビゲーション */}
              <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
                <div className="flex items-center space-x-6 lg:space-x-12 relative">
                  {headerNavLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="group relative py-2 px-2 sm:px-4 cosmic-hover-orbit"
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
                <div className="ml-6 lg:ml-12 border-l border-cosmic-purple/30 pl-4 lg:pl-8 h-6 sm:h-8 flex items-center">
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
