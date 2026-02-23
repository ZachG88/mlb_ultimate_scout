import { useState } from 'react'

const BATTING_COLS = [
  { key: 'atBats',      label: 'AB'  },
  { key: 'runs',        label: 'R'   },
  { key: 'hits',        label: 'H'   },
  { key: 'rbi',         label: 'RBI' },
  { key: 'baseOnBalls', label: 'BB'  },
  { key: 'strikeOuts',  label: 'K'   },
  { key: 'avg',         label: 'AVG' },
]

const PITCHING_COLS = [
  { key: 'inningsPitched',  label: 'IP'  },
  { key: 'numberOfPitches', label: 'P'   },
  { key: 'strikes',         label: 'STR' },
  { key: 'hits',            label: 'H'   },
  { key: 'runs',            label: 'R'   },
  { key: 'earnedRuns',      label: 'ER'  },
  { key: 'baseOnBalls',     label: 'BB'  },
  { key: 'strikeOuts',      label: 'K'   },
  { key: 'era',             label: 'ERA' },
]

// battingOrder: "100" = starter in slot 1, "101" = first sub in slot 1, etc.
const orderSlot = (bo) => Math.floor(parseInt(bo) / 100)
const isSub     = (bo) => parseInt(bo) % 100 !== 0

export default function BoxScore({ boxScore }) {
  const [side, setSide] = useState('away')

  if (!boxScore?.teams) return null

  const teamData = boxScore.teams[side]
  const teamName = teamData?.team?.name ?? side

  return (
    <div className="space-y-4">
      {/* Side toggle */}
      <div className="flex gap-2">
        {['away', 'home'].map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
              side === s
                ? 'bg-mlb-blue text-white'
                : 'bg-navy-700/60 text-gray-400 hover:text-white ring-1 ring-navy-600'
            }`}
          >
            {boxScore.teams[s]?.team?.abbreviation ?? s.toUpperCase()}
          </button>
        ))}
      </div>

      <TeamBoxScore teamData={teamData} teamName={teamName} />
    </div>
  )
}

function TeamBoxScore({ teamData }) {
  const [tab, setTab] = useState('batting')
  const players = Object.values(teamData?.players ?? {})

  const batters = players
    .filter((p) => p.stats?.batting && p.battingOrder)
    .sort((a, b) => parseInt(a.battingOrder) - parseInt(b.battingOrder))

  const pitchers = players
    .filter((p) => p.stats?.pitching && p.stats.pitching.inningsPitched)

  return (
    <div className="card rounded-xl overflow-hidden">
      <div className="flex gap-1 p-3 border-b border-navy-700/60">
        {['batting', 'pitching'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded text-xs font-bold capitalize transition-colors ${
              tab === t
                ? 'bg-mlb-blue/15 text-white ring-1 ring-mlb-blue/30'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        {tab === 'batting' ? (
          <BattingTable batters={batters} />
        ) : (
          <PitchingTable pitchers={pitchers} />
        )}
      </div>
    </div>
  )
}

// ── Batting table ─────────────────────────────────────────────────────────────
function BattingTable({ batters }) {
  return (
    <table className="w-full stat-table">
      <thead>
        <tr>
          <th className="text-left w-6 pl-3">#</th>
          <th className="text-left">Player</th>
          <th className="text-left">Pos</th>
          {BATTING_COLS.map((c) => (
            <th key={c.key} className="text-center">{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {batters.map((player) => {
          const stats = player.stats?.batting ?? {}
          const sub   = isSub(player.battingOrder)
          const slot  = orderSlot(player.battingOrder)

          return (
            <tr
              key={player.person?.id}
              className={sub ? 'opacity-75' : ''}
            >
              {/* Slot number — only shown for starters */}
              <td className="pl-3 text-gray-600 text-xs font-mono w-6">
                {!sub && slot}
              </td>

              {/* Player name — indented for subs */}
              <td className="font-medium whitespace-nowrap">
                {sub ? (
                  <span className="flex items-center gap-1 pl-4 text-gray-400">
                    <span className="text-gray-600 text-xs leading-none">↳</span>
                    {player.person?.fullName ?? '—'}
                  </span>
                ) : (
                  <span className="text-white">{player.person?.fullName ?? '—'}</span>
                )}
              </td>

              {/* Position */}
              <td className="text-gray-500 text-xs font-mono">
                {player.position?.abbreviation ?? '—'}
              </td>

              {/* Stat columns */}
              {BATTING_COLS.map((c) => (
                <td key={c.key} className="text-center text-gray-300 font-mono tabular-nums">
                  {stats[c.key] ?? '—'}
                </td>
              ))}
            </tr>
          )
        })}
        {batters.length === 0 && (
          <tr>
            <td colSpan={BATTING_COLS.length + 3} className="text-center text-gray-500 py-8">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

// ── Pitching table ────────────────────────────────────────────────────────────
function PitchingTable({ pitchers }) {
  return (
    <table className="w-full stat-table">
      <thead>
        <tr>
          <th className="text-left">Pitcher</th>
          {PITCHING_COLS.map((c) => (
            <th key={c.key} className="text-center">{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {pitchers.map((player) => {
          const stats = player.stats?.pitching ?? {}
          return (
            <tr key={player.person?.id}>
              <td className="font-medium text-white whitespace-nowrap">
                {player.person?.fullName ?? '—'}
              </td>
              {PITCHING_COLS.map((c) => (
                <td key={c.key} className="text-center text-gray-300 font-mono tabular-nums">
                  {stats[c.key] ?? '—'}
                </td>
              ))}
            </tr>
          )
        })}
        {pitchers.length === 0 && (
          <tr>
            <td colSpan={PITCHING_COLS.length + 1} className="text-center text-gray-500 py-8">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
