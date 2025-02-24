import Link from './Link'

function calculateSimilarity(post1, post2) {
  if (!post1 || !post2) return 0

  // タグの類似性をスコア化
  const tags1 = new Set(post1.frontMatter?.tags || [])
  const tags2 = new Set(post2.frontMatter?.tags || [])
  const commonTags = [...tags1].filter(tag => tags2.has(tag))
  const tagScore = commonTags.length * 2

  // タイトルと要約の類似性（簡易的な実装）
  const text1 = `${post1.frontMatter?.title || ''} ${post1.frontMatter?.summary || ''}`.toLowerCase()
  const text2 = `${post2.frontMatter?.title || ''} ${post2.frontMatter?.summary || ''}`.toLowerCase()
  const words1 = new Set(text1.split(/\s+/))
  const words2 = new Set(text2.split(/\s+/))
  const commonWords = [...words1].filter(word => words2.has(word))
  const textScore = commonWords.length

  return tagScore + textScore
}

export default function RelatedPosts({ currentPost, allPosts = [], maxPosts = 3 }) {
  if (!allPosts || !Array.isArray(allPosts) || !currentPost) {
    console.warn('RelatedPosts: Invalid props', { currentPost, allPosts });
    return null;
  }

  // 現在の記事を除外し、類似度でソート
  const relatedPosts = allPosts
    .filter(post => {
      return post && 
             post.slug && 
             currentPost.slug && 
             post.slug !== currentPost.slug;
    })
    .map(post => ({
      ...post,
      similarity: calculateSimilarity(
        { frontMatter: currentPost },
        { frontMatter: post }
      )
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxPosts)

  if (relatedPosts.length === 0) return null

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">関連記事</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {relatedPosts.map((post) => {
          if (!post) return null;

          return (
            <div
              key={post.slug}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.date).toLocaleDateString('ja-JP')}
              </time>
              <h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-gray-100">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary-500">
                  {post.title}
                </Link>
              </h3>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {post.summary && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {post.summary}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
} 