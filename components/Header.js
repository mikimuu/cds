import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import ThemeSwitch from './ThemeSwitch'
import MobileNav from './MobileNav'
import Image from 'next/image'
import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'

const Header = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* ヒーローセクション */}
      <div className="relative w-full h-screen">
        {/* 背景画像 (夜の街) */}
        <Image
          src="/static/images/home.jpg"
          alt="Cosmic Dance"
          fill
          priority
          className="object-cover brightness-[0.7] transition-transform duration-1000"
          style={{
            transform: `scale(${1 + scrollY * 0.0003}) translateY(${scrollY * 0.5}px)`,
          }}
        />

        {/* ヒーロー内テキスト */}
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
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white transition-opacity duration-700"
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

      {/* ナビゲーションヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* 光の表現: 半透明のグラデーションで空間の広がりを演出 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/50 dark:from-black/90 dark:via-black/70 dark:to-black/50 backdrop-blur-sm"></div>
        
        {/* コンテンツ: 幾何学的な配置と余白の調和 */}
        <div className="relative">
          {/* 上部の装飾的な線: 建築的な直線美 + アニメーション */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-lightgray to-transparent animate-line-glow"></div>

          {/* メインナビゲーション */}
          <div className="max-w-[1000px] mx-auto px-8">
            <div className="flex items-center justify-between h-20">
              {/* サイトタイトル: 伊東豊雄的な軽やかさ */}
              <Link 
                href="/" 
                className="group relative py-2"
              >
                <span className="text-xl font-extralight tracking-[0.25em] text-cosmic-black dark:text-white transition-colors duration-500 group-hover:text-cosmic-blue">
                  cosmic dance
                </span>
                {/* タイトル下の装飾線: ホバー時に広がる */}
                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-cosmic-blue transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
              </Link>

              {/* デスクトップナビゲーション: 音楽的なリズム感 */}
              <nav className="hidden md:flex items-center">
                <div className="flex items-center space-x-12">
                  {headerNavLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="group relative py-2"
                    >
                      <span className="text-sm font-light tracking-wider text-cosmic-darkgray dark:text-cosmic-lightgray transition-colors duration-500 group-hover:text-cosmic-blue">
                        {link.title}
                      </span>
                      {/* ナビリンク下の装飾線: ホバー時に出現 */}
                      <span className="absolute bottom-0 left-1/2 w-0 h-px bg-cosmic-blue transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
                    </Link>
                  ))}
                </div>
                {/* テーマスイッチ: 余白を持たせて配置 */}
                <div className="ml-12">
                  <ThemeSwitch />
                </div>
              </nav>

              {/* モバイルナビゲーション */}
              <div className="md:hidden">
                <MobileNav />
              </div>
            </div>
          </div>

          {/* 下部の装飾的な線: 建築的な直線美 + アニメーション */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-lightgray to-transparent animate-line-glow"></div>
        </div>
      </header>
    </>
  )
}

export default Header 