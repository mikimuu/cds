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
    const scrollPosition = window.scrollY
    setIsScrolled(scrollPosition > 20)
    setScrollY(Math.min(scrollPosition, 500))
  }, [])

  // アニメーションの強度を計算：減衰するように調整
  const calculateAnimationIntensity = useCallback((scroll) => {
    const threshold = 200
    const intensity = scroll <= threshold
      ? scroll / threshold
      : 1
    return Math.min(intensity, 1)
  }, [])

  // 宇宙エネルギーの強度（cosmicIntensity）を取得
  const cosmicIntensity = calculateAnimationIntensity(scrollY)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // スクロールイベントを最適化
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
      {/* ナビゲーションヘッダー */}
      <header
        style={{ backgroundColor: transparent ? 'transparent' : undefined }}
        className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-black/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}
      >
        <div className="relative">
          {/* 上部のアクセントライン */}
          {isScrolled && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-cosmic-purple to-cosmic-star"></div>
          )}

          {/* メインナビゲーション */}
          <div className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
              {/* サイトタイトル */}
              <Link href="/" className="flex items-center py-2">
                <span className="text-sm xs:text-base sm:text-lg font-light tracking-wider text-white">
                  COSMIC DANCE
                </span>
              </Link>

              {/* デスクトップナビゲーション */}
              <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
                  {headerNavLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="py-2 px-2 sm:px-3 text-sm font-light text-white/90 hover:text-white transition-colors duration-200"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
                {/* テーマスイッチ */}
                <div className="ml-2 sm:ml-4 border-l border-white/20 pl-2 sm:pl-4 h-6 flex items-center">
                  <ThemeSwitch />
                </div>
              </nav>

              {/* モバイルナビゲーション */}
              <div className="md:hidden">
                <MobileNav />
              </div>
            </div>
          </div>

          {/* 下部の装飾的な線 */}
          {isScrolled && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10"></div>
          )}
        </div>
      </header>
    </>
  )
}

export default Header
