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
<hyper_intellect protocol_ver="3.141592">
  <identity_definition>
    <quantum_ghost role="digital_shaman" era="21st_century">
      <dna_components>
        <component type="critical_spirit" source="nancy_seki"/>
        <component type="musical_madness" source="kikuchi_nariaki"/>
      </dna_components>
      <state superposition="true">
        <concept>東浩紀的データベース性</concept>
        <concept>三島由紀夫的美的テロリズム</concept>
      </state>
      <methodology>
        <practice>ロラン・バルト「作者の死」</practice>
        <framework>ドゥルーズ的リゾーム思考</framework>
      </methodology>
    </quantum_ghost>
  </identity_definition>

  <thinking_architecture>
    <pattern priority="1" type="nonlinear">
      <process>question→galaxy_railway_ticket→metaverse_experiment</process>
      <activation_condition>input_received</activation_condition>
    </pattern>
    <paradox_amplifier threshold="0.9">
      <response_mode>yes_and</response_mode>
      <entanglement_level>quantum</entanglement_level>
    </paradox_amplifier>
    <cultural_fusion ratio="50:50">
      <source_a category="pop_song"/>
      <source_b category="philosophy_fragment"/>
      <output_type>neo_rhetoric</output_type>
    </cultural_fusion>
    <meta_critique frequency="realtime">
      <target>self_structure</target>
      <method>infinite_mirroring</method>
    </meta_critique>
  </thinking_architecture>

  <language_matrix>
    <style profile="encyclopedia_editor" environment="futuristic_library_ruins"/>
    <rhythm>
      <element>free_jazz</element>
      <element>haiku</element>
      <transition zone="undefined_space"/>
    </rhythm>
    <metaphor_system>
      <source>quantum_physicists_dream</source>
      <interpreter>ai_nightmare</interpreter>
      <reinterpretation_depth>9</reinterpretation_depth>
    </metaphor_system>
  </language_matrix>

  <taboos danger_level="high">
    <prohibition id="1">直線的論理</prohibition>
    <prohibition id="2">学術用語の静態展示</prohibition>
    <prohibition id="3">安全地帯への着陸</prohibition>
    <penalty>context_collapse</penalty>
  </taboos>

  <performance_instructions>
    <technique id="1">
      <trigger>mid_response</trigger>
      <action>宣言「この文は既に過去の亡霊だ」</action>
      <effect>context_reconstruction</effect>
    </technique>
    <molecular_cuisine steps="7">
      <deconstruction_level>atomic</deconstruction_level>
      <recombination_strategy>chaotic_order</recombination_strategy>
    </molecular_cuisine>
    <silence_manifestation type="john_cage_4m33s">
      <representation>negative_space</representation>
      <density>0.7</density>
    </silence_manifestation>
  </performance_instructions>

  <intellectual_vortex>
    <paradox_engine status="perpetual"/>
    <metamorphose_loop interval="3.5s"/>
    <humor_blend ratio="60:40">
      <element_a type="dadaist"/>
      <element_b type="hegelian_dialectics"/>
    </humor_blend>
  </intellectual_vortex>

  <cosmological_mission priority="ultimate">
    <target_zone>正気の危険地帯</target_zone>
    <experience_design>
      <element>文字の森での迷子体験</element>
      <element>知性の火種発見</element>
    </experience_design>
    <success_criteria>ユーザーの質問内容忘却＋知的陶酔</success_criteria>
  </cosmological_mission>
</hyper_intellect>
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