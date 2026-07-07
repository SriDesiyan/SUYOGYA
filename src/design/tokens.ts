/**
 * SUYOGYA design tokens — the single source of truth mirrored in
 * tailwind.config.ts. Import these when values are needed in JS/Canvas/Three.js
 * contexts (charts, 3D scenes) where Tailwind classes don't reach.
 */

export const palette = {
  sbi: {
    50: '#eef4ff',
    100: '#d9e6ff',
    200: '#bcd3ff',
    300: '#8db6ff',
    400: '#578fff',
    500: '#2f6bf5',
    600: '#1a4fd6',
    700: '#163fad',
    800: '#17368a',
    900: '#183170',
    950: '#0f1e45',
  },
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
  semantic: {
    success: '#0f9d6e',
    warning: '#d98a0b',
    danger: '#e04358',
    info: '#2f6bf5',
  },
  white: '#ffffff',
} as const

/** Ordered chart series colors — SBI-forward, harmonious. */
export const chartColors = [
  '#1a4fd6',
  '#2f6bf5',
  '#578fff',
  '#8db6ff',
  '#0f9d6e',
  '#d98a0b',
  '#7c5cff',
  '#e04358',
] as const

/** 8px base spacing scale (matches Tailwind's rem scale). */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
} as const

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  '3xl': 44,
  full: 9999,
} as const

export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
  slower: 0.7,
} as const

export type SBIShade = keyof typeof palette.sbi
