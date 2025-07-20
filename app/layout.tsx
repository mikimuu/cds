import './globals.css'
import type { Metadata } from 'next'
import { M_PLUS_1p, Noto_Sans_JP, JetBrains_Mono } from 'next/font/google'
import siteMetadata from '@/data/siteMetadata'

// Phase 2: 最適化されたフォント読み込み戦略
const mPlus1p = M_PLUS_1p({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-m-plus-1p',
  preload: true, // 主要フォントとしてプリロード
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
  preload: false, // フォールバックとして使用
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  preload: false, // コードブロック用
})

export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  keywords: ['ブログ', '日記', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.author,
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteMetadata.siteUrl,
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.title,
    images: [
      {
        url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
        width: 1200,
        height: 630,
        alt: siteMetadata.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${mPlus1p.variable} ${notoSansJP.variable} ${jetBrainsMono.variable}`}>
      <head>
        {/* Phase 2: フォント最適化プリロード */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;500;700&display=swap&subset=japanese" 
          as="style"
        />
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap&subset=japanese" 
          as="style"
        />
      </head>
      <body className="min-h-screen bg-white text-typography-primary antialiased font-sans">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-primary-200 bg-white/80 backdrop-blur-sm">
            <div className="container-wide">
              <nav className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h1 className="typography-h2 text-accent-editorial">
                    {siteMetadata.headerTitle}
                  </h1>
                </div>
                <div className="flex items-center space-x-6">
                  <a 
                    href="/blog"
                    className="typography-body font-medium text-typography-secondary hover:text-typography-primary transition-colors"
                  >
                    Blog
                  </a>
                  <a 
                    href="/about"
                    className="typography-body font-medium text-typography-secondary hover:text-typography-primary transition-colors"
                  >
                    About
                  </a>
                  <a 
                    href="/admin"
                    className="typography-body font-medium text-accent-editorial hover:text-blue-700 transition-colors"
                  >
                    Admin
                  </a>
                </div>
              </nav>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="border-t border-primary-200 bg-primary-50">
            <div className="container-wide py-8">
              <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                <div className="typography-caption">
                  © {new Date().getFullYear()} {siteMetadata.author}. All rights reserved.
                </div>
                <div className="flex space-x-4">
                  <a 
                    href={siteMetadata.github}
                    className="typography-caption text-typography-secondary hover:text-typography-primary transition-colors"
                  >
                    GitHub
                  </a>
                  <a 
                    href={siteMetadata.twitter}
                    className="typography-caption text-typography-secondary hover:text-typography-primary transition-colors"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}