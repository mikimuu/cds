import { useState, useEffect } from 'react'
import Link from './Link'
import Image from './Image'

const KashiwaHero = ({ 
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
    <section className="kashiwa-hero-section relative overflow-hidden" style={{ background: '#000000' }}>
      
      {/* 背景画像 - パララックス効果 */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          willChange: 'transform'
        }}
      >
        <Image
          src="/static/images/hero.webp"
          alt="Cosmic Dance"
          width={1920}
          height={1080}
          className="w-full h-full object-cover scale-110"
          priority
          loading="eager"
          sizes="100vw"
        />
        
        {/* 佐藤可士和の美学：最小限のオーバーレイ */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.7) 100%)'
          }}
        />
      </div>

      {/* 佐藤可士和 マスターピース：究極のタイポグラフィ */}
      <div className="relative z-10 kashiwa-container">
        <div className="kashiwa-grid">
          
          {/* 左の線 */}
          <div className="kashiwa-line" style={{ height: '60vh', background: 'rgba(255,255,255,0.2)' }} />
          
          {/* メインコンテンツ */}
          <div className={`kashiwa-fade-in ${isVisible ? '' : 'kashiwa-invisible'}`}>
            
            {/* サブタイトル - 極限の控えめさ */}
            <div className="kashiwa-space-lg">
              <div className="kashiwa-caption" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {subtitle}
              </div>
            </div>

            {/* メインタイトル - 佐藤可士和の文字の魔法 */}
            <div className="kashiwa-space-xl">
              <h1 className="kashiwa-cosmic" style={{ color: '#ffffff' }}>
                <span style={{ 
                  display: 'block', 
                  opacity: 0.3,
                  transform: 'translateX(-5vw)',
                  fontWeight: 100
                }}>
                  {title.charAt(0)}
                </span>
                <span style={{ 
                  display: 'block', 
                  transform: 'translateX(8vw) translateY(-15vw)',
                  fontWeight: 300
                }}>
                  {title.slice(1)}
                </span>
              </h1>
            </div>

            {/* 説明文とCTA - 完璧なバランス */}
            <div className="kashiwa-space-xl" style={{ marginLeft: '12vw', maxWidth: '600px' }}>
              
              {/* 説明文 */}
              <div className="kashiwa-space-lg">
                <p className="kashiwa-body" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {description}
                </p>
              </div>

              {/* CTA - 佐藤可士和の究極のミニマリズム */}
              <div className="kashiwa-space-md">
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                  
                  {/* リンクテキスト */}
                  <Link 
                    href={ctaLink} 
                    className="kashiwa-link kashiwa-caption" 
                    style={{ 
                      color: '#ffffff',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {ctaText}
                  </Link>
                  
                  {/* 線 */}
                  <div 
                    className="kashiwa-line-h" 
                    style={{ 
                      width: '4rem',
                      background: 'rgba(255,255,255,0.3)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                  
                  {/* 矢印 */}
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.6)" 
                    strokeWidth="1"
                    style={{ 
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右の線 */}
          <div className="kashiwa-line" style={{ height: '60vh', background: 'rgba(255,255,255,0.1)' }} />
        </div>
      </div>

      {/* 佐藤可士和：最小限のスクロールインジケーター */}
      <div 
        className="absolute bottom-8 left-8"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: 'rgba(255,255,255,0.4)'
        }}
      >
        <div className="kashiwa-line" style={{ height: '3rem', background: 'rgba(255,255,255,0.2)' }} />
        <div className="kashiwa-micro">SCROLL</div>
      </div>
    </section>
  )
}

export default KashiwaHero