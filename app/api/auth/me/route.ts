import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-schemas'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return createErrorResponse(401, '認証が必要です')
    }

    return createSuccessResponse(
      { 
        user: { username: user.username },
        isAuthenticated: true,
        expiresAt: new Date(user.exp * 1000).toISOString()
      },
      '認証状態を確認しました'
    )
  } catch (error) {
    console.error('Auth check error:', error)
    return createErrorResponse(500, '認証状態の確認に失敗しました')
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}