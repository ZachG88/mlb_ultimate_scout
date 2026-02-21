import { useQuery } from '@tanstack/react-query'
import { fetchLiveFeed } from '../api/gamesApi'

function isLive(data) {
  return data?.gameData?.status?.abstractGameState === 'Live'
}

// The v1.1 live feed embeds linescore and boxscore in liveData,
// so a single hook is all we need for the game detail page.
export function useLiveFeed(gamePk) {
  return useQuery({
    queryKey: ['liveFeed', gamePk],
    queryFn: () => fetchLiveFeed(gamePk),
    enabled: !!gamePk,
    staleTime: 10_000,
    // query.state.data is the raw feed object (no select transform), so isLive works correctly
    refetchInterval: (query) => (isLive(query.state.data) ? 15_000 : false),
  })
}
