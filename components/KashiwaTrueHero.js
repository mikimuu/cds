import { useState, useEffect } from 'react'
import Link from './Link'
import Image from './Image'

const KashiwaTrueHero = ({ 
  title = "宇宙的舞踏", 
  subtitle = "Cosmic Dance",
  description = "思考の軌跡を辿り、創造の宇宙を探索する旅",
  ctaText = "記事を探索",
  ctaLink = "/blog"
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section className="k-hero">
      
      {/* 背景画像 */}
      <Image
        src="/static/images/hero.webp"
        alt="Cosmic Dance"
        width={1920}
        height={1080}
        className="k-hero-image"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
        priority
        loading="eager"
        sizes="100vw"
      />
      
      {/* オーバーレイ */}
      <div className="k-hero-overlay" />

      {/* コンテンツ - 佐藤可士和の情報設計 */}
      <div className="k-container">
        <div className="k-grid">
          
          {/* 左の構造線 */}
          <div className="k-sidebar">
            <div style={{ 
              width: '1px', 
              height: '120px', 
              background: 'rgba(255,255,255,0.3)',
              margin: '0 auto'
            }} />
          </div>
          
          {/* メインコンテンツ */}
          <div className={`k-content k-hero-content ${isVisible ? 'k-fade-in' : ''}`}>
            
            {/* 情報階層 1: カテゴリ */}
            <div className="k-block">
              <div className="k-caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {subtitle}
              </div>
            </div>

            {/* 情報階層 2: メインタイトル */}
            <div className="k-block">
              <h1 className="k-hero-title">
                {title}
              </h1>
            </div>

            {/* 情報階層 3: 説明文 */}
            <div className="k-block">
              <p className="k-hero-subtitle">
                {description}
              </p>
            </div>

            {/* 情報階層 4: アクション */}
            <div className="k-block">
              <Link href={ctaLink} className="k-button">
                <span>{ctaText}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
          
          {/* 右の構造線 */}
          <div className="k-accent">
            <div style={{ 
              width: '1px', 
              height: '80px', 
              background: 'rgba(255,255,255,0.2)',
              margin: '0 auto'
            }} />
          </div>
        </div>
      </div>

      {/* 佐藤可士和: 機能的インジケーター */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div className="k-micro" style={{ color: 'rgba(255,255,255,0.6)' }}>
          SCROLL
        </div>
        <div style={{
          width: '1px',
          height: '24px',
          background: 'rgba(255,255,255,0.4)'
        }} />
      </div>
    </section>
  )
}

export default KashiwaTrueHero