import { NavLink } from 'react-router-dom'
import { History, LayoutDashboard, Plane, PlusCircle, ReceiptText, User, X } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/create-trip', icon: PlusCircle, label: 'Plan Trip' },
  { to: '/trips', icon: History, label: 'Trip History' },
  { to: '/expenses', icon: ReceiptText, label: 'Expenses' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Sidebar({ open = false, onClose }) {
  const renderContent = () => (
    <>
      <div className="border-b border-gray-100 dark:border-zinc-800 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 shadow-lg shadow-blue-500/20">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-textDark dark:text-zinc-100 tracking-tight">YatraAI</span>
              <p className="text-xs text-gray-400 dark:text-zinc-500">AI Travel Planner</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 dark:text-zinc-300 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                ? 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100'
              }`
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 dark:border-zinc-700 p-4 text-center text-xs text-gray-300 dark:text-zinc-400">
        YatraAI MVP
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 lg:flex">
        {renderContent()}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <aside className="relative z-10 flex h-full w-64 max-w-[85vw] flex-col bg-white dark:bg-zinc-900 shadow-2xl">
            {renderContent()}
          </aside>
        </div>
      )}
    </>
  )
}
