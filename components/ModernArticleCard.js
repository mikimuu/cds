import { useState } from 'react'
import Link from './Link'
import Tag from './Tag'
import Image from './Image'
import formatDate from '@/lib/utils/formatDate'

const ModernArticleCard = ({ 
  title, 
  description, 
  imgSrc, 
  href, 
  date, 
  tags, 
  readingTime,
  variant = 'default', // default, featured, minimal, editorial
  author
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const getCardClasses = () => {
    const baseClasses = "group relative transition-all duration-300 hover-lift"
    
    switch (variant) {
      case 'featured':
        return `${baseClasses} card-featured card-editorial col-span-full lg:col-span-2 row-span-2`
      case 'minimal':
        return `${baseClasses} card-editorial`
      case 'editorial':
        return `${baseClasses} card-editorial lg:col-span-2`
      default:
        return `${baseClasses} card-editorial`
    }
  }

  const getImageHeight = () => {
    switch (variant) {
      case 'featured':
        return 'h-64 lg:h-80'
      case 'editorial':
        return 'h-56'
      default:
        return 'h-48'
    }
  }

  const getTitleClasses = () => {
    switch (variant) {
      case 'featured':
        return 'text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-sapphire-600 dark:group-hover:text-sapphire-400'
      case 'editorial':
        return 'text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-sapphire-600 dark:group-hover:text-sapphire-400'
      default:
        return 'text-lg font-semibold text-stone-900 dark:text-stone-100 group-hover:text-sapphire-600 dark:group-hover:text-sapphire-400'
    }
  }

  const getDescriptionLines = () => {
    switch (variant) {
      case 'featured':
        return 'line-clamp-4'
      case 'editorial':
        return 'line-clamp-3'
      default:
        return 'line-clamp-2'
    }
  }

  return (
    <article 
      className={getCardClasses()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 背景のアクセント */}
      {variant === 'featured' && (
        <div className="absolute inset-0 bg-gradient-to-br from-sapphire-50/50 to-teal-50/50 dark:from-sapphire-900/10 dark:to-teal-900/10 rounded-2xl" />
      )}

      {/* 画像セクション */}
      {imgSrc && (
        <div className={`relative overflow-hidden rounded-xl mb-6 ${getImageHeight()}`}>
          <Link href={href} aria-label={`「${title}」を読む`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              width={600}
              height={400}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* 画像オーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* 読書時間バッジ */}
            {readingTime && (
              <div className="absolute top-4 right-4 px-2 py-1 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300">
                {readingTime}
              </div>
            )}
          </Link>
        </div>
      )}

      {/* コンテンツセクション */}
      <div className="relative z-10 space-y-4">
        {/* メタデータ */}
        <div className="flex items-center justify-between text-sm text-stone-500 dark:text-stone-400">
          {date && (
            <time dateTime={date} className="font-medium">
              {formatDate(date)}
            </time>
          )}
          
          {author && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-sapphire-400 to-teal-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {author.name?.charAt(0) || 'A'}
                </span>
              </div>
              <span className="font-medium">{author.name || 'Author'}</span>
            </div>
          )}
        </div>

        {/* タイトル */}
        <div>
          <h3 className={`${getTitleClasses()} transition-colors duration-200`}>
            <Link href={href} aria-label={`「${title}」を読む`}>
              <span className="bg-gradient-to-r from-current to-current bg-[length:0%_2px] bg-left-bottom bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                {title}
              </span>
            </Link>
          </h3>
        </div>

        {/* 説明文 */}
        {description && (
          <p className={`text-stone-600 dark:text-stone-300 leading-relaxed ${getDescriptionLines()}`}>
            {description}
          </p>
        )}

        {/* タグ */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, variant === 'featured' ? 5 : 3).map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
            {tags.length > (variant === 'featured' ? 5 : 3) && (
              <span className="px-2 py-1 text-xs font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-full">
                +{tags.length - (variant === 'featured' ? 5 : 3)}
              </span>
            )}
          </div>
        )}

        {/* アクションエリア */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href={href}
            className="inline-flex items-center text-sapphire-600 dark:text-sapphire-400 hover:text-sapphire-700 dark:hover:text-sapphire-300 font-medium transition-colors group/link"
          >
            <span>続きを読む</span>
            <svg 
              className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          {/* 編集ボタン（開発環境のみ） */}
          {href && href.startsWith('/blog/') && process.env.NODE_ENV === 'development' && (
            <Link
              href={`/blog/edit/${href.replace('/blog/', '')}`}
              className="inline-flex items-center px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-full transition-all duration-200"
              title="記事を編集"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              編集
            </Link>
          )}
        </div>
      </div>

      {/* ホバーエフェクト用のアクセント */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 rounded-2xl shadow-large opacity-50" />
        {variant === 'featured' && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-200/30 to-transparent rounded-full blur-2xl" />
        )}
      </div>
    </article>
  )
}

export default ModernArticleCard