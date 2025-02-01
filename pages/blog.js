import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import Link from 'next/link'

export const POSTS_PER_PAGE = 6

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return { props: { initialDisplayPosts, posts, pagination } }
}

export default function Blog({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="my-section-y px-4 md:px-8 max-w-content mx-auto">
        <h1 className="text-2xl md:text-h2 mb-8 md:mb-12 text-cosmic-black">All Articles</h1>
        
        <div className="grid gap-8 md:gap-12">
          {initialDisplayPosts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-cosmic-lightgray pb-6 md:pb-8 last:border-b-0"
            >
              <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-cosmic-black hover:text-cosmic-blue transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="text-xs md:text-sm text-cosmic-gray mb-3 md:mb-4">{post.date}</p>
              <p className="text-sm md:text-base text-cosmic-gray leading-relaxed mb-3 md:mb-4">{post.summary}</p>
              <Link 
                href={`/blog/${post.slug}`}
                className="text-cosmic-blue hover:opacity-75 transition-opacity text-sm md:text-base"
              >
                続きを読む →
              </Link>
            </article>
          ))}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 md:mt-16 text-center">
            <Link
              href={`/blog/page/${pagination.currentPage + 1}`}
              className="
                inline-block bg-cosmic-blue text-white 
                px-6 md:px-8 py-2 md:py-3 rounded 
                text-sm md:text-base
                hover:opacity-90 transition-opacity
              "
            >
              もっと見る
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
