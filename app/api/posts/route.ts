import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createGitHubClient } from '@/lib/github-client'
import { 
  getBlogPostsFromGitHub, 
  createBlogPostInGitHub 
} from '@/lib/blog-github'
import {
  PaginationSchema,
  CreatePostSchema,
  validateSchema,
  createErrorResponse,
  createSuccessResponse,
  BlogPostListResponse,
  PaginationInfo
} from '@/lib/api-schemas'

// GET /api/posts - ブログポスト一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    // クエリパラメータをバリデーション
    const validation = validateSchema(PaginationSchema, queryParams)
    
    if (!validation.success) {
      return createErrorResponse(400, validation.error?.message || 'バリデーションエラー')
    }

    const { page, limit, tag, status } = validation.data!

    // GitHub クライアントを作成
    const client = createGitHubClient()

    // ブログポスト一覧を取得
    const offset = (page - 1) * limit
    const includeDrafts = status === 'draft' || status === 'all'
    
    const allPosts = await getBlogPostsFromGitHub(client, {
      includeDrafts,
      tag,
    })

    // ステータスフィルタリング
    let filteredPosts = allPosts
    if (status === 'draft') {
      filteredPosts = allPosts.filter(post => post.draft)
    } else if (status === 'published') {
      filteredPosts = allPosts.filter(post => !post.draft)
    }

    // ページネーション
    const total = filteredPosts.length
    const totalPages = Math.ceil(total / limit)
    const posts = filteredPosts.slice(offset, offset + limit)

    const pagination: PaginationInfo = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }

    const response: BlogPostListResponse = {
      posts,
      pagination,
    }

    return createSuccessResponse(response, 'ブログポスト一覧を取得しました')
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return createErrorResponse(500, 'ブログポストの取得に失敗しました')
  }
}

// POST /api/posts - 新しいブログポスト作成（認証必要）
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    
    // リクエストデータをバリデーション
    const validation = validateSchema(CreatePostSchema, body)
    
    if (!validation.success) {
      return createErrorResponse(400, validation.error?.message || 'バリデーションエラー')
    }

    const postData = validation.data!

    // GitHub クライアントを作成
    const client = createGitHubClient()

    // ブログポストを作成
    const { post, commit } = await createBlogPostInGitHub(client, postData)

    return createSuccessResponse(
      { post, commit },
      'ブログポストを作成しました',
      201
    )
  } catch (error) {
    console.error('Error creating blog post:', error)
    
    if (error instanceof Error) {
      return createErrorResponse(400, error.message)
    }
    
    return createErrorResponse(500, 'ブログポストの作成に失敗しました')
  }
})

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}