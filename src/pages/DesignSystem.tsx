import { useState } from 'react'
import {
  Activity,
  Bell,
  Boxes,
  Check,
  Command,
  CreditCard,
  Layers,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  Avatar,
  AvatarGroup,
  Badge,
  BarChart,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Dialog,
  DonutChart,
  Drawer,
  Dropdown,
  EmptyState,
  Eyebrow,
  GlassPanel,
  Heading,
  Input,
  LineChart,
  LoadingOverlay,
  Notification,
  PasswordInput,
  Progress,
  ProgressRing,
  SearchInput,
  Select,
  Skeleton,
  SkeletonStat,
  Sparkline,
  Spinner,
  StatCard,
  StatusDot,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Textarea,
  Timeline,
  Tooltip,
  useToast,
} from '@/components/ui'
import type { Column } from '@/components/ui'

/** Living style guide — exercises every design-system component. */
function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-content-subtle">
        {title}
      </h2>
      <div className="rounded-3xl border border-line bg-surface/60 p-6 backdrop-blur">{children}</div>
    </section>
  )
}

interface DemoRow {
  id: string
  name: string
  segment: string
  readiness: number
}

const rows: DemoRow[] = [
  { id: '1', name: 'Aarav Mehta', segment: 'Affluent', readiness: 87 },
  { id: '2', name: 'Diya Sharma', segment: 'Mass Affluent', readiness: 64 },
  { id: '3', name: 'Kabir Rao', segment: 'HNI', readiness: 92 },
  { id: '4', name: 'Ananya Nair', segment: 'Emerging', readiness: 41 },
]

const columns: Column<DemoRow>[] = [
  {
    key: 'name',
    header: 'Customer',
    sortable: true,
    render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar name={r.name} size="sm" />
        <span className="font-medium">{r.name}</span>
      </div>
    ),
  },
  { key: 'segment', header: 'Segment', render: (r) => <Badge variant="brand">{r.segment}</Badge> },
  {
    key: 'readiness',
    header: 'Readiness',
    sortable: true,
    align: 'right',
    render: (r) => <span className="font-mono tabular-nums">{r.readiness}</span>,
  },
]

