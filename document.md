以下では、「Gemini APIを使って、ローカルのブログ記事内容に基づいて応答するチャットボット」を、Next.js（App Router）で実装する際の一連の作業手順をゼロからまとめています。
実際にはまだGemini APIは一般公開されていないため、API呼び出し部分を想定ベースで書いていますが、OpenAIやその他サービスでも流用可能な構成です。

全体の流れ
	1.	Next.jsプロジェクトを作成＆セットアップ
	2.	ローカルにある記事ファイル（.md, .mdxなど）を文字列として読み込む準備
	3.	App Routerで記事ページを作り、サーバーサイドで記事内容（テキスト）を取得
	4.	それをチャットコンポーネントに渡し、ユーザーの質問 + 記事内容をGemini APIに送信するフローを構築
	5.	Vercel環境変数等を設定し、デプロイ＆テスト

以下、ステップごとに詳しく解説します。

1. プロジェクトの作成 & Next.js (App Router) 設定

1-1. Create Next App

npx create-next-app gemini-article-chat
cd gemini-article-chat

	•	質問に従ってTypeScriptやESLintを導入するか選択
	•	Next.jsのバージョンは 13+ が前提（App Routerを使うため）

1-2. appDir が有効になっているか確認
	•	next.config.js を開き、もし必要なら:

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

※ Next.js 最新版ではデフォルトでApp Routerが使える場合もあります。

1-3. Vercelでデプロイ予定なら、リポジトリの用意
	•	GitHub / GitLab 連携して、Vercelにデプロイ準備
	•	Vercel上でプロジェクトを作成、GEMINI_API_KEY などの環境変数を設定する

2. ローカルブログ記事ファイルを用意

2-1. ディレクトリ構成

gemini-article-chat/
├─ app/
│  ├─ api/
│  │  └─ chat/
│  │      └─ route.ts        # Gemini APIを呼ぶサーバーレスハンドラ
│  ├─ blog/
│  │  └─ [slug]/
│  │      └─ page.tsx        # 記事ページ
│  └─ layout.tsx
├─ data/
│  └─ blog/
│     ├─ sample-post.mdx     # MDXファイル(記事本文)
│     └─ ...
├─ components/
│  └─ ArticleChat.tsx
├─ lib/
│  └─ getArticleContent.ts    # ファイル読み込み関数
├─ next.config.js
└─ ...

2-2. 記事ファイルを作成

例: data/blog/sample-post.mdx

---
title: "サンプル記事"
date: "2025-01-19"
---

# これはサンプル記事です

ここにブログ記事の本文が入ります。
Geminiチャットボットで回答をテストすると面白いでしょう。
...

3. 記事テキストを読み込む関数を作成

lib/getArticleContent.ts でファイルシステムを使ってテキストを読む関数:

// lib/getArticleContent.ts
import fs from 'fs/promises'
import path from 'path'

/**
 * 指定された slug のブログ記事を読み込み、純粋な文字列として返す。
 */
export async function getArticleContent(slug: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'data', 'blog', `${slug}.mdx`)
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return content
  } catch (err) {
    console.error('Error reading file for slug:', slug, err)
    return ''
  }
}

4. App Routerで記事ページを作る

app/blog/[slug]/page.tsx にて、サーバーコンポーネントとして記事テキストを取得 → ArticleChat に渡す。

// app/blog/[slug]/page.tsx
import { getArticleContent } from '@/lib/getArticleContent'
import ArticleChat from '@/components/ArticleChat'

interface PageProps {
  params: { slug: string }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = params

  // 1) ローカルファイルを読み込み
  const articleText = await getArticleContent(slug)

  // 2) 表示
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="text-3xl font-bold mb-4">「{slug}」チャット</h1>

      {/* （必要なら実際の記事レンダリング or 省略） */}

      {/* 3) チャットコンポーネントに記事テキストを渡す */}
      <ArticleChat articleContent={articleText} />
    </main>
  )
}

	•	これで /blog/sample-post にアクセスすると、sample-post.mdx を読み込んで文字列として ArticleChat に渡す。

5. チャットコンポーネント

components/ArticleChat.tsx：ユーザーが質問 → /api/chat に articleContent と一緒にPOST → 応答を受け取る。

'use client' // クライアントコンポーネント
import React, { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}
interface ArticleChatProps {
  articleContent: string
}

