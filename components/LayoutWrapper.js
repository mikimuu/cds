import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/20.svg'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'

const LayoutWrapper = ({ children }) => {
  return (
    <SectionContainer className="bg-brsky-blue text-brblue">
      <header className="bg-brgreen p-5 border-b-4 border-brgreen dark:bg-brsoftblue">
        <h1 className="text-4xl font-bold text-brorange">
          {siteMetadata.title}
        </h1>
        <div className="my-5">
         <Logo className="h-full w-full" />
        </div>
        <nav className="flex justify-between">
          {headerNavLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-2xl font-bold text-bryellow px-2"
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="text-3xl font-bold text-brviolet rotate-12 py-12 px-14">
          日記を書いています
        </div>
        <div className="mt-5">
          <ThemeSwitch />
        </div>
      </header>
      <main className="p-5">
        {children}
      </main>
      <Footer className="bg-brcyan p-5 border-t-4 border-brred" />
    </SectionContainer>
  )
}

export default LayoutWrapper

