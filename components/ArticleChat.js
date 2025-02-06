import { useState, useRef, useEffect } from 'react';

export default function ArticleChat({ articleContent }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="chat-container mt-8 border rounded-lg bg-white dark:bg-gray-800 shadow-lg">
      <h3 className="text-lg font-bold p-4 border-b dark:border-gray-700">
        記事について質問する
      </h3>
      
      {error && (
        <div className="mx-4 my-3 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="chat-messages space-y-4 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`chat-message p-3 rounded-lg whitespace-pre-wrap ${
                message.role === 'user'
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 max-w-[85%] md:max-w-[75%]'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 max-w-[85%] md:max-w-[75%]'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              応答を生成中...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="質問を入力してください..."
            className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
}
