import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSEO } from '@/components/SEO'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import Comments from '@/components/comments'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import RelatedPosts from '@/components/RelatedPosts'
import ArticleChat from '@/components/ArticleChat'

const editUrl = (fileName) => `${siteMetadata.siteRepo}/blob/master/data/blog/${fileName}`
const discussUrl = (slug) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `${siteMetadata.siteUrl}/blog/${slug}`
  )}`

const postDateTemplate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

export default function PostLayout({ frontMatter, authorDetails, next, prev, children, allPosts, rawContent }) {
  const { slug, fileName, date, title, images, tags } = frontMatter

  return (
    <SectionContainer>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-4 xs:pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-6 xs:space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-sm xs:text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>{new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}</time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-6 xs:pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <dl className="pb-6 xs:pb-10 pt-4 xs:pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:space-x-8 xl:block xl:space-x-0 xl:space-y-8">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-8 w-8 xs:h-10 xs:w-10 rounded-full"
                        />
                      )}
                      <dl className="whitespace-nowrap text-xs xs:text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {author.twitter.replace('https://twitter.com/', '@')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-6 xs:pb-8 pt-6 xs:pt-10 dark:prose-dark bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg p-4 xs:p-6 rounded-lg shadow-lg">
                {children}
              </div>
              {/* 記事に関するチャットコンポーネント */}
              <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300">
                <ArticleChat articleContent={rawContent} />
              </div>
              <div className="pb-4 xs:pb-6 pt-4 xs:pt-6 text-xs xs:text-sm text-gray-800 dark:text-gray-200 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg p-4 rounded-lg mt-4">
                <Link href={discussUrl(slug)} rel="nofollow">
                  {'Discuss on Twitter'}
                </Link>
                {` • `}
                <Link href={editUrl(fileName)}>{'View on GitHub'}</Link>
              </div>
              {siteMetadata.comments && (
                <div className="pb-4 xs:pb-6 pt-4 xs:pt-6 text-center text-gray-800 dark:text-gray-200 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg p-4 rounded-lg mt-4" id="comment">
                  <Comments frontMatter={frontMatter} />
                </div>
              )}
            </div>
            <footer>
              <div className="divide-gray-200 text-xs xs:text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg p-4 rounded-lg">
                {tags && (
                  <div className="py-3 xs:py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-between py-3 xs:py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Previous Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/blog/${prev.slug}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/blog/${next.slug}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-3 xs:pt-4 xl:pt-8">
                <Link
                  href="/blog"
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div>
              {/* 関連記事セクション */}
              <div className="mt-6 xs:mt-10 pt-6 xs:pt-10 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg p-4 rounded-lg">
                <RelatedPosts currentPost={frontMatter} allPosts={allPosts} />
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
