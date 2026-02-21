import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLiveFeed } from '../hooks/useGame'
import { gameStatusInfo } from '../utils/statsUtils'
import LinescoreGrid from '../components/games/LinescoreGrid'
import BoxScore from '../components/games/BoxScore'
import PlayByPlay from '../components/games/PlayByPlay'
import PitchCount from '../components/games/PitchCount'
import LiveSituation from '../components/games/LiveSituation'
import PitchZone from '../components/games/PitchZone'
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
  const isFinal = status?.abstractGameState === 'Final'

  const away = gameData?.teams?.away
  const home = gameData?.teams?.home
  const awayScore = liveData?.linescore?.teams?.away?.runs ?? 0
  const homeScore = liveData?.linescore?.teams?.home?.runs ?? 0
  const awayWins = isLive ? false : awayScore > homeScore
  const homeWins = isLive ? false : homeScore > awayScore

  const currentPlay = liveData?.plays?.currentPlay
  const allPlays = liveData?.plays?.allPlays ?? []
  const boxScore = liveData?.boxscore

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-gray-500 hover:text-white text-sm mb-4 flex items-center gap-1.5 transition-colors"
      >
        ← Back
      </button>

      {/* Score hero */}
      <div
        className="card rounded-xl overflow-hidden mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(6,23,40,0) 40%, rgba(200,16,46,0.08) 100%)' }}
      >
        <div className="p-6">
          {/* Status row */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className={`text-sm font-bold tracking-wide flex items-center gap-1.5 ${statusColor}`}>
              {isLive && (
                <span className="inline-block h-2 w-2 rounded-full bg-status-live animate-pulse" />
              )}
              {statusLabel}
            </span>
            {isLive && liveData?.linescore && (
              <span className="text-gray-500 text-sm font-mono">
                {liveData.linescore.inningHalf === 'Top' ? '▲' : '▼'}{' '}
                {liveData.linescore.currentInningOrdinal}
                {liveData.linescore.outs != null &&
                  ` · ${liveData.linescore.outs} out${liveData.linescore.outs !== 1 ? 's' : ''}`}
              </span>
            )}
          </div>

          {/* Scoreboard */}
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            <TeamScore team={away} score={awayScore} isWinner={awayWins} label="Away" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-black text-navy-600 font-mono">–</span>
              {isFinal && (
                <span className="text-xs text-gray-600 uppercase tracking-widest">Final</span>
              )}
            </div>
            <TeamScore team={home} score={homeScore} isWinner={homeWins} label="Home" />
          </div>

          {/* Venue */}
          <p className="text-center text-gray-600 text-xs mt-4">
            {gameData?.venue?.name}
          </p>

          {/* Last play description */}
          {isLive && currentPlay?.result?.description && (
            <div className="mt-4 bg-navy-700/40 border border-navy-600/40 rounded-xl px-4 py-2.5 text-sm text-gray-300 text-center">
              {currentPlay.result.description}
            </div>
          )}
        </div>
      </div>

      {/* Live pitch count */}
      {isLive && <PitchCount liveData={liveData} />}

      {/* Field situation + pitch zone — side by side on lg screens */}
      {isLive && (
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:flex-1 min-w-0">
            <LiveSituation liveData={liveData} className="" />
          </div>
          <div className="lg:flex-1 min-w-0">
            <PitchZone currentPlay={currentPlay} className="" />
          </div>
        </div>
      )}

      {/* Linescore */}
      {liveData?.linescore && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-4 rounded-full bg-gray-600 shrink-0" />
            <h2 className="section-label">Linescore</h2>
          </div>
          <LinescoreGrid linescore={liveData.linescore} />
        </div>
      )}

      {/* R / H / E stat badges */}
      {liveData?.linescore?.teams && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { side: 'away', team: away },
            { side: 'home', team: home },
          ].map(({ side, team }) => {
            const ls = liveData.linescore.teams[side]
            return (
              <div key={side} className="space-y-2">
                <p className="section-label">{team?.abbreviation ?? side}</p>
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
      <div className="flex border-b border-navy-700/60 mb-6">
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
    <div className="flex flex-col items-center gap-1 min-w-[90px]">
      <span className="section-label">{label}</span>
      <span className={`text-xl font-black tracking-tight ${isWinner ? 'text-white' : 'text-gray-400'}`}>
        {team?.abbreviation ?? '—'}
      </span>
      <span className={`text-6xl font-black font-mono tabular-nums leading-none ${
        isWinner ? 'text-white' : 'text-gray-500'
      }`}>
        {score}
      </span>
      <span className="text-xs text-gray-600 text-center leading-tight max-w-[110px] truncate">
        {team?.teamName}
      </span>
    </div>
  )
}
