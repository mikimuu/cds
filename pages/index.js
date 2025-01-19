import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'

import NewsletterForm from '@/components/NewsletterForm'

const MAX_DISPLAY = 5

export async function getStaticProps() {
  const localPosts = await getAllFilesFrontMatter('blog')
  
  // ローカルの記事とCMSの記事を結合してソート
  const allPosts = localPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return { props: { posts: allPosts } }
}

export default function Home({ posts }) {
  return (
    <div className="bg-brgreen text-gray-800 p-5 dark:bg-brsoftblue">
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <h1 className="text-3xl font-bold text-brorange uppercase sm:text-4xl">
        あわわわ
      </h1>
      <p className="text-xl mb-5 sm:text-2xl">
        {siteMetadata.description}
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
          const { slug, date, title, summary, tags } = frontMatter
          const postPath = slug.startsWith('cms/') ? `/blog/${slug}` : `/blog/${slug}`
          return (
            <article key={slug} className="bg-white p-4 border-4 border-black">
              <time dateTime={date} className="text-lg">{formatDate(date)}</time>
              <h2 className="text-2xl font-bold mt-2.5">
                <Link href={postPath}>
                  {title}
                </Link>
              </h2>
              <p className="text-lg mt-2.5">
                {summary}
              </p>
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              )}
              <Link href={postPath} className="block mt-4 font-bold text-brorange">
                Read more &rarr;
              </Link>
            </article>
          )
        })}
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="mt-7 text-right">
          <Link href="/blog" aria-label="all posts" className="font-bold text-brorange">
            All Posts &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}
