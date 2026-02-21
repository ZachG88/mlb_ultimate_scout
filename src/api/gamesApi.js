import mlbClient from './mlbClient'

// The live game feed requires API v1.1 (v1 returns 404).
// v1.1 also contains linescore and boxscore embedded in liveData,
// so we no longer need separate endpoints for those.

/** Full live feed — includes linescore, boxscore, and play-by-play */
export const fetchLiveFeed = (gamePk) =>
  mlbClient.get(`/api/v1.1/game/${gamePk}/feed/live`, { baseURL: '/mlb-api' })
