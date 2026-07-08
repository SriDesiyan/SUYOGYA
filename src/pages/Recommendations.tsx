import { useState } from 'react'
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  Edit,
  Calendar,
  Eye,
  AlertCircle,
  X,
} from 'lucide-react'
import { Button, Badge, GlassPanel, useToast } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

// ----------------------------------------------------
// Mock Recommendations Schema
// ----------------------------------------------------
interface RecommendationItem {
  id: string
  title: string
  clientName: string
  clientSegment: 'HNI' | 'Affluent'
  confidence: number
  businessValue: string // AUM Allocation value
  expectedROI: string
  readinessScore: number
  complianceStatus: 'Pass' | 'Verification Pending'
  reasoning: string
  supportingEvidence: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Scheduled'
  rejectedReason?: string
  scheduledDate?: string
}

const initialRecommendations: RecommendationItem[] = [
  {
    id: 'rec-1',
    title: 'SBI PMS Bluechip Equity Expansion',
    clientName: 'Kabir Rao',
    clientSegment: 'HNI',
    confidence: 95,
    businessValue: '₹85.00L',
    expectedROI: '14.2%',
    readinessScore: 92,
    complianceStatus: 'Pass',
    reasoning: 'Corporate venture liquidation payout detected creating 18% savings drag.',
    supportingEvidence: 'Ledger credit: TXN-9842-SB (+₹1.2Cr), Alternate Investments logs (3 clicks).',
    status: 'Pending',
  },
  {
    id: 'rec-2',
    title: 'SBI Tech Advisory Mutual Fund',
    clientName: 'Aarav Mehta',
    clientSegment: 'HNI',
    confidence: 92,
    businessValue: '₹40.00L',
    expectedROI: '18.5%',
    readinessScore: 87,
    complianceStatus: 'Pass',
    reasoning: 'High risk margins matched with tech stock searches session indicators.',
    supportingEvidence: 'Corporate registry verified, app tab views count: 12 logins.',
    status: 'Pending',
  },
  {
    id: 'rec-3',
    title: 'Sovereign Gold Bond Allocation',
    clientName: 'Ishaan Roy',
    clientSegment: 'Affluent',
    confidence: 78,
    businessValue: '₹15.00L',
    expectedROI: '6.8%',
    readinessScore: 78,
    complianceStatus: 'Pass',
    reasoning: 'Debt portfolio rebalancing gap threshold identified.',
    supportingEvidence: 'Bond maturity registry logs check (+₹20L), risk index: Conservative.',
    status: 'Pending',
  },
  {
    id: 'rec-4',
    title: 'Home Loan Portfolio Package',
    clientName: 'Diya Sharma',
    clientSegment: 'Affluent',
    confidence: 72,
    businessValue: '₹30.00L',
    expectedROI: '8.4%',
    readinessScore: 64,
    complianceStatus: 'Verification Pending',
    reasoning: 'Active real-estate Stamp acquisition proposal files tracked.',
    supportingEvidence: 'Savings balance index verification, real-estate logs checks.',
    status: 'Pending',
  },
]

