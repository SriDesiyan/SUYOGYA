import { Fragment } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumb({
  items,
  className,
  onNavigate,
}: {
  items: Crumb[]
  className?: string
  onNavigate?: (href: string) => void
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-sm', className)}>
      <ol className="flex items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <Fragment key={item.label}>
              <li>
                {item.href && !last ? (
                  <button
                    onClick={() => onNavigate?.(item.href!)}
                    className="rounded-md px-1 font-medium text-content-muted transition-colors hover:text-sbi-600"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span
                    aria-current={last ? 'page' : undefined}
                    className={cn('px-1 font-medium', last ? 'text-content' : 'text-content-muted')}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!last && <ChevronRight className="h-3.5 w-3.5 text-content-subtle" aria-hidden />}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
