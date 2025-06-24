import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import EnhancedBlogEditor from '@/components/EnhancedBlogEditor'
import Link from '@/components/Link'

export default function EditPost() {
  const router = useRouter()
  const { slug } = router.query
  
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 記事データの取得
  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/blog/edit?slug=${slug}`)
        const data = await res.json()

        if (res.ok) {
          setPost(data)
        } else {
          setError(data.message || '記事が見つかりません')
        }
      } catch (error) {
        setError('記事の読み込みに失敗しました')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  // 記事の更新
  const handleSubmit = async (formData) => {
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/blog/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          ...formData
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push(`/blog/${slug}`)
      } else {
        throw new Error(data.message || '更新に失敗しました')
      }
    } catch (error) {
      console.error('Error:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/blog/${slug}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">記事を読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <Link href="/blog" className="text-cosmic-blue hover:opacity-80">
            ブログ一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageSEO
        title={`記事編集: ${post?.frontMatter?.title || ''} - ${siteMetadata.title}`}
        description="記事を編集する"
      />
      <EnhancedBlogEditor
        initialTitle={post?.frontMatter?.title || ''}
        initialContent={post?.content || ''}
        initialTags={Array.isArray(post?.frontMatter?.tags) ? post.frontMatter.tags.join(', ') : ''}
        initialSummary={post?.frontMatter?.summary || ''}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitButtonText="記事を更新"
        isLoading={isSubmitting}
      />
    </>
  )
}