import { useState } from 'react'
import {
  TrendingUp,
  Activity,
  DollarSign,
  PieChart,
  Percent,
  Layers,
  Info,
  Calendar,
  LineChart as LineIcon,
} from 'lucide-react'
import { GlassPanel, useToast } from '@/components/ui'
import { cn } from '@/lib/utils'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

// ----------------------------------------------------
// Mock Datasets: Timeframes & Predictive Series
// ----------------------------------------------------
const revenueData7d = [
  { name: 'Mon', Actual: 1.2, Forecast: 1.2 },
  { name: 'Tue', Actual: 1.4, Forecast: 1.5 },
  { name: 'Wed', Actual: 1.8, Forecast: 1.7 },
  { name: 'Thu', Actual: 2.2, Forecast: 2.1 },
  { name: 'Fri', Actual: 2.1, Forecast: 2.4 },
  { name: 'Sat', Actual: 2.6, Forecast: 2.7 },
  { name: 'Sun', Actual: 3.4, Forecast: 3.1 },
]

const revenueData30d = [
  { name: 'Wk 1', Actual: 5.2, Forecast: 5.0 },
  { name: 'Wk 2', Actual: 7.4, Forecast: 7.8 },
  { name: 'Wk 3', Actual: 9.8, Forecast: 9.2 },
  { name: 'Wk 4', Actual: 12.4, Forecast: 11.5 },
]

const revenueDataForecast = [
  { name: 'Jul', Actual: 12.4, Forecast: 12.4 },
  { name: 'Aug', Actual: null, Forecast: 14.8 },
  { name: 'Sep', Actual: null, Forecast: 17.2 },
  { name: 'Oct', Actual: null, Forecast: 21.0 },
]

const readinessTrends7d = [
  { name: 'Mon', High: 80, Passive: 60, Cold: 20 },
  { name: 'Tue', High: 82, Passive: 58, Cold: 18 },
  { name: 'Wed', High: 85, Passive: 64, Cold: 15 },
  { name: 'Thu', High: 87, Passive: 62, Cold: 14 },
  { name: 'Fri', High: 88, Passive: 60, Cold: 12 },
  { name: 'Sat', High: 92, Passive: 58, Cold: 10 },
  { name: 'Sun', High: 95, Passive: 55, Cold: 8 },
]

const productAdoption = [
  { name: 'PMS Bluechip', Users: 124, AUM: 8.5 },
  { name: 'Gold Bonds', Users: 95, AUM: 4.2 },
  { name: 'Tech Funds', Users: 86, AUM: 3.1 },
  { name: 'Corp Yield', Users: 52, AUM: 1.8 },
]

