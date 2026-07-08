import { useState, useEffect, useRef } from 'react'
import {
  Cpu,
  Terminal,
  AlertTriangle,
  CheckCircle,
  Play,
  RotateCcw,
} from 'lucide-react'
import { Button, Badge, GlassPanel, Card, CardHeader, CardTitle, CardContent, useToast } from '@/components/ui'
import { cn } from '@/lib/utils'

// ----------------------------------------------------
// Mock System Diagnostics logs generator
// ----------------------------------------------------
interface SystemLogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'success'
  source: 'API' | 'DB' | 'REASONING' | 'QUEUE'
  message: string
}

const initialLogs: SystemLogEntry[] = [
  { timestamp: '17:32:01', level: 'info', source: 'API', message: 'API Gateway router initialized at port 8080.' },
  { timestamp: '17:32:02', level: 'success', source: 'DB', message: 'PostgreSQL connection pool verified. Idle: 18, Active: 2.' },
  { timestamp: '17:32:05', level: 'info', source: 'REASONING', message: 'Reasoning Engine neural model weights cached successfully.' },
  { timestamp: '17:32:08', level: 'info', source: 'QUEUE', message: 'Background worker thread pool spawned. Count: 3.' },
  { timestamp: '17:32:12', level: 'success', source: 'API', message: 'GET /signals - 200 OK - 15ms - Kabir Rao.' },
  { timestamp: '17:32:15', level: 'warn', source: 'QUEUE', message: 'Queue item Q-8742 delay index increased above normal. Retrying.' },
  { timestamp: '17:32:18', level: 'success', source: 'QUEUE', message: 'Queue item Q-8742 process completed successfully.' },
]

const randomLogMessages = [
  { level: 'info', source: 'API', message: 'GET /clients - 200 OK - 24ms - Diya Sharma.' },
  { level: 'success', source: 'REASONING', message: 'Intent readiness sphere calibrated. Target: Aarav Mehta.' },
  { level: 'info', source: 'DB', message: 'Pruned 12 expired transaction session references.' },
  { level: 'warn', source: 'API', message: 'Rate limit bucket approaching threshold for user RM-8742.' },
  { level: 'info', source: 'QUEUE', message: 'RM SSO approval token cached for validation.' },
  { level: 'success', source: 'API', message: 'POST /recommendations/approve - 201 Created - 42ms.' },
]

