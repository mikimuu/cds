import { useState } from 'react'
import { useRouter } from 'next/router'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import EnhancedBlogEditor from '@/components/EnhancedBlogEditor'

export default function NewPost() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/blog')
      } else {
        throw new Error(data.message || '投稿に失敗しました')
      }
    } catch (error) {
      console.error('Error:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/blog')
  }

  return (
    <>
      <PageSEO
        title={`新規投稿 - ${siteMetadata.title}`}
        description="新しいブログ記事を投稿する"
      />
      <EnhancedBlogEditor
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitButtonText="記事を投稿"
        isLoading={isSubmitting}
      />
    </>
  )
} 