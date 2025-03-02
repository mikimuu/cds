import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { useState } from 'react'
import Pagination from '@/components/Pagination'
import formatDate from '@/lib/utils/formatDate'

export default function ListLayout({ posts, title, initialDisplayPosts = [], pagination }) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((frontMatter) => {
    const searchContent = frontMatter.title + frontMatter.summary + (frontMatter.tags || []).join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-3 xs:pt-4 sm:pt-6 pb-4 xs:pb-6 sm:pb-8 md:space-y-5">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:leading-10 md:text-4xl lg:text-5xl xl:text-6xl md:leading-14">
            {title}
          </h1>
          <div className="relative max-w-lg">
            <input
              aria-label="Search articles"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search articles"
              className="block w-full rounded-lg border border-gray-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 xs:px-4 py-2 xs:py-3 sm:py-2 text-sm xs:text-base text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:text-gray-100 transition-all duration-300 focus:shadow-lg"
            />
            <svg
              className="absolute right-3 top-2 xs:top-3 h-4 xs:h-5 w-4 xs:w-5 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <ul className="space-y-3 xs:space-y-4 sm:space-y-6">
          {!filteredBlogPosts.length && 'No posts found.'}
          {displayPosts.map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
            return (
              <li key={slug} className="py-3 xs:py-4 group">
                <article className="space-y-2 sm:space-y-3 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg p-3 xs:p-4 sm:p-6 rounded-lg shadow-lg hover:transform hover:translate-y-[-4px] hover:shadow-2xl transition-all duration-300 relative z-10 border border-transparent hover:border-primary-500/30 dark:hover:border-primary-400/30">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-xs xs:text-sm sm:text-base font-medium leading-6 text-gray-500 dark:text-gray-400 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full bg-gray-100/50 dark:bg-gray-800/50 inline-block">
                      <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-2 xs:space-y-3 xl:col-span-3">
                    <div>
                      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold leading-tight xs:leading-8 tracking-tight group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
                        <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-400">
                          {title}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap gap-1 xs:gap-2 mt-2 xs:mt-3">
                        {(tags || []).map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                    </div>
                    <div className="prose max-w-none text-sm xs:text-base text-gray-500 dark:text-gray-400 leading-relaxed backdrop-blur-sm rounded-lg line-clamp-2 xs:line-clamp-3 sm:line-clamp-none">
                      {summary}
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
