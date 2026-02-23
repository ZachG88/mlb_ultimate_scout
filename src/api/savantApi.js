import axios from 'axios'

const savantClient = axios.create({
  baseURL: '/savant-api',
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

savantClient.interceptors.response.use(
  (r) => r.data,
  (e) => Promise.reject(new Error(e.response?.data?.message ?? e.message))
)

/**
 * Expected batting/pitching Statcast stats.
 * type: 'batter' | 'pitcher'
 * Returns array of player stat objects with fields:
 *   player_id, xba, xslg, xwoba, barrel_batted_rate,
 *   hard_hit_percent, exit_velocity_avg, launch_angle_avg
 */
export const fetchExpectedStats = (type = 'batter', year) =>
  savantClient.get('/leaderboard/expected_statistics', {
    params: { type, year, position: '', team: '', min: 25 },
  })

/**
 * Sprint speed leaderboard.
 * Returns { data: [...] } with fields: player_id, sprint_speed, hp_to_1b
 */
export const fetchSprintSpeed = (year) =>
  savantClient.get('/leaderboard/sprint_speed', {
    params: { year, position: '', team: 0, min: 10 },
  })
