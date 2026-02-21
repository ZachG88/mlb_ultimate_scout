import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTeam, useTeamStats, useTeamRoster } from '../hooks/useTeams'
import { useStandings } from '../hooks/useStandings'
import { currentSeason } from '../utils/dateUtils'
import TeamStatsTable from '../components/teams/TeamStatsTable'
import StandingsTable from '../components/teams/StandingsTable'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'

const TABS = ['Stats', 'Standings', 'Roster']

export default function TeamDetailPage() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const season = currentSeason()
  const [tab, setTab] = useState('Stats')

  const { data: team, isLoading: teamLoading, isError: teamError, error: teamErr } = useTeam(teamId)
  const { data: stats, isLoading: statsLoading } = useTeamStats(teamId, season)
  const { data: roster, isLoading: rosterLoading } = useTeamRoster(teamId, season)
  const { data: standings } = useStandings(season)

  // Filter standings to team's division only
  const divisionRecord = standings?.filter(
    (div) => div.division?.id === team?.division?.id
  ) ?? []

  // Find team's record in standings
  const teamRecord = standings
    ?.flatMap((d) => d.teamRecords ?? [])
    .find((r) => r.team?.id === Number(teamId))

  if (teamLoading) return <LoadingSpinner label="Loading team..." />
  if (teamError) return <ErrorMessage error={teamErr} />
  if (!team) return null

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate('/teams')}
        className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
      >
        ← All Teams
      </button>

      {/* Team header */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-4xl font-bold text-mlb-red font-mono">{team.abbreviation}</span>
              {teamRecord?.divisionRank && (
                <span className="text-xs bg-navy-700 text-gray-300 rounded px-2 py-0.5">
                  #{teamRecord.divisionRank} {team.division?.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{team.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{team.venue?.name} · Est. {team.firstYearOfPlay}</p>
          </div>

          {teamRecord && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <Stat label="W" value={teamRecord.wins} />
              <Stat label="L" value={teamRecord.losses} />
              <Stat label="PCT" value={
                parseFloat(teamRecord.winningPercentage).toFixed(3).replace(/^0/, '')
              } />
              <Stat label="GB" value={teamRecord.gamesBack} />
              <Stat label="Streak" value={teamRecord.streak?.streakCode} />
              <Stat label="RS-RA" value={
                teamRecord.runsScored != null
                  ? `${teamRecord.runsScored}-${teamRecord.runsAllowed}`
                  : '—'
              } />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-navy-700 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Stats' && (
        statsLoading
          ? <LoadingSpinner label="Loading stats..." />
          : <TeamStatsTable stats={stats} />
      )}

      {tab === 'Standings' && (
        <StandingsTable records={divisionRecord} />
      )}

      {tab === 'Roster' && (
        rosterLoading
          ? <LoadingSpinner label="Loading roster..." />
          : <RosterList roster={roster} />
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-400 font-medium uppercase">{label}</span>
      <span className="text-lg font-bold font-mono text-white">{value ?? '—'}</span>
    </div>
  )
}

function RosterList({ roster }) {
  if (!roster?.length) return <p className="text-gray-500 text-center py-8">No roster data.</p>

  const byPosition = {}
  roster.forEach((p) => {
    const pos = p.position?.type ?? 'Other'
    if (!byPosition[pos]) byPosition[pos] = []
    byPosition[pos].push(p)
  })

  const order = ['Pitcher', 'Catcher', 'Infielder', 'Outfielder', 'Designated Hitter', 'Other']

  return (
    <div className="space-y-4">
      {order.map((posType) => {
        const players = byPosition[posType]
        if (!players?.length) return null
        return (
          <div key={posType} className="rounded-xl border border-navy-700 overflow-hidden">
            <div className="bg-navy-800 px-4 py-2 border-b border-navy-700">
              <h3 className="text-sm font-semibold text-gray-200">{posType}s</h3>
            </div>
            <div className="grid gap-1 p-2">
              {players.map((p) => (
                <div
                  key={p.person?.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-navy-700/40 transition-colors"
                >
                  <span className="text-sm text-white">{p.person?.fullName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{p.position?.abbreviation}</span>
                    <span className="text-xs text-gray-500">#{p.jerseyNumber ?? '?'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
