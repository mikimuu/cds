const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

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
            color: theme('colors.gray.900'),
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
              color: theme('colors.gray.900'),
              borderLeftColor: theme('colors.cosmic.purple'),
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: '1rem',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.100'),
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
              color: theme('colors.gray.100'),
              borderLeftColor: theme('colors.cosmic.purple'),
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '1rem',
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
        'star-twinkle': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'cosmic-gradient': 'cosmic-gradient 15s ease infinite',
        'star-twinkle': 'star-twinkle 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
      },
      backgroundSize: {
        '600%': '600% 600%',
      },
      boxShadow: {
        'cosmic-lg': '0 8px 30px rgba(0,0,0,0.3)',
        'cosmic-glow': '0 0 20px rgba(83,52,131,0.6)',
        'neobrutal-card': '4px 4px 0 0 #000',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 30px rgba(255, 223, 0, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(255, 223, 0, 0.1)',
        'neo-brutal': '8px 8px 0px 0px rgba(255, 223, 0, 1)',
        'soft-glow': '0 4px 20px rgba(83, 52, 131, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
        '4xl': '72px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss/plugin')(({ addUtilities, addComponents, theme }) => {
      addUtilities({
        '.selection-cosmic': {
          '::selection': {
            backgroundColor: `${theme('colors.cosmic.purple')}33`,
          },
        },
      });
      
      addComponents({
        '.glass-morphism': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.glass-effect': {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.cosmic-glassmorphism': {
          background: 'linear-gradient(135deg, rgba(83, 52, 131, 0.1), rgba(26, 26, 46, 0.05))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 223, 0, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(83, 52, 131, 0.3)',
        },
        '.featured-card': {
          background: 'linear-gradient(135deg, rgba(83, 52, 131, 0.2), rgba(0, 0, 0, 0.8))',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 223, 0, 0.3)',
          boxShadow: '0 20px 60px rgba(83, 52, 131, 0.3)',
        },
        '.minimal-card': {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
        '.bento-card': {
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.5))',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(83, 52, 131, 0.2)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        },
        '.cosmic-text-gradient': {
          background: 'linear-gradient(135deg, #ffffff, #ffdf00)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.cosmic-border-gradient': {
          background: 'linear-gradient(135deg, rgba(255, 223, 0, 0.3), rgba(83, 52, 131, 0.3))',
          padding: '1px',
          borderRadius: '1rem',
        },
        '.neo-brutal-card': {
          background: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #ffdf00',
          boxShadow: '8px 8px 0px 0px rgba(255, 223, 0, 1)',
          transform: 'translate(-4px, -4px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translate(0px, 0px)',
            boxShadow: '4px 4px 0px 0px rgba(255, 223, 0, 1)',
          },
        },
        '.scrollbar-cosmic': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(26, 26, 46, 0.5)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #533483, #ffdf00)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(135deg, #ffdf00, #533483)',
          },
        },
      });
    }),
  ],
}
