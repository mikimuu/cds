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
      <article className="max-w-content mx-auto px-4 relative z-10">
        <header className="pt-16 pb-10 text-center relative transform transition-transform hover:scale-105">
          <div className="absolute inset-0 bg-white backdrop-blur-lg rounded-lg -z-10 shadow-float-lg"></div>
          <time dateTime={date} className="text-gray-600 text-sm">
            {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
          </time>
          <h1 className="mt-4 text-h1 font-extrabold leading-tight text-gray-900">
            {title}
          </h1>
          {tags && tags.length > 0 && (
            <div className="mt-6 flex justify-center gap-2">
              {tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          )}
        </header>

        <div className="prose max-w-none mx-auto leading-relaxed bg-white backdrop-blur-lg p-8 rounded-lg 
          shadow-float-lg 
          animate-float 
          hover:shadow-2xl 
          transform transition-all 
          hover:scale-105">
          {children}
        </div>

        <footer className="mt-16 border-t border-cosmic-lightgray pt-8 bg-white backdrop-blur-lg p-8 rounded-lg shadow-float-lg transform transition-transform hover:scale-105">
          {/* 著者情報 */}
          {authorDetails.length > 0 && (
            <div className="mb-8">
              {authorDetails.map((author) => (
                <div key={author.name} className="flex items-center space-x-4">
                  {author.avatar && (
                    <Image
                      src={author.avatar}
                      alt="avatar"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{author.name}</h3>
                    {author.twitter && (
                      <Link
                        href={author.twitter}
                        className="text-cosmic-blue hover:opacity-75 transition-opacity"
                      >
                        {author.twitter.replace('https://twitter.com/', '@')}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 前後の記事リンク */}
          <nav className="flex flex-col gap-4 sm:flex-row sm:justify-between text-sm">
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="text-cosmic-blue hover:opacity-75 transition-opacity"
              >
                ← {prev.title}
              </Link>
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="text-cosmic-blue hover:opacity-75 transition-opacity sm:text-right"
              >
                {next.title} →
              </Link>
            )}
          </nav>

          {/* 関連記事 */}
          <div className="mt-16">
            <RelatedPosts currentPost={frontMatter} allPosts={allPosts} />
          </div>

          {/* コメント */}
          <div className="mt-16">
            <Comments frontMatter={frontMatter} />
          </div>

          {/* チャットボット */}
          <div className="mt-16">
            <ArticleChat articleContent={rawContent} />
          </div>
        </footer>
      </article>
    </SectionContainer>
  )
}
