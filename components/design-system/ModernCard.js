import Link from '../Link'
import Tag from '../Tag'
import Image from '../Image'
import formatDate from '@/lib/utils/formatDate'
import { useState } from 'react'

const ModernCard = ({ title, description, imgSrc, href, date, tags, variant = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false)

  const variants = {
    default: 'glass-effect',
    featured: 'featured-card',
    minimal: 'minimal-card',
    bento: 'bento-card'
  }

  const getCardClasses = () => {
    const baseClasses = `
      group relative overflow-hidden transition-all duration-500 ease-out
      transform hover:scale-[1.02] hover:-translate-y-2
      cursor-pointer
    `
    
    switch (variant) {
      case 'featured':
        return `${baseClasses} 
          bg-gradient-to-br from-cosmic-purple/20 via-cosmic-dark/80 to-black/90
          backdrop-blur-xl border border-cosmic-star/30
          shadow-[0_20px_60px_rgba(83,52,131,0.3)] hover:shadow-[0_30px_80px_rgba(83,52,131,0.5)]
          rounded-2xl p-6 h-full
        `
      case 'minimal':
        return `${baseClasses}
          bg-white/5 backdrop-blur-md
          border border-white/10 hover:border-white/20
          shadow-lg hover:shadow-xl
          rounded-xl p-5 h-full
        `
      case 'bento':
        return `${baseClasses}
          bg-gradient-to-br from-cosmic-dark/70 to-cosmic-mid/50
          backdrop-blur-lg border border-cosmic-purple/20
          shadow-cosmic-lg hover:shadow-cosmic-glow
          rounded-3xl p-4 h-full
        `
      default:
        return `${baseClasses}
          glass-morphism
          rounded-2xl p-5 h-full
        `
    }
  }

  return (
    <div className="w-full">
      <article
        className={getCardClasses()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 背景グラデーションエフェクト */}
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-star/5 via-transparent to-cosmic-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* 画像セクション */}
        {imgSrc && (
          <div className="relative mb-4 overflow-hidden rounded-xl">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                <div className="relative group/image">
                  <Image
                    alt={title}
                    src={imgSrc}
                    className="object-cover object-center h-48 w-full transition-transform duration-700 group-hover/image:scale-110"
                    width={544}
                    height={306}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  {/* 画像オーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            ) : (
              <Image
                alt={title}
                src={imgSrc}
                className="object-cover object-center h-48 w-full"
                width={544}
                height={306}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            )}
          </div>
        )}

        {/* コンテンツセクション */}
        <div className="relative z-10">
          {/* 日付 */}
          {date && (
            <div className="mb-3">
              <time 
                dateTime={date} 
                className="text-xs font-medium text-cosmic-star/80 tracking-wider uppercase"
              >
                {formatDate(date)}
              </time>
            </div>
          )}

          {/* タイトル */}
          <h2 className={`
            mb-3 font-bold leading-tight tracking-tight text-white
            transition-colors duration-300
            ${variant === 'featured' ? 'text-xl md:text-2xl' : 'text-lg'}
            ${isHovered ? 'text-cosmic-star' : ''}
          `}>
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                <span className="bg-gradient-to-r from-white to-cosmic-star bg-clip-text text-transparent group-hover:from-cosmic-star group-hover:to-white transition-all duration-500">
                  {title}
                </span>
              </Link>
            ) : (
              title
            )}
          </h2>

          {/* 説明 */}
          <p className="mb-4 text-sm text-white/80 leading-relaxed line-clamp-3 group-hover:text-white/90 transition-colors duration-300">
            {description}
          </p>

          {/* タグ */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-cosmic-star/70 px-2 py-1">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* アクションエリア */}
          <div className="flex items-center justify-between mt-auto">
            {href && (
              <Link
                href={href}
                className="group/link inline-flex items-center gap-2 text-sm font-medium text-cosmic-blue hover:text-cosmic-star transition-colors duration-300"
                aria-label={`Link to ${title}`}
              >
                続きを読む
                <span className="transform transition-transform duration-300 group-hover/link:translate-x-1">
                  →
                </span>
              </Link>
            )}
            
            {href && href.startsWith('/blog/') && process.env.NODE_ENV === 'development' && (
              <Link
                href={`/blog/edit/${href.replace('/blog/', '')}`}
                className="inline-flex items-center gap-1 text-xs text-cosmic-star/80 hover:text-cosmic-star px-3 py-1.5 bg-cosmic-purple/20 hover:bg-cosmic-purple/30 rounded-full transition-all duration-300"
                aria-label={`Edit ${title}`}
              >
                <span className="text-sm">✏️</span>
                編集
              </Link>
            )}
          </div>
        </div>

        {/* ホバーエフェクト用の装飾 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cosmic-star/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-16 -translate-y-16" />
      </article>
    </div>
  )
}

export default ModernCard