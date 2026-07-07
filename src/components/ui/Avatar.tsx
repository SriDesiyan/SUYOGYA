import { forwardRef, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, initials as toInitials, seededRandom } from '@/lib/utils'

const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden font-semibold text-white select-none',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-2xs rounded-lg',
        sm: 'h-8 w-8 text-xs rounded-lg',
        md: 'h-10 w-10 text-sm rounded-xl',
        lg: 'h-12 w-12 text-base rounded-xl',
        xl: 'h-16 w-16 text-lg rounded-2xl',
        '2xl': 'h-20 w-20 text-2xl rounded-3xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

// Deterministic gradient per name — stable, on-brand hues.
const gradients = [
  'from-sbi-500 to-sbi-700',
  'from-[#578fff] to-[#1a4fd6]',
  'from-[#7c5cff] to-[#2f6bf5]',
  'from-[#0f9d6e] to-[#0b7d84]',
  'from-[#2f6bf5] to-[#183170]',
  'from-[#d98a0b] to-[#b45309]',
]

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  name: string
  src?: string
  ring?: boolean
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, name, src, ring, ...props }, ref) => {
    const [error, setError] = useState(false)
    const grad = gradients[Math.floor(seededRandom(name.length + name.charCodeAt(0)) * gradients.length)]
    return (
      <span
        ref={ref}
        className={cn(
          avatarVariants({ size }),
          `bg-gradient-to-br ${grad}`,
          ring && 'ring-2 ring-white shadow-elev-2',
          className,
        )}
        {...props}
      >
        {src && !error ? (
          <img
            src={src}
            alt={name}
            onError={() => setError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden>{toInitials(name)}</span>
        )}
        <span className="sr-only">{name}</span>
      </span>
    )
  },
)
Avatar.displayName = 'Avatar'

/** Overlapping avatar stack. */
export function AvatarGroup({
  names,
  max = 4,
  size = 'sm',
  className,
}: {
  names: string[]
  max?: number
  size?: AvatarProps['size']
  className?: string
}) {
  const shown = names.slice(0, max)
  const extra = names.length - shown.length
  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {shown.map((n) => (
        <Avatar key={n} name={n} size={size} ring className="ring-white" />
      ))}
      {extra > 0 && (
        <span
          className={cn(
            avatarVariants({ size }),
            'bg-ink-200 !text-content-muted ring-2 ring-white',
          )}
        >
          +{extra}
        </span>
      )}
    </div>
  )
}
