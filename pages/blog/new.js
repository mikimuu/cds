import BlogPostForm from '@/components/BlogPostForm'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'

export default function NewPost() {
  return (
    <>
      <PageSEO
        title={`新規投稿 - ${siteMetadata.title}`}
        description="新しいブログ記事を投稿する"
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            新規投稿
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="prose max-w-none pt-8 pb-8 dark:prose-dark xl:col-span-3">
            <BlogPostForm />
          </div>
        </div>
      </div>
    </>
  )
} 