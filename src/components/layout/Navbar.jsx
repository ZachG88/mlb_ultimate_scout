import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Schedule', icon: '🗓' },
  { to: '/teams', label: 'Teams', icon: '🏟' },
  { to: '/players', label: 'Players', icon: '👤' },
]

export default function Navbar() {
  return (
    <>
      {/* Patriotic stripe */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #C8102E 0%, #C8102E 33.3%, #fff 33.3%, #fff 66.6%, #2563EB 66.6%, #2563EB 100%)' }} />

      {/* Top bar */}
      <nav className="sticky top-1 z-50 bg-navy-900/95 backdrop-blur border-b border-navy-700/60">
        <div className="max-w-7xl mx-auto px-4 h-13 flex items-center justify-between" style={{ height: '3.25rem' }}>
          <NavLink to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight select-none">
            <span className="text-mlb-red text-2xl leading-none">⚾</span>
            <span className="text-white">MLB</span>
            <span className="text-mlb-red">Scout</span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden sm:flex gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-mlb-blue/15 text-white ring-1 ring-mlb-blue/40'
                      : 'text-gray-400 hover:text-white hover:bg-navy-700/60'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-navy-900/97 backdrop-blur border-t border-navy-700/60">
        {/* Mini patriotic stripe at top of bottom nav */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, #C8102E 0%, #C8102E 33.3%, #fff 33.3%, #fff 66.6%, #2563EB 66.6%, #2563EB 100%)' }} />
        <div className="flex">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-0.5 py-3 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-mlb-blue' : 'text-gray-500 hover:text-gray-300'
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
