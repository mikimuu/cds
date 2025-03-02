import { useState } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import ThemeSwitch from './ThemeSwitch'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <div className="sm:hidden">
      <button
        type="button"
        className="w-8 h-8 flex items-center justify-center"
        aria-label="Toggle Menu"
        onClick={onToggleNav}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 text-cosmic-darkgray dark:text-cosmic-lightgray"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={`fixed top-0 left-0 z-50 h-full w-full transform bg-white/95 dark:bg-black/95 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
          navShow ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <ThemeSwitch />
          </div>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center"
            aria-label="Close Menu"
            onClick={onToggleNav}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-cosmic-darkgray dark:text-cosmic-lightgray"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col items-center mt-8">
          {headerNavLinks.map((link) => (
            <div key={link.title} className="py-5">
              <Link
                href={link.href}
                className="group relative py-2 px-4 inline-block"
                onClick={onToggleNav}
              >
                <span className="text-xl font-light tracking-wider text-cosmic-darkgray dark:text-cosmic-lightgray transition-colors duration-500 group-hover:text-cosmic-blue">
                  {link.title}
                </span>
                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-cosmic-blue transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default MobileNav
