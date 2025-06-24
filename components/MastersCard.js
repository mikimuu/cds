import { useState } from 'react'
import Link from './Link'
import Image from './Image'
import formatDate from '@/lib/utils/formatDate'

const MastersCard = ({ 
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
      className="m-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
        
        {/* ウィリアム・モリス：丁寧な画像配置 */}
        {imgSrc && (
          <div style={{ marginBottom: '24px', overflow: 'hidden' }}>
            <Image
              alt={title}
              src={imgSrc}
              className="m-card-image"
              style={{
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 0.4s ease'
              }}
              width={400}
              height={200}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {/* ポール・ランド + 佐藤可士和：明快な情報階層 */}
        <div className="m-card-content">
          
          {/* 情報階層 1: メタデータ */}
          {date && (
            <div className="m-card-meta">
              <time dateTime={date} className="m-caption">
                {formatDate(date)}
              </time>
            </div>
          )}

          {/* 情報階層 2: タイトル */}
          <h3 className="m-card-title">
            <span className="m-title" style={{
              borderBottom: isHovered ? '2px solid currentColor' : '2px solid transparent',
              transition: 'border-color 0.3s ease',
              paddingBottom: '2px'
            }}>
              {title}
            </span>
          </h3>

          {/* 情報階層 3: 説明文 */}
          {description && (
            <div className="m-card-excerpt">
              <p className="m-body" style={{
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
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #e8e8e8'
            }}>
              <div className="m-tags">
                {tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag}
                    className="m-tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
      
      {/* ディーター・ラムス：機能的編集ボタン（開発環境のみ） */}
      {href && href.startsWith('/blog/') && process.env.NODE_ENV === 'development' && (
        <div 
          style={{ 
            position: 'absolute',
            top: '16px',
            right: '16px',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: 10
          }}
        >
          <Link
            href={`/blog/edit/${href.replace('/blog/', '')}`}
            className="m-button-outline"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              background: 'rgba(255, 255, 255, 0.95)'
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

export default MastersCard