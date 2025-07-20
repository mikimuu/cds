'use client'

import { useState } from 'react'
import Button from './Button'

interface FrontmatterData {
  title: string
  date: string
  tags: string[]
  draft: boolean
  summary: string
  images: string[]
}

interface FrontmatterEditorProps {
  data: FrontmatterData
  onChange: (data: FrontmatterData) => void
  className?: string
}

export function FrontmatterEditor({ data, onChange, className = '' }: FrontmatterEditorProps) {
  const [tagInput, setTagInput] = useState('')

  const updateField = (field: keyof FrontmatterData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      updateField('tags', [...data.tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (index: number) => {
    updateField('tags', data.tags.filter((_, i) => i !== index))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className={`space-y-4 rounded-lg border border-gray-200 bg-white p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">記事情報</h3>
      
      {/* タイトル */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={data.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="記事のタイトルを入力"
          required
        />
      </div>

      {/* 日付 */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          公開日 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="date"
          value={data.date}
          onChange={(e) => updateField('date', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      {/* 下書きステータス */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.draft}
            onChange={(e) => updateField('draft', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">下書き</span>
        </label>
        <p className="mt-1 text-xs text-gray-500">
          チェックを入れると下書きとして保存され、公開されません
        </p>
      </div>

      {/* サマリー */}
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
          概要
        </label>
        <textarea
          id="summary"
          value={data.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="記事の概要を入力（SEO用のdescriptionとして使用されます）"
        />
      </div>

      {/* タグ */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          タグ
        </label>
        <div className="mt-1">
          <div className="flex space-x-2">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="タグを入力してEnterで追加"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addTag}
              disabled={!tagInput.trim()}
            >
              追加
            </Button>
          </div>
          
          {/* タグ一覧 */}
          {data.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none"
                  >
                    <span className="sr-only">タグを削除</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" d="m1 1 6 6m0-6-6 6" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 画像リスト */}
      {data.images && data.images.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            使用画像
          </label>
          <div className="mt-1">
            <ul className="divide-y divide-gray-200 rounded-md border border-gray-300">
              {data.images.map((image, index) => (
                <li key={index} className="flex items-center justify-between py-2 px-3">
                  <span className="text-sm text-gray-900">{image}</span>
                  <button
                    type="button"
                    onClick={() => updateField('images', data.images?.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}