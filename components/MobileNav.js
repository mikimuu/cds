import { useState, useEffect } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import ThemeSwitch from './ThemeSwitch'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(true)

  // モバイルナビゲーションの開閉処理
  const onToggleNav = () => {
    if (animationComplete) {
      setAnimationComplete(false)
      setNavShow((status) => {
        if (status) {
          document.body.style.overflow = 'auto'
        } else {
          // スクロール防止
          document.body.style.overflow = 'hidden'
        }
        return !status
      })
      // アニメーション完了後にフラグをリセット
      setTimeout(() => setAnimationComplete(true), 300)
    }
  }

  // ESCキーでメニューを閉じる機能
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && navShow) {
        onToggleNav()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [navShow])

  return (
    <div className="sm:hidden">
      <button
        type="button"
        className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md shadow-lg active:scale-95 transition-transform"
        aria-label="メニューを開く"
        onClick={onToggleNav}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-7 h-7 text-white"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={`fixed top-0 left-0 z-50 h-full w-full transform bg-black/90 backdrop-blur-lg transition-all duration-300 ease-in-out ${
          navShow ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex justify-between items-center p-5">
          <div className="flex items-center">
            <ThemeSwitch />
          </div>
          <button
            type="button"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 active:bg-white/20 transition-colors active:scale-95 transition-transform"
            aria-label="メニューを閉じる"
            onClick={onToggleNav}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-7 h-7 text-white"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col items-center mt-10 px-6">
          {headerNavLinks.map((link, index) => (
            <div 
              key={link.title} 
              className="py-5 w-full border-b border-white/10"
              style={{ 
                animationDelay: navShow ? `${index * 0.1}s` : '0s', 
                animation: navShow ? 'fadeInUp 0.4s forwards' : 'none' 
              }}
            >
              <Link
                href={link.href}
                className="block text-center text-xl font-medium tracking-wide text-white transition-colors duration-200 hover:text-cosmic-blue active:text-cosmic-blue/80 transform active:scale-98"
                onClick={onToggleNav}
              >
                {link.title}
              </Link>
            </div>
          ))}
        </nav>
      </div>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default MobileNav
