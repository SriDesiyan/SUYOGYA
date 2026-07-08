import { useState } from 'react'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  FileDown,
  UserCheck,
  Database,
  ArrowRight,
  Send,
  Info,
  CheckCircle,
} from 'lucide-react'
import { Button, Badge, GlassPanel, Card, CardHeader, CardTitle, CardContent, useToast } from '@/components/ui'
import { cn } from '@/lib/utils'

// ----------------------------------------------------
// Mock Compliance Audit Trail Schema
// ----------------------------------------------------
interface AuditLog {
  id: string
  timestamp: string
  clientName: string
  action: string
  category: 'ingestion' | 'approval' | 'compliance' | 'delivery'
  status: 'pass' | 'pending' | 'warning'
  hash: string // SHA-256
  auditorName?: string
  credentialsId?: string
  evidenceSummary: string
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'AUD-9842',
    timestamp: '08 July 2026, 14:22:15',
    clientName: 'Kabir Rao',
    action: 'Target Advisory Campaign Approved',
    category: 'approval',
    status: 'pass',
    hash: '0e7a8f4b931e9c2c6d7a8e5f1b0a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    auditorName: 'Sri Desiyan (Relationship Manager)',
    credentialsId: 'SSO-TOKEN-8742-SBI',
    evidenceSummary: 'RM approved alternate assets allocation proposal value ₹85.00L.',
  },
  {
    id: 'AUD-9841',
    timestamp: '08 July 2026, 13:05:10',
    clientName: 'Kabir Rao',
    action: 'Compliance KYC Verification check',
    category: 'compliance',
    status: 'pass',
    hash: 'c8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    evidenceSummary: 'Central government KYC registry checks return active cleared status. Flag count: 0.',
  },
  {
    id: 'AUD-9840',
    timestamp: '08 July 2026, 10:45:00',
    clientName: 'Kabir Rao',
    action: 'Savings Ledger Capital Inflow Trigger Ingested',
    category: 'ingestion',
    status: 'pass',
    hash: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    evidenceSummary: 'Savings credit of ₹1.2Cr capital credit transaction ledger reference TXN-9842-SB confirmed.',
  },
  {
    id: 'AUD-9839',
    timestamp: '08 July 2026, 09:12:30',
    clientName: 'Aarav Mehta',
    action: 'Target Advisory Campaign Approved',
    category: 'approval',
    status: 'pass',
    hash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    auditorName: 'Sri Desiyan (Relationship Manager)',
    credentialsId: 'SSO-TOKEN-8742-SBI',
    evidenceSummary: 'RM approved tech advisory mutual fund proposal value ₹40.00L.',
  },
  {
    id: 'AUD-9838',
    timestamp: '07 July 2026, 17:34:00',
    clientName: 'Diya Sharma',
    action: 'Compliance Verification check - Home Loan suitability',
    category: 'compliance',
    status: 'pending',
    hash: 'e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7',
    evidenceSummary: 'Awaiting housing loan mortgage clearance verification checks. Initial parameters return moderate leverage index.',
  },
  {
    id: 'AUD-9837',
    timestamp: '07 July 2026, 15:45:22',
    clientName: 'Diya Sharma',
    action: 'SMS Alert Dispatch Initialized',
    category: 'delivery',
    status: 'pass',
    hash: 'b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0',
    evidenceSummary: 'SMS notifications sent to customer terminal: Suitability loan pre-approval.',
  },
]

