import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/providers/AuthContext'
import { LoadingOverlay, useToast } from '@/components/ui'
import { useEffect, useRef } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  const toast = useToast()
  const toastTriggered = useRef(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !toastTriggered.current) {
      toastTriggered.current = true
      toast.warning(
        'Authentication Required',
        'Please enter your executive credentials to access the secure panels.',
      )
    }
  }, [isLoading, isAuthenticated, toast])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-canvas">
        <LoadingOverlay label="Verifying security credentials..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
