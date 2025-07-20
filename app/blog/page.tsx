import { getAllPosts } from '@/lib/blog'
import type { BlogPost } from '@/types/blog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'すべてのブログ記事一覧',
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function BlogListItem({ post }: { post: BlogPost }) {
  return (
    <article className="group py-6 border-b border-primary-200 last:border-b-0">
      <a href={`/blog/${post.slug}`} className="block">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <time className="typography-caption text-typography-secondary">
              {formatDate(post.date)}
            </time>
            <span className="typography-caption text-typography-secondary">
              {post.readingTime}分で読める
            </span>
          </div>
          
          <h2 className="typography-h3 group-hover:text-accent-editorial transition-colors">
            {post.title}
          </h2>
          
          {post.summary && (
            <p className="typography-body text-typography-secondary">
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

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="py-12">
      <div className="container-editorial">
        <div className="mb-12">
          <h1 className="typography-h1 mb-4">Blog</h1>
          <p className="typography-body-lg text-typography-secondary">
            これまでに投稿した{posts.length}件の記事をご覧ください
          </p>
        </div>
        
        <div className="space-y-0">
          {posts.map((post) => (
            <BlogListItem key={post.slug} post={post} />
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="typography-body text-typography-secondary">
              まだ記事が投稿されていません。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}