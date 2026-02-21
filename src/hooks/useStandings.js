import { useQuery } from '@tanstack/react-query'
import { fetchStandings } from '../api/teamsApi'

export function useStandings(season) {
  return useQuery({
    queryKey: ['standings', season],
    queryFn: () => fetchStandings(season),
    select: (data) => data.records ?? [],
    enabled: !!season,
    staleTime: 5 * 60 * 1000,
  })
}
