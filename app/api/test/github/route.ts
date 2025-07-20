import { NextRequest } from 'next/server'
import { createGitHubClient } from '@/lib/github-client'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-schemas'

// GET /api/test/github - GitHub API接続テスト
export async function GET(request: NextRequest) {
  try {
    // GitHub クライアントを作成
    const client = createGitHubClient()

    // Rate limit情報を取得（接続テスト）
    const rateLimit = await client.getRateLimit()

    // リポジトリのファイル一覧を取得（動作テスト）
    const files = await client.listFiles('data/blog')
    const blogFiles = files.filter(file => file.name.endsWith('.mdx')).slice(0, 5)

    const testResult = {
      connection: 'success',
      rateLimit: {
        limit: rateLimit.rate.limit,
        remaining: rateLimit.rate.remaining,
        reset: new Date(rateLimit.rate.reset * 1000).toISOString(),
      },
      repository: {
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        branch: process.env.GITHUB_BRANCH,
      },
      sampleFiles: blogFiles.map(file => ({
        name: file.name,
        path: file.path,
        size: file.size,
      })),
      timestamp: new Date().toISOString(),
    }

    return createSuccessResponse(testResult, 'GitHub API接続テストが成功しました')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'GitHub API接続テストに失敗しました'
    
    return createErrorResponse(500, errorMessage)
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}