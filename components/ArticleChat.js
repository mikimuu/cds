import { useState, useRef, useEffect, useCallback } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'; // アイコンをインポート

// ローディングインジケーターコンポーネント
const LoadingIndicator = () => (
  <div className="flex items-center space-x-1">
    <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
  </div>
);

// コピーボタンコンポーネント
const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒後にアイコンを戻す
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      aria-label="Copy message"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-500" />
      ) : (
        <ClipboardIcon className="h-4 w-4" />
      )}
    </button>
  );
};


export default function ArticleChat({ articleContent }) {
  const [messages, setMessages] = useState([
    // 初期メッセージを追加
    { role: 'assistant', content: 'こんにちは！この記事について、どのようなことに関心がありますか？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null); // Textareaの参照

  // スクロール処理
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Textareaの高さ自動調整
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // 一旦高さをリセット
      textarea.style.height = `${textarea.scrollHeight}px`; // スクロール高さに合わせる
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight]);


  // 送信処理
  const sendMessage = useCallback(async (messageContent) => {
    if (!messageContent.trim()) return;

    setIsLoading(true);
    setError(null);
    setInput(''); // 送信後にクリア

    // ユーザーメッセージを追加
    const newUserMessage = { role: 'user', content: messageContent };
    setMessages(prev => [...prev, newUserMessage]);

    // Textareaの高さをリセット
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageContent, articleContent }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'APIエラーが発生しました');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `申し訳ありません、エラーが発生しました: ${err.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [articleContent]);

  // Enterキーでの送信ハンドラ
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // デフォルトの改行を防ぐ
      sendMessage(input);
    }
  }, [input, sendMessage]);

  // フォーム送信ハンドラ
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);


  return (
    <div className="chat-container mt-10 border rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md overflow-hidden flex flex-col max-h-[70vh]">
      <h3 className="text-base font-semibold p-3 border-b bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200 sticky top-0 z-10">
        この記事についてAIに質問する
      </h3>

      {error && (
        <div className="m-3 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
          エラー: {error}
        </div>
      )}

      <div className="chat-messages flex-1 space-y-4 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative chat-message py-2 px-3 rounded-lg shadow-sm whitespace-pre-wrap max-w-[90%] md:max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100'
              }`}
            >
              {msg.content}
              {/* AIのメッセージにコピーボタンを追加 */}
              {msg.role === 'assistant' && <CopyButton textToCopy={msg.content} />}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="py-2 px-3 rounded-lg bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 shadow-sm">
              <LoadingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* スクロール用 */}
      </div>

      {/* 入力フォームエリア */}
      <form onSubmit={handleSubmit} className="p-3 border-t bg-white dark:bg-gray-700 dark:border-gray-600 sticky bottom-0 z-10">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="質問を入力 (Shift+Enterで改行)"
            className="flex-1 p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden min-h-[40px] max-h-[150px] text-sm" // resize-none と overflow-hidden を追加
            rows={1} // 初期行数を1に
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end" // self-end を追加
            aria-label="Send message"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
}

// heroiconsのインストールが必要な場合は、ターミナルで以下を実行してください:
// npm install @heroicons/react
// または
// yarn add @heroicons/react
