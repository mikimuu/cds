'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Button from './Button'

interface ImageUploadProps {
  onUpload: (file: File) => Promise<{ url: string; path: string }>
  onError?: (error: string) => void
  maxFileSize?: number // bytes
  acceptedFormats?: string[]
  className?: string
}

interface UploadedImage {
  file: File
  url: string
  path: string
  uploading: boolean
}

export function ImageUpload({
  onUpload,
  onError,
  maxFileSize = 4.5 * 1024 * 1024, // 4.5MB (Vercel limit)
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  // ファイル検証
  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `サポートされていないファイル形式です。${acceptedFormats.join(', ')}のみ対応しています。`
    }
    
    if (file.size > maxFileSize) {
      return `ファイルサイズが大きすぎます。最大${(maxFileSize / 1024 / 1024).toFixed(1)}MBまでです。`
    }
    
    return null
  }, [acceptedFormats, maxFileSize])

  // 画像圧縮（クライアントサイド）
  const compressImage = (file: File, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new window.Image()
      
      img.onload = () => {
        // 最大サイズを設定（1920x1080）
        const maxWidth = 1920
        const maxHeight = 1080
        
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        
        canvas.width = width
        canvas.height = height
        
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => resolve(blob!),
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          quality
        )
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // ファイルアップロード処理
  const handleFileUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file) continue
      
      // ファイル検証
      const validationError = validateFile(file)
      if (validationError) {
        onError?.(validationError)
        continue
      }

      // 圧縮前の状態でリストに追加
      const imageEntry: UploadedImage = {
        file,
        url: '',
        path: '',
        uploading: true,
      }
      
      setUploadedImages(prev => [...prev, imageEntry])

      try {
        // 画像圧縮
        const compressedBlob = await compressImage(file)
        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        })

        // アップロード実行
        const result = await onUpload(compressedFile)
        
        // 成功時にリストを更新
        setUploadedImages(prev => 
          prev.map(img => 
            img.file === file 
              ? { ...img, url: result.url, path: result.path, uploading: false }
              : img
          )
        )
      } catch (error) {
        // エラー時にリストから削除
        setUploadedImages(prev => prev.filter(img => img.file !== file))
        onError?.(error instanceof Error ? error.message : 'アップロードに失敗しました')
      }
    }
  }, [onUpload, onError, validateFile])

  // ドラッグ&ドロップハンドラー
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [handleFileUpload])

  // ファイル選択ハンドラー
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
    // inputをリセット（同じファイルを再選択できるように）
    e.target.value = ''
  }, [handleFileUpload])

  // マークダウン形式でコピー
  const copyMarkdown = (image: UploadedImage) => {
    const markdown = `![${image.file.name}](${image.url})`
    navigator.clipboard.writeText(markdown)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* アップロードエリア */}
      <div
        className={`
          relative rounded-lg border-2 border-dashed p-6 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">
              画像をドラッグ&ドロップ、または
            </p>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="secondary" size="sm" type="button">
                ファイルを選択
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                accept={acceptedFormats.join(',')}
                onChange={handleFileSelect}
                className="sr-only"
              />
            </label>
          </div>
          
          <p className="text-xs text-gray-500">
            {acceptedFormats.join(', ')} | 最大 {(maxFileSize / 1024 / 1024).toFixed(1)}MB
          </p>
        </div>
      </div>

      {/* アップロード済み画像一覧 */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">アップロード済み画像</h4>
          <div className="space-y-2">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <div className="flex items-center space-x-3">
                  {image.url && (
                    <Image
                      src={image.url}
                      alt={image.file.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {image.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(image.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {image.uploading ? (
                    <span className="text-xs text-gray-500">アップロード中...</span>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMarkdown(image)}
                      >
                        マークダウンをコピー
                      </Button>
                      <code className="text-xs text-gray-600">
                        {image.url}
                      </code>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}