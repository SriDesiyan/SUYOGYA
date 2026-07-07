import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/providers/AuthContext'
import { Button, GlassPanel, useToast } from '@/components/ui'
import { SignalMesh3D } from '@/components/3d/SignalMesh3D'
import { Sparkles, ArrowLeft } from 'lucide-react'

export function OTP() {
  const { verifyOTP } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const [code, setCode] = useState<string[]>(['', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const flow = (location.state as { flow?: 'register' | 'forgot-password' })?.flow || 'register'

  // Focus the first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only accept numeric entries
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)
      setError(null)

      // Auto-advance focus to next block if value was typed
      if (value !== '' && index < 3) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        const newCode = [...code]
        newCode[index - 1] = ''
        setCode(newCode)
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join('')

    if (fullCode.length < 4) {
      setError('Please fill out all verification digits.')
      return
    }

    setIsSubmitting(true)
    try {
      await verifyOTP(fullCode)
      if (flow === 'register') {
        toast.success('Passcode Confirmed', 'Corporate node integrity verified.')
        navigate('/role-selection')
      } else {
        toast.success('Password Restored', 'Your session password has been reset to defaults (Password123).')
        navigate('/login')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Passcode verification failed.'
      setError(msg)
      toast.error('Verification Error', msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-canvas/30 transition-colors duration-300">
      <SignalMesh3D />

      <GlassPanel variant="glass-strong" padding="lg" className="w-full max-w-md shadow-glass-lg animate-scale-in">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sbi-gradient mb-3">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-content">
            Enter Verification Code
          </h2>
          <p className="text-xs text-content-subtle mt-1">
            Input the 4-digit code (use 1234) sent to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {code.map((num, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                ref={(el) => {
                  inputRefs.current[idx] = el
                }}
                type="text"
                maxLength={1}
                value={num}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="h-14 w-12 text-center rounded-xl border border-line bg-surface/85 text-xl font-bold text-content focus:border-sbi-400 focus:ring-4 focus:ring-sbi-500/12 outline-none transition-all shadow-inner-glass font-mono"
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-xs text-danger font-medium animate-pulse">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full h-11" loading={isSubmitting}>
            Verify Security OTP
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-content-muted">
          <button
            onClick={() => navigate('/login')}
            className="font-semibold text-content-muted hover:text-content transition-colors flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
          </button>
        </div>
      </GlassPanel>
    </div>
  )
}

export default OTP
