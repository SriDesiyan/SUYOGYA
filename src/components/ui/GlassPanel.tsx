import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'

export interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Frosted variant style: standard glass or strong glass. */
  variant?: 'glass' | 'glass-strong'
  /** Adds responsive rounded borders: sm, md, lg, xl, 2xl, 3xl. */
  radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  /** Inner padding scale: none, sm, md, lg. Default is md. */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Enable hover and tap lift behaviors. */
  interactive?: boolean
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      className,
      variant = 'glass',
      radius = 'xl',
      padding = 'md',
      interactive = false,
      children,
      ...props
    },
    ref,
  ) => {
    const radiusClass = {
      sm: 'rounded-lg',
      md: 'rounded-xl',
      lg: 'rounded-2xl',
      xl: 'rounded-3xl',
      '2xl': 'rounded-[2rem]',
      '3xl': 'rounded-[2.5rem]',
    }[radius]

    const paddingClass = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }[padding]

    return (
      <motion.div
        ref={ref}
        whileHover={interactive ? { y: -4 } : undefined}
        whileTap={interactive ? { scale: 0.99 } : undefined}
        transition={spring.soft}
        className={cn(
          variant === 'glass' ? 'glass' : 'glass-strong',
          radiusClass,
          paddingClass,
          interactive && 'cursor-pointer',
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassPanel.displayName = 'GlassPanel'
export default GlassPanel
