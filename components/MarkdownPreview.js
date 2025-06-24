import { useState, useEffect } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

const MarkdownPreview = ({ content, className = '' }) => {
  const [renderedContent, setRenderedContent] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!content || content.trim() === '') {
      setRenderedContent('<p class="text-gray-500 italic">プレビューするコンテンツを入力してください...</p>')
      return
    }

    const processMarkdown = async () => {
      try {
        setError(null)
        const processor = unified()
          .use(remarkParse)
          .use(remarkGfm) // GitHub Flavored Markdown
          .use(remarkMath) // Math support
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeKatex) // KaTeX for math rendering
          .use(rehypeHighlight, { 
            languages: ['javascript', 'typescript', 'python', 'css', 'html', 'bash'],
            ignoreMissing: true 
          }) // Code highlighting
          .use(rehypeStringify, { allowDangerousHtml: true })

        const result = await processor.process(content)
        setRenderedContent(String(result))
      } catch (err) {
        console.error('Markdown processing error:', err)
        setError(err.message)
        setRenderedContent(`<p class="text-red-500">プレビューエラー: ${err.message}</p>`)
      }
    }

    // デバウンス処理
    const timeoutId = setTimeout(processMarkdown, 300)
    return () => clearTimeout(timeoutId)
  }, [content])

  if (error) {
    return (
      <div className={`${className} p-4 border border-red-300 rounded-lg bg-red-50`}>
        <p className="text-red-600 text-sm">プレビューエラー: {error}</p>
      </div>
    )
  }

  return (
    <div className={`${className} overflow-auto scrollbar-cosmic`}>
      <div 
        className="prose prose-lg max-w-none dark:prose-dark prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-cosmic-purple prose-strong:text-gray-900 prose-code:text-cosmic-purple prose-pre:bg-gray-800 prose-pre:text-white prose-blockquote:border-cosmic-purple prose-blockquote:text-gray-700"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
      
      {/* KaTeX CSS の動的ロード */}
      <style jsx global>{`
        @import url('https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css');
        
        /* コードハイライト用のスタイル */
        @import url('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css');
        
        /* プレビュー固有のスタイル */
        .prose img {
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin: 1.5rem 0;
        }
        
        .prose table {
          border-collapse: collapse;
          margin: 1rem 0;
        }
        
        .prose table th,
        .prose table td {
          border: 1px solid #e5e5e5;
          padding: 0.5rem 1rem;
        }
        
        .prose table th {
          background-color: #f9f9f9;
          font-weight: 600;
        }
        
        .prose blockquote {
          border-left: 4px solid #533483;
          background-color: rgba(83, 52, 131, 0.05);
          padding: 1rem;
          margin: 1rem 0;
          font-style: italic;
        }
        
        .prose code:not(pre code) {
          background-color: rgba(83, 52, 131, 0.1);
          color: #533483;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        
        .prose pre {
          background-color: #1a1a1a !important;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .prose pre code {
          background-color: transparent !important;
          color: inherit;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
        }
        
        /* リストのスタイリング */
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        
        .prose ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        
        .prose li {
          margin: 0.25rem 0;
        }
        
        /* リンクのスタイリング */
        .prose a {
          color: #533483;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .prose a:hover {
          color: #ffdf00;
          text-decoration: none;
        }
        
        /* 見出しのスタイリング */
        .prose h1 {
          color: #1a1a1a;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .prose h2 {
          color: #533483;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          color: #1a1a1a;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        /* 水平線のスタイリング */
        .prose hr {
          border-color: #533483;
          opacity: 0.3;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  )
}

export default MarkdownPreview