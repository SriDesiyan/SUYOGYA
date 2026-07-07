import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Clamp a number to a range. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** Map a value from one range to another. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin)
}

/** Format an integer with thin thousands separators. */
export function formatNumber(n: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('en-IN', opts).format(n)
}

/** Compact currency in INR (₹1.2Cr, ₹45L, ₹12k). */
export function formatINRCompact(n: number) {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(n % 1_00_00_000 === 0 ? 0 : 1)}Cr`
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(n % 1_00_000 === 0 ? 0 : 1)}L`
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(0)}k`
  return `₹${n}`
}

/** Full INR currency. */
export function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

/** Percentage string. */
export function formatPct(n: number, digits = 0) {
  return `${(n * 100).toFixed(digits)}%`
}

/** Deterministic pseudo-random in [0,1) from a seed — stable across renders. */
export function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** Get initials from a full name. */
export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

/** Relative time from an ISO string or Date. */
export function timeAgo(input: string | Date) {
  const date = typeof input === 'string' ? new Date(input) : input
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const units: [number, string][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.34, 'week'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ]
  let value = seconds
  let unit = 'second'
  let divisor = 1
  for (const [step, name] of units) {
    if (Math.abs(value) < step) {
      unit = name
      break
    }
    divisor *= step
    value = seconds / divisor
    unit = name
  }
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  return rtf.format(-Math.round(value), unit as Intl.RelativeTimeFormatUnit)
}
