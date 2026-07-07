import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { clamp } from '@/lib/utils'

export interface ProgressProps {
  value: number // 0..100
  className?: string
  trackClassName?: string
  barClassName?: string
  gradient?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: boolean
}

export function Progress({
  value,
  className,
  trackClassName,
  barClassName,
  gradient = true,
  size = 'md',
  label,
}: ProgressProps) {
  const v = clamp(value, 0, 100)
  const h = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' }[size]
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('relative overflow-hidden rounded-full bg-ink-100', h, trackClassName)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${v}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'relative h-full rounded-full',
            gradient ? 'bg-sbi-gradient' : 'bg-sbi-600',
            barClassName,
          )}
        >
          <span className="absolute inset-0 bg-shine opacity-40" />
        </motion.div>
      </div>
      {label && (
        <div className="mt-1 text-right text-xs font-medium tabular-nums text-content-muted">
          {Math.round(v)}%
        </div>
      )}
    </div>
  )
}

/* ── Circular progress / gauge ─────────────────────────────────────────── */
export interface ProgressRingProps {
  value: number // 0..100
  size?: number
  strokeWidth?: number
  className?: string
  children?: React.ReactNode
  trackColor?: string
  gradientId?: string
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  children,
  trackColor = 'hsl(220 24% 90%)',
  gradientId = 'ring-grad',
}: ProgressRingProps) {
  const v = clamp(value, 0, 100)
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const offset = c - (v / 100) * c
  const uid = `${gradientId}-${Math.round(r)}`
  return (
    <div className={cn('relative inline-grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2f6bf5" />
            <stop offset="1" stopColor="#163fad" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${uid})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}
