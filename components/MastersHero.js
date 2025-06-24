import { useState, useEffect } from 'react'
import Link from './Link'
import Image from './Image'

const MastersHero = ({ 
  title = "宇宙的舞踏", 
  subtitle = "Cosmic Dance",
  description = "思考の軌跡を辿り、創造の宇宙を探索する旅。4人のデザイン巨匠の哲学と共に、情報設計の新しい美学を探求します。",
  ctaText = "記事を探索",
  ctaLink = "/blog"
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section className="m-hero">
      
      {/* ウィリアム・モリス：丁寧な背景設計 */}
      <Image
        src="/static/images/hero.webp"
        alt="Design Masters - Cosmic Dance"
        width={1920}
        height={1080}
        className="m-hero-image"
        style={{
          transform: `translateY(${scrollY * 0.25}px)`,
        }}
        priority
        loading="eager"
        sizes="100vw"
      />
      
      {/* ディーター・ラムス：機能的オーバーレイ */}
      <div className="m-hero-overlay" />

      {/* ポール・ランド + 佐藤可士和：明快な情報設計 */}
      <div className="m-container">
        <div className="m-grid">
          
          {/* 左の構造線 */}
          <div className="m-sidebar">
            <div className="m-divider m-divider-xl" />
          </div>
          
          {/* メインコンテンツ */}
          <div className={`m-content m-hero-content ${isVisible ? 'm-fade-in' : ''}`}>
            
            {/* 情報階層 1: カテゴリ */}
            <div className="m-block">
              <div className="m-caption" style={{ 
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '8px'
              }}>
                {subtitle}
              </div>
            </div>

            {/* 情報階層 2: メインタイトル */}
            <div className="m-block">
              <h1 className="m-hero-title">
                {title}
              </h1>
            </div>

            {/* 情報階層 3: 説明文 */}
            <div className="m-block">
              <p className="m-hero-subtitle">
                {description}
              </p>
            </div>

            {/* 情報階層 4: アクション */}
            <div className="m-block">
              <Link href={ctaLink} className="m-button">
                <span>{ctaText}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
          
          {/* 右の構造線 */}
          <div className="m-accent">
            <div className="m-divider m-divider-lg" style={{ 
              background: 'rgba(255,255,255,0.2)' 
            }} />
          </div>
        </div>
      </div>

      {/* ディーター・ラムス：機能的スクロールインジケーター */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div className="m-micro" style={{ 
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.1em'
        }}>
          SCROLL
        </div>
        <div style={{
          width: '2px',
          height: '32px',
          background: 'rgba(255,255,255,0.5)'
        }} />
      </div>
    </section>
  )
}

export default MastersHero