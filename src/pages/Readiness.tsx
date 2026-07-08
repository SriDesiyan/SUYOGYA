import { useState } from 'react'
import {
  TrendingUp,
  Award,
  ShieldCheck,
  Activity,
  Compass,
  Layers,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Zap,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { Button, Badge, GlassPanel, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@/components/ui'
import { ReadinessSphere3D } from '@/components/3d/ReadinessSphere3D'
import { cn } from '@/lib/utils'

// ----------------------------------------------------
// Mock Clients readiness scores & node parameters
// ----------------------------------------------------
interface NodeDetail {
  label: string
  score: number
  desc: string
  subParameters: { name: string; value: string; rating: number }[]
  alert?: string
}

interface ClientReadiness {
  id: string
  name: string
  segment: 'HNI' | 'Affluent'
  readiness: number
  aum: string
  nodes: Record<string, NodeDetail>
}

const mockClientsReadiness: ClientReadiness[] = [
  {
    id: 'client-1',
    name: 'Kabir Rao',
    segment: 'HNI',
    readiness: 92,
    aum: '₹3.4Cr',
    nodes: {
      behavior: {
        label: 'Financial Behaviour',
        score: 95,
        desc: 'Cash flow velocity and debit consistency signals.',
        subParameters: [
          { name: 'Inflow Velocity consistency', value: 'High stability', rating: 98 },
          { name: 'Average Transaction limits', value: '₹12.4L', rating: 92 },
          { name: 'Debt Servicing Index', value: '0.12 ratio', rating: 94 },
        ],
        alert: 'Large corporate venture liquidation payout detected (+₹1.2Cr).',
      },
      eligibility: {
        label: 'Eligibility',
        score: 90,
        desc: 'Credit check approvals and product match limits.',
        subParameters: [
          { name: 'Approved Portfolio Leverage limit', value: '₹85L', rating: 90 },
          { name: 'Wealth Matching compatibility', value: 'PMS Equity match', rating: 95 },
        ],
      },
      risk: {
        label: 'Risk Profile',
        score: 85,
        desc: 'Institutional risk indices and portfolio volatility.',
        subParameters: [
          { name: 'Credit Score verification', value: '812 index', rating: 96 },
          { name: 'Volatility margin exposure', value: 'Conservative', rating: 88 },
        ],
      },
      engagement: {
        label: 'Engagement',
        score: 92,
        desc: 'Mobile App actions and advisory responsiveness.',
        subParameters: [
          { name: 'App login frequency', value: 'Weekly check-in', rating: 88 },
          { name: 'Advisory email open rates', value: '94% open', rating: 94 },
        ],
      },
      goals: {
        label: 'Goals',
        score: 78,
        desc: 'Savings thresholds and portfolio rebalancing requirements.',
        subParameters: [
          { name: 'Retirement pool gap status', value: '88% funded', rating: 80 },
          { name: 'Alternate assets target mix', value: '₹45L shortfall', rating: 72 },
        ],
      },
      lifestage: {
        label: 'Life Stage',
        score: 88,
        desc: 'Age demographics and corporate career milestones.',
        subParameters: [
          { name: 'Corporate exit proximity index', value: 'Venture liquidate', rating: 92 },
          { name: 'Estate trust creation spark', value: 'High spark', rating: 84 },
        ],
      },
      compliance: {
        label: 'Compliance',
        score: 98,
        desc: 'Anti-money laundering check and corporate audits.',
        subParameters: [
          { name: 'AML verification checks', value: 'Passed', rating: 100 },
          { name: 'KYC registration updates', value: 'Up to date', rating: 96 },
        ],
      },
      confidence: {
        label: 'Model Confidence',
        score: 87,
        desc: 'Agentic AI model scoring reliability parameters.',
        subParameters: [
          { name: 'Signal verification index', value: '92% verified', rating: 92 },
          { name: 'Vector regression certainty', value: '85% confidence', rating: 85 },
        ],
      },
      evidence: {
        label: 'Evidence Quality',
        score: 91,
        desc: 'Reliability parameters supporting intent models.',
        subParameters: [
          { name: 'Cash ledger points checked', value: '5 verified data points', rating: 98 },
          { name: 'External agency validations', value: '3 verified points', rating: 84 },
        ],
      },
    },
  },
  {
    id: 'client-2',
    name: 'Aarav Mehta',
    segment: 'HNI',
    readiness: 87,
    aum: '₹1.2Cr',
    nodes: {
      behavior: {
        label: 'Financial Behaviour',
        score: 88,
        desc: 'Cash flow velocity and debit consistency signals.',
        subParameters: [
          { name: 'Inflow Velocity consistency', value: 'Medium stability', rating: 85 },
          { name: 'Average Transaction limits', value: '₹4.5L', rating: 88 },
          { name: 'Debt Servicing Index', value: '0.24 ratio', rating: 82 },
        ],
      },
      eligibility: {
        label: 'Eligibility',
        score: 84,
        desc: 'Credit check approvals and product match limits.',
        subParameters: [
          { name: 'Approved Portfolio Leverage limit', value: '₹40L', rating: 80 },
          { name: 'Wealth Matching compatibility', value: 'VC pool match', rating: 88 },
        ],
      },
      risk: {
        label: 'Risk Profile',
        score: 68,
        desc: 'Institutional risk indices and portfolio volatility.',
        subParameters: [
          { name: 'Credit Score verification', value: '740 index', rating: 78 },
          { name: 'Volatility margin exposure', value: 'Aggressive', rating: 62 },
        ],
        alert: 'Venture capital pool call deadline approaching (High risk exposure).',
      },
      engagement: {
        label: 'Engagement',
        score: 90,
        desc: 'Mobile App actions and advisory responsiveness.',
        subParameters: [
          { name: 'App login frequency', value: 'Daily checks', rating: 94 },
          { name: 'Advisory email open rates', value: '68% open', rating: 68 },
        ],
      },
      goals: {
        label: 'Goals',
        score: 82,
        desc: 'Savings thresholds and portfolio rebalancing requirements.',
        subParameters: [
          { name: 'Retirement pool gap status', value: '64% funded', rating: 78 },
          { name: 'Alternate assets target mix', value: 'Aligned', rating: 86 },
        ],
      },
      lifestage: {
        label: 'Life Stage',
        score: 85,
        desc: 'Age demographics and corporate career milestones.',
        subParameters: [
          { name: 'Corporate exit proximity index', value: 'Active board member', rating: 88 },
          { name: 'Estate trust creation spark', value: 'Medium spark', rating: 72 },
        ],
      },
      compliance: {
        label: 'Compliance',
        score: 96,
        desc: 'Anti-money laundering check and corporate audits.',
        subParameters: [
          { name: 'AML verification checks', value: 'Passed', rating: 98 },
          { name: 'KYC registration updates', value: 'Up to date', rating: 94 },
        ],
      },
      confidence: {
        label: 'Model Confidence',
        score: 84,
        desc: 'Agentic AI model scoring reliability parameters.',
        subParameters: [
          { name: 'Signal verification index', value: '88% verified', rating: 88 },
          { name: 'Vector regression certainty', value: '80% confidence', rating: 80 },
        ],
      },
      evidence: {
        label: 'Evidence Quality',
        score: 82,
        desc: 'Reliability parameters supporting intent models.',
        subParameters: [
          { name: 'Cash ledger points checked', value: '3 verified data points', rating: 84 },
          { name: 'External agency validations', value: '2 verified points', rating: 80 },
        ],
      },
    },
  },
  {
    id: 'client-4',
    name: 'Diya Sharma',
    segment: 'Affluent',
    readiness: 64,
    aum: '₹45L',
    nodes: {
      behavior: {
        label: 'Financial Behaviour',
        score: 65,
        desc: 'Cash flow velocity and debit consistency signals.',
        subParameters: [
          { name: 'Inflow Velocity consistency', value: 'Low stability', rating: 60 },
          { name: 'Average Transaction limits', value: '₹1.2L', rating: 68 },
          { name: 'Debt Servicing Index', value: '0.35 ratio', rating: 64 },
        ],
      },
      eligibility: {
        label: 'Eligibility',
        score: 72,
        desc: 'Credit check approvals and product match limits.',
        subParameters: [
          { name: 'Approved Portfolio Leverage limit', value: '₹15L', rating: 70 },
          { name: 'Wealth Matching compatibility', value: 'Home Loan match', rating: 74 },
        ],
      },
      risk: {
        label: 'Risk Profile',
        score: 74,
        desc: 'Institutional risk indices and portfolio volatility.',
        subParameters: [
          { name: 'Credit Score verification', value: '710 index', rating: 74 },
          { name: 'Volatility margin exposure', value: 'Moderate', rating: 72 },
        ],
      },
      engagement: {
        label: 'Engagement',
        score: 70,
        desc: 'Mobile App actions and advisory responsiveness.',
        subParameters: [
          { name: 'App login frequency', value: 'Weekly check-in', rating: 70 },
          { name: 'Advisory email open rates', value: '85% open', rating: 85 },
        ],
      },
      goals: {
        label: 'Goals',
        score: 60,
        desc: 'Savings thresholds and portfolio rebalancing requirements.',
        subParameters: [
          { name: 'Retirement pool gap status', value: '45% funded', rating: 60 },
          { name: 'Alternate assets target mix', value: 'Home acquisition spark', rating: 80 },
        ],
        alert: 'Home loan pre-approval request rejected previously.',
      },
      lifestage: {
        label: 'Life Stage',
        score: 78,
        desc: 'Age demographics and corporate career milestones.',
        subParameters: [
          { name: 'Corporate exit proximity index', value: 'Inactive business expansion', rating: 72 },
          { name: 'Estate trust creation spark', value: 'High real-estate spark', rating: 84 },
        ],
      },
      compliance: {
        label: 'Compliance',
        score: 92,
        desc: 'Anti-money laundering check and corporate audits.',
        subParameters: [
          { name: 'AML verification checks', value: 'Passed', rating: 92 },
          { name: 'KYC registration updates', value: 'Up to date', rating: 92 },
        ],
      },
      confidence: {
        label: 'Model Confidence',
        score: 68,
        desc: 'Agentic AI model scoring reliability parameters.',
        subParameters: [
          { name: 'Signal verification index', value: '70% verified', rating: 70 },
          { name: 'Vector regression certainty', value: '65% confidence', rating: 65 },
        ],
      },
      evidence: {
        label: 'Evidence Quality',
        score: 70,
        desc: 'Reliability parameters supporting intent models.',
        subParameters: [
          { name: 'Cash ledger points checked', value: '2 verified data points', rating: 74 },
          { name: 'External agency validations', value: '1 verified point', rating: 64 },
        ],
      },
    },
  },
]

export function Readiness() {
  const toast = useToast()
  const [selectedClientId, setSelectedClientId] = useState('client-1')
  const [activeNodeKey, setActiveNodeKey] = useState<string | null>(null)

  const activeClient = mockClientsReadiness.find((c) => c.id === selectedClientId) || mockClientsReadiness[0]

  // Radial node keys map (9 items forming the circle)
  const nodeKeys = [
    { key: 'behavior', icon: TrendingUp },
    { key: 'eligibility', icon: Award },
    { key: 'risk', icon: ShieldCheck },
    { key: 'engagement', icon: Activity },
    { key: 'goals', icon: Compass },
    { key: 'lifestage', icon: Layers },
    { key: 'compliance', icon: CheckCircle2 },
    { key: 'confidence', icon: Sparkles },
    { key: 'evidence', icon: HelpCircle },
  ]

  const activeNode = activeNodeKey ? activeClient.nodes[activeNodeKey] : null

  // SVG lines math: center is 230px, radius is 190px
  const centerCoord = 230
  const radius = 190

  const getLineCoordinates = (idx: number) => {
    // 9 items forming the circle (rotate 360 / 9)
    const angle = (idx * 2 * Math.PI) / 9 - Math.PI / 2 // offset by -90deg so index 0 starts at top center
    const x = centerCoord + radius * Math.cos(angle)
    const y = centerCoord + radius * Math.sin(angle)
    return { x, y }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header controls & client selector */}
      <GlassPanel variant="glass" padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-content md:text-2xl">
            Customer <span className="text-gradient-sbi">Readiness Engine</span>
          </h1>
          <p className="text-3xs text-content-muted">
            Auditing 9 vector dimensions calculating intent triggers. Select client to update models.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-content-subtle">Audit Client:</span>
          <div className="flex items-center gap-1.5 border border-line bg-surface/50 px-3 py-1.5 rounded-xl text-xs">
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value)
                setActiveNodeKey(null)
              }}
              className="bg-transparent text-content font-bold outline-none cursor-pointer"
            >
              {mockClientsReadiness.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.readiness}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassPanel>

      {/* 2. Visual Canvas Split */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Radial Radar visual panel */}
        <div className="lg:col-span-8 flex justify-center items-center p-6 bg-canvas/30 rounded-3xl border border-line overflow-hidden min-h-[500px]">
          {/* Main Relative Shell */}
          <div className="relative w-[460px] h-[460px] flex items-center justify-center">
            {/* SVG flows background */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2f6bf5" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1a4fd6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              {nodeKeys.map((item, idx) => {
                const { x, y } = getLineCoordinates(idx)
                const isFocused = activeNodeKey === item.key
                return (
                  <line
                    key={idx}
                    x1={x}
                    y1={y}
                    x2={centerCoord}
                    y2={centerCoord}
                    stroke={isFocused ? '#3b82f6' : 'url(#flowGrad)'}
                    strokeWidth={isFocused ? '2.5' : '1.5'}
                    strokeDasharray="6,6"
                    className="animate-dash-flow"
                    style={{
                      // speed up animated particles flow on node focus
                      animationDuration: isFocused ? '0.8s' : '1.8s',
                    }}
                  />
                )
              })}
            </svg>

            {/* Central 3D Canvas Readiness Sphere */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] z-10 pointer-events-none">
              <ReadinessSphere3D score={activeClient.readiness} activeNodeId={activeNodeKey} />
              {/* Inner score overlay card */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-bold text-content-subtle uppercase tracking-widest leading-none">READINESS</span>
                <span className="font-display text-4xl font-extrabold text-content mt-1 tabular-nums font-mono">
                  {activeClient.readiness}%
                </span>
                <Badge variant={activeClient.readiness >= 80 ? 'success' : 'brand'} className="mt-1 text-[9px] py-0">
                  {activeClient.readiness >= 80 ? 'HIGH TRIGGER' : 'MONITORING'}
                </Badge>
              </div>
            </div>

            {/* Radial Nodes mapping */}
            {nodeKeys.map((item, idx) => {
              const nodeData = activeClient.nodes[item.key]
              const Icon = item.icon
              const isSelected = activeNodeKey === item.key

              // Radial spacing CSS transform angles
              const angleDeg = (idx * 360) / 9 - 90

              return (
                <button
                  key={item.key}
                  onClick={() => setActiveNodeKey(isSelected ? null : item.key)}
                  style={{
                    transform: `rotate(${angleDeg}deg) translate(${radius}px) rotate(${-angleDeg}deg)`,
                  }}
                  className={cn(
                    'absolute w-[114px] p-2 rounded-xl border bg-surface/85 backdrop-blur shadow-inner-glass cursor-pointer transition-all duration-300 text-left flex items-center gap-2 group z-20 hover:scale-105',
                    isSelected
                      ? 'border-sbi-500 ring-2 ring-sbi-500/15 shadow-glow-sbi'
                      : 'border-line hover:border-ink-300',
                  )}
                >
                  <div
                    className={cn(
                      'h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                      isSelected
                        ? 'bg-sbi-100 text-sbi-600 dark:bg-sbi-950/40 dark:text-sbi-400'
                        : 'bg-ink-100 text-content-subtle dark:bg-ink-900 group-hover:text-content',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-content leading-tight truncate">
                      {nodeData.label}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-content-muted block mt-0.5 leading-none">
                      {nodeData.score}%
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Sidebar parameters drawer */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="solid" className="min-h-[500px] flex flex-col justify-between">
            <CardHeader className="border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4.5 w-4.5 text-sbi-500" />
                <CardTitle>Vector Dimension audit</CardTitle>
              </div>
              <CardDescription>
                {activeNode ? 'Detailed parameters verification data.' : 'Select any orbital node to verify calibration details.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between">
              {activeNode ? (
                <div className="space-y-6">
                  {/* Title & Score block */}
                  <div className="flex justify-between items-center bg-surface-raised p-3 rounded-xl border border-line">
                    <div>
                      <h4 className="font-display font-bold text-sm text-content">{activeNode.label}</h4>
                      <p className="text-3xs text-content-subtle mt-0.5">{activeNode.desc}</p>
                    </div>
                    <Badge variant="brand" className="text-sm font-mono">{activeNode.score}%</Badge>
                  </div>

                  {/* Subparameters progress meters */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-content-subtle">Dimension Sub-parameters</h5>
                    {activeNode.subParameters.map((sub, idx) => (
                      <div key={idx} className="space-y-1.5 bg-surface/30 p-2.5 rounded-xl border border-line text-xs">
                        <div className="flex justify-between font-medium">
                          <span className="text-content">{sub.name}</span>
                          <span className="text-content-muted font-mono">{sub.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-line rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-sbi-600" style={{ width: `${sub.rating}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Warnings/Alerts if applicable */}
                  {activeNode.alert && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl border border-danger/25 bg-danger/5 text-xs">
                      <ShieldAlert className="h-4.5 w-4.5 text-danger shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-content block">Model trigger alert</span>
                        <p className="text-3xs text-content-muted mt-0.5 leading-normal">{activeNode.alert}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-content-subtle py-20">
                  <Compass className="h-12 w-12 text-content-subtle mb-3 animate-pulse" />
                  <span className="text-xs font-semibold">Select orbital node parameter card</span>
                  <p className="text-3xs text-content-muted max-w-xs mt-1 leading-normal">
                    Click any surrounding parameter card (e.g. Financial Behaviour, Risk) to reveal specific database indexes.
                  </p>
                </div>
              )}

              {/* Complete Campaign launcher */}
              {activeNodeKey && (
                <div className="pt-6 border-t border-line mt-6">
                  <Button
                    variant="primary"
                    className="w-full h-10 flex items-center justify-center gap-2"
                    onClick={() => {
                      toast.success(
                        'Campaign Generated',
                        `Orchestrated targets for ${activeClient.name} utilizing verified ${activeNode?.label} index vectors.`,
                      )
                    }}
                  >
                    Execute Campaign action <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Connection flows css helper keyframes */}
      <style>{`
        @keyframes dashFlow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-dash-flow {
          animation: dashFlow 1.8s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default Readiness
