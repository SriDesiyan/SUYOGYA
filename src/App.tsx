import { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Card, CardTitle, Button } from '@/components/ui'
import { Construction, Loader2 } from 'lucide-react'

// Lazily load route views for maximum performance and smaller bundle sizes
const Landing = lazy(() => import('@/pages/Landing'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const DesignSystem = lazy(() => import('@/pages/DesignSystem'))
const Profile = lazy(() => import('@/pages/Profile'))
const Clients = lazy(() => import('@/pages/Clients'))
const Readiness = lazy(() => import('@/pages/Readiness'))
const Evidence = lazy(() => import('@/pages/Evidence'))
const Reasoning = lazy(() => import('@/pages/Reasoning'))
const Recommendations = lazy(() => import('@/pages/Recommendations'))
const Channels = lazy(() => import('@/pages/Channels'))
const Compliance = lazy(() => import('@/pages/Compliance'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const Monitoring = lazy(() => import('@/pages/Monitoring'))
const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const OTP = lazy(() => import('@/pages/auth/OTP'))
const RoleSelection = lazy(() => import('@/pages/auth/RoleSelection'))

function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-sbi-500" />
        <span className="text-3xs font-mono text-content-subtle uppercase tracking-widest">Loading Platform View...</span>
      </div>
    </div>
  )
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center animate-fade-in">
      <Card variant="glass" className="flex max-w-md w-full flex-col items-center p-8">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sbi-50 text-sbi-600 dark:bg-sbi-950/20 dark:text-sbi-400">
          <Construction className="h-8 w-8 animate-pulse" />
        </div>
        <CardTitle className="text-xl font-bold mb-2">{title} pipeline</CardTitle>
        <p className="text-sm text-content-muted mb-6">
          The SUYOGYA engagement modules are currently being synchronized for this view. Dashboard panels remain operational.
        </p>
        <Link to="/dashboard">
          <Button variant="primary">Return to Command Center</Button>
        </Link>
      </Card>
    </div>
  )
}

function LayoutWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 md:pl-64 p-6 w-full max-w-7xl mx-auto transition-all duration-300">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/design-system"
                element={
                  <ProtectedRoute>
                    <DesignSystem />
                  </ProtectedRoute>
                }
              />
              <Route path="/signals" element={<ProtectedRoute><Readiness /></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
              <Route path="/evidence" element={<ProtectedRoute><Evidence /></ProtectedRoute>} />
              <Route path="/reasoning" element={<ProtectedRoute><Reasoning /></ProtectedRoute>} />
              <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
              <Route path="/channels" element={<ProtectedRoute><Channels /></ProtectedRoute>} />
              <Route path="/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><ComingSoon title="System Settings" /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/*" element={<LayoutWrapper />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
