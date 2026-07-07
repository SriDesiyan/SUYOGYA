import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import Dashboard from '@/pages/Dashboard'
import DesignSystem from '@/pages/DesignSystem'
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
        <Link to="/">
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/signals" element={<ComingSoon title="Signal Stream" />} />
            <Route path="/clients" element={<ComingSoon title="Client Analytics" />} />
            <Route path="/api-integrations" element={<ComingSoon title="API Integrations" />} />
            <Route path="/transactions" element={<ComingSoon title="Transactions Ledger" />} />
            <Route path="/settings" element={<ComingSoon title="System Settings" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  )
}
