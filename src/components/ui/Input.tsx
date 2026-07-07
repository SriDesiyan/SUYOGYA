import { forwardRef, useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Search } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const fieldBase =
  'w-full rounded-xl border bg-surface/80 px-3.5 text-sm text-content placeholder:text-content-subtle ' +
  'shadow-inner-glass transition-all duration-200 outline-none ' +
  'focus:border-sbi-400 focus:ring-4 focus:ring-sbi-500/12 disabled:opacity-50 disabled:cursor-not-allowed'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, leftIcon, rightIcon, id, type = 'text', ...props }, ref) => {
    const autoId = useId()
    const inputId = id ?? autoId
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-content">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-subtle">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              fieldBase,
              'h-11',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error ? 'border-danger focus:border-danger focus:ring-danger/12' : 'border-line',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-content-subtle">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-err`} className="mt-1.5 text-xs text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-content-subtle">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [show, setShow] = useState(false)
  return (
    <Input
      ref={ref}
      type={show ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="pointer-events-auto text-content-subtle transition-colors hover:text-content"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      }
      {...props}
    />
  )
})
PasswordInput.displayName = 'PasswordInput'

export const SearchInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <Input ref={ref} leftIcon={<Search className="h-4 w-4" />} placeholder="Search…" {...props} />
))
SearchInput.displayName = 'SearchInput'

/* ── Textarea ──────────────────────────────────────────────────────────── */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const autoId = useId()
    const tid = id ?? autoId
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={tid} className="mb-1.5 block text-sm font-medium text-content">
            {label}
          </label>
        )}
        <textarea
          id={tid}
          ref={ref}
          className={cn(
            fieldBase,
            'min-h-24 resize-y py-2.5',
            error ? 'border-danger' : 'border-line',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

/* ── Switch ────────────────────────────────────────────────────────────── */
export interface SwitchProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
}
export function Switch({ checked, onChange, label, disabled, id }: SwitchProps) {
  const autoId = useId()
  const sid = id ?? autoId
  return (
    <label htmlFor={sid} className={cn('inline-flex items-center gap-3', disabled && 'opacity-50')}>
      <button
        id={sid}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 outline-none',
          'focus-visible:ring-2 focus-visible:ring-sbi-500/50 focus-visible:ring-offset-2',
          checked ? 'bg-sbi-gradient' : 'bg-ink-200',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-elev-1 transition-transform duration-300 ease-spring-soft',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
      {label && <span className="text-sm text-content">{label}</span>}
    </label>
  )
}
