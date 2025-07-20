import { NextRequest } from 'next/server'
import { 
  validateCredentials, 
  generateToken, 
  createSecureCookieOptions 
} from '@/lib/auth'
import { 
  LoginSchema, 
  validateSchema, 
  createErrorResponse, 
  createSuccessResponse 
} from '@/lib/api-schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // リクエストデータをバリデーション
    const validation = validateSchema(LoginSchema, body)
    
    if (!validation.success) {
      return createErrorResponse(400, validation.error?.message || 'バリデーションエラー')
    }

    const { username, password } = validation.data!

    // 認証情報を検証
    if (!validateCredentials(username, password)) {
      return createErrorResponse(401, 'ユーザー名またはパスワードが正しくありません')
    }

    // JWTトークンを生成
    const token = generateToken(username)

    // レスポンスを作成
    const response = createSuccessResponse(
      { 
        user: { username },
        token,
        expiresIn: '24h'
      },
      'ログインに成功しました'
    )

    // セキュアCookieを設定
    const cookieOptions = createSecureCookieOptions(24 * 60 * 60) // 24時間
    response.headers.set(
      'Set-Cookie',
      `admin-token=${token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`
    )

    return response
  } catch (error) {
    console.error('Login error:', error)
    return createErrorResponse(500, '内部サーバーエラーが発生しました')
  }
}

// CORS対応のためのOPTIONSハンドラー
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