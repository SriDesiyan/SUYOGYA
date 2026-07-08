import { useState } from 'react'
import {
  Zap,
  Layers,
  TrendingUp,
  Compass,
  Cpu,
  UserCheck,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react'
import { Button, Badge, GlassPanel, Card, CardHeader, CardTitle, CardContent, useToast } from '@/components/ui'
import { cn } from '@/lib/utils'

// ----------------------------------------------------
// Mock Reasoning Pipeline Data
// ----------------------------------------------------
interface PipelineStage {
  id: string
  label: string
  status: string
  confidence: number
  description: string
  supportingEvidence: string[]
  alternativeActions: { name: string; score: number }[]
  rejectedActions: { name: string; reason: string }[]
}

interface ClientReasoning {
  id: string
  name: string
  segment: 'HNI' | 'Affluent'
  targetProduct: string
  readinessScore: number
  stages: PipelineStage[]
}

const mockClientReasoning: ClientReasoning[] = [
  {
    id: 'client-1',
    name: 'Kabir Rao',
    segment: 'HNI',
    targetProduct: 'SBI PMS Bluechip Equity',
    readinessScore: 92,
    stages: [
      {
        id: 'stage-trigger',
        label: '1. Ingestion Trigger',
        status: 'Trigger Detected',
        confidence: 98,
        description: 'Large capital flow credited to client savings ledger.',
        supportingEvidence: [
          'Savings account ledger credit reference: TXN-9842-SB.',
          'Amount: ₹1.2Cr capital credit.',
          'Source: Corporate venture liquidation exit.'
        ],
        alternativeActions: [
          { name: 'Salary increment trigger classification', score: 34 },
          { name: 'Routine wealth interest credit', score: 25 }
        ],
        rejectedActions: [
          { name: 'Legacy deposit maturity renewal', reason: 'Discarded due to capital source registry verification checks.' }
        ]
      },
      {
        id: 'stage-evidence',
        label: '2. Evidence Compilation',
        status: 'Evidence Compiled',
        confidence: 94,
        description: 'Gathering cross-verified registry and behavioral details.',
        supportingEvidence: [
          'Direct bank ledger transaction verification (passed).',
          'KYC corporate registry status verified (active).',
          '3 active dashboard login session checks tracked.'
        ],
        alternativeActions: [
          { name: 'Client self-reported portfolio estimation checks', score: 70 }
        ],
        rejectedActions: [
          { name: 'Social media activity scraping', reason: 'Rejected due to strict data compliance and reliability guidelines.' }
        ]
      },
      {
        id: 'stage-sufficiency',
        label: '3. Evidence Sufficiency',
        status: 'Sufficiency Passed',
        confidence: 92,
        description: 'Data density checks satisfy recommendation minimums.',
        supportingEvidence: [
          'Reliability index score computed at 91%.',
          'Sufficiency score is 1.4x of PMS activation requirements.',
          'Identity and capital source verification completed.'
        ],
        alternativeActions: [
          { name: 'Wait for next quarter interest credits ledger audits', score: 68 }
        ],
        rejectedActions: [
          { name: 'Trigger instant automated SMS advisory alert', reason: 'Blocked to prioritize personalized premium wealth manager outreach.' }
        ]
      },
      {
        id: 'stage-readiness',
        label: '4. Readiness Calibration',
        status: 'Score Calibrated',
        confidence: 87,
        description: 'Calibrating client intent score using vector regression models.',
        supportingEvidence: [
          'Client intent score calculated at 92% readiness.',
          'Alternate investments tab click frequency metrics (high).',
          'KYC updating delay is 0 days.'
        ],
        alternativeActions: [
          { name: 'Classify client vector as passive wealth saver', score: 22 }
        ],
        rejectedActions: [
          { name: 'Classify as emerging segment retail target', reason: 'Rejected since verified assets under management exceed HNI limits.' }
        ]
      },
      {
        id: 'stage-suitability',
        label: '5. Product Suitability',
        status: 'Product Matched',
        confidence: 95,
        description: 'Verifying portfolio asset allocation gaps and risk budgets.',
        supportingEvidence: [
          'Client risk tolerance profile: Medium Risk limits.',
          'Venture exit cash creates 18% portfolio cash drag.',
          'SBI PMS Bluechip matches target yield parameters.'
        ],
        alternativeActions: [
          { name: 'Conservative Corporate Debt yield lock', score: 74 },
          { name: 'Real Estate Infrastructure trust portfolio', score: 68 }
        ],
        rejectedActions: [
          { name: 'Venture Capital high-leverage pools', reason: 'Excluded because risk index exceeds client maximum risk tolerance parameters.' }
        ]
      },
      {
        id: 'stage-planning',
        label: '6. Action Planning',
        status: 'Action Plan Formulated',
        confidence: 90,
        description: 'Orchestrating targeted campaign and advisory brief.',
        supportingEvidence: [
          'AI recommendation card drafted.',
          'Custom investment allocation metrics calculated.',
          'Assigned RM notified for briefcase presentation.'
        ],
        alternativeActions: [
          { name: 'Generic alternate asset class newsletter', score: 52 }
        ],
        rejectedActions: [
          { name: 'Automated robocall campaign delivery schedule', reason: 'Banned under high-end wealth touchpoint compliance standards.' }
        ]
      },
      {
        id: 'stage-review',
        label: '7. Human RM Review',
        status: 'Awaiting RM Approval',
        confidence: 100,
        description: 'RM validation is mandatory before campaign dispatch.',
        supportingEvidence: [
          'Campaign status: Queued in RM dashboard panel.',
          'Approval type required: Single-sign-on RM token.'
        ],
        alternativeActions: [
          { name: 'Self-dispatch bypass without RM review', score: 5 }
        ],
        rejectedActions: [
          { name: 'Full AI automated delivery authorization', reason: 'Rejected under compliance regulation audit logs requirements.' }
        ]
      },
      {
        id: 'stage-delivery',
        label: '8. Channel Delivery',
        status: 'Channel Queued',
        confidence: 96,
        description: 'Optimizing touchpoint channel mix and times.',
        supportingEvidence: [
          'Primary dispatch: Secure email brief.',
          'Secondary dispatch: Mobile app notifications check.',
          'Scheduled time: 10:30 AM (Highest open latency target).'
        ],
        alternativeActions: [
          { name: 'Direct WhatsApp communication logs', score: 58 }
        ],
        rejectedActions: [
          { name: 'Physical post mailing option', reason: 'Discarded to maximize fast action loop response speeds.' }
        ]
      }
    ]
  },
  {
    id: 'client-2',
    name: 'Aarav Mehta',
    segment: 'HNI',
    targetProduct: 'SBI Tech Advisory Mutual Fund',
    readinessScore: 87,
    stages: [
      {
        id: 'stage-trigger',
        label: '1. Ingestion Trigger',
        status: 'Trigger Detected',
        confidence: 94,
        description: 'High-frequency transaction trades audit logs warning.',
        supportingEvidence: [
          'Venture dividend credit checked (+₹10L).',
          'Tech advisor search clicks logged.'
        ],
        alternativeActions: [
          { name: 'Wealth preservation rebalancing spark', score: 54 }
        ],
        rejectedActions: [
          { name: 'Home loan trigger evaluation', reason: 'Discarded due to active housing loan registry clearances.' }
        ]
      },
      {
        id: 'stage-evidence',
        label: '2. Evidence Compilation',
        status: 'Evidence Compiled',
        confidence: 90,
        description: 'Assembling corporate exchange registry data.',
        supportingEvidence: [
          'Corporate registry status check cleared.',
          'KYC active updates verified.'
        ],
        alternativeActions: [
          { name: 'Self-declared corporate holdings check', score: 45 }
        ],
        rejectedActions: [
          { name: 'Third-party social scraping audit', reason: 'Excluded by privacy filters.' }
        ]
      },
      {
        id: 'stage-sufficiency',
        label: '3. Evidence Sufficiency',
        status: 'Sufficiency Passed',
        confidence: 88,
        description: 'Ingestion scores clear trigger limits.',
        supportingEvidence: [
          'Information sufficiency metrics at 85%.',
          'Reliability checks verified.'
        ],
        alternativeActions: [
          { name: 'Defer target action for quarterly tax return checks', score: 48 }
        ],
        rejectedActions: [
          { name: 'Trigger SMS blast campaign', reason: 'Blocked by segment tier guidelines.' }
        ]
      },
      {
        id: 'stage-readiness',
        label: '4. Readiness Calibration',
        status: 'Score Calibrated',
        confidence: 84,
        description: 'Readiness model indicates tech-advisory interest.',
        supportingEvidence: [
          'Intent score verified: 87% readiness.',
          'App login frequency metrics logged (daily).'
        ],
        alternativeActions: [
          { name: 'Classify client as passive portfolio holder', score: 32 }
        ],
        rejectedActions: [
          { name: 'Retail client routing', reason: 'Excluded due to client high AUM limits.' }
        ]
      },
      {
        id: 'stage-suitability',
        label: '5. Product Suitability',
        status: 'Product Matched',
        confidence: 92,
        description: 'Tech portfolio focus matches index objectives.',
        supportingEvidence: [
          'High risk tolerance score verified.',
          'AUM gap analysis checks approved.'
        ],
        alternativeActions: [
          { name: 'Conservative bluechip equity', score: 62 }
        ],
        rejectedActions: [
          { name: 'Fixed interest debt terms', reason: 'Discarded as client seeks high-volatility growth assets.' }
        ]
      },
      {
        id: 'stage-planning',
        label: '6. Action Planning',
        status: 'Action Plan Formulated',
        confidence: 88,
        description: 'Orchestrating campaign actions drafts.',
        supportingEvidence: [
          'Target mutual fund briefs prepared.',
          'Campaign brief relayed to assigned RM.'
        ],
        alternativeActions: [
          { name: 'Generic corporate growth prospectus dispatch', score: 44 }
        ],
        rejectedActions: [
          { name: 'Auto dialer campaign schedule', reason: 'Banned to protect user touchpoint quality.' }
        ]
      },
      {
        id: 'stage-review',
        label: '7. Human RM Review',
        status: 'Awaiting RM Approval',
        confidence: 100,
        description: 'RM validation is mandatory before campaign dispatch.',
        supportingEvidence: [
          'Pending status queued in RM workspace.'
        ],
        alternativeActions: [
          { name: 'Auto-bypass checks', score: 2 }
        ],
        rejectedActions: [
          { name: 'Direct algorithmic auto-delivery', reason: 'Rejected under compliance framework requirements.' }
        ]
      },
      {
        id: 'stage-delivery',
        label: '8. Channel Delivery',
        status: 'Channel Queued',
        confidence: 90,
        description: 'Optimizing channel dispatch timings.',
        supportingEvidence: [
          'Secure email dispatch scheduled.'
        ],
        alternativeActions: [
          { name: 'WhatsApp logs checks', score: 44 }
        ],
        rejectedActions: [
          { name: 'Physical post letters', reason: 'Discarded to optimize response latency.' }
        ]
      }
    ]
  }
]

export function Reasoning() {
  const toast = useToast()
  const [selectedClientId, setSelectedClientId] = useState('client-1')
  const [expandedStageId, setExpandedStageId] = useState<string | null>('stage-trigger')

  const activeClient = mockClientReasoning.find((c) => c.id === selectedClientId) || mockClientReasoning[0]

  // Pipeline stage icons mapping helper
  const getStageIcon = (id: string) => {
    switch (id) {
      case 'stage-trigger':
        return Zap
      case 'stage-evidence':
        return Layers
      case 'stage-sufficiency':
        return CheckCircle2
      case 'stage-readiness':
        return TrendingUp
      case 'stage-suitability':
        return Compass
      case 'stage-planning':
        return Cpu
      case 'stage-review':
        return UserCheck
      case 'stage-delivery':
        return Send
      default:
        return Info
    }
  }

  const toggleStage = (id: string) => {
    setExpandedStageId(expandedStageId === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* 1. Header controls & client selector */}
      <GlassPanel variant="glass" padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-content md:text-2xl">
            AI <span className="text-gradient-sbi">Reasoning Engine</span>
          </h1>
          <p className="text-3xs text-content-muted">
            Explainable AI decision pipeline tracing intent triggers to delivery channels. Select client to update logs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-content-subtle">Audit Client:</span>
          <div className="flex items-center gap-1.5 border border-line bg-surface/50 px-3 py-1.5 rounded-xl text-xs">
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value)
                setExpandedStageId('stage-trigger')
              }}
              className="bg-transparent text-content font-bold outline-none cursor-pointer"
            >
              {mockClientReasoning.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.readinessScore}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassPanel>

      {/* 2. Visual Stepper Split */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Stepper column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative border-l border-line ml-4 pl-6 space-y-4">
            {activeClient.stages.map((stage) => {
              const Icon = getStageIcon(stage.id)
              const isExpanded = expandedStageId === stage.id

              return (
                <div key={stage.id} className="relative">
                  {/* Circle number indicator */}
                  <div
                    onClick={() => toggleStage(stage.id)}
                    className={cn(
                      'absolute -left-10 top-0.5 flex h-8 w-8 items-center justify-center rounded-full border bg-canvas text-xs shrink-0 cursor-pointer transition-all duration-300',
                      isExpanded
                        ? 'border-sbi-500 text-sbi-600 dark:text-sbi-400 ring-4 ring-sbi-500/10 shadow-glow-sbi'
                        : 'border-line text-content-subtle hover:border-ink-300',
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  {/* Stage main block */}
                  <div
                    className={cn(
                      'p-4.5 rounded-2xl border transition-all duration-300',
                      isExpanded
                        ? 'bg-surface/50 border-sbi-300/40 shadow-inner-glass'
                        : 'bg-surface/20 border-line hover:border-ink-200 cursor-pointer',
                    )}
                    onClick={() => !isExpanded && toggleStage(stage.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-display font-bold text-xs text-content block">{stage.label}</span>
                        <span className="text-[10px] text-content-subtle">{stage.description}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="solid" className="font-mono text-[10px]">{stage.status}</Badge>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleStage(stage.id)
                          }}
                          className="text-content-subtle hover:text-content"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanding Accordion Body */}
                    {isExpanded && (
                      <div className="mt-5 border-t border-line pt-4 grid gap-5 md:grid-cols-2 text-xs animate-slide-up">
                        {/* Left column details */}
                        <div className="space-y-4.5">
                          {/* Confidence level meter */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between font-semibold">
                              <span className="text-content-subtle uppercase tracking-wider text-[10px]">Decision Confidence</span>
                              <span className="text-sbi-600 dark:text-sbi-400 font-mono">{stage.confidence}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-line rounded-full overflow-hidden">
                              <div className="h-full bg-sbi-600" style={{ width: `${stage.confidence}%` }} />
                            </div>
                          </div>

                          {/* Supporting Evidence list */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-content-subtle uppercase tracking-wider block">Supporting Evidence logs</span>
                            <ul className="space-y-1.5 list-disc list-inside text-content">
                              {stage.supportingEvidence.map((ev, eIdx) => (
                                <li key={eIdx} className="leading-relaxed">{ev}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Right column: Alternatives & Rejected */}
                        <div className="space-y-4.5 border-t border-line md:border-t-0 md:border-l md:pl-5 pt-4 md:pt-0">
                          {/* Alternative Actions */}
                          {stage.alternativeActions.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-content-subtle uppercase tracking-wider block">Alternative paths evaluated</span>
                              <div className="space-y-1.5 text-[11px]">
                                {stage.alternativeActions.map((alt, aIdx) => (
                                  <div key={aIdx} className="flex justify-between items-center bg-surface/30 p-1.5 rounded-lg border border-line">
                                    <span className="text-content-subtle font-medium truncate">{alt.name}</span>
                                    <span className="font-mono text-content font-bold shrink-0">{alt.score}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Rejected Actions */}
                          {stage.rejectedActions.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-content-subtle uppercase tracking-wider block">Rejected paths / compliance blocks</span>
                              <div className="space-y-1.5 text-[11px]">
                                {stage.rejectedActions.map((rej, rIdx) => (
                                  <div key={rIdx} className="p-2 rounded-lg border border-danger/25 bg-danger/5 flex items-start gap-1.5">
                                    <AlertTriangle className="h-3.5 w-3.5 text-danger shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold text-content leading-tight block">{rej.name}</span>
                                      <p className="text-[10px] text-content-muted leading-relaxed mt-0.5">{rej.reason}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dynamic client profile summary sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="solid">
            <CardHeader className="border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-sbi-500" />
                <CardTitle>Reasoning summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-4.5">
              <div className="space-y-1.5">
                <span className="text-content-subtle block">Target Client</span>
                <span className="font-semibold text-content text-sm block">{activeClient.name}</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-content-subtle block">Recommended Action / Product</span>
                <span className="font-semibold text-content text-sm block text-sbi-600 dark:text-sbi-400">
                  {activeClient.targetProduct}
                </span>
              </div>
              <div className="space-y-1.5 pt-3 border-t border-line">
                <span className="text-content-subtle block">Calculated Readiness Index</span>
                <span className="font-mono text-base font-extrabold text-content block">
                  {activeClient.readinessScore}%
                </span>
              </div>
              <div className="pt-3 border-t border-line">
                <Button
                  variant="primary"
                  className="w-full h-10 flex items-center justify-center gap-2"
                  onClick={() => {
                    toast.success(
                      'Reasoning Exported',
                      `Decision compliance audit logs generated for ${activeClient.name}. Ready for compliance verification.`
                    )
                  }}
                >
                  Export Compliance Audit <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Reasoning
