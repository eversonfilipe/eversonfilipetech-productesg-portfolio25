
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'glacial': ['var(--font-inter)', 'sans-serif'],
        'playfair': ['var(--font-playfair)', 'serif'],
      },
      colors: {
        'midnight': '#0a1725',
        'steel': '#34495e',
        'steel-light': '#516374',
        'steel-lighter': '#6b7c8c',
        'steel-dark': '#2d3e4e',
        'steel-darker': '#1f2e3d',
        'accent-blue': '#34495e',
        'accent-light': '#516374',
        'white-soft': '#f8f9fa',
        'gray-soft': '#ecf0f1',
      },
      animation: {
        'flow': 'flow 8s linear infinite',
        'pulse-custom': 'pulse-custom 3s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink-caret': 'blink-caret 0.75s step-end infinite',
        'sonar': 'sonar 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        flow: {
          '0%': { transform: 'translateX(-200px)', opacity: '0' },
          '50%': { opacity: '0.3' },
          '100%': { transform: 'translateX(calc(100vw + 200px))', opacity: '0' }
        },
        'pulse-custom': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.4' },
          '50%': { transform: 'scale(1.5)', opacity: '0.8' }
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#34495e' }
        },
        sonar: {
          '0%': { width: '0', height: '0', opacity: '1' },
          '100%': { width: '100px', height: '100px', opacity: '0' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% -200%' },
          '100%': { backgroundPosition: '200% 200%' }
        }
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(135deg, #34495e, #516374)',
      }
    },
  },
  plugins: [],
}
