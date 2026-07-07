import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { scaleIn } from '@/lib/motion'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="show"
      className={cn('grid place-items-center px-6 py-16 text-center', className)}
    >
      {icon && (
        <div className="relative mb-5">
          <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-sbi-100/40 blur-2xl" />
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-line bg-surface text-sbi-500 shadow-elev-1">
            {icon}
          </div>
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-content">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-content-muted text-pretty">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
