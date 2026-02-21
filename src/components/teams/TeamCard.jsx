import { useNavigate } from 'react-router-dom'

export default function TeamCard({ team, record }) {
  const navigate = useNavigate()
  const wins = record?.wins ?? '—'
  const losses = record?.losses ?? '—'
  const pct = record?.winningPercentage
    ? parseFloat(record.winningPercentage).toFixed(3).replace(/^0/, '')
    : '—'

  return (
    <button
      onClick={() => navigate(`/teams/${team.id}`)}
      className="w-full text-left card rounded-xl p-4
                 hover:bg-navy-700/50 hover:border-mlb-blue/40
                 hover:shadow-lg hover:shadow-black/40
                 transition-all group"
    >
      {/* Abbreviation + rank */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl font-black text-mlb-red font-mono tracking-tight">
          {team.abbreviation}
        </span>
        {record?.divisionRank && (
          <span className="text-xs text-gray-500 bg-navy-700/80 rounded px-1.5 py-0.5 font-mono">
            #{record.divisionRank}
          </span>
        )}
      </div>

      <p className="font-semibold text-white text-sm leading-tight">{team.name}</p>
      <p className="text-xs text-gray-500 mt-0.5 truncate">{team.venue?.name}</p>

      {record && (
        <div className="mt-3 pt-3 border-t border-navy-700/50 flex gap-4 text-xs font-mono">
          <span className="text-gray-200 font-bold">{wins}-{losses}</span>
          <span className="text-gray-500">{pct}</span>
          {record.gamesBack !== '-' && (
            <span className="text-gray-600">GB {record.gamesBack}</span>
          )}
        </div>
      )}
    </button>
  )
}
