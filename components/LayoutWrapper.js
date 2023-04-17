import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'

const LayoutWrapper = ({ children }) => {
  return (
    <SectionContainer>
      <div className=''>
        <header className=" ">
          <div className="  h-auto w-auto">
            <h1 className="text-3xl font-mono leading-9 py-4 tracking-widest text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 hover:animate-bounce">
              {siteMetadata.title}
            </h1>
            <div className="flex py-0 md:py-10 md:px-36 hover:animate-pulse">
              
                <Logo />
              
            </div>
            <div className=' flex place-content-between shadow-md'>
            <span className="flex-initial place-items-center">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-xl font-mono text-gray-900 dark:text-gray-100 sm:p-4"
                >
                  {link.title}
                </Link>
              ))}
            </span>
            <div className="text-3xl font-extralight text-gray-500 transform rotate-12 ">
              日記を書いています
            </div>
            <div className="px-10">
              <ThemeSwitch />
            </div>
            </div>
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
