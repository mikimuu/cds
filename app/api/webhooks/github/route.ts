import { NextRequest } from 'next/server'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-schemas'
import { verifyWebhookSignature } from '@/lib/webhook-utils'

// POST /api/webhooks/github - GitHub Webhook処理
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    const event = request.headers.get('x-github-event')
    
    // Webhook署名の検証
    if (!verifyWebhookSignature(body, signature)) {
      return createErrorResponse(401, 'Unauthorized')
    }
    
    const payload = JSON.parse(body)
    
    
    // イベントタイプ別の処理
    switch (event) {
      case 'push':
        await handlePushEvent(payload)
        break
        
      case 'installation':
        await handleInstallationEvent(payload)
        break
        
      case 'installation_repositories':
        await handleInstallationRepositoriesEvent(payload)
        break
        
      default:
        // Unhandled webhook event
    }
    
    return createSuccessResponse({ received: true }, `Webhook ${event} processed`)
    
  } catch (error) {
    return createErrorResponse(500, 'Webhook processing failed')
  }
}

// Push イベントの処理
async function handlePushEvent(payload: any) {
  const { repository, commits, ref } = payload
  
  // メインブランチへのプッシュのみ処理
  if (ref !== `refs/heads/${process.env.GITHUB_BRANCH || 'main'}`) {
    return
  }
  
  
  // TODO: 必要に応じてキャッシュクリアやサイト再生成を実行
  // - Next.js ISRキャッシュのクリア
  // - ブログ投稿一覧の更新
  // - サイトマップの再生成など
}

// Installation イベントの処理
async function handleInstallationEvent(payload: any) {
  const { action, installation } = payload
  
  
  if (action === 'created') {
    // Installation作成時の処理
  } else if (action === 'deleted') {
    // Installation削除時の処理
  }
}

// Installation Repositories イベントの処理
async function handleInstallationRepositoriesEvent(payload: any) {
  const { action, repositories_added, repositories_removed } = payload
  
}

// OPTIONS メソッド（CORS対応）
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Hub-Signature-256, X-GitHub-Event',
    },
  })
}