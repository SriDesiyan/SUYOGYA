import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'
import { Heading } from './Typography'

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: DialogProps) {
  const { refs, context } = useFloating({ open, onOpenChange })
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' })
  const role = useRole(context)
  const { getFloatingProps } = useInteractions([dismiss, role])

  return (
    <FloatingPortal>
      <AnimatePresence>
        {open && (
          <FloatingOverlay lockScroll className="z-[70] grid place-items-center p-4">
            <motion.div
              className="absolute inset-0 bg-ink-950/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenChange(false)}
            />
            <FloatingFocusManager context={context}>
              <motion.div
                ref={refs.setFloating}
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={spring.soft}
                className={cn(
                  'relative w-full rounded-3xl border border-white/60 bg-surface/95 p-6 shadow-glass-lg backdrop-blur-2xl',
                  sizes[size],
                  className,
                )}
                {...getFloatingProps()}
              >
                <button
                  onClick={() => onOpenChange(false)}
                  aria-label="Close"
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-content-subtle transition-colors hover:bg-ink-100 hover:text-content"
                >
                  <X className="h-4 w-4" />
                </button>
                {(title || description) && (
                  <div className="mb-4 pr-8">
                    {title && <Heading as="h3" size="h4">{title}</Heading>}
                    {description && (
                      <p className="mt-1 text-sm text-content-muted">{description}</p>
                    )}
                  </div>
                )}
                {children}
                {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
              </motion.div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </AnimatePresence>
    </FloatingPortal>
  )
}
