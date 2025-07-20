'use client'

import { useState } from 'react'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import Button from '@/components/ui/Button'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'
import { FrontmatterEditor } from '@/components/ui/FrontmatterEditor'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { GitHubConnectionTest } from '@/components/ui/GitHubConnectionTest'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'posts' | 'new' | 'images' | 'github'>('posts')
  const [posts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // 新規投稿用の状態
  const [frontmatter, setFrontmatter] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    tags: [] as string[],
    draft: true,
    summary: '',
    images: [] as string[],
  })
  const [content, setContent] = useState('')

  const handleSavePost = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...frontmatter,
          content,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('ブログポストを保存しました')
        // フォームをリセット
        setFrontmatter({
          title: '',
          date: new Date().toISOString().split('T')[0],
          tags: [] as string[],
          draft: true,
          summary: '',
          images: [] as string[],
        })
        setContent('')
      } else {
        alert(`保存に失敗しました: ${result.error}`)
      }
    } catch (error) {
      alert('保存中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    const result = await response.json()

    if (result.success) {
      return {
        url: result.data.url,
        path: result.data.path,
      }
    } else {
      throw new Error(result.error || '画像のアップロードに失敗しました')
    }
  }

  const tabs = [
    { id: 'posts', label: '投稿一覧' },
    { id: 'new', label: '新規投稿' },
    { id: 'images', label: '画像管理' },
    { id: 'github', label: 'GitHub連携' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Cosmic Dance 管理画面
              </h1>
              <p className="text-sm text-gray-500">
                ようこそ、{user?.username} さん
              </p>
            </div>
            <Button variant="ghost" onClick={logout}>
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      {/* タブナビゲーション */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  border-b-2 py-4 px-1 text-sm font-medium
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">投稿一覧</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">投稿一覧機能は開発中です。</p>
            </div>
          </div>
        )}

        {activeTab === 'new' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">新規投稿</h2>
              <Button
                variant="primary"
                onClick={handleSavePost}
                disabled={isLoading || !frontmatter.title || !content}
              >
                {isLoading ? '保存中...' : '保存'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* フロントマター */}
              <div className="lg:col-span-1">
                <FrontmatterEditor
                  data={frontmatter as any}
                  onChange={setFrontmatter as any}
                />
              </div>

              {/* エディター */}
              <div className="lg:col-span-2">
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  onSave={handleSavePost}
                  className="h-[600px]"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">画像管理</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <ImageUpload
                onUpload={handleImageUpload}
                onError={(error) => alert(`エラー: ${error}`)}
              />
            </div>
          </div>
        )}

        {activeTab === 'github' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">GitHub連携テスト</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <GitHubConnectionTest />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function AdminLogin() {
  const { login } = useAuth()
  const [error, setError] = useState('')

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password)
      // ログイン成功時は AuthProvider が自動的に user 状態を更新し、画面遷移する
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ログインに失敗しました'
      setError(errorMessage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <form onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const username = formData.get('username') as string
          const password = formData.get('password') as string
          await handleLogin(username, password)
        }} className="space-y-6">
          <div>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              管理者ログイン
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Cosmic Dance ブログ管理
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                ユーザー名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                defaultValue="admin"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="管理者ユーザー名を入力"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                defaultValue="cosmic-dance-2025"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="パスワードを入力"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
            >
              ログイン
            </Button>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-500">
              <p>セキュアな管理者認証</p>
              <p>JWT + HttpOnly Cookie</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminPageContent />
    </AuthProvider>
  )
}

function AdminPageContent() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return user ? <AdminDashboard /> : <AdminLogin />
}