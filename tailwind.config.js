const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  
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
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['Shippori Mincho', 'serif'],
        en: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['Courier', 'monospace'],
      },
      colors: {
        primary: '#FF66CC',
        cosmic: {
          dark: '#1a1a2e',
          mid: '#16213e',
          purple: '#533483',
          star: '#ffdf00',
          white: '#f1f1f1',
        },
        'brblue': '#00a8ec',
        'brorange': '#f7931e',
        'brgreen': '#40d39c',
        'brviolet': '#bc98cb',
        'brred': '#ff6b6b',
        'bryellow': '#fdfd96',
        'brcyan': '#a2f5f8',
        'brblackhole': '#0d0d0d',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.cosmic.mid'),
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: `${theme('colors.primary')} !important`,
              },
              code: { color: theme('colors.primary') },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: theme('colors.cosmic.white'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: theme('colors.cosmic.purple'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.cosmic.white'),
            },
            'h4,h5,h6': {
              color: theme('colors.cosmic.white'),
            },
            pre: {
              backgroundColor: theme('colors.cosmic.dark'),
            },
            code: {
              color: theme('colors.primary'),
              backgroundColor: theme('colors.cosmic.dark'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            details: {
              backgroundColor: theme('colors.cosmic.dark'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            hr: { borderColor: theme('colors.cosmic.mid') },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.cosmic.purple'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.cosmic.purple'),
            },
            strong: { color: theme('colors.cosmic.white') },
            blockquote: {
              color: theme('colors.cosmic.white'),
              borderLeftColor: theme('colors.cosmic.purple'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.cosmic.white'),
            p: {
              color: theme('colors.cosmic.white'),
            },
            li: {
              color: theme('colors.cosmic.white'),
            },
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: `${theme('colors.primary')} !important`,
              },
              code: { color: theme('colors.primary') },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: theme('colors.cosmic.star'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: theme('colors.cosmic.purple'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.cosmic.star'),
            },
            'h4,h5,h6': {
              color: theme('colors.cosmic.star'),
            },
            pre: {
              backgroundColor: theme('colors.cosmic.dark'),
            },
            code: {
              backgroundColor: theme('colors.cosmic.dark'),
            },
            details: {
              backgroundColor: theme('colors.cosmic.dark'),
            },
            hr: { borderColor: theme('colors.cosmic.mid') },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.cosmic.purple'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.cosmic.purple'),
            },
            strong: { color: theme('colors.cosmic.star') },
            thead: {
              th: {
                color: theme('colors.cosmic.star'),
              },
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.cosmic.mid'),
              },
            },
            blockquote: {
              color: theme('colors.cosmic.star'),
              borderLeftColor: theme('colors.cosmic.purple'),
            },
          },
        },
      }),
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'cosmic-gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'cosmic-gradient': 'cosmic-gradient 15s ease infinite',
      },
      backgroundSize: {
        '600%': '600% 600%',
      },
      boxShadow: {
        'cosmic-lg': '0 8px 30px rgba(0,0,0,0.3)',
        'cosmic-glow': '0 0 20px rgba(83,52,131,0.6)',
        'neobrutal-card': '4px 4px 0 0 #000',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss/plugin')(({ addUtilities, theme }) => {
      addUtilities({
        '.selection-cosmic': {
          '::selection': {
            backgroundColor: `${theme('colors.cosmic.purple')}33`,
          },
        },
      })
    }),
  ],
}
