const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.js',
    './components/**/*.js',
    './layouts/**/*.js',
    './lib/**/*.js',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 🎨 モダンカラーシステム
      colors: {
        // Primary Brand Colors
        sapphire: {
          50: '#EFF6FF',
          100: '#DBEAFE', 
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#1E40AF', // Primary
          700: '#1E3A8A',
          800: '#1E3A8A',
          900: '#1E2E7A',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A', 
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Secondary
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#06B6D4', // Accent
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        // Sophisticated Neutrals
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        // Warm Backgrounds
        cream: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
        }
      },

      // 🔤 佐藤可士和レベル：タイポグラフィシステム
      fontFamily: {
        // Primary Sans - 最高品質のサンセリフ
        sans: ['DM Sans', 'M PLUS 1p', '-apple-system', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', ...defaultTheme.fontFamily.sans],
        // Display Fonts - ヒーロー・見出し用
        display: ['Space Grotesk', 'M PLUS 1p', 'sans-serif'],
        // Japanese Primary - 日本語最適化
        japanese: ['M PLUS 1p', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'sans-serif'],
        // Serif - 特別な場面用
        serif: ['Crimson Text', 'Times New Roman', ...defaultTheme.fontFamily.serif],
        // Monospace - コード・技術的要素用
        mono: ['Space Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
        '6xl': ['3.75rem', { lineHeight: '1.16' }],
        '7xl': ['4.5rem', { lineHeight: '1.16' }],
        '8xl': ['6rem', { lineHeight: '1.16' }],
        '9xl': ['8rem', { lineHeight: '1.16' }],
        'display': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['6rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },

      // 🏠 スペーシングシステム
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },

      // 🌈 グラデーション
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #1E40AF 0%, #06B6D4 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        'gradient-cool': 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%)',
      },

      // 🎭 アニメーション
      keyframes: {
        // Micro-interactions
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.8' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'gradient-xy': {
          '0%, 100%': { 'background-position': '0% 0%' },
          '50%': { 'background-position': '100% 100%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'bounce-soft': 'bounce-soft 1s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'gradient-xy': 'gradient-xy 3s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },

      // 🎨 ボックスシャドウ (レイヤードデザイン用)
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.08)',
        'large': '0 8px 50px 0 rgba(0, 0, 0, 0.12)',
        'colored-brand': '0 8px 25px 0 rgba(30, 64, 175, 0.15)',
        'colored-amber': '0 8px 25px 0 rgba(245, 158, 11, 0.15)',
        'colored-teal': '0 8px 25px 0 rgba(6, 182, 212, 0.15)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        'glow-brand': '0 0 20px rgba(30, 64, 175, 0.3)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-teal': '0 0 20px rgba(6, 182, 212, 0.3)',
      },

      // 📐 ボーダーラディウス
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // 🎯 ブラー効果
      backdropBlur: {
        '4xl': '72px',
      },

      // 📱 レスポンシブブレークポイント
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss/plugin')(({ addUtilities, addComponents, theme }) => {
      
      // カスタムユーティリティ
      addUtilities({
        '.text-gradient-brand': {
          'background': 'linear-gradient(135deg, #1E40AF, #06B6D4)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.text-gradient-warm': {
          'background': 'linear-gradient(135deg, #F59E0B, #EF4444)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.scrollbar-none': {
          /* Hide scrollbar for Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            'display': 'none',
          },
          /* Hide scrollbar for IE, Edge and Firefox */
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      });

      // モダンコンポーネント
      addComponents({
        // Glass Morphism
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        
        // Modern Cards
        '.card-modern': {
          'background': 'white',
          'border-radius': '1rem',
          'box-shadow': '0 4px 25px 0 rgba(0, 0, 0, 0.08)',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 8px 50px 0 rgba(0, 0, 0, 0.12)',
          }
        },
        '.card-modern-dark': {
          'background': '#1F2937',
          'border': '1px solid #374151',
          'border-radius': '1rem',
          'box-shadow': '0 4px 25px 0 rgba(0, 0, 0, 0.3)',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 8px 50px 0 rgba(0, 0, 0, 0.4)',
          }
        },

        // Buttons
        '.btn-primary': {
          'background': 'linear-gradient(135deg, #1E40AF, #06B6D4)',
          'color': 'white',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.75rem',
          'font-weight': '600',
          'transition': 'all 0.3s ease',
          'border': 'none',
          '&:hover': {
            'transform': 'translateY(-1px)',
            'box-shadow': '0 8px 25px 0 rgba(30, 64, 175, 0.25)',
          },
          '&:active': {
            'transform': 'translateY(0)',
          }
        },
        '.btn-secondary': {
          'background': 'white',
          'color': '#1E40AF',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.75rem',
          'font-weight': '600',
          'border': '2px solid #1E40AF',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'background': '#1E40AF',
            'color': 'white',
            'transform': 'translateY(-1px)',
          }
        },

        // Layout Components
        '.container-modern': {
          'max-width': '1200px',
          'margin': '0 auto',
          'padding': '0 1.5rem',
          '@media (min-width: 640px)': {
            'padding': '0 2rem',
          },
          '@media (min-width: 1024px)': {
            'padding': '0 3rem',
          },
        },

        // Typography
        '.text-display': {
          'font-size': '5rem',
          'line-height': '1.1',
          'letter-spacing': '-0.02em',
          'font-weight': '700',
          '@media (max-width: 768px)': {
            'font-size': '3rem',
          }
        },
        '.text-heading': {
          'font-size': '3rem',
          'line-height': '1.2',
          'font-weight': '700',
          'letter-spacing': '-0.01em',
          '@media (max-width: 768px)': {
            'font-size': '2rem',
          }
        },
        '.text-body-large': {
          'font-size': '1.125rem',
          'line-height': '1.75',
          'color': '#6B7280',
        },

        // Modern Scrollbar
        '.scrollbar-modern': {
          '&::-webkit-scrollbar': {
            'width': '6px',
          },
          '&::-webkit-scrollbar-track': {
            'background': '#F3F4F6',
            'border-radius': '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            'background': 'linear-gradient(135deg, #1E40AF, #06B6D4)',
            'border-radius': '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background': 'linear-gradient(135deg, #1E3A8A, #0891B2)',
          },
        },
      });
    }),
  ],
}