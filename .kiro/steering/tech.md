# Technology Stack - Cosmic Dance Blog

## Architecture

**Type**: Static Site Generation (SSG) with Server-Side API
**Pattern**: JAMstack architecture with GitHub as headless CMS
**Deployment**: Vercel edge network with automatic deployments from git
**Data Flow**: GitHub Repository → GitHub API → Next.js API Routes → Static Generation

## Frontend

### Core Framework
- **Next.js 14**: App Router with React Server Components
- **React 18**: Latest features including Suspense and concurrent features
- **TypeScript 5.5.4**: Strict mode with comprehensive type coverage

### Styling & UI
- **Tailwind CSS 3.4.9**: Utility-first CSS with custom Japanese typography configuration
- **Custom Design System**: Editorial-focused components with 12-point responsive typography scale
- **Font Stack**: M PLUS 1p (primary), Noto Sans JP (fallback), JetBrains Mono (code)
- **CSS Features**: Custom properties, font-feature-settings for Japanese text optimization

### Build Tools
- **MDX 3.0.1**: Markdown with JSX components for rich content
- **PostCSS**: Autoprefixer and advanced CSS processing
- **ESLint + Prettier**: Code quality and formatting with TypeScript rules

## Backend

### API Layer
- **Next.js API Routes**: Server-side endpoints for GitHub integration and authentication
- **GitHub API Integration**: Octokit SDK for repository operations
- **Authentication**: JWT tokens with HttpOnly cookies

### Content Management
- **GitHub as CMS**: Direct repository file operations for content storage
- **Gray Matter**: Frontmatter parsing for blog metadata
- **Remark/Rehype**: Markdown processing pipeline with syntax highlighting

### Key Libraries
```json
{
  "@octokit/rest": "^22.0.0",           // GitHub API client
  "@octokit/auth-app": "^8.0.2",        // GitHub App authentication
  "jsonwebtoken": "^9.0.2",             // JWT token handling
  "zod": "^4.0.5",                      // Runtime type validation
  "gray-matter": "^4.0.3",              // Frontmatter parsing
  "remark": "^15.0.1",                  // Markdown processing
  "rehype-highlight": "^7.0.0"          // Syntax highlighting
}
```

## Development Environment

### Required Tools
- **Node.js**: >=18.0.0 (specified in package.json engines)
- **npm**: Package management and script execution
- **Git**: Version control and deployment triggers
- **GitHub App**: Configured with repository permissions

### Setup Dependencies
- **TypeScript**: Language support and type checking
- **ESLint**: Code linting with Next.js and TypeScript presets
- **Prettier**: Code formatting with Tailwind plugin

## Common Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3001
npm run build        # Production build with static generation
npm run start        # Production server
```

### Quality Assurance
```bash
npm run type-check   # TypeScript validation
npm run lint         # ESLint linting
npm run lint:fix     # Auto-fix linting issues
npm run check-all    # Combined type-check + lint + build
```

### Testing
```bash
npm run test         # Jest test runner
npm run test:watch   # Jest in watch mode
```

## Environment Variables

### Required GitHub Configuration
```bash
GITHUB_APP_ID=1635437                    # GitHub App ID
GITHUB_INSTALLATION_ID=76710743          # Installation ID
GITHUB_PRIVATE_KEY="-----BEGIN RSA..."   # GitHub App private key (PEM format)
GITHUB_OWNER=mikimuu                     # Repository owner
GITHUB_REPO=cds                          # Repository name
GITHUB_BRANCH=main                       # Target branch
```

### Authentication
```bash
ADMIN_USERNAME=admin                     # Admin login username
ADMIN_PASSWORD=cosmic-dance-2025         # Admin login password
JWT_SECRET=your_jwt_secret_key           # JWT token signing key
```

### Optional Configuration
```bash
NEXT_PUBLIC_SITE_URL=https://cosmic-dancin.vercel.app  # Site URL for metadata
GITHUB_WEBHOOK_SECRET=webhook_secret                   # Webhook signature validation
```

## Port Configuration

### Default Ports
- **Development**: 3001 (Next.js dev server)
- **Production**: Dynamic (Vercel assigns ports)
- **Build Process**: No specific port requirements

### Port Conflicts
- If port 3000 is occupied, Next.js automatically uses 3001
- Development server supports custom port via `-p` flag: `npm run dev -- -p 3002`

## Performance Configuration

### Bundle Optimization
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js built-in with WebP/AVIF support
- **Font Loading**: Preload strategy for M PLUS 1p, swap display for fallbacks
- **Static Generation**: All blog posts pre-rendered at build time

### Vercel Optimization
- **Edge Functions**: Minimal API routes for optimal cold starts
- **Bandwidth Management**: Image compression to stay under 100GB monthly limit
- **Build Performance**: Incremental builds with caching