export function Recommendations() {
  const toast = useToast()
  
  // 1. Core State
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(initialRecommendations)
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Scheduled'>('All')

  // Modal controls
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null)
  const [modalType, setModalType] = useState<'none' | 'modify' | 'reject' | 'schedule'>('none')

  // Modal Field Inputs
  const [modifyValue, setModifyValue] = useState(85) // in Lakhs
  const [modifyROI, setModifyROI] = useState(14.2)
  const [rejectReasonText, setRejectReasonText] = useState('')
  const [scheduleDateText, setScheduleDateText] = useState('')

  const activeRec = recommendations.find((r) => r.id === selectedRecId)

  // 2. Action Handlers
  const handleApprove = (id: string, name: string, title: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    )
    toast.success(
      'Recommendation Approved',
      `Proposal for ${name} (${title}) dispatched to client channels.`
    )
  }

  // Reject Modal Submit
  const handleRejectSubmit = () => {
    if (!selectedRecId || !rejectReasonText.trim()) return
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === selectedRecId
          ? { ...r, status: 'Rejected', rejectedReason: rejectReasonText }
          : r
      )
    )
    toast.error(
      'Recommendation Rejected',
      `Discarded proposal. Logged reason: "${rejectReasonText}"`
    )
    closeModal()
  }

  // Modify Modal Submit
  const handleModifySubmit = () => {
    if (!selectedRecId) return
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === selectedRecId
          ? {
              ...r,
              businessValue: `₹${modifyValue.toFixed(2)}L`,
              expectedROI: `${modifyROI.toFixed(1)}%`,
            }
          : r
      )
    )
    toast.success(
      'Allocation Modified',
      `Custom values updated: allocation ₹${modifyValue}L, expected ROI ${modifyROI}%.`
    )
    closeModal()
  }

  // Schedule Modal Submit
  const handleScheduleSubmit = () => {
    if (!selectedRecId || !scheduleDateText) return
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === selectedRecId
          ? { ...r, status: 'Scheduled', scheduledDate: scheduleDateText }
          : r
      )
    )
    toast.info(
      'Delivery Scheduled',
      `Campaign scheduled for delivery on ${scheduleDateText}.`
    )
    closeModal()
  }

  const openModal = (id: string, type: 'modify' | 'reject' | 'schedule') => {
    const rec = recommendations.find((r) => r.id === id)
    if (!rec) return
    setSelectedRecId(id)
    setModalType(type)

    if (type === 'modify') {
      const valLakhs = parseFloat(rec.businessValue.replace(/[^\d.]/g, ''))
      setModifyValue(isNaN(valLakhs) ? 50 : valLakhs)
      setModifyROI(parseFloat(rec.expectedROI))
    } else if (type === 'reject') {
      setRejectReasonText('')
    } else if (type === 'schedule') {
      setScheduleDateText('')
    }
  }

  const closeModal = () => {
    setSelectedRecId(null)
    setModalType('none')
  }

  // 3. Filter recommendations list
  const filteredRecs = recommendations.filter((r) => {
    if (activeTab === 'All') return true
    return r.status === activeTab
  })

  return (
    <div className="space-y-6 relative">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-content md:text-3xl">
          Recommendation <span className="text-gradient-sbi">Advisory Center</span>
        </h1>
        <p className="text-sm text-content-muted">
          Approve target alternate asset allocations, modify funding limits, or defer campaigns schedule.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border border-line bg-surface/30 p-1.5 rounded-2xl gap-2 overflow-x-auto">
        {(['All', 'Pending', 'Approved', 'Rejected', 'Scheduled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'py-2 px-4 rounded-xl text-xs font-semibold tracking-tight transition-all whitespace-nowrap',
              activeTab === tab
                ? 'bg-surface shadow-elev-1 text-content border border-line'
                : 'text-content-muted hover:text-content'
            )}
          >
            {tab} {tab === 'All' ? '' : `(${recommendations.filter((r) => r.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredRecs.map((rec) => (
          <GlassPanel
            key={rec.id}
            variant="glass"
            padding="lg"
            className="flex flex-col justify-between border border-line rounded-[2rem] hover:border-sbi-300 transition-all duration-300"
          >
            <div className="space-y-4">
              {/* Header: Client & Segment */}
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <h3 className="font-display font-bold text-base text-content leading-tight">{rec.title}</h3>
                  <span className="text-[10px] text-content-subtle block mt-0.5">
                    Client: <span className="font-semibold text-content">{rec.clientName}</span> ({rec.clientSegment})
                  </span>
                </div>
                <Badge variant={rec.status === 'Approved' ? 'success' : rec.status === 'Rejected' ? 'danger' : rec.status === 'Scheduled' ? 'warning' : 'brand'}>
                  {rec.status}
                </Badge>
              </div>

              {/* Grid values */}
              <div className="grid grid-cols-2 gap-3.5 text-xs border-b border-line pb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Recommended Allocation</span>
                  <span className="font-mono text-content font-bold text-sm">{rec.businessValue} AUM</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Target expected ROI</span>
                  <span className="font-mono text-content font-bold text-sm">{rec.expectedROI} p.a.</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-content-subtle uppercase tracking-wider block">AI Confidence Score</span>
                  <span className="font-mono text-sbi-600 dark:text-sbi-400 font-bold text-sm">{rec.confidence}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Intent Readiness Score</span>
                  <span className="font-mono text-content font-bold text-sm">{rec.readinessScore}%</span>
                </div>
              </div>

              {/* Compliance & Reasoning */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-content-subtle">
                    Compliance: <span className="font-semibold text-content uppercase">{rec.complianceStatus}</span>
                  </span>
                </div>
                <div className="p-3 bg-surface-raised border border-line rounded-xl space-y-1.5">
                  <span className="font-semibold text-content block text-[11px] leading-tight">AI Reasoning explanation:</span>
                  <p className="text-content-muted leading-relaxed text-[11px]">{rec.reasoning}</p>
                </div>
                <div className="text-[10px] text-content-subtle leading-tight truncate">
                  <span className="font-bold uppercase tracking-wider">Evidence: </span> {rec.supportingEvidence}
                </div>

                {/* Rejected Reason Log */}
                {rec.status === 'Rejected' && rec.rejectedReason && (
                  <div className="flex items-start gap-1.5 p-2.5 rounded-xl border border-danger/25 bg-danger/5 text-3xs text-danger mt-2">
                    <AlertCircle className="h-4.5 w-4.5 text-danger shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Rejection compliance log:</span>
                      <p className="mt-0.5 leading-normal">{rec.rejectedReason}</p>
                    </div>
                  </div>
                )}

                {/* Scheduled Date Log */}
                {rec.status === 'Scheduled' && rec.scheduledDate && (
                  <div className="flex items-center gap-1.5 p-2.5 rounded-xl border border-warning/25 bg-warning/5 text-3xs text-warning mt-2">
                    <Clock className="h-4 w-4 text-warning shrink-0" />
                    <div>
                      <span>Scheduled Dispatch on: <span className="font-bold">{rec.scheduledDate}</span></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons footer */}
            {rec.status === 'Pending' && (
              <div className="grid grid-cols-2 gap-2 pt-5 border-t border-line mt-5">
                <div className="flex gap-2 col-span-2 sm:col-span-1">
                  <Button
                    variant="outline"
                    className="flex-1 h-9.5 text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl"
                    onClick={() => openModal(rec.id, 'modify')}
                  >
                    <Edit className="h-3.5 w-3.5" /> Modify
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-9.5 text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl text-warning hover:text-warning"
                    onClick={() => openModal(rec.id, 'schedule')}
                  >
                    <Calendar className="h-3.5 w-3.5" /> Schedule
                  </Button>
                </div>
                <div className="flex gap-2 col-span-2 sm:col-span-1">
                  <Button
                    variant="outline"
                    className="flex-1 h-9.5 text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl text-danger hover:text-danger"
                    onClick={() => openModal(rec.id, 'reject')}
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 h-9.5 text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl"
                    onClick={() => handleApprove(rec.id, rec.clientName, rec.title)}
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </Button>
                </div>

                {/* Explainability route link */}
                <div className="col-span-2 text-center pt-2">
                  <Link to="/reasoning" className="inline-flex items-center gap-1 text-[10px] text-content-subtle hover:text-sbi-600 transition-colors uppercase tracking-wider font-bold">
                    <Eye className="h-3.5 w-3.5" /> Explain Decision Pipeline <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}
          </GlassPanel>
        ))}

        {filteredRecs.length === 0 && (
          <div className="col-span-2 py-16 text-center text-sm text-content-muted bg-surface/20 rounded-[2rem] border border-line">
            No advisory recommendations found matching the selection criteria.
          </div>
        )}
      </div>

      {/* 4. MODALS OVERLAYS */}
      {modalType !== 'none' && activeRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <GlassPanel
            variant="glass"
            padding="lg"
            className="w-full max-w-md border border-line rounded-3xl space-y-6 relative shadow-elev-3 animate-slide-up"
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-content-subtle hover:text-content cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modify Modal */}
            {modalType === 'modify' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-display font-bold text-base text-content">Modify alternate allocation</h3>
                <p className="text-content-muted">Adjust campaign AUM funding caps and expected yield margins.</p>
                
                {/* Allocation slider */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-content-subtle">Recommended Allocation (AUM)</span>
                    <span className="font-mono text-content">₹{modifyValue}L</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    value={modifyValue}
                    onChange={(e) => setModifyValue(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer bg-line rounded-lg accent-sbi-500"
                  />
                  <div className="flex justify-between text-3xs text-content-subtle">
                    <span>₹5L</span>
                    <span>₹2.0Cr limit</span>
                  </div>
                </div>

                {/* ROI input */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-content-subtle">Expected yield margin (ROI)</span>
                    <span className="font-mono text-content">{modifyROI.toFixed(1)}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="25"
                    step="0.1"
                    value={modifyROI}
                    onChange={(e) => setModifyROI(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer bg-line rounded-lg accent-sbi-500"
                  />
                  <div className="flex justify-between text-3xs text-content-subtle">
                    <span>4.0%</span>
                    <span>25.0% cap</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1 h-10 rounded-xl" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1 h-10 rounded-xl" onClick={handleModifySubmit}>
                    Save Allocation
                  </Button>
                </div>
              </div>
            )}

            {/* Reject Modal */}
            {modalType === 'reject' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-display font-bold text-base text-content">Reject Recommendation</h3>
                <p className="text-content-muted">Compliance guidelines require a reasoning explanation log before rejecting advisor proposals.</p>
                <textarea
                  placeholder="State rejection reason (e.g. client requested capital conservation)..."
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  className="w-full h-24 p-3 rounded-xl border border-line bg-surface/50 text-content outline-none focus:border-danger transition-all resize-none"
                />
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 h-10 rounded-xl" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 h-10 rounded-xl bg-danger hover:bg-danger-hover border-none"
                    disabled={!rejectReasonText.trim()}
                    onClick={handleRejectSubmit}
                  >
                    Reject Proposal
                  </Button>
                </div>
              </div>
            )}

            {/* Schedule Modal */}
            {modalType === 'schedule' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-display font-bold text-base text-content">Schedule delivery dispatch</h3>
                <p className="text-content-muted">Choose future date coordinates to relay advisory recommendations to client mobile tabs.</p>
                <input
                  type="date"
                  value={scheduleDateText}
                  onChange={(e) => setScheduleDateText(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-line bg-surface/50 text-content outline-none focus:border-sbi-400 transition-all font-mono"
                />
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1 h-10 rounded-xl" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1 h-10 rounded-xl" disabled={!scheduleDateText} onClick={handleScheduleSubmit}>
                    Confirm Schedule
                  </Button>
                </div>
              </div>
            )}
          </GlassPanel>
        </div>
      )}
    </div>
  )
}

export default Recommendations
