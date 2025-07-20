import matter from 'gray-matter'
import readingTime from 'reading-time'
import { GitHubClient } from './github-client'
import { BlogPost, Frontmatter, MDXFile } from './api-schemas'

/**
 * MDXファイルからBlogPostオブジェクトを作成
 */
export function createBlogPostFromMDX(
  mdxFile: MDXFile,
  githubInfo: {
    sha: string
    lastCommit: {
      sha: string
      message: string
      author: {
        name: string
        email: string
        date: string
      }
    }
  }
): BlogPost {
  // 読み時間計算（日本語対応）
  const readingTimeResult = readingTime(mdxFile.content, {
    wordsPerMinute: 500, // 日本語の場合は文字/分で計算
  })

  // 抜粋生成（最初の150文字）
  const excerpt = mdxFile.content
    .replace(/^#.*$/gm, '') // 見出しを除去
    .replace(/```[\s\S]*?```/g, '') // コードブロックを除去
    .replace(/`[^`]*`/g, '') // インラインコードを除去
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // リンクからテキストのみ抽出
    .replace(/[#*_~`]/g, '') // マークダウン記号を除去
    .trim()
    .substring(0, 150)

  return {
    slug: mdxFile.slug,
    title: mdxFile.frontmatter.title,
    date: mdxFile.frontmatter.date,
    tags: mdxFile.frontmatter.tags,
    draft: mdxFile.frontmatter.draft || false,
    summary: mdxFile.frontmatter.summary,
    content: mdxFile.content,
    excerpt,
    readingTime: Math.ceil(readingTimeResult.minutes),
    wordCount: readingTimeResult.words,
    lastModified: githubInfo.lastCommit.author.date,
    images: mdxFile.frontmatter.images,
    github: {
      path: mdxFile.path,
      sha: githubInfo.sha,
      lastCommit: githubInfo.lastCommit,
    },
  }
}

/**
 * ブログポストをMDXファイル形式に変換
 */
export function createMDXFromBlogPost(post: {
  title: string
  date: string
  tags: string[]
  draft?: boolean
  summary?: string
  content: string
  images?: string[]
}): string {
  const frontmatter: Frontmatter = {
    title: post.title,
    date: post.date,
    tags: post.tags,
    draft: post.draft,
    summary: post.summary,
    images: post.images,
  }

  // フロントマターのキーでundefinedの値を除去
  const cleanFrontmatter = Object.fromEntries(
    Object.entries(frontmatter).filter(([_, value]) => value !== undefined)
  )

  return matter.stringify(post.content, cleanFrontmatter)
}

/**
 * MDXファイルをパース
 */
export function parseMDXFile(content: string, slug: string, path: string): MDXFile {
  const { data: frontmatter, content: markdownContent } = matter(content)

  return {
    frontmatter: {
      title: frontmatter.title || '',
      date: frontmatter.date || '',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      draft: frontmatter.draft || false,
      summary: frontmatter.summary,
      images: Array.isArray(frontmatter.images) ? frontmatter.images : undefined,
    },
    content: markdownContent,
    slug,
    path,
  }
}

/**
 * ファイルパスからスラッグを生成
 */
