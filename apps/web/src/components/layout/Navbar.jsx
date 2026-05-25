import { Link, NavLink } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 px-3 py-2 text-sm font-semibold text-white shadow-sm"
          >
            YatraAI
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100',
                ].join(' ')
              }
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/my-trips"
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100',
                ].join(' ')
              }
            >
              My Trips
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-zinc-500">Signed in as</p>
            <p className="truncate text-sm font-semibold text-zinc-900">
              {currentUser?.displayName || currentUser?.email || '—'}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            Log out
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

