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
      <div className="border-b border-gray-100 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-textDark">YatraAI</span>
              <p className="text-xs text-gray-400">AI Travel Planner</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'border-r-2 border-primary bg-blue-50 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-textDark'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-4 text-center text-xs text-gray-400">
        YatraAI MVP
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white shadow-sm lg:flex">
        {renderContent()}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40"
          />
          <aside className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            {renderContent()}
          </aside>
        </div>
      )}
    </>
  )
}
