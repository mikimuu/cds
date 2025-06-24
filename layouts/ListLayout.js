import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { useState } from 'react'
import Pagination from '@/components/Pagination'
import formatDate from '@/lib/utils/formatDate'
import KashiwaArticleCard from '@/components/KashiwaArticleCard'

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
    <section className="section-modern bg-white dark:bg-stone-900">
      <div className="container-content">
        {/* ヘッダーセクション */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-6">
            {title}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto mb-8">
            記事を検索して、興味のあるトピックを見つけてください
          </p>
          
          {/* 検索ボックス */}
          <div className="relative max-w-md mx-auto">
            <input
              aria-label="記事を検索"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="記事を検索..."
              className="input-modern pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400 dark:text-stone-500"
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
          
          {searchValue && (
            <div className="mt-4 text-sm text-stone-500 dark:text-stone-400">
              「{searchValue}」の検索結果: {filteredBlogPosts.length}件
            </div>
          )}
        </div>

        {/* 記事一覧 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {!filteredBlogPosts.length && (
            <div className="col-span-full text-center py-16">
              <div className="space-y-4">
                <svg className="w-16 h-16 mx-auto text-stone-300 dark:text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium text-stone-500 dark:text-stone-400">
                  {searchValue ? '検索結果が見つかりませんでした' : '記事が見つかりません'}
                </p>
                {searchValue && (
                  <button
                    onClick={() => setSearchValue('')}
                    className="text-sapphire-600 dark:text-sapphire-400 hover:text-sapphire-700 dark:hover:text-sapphire-300 font-medium transition-colors"
                  >
                    検索をクリア
                  </button>
                )}
              </div>
            </div>
          )}
          {displayPosts.map((frontMatter, index) => {
            const { slug, date, title, summary, tags, images } = frontMatter
            const postPath = `/blog/${slug}`
            
            return (
              <div 
                key={slug}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <KashiwaArticleCard
                  title={title}
                  description={summary}
                  imgSrc={images?.[0] || null}
                  href={postPath}
                  date={date}
                  tags={tags}
                  variant="default"
                />
              </div>
            )
          })}
        </div>

        {/* ページネーション */}
        {pagination && pagination.totalPages > 1 && !searchValue && (
          <div className="mt-16">
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          </div>
        )}
      </div>
    </section>
  )
}
