import { useState } from 'react'
import Link from './Link'
import Image from './Image'
import formatDate from '@/lib/utils/formatDate'

const KashiwaTrueCard = ({ 
  title, 
  description, 
  imgSrc, 
  href, 
  date, 
  tags, 
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article 
      className="k-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
        
        {/* 画像 - 機能的な比率 */}
        {imgSrc && (
          <div style={{ marginBottom: '16px', overflow: 'hidden' }}>
            <Image
              alt={title}
              src={imgSrc}
              className="k-card-image"
              style={{
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}
              width={400}
              height={240}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {/* コンテンツ - 佐藤可士和の情報階層 */}
        <div className="k-card-content">
          
          {/* 情報階層 1: メタデータ */}
          {date && (
            <div className="k-card-meta">
              <time dateTime={date} className="k-caption">
                {formatDate(date)}
              </time>
            </div>
          )}

          {/* 情報階層 2: タイトル */}
          <h3 className="k-card-title">
            <span className="k-title" style={{
              borderBottom: isHovered ? '1px solid currentColor' : '1px solid transparent',
              transition: 'border-color 0.3s ease'
            }}>
              {title}
            </span>
          </h3>

          {/* 情報階層 3: 説明文 */}
          {description && (
            <div className="k-card-excerpt">
              <p className="k-body" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {description}
              </p>
            </div>
          )}

          {/* 情報階層 4: タグ */}
          {tags && tags.length > 0 && (
            <div style={{ 
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #eeeeee'
            }}>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '12px'
              }}>
                {tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag}
                    className="k-micro k-text-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
      
      {/* 編集ボタン（開発環境のみ） */}
      {href && href.startsWith('/blog/') && process.env.NODE_ENV === 'development' && (
        <div 
          style={{ 
            position: 'absolute',
            top: '12px',
            right: '12px',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: 10
          }}
        >
          <Link
            href={`/blog/edit/${href.replace('/blog/', '')}`}
            className="k-button-outline"
            style={{
              padding: '6px 12px',
              fontSize: '11px'
            }}
            title="記事を編集"
          >
            編集
          </Link>
        </div>
      )}
    </article>
  )
}

export default KashiwaTrueCard