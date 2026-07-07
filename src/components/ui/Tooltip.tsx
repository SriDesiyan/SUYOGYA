import { cloneElement, isValidElement, useState } from 'react'
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react'
import { cn } from '@/lib/utils'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({ content, children, placement = 'top', delay = 200 }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })
  const hover = useHover(context, { move: false, delay: { open: delay, close: 60 } })
  const focus = useFocus(context)
  const role = useRole(context, { role: 'tooltip' })
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, role])
  const { isMounted, styles } = useTransitionStyles(context, {
    duration: { open: 180, close: 120 },
    initial: { opacity: 0, transform: 'scale(0.94) translateY(2px)' },
  })

  const child = isValidElement(children)
    ? cloneElement(children, { ref: refs.setReference, ...getReferenceProps() } as never)
    : children

  return (
    <>
      {child}
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles }}
            className="z-[60]"
            {...getFloatingProps()}
          >
            <div
              style={styles}
              className={cn(
                'max-w-xs rounded-xl bg-ink-900/95 px-2.5 py-1.5 text-xs font-medium text-white shadow-elev-3 backdrop-blur',
              )}
            >
              {content}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
