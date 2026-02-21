import { useQuery } from '@tanstack/react-query'
import { fetchAllPlayers, fetchPlayerStats } from '../api/playersApi'

export function usePlayers(season) {
  return useQuery({
    queryKey: ['players', season],
    queryFn: () => fetchAllPlayers(season),
    select: (data) => data.people ?? [],
    enabled: !!season,
    staleTime: 60 * 60 * 1000, // roster changes infrequently
  })
}

export function usePlayerStats(playerId, season, group = 'hitting') {
  return useQuery({
    queryKey: ['playerStats', playerId, season, group],
    queryFn: () => fetchPlayerStats(playerId, season, group),
    select: (data) => data.stats?.[0]?.splits?.[0]?.stat ?? null,
    enabled: !!playerId && !!season,
    staleTime: 5 * 60 * 1000,
  })
}
