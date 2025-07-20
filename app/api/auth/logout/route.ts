import { NextRequest } from 'next/server'
import { createSecureCookieOptions } from '@/lib/auth'
import { createSuccessResponse } from '@/lib/api-schemas'

export async function POST() {
  try {
    // レスポンスを作成
    const response = createSuccessResponse(
      null,
      'ログアウトしました'
    )

    // Cookieを削除（maxAgeを0に設定）
    const cookieOptions = createSecureCookieOptions(0)
    response.headers.set(
      'Set-Cookie',
      `admin-token=; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`
    )

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '内部サーバーエラーが発生しました' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

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