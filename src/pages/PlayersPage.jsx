import { useState, useMemo } from 'react'
import { usePlayers } from '../hooks/usePlayers'
import { currentSeason } from '../utils/dateUtils'
import PlayerSearch from '../components/players/PlayerSearch'
import { PlayerStatsRow } from '../components/players/PlayerStatsTable'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'

const POSITION_FILTERS = ['All', 'SP', 'RP', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH']

export default function PlayersPage() {
  const season = currentSeason()
  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState('All')

  const { data: players, isLoading, isError, error, refetch } = usePlayers(season)

  const filtered = useMemo(() => {
    if (!players) return []
    let result = players

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.fullName?.toLowerCase().includes(q))
    }

    if (posFilter !== 'All') {
      result = result.filter(
        (p) => p.primaryPosition?.abbreviation === posFilter
      )
    }

    return result.slice(0, 200)
  }, [players, search, posFilter])

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl font-bold text-white">Players</h1>
        <p className="text-gray-400 text-sm mt-0.5">{season} Season · Tap a player to expand stats</p>
      </div>

      <div className="space-y-3 mb-4 sm:mb-6">
        <PlayerSearch value={search} onChange={setSearch} />
        <div className="flex gap-2 flex-wrap">
          {POSITION_FILTERS.map((pos) => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                posFilter === pos
                  ? 'bg-mlb-red text-white'
                  : 'bg-navy-800 text-gray-400 hover:text-white border border-navy-600'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <LoadingSpinner label="Loading player roster..." />}
      {isError && <ErrorMessage error={error} retry={refetch} />}

      {!isLoading && !isError && (
        <>
          <p className="text-xs text-gray-500 mb-3">
            Showing {filtered.length} of {players?.length ?? 0} players
          </p>

          <div className="rounded-xl border border-navy-700 overflow-hidden">
            <table className="w-full stat-table">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-800/60">
                  <th className="text-left">Name</th>
                  <th className="text-center">Pos</th>
                  {/* Hide less-important columns on mobile */}
                  <th className="text-center hidden sm:table-cell">Team</th>
                  <th className="text-center hidden sm:table-cell">Bat</th>
                  <th className="text-center hidden sm:table-cell">Throw</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((player) => (
                  <PlayerStatsRow key={player.id} player={player} season={season} />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No players match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
