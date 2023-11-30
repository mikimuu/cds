import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'

import NewsletterForm from '@/components/NewsletterForm'

const MAX_DISPLAY = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

export default function Home({ posts }) {
  return (
    <div className="neobrutalism-container">
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <h1 className="neobrutalism-title">
        あわわわ
      </h1>
      <p className="neobrutalism-description">
        {siteMetadata.description}
      </p>
      <div className="neobrutalism-posts">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
          const { slug, date, title, summary, tags } = frontMatter
          return (
            <article key={slug} className="neobrutalism-post">
              <time dateTime={date} className="neobrutalism-date">{formatDate(date)}</time>
              <h2 className="neobrutalism-post-title">
                <Link href={`/blog/${slug}`}>
                  {title}
                </Link>
              </h2>
              <p className="neobrutalism-summary">
                {summary}
              </p>
              <Link href={`/blog/${slug}`} className="neobrutalism-readmore">
                Read more &rarr;
              </Link>
            </article>
          )
        })}
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="neobrutalism-more-posts">
          <Link href="/blog" aria-label="all posts">
            All Posts &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}
