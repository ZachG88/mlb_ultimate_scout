import { useQuery } from '@tanstack/react-query'
import { fetchExpectedStats, fetchSprintSpeed } from '../api/savantApi'

// Normalise player_id to a Number for consistent Map keying
const toNum = (id) => Number(id)

/**
 * Returns a Map<playerId (number), statObject> for O(1) player lookup.
 * type: 'batter' | 'pitcher'
 */
export function useExpectedStats(type = 'batter', year, enabled = true) {
  return useQuery({
    queryKey: ['savant', 'expectedStats', type, year],
    queryFn: () => fetchExpectedStats(type, year),
    select: (data) => {
      const arr = Array.isArray(data) ? data : (data?.data ?? [])
      return new Map(arr.map((p) => [toNum(p.player_id), p]))
    },
    staleTime: 24 * 60 * 60 * 1000,  // updates once daily
    enabled: !!year && enabled,
  })
}

/**
 * Returns a Map<playerId (number), { sprint_speed, hp_to_1b }>.
 */
export function useSprintSpeed(year, enabled = true) {
  return useQuery({
    queryKey: ['savant', 'sprintSpeed', year],
    queryFn: () => fetchSprintSpeed(year),
    select: (data) => {
      const arr = Array.isArray(data) ? data : (data?.data ?? [])
      return new Map(arr.map((p) => [toNum(p.player_id), p]))
    },
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!year && enabled,
  })
}
