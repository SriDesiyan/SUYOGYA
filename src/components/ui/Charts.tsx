import { useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { chartColors } from '@/design/tokens'

/* ── Bar chart ─────────────────────────────────────────────────────────── */
export interface BarDatum {
  label: string
  value: number
  color?: string
}

export function BarChart({
  data,
  height = 200,
  className,
  valueFormat = (v) => String(v),
}: {
  data: BarDatum[]
  height?: number
  className?: string
  valueFormat?: (v: number) => string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className={cn('flex items-end gap-3', className)} style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="group flex flex-1 flex-col items-center justify-end gap-2">
          <span className="text-xs font-semibold tabular-nums text-content opacity-0 transition-opacity group-hover:opacity-100">
            {valueFormat(d.value)}
          </span>
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: `${(d.value / max) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="w-full rounded-t-lg rounded-b-sm"
            style={{
              background: d.color ?? `linear-gradient(180deg, ${chartColors[1]}, ${chartColors[0]})`,
              minHeight: 4,
            }}
          />
          <span className="text-2xs font-medium text-content-subtle">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Donut chart ───────────────────────────────────────────────────────── */
export interface DonutDatum {
  label: string
  value: number
  color?: string
}

export function DonutChart({
  data,
  size = 180,
  thickness = 22,
  className,
  center,
}: {
  data: DonutDatum[]
  size?: number
  thickness?: number
  className?: string
  center?: React.ReactNode
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  let acc = 0

  return (
    <div className={cn('relative inline-grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(220 24% 92%)" strokeWidth={thickness} />
        {data.map((d, i) => {
          const frac = d.value / total
          const dash = frac * c
          const seg = (
            <motion.circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color ?? chartColors[i % chartColors.length]}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c - dash}`}
              initial={{ strokeDashoffset: c }}
              whileInView={{ strokeDashoffset: -acc }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          )
          acc += dash
          return seg
        })}
      </svg>
      {center && <div className="absolute inset-0 grid place-items-center">{center}</div>}
    </div>
  )
}

/* ── Line / area chart ─────────────────────────────────────────────────── */
export function LineChart({
  series,
  width = 520,
  height = 200,
  className,
  colors = [chartColors[0], chartColors[4]],
}: {
  series: { name: string; data: number[] }[]
  width?: number
  height?: number
  className?: string
  colors?: string[]
}) {
  const id = useId()
  const all = series.flatMap((s) => s.data)
  const min = Math.min(...all)
  const max = Math.max(...all)
  const range = max - min || 1
  const pad = 8

  const toPath = (data: number[]) => {
    const stepX = width / (data.length - 1)
    return data
      .map((d, i) => {
        const x = i * stepX
        const y = pad + (1 - (d - min) / range) * (height - pad * 2)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('w-full', className)}
      preserveAspectRatio="none"
      style={{ height }}
    >
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={width} y1={height * g} y2={height * g} stroke="hsl(220 24% 92%)" strokeWidth="1" />
      ))}
      {series.map((s, i) => (
        <g key={s.name}>
          <defs>
            <linearGradient id={`ln-${id}-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={colors[i % colors.length]} stopOpacity="0.2" />
              <stop offset="1" stopColor={colors[i % colors.length]} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${toPath(s.data)} L${width},${height} L0,${height} Z`} fill={`url(#ln-${id}-${i})`} />
          <motion.path
            d={toPath(s.data)}
            fill="none"
            stroke={colors[i % colors.length]}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </g>
      ))}
    </svg>
  )
}
