import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="md p-4 md:w-1/2 group" style={{ maxWidth: '544px' }}>
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
              className="object-cover object-center md:h-36 lg:h-48 transition-transform duration-300 group-hover:scale-105"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48 transition-transform duration-300 group-hover:scale-105"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6 backdrop-blur-sm bg-white/40 dark:bg-black/40">
        <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`} className="text-gray-900 dark:text-gray-100">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
        {href && (
          <Link
            href={href}
            className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1 transition-all duration-300 hover:gap-2"
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
