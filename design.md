# cosmicdace Blog デザインガイドライン

このドキュメントは、cosmicdace Blog のデザインシステムとガイドラインを定義します。
宇宙を思わせる大胆なカラーリングとアニメーションを取り入れつつ、可読性やアクセシビリティを重視したモダンなミニマルデザインを目指します。

## 目次
1. [ブランドアイデンティティ](#ブランドアイデンティティ)
2. [カラーシステム](#カラーシステム)
3. [タイポグラフィ](#タイポグラフィ)
4. [レイアウトとスペーシング](#レイアウトとスペーシング)
5. [アニメーションと相互作用](#アニメーションと相互作用)
6. [コンポーネントデザイン](#コンポーネントデザイン)
7. [レスポンシブデザイン](#レスポンシブデザイン)
8. [アクセシビリティ](#アクセシビリティ)
9. [設定ファイルガイド](#設定ファイルガイド)

## ブランドアイデンティティ

### デザイン哲学
- コズミックモダン: 宇宙的な色合いやモチーフを、ミニマルデザインに落とし込む
- ダイナミズム: 惑星の軌道や星の瞬きを想起させる軽やかなアニメーション
- 日本語・多言語対応: メインの日本語コンテンツは可読性を最優先、英数字はUI的要素と組み合わせやすいスタイル
- ダークモード対応: 夜空をイメージしたダークテーマはブランドイメージの重要な要素

### デザイン原則
1. **シンプリシティ**: 不要な装飾は削ぎ落とし、イメージカラーやアニメーションでポイントを作る
2. **レジビリティ**: 常に読みやすさが最優先。特にコントラストはしっかり確保
3. **一貫性**: 色やフォント、ボーダーなどのスタイルを再利用し、どのページでも"cosmicdaceらしさ"を維持
4. **アクセシビリティ**: 多様なユーザーが利用可能なデザインを提供

## カラーシステム

### プライマリカラー
```css
primary: '#FF66CC'  /* 宇宙のガス雲をイメージしたネオンピンク */
```

### Cosmicテーマカラー
```css
cosmic-dark: #1a1a2e     /* 夜空をイメージした深い紺色 */
cosmic-mid: #16213e      /* 夜明け前の空のようなネイビーブルー */
cosmic-purple: #533483   /* 宇宙の神秘を表す紫 */
cosmic-star: #ffdf00     /* 星のきらめきを表すイエロー系ゴールド */
cosmic-white: #f1f1f1    /* 宇宙の光をイメージした柔らかい白 */
```

### ブランドカラー
```css
brblue: #00a8ec       /* クールなコズミックブルー */
brorange: #f7931e     /* 宇宙船の警告灯をイメージしたオレンジ */
brgreen: #40d39c      /* 成功・完了（酸素豊かな惑星の緑） */
brviolet: #bc98cb     /* 特別なアクセント（神秘的な紫系） */
brred: #ff6b6b        /* エラー・重大な警告 */
bryellow: #fdfd96     /* シグナルやハイライトに */
brcyan: #a2f5f8       /* 淡い水色（背景や軽いアクセント） */
brblackhole: #0d0d0d  /* ブラックホールをイメージした漆黒 */
```

### カラーの使用ガイドライン
- プライマリカラー: 主要ボタンやリンク、重要なUIアクション
- Cosmicテーマ: 全体の背景やセクション背景、ダークモードのベースカラー
- ブランドカラー: 状態表示（エラー・警告・成功）、カードやバッジのアクセント、グラフなどの補色

## タイポグラフィ

### フォントファミリー

#### 基本フォント
```css
font-family: 'Shippori Mincho', serif;
```
- ウェイト: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- 用途: 
  - 本文テキスト
  - 見出し
  - ナビゲーション
  - ボタンテキスト
  - フォーム要素

#### 英数字補助フォント
```css
font-family: 'Inter', sans-serif;
```
- ウェイト: 100-700
- 用途: 
  - 英数字のみのテキスト
  - 日付表示
  - バージョン番号
  - 技術的な表記

#### モノスペース
```css
font-family: 'Courier', monospace;
```
- 用途: 
  - コードブロック
  - コマンドライン表示
  - 技術的なドキュメント

### テキストスタイル

#### 見出し
```css
h1 {
  font-weight: 700;
  letter-spacing: -0.02em;
  color: theme('colors.cosmic-white');
}

h2 {
  font-weight: 700;
  letter-spacing: -0.02em;
  color: theme('colors.cosmic-purple');
}
```

#### 本文
```css
body {
  font-size: 1rem;
  line-height: 1.7;
  color: theme('colors.cosmic-mid');
}
```

## レイアウトとスペーシング

### セクションスペーシング
```css
.section {
  padding: 4rem 1rem; /* モバイル */
}
@media (min-width: 768px) {
  .section {
    padding: 6rem 2rem; /* デスクトップ */
  }
}
```

### 行の高さ
```css
.line-height-loose {
  line-height: 1.8;
}
.line-height-tight {
  line-height: 1.4;
}
```

### シャドウシステム
```css
.shadow-cosmic-lg {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}
.shadow-cosmic-glow {
  box-shadow: 0 0 20px rgba(83,52,131,0.6);
}
.shadow-neobrutal-card {
  box-shadow: 4px 4px 0 0 #000;
}
```

## アニメーションと相互作用

### ホバーエフェクト
```css
.hover-cosmic {
  transition: transform 0.4s, box-shadow 0.4s;
}
.hover-cosmic:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(255, 102, 204, 0.5);
}
```

### スクロール
```css
html {
  scroll-behavior: smooth;
}

/* スクロールバー */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 102, 204, 0.4);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 102, 204, 0.6);
}
```

### 背景アニメーション
```css
@keyframes cosmic-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.bg-cosmic-animate {
  background: linear-gradient(270deg, #533483, #16213e, #1a1a2e);
  background-size: 600% 600%;
  animation: cosmic-gradient 15s ease infinite;
}
```

## コンポーネントデザイン

### ボタン
- プライマリボタン:
  - 背景色: theme('colors.primary')
  - テキスト色: #fff
  - ホバー時: 背景色がより鮮やかに
  - シャドウ: shadow-cosmic-glow
  - ボーダー半径: 4px

- セカンダリボタン:
  - 背景色: transparent
  - テキスト色: theme('colors.primary')
  - ボーダー: 2px solid theme('colors.primary')
  - ホバー時: 背景に10%のプライマリカラー

### フォーム
- 入力フィールド:
  - 背景色: theme('colors.cosmic-white')
  - 境界線: 1px solid #ccc
  - フォーカス時: プライマリカラーの境界線
  - ボーダー半径: 4px

- ラベル:
  - フォントサイズ: 14px
  - 色: theme('colors.cosmic-mid')
  - マージン: 0 0 5px

### モーダル
- 背景:
  - rgba(26, 26, 46, 0.8)
  - フィルター: blur(5px)
- コンテンツ:
  - 背景色: theme('colors.cosmic-white')
  - パディング: 20px
  - ボーダー半径: 8px
  - 最大幅: 500px

### ネオブルータリズム
```css
.neobrutal-container {
  background-color: #fafafa;
  color: #000;
  padding: 20px;
  border: 4px solid #000;
}
```

## レスポンシブデザイン

### ブレイクポイント
- モバイルファースト
- md (768px): デスクトップ表示

### テキストサイズ変更
```css
.text-h2 {
  font-size: 1.5rem; /* text-2xl */
  /* md: 1.875rem (text-3xl) */
}

.text-body {
  font-size: 1rem; /* text-base */
  /* md: 1.125rem (text-lg) */
}
```

## アクセシビリティ

### カラーコントラスト
- テキストと背景のコントラスト比: 4.5:1以上
- 重要な情報: 7:1以上

### ダークモード対応
- 夜空をイメージした背景色
- テキストは高コントラストの色を使用
- コンポーネントごとの最適化

### フォーカス状態
- キーボードナビゲーション対応
- 視覚的なフォーカスインジケータ

## 設定ファイルガイド

このセクションでは、デザインシステムを実装するための各設定ファイルとその役割について説明します。

### 1. デザイン関連ファイル

#### `design.md`
- デザインシステムとガイドラインを定義する文書
- 以下の要素を詳細に記述：
  - ブランドアイデンティティ
  - カラーシステム
  - タイポグラフィ
  - レイアウトとスペーシング
  - アニメーションと相互作用
  - コンポーネントデザイン
  - レスポンシブデザイン
  - アクセシビリティ

#### `tailwind.config.js`
```javascript
module.exports = {
  content: [
    './pages/**/*.js',
    './components/**/*.js',
    './layouts/**/*.js',
    './lib/**/*.js',
    './data/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.pink,
        cosmic: {
          blue: '#4A90E2',
          lightgray: '#E5E5E5',
          // ...
        },
        // ブランドカラー
        'brblue': '#0077b6',
        'brorange': '#ff5733',
        // ...
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mincho: ['Shippori Mincho', 'serif'],
        mono: ['Courier', 'monospace'],
      },
      // その他の設定...
    }
  }
}
```
- Tailwind CSSの設定ファイル
- 主な設定内容：
  - カラーパレット（cosmic, brand colors）
  - フォントファミリー
  - タイポグラフィ設定
  - ダークモード設定
  - アニメーション設定
  - カスタムユーティリティ

### 2. スタイル関連ファイル

#### `css/tailwind.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ベースフォント設定 */
@layer base {
  html {
    font-family: 'Shippori Mincho', serif;
  }
  .font-en {
    font-family: 'Inter', sans-serif;
  }
}

/* その他のカスタムスタイル */
```
- グローバルCSSファイル
- 以下の要素を含む：
  - Tailwindディレクティブ
  - カスタムフォント読み込み
  - ベーススタイル
  - ユーティリティクラス
  - アニメーション定義
  - スクロールバーカスタマイズ

### 3. コンポーネント関連ファイル

#### `components/Card.js`
- カードコンポーネントの実装
- ネオブルータリズムデザインの適用
- レスポンシブ対応
- 主なスタイリング：
  - 境界線
  - シャドウ効果
  - ホバーアニメーション

#### `components/CosmicBackground.js`
- 背景要素の実装
- アニメーション効果の適用
- 宇宙的な雰囲気の演出

### 4. その他の設定ファイル

#### `next.config.js`
```javascript
module.exports = {
  images: {
    domains: ['...'],
  },
  // その他の設定
}
```
- Next.jsの設定ファイル
- 画像最適化やその他の機能の設定

#### `postcss.config.js`
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
- PostCSSの設定
- Tailwind CSSの処理設定

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```
- TypeScriptの設定
- パスエイリアスなどの設定

### 設定の適用順序

1. まず`design.md`のガイドラインを参照
2. `tailwind.config.js`でデザインシステムを実装
3. `css/tailwind.css`で全体的なスタイルを適用
4. 各コンポーネントで個別のスタイルを実装

### 設定ファイルの更新手順

1. デザインの変更が必要な場合は、まず`design.md`を更新
2. 変更に応じて`tailwind.config.js`の設定を修正
3. 必要に応じて`css/tailwind.css`にカスタムスタイルを追加
4. コンポーネントの実装を更新

## 更新履歴

- 2024-02-09: 初版作成
- デザインシステムの基本構造を定義
- カラーパレットとタイポグラフィの詳細を追加
- コンポーネントデザインのガイドラインを追加
- 設定ファイルガイドを追加
- 2024-02-10: コズミックデザインの統合
  - カラーパレットを宇宙的な配色に再編
  - ネオブルータリズムとコズミックアニメーションの組み合わせ
  - ダークモード前提のアクセシビリティ考慮
