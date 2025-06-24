import { useState, useEffect } from 'react'
import Link from './Link'
import ThemeSwitch from './ThemeSwitch'
import headerNavLinks from '@/data/headerNavLinks'
import siteMetadata from '@/data/siteMetadata'

const ModernHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <header className={`nav-modern ${isScrolled ? 'nav-scrolled' : ''}`}>
        <div className="container-content">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* ロゴ */}
            <div className="flex items-center">
              <Link href="/" className="group flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-sapphire-500 to-teal-500 rounded-lg flex items-center justify-center shadow-colored-brand group-hover:shadow-colored-teal transition-all duration-300 group-hover:scale-105">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full opacity-80 animate-subtle-pulse" />
                </div>
                <span className="text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-sapphire-600 dark:group-hover:text-sapphire-400 transition-colors">
                  {siteMetadata.headerTitle || siteMetadata.title}
                </span>
              </Link>
            </div>

            {/* デスクトップナビゲーション */}
            <nav className="hidden lg:flex items-center space-x-1">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="relative px-4 py-2 text-stone-700 dark:text-stone-300 hover:text-sapphire-600 dark:hover:text-sapphire-400 transition-colors duration-200 font-medium group"
                >
                  <span className="relative z-10">{link.title}</span>
                  <div className="absolute inset-0 bg-sapphire-50 dark:bg-sapphire-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 origin-center" />
                </Link>
              ))}
            </nav>

            {/* 右側の要素 */}
            <div className="flex items-center space-x-4">
              {/* テーマスイッチ */}
              <ThemeSwitch />
              
              {/* 新規投稿ボタン（開発環境のみ） */}
              {process.env.NODE_ENV === 'development' && (
                <Link
                  href="/blog/new"
                  className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-sapphire-600 dark:text-sapphire-400 hover:text-sapphire-700 dark:hover:text-sapphire-300 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  記事作成
                </Link>
              )}

              {/* モバイルメニューボタン */}
              <button
                type="button"
                className="lg:hidden p-2 text-stone-700 dark:text-stone-300 hover:text-sapphire-600 dark:hover:text-sapphire-400 focus:outline-none focus:ring-2 focus:ring-sapphire-500 focus:ring-offset-2 rounded-lg transition-colors"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-label="メニューを開く"
              >
                <div className="w-6 h-6 relative">
                  <span className={`absolute left-0 top-1 w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 top-2.5' : ''}`} />
                  <span className={`absolute left-0 top-2.5 w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`absolute left-0 top-4 w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 top-2.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* プログレスバー（スクロール時） */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-200 dark:bg-stone-700">
            <div 
              className="h-full bg-gradient-to-r from-sapphire-500 to-teal-500 transition-all duration-300 ease-out"
              style={{
                width: `${Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%`
              }}
            />
          </div>
        )}
      </header>

      {/* モバイルメニューオーバーレイ */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={toggleMobileMenu} />
        
        {/* モバイルメニューコンテンツ */}
        <div className={`absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-stone-900 shadow-large transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            {/* モバイルメニューヘッダー */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-stone-900 dark:text-stone-100">メニュー</span>
              <button
                type="button"
                className="p-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 rounded-lg transition-colors"
                onClick={toggleMobileMenu}
                aria-label="メニューを閉じる"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ナビゲーションリンク */}
            <nav className="space-y-2">
              {headerNavLinks.map((link, index) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="block px-4 py-3 text-stone-700 dark:text-stone-300 hover:text-sapphire-600 dark:hover:text-sapphire-400 hover:bg-sapphire-50 dark:hover:bg-sapphire-900/20 rounded-lg transition-all duration-200 font-medium animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={toggleMobileMenu}
                >
                  {link.title}
                </Link>
              ))}
              
              {/* 開発環境での新規投稿リンク */}
              {process.env.NODE_ENV === 'development' && (
                <Link
                  href="/blog/new"
                  className="flex items-center px-4 py-3 text-sapphire-600 dark:text-sapphire-400 hover:bg-sapphire-50 dark:hover:bg-sapphire-900/20 rounded-lg transition-all duration-200 font-medium animate-slide-in-right"
                  style={{ animationDelay: `${headerNavLinks.length * 100}ms` }}
                  onClick={toggleMobileMenu}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  記事作成
                </Link>
              )}
            </nav>

            {/* モバイルメニューフッター */}
            <div className="mt-8 pt-8 border-t border-stone-200 dark:border-stone-700">
              <div className="text-sm text-stone-500 dark:text-stone-400 text-center">
                <p>&copy; 2024 {siteMetadata.title}</p>
                <p className="mt-1">思考の軌跡を辿る旅</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModernHeader