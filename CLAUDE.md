# Cosmic Dance Blog - 完全再設計プロジェクト

## プロジェクト概要

このプロジェクトは、既存のNext.jsブログを完全に再設計し、3つの主要目標を達成することを目的としています：

1. **軽量で高性能なプラットフォーム**の構築
2. **GitHub API直接統合**によるシームレスなコンテンツ管理
3. **洗練されたタイポグラフィ中心**のエディトリアルデザインシステム

### 主要な変更点
- VS Code + git commitからWeb UI直接編集への移行
- CMSサービスを使わず、GitHub API経由でリポジトリを直接操作
- 日本語コンテンツに最適化されたタイポグラフィシステム
- Vercel無料プランでの最適化（100GB帯域制限、4.5MBファイル制限対応）

## 技術アーキテクチャ

### コアテクノロジー
```
Frontend Layer:
├── Next.js 14 (App Router)
├── React 18 (Server Components)
├── TypeScript (strict mode)
└── Tailwind CSS 3.4+

Content Management:
├── GitHub API Integration
├── File-based MDX processing
├── Real-time markdown editor
└── Image upload to public/static

Performance:
├── Bundle optimization (<50% current size)
├── Japanese font optimization
├── Client-side image compression
└── Edge caching strategy
```

### システム構成図
```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js 14 App Router] --> B[React Server Components]
        B --> C[GitHub API Client]
        C --> D[Typography System]
        D --> E[Editorial Layout Engine]
    end
    
    subgraph "Content Management"
        F[Web-based Editor] --> G[Real-time Preview]
        G --> H[GitHub API]
        H --> I[Repository Files]
    end
    
    subgraph "Data Layer"
        J[MDX Processing] --> K[Static Generation]
        K --> L[Edge Caching]
        L --> M[Performance Monitoring]
    end
    
    A --> F
    H --> J
    E --> K
```

## 開発コマンド

### 基本コマンド
```bash
# 開発サーバー起動
npm run dev  # http://localhost:3001 (ポート3000が使用中の場合)

# プロダクションビルド
npm run build

# 本番サーバー起動
npm run start

# 型チェック
npm run type-check

# リンター実行
npm run lint

# リンター自動修正
npm run lint:fix

# テスト実行
npm run test

# テスト（watch mode）
npm run test:watch

# パフォーマンステスト
npm run test:perf

# バンドルサイズ分析
npm run analyze

# 全体的な品質チェック
npm run check-all
```

### 管理画面アクセス (Phase 3)
```bash
# 管理画面URL
http://localhost:3001/admin

# ログイン情報（開発環境）
ユーザー名: admin
パスワード: cosmic-dance-2025

# 環境変数ファイル
.env.local  # 必須: 認証情報とGitHub API設定
```

### Git操作コマンド
```bash
# 変更をステージング
git add .

# コミット作成
git commit -m "feat: implement GitHub API integration 🤖 Generated with Claude Code"

# プッシュ
git push origin main

# ブランチ作成
git checkout -b feature/github-integration

# マージ
git checkout main && git merge feature/github-integration
```

## 実装ロードマップ

### ✅ Phase 1: 基盤構築 (完了 - 2025年7月20日)
#### 🎯 達成された成果
- ✅ **Next.js 14基盤**: App Router、TypeScript strict mode、Tailwind CSS 3.4+
- ✅ **日本語最適化**: M PLUS 1pフォント、適切な行間・文字間隔、日本語読み時間計算
- ✅ **App Router構造**: レイアウト、ホームページ、ブログ一覧、個別記事ページ
- ✅ **基本コンポーネント**: UI要素、タイポグラフィ、ユーティリティ関数
- ✅ **既存コンテンツ統合**: 178件のMDXファイル自動読み込み・静的生成
- ✅ **開発環境**: ESLint、Prettier、型チェック、ビルド確認

#### 📊 パフォーマンス目標達成
```typescript
interface Phase1Results {
  bundleSize: '87.1KB' // 目標: <100KB ✅
  staticGeneration: '178記事' // 高速プリレンダリング ✅
  buildTime: '正常' // エラーなし ✅
  typeCheck: '通過' // strict mode対応 ✅
  lighthouse: {
    performance: 'optimized'
    accessibility: 'enhanced'
    seo: 'ready'
  }
}
```

#### 🏗️ 実装されたアーキテクチャ
```
/Users/mikihisa.kimura/Documents/cds/
├── app/
│   ├── layout.tsx           # ルートレイアウト（日本語最適化）
│   ├── page.tsx             # ホームページ（記事一覧）
│   ├── blog/
│   │   ├── page.tsx         # ブログ一覧ページ
│   │   └── [slug]/page.tsx  # 個別記事ページ
│   └── globals.css          # Tailwind + 日本語最適化CSS
├── components/
│   └── ui/
│       ├── Button.tsx       # 再利用可能なボタン
│       ├── Card.tsx         # カードコンポーネント
│       └── Typography.tsx   # タイポグラフィシステム
├── lib/
│   ├── blog.ts              # MDXプロセッシング + 日本語読み時間
│   └── utils.ts             # ユーティリティ関数
├── types/
│   └── blog.ts              # TypeScript型定義
├── data/
│   ├── blog/                # 178件のMDXファイル
│   └── siteMetadata.js      # サイト設定
└── 設定ファイル
    ├── package.json         # 依存関係とスクリプト
    ├── next.config.js       # Next.js設定（最適化済み）
    ├── tsconfig.json        # TypeScript strict設定
    ├── tailwind.config.js   # 日本語最適化Tailwind
    ├── .eslintrc.js         # コード品質
    └── .prettierrc          # コードフォーマット
```

### Phase 2: タイポグラフィシステム (Week 2-3)
```typescript
// Task 2.1: 日本語最適化フォントシステム
interface JapaneseTypography {
  primaryFont: 'M PLUS 1p'
  fallbacks: ['Hiragino Kaku Gothic ProN', 'Yu Gothic', 'sans-serif']
  loadingStrategy: 'font-display: swap'
  subsetting: 'U+3040-309F, U+30A0-30FF, U+4E00-9FAF' // ひらがな、カタカナ、漢字
  optimization: {
    preload: ['woff2']
    compression: 'gzip + brotli'
    caching: 'max-age=31536000'
  }
}

// Task 2.2: レスポンシブタイポグラフィスケール
interface TypographyScale {
  display: 'clamp(3rem, 8vw, 6rem)'
  heading1: 'clamp(2rem, 5vw, 3.5rem)'
  heading2: 'clamp(1.5rem, 4vw, 2.5rem)'
  body: '1.125rem' // 18px
  caption: '0.875rem' // 14px
  lineHeight: {
    japanese: 1.9
    english: 1.6
  }
  letterSpacing: {
    japanese: '0.05em'
    english: '-0.01em'
  }
}
```

### Phase 3: GitHub API コンテンツ管理 (Week 3-4)
```typescript
// Task 3.1: GitHub API クライアント
interface GitHubAPIClient {
  baseURL: 'https://api.github.com'
  endpoints: {
    getContent: 'GET /repos/{owner}/{repo}/contents/{path}'
    createFile: 'PUT /repos/{owner}/{repo}/contents/{path}'
    updateFile: 'PUT /repos/{owner}/{repo}/contents/{path}'
    uploadMedia: 'PUT /repos/{owner}/{repo}/contents/public/static/images/{filename}'
  }
  authentication: {
    type: 'GitHub App'
    permissions: ['contents:write']
    installation: 'repository-level'
  }
}

// Task 3.2: リアルタイムエディター
interface ContentEditor {
  features: [
    'markdown syntax highlighting',
    'live preview',
    'auto-save to localStorage',
    'image drag-and-drop',
    'Japanese IME optimization'
  ]
  shortcuts: {
    save: 'Ctrl+S / Cmd+S'
    preview: 'Ctrl+P / Cmd+P'
    bold: 'Ctrl+B / Cmd+B'
    italic: 'Ctrl+I / Cmd+I'
  }
}
```

### Phase 4: 画像最適化システム (Week 4-5)
```typescript
// Task 4.1: Vercel無料プラン対応画像処理
interface ImageOptimization {
  uploadLimits: {
    maxFileSize: 4.5 * 1024 * 1024 // 4.5MB (Vercel制限)
    allowedFormats: ['jpeg', 'png', 'webp']
    maxDimensions: { width: 1920, height: 1080 }
  }
  
  clientSideCompression: {
    quality: 0.8
    format: 'webp'
    progressive: true
    stripMetadata: true
  }
  
  deliveryOptimization: {
    formats: ['webp', 'jpeg'] // next/image built-in optimization
    sizes: [320, 640, 960, 1280]
    placeholder: 'blur'
    lazyLoading: true
  }
}

// Task 4.2: 画像アップロードワークフロー
interface ImageUploadWorkflow {
  steps: [
    '1. Client-side compression',
    '2. Validation (size, format, dimensions)',
    '3. GitHub API upload to public/static/images/',
    '4. Automatic commit with optimized filename',
    '5. Update markdown with proper image syntax'
  ]
  naming: '{YYYYMMDD}_{timestamp}_{originalName}.{ext}'
  organization: 'public/static/images/{year}/{month}/'
}
```

