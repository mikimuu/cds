import React, { useState } from 'react';

export default function CommentForm() {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // APIエンドポイントにデータを送信
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, comment }),
    });

    if (response.ok) {
      // 成功した場合、フォームをリセット
      setName('');
      setComment('');
      alert('コメントが追加されました！');
    } else {
      // エラー処理
      alert('コメントの追加に失敗しました。');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="お名前"
        required
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="コメント"
        required
      />
      <button type="submit">コメントを送信</button>
    </form>
  );
}