export function Monitoring() {
  const toast = useToast()
  
  // Real-time live metrics simulation state
  const [cpuUsage, setCpuUsage] = useState(34)
  const [memoryUsage, setMemoryUsage] = useState(1.2)
  const [queueCount, setQueueCount] = useState(4)
  const [systemLogs, setSystemLogs] = useState<SystemLogEntry[]>(initialLogs)
  const [isLiveStreaming, setIsLiveStreaming] = useState(true)

  const logsEndRef = useRef<HTMLDivElement>(null)

  // 1. Live stream simulator
  useEffect(() => {
    if (!isLiveStreaming) return

    const interval = setInterval(() => {
      // 1. Fluctuates CPU usage slightly
      setCpuUsage((prev) => {
        const change = Math.floor(Math.random() * 7) - 3 // -3 to +3
        const next = prev + change
        return Math.max(10, Math.min(95, next))
      })

      // 2. Fluctuates Memory usage slightly
      setMemoryUsage((prev) => {
        const change = (Math.random() * 0.1) - 0.05 // -0.05 to +0.05
        const next = parseFloat((prev + change).toFixed(2))
        return Math.max(0.8, Math.min(4.0, next))
      })

      // 3. Fluctuates Queue depth slightly
      setQueueCount((prev) => {
        if (Math.random() > 0.6) {
          const change = Math.random() > 0.5 ? 1 : -1
          const next = prev + change
          return Math.max(0, Math.min(15, next))
        }
        return prev
      })

      // 4. Appends a new random log entry
      if (Math.random() > 0.4) {
        const date = new Date()
        const timeStr = date.toTimeString().split(' ')[0]
        const randomMsg = randomLogMessages[Math.floor(Math.random() * randomLogMessages.length)]
        
        setSystemLogs((prev) => [
          ...prev.slice(-30), // Cap history size to prevent memory leaks
          {
            timestamp: timeStr,
            level: randomMsg.level as 'info' | 'warn' | 'success',
            source: randomMsg.source as 'API' | 'DB' | 'REASONING' | 'QUEUE',
            message: randomMsg.message,
          },
        ])
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [isLiveStreaming])

  // 2. Auto-scroll terminal log console to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [systemLogs])

  const handlePruneLogs = () => {
    setSystemLogs([])
    toast.success('Logs Console Cleared', 'Live telemetry stream history flushed.')
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-content md:text-3xl">
            System <span className="text-gradient-sbi">Monitoring Center</span>
          </h1>
          <p className="text-sm text-content-muted">
            Auditing real-time CPU clusters, database connection pools, reasoning latencies, and logging.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={isLiveStreaming ? 'secondary' : 'primary'}
            leftIcon={<Play className="h-4 w-4" />}
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
          >
            {isLiveStreaming ? 'Pause Stream' : 'Resume Stream'}
          </Button>
          <Button variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={handlePruneLogs}>
            Clear Console
          </Button>
        </div>
      </div>

      {/* Online components health deck grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <GlassPanel variant="glass" padding="md" className="border border-line flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-content-subtle uppercase tracking-wider block">API Gateway Gateway</span>
            <span className="font-semibold text-content text-sm block">12ms Latency</span>
          </div>
          <Badge variant="success">HEALTHY</Badge>
        </GlassPanel>

        <GlassPanel variant="glass" padding="md" className="border border-line flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Postgres Database DB</span>
            <span className="font-semibold text-content text-sm block">6ms Query rate</span>
          </div>
          <Badge variant="success">CONNECTED</Badge>
        </GlassPanel>

        <GlassPanel variant="glass" padding="md" className="border border-line flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Reasoning Core CPU</span>
            <span className="font-semibold text-content text-sm block">98.4% Confidence</span>
          </div>
          <Badge variant="success">ACTIVE</Badge>
        </GlassPanel>

        <GlassPanel variant="glass" padding="md" className="border border-line flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-content-subtle uppercase tracking-wider block">Background Workers</span>
            <span className="font-semibold text-content text-sm block">3 Active threads</span>
          </div>
          <Badge variant="success">ONLINE</Badge>
        </GlassPanel>
      </div>

      {/* Resource progress meters and Logs panel */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Resource gauges (Left) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="solid" className="border border-line">
            <CardHeader className="border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-sbi-500" />
                <CardTitle>System resources</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-5 text-xs">
              {/* CPU utilization bar */}
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-content">
                  <span>CPU Usage</span>
                  <span className="font-mono">{cpuUsage}%</span>
                </div>
                <div className="h-2 w-full bg-surface-raised rounded-full overflow-hidden border border-line">
                  <div
                    className={cn(
                      'h-full transition-all duration-1000',
                      cpuUsage > 80 ? 'bg-red-500' : cpuUsage > 60 ? 'bg-warning' : 'bg-sbi-500'
                    )}
                    style={{ width: `${cpuUsage}%` }}
                  />
                </div>
              </div>

              {/* Memory utilization bar */}
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-content">
                  <span>Memory consumption</span>
                  <span className="font-mono">{memoryUsage} GB / 8.0 GB</span>
                </div>
                <div className="h-2 w-full bg-surface-raised rounded-full overflow-hidden border border-line">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-1000"
                    style={{ width: `${(memoryUsage / 8.0) * 100}%` }}
                  />
                </div>
              </div>

              {/* Queue Depth bar */}
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-content">
                  <span>Pending Inflow queue</span>
                  <span className="font-mono">{queueCount} items</span>
                </div>
                <div className="h-2 w-full bg-surface-raised rounded-full overflow-hidden border border-line">
                  <div
                    className={cn(
                      'h-full transition-all duration-1000',
                      queueCount > 10 ? 'bg-red-500' : 'bg-emerald-500'
                    )}
                    style={{ width: `${(queueCount / 15) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-content-subtle leading-tight pt-1">
                  Worker processing velocity: <span className="font-mono text-content font-bold">45 tasks/sec</span>.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active warnings and alerts checklist */}
          <GlassPanel variant="glass" padding="md" className="space-y-3">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-4.5 w-4.5 text-warning" />
              <span className="font-display font-bold text-content text-xs">Recent Alert Logs</span>
            </div>
            <div className="space-y-2 text-[10px] text-content-muted">
              <div className="flex items-center gap-2 border-b border-line pb-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Memory spikes cleared (SSO session validation logs).</span>
              </div>
              <div className="flex items-center gap-2 border-b border-line pb-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Ledger synchronization retry completed.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Low network bandwidth trigger cleared.</span>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Live log Console (Right) */}
        <div className="lg:col-span-8 bg-black/90 dark:bg-black/95 rounded-3xl border border-ink-800 p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[450px]">
          {/* Header console title */}
          <div className="flex items-center justify-between border-b border-ink-800 pb-3 mb-3 shrink-0">
            <div className="flex items-center gap-2 text-ink-300">
              <Terminal className="h-4.5 w-4.5 text-sbi-500 animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-wider">SUYOGYA-CORE-SHELL-LOGS:~/telemetry</span>
            </div>
            <div className="flex items-center gap-1.5 text-3xs font-mono text-ink-500 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', isLiveStreaming ? 'bg-emerald-400' : 'bg-red-400')} />
                <span className={cn('relative inline-flex rounded-full h-2 w-2', isLiveStreaming ? 'bg-emerald-500' : 'bg-red-500')} />
              </span>
              <span>{isLiveStreaming ? 'Streaming Live' : 'Stream Paused'}</span>
            </div>
          </div>

          {/* Core logs content container */}
          <div className="flex-1 overflow-y-auto font-mono text-[10px] text-ink-200 space-y-1.5 pr-2 scrollbar-thin select-text">
            {systemLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2.5 items-start leading-normal">
                <span className="text-ink-600 font-medium shrink-0">[{log.timestamp}]</span>
                <span
                  className={cn(
                    'font-extrabold uppercase shrink-0 text-3xs px-1 py-0.5 rounded leading-none text-center min-w-[65px]',
                    log.level === 'success'
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                      : log.level === 'warn'
                        ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                        : 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/30'
                  )}
                >
                  {log.level.toUpperCase()}
                </span>
                <span className="text-ink-400 font-bold shrink-0">[{log.source}]</span>
                <span className="break-all">{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Monitoring
