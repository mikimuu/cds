import { NextRequest } from 'next/server'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-schemas'

// GET /api/test/env - 環境変数設定状況確認
export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      github: {
        app_id: !!process.env.GITHUB_APP_ID && process.env.GITHUB_APP_ID !== 'your_actual_github_app_id',
        private_key: !!process.env.GITHUB_PRIVATE_KEY && !process.env.GITHUB_PRIVATE_KEY.includes('YOUR_ACTUAL_PRIVATE_KEY_HERE'),
        installation_id: !!process.env.GITHUB_INSTALLATION_ID && process.env.GITHUB_INSTALLATION_ID !== 'your_actual_installation_id',
        owner: !!process.env.GITHUB_OWNER,
        repo: !!process.env.GITHUB_REPO,
        branch: !!process.env.GITHUB_BRANCH,
      },
      auth: {
        admin_username: !!process.env.ADMIN_USERNAME,
        admin_password: !!process.env.ADMIN_PASSWORD,
        jwt_secret: !!process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32,
      },
      site: {
        site_url: !!process.env.NEXT_PUBLIC_SITE_URL,
        site_name: !!process.env.NEXT_PUBLIC_SITE_NAME,
      }
    }

    const allGitHubConfigured = Object.values(envCheck.github).every(Boolean)
    const allAuthConfigured = Object.values(envCheck.auth).every(Boolean)
    const allSiteConfigured = Object.values(envCheck.site).every(Boolean)

    const result = {
      overall: allGitHubConfigured && allAuthConfigured && allSiteConfigured,
      github: {
        configured: allGitHubConfigured,
        details: envCheck.github,
      },
      auth: {
        configured: allAuthConfigured,
        details: envCheck.auth,
      },
      site: {
        configured: allSiteConfigured,
        details: envCheck.site,
      },
      messages: {
        github: allGitHubConfigured ? 'GitHub設定完了' : 'GitHub設定が不完全です',
        auth: allAuthConfigured ? '認証設定完了' : '認証設定が不完全です',
        site: allSiteConfigured ? 'サイト設定完了' : 'サイト設定が不完全です',
      },
      timestamp: new Date().toISOString(),
    }

    return createSuccessResponse(result, '環境変数設定状況を確認しました')
  } catch (error) {
    return createErrorResponse(500, '環境変数の確認に失敗しました')
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