import { useQuery } from '@tanstack/react-query'
import { fetchSchedule } from '../api/scheduleApi'
import { todayEST } from '../utils/dateUtils'

export function useSchedule(date = todayEST()) {
  return useQuery({
    queryKey: ['schedule', date],
    queryFn: () => fetchSchedule(date),
    select: (data) => data.dates?.[0]?.games ?? [],
    staleTime: 30_000,
    refetchInterval: (query) => {
      // query.state.data is the RAW API response (pre-select), so navigate the raw shape
      const games = query.state.data?.dates?.[0]?.games ?? []
      const hasLive = games.some(
        (g) => g.status?.abstractGameState === 'Live'
      )
      return hasLive ? 30_000 : false
    },
  })
}
