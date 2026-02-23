import { useState } from 'react'
import { usePlayerStats } from '../../hooks/usePlayers'
import { useExpectedStats, useSprintSpeed } from '../../hooks/useSavant'
import { fmtAvg, fmtRate } from '../../utils/statsUtils'
import { currentSeason } from '../../utils/dateUtils'
import LoadingSpinner from '../ui/LoadingSpinner'

// ── Column definitions ────────────────────────────────────────────────────────
const BATTING_COLS = [
  { key: 'gamesPlayed',  label: 'G'   },
  { key: 'atBats',       label: 'AB'  },
  { key: 'hits',         label: 'H'   },
  { key: 'homeRuns',     label: 'HR'  },
  { key: 'rbi',          label: 'RBI' },
  { key: 'stolenBases',  label: 'SB'  },
  { key: 'avg',          label: 'AVG', fmt: fmtAvg },
  { key: 'obp',          label: 'OBP', fmt: fmtAvg },
  { key: 'slg',          label: 'SLG', fmt: fmtAvg },
  { key: 'ops',          label: 'OPS', fmt: fmtAvg },
]

const FIELDING_COLS = [
  { key: 'gamesPlayed',  label: 'G'    },
  { key: 'gamesStarted', label: 'GS'   },
  { key: 'putOuts',      label: 'PO'   },
  { key: 'assists',      label: 'A'    },
  { key: 'errors',       label: 'E'    },
  { key: 'chances',      label: 'TC'   },
  { key: 'doublePlays',  label: 'DP'   },
  { key: 'fielding',     label: 'FPCT', fmt: (v) => fmtAvg(v) },
]

const PITCHING_COLS = [
  { key: 'gamesPlayed',    label: 'G'    },
  { key: 'gamesStarted',   label: 'GS'   },
  { key: 'wins',           label: 'W'    },
  { key: 'losses',         label: 'L'    },
  { key: 'saves',          label: 'SV'   },
  { key: 'inningsPitched', label: 'IP'   },
  { key: 'strikeOuts',     label: 'K'    },
  { key: 'baseOnBalls',    label: 'BB'   },
  { key: 'era',            label: 'ERA',  fmt: fmtRate },
  { key: 'whip',           label: 'WHIP', fmt: fmtRate },
]

const PITCHER_POSITIONS = new Set(['P', 'SP', 'RP', 'TWP'])

function isPitcherPos(pos) {
  return PITCHER_POSITIONS.has(pos)
}

// Format a Savant decimal stat (.285 → ".285", already a string → pass through)
function fmtSavant(v) {
  if (v == null) return '—'
  const n = Number(v)
  if (isNaN(n)) return '—'
  if (n < 1) return n.toFixed(3).replace(/^0/, '')   // .285
  return n.toFixed(1)
}

