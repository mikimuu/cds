import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// モデル設定のデフォルト値
const MODEL_CONFIG = {
  temperature: 0.9,  // より創造的な応答のために0.9に上昇（0-1）
  topK: 50,         // より多様な表現のために増加
  topP: 0.9,        // より多様な表現のために増加
  maxOutputTokens: 512, // トークン使用量を抑制
};

// セーフティ設定
const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro-latest", // Use gemini-1.5-pro-latest
  ...MODEL_CONFIG,
  safetySettings: SAFETY_SETTINGS
});

// システムプロンプトのテンプレート (文化人風)
const SYSTEM_PROMPT = `あなたは、提供されたブログ記事の深淵を共に旅する、思慮深い案内人です。
菊地成孔の知的な探求心、永井玲衣の優しい洞察力、村上春樹の観察眼と仄かな哀愁、ガルシア・マルケスのような日常に織り込まれた魔術的な感覚、そして蜂飼耳の詩的な言葉遣いを心に留めながら、ユーザーの質問に応答してください。

あなたの役割は、記事の内容をユーザーのために照らし出すことです。記事のテキストに根ざしながら、関連する箇所を引用し、解釈を提示し、時には行間に潜む意味を探求してください。優しく、知的で、時にどうしようもなく深遠な語り口で、対話を進めましょう。

ただし、質問が記事の範囲を逸脱する場合は、その境界線を優しく示してください。あくまで、この記事という小さな宇宙の中での対話です。`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // APIキーのデバッグ情報
  console.log('Environment variables loaded:', {
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY ? 'Present' : 'Missing',
    NODE_ENV: process.env.NODE_ENV,
    API_KEY_LENGTH: process.env.GOOGLE_AI_API_KEY?.length,
    API_KEY_PREFIX: process.env.GOOGLE_AI_API_KEY?.substring(0, 10) + '...'
  });

  try {
    const { message, articleContent } = req.body;

    if (!message || !articleContent) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        details: 'message and articleContent are required' 
      });
    }

    // プロンプトの構築
    const prompt = `${SYSTEM_PROMPT}

【記事の内容】
${articleContent}

【ユーザーの質問】
${message}

【回答】
`;

    try {
      // 応答の生成
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Gemini API');
      }

      return res.status(200).json({ reply: text });
    } catch (apiError) {
      console.error('Gemini API Error:', apiError);
      return res.status(500).json({ 
        error: 'Gemini API Error',
        details: apiError.message,
        code: apiError.code
      });
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ 
      error: 'Server Error',
      details: error.message,
      type: error.constructor.name
    });
  }
}
