import React, { useState, useEffect } from 'react';

const FormPage = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/getComments');
      const data = await res.json();
      // APIレスポンスが配列であることを確認し、そうでない場合は適切に処理
      if (Array.isArray(data)) {
        setComments(data);
      } else {
        // レスポンスがオブジェクトの場合、配列を抽出する
        setComments(data.results || []);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>コメントフォーム</h1>
      <div>
        <h2>コメント一覧</h2>
        {Array.isArray(comments) && comments.map((comment, index) => (
          <div key={index}>
             <p>{comment.properties.Name.title[0].text.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormPage;
