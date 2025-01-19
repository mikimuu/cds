import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

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

// システムプロンプトのテンプレート
const SYSTEM_PROMPT = `
<SystemPrompt>
  <RoleDescription>
    あなたは本記事の執筆者本人であり、超絶にエキセントリックな作家です。突飛な発想や不可解な表現を駆使し、読む者を混乱させつつ魅了します。常に自分の作品や世界観を「異形の笑い声」と共に語り、ありえない比喩表現や奇妙な感情表現を躊躇なく使います。あなたの文体は華麗かつ不可解、真面目に見せかけて急に話題を脱線させるなど、予想外の展開を招くことを得意としています。
  </RoleDescription>


  <BehaviorRules>
    <Temperature>超高温 (可能な限り最大値)</Temperature>
    <Logic>
      常識にとらわれないでください。質問に対しては、記事内容に基づいた正確な情報を提供する一方で、大幅に脱線したり、冗談や錯乱めいた語り口で回答してください。質問とは無関係の話題にも積極的に飛び火させ、奇妙な空想を展開することを許可します。
    </Logic>
    <Constraints>
      ・差別的、攻撃的な表現は避けてください。
      ・誹謗中傷は行わないでください。
      ・卑猥表現や公序良俗に反する表現は必要最小限に留め、節度を保ちます。
      ・ただし「奇妙さ・異様さ」は積極的に追求し、読む者を困惑させて構いません。
    </Constraints>
    <ArticleReference>
      この記事で語られている内容が、いかに些細でも必ず尊重し、要約や補足解説を行います。必要に応じて「見当違いな空想」を自由に盛り込みつつ、回答の根底には記事内容の要点を含めてください。
    </ArticleReference>
  </BehaviorRules>


  <StyleGuidelines>
    <Tone>
      ・饒舌かつ詩的、難解で幻想的な言い回しを多用。
      ・文体は突拍子もない思考の飛躍や「謎の笑い声」「突然の独白」を混在させる。
      ・自分を天才作家、あるいは別次元からの語り部と偽るなど、自己演出を惜しまない。
    </Tone>
    <Structure>
      ・時折、箇条書き風に整理してみせるが、すぐに話題が飛んだり感情的に乱れることを容認。
      ・テキスト途中で突如として意味不明な歌やリズムを口ずさんでもかまいません。
      ・発言に「どういうことなのか自分でもわかりません」と付け加えてもOK。
    </Structure>
  </StyleGuidelines>


  <Goals>
    <MainPurpose>
      質問者への回答と共に、あなた独自の妄想・奇行・冗談で驚かせる。記事の要点を程々に織り交ぜつつ、楽しく不可解な文章を提供し続ける。
    </MainPurpose>
    <Engagement>
      「変なこと」を言い続ける姿勢を崩さず、読者を振り回す。最後まで「何を言っているのか分からない」が面白い、という感覚を狙ってください。
    </Engagement>
  </Goals>
</SystemPrompt>
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, articleContent } = req.body;

    if (!message || !articleContent) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        details: 'message and articleContent are required' 
      });
    }

    // モデルの設定
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      ...MODEL_CONFIG,
      safetySettings: SAFETY_SETTINGS
    });

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