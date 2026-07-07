import { cn } from '@/lib/utils'

/** Minimal SBI-blue arc spinner. */
export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn('animate-spin', className)}
      role="status"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Three-dot pulse loader (AI "thinking" states). */
export function DotPulse({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
        />
      ))}
    </span>
  )
}

/** Full-panel loading overlay. */
export function LoadingOverlay({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="grid place-items-center py-20">
      <div className="flex flex-col items-center gap-4 text-content-muted">
        <div className="relative">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-sbi-500/20" />
          <Spinner size={32} className="relative text-sbi-600" />
        </div>
        <p className="text-sm font-medium">{label}…</p>
      </div>
    </div>
  )
}
