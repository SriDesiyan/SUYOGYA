import { useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import gsap from 'gsap'
import Lenis from 'lenis'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Sparkles,
  Users,
  CreditCard,
  Activity,
  Cpu,
  Plus,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
  StatCard,
  Badge,
  DataTable,
  LoadingOverlay,
  useToast,
  DonutChart,
  Column,
} from '@/components/ui'
import { SignalSphere } from '@/components/3d/SignalSphere'

// Zod validation schema for new signals
const signalFormSchema = z.object({
  clientName: z.string().min(3, 'Client name must be at least 3 characters'),
  segment: z.enum(['HNI', 'Affluent', 'Emerging']),
  confidenceScore: z.number().min(1, 'Score must be at least 1').max(100, 'Score cannot exceed 100'),
  actionRequired: z.string().min(5, 'Action required must be at least 5 characters'),
})

type SignalFormValues = z.infer<typeof signalFormSchema>

interface ClientSignal {
  id: string
  name: string
  segment: 'HNI' | 'Affluent' | 'Emerging'
  readiness: number
  value: string
}

// Recharts data for SBI Activity Trends
const trendData = [
  { month: 'Jan', offline: 4000, online: 2400 },
  { month: 'Feb', offline: 3000, online: 1398 },
  { month: 'Mar', offline: 2000, online: 9800 },
  { month: 'Apr', offline: 2780, online: 3908 },
  { month: 'May', offline: 1890, online: 4800 },
  { month: 'Jun', offline: 2390, online: 3800 },
  { month: 'Jul', offline: 3490, online: 4300 },
]

