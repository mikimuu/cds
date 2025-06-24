import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import MastersHero from '@/components/MastersHero'
import MastersCard from '@/components/MastersCard'
import { useState, useEffect } from 'react'

const MAX_DISPLAY = 5

export async function getStaticProps() {
  const localPosts = await getAllFilesFrontMatter('blog')
  const allPosts = localPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return { props: { posts: allPosts } }
}

export default function Home({ posts }) {
  const [isMounted, setIsMounted] = useState(false)
  
  // クライアントサイドレンダリングを確実にするための処理
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      
      {/* DESIGN MASTERS - 4人のデザイン巨匠の統合哲学 */}
      <MastersHero
        title="宇宙的舞踏"
        subtitle="Cosmic Dance"
        description="思考の軌跡を辿り、創造の宇宙を探索する旅。ポール・ランド、ディーター・ラムス、ウィリアム・モリス、佐藤可士和の哲学と共に、デザインの新しい美学を探求します。"
        ctaText="記事を探索"
        ctaLink="/blog"
      />

      {/* 最新記事セクション - Design Masters統合哲学 */}
      <section className="m-section">
        <div className="m-container">
          
          {/* セクションヘッダー - ポール・ランドの明快性 */}
          <div className="m-grid">
            <div className="m-sidebar">
              <div className="m-divider m-divider-md" />
            </div>
            
            <div className="m-content">
              <div className="m-header">
                <div className="m-caption m-text-light m-mb-1">
                  Latest Articles
                </div>
                <h2 className="m-title">
                  最新の記事
                </h2>
              </div>
            </div>
            
            <div className="m-accent" />
          </div>

          {/* 記事グリッド - ウィリアム・モリスの丁寧な配置 */}
          <div className="m-grid-articles">
            {!posts.length && (
              <div className="m-text-center" style={{ gridColumn: '1 / -1' }}>
                <div className="m-space-lg">
                  <p className="m-body m-text-gray">記事が見つかりません</p>
                </div>
              </div>
            )}
            {posts.slice(0, MAX_DISPLAY).map((frontMatter, index) => {
              const { slug, date, title, summary, tags, images } = frontMatter
              const postPath = `/blog/${slug}`

              return (
                <div 
                  key={slug}
                  className="m-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <MastersCard
                    title={title}
                    description={summary}
                    imgSrc={images?.[0] || null}
                    href={postPath}
                    date={date}
                    tags={tags}
                  />
                </div>
              )
            })}
          </div>

          {/* CTA - ディーター・ラムスの機能美 */}
          {posts.length > MAX_DISPLAY && (
            <div className="m-space-xl">
              <div className="m-text-center">
                <Link
                  href="/blog"
                  className="m-button-outline"
                >
                  すべての記事を見る
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}