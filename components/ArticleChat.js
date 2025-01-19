import { useState } from 'react';

export default function ArticleChat({ articleContent }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    // ユーザーメッセージを追加
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          articleContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'エラーが発生しました');
      }

      // AIの応答を追加
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setError(error.message);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `申し訳ありません。エラーが発生しました：${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 border rounded-lg p-4 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-bold mb-4">記事について質問する</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 dark:bg-blue-900 ml-auto max-w-[80%]'
                : 'bg-gray-100 dark:bg-gray-700 mr-auto max-w-[80%]'
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 dark:text-gray-400">
            応答を生成中...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="質問を入力してください..."
          className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          送信
        </button>
      </form>
    </div>
  );
} 