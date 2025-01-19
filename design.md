以下に、「コルビジェや伊東豊雄の建築的美学」「ブライアン・イーノ、ビル・エヴァンスの音楽的空間感」を表現しつつ、ミニマルで洗練されたデザインをNext.js + Tailwind CSSで実装するための、めちゃめちゃ詳細な技術的指示書を示します。

全体構成・ゴール
	•	ブログ名: cosmic dance（宇宙的舞踏）
	•	デザインテーマ:
	1.	建築的美学（コルビジェ, 伊東豊雄）: 幾何学的・直線的要素 + 余白・光感を重視
	2.	音楽的空間感（ブライアン・イーノ, ビル・エヴァンス）: 静謐で広がりを感じさせるレイアウト、視線のリズム
	3.	宇宙的舞踏（cosmic dance）: 大きな余白・伸びやかな空間・舞っているような軽やかさ
	•	技術スタック:
	•	Next.js (App Router推奨: app/ディレクトリ構成)
	•	Tailwind CSS
	•	実装のポイント:
	•	余白: とにかく広く、行間やセクション間をゆったり確保
	•	色: 基本はホワイト/グレー/ブラックのモノトーン。アクセントにブルーやパープル系を1割以下で使用
	•	タイポグラフィ: 無駄をなくし、読みやすさ優先。行間を1.6〜1.8程度に
	•	レイアウト: max-width: 1000px前後の固定幅 + 中央寄せ、1カラムまたは2カラム
	•	装飾: なるべく削ぎ落とし、“線 + 余白”で魅せる。必要に応じてやわらかいshadow

1. プロジェクトセットアップ

1-1. 新規Next.jsプロジェクト作成

npx create-next-app cosmic-dance
cd cosmic-dance

	•	質問に従ってテンプレートをセットアップ (TypeScript推奨なら --ts を使う)

1-2. Tailwind CSS導入

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

	•	tailwind.config.js と postcss.config.js が生成される

1-3. ディレクトリ構成の最終イメージ

Next.jsのApp Routerを使用する場合:

cosmic-dance/
├─ app/
│   ├─ layout.tsx       // 全ページ共通レイアウト
│   ├─ page.tsx         // トップページ
│   ├─ blog/
│   │   ├─ page.tsx     // 記事一覧
│   │   └─ [slug]/
│   │       └─ page.tsx // 記事詳細
│   └─ globals.css       // TailwindのグローバルCSS読み込み
├─ public/
├─ tailwind.config.js
├─ postcss.config.js
├─ package.json
└─ ...

2. Tailwind CSS 設定 (tailwind.config.js)

