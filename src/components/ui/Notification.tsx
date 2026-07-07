import { forwardRef } from 'react'
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title: string
  description?: string
  onClose?: () => void
}

export const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  ({ className, variant = 'info', title, description, onClose, ...props }, ref) => {
    const config = {
      info: {
        icon: Info,
        border: 'border-sbi-100 dark:border-sbi-900',
        bg: 'bg-sbi-50/50 dark:bg-sbi-950/20',
        text: 'text-sbi-700 dark:text-sbi-400',
      },
      success: {
        icon: CheckCircle2,
        border: 'border-success/20',
        bg: 'bg-success/5',
        text: 'text-success',
      },
      warning: {
        icon: AlertTriangle,
        border: 'border-warning/20',
        bg: 'bg-warning/5',
        text: 'text-warning',
      },
      danger: {
        icon: XCircle,
        border: 'border-danger/20',
        bg: 'bg-danger/5',
        text: 'text-danger',
      },
    }[variant]

    const Icon = config.icon

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start gap-3 rounded-2xl border p-4 backdrop-blur-md transition-all duration-300',
          config.border,
          config.bg,
          className,
        )}
        {...props}
      >
        <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', config.text)} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-content leading-tight">{title}</p>
          {description && (
            <p className="mt-1 text-xs text-content-muted leading-relaxed">{description}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-content-subtle transition-colors hover:bg-ink-100 hover:text-content dark:hover:bg-ink-900"
            aria-label="Close notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )
  }
)

Notification.displayName = 'Notification'
export default Notification
