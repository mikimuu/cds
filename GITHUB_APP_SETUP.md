# GitHub App セットアップガイド

このガイドでは、Cosmic Dance ブログのGitHub API統合のためのGitHub Appを作成・設定する手順を説明します。

## 📋 前提条件

- GitHubアカウント
- cdsリポジトリへのadmin権限
- Next.js開発環境の準備完了

## 🚀 Step 1: GitHub App作成

### 1.1 GitHub Developer Settingsにアクセス
1. GitHubにログイン
2. 右上のプロフィール画像 → **Settings**
3. 左サイドバーの **Developer settings**
4. **GitHub Apps** → **New GitHub App**

### 1.2 GitHub App基本設定
以下の情報を入力：

```
GitHub App name: cosmic-dance-blog-cms
Homepage URL: http://localhost:3001 (開発中)
Description: Cosmic Dance Blog Content Management System

Webhook:
☑ Active
Webhook URL: http://localhost:3001/api/webhooks/github (開発中)
Webhook secret: cosmic-dance-webhook-secret-2025

Permissions:
Repository permissions:
- Contents: Read & write ✅
- Metadata: Read ✅
- Pull requests: Read & write (オプション)

Account permissions:
- Email addresses: Read (オプション)

Where can this GitHub App be installed?
○ Only on this account
```

### 1.3 GitHub App作成完了
1. **Create GitHub App** をクリック
2. App ID をメモ（例: 123456）
3. **Generate a private key** をクリックしてプライベートキーをダウンロード

## 🔧 Step 2: GitHub App インストール

### 2.1 リポジトリにインストール
1. 作成したGitHub Appの設定画面で **Install App**
2. **Install** → アカウントを選択
3. **Selected repositories** → **cds** リポジトリを選択
4. **Install** をクリック
5. Installation ID をメモ（URL: `/settings/installations/12345678`の数字）

## 📝 Step 3: 環境変数設定

### 3.1 プライベートキーの準備
ダウンロードしたプライベートキーファイル（`.pem`）をテキストエディタで開き、内容をコピー

### 3.2 .env.localファイル更新
```bash
# GitHub App Configuration (実際の値に置き換え)
GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...実際のプライベートキー...
-----END RSA PRIVATE KEY-----"
GITHUB_INSTALLATION_ID=12345678

# Repository Configuration
GITHUB_OWNER=mikimuu
GITHUB_REPO=cds
GITHUB_BRANCH=main

# その他の設定（既存）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=cosmic-dance-2025
JWT_SECRET=cosmic-dance-jwt-secret-key-32-characters-minimum-required
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_SITE_NAME="Cosmic Dance"
```

### 3.3 注意事項
- プライベートキーは改行を `\n` に置き換えるか、ヒアドキュメント形式で記述
- ダブルクォートで囲むことを推奨
- `.env.local`ファイルは`.gitignore`で除外されているため安全

## ✅ Step 4: 動作確認

### 4.1 開発サーバー再起動
```bash
npm run dev
```

### 4.2 管理画面でテスト
1. http://localhost:3001/admin にアクセス
2. admin / cosmic-dance-2025 でログイン
3. 新規投稿作成をテスト
4. 画像アップロードをテスト

### 4.3 GitHub確認
1. cdsリポジトリのCommitsタブで新しいコミットを確認
2. data/blogディレクトリに新しいMDXファイルが作成されていることを確認
3. 画像がpublic/static/imagesに保存されていることを確認

## 🚨 トラブルシューティング

### エラー: "Bad credentials"
- GITHUB_APP_IDが正しいか確認
- プライベートキーの形式が正しいか確認
- Installation IDが正しいか確認

### エラー: "Not Found"
- リポジトリ名（GITHUB_OWNER/GITHUB_REPO）が正しいか確認
- GitHub Appがリポジトリにインストールされているか確認

### エラー: "Insufficient permissions"
- GitHub Appの権限設定（Contents: Read & write）を確認
- Installation時にリポジトリが選択されているか確認

## 🔒 セキュリティベストプラクティス

1. **プライベートキーの管理**
   - 絶対にリポジトリにコミットしない
   - 本番環境では環境変数またはシークレット管理サービスを使用

2. **最小権限の原則**
   - 必要最小限の権限のみを付与
   - 定期的に権限を見直し

3. **Webhookセキュリティ**
   - 本番環境ではWebhook URLにHTTPS使用
   - Webhook secretで署名を検証

## 📚 参考資料

- [GitHub Apps Documentation](https://docs.github.com/en/developers/apps)
- [Octokit.js Documentation](https://octokit.github.io/rest.js/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

これでGitHub Appの設定は完了です。管理画面からリアルタイムでGitHubリポジトリを操作できるようになります！