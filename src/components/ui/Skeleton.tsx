import { cn } from '@/lib/utils'

/** Shimmering skeleton placeholder. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-ink-100',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer',
        'before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
        className,
      )}
      {...props}
    />
  )
}

/** Composed skeleton for a KPI/stat card. */
export function SkeletonStat() {
  return (
    <div className="card-surface p-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-9 w-32" />
      <Skeleton className="mt-3 h-3 w-40" />
    </div>
  )
}

/** Composed skeleton for a list row. */
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-lg" />
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}
