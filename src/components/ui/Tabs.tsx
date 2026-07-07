import { createContext, useContext, useId, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'

interface TabsCtx {
  value: string
  setValue: (v: string) => void
  layoutId: string
}
const Ctx = createContext<TabsCtx | null>(null)
const useTabs = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('Tabs components must be used within <Tabs>')
  return c
}

export interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (v: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue)
  const layoutId = useId()
  const current = value ?? internal
  const setValue = (v: string) => {
    setInternal(v)
    onValueChange?.(v)
  }
  return (
    <Ctx.Provider value={{ value: current, setValue, layoutId }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  )
}

export function TabsList({
  children,
  className,
  variant = 'pill',
}: {
  children: React.ReactNode
  className?: string
  variant?: 'pill' | 'underline'
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'relative inline-flex items-center gap-1',
        variant === 'pill'
          ? 'rounded-2xl border border-line bg-ink-50/80 p-1 backdrop-blur'
          : 'gap-6 border-b border-line',
        className,
      )}
      data-variant={variant}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { value: current, setValue, layoutId } = useTabs()
  const active = current === value
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => setValue(value)}
      className={cn(
        'relative z-10 rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-sbi-500/40',
        active ? 'text-sbi-700' : 'text-content-muted hover:text-content',
        className,
      )}
    >
      {active && (
        <motion.span
          layoutId={`tab-${layoutId}`}
          transition={spring.soft}
          className="absolute inset-0 -z-10 rounded-xl bg-surface shadow-elev-1"
        />
      )}
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { value: current } = useTabs()
  if (current !== value) return null
  return (
    <motion.div
      role="tabpanel"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn('mt-5', className)}
    >
      {children}
    </motion.div>
  )
}
