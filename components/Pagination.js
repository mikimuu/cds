import Link from '@/components/Link'

export default function Pagination({ totalPages, currentPage }) {
  const prevPage = parseInt(currentPage) - 1 > 0
  const nextPage = parseInt(currentPage) + 1 <= parseInt(totalPages)

  return (
    <div className="flex items-center justify-center space-x-4 pt-8">
      <nav className="flex items-center space-x-2">
        {prevPage ? (
          <Link
            href={currentPage - 1 === 1 ? `/blog/` : `/blog/page/${currentPage - 1}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-sapphire-600 dark:hover:text-sapphire-400 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            前のページ
          </Link>
        ) : (
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-stone-400 dark:text-stone-600 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg cursor-not-allowed">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            前のページ
          </div>
        )}
        
        <div className="flex items-center px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800 rounded-lg">
          <span className="font-semibold text-sapphire-600 dark:text-sapphire-400">{currentPage}</span>
          <span className="mx-2">/</span>
          <span>{totalPages}</span>
        </div>

        {nextPage ? (
          <Link
            href={`/blog/page/${currentPage + 1}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-sapphire-600 dark:hover:text-sapphire-400 transition-all duration-200"
          >
            次のページ
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-stone-400 dark:text-stone-600 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg cursor-not-allowed">
            次のページ
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </nav>
    </div>
  )
}

