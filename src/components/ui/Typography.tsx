import { createElement, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ── Display / Heading ─────────────────────────────────────────────────── */

const headingVariants = cva('font-display text-content text-balance', {
  variants: {
    size: {
      display: 'text-display-lg font-extrabold tracking-[-0.04em]',
      h1: 'text-display-sm font-bold tracking-tight',
      h2: 'text-3xl font-bold tracking-tight',
      h3: 'text-2xl font-semibold tracking-tight',
      h4: 'text-xl font-semibold tracking-tight',
      h5: 'text-lg font-semibold',
      h6: 'text-base font-semibold',
    },
  },
  defaultVariants: { size: 'h2' },
})

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingTag
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h2', size, className, ...props }, ref) =>
    createElement(as, { ref, className: cn(headingVariants({ size }), className), ...props }),
)
Heading.displayName = 'Heading'

/* ── Eyebrow / Kicker ──────────────────────────────────────────────────── */

export function Eyebrow({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.18em] text-sbi-600',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/* ── Text ──────────────────────────────────────────────────────────────── */

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    tone: {
      default: 'text-content',
      muted: 'text-content-muted',
      subtle: 'text-content-subtle',
      brand: 'text-sbi-600',
      success: 'text-success',
      danger: 'text-danger',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: { size: 'base', tone: 'default', weight: 'normal' },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div'
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ as = 'p', size, tone, weight, className, ...props }, ref) =>
    createElement(as, { ref, className: cn(textVariants({ size, tone, weight }), className), ...props }),
)
Text.displayName = 'Text'

/** Monospace numeric label — for terminal-style figures. */
export function Mono({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('font-mono text-sm tabular-nums', className)} {...props}>
      {children}
    </span>
  )
}