### Phase 5: エディトリアルデザインシステム (Week 5-6)
```typescript
// Task 5.1: マガジンスタイルレイアウト
interface EditorialLayout {
  gridSystem: {
    desktop: 'minmax(1rem, 1fr) minmax(0, 65ch) minmax(1rem, 1fr)'
    tablet: 'minmax(1rem, 1fr) minmax(0, 55ch) minmax(1rem, 1fr)'
    mobile: 'minmax(1rem, 1fr) minmax(0, 45ch) minmax(1rem, 1fr)'
  }
  
  spacingScale: {
    xs: '0.25rem'   // 4px
    sm: '0.5rem'    // 8px
    md: '1rem'      // 16px
    lg: '1.5rem'    // 24px
    xl: '2rem'      // 32px
    '2xl': '3rem'   // 48px
    '3xl': '4rem'   // 64px
  }
  
  colorPalette: {
    primary: { 50: '#f8fafc', 500: '#64748b', 900: '#0f172a' }
    accent: { editorial: '#2563eb', highlight: '#f59e0b' }
    typography: { primary: '#1e293b', secondary: '#64748b', muted: '#94a3b8' }
  }
}

// Task 5.2: 読書体験最適化
interface ReadingExperience {
  optimalLineLength: '65ch' // 理想的な1行文字数
  verticalRhythm: '1.5rem' // ベースライン
  readingProgress: 'scroll-based indicator'
  tableOfContents: 'auto-generated from headings'
  estimatedReadingTime: 'words / 250 wpm (Japanese: characters / 500 cpm)'
}
```

### Phase 6: パフォーマンス最適化 (Week 6-7)
```typescript
// Task 6.1: バンドル最適化
interface BundleOptimization {
  techniques: [
    'Route-based code splitting',
    'Dynamic imports for heavy components',
    'Tree shaking unused dependencies',
    'Preact alias in production (React → Preact)',
    'Bundle analyzer integration'
  ]
  
  targets: {
    initialBundle: '<100KB gzipped'
    totalJavaScript: '<300KB gzipped'
    firstContentfulPaint: '<1.5s'
    largestContentfulPaint: '<2.5s'
    cumulativeLayoutShift: '<0.1'
  }
}

// Task 6.2: フォント読み込み戦略
interface FontLoadingStrategy {
  critical: {
    fonts: ['M PLUS 1p 400', 'M PLUS 1p 700']
    display: 'swap'
    preload: true
    format: 'woff2'
  }
  
  deferred: {
    fonts: ['Space Grotesk', 'DM Sans']
    display: 'optional'
    loadAfter: 'page-load'
  }
  
  fallbacks: {
    sansSerif: 'system-ui, -apple-system, sans-serif'
    japanese: 'Hiragino Kaku Gothic ProN, Yu Gothic, sans-serif'
  }
}
```

### Phase 7: 認証とセキュリティ (Week 7-8)
```typescript
// Task 7.1: GitHub App認証
interface GitHubAuthentication {
  type: 'GitHub App'
  installationLevel: 'repository'
  permissions: {
    contents: 'write'
    metadata: 'read'
    pullRequests: 'write' // プレビュー機能用
  }
  
  security: {
    webhookSecret: 'environment variable'
    privateKey: 'PEM format in env'
    rateLimiting: '5000 requests/hour'
    ipWhitelist: ['Vercel edge locations']
  }
}

// Task 7.2: アクセス制御
interface AccessControl {
  adminAuth: {
    method: 'environment-based simple auth'
    storage: 'httpOnly cookies + JWT'
    timeout: '24 hours'
    csrfProtection: 'built-in Next.js'
  }
  
  contentSecurity: {
    sanitization: 'DOMPurify for user content'
    validation: 'Zod schema validation'
    uploads: 'file type + size validation'
    rateLimiting: 'Vercel Edge Functions'
  }
}
```

### Phase 8: SEO とアナリティクス (Week 8-9)
```typescript
// Task 8.1: SEO最適化
interface SEOOptimization {
  metadata: {
    dynamic: 'per-page meta tags'
    openGraph: 'automatic OG image generation'
    twitter: 'Twitter Card support'
    structuredData: 'JSON-LD for articles'
  }
  
  performance: {
    sitemap: 'auto-generated XML'
    robots: 'dynamic robots.txt'
    canonicalUrls: 'automatic canonical tags'
    redirects: '301 redirects for migrated content'
  }
}

// Task 8.2: パフォーマンス監視
interface PerformanceMonitoring {
  coreWebVitals: {
    lcp: 'Largest Contentful Paint'
    fid: 'First Input Delay'
    cls: 'Cumulative Layout Shift'
    fcp: 'First Contentful Paint'
  }
  
  analytics: {
    provider: 'Vercel Analytics (free tier)'
    privacy: 'GDPR compliant'
    tracking: 'page views, performance metrics'
    dashboard: 'built-in Vercel dashboard'
  }
}
```