export default function DesignSystem() {
  const toast = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sw, setSw] = useState(true)
  const [sel, setSel] = useState('affluent')
  const [loading, setLoading] = useState(false)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-14">
        <Breadcrumb items={[{ label: 'SUYOGYA' }, { label: 'Design System' }]} className="mb-4" />
        <Eyebrow>
          <Sparkles className="h-3.5 w-3.5" /> Enterprise Design System
        </Eyebrow>
        <Heading as="h1" size="h1" className="mt-3">
          SUYOGYA <span className="text-gradient-sbi">Component Library</span>
        </Heading>
        <Text tone="muted" size="lg" className="mt-3 max-w-2xl">
          Apple-grade primitives — glass, spatial depth, SBI Blue. Every element is reusable,
          accessible, and motion-tuned.
        </Text>
      </header>

      <div className="space-y-14">
        <Section title="Typography" id="type">
          <div className="space-y-3">
            <Heading size="display" as="h2" className="!text-display-sm md:!text-display-md">
              Know when to engage.
            </Heading>
            <Heading size="h2">Heading 2 — Section title</Heading>
            <Heading size="h4">Heading 4 — Card title</Heading>
            <Text size="lg">Large body — premium reading size for hero paragraphs.</Text>
            <Text tone="muted">Muted body — secondary descriptive content.</Text>
            <Text tone="subtle" size="sm">
              Subtle caption — metadata and hints.
            </Text>
          </div>
        </Section>

        <Section title="Buttons" id="buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button leftIcon={<Sparkles className="h-4 w-4" />}>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="glass">Glass</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button size="lg" rightIcon={<TrendingUp className="h-4 w-4" />}>
              Large
            </Button>
            <Button size="icon" variant="secondary" aria-label="Command">
              <Command className="h-4 w-4" />
            </Button>
          </div>
        </Section>

        <Section title="Premium Dashboard Cards" id="stats">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Ready customers"
              value={12480}
              delta={0.124}
              icon={<Users className="h-4.5 w-4.5" />}
              spark={[4, 6, 5, 8, 7, 10, 9, 12]}
              accent
            />
            <StatCard
              label="Engagement value"
              value={4820000}
              format={(v) => `₹${(v / 1_00_000).toFixed(1)}L`}
              delta={0.083}
              icon={<CreditCard className="h-4.5 w-4.5" />}
              spark={[3, 4, 4, 5, 6, 6, 7, 8]}
            />
            <StatCard
              label="Avg. confidence"
              value={91}
              format={(v) => `${v}%`}
              delta={-0.021}
              icon={<Activity className="h-4.5 w-4.5" />}
            />
            <StatCard
              label="Live signals"
              value={342}
              delta={0.31}
              icon={<Bell className="h-4.5 w-4.5" />}
              spark={[2, 3, 5, 4, 7, 9, 8, 11]}
            />
          </div>
        </Section>

        <Section title="Cards & Glass Panels" id="cards">
          <div className="grid gap-5 md:grid-cols-3">
            <Card variant="solid" interactive>
              <CardHeader>
                <CardTitle>Solid card</CardTitle>
                <CardDescription>Hairline border, elev-1 shadow.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text tone="muted" size="sm">
                  The workspace default surface.
                </Text>
              </CardContent>
            </Card>
            <Card variant="glass" interactive>
              <CardHeader>
                <CardTitle>Glass panel</CardTitle>
                <CardDescription>Frosted, backdrop-blurred.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text tone="muted" size="sm">
                  Real glass morphism with inner highlight.
                </Text>
              </CardContent>
            </Card>
            <Card variant="gradient" interactive>
              <CardHeader>
                <CardTitle>Gradient card</CardTitle>
                <CardDescription>SBI-tinted premium surface.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text tone="muted" size="sm">
                  For highlighted, high-value modules.
                </Text>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section title="Inputs & Controls" id="inputs">
          <div className="grid max-w-2xl gap-5">
            <Input label="Full name" placeholder="Aarav Mehta" hint="As per KYC records." />
            <SearchInput label="Search customers" />
            <PasswordInput label="Password" placeholder="••••••••" />
            <Textarea label="Notes" placeholder="Relationship manager notes…" />
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-content">Segment</label>
                <Select
                  value={sel}
                  onChange={setSel}
                  options={[
                    { value: 'hni', label: 'High Net Worth' },
                    { value: 'affluent', label: 'Affluent' },
                    { value: 'mass', label: 'Mass Affluent' },
                    { value: 'emerging', label: 'Emerging' },
                  ]}
                />
              </div>
              <div className="flex items-end">
                <Switch checked={sw} onChange={setSw} label="Auto-approve high confidence" />
              </div>
            </div>
          </div>
        </Section>

        <Section title="Badges, Avatars & Status" id="badges">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="brand" dot>Brand</Badge>
            <Badge variant="success" dot>Approved</Badge>
            <Badge variant="warning">Review</Badge>
            <Badge variant="danger">Rejected</Badge>
            <Badge variant="solid">
              <Sparkles className="h-3 w-3" /> AI
            </Badge>
            <Badge variant="outline">Outline</Badge>
            <span className="mx-2 h-6 w-px bg-line" />
            <AvatarGroup names={['Aarav Mehta', 'Diya Sharma', 'Kabir Rao', 'Ananya Nair', 'Ishaan Roy']} />
            <span className="mx-2 h-6 w-px bg-line" />
            <StatusDot status="online" label="Engine online" />
            <StatusDot status="idle" label="Queued" />
          </div>
        </Section>

        <Section title="Progress & Gauges" id="progress">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_auto]">
            <div className="space-y-4">
              <Progress value={82} label />
              <Progress value={54} size="sm" />
              <Progress value={38} size="lg" gradient={false} />
            </div>
            <ProgressRing value={87} size={128}>
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-content">87</div>
                <div className="text-2xs uppercase tracking-wide text-content-subtle">Ready</div>
              </div>
            </ProgressRing>
            <div className="flex flex-col items-center gap-2">
              <Sparkline data={[3, 5, 4, 7, 6, 9, 8, 12, 11, 14]} width={140} height={48} />
              <Text tone="subtle" size="xs">
                Sparkline
              </Text>
            </div>
          </div>
        </Section>

        <Section title="Charts" id="charts">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <Text tone="muted" size="sm" className="mb-4">
                Readiness by segment
              </Text>
              <BarChart
                data={[
                  { label: 'HNI', value: 92 },
                  { label: 'Afflnt', value: 74 },
                  { label: 'Mass', value: 61 },
                  { label: 'Emrg', value: 43 },
                ]}
              />
            </div>
            <div className="grid place-items-center">
              <DonutChart
                data={[
                  { label: 'Ready', value: 48 },
                  { label: 'Emerging', value: 32 },
                  { label: 'Not yet', value: 20 },
                ]}
                center={
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold">48%</div>
                    <div className="text-2xs text-content-subtle">Ready</div>
                  </div>
                }
              />
            </div>
            <div className="lg:col-span-1">
              <Text tone="muted" size="sm" className="mb-4">
                Engagement trend
              </Text>
              <LineChart
                series={[
                  { name: 'Signals', data: [12, 18, 15, 24, 22, 30, 28, 38] },
                  { name: 'Actions', data: [6, 9, 11, 14, 13, 18, 21, 26] },
                ]}
              />
            </div>
          </div>
        </Section>

        <Section title="Tabs" id="tabs">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Text tone="muted">Overview panel content with smooth shared-layout indicator.</Text>
            </TabsContent>
            <TabsContent value="evidence">
              <Text tone="muted">Evidence panel content.</Text>
            </TabsContent>
            <TabsContent value="reasoning">
              <Text tone="muted">Reasoning panel content.</Text>
            </TabsContent>
          </Tabs>
        </Section>

        <Section title="Data Table" id="table">
          <DataTable columns={columns} data={rows} rowKey={(r) => r.id} onRowClick={() => toast.info('Row selected')} />
        </Section>

        <Section title="Timeline" id="timeline">
          <Timeline
            items={[
              {
                id: '1',
                title: 'Salary credited',
                time: '2h ago',
                accent: 'success',
                icon: <TrendingUp className="h-4 w-4" />,
                description: '₹1,84,000 inflow detected — recurring pattern confirmed.',
              },
              {
                id: '2',
                title: 'Readiness threshold crossed',
                time: '5h ago',
                accent: 'brand',
                icon: <Activity className="h-4 w-4" />,
                description: 'Investment readiness reached 0.87 confidence.',
              },
              {
                id: '3',
                title: 'Recommendation queued',
                time: '1d ago',
                accent: 'neutral',
                icon: <Layers className="h-4 w-4" />,
              },
            ]}
          />
        </Section>

        <Section title="Overlays" id="overlays">
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open Drawer
            </Button>
            <Dropdown
              trigger={<Button variant="outline">Dropdown menu</Button>}
              items={[
                { key: 'view', label: 'View profile', icon: <Users className="h-4 w-4" /> },
                { key: 'approve', label: 'Approve', icon: <Check className="h-4 w-4" /> },
                'separator',
                { key: 'reject', label: 'Reject', danger: true },
              ]}
            />
            <Tooltip content="Explainability score: 0.91">
              <Button variant="ghost" size="icon" aria-label="Info">
                <Activity className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Button variant="subtle" onClick={() => toast.success('Saved', 'Changes committed to audit log.')}>
              Fire toast
            </Button>
          </div>
        </Section>

        <Section title="Glass Panels & Spatial Layers" id="glass-panels">
          <div className="grid gap-6 md:grid-cols-2">
            <GlassPanel variant="glass" padding="md" interactive className="flex flex-col gap-2">
              <Badge variant="brand" className="w-fit">Standard Glass</Badge>
              <h4 className="font-display font-semibold text-content text-base mt-2">Frosted Glass Panel</h4>
              <p className="text-sm text-content-muted">
                Transparent canvas filter using 20px saturate blur. Used for content blocks resting on gradient background meshes.
              </p>
            </GlassPanel>
            <GlassPanel variant="glass-strong" padding="md" interactive className="flex flex-col gap-2">
              <Badge variant="success" className="w-fit">Strong Glass</Badge>
              <h4 className="font-display font-semibold text-content text-base mt-2">Strong Glass Panel</h4>
              <p className="text-sm text-content-muted">
                Denser frosted layer using 28px saturate blur. Used for slide-out drawers, context menus, and navigation shells.
              </p>
            </GlassPanel>
          </div>
        </Section>

        <Section title="Inline Notifications & Banners" id="notifications">
          <div className="grid gap-4">
            <Notification
              variant="info"
              title="System Upgrade Pending"
              description="A new digital advisory model is scheduled to deploy at 04:00 IST."
            />
            <Notification
              variant="success"
              title="AUM Balance Synchronized"
              description="Successfully indexed wealth pools from Central Database API."
            />
            <Notification
              variant="warning"
              title="KYC Verification Overdue"
              description="Relationship manager review is requested for selected HNI accounts."
            />
            <Notification
              variant="danger"
              title="Signal Link Interrupted"
              description="Axios interface returned 502 Bad Gateway while pulling signal stream."
            />
          </div>
        </Section>

        <Section title="Layout & Shell Demos" id="shell">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface/50 p-4">
              <Text tone="muted" size="xs" className="mb-2 uppercase tracking-wider font-semibold">Mock Navbar Shell</Text>
              <div className="flex items-center justify-between rounded-xl border border-line bg-surface/80 p-3 shadow-elev-1">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-sbi-gradient flex items-center justify-center"><Sparkles className="h-3 w-3 text-white" /></div>
                  <span className="font-display text-xs font-bold text-content">SUYOGYA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success animate-ping" />
                  <span className="text-[10px] font-semibold text-content-muted">ONLINE</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-surface/50 p-4">
              <Text tone="muted" size="xs" className="mb-2 uppercase tracking-wider font-semibold">Mock Sidebar Drawer</Text>
              <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface/85 p-3 shadow-elev-1 w-44">
                <span className="text-[9px] font-bold text-content-subtle uppercase px-2">Core Engine</span>
                <div className="flex items-center gap-2 rounded-lg bg-sbi-50 px-2 py-1 text-2xs font-semibold text-sbi-600 dark:bg-sbi-950/20 dark:text-sbi-400">
                  <Activity className="h-3.5 w-3.5" />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 text-2xs font-medium text-content-muted">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Signal Stream</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Theme Tokens & Foundations" id="tokens">
          <div className="space-y-6">
            <div>
              <Text tone="muted" size="xs" className="mb-2 uppercase tracking-wider font-semibold">Brand Color Ramp (SBI Blue & Ink)</Text>
              <div className="grid grid-cols-5 gap-2 text-center text-3xs font-mono">
                <div className="h-10 rounded bg-[#eef4ff] text-sbi-955 flex items-center justify-center">50</div>
                <div className="h-10 rounded bg-[#bcd3ff] text-sbi-955 flex items-center justify-center">200</div>
                <div className="h-10 rounded bg-[#2f6bf5] text-white flex items-center justify-center">500</div>
                <div className="h-10 rounded bg-[#163fad] text-white flex items-center justify-center">700</div>
                <div className="h-10 rounded bg-[#0f1e45] text-white flex items-center justify-center">950</div>
              </div>
            </div>

            <div>
              <Text tone="muted" size="xs" className="mb-2 uppercase tracking-wider font-semibold">Gradients & Shadows</Text>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 rounded-xl bg-sbi-gradient flex items-center justify-center text-xs font-bold text-white">
                  SBI Gradient
                </div>
                <div className="h-12 rounded-xl bg-surface border border-line shadow-glow-sbi flex items-center justify-center text-xs font-bold text-sbi-600">
                  Shadow Glow SBI
                </div>
              </div>
            </div>

            <div>
              <Text tone="muted" size="xs" className="mb-2 uppercase tracking-wider font-semibold">Spacing & Scale</Text>
              <div className="flex items-end gap-3 h-14 bg-surface-raised/40 p-3 rounded-xl border border-line">
                <div className="w-1 bg-sbi-500 rounded" style={{ height: '4px' }} title="xs: 4px" />
                <div className="w-2 bg-sbi-500 rounded" style={{ height: '8px' }} title="sm: 8px" />
                <div className="w-4 bg-sbi-500 rounded" style={{ height: '16px' }} title="md: 16px" />
                <div className="w-6 bg-sbi-500 rounded" style={{ height: '24px' }} title="lg: 24px" />
                <div className="w-8 bg-sbi-500 rounded" style={{ height: '32px' }} title="xl: 32px" />
              </div>
            </div>
          </div>
        </Section>

        <Section title="Loading & Empty States" id="states">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <SkeletonStat />
            </div>
            <div className="flex items-center justify-center rounded-2xl border border-line">
              {loading ? (
                <LoadingOverlay label="Reasoning" />
              ) : (
                <div className="flex flex-col items-center gap-3 py-10">
                  <Spinner size={28} className="text-sbi-600" />
                  <Button size="sm" variant="ghost" onClick={() => setLoading((l) => !l)}>
                    Toggle overlay
                  </Button>
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-line">
              <EmptyState
                icon={<Boxes className="h-6 w-6" />}
                title="No evidence yet"
                description="Signals will appear as the customer transacts."
                action={<Button size="sm">Refresh</Button>}
              />
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </Section>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Approve recommendation"
        description="This action will be recorded in the compliance audit trail."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDialogOpen(false)
                toast.success('Recommendation approved')
              }}
            >
              Approve
            </Button>
          </>
        }
      >
        <Text tone="muted">
          The AI recommends offering a SIP-linked investment product based on a confirmed salary
          pattern and stated retirement goal.
        </Text>
      </Dialog>

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Customer detail"
        description="Aarav Mehta · Affluent"
        footer={
          <Button className="w-full" onClick={() => setDrawerOpen(false)}>
            Done
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name="Aarav Mehta" size="xl" ring />
            <div>
              <p className="font-semibold text-content">Aarav Mehta</p>
              <StatusDot status="online" label="Active this week" />
            </div>
          </div>
          <Progress value={87} label />
          <Text tone="muted" size="sm">
            Drawer content slides in from the edge with an eased spring and a scroll-locked overlay.
          </Text>
        </div>
      </Drawer>
    </div>
  )
}
