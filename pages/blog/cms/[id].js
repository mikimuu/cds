import { client } from '@/lib/microcms'
import PostLayout from '@/layouts/PostLayout'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { getAllFilesFrontMatter } from '@/lib/mdx'

export async function getStaticPaths() {
  const data = await client.get({ endpoint: 'blog' })
  const paths = data.contents.map((content) => `/blog/cms/${content.id}`)
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const { id } = params
  const post = await client.get({ endpoint: 'blog', contentId: id })
  
  // 前後の記事を取得するために全記事を取得
  const localPosts = await getAllFilesFrontMatter('blog')
  const cmsPosts = await client.get({ endpoint: 'blog' })
  
  const allPosts = [...localPosts, ...cmsPosts.contents.map(p => ({
    ...p,
    slug: `cms/${p.id}`,
    date: p.publishedAt || p.createdAt,
    tags: p.tags || [],
  }))].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const postIndex = allPosts.findIndex((p) => p.slug === `cms/${id}`)
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null

  return {
    props: {
      post: {
        ...post,
        frontMatter: {
          title: post.title,
          date: post.publishedAt || post.createdAt,
          tags: post.tags || [],
          draft: false,
          summary: post.summary || '',
        },
        mdxSource: post.content,
      },
      prev,
      next,
      authorDetails: [{ name: post.author || 'Anonymous' }],
    },
  }
}

export default function BlogPost({ post, authorDetails, prev, next }) {
  return (
    <PostLayout
      frontMatter={post.frontMatter}
      authorDetails={authorDetails}
      prev={prev}
      next={next}
    >
      <div className="prose dark:prose-dark max-w-none" dangerouslySetInnerHTML={{ __html: post.mdxSource }} />
    </PostLayout>
  )
} 