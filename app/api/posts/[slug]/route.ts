import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createGitHubClient } from '@/lib/github-client'
import { 
  getBlogPostFromGitHub, 
  updateBlogPostInGitHub,
  deleteBlogPostFromGitHub
} from '@/lib/blog-github'
import {
  UpdatePostSchema,
  validateSchema,
  createErrorResponse,
  createSuccessResponse
} from '@/lib/api-schemas'

interface RouteParams {
  slug: string
}

// GET /api/posts/[slug] - 個別ブログポスト取得
export async function GET(
  _request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { slug } = params

    if (!slug) {
      return createErrorResponse(400, 'スラッグが指定されていません')
    }

    // GitHub クライアントを作成
    const client = createGitHubClient()

    // ブログポストを取得
    const post = await getBlogPostFromGitHub(client, slug)

    if (!post) {
      return createErrorResponse(404, 'ブログポストが見つかりません')
    }

    return createSuccessResponse(post, 'ブログポストを取得しました')
  } catch (error) {
    console.error(`Error fetching blog post ${params.slug}:`, error)
    return createErrorResponse(500, 'ブログポストの取得に失敗しました')
  }
}

// PUT /api/posts/[slug] - ブログポスト更新（認証必要）
export const PUT = requireAuth(async (
  request: NextRequest,
  _user,
  context: { params: RouteParams }
) => {
  try {
    const { slug } = context.params

    if (!slug) {
      return createErrorResponse(400, 'スラッグが指定されていません')
    }

    const body = await request.json()
    
    // リクエストデータをバリデーション
    const validation = validateSchema(UpdatePostSchema, { ...body, slug })
    
    if (!validation.success) {
      return createErrorResponse(400, validation.error?.message || 'バリデーションエラー')
    }

    const postData = validation.data!

    // GitHub クライアントを作成
    const client = createGitHubClient()

    // 既存ポストの存在確認
    const existingPost = await getBlogPostFromGitHub(client, slug)
    if (!existingPost) {
      return createErrorResponse(404, 'ブログポストが見つかりません')
    }

    // ブログポストを更新
    const { post, commit } = await updateBlogPostInGitHub(client, slug, postData)

    return createSuccessResponse(
      { post, commit },
      'ブログポストを更新しました'
    )
  } catch (error) {
    console.error(`Error updating blog post:`, error)
    
    if (error instanceof Error) {
      return createErrorResponse(400, error.message)
    }
    
    return createErrorResponse(500, 'ブログポストの更新に失敗しました')
  }
})

// DELETE /api/posts/[slug] - ブログポスト削除（認証必要）
export const DELETE = requireAuth(async (
  _request: NextRequest,
  _user,
  context: { params: RouteParams }
) => {
  try {
    const { slug } = context.params

    if (!slug) {
      return createErrorResponse(400, 'スラッグが指定されていません')
    }

    // GitHub クライアントを作成
    const client = createGitHubClient()

    // 既存ポストの存在確認
    const existingPost = await getBlogPostFromGitHub(client, slug)
    if (!existingPost) {
      return createErrorResponse(404, 'ブログポストが見つかりません')
    }

    // ブログポストを削除
    const { commit } = await deleteBlogPostFromGitHub(client, slug)

    return createSuccessResponse(
      { commit },
      'ブログポストを削除しました'
    )
  } catch (error) {
    console.error(`Error deleting blog post:`, error)
    
    if (error instanceof Error) {
      return createErrorResponse(400, error.message)
    }
    
    return createErrorResponse(500, 'ブログポストの削除に失敗しました')
  }
})

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}