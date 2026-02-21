import { useQuery } from '@tanstack/react-query'
import { fetchTeams, fetchTeam, fetchTeamStats, fetchTeamRoster } from '../api/teamsApi'

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
    select: (data) => data.teams ?? [],
    staleTime: 60 * 60 * 1000, // 1 hour — team list rarely changes
  })
}

export function useTeam(teamId) {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => fetchTeam(teamId),
    select: (data) => data.teams?.[0] ?? null,
    enabled: !!teamId,
    staleTime: 60 * 60 * 1000,
  })
}

export function useTeamStats(teamId, season) {
  return useQuery({
    queryKey: ['teamStats', teamId, season],
    queryFn: () => fetchTeamStats(teamId, season),
    select: (data) => data.stats ?? [],
    enabled: !!teamId && !!season,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTeamRoster(teamId, season) {
  return useQuery({
    queryKey: ['teamRoster', teamId, season],
    queryFn: () => fetchTeamRoster(teamId, season),
    select: (data) => data.roster ?? [],
    enabled: !!teamId && !!season,
    staleTime: 5 * 60 * 1000,
  })
}
