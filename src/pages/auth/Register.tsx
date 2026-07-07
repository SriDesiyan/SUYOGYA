import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/providers/AuthContext'
import { Input, PasswordInput, Button, GlassPanel, useToast } from '@/components/ui'
import { SignalMesh3D } from '@/components/3d/SignalMesh3D'
import { Sparkles, ArrowLeft } from 'lucide-react'

const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ['confirmPassword'],
  })

type RegisterValues = z.infer<typeof registerSchema>

export function Register() {
  const { registerUser } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterValues) => {
    try {
      await registerUser(data.name, data.email, data.password)
      toast.info('Verification Required', 'A security passcode has been queued for your session.')
      navigate('/otp', { state: { flow: 'register' } })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown network index error.'
      toast.error('Registration Failed', msg)
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
            Executive Registration
          </h2>
          <p className="text-xs text-content-subtle mt-1">
            Enroll your credentials into the SUYOGYA nodes.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="Full Name"
              placeholder="e.g., Sri Desiyan"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div>
            <Input
              label="Corporate Email"
              placeholder="e.g., desiy@sbi.co.in"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div>
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <div>
            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          <Button type="submit" className="w-full h-11 mt-6" loading={isSubmitting}>
            Request Code Verification
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

export default Register
