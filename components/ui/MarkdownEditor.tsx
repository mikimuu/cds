'use client'

import { useState, useCallback, useEffect } from 'react'
import Button from './Button'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onSave?: () => void
  placeholder?: string
  className?: string
  previewMode?: boolean
  showPreview?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  onSave,
  placeholder = 'マークダウンで記事を書いてください...',
  className = '',
  previewMode = false,
  showPreview = true,
}: MarkdownEditorProps) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(previewMode)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S / Cmd+S で保存
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        onSave?.()
      }
      
      // Ctrl+P / Cmd+P でプレビュー切り替え
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        setIsPreviewVisible(prev => !prev)
      }
      
      // F11 でフルスクリーン切り替え
      if (e.key === 'F11') {
        e.preventDefault()
        setIsFullscreen(prev => !prev)
      }
      
      // Escape でフルスクリーン終了
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSave, isFullscreen])

  // マークダウンツールバー機能
  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newText)
    
    // カーソル位置を調整
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [value, onChange])

  const toolbarActions = [
    { label: '太字', action: () => insertText('**', '**'), shortcut: 'Ctrl+B' },
    { label: '斜体', action: () => insertText('*', '*'), shortcut: 'Ctrl+I' },
    { label: '見出し', action: () => insertText('## '), shortcut: 'Ctrl+H' },
    { label: 'リンク', action: () => insertText('[', '](url)'), shortcut: 'Ctrl+L' },
    { label: '画像', action: () => insertText('![alt](', ')'), shortcut: 'Ctrl+G' },
    { label: 'コード', action: () => insertText('`', '`'), shortcut: 'Ctrl+K' },
    { label: 'コードブロック', action: () => insertText('```\n', '\n```'), shortcut: 'Ctrl+Shift+K' },
  ]

  // プレビュー用のマークダウンレンダリング（簡単な実装）
  const renderPreview = (markdown: string) => {
    // 簡単なマークダウンパーサー（実際のプロジェクトではremarkやmarked等を使用）
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]*)`/gim, '<code>$1</code>')
      .replace(/\n/gim, '<br>')
  }

  const containerClass = `
    ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}
    ${className}
  `.trim()

  return (
    <div className={containerClass}>
      {/* ツールバー */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {toolbarActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-200"
                title={`${action.label} (${action.shortcut})`}
              >
                {action.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {showPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewVisible(!isPreviewVisible)}
              >
                {isPreviewVisible ? 'エディター' : 'プレビュー'}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? '元のサイズ' : 'フルスクリーン'}
            </Button>
            
            {onSave && (
              <Button
                variant="primary"
                size="sm"
                onClick={onSave}
              >
                保存 (Ctrl+S)
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* エディター・プレビューエリア */}
      <div className={`flex ${isFullscreen ? 'h-[calc(100vh-60px)]' : 'h-96'}`}>
        {/* エディター */}
        <div className={`${showPreview && isPreviewVisible ? 'w-1/2 border-r border-gray-200' : 'w-full'}`}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-full w-full resize-none border-0 p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-0"
            style={{
              fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
              lineHeight: '1.6',
              tabSize: 2,
            }}
          />
        </div>

        {/* プレビュー */}
        {showPreview && isPreviewVisible && (
          <div className="w-1/2 overflow-auto bg-gray-50 p-4">
            <div className="prose prose-sm max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: renderPreview(value),
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ステータスバー */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <div>
            文字数: {value.length} | 行数: {value.split('\n').length}
          </div>
          <div className="flex items-center space-x-4">
            <span>Ctrl+S: 保存</span>
            <span>Ctrl+P: プレビュー</span>
            <span>F11: フルスクリーン</span>
          </div>
        </div>
      </div>
    </div>
  )
}