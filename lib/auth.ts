import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface AuthUser {
  username: string
  iat: number
  exp: number
}

export interface AuthConfig {
  username: string
  password: string
  jwtSecret: string
  tokenExpiry: string
}

/**
 * 環境変数から認証設定を取得
 */
export function getAuthConfig(): AuthConfig {
  const config = {
    username: process.env.ADMIN_USERNAME || '',
    password: process.env.ADMIN_PASSWORD || '',
    jwtSecret: process.env.JWT_SECRET || '',
    tokenExpiry: '24h',
  }

  const requiredVars = ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'JWT_SECRET']
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required auth environment variables: ${missingVars.join(', ')}`)
  }

  if (config.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long')
  }

  return config
}

/**
 * ユーザーの認証情報を検証
 */
export function validateCredentials(username: string, password: string): boolean {
  const config = getAuthConfig()
  return username === config.username && password === config.password
}

/**
 * JWTトークンを生成
 */
export function generateToken(username: string): string {
  const config = getAuthConfig()
  
  const payload = { username }
  const secret = config.jwtSecret
  const options = { expiresIn: config.tokenExpiry }
  
  return jwt.sign(payload, secret, options)
}

/**
 * JWTトークンを検証
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    const config = getAuthConfig()
    
    const decoded = jwt.verify(token, config.jwtSecret, {
      issuer: 'cosmic-dance-blog',
      audience: 'admin'
    }) as AuthUser

    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Cookieからトークンを取得
 */
export function getTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get('admin-token')?.value || null
}

/**
 * Authorizationヘッダーからトークンを取得
 */
export function getTokenFromHeader(request: NextRequest): string | null {
  const authorization = request.headers.get('authorization')
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }
  
  return authorization.slice(7) // Remove 'Bearer ' prefix
}

/**
 * リクエストから認証ユーザーを取得
 */
export function getAuthenticatedUser(request: NextRequest): AuthUser | null {
  // まずCookieから取得を試行
  let token = getTokenFromCookie(request)
  
  // CookieにないときはAuthorizationヘッダーから取得
  if (!token) {
    token = getTokenFromHeader(request)
  }
  
  if (!token) {
    return null
  }
  
  return verifyToken(token)
}

/**
 * 認証が必要なAPIルートのミドルウェア
 */
export function requireAuth(handler: (request: NextRequest, user: AuthUser, context?: any) => Promise<Response>) {
  return async (request: NextRequest, context?: any): Promise<Response> => {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Valid authentication token required'
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    return handler(request, user, context)
  }
}

/**
 * セキュアなCookie設定を生成
 */
export function createSecureCookieOptions(maxAge: number = 24 * 60 * 60) {
  const isProduction = process.env.NODE_ENV === 'production'
  
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    maxAge,
    path: '/',
  }
}