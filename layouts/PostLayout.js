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
    <SectionContainer className="bg-brsky-blue dark:bg-gray-800">
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <ScrollTopAndComment />
      <article className="text-brblue dark:text-gray-100">
        <header className="pt-6 xl:pb-6 text-center border-b-4 border-brgreen">
          <time dateTime={date} className="text-lg font-bold">
            {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
          </time>
          <h1 className="text-5xl font-extrabold mt-4 bg-brorange text-white p-3 inline-block">
            {title}
          </h1>
        </header>
        <div className="xl:grid xl:grid-cols-4 xl:gap-x-6">
          <aside className="pt-6 xl:pt-11 bg-brsoftblue p-4">
            <ul className="flex flex-col space-y-4">
              {authorDetails.map((author) => (
                <li key={author.name} className="bg-white p-2 rounded-lg shadow-lg">
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
                    <span className="block font-bold">{author.name}</span>
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
          <div className="xl:col-span-3 bg-white p-5 rounded-lg shadow-lg">
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
          <footer className="xl:col-start-1 xl:row-start-2 bg-brviolet p-4 rounded-lg shadow-lg mt-6 xl:mt-0">
            {tags && (
              <div className="py-4">
                <h2 className="text-xs uppercase tracking-wide text-white">
                  Tags
                </h2>
                <div className="flex flex-wrap">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} className="bg-white text-brblue p-1 rounded-md m-1" />
                  ))}
                </div>
              </div>
            )}
            {(next || prev) && (
              <div className="flex flex-col space-y-4">
                {prev && (
                  <div>
                    <h2 className="text-xs uppercase tracking-wide text-white">
                      Previous Article
                    </h2>
                    <Link href={`/blog/${prev.slug}`} className="text-brblue hover:text-brsoftblue">
                      {prev.title}
                    </Link>
                  </div>
                )}
                {next && (
                  <div>
                    <h2 className="text-xs uppercase tracking-wide text-white">
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
