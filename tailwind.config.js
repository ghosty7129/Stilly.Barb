/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a0a0a',
          light: '#1a1a1a'
        },
        accent: {
          gold: '#6b7280',
          silver: '#9ca3af'
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          800: '#262626',
          900: '#171717'
        },
        // Editorial monochrome surface tokens (same colourway, new structure)
        ink: {
          DEFAULT: '#0a0a0a',
          soft: '#141414',
          raised: '#1c1c1c',
          muted: '#5f5f5f'
        },
        paper: {
          DEFAULT: '#ffffff',
          soft: '#f7f7f7',
          warm: '#f1f1f1'
        },
        hairline: {
          DEFAULT: 'rgba(10,10,10,0.12)',
          strong: 'rgba(10,10,10,0.26)',
          light: 'rgba(255,255,255,0.14)',
          bright: 'rgba(255,255,255,0.28)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      letterSpacing: {
        eyebrow: '0.3em',
        wider2: '0.22em'
      },
      spacing: {
        '128': '32rem',
        '144': '36rem'
      },
      maxWidth: {
        editorial: '1400px'
      },
      boxShadow: {
        card: '0 30px 60px -40px rgba(10,10,10,0.45)',
        lift: '0 40px 80px -50px rgba(10,10,10,0.65)',
        ink: '0 18px 40px -22px rgba(10,10,10,0.55)'
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.2, 0.7, 0.2, 1)'
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.2,0.7,0.2,1) forwards',
        'line-grow': 'lineGrow 1.1s cubic-bezier(0.7,0,0.2,1) forwards',
        'scroll-hint': 'scrollHint 2.2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        fadeUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        lineGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' }
        },
        scrollHint: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '35%': { opacity: '1' },
          '100%': { transform: 'translateY(14px)', opacity: '0' }
        }
      }
    }
  },
  plugins: []
}
