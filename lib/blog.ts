import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost, BlogFrontmatter } from '@/types/blog'

const BLOG_DIR = path.join(process.cwd(), 'data/blog')

function calculateJapaneseReadingTime(content: string): number {
  // 日本語文字数をカウント（ひらがな、カタカナ、漢字）
  const japaneseChars = content.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []
  // 英数字文字数をカウント
  const englishWords = content.match(/[a-zA-Z0-9]+/g) || []
  
  // 日本語: 500文字/分、英語: 250語/分で計算
  const japaneseTime = japaneseChars.length / 500
  const englishTime = englishWords.length / 250
  
  return Math.ceil(japaneseTime + englishTime)
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, '')
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(BLOG_DIR)) {
    return []
  }

  const files = fs.readdirSync(BLOG_DIR)
  const posts = files
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => {
      const slug = getSlugFromFilename(file)
      const fullPath = path.join(BLOG_DIR, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      const frontmatter = data as BlogFrontmatter
      const readingTimeResult = calculateJapaneseReadingTime(content)
      const wordCount = content.length

      return {
        slug,
        title: frontmatter.title || 'Untitled',
        date: frontmatter.date || new Date().toISOString().split('T')[0]!,
        tags: frontmatter.tags || [],
        draft: frontmatter.draft || false,
        summary: frontmatter.summary,
        content,
        readingTime: readingTimeResult,
        wordCount,
      } as BlogPost
    })
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const possibleFiles = [`${slug}.mdx`, `${slug}.md`]
    let fullPath = ''
    let fileContents = ''

    for (const filename of possibleFiles) {
      const testPath = path.join(BLOG_DIR, filename)
      if (fs.existsSync(testPath)) {
        fullPath = testPath
        fileContents = fs.readFileSync(fullPath, 'utf8')
        break
      }
    }

    if (!fileContents) {
      return null
    }

    const { data, content } = matter(fileContents)
    const frontmatter = data as BlogFrontmatter
    
    // MDXコンテンツを簡易的にHTMLに変換（実際のプロダクションではMDXコンパイラーを使用）
    const htmlContent = content
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[h1-6]|<ul|<li|<\/)/gm, '<p>')
      .replace(/(?<!>)$/gm, '</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<[h1-6])/g, '$1')
      .replace(/(<\/[h1-6]>)<\/p>/g, '$1')
      .replace(/<p>(<ul)/g, '$1')
      .replace(/(<\/ul>)<\/p>/g, '$1') || ''

    const readingTimeResult = calculateJapaneseReadingTime(content)
    const wordCount = content.length

    return {
      slug,
      title: frontmatter.title || 'Untitled',
      date: frontmatter.date || new Date().toISOString().split('T')[0]!,
      tags: frontmatter.tags || [],
      draft: frontmatter.draft || false,
      summary: frontmatter.summary,
      content: htmlContent,
      readingTime: readingTimeResult,
      wordCount,
    }
  } catch (error) {
    return null
  }
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const allTags = posts.flatMap((post) => post.tags)
  const uniqueTags = Array.from(new Set(allTags))
  return uniqueTags.sort()
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.tags.includes(tag))
}