### Phase 9: コンテンツ移行 (Week 9-10)
```typescript
// Task 9.1: 既存コンテンツ移行
interface ContentMigration {
  source: 'data/blog/*.mdx'
  target: 'same structure with enhanced frontmatter'
  
  enhancements: {
    readingTime: 'auto-calculated'
    wordCount: 'auto-calculated'
    seoMetadata: 'enhanced meta tags'
    imageOptimization: 'convert to optimized formats'
  }
  
  urlPreservation: {
    redirects: '301 redirects for old URLs'
    canonicals: 'proper canonical tags'
    sitemap: 'updated XML sitemap'
  }
}

// Task 9.2: 画像ファイル最適化
interface ImageMigration {
  source: 'public/static/images/*'
  optimization: [
    'Convert JPEG → WebP where appropriate',
    'Compress oversized images',
    'Generate responsive sizes',
    'Update markdown references'
  ]
  
  organization: {
    structure: 'public/static/images/{year}/{month}/'
    naming: '{YYYYMMDD}_{slug}_{index}.{ext}'
    metadata: 'alt text and caption extraction'
  }
}
```

### Phase 10: テストと品質保証 (Week 10-11)
```typescript
// Task 10.1: 自動テスト
interface TestingSuite {
  unit: {
    framework: 'Jest + React Testing Library'
    coverage: '>80% code coverage'
    focus: 'components, utilities, API functions'
  }
  
  integration: {
    e2e: 'Playwright for critical workflows'
    api: 'GitHub API integration tests'
    performance: 'Lighthouse CI integration'
  }
  
  accessibility: {
    tool: 'axe-core + manual testing'
    standards: 'WCAG 2.1 AA compliance'
    focus: 'keyboard navigation, screen readers'
  }
}

// Task 10.2: パフォーマンステスト
interface PerformanceTesting {
  tools: [
    'Lighthouse CI',
    'WebPageTest',
    'Bundle analyzer',
    'Core Web Vitals monitoring'
  ]
  
  benchmarks: {
    loadTime: '<2s on 3G'
    bundleSize: '<300KB total JS'
    imageOptimization: '>90% compression'
    coreWebVitals: '>90 scores'
  }
}
```

### Phase 11: デプロイメントと監視 (Week 11-12)
```typescript
// Task 11.1: Vercel最適化デプロイメント
interface VercelDeployment {
  configuration: {
    buildCommand: 'npm run build'
    outputDirectory: '.next'
    installCommand: 'npm ci'
    framework: 'nextjs'
  }
  
  optimization: {
    bandwidth: 'monitor 100GB monthly limit'
    functions: 'optimize for free tier limits'
    edgeFunctions: 'leverage for performance'
    analytics: 'enable Vercel Analytics'
  }
  
  environment: {
    production: {
      GITHUB_APP_ID: 'from GitHub App'
      GITHUB_PRIVATE_KEY: 'PEM format'
      GITHUB_WEBHOOK_SECRET: 'webhook validation'
      NEXT_PUBLIC_SITE_URL: 'production domain'
    }
  }
}

// Task 11.2: 監視とメンテナンス
interface MonitoringSetup {
  healthChecks: {
    api: 'GitHub API connectivity'
    build: 'deployment success rate'
    performance: 'Core Web Vitals tracking'
    uptime: 'Vercel built-in monitoring'
  }
  
  maintenance: {
    dependencies: 'automated security updates'
    content: 'regular content backup via GitHub'
    performance: 'monthly performance audits'
    analytics: 'monthly traffic and performance reports'
  }
}
```

### Phase 12: ドキュメンテーションとリリース (Week 12)
```typescript
// Task 12.1: ユーザーガイド作成
interface UserDocumentation {
  adminGuide: {
    authentication: 'GitHub App setup guide'
    contentCreation: 'step-by-step post creation'
    imageUpload: 'image optimization workflow'
    publishing: 'draft to published workflow'
  }
  
  developerGuide: {
    architecture: 'system architecture overview'
    api: 'GitHub API integration details'
    customization: 'theme and component customization'
    deployment: 'deployment and configuration'
  }
}
```

## API設計

### GitHub Integration API
```typescript
// GitHub API Operations
interface GitHubOperations {
  // Get file content
  'GET /api/github/content': {
    params: { path: string }
    response: { content: string, sha: string }
  }
  
  // Create/Update file
  'PUT /api/github/content': {
    body: {
      path: string
      content: string
      message: string
      sha?: string // for updates
    }
    response: { commit: GitHubCommit }
  }
  
  // Upload image
  'POST /api/github/upload': {
    body: FormData // image file
    response: { 
      url: string
      path: string
      commit: GitHubCommit
    }
  }
  
  // List content
  'GET /api/github/list': {
    params: { directory: string }
    response: { files: GitHubFile[] }
  }
}
```