export function createSlugFromPath(path: string): string {
  return path
    .replace(/^data\/blog\//, '') // プレフィックスを除去
    .replace(/\.mdx?$/, '') // 拡張子を除去
    .replace(/\//g, '-') // スラッシュをハイフンに変換
}

/**
 * スラッグからファイルパスを生成
 */
export function createPathFromSlug(slug: string): string {
  return `data/blog/${slug}.mdx`
}

/**
 * GitHub経由でブログポスト一覧を取得
 */
export async function getBlogPostsFromGitHub(
  client: GitHubClient,
  options: {
    includeDrafts?: boolean
    tag?: string
    limit?: number
    offset?: number
  } = {}
): Promise<BlogPost[]> {
  try {
    // data/blog ディレクトリからMDXファイル一覧を取得
    const files = await client.listFiles('data/blog')
    const mdxFiles = files.filter(file => 
      file.type === 'file' && /\.mdx?$/.test(file.name)
    )

    const posts: BlogPost[] = []

    // 並列処理でファイルを取得・パース
    const filePromises = mdxFiles.map(async (file) => {
      try {
        const content = await client.getFileContent(file.path)
        const slug = createSlugFromPath(file.path)
        const mdxFile = parseMDXFile(content.content, slug, file.path)

        // 下書きフィルタリング
        if (!options.includeDrafts && mdxFile.frontmatter.draft) {
          return null
        }

        // タグフィルタリング
        if (options.tag && !mdxFile.frontmatter.tags.includes(options.tag)) {
          return null
        }

        // GitHub情報を取得（簡略化のため、ここではファイル情報を使用）
        const githubInfo = {
          sha: content.sha,
          lastCommit: {
            sha: content.sha,
            message: `Update ${file.name}`,
            author: {
              name: 'System',
              email: 'system@example.com',
              date: new Date().toISOString(),
            },
          },
        }

        return createBlogPostFromMDX(mdxFile, githubInfo)
      } catch (error) {
        return null
      }
    })

    const results = await Promise.all(filePromises)
    
    // nullを除去してソート
    const validPosts = results.filter((post): post is BlogPost => post !== null)
    validPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // ページネーション
    if (options.limit) {
      const start = options.offset || 0
      return validPosts.slice(start, start + options.limit)
    }

    return validPosts
  } catch (error) {
    throw new Error('ブログポストの取得に失敗しました')
  }
}

/**
 * GitHub経由で単一のブログポストを取得
 */
export async function getBlogPostFromGitHub(
  client: GitHubClient,
  slug: string
): Promise<BlogPost | null> {
  try {
    const path = createPathFromSlug(slug)
    const content = await client.getFileContent(path)
    const mdxFile = parseMDXFile(content.content, slug, path)

    const githubInfo = {
      sha: content.sha,
      lastCommit: {
        sha: content.sha,
        message: `Update ${slug}`,
        author: {
          name: 'System',
          email: 'system@example.com',
          date: new Date().toISOString(),
        },
      },
    }

    return createBlogPostFromMDX(mdxFile, githubInfo)
  } catch (error) {
    return null
  }
}

/**
 * GitHub経由でブログポストを作成
 */
export async function createBlogPostInGitHub(
  client: GitHubClient,
  postData: {
    title: string
    date: string
    tags: string[]
    draft?: boolean
    summary?: string
    content: string
    images?: string[]
  }
): Promise<{ post: BlogPost; commit: any }> {
  // スラッグ生成（日付 + タイトルから）
  const slug = generateSlugFromTitle(postData.title, postData.date)
  const path = createPathFromSlug(slug)

  // MDXコンテンツ生成
  const mdxContent = createMDXFromBlogPost(postData)

  // GitHubにファイル作成
  const commit = await client.createFile({
    path,
    content: mdxContent,
    message: `Add new blog post: ${postData.title}`,
  })

  // 作成されたポストを取得
  const post = await getBlogPostFromGitHub(client, slug)
  
  if (!post) {
    throw new Error('作成されたブログポストの取得に失敗しました')
  }

  return { post, commit }
}

/**
 * GitHub経由でブログポストを更新
 */
export async function updateBlogPostInGitHub(
  client: GitHubClient,
  slug: string,
  postData: {
    title: string
    date: string
    tags: string[]
    draft?: boolean
    summary?: string
    content: string
    images?: string[]
  }
): Promise<{ post: BlogPost; commit: any }> {
  const path = createPathFromSlug(slug)

  // 既存ファイルの情報を取得
  const existingContent = await client.getFileContent(path)

  // MDXコンテンツ生成
  const mdxContent = createMDXFromBlogPost(postData)

  // GitHubでファイル更新
  const commit = await client.updateFile({
    path,
    content: mdxContent,
    message: `Update blog post: ${postData.title}`,
    sha: existingContent.sha,
  })

  // 更新されたポストを取得
  const post = await getBlogPostFromGitHub(client, slug)
  
  if (!post) {
    throw new Error('更新されたブログポストの取得に失敗しました')
  }

  return { post, commit }
}

/**
 * タイトルと日付からスラッグを生成
 */
function generateSlugFromTitle(title: string, date: string): string {
  const datePrefix = date.replace(/-/g, '')
  const titleSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 特殊文字除去
    .replace(/\s+/g, '-') // スペースをハイフンに
    .replace(/-+/g, '-') // 連続ハイフンを統合
    .trim()

  return `${datePrefix}-${titleSlug}`
}

/**
 * GitHub経由でブログポストを削除
 */
export async function deleteBlogPostFromGitHub(
  client: GitHubClient,
  slug: string
): Promise<{ commit: any }> {
  const path = createPathFromSlug(slug)
  
  const commit = await client.deleteFile(
    path,
    `Delete blog post: ${slug}`
  )

  return { commit }
}