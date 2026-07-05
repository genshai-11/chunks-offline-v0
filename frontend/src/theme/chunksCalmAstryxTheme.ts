import { defineTheme } from '@astryxdesign/core/theme'
import { neutralTheme } from '@astryxdesign/theme-neutral'

/**
 * Astryx theme bridge for CHUNKS Theme 1 — Calm Classroom Console.
 *
 * This keeps Astryx components on the same light/calm product language already
 * defined in src/styles/tokens.css while page-by-page redesign work migrates UI
 * from local primitives to Astryx components.
 */
export const chunksCalmAstryxTheme = defineTheme({
  name: 'chunks-calm',
  extends: neutralTheme,
  color: {
    accent: '#cf202f',
    neutralStyle: 'neutral',
    contrast: 'standard',
  },
  typography: {
    scale: { base: 14, ratio: 1.2 },
    body: { family: 'Inter', fallbacks: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    heading: { family: 'Inter', fallbacks: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    code: { family: 'JetBrains Mono', fallbacks: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  },
  radius: { base: 8, multiplier: 1 },
  motion: { fast: 160, medium: 320, ratio: 0.75 },
  tokens: {
    '--color-accent': ['#cf202f', '#cf202f'],
    '--color-accent-muted': ['rgba(207, 32, 47, 0.12)', 'rgba(207, 32, 47, 0.22)'],
    '--color-on-accent': ['#ffffff', '#ffffff'],
    '--color-background-body': ['#ffffff', '#ffffff'],
    '--color-background-surface': ['#ffffff', '#ffffff'],
    '--color-background-card': ['#ffffff', '#ffffff'],
    '--color-background-muted': ['#f7f7f7', '#f7f7f7'],
    '--color-text-primary': ['#0a0b0d', '#0a0b0d'],
    '--color-text-secondary': ['#5b616e', '#5b616e'],
    '--color-text-accent': ['#a91925', '#a91925'],
    '--color-border': ['#dee1e6', '#dee1e6'],
    '--color-border-emphasized': ['#c9cdd4', '#c9cdd4'],
    '--color-success': ['#05b169', '#05b169'],
    '--color-warning': ['#f4b000', '#f4b000'],
    '--color-error': ['#cf202f', '#cf202f'],
    '--shadow-low': ['0 4px 12px rgb(0 0 0 / 0.04)', '0 4px 12px rgb(0 0 0 / 0.04)'],
    '--shadow-med': ['0 10px 30px rgb(0 0 0 / 0.08)', '0 10px 30px rgb(0 0 0 / 0.08)'],
  },
  components: {
    'astryx-button': {
      base: {
        borderRadius: '12px',
        fontWeight: '700',
      },
    },
    'astryx-card': {
      base: {
        borderRadius: '16px',
        borderColor: '#dee1e6',
        boxShadow: '0 4px 12px rgb(0 0 0 / 0.04)',
      },
    },
    'astryx-side-nav': {
      base: {
        backgroundColor: '#ffffff',
        borderColor: '#dee1e6',
      },
    },
    'astryx-top-nav': {
      base: {
        backgroundColor: '#ffffff',
        borderColor: '#dee1e6',
      },
    },
  },
})
