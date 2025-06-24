import { useState } from 'react'
import Link from './Link'
import Image from './Image'
import formatDate from '@/lib/utils/formatDate'

const KashiwaArticleCard = ({ 
  title, 
  description, 
  imgSrc, 
  href, 
  date, 
  tags, 
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const getCardClasses = () => {
    switch (variant) {
      case 'featured':
        return 'kashiwa-grid-span-12'
      case 'editorial':
        return 'kashiwa-grid-span-6'
      default:
        return 'kashiwa-grid-span-6'
    }
  }

  const getImageHeight = () => {
    switch (variant) {
      case 'featured':
        return '60vh'
      case 'editorial':
        return '40vh'
      default:
        return '30vh'
    }
  }

  const getTitleClass = () => {
    switch (variant) {
      case 'featured':
        return 'kashiwa-display'
      case 'editorial':
        return 'kashiwa-headline'
      default:
        return 'kashiwa-headline'
    }
  }

  return (
    <article 
      className={`${getCardClasses()} kashiwa-card-hover`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} className="kashiwa-link">
        <div className="kashiwa-card" style={{ height: '100%' }}>
          
          {/* 画像セクション - 佐藤可士和の美しい比率 */}
          {imgSrc && (
            <div 
              className="relative overflow-hidden"
              style={{ 
                height: getImageHeight(),
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Image
                alt={title}
                src={imgSrc}
                className="w-full h-full object-cover"
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              {/* 佐藤可士和：最小限のオーバーレイ */}
              <div 
                className="absolute inset-0"
                style={{
                  background: isHovered ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0)',
                  transition: 'background 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          )}

          {/* コンテンツセクション - 佐藤可士和の空間美学 */}
          <div className="kashiwa-space-lg" style={{ padding: '0 2rem 2rem 2rem' }}>
            
            {/* 日付 - 極限の控えめさ */}
            {date && (
              <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="kashiwa-line" style={{ height: '1.5rem' }} />
                <time 
                  dateTime={date} 
                  className="kashiwa-micro"
                  style={{ color: '#999999' }}
                >
                  {formatDate(date)}
                </time>
              </div>
            )}

            {/* タイトル - 佐藤可士和のタイポグラフィ芸術 */}
            <div className="kashiwa-space-md">
              <h3 
                className={`${getTitleClass()} kashiwa-link-underline`}
                style={{ 
                  color: '#1a1a1a',
                  margin: 0,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {title}
              </h3>
            </div>

            {/* 説明文 - 読みやすさの極致 */}
            {description && (
              <div className="kashiwa-space-md">
                <p 
                  className="kashiwa-body"
                  style={{ 
                    color: '#666666',
                    display: '-webkit-box',
                    WebkitLineClamp: variant === 'featured' ? 4 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {description}
                </p>
              </div>
            )}

            {/* タグ - 佐藤可士和の控えめな美しさ */}
            {tags && tags.length > 0 && (
              <div className="kashiwa-space-md">
                <div className="kashiwa-line-h" style={{ marginBottom: '1rem' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  {tags.slice(0, variant === 'featured' ? 4 : 3).map((tag) => (
                    <span 
                      key={tag}
                      className="kashiwa-micro"
                      style={{ 
                        color: '#999999',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
      
      {/* 編集ボタン（開発環境のみ） - 目立たないように */}
      {href && href.startsWith('/blog/') && process.env.NODE_ENV === 'development' && (
        <div 
          className="absolute top-4 left-4 opacity-0 transition-opacity duration-300"
          style={{ 
            opacity: isHovered ? 1 : 0,
            zIndex: 10
          }}
        >
          <Link
            href={`/blog/edit/${href.replace('/blog/', '')}`}
            className="kashiwa-micro"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.9)',
              color: '#666666',
              transition: 'all 0.3s ease'
            }}
            title="記事を編集"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            編集
          </Link>
        </div>
      )}
    </article>
  )
}

export default KashiwaArticleCard