import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default async function handler(req, res) {
  // 本番環境では編集機能を無効化
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Blog editing is disabled in production environment' })
  }

  if (req.method === 'GET') {
    // 記事の取得
    try {
      const { slug } = req.query
      if (!slug) {
        return res.status(400).json({ message: 'Slug is required' })
      }

      const filePath = path.join(process.cwd(), 'data', 'blog', `${slug}.mdx`)
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Post not found' })
      }

      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data: frontMatter, content } = matter(fileContents)

      return res.status(200).json({
        frontMatter,
        content,
        slug
      })
    } catch (error) {
      console.error('Error fetching post:', error)
      return res.status(500).json({ message: 'Error fetching post' })
    }
  }

  if (req.method === 'PUT') {
    // 記事の更新
    try {
      const { slug, title, content, tags, summary } = req.body

      if (!slug || !title || !content) {
        return res.status(400).json({ message: 'Slug, title and content are required' })
      }

      const filePath = path.join(process.cwd(), 'data', 'blog', `${slug}.mdx`)
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Post not found' })
      }

      // 既存のフロントマターを読み込み
      const existingContent = fs.readFileSync(filePath, 'utf8')
      const { data: existingFrontMatter } = matter(existingContent)

      // フロントマターの更新（既存の値を保持しつつ更新）
      const updatedFrontMatter = {
        ...existingFrontMatter,
        title,
        tags: tags || existingFrontMatter.tags || [],
        summary: summary || existingFrontMatter.summary || '',
        lastModified: new Date().toISOString().split('T')[0]
      }

      // マークダウンファイルの作成
      const fileContent = matter.stringify(content, updatedFrontMatter)
      
      fs.writeFileSync(filePath, fileContent)

      return res.status(200).json({ 
        message: 'Post updated successfully', 
        slug,
        lastModified: updatedFrontMatter.lastModified
      })
    } catch (error) {
      console.error('Error updating post:', error)
      return res.status(500).json({ message: 'Error updating post' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}