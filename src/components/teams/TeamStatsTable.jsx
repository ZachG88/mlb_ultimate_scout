import { fmtAvg, fmtRate } from '../../utils/statsUtils'

const HITTING_COLS = [
  { key: 'avg', label: 'AVG', fmt: fmtAvg },
  { key: 'obp', label: 'OBP', fmt: fmtAvg },
  { key: 'slg', label: 'SLG', fmt: fmtAvg },
  { key: 'ops', label: 'OPS', fmt: fmtAvg },
  { key: 'homeRuns', label: 'HR', fmt: (v) => v },
  { key: 'rbi', label: 'RBI', fmt: (v) => v },
  { key: 'runs', label: 'R', fmt: (v) => v },
  { key: 'strikeOuts', label: 'SO', fmt: (v) => v },
  { key: 'stolenBases', label: 'SB', fmt: (v) => v },
]

const PITCHING_COLS = [
  { key: 'era', label: 'ERA', fmt: (v) => fmtRate(v) },
  { key: 'whip', label: 'WHIP', fmt: (v) => fmtRate(v) },
  { key: 'wins', label: 'W', fmt: (v) => v },
  { key: 'losses', label: 'L', fmt: (v) => v },
  { key: 'saves', label: 'SV', fmt: (v) => v },
  { key: 'strikeOuts', label: 'K', fmt: (v) => v },
  { key: 'inningsPitched', label: 'IP', fmt: (v) => v },
  { key: 'homeRuns', label: 'HR', fmt: (v) => v },
]

export default function TeamStatsTable({ stats }) {
  if (!stats?.length) {
    return <p className="text-gray-500 py-6 text-center">No stats available.</p>
  }

  return (
    <div className="space-y-6">
      {stats.map((statGroup) => {
        const group = statGroup.group?.displayName ?? statGroup.group?.name ?? 'Stats'
        const splits = statGroup.splits ?? []
        const teamStat = splits[0]?.stat
        const cols = group.toLowerCase().includes('pitch') ? PITCHING_COLS : HITTING_COLS

        if (!teamStat) return null

        return (
          <div key={group} className="rounded-xl border border-navy-700 overflow-hidden">
            <div className="bg-navy-800 px-4 py-2 border-b border-navy-700">
              <h3 className="text-sm font-semibold text-gray-200 capitalize">{group} Stats</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full stat-table">
                <thead>
                  <tr className="border-b border-navy-700/50">
                    {cols.map((c) => (
                      <th key={c.key} className="text-center">{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {cols.map((c) => (
                      <td key={c.key} className="text-center text-gray-200 font-mono">
                        {c.fmt(teamStat[c.key]) ?? '—'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
