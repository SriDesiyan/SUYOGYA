import { useTheme } from '@/providers/ThemeProvider'
import { Button, Avatar, StatusDot } from '@/components/ui'
import { Sun, Moon, Bell, Command, Search, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/providers/AuthContext'

interface NavbarProps {
  onMenuToggle?: () => void
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  return (
    <header className="glass sticky top-0 z-50 w-full border-b border-line px-6 py-3 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left Side: Brand and Mobile Toggle */}
        <div className="flex items-center gap-4">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface/40 hover:bg-surface md:hidden"
              aria-label="Toggle menu"
            >
              <Command className="h-5 w-5 text-content" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sbi-gradient shadow-glow-sbi">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold tracking-tight text-content">
                SUYOGYA
              </span>
              <span className="ml-1.5 hidden rounded-md bg-sbi-50 px-1.5 py-0.5 text-3xs font-semibold tracking-wider text-sbi-600 dark:bg-sbi-950/40 dark:text-sbi-400 sm:inline-block">
                SBI DIGITAL
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search bar */}
        <div className="relative hidden max-w-md flex-1 md:block">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search className="h-4 w-4 text-content-subtle" />
          </div>
          <input
            type="text"
            placeholder="Search customers, actions, signals... (Press ⌘K)"
            className="h-9.5 w-full rounded-xl border border-line bg-surface/30 pl-10 pr-4 text-sm text-content outline-none transition-all focus:border-sbi-500 focus:bg-surface/80"
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <kbd className="hidden rounded bg-ink-100 px-1.5 py-0.5 font-mono text-3xs text-content-subtle dark:bg-ink-800 sm:inline-block">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Side: Status, Actions, Theme & Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-line bg-surface-raised/40 px-3 py-1.5 sm:flex">
            <StatusDot status="online" />
            <span className="text-2xs font-semibold tracking-wide text-content-muted">
              ENGINE ACTIVE
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative h-9.5 w-9.5 rounded-xl text-content-muted hover:text-content"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-danger" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9.5 w-9.5 rounded-xl text-content-muted hover:text-content"
          >
            {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </Button>

          <span className="h-5 w-px bg-line" />

          <Link to="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="hidden text-left lg:block">
              <p className="text-xs font-semibold text-content leading-tight">{user?.name || 'Authorized User'}</p>
              <p className="text-3xs text-content-subtle leading-none">{user?.role || 'Executive'}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
