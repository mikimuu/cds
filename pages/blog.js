import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { useMemo } from 'react'

const POSTS_PER_PAGE = 10

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return {
    props: {
      posts,
      initialDisplayPosts,
      pagination,
    },
  }
}

export default function Blog({ posts, initialDisplayPosts, pagination }) {
  // Memoize the posts to prevent unnecessary re-renders
  const memoizedPosts = useMemo(() => posts, [posts])
  const memoizedInitialDisplayPosts = useMemo(() => initialDisplayPosts, [initialDisplayPosts])

  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListLayout
        posts={memoizedPosts}
        initialDisplayPosts={memoizedInitialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
