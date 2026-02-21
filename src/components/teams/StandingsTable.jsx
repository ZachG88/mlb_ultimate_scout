import { useNavigate } from 'react-router-dom'
import { fmtPct } from '../../utils/statsUtils'

export default function StandingsTable({ records }) {
  const navigate = useNavigate()
  if (!records?.length) return null

  return (
    <div className="space-y-6">
      {records.map((division) => (
        <div key={division.division?.id} className="rounded-xl border border-navy-700 overflow-hidden">
          <div className="bg-navy-800 px-4 py-2 border-b border-navy-700">
            <h3 className="text-sm font-semibold text-gray-200">{division.division?.name}</h3>
          </div>
          {/* overflow-x-auto lets the table scroll horizontally on narrow screens */}
          <div className="overflow-x-auto">
          <table className="w-full stat-table">
            <thead>
              <tr className="border-b border-navy-700/50">
                <th>Team</th>
                <th className="text-center">W</th>
                <th className="text-center">L</th>
                <th className="text-center">PCT</th>
                <th className="text-center">GB</th>
                <th className="text-center">STRK</th>
                <th className="text-center hidden sm:table-cell">HOME</th>
                <th className="text-center hidden sm:table-cell">AWAY</th>
              </tr>
            </thead>
            <tbody>
              {division.teamRecords?.map((rec) => {
                const home = rec.records?.find((r) => r.type === 'home') ?? {}
                const away = rec.records?.find((r) => r.type === 'away') ?? {}
                return (
                  <tr
                    key={rec.team?.id}
                    className="border-b border-navy-700/30 cursor-pointer hover:bg-navy-700/30 transition-colors"
                    onClick={() => navigate(`/teams/${rec.team?.id}`)}
                  >
                    <td className="font-medium text-white max-w-[120px] sm:max-w-none truncate">{rec.team?.name}</td>
                    <td className="text-center text-gray-300 font-mono">{rec.wins}</td>
                    <td className="text-center text-gray-300 font-mono">{rec.losses}</td>
                    <td className="text-center text-gray-300 font-mono">{fmtPct(rec.winningPercentage)}</td>
                    <td className="text-center text-gray-400 font-mono">{rec.gamesBack}</td>
                    <td className={`text-center font-medium font-mono ${
                      rec.streak?.streakType === 'wins' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {rec.streak?.streakCode ?? '—'}
                    </td>
                    <td className="text-center text-gray-400 font-mono hidden sm:table-cell">
                      {home.wins ?? '—'}-{home.losses ?? '—'}
                    </td>
                    <td className="text-center text-gray-400 font-mono hidden sm:table-cell">
                      {away.wins ?? '—'}-{away.losses ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      ))}
    </div>
  )
}
