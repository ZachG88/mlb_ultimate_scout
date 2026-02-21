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

  const borderColor = isLive
    ? 'border-l-status-live'
    : isFinal
    ? 'border-l-gray-600'
    : 'border-l-status-scheduled'

  return (
    <button
      onClick={() => navigate(`/games/${gamePk}`)}
      className={`w-full text-left card border-l-4 ${borderColor} p-4
                  hover:border-navy-500 hover:bg-navy-700/40
                  transition-all hover:shadow-xl hover:shadow-black/30 group`}
    >
      {/* Status row */}
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${statusColor}`}>
          {isLive && (
            <span className="inline-block h-2 w-2 rounded-full bg-status-live animate-pulse" />
          )}
          {statusLabel}
        </span>
        {isScheduled && (
          <span className="text-xs text-gray-500 font-mono">{fmtTime(gameDate)}</span>
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
        <div className="border-t border-navy-700/40" />
        <TeamRow
          team={home.team}
          score={home.score}
          record={home.leagueRecord}
          isWinner={isFinal && home.isWinner}
          showScore={!isScheduled}
        />
      </div>

      {/* Live inning info */}
      {isLive && game.linescore && (
        <div className="mt-3 pt-2.5 border-t border-navy-700/40 text-xs text-gray-400 flex items-center gap-1">
          <span className="text-status-live font-bold">
            {game.linescore.inningHalf === 'Top' ? '▲' : '▼'}{' '}
            {game.linescore.currentInningOrdinal}
          </span>
          {game.linescore.outs != null && (
            <span className="text-gray-500">
              · {game.linescore.outs} out{game.linescore.outs !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </button>
  )
}

function TeamRow({ team, score, record, isWinner, showScore }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`font-black text-sm w-8 shrink-0 font-mono tracking-tight ${
          isWinner ? 'text-white' : 'text-gray-300'
        }`}>
          {team?.abbreviation}
        </span>
        <span className="text-gray-400 text-xs truncate">{team?.teamName}</span>
        {record && (
          <span className="text-gray-600 text-xs hidden sm:inline font-mono">
            {record.wins}-{record.losses}
          </span>
        )}
      </div>
      {showScore && score != null && (
        <span className={`font-mono font-black text-xl tabular-nums ${
          isWinner ? 'text-white' : 'text-gray-500'
        }`}>
          {score}
        </span>
      )}
    </div>
  )
}
