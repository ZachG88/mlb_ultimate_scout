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

  const divisionRecord = standings?.filter(
    (div) => div.division?.id === team?.division?.id
  ) ?? []

  const teamRecord = standings
    ?.flatMap((d) => d.teamRecords ?? [])
    .find((r) => r.team?.id === Number(teamId))

  if (teamLoading) return <LoadingSpinner label="Loading team..." />
  if (teamError) return <ErrorMessage error={teamErr} />
  if (!team) return null

  const pct = teamRecord?.winningPercentage
    ? parseFloat(teamRecord.winningPercentage).toFixed(3).replace(/^0/, '')
    : '—'

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate('/teams')}
        className="text-gray-500 hover:text-white text-sm mb-4 flex items-center gap-1.5 transition-colors"
      >
        ← All Teams
      </button>

      {/* Hero header */}
      <div
        className="card rounded-xl overflow-hidden mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(200,16,46,0.12) 0%, rgba(6,23,40,0) 50%, rgba(37,99,235,0.08) 100%)' }}
      >
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-5xl font-black text-mlb-red font-mono tracking-tighter leading-none">
                  {team.abbreviation}
                </span>
                {teamRecord?.divisionRank && (
                  <span className="text-xs bg-navy-700/80 text-gray-400 rounded-full px-2.5 py-1 font-mono ring-1 ring-navy-600">
                    #{teamRecord.divisionRank} {team.division?.name}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{team.name}</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {team.venue?.name}
                {team.firstYearOfPlay && ` · Est. ${team.firstYearOfPlay}`}
              </p>
            </div>

            {teamRecord && (
              <div className="grid grid-cols-3 gap-2.5">
                <HeroStat label="W" value={teamRecord.wins} accent />
                <HeroStat label="L" value={teamRecord.losses} />
                <HeroStat label="PCT" value={pct} />
                <HeroStat label="GB" value={teamRecord.gamesBack} />
                <HeroStat label="Streak" value={teamRecord.streak?.streakCode} />
                <HeroStat
                  label="R-RA"
                  value={teamRecord.runsScored != null
                    ? `${teamRecord.runsScored}-${teamRecord.runsAllowed}`
                    : '—'}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-navy-700/60 mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`tab-btn ${tab === t ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Stats' && (
        statsLoading ? <LoadingSpinner label="Loading stats..." /> : <TeamStatsTable stats={stats} />
      )}
      {tab === 'Standings' && <StandingsTable records={divisionRecord} />}
      {tab === 'Roster' && (
        rosterLoading ? <LoadingSpinner label="Loading roster..." /> : <RosterList roster={roster} />
      )}
    </div>
  )
}

function HeroStat({ label, value, accent }) {
  return (
    <div className={`flex flex-col items-center rounded-xl px-3 py-2.5 ${
      accent ? 'bg-mlb-red/10 ring-1 ring-mlb-red/25' : 'bg-navy-700/40'
    }`}>
      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">{label}</span>
      <span className={`text-xl font-black font-mono leading-none ${accent ? 'text-mlb-red' : 'text-white'}`}>
        {value ?? '—'}
      </span>
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
    <div className="space-y-3">
      {order.map((posType) => {
        const players = byPosition[posType]
        if (!players?.length) return null
        return (
          <div key={posType} className="card rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-navy-700/60 flex items-center gap-2">
              <span className="w-1 h-3.5 rounded-full bg-mlb-blue shrink-0" />
              <h3 className="section-label">{posType}s</h3>
            </div>
            <div className="p-2 space-y-px">
              {players.map((p) => (
                <div
                  key={p.person?.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-navy-700/40 transition-colors"
                >
                  <span className="text-sm text-white">{p.person?.fullName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-mono">{p.position?.abbreviation}</span>
                    <span className="text-xs text-gray-600 font-mono w-8 text-right">#{p.jerseyNumber ?? '?'}</span>
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
