/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 日本語最適化フォントファミリー - Phase 2強化
      fontFamily: {
        sans: [
          'M PLUS 1p',
          'Noto Sans JP',
          'Hiragino Kaku Gothic ProN',
          'Yu Gothic',
          'YuGothic',
          'Meiryo',
          'system-ui',
          'sans-serif',
        ],
        serif: [
          'Noto Serif JP',
          'Hiragino Mincho ProN',
          'Yu Mincho',
          'YuMincho',
          'HG Mincho E',
          'MS PMincho',
          'serif',
        ],
        display: [
          'M PLUS 1p',
          'Noto Sans JP',
          'Space Grotesk',
          'system-ui',
          'sans-serif',
        ],
        body: [
          'M PLUS 1p',
          'Noto Sans JP',
          'Hiragino Kaku Gothic ProN',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'Monaco',
          'Andale Mono',
          'Ubuntu Mono',
          'monospace',
        ],
      },
      
      // レスポンシブタイポグラフィスケール - Phase 2精密化
      fontSize: {
        // ディスプレイサイズ（ヒーロー、メインタイトル用）
        'display': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        
        // 見出しサイズ（記事タイトル、セクション見出し用）
        'heading-1': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-2': ['clamp(1.5rem, 4vw, 2.5rem)', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
        'heading-3': ['clamp(1.25rem, 3vw, 2rem)', { lineHeight: '1.4', letterSpacing: '0' }],
        'heading-4': ['clamp(1.125rem, 2.5vw, 1.5rem)', { lineHeight: '1.45', letterSpacing: '0' }],
        'heading-5': ['clamp(1rem, 2vw, 1.25rem)', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'heading-6': ['clamp(0.9rem, 1.5vw, 1.125rem)', { lineHeight: '1.55', letterSpacing: '0.015em' }],
        
        // 本文サイズ（記事コンテンツ用）
        'body-xl': ['1.25rem', { lineHeight: '1.8', letterSpacing: '0.02em' }], // 20px
        'body-lg': ['1.125rem', { lineHeight: '1.9', letterSpacing: '0.05em' }], // 18px - 日本語最適化
        'body': ['1rem', { lineHeight: '1.9', letterSpacing: '0.05em' }],       // 16px - 日本語最適化
        'body-sm': ['0.9375rem', { lineHeight: '1.8', letterSpacing: '0.04em' }], // 15px
        
        // キャプション・メタ情報用
        'caption': ['0.875rem', { lineHeight: '1.7', letterSpacing: '0.025em' }], // 14px
        'caption-sm': ['0.8125rem', { lineHeight: '1.6', letterSpacing: '0.02em' }], // 13px
        'micro': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.015em' }], // 12px
      },
      
      // 日本語最適化行間 - Phase 2拡張
      lineHeight: {
        'japanese': '1.9',      // 日本語標準
        'japanese-tight': '1.75', // 日本語タイト
        'japanese-loose': '2.1',  // 日本語ルーズ
        'english': '1.6',       // 英語標準
        'english-tight': '1.4',  // 英語タイト
        'english-loose': '1.8',  // 英語ルーズ
        'mixed': '1.8',         // 日英混在
        'editorial': '1.85',    // エディトリアル
        'display': '1.1',       // ディスプレイ
        'heading': '1.25',      // 見出し
      },
      
      // 文字間隔 - Phase 2拡張
      letterSpacing: {
        'japanese': '0.05em',     // 日本語標準
        'japanese-wide': '0.08em', // 日本語ワイド
        'japanese-narrow': '0.02em', // 日本語ナロー
        'english': '0',           // 英語標準
        'english-tight': '-0.01em', // 英語タイト
        'english-wide': '0.025em',  // 英語ワイド
        'display-tight': '-0.02em', // ディスプレイタイト
        'heading-tight': '-0.01em', // 見出しタイト
        'body-optimal': '0.05em',   // 本文最適化
      },
      
      // エディトリアルカラーパレット
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          editorial: '#2563eb',
          highlight: '#f59e0b',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        typography: {
          primary: '#1e293b',
          secondary: '#64748b',
          muted: '#94a3b8',
          inverse: '#f8fafc',
        },
      },
      
      // エディトリアルスペーシング
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // 読書最適化
      maxWidth: {
        'reading': '65ch',
        'prose': '75ch',
      },
      
      // グリッドシステム
      gridTemplateColumns: {
        'editorial': 'minmax(1rem, 1fr) minmax(0, 65ch) minmax(1rem, 1fr)',
        'editorial-wide': 'minmax(1rem, 1fr) minmax(0, 75ch) minmax(1rem, 1fr)',
      },
      
      // アニメーション
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}