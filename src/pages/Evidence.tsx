import { useState, useRef, useEffect } from 'react'
import {
  Info,
  Play,
  Pause,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Layers,
  ZoomIn,
  ZoomOut,
  Clock,
} from 'lucide-react'
import { Button, Badge, GlassPanel, Card, CardHeader, CardTitle, CardContent, useToast } from '@/components/ui'
import { cn } from '@/lib/utils'

// ----------------------------------------------------
// Mock Evidence Graph Data
// ----------------------------------------------------
interface EvidenceNode {
  id: string
  label: string
  category: 'core' | 'transactional' | 'behavioral' | 'compliance'
  subCategory?: string
  confidence: number // 0-100 (heatmap scale)
  step: number // timeline step (0 to 5)
  x: number // default layout x coordinate
  y: number // default layout y coordinate
  parentId?: string
  desc: string
}

interface EvidenceEdge {
  from: string
  to: string
  type: 'primary' | 'secondary'
}

const initialNodes: EvidenceNode[] = [
  // Central Core Node
  { id: 'core-client', label: 'Kabir Rao (Core HNI)', category: 'core', confidence: 95, step: 0, x: 250, y: 220, desc: 'Central client intelligence vector core.' },
  
  // Cluster Parent Nodes
  { id: 'parent-ledger', label: 'Direct Ledger Inflows', category: 'transactional', confidence: 98, step: 1, x: 100, y: 120, desc: 'Ingested bank credits and cash ledger details.' },
  { id: 'parent-session', label: 'Digital Session Triggers', category: 'behavioral', confidence: 85, step: 2, x: 400, y: 120, desc: 'Logged dashboard sessions and email clicks.' },
  { id: 'parent-audit', label: 'Institutional Compliance', category: 'compliance', confidence: 92, step: 3, x: 250, y: 350, desc: 'Institutional audit registries and checks.' },
  
  // Ledger Sub-nodes (Step 1 & 4)
  { id: 'sub-venture', label: 'Venture payout (₹1.2Cr)', category: 'transactional', parentId: 'parent-ledger', confidence: 98, step: 1, x: 40, y: 50, desc: 'Venture capital liquidation transaction recorded.' },
  { id: 'sub-dividend', label: 'Dividend credit (₹4.5L)', category: 'transactional', parentId: 'parent-ledger', confidence: 94, step: 4, x: 30, y: 180, desc: 'Equity stock dividend payouts ledger entry.' },
  { id: 'sub-interest', label: 'Debt yield inflow (₹1.8L)', category: 'transactional', parentId: 'parent-ledger', confidence: 90, step: 4, x: 120, y: 40, desc: 'Corporate bond coupon interest received.' },

  // Session Sub-nodes (Step 2 & 5)
  { id: 'sub-logins', label: 'Portfolio tab views', category: 'behavioral', parentId: 'parent-session', confidence: 88, step: 2, x: 440, y: 40, desc: 'Repeat view logs on alternate investments tab.' },
  { id: 'sub-emails', label: 'Tax email opens', category: 'behavioral', parentId: 'parent-session', confidence: 80, step: 5, x: 480, y: 120, desc: 'Open checks logged on PMS ELSS yield emails.' },
  { id: 'sub-clicks', label: 'Command Center triggers', category: 'behavioral', parentId: 'parent-session', confidence: 76, step: 5, x: 420, y: 200, desc: 'Button click metrics tracking on RM advisories.' },

  // Compliance Sub-nodes (Step 3 & 5)
  { id: 'sub-aml', label: 'AML verification checks', category: 'compliance', parentId: 'parent-audit', confidence: 100, step: 3, x: 140, y: 390, desc: 'Anti-money laundering background validation cleared.' },
  { id: 'sub-kyc', label: 'KYC registries status', category: 'compliance', parentId: 'parent-audit', confidence: 96, step: 3, x: 360, y: 390, desc: 'Client KYC details verified via central registry.' },
  { id: 'sub-margins', label: 'Volatility margin risk', category: 'compliance', parentId: 'parent-audit', confidence: 84, step: 5, x: 250, y: 440, desc: 'Client portfolio risk threshold check approved.' },
]

