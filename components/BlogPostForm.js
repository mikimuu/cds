import { useState, useRef } from 'react'

export default function BlogPostForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)
  const contentRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        // カーソル位置に画像のMarkdownを挿入
        const textarea = contentRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newContent = content.substring(0, start) + 
                          '\n' + data.markdown + '\n' +
                          content.substring(end)
        setContent(newContent)
      } else {
        setStatus(`画像アップロードエラー: ${data.message}`)
      }
    } catch (error) {
      setStatus('画像アップロードエラー')
      console.error('Error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('投稿中...')

    try {
      const res = await fetch('/api/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('投稿が完了しました！')
        setTitle('')
        setContent('')
        setTags('')
        setTimeout(() => {
          window.location.href = '/blog'
        }, 2000)
      } else {
        setStatus(`エラー: ${data.message}`)
      }
    } catch (error) {
      setStatus('エラーが発生しました')
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-brblue mb-2">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brblue"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-brblue mb-2">
          本文 (Markdown形式)
        </label>
        <div className="relative">
          <textarea
            id="content"
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brblue"
            required
          />
          <div className="absolute bottom-2 right-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                {uploading ? '画像アップロード中...' : '画像を追加'}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="tags" className="block text-sm font-medium text-brblue mb-2">
          タグ (カンマ区切り)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brblue"
          placeholder="日記, 1月"
        />
      </div>

      <button
        type="submit"
        className="bg-brblue text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
        disabled={uploading}
      >
        投稿する
      </button>

      {status && (
        <p className="mt-4 text-center text-sm">
          {status}
        </p>
      )}
    </form>
  )
} 