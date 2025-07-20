export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  draft: boolean
  summary?: string | undefined
  content: string
  readingTime: number
  wordCount: number
}

export interface BlogFrontmatter {
  title: string
  date: string
  tags: string[]
  draft?: boolean
  summary?: string
}

export interface SiteMetadata {
  title: string
  author: string
  headerTitle: string
  description: string
  language: string
  theme: string
  siteUrl: string
  siteRepo: string
  siteLogo: string
  image: string
  socialBanner: string
  email: string
  github: string
  twitter: string
  facebook: string
  youtube: string
  linkedin: string
  locale: string
}