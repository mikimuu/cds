import { getAllPosts } from '@/lib/blog'
import siteMetadata from '@/data/siteMetadata'
import type { BlogPost } from '@/types/blog'

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group">
      <a href={`/blog/${post.slug}`} className="block">
        <div className="space-y-3 p-6 rounded-lg border border-primary-200 hover:border-accent-editorial transition-colors group-hover:shadow-sm">
          <div className="flex items-center justify-between">
            <time className="typography-caption text-typography-secondary">
              {formatDate(post.date)}
            </time>
            <span className="typography-caption text-typography-secondary">
              {post.readingTime}分で読める
            </span>
          </div>
          
          <h3 className="typography-h3 group-hover:text-accent-editorial transition-colors">
            {post.title}
          </h3>
          
          {post.summary && (
            <p className="typography-body text-typography-secondary line-clamp-2">
              {post.summary}
            </p>
          )}
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 typography-caption bg-primary-100 text-typography-secondary rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </a>
    </article>
  )
}

export default async function HomePage() {
  const posts = await getAllPosts()
  const recentPosts = posts.slice(0, 6)

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="container-editorial mb-16">
        <div className="text-center space-y-6">
          <h1 className="typography-display text-center">
            {siteMetadata.headerTitle}
          </h1>
          <p className="typography-body-lg text-typography-secondary max-w-2xl mx-auto">
            {siteMetadata.description}
          </p>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="container-wide">
        <div className="mb-8">
          <h2 className="typography-h2 mb-2">最新の記事</h2>
          <p className="typography-body text-typography-secondary">
            最近投稿された記事をご覧ください
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        
        {posts.length > 6 && (
          <div className="mt-12 text-center">
            <a
              href="/blog"
              className="inline-flex items-center px-6 py-3 typography-body font-medium text-white bg-accent-editorial rounded-lg hover:bg-blue-700 transition-colors focus-ring"
            >
              すべての記事を見る
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}
      </section>
    </div>
  )
}