### Content Management API
```typescript
// Blog Content Operations
interface ContentAPI {
  // Get blog posts
  'GET /api/posts': {
    query: {
      page?: number
      limit?: number
      tag?: string
      status?: 'draft' | 'published'
    }
    response: {
      posts: BlogPost[]
      pagination: PaginationInfo
    }
  }
  
  // Get single post
  'GET /api/posts/[slug]': {
    params: { slug: string }
    response: { post: BlogPost }
  }
  
  // Create post
  'POST /api/posts': {
    body: CreatePostRequest
    response: { post: BlogPost, commit: GitHubCommit }
  }
  
  // Update post
  'PUT /api/posts/[slug]': {
    body: UpdatePostRequest
    response: { post: BlogPost, commit: GitHubCommit }
  }
}
```

## データモデル

### Blog Post Model
```typescript
interface BlogPost {
  // Frontmatter
  title: string
  date: string // YYYY-MM-DD
  tags: string[]
  draft?: boolean
  summary?: string
  images?: string[]
  authors?: string[]
  
  // Auto-generated
  slug: string
  readingTime: number // minutes
  wordCount: number
  lastModified: string
  
  // Content
  content: string // MDX content
  excerpt: string // auto-generated from content
  
  // SEO
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  
  // GitHub metadata
  github: {
    path: string
    sha: string
    lastCommit: GitHubCommit
  }
}
```

### Image Model
```typescript
interface BlogImage {
  filename: string
  originalName: string
  path: string // public/static/images/...
  url: string // /static/images/...
  size: number // bytes
  dimensions: {
    width: number
    height: number
  }
  mimeType: string
  uploadedAt: string
  optimized: {
    webp?: string
    avif?: string
    sizes: {
      width: number
      height: number
      url: string
    }[]
  }
  github: {
    sha: string
    commit: GitHubCommit
  }
}
```

## 設定ファイル

### Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@octokit/rest'],
  },
  
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  webpack: (config, { dev, isServer }) => {
    // Bundle optimization
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': 'preact/compat',
        'react-dom': 'preact/compat',
      }
    }
    
    return config
  },
  
  // Performance optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Redirects for content migration
  async redirects() {
    return [
      // Add redirects for migrated content
    ]
  },
}

