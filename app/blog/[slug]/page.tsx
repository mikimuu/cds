import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {}
  }

  const publishedTime = new Date(post.date).toISOString()
  const modifiedTime = new Date(post.date).toISOString()
  
  const ogImages = [
    {
      url: `${siteMetadata.siteUrl}/api/og?title=${encodeURIComponent(post.title)}`,
      width: 1200,
      height: 630,
      alt: post.title,
    },
  ]

  return {
    title: post.title,
    description: post.summary || post.content.slice(0, 160).replace(/[#*]/g, ''),
    keywords: post.tags,
    authors: [{ name: siteMetadata.author }],
    openGraph: {
      title: post.title,
      description: post.summary || post.content.slice(0, 160).replace(/[#*]/g, ''),
      type: 'article',
      publishedTime,
      modifiedTime,
      images: ogImages,
      authors: [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary || post.content.slice(0, 160).replace(/[#*]/g, ''),
      images: ogImages,
    },
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="py-12">
      <div className="container-editorial">
        {/* Article Header */}
        <header className="mb-8 space-y-4">
          <div className="flex items-center justify-between typography-caption text-typography-secondary">
            <time dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            <span>
              {post.readingTime}分で読める
            </span>
          </div>
          
          <h1 className="typography-h1">
            {post.title}
          </h1>
          
          {post.summary && (
            <p className="typography-body-lg text-typography-secondary">
              {post.summary}
            </p>
          )}
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 typography-caption bg-primary-100 text-typography-secondary rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        
        {/* Article Content */}
        <div 
          className="prose-editorial reading-flow"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-primary-200">
          <div className="flex items-center justify-between">
            <a
              href="/blog"
              className="inline-flex items-center typography-body text-accent-editorial hover:text-blue-700 transition-colors"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              記事一覧に戻る
            </a>
            
            <div className="typography-caption text-typography-secondary">
              {post.wordCount}文字
            </div>
          </div>
        </footer>
      </div>
    </article>
  )
}