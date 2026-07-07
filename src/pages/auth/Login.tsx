import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/providers/AuthContext'
import { Input, PasswordInput, Button, GlassPanel, useToast } from '@/components/ui'
import { SignalMesh3D } from '@/components/3d/SignalMesh3D'
import { Sparkles, ArrowRight } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

type LoginValues = z.infer<typeof loginSchema>

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Redirect target
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const onSubmit = async (data: LoginValues) => {
    try {
      await login(data.email, data.password)
      toast.success('Access Granted', 'Welcome to the SUYOGYA Executive Cockpit.')
      navigate(from, { replace: true })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown credential error.'
      toast.error('Authentication Failed', msg)
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
            Executive Portal Login
          </h2>
          <p className="text-xs text-content-subtle mt-1">
            Access secure wealth advisory signal registers.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="Corporate Email Address"
              placeholder="e.g., desiy@sbi.co.in"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-content">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-sbi-600 hover:text-sbi-700 dark:text-sbi-400 dark:hover:text-sbi-300 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <PasswordInput
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <Button type="submit" className="w-full h-11 mt-6" loading={isSubmitting}>
            Authenticate Session
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-content-muted">
          <span>Need corporate registration? </span>
          <Link
            to="/register"
            className="font-semibold text-sbi-600 hover:text-sbi-700 dark:text-sbi-400 dark:hover:text-sbi-300 transition-colors"
          >
            Create account <ArrowRight className="inline h-3.5 w-3.5 ml-0.5" />
          </Link>
        </div>
      </GlassPanel>
    </div>
  )
}

export default Login
