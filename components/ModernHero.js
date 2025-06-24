import { useState, useEffect } from 'react'
import Link from './Link'
import Image from './Image'

const ModernHero = ({ 
  title = "宇宙的舞踏", 
  subtitle = "Cosmic Dance",
  description = "思考の軌跡を辿り、創造の宇宙を探索する旅",
  ctaText = "記事を探索",
  ctaLink = "/blog"
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* 背景画像 - パララックス効果 */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          willChange: 'transform'
        }}
      >
        <Image
          src="/static/images/hero.webp"
          alt="Cosmic Dance Hero"
          width={1920}
          height={1080}
          className="w-full h-full object-cover scale-110"
          priority
          loading="eager"
          sizes="100vw"
        />
        
        {/* 洗練されたオーバーレイ - 佐藤可士和スタイル */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className={`transform transition-all duration-1200 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            
            {/* 佐藤可士和マスターレベル: タイポグラフィの芸術作品 */}
            <div className="text-left max-w-6xl">
              
              {/* サブタイトル - 極限まで洗練された美しさ */}
              <div className="mb-12 lg:mb-16">
                <div className="flex items-center">
                  <div className="w-px h-16 lg:h-24 bg-white/20 mr-6 lg:mr-8"></div>
                  <span className="text-kashiwa-subtitle text-white/60">
                    {subtitle}
                  </span>
                </div>
              </div>

              {/* メインタイトル - 佐藤可士和の文字の魔法 */}
              <div className="mb-16 lg:mb-24">
                <h1 className="text-kashiwa-hero text-white overflow-hidden">
                  <span className="block text-kashiwa-hero opacity-40 transform -translate-x-4 lg:-translate-x-8">
                    {title.split('')[0]}
                  </span>
                  <span className="block text-kashiwa-hero-accent transform translate-x-8 lg:translate-x-16 -mt-4 lg:-mt-8">
                    {title.slice(1)}
                  </span>
                </h1>
              </div>

              {/* 説明文とCTA - 絶妙なバランス */}
              <div className="max-w-3xl ml-8 lg:ml-24">
                <div className="flex items-start space-x-8 lg:space-x-12">
                  <div className="w-px h-32 bg-white/10 mt-4 hidden lg:block"></div>
                  <div className="flex-1">
                    <p className="text-kashiwa-body text-white/75 mb-12 lg:mb-16">
                      {description}
                    </p>

                    {/* CTA - 佐藤可士和の美学 */}
                    <div className="flex items-center">
                      <Link 
                        href={ctaLink} 
                        className="group inline-flex items-center text-white hover:text-white/80 transition-all duration-500 ease-out"
                      >
                        <span className="text-kashiwa-caption mr-8 lg:mr-12">{ctaText}</span>
                        <div className="w-8 lg:w-12 h-px bg-white/30 group-hover:bg-white/60 transition-all duration-500 mr-4"></div>
                        <svg className="w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-500 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 佐藤可士和スタイルのアクセント要素 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      {/* ミニマルなスクロールインジケーター */}
      <div className="absolute bottom-8 left-8">
        <div className="flex items-center text-white/50 text-xs tracking-widest uppercase">
          <div className="w-px h-12 bg-white/30 mr-4" />
          <span>Scroll</span>
        </div>
      </div>
    </section>
  )
}

export default ModernHero