export function Compliance() {
  const toast = useToast()
  
  // 1. Filter and Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'ingestion' | 'approval' | 'compliance' | 'delivery'>('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'pass' | 'pending' | 'warning'>('All')
  
  // Focused log for detailed evidence inspector sidebar
  const [focusedLogId, setFocusedLogId] = useState<string>('AUD-9842')

  const focusedLog = mockAuditLogs.find((l) => l.id === focusedLogId) || mockAuditLogs[0]

  // 2. Export Audit Trail
  const handleExportTrail = () => {
    toast.success(
      'Audit Trail Exported',
      'Compliance archives compiled. Generated log block hash: SHA-256 secure certificate mapped.'
    )
  }

  // 3. Filters computation
  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ingestion':
        return Database
      case 'approval':
        return UserCheck
      case 'compliance':
        return ShieldCheck
      case 'delivery':
        return Send
      default:
        return Info
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-content md:text-3xl">
            Compliance & <span className="text-gradient-sbi">Governance Center</span>
          </h1>
          <p className="text-sm text-content-muted">
            Auditing automated ingestion logs, risk compliance verifications, and Human RM approvals.
          </p>
        </div>
        <Button variant="primary" leftIcon={<FileDown className="h-4 w-4" />} onClick={handleExportTrail}>
          Export Compliance Trail
        </Button>
      </div>

      {/* KPI Counters */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <GlassPanel variant="glass" padding="md" className="flex flex-col justify-between h-24 border border-line">
          <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Compliance Health Rating</span>
          <span className="font-mono text-xl font-bold text-emerald-500">100.0% Pass</span>
        </GlassPanel>
        <GlassPanel variant="glass" padding="md" className="flex flex-col justify-between h-24 border border-line">
          <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Total Audited Decisions</span>
          <span className="font-mono text-xl font-bold text-content">142 Logs</span>
        </GlassPanel>
        <GlassPanel variant="glass" padding="md" className="flex flex-col justify-between h-24 border border-line">
          <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Pending Human Sign-offs</span>
          <span className="font-mono text-xl font-bold text-warning">12 Pending</span>
        </GlassPanel>
        <GlassPanel variant="glass" padding="md" className="flex flex-col justify-between h-24 border border-line">
          <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Active Governance Warnings</span>
          <span className="font-mono text-xl font-bold text-emerald-500">0 Alerts</span>
        </GlassPanel>
      </div>

      {/* Filters & Grid Split */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Audit Trail listing */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search bar inputs */}
          <GlassPanel variant="glass" padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-subtle" />
              <input
                type="text"
                placeholder="Search audit trail by client name, log ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-line bg-surface/50 text-xs text-content outline-none focus:border-sbi-400 transition-all"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 border border-line bg-surface/50 px-3 py-1.5 rounded-xl text-xs">
                <Filter className="h-3.5 w-3.5 text-content-subtle" />
                <span className="font-medium text-content-subtle">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as 'All' | 'ingestion' | 'approval' | 'compliance' | 'delivery')}
                  className="bg-transparent text-content font-bold outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="ingestion">Ingestions</option>
                  <option value="approval">Human Approvals</option>
                  <option value="compliance">KYC Compliance</option>
                  <option value="delivery">Dispatches</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 border border-line bg-surface/50 px-3 py-1.5 rounded-xl text-xs">
                <ShieldAlert className="h-3.5 w-3.5 text-content-subtle" />
                <span className="font-medium text-content-subtle">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'All' | 'pass' | 'pending' | 'warning')}
                  className="bg-transparent text-content font-bold outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="pass">Pass</option>
                  <option value="pending">Pending</option>
                  <option value="warning">Warning</option>
                </select>
              </div>
            </div>
          </GlassPanel>

          {/* Chronological Vertical Timeline Log */}
          <div className="relative border-l border-line ml-4 pl-6 space-y-4">
            {filteredLogs.map((log) => {
              const Icon = getCategoryIcon(log.category)
              const isSelected = focusedLogId === log.id

              return (
                <div key={log.id} className="relative group">
                  {/* Circle status dot */}
                  <div
                    onClick={() => setFocusedLogId(log.id)}
                    className={cn(
                      'absolute -left-10 top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-canvas text-xs shrink-0 cursor-pointer transition-all duration-300',
                      isSelected
                        ? 'border-sbi-500 text-sbi-600 dark:text-sbi-400 ring-4 ring-sbi-500/10 shadow-glow-sbi'
                        : 'border-line text-content-subtle hover:border-ink-300'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Log body block */}
                  <div
                    onClick={() => {
                      setFocusedLogId(log.id)
                      toast.info('Log Loaded', `Inspecting audit details for ${log.id}.`)
                    }}
                    className={cn(
                      'p-4 rounded-2xl border transition-all duration-300 text-xs flex justify-between items-center',
                      isSelected
                        ? 'bg-surface/50 border-sbi-300/40 shadow-inner-glass'
                        : 'bg-surface/20 border-line hover:border-ink-200 cursor-pointer'
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-content">{log.action}</span>
                        <Badge variant="solid" className="font-mono text-[9px] py-0">{log.id}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-3xs text-content-subtle">
                        <span>{log.timestamp}</span>
                        <span>•</span>
                        <span>Client: <span className="font-semibold text-content-muted">{log.clientName}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={log.status === 'pass' ? 'success' : log.status === 'pending' ? 'warning' : 'danger'}>
                        {log.status.toUpperCase()}
                      </Badge>
                      <ArrowRight className="h-3.5 w-3.5 text-content-subtle group-hover:text-content transition-colors" />
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredLogs.length === 0 && (
              <div className="py-16 text-center text-sm text-content-muted bg-surface/20 rounded-3xl border border-line">
                No governance logs found matching current parameters.
              </div>
            )}
          </div>
        </div>

        {/* Evidence Verification inspector sidebar panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="solid" className="min-h-[480px] flex flex-col justify-between">
            <CardHeader className="border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-sbi-500" />
                <CardTitle>Evidence verification</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-5">
              <div className="space-y-1 bg-surface-raised p-3 rounded-xl border border-line">
                <span className="text-content-subtle block uppercase tracking-wider text-[9px]">Logged Action ID</span>
                <span className="font-mono font-bold text-content text-sm">{focusedLog.id}</span>
              </div>

              <div className="space-y-1">
                <span className="text-content-subtle block uppercase tracking-wider text-[9px]">Event Action</span>
                <span className="font-semibold text-content">{focusedLog.action}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-content-subtle block uppercase tracking-wider text-[9px]">Audit summary details</span>
                <p className="text-content-muted leading-relaxed leading-normal">{focusedLog.evidenceSummary}</p>
              </div>

              {/* Secure SHA-256 hash */}
              <div className="space-y-1.5 pt-3 border-t border-line">
                <span className="text-content-subtle block uppercase tracking-wider text-[9px]">SHA-256 Integrity Hash</span>
                <span className="font-mono text-3xs text-content block bg-canvas/40 p-2.5 rounded-lg border border-line break-all leading-normal">
                  {focusedLog.hash}
                </span>
              </div>

              {/* Human Approval Sign-off credentials */}
              {focusedLog.auditorName && (
                <div className="space-y-2 pt-3 border-t border-line bg-surface/10 p-3 rounded-xl border border-line">
                  <span className="font-bold text-content flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-sbi-500" /> Human Sign-off log
                  </span>
                  <div className="space-y-1 text-3xs text-content-muted">
                    <div>RM Auditor: <span className="font-semibold text-content">{focusedLog.auditorName}</span></div>
                    <div>SSO Session: <span className="font-mono text-content">{focusedLog.credentialsId}</span></div>
                  </div>
                </div>
              )}

              {/* Verified verification badge */}
              <div className="pt-4 border-t border-line flex items-center gap-2 text-3xs text-emerald-500 font-bold uppercase tracking-wider">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /> Integrity validation verified.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Compliance
