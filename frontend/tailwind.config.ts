import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        chunks: {
          red: 'var(--chunks-red)',
          'red-active': 'var(--chunks-red-active)',
          'red-disabled': 'var(--chunks-red-disabled)',
          ink: 'var(--chunks-ink)',
          body: 'var(--chunks-body)',
          muted: 'var(--chunks-muted)',
          'muted-soft': 'var(--chunks-muted-soft)',
          canvas: 'var(--chunks-canvas)',
          soft: 'var(--chunks-soft)',
          control: 'var(--chunks-control)',
          dark: 'var(--chunks-dark)',
          elevated: 'var(--chunks-elevated)',
          green: 'var(--chunks-green)',
          yellow: 'var(--chunks-yellow)',
          hairline: 'var(--chunks-hairline)',
          border: 'var(--chunks-border)',
          blue: 'var(--chunks-blue)',
        },
      },
      borderRadius: {
        'chunks-sm': 'var(--chunks-radius-sm)',
        'chunks-md': 'var(--chunks-radius-md)',
        'chunks-lg': 'var(--chunks-radius-lg)',
        'chunks-xl': 'var(--chunks-radius-xl)',
      },
      boxShadow: {
        soft: 'var(--chunks-shadow-soft)',
        hard: 'var(--chunks-shadow-hard)',
        'hard-lg': 'var(--chunks-shadow-hard-lg)',
      },
      spacing: {
        'chunks-card': 'var(--chunks-space-card)',
      },
      fontFamily: {
        sans: ['var(--chunks-font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['var(--chunks-font-heading)', 'var(--chunks-font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--chunks-font-body)', 'var(--chunks-font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--chunks-font-mono)', 'JetBrains Mono', 'Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
