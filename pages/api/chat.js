import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, articleContent } = req.json();

    // モデルの設定
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // システムプロンプトとコンテキストの設定
    const prompt = `
あなたは以下の記事の内容について詳しく説明できるアシスタントです。
親しみやすく、かつ専門的な説明ができます。

記事の内容:
${articleContent}

ユーザーの質問:
${message}
`;

    // 応答の生成
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
} 