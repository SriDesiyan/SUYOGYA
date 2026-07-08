import { useState } from 'react'
import {
  Network,
  TrendingUp,
  MessageSquare,
  Smartphone,
  MapPin,
  Laptop,
  PhoneCall,
  Mail,
  Zap,
  Info,
  CreditCard,
} from 'lucide-react'
import { Badge, GlassPanel, Card, CardHeader, CardTitle, CardContent, useToast } from '@/components/ui'
import { cn } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// ----------------------------------------------------
// Mock Channels Dataset & performance statistics
// ----------------------------------------------------
interface ChannelMetric {
  id: string
  label: string
  icon: React.ElementType
  volume: string
  openRate: number
  responseRate: number
  conversionScore: number
  avgLatency: string
  desc: string
  status: 'optimal' | 'warning'
}

const mockChannelsList: ChannelMetric[] = [
  {
    id: 'ch-yono',
    label: 'YONO Mobile app',
    icon: Smartphone,
    volume: '24.5K messages',
    openRate: 94,
    responseRate: 72,
    conversionScore: 9.4,
    avgLatency: '1.2 mins',
    desc: 'SBI central mobile banking platform pushes.',
    status: 'optimal',
  },
  {
    id: 'ch-whatsapp',
    label: 'WhatsApp chat',
    icon: MessageSquare,
    volume: '12.2K chats',
    openRate: 98,
    responseRate: 85,
    conversionScore: 9.6,
    avgLatency: '45 secs',
    desc: 'Secure end-to-end encrypted messaging channels.',
    status: 'optimal',
  },
  {
    id: 'ch-branch',
    label: 'Branch Advisor',
    icon: MapPin,
    volume: '1.4K sessions',
    openRate: 100,
    responseRate: 92,
    conversionScore: 9.1,
    avgLatency: '15 mins',
    desc: 'In-branch physical RM consultations and briefs.',
    status: 'optimal',
  },
  {
    id: 'ch-ib',
    label: 'Internet Banking',
    icon: Laptop,
    volume: '8.9K portals',
    openRate: 88,
    responseRate: 54,
    conversionScore: 7.8,
    avgLatency: '3.4 mins',
    desc: 'Desktop banking portal advisories banners.',
    status: 'optimal',
  },
  {
    id: 'ch-contact',
    label: 'Contact Centre',
    icon: PhoneCall,
    volume: '3.1K calls',
    openRate: 90,
    responseRate: 64,
    conversionScore: 8.2,
    avgLatency: '6.2 mins',
    desc: 'Priority RM outbound customer call assistance.',
    status: 'optimal',
  },
  {
    id: 'ch-email',
    label: 'Email brief',
    icon: Mail,
    volume: '15.4K dispatches',
    openRate: 68,
    responseRate: 34,
    conversionScore: 6.5,
    avgLatency: '4.2 hours',
    desc: 'Detailed portfolio alternate asset reports briefs.',
    status: 'warning',
  },
  {
    id: 'ch-atm',
    label: 'ATM Screen',
    icon: CreditCard,
    volume: '2.8K prompts',
    openRate: 85,
    responseRate: 28,
    conversionScore: 5.2,
    avgLatency: '2.5 mins',
    desc: 'Interactive ATM transaction complete promos.',
    status: 'optimal',
  },
  {
    id: 'ch-sms',
    label: 'SMS Alert',
    icon: Zap,
    volume: '32.1K alerts',
    openRate: 92,
    responseRate: 42,
    conversionScore: 7.1,
    avgLatency: '1.8 mins',
    desc: 'Priority transaction trigger short messages.',
    status: 'optimal',
  },
]

// Recharts datasets based on timeframe
const chartData24h = [
  { name: 'YONO', conversion: 9.2 },
  { name: 'WhatsApp', conversion: 9.5 },
  { name: 'Branch', conversion: 8.9 },
  { name: 'Int. Banking', conversion: 7.4 },
  { name: 'Contact', conversion: 8.0 },
  { name: 'Email', conversion: 6.2 },
  { name: 'ATM', conversion: 5.0 },
  { name: 'SMS', conversion: 6.8 },
]

const chartData7d = [
  { name: 'YONO', conversion: 9.4 },
  { name: 'WhatsApp', conversion: 9.6 },
  { name: 'Branch', conversion: 9.1 },
  { name: 'Int. Banking', conversion: 7.8 },
  { name: 'Contact', conversion: 8.2 },
  { name: 'Email', conversion: 6.5 },
  { name: 'ATM', conversion: 5.2 },
  { name: 'SMS', conversion: 7.1 },
]

const chartData30d = [
  { name: 'YONO', conversion: 9.5 },
  { name: 'WhatsApp', conversion: 9.7 },
  { name: 'Branch', conversion: 9.2 },
  { name: 'Int. Banking', conversion: 8.0 },
  { name: 'Contact', conversion: 8.5 },
  { name: 'Email', conversion: 6.7 },
  { name: 'ATM', conversion: 5.4 },
  { name: 'SMS', conversion: 7.3 },
]

