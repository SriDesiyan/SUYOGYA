import { useState } from 'react'
import { useAuth } from '@/providers/AuthContext'
import { Button, Badge, GlassPanel, Card, CardHeader, CardTitle, CardDescription, CardContent, Avatar } from '@/components/ui'
import { Lock, Copy, Check, Calendar, Shield, Clock, LogOut, FileText } from 'lucide-react'

export function Profile() {
  const { user, token, logout, mockTokenPayload } = useAuth()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (token) {
      navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatUnixDate = (unixTimestamp: number) => {
    return new Date(unixTimestamp * 1000).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    })
  }

  const creationDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN')
    : 'N/A'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-content md:text-3xl">
          Executive <span className="text-gradient-sbi">Profile Workspace</span>
        </h1>
        <p className="text-sm text-content-muted">
          Manage secure credentials, review active JWT session parameters, and audit token payloads.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* User Card */}
        <div className="md:col-span-4 space-y-6">
          <Card variant="solid">
            <CardHeader className="flex flex-col items-center text-center pb-4 border-b border-line">
              <Avatar name={user?.name || 'User'} size="xl" ring className="mb-4" />
              <CardTitle className="text-lg font-bold">{user?.name}</CardTitle>
              <CardDescription className="text-xs">{user?.email}</CardDescription>
              <Badge variant="brand" className="mt-3">
                {user?.role}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-content-muted flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Enrolled Since
                </span>
                <span className="font-medium text-content">{creationDate}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-content-muted flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" /> Account status
                </span>
                <span className="text-success font-semibold flex items-center gap-1">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-content-muted flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Enclave Storage
                </span>
                <span className="font-mono text-content font-bold">MUTED-LOCAL</span>
              </div>

              <Button
                variant="danger"
                className="w-full mt-4 flex items-center justify-center gap-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" /> Terminate Auth Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* JWT Session Details */}
        <div className="md:col-span-8 space-y-6">
          {/* JWT Metadata */}
          <GlassPanel variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-sbi-500" />
                <h3 className="font-display font-semibold text-content text-base">Active JWT Session</h3>
              </div>
              <Badge variant="success">AUTHORIZED</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-line bg-surface/50 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-content">Raw Session Token string</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] font-semibold text-sbi-600 hover:text-sbi-700 dark:text-sbi-400 dark:hover:text-sbi-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-success" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy JWT
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-3xs text-content-subtle break-all select-all leading-normal bg-ink-50/50 dark:bg-ink-950/20 p-2.5 rounded-lg border border-line">
                  {token}
                </p>
              </div>

              {mockTokenPayload && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-line bg-surface/30 p-3">
                    <span className="text-content-subtle block text-3xs uppercase font-bold tracking-wider">Issued At (iat)</span>
                    <span className="font-mono font-semibold text-content mt-1 block">
                      {formatUnixDate(mockTokenPayload.iat)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-line bg-surface/30 p-3">
                    <span className="text-content-subtle block text-3xs uppercase font-bold tracking-wider">Expires At (exp)</span>
                    <span className="font-mono font-semibold text-content mt-1 block">
                      {formatUnixDate(mockTokenPayload.exp)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </GlassPanel>

          {/* Decoded JWT Payload */}
          <div className="rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-sbi-500" />
              <h3 className="font-display font-semibold text-content text-base">Decoded Token Payload</h3>
            </div>
            <div className="rounded-2xl border border-line overflow-hidden font-mono text-xs text-sbi-600 dark:text-sbi-400">
              <pre className="p-4 bg-ink-950/5 text-content-muted dark:bg-ink-950/40 overflow-x-auto text-[11px] leading-relaxed">
                {mockTokenPayload ? JSON.stringify(mockTokenPayload, null, 2) : '// No active token'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
