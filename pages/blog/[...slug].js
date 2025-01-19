import fs from 'fs'
import PageTitle from '@/components/PageTitle'
import generateRss from '@/lib/generate-rss'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx'
import { getNewBlogPosts } from '@/lib/microcms'

const DEFAULT_LAYOUT = 'PostLayout'

export async function getStaticPaths() {
  const posts = getFiles('blog')
  return {
    paths: posts.map((p) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  try {
    // 既存の記事を取得
    const allPosts = await getAllFilesFrontMatter('blog')
    
    // microCMSの記事を取得（エラー時は空配列を返す）
    let cmsPosts = []
    try {
      cmsPosts = await getNewBlogPosts()
    } catch (error) {
      console.error('Failed to fetch CMS posts:', error)
    }
    
    // 全記事を結合
    const combinedPosts = [...allPosts, ...cmsPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const postIndex = combinedPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
    const prev = combinedPosts[postIndex + 1] || null
    const next = combinedPosts[postIndex - 1] || null
    const post = await getFileBySlug('blog', params.slug.join('/'))
    const authorList = post.frontMatter.authors || ['default']
    const authorPromise = authorList.map(async (author) => {
      const authorResults = await getFileBySlug('authors', [author])
      return authorResults.frontMatter
    })
    const authorDetails = await Promise.all(authorPromise)

    // rss
    if (combinedPosts.length > 0) {
      const rss = generateRss(combinedPosts)
      fs.writeFileSync('./public/feed.xml', rss)
    }

    return { 
      props: { 
        post, 
        authorDetails, 
        prev, 
        next,
        allPosts: combinedPosts
      } 
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      notFound: true // 404ページを表示
    }
  }
}

export default function Blog({ post, authorDetails, prev, next, allPosts }) {
  const { mdxSource, toc, frontMatter } = post

  return (
    <>
      {frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          toc={toc}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
          allPosts={allPosts}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
