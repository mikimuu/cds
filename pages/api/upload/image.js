import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public', 'static', 'images'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Upload error:', err)
        return res.status(500).json({ message: 'アップロードエラー' })
      }

      const file = files.image
      if (!file) {
        return res.status(400).json({ message: 'ファイルが見つかりません' })
      }

      // ファイル名を生成（タイムスタンプ + オリジナルのファイル名）
      const timestamp = new Date().getTime()
      const originalName = file[0].originalFilename
      const newFileName = `${timestamp}-${originalName}`
      const newPath = path.join(process.cwd(), 'public', 'static', 'images', newFileName)

      // ファイルをリネーム
      fs.renameSync(file[0].filepath, newPath)

      // Markdown用の画像パスを返す
      const markdownPath = `/static/images/${newFileName}`
      res.status(200).json({ 
        url: markdownPath,
        markdown: `![${originalName}](${markdownPath})`
      })
    })
  } catch (error) {
    console.error('Error handling upload:', error)
    res.status(500).json({ message: 'アップロードエラー' })
  }
} 