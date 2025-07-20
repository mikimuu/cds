import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createGitHubClient } from '@/lib/github-client'
import {
  createErrorResponse,
  createSuccessResponse
} from '@/lib/api-schemas'

// POST /api/upload/image - 画像アップロード（認証必要）
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const directory = formData.get('directory') as string || 'public/static/images'

    if (!file) {
      return createErrorResponse(400, '画像ファイルが指定されていません')
    }

    // ファイル検証
    const maxFileSize = 4.5 * 1024 * 1024 // 4.5MB (Vercel制限)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return createErrorResponse(400, `サポートされていないファイル形式です。${allowedTypes.join(', ')}のみ対応しています。`)
    }

    if (file.size > maxFileSize) {
      return createErrorResponse(400, `ファイルサイズが大きすぎます。最大${(maxFileSize / 1024 / 1024).toFixed(1)}MBまでです。`)
    }

    // ファイルをBufferに変換
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // GitHub クライアントを作成
    const client = createGitHubClient()

    // 年月でディレクトリを分ける
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const imageDirectory = `${directory}/${year}/${month}`

    // 画像をアップロード
    const result = await client.uploadImage(buffer, file.name, imageDirectory)

    return createSuccessResponse(
      {
        url: result.url,
        path: result.path,
        filename: file.name,
        size: file.size,
        type: file.type,
        commit: result.commit,
      },
      '画像をアップロードしました',
      201
    )
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(400, error.message)
    }
    
    return createErrorResponse(500, '画像のアップロードに失敗しました')
  }
})

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}