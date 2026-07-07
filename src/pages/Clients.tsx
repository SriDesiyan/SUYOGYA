import { useState, useEffect, useRef } from 'react'
import {
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  CreditCard,
  TrendingUp,
  Award,
  Users,
  Clock,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
} from 'lucide-react'
import { Button, Badge, GlassPanel, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { ClientAvatar3D } from '@/components/3d/ClientAvatar3D'
import { cn } from '@/lib/utils'
import gsap from 'gsap'
import Lenis from 'lenis'

// ----------------------------------------------------
// Mock High-Fidelity Client Schema
// ----------------------------------------------------
interface ClientDetail {
  id: string
  name: string
  email: string
  segment: 'HNI' | 'Affluent' | 'Emerging'
  risk: 'Low' | 'Medium' | 'High'
  readiness: number
  aum: string
  location: string
  phone: string
  assignedRM: string
  portfolio: { product: string; balance: string; change: string }[]
  timeline: { date: string; title: string; category: string; amount?: string; type: 'credit' | 'debit' | 'info' }[]
  lifeEvents: { date: string; title: string; type: string; impact: string }[]
  behavior: { action: string; score: number; trend: 'up' | 'down' | 'stable' }[]
  network: { name: string; relation: string; value: string }[]
  evidence: { criteria: string; reliability: number; verified: boolean }[]
  recommendations: { date: string; title: string; status: 'Completed' | 'Pending' | 'Rejected' }[]
}

const mockClients: ClientDetail[] = [
  {
    id: 'client-1',
    name: 'Kabir Rao',
    email: 'k.rao@outlook.com',
    segment: 'HNI',
    risk: 'Medium',
    readiness: 92,
    aum: '₹3.4Cr',
    location: 'Mumbai Central, MH',
    phone: '+91 98200 45120',
    assignedRM: 'Sri Desiyan',
    portfolio: [
      { product: 'SBI PMS Bluechip Equity', balance: '₹1.8Cr', change: '+14.2%' },
      { product: 'SBI Sovereign Gold Bond', balance: '₹85L', change: '+6.8%' },
      { product: 'HDFC Corporate Yield Term Deposit', balance: '₹45L', change: '+7.2%' },
      { product: 'Liquid Gold Reserve Account', balance: '₹30L', change: '0.0%' },
    ],
    timeline: [
      { date: '07 July 2026', title: 'Corporate venture liquidation payout credited', category: 'Inflow', amount: '₹1.2Cr', type: 'credit' },
      { date: '04 July 2026', title: 'Portfolio rebalancing transaction completed', category: 'PMS Allocation', amount: '₹15L', type: 'debit' },
      { date: '28 June 2026', title: 'Real Estate purchase stamp duty processed', category: 'Capital spend', amount: '₹8L', type: 'debit' },
      { date: '15 June 2026', title: 'Advisory re-KYC documentation verified', category: 'System Audit', type: 'info' },
    ],
    lifeEvents: [
      { date: 'Q2 2026', title: 'Startup Equity Exit Liquidity', type: 'Wealth Spark', impact: 'High' },
      { date: 'Q3 2026', title: 'Family Trust Creation Request', type: 'Estate Planning', impact: 'Medium' },
    ],
    behavior: [
      { action: 'Portfolio Dashboard logins', score: 88, trend: 'up' },
      { action: 'Advisory Email open rate', score: 94, trend: 'up' },
      { action: 'Call response latency', score: 72, trend: 'stable' },
    ],
    network: [
      { name: 'Rao Industrial Holdings', relation: 'Family Corporate Entity', value: '₹12.4Cr' },
      { name: 'Diya Rao (Spouse)', relation: 'Linked Minor Trust Account', value: '₹45L' },
    ],
    evidence: [
      { criteria: 'Direct bank statement credit ledger', reliability: 98, verified: true },
      { criteria: 'Interactive wealth platform clicks', reliability: 85, verified: true },
      { criteria: 'KYC corporate registry status', reliability: 90, verified: true },
    ],
    recommendations: [
      { date: '05 July 2026', title: 'PMS Allocation Expansion campaign', status: 'Completed' },
      { date: '29 June 2026', title: 'Tax Yield Lock-in Advisory', status: 'Pending' },
    ],
  },
  {
    id: 'client-2',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@corporate.in',
    segment: 'HNI',
    risk: 'High',
    readiness: 87,
    aum: '₹1.2Cr',
    location: 'Bengaluru Tech Corridor, KA',
    phone: '+91 80496 23150',
    assignedRM: 'Sri Desiyan',
    portfolio: [
      { product: 'SBI Tech Advisory Mutual Fund', balance: '₹60L', change: '+22.4%' },
      { product: 'Venture Capital Pool Series B', balance: '₹40L', change: '+12.5%' },
      { product: 'Direct Equity Segment Ledger', balance: '₹20L', change: '-4.8%' },
    ],
    timeline: [
      { date: '05 July 2026', title: 'Dividend payout credit', category: 'Inflow', amount: '₹4.5L', type: 'credit' },
      { date: '30 June 2026', title: 'Series B VC call processed', category: 'Venture Spend', amount: '₹10L', type: 'debit' },
      { date: '20 June 2026', title: 'High-frequency trades review executed', category: 'Brokerage', type: 'info' },
    ],
    lifeEvents: [
      { date: 'Q1 2026', title: 'Corporate Board Seat appointment', type: 'Employment', impact: 'Medium' },
      { date: 'Q4 2026', title: 'Venture pool capital call deadline', type: 'Funding Lock', impact: 'High' },
    ],
    behavior: [
      { action: 'Portfolio Dashboard logins', score: 92, trend: 'up' },
      { action: 'Advisory Email open rate', score: 68, trend: 'down' },
      { action: 'Call response latency', score: 85, trend: 'up' },
    ],
    network: [
      { name: 'Mehta Tech Holdings Ltd', relation: 'Core Venture Entity', value: '₹48.2Cr' },
    ],
    evidence: [
      { criteria: 'Demographics asset valuation reports', reliability: 74, verified: true },
      { criteria: 'Corporate exchange registry checks', reliability: 92, verified: true },
    ],
    recommendations: [
      { date: '02 July 2026', title: 'Venture Liquidity lock-in options', status: 'Pending' },
    ],
  },
  {
    id: 'client-3',
    name: 'Ishaan Roy',
    email: 'ishaan.roy@consult.co.in',
    segment: 'Affluent',
    risk: 'Low',
    readiness: 78,
    aum: '₹85L',
    location: 'Salt Lake Sector V, WB',
    phone: '+91 33451 98450',
    assignedRM: 'Sri Desiyan',
    portfolio: [
      { product: 'SBI Conservative Debt Fund', balance: '₹55L', change: '+5.4%' },
      { product: 'Corporate Term Deposits', balance: '₹20L', change: '+6.1%' },
      { product: 'Tax Saver ELSS Account', balance: '₹10L', change: '+8.9%' },
    ],
    timeline: [
      { date: '06 July 2026', title: 'Quarterly debt interest credit', category: 'Inflow', amount: '₹1.8L', type: 'credit' },
      { date: '25 June 2026', title: 'Tax Saving ELSS SIP transaction', category: 'Investment', amount: '₹50K', type: 'debit' },
    ],
    lifeEvents: [
      { date: 'Q2 2026', title: 'Consultancy firm expansion', type: 'Business Expansion', impact: 'Medium' },
    ],
    behavior: [
      { action: 'Portfolio Dashboard logins', score: 62, trend: 'stable' },
      { action: 'Advisory Email open rate', score: 80, trend: 'up' },
      { action: 'Call response latency', score: 64, trend: 'stable' },
    ],
    network: [
      { name: 'Roy Consulting Group', relation: 'Sole Proprietor Business', value: '₹2.8Cr' },
    ],
    evidence: [
      { criteria: 'Tax return verified filing details', reliability: 95, verified: true },
    ],
    recommendations: [
      { date: '25 June 2026', title: 'Advisory on ELSS limit saturation', status: 'Completed' },
    ],
  },
  {
    id: 'client-4',
    name: 'Diya Sharma',
    email: 'diya.s@hospitality.com',
    segment: 'Affluent',
    risk: 'Medium',
    readiness: 64,
    aum: '₹45L',
    location: 'Defence Colony, DL',
    phone: '+91 11486 32510',
    assignedRM: 'Sri Desiyan',
    portfolio: [
      { product: 'SBI Balanced Advantage Fund', balance: '₹30L', change: '+9.4%' },
      { product: 'Savings Plus Account', balance: '₹15L', change: '+3.5%' },
    ],
    timeline: [
      { date: '01 July 2026', title: 'Cash deposit processed', category: 'Inflow', amount: '₹5L', type: 'credit' },
      { date: '18 June 2026', title: 'Vacation travel debit', category: 'Leisure spend', amount: '₹2.4L', type: 'debit' },
    ],
    lifeEvents: [
      { date: 'Q3 2026', title: 'Real Estate purchase proposal', type: 'Acquisition', impact: 'High' },
    ],
    behavior: [
      { action: 'Portfolio Dashboard logins', score: 70, trend: 'stable' },
      { action: 'Advisory Email open rate', score: 85, trend: 'up' },
      { action: 'Call response latency', score: 52, trend: 'down' },
    ],
    network: [
      { name: 'Sharma Luxury Stays', relation: 'Family Partner Entity', value: '₹5.5Cr' },
    ],
    evidence: [
      { criteria: 'Real estate registry check filings', reliability: 80, verified: true },
    ],
    recommendations: [
      { date: '20 June 2026', title: 'Home loan pre-approval campaign', status: 'Rejected' },
    ],
  },
]

export function Clients() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [segmentFilter, setSegmentFilter] = useState<'All' | 'HNI' | 'Affluent' | 'Emerging'>('All')
  const [riskFilter, setRiskFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All')
  const [activeTab, setActiveTab] = useState<'finance' | 'sparks' | 'network'>('finance')

  const detailContainerRef = useRef<HTMLDivElement>(null)

  // Initialize Lenis scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => {
      lenis.destroy()
    }
  }, [])

  // Trigger timeline slide animations when detail page opens / tab changes
  useEffect(() => {
    if (selectedClientId && detailContainerRef.current) {
      const items = detailContainerRef.current.querySelectorAll('.timeline-reveal')
      gsap.fromTo(
        items,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
      )
    }
  }, [selectedClientId, activeTab])

  // Filters logic
  const filteredClients = mockClients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSegment = segmentFilter === 'All' || c.segment === segmentFilter
    const matchesRisk = riskFilter === 'All' || c.risk === riskFilter
    return matchesSearch && matchesSegment && matchesRisk
  })

  const selectedClient = mockClients.find((c) => c.id === selectedClientId)

  return (
    <div className="space-y-6">
      {/* 1. Dashboard Title */}
      {!selectedClientId ? (
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-content md:text-3xl">
            Customer <span className="text-gradient-sbi">Intelligence Directory</span>
          </h1>
          <p className="text-sm text-content-muted">
            Search clients profiles, review digital behavioral vectors, and execute target wealth campaigns.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedClientId(null)}
            className="h-9.5 w-9.5 rounded-xl text-content-muted hover:text-content"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-content md:text-2xl">
              Client Profile: <span className="text-gradient-sbi">{selectedClient?.name}</span>
            </h1>
            <p className="text-xs text-content-muted">
              Vector Database ID: {selectedClient?.id} • Assigned RM: {selectedClient?.assignedRM}
            </p>
          </div>
        </div>
      )}

      {/* 2. Main content segment split */}
      {!selectedClientId ? (
        <div className="space-y-6">
          {/* Search bar & filter controls */}
          <GlassPanel variant="glass" padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-content-subtle" />
              <input
                type="text"
                placeholder="Search clients by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-line bg-surface/75 text-sm text-content outline-none focus:border-sbi-400 focus:ring-4 focus:ring-sbi-500/12 transition-all shadow-inner-glass"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 border border-line bg-surface/50 px-3 py-1.5 rounded-xl text-xs">
                <Filter className="h-3.5 w-3.5 text-content-subtle" />
                <span className="font-medium text-content-subtle">Segment:</span>
                <select
                  value={segmentFilter}
                  onChange={(e) => setSegmentFilter(e.target.value as 'All' | 'HNI' | 'Affluent' | 'Emerging')}
                  className="bg-transparent text-content font-bold outline-none cursor-pointer"
                >
                  <option value="All">All Segments</option>
                  <option value="HNI">HNI clients</option>
                  <option value="Affluent">Affluent pool</option>
                  <option value="Emerging">Emerging</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 border border-line bg-surface/50 px-3 py-1.5 rounded-xl text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-content-subtle" />
                <span className="font-medium text-content-subtle">Risk:</span>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as 'All' | 'Low' | 'Medium' | 'High')}
                  className="bg-transparent text-content font-bold outline-none cursor-pointer"
                >
                  <option value="All">All Risks</option>
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                </select>
              </div>
            </div>
          </GlassPanel>

          {/* Listings loop */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredClients.map((client) => (
              <GlassPanel
                key={client.id}
                variant="glass"
                padding="md"
                interactive
                onClick={() => setSelectedClientId(client.id)}
                className="flex flex-col justify-between h-48 border border-line hover:border-sbi-300"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant={client.segment === 'HNI' ? 'brand' : 'success'}>{client.segment}</Badge>
                    <span className="font-mono text-3xs font-bold text-content-subtle">L:{client.location.split(',')[0]}</span>
                  </div>
                  <h3 className="font-display font-semibold text-content text-base leading-tight mt-1">{client.name}</h3>
                  <p className="text-3xs text-content-muted leading-tight truncate">{client.email}</p>
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-line mt-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Portfolio AUM</span>
                    <span className="font-mono text-xs font-bold text-content">{client.aum}</span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Readiness score</span>
                    <span className="font-mono text-xs font-bold text-sbi-600 dark:text-sbi-400">{client.readiness}%</span>
                  </div>
                </div>
              </GlassPanel>
            ))}

            {filteredClients.length === 0 && (
              <div className="col-span-4 py-16 text-center text-sm text-content-muted bg-surface/20 rounded-3xl border border-line">
                No clients match current filters query parameters.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Detailed Client Profile Cockpit */
        <div ref={detailContainerRef} className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Demographics & 3D Avatar */}
          <div className="lg:col-span-4 space-y-6">
            <Card variant="solid">
              <CardHeader className="flex flex-col items-center text-center pb-4 border-b border-line">
                {/* 3D Interactive Client Profile Vector */}
                <div className="h-56 w-full rounded-2xl overflow-hidden border border-line bg-canvas/30 mb-4 relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="brand" dot className="bg-white/95 dark:bg-black/85">3D SIGNAL VECTOR</Badge>
                  </div>
                  <ClientAvatar3D segment={selectedClient?.segment} />
                </div>

                <CardTitle className="text-lg font-bold">{selectedClient?.name}</CardTitle>
                <CardDescription className="text-xs">{selectedClient?.email}</CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant={selectedClient?.segment === 'HNI' ? 'brand' : 'success'}>
                    {selectedClient?.segment}
                  </Badge>
                  <Badge variant="solid">
                    {selectedClient?.risk} Risk Profile
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-content-muted flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Geographic Location
                  </span>
                  <span className="font-medium text-content">{selectedClient?.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-content-muted flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" /> Contact Phone
                  </span>
                  <span className="font-mono text-content">{selectedClient?.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-content-muted flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" /> Intent Readiness Index
                  </span>
                  <span className="font-mono text-sbi-600 dark:text-sbi-400 font-bold">
                    {selectedClient?.readiness}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Evidence summary */}
            <div className="rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur space-y-4">
              <div className="flex items-center gap-2 border-b border-line pb-3">
                <ShieldCheck className="h-4.5 w-4.5 text-sbi-500" />
                <h3 className="font-display font-semibold text-content text-sm">Evidence verification summary</h3>
              </div>
              <div className="space-y-3.5 text-xs">
                {selectedClient?.evidence.map((ev, idx) => (
                  <div key={idx} className="space-y-1.5 bg-surface/30 p-2.5 rounded-xl border border-line">
                    <div className="flex justify-between">
                      <span className="font-medium text-content">{ev.criteria}</span>
                      <span className="font-mono text-content-subtle">{ev.reliability}%</span>
                    </div>
                    <div className="h-1 w-full bg-line rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${ev.reliability}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Tabs & Timelines */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs selector */}
            <div className="flex border border-line bg-surface/30 p-1.5 rounded-2xl gap-2">
              <button
                onClick={() => setActiveTab('finance')}
                className={cn(
                  'flex-1 py-2 px-3 rounded-xl text-xs font-semibold tracking-tight transition-all',
                  activeTab === 'finance'
                    ? 'bg-surface shadow-elev-1 text-content border border-line'
                    : 'text-content-muted hover:text-content',
                )}
              >
                Portfolio & Timeline
              </button>
              <button
                onClick={() => setActiveTab('sparks')}
                className={cn(
                  'flex-1 py-2 px-3 rounded-xl text-xs font-semibold tracking-tight transition-all',
                  activeTab === 'sparks'
                    ? 'bg-surface shadow-elev-1 text-content border border-line'
                    : 'text-content-muted hover:text-content',
                )}
              >
                Life sparks & behavior
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={cn(
                  'flex-1 py-2 px-3 rounded-xl text-xs font-semibold tracking-tight transition-all',
                  activeTab === 'network'
                    ? 'bg-surface shadow-elev-1 text-content border border-line'
                    : 'text-content-muted hover:text-content',
                )}
              >
                Relationship nodes
              </button>
            </div>

            {/* Tab Body contents */}
            {activeTab === 'finance' && (
              <div className="space-y-6">
                {/* Product Portfolio */}
                <div className="rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-sbi-500" />
                    <h3 className="font-display font-semibold text-content text-base">Active Product Portfolio</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectedClient?.portfolio.map((prod, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-line bg-surface/40 flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="font-semibold text-xs text-content block">{prod.product}</span>
                          <span className="text-[10px] text-content-subtle">Investment balance</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-content block">{prod.balance}</span>
                          <span className="text-3xs text-emerald-500 font-semibold">{prod.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animated Financial Timeline */}
                <div className="rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-sbi-500" />
                    <h3 className="font-display font-semibold text-content text-base">Financial transaction Timeline</h3>
                  </div>

                  <div className="relative border-l border-line ml-3 pl-6 space-y-6">
                    {selectedClient?.timeline.map((tl, idx) => (
                      <div key={idx} className="relative timeline-reveal">
                        {/* Dot indicator */}
                        <div
                          className={cn(
                            'absolute -left-9.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full border bg-canvas text-xs shrink-0',
                            tl.type === 'credit'
                              ? 'border-emerald-200 text-emerald-600 dark:border-emerald-800'
                              : tl.type === 'debit'
                                ? 'border-amber-200 text-amber-600 dark:border-amber-800'
                                : 'border-line text-content-subtle',
                          )}
                        >
                          {tl.type === 'credit' ? '+' : tl.type === 'debit' ? '-' : 'i'}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-content">{tl.title}</span>
                            {tl.amount && <span className="font-mono font-bold text-content">{tl.amount}</span>}
                          </div>
                          <div className="flex items-center gap-2 text-3xs text-content-subtle">
                            <span>{tl.date}</span>
                            <span>•</span>
                            <span className="uppercase font-medium">{tl.category}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sparks' && (
              <div className="space-y-6">
                {/* Life Events */}
                <div className="rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-sbi-500" />
                    <h3 className="font-display font-semibold text-content text-base">Client Life Milestones</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedClient?.lifeEvents.map((le, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-line bg-surface/30 text-xs">
                        <div className="space-y-1">
                          <span className="font-semibold text-content block">{le.title}</span>
                          <span className="text-[10px] text-content-subtle">Date: {le.date} • Category: {le.type}</span>
                        </div>
                        <Badge variant={le.impact === 'High' ? 'danger' : 'warning'}>{le.impact} Impact</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Behavioral indicators */}
                <div className="rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-sbi-500" />
                    <h3 className="font-display font-semibold text-content text-base">Digital behavioral Analytics</h3>
                  </div>
                  <div className="space-y-4 text-xs">
                    {selectedClient?.behavior.map((be, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="font-medium text-content">{be.action}</span>
                          <span className="font-mono text-content-subtle">{be.score} / 100</span>
                        </div>
                        <div className="h-1.5 w-full bg-line rounded-full overflow-hidden">
                          <div className="h-full bg-sbi-600" style={{ width: `${be.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation history */}
                <div className="rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-sbi-500" />
                    <h3 className="font-display font-semibold text-content text-base">Recommendation history</h3>
                  </div>
                  <div className="divide-y divide-line text-xs">
                    {selectedClient?.recommendations.map((rec, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center first:pt-0 last:pb-0">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-content block">{rec.title}</span>
                          <span className="text-[10px] text-content-subtle">Dispatched on: {rec.date}</span>
                        </div>
                        <Badge variant={rec.status === 'Completed' ? 'success' : rec.status === 'Pending' ? 'warning' : 'danger'}>
                          {rec.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'network' && (
              <div className="space-y-6">
                {/* Relationship networks */}
                <div className="rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-sbi-500" />
                    <h3 className="font-display font-semibold text-content text-base">Relationship Network nodes</h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectedClient?.network.map((net, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-line bg-surface/40 text-xs flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="font-semibold text-content block">{net.name}</span>
                          <span className="text-[10px] text-content-subtle">{net.relation}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-content block">{net.value}</span>
                          <span className="text-3xs text-content-subtle uppercase tracking-wider block">Shared Pool</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients
