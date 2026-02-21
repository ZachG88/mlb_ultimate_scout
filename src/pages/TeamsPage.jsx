import { useTeams } from '../hooks/useTeams'
import { useStandings } from '../hooks/useStandings'
import { currentSeason } from '../utils/dateUtils'
import TeamCard from '../components/teams/TeamCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'

// Division groupings — MLB division IDs
const DIVISIONS = {
  'American League': [
    { id: 200, name: 'AL West' },
    { id: 201, name: 'AL East' },
    { id: 202, name: 'AL Central' },
  ],
  'National League': [
    { id: 203, name: 'NL West' },
    { id: 204, name: 'NL East' },
    { id: 205, name: 'NL Central' },
  ],
}

export default function TeamsPage() {
  const season = currentSeason()
  const { data: teams, isLoading: teamsLoading, isError: teamsError, error: teamsErr, refetch } = useTeams()
  const { data: standings } = useStandings(season)

  // Build a lookup: teamId → standingsRecord
  const recordByTeam = {}
  standings?.forEach((div) => {
    div.teamRecords?.forEach((rec) => {
      recordByTeam[rec.team?.id] = rec
    })
  })

  // Build a lookup: divisionId → [teams]
  const teamsByDivision = {}
  teams?.forEach((team) => {
    const divId = team.division?.id
    if (divId) {
      if (!teamsByDivision[divId]) teamsByDivision[divId] = []
      teamsByDivision[divId].push(team)
    }
  })

  if (teamsLoading) return <LoadingSpinner label="Loading teams..." />
  if (teamsError) return <ErrorMessage error={teamsErr} retry={refetch} />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Teams</h1>
        <p className="text-gray-400 text-sm mt-0.5">{season} Season</p>
      </div>

      <div className="space-y-10">
        {Object.entries(DIVISIONS).map(([league, divisions]) => (
          <section key={league}>
            <h2 className="text-lg font-semibold text-mlb-red mb-4 border-b border-navy-700 pb-2">
              {league}
            </h2>
            <div className="space-y-6">
              {divisions.map((div) => {
                const divTeams = teamsByDivision[div.id] ?? []
                return (
                  <div key={div.id}>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                      {div.name}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                      {divTeams.map((team) => (
                        <TeamCard
                          key={team.id}
                          team={team}
                          record={recordByTeam[team.id]}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
