import mlbClient from './mlbClient'

/** Fetch all 30 MLB teams */
export const fetchTeams = () =>
  mlbClient.get('/teams', { params: { sportId: 1 } })

/** Fetch a single team's details */
export const fetchTeam = (teamId) =>
  mlbClient.get(`/teams/${teamId}`)

/** Fetch a team's season stats (hitting + pitching) */
export const fetchTeamStats = (teamId, season) =>
  mlbClient.get(`/teams/${teamId}/stats`, {
    params: {
      stats: 'season',
      group: 'hitting,pitching',
      season,
    },
  })

/** Fetch a team's active roster */
export const fetchTeamRoster = (teamId, season) =>
  mlbClient.get(`/teams/${teamId}/roster`, {
    params: { rosterType: 'active', season },
  })

/** Fetch division standings */
export const fetchStandings = (season) =>
  mlbClient.get('/standings', {
    params: {
      leagueId: '103,104',
      season,
    },
  })
