import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, User } from '@/providers/AuthContext'
import { Button, GlassPanel, useToast } from '@/components/ui'
import { SignalMesh3D } from '@/components/3d/SignalMesh3D'
import { Sparkles, Shield, UserCheck, Key } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RoleSelection() {
  const { selectRole, tempUser } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [selectedRole, setSelectedRole] = useState<User['role'] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const roles = [
    {
      name: 'Relationship Manager' as User['role'],
      icon: UserCheck,
      description: 'Review readiness parameters, publish intent signals, and engage directly with affluent HNIs.',
    },
    {
      name: 'Wealth Administrator' as User['role'],
      icon: Shield,
      description: 'Manage institutional datasets, configure Zod form validations, and monitor system metrics.',
    },
    {
      name: 'Branch Head' as User['role'],
      icon: Key,
      description: 'Oversee campaign conversions, review branch performance indicators, and authorize models.',
    },
  ]

  const handleSelection = async () => {
    if (!selectedRole) return

    setIsSubmitting(true)
    try {
      await selectRole(selectedRole)
      toast.success('Workspace Initialized', `Successfully registered account as ${selectedRole}.`)
      navigate('/dashboard')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Verification database mismatch.'
      toast.error('Role Assignment Failed', msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-canvas/30 transition-colors duration-300">
      <SignalMesh3D />

      <GlassPanel variant="glass-strong" padding="lg" className="w-full max-w-lg shadow-glass-lg animate-scale-in">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sbi-gradient mb-3">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-content">
            Institutional Role Selection
          </h2>
          <p className="text-xs text-content-subtle mt-1">
            Assign workspace credentials for user {tempUser?.name || 'Account'}.
          </p>
        </div>

        <div className="grid gap-4 mb-6">
          {roles.map((r, idx) => {
            const Icon = r.icon
            const isSelected = selectedRole === r.name
            return (
              <div
                key={idx}
                onClick={() => setSelectedRole(r.name)}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 bg-surface/50 hover:bg-surface/85',
                  isSelected
                    ? 'border-sbi-500 ring-2 ring-sbi-500/15 shadow-glow-sbi'
                    : 'border-line hover:border-ink-300',
                )}
              >
                <div
                  className={cn(
                    'h-10 w-10 shrink-0 rounded-lg flex items-center justify-center transition-colors',
                    isSelected
                      ? 'bg-sbi-100 text-sbi-600 dark:bg-sbi-950/40 dark:text-sbi-400'
                      : 'bg-ink-100 text-content-subtle dark:bg-ink-900',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-content leading-tight">{r.name}</h4>
                  <p className="text-3xs text-content-muted mt-1 leading-normal">
                    {r.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <Button
          onClick={handleSelection}
          disabled={!selectedRole}
          className="w-full h-11"
          loading={isSubmitting}
        >
          Initialize Executive Environment
        </Button>
      </GlassPanel>
    </div>
  )
}

export default RoleSelection
