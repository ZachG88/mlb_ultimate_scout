import { NavLink } from 'react-router-dom'

// ── SVG Icons (stroke-based, Heroicons style) ─────────────────────────────────
function IconCalendar({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8"  y1="2" x2="8"  y2="6" />
      <line x1="3"  y1="10" x2="21" y2="10" />
    </svg>
  )
}

function IconBuilding({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconPerson({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    </svg>
  )
}

// ── Logo mark — clean geometric diamond ───────────────────────────────────────
function LogoMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="text-mlb-red shrink-0">
      <rect
        x="3" y="3" width="14" height="14" rx="1.5"
        fill="none" stroke="currentColor" strokeWidth="1.75"
        transform="rotate(45 10 10)"
      />
    </svg>
  )
}

const links = [
  { to: '/',       label: 'Schedule', Icon: IconCalendar },
  { to: '/teams',  label: 'Teams',    Icon: IconBuilding },
  { to: '/players',label: 'Players',  Icon: IconPerson   },
]

export default function Navbar() {
  return (
    <>
      {/* Patriotic stripe */}
      <div
        className="h-0.5 w-full shrink-0"
        style={{ background: 'linear-gradient(90deg, #C8102E 0%, #C8102E 33.3%, #fff 33.3%, #fff 66.6%, #2563EB 66.6%, #2563EB 100%)' }}
      />

      {/* Top bar */}
      <nav className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur border-b border-navy-700/50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between" style={{ height: '3.25rem' }}>

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 select-none">
            <LogoMark />
            <span className="font-bold text-[15px] tracking-tight leading-none">
              <span className="text-white">MLB</span>
              <span className="text-mlb-red ml-1">Scout</span>
            </span>
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
      <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden" style={{ background: 'rgba(3,12,28,0.97)', backdropFilter: 'blur(12px)' }}>
        <div className="border-t border-navy-700/60">
          <div className="flex">
            {links.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors relative ${
                    isActive ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-mlb-blue" />
                    )}
                    <Icon className={`w-5 h-5 transition-all ${isActive ? 'stroke-[2]' : ''}`} />
                    <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-white' : 'text-gray-600'}`}>
                      {label.toUpperCase()}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
          {/* Safe area spacer for phones with home indicator */}
          <div className="h-safe-area-inset-bottom" style={{ height: 'env(safe-area-inset-bottom)' }} />
        </div>
      </div>
    </>
  )
}
