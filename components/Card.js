import Link from './Link'
import Tag from './Tag'
import siteMetadata from '@/data/siteMetadata'
import Image from './Image'
import formatDate from '@/lib/utils/formatDate'

const Card = ({ title, description, imgSrc, href, date, tags }) => (
  <div className="p-2 xs:p-3 sm:p-4 w-full md:w-1/2 lg:w-1/3" style={{ maxWidth: '100%' }}>
    <div
      className={`${
        imgSrc && 'h-full'
      } overflow-hidden rounded-lg bg-black/60 backdrop-blur-md 
      shadow-md hover:shadow-lg
      transition-all duration-300 
      hover:translate-y-[-4px] transform
      border border-white/10 hover:border-white/20`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center h-48 w-full"
              width={544}
              height={306}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
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
        ))}
      <div className="p-4">
        {date && (
          <div className="mb-2">
            <time dateTime={date} className="text-xs font-medium text-white/70">
              {formatDate(date)}
            </time>
          </div>
        )}
        <h2 className="mb-2 text-lg font-bold leading-tight tracking-tight text-white">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="mb-3 text-sm text-white/80 leading-relaxed line-clamp-3">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          {href && (
            <Link
              href={href}
              className="text-sm font-medium text-cosmic-blue hover:opacity-80 inline-flex items-center gap-1"
              aria-label={`Link to ${title}`}
            >
              続きを読む <span>&rarr;</span>
            </Link>
          )}
          {href && href.startsWith('/blog/') && process.env.NODE_ENV === 'development' && (
            <Link
              href={`/blog/edit/${href.replace('/blog/', '')}`}
              className="text-xs text-cosmic-star hover:opacity-80 inline-flex items-center gap-1 px-2 py-1 bg-cosmic-purple/20 rounded-full"
              aria-label={`Edit ${title}`}
            >
              ✏️ 編集
            </Link>
          )}
        </div>
      </div>
    </div>
  </div>
)

export default Card