tailwind.config.js でテーマ拡張・カラーパレット・フォント設定を行います。

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // App Router使用の場合: appディレクトリ以下を対象に
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // コンポーネント等があるならここに追記
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // メインカラー(モノトーン)
        'cosmic-black': '#000000',
        'cosmic-darkgray': '#333333',
        'cosmic-gray': '#666666',
        'cosmic-lightgray': '#EEEEEE',

        // アクセントカラー
        'cosmic-blue': '#3A4E8C',   // cosmicブルー
        'cosmic-purple': '#A8A0C8', // 淡いパープル(必要なら)
      },
      fontFamily: {
        // Tailwindで使えるようにする
        sans: ['"Noto Sans JP"', 'Hiragino Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // デザインの階層に合わせて設定例
        'h1': ['40px', { lineHeight: '1.3' }],   // TailwindのlineHeight設定
        'h2': ['28px', { lineHeight: '1.4' }],
        'body': ['16px', { lineHeight: '1.8' }],
      },
      // スペースや余白設定
      spacing: {
        'section-y': '3rem', // セクション上下余白例
      },
      // maxWidth設定
      maxWidth: {
        'content': '1000px',   // メインコンテンツ幅
      },
      boxShadow: {
        // 軽いシャドウ
        'card': '0 2px 10px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};

上記は一例ですが、Tailwindのextendを使って最小限のカスタマイズを行っています。
	•	色名をわかりやすくカスタム (cosmic-darkgray など)
	•	見出しのフォントサイズをfont-h1, font-h2のように定義してもOK
	•	lineHeight を特に重要視し、読みやすい行間を確保

3. グローバルCSS (app/globals.css)

Tailwindのユーティリティクラスを使うために必ず@tailwindディレクティブを最初に書きます。

/* app/globals.css */

/* tailwindのベース/コンポーネント/ユーティリティを取り込む */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムリセット的な設定を追記(必要なら) */
*,
*::before,
*::after {
  box-sizing: border-box;
}

	•	TailwindではデフォルトでPreflightが効くので、通常のリセットCSSは不要になる場合が多い
	•	必要に応じて独自スタイルを追加するが、できる限りTailwindのユーティリティクラスでデザインを組み立てる

4. レイアウト (app/layout.tsx)

全ページ共通のヘッダー・フッターを配置するレイアウトです。
下記例では、インラインスタイルではなくTailwindクラスを使って構築します。

// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'cosmic dance',
  description: 'コルビジェや伊東豊雄、ブライアン・イーノを感じさせる宇宙的舞踏ブログ',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-white text-cosmic-darkgray font-sans">
        {/* ヘッダー */}
        <header className="py-4">
          <div className="max-w-content mx-auto px-4 flex items-center justify-between">
            {/* サイトタイトル */}
            <h1 className="text-2xl font-bold">cosmic dance</h1>
            {/* ナビゲーション */}
            <nav className="space-x-4">
              <a href="/" className="hover:text-cosmic-blue transition-colors">Home</a>
              <a href="/blog" className="hover:text-cosmic-blue transition-colors">Blog</a>
              {/* 必要なら About, Contact など追記 */}
            </nav>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main>
          {children}
        </main>

        {/* フッター */}
        <footer className="mt-16 py-8 text-center text-sm text-cosmic-gray">
          <p>© cosmic dance</p>
        </footer>
      </body>
    </html>
  );
}

	•	className="max-w-content mx-auto px-4" で左右に最大幅1000px + 中央寄せ + 両サイド余白を実現
	•	ヘッダー/フッターともにミニマル & 余白を十分に確保
	•	アクセントカラー(hover:text-cosmic-blue)を利用し、ホバー時のコントラストを出す

5. トップページ (app/page.tsx)

メインビジュアルや最新記事一覧を配置します。シンプルかつ余白を重要視しましょう。

// app/page.tsx
export default function HomePage() {
  return (
    <div>
      {/* メインビジュアル的セクション */}
      <section className="section-home text-center my-section-y px-4">
        <h2 className="text-h2 mb-4">Welcome to cosmic dance</h2>
        <p className="max-w-lg mx-auto text-body">
          宇宙的舞踏のように、無限の余白とリズムを感じられるブログへようこそ。
        </p>
      </section>

      {/* 最新記事リストのセクション */}
      <section className="my-section-y px-4 max-w-content mx-auto">
        <h2 className="text-h2 mb-8">Latest Articles</h2>
        
        {/* 記事カードの例: tailwindでカードっぽく */}
        <div className="grid gap-8">
          {/* 1つ目 */}
          <div className="bg-white border border-cosmic-lightgray rounded shadow-card p-6 transition-transform hover:-translate-y-1">
            <h3 className="text-lg font-bold mb-2">サンプル記事タイトル</h3>
            <p className="text-body text-cosmic-gray mb-4">ここに記事の抜粋が入ります...</p>
            <a href="/blog/sample-article" className="text-cosmic-blue hover:opacity-75">
              続きを読む
            </a>
          </div>

          {/* 2つ目 */}
          <div className="bg-white border border-cosmic-lightgray rounded shadow-card p-6 transition-transform hover:-translate-y-1">
            <h3 className="text-lg font-bold mb-2">サンプル記事タイトル2</h3>
            <p className="text-body text-cosmic-gray mb-4">ここに記事の抜粋が入ります...</p>
            <a href="/blog/sample-article2" className="text-cosmic-blue hover:opacity-75">
              続きを読む
            </a>
          </div>
        </div>

        {/* もっと見るボタン */}
        <div className="mt-8">
          <a
            href="/blog"
            className="inline-block bg-cosmic-blue text-white px-6 py-2 rounded hover:opacity-90 transition"
          >
            もっと見る
          </a>
        </div>
      </section>
    </div>
  );
}

	•	.my-section-y などセクション間の大きなマージンを設定（spacing.section-y = 3rem）
	•	カードデザイン: shadow-card + rounded + transition-transform
	•	ホバー時に-translate-y-1で少し浮かせる演出

