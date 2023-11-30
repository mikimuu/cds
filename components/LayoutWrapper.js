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
    <SectionContainer className="bg-brblue text-gray-100">
      <header className="p-5 border-b-4 border-brgreen">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          {siteMetadata.title}
        </h1>
        <div className="my-3 md:my-5">
          <Logo />
        </div>
        <nav className="flex justify-between">
          {headerNavLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-lg md:text-xl lg:text-2xl font-medium px-2"
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="text-2xl md:text-3xl font-medium rotate-12">
          日記を書いています
        </div>
        <div className="mt-3 md:mt-5">
          <ThemeSwitch />
        </div>
      </header>
      <main className="p-5">
        {children}
      </main>
      <Footer className="p-5 border-t-4 border-brred" />
    </SectionContainer>
  )
}

export default LayoutWrapper
