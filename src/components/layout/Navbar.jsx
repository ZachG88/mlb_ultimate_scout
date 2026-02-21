import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Schedule', icon: '🗓' },
  { to: '/teams', label: 'Teams', icon: '🏟' },
  { to: '/players', label: 'Players', icon: '👤' },
]

export default function Navbar() {
  return (
    <>
      {/* Top bar */}
      <nav className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="text-mlb-red text-2xl">⚾</span>
            <span className="text-white">MLB</span>
            <span className="text-mlb-red">Scout</span>
          </NavLink>

          {/* Desktop nav — hidden on mobile */}
          <div className="hidden sm:flex gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-mlb-red text-white'
                      : 'text-gray-300 hover:text-white hover:bg-navy-700'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav — hidden on sm+ */}
      <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-navy-900/95 backdrop-blur border-t border-navy-700">
        <div className="flex">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-0.5 py-3 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-mlb-red' : 'text-gray-500'
                }`
              }
            >
              <span className="text-xl leading-none">{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}
