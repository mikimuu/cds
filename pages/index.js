import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'

const MAX_DISPLAY = 5

export async function getStaticProps() {
  const localPosts = await getAllFilesFrontMatter('blog')
  const allPosts = localPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return { props: { posts: allPosts } }
}

export default function Home({ posts }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="space-y-12 md:space-y-16">
        {/* ウェルカムメッセージ */}
        <section className="text-center">
          <h2 className="text-h2 mb-4 text-white">Welcome to cosmic dance</h2>
          <p className="max-w-lg mx-auto text-body text-white">
            宇宙的舞踏
          </p>
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </section>

        {/* 最新記事セクション */}
        <section>
          <h2 className="text-h2 mb-8 text-white">Latest Articles</h2>

          <div className="grid gap-4 md:gap-8">
            {!posts.length && 'No posts found.'}
            {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
              const { slug, date, title, summary, tags } = frontMatter
              const postPath = `/blog/${slug}`

              return (
                <article
                  key={slug}
                  className="
                    bg-white/10 backdrop-blur-md
                    border border-white/20
                    rounded shadow-card 
                    p-4 md:p-8 transition-transform hover:-translate-y-1
                  "
                >
                  <time dateTime={date} className="text-xs md:text-sm text-white/80">
                    {formatDate(date)}
                  </time>
                  <h3 className="text-lg md:text-xl font-bold mt-2 mb-2 md:mb-3 text-white">
                    <Link href={postPath} className="hover:text-cosmic-blue transition-colors">
                      {title}
                    </Link>
                  </h3>
                  <p className="text-white/90 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                    {summary}
                  </p>
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  )}
                  <Link
                    href={postPath}
                    className="inline-block text-cosmic-blue hover:opacity-75 transition-opacity text-sm md:text-base"
                  >
                    続きを読む →
                  </Link>
                </article>
              )
            })}
          </div>

          {posts.length > MAX_DISPLAY && (
            <div className="mt-8 md:mt-12 text-center">
              <Link
                href="/blog"
                className="
                  inline-block bg-cosmic-blue text-white
                  px-6 md:px-8 py-2 md:py-3 rounded text-sm md:text-base
                  hover:opacity-90 transition-opacity
                "
              >
                すべての記事を見る
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  )
}