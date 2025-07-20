# Project Structure - Cosmic Dance Blog

## Root Directory Organization

```
/Users/mikihisa.kimura/Documents/cds/
├── app/                    # Next.js 14 App Router pages and layouts
├── components/            # Reusable React components
├── lib/                   # Utility functions and API clients  
├── types/                 # TypeScript type definitions
├── data/                  # Blog content and site metadata
├── public/               # Static assets and images
├── .kiro/                # Kiro spec-driven development files
├── claude-code-spec/     # Claude Code specification documentation
└── [config files]       # Package.json, tsconfig, etc.
```

## Subdirectory Structures

### App Directory (`app/`)
**Pattern**: Next.js 14 App Router file-based routing
```
app/
├── layout.tsx                 # Root layout with fonts and metadata
├── page.tsx                   # Homepage with blog post listing
├── globals.css                # Global Tailwind styles and typography
├── admin/
│   └── page.tsx              # Admin dashboard with authentication
├── blog/
│   ├── page.tsx              # Blog listing page
│   └── [slug]/page.tsx       # Dynamic blog post pages
└── api/                      # Server-side API endpoints
    ├── auth/                 # Authentication endpoints
    │   ├── login/route.ts    # JWT login
    │   ├── logout/route.ts   # Logout and cookie clearing
    │   └── me/route.ts       # Current user verification
    ├── posts/                # Blog post CRUD operations
    │   ├── route.ts          # List/create posts
    │   └── [slug]/route.ts   # Get/update/delete individual posts
    ├── upload/
    │   └── image/route.ts    # Image upload to GitHub
    └── webhooks/
        └── github/route.ts   # GitHub webhook receiver
```

### Components Directory (`components/`)
**Pattern**: Atomic design with UI components and business logic separation
```
components/
└── ui/                       # Reusable UI components
    ├── Button.tsx            # Button component with variants
    ├── Card.tsx              # Content card layouts
    ├── Typography.tsx        # Typography system components
    ├── MarkdownEditor.tsx    # Real-time markdown editor
    ├── FrontmatterEditor.tsx # Blog metadata editor
    ├── ImageUpload.tsx       # Drag-and-drop image upload
    ├── LoginForm.tsx         # Authentication form
    └── GitHubConnectionTest.tsx # GitHub API connectivity test
```

### Library Directory (`lib/`)
**Pattern**: Functional modules with single responsibility
```
lib/
├── blog.ts                   # Local blog post operations and Japanese reading time
├── blog-github.ts            # GitHub-based blog operations  
├── github-client.ts          # GitHub API client wrapper
├── auth.ts                   # JWT authentication utilities
├── auth-context.tsx          # React authentication context
├── api-schemas.ts            # Zod validation schemas
├── utils.ts                  # Generic utility functions
└── webhook-utils.ts          # GitHub webhook signature validation
```

### Types Directory (`types/`)
**Pattern**: Domain-driven type organization
```
types/
├── blog.ts                   # Blog post and frontmatter types
└── github.ts                 # GitHub API and webhook types
```

### Data Directory (`data/`)
**Pattern**: File-based content management
```
data/
├── blog/                     # Blog post MDX files (180+ posts)
│   ├── 20250519.mdx         # Date-based naming for posts
│   ├── code-sample.md       # Legacy markdown format
│   └── nested-route/        # Subdirectory support
├── authors/                  # Author profiles
│   ├── default.md           # Default author
│   └── sparrowhawk.md       # Additional authors
├── siteMetadata.js          # Site configuration and metadata
├── headerNavLinks.js        # Navigation configuration
└── projectsData.js          # Project showcase data
```

## Code Organization Patterns

### Next.js App Router Patterns
- **Layout Hierarchy**: Root layout → Page layouts → Components
- **Server Components**: Default for all components unless client interaction needed
- **API Routes**: RESTful endpoints with proper HTTP methods
- **Metadata Generation**: Static and dynamic metadata for SEO

### Component Architecture
- **Composition over Inheritance**: Small, composable components
- **Props Interface**: TypeScript interfaces for all props
- **Conditional Rendering**: Guard clauses and early returns
- **Error Boundaries**: Graceful error handling for user experience

### State Management
- **Server State**: React Server Components and API routes
- **Client State**: React Context for authentication, useState for local state
- **Form State**: Controlled components with validation
- **No Global State Library**: Keeping complexity minimal

## File Naming Conventions

### TypeScript Files
- **Components**: PascalCase (`MarkdownEditor.tsx`)
- **Utilities**: camelCase (`blog-github.ts`)
- **API Routes**: lowercase with hyphens (`route.ts`)
- **Types**: camelCase with descriptive names (`blog.ts`)

### Content Files
- **Blog Posts**: Date-based format (`YYYYMMDD.mdx` or `YYYY-MM-DD.mdx`)
- **Legacy Posts**: Various formats preserved for compatibility
- **Static Assets**: Descriptive names with consistent extensions

### Directory Names
- **Lowercase with hyphens**: `claude-code-spec/`
- **Single words**: `app/`, `lib/`, `types/`
- **Kebab-case for multi-word**: `auth-context/`

## Import Organization

### Import Order
1. **Node.js built-ins**: `import fs from 'fs'`
2. **Third-party libraries**: `import { Octokit } from '@octokit/rest'`
3. **Internal modules**: `import { BlogPost } from '@/types/blog'`
4. **Relative imports**: `import './styles.css'`

### Path Aliases (tsconfig.json)
```typescript
{
  "@/*": ["./*"],                    // Root directory
  "@/components/*": ["components/*"], // Components
  "@/lib/*": ["lib/*"],              // Libraries
  "@/types/*": ["types/*"],          // Types
  "@/app/*": ["app/*"],              // App Router
  "@/data/*": ["data/*"]             // Data files
}
```

## Key Architectural Principles

### Separation of Concerns
- **Presentation Layer**: React components handle UI rendering only
- **Business Logic**: Utility functions in `lib/` handle data processing
- **Data Layer**: GitHub API and local file operations separated
- **API Layer**: Clean RESTful endpoints with proper error handling

### Type Safety
- **Strict TypeScript**: All files use strict mode with comprehensive typing
- **Runtime Validation**: Zod schemas for API inputs and external data
- **Error Handling**: Typed error responses and proper status codes

### Performance Optimization
- **Static Generation**: Blog posts pre-rendered at build time
- **Code Splitting**: Route-based automatic splitting
- **Image Optimization**: Next.js image component with WebP conversion
- **Font Loading**: Strategic preloading and fallback strategies

### Security Considerations
- **Input Validation**: All user inputs validated with Zod schemas
- **Authentication**: JWT tokens with HttpOnly cookies
- **API Security**: Rate limiting and proper error messages
- **Content Security**: GitHub webhook signature verification

### Maintainability
- **Single Responsibility**: Each module has one clear purpose
- **Consistent Patterns**: Similar operations follow same structure
- **Documentation**: Inline comments for complex business logic
- **Testing Ready**: Structure supports unit and integration testing