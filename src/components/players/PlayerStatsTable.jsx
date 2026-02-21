import { useState } from 'react'
import { usePlayerStats } from '../../hooks/usePlayers'
import { fmtAvg, fmtRate } from '../../utils/statsUtils'
import { currentSeason } from '../../utils/dateUtils'
import LoadingSpinner from '../ui/LoadingSpinner'

const BATTING_COLS = [
  { key: 'gamesPlayed', label: 'G' },
  { key: 'atBats', label: 'AB' },
  { key: 'hits', label: 'H' },
  { key: 'homeRuns', label: 'HR' },
  { key: 'rbi', label: 'RBI' },
  { key: 'stolenBases', label: 'SB' },
  { key: 'avg', label: 'AVG', fmt: fmtAvg },
  { key: 'obp', label: 'OBP', fmt: fmtAvg },
  { key: 'slg', label: 'SLG', fmt: fmtAvg },
  { key: 'ops', label: 'OPS', fmt: fmtAvg },
]

const PITCHING_COLS = [
  { key: 'gamesPlayed', label: 'G' },
  { key: 'gamesStarted', label: 'GS' },
  { key: 'wins', label: 'W' },
  { key: 'losses', label: 'L' },
  { key: 'saves', label: 'SV' },
  { key: 'inningsPitched', label: 'IP' },
  { key: 'strikeOuts', label: 'K' },
  { key: 'era', label: 'ERA', fmt: (v) => fmtRate(v) },
  { key: 'whip', label: 'WHIP', fmt: (v) => fmtRate(v) },
]

export function PlayerStatsRow({ player, season = currentSeason() }) {
  const [expanded, setExpanded] = useState(false)
  const [group, setGroup] = useState('hitting')

  const pos = player.primaryPosition?.abbreviation ?? '?'
  const isPitcher = pos === 'P' || pos === 'SP' || pos === 'RP'
  const defaultGroup = isPitcher ? 'pitching' : 'hitting'

  const { data: stats, isLoading } = usePlayerStats(
    expanded ? player.id : null,
    season,
    group || defaultGroup
  )

  const cols = (group || defaultGroup) === 'pitching' ? PITCHING_COLS : BATTING_COLS

  return (
    <>
      <tr
        className="border-b border-navy-700/30 cursor-pointer hover:bg-navy-700/30 transition-colors"
        onClick={() => {
          setExpanded((v) => !v)
          setGroup(defaultGroup)
        }}
      >
        <td className="font-medium text-white">
          <span className="mr-2 text-gray-500">{expanded ? '▼' : '▶'}</span>
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
            {/* Group toggle for two-way / flex */}
            <div className="flex gap-2 mb-3">
              {['hitting', 'pitching'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGroup(g)}
                  className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                    (group || defaultGroup) === g
                      ? 'bg-mlb-red text-white'
                      : 'bg-navy-700 text-gray-300 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {isLoading ? (
              <LoadingSpinner size="sm" label="Loading stats..." />
            ) : stats ? (
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
            ) : (
              <p className="text-gray-500 text-xs">No stats available for this season.</p>
            )}
          </td>
        </tr>
      )}
    </>
  )
}
