import type { Config } from 'tailwindcss'

/**
 * SUYOGYA Design System — Tailwind theme.
 *
 * Design language: Apple spatial UI × Bloomberg Terminal × Stripe.
 * Light, luxurious, glass. Primary accent: SBI Blue. No neon, no hacker theme.
 */
const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // SBI Blue — the single brand accent, expressed as a full scale.
        sbi: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8db6ff',
          400: '#578fff',
          500: '#2f6bf5',
          600: '#1a4fd6', // core brand
          700: '#163fad',
          800: '#17368a',
          900: '#183170',
          950: '#0f1e45',
        },
        // Neutral ramp tuned warm-cool for premium light surfaces.
        ink: {
          50: '#f7f8fa',
          100: '#eef0f4',
          200: '#dee2ea',
          300: '#c3cad7',
          400: '#9aa5b8',
          500: '#6f7c93',
          600: '#556074',
          700: '#434c5e',
          800: '#2c3340',
          900: '#1a1f28',
          950: '#0d1016',
        },
        // Semantic tokens mapped through CSS variables (theme-swappable).
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-raised': 'hsl(var(--surface-raised) / <alpha-value>)',
        canvas: 'hsl(var(--canvas) / <alpha-value>)',
        line: 'hsl(var(--line) / <alpha-value>)',
        content: {
          DEFAULT: 'hsl(var(--content) / <alpha-value>)',
          muted: 'hsl(var(--content-muted) / <alpha-value>)',
          subtle: 'hsl(var(--content-subtle) / <alpha-value>)',
        },
        success: '#0f9d6e',
        warning: '#d98a0b',
        danger: '#e04358',
        info: '#2f6bf5',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Inter Tight"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-md': ['3.75rem', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        'display-lg': ['5.5rem', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
        'display-xl': ['7.5rem', { lineHeight: '0.94', letterSpacing: '-0.045em' }],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      boxShadow: {
        // Layered premium shadows — soft, diffuse, physically plausible.
        'elev-1': '0 1px 2px -1px rgb(16 32 64 / 0.08), 0 1px 3px rgb(16 32 64 / 0.04)',
        'elev-2': '0 2px 4px -2px rgb(16 32 64 / 0.10), 0 4px 12px -2px rgb(16 32 64 / 0.06)',
        'elev-3': '0 8px 16px -8px rgb(16 32 64 / 0.14), 0 12px 32px -8px rgb(16 32 64 / 0.10)',
        'elev-4': '0 16px 32px -12px rgb(16 32 64 / 0.18), 0 24px 56px -16px rgb(16 32 64 / 0.14)',
        'glass': '0 4px 24px -8px rgb(16 32 64 / 0.12), inset 0 1px 0 0 rgb(255 255 255 / 0.55)',
        'glass-lg': '0 24px 64px -20px rgb(16 32 64 / 0.22), inset 0 1px 0 0 rgb(255 255 255 / 0.60)',
        'glow-sbi': '0 0 0 1px rgb(26 79 214 / 0.20), 0 8px 32px -8px rgb(26 79 214 / 0.35)',
        'inner-glass': 'inset 0 1px 0 0 rgb(255 255 255 / 0.6), inset 0 -1px 0 0 rgb(16 32 64 / 0.04)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-light':
          'radial-gradient(at 20% 15%, hsl(220 100% 97%) 0px, transparent 55%), radial-gradient(at 82% 10%, hsl(214 100% 95%) 0px, transparent 50%), radial-gradient(at 75% 85%, hsl(224 90% 96%) 0px, transparent 55%)',
        'mesh-dark':
          'radial-gradient(at 20% 15%, hsl(222 47% 12%) 0px, transparent 55%), radial-gradient(at 82% 10%, hsl(223 47% 8%) 0px, transparent 50%), radial-gradient(at 75% 85%, hsl(224 47% 11%) 0px, transparent 55%)',
        'glass-sheen':
          'linear-gradient(135deg, rgb(255 255 255 / 0.65) 0%, rgb(255 255 255 / 0.15) 40%, rgb(255 255 255 / 0.05) 100%)',
        'sbi-gradient': 'linear-gradient(135deg, #2f6bf5 0%, #1a4fd6 55%, #163fad 100%)',
        'shine': 'linear-gradient(110deg, transparent 30%, rgb(255 255 255 / 0.55) 50%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      transitionTimingFunction: {
        'spring-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-power': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(200%)' },
        },
        'shine-sweep': {
          '0%': { transform: 'translateX(-120%)' },
          '60%,100%': { transform: 'translateX(220%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'draw-line': {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 1.6s infinite',
        'shine-sweep': 'shine-sweep 2.6s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
