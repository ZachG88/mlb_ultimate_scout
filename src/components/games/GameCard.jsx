import { useNavigate } from 'react-router-dom'
import { gameStatusInfo } from '../../utils/statsUtils'
import { formatGameTime as fmtTime } from '../../utils/dateUtils'

export default function GameCard({ game }) {
  const navigate = useNavigate()
  const { teams, status, gamePk, gameDate } = game
  const away = teams?.away
  const home = teams?.home
  const { label: statusLabel, color: statusColor } = gameStatusInfo(status)
  const isScheduled = status?.abstractGameState === 'Preview'
  const isFinal = status?.abstractGameState === 'Final'
  const isLive = status?.abstractGameState === 'Live'

  return (
    <button
      onClick={() => navigate(`/games/${gamePk}`)}
      className="w-full text-left bg-navy-800 border border-navy-700 hover:border-mlb-red/60
                 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-mlb-red/10 group"
    >
      {/* Status bar */}
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs font-semibold uppercase tracking-wider ${statusColor}`}>
          {isLive && <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-1.5 animate-pulse" />}
          {statusLabel}
        </span>
        {isScheduled && (
          <span className="text-xs text-gray-500">{fmtTime(gameDate)}</span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-2">
        <TeamRow
          team={away.team}
          score={away.score}
          record={away.leagueRecord}
          isWinner={isFinal && away.isWinner}
          showScore={!isScheduled}
        />
        <TeamRow
          team={home.team}
          score={home.score}
          record={home.leagueRecord}
          isWinner={isFinal && home.isWinner}
          showScore={!isScheduled}
        />
      </div>

      {/* Linescore summary (inning info if live) */}
      {isLive && game.linescore && (
        <div className="mt-3 pt-3 border-t border-navy-700 text-xs text-gray-400">
          {game.linescore.inningHalf === 'Top' ? '▲' : '▼'} {game.linescore.currentInningOrdinal}
          {game.linescore.outs != null && ` · ${game.linescore.outs} out${game.linescore.outs !== 1 ? 's' : ''}`}
        </div>
      )}
    </button>
  )
}

function TeamRow({ team, score, record, isWinner, showScore }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`font-bold text-sm w-8 shrink-0 ${isWinner ? 'text-white' : 'text-gray-300'}`}>
          {team?.abbreviation}
        </span>
        <span className="text-gray-400 text-xs truncate">{team?.teamName}</span>
        {record && (
          <span className="text-gray-600 text-xs hidden sm:inline">
            ({record.wins}-{record.losses})
          </span>
        )}
      </div>
      {showScore && score != null && (
        <span className={`font-mono font-bold text-lg ${isWinner ? 'text-white' : 'text-gray-400'}`}>
          {score}
        </span>
      )}
    </div>
  )
}
