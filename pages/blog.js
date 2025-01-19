import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getNewBlogPosts } from '@/lib/microcms'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'

export const POSTS_PER_PAGE = 5

export async function getStaticProps() {
  try {
    // 既存の記事を取得
    const localPosts = await getAllFilesFrontMatter('blog')
    
    // microCMSの記事を取得
    let cmsPosts = []
    try {
      const response = await getNewBlogPosts()
      cmsPosts = Array.isArray(response) ? response : (response?.contents || [])
    } catch (error) {
      console.error('microCMS fetch error:', error)
    }
    
    // 記事を結合して日付順にソート
    const allPosts = [...localPosts, ...cmsPosts.map(post => ({
      ...post,
      slug: `cms/${post.id}`,
      date: post.publishedAt || post.createdAt || new Date().toISOString(),
      tags: Array.isArray(post.tags) ? post.tags : [],
      summary: post.summary || '',
      title: post.title || 'Untitled',
    }))].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const initialDisplayPosts = allPosts.slice(0, POSTS_PER_PAGE)
    const pagination = {
      currentPage: 1,
      totalPages: Math.ceil(allPosts.length / POSTS_PER_PAGE),
    }

    return { props: { initialDisplayPosts, posts: allPosts, pagination } }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      props: {
        posts: [],
        initialDisplayPosts: [],
        pagination: { currentPage: 1, totalPages: 1 }
      }
    }
  }
}

export default function Blog({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
