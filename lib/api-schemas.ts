import { z } from 'zod'

// ブログポスト作成・更新用スキーマ
export const BlogPostSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付は YYYY-MM-DD 形式で入力してください'),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  summary: z.string().optional(),
  content: z.string().min(1, 'コンテンツは必須です'),
  images: z.array(z.string()).optional(),
})

export const CreatePostSchema = BlogPostSchema

export const UpdatePostSchema = BlogPostSchema.extend({
  slug: z.string().min(1, 'スラッグは必須です'),
})

// 画像アップロード用スキーマ
export const ImageUploadSchema = z.object({
  filename: z.string().min(1, 'ファイル名は必須です'),
  directory: z.string().default('public/static/images'),
})

// ログイン用スキーマ
export const LoginSchema = z.object({
  username: z.string().min(1, 'ユーザー名は必須です'),
  password: z.string().min(1, 'パスワードは必須です'),
})

// ページネーション用スキーマ
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  tag: z.string().optional(),
  status: z.enum(['draft', 'published', 'all']).default('published'),
})

// API レスポンス型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface BlogPostListResponse {
  posts: BlogPost[]
  pagination: PaginationInfo
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  draft: boolean
  summary?: string
  content: string
  excerpt: string
  readingTime: number
  wordCount: number
  lastModified: string
  images?: string[]
  github: {
    path: string
    sha: string
    lastCommit: {
      sha: string
      message: string
      author: {
        name: string
        email: string
        date: string
      }
    }
  }
}

// フロントマター用の型
export interface Frontmatter {
  title: string
  date: string
  tags: string[]
  draft?: boolean
  summary?: string
  images?: string[]
}

// MDX ファイル処理用の型
export interface MDXFile {
  frontmatter: Frontmatter
  content: string
  slug: string
  path: string
}

// GitHub操作用の型
export interface GitHubCommitInfo {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: string
  }
}

// エラーレスポンス用の型
export interface ApiError {
  status: number
  message: string
  code?: string
  details?: any
}

// ユーティリティ関数: APIレスポンス作成
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string
): ApiResponse<T> {
  return {
    success,
    data,
    message,
    error,
  }
}

// ユーティリティ関数: エラーレスポンス作成
export function createErrorResponse(
  status: number,
  message: string,
  code?: string,
  details?: any
): Response {
  const error: ApiError = {
    status,
    message,
    code,
    details,
  }

  return new Response(
    JSON.stringify(createApiResponse(false, null, undefined, message)),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

// ユーティリティ関数: 成功レスポンス作成
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): Response {
  return new Response(
    JSON.stringify(createApiResponse(true, data, message)),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

// バリデーション結果の型
export interface ValidationResult<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    issues: Array<{
      path: string[]
      message: string
    }>
  }
}

// ユーティリティ関数: Zodスキーマバリデーション
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data)
    return {
      success: true,
      data: validatedData,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: 'バリデーションエラー',
          issues: error.issues.map(issue => ({
            path: issue.path.map(String),
            message: issue.message,
          })),
        },
      }
    }
    
    return {
      success: false,
      error: {
        message: '不明なバリデーションエラー',
        issues: [],
      },
    }
  }
}