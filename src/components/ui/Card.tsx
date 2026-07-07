import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'

const cardVariants = cva('relative rounded-3xl transition-shadow', {
  variants: {
    variant: {
      solid: 'bg-surface border border-line shadow-elev-1',
      raised: 'bg-surface border border-line shadow-elev-3',
      glass: 'glass',
      'glass-strong': 'glass-strong rounded-3xl',
      outline: 'border border-line bg-transparent',
      gradient:
        'border border-sbi-100 bg-gradient-to-br from-sbi-50/70 via-surface to-surface shadow-elev-1',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    interactive: {
      true: 'cursor-pointer hover:shadow-elev-3',
      false: '',
    },
  },
  defaultVariants: { variant: 'solid', padding: 'md', interactive: false },
})

export interface CardProps
  extends Omit<HTMLMotionProps<'div'>, 'ref'>,
    VariantProps<typeof cardVariants> {
  /** Adds a subtle 3D tilt-on-hover using perspective. */
  tilt?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, tilt, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={interactive ? { y: -4 } : undefined}
        transition={spring.soft}
        className={cn(cardVariants({ variant, padding, interactive }), tilt && 'preserve-3d', className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />
  ),
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-display text-lg font-semibold tracking-tight text-content', className)}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-content-muted', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-4', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-5 flex items-center gap-3', className)} {...props} />
  ),
)
CardFooter.displayName = 'CardFooter'

export { cardVariants }
