import Link from './Link'
import Tag from './Tag'
import siteMetadata from '@/data/siteMetadata'
import Image from './Image'
import formatDate from '@/lib/utils/formatDate'

const Card = ({ title, description, imgSrc, href, date, tags }) => (
  <div className="p-2 xs:p-3 sm:p-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/3 group" style={{ maxWidth: '544px' }}>
    <div
      className={`${
        imgSrc && 'h-full'
      } overflow-hidden rounded-lg bg-white/80 dark:bg-black/80 backdrop-blur-lg 
      shadow-float-lg hover:shadow-2xl hover:shadow-glow
      transition-all duration-300 
      animate-float
      hover:scale-105 transform
      border border-transparent hover:border-primary-500/30 dark:hover:border-primary-400/30 
      relative z-10`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center h-40 xs:h-44 sm:h-36 md:h-40 lg:h-48 w-full transition-transform duration-300 group-hover:scale-105"
              width={544}
              height={306}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 544px"
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center h-40 xs:h-44 sm:h-36 md:h-40 lg:h-48 w-full transition-transform duration-300 group-hover:scale-105"
            width={544}
            height={306}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 544px"
          />
        ))}
      <div className="p-3 xs:p-4 sm:p-6 backdrop-blur-sm bg-white/40 dark:bg-black/40">
        <h2 className="mb-2 xs:mb-3 text-lg xs:text-xl sm:text-2xl font-bold leading-tight xs:leading-8 tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`} className="text-gray-900 dark:text-gray-100">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <div className="flex flex-wrap">
          {tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
        <p className="prose mb-3 max-w-none text-sm xs:text-base text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{description}</p>
        {date && (
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="text-xs xs:text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">
              <time dateTime={date}>{formatDate(date)}</time>
            </dd>
          </dl>
        )}
        {href && (
          <Link
            href={href}
            className="text-sm xs:text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1 transition-all duration-300 hover:gap-2"
            aria-label={`Link to ${title}`}
          >
            Learn more <span className="transition-transform duration-300">&rarr;</span>
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
