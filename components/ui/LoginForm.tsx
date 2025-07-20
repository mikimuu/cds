'use client'

import { useState } from 'react'
import Button from './Button'

interface LoginFormProps {
  onSuccess: (user: { username: string }) => void
  onError?: (error: string) => void
  className?: string
}

export function LoginForm({ onSuccess, onError, className = '' }: LoginFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess(result.data.user)
      } else {
        const errorMessage = result.error || 'ログインに失敗しました'
        setError(errorMessage)
        onError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = 'ネットワークエラーが発生しました'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className={`w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="管理者ユーザー名を入力"
              disabled={isLoading}
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
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="パスワードを入力"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading || !formData.username || !formData.password}
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
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
  )
}