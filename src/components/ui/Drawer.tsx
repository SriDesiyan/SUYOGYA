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
import { ease } from '@/lib/motion'
import { Heading } from './Typography'

export interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  side?: 'right' | 'left'
  width?: number
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = 'right',
  width = 460,
}: DrawerProps) {
  const { refs, context } = useFloating({ open, onOpenChange })
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' })
  const role = useRole(context)
  const { getFloatingProps } = useInteractions([dismiss, role])

  const off = side === 'right' ? width + 40 : -(width + 40)

  return (
    <FloatingPortal>
      <AnimatePresence>
        {open && (
          <FloatingOverlay lockScroll className="z-[70]">
            <motion.div
              className="absolute inset-0 bg-ink-950/25 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => onOpenChange(false)}
            />
            <FloatingFocusManager context={context}>
              <motion.aside
                ref={refs.setFloating}
                initial={{ x: off }}
                animate={{ x: 0 }}
                exit={{ x: off }}
                transition={{ duration: 0.42, ease: ease.outExpo }}
                style={{ width }}
                className={cn(
                  'fixed inset-y-0 flex max-w-[92vw] flex-col border-line bg-surface/95 shadow-glass-lg backdrop-blur-2xl',
                  side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
                )}
                {...getFloatingProps()}
              >
                <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
                  <div>
                    {title && <Heading as="h3" size="h4">{title}</Heading>}
                    {description && (
                      <p className="mt-1 text-sm text-content-muted">{description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onOpenChange(false)}
                    aria-label="Close"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-content-subtle transition-colors hover:bg-ink-100 hover:text-content"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </header>
                <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
                {footer && (
                  <footer className="flex items-center justify-end gap-3 border-t border-line px-6 py-4">
                    {footer}
                  </footer>
                )}
              </motion.aside>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </AnimatePresence>
    </FloatingPortal>
  )
}
