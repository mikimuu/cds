# 🚀 Cosmic Dance - 本番環境デプロイメントガイド

## 🎯 GitHub App設定完了情報

### ✅ 実際のGitHub App設定値
```
App Name: cosmic-dance-blog-cms
App ID: 1635437
Client ID: Iv23liZbdDsANFl7S4qe
Owner: @mikimuu
Production URL: https://cosmic-dancin.vercel.app/
```

### 🔐 Vercel環境変数設定

Vercel Dashboard → Project Settings → Environment Variables で以下を設定：

#### 1. GitHub App認証
```
GITHUB_APP_ID=1635437
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
[実際のプライベートキーをここに貼り付け]
-----END RSA PRIVATE KEY-----"
GITHUB_INSTALLATION_ID=[実際のInstallation IDを確認して入力]
```

#### 2. リポジトリ設定
```
GITHUB_OWNER=mikimuu
GITHUB_REPO=cds
GITHUB_BRANCH=main
GITHUB_WEBHOOK_SECRET=cosmic-dance-webhook-secret-2025
```

#### 3. 管理者認証
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=[本番用の強力なパスワード]
JWT_SECRET=[32文字以上の強力なJWTシークレット]
```

#### 4. サイト設定
```
NEXT_PUBLIC_SITE_URL=https://cosmic-dancin.vercel.app
NEXT_PUBLIC_SITE_NAME="Cosmic Dance"
```

## 📋 デプロイメントチェックリスト

### Phase 1: GitHub App設定確認
- [x] GitHub App作成済み (App ID: 1635437)
- [x] Webhook URL設定: `https://cosmic-dancin.vercel.app/api/webhooks/github`
- [x] 権限設定: Contents (Read & write), Metadata (Read)
- [ ] プライベートキーのダウンロード・設定
- [ ] Installation IDの確認・設定

### Phase 2: Vercel環境変数設定
- [ ] GitHub App認証情報設定
- [ ] 管理者認証情報設定（強力なパスワード使用）
- [ ] サイト設定情報設定
- [ ] JWT Secret設定（32文字以上）

### Phase 3: 機能テスト
- [ ] 管理画面ログイン確認
- [ ] GitHub API接続テスト実行
- [ ] 新規ブログ投稿作成テスト
- [ ] 画像アップロード機能テスト
- [ ] Webhook受信テスト

### Phase 4: セキュリティ確認
- [ ] 本番環境でHTTPS接続確認
- [ ] Webhook署名検証動作確認
- [ ] 管理者認証の強度確認
- [ ] 環境変数の漏洩チェック

## 🔧 トラブルシューティング

### 1. GitHub App接続エラー
```bash
# エラー例: "Bad credentials"
# 解決策:
1. App ID (1635437) が正しく設定されているか確認
2. プライベートキーが完全にコピーされているか確認
3. Installation IDが正しいか確認
```

### 2. Webhook受信エラー
```bash
# エラー例: "Invalid webhook signature"
# 解決策:
1. GITHUB_WEBHOOK_SECRET の設定確認
2. GitHub App設定のWebhook URLが正しいか確認
3. Webhook署名検証ロジックの確認
```

### 3. 管理画面アクセスエラー
```bash
# エラー例: "Unauthorized"
# 解決策:
1. ADMIN_USERNAME/ADMIN_PASSWORD の設定確認
2. JWT_SECRET の設定確認（32文字以上）
3. Cookie設定の確認
```

## 📈 パフォーマンス最適化

### 1. Vercel設定最適化
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/webhooks/github",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        }
      ]
    }
  ]
}
```

### 2. 画像最適化
- Next.js Image Optimization自動有効
- WebP/AVIF自動変換
- レスポンシブ画像生成

### 3. キャッシュ戦略
- 静的ファイル: 1年キャッシュ
- API: 必要に応じてキャッシュ
- Webhook: キャッシュなし

## 🔍 監視・ログ

### 1. Vercel Analytics
```
# 環境変数で有効化
VERCEL_ANALYTICS_ID=your_analytics_id
```

### 2. ログ監視
- Vercel Function Logs
- GitHub Webhook配信状況
- API エラーレート監視

### 3. アラート設定
- デプロイメント失敗
- API エラー増加
- Webhook配信失敗

## 🚀 完了後の運用

### 日常運用
1. **ブログ投稿**: 管理画面から直接作成・編集
2. **画像管理**: ドラッグ&ドロップでアップロード
3. **変更確認**: GitHubコミット履歴で確認

### 定期メンテナンス
1. **セキュリティ更新**: 依存関係の定期更新
2. **パフォーマンス監視**: Core Web Vitals確認
3. **バックアップ**: GitHub履歴が自動バックアップ

---

💡 **重要**: 本番環境の環境変数は絶対にリポジトリにコミットしないでください。Vercel Dashboardからのみ設定してください。