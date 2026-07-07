import { useId } from 'react'
import { cn } from '@/lib/utils'

export interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  className?: string
  stroke?: string
  fill?: boolean
  strokeWidth?: number
}

/** Lightweight inline area sparkline (no dependency). */
export function Sparkline({
  data,
  width = 120,
  height = 36,
  className,
  stroke = '#1a4fd6',
  fill = true,
  strokeWidth = 2,
}: SparklineProps) {
  const id = useId()
  if (data.length < 2) return <svg width={width} height={height} className={className} />

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  const pad = strokeWidth

  const points = data.map((d, i) => {
    const x = i * stepX
    const y = pad + (1 - (d - min) / range) * (height - pad * 2)
    return [x, y] as const
  })

  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`

  return (
    <svg width={width} height={height} className={cn('overflow-visible', className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="1" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#spark-${id})`} />}
      <path d={line} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r={strokeWidth + 0.5} fill={stroke} />
    </svg>
  )
}
