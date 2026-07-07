import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none ' +
    'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-sbi-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
    'disabled:pointer-events-none disabled:opacity-50 overflow-hidden isolate',
  {
    variants: {
      variant: {
        primary:
          'bg-sbi-gradient text-white shadow-glow-sbi hover:shadow-elev-3 sheen',
        secondary:
          'bg-surface text-content border border-line shadow-elev-1 hover:bg-ink-50 hover:shadow-elev-2',
        glass:
          'glass text-content hover:shadow-glass-lg',
        ghost: 'text-content-muted hover:bg-ink-100/70 hover:text-content',
        outline:
          'border border-sbi-200 text-sbi-700 bg-sbi-50/40 hover:bg-sbi-50 hover:border-sbi-300',
        danger:
          'bg-danger text-white shadow-elev-1 hover:brightness-105 hover:shadow-elev-2',
        subtle: 'bg-ink-100 text-content hover:bg-ink-200',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm rounded-xl',
        md: 'h-11 px-5 text-sm rounded-xl',
        lg: 'h-12 px-6 text-[0.95rem] rounded-2xl',
        xl: 'h-14 px-8 text-base rounded-2xl',
        icon: 'h-11 w-11 rounded-xl',
        'icon-sm': 'h-9 w-9 rounded-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={spring.snappy}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </motion.button>
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
