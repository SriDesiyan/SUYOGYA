import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Boxes,
  Users,
  Settings,
  Zap,
  Database,
  ArrowLeftRight,
  LogOut,
  Info,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

const menuItems = [
  {
    title: 'Core Engine',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { label: 'Signal Stream', icon: Zap, path: '/signals' },
      { label: 'Client Analytics', icon: Users, path: '/clients' },
      { label: 'Recommendations', icon: Sparkles, path: '/recommendations' },
    ],
  },
  {
    title: 'Platform',
    items: [
      { label: 'Design System', icon: Boxes, path: '/design-system' },
      { label: 'Evidence Explorer', icon: Database, path: '/evidence' },
      { label: 'Reasoning Engine', icon: ArrowLeftRight, path: '/reasoning' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'System Settings', icon: Settings, path: '/settings' },
    ],
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed bottom-0 top-[60px] left-0 z-40 w-64 border-r border-line bg-surface/50 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 md:bg-surface/20',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="space-y-6">
            {menuItems.map((section, idx) => (
              <div key={idx} className="space-y-1.5">
                <h3 className="px-3 text-3xs font-bold uppercase tracking-widest text-content-subtle">
                  {section.title}
                </h3>
                <nav className="space-y-0.5">
                  {section.items.map((item, itemIdx) => (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all group',
                          isActive
                            ? 'text-sbi-600 bg-sbi-50/70 dark:text-sbi-400 dark:bg-sbi-950/20'
                            : 'text-content-muted hover:text-content hover:bg-ink-50/50 dark:hover:bg-ink-900/30',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={cn(
                              'h-4.5 w-4.5 transition-colors',
                              isActive
                                ? 'text-sbi-600 dark:text-sbi-400'
                                : 'text-content-subtle group-hover:text-content',
                            )}
                          />
                          <span>{item.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-sbi-500"
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* Footer of Sidebar */}
          <div className="space-y-3 border-t border-line pt-4">
            <div className="rounded-xl bg-sbi-50/40 p-3 dark:bg-sbi-950/10">
              <div className="flex gap-2">
                <Info className="h-4 w-4 shrink-0 text-sbi-500 mt-0.5" />
                <div>
                  <p className="text-2xs font-bold text-content">Active Workspace</p>
                  <p className="text-3xs text-content-muted">SBI-PROD-MUMBAI-01</p>
                </div>
              </div>
            </div>

            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 transition-colors">
              <LogOut className="h-4.5 w-4.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
