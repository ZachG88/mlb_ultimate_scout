import mlbClient from './mlbClient'

/**
 * Fetch the game schedule for a given date.
 * @param {string} date - ISO date string (YYYY-MM-DD)
 */
export const fetchSchedule = (date) =>
  mlbClient.get('/schedule', {
    params: {
      sportId: 1,
      date,
      hydrate: 'team,linescore,flags,liveLookin,review',
    },
  })
