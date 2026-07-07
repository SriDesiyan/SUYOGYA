import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'
import { useCountUp } from '@/hooks/useCountUp'
import { Sparkline } from './Sparkline'

export interface StatCardProps {
  label: string
  value: number
  format?: (v: number) => string
  delta?: number // fractional change, e.g. 0.124 = +12.4%
  icon?: React.ReactNode
  spark?: number[]
  hint?: string
  accent?: boolean
  className?: string
  decimals?: number
}

/**
 * Premium KPI card — animated count-up, trend delta, optional sparkline,
 * spatial hover lift, and a subtle top sheen.
 */
export function StatCard({
  label,
  value,
  format = (v) => v.toLocaleString('en-IN'),
  delta,
  icon,
  spark,
  hint,
  accent,
  className,
  decimals = 0,
}: StatCardProps) {
  const animated = useCountUp(value, { decimals })
  const positive = (delta ?? 0) >= 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={spring.soft}
      className={cn(
        'group relative overflow-hidden rounded-3xl border p-5 shadow-elev-1 transition-shadow hover:shadow-elev-3',
        accent
          ? 'border-sbi-100 bg-gradient-to-br from-sbi-50/80 via-surface to-surface'
          : 'border-line bg-surface',
        className,
      )}
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sbi-400/10 blur-2xl transition-opacity group-hover:opacity-80" />

      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-content-muted">{label}</span>
        {icon && (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sbi-50 text-sbi-600 ring-1 ring-inset ring-sbi-100">
            {icon}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <div className="font-display text-3xl font-bold tracking-tight tabular-nums text-content">
            {format(animated)}
          </div>
          {delta !== undefined && (
            <div
              className={cn(
                'mt-1.5 inline-flex items-center gap-1 text-xs font-semibold',
                positive ? 'text-success' : 'text-danger',
              )}
            >
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(delta * 100).toFixed(1)}%
              {hint && <span className="ml-1 font-normal text-content-subtle">{hint}</span>}
            </div>
          )}
          {delta === undefined && hint && (
            <div className="mt-1.5 text-xs text-content-subtle">{hint}</div>
          )}
        </div>
        {spark && spark.length > 1 && (
          <Sparkline data={spark} className="opacity-90" stroke={positive ? '#0f9d6e' : '#e04358'} />
        )}
      </div>
    </motion.div>
  )
}
