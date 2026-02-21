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
  { key: 'numberOfPitches', label: 'P'   }, // total pitches thrown
  { key: 'strikes',         label: 'STR' }, // strikes thrown
  { key: 'hits',            label: 'H'   },
  { key: 'runs',            label: 'R'   },
  { key: 'earnedRuns',      label: 'ER'  },
  { key: 'baseOnBalls',     label: 'BB'  },
  { key: 'strikeOuts',      label: 'K'   },
  { key: 'era',             label: 'ERA' },
]

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

function TeamBoxScore({ teamData, teamName }) {
  const [tab, setTab] = useState('batting')
  const players = Object.values(teamData?.players ?? {})

  const batters = players
    .filter((p) => p.stats?.batting && p.battingOrder)
    .sort((a, b) => parseInt(a.battingOrder) - parseInt(b.battingOrder))

  const pitchers = players
    .filter((p) => p.stats?.pitching && p.stats.pitching.inningsPitched)

  const cols = tab === 'batting' ? BATTING_COLS : PITCHING_COLS
  const rows = tab === 'batting' ? batters : pitchers

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
        <table className="w-full stat-table">
          <thead>
            <tr>
              <th className="text-left">Player</th>
              {tab === 'batting' && <th className="text-left">Pos</th>}
              {cols.map((c) => (
                <th key={c.key} className="text-center">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((player) => {
              const stats = player.stats?.[tab] ?? {}
              return (
                <tr key={player.person?.id}>
                  <td className="font-medium text-white whitespace-nowrap">{player.person?.fullName ?? '—'}</td>
                  {tab === 'batting' && (
                    <td className="text-gray-500 text-xs font-mono">{player.position?.abbreviation ?? '—'}</td>
                  )}
                  {cols.map((c) => (
                    <td key={c.key} className="text-center text-gray-300 font-mono tabular-nums">
                      {stats[c.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={cols.length + 2} className="text-center text-gray-500 py-8">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
