import mlbClient from './mlbClient'

/** Fetch all players for a season */
export const fetchAllPlayers = (season) =>
  mlbClient.get('/sports/1/players', { params: { season } })

/** Fetch a player's profile */
export const fetchPlayer = (playerId) =>
  mlbClient.get(`/people/${playerId}`)

/** Fetch a player's season stats for a given group (hitting or pitching) */
export const fetchPlayerStats = (playerId, season, group = 'hitting') =>
  mlbClient.get(`/people/${playerId}/stats`, {
    params: {
      stats: 'season',
      group,
      season,
    },
  })
