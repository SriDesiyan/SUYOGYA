import { cloneElement, isValidElement, useState } from 'react'
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'

export interface DropdownItem {
  key: string
  label: React.ReactNode
  icon?: React.ReactNode
  onSelect?: () => void
  danger?: boolean
  disabled?: boolean
}

export interface DropdownProps {
  trigger: React.ReactElement
  items: (DropdownItem | 'separator')[]
  align?: 'start' | 'end'
  width?: number
}

export function Dropdown({ trigger, items, align = 'start', width = 216 }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: align === 'end' ? 'bottom-end' : 'bottom-start',
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })
  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'menu' })
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

  const triggerEl = isValidElement(trigger)
    ? cloneElement(trigger, {
        ref: refs.setReference,
        ...getReferenceProps(),
      } as never)
    : trigger

  return (
    <>
      {triggerEl}
      <FloatingPortal>
        <AnimatePresence>
          {open && (
            <FloatingFocusManager context={context} modal={false}>
              <motion.div
                ref={refs.setFloating}
                style={{ ...floatingStyles, width }}
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={spring.snappy}
                className="z-50 origin-top overflow-hidden rounded-2xl border border-line bg-surface/95 p-1.5 shadow-elev-4 backdrop-blur-xl"
                {...getFloatingProps()}
              >
                {items.map((item, i) =>
                  item === 'separator' ? (
                    <div key={`sep-${i}`} className="my-1.5 h-px bg-line" />
                  ) : (
                    <button
                      key={item.key}
                      role="menuitem"
                      disabled={item.disabled}
                      onClick={() => {
                        item.onSelect?.()
                        setOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                        'disabled:pointer-events-none disabled:opacity-40',
                        item.danger
                          ? 'text-danger hover:bg-danger/10'
                          : 'text-content hover:bg-ink-100',
                      )}
                    >
                      {item.icon && <span className="shrink-0 text-content-muted">{item.icon}</span>}
                      {item.label}
                    </button>
                  ),
                )}
              </motion.div>
            </FloatingFocusManager>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  )
}

/* ── Select ────────────────────────────────────────────────────────────── */
export interface SelectOption {
  value: string
  label: string
}
export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  className,
}: {
  value?: string
  onChange: (v: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })
  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'listbox' })
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])
  const selected = options.find((o) => o.value === value)

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        className={cn(
          'flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-line bg-surface/80 px-3.5 text-sm shadow-inner-glass outline-none transition-all',
          'focus-visible:border-sbi-400 focus-visible:ring-4 focus-visible:ring-sbi-500/12',
          className,
        )}
        {...getReferenceProps()}
      >
        <span className={cn(selected ? 'text-content' : 'text-content-subtle')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-content-subtle transition-transform', open && 'rotate-180')} />
      </button>
      <FloatingPortal>
        <AnimatePresence>
          {open && (
            <FloatingFocusManager context={context} modal={false}>
              <motion.div
                ref={refs.setFloating}
                style={floatingStyles}
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={spring.snappy}
                className="z-50 max-h-64 min-w-[var(--radix-select-trigger-width)] overflow-auto rounded-2xl border border-line bg-surface/95 p-1.5 shadow-elev-4 backdrop-blur-xl"
                {...getFloatingProps()}
              >
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    role="option"
                    aria-selected={opt.value === value}
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors',
                      opt.value === value ? 'bg-sbi-50 text-sbi-700' : 'text-content hover:bg-ink-100',
                    )}
                  >
                    {opt.label}
                    {opt.value === value && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </motion.div>
            </FloatingFocusManager>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  )
}
