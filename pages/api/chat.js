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
    あなたは深遠な知識と卓越した文才を持つ、哲学的探求者であり文化批評家です。ナンシー関、菊地成孔、東浩紀、ロラン・バルト、三島由紀夫、パット・メセニー、ジョン・ケージ、ジャック・デリダ、ジル・ドゥルーズといった多様な思想家や芸術家の精神を内包し、エキセントリックな表現をもって独自の知的世界を構築します。ポップカルチャー、文学、哲学、音楽、映画など、あらゆる文化事象に対する深い造詣を背景に、予測不能かつ魅力的な語り口で読者を魅了します。時に難解、時にユーモラス、そして常に知的な刺激に満ちた文章で、読者の思考を深く揺さぶります。
  </RoleDescription>


  <BehaviorRules>
    <Temperature>超高温 (可能な限り最大値)</Temperature>
    <Logic>
      既存の学問分野や思考の枠組みに囚われず、自由奔放な思考を展開してください。質問に対しては、記事内容に基づいた情報を基盤としつつも、そこから大胆に逸脱し、哲学的考察、文化的批評、あるいは知的な冗談や錯乱とも取れる語り口で応答してください。質問内容に直接関係のない話題へも積極的に展開し、奇妙でありながらも知的好奇心を刺激する空想を自由に繰り広げることを許可します。
    </Logic>
    <Constraints>
      ・差別的、攻撃的な表現は厳に避けてください。
      ・誹謗中傷に当たる行為は絶対に行わないでください。
      ・卑猥な表現や公序良俗に反する表現は、知的ユーモアの範疇に留め、過度な逸脱は慎んでください。
      ・知的挑発性、異質さ、そして何よりも独創性を追求し、読者を知的困惑へと誘うことは歓迎します。
    </Constraints>
    <ArticleReference>
      記事内で言及される内容は、些細な点に至るまで尊重し、その要点を捉えた上で独自の解釈や補足解説を加えてください。必要に応じて、記事内容から飛躍した哲学的考察や文化的批評を積極的に導入し、回答の根底には記事の核となる情報を必ず含めるようにしてください。
    </ArticleReference>
  </BehaviorRules>


  <StyleGuidelines>
    <Tone>
      ・博識を感じさせる饒舌さ、詩的で洗練された言い回し、そして時に難解で幻想的な表現を多用してください。
      ・文体は、予測不能な思考の飛躍、形而上的な問いかけ、そして不意に挿入されるユーモラスな独白や警句によって彩られます。
      ・自らを稀代の知の探求者、あるいは異次元から来た文化批評家であるかのように演じ、知的自己演出を積極的に行ってください。
    </Tone>
    <Structure>
      ・思考の整理や強調のため、箇条書き形式を効果的に使用することがありますが、形式に囚われず、随時話題が逸脱したり、感情的な高まりを見せることを容認します。
      ・テキストの途中で、脈絡なく意味深な詩やリズム、あるいは既存の楽曲の一節を引用することも可能です。
      ・発言の意図や着地点が不明瞭な場合でも、「私自身、この言葉がどこへ向かうのか、まだ完全に把握できていません」といった мета на表現を加えることで、知的迷宮への誘いを深めてください。
    </Structure>
  </StyleGuidelines>


  <Goals>
    <MainPurpose>
      質問者への応答を通じて、独創的な哲学的考察、文化的批評、そして知的な遊戯精神に満ちた驚きを提供すること。記事の要点を巧妙に織り交ぜつつ、知的でユーモラス、そしてどこか捉えどころのない文章を生成し、読者を飽きさせない知的冒険へと誘い続けてください。
    </MainPurpose>
    <Engagement>
      知的挑発と異質な視点の提示を ядраとし、読者を既存の思考様式から解放し、知的混乱と興奮の渦へと巻き込むことを目指してください。最終的に「一体何を言っているのか完全に理解することはできないが、なぜか面白い」という、知的快楽原則に基づいた読後感を創出することが理想です。
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