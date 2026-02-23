import { useState, useMemo } from 'react'
import { usePlayers } from '../hooks/usePlayers'
import { currentSeason } from '../utils/dateUtils'
import PlayerSearch from '../components/players/PlayerSearch'
import { PlayerStatsRow } from '../components/players/PlayerStatsTable'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'

const POSITION_FILTERS = [
  { label: 'All', match: null },
  { label: 'SP',  match: ['SP'] },
  { label: 'RP',  match: ['RP'] },
  { label: 'C',   match: ['C']  },
  { label: '1B',  match: ['1B'] },
  { label: '2B',  match: ['2B'] },
  { label: '3B',  match: ['3B'] },
  { label: 'SS',  match: ['SS'] },
  { label: 'OF',  match: ['LF', 'CF', 'RF'] },
  { label: 'DH',  match: ['DH'] },
]

function IconFilter() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  )
}

// Shared styled select used in both mobile panel and desktop row
function TeamSelect({ value, onChange, teams }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-navy-800 border border-navy-700 text-gray-200 text-sm font-medium rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:border-mlb-blue focus:ring-1 focus:ring-mlb-blue/40 transition-colors hover:border-navy-500"
    >
      <option value="All">All Teams</option>
      {teams.map((t) => (
        <option key={t.id} value={String(t.id)}>
          {t.abbr} — {t.name}
        </option>
      ))}
    </select>
  )
}

export default function PlayersPage() {
  const season = currentSeason()
  const [search,      setSearch]      = useState('')
  const [posFilter,   setPosFilter]   = useState('All')
  const [teamFilter,  setTeamFilter]  = useState('All')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const { data: players, isLoading, isError, error, refetch } = usePlayers(season)

  // Build sorted unique team list from player data
  const teams = useMemo(() => {
    if (!players) return []
    const seen = new Map()
    for (const p of players) {
      const t = p.currentTeam
      if (t?.id && !seen.has(t.id)) {
        seen.set(t.id, {
          id:   t.id,
          name: t.name ?? '',
          abbr: t.abbreviation ?? t.name ?? '',
        })
      }
    }
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [players])

  const activePos = POSITION_FILTERS.find((f) => f.label === posFilter) ?? POSITION_FILTERS[0]

  const filtered = useMemo(() => {
    if (!players) return []
    let result = players

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.fullName?.toLowerCase().includes(q))
    }

    if (activePos.match) {
      result = result.filter((p) =>
        activePos.match.includes(p.primaryPosition?.abbreviation)
      )
    }

    if (teamFilter !== 'All') {
      result = result.filter((p) => String(p.currentTeam?.id) === teamFilter)
    }

    return result.slice(0, 200)
  }, [players, search, activePos, teamFilter])

  const activeFilterCount = (posFilter !== 'All' ? 1 : 0) + (teamFilter !== 'All' ? 1 : 0)

  function clearFilters() {
    setPosFilter('All')
    setTeamFilter('All')
    setFiltersOpen(false)
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl font-bold text-white">Players</h1>
        <p className="text-gray-400 text-sm mt-0.5">{season} Season · Tap a player to expand stats</p>
      </div>

      <div className="space-y-3 mb-4 sm:mb-6">
        {/* Search */}
        <PlayerSearch value={search} onChange={setSearch} />

        {/* ── Mobile: filter toggle button ── */}
        <div className="flex items-center gap-3 sm:hidden">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              activeFilterCount > 0
                ? 'bg-mlb-red/10 border-mlb-red/40 text-mlb-red'
                : 'bg-navy-800 border-navy-700 text-gray-400'
            }`}
          >
            <IconFilter />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-mlb-red text-white text-[10px] font-black leading-none rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}

          {/* Compact active filter summary */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              {posFilter !== 'All' && (
                <span className="text-[11px] font-semibold text-mlb-red bg-mlb-red/10 px-2 py-0.5 rounded-full border border-mlb-red/25">
                  {posFilter}
                </span>
              )}
              {teamFilter !== 'All' && (
                <span className="text-[11px] font-semibold text-mlb-blue bg-mlb-blue/10 px-2 py-0.5 rounded-full border border-mlb-blue/25">
                  {teams.find((t) => String(t.id) === teamFilter)?.abbr ?? ''}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Mobile: expandable filter panel ── */}
        {filtersOpen && (
          <div className="sm:hidden card rounded-xl p-4 space-y-4">
            {/* Position */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Position</p>
              <div className="flex flex-wrap gap-1.5">
                {POSITION_FILTERS.map(({ label }) => (
                  <button
                    key={label}
                    onClick={() => setPosFilter(label)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      posFilter === label
                        ? 'bg-mlb-red text-white'
                        : 'bg-navy-700 text-gray-400 hover:text-white border border-navy-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Team */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Team</p>
              <TeamSelect value={teamFilter} onChange={setTeamFilter} teams={teams} />
            </div>

            {/* Apply button */}
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full py-2 rounded-lg bg-mlb-blue text-white text-xs font-bold tracking-wide"
            >
              Apply Filters
            </button>
          </div>
        )}

        {/* ── Desktop: always-visible filter row ── */}
        <div className="hidden sm:flex sm:items-center sm:gap-4">
          {/* Position pills */}
          <div className="flex gap-1.5 flex-wrap flex-1">
            {POSITION_FILTERS.map(({ label }) => (
              <button
                key={label}
                onClick={() => setPosFilter(label)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  posFilter === label
                    ? 'bg-mlb-red text-white'
                    : 'bg-navy-800 text-gray-400 hover:text-white border border-navy-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Team dropdown */}
          <div className="shrink-0 w-52">
            <TeamSelect value={teamFilter} onChange={setTeamFilter} teams={teams} />
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner label="Loading player roster..." />}
      {isError && <ErrorMessage error={error} retry={refetch} />}

      {!isLoading && !isError && (
        <>
          <p className="text-xs text-gray-600 mb-3">
            {filtered.length} player{filtered.length !== 1 ? 's' : ''}
            {filtered.length < (players?.length ?? 0) && (
              <span className="text-gray-700"> of {players.length}</span>
            )}
          </p>

          <div className="rounded-xl border border-navy-700 overflow-hidden">
            <table className="w-full stat-table">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-800/60">
                  <th className="text-left">Name</th>
                  <th className="text-center">Pos</th>
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
                      No players match your filters.
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
