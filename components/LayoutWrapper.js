import React from 'react'
import Footer from './Footer'
import ModernHeader from './ModernHeader'

const LayoutWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      {/* レイアウトコンテナ */}
      <div className="flex flex-col min-h-screen">
        <ModernHeader />
        <main className="flex-1 pt-16 lg:pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default LayoutWrapper
