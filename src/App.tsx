import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import DesignSystem from '@/pages/DesignSystem'
import Profile from '@/pages/Profile'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import OTP from '@/pages/auth/OTP'
import RoleSelection from '@/pages/auth/RoleSelection'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Card, CardTitle, Button } from '@/components/ui'
import { Construction } from 'lucide-react'

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
            <Route path="/signals" element={<ProtectedRoute><ComingSoon title="Signal Stream" /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><ComingSoon title="Client Analytics" /></ProtectedRoute>} />
            <Route path="/api-integrations" element={<ProtectedRoute><ComingSoon title="API Integrations" /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><ComingSoon title="Transactions Ledger" /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><ComingSoon title="System Settings" /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/*" element={<LayoutWrapper />} />
      </Routes>
    </Router>
  )
}
