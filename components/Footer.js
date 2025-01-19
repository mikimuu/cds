import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4"></div>
        <div className="mb-2 flex space-x-2 text-sm text-cosmic-gray">
          <div>
            <Link href="/" className="hover:text-cosmic-blue transition-colors">
              {siteMetadata.title}
            </Link>
          </div>
          <div>{` • `}</div>
          <Link href="/" className="hover:text-cosmic-blue transition-colors">
            {siteMetadata.title}
          </Link>
        </div>
      </div>
    </footer>
  )
}