module.exports = nextConfig
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/types/*": ["types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind Configuration
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['M PLUS 1p', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'sans-serif'],
        display: ['Space Grotesk', 'M PLUS 1p', 'sans-serif'],
        body: ['DM Sans', 'M PLUS 1p', 'sans-serif'],
      },
      
      fontSize: {
        'display': 'clamp(3rem, 8vw, 6rem)',
        'heading-1': 'clamp(2rem, 5vw, 3.5rem)',
        'heading-2': 'clamp(1.5rem, 4vw, 2.5rem)',
        'body-lg': '1.125rem',
      },
      
      lineHeight: {
        'japanese': '1.9',
        'english': '1.6',
        'relaxed': '1.8',
      },
      
      letterSpacing: {
        'japanese': '0.05em',
        'tight': '-0.01em',
      },
      
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          900: '#0f172a',
        },
        accent: {
          editorial: '#2563eb',
          highlight: '#f59e0b',
        },
      },
      
      maxWidth: {
        'reading': '65ch',
      },
      
      gridTemplateColumns: {
        'editorial': 'minmax(1rem, 1fr) minmax(0, 65ch) minmax(1rem, 1fr)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
```

## 環境変数

### 必要な環境変数
```bash
# .env.local
# GitHub App Configuration
GITHUB_APP_ID=your_github_app_id
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_INSTALLATION_ID=your_installation_id

# Repository Configuration
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repository_name
GITHUB_BRANCH=main

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME="Cosmic Dance"

# Admin Authentication (simple auth for free tier)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. GitHub API Rate Limit
```typescript
// Rate limit handling
interface RateLimitStrategy {
  detection: 'X-RateLimit-Remaining header'
  handling: 'exponential backoff'
  fallback: 'cached content serving'
  monitoring: 'rate limit usage tracking'
}

// Implementation
const handleRateLimit = async (error: GitHubError) => {
  if (error.status === 403 && error.message.includes('rate limit')) {
    const resetTime = error.response.headers['x-ratelimit-reset']
    const waitTime = (resetTime * 1000) - Date.now()
    
    console.warn(`Rate limit hit. Waiting ${waitTime}ms`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
    
    // Retry the request
    return retryRequest()
  }
}
```

#### 2. 画像アップロード失敗
```typescript
// Image upload error handling
interface ImageUploadErrorHandling {
  fileSizeError: 'client-side compression before retry'
  formatError: 'auto-convert to supported format'
  networkError: 'retry with exponential backoff'
  githubError: 'check repository permissions'
}

// Implementation
const handleImageUploadError = (error: UploadError) => {
  switch (error.type) {
    case 'FILE_TOO_LARGE':
      return compressImageAndRetry(error.file)
    case 'UNSUPPORTED_FORMAT':
      return convertFormatAndRetry(error.file)
    case 'NETWORK_ERROR':
      return retryWithBackoff(error.request)
    case 'GITHUB_PERMISSION_ERROR':
      return showPermissionErrorMessage()
  }
}
```

#### 3. ビルドエラー
```bash
# 一般的なビルドエラーの解決

# 依存関係の問題
npm ci  # package-lock.jsonから正確にインストール

# TypeScript型エラー
npm run type-check  # 型チェック実行

# ESLintエラー
npm run lint:fix  # 自動修正

# キャッシュ問題
rm -rf .next && npm run build  # キャッシュクリア

# メモリ不足
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 4. Webpack設定エラー (Phase 1で解決済み)
```typescript
// 問題: Next.js 14でoptimization.usedExportsエラー
// Error: optimization.usedExports can't be used with cacheUnaffected

// ❌ 問題のあった設定
webpack: (config, { dev, isServer }) => {
  config.optimization = {
    ...config.optimization,
    usedExports: true,      // ← これが問題
    sideEffects: false,     // ← これも問題
  }
  return config
}

// ✅ 修正後の設定
webpack: (config, { dev, isServer }) => {
  // Next.js 14 handles optimization automatically
  // Custom configurations can be added here if needed
  return config
}

// 解決策: Next.js 14の内蔵最適化に依存する
// 手動でWebpack最適化設定を行わず、Next.jsに任せる
```

#### 5. パフォーマンス問題
```typescript
// Performance debugging
interface PerformanceDebugging {
  bundleAnalysis: 'npm run analyze'
  imageOptimization: 'check WebP conversion'
  fontLoading: 'verify font-display: swap'
  caching: 'check edge caching headers'
}

// Core Web Vitals optimization
const optimizeCoreWebVitals = {
  LCP: [
    'Optimize images with next/image',
    'Preload critical fonts',
    'Use CDN for static assets'
  ],
  FID: [
    'Code splitting for JavaScript',
    'Remove unused JavaScript',
    'Use server components where possible'
  ],
  CLS: [
    'Set dimensions for images',
    'Use font-display: swap',
    'Avoid dynamic content insertion'
  ]
}
```

## パフォーマンス目標

### 測定可能な目標
```typescript
interface PerformanceTargets {
  loadTimes: {
    firstContentfulPaint: '<1.5s'
    largestContentfulPaint: '<2.5s'
    firstInputDelay: '<100ms'
    cumulativeLayoutShift: '<0.1'
  }
  
  bundleSizes: {
    initialJavaScript: '<100KB gzipped'
    totalJavaScript: '<300KB gzipped'
    css: '<50KB gzipped'
    fonts: '<200KB total'
  }
  
  images: {
    compressionRatio: '>70%'
    formatOptimization: 'WebP for 90%+ images'
    lazyLoadingCoverage: '100% below fold'
    responsiveImageCoverage: '100%'
  }
  
  caching: {
    staticAssets: 'max-age=31536000'
    htmlPages: 'max-age=0, s-maxage=86400'
    apiResponses: 'max-age=3600'
    images: 'max-age=31536000'
  }
}
```

### 監視とアラート
```typescript
interface MonitoringAlerts {
  coreWebVitals: {
    threshold: 'scores below 90'
    frequency: 'daily check'
    action: 'investigate and optimize'
  }
  
  bundleSize: {
    threshold: 'increase >10%'
    frequency: 'per deployment'
    action: 'bundle analysis and optimization'
  }
  
  loadTimes: {
    threshold: '>3s on 3G'
    frequency: 'continuous monitoring'
    action: 'performance audit'
  }
  
  errorRates: {
    threshold: '>1% error rate'
    frequency: 'real-time'
    action: 'immediate investigation'
  }
}
```

## セキュリティ考慮事項

### セキュリティ実装
```typescript
interface SecurityMeasures {
  authentication: {
    type: 'environment-based simple auth'
    storage: 'httpOnly cookies + JWT'
    timeout: '24 hours'
    csrf: 'built-in Next.js protection'
  }
  
  contentSecurity: {
    sanitization: 'DOMPurify for user content'
    validation: 'Zod schema validation'
    uploads: {
      fileTypes: ['image/jpeg', 'image/png', 'image/webp']
      maxSize: '4.5MB'
      scanning: 'basic header validation'
    }
  }
  
  apiSecurity: {
    rateLimit: 'Vercel Edge Functions'
    cors: 'specific origin allowlist'
    headers: {
      xFrameOptions: 'DENY'
      contentTypeOptions: 'nosniff'
      xssProtection: '1; mode=block'
    }
  }
  
  dataProtection: {
    secrets: 'environment variables only'
    logging: 'no sensitive data in logs'
    github: 'minimal required permissions'
  }
}
```

### GitHub権限設定
```typescript
interface GitHubPermissions {
  required: {
    contents: 'write' // ファイル作成・編集用
    metadata: 'read'  // リポジトリ情報取得用
  }
  
  optional: {
    pullRequests: 'write' // プレビュー機能用（将来の拡張）
    issues: 'read'        // フィードバック機能用（将来の拡張）
  }
  
  security: {
    installationLevel: 'repository' // organization全体ではなく特定リポジトリのみ
    webhookEvents: ['push', 'pull_request'] // 必要最小限のイベント
    secretScanning: 'enabled'
    dependencyReview: 'enabled'
  }
}
```

## 今後の拡張計画

### Phase 13+: 将来の機能拡張
```typescript
interface FutureEnhancements {
  // コメントシステム
  comments: {
    provider: 'GitHub Discussions API'
    moderation: 'automated + manual review'
    threading: 'nested comment support'
    notifications: 'email notifications for new comments'
  }
  
  // 検索機能
  search: {
    implementation: 'client-side full-text search'
    indexing: 'build-time index generation'
    features: ['fuzzy matching', 'tag filtering', 'date ranges']
    performance: 'lazy-loaded search index'
  }
  
  // 多言語サポート
  i18n: {
    languages: ['ja', 'en']
    routing: 'subdirectory-based (/en/, /ja/)'
    content: 'separate content files per language'
    ui: 'next-intl for UI translations'
  }
  
  // プレビュー機能
  preview: {
    method: 'GitHub Pull Requests'
    deployment: 'Vercel preview deployments'
    collaboration: 'multiple reviewers support'
    workflow: 'draft → review → publish'
  }
  
  // 分析とインサイト
  analytics: {
    content: 'reading time, bounce rate per post'
    performance: 'Core Web Vitals trending'
    engagement: 'popular content identification'
    seo: 'search ranking monitoring'
  }
}
```

## 🚀 プロジェクト現在のステータス

### ✅ Phase 1, 2 & 3完了 (2025年7月20日)

#### Phase 1: 基盤構築完了
- **Next.js 14基盤**: App Router、TypeScript strict mode、Tailwind CSS 3.4+
- **パフォーマンス**: バンドルサイズ87.1KB (目標100KB以下達成)
- **コンテンツ**: 183記事の静的生成完了
- **開発環境**: 完全にセットアップ済み

#### ✅ Phase 2: タイポグラフィシステム強化完了
- **日本語フォント最適化**: M PLUS 1p + Noto Sans JP階層構成、JetBrains Mono追加
- **レスポンシブタイポグラフィ**: 12種類の精密なclamp()ベーススケール
- **日英混在テキスト**: font-feature-settings最適化、.text-mixed-langクラス
- **読書体験向上**: 65ch最適ライン長、24px垂直リズムシステム
- **フォント読み込み**: プリロード戦略 + font-display: swap実装

#### ✅ Phase 3: GitHub API統合コンテンツ管理システム完了
- **GitHub APIクライアント**: 基本的なAPI操作（get, create, update, list, delete）
- **認証システム**: JWT + HttpOnly Cookie認証、環境変数ベース設定
- **リアルタイムマークダウンエディター**: プレビュー機能、ツールバー、キーボードショートカット対応
- **画像アップロード機能**: GitHub API経由、クライアントサイド圧縮、ドラッグ&ドロップ対応
- **コンテンツ管理API**: CRUD操作、認証付きエンドポイント、Zodバリデーション
- **管理者UI**: 完全な管理画面、ログイン機能、認証コンテキスト

#### 🎯 Phase 3技術的実装成果
```typescript
interface Phase3Implementation {
  apiEndpoints: [
    '/api/auth/login',     // JWT認証
    '/api/auth/logout',    // ログアウト
    '/api/auth/me',        // 認証状態確認
    '/api/posts',          // ブログポスト一覧・作成
    '/api/posts/[slug]',   // 個別ポスト取得・更新・削除
    '/api/upload/image'    // 画像アップロード
  ]
  
  components: [
    'MarkdownEditor',      // リアルタイムプレビュー付きエディター
    'FrontmatterEditor',   // メタデータ編集
    'ImageUpload',         // ドラッグ&ドロップ画像アップロード
    'AuthProvider',        // 認証コンテキスト
    'AdminDashboard'       // 管理画面UI
  ]
  
  libraries: [
    '@octokit/rest@22.0.0',        // GitHub API
    '@octokit/auth-app@8.0.2',     // GitHub App認証
    'jsonwebtoken@9.0.2',          // JWT処理
    'zod@4.0.5'                    // APIバリデーション
  ]
  
  security: [
    'HttpOnly Cookie設定',
    'CSRF protection (Next.js built-in)',
    'Input validation (Zod)',
    'File upload validation',
    '環境変数による認証情報管理'
  ]
}
```

### 🎯 次のステップ
**Phase 4: 画像最適化システム**
- Vercel無料プラン対応画像処理
- クライアントサイド圧縮システム
- レスポンシブ画像配信
- 画像ファイル管理システム

### 📊 技術的成果

#### Phase 1 & 2 統合結果
```typescript
interface CurrentStatus {
  codebase: {
    files: 'TypeScript strict mode対応'
    components: 'モジュラー設計 + 拡張タイポグラフィ'
    performance: 'Next.js 14最適化'
    accessibility: '日本語読者最適化強化'
  }
  
  metrics: {
    bundleSize: '87.1KB' // 目標<100KB維持 ✅
    staticPages: 183 // 178→183記事に増加
    buildTime: '<2分'
    typeErrors: 0
    lintErrors: 0
  }
  
  typography: {
    fontSystem: 'M PLUS 1p + Noto Sans JP + JetBrains Mono'
    responsiveScale: '12種類の精密フォントサイズ'
    optimization: 'font-feature-settings + プリロード'
    readability: '65ch + 24px垂直リズム'
  }
  
  infrastructure: {
    framework: 'Next.js 14 App Router'
    hosting: 'Vercel対応準備完了'
    cms: 'GitHub API統合準備完了'
    cdn: '画像最適化準備完了'
  }
}
```

#### Phase 2実装詳細
```typescript
interface Phase2Implementation {
  newComponents: [
    'Heading4', 'Heading5', 'Heading6',
    'BodyXL', 'BodySmall', 
    'CaptionSmall', 'Micro'
  ]
  
  cssUtilities: [
    'text-mixed-lang',           // 日英混在最適化
    'prose-reading-optimized',   // 読書体験向上
    'content-optimized',         // コンテンツ最適化
    'reading-rhythm',            // 垂直リズム
    'text-balance',              // テキスト均衡
    'paragraph-spacing-*'        // 段落スペーシング
  ]
  
  fontFeatures: [
    'font-feature-settings: "palt" 1, "kern" 1', // 日本語プロポーショナル
    'hanging-punctuation: first last',            // 約物ぶら下がり
    'text-rendering: optimizeLegibility',         // 読みやすさ最適化
    'font-variant-east-asian: proportional-width' // 東アジア文字最適化
  ]
}
```

### 🔄 開発ワークフロー
```bash
# 開発サーバー起動
npm run dev  # http://localhost:3001

# 品質チェック
npm run type-check && npm run lint && npm run build

# 全体品質確認
npm run check-all
```

## 結論

このCLAUDE.mdは、Cosmic Danceブログの完全再設計プロジェクトの包括的なガイドです。**Phase 1, 2 & 3の成功的な完了**により、強固な基盤、洗練されたタイポグラフィシステム、そして革新的なGitHub API統合コンテンツ管理システムが構築されました。

### 🎉 Phase 1, 2 & 3完了の成果
- **技術基盤**: Next.js 14 + TypeScript strict + 日本語最適化Tailwind CSS
- **タイポグラフィ**: 12種類の精密フォントスケール + 日英混在最適化
- **パフォーマンス**: 87.1KB軽量バンドル + 183記事静的生成
- **読書体験**: 65ch最適ライン長 + 24px垂直リズム + OpenType機能活用
- **コンテンツ管理**: GitHub API統合ヘッドレスCMS + リアルタイムエディター
- **認証システム**: JWT + HttpOnly Cookie + 環境変数ベース認証
- **管理UI**: 完全な管理画面 + 画像アップロード + フォーム管理

12週間の段階的実装計画に従って、各フェーズで測定可能な成果を達成し、最終的には軽量で美しく、使いやすいブログシステムが完成します。

**Phase 3の完了により、VS Code + git commitからWeb UI直接編集への移行が実現されました。** 次のPhase 4では、Vercel無料プラン対応の画像最適化システムの構築に取り組みます。