export function Analytics() {
  const toast = useToast()
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'forecast'>('7d')

  // Set chart datasets based on active timeframe selection
  const revenueChartData =
    timeframe === '7d'
      ? revenueData7d
      : timeframe === '30d'
        ? revenueData30d
        : revenueDataForecast

  const handleTimeframeChange = (val: '7d' | '30d' | 'forecast') => {
    setTimeframe(val)
    toast.info(
      'Analytics Timeframe Updated',
      val === 'forecast'
        ? 'Loaded predictive Q3/Q4 assets inflow projections model.'
        : `Switched database history series to last ${val === '7d' ? '7 days' : '30 days'}.`
    )
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-content md:text-3xl">
            Analytics & <span className="text-gradient-sbi">Performance Platform</span>
          </h1>
          <p className="text-sm text-content-muted">
            Inspect total AUM yields, predictive assets inflows, conversion rates, and product adoption vectors.
          </p>
        </div>

        {/* Timeframe Select Tab buttons */}
        <div className="flex border border-line bg-surface/30 p-1 rounded-xl gap-1">
          <button
            onClick={() => handleTimeframeChange('7d')}
            className={cn(
              'py-1 px-3 rounded-lg text-xs font-semibold transition-all',
              timeframe === '7d' ? 'bg-surface text-content shadow-elev-1 border border-line' : 'text-content-muted hover:text-content'
            )}
          >
            7 Days
          </button>
          <button
            onClick={() => handleTimeframeChange('30d')}
            className={cn(
              'py-1 px-3 rounded-lg text-xs font-semibold transition-all',
              timeframe === '30d' ? 'bg-surface text-content shadow-elev-1 border border-line' : 'text-content-muted hover:text-content'
            )}
          >
            30 Days
          </button>
          <button
            onClick={() => handleTimeframeChange('forecast')}
            className={cn(
              'py-1 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1',
              timeframe === 'forecast' ? 'bg-surface text-content shadow-elev-1 border border-line' : 'text-content-muted hover:text-content'
            )}
          >
            <Calendar className="h-3 w-3" /> Predictive Q3/Q4
          </button>
        </div>
      </div>

      {/* KPI scorecard counters */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <GlassPanel variant="glass" padding="md" className="flex flex-col justify-between h-24 border border-line">
          <span className="text-[10px] text-content-subtle uppercase tracking-wider block flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-sbi-500" /> Total Inflows (AUM)
          </span>
          <div>
            <span className="font-mono text-xl font-bold text-content">₹12.4Cr</span>
            <span className="text-3xs text-emerald-500 font-semibold block mt-0.5">+14.2% YoY growth</span>
          </div>
        </GlassPanel>

        <GlassPanel variant="glass" padding="md" className="flex flex-col justify-between h-24 border border-line">
          <span className="text-[10px] text-content-subtle uppercase tracking-wider block flex items-center gap-1.5">
            <Percent className="h-3.5 w-3.5 text-sbi-500" /> Campaign Conversions
          </span>
          <div>
            <span className="font-mono text-xl font-bold text-content">86.5%</span>
            <span className="text-3xs text-emerald-500 font-semibold block mt-0.5">+4.1% MoM conversion</span>
          </div>
        </GlassPanel>

        <GlassPanel variant="glass" padding="md" className="flex flex-col justify-between h-24 border border-line">
          <span className="text-[10px] text-content-subtle uppercase tracking-wider block flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-sbi-500" /> Client Retention rate
          </span>
          <div>
            <span className="font-mono text-xl font-bold text-emerald-500">99.2%</span>
            <span className="text-3xs text-content-subtle block mt-0.5">Top-tier industry benchmark</span>
          </div>
        </GlassPanel>

        <GlassPanel variant="glass" padding="md" className="flex flex-col justify-between h-24 border border-line">
          <span className="text-[10px] text-content-subtle uppercase tracking-wider block flex items-center gap-1.5">
            <PieChart className="h-3.5 w-3.5 text-sbi-500" /> Avg Customer CLV
          </span>
          <div>
            <span className="font-mono text-xl font-bold text-content">₹4.2Cr</span>
            <span className="text-3xs text-content-subtle block mt-0.5">HNI asset multiplier index</span>
          </div>
        </GlassPanel>
      </div>

      {/* Recharts Grid Split */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Revenue Business Impact & Forecast Line chart */}
        <div className="lg:col-span-8 bg-surface/30 border border-line rounded-3xl p-5 backdrop-blur space-y-4">
          <div className="flex items-center gap-2">
            <LineIcon className="h-4.5 w-4.5 text-sbi-500" />
            <h3 className="font-display font-semibold text-content text-sm">Revenue growth & Inflow Projections (Cr)</h3>
          </div>
          
          <div className="h-64 w-full text-3xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--line))" />
                <XAxis dataKey="name" stroke="currentColor" className="text-content-subtle" tickLine={false} />
                <YAxis stroke="currentColor" className="text-content-subtle" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--surface))',
                    borderColor: 'hsl(var(--line))',
                    borderRadius: '0.75rem',
                    color: 'hsl(var(--content))',
                  }}
                />
                <Legend className="text-content-subtle text-3xs" />
                <Line
                  name="Actual Inflows"
                  type="monotone"
                  dataKey="Actual"
                  stroke="#2f6bf5"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
                <Line
                  name="Predictive AI Forecast"
                  type="monotone"
                  dataKey="Forecast"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Details Sidebar Info card */}
        <div className="lg:col-span-4 space-y-6">
          <GlassPanel variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-4.5 w-4.5 text-sbi-500" />
              <span className="font-display font-semibold text-xs text-content">Predictive Inflow models</span>
            </div>
            <div className="text-xs space-y-3">
              <p className="text-content-muted leading-relaxed leading-normal">
                SUYOGYA vector regression matrices check digital session parameters and historical cash credits to model alternate asset inflows.
              </p>
              <div className="p-3 bg-surface-raised border border-line rounded-xl space-y-1">
                <span className="font-semibold text-content block text-[11px]">Model Confidence rating:</span>
                <span className="font-mono text-sbi-600 dark:text-sbi-400 font-extrabold text-sm block">94.2% verified</span>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Stacked Readiness trends (Left) & Product adoption (Right) */}
        <div className="lg:col-span-6 bg-surface/30 border border-line rounded-3xl p-5 backdrop-blur space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-sbi-500" />
            <h3 className="font-display font-semibold text-content text-sm">Client Readiness score trends (%)</h3>
          </div>
          
          <div className="h-60 w-full text-3xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={readinessTrends7d} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--line))" />
                <XAxis dataKey="name" stroke="currentColor" className="text-content-subtle" tickLine={false} />
                <YAxis stroke="currentColor" className="text-content-subtle" tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--surface))',
                    borderColor: 'hsl(var(--line))',
                    borderRadius: '0.75rem',
                    color: 'hsl(var(--content))',
                  }}
                />
                <Area type="monotone" dataKey="High" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                <Area type="monotone" dataKey="Passive" stackId="1" stroke="#2f6bf5" fill="#2f6bf5" fillOpacity={0.15} />
                <Area type="monotone" dataKey="Cold" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 bg-surface/30 border border-line rounded-3xl p-5 backdrop-blur space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-sbi-500" />
            <h3 className="font-display font-semibold text-content text-sm">Product Adoption volume & AUM (Cr)</h3>
          </div>
          
          <div className="h-60 w-full text-3xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productAdoption} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--line))" />
                <XAxis dataKey="name" stroke="currentColor" className="text-content-subtle" tickLine={false} />
                <YAxis stroke="currentColor" className="text-content-subtle" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--surface))',
                    borderColor: 'hsl(var(--line))',
                    borderRadius: '0.75rem',
                    color: 'hsl(var(--content))',
                  }}
                />
                <Legend />
                <Bar name="Active RMs Briefs" dataKey="Users" fill="#2f6bf5" radius={[4, 4, 0, 0]} />
                <Bar name="Total allocation AUM (Cr)" dataKey="AUM" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
