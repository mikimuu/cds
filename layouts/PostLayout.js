import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSEO } from '@/components/SEO'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import Comments from '@/components/comments'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

const editUrl = (fileName) => `${siteMetadata.siteRepo}/blob/master/data/blog/${fileName}`
const discussUrl = (slug) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `${siteMetadata.siteUrl}/blog/${slug}`
  )}`

const postDateTemplate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
export default function PostLayout({ frontMatter, authorDetails, next, prev, children }) {
  const { slug, fileName, date, title, images, tags } = frontMatter

  return (
    <SectionContainer className="bg-gray-100 dark:bg-gray-800">
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <ScrollTopAndComment />
      <article className="text-gray-900 dark:text-gray-100">
        <header className="pt-6 xl:pb-6 text-center border-b-4 border-brgreen">
          <time dateTime={date} className="text-lg font-bold">
            {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
          </time>
          <h1 className="text-4xl font-bold mt-4">{title}</h1>
        </header>
        <div className="xl:grid xl:grid-cols-4 xl:gap-x-6">
          <aside className="pt-6 xl:pt-11">
            <ul className="flex justify-center xl:block">
              {authorDetails.map((author) => (
                <li key={author.name} className="mb-4 xl:mb-8">
                  {author.avatar && (
                    <Image
                      src={author.avatar}
                      width="38px"
                      height="38px"
                      alt="avatar"
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div className="text-sm font-medium mt-2">
                    <span className="block">{author.name}</span>
                    {author.twitter && (
                      <Link
                        href={author.twitter}
                        className="text-brblue hover:text-brsoftblue"
                      >
                        {author.twitter.replace('https://twitter.com/', '@')}
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
          <div className="xl:col-span-3">
            <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">{children}</div>
            <div className="pt-6 pb-6 text-sm">
              <Link href={discussUrl(slug)} rel="nofollow" className="text-brblue hover:text-brsoftblue">
                {'Discuss on Twitter'}
              </Link>
              {` • `}
              <Link href={editUrl(fileName)} className="text-brblue hover:text-brsoftblue">
                {'View on GitHub'}
              </Link>
            </div>
            <Comments frontMatter={frontMatter} />
          </div>
          <footer className="xl:col-start-1 xl:row-start-2">
            {tags && (
              <div className="py-4 xl:py-8">
                <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Tags
                </h2>
                <div className="flex flex-wrap">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              </div>
            )}
            {(next || prev) && (
              <div className="flex justify-between py-4 xl:block xl:space-y-8">
                {prev && (
                  <div>
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Previous Article
                    </h2>
                    <Link href={`/blog/${prev.slug}`} className="text-brblue hover:text-brsoftblue">
                      {prev.title}
                    </Link>
                  </div>
                )}
                {next && (
                  <div>
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Next Article
                    </h2>
                    <Link href={`/blog/${next.slug}`} className="text-brblue hover:text-brsoftblue">
                      {next.title}
                    </Link>
                  </div>
                )}
              </div>
            )}
            <div className="pt-4">
              <Link
                href="/blog"
                className="text-brblue hover:text-brsoftblue"
              >
                &larr; Back to the blog
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </SectionContainer>
  )
}

