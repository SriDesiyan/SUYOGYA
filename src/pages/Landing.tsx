import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import Lenis from 'lenis'
import {
  Sparkles,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldAlert,
  Database,
  Cpu,
  Smartphone,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { Button, Badge, GlassPanel, useToast } from '@/components/ui'
import { SignalMesh3D } from '@/components/3d/SignalMesh3D'
import { useTheme } from '@/providers/ThemeProvider'
import { Sun, Moon } from 'lucide-react'

export function Landing() {
  const { theme, toggleTheme } = useTheme()
  const toast = useToast()
  const containerRef = useRef<HTMLDivElement>(null)

  // Simulator State
  const [lifePhase, setLifePhase] = useState(65)
  const [inflowStability, setInflowStability] = useState(80)
  const [digitalTriggers, setDigitalTriggers] = useState(70)

  // Compute readiness score
  const readinessScore = Math.round(
    lifePhase * 0.35 + inflowStability * 0.45 + digitalTriggers * 0.2,
  )

  // Initialize Lenis scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
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

  // GSAP animations for storytelling entrance
  useEffect(() => {
    if (containerRef.current) {
      // Hero elements entrance
      const heroTimeline = gsap.timeline()
      heroTimeline.fromTo(
        containerRef.current.querySelectorAll('.hero-animate'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: 'power4.out' },
      )

      // Scroll-triggered animations for other sections
      const sections = containerRef.current.querySelectorAll('.scroll-reveal')
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        )
      })
    }
  }, [])

  const triggerAlertSim = () => {
    toast.success(
      'Ready Client Signal Computed',
      `Calculated ${readinessScore}% readiness probability index vector. Routing to dashboard.`,
    )
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden transition-colors duration-300">
      {/* 3D Particle Backdrop */}
      <SignalMesh3D />

      {/* Standalone Premium Header */}
      <header className="glass sticky top-0 z-50 w-full border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sbi-gradient">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold tracking-tight text-content">
              SUYOGYA
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-content-muted md:flex">
            <a href="#problem" className="hover:text-content transition-colors">The Problem</a>
            <a href="#fails" className="hover:text-content transition-colors">Friction Points</a>
            <a href="#journey" className="hover:text-content transition-colors">Journey</a>
            <a href="#readiness" className="hover:text-content transition-colors">Readiness</a>
            <a href="#business" className="hover:text-content transition-colors">Business Value</a>
            <a href="#technology" className="hover:text-content transition-colors">Technology</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-9 w-9 rounded-xl text-content-muted hover:text-content"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </Button>
            <Link to="/dashboard">
              <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Launch Console
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Storytelling Canvas */}
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-32">
        {/* 1. Hero Section */}
        <section className="min-h-[75vh] flex flex-col justify-center items-start text-left space-y-6 pt-10">
          <Badge variant="brand" className="hero-animate w-fit">
            <Zap className="h-3 w-3 mr-1 text-sbi-600 dark:text-sbi-400" />
            SBI Digital Advisor Ecosystem
          </Badge>
          <h1 className="hero-animate font-display text-display-sm md:text-display-md font-bold tracking-tight text-content max-w-4xl">
            Know <span className="text-gradient-sbi">when</span> to engage. <br className="hidden md:inline" />
            Not just what to sell.
          </h1>
          <p className="hero-animate text-lg md:text-xl text-content-muted max-w-2xl font-normal leading-relaxed">
            SUYOGYA parses real-time cash flows, digital patterns, and life sparks to signal when high net worth clients are prime for advisory campaigns.
          </p>
          <div className="hero-animate flex flex-wrap gap-4 pt-4">
            <Link to="/dashboard">
              <Button size="lg" variant="primary" rightIcon={<ChevronRight className="h-4.5 w-4.5" />}>
                Enter Command Center
              </Button>
            </Link>
            <a href="#problem">
              <Button size="lg" variant="outline">
                Explore Story
              </Button>
            </a>
          </div>
        </section>

        {/* 2. Problem Section */}
        <section id="problem" className="scroll-reveal space-y-6">
          <div className="max-w-2xl">
            <Badge variant="danger">THE PROBLEM</Badge>
            <h2 className="font-display text-display-sm font-semibold tracking-tight text-content mt-3">
              The Noise of Modern Banking
            </h2>
            <p className="text-sm md:text-base text-content-muted mt-3 leading-relaxed">
              Relationship managers today struggle with contextless push marketing alerts. Customers are bombarded with spam messages, leading to channel fatigue, relationship erosion, and silent client drop-offs.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 mt-8">
            <div className="rounded-2xl border border-danger/25 bg-danger/5 p-6 backdrop-blur">
              <ShieldAlert className="h-6 w-6 text-danger mb-4" />
              <h4 className="font-semibold text-content text-base">Client Fatigue</h4>
              <p className="text-xs text-content-muted mt-1 leading-relaxed">
                Pushing investment packages without timing parameters results in muting, app uninstalls, and executive team disconnects.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface/40 p-6 backdrop-blur">
              <TrendingUp className="h-6 w-6 text-sbi-500 mb-4" />
              <h4 className="font-semibold text-content text-base">Uncaptured Opportunities</h4>
              <p className="text-xs text-content-muted mt-1 leading-relaxed">
                When a client receives a salary spark or exits a venture pool, banking institutions react weeks too late, missing the optimal window.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Why Banking Fails Today Section */}
        <section id="fails" className="scroll-reveal space-y-8">
          <div className="max-w-2xl">
            <Badge variant="warning">THE FRICTION</Badge>
            <h2 className="font-display text-display-sm font-semibold tracking-tight text-content mt-3">
              Why Engagement Fails Today
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <GlassPanel variant="glass" padding="md" className="text-center">
              <span className="font-display text-4xl md:text-5xl font-extrabold text-danger">1.4%</span>
              <p className="text-xs font-semibold text-content mt-2">Conversion Rates</p>
              <p className="text-3xs text-content-muted mt-1">Average conversion score on traditional, un-timed advisory campaigns.</p>
            </GlassPanel>
            <GlassPanel variant="glass" padding="md" className="text-center">
              <span className="font-display text-4xl md:text-5xl font-extrabold text-content">82%</span>
              <p className="text-xs font-semibold text-content mt-2">HNIs Fatigue</p>
              <p className="text-3xs text-content-muted mt-1">Percentage of High Net Worth clients who mute generic notifications.</p>
            </GlassPanel>
            <GlassPanel variant="glass" padding="md" className="text-center">
              <span className="font-display text-4xl md:text-5xl font-extrabold text-sbi-600">4.8x</span>
              <p className="text-xs font-semibold text-content mt-2">Retention Multiplier</p>
              <p className="text-3xs text-content-muted mt-1">Increase in client satisfaction when advisor calls align with lifestyle transitions.</p>
            </GlassPanel>
          </div>
        </section>

        {/* 4. Customer Journey Section */}
        <section id="journey" className="scroll-reveal space-y-8">
          <div className="max-w-2xl">
            <Badge variant="brand">THE TIMELINE</Badge>
            <h2 className="font-display text-display-sm font-semibold tracking-tight text-content mt-3">
              The Journey of a Digital Signal
            </h2>
            <p className="text-xs text-content-muted mt-2">How SUYOGYA processes indicators to execute successful advisory campaigns.</p>
          </div>

          <div className="relative border-l border-line ml-4 pl-8 space-y-8">
            <div className="relative">
              <div className="absolute -left-12 top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-sbi-50 border border-sbi-200 dark:bg-sbi-950/20 dark:border-sbi-800">
                <Database className="h-4 w-4 text-sbi-600 dark:text-sbi-400" />
              </div>
              <h4 className="font-semibold text-content text-base">1. Real-time Ingestion</h4>
              <p className="text-xs text-content-muted mt-1 leading-relaxed max-w-xl">
                SUYOGYA monitors real-time database cash inflows, digital actions, and kyc changes securely inside institutional silos.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-12 top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-sbi-50 border border-sbi-200 dark:bg-sbi-950/20 dark:border-sbi-800">
                <Cpu className="h-4 w-4 text-sbi-600 dark:text-sbi-400" />
              </div>
              <h4 className="font-semibold text-content text-base">2. Vector Computation</h4>
              <p className="text-xs text-content-muted mt-1 leading-relaxed max-w-xl">
                Machine learning model pipelines map variables (Inflow index, Life sparks, trigger footprints) to calculate the client's readiness.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-12 top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-sbi-50 border border-sbi-200 dark:bg-sbi-950/20 dark:border-sbi-800">
                <Smartphone className="h-4 w-4 text-sbi-600 dark:text-sbi-400" />
              </div>
              <h4 className="font-semibold text-content text-base">3. RM Transmission</h4>
              <p className="text-xs text-content-muted mt-1 leading-relaxed max-w-xl">
                Once a client passes the 80% readiness threshold, an alert is transmitted instantly to the relationship manager's cockpit.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Traditional vs SUYOGYA Section */}
        <section className="scroll-reveal space-y-6">
          <div className="max-w-2xl">
            <Badge variant="brand">COMPARATIVE VALUE</Badge>
            <h2 className="font-display text-display-sm font-semibold tracking-tight text-content mt-3">
              Traditional Banking vs SUYOGYA
            </h2>
          </div>
          <GlassPanel variant="glass" padding="none" className="overflow-hidden border border-line">
            <div className="grid grid-cols-2 border-b border-line bg-surface-raised/40 p-4 font-display font-semibold text-xs text-content">
              <div>TRADITIONAL OUTREACH</div>
              <div className="text-sbi-600 dark:text-sbi-400">SUYOGYA PLATFORM</div>
            </div>
            <div className="divide-y divide-line text-xs">
              <div className="grid grid-cols-2 p-4">
                <div className="text-content-muted">Reactive campaign pushes based on outdated monthly batches.</div>
                <div className="font-medium text-content">Predictive, real-time alerts synchronized on transaction sparks.</div>
              </div>
              <div className="grid grid-cols-2 p-4">
                <div className="text-content-muted">Information overload with uncoordinated spam campaigns.</div>
                <div className="font-medium text-content">Quiet, intent-focused vectors delivered to relationship managers.</div>
              </div>
              <div className="grid grid-cols-2 p-4">
                <div className="text-content-muted">High HNI silent churn due to low advisor relevance.</div>
                <div className="font-medium text-content">AUM growth via perfectly aligned executive digital advisory context.</div>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* 6. Customer Readiness Simulator Section */}
        <section id="readiness" className="scroll-reveal space-y-8">
          <div className="max-w-2xl">
            <Badge variant="success">INTERACTIVE SIMULATION</Badge>
            <h2 className="font-display text-display-sm font-semibold tracking-tight text-content mt-3">
              Readiness Vector Simulator
            </h2>
            <p className="text-xs text-content-muted mt-2">
              Adjust client action weights to calculate real-time intent probability indicators.
            </p>
          </div>

          <GlassPanel variant="glass-strong" padding="lg" className="grid gap-8 md:grid-cols-12 items-center">
            <div className="space-y-5 md:col-span-7">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-content">
                  <span>Life Milestones Weight</span>
                  <span className="font-mono text-sbi-600 dark:text-sbi-400">{lifePhase}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lifePhase}
                  onChange={(e) => setLifePhase(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer rounded-lg bg-line accent-sbi-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-content">
                  <span>Inflow Stability index</span>
                  <span className="font-mono text-sbi-600 dark:text-sbi-400">{inflowStability}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={inflowStability}
                  onChange={(e) => setInflowStability(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer rounded-lg bg-line accent-sbi-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-content">
                  <span>Digital Footprint Signals</span>
                  <span className="font-mono text-sbi-600 dark:text-sbi-400">{digitalTriggers}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={digitalTriggers}
                  onChange={(e) => setDigitalTriggers(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer rounded-lg bg-line accent-sbi-500"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-line bg-surface/50 md:col-span-5">
              <span className="text-3xs font-bold text-content-subtle uppercase tracking-widest">Calculated Intent Index</span>
              <span className="font-display text-5xl md:text-6xl font-extrabold text-content my-3 font-mono">
                {readinessScore}%
              </span>
              <Badge variant={readinessScore >= 80 ? 'success' : readinessScore >= 50 ? 'warning' : 'neutral'}>
                {readinessScore >= 80 ? 'READY FOR ENGAGEMENT' : readinessScore >= 50 ? 'MONITORING TRIGGER' : 'INACTIVE POOL'}
              </Badge>
              <Button size="sm" className="mt-5 w-full" onClick={triggerAlertSim}>
                Publish Simulated Signal
              </Button>
            </div>
          </GlassPanel>
        </section>

        {/* 7. Business Value Section */}
        <section id="business" className="scroll-reveal space-y-6">
          <div className="max-w-2xl">
            <Badge variant="brand">EXECUTIVE IMPACT</Badge>
            <h2 className="font-display text-display-sm font-semibold tracking-tight text-content mt-3">
              Delivering Tangible Outcomes
            </h2>
            <p className="text-xs text-content-muted mt-2">Measurable KPIs validated across test relationship pipelines.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-line bg-surface/30 p-5 backdrop-blur">
              <span className="font-display text-3xl font-extrabold text-sbi-600">₹14.8Cr</span>
              <h4 className="text-xs font-semibold text-content mt-2">Structured AUM Inflows</h4>
              <p className="text-3xs text-content-subtle mt-1">Aggregate high value resources directed into active management.</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface/30 p-5 backdrop-blur">
              <span className="font-display text-3xl font-extrabold text-content">+312%</span>
              <h4 className="text-xs font-semibold text-content mt-2">Conversion Multiplier</h4>
              <p className="text-3xs text-content-subtle mt-1">Growth in RM success metrics compared to standard cold calls.</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface/30 p-5 backdrop-blur">
              <span className="font-display text-3xl font-extrabold text-content">4.8x</span>
              <h4 className="text-xs font-semibold text-content mt-2">Advisory Retention</h4>
              <p className="text-3xs text-content-subtle mt-1">HNI client satisfaction benchmarks scaling after onboarding.</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface/30 p-5 backdrop-blur">
              <span className="font-display text-3xl font-extrabold text-sbi-600">&lt; 3.5s</span>
              <h4 className="text-xs font-semibold text-content mt-2">Action Latency</h4>
              <p className="text-3xs text-content-subtle mt-1">Average lag between database ledger sparks and RM alert displays.</p>
            </div>
          </div>
        </section>

        {/* 8. Technology Section */}
        <section id="technology" className="scroll-reveal space-y-6">
          <div className="max-w-2xl">
            <Badge variant="brand">THE INFRASTRUCTURE</Badge>
            <h2 className="font-display text-display-sm font-semibold tracking-tight text-content mt-3">
              SBI Core Integration Engine
            </h2>
            <p className="text-xs text-content-muted mt-2">High-performance digital signals ingestion and caching specifications.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface/30 p-5">
              <div className="h-10 w-10 rounded-xl bg-sbi-50 flex items-center justify-center text-sbi-600 dark:bg-sbi-950/20 dark:text-sbi-400 mb-4">
                <Database className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-content text-sm">Central API Interfacing</h4>
              <p className="text-xs text-content-muted mt-1 leading-relaxed">
                Connects directly to core banking datastores via Axios protocols to retrieve demographic segment pools securely.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface/30 p-5">
              <div className="h-10 w-10 rounded-xl bg-sbi-50 flex items-center justify-center text-sbi-600 dark:bg-sbi-950/20 dark:text-sbi-400 mb-4">
                <Activity className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-content text-sm">TanStack Queries</h4>
              <p className="text-xs text-content-muted mt-1 leading-relaxed">
                Employs reactive local caches and automated poll synchronizations to guarantee RMs receive instantaneous notification feeds.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface/30 p-5">
              <div className="h-10 w-10 rounded-xl bg-sbi-50 flex items-center justify-center text-sbi-600 dark:bg-sbi-950/20 dark:text-sbi-400 mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-content text-sm">ThreeJS / R3F Canvas</h4>
              <p className="text-xs text-content-muted mt-1 leading-relaxed">
                Renders interactive vectors using hardware-accelerated particle shaders to provide a real-time model interface.
              </p>
            </div>
          </div>
        </section>

        {/* 9. Call To Action Section */}
        <section className="scroll-reveal">
          <div className="rounded-[2rem] bg-sbi-gradient p-8 md:p-12 text-center text-white relative overflow-hidden shadow-glow-sbi">
            {/* Soft decorative background circles */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Badge variant="solid" className="w-fit mx-auto bg-white/10 border-white/20 text-white">
                Ready for Deployment
              </Badge>
              <h2 className="font-display text-display-sm font-bold tracking-tight">
                Launch the Command Center
              </h2>
              <p className="text-sm text-sbi-100 max-w-lg mx-auto leading-relaxed">
                Log in using your corporate executive credentials to view live signal pipelines and deploy target campaigns today.
              </p>
              <div className="pt-4">
                <Link to="/dashboard">
                  <Button size="lg" variant="glass" className="bg-white text-sbi-950 hover:bg-white/90 border-transparent shadow-elev-2">
                    Enter Console Cockpit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 10. Footer Section */}
      <footer className="border-t border-line bg-surface/30 backdrop-blur mt-32 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-sbi-gradient">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-content">SUYOGYA</span>
          </div>

          <p className="text-3xs text-content-subtle max-w-md text-center md:text-right leading-normal">
            © {new Date().getFullYear()} State Bank of India. Institutional executive tool. Under supervision of compliance and risk departments. SBI Mumbai Central Database Core.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