export function Dashboard() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Initialize GSAP Entrance Animations
  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.animate-gsap-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        },
      )
    }
  }, [])

  // React Query: Fetching live client signals
  const { data: clients = [], isLoading } = useQuery<ClientSignal[]>({
    queryKey: ['clientSignals'],
    queryFn: async () => {
      // Simulate slow network request using modern mock
      await new Promise((resolve) => setTimeout(resolve, 800))
      return [
        { id: '1', name: 'Aarav Mehta', segment: 'HNI', readiness: 87, value: '₹1.2Cr' },
        { id: '2', name: 'Diya Sharma', segment: 'Affluent', readiness: 64, value: '₹45L' },
        { id: '3', name: 'Kabir Rao', segment: 'HNI', readiness: 92, value: '₹3.4Cr' },
        { id: '4', name: 'Ananya Nair', segment: 'Emerging', readiness: 41, value: '₹12L' },
        { id: '5', name: 'Ishaan Roy', segment: 'Affluent', readiness: 78, value: '₹85L' },
      ]
    },
    initialData: [],
  })

  // React Query Mutation: Posting a new client signal
  const mutation = useMutation({
    mutationFn: async (newSignal: SignalFormValues) => {
      // Simulate posting to API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const addedSignal: ClientSignal = {
        id: Math.random().toString(36).substr(2, 9),
        name: newSignal.clientName,
        segment: newSignal.segment,
        readiness: newSignal.confidenceScore,
        value: '₹35L', // mock AUM value
      }
      return addedSignal
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ClientSignal[]>(['clientSignals'], (old = []) => [data, ...old])
      toast.success('Signal Transmitted', `Successfully logged action alert for ${data.name}.`)
      reset()
    },
    onError: () => {
      toast.error('Transmission Failed', 'Check network interfaces and try again.')
    },
  })

  // React Hook Form + Zod
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SignalFormValues>({
    resolver: zodResolver(signalFormSchema),
    defaultValues: {
      clientName: '',
      segment: 'Affluent',
      confidenceScore: 75,
      actionRequired: '',
    },
  })

  const onSubmit = (values: SignalFormValues) => {
    mutation.mutate(values)
  }

  // Data table column definition
  const columns: Column<ClientSignal>[] = [
    {
      key: 'name',
      header: 'Client Name',
      sortable: true,
      render: (c) => (
        <span className="font-semibold text-content">{c.name}</span>
      ),
    },
    {
      key: 'segment',
      header: 'Segment',
      render: (c) => (
        <Badge variant={c.segment === 'HNI' ? 'brand' : c.segment === 'Affluent' ? 'success' : 'solid'}>
          {c.segment}
        </Badge>
      ),
    },
    {
      key: 'readiness',
      header: 'Readiness Score',
      sortable: true,
      align: 'right',
      render: (c) => (
        <div className="flex items-center justify-end gap-2 font-mono text-xs tabular-nums text-content font-bold">
          {c.readiness}%
        </div>
      ),
    },
    {
      key: 'value',
      header: 'Est. Capital Pool',
      align: 'right',
      render: (c) => <span className="font-mono text-xs tabular-nums text-content-muted">{c.value}</span>,
    },
  ]

  // Segment Donut Data
  const segmentDonutData = [
    { label: 'HNI clients', value: 35, color: '#1a4fd6' },
    { label: 'Affluent clients', value: 45, color: '#2f6bf5' },
    { label: 'Emerging pool', value: 20, color: '#8db6ff' },
  ]

  return (
    <div ref={containerRef} className="space-y-6">
      {mutation.isPending && <LoadingOverlay label="Transmitting AI signal..." />}

      {/* Top Welcome Title */}
      <div className="animate-gsap-card flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-content md:text-3xl">
            Engagement <span className="text-gradient-sbi">Command Center</span>
          </h1>
          <p className="text-sm text-content-muted">
            Digital relationship intelligence engine • SBI Executive Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
            Export Reports
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-gsap-card">
          <StatCard
            label="Digital Engagement Index"
            value={14280}
            delta={0.142}
            icon={<Users className="h-4.5 w-4.5" />}
            spark={[4, 7, 5, 9, 8, 12, 10, 14]}
            accent
          />
        </div>
        <div className="animate-gsap-card">
          <StatCard
            label="High Net Capital Pool"
            value={48200000}
            format={(v) => `₹${(v / 10000000).toFixed(2)}Cr`}
            delta={0.083}
            icon={<CreditCard className="h-4.5 w-4.5" />}
            spark={[3, 5, 4, 6, 7, 6, 8, 9]}
          />
        </div>
        <div className="animate-gsap-card">
          <StatCard
            label="System Signal Accuracy"
            value={94.2}
            format={(v) => `${v}%`}
            delta={0.024}
            icon={<ShieldCheck className="h-4.5 w-4.5" />}
          />
        </div>
        <div className="animate-gsap-card">
          <StatCard
            label="Live Active Warnings"
            value={16}
            delta={-0.125}
            icon={<Activity className="h-4.5 w-4.5" />}
            spark={[8, 7, 6, 5, 4, 3, 2, 1]}
          />
        </div>
      </div>

      {/* Main Grid: 3D Visualization and Signal Simulator */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* 3D Interactive Model Panel */}
        <div className="animate-gsap-card lg:col-span-8 flex flex-col gap-4">
          <div className="rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-content text-base">
                  Interactive Node Network
                </h3>
                <p className="text-xs text-content-subtle">
                  Spatial visualization of SBI Digital Signals. Spin and hover nodes.
                </p>
              </div>
              <Cpu className="h-5 w-5 text-sbi-500 animate-pulse" />
            </div>
            <SignalSphere />
          </div>

          {/* Recharts Analytics Area */}
          <div className="rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur">
            <h3 className="mb-4 font-display font-semibold text-content text-base">
              Digital Engagement Channels Trend
            </h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2f6bf5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2f6bf5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOffline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f9d6e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0f9d6e" stopOpacity={0} />
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
                    dataKey="online"
                    stroke="#2f6bf5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOnline)"
                    name="Online Engine"
                  />
                  <Area
                    type="monotone"
                    dataKey="offline"
                    stroke="#0f9d6e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOffline)"
                    name="Affluent Advising"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Signal Simulator Form */}
        <div className="animate-gsap-card lg:col-span-4 flex flex-col gap-6">
          <Card variant="glass" className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-sbi-500" />
                <CardTitle>Transmit AI Signal</CardTitle>
              </div>
              <CardDescription>
                Submit simulated engagement event parameters to route alerts through the engine.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input
                    label="Client Reference Name"
                    placeholder="E.g., Aarav Mehta"
                    error={errors.clientName?.message}
                    {...register('clientName')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-content">
                    Wealth Segment
                  </label>
                  <Controller
                    control={control}
                    name="segment"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          { value: 'HNI', label: 'HNI (High Net Worth)' },
                          { value: 'Affluent', label: 'Affluent Profile' },
                          { value: 'Emerging', label: 'Emerging Wealth' },
                        ]}
                      />
                    )}
                  />
                  {errors.segment && (
                    <p className="mt-1 text-xs text-danger">{errors.segment.message}</p>
                  )}
                </div>

                <div>
                  <Input
                    label="Confidence Score (1-100)"
                    type="number"
                    placeholder="85"
                    error={errors.confidenceScore?.message}
                    {...register('confidenceScore', { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Textarea
                    label="Signal / Action Required"
                    placeholder="Review high value portfolio allocation..."
                    error={errors.actionRequired?.message}
                    {...register('actionRequired')}
                  />
                </div>

                <Button type="submit" className="w-full mt-2" loading={mutation.isPending}>
                  Publish Signal
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Segment Donut Analytics Card */}
          <div className="rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur flex flex-col items-center justify-center">
            <h4 className="w-full mb-3 text-left font-display font-semibold text-content text-sm">
              Portfolio Segment Mix
            </h4>
            <DonutChart
              data={segmentDonutData}
              center={
                <div className="text-center">
                  <span className="text-2xl font-bold font-display text-content">100%</span>
                  <p className="text-3xs text-content-subtle uppercase">Target mix</p>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Live Signal Stream Data Table */}
      <div className="animate-gsap-card rounded-3xl border border-line bg-surface/40 p-5 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-content text-base">Active Signal Stream</h3>
            <p className="text-xs text-content-subtle">
              Real-time feed of clients flagged with high readiness vectors.
            </p>
          </div>
          <Badge variant="brand" dot>
            {clients.length} Active Targets
          </Badge>
        </div>
        {isLoading ? (
          <div className="py-12 text-center text-sm text-content-subtle">
            Fetching signal register...
          </div>
        ) : (
          <DataTable data={clients} columns={columns} rowKey={(r) => r.id} />
        )}
      </div>
    </div>
  )
}
export default Dashboard
