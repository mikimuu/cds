import { client, getNewBlogPosts, getBlogPost } from '@/lib/microcms'
import PostLayout from '@/layouts/PostLayout'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { getAllFilesFrontMatter } from '@/lib/mdx'

export async function getStaticPaths() {
  try {
    const posts = await getNewBlogPosts()
    return {
      paths: posts.map(post => ({
        params: { id: post.id }
      })),
      fallback: 'blocking'
    }
  } catch (error) {
    console.error('Error fetching paths:', error)
    return { paths: [], fallback: 'blocking' }
  }
}

export async function getStaticProps({ params }) {
  try {
    const post = await getBlogPost(params.id)
    if (!post) {
      return { notFound: true }
    }

    const localPosts = await getAllFilesFrontMatter('blog')
    const cmsPosts = await getNewBlogPosts()
    
    const allPosts = [
      ...localPosts,
      ...cmsPosts
    ].sort((a, b) => new Date(b.date || b.publishedAt).getTime() - new Date(a.date || a.publishedAt).getTime())

    const postIndex = allPosts.findIndex((p) => p.id === params.id)
    const prev = allPosts[postIndex + 1] || null
    const next = allPosts[postIndex - 1] || null

    const frontMatter = {
      title: post.title || 'Untitled',
      date: post.publishedAt || post.createdAt,
      tags: Array.isArray(post.tags) ? post.tags : [],
      draft: false,
      summary: post.summary || '',
      slug: `cms/${params.id}`,
    }

    return {
      props: {
        post: {
          ...post,
          frontMatter,
          content: post.content || '',
          mdxSource: post.content || '',
          slug: `cms/${params.id}`,
        },
        prev,
        next,
        authorDetails: [{ name: post.author || 'Anonymous' }],
        allPosts: allPosts.map(p => ({
          ...p,
          frontMatter: {
            ...p,
            slug: p.id ? `cms/${p.id}` : p.slug,
            tags: Array.isArray(p.tags) ? p.tags : [],
            date: p.publishedAt || p.createdAt || p.date,
          }
        })),
      },
      revalidate: 60,
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    if (error.response?.status === 404) {
      return { notFound: true }
    }
    throw error
  }
}

export default function BlogPost({ post, authorDetails, prev, next, allPosts }) {
  if (!post) return null

  return (
    <PostLayout
      frontMatter={post.frontMatter}
      authorDetails={authorDetails}
      prev={prev}
      next={next}
      allPosts={allPosts}
    >
      <div className="prose dark:prose-dark max-w-none" dangerouslySetInnerHTML={{ __html: post.mdxSource }} />
    </PostLayout>
  )
} 