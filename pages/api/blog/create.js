import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { title, content, tags } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    // フロントマターの作成
    const date = new Date().toISOString().split('T')[0]
    const frontmatter = {
      title,
      date: `'${date}'`,
      tags: tags || ['日記'],
      draft: false,
      summary: ''
    }

    // ファイル名の作成（日付をベースに）
    const fileName = `${date.replace(/-/g, '')}.mdx`
    const filePath = path.join(process.cwd(), 'data', 'blog', fileName)

    // マークダウンファイルの作成
    const fileContent = matter.stringify(content, frontmatter)
    
    fs.writeFileSync(filePath, fileContent)

    return res.status(200).json({ message: 'Post created successfully', fileName })
  } catch (error) {
    console.error('Error creating post:', error)
    return res.status(500).json({ message: 'Error creating post' })
  }
} 