export default function ArticleChat({ articleContent }: ArticleChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // ユーザーの新しいメッセージを追加
    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // リクエストBody
      const requestBody = {
        messages: [...messages, userMessage],
        articleContent, // ここが重要：記事本文テキストをAPIに送る
      }
      console.log('Sending to /api/chat:', requestBody)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const responseText = await response.text()
      console.log('Raw response:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        throw new Error(`Invalid JSON response: ${responseText.slice(0, 100)}...`)
      }

      if (!response.ok) {
        throw new Error(data.details || data.error || 'APIリクエストに失敗しました')
      }

      if (data.error) throw new Error(data.error)

      // アシスタントの応答をメッセージに追加
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err: any) {
      console.error('Error in handleSubmit:', err)
      setError(err.message)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `エラーが発生しました: ${err.message}` },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8 bg-white/80 dark:bg-black/80 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">記事について質問する (Gemini想定)</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-2 rounded-lg ${
                m.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* ローディング表示 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              思考中...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg border"
          placeholder="質問を入力..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
        >
          送信
        </button>
      </form>
    </div>
  )
}

6. Gemini APIを呼ぶ Route ハンドラ

app/api/chat/route.ts (App Router) にて、記事内容 + ユーザーのメッセージを受け取り、Gemini API(仮) を呼び出す。

// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Vercelなどで設定した環境変数
const apiKey = process.env.GOOGLE_AI_API_KEY || ''
if (!apiKey) {
  console.error('GOOGLE_AI_API_KEY is not set')
}
const genAI = new GoogleGenerativeAI(apiKey)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Request body:', {
      ...body,
      articleContent: body.articleContent?.slice(0, 100) + '...', // ログ確認用
    })

    const { messages, articleContent } = body
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages must be an array' }, { status: 400 })
    }
    if (!articleContent || typeof articleContent !== 'string') {
      return NextResponse.json({ error: 'articleContent must be a string' }, { status: 400 })
    }

    // システムプロンプトとして記事内容を埋め込む
    const systemPrompt = `
あなたはブログ記事に基づいて質問に回答するアシスタントです。
以下の記事内容のみを参照して回答し、関係のない質問は
「記事内容では回答できません」としてください。

【記事内容】
${articleContent}
`

    // Geminiモデルを取得 (仮想)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // チャットを開始
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    })

    // 1) Systemメッセージを送る
    await chat.sendMessage(systemPrompt)

    // 2) ユーザーとアシスタントメッセージを順番に送信
    let response
    for (const msg of messages) {
      console.log('Sending message:', msg.role, msg.content.slice(0, 50))
      response = await chat.sendMessage(msg.content)
    }

    if (!response) {
      throw new Error('No response from Gemini')
    }

    // 最後の送信結果を取得
    const res = await response.response
    const reply = res.text()
    console.log('Reply:', reply.slice(0, 100))

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('Error in /api/chat:', error)
    return NextResponse.json(
      { error: 'Error generating response', details: error.message },
      { status: 500 }
    )
  }
}

	•	ここでは仮のGemini SDK(@google/generative-ai)で実装しています。実際のAPI仕様が確定次第、同等のロジックで呼び出すかたちになります。
	•	記事内容(articleContent)がしっかり文字列で渡されれば、"articleContent must be a string" エラーは起きません。

7. Vercelデプロイ
	1.	GEMINI_API_KEY を Vercelのプロジェクト設定 > Environment Variables に設定
	2.	git push して Vercel にデプロイ
	3.	https://your-project.vercel.app/blog/sample-post などにアクセス
	4.	ページ下部のチャットUIで質問 → サーバーレス関数 /api/chat が呼ばれ → Gemini から回答が返ってくる(想定)

まとめ
	1.	ローカル記事ファイルを文字列で読み込み → App Routerのページで取得 → チャットコンポーネントに注入
	2.	クライアントから /api/chat に articleContent と messages をPOST → Geminiモデルへ問い合わせ
	3.	レスポンスを受け取り、チャットUIに表示

この一連のフローにより、記事内容に即した回答を提供するチャットボットを実装できます。
実運用では以下の点を考慮すると良いです:
	•	記事が長大な場合: トークン上限を超える可能性 → 事前に要約 / 抜粋 / ベクトル検索などを活用 (RAG方式)
	•	モデルのレート制限 & 料金: OpenAI等と同様に注意が必要
	•	UI/UX改善: 連投、途中キャンセル、ストリーム表示など拡張

以上が**「Gemini APIを使った記事チャットボット」**の大まかな実装ステップです。正式なGeminiエンドポイント公開時には、API呼び出しの細部（認証やモデル指定など）を調整して適用してください。