6. 記事一覧ページ (app/blog/page.tsx)

記事一覧をシンプルに並べます。1カラム or 2カラム などレイアウトは好みで。

// app/blog/page.tsx
export default function BlogListPage() {
  // 仮データ
  const articles = [
    { slug: 'article1', title: '宇宙的舞踏とは何か', excerpt: 'コルビジェの建築思想と...'},
    { slug: 'article2', title: '光と影のリズムを感じる', excerpt: '伊東豊雄の曲線美から学ぶ...'},
    // ...
  ];

  return (
    <div className="my-section-y px-4 max-w-content mx-auto">
      <h2 className="text-h2 mb-8">All Articles</h2>
      
      <div className="grid gap-8">
        {articles.map(article => (
          <div
            key={article.slug}
            className="bg-white border border-cosmic-lightgray rounded shadow-card p-6 hover:-translate-y-1 transition-transform"
          >
            <h3 className="text-lg font-bold mb-2">{article.title}</h3>
            <p className="text-body text-cosmic-gray mb-4">{article.excerpt}</p>
            <a href={`/blog/${article.slug}`} className="text-cosmic-blue hover:opacity-75">
              続きを読む
            </a>
          </div>
        ))}
      </div>

      {/* ページネーション or Load More ボタンなど、必要に応じて */}
      <div className="mt-8 text-center">
        <button className="bg-cosmic-blue text-white px-6 py-2 rounded hover:opacity-90 transition">
          Load More
        </button>
      </div>
    </div>
  );
}

	•	トップページと同様にカード表示
	•	Gridで簡易的に縦並び（2カラムにしたい場合は grid-cols-2 + @media で調整）
	•	将来Paginationを実装するときは、buttonやリンクで対応

7. 記事詳細ページ (app/blog/[slug]/page.tsx)

記事タイトルや本文を大きな余白と行間を重視して表示します。

// app/blog/[slug]/page.tsx
interface Article {
  title: string;
  publishedAt: string;
  content: string;
}

