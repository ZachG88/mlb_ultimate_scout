import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLiveFeed } from '../hooks/useGame'
import { gameStatusInfo } from '../utils/statsUtils'
import LinescoreGrid from '../components/games/LinescoreGrid'
import BoxScore from '../components/games/BoxScore'
import PlayByPlay from '../components/games/PlayByPlay'
import StatBadge from '../components/ui/StatBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'

const TABS = ['Box Score', 'Play by Play']

export default function GameDetailPage() {
  const { gamePk } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Box Score')

  const { data: feed, isLoading, isError, error, refetch } = useLiveFeed(gamePk)

  if (isLoading) return <LoadingSpinner label="Loading game data..." />
  if (isError) return <ErrorMessage error={error} retry={refetch} />
  if (!feed) return null

  const { gameData, liveData } = feed
  const status = gameData?.status
  const { label: statusLabel, color: statusColor } = gameStatusInfo(status)
  const isLive = status?.abstractGameState === 'Live'

  const away = gameData?.teams?.away
  const home = gameData?.teams?.home
  const awayScore = liveData?.linescore?.teams?.away?.runs ?? 0
  const homeScore = liveData?.linescore?.teams?.home?.runs ?? 0

  const currentPlay = liveData?.plays?.currentPlay
  const allPlays = liveData?.plays?.allPlays ?? []

  // Boxscore is embedded in the v1.1 live feed under liveData.boxscore
  const boxScore = liveData?.boxscore

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
      >
        ← Back
      </button>

      {/* Score header */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 mb-6">
        {/* Status */}
        <div className="text-center mb-4">
          <span className={`text-sm font-semibold ${statusColor}`}>
            {isLive && (
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-1.5 animate-pulse" />
            )}
            {statusLabel}
          </span>
          {isLive && liveData?.linescore && (
            <span className="text-gray-500 text-sm ml-3">
              {liveData.linescore.inningHalf === 'Top' ? '▲' : '▼'}{' '}
              {liveData.linescore.currentInningOrdinal}
              {liveData.linescore.outs != null &&
                ` · ${liveData.linescore.outs} out${liveData.linescore.outs !== 1 ? 's' : ''}`}
            </span>
          )}
        </div>

        {/* Scoreboard */}
        <div className="flex items-center justify-center gap-8">
          <TeamScore team={away} score={awayScore} isWinner={awayScore > homeScore && !isLive} label="Away" />
          <span className="text-3xl font-bold text-gray-600">–</span>
          <TeamScore team={home} score={homeScore} isWinner={homeScore > awayScore && !isLive} label="Home" />
        </div>

        {/* Venue */}
        <p className="text-center text-gray-500 text-xs mt-4">
          {gameData?.venue?.name}
        </p>

        {/* Current play description */}
        {isLive && currentPlay?.result?.description && (
          <div className="mt-4 bg-navy-700/50 rounded-lg px-4 py-2 text-sm text-gray-300 text-center">
            {currentPlay.result.description}
          </div>
        )}
      </div>

      {/* Linescore */}
      {liveData?.linescore && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Linescore</h2>
          <LinescoreGrid linescore={liveData.linescore} />
        </div>
      )}

      {/* Quick stat badges */}
      {liveData?.linescore?.teams && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { side: 'away', team: away },
            { side: 'home', team: home },
          ].map(({ side, team }) => {
            const ls = liveData.linescore.teams[side]
            return (
              <div key={side} className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">{team?.name}</p>
                <div className="flex gap-2 flex-wrap">
                  <StatBadge label="R" value={ls?.runs ?? 0} highlight />
                  <StatBadge label="H" value={ls?.hits ?? 0} />
                  <StatBadge label="E" value={ls?.errors ?? 0} />
                  <StatBadge label="LOB" value={ls?.leftOnBase ?? 0} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-navy-700 mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`tab-btn ${tab === t ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Box Score' && <BoxScore boxScore={boxScore} />}
      {tab === 'Play by Play' && <PlayByPlay allPlays={allPlays} />}
    </div>
  )
}

function TeamScore({ team, score, isWinner, label }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[80px]">
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <span className={`text-lg font-bold ${isWinner ? 'text-white' : 'text-gray-400'}`}>
        {team?.abbreviation ?? '—'}
      </span>
      <span className={`text-5xl font-black font-mono ${isWinner ? 'text-white' : 'text-gray-400'}`}>
        {score}
      </span>
      <span className="text-xs text-gray-500 text-center leading-tight max-w-[100px] truncate">
        {team?.teamName}
      </span>
    </div>
  )
}
