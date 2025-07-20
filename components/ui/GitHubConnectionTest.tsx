'use client'

import { useState, useEffect } from 'react'
import Button from './Button'

interface GitHubTestResult {
  connection: string
  rateLimit: {
    limit: number
    remaining: number
    reset: string
  }
  repository: {
    owner: string
    repo: string
    branch: string
  }
  sampleFiles: Array<{
    name: string
    path: string
    size: number
  }>
  timestamp: string
}

interface EnvCheckResult {
  overall: boolean
  github: {
    configured: boolean
    details: Record<string, boolean>
  }
  auth: {
    configured: boolean
    details: Record<string, boolean>
  }
  site: {
    configured: boolean
    details: Record<string, boolean>
  }
  messages: Record<string, string>
  timestamp: string
}

export function GitHubConnectionTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<GitHubTestResult | null>(null)
  const [envCheck, setEnvCheck] = useState<EnvCheckResult | null>(null)
  const [error, setError] = useState('')

  const checkEnv = async () => {
    try {
      const response = await fetch('/api/test/env')
      const result = await response.json()
      if (result.success) {
        setEnvCheck(result.data)
      }
    } catch (error) {
      // Environment check failed silently
    }
  }

  const runTest = async () => {
    setIsLoading(true)
    setError('')
    setTestResult(null)

    // まず環境変数をチェック
    await checkEnv()

    try {
      const response = await fetch('/api/test/github', {
        credentials: 'include',
      })

      const result = await response.json()

      if (result.success) {
        setTestResult(result.data)
      } else {
        setError(result.error || 'GitHub API接続テストに失敗しました')
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // 初回読み込み時に環境変数をチェック
  useEffect(() => {
    checkEnv()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">GitHub API接続テスト</h3>
          <p className="text-sm text-gray-600">
            GitHub App設定が正しく動作するかテストします
          </p>
        </div>
        <Button
          onClick={runTest}
          disabled={isLoading}
          variant="primary"
        >
          {isLoading ? 'テスト中...' : 'テスト実行'}
        </Button>
      </div>

      {/* 環境変数チェック結果 */}
      {envCheck && (
        <div className={`rounded-md p-4 ${envCheck.overall ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <div className="flex">
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${envCheck.overall ? 'text-green-800' : 'text-yellow-800'}`}>
                {envCheck.overall ? '✅ 環境変数設定完了' : '⚠️ 環境変数設定が不完全'}
              </h3>
              <div className="mt-2 text-sm">
                <div className="space-y-1">
                  <div className={`${envCheck.github.configured ? 'text-green-700' : 'text-red-700'}`}>
                    GitHub設定: {envCheck.messages.github}
                  </div>
                  <div className={`${envCheck.auth.configured ? 'text-green-700' : 'text-red-700'}`}>
                    認証設定: {envCheck.messages.auth}
                  </div>
                  <div className={`${envCheck.site.configured ? 'text-green-700' : 'text-red-700'}`}>
                    サイト設定: {envCheck.messages.site}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">エラー</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <a
                    href="/GITHUB_APP_SETUP.md"
                    className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    セットアップガイドを確認
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {testResult && (
        <div className="space-y-4">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">✅ 接続成功</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>GitHub APIとの接続が正常に動作しています</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Rate Limit情報 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Rate Limit</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">上限:</span>
                  <span className="font-mono">{testResult.rateLimit.limit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">残り:</span>
                  <span className="font-mono">{testResult.rateLimit.remaining}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">リセット:</span>
                  <span className="font-mono text-xs">
                    {new Date(testResult.rateLimit.reset).toLocaleString('ja-JP')}
                  </span>
                </div>
              </div>
            </div>

            {/* リポジトリ情報 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">リポジトリ</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner:</span>
                  <span className="font-mono">{testResult.repository.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repo:</span>
                  <span className="font-mono">{testResult.repository.repo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Branch:</span>
                  <span className="font-mono">{testResult.repository.branch}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ファイル一覧 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">サンプルファイル (data/blog)</h4>
            <div className="space-y-2">
              {testResult.sampleFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-gray-700">{file.name}</span>
                  <span className="text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500">
            テスト実行時刻: {new Date(testResult.timestamp).toLocaleString('ja-JP')}
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">セットアップ手順</h4>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-start space-x-2">
            <span className="font-mono bg-gray-100 px-1 rounded">1.</span>
            <span>GitHub Developer Settingsで新しいGitHub Appを作成</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-mono bg-gray-100 px-1 rounded">2.</span>
            <span>Contents: Read & write権限を付与</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-mono bg-gray-100 px-1 rounded">3.</span>
            <span>cdsリポジトリにGitHub Appをインストール</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-mono bg-gray-100 px-1 rounded">4.</span>
            <span>.env.localファイルに実際の認証情報を設定</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <a
            href="https://github.com/settings/developers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            GitHub Developer Settings
            <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
          
          <button
            onClick={() => window.open('/GITHUB_APP_SETUP_DETAILED.md', '_blank')}
            className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            詳細セットアップガイド
            <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}