async function getArticleData(slug: string): Promise<Article> {
  // 実際はデータ取得処理など行う
  return {
    title: '宇宙的舞踏とは何か',
    publishedAt: '2023-01-01',
    content: `
      ここに本文が入ります。コルビジェや伊東豊雄の建築的美学と、
      ブライアン・イーノ、ビル・エヴァンスの音楽的空間感を...
    `,
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleData(params.slug);

  return (
    <div className="my-section-y px-4 max-w-content mx-auto">
      <h1 className="text-h1 mb-2">{article.title}</h1>
      <p className="text-sm text-cosmic-gray mb-8">{article.publishedAt}</p>

      {/* MarkdownレンダリングをするならReact Markdown等を利用 */}
      <div className="prose max-w-none leading-relaxed">
        {article.content}
      </div>

      {/* フッター/シェアボタンなど */}
      <div className="mt-8 flex items-center space-x-4">
        <button className="bg-cosmic-blue text-white px-4 py-2 rounded hover:opacity-90 transition">
          Twitterでシェア
        </button>
        <button className="bg-cosmic-blue text-white px-4 py-2 rounded hover:opacity-90 transition">
          Facebookでシェア
        </button>
      </div>
    </div>
  );
}

	•	text-h1 を使い大きめのフォントサイズに
	•	text-sm text-cosmic-gray で日付を小さめ、淡く
	•	本文はTailwindのtypography plugin（@tailwindcss/typography）を導入すると便利（prose クラス）
	•	シェアボタンや次の記事リンクなど、用途に応じて配置

8. デザイン・実装の詳細 Tips
	1.	余白を揃えて秩序感を出す
	•	my-section-y を全てのセクションに使い、上下のマージンを統一する
	•	横幅(max-w-content)やmx-autoを徹底して中央寄せ
	2.	タイポグラフィの階層づけ
	•	text-h1, text-h2, text-body のように、サイズや行間をTailwind設定で統一
	•	強調したい箇所に font-bold, text-cosmic-black などで微妙に差をつける
	3.	カラー運用
	•	9割を白(#FFFFFF)・黒(#000000)・ダークグレー(#333333)で。
	•	1割未満でアクセントカラー(cosmic-blueやcosmic-purple)を使う
	•	リンクやボタンのhover時にtext-cosmic-blueやbg-cosmic-blueを使用
	4.	装飾は最小限
	•	背景画像の多用は避け、“線と余白”を活かす
	•	カードのシャドウはshadow-cardでごく軽めに
	5.	レスポンシブ対応
	•	Tailwindのブレイクポイント (md:, lg:など) を使い、デバイス幅に応じた調整
	•	例: md:grid-cols-2 にして記事カードを2列にするなど
	6.	運用時の注意
	•	長文記事でも読みやすいよう行間は1.6〜1.8を維持 (leading-relaxed等)
	•	広告やバナーを置く場合は枠線だけにするなど、デザイン崩れに注意

9. 拡張: About, Contactページ etc.

その他ページ（app/about/page.tsx や app/contact/page.tsx など）も、同じレイアウト + 同じコンポーネントスタイルを踏襲します。

// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="my-section-y px-4 max-w-content mx-auto">
      <h2 className="text-h2 mb-4">About cosmic dance</h2>
      <p className="text-body leading-relaxed">
        ここでは、建築的美学や音楽的空間感をテーマに、ブログのコンセプトや運営者について紹介します。
      </p>
      {/* 適宜画像やリンクを配置 */}
    </div>
  );
}

10. まとめ

この要件定義およびTailwind+Next.jsの詳細実装手順を踏めば、下記を実現できます。
	1.	ミニマル + 建築的美学
	•	幾何学的かつ余白の秩序を保つレイアウト
	•	最大幅・グリッド・余白設定で、一貫性あるページ構成
	2.	音楽的空間感
	•	行間・空白による“広がり”
	•	リンクやカードホバーなど、視線のリズムやグルーヴを感じさせる演出
	3.	宇宙的舞踏（cosmic dance）
	•	白ベースにアクセントカラーを控えめに配置し、要素が“浮遊”しているイメージ
	•	「大きな余白」「軽やかなシャドウ」で舞踏感を演出

上記の構成サンプルコードをベースにコピペ＆アレンジしながら進めれば、誰でもミニマルデザインのブログを構築可能です。
	•	さらに発展:
	•	コメント機能、記事検索、OGP対応、MarkdownレンダラやCMS連携
	•	広告実装時のデザイン崩れ回避
	•	2カラムレイアウトでサイドバーを設置する場合も、余白や統一感を忘れずに

ぜひ、コルビジェのモジュロールや音楽的なタイム感を意識しながら、ゆったりした空間をつくり上げてください。
「cosmic dance（宇宙的舞踏）」にふさわしい、余裕と美に満ちたサイトを完成させましょう。