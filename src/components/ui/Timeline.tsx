import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { staggerContainer, fadeUp, inViewport } from '@/lib/motion'

export interface TimelineItemData {
  id: string
  title: string
  time?: string
  description?: React.ReactNode
  icon?: React.ReactNode
  accent?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
}

const accentRing = {
  brand: 'bg-sbi-50 text-sbi-600 ring-sbi-100',
  success: 'bg-success/10 text-success ring-success/20',
  warning: 'bg-warning/10 text-warning ring-warning/20',
  danger: 'bg-danger/10 text-danger ring-danger/20',
  neutral: 'bg-ink-100 text-content-muted ring-line',
}

/** Vertical timeline (audit trails, activity feeds). */
export function Timeline({ items, className }: { items: TimelineItemData[]; className?: string }) {
  return (
    <motion.ol
      variants={staggerContainer(0.07)}
      initial="hidden"
      whileInView="show"
      viewport={inViewport}
      className={cn('relative', className)}
    >
      <span className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-line via-line to-transparent" aria-hidden />
      {items.map((item) => (
        <motion.li key={item.id} variants={fadeUp} className="relative flex gap-4 pb-6 last:pb-0">
          <span
            className={cn(
              'relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset',
              accentRing[item.accent ?? 'brand'],
            )}
          >
            {item.icon}
          </span>
          <div className="pt-1">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <p className="font-semibold text-content">{item.title}</p>
              {item.time && <span className="text-xs text-content-subtle">{item.time}</span>}
            </div>
            {item.description && (
              <div className="mt-1 text-sm text-content-muted">{item.description}</div>
            )}
          </div>
        </motion.li>
      ))}
    </motion.ol>
  )
}
