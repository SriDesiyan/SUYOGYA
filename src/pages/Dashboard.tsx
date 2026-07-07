import { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts'
import {
  Move,
  Maximize2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  ShieldAlert,
  List,
  Compass,
  RefreshCw,
  Plus,
} from 'lucide-react'
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@/components/ui'
import { cn } from '@/lib/utils'
import Lenis from 'lenis'

interface DashboardWidget {
  id: string
  title: string
  size: 'small' | 'medium' | 'large'
  description: string
  icon: React.ComponentType<{ className?: string }>
}

// ----------------------------------------------------
// Mock Datasets
// ----------------------------------------------------

const kpiTrendData = [
  { month: 'Jan', aum: 12.4, inflow: 1.2 },
  { month: 'Feb', aum: 12.9, inflow: 0.9 },
  { month: 'Mar', aum: 13.8, inflow: 1.8 },
  { month: 'Apr', aum: 14.1, inflow: 1.1 },
  { month: 'May', aum: 14.8, inflow: 1.5 },
  { month: 'Jun', aum: 15.6, inflow: 2.1 },
  { month: 'Jul', aum: 16.2, inflow: 1.7 },
]

const readinessDistData = [
  { scoreRange: 'Under 40%', count: 12, color: '#f59e0b' },
  { scoreRange: '40% - 60%', count: 28, color: '#3b82f6' },
  { scoreRange: '60% - 80%', count: 45, color: '#10b981' },
  { scoreRange: 'Above 80%', count: 64, color: '#1e40af' },
]

const channelHealthData = [
  { channel: 'Mobile Secure Alert', success: 94, latency: 1.2 },
  { channel: 'Advisor Phone Call', success: 82, latency: 8.5 },
  { channel: 'Corporate Email', success: 68, latency: 4.2 },
]

export function Dashboard() {
  const toast = useToast()
  const [draggedId, setDraggedId] = useState<string | null>(null)

  // 1. Grid configurations state (allowing DND and Resize)
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'business-kpi',
      title: 'Business Portfolio KPIs',
      size: 'large',
      description: 'Wealth Assets Under Management (AUM) trends and net inflow indexes.',
      icon: TrendingUp,
    },
    {
      id: 'ai-insights',
      title: 'AI Recommendation Registry',
      size: 'medium',
      description: 'Active client intent signals ready for advisory campaigns.',
      icon: Sparkles,
    },
    {
      id: 'readiness-dist',
      title: 'Customer Readiness Distribution',
      size: 'medium',
      description: 'Segmentation metrics mapping customer intent levels.',
      icon: Compass,
    },
    {
      id: 'recommendation-pipeline',
      title: 'Recommendation Pipeline',
      size: 'medium',
      description: 'Workflow steps monitoring generated digital advisory cards.',
      icon: Layers,
    },
    {
      id: 'evidence-quality',
      title: 'Signal Evidence Quality',
      size: 'small',
      description: 'Confidence ratings across ledger flows and footprint points.',
      icon: CheckCircle2,
    },
    {
      id: 'channel-health',
      title: 'Engagement Channel Health',
      size: 'small',
      description: 'Latencies and deliverability success scores on alert segments.',
      icon: Activity,
    },
    {
      id: 'live-activity',
      title: 'System Ingestion Activity',
      size: 'small',
      description: 'Real-time database triggers logging transaction signals.',
      icon: List,
    },
    {
      id: 'risk-alerts',
      title: 'Risk Warning Register',
      size: 'medium',
      description: 'Alert flags requiring relationship manager validations.',
      icon: ShieldAlert,
    },
    {
      id: 'recent-actions',
      title: 'Recent Relationship Actions',
      size: 'medium',
      description: 'Log of latest customer files touched and advisory updates.',
      icon: CheckCircle2,
    },
  ])

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

  // 2. Drag and Drop handlers
  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return
    const draggedIndex = widgets.findIndex((w) => w.id === draggedId)
    const targetIndex = widgets.findIndex((w) => w.id === targetId)

    const updated = [...widgets]
    const [removed] = updated.splice(draggedIndex, 1)
    updated.splice(targetIndex, 0, removed)

    setWidgets(updated)
    setDraggedId(null)
    toast.success('Grid Position Updated', 'Dashboard layout successfully reordered.')
  }

  // 3. Resizer handler
  const handleResize = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextSizeMap: Record<typeof w.size, typeof w.size> = {
            small: 'medium',
            medium: 'large',
            large: 'small',
          }
          return { ...w, size: nextSizeMap[w.size] }
        }
        return w
      }),
    )
    toast.info('Widget Scaled', 'Card columns updated.')
  }

  // ----------------------------------------------------
  // Widget Rendering Factory
  // ----------------------------------------------------
  const renderWidgetBody = (id: string) => {
    switch (id) {
      case 'business-kpi':
        return (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpiTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aumGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a4fd6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1a4fd6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--line))" />
                  <XAxis dataKey="month" stroke="hsl(var(--content-subtle))" fontSize={11} />
                  <YAxis stroke="hsl(var(--content-subtle))" fontSize={11} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--surface))',
                      borderColor: 'hsl(var(--line))',
                      borderRadius: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aum"
                    stroke="#1a4fd6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#aumGrad)"
                    name="AUM (₹ Cr)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-4 h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--line))" />
                  <XAxis dataKey="month" stroke="hsl(var(--content-subtle))" fontSize={11} />
                  <YAxis stroke="hsl(var(--content-subtle))" fontSize={11} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--surface))',
                      borderColor: 'hsl(var(--line))',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="inflow" fill="#2f6bf5" radius={[4, 4, 0, 0]} name="Inflow (₹ Cr)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )

      case 'ai-insights':
        return (
          <div className="space-y-4">
            {[
              {
                client: 'Kabir Rao',
                segment: 'HNI',
                action: 'Yield Lock-in Opportunity',
                prob: 92,
                color: 'bg-emerald-500',
              },
              {
                client: 'Aarav Mehta',
                segment: 'HNI',
                action: 'AUM Rebalancing Alert',
                prob: 87,
                color: 'bg-emerald-500',
              },
              {
                client: 'Ishaan Roy',
                segment: 'Affluent',
                action: 'Tax Harvest Campaign',
                prob: 78,
                color: 'bg-sbi-500',
              },
              {
                client: 'Diya Sharma',
                segment: 'Affluent',
                action: 'Venture Liquidity Call',
                prob: 64,
                color: 'bg-amber-500',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-line bg-surface/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-content">{item.client}</span>
                    <Badge variant={item.segment === 'HNI' ? 'brand' : 'success'}>{item.segment}</Badge>
                  </div>
                  <p className="text-3xs text-content-muted">{item.action}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-content">{item.prob}%</span>
                    <div className="h-1.5 w-16 bg-line rounded-full overflow-hidden mt-1">
                      <div className={cn('h-full', item.color)} style={{ width: `${item.prob}%` }} />
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 py-0 px-2.5">
                    Execute
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )

      case 'readiness-dist':
        return (
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessDistData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--line))" />
                <XAxis dataKey="scoreRange" stroke="hsl(var(--content-subtle))" fontSize={11} />
                <YAxis stroke="hsl(var(--content-subtle))" fontSize={11} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--surface))',
                    borderColor: 'hsl(var(--line))',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#2f6bf5" radius={[6, 6, 0, 0]} name="Active client Profiles" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )

      case 'recommendation-pipeline':
        return (
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Scanned', val: 142, desc: 'Transaction sparks', color: 'border-l-indigo-500' },
              { label: 'Calibrated', val: 86, desc: 'Vector scores >60', color: 'border-l-sbi-500' },
              { label: 'Assigned', val: 42, desc: 'Directly in RMs feeds', color: 'border-l-amber-500' },
              { label: 'Engaged', val: 19, desc: 'AUM conversions', color: 'border-l-emerald-500' },
            ].map((step, idx) => (
              <div key={idx} className={cn('border-l-2 p-3 bg-surface/30 rounded-r-xl border border-line border-y-line border-r-line', step.color)}>
                <span className="text-[10px] font-bold text-content-subtle uppercase tracking-wider">{step.label}</span>
                <span className="block text-xl font-bold font-mono text-content mt-1">{step.val}</span>
                <p className="text-[10px] text-content-muted leading-tight mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        )

      case 'evidence-quality':
        return (
          <div className="space-y-3.5">
            {[
              { source: 'Direct cash flow vectors', rate: 98, status: 'HIGH TRUST' },
              { source: 'Digital session signals', rate: 82, status: 'VERIFIED' },
              { source: 'Venture liquidity indexes', rate: 74, status: 'MODERATE' },
              { source: 'Demographics & age spark', rate: 58, status: 'ESTIMATED' },
            ].map((ev, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-content">{ev.source}</span>
                  <span className="font-mono text-content-subtle">{ev.rate}%</span>
                </div>
                <div className="h-1.5 w-full bg-line rounded-full overflow-hidden">
                  <div className="h-full bg-sbi-600" style={{ width: `${ev.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        )

      case 'channel-health':
        return (
          <div className="space-y-4">
            {channelHealthData.map((ch, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-line bg-surface/30 text-xs">
                <div>
                  <span className="font-semibold text-content block">{ch.channel}</span>
                  <span className="text-[10px] text-content-subtle">Latency: {ch.latency}s</span>
                </div>
                <div className="text-right">
                  <Badge variant={ch.success >= 85 ? 'success' : 'warning'}>{ch.success}% Delivery</Badge>
                </div>
              </div>
            ))}
          </div>
        )

      case 'live-activity':
        return (
          <div className="space-y-3 max-h-[195px] overflow-y-auto pr-1">
            {[
              { time: '14:28:02', text: 'Transaction cash inflow flagged for client Kabir Rao.' },
              { time: '14:26:15', text: 'Zod schema validation approved on new advisory request.' },
              { time: '14:24:48', text: 'Auth JWT generated for RM session.' },
              { time: '14:21:05', text: 'Inflow volatility warning dispatched for Aarav Mehta.' },
              { time: '14:18:50', text: 'Digital footprint spark detected from portfolio tab.' },
            ].map((act, idx) => (
              <div key={idx} className="flex gap-2 text-3xs leading-relaxed border-b border-line pb-2 last:border-0 last:pb-0">
                <span className="font-mono text-content-subtle shrink-0">{act.time}</span>
                <span className="text-content-muted">{act.text}</span>
              </div>
            ))}
          </div>
        )

      case 'risk-alerts':
        return (
          <div className="space-y-3.5">
            {[
              { name: 'Ananya Nair', alert: 'Exceeded Loan-to-Value margin threshold', priority: 'CRITICAL', color: 'text-danger' },
              { name: 'Aarav Mehta', alert: 'Large corporate debit transaction spark', priority: 'HIGH', color: 'text-amber-500' },
              { name: 'Diya Sharma', alert: 'Inflow index dip below threshold', priority: 'MEDIUM', color: 'text-sbi-500' },
            ].map((risk, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 rounded-xl border border-line bg-surface/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-content">{risk.name}</span>
                    <AlertTriangle className={cn('h-3.5 w-3.5', risk.color)} />
                  </div>
                  <p className="text-3xs text-content-muted">{risk.alert}</p>
                </div>
                <Badge variant={risk.priority === 'CRITICAL' ? 'danger' : 'warning'}>{risk.priority}</Badge>
              </div>
            ))}
          </div>
        )

      case 'recent-actions':
        return (
          <div className="divide-y divide-line text-xs">
            {[
              { action: 'Dispatched Portfolio Rebalancing PDF', to: 'Kabir Rao', date: '07-07-2026', status: 'Delivered' },
              { action: 'Advisory Phone call log submitted', to: 'Ishaan Roy', date: '06-07-2026', status: 'Completed' },
              { action: 'Venture Liquidity email generated', to: 'Diya Sharma', date: '06-07-2026', status: 'Pending' },
            ].map((item, idx) => (
              <div key={idx} className="py-2.5 flex justify-between items-center first:pt-0 last:pb-0">
                <div>
                  <span className="font-semibold text-content block">{item.action}</span>
                  <span className="text-[10px] text-content-subtle">Client: {item.to} • Date: {item.date}</span>
                </div>
                <Badge variant={item.status === 'Completed' ? 'success' : item.status === 'Delivered' ? 'brand' : 'solid'}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Executive Welcome Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-content md:text-3xl">
            AI Banking <span className="text-gradient-sbi">Command Center</span>
          </h1>
          <p className="text-sm text-content-muted">
            Wealth Operations & Intent Intelligence Console • Drag headers to reorder, click resize controls to scale cards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" rightIcon={<RefreshCw className="h-4 w-4" />}>
            Reset Layout
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            New Campaign
          </Button>
        </div>
      </div>

      {/* Draggable & Resizable Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {widgets.map((widget) => {
          const Icon = widget.icon
          const isBeingDragged = draggedId === widget.id

          return (
            <div
              key={widget.id}
              draggable
              onDragStart={() => handleDragStart(widget.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(widget.id)}
              className={cn(
                'transition-all duration-300',
                widget.size === 'small' && 'col-span-12 lg:col-span-4',
                widget.size === 'medium' && 'col-span-12 lg:col-span-6',
                widget.size === 'large' && 'col-span-12',
                isBeingDragged ? 'opacity-35 border-dashed border-2 border-sbi-400 bg-sbi-50/10' : '',
              )}
            >
              <Card variant="glass" className="h-full flex flex-col justify-between select-none">
                <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-line">
                  <div className="flex items-center gap-3">
                    {/* Draggable Grab Handle Indicator */}
                    <div className="cursor-grab text-content-subtle hover:text-content active:cursor-grabbing p-1">
                      <Move className="h-4 w-4" />
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-sbi-50 flex items-center justify-center text-sbi-600 dark:bg-sbi-950/20 dark:text-sbi-400 shrink-0">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold leading-tight">{widget.title}</CardTitle>
                      <CardDescription className="text-3xs mt-0.5 leading-none">{widget.description}</CardDescription>
                    </div>
                  </div>

                  {/* Resizer Button Control */}
                  <button
                    onClick={() => handleResize(widget.id)}
                    className="p-1.5 rounded-lg border border-line hover:bg-surface-raised/80 transition-colors text-content-muted hover:text-content"
                    title="Toggle Card size (Cycle: Small, Medium, Large)"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </CardHeader>
                <CardContent className="pt-4 flex-1">
                  {renderWidgetBody(widget.id)}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
