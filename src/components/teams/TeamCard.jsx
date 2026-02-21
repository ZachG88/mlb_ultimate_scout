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
      className="w-full text-left bg-navy-800 border border-navy-700 rounded-xl p-4
                 hover:border-mlb-red/50 hover:shadow-lg hover:shadow-mlb-red/10
                 transition-all group"
    >
      {/* Abbreviation badge */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl font-bold text-mlb-red font-mono group-hover:scale-105 transition-transform">
          {team.abbreviation}
        </span>
        {record?.divisionRank && (
          <span className="text-xs text-gray-500 bg-navy-700 rounded px-1.5 py-0.5">
            #{record.divisionRank} Div
          </span>
        )}
      </div>

      <p className="font-semibold text-white text-sm leading-tight">{team.name}</p>
      <p className="text-xs text-gray-400 mt-0.5">{team.venue?.name}</p>

      {record && (
        <div className="mt-3 flex gap-4 text-xs">
          <span className="text-gray-300 font-mono font-medium">
            {wins}-{losses}
          </span>
          <span className="text-gray-500">{pct}</span>
          {record.gamesBack !== '-' && (
            <span className="text-gray-500">GB: {record.gamesBack}</span>
          )}
        </div>
      )}
    </button>
  )
}
