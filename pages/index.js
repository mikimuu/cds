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

      {/* ===== メインラッパ: 余白＆背景演出 ===== */}
      <main className="relative overflow-hidden">
        {/* --- ヒーローセクション --- */}
      

        {/* --- メインコンテンツ: Latest Articlesなど --- */}
        <div className="max-w-6xl mx-auto px-8 pb-16">
          {/* ウェルカムメッセージ */}
          <section className="my-section-y text-center">
            <h2 className="text-h2 mb-4">Welcome to cosmic dance</h2>
            <p className="max-w-lg mx-auto text-body">
              宇宙的舞踏
            </p>

            {/* セクション下部の細い線 */}
            <div className="mt-6 h-px bg-gradient-to-r from-transparent via-cosmic-lightgray to-transparent"></div>
          </section>

          {/* 最新記事セクション */}
          <section className="my-section-y">
            <h2 className="text-h2 mb-8">Latest Articles</h2>

            <div className="grid gap-8">
              {!posts.length && 'No posts found.'}
              {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
                const { slug, date, title, summary, tags } = frontMatter
                const postPath = `/blog/${slug}`

                return (
                  <article
                    key={slug}
                    className="
                      bg-white dark:bg-[#1a1a1a]
                      border border-cosmic-lightgray dark:border-[#333]
                      rounded shadow-card 
                      p-8 transition-transform hover:-translate-y-1
                    "
                  >
                    <time dateTime={date} className="text-sm dark-text-secondary">
                      {formatDate(date)}
                    </time>
                    <h3 className="text-xl font-bold mt-2 mb-3 text-cosmic-black dark:text-white">
                      <Link href={postPath} className="hover:text-cosmic-blue transition-colors">
                        {title}
                      </Link>
                    </h3>
                    <p className="dark-text-bright leading-relaxed mb-4">
                      {summary}
                    </p>
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                    )}
                    <Link
                      href={postPath}
                      className="inline-block text-cosmic-blue hover:opacity-75 transition-opacity"
                    >
                      続きを読む →
                    </Link>
                  </article>
                )
              })}
            </div>

            {posts.length > MAX_DISPLAY && (
              <div className="mt-12 text-center">
                <Link
                  href="/blog"
                  className="
                    inline-block bg-cosmic-blue text-white
                    px-8 py-3 rounded 
                    hover:opacity-90 transition-opacity
                  "
                >
                  すべての記事を見る
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  )
}