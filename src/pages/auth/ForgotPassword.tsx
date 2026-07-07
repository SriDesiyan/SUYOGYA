import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button, GlassPanel, useToast } from '@/components/ui'
import { SignalMesh3D } from '@/components/3d/SignalMesh3D'
import { Sparkles, ArrowLeft } from 'lucide-react'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPassword() {
  const navigate = useNavigate()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (_data: ForgotPasswordValues) => {
    // Simulate sending recovery token
    await new Promise((r) => setTimeout(r, 1000))
    toast.info('Passcode Transmitted', 'A temporary 4-digit code (use 1234) has been queued for your session.')
    navigate('/otp', { state: { flow: 'forgot-password' } })
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
            Recover Password
          </h2>
          <p className="text-xs text-content-subtle mt-1">
            Request an OTP code to restore database session access.
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

          <Button type="submit" className="w-full h-11 mt-6" loading={isSubmitting}>
            Transmit Verification Code
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-content-muted">
          <Link
            to="/login"
            className="font-semibold text-content-muted hover:text-content transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
          </Link>
        </div>
      </GlassPanel>
    </div>
  )
}

export default ForgotPassword
