# 📘 GitHub App設定 - 詳細ステップバイステップガイド

## 🚀 Step 1: GitHub Developer Settingsにアクセス

### 1.1 GitHubにログイン
1. ブラウザで https://github.com にアクセス
2. mikimuu アカウントでログイン

### 1.2 Developer Settingsへ移動
1. **右上のプロフィール画像**（アバター）をクリック
2. ドロップダウンメニューから **Settings** を選択
3. 左サイドバーを下にスクロールして **Developer settings** を見つけてクリック
4. **GitHub Apps** タブを選択
5. 緑色の **New GitHub App** ボタンをクリック

## 📝 Step 2: GitHub App基本情報の入力

### 2.1 基本情報セクション
```
GitHub App name: cosmic-dance-blog-cms
Description: Cosmic Dance Blog Content Management System
Homepage URL: http://localhost:3001
```

### 2.2 Webhookセクション
```
☑ Active (チェックボックスにチェックを入れる)
Webhook URL: https://cosmic-dancin.vercel.app/api/webhooks/github
Webhook secret: cosmic-dance-webhook-secret-2025
```

### 2.3 権限設定（Permissions）- 最重要セクション

**Repository permissions の設定:**
1. **Contents** の行を見つける
2. ドロップダウンから **Read & write** を選択 ✅
3. **Metadata** の行を見つける  
4. ドロップダウンから **Read** を選択 ✅

**その他はデフォルトのまま（No access）でOK**

### 2.4 インストール設定
**Where can this GitHub App be installed?**
- ○ **Only on this account** を選択（推奨）

### 2.5 作成完了
1. 画面下部の緑色の **Create GitHub App** ボタンをクリック
2. 作成完了！

## 🔑 Step 3: App IDとプライベートキーの取得

### 3.1 App IDの確認
作成完了後の画面で：
1. **App ID**: 1635437 ✅ (既に作成済み)
2. **Client ID**: Iv23liZbdDsANFl7S4qe ✅

### 3.2 プライベートキーの生成
1. 同じ画面で **Generate a private key** ボタンをクリック
2. `.pem` ファイルが自動ダウンロードされる
3. ダウンロードフォルダに保存される

### 3.3 プライベートキーの内容確認
1. ダウンロードした `.pem` ファイルをテキストエディタで開く
2. 以下のような内容が表示される：
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1234567890abcdef...
（長い文字列が続く）
...
-----END RSA PRIVATE KEY-----
```
3. **この全内容をコピー**

## 🏠 Step 4: リポジトリにインストール

### 4.1 インストール開始
1. GitHub App設定画面で左サイドバーの **Install App** をクリック
2. **Install** ボタンをクリック

### 4.2 リポジトリ選択
1. **Selected repositories** を選択
2. **Select repositories** ドロップダウンから **cds** を選択
3. 緑色の **Install** ボタンをクリック

### 4.3 Installation IDの確認
インストール完了後、URLを確認：
```
https://github.com/settings/installations/12345678
```
この `12345678` の部分が **Installation ID** です

## ⚙️ Step 5: 環境変数の設定

### 5.1 .env.localファイルの編集
VS Codeまたはテキストエディタで `/Users/mikihisa.kimura/Documents/cds/.env.local` を開き、以下を更新：

```bash
# GitHub App Configuration (実際の値)
GITHUB_APP_ID=1635437
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
（ダウンロードしたプライベートキーの全内容をここに貼り付け）
-----END RSA PRIVATE KEY-----"
GITHUB_INSTALLATION_ID=（実際のInstallation IDを確認して入力）

# Repository Configuration
GITHUB_OWNER=mikimuu
GITHUB_REPO=cds
GITHUB_BRANCH=main

# 既存の設定（変更不要）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=cosmic-dance-2025
JWT_SECRET=cosmic-dance-jwt-secret-key-32-characters-minimum-required
NEXT_PUBLIC_SITE_URL=https://cosmic-dancin.vercel.app
NEXT_PUBLIC_SITE_NAME="Cosmic Dance"
```

### 5.2 重要な注意点
- プライベートキーは `"` で囲む
- 改行も含めて全てをコピー
- `\n` に置き換える必要はない

## ✅ Step 6: 動作確認

### 6.1 開発サーバーの再起動
```bash
cd /Users/mikihisa.kimura/Documents/cds
npm run dev
```

### 6.2 管理画面でテスト
1. http://localhost:3001/admin にアクセス
2. admin / cosmic-dance-2025 でログイン
3. **GitHub連携** タブをクリック
4. **テスト実行** ボタンをクリック
5. ✅ 接続成功が表示されればOK！

## 🚨 よくあるエラーと解決方法

### エラー: "Bad credentials"
**原因:** App ID、プライベートキー、Installation IDのいずれかが間違っている
**解決策:**
1. App IDが正しいか確認
2. プライベートキーが完全にコピーされているか確認
3. Installation IDが正しいか確認

### エラー: "Not Found"
**原因:** リポジトリ名またはGitHub Appがインストールされていない
**解決策:**
1. GITHUB_OWNER と GITHUB_REPO が正しいか確認
2. GitHub Appが cds リポジトリにインストールされているか確認

### エラー: "Insufficient permissions"
**原因:** GitHub Appの権限設定が不足
**解決策:**
1. GitHub App設定で Contents: Read & write になっているか確認
2. 権限を変更した場合は再インストール

## 🎯 設定完了後にできること

✅ **管理画面から直接ブログ投稿作成**
✅ **GitHub経由での画像アップロード**  
✅ **リアルタイムプレビュー付きマークダウン編集**
✅ **自動コミット & プッシュ**

VS Code + git から Web UI へのワークフロー移行が完成します！

---

💡 **困ったときは:** 
- GitHub連携タブのテスト機能で接続状態を確認
- エラーメッセージをよく読んで該当する解決策を試す
- 設定を変更したら必ず開発サーバーを再起動