// ── Standard stats panel (MLB API) ────────────────────────────────────────────
function StatsPanel({ playerId, season, group }) {
  const { data: stats, isLoading } = usePlayerStats(playerId, season, group)

  const cols = group === 'pitching' ? PITCHING_COLS
             : group === 'fielding' ? FIELDING_COLS
             : BATTING_COLS

  if (isLoading) return <LoadingSpinner size="sm" label="Loading stats…" />
  if (!stats)    return <p className="text-gray-500 text-xs">No stats available for this season.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c.key} className="text-center text-gray-400 uppercase tracking-wide pb-1 px-2">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {cols.map((c) => (
              <td key={c.key} className="text-center text-gray-200 px-2 py-1">
                {c.fmt ? c.fmt(stats[c.key]) : stats[c.key] ?? '—'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ── Statcast panel (Baseball Savant) ─────────────────────────────────────────
function StatcastStatsPanel({ playerId, season, isPitcher }) {
  const savantType = isPitcher ? 'pitcher' : 'batter'
  const { data: statsMap, isLoading: loadingStats } = useExpectedStats(savantType, season)
  const { data: speedMap, isLoading: loadingSpeed } = useSprintSpeed(season)

  const isLoading = loadingStats || loadingSpeed
  if (isLoading) return <LoadingSpinner size="sm" label="Loading Statcast…" />

  const s = statsMap?.get(Number(playerId))
  const spd = speedMap?.get(Number(playerId))

  if (!s && !spd) {
    return <p className="text-gray-500 text-xs">No Statcast data available (minimum PA/BF required).</p>
  }

  // Batter metrics
  const batterMetrics = [
    { label: 'xBA',         value: fmtSavant(s?.xba),                  accent: false },
    { label: 'xSLG',        value: fmtSavant(s?.xslg),                 accent: false },
    { label: 'xwOBA',       value: fmtSavant(s?.xwoba),                accent: false },
    { label: 'Barrel%',     value: s?.barrel_batted_rate != null ? `${Number(s.barrel_batted_rate).toFixed(1)}%` : '—', accent: true },
    { label: 'Hard Hit%',   value: s?.hard_hit_percent   != null ? `${Number(s.hard_hit_percent).toFixed(1)}%`   : '—', accent: false },
    { label: 'Avg EV',      value: s?.exit_velocity_avg  != null ? `${Number(s.exit_velocity_avg).toFixed(1)} mph`: '—', accent: false },
    { label: 'Avg LA',      value: s?.launch_angle_avg   != null ? `${Number(s.launch_angle_avg).toFixed(1)}°`   : '—', accent: false },
    { label: 'Sprint Spd',  value: spd?.sprint_speed     != null ? `${Number(spd.sprint_speed).toFixed(1)} ft/s` : '—', accent: false },
  ]

  // Pitcher metrics
  const pitcherMetrics = [
    { label: 'xBA',       value: fmtSavant(s?.xba),                  accent: false },
    { label: 'xSLG',      value: fmtSavant(s?.xslg),                 accent: false },
    { label: 'xwOBA',     value: fmtSavant(s?.xwoba),                accent: false },
    { label: 'xERA',      value: s?.xera  != null ? fmtRate(s.xera)  : '—',         accent: true  },
    { label: 'Barrel%',   value: s?.barrel_batted_rate != null ? `${Number(s.barrel_batted_rate).toFixed(1)}%` : '—', accent: false },
    { label: 'Hard Hit%', value: s?.hard_hit_percent   != null ? `${Number(s.hard_hit_percent).toFixed(1)}%`   : '—', accent: false },
    { label: 'Avg EV',    value: s?.exit_velocity_avg  != null ? `${Number(s.exit_velocity_avg).toFixed(1)} mph`: '—', accent: false },
  ]

  const metrics = isPitcher ? pitcherMetrics : batterMetrics

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {metrics.map(({ label, value, accent }) => (
          <div key={label} className="bg-navy-800/60 rounded-lg px-2 py-2 text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-0.5">{label}</p>
            <p className={`text-sm font-black font-mono ${accent ? 'text-mlb-red' : 'text-gray-200'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-700 mt-2">Source: Baseball Savant · {season} season</p>
    </div>
  )
}

// ── Main row component ────────────────────────────────────────────────────────
export function PlayerStatsRow({ player, season = currentSeason() }) {
  const [expanded, setExpanded] = useState(false)
  const [tab, setTab] = useState(null)

  const pos       = player.primaryPosition?.abbreviation ?? '?'
  const isPitcher = isPitcherPos(pos)

  const tabs = isPitcher
    ? [
        { id: 'pitching',  label: 'Pitching'  },
        { id: 'statcast',  label: 'Statcast'  },
      ]
    : [
        { id: 'hitting',   label: 'Batting'   },
        { id: 'fielding',  label: 'Fielding'  },
        { id: 'statcast',  label: 'Statcast'  },
      ]

  const defaultTab = tabs[0].id
  const activeTab  = tab ?? defaultTab

  function handleRowClick() {
    setExpanded((v) => !v)
    setTab(null)
  }

  return (
    <>
      <tr
        className="border-b border-navy-700/30 cursor-pointer hover:bg-navy-700/30 transition-colors"
        onClick={handleRowClick}
      >
        <td className="font-medium text-white">
          <span className="mr-2 text-gray-500 text-xs">{expanded ? '▼' : '▶'}</span>
          {player.fullName}
        </td>
        <td className="text-center text-gray-400 text-xs">{pos}</td>
        <td className="text-center text-gray-400 text-xs hidden sm:table-cell">{player.currentTeam?.name ?? '—'}</td>
        <td className="text-center text-gray-500 hidden sm:table-cell">{player.batSide?.code ?? '—'}</td>
        <td className="text-center text-gray-500 hidden sm:table-cell">{player.pitchHand?.code ?? '—'}</td>
      </tr>

      {expanded && (
        <tr className="border-b border-navy-700/50">
          <td colSpan={5} className="p-3 bg-navy-800/40">
            {/* Tab toggle */}
            <div className="flex gap-2 mb-3">
              {tabs.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    activeTab === id
                      ? id === 'statcast'
                        ? 'bg-mlb-red/15 text-mlb-red ring-1 ring-mlb-red/30'
                        : 'bg-mlb-blue/15 text-white ring-1 ring-mlb-blue/30'
                      : 'bg-navy-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'statcast' ? (
              <StatcastStatsPanel
                playerId={player.id}
                season={season}
                isPitcher={isPitcher}
              />
            ) : (
              <StatsPanel playerId={player.id} season={season} group={activeTab} />
            )}
          </td>
        </tr>
      )}
    </>
  )
}
