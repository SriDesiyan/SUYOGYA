import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        neutral: 'bg-ink-100 text-content-muted',
        brand: 'bg-sbi-50 text-sbi-700 ring-1 ring-inset ring-sbi-100',
        success: 'bg-success/10 text-success ring-1 ring-inset ring-success/20',
        warning: 'bg-warning/10 text-warning ring-1 ring-inset ring-warning/20',
        danger: 'bg-danger/10 text-danger ring-1 ring-inset ring-danger/20',
        outline: 'border border-line text-content-muted',
        glass: 'glass text-content',
        solid: 'bg-sbi-gradient text-white',
      },
      size: {
        sm: 'h-5 px-2 text-2xs rounded-md',
        md: 'h-6 px-2.5 text-xs rounded-lg',
        lg: 'h-7 px-3 text-sm rounded-lg',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'md' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden />}
      {children}
    </span>
  ),
)
Badge.displayName = 'Badge'

/** Live status pill with a pulsing indicator. */
export function StatusDot({
  status = 'online',
  label,
  className,
}: {
  status?: 'online' | 'busy' | 'idle' | 'offline'
  label?: string
  className?: string
}) {
  const color = {
    online: 'bg-success',
    busy: 'bg-danger',
    idle: 'bg-warning',
    offline: 'bg-ink-300',
  }[status]
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex h-2 w-2">
        {status === 'online' && (
          <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', color)} />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', color)} />
      </span>
      {label && <span className="text-xs font-medium text-content-muted">{label}</span>}
    </span>
  )
}

export { badgeVariants }
