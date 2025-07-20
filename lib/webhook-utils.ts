import { createHmac, timingSafeEqual } from 'crypto'

/**
 * GitHub Webhook署名の検証
 */
export function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!signature) {
    return false
  }
  
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret) {
    return false
  }
  
  // GitHub Webhook署名の形式: "sha256=hash"
  const expectedSignature = `sha256=${createHmac('sha256', secret).update(payload).digest('hex')}`
  
  try {
    // timing攻撃を防ぐための安全な文字列比較
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    return false
  }
}

/**
 * Webhook イベント詳細のログ出力
 */
export function logWebhookEvent(event: string, payload: any) {
  const logData = {
    event,
    timestamp: new Date().toISOString(),
    repository: payload.repository?.full_name,
    sender: payload.sender?.login,
    action: payload.action,
  }
  
  // Webhook event logging disabled to reduce console output
}

/**
 * ブログコンテンツ関連の変更かチェック
 */
export function isContentChange(payload: any): boolean {
  if (payload.commits) {
    // Push イベントの場合、コミットに含まれるファイルをチェック
    return payload.commits.some((commit: any) => {
      const files = [
        ...(commit.added || []),
        ...(commit.modified || []),
        ...(commit.removed || [])
      ]
      
      return files.some((file: string) => 
        file.startsWith('data/blog/') || 
        file.startsWith('public/static/images/')
      )
    })
  }
  
  return false
}

/**
 * キャッシュクリア対象のパスを取得
 */
export function getCacheInvalidationPaths(payload: any): string[] {
  const paths: string[] = []
  
  if (payload.commits) {
    payload.commits.forEach((commit: any) => {
      const files = [
        ...(commit.added || []),
        ...(commit.modified || []),
        ...(commit.removed || [])
      ]
      
      files.forEach((file: string) => {
        if (file.startsWith('data/blog/')) {
          // ブログ記事の変更
          const slug = file.replace('data/blog/', '').replace('.mdx', '')
          paths.push(`/blog/${slug}`)
          paths.push('/blog') // 一覧ページ
          paths.push('/') // ホームページ
        }
      })
    })
  }
  
  return [...new Set(paths)] // 重複除去
}