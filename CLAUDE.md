# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Cosmic Dance** (宇宙的舞踏), a Next.js 15 blog application built on the Tailwind Next.js Starter Blog template. It features a cosmic/space theme with Japanese content support, interactive elements, and modern web technologies.

## Development Commands

```bash
# Development
npm start          # Development with file watching
npm run dev        # Standard development server

# Production
npm run build      # Production build with sitemap generation
npm run serve      # Production server

# Code Quality
npm run lint       # ESLint with auto-fix
npm run analyze    # Bundle size analysis with @next/bundle-analyzer
```

## Architecture Overview

### Core Technologies
- **Next.js 15** with React 18
- **MDX** for rich blog content via `mdx-bundler`
- **Tailwind CSS** with custom cosmic theme
- **Three.js** for 3D cosmic effects

### Key Directories
- `/components/` - React components including cosmic effects (CosmicBackground, etc.)
- `/layouts/` - Page layout templates (PostLayout, ListLayout)
- `/data/blog/` - MDX blog posts with frontmatter
- `/data/authors/` - Author profiles and metadata
- `/lib/` - Utilities for MDX processing, tags, and content management
- `/pages/api/` - API routes for blog creation, chat, and integrations

### Styling System
- Custom **cosmic theme** in `tailwind.config.js` with space-inspired colors
- Japanese typography support via Shippori Mincho font
- Dark/light theme toggle with cosmic color variants
- Custom animations and gradients for space effects

### Content Management
- Blog posts are MDX files in `/data/blog/` with YAML frontmatter
- Authors defined in `/data/authors/` with profile information
- Site metadata configured in `/data/siteMetadata.js`
- Automatic tag page generation from blog post tags

### Special Features
- **AI Integration**: Google Generative AI for article chat functionality
- **Music Integration**: Spotify Web Playback SDK
- **Comments**: Giscus-based commenting system
- **Analytics**: Multi-provider support (Google Analytics, Umami, Vercel)
- **Newsletter**: Buttondown integration with multiple provider fallbacks

## Configuration Files

### next.config.js
- Preact swap in production for bundle optimization
- Security headers with CSP configuration
- Shader file loading support for Three.js
- Bundle analyzer integration

### tailwind.config.js
- Custom "cosmic" color palette (cosmic-dark, cosmic-purple, etc.)
- Japanese font family configuration
- Typography plugin with theme-aware prose styles
- Custom animations for cosmic effects

## Development Patterns

### Component Structure
- Cosmic-themed components use Three.js for 3D effects
- Image components wrap Next.js Image with cosmic styling
- Layout components handle responsive design and theme switching

### MDX Processing
- `lib/mdx.js` handles MDX bundling with rehype/remark plugins
- Math expressions supported via KaTeX
- Code highlighting with Prism themes
- Automatic table of contents generation

### API Routes
- `/api/blog/create.js` - Blog post creation with validation
- `/api/chat.js` - AI-powered article discussions
- Newsletter provider integrations with fallback handling

## Path Aliases
Configured in `jsconfig.json`:
- `@/components/*` → `./components/*`
- `@/data/*` → `./data/*`
- `@/lib/*` → `./lib/*`
- `@/layouts/*` → `./layouts/*`

## Japanese Content Support
- Configured for Japanese typography in Tailwind
- Blog posts support Japanese content with proper font rendering
- Site metadata includes Japanese title and descriptions