const initialEdges: EvidenceEdge[] = [
  // Parent links
  { from: 'parent-ledger', to: 'core-client', type: 'primary' },
  { from: 'parent-session', to: 'core-client', type: 'primary' },
  { from: 'parent-audit', to: 'core-client', type: 'primary' },
  
  // Ledger sub links
  { from: 'sub-venture', to: 'parent-ledger', type: 'secondary' },
  { from: 'sub-dividend', to: 'parent-ledger', type: 'secondary' },
  { from: 'sub-interest', to: 'parent-ledger', type: 'secondary' },

  // Session sub links
  { from: 'sub-logins', to: 'parent-session', type: 'secondary' },
  { from: 'sub-emails', to: 'parent-session', type: 'secondary' },
  { from: 'sub-clicks', to: 'parent-session', type: 'secondary' },

  // Compliance sub links
  { from: 'sub-aml', to: 'parent-audit', type: 'secondary' },
  { from: 'sub-kyc', to: 'parent-audit', type: 'secondary' },
  { from: 'sub-margins', to: 'parent-audit', type: 'secondary' },
]

export function Evidence() {
  const toast = useToast()
  
  // 1. Navigation, Search & Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [filterTransactional, setFilterTransactional] = useState(true)
  const [filterBehavioral, setFilterBehavioral] = useState(true)
  const [filterCompliance, setFilterCompliance] = useState(true)
  
  // Expanded nodes map: tracks if parent clusters are expanded
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    'parent-ledger': true,
    'parent-session': true,
    'parent-audit': true,
  })

  // Selected Node Focus
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('core-client')

  // 2. Timeline Replay State
  const [timelineStep, setTimelineStep] = useState(5) // default show all
  const [isPlaying, setIsPlaying] = useState(false)

  // 3. Zoom & Pan State
  const [zoom, setZoom] = useState(1.0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const viewportRef = useRef<HTMLDivElement>(null)

  // Timeline playback loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineStep((prev) => {
          if (prev >= 5) {
            setIsPlaying(false)
            toast.info('Replay Completed', 'All chronologically Ingested evidence nodes are visible.')
            return 5
          }
          return prev + 1
        })
      }, 1500)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, toast])

  const togglePlay = () => {
    if (timelineStep >= 5 && !isPlaying) {
      setTimelineStep(0) // restart
    }
    setIsPlaying(!isPlaying)
  }

  const handleResetReplay = () => {
    setIsPlaying(false)
    setTimelineStep(5)
  }

  // 4. Zoom & Pan Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Left click only
    setIsDragging(true)
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = 0.08
    setZoom((prev) => {
      const nextZoom = e.deltaY < 0 ? prev + zoomFactor : prev - zoomFactor
      return Math.max(0.5, Math.min(3.0, nextZoom)) // clamp between 0.5x and 3x
    })
  }

  const handleZoomIn = () => setZoom((z) => Math.min(3.0, z + 0.2))
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, z - 0.2))
  const handleResetView = () => {
    setZoom(1.0)
    setPan({ x: 0, y: 0 })
    toast.success('Viewport Reset', 'Graph zoom and pan translations restored to defaults.')
  }

  // 5. Toggle Parent Expansion
  const toggleParentNode = (id: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Compute active filters
  const isCategoryVisible = (category: string) => {
    if (category === 'core') return true
    if (category === 'transactional') return filterTransactional
    if (category === 'behavioral') return filterBehavioral
    if (category === 'compliance') return filterCompliance
    return true
  }

  // Filter nodes: visibility check
  const visibleNodes = initialNodes.filter((node) => {
    // 1. Category check
    if (!isCategoryVisible(node.category)) return false
    
    // 2. Timeline Step check
    if (node.step > timelineStep) return false

    // 3. Parent expansion check: if it has a parent, check if that parent is expanded
    if (node.parentId && !expandedParents[node.parentId]) return false

    return true
  })

  // Filter edges: check if both nodes are visible
  const visibleEdges = initialEdges.filter((edge) => {
    const fromVisible = visibleNodes.some((n) => n.id === edge.from)
    const toVisible = visibleNodes.some((n) => n.id === edge.to)
    return fromVisible && toVisible
  })

  const selectedNode = initialNodes.find((n) => n.id === selectedNodeId)

  // Node styles / color mapping
  const getNodeColor = (node: EvidenceNode) => {
    const isFocused = selectedNodeId === node.id
    
    // Search query highlight override
    if (searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase())) {
      return 'fill-[#3b82f6] stroke-[#3b82f6] text-white shadow-glow-sbi'
    }

    if (showHeatmap) {
      if (node.confidence >= 90) return isFocused ? 'fill-[#059669] stroke-[#10b981]' : 'fill-[#10b981] stroke-[#059669]' // Green
      if (node.confidence >= 75) return isFocused ? 'fill-[#d97706] stroke-[#f59e0b]' : 'fill-[#f59e0b] stroke-[#d97706]' // Amber
      return isFocused ? 'fill-[#dc2626] stroke-[#ef4444]' : 'fill-[#ef4444] stroke-[#dc2626]' // Red
    }

    // Default category style
    if (node.category === 'core') return isFocused ? 'fill-[#1e40af] stroke-[#2f6bf5]' : 'fill-[#2f6bf5] stroke-[#1e40af]'
    if (node.category === 'transactional') return isFocused ? 'fill-[#047857] stroke-[#10b981]' : 'fill-[#10b981] stroke-[#047857]'
    if (node.category === 'behavioral') return isFocused ? 'fill-[#6d28d9] stroke-[#8b5cf6]' : 'fill-[#8b5cf6] stroke-[#6d28d9]'
    return isFocused ? 'fill-[#b45309] stroke-[#f59e0b]' : 'fill-[#f59e0b] stroke-[#b45309]'
  }

  return (
    <div className="space-y-6">
      {/* 1. Dashboard Title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-content md:text-3xl">
            Evidence <span className="text-gradient-sbi">Explorer Cockpit</span>
          </h1>
          <p className="text-sm text-content-muted">
            Knowledge Graph auditing data sources reliability. Hold and drag to pan, scroll wheel to zoom.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            leftIcon={showHeatmap ? <Eye className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
            onClick={() => {
              setShowHeatmap(!showHeatmap)
              toast.info('Confidence Heatmap Toggled', showHeatmap ? 'Standard category view active.' : 'Heatmap index active.')
            }}
          >
            {showHeatmap ? 'Category View' : 'Confidence Heatmap'}
          </Button>
          <Button variant="primary" onClick={handleResetView}>
            Reset Viewport
          </Button>
        </div>
      </div>

      {/* 2. Visual Explorer Split */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* SVG Viewport & Scrubber timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Zoom/Pan viewport wrapper */}
          <div
            ref={viewportRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            className="relative h-[480px] w-full overflow-hidden border border-line bg-surface/20 rounded-[2rem] cursor-grab active:cursor-grabbing backdrop-blur-xl select-none"
          >
            {/* Viewport Scale/Pan container */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
              className="absolute inset-0 transition-transform duration-75"
            >
              {/* Main SVG Links & Nodes Canvas */}
              <svg className="absolute inset-0 w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible">
                {/* Connecting Edges lines */}
                {visibleEdges.map((edge, idx) => {
                  const fromNode = initialNodes.find((n) => n.id === edge.from)
                  const toNode = initialNodes.find((n) => n.id === edge.to)
                  if (!fromNode || !toNode) return null

                  const isFocusedEdge = selectedNodeId === edge.from || selectedNodeId === edge.to

                  return (
                    <line
                      key={idx}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={isFocusedEdge ? '#3b82f6' : 'hsl(var(--line))'}
                      strokeWidth={isFocusedEdge ? '2.5' : '1.5'}
                      strokeDasharray={edge.type === 'secondary' ? '4,4' : undefined}
                      className={isFocusedEdge ? 'animate-pulse' : undefined}
                    />
                  )
                })}

                {/* Nodes group loops */}
                {visibleNodes.map((node) => {
                  const colorClass = getNodeColor(node)
                  const isParent = node.id.startsWith('parent-')
                  const isCore = node.id === 'core-client'

                  return (
                    <g
                      key={node.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedNodeId(node.id)
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Node circle backdrop */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isCore ? 24 : isParent ? 18 : 12}
                        className={cn('transition-all duration-300 shadow-md stroke-2', colorClass)}
                      />
                      
                      {/* Outer interactive ring on hover */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isCore ? 28 : isParent ? 22 : 16}
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                        className="opacity-0 group-hover:opacity-30 transition-opacity"
                      />

                      {/* Display Label text */}
                      <text
                        x={node.x}
                        y={node.y + (isCore ? 38 : isParent ? 30 : 22)}
                        textAnchor="middle"
                        className="font-display font-semibold text-[10px] text-content tracking-tight select-none pointer-events-none fill-current"
                      >
                        {isCore ? node.label.split(' ')[0] : node.label.split(' ')[0]}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Grid cluster hulls borders indicators (Background decorative) */}
              <div className="absolute left-[80px] top-[140px] border border-dashed border-line p-8 rounded-full pointer-events-none opacity-20 bg-ink-200/5 dark:bg-ink-950/20" />
            </div>

            {/* Viewport Control Overlay (Static widget upper right corner) */}
            <div className="absolute right-4 top-4 flex flex-col gap-2 z-30">
              <Button size="icon" variant="outline" className="h-9 w-9 rounded-xl" onClick={handleZoomIn} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="h-9 w-9 rounded-xl" onClick={handleZoomOut} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Viewport instructions watermark */}
            <div className="absolute left-4 bottom-4 pointer-events-none z-30 flex items-center gap-1.5 text-[10px] text-content-subtle font-semibold uppercase tracking-wider">
              <Info className="h-3.5 w-3.5" /> Grip viewport to Pan • Zoom: {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Timeline Scrubber controls */}
          <GlassPanel variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-sbi-500" />
                <span className="font-display font-semibold text-xs text-content">Timeline Replay Scrubber</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5 text-sbi-600" />}
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={handleResetReplay}>
                  <RotateCcw className="h-4.5 w-4.5" />
                </Button>
                <Badge variant="brand" className="font-mono text-[10px]">Step {timelineStep} / 5</Badge>
              </div>
            </div>

            {/* Slider bar */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="5"
                value={timelineStep}
                onChange={(e) => {
                  setIsPlaying(false)
                  setTimelineStep(Number(e.target.value))
                }}
                className="h-1.5 w-full cursor-pointer rounded-lg bg-line accent-sbi-500"
              />
              <div className="flex justify-between text-[9px] font-bold text-content-subtle tracking-wider uppercase pt-1">
                <span>0. Client Core</span>
                <span>1. Ledger Ingest</span>
                <span>2. Session logs</span>
                <span>3. Compliance</span>
                <span>4. Yield credits</span>
                <span>5. Actions</span>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Filters Side panel & Details Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Detail card panel */}
          <Card variant="solid" className="min-h-[220px]">
            <CardHeader className="border-b border-line pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-4.5 w-4.5 text-sbi-500" />
                  <CardTitle className="text-xs font-bold leading-tight">Evidence audit</CardTitle>
                </div>
                {selectedNode && (
                  <Badge variant={selectedNode.confidence >= 90 ? 'success' : selectedNode.confidence >= 75 ? 'warning' : 'danger'}>
                    {selectedNode.confidence}% Trust
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-4">
              {selectedNode ? (
                <div>
                  <h4 className="font-display font-semibold text-sm text-content leading-tight">{selectedNode.label}</h4>
                  <Badge variant="solid" className="mt-1.5 uppercase text-[9px]">{selectedNode.category}</Badge>
                  <p className="text-content-muted leading-relaxed mt-3">{selectedNode.desc}</p>
                  
                  {/* Parent toggle controls specifically for clusters */}
                  {selectedNode.id.startsWith('parent-') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 flex items-center justify-center gap-1.5 h-9"
                      onClick={() => toggleParentNode(selectedNode.id)}
                    >
                      {expandedParents[selectedNode.id] ? 'Contract Cluster Node' : 'Expand Cluster Node'}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-content-subtle font-semibold">
                  Click any graph node to inspect audit descriptions.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filters card */}
          <GlassPanel variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <Filter className="h-4.5 w-4.5 text-sbi-500" />
              <h3 className="font-display font-semibold text-content text-sm">Filters & Highlights</h3>
            </div>

            <div className="space-y-4 text-xs">
              {/* Text search highlight */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-subtle" />
                <input
                  type="text"
                  placeholder="Highlight nodes (e.g. payout)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-line bg-surface/50 text-xs text-content outline-none focus:border-sbi-400 transition-all"
                />
              </div>

              {/* Layer checkboxes */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-content-subtle uppercase tracking-wider mb-2.5">Visible Clusters</h4>
                
                <label className="flex items-center gap-2.5 cursor-pointer text-content font-medium">
                  <input
                    type="checkbox"
                    checked={filterTransactional}
                    onChange={(e) => setFilterTransactional(e.target.checked)}
                    className="h-4 w-4 rounded border-line accent-sbi-500"
                  />
                  <span>Ledger Transactions</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-content font-medium">
                  <input
                    type="checkbox"
                    checked={filterBehavioral}
                    onChange={(e) => setFilterBehavioral(e.target.checked)}
                    className="h-4 w-4 rounded border-line accent-sbi-500"
                  />
                  <span>Digital Footprints</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-content font-medium">
                  <input
                    type="checkbox"
                    checked={filterCompliance}
                    onChange={(e) => setFilterCompliance(e.target.checked)}
                    className="h-4 w-4 rounded border-line accent-sbi-500"
                  />
                  <span>Compliance Audits</span>
                </label>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Connection flows css helpers keyframes */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-dash-flow {
          animation: dash 1.8s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default Evidence