export function Channels() {
  const toast = useToast()
  const [selectedChannelId, setSelectedChannelId] = useState('ch-yono')
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d')

  const activeChannel = mockChannelsList.find((c) => c.id === selectedChannelId) || mockChannelsList[0]

  // Recharts target data
  const activeChartData =
    timeframe === '24h' ? chartData24h : timeframe === '7d' ? chartData7d : chartData30d

  // Central SVG coords math: center is 220px, radius is 170px
  const centerCoord = 220
  const radius = 170

  const getLineCoordinates = (idx: number) => {
    // 8 items forming the circle (rotate 360 / 8)
    const angle = (idx * 2 * Math.PI) / 8 - Math.PI / 2 // offset by -90deg so index 0 starts at top center
    const x = centerCoord + radius * Math.cos(angle)
    const y = centerCoord + radius * Math.sin(angle)
    return { x, y }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-content md:text-3xl">
            Omnichannel <span className="text-gradient-sbi">Intelligence Center</span>
          </h1>
          <p className="text-sm text-content-muted">
            Inspect communication deliverability rates, open stats, and average RM latency vectors.
          </p>
        </div>
        <div className="flex items-center gap-1.5 border border-line bg-surface/50 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-content-subtle font-medium">Timeline:</span>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as '24h' | '7d' | '30d')}
            className="bg-transparent text-content font-bold outline-none cursor-pointer"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Main split */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Network visual canvas */}
        <div className="lg:col-span-8 flex justify-center items-center p-6 bg-canvas/30 rounded-3xl border border-line overflow-hidden min-h-[480px]">
          {/* Relative visual shell */}
          <div className="relative w-[440px] h-[440px] flex items-center justify-center">
            {/* SVG connections layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="networkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2f6bf5" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1a4fd6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              {mockChannelsList.map((item, idx) => {
                const { x, y } = getLineCoordinates(idx)
                const isFocused = selectedChannelId === item.id
                return (
                  <line
                    key={idx}
                    x1={centerCoord}
                    y1={centerCoord}
                    x2={x}
                    y2={y}
                    stroke={isFocused ? '#3b82f6' : 'url(#networkGrad)'}
                    strokeWidth={isFocused ? '2.5' : '1.5'}
                    strokeDasharray="6,6"
                    className="animate-network-dash"
                    style={{
                      // speed up animated particles flow on node focus
                      animationDuration: isFocused ? '0.8s' : '2.0s',
                    }}
                  />
                )
              })}
            </svg>

            {/* Central hub */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] z-10 pointer-events-none flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 rounded-full border border-line bg-canvas/60 backdrop-blur shadow-inner-glass animate-pulse pointer-events-none" />
              <Network className="h-7 w-7 text-sbi-500 mb-1 z-10 animate-spin-slow" />
              <span className="font-display text-[10px] font-bold text-content tracking-wider uppercase z-10 leading-none">SUYOGYA</span>
              <span className="text-[9px] text-content-subtle z-10 block mt-0.5 uppercase tracking-widest font-mono">Omni Hub</span>
            </div>

            {/* Radial channel nodes */}
            {mockChannelsList.map((item, idx) => {
              const Icon = item.icon
              const isSelected = selectedChannelId === item.id
              const angleDeg = (idx * 360) / 8 - 90

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedChannelId(item.id)
                    toast.info('Channel Selected', `Loaded metrics for ${item.label}.`)
                  }}
                  style={{
                    transform: `rotate(${angleDeg}deg) translate(${radius}px) rotate(${-angleDeg}deg)`,
                  }}
                  className={cn(
                    'absolute w-[110px] p-2 rounded-xl border bg-surface/85 backdrop-blur shadow-inner-glass cursor-pointer transition-all duration-300 text-left flex items-center gap-2 group z-20 hover:scale-105',
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
                      {item.label.split(' ')[0]}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-content-muted block mt-0.5 leading-none">
                      {item.conversionScore} /10
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Side statistics & charts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Detail card */}
          <Card variant="solid">
            <CardHeader className="border-b border-line pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>{activeChannel.label}</CardTitle>
                <Badge variant={activeChannel.status === 'optimal' ? 'success' : 'warning'} className="mt-1 leading-none">
                  {activeChannel.status.toUpperCase()}
                </Badge>
              </div>
              <activeChannel.icon className="h-6 w-6 text-sbi-500" />
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-4">
              <p className="text-content-muted leading-relaxed">{activeChannel.desc}</p>
              
              <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-line">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Deliverability volume</span>
                  <span className="font-semibold text-content font-mono">{activeChannel.volume}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Avg RM Latency</span>
                  <span className="font-semibold text-content font-mono">{activeChannel.avgLatency}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Open rate</span>
                  <span className="font-semibold text-content font-mono">{activeChannel.openRate}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Conversion Rating</span>
                  <span className="font-semibold text-sbi-600 dark:text-sbi-400 font-mono">{activeChannel.conversionScore} / 10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recharts Bar chart comparisons */}
          <GlassPanel variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-sbi-500" />
              <span className="font-display font-semibold text-xs text-content">Conversion performance index</span>
            </div>
            
            {/* Recharts responsive box */}
            <div className="h-40 w-full text-3xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="currentColor" className="text-content-subtle" tickLine={false} />
                  <YAxis stroke="currentColor" className="text-content-subtle" tickLine={false} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--surface))',
                      borderColor: 'hsl(var(--line))',
                      borderRadius: '0.75rem',
                      color: 'hsl(var(--content))',
                    }}
                  />
                  <Bar dataKey="conversion" radius={[4, 4, 0, 0]}>
                    {activeChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === activeChannel.label.split(' ')[0] ? '#3b82f6' : '#2f6bf5'}
                        fillOpacity={entry.name === activeChannel.label.split(' ')[0] ? 1 : 0.4}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[9px] text-content-subtle leading-tight uppercase font-bold text-center border-t border-line pt-2">
              <Info className="inline h-3.5 w-3.5 align-text-bottom mr-1" /> WhatsApp chat leads delivery response rates.
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Network connection CSS helpers keyframes */}
      <style>{`
        @keyframes networkDash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-network-dash {
          animation: networkDash 2s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default Channels
