import { useState, useRef, useCallback, useEffect } from 'react'
import MarkdownPreview from './MarkdownPreview'

const EnhancedBlogEditor = ({ 
  initialTitle = '', 
  initialContent = '', 
  initialTags = '', 
  initialSummary = '',
  onSubmit,
  onCancel,
  submitButtonText = '投稿する',
  isLoading = false 
}) => {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [tags, setTags] = useState(initialTags)
  const [summary, setSummary] = useState(initialSummary)
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState('editor')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  
  const contentRef = useRef(null)
  const fileInputRef = useRef(null)

  // 文字数・単語数カウント
  useEffect(() => {
    setCharCount(content.length)
    setWordCount(content.trim() ? content.trim().split(/\s+/).length : 0)
  }, [content])

  // 自動保存機能
  useEffect(() => {
    const autoSave = () => {
      if (title || content) {
        const draftData = { title, content, tags, summary, timestamp: Date.now() }
        localStorage.setItem('blog-draft', JSON.stringify(draftData))
      }
    }

    const timeoutId = setTimeout(autoSave, 2000) // 2秒後に自動保存
    return () => clearTimeout(timeoutId)
  }, [title, content, tags, summary])

  // 下書きの復元
  useEffect(() => {
    if (!initialTitle && !initialContent) {
      const savedDraft = localStorage.getItem('blog-draft')
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft)
          const isRecent = Date.now() - draftData.timestamp < 24 * 60 * 60 * 1000 // 24時間以内
          if (isRecent && confirm('保存された下書きがあります。復元しますか？')) {
            setTitle(draftData.title || '')
            setContent(draftData.content || '')
            setTags(draftData.tags || '')
            setSummary(draftData.summary || '')
          }
        } catch (error) {
          console.error('Draft restoration error:', error)
        }
      }
    }
  }, [])

  // 画像アップロード
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        insertTextAtCursor(`\n${data.markdown}\n`)
        setStatus('画像をアップロードしました')
        setTimeout(() => setStatus(''), 3000)
      } else {
        setStatus(`画像アップロードエラー: ${data.message}`)
      }
    } catch (error) {
      setStatus('画像アップロードエラー')
      console.error('Error:', error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // テキスト挿入ヘルパー
  const insertTextAtCursor = useCallback((text) => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = content.substring(0, start) + text + content.substring(end)
    setContent(newContent)
    
    // カーソル位置を挿入したテキストの後に設定
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }, [content])

  // マークダウンツールバー
  const insertMarkdown = (type) => {
    switch (type) {
      case 'bold':
        insertTextAtCursor('**太字**')
        break
      case 'italic':
        insertTextAtCursor('*斜体*')
        break
      case 'heading':
        insertTextAtCursor('\n## 見出し\n')
        break
      case 'link':
        insertTextAtCursor('[リンクテキスト](URL)')
        break
      case 'code':
        insertTextAtCursor('`コード`')
        break
      case 'codeblock':
        insertTextAtCursor('\n```javascript\n// コードブロック\n```\n')
        break
      case 'quote':
        insertTextAtCursor('\n> 引用文\n')
        break
      case 'list':
        insertTextAtCursor('\n- リスト項目\n- リスト項目\n')
        break
      case 'table':
        insertTextAtCursor('\n| ヘッダー1 | ヘッダー2 |\n|-----------|----------|\n| セル1     | セル2     |\n')
        break
    }
  }

  // フォーム送信
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      setStatus('タイトルと本文は必須です')
      return
    }

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        summary: summary.trim()
      })
      
      // 成功時に下書きをクリア
      localStorage.removeItem('blog-draft')
    } catch (error) {
      setStatus(`エラー: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cosmic-dark via-cosmic-mid to-cosmic-dark">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 cosmic-text-gradient">
              ✨ Enhanced Editor
            </h1>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span>{charCount} 文字</span>
              <span>{wordCount} 単語</span>
              <span className="text-green-400">自動保存中...</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
              className="bg-cosmic-purple/80 hover:bg-cosmic-purple text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              {activeTab === 'editor' ? '👁️ プレビュー' : '✏️ エディター'}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                キャンセル
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* メタデータ入力 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* タイトル */}
            <div className="lg:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                📝 タイトル
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 glass-morphism rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cosmic-purple border-0"
                placeholder="魅力的なタイトルを入力してください..."
                required
              />
            </div>

            {/* サマリー */}
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-white mb-2">
                📋 サマリー
              </label>
              <input
                type="text"
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-3 glass-morphism rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cosmic-purple border-0"
                placeholder="記事の簡潔な要約..."
                maxLength={200}
              />
              <div className="text-xs text-white/50 mt-1">{summary.length}/200 文字</div>
            </div>

            {/* タグ */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-white mb-2">
                🏷️ タグ
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 glass-morphism rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cosmic-purple border-0"
                placeholder="タグ1, タグ2, タグ3..."
              />
              <div className="text-xs text-white/50 mt-1">カンマ区切りで入力</div>
            </div>
          </div>

          {/* エディター/プレビュー切り替え */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* エディター部分 */}
            <div className={`${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-white">
                  ✍️ 本文 (Markdown)
                </label>
                
                {/* マークダウンツールバー */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-cosmic-dark/50 rounded-lg p-1">
                    <button type="button" onClick={() => insertMarkdown('bold')} className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded text-sm" title="太字">
                      <strong>B</strong>
                    </button>
                    <button type="button" onClick={() => insertMarkdown('italic')} className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded text-sm italic" title="斜体">
                      I
                    </button>
                    <button type="button" onClick={() => insertMarkdown('heading')} className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded text-sm" title="見出し">
                      H
                    </button>
                    <button type="button" onClick={() => insertMarkdown('link')} className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded text-sm" title="リンク">
                      🔗
                    </button>
                    <button type="button" onClick={() => insertMarkdown('code')} className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded text-sm" title="インラインコード">
                      &lt;&gt;
                    </button>
                    <button type="button" onClick={() => insertMarkdown('codeblock')} className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded text-sm" title="コードブロック">
                      📄
                    </button>
                    <button type="button" onClick={() => insertMarkdown('quote')} className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded text-sm" title="引用">
                      "
                    </button>
                    <button type="button" onClick={() => insertMarkdown('list')} className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded text-sm" title="リスト">
                      •
                    </button>
                    <button type="button" onClick={() => insertMarkdown('table')} className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded text-sm" title="テーブル">
                      ⊞
                    </button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-cosmic-star/80 hover:bg-cosmic-star text-black px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-1"
                  >
                    {uploading ? '⏳' : '📷'} 
                    {uploading ? 'アップロード中...' : '画像'}
                  </button>
                </div>
              </div>
              
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="24"
                className="w-full px-4 py-3 glass-morphism rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cosmic-purple border-0 font-mono text-sm leading-relaxed scrollbar-cosmic resize-none"
                placeholder="ここに素晴らしい記事を書いてください...

# 見出し1
## 見出し2

**太字** や *斜体* を使って文章を装飾できます。

- リスト項目1
- リスト項目2

[リンク](https://example.com) や `コード` も簡単に挿入できます。

```javascript
// コードブロックも対応
console.log('Hello, World!');
```

> 引用文はこのように表示されます。"
                required
              />
            </div>

            {/* プレビュー部分 */}
            <div className={`${activeTab === 'editor' ? 'hidden lg:block' : ''}`}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white">
                  👁️ プレビュー
                </label>
              </div>
              
              <div className="glass-morphism rounded-lg p-6 h-[600px] overflow-auto scrollbar-cosmic">
                {/* プレビューヘッダー */}
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                    {title}
                  </h1>
                )}
                
                {summary && (
                  <div className="bg-cosmic-purple/10 p-4 rounded-lg mb-6 text-sm text-gray-700 italic">
                    📋 {summary}
                  </div>
                )}
                
                {tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.split(',').map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-cosmic-purple/20 text-cosmic-purple text-xs rounded-full">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* マークダウンプレビュー */}
                <MarkdownPreview content={content} />
              </div>
            </div>
          </div>

          {/* フッター */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="flex items-center gap-4">
              {status && (
                <div className={`text-sm px-4 py-2 rounded-lg flex items-center gap-2 ${
                  status.includes('エラー') 
                    ? 'bg-red-500/20 text-red-300' 
                    : status.includes('アップロード')
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {status.includes('エラー') ? '❌' : status.includes('アップロード') ? '✅' : 'ℹ️'}
                  {status}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || uploading || !title.trim() || !content.trim()}
              className="bg-gradient-to-r from-cosmic-purple to-cosmic-star hover:from-cosmic-star hover:to-cosmic-purple text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  処理中...
                </>
              ) : (
                <>
                  🚀 {submitButtonText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EnhancedBlogEditor