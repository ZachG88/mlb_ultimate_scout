export default function LinescoreGrid({ linescore }) {
  if (!linescore) return null

  const innings = linescore.innings ?? []
  const { teams } = linescore

  const awayRuns = teams?.away?.runs ?? 0
  const homeRuns = teams?.home?.runs ?? 0
  const awayHits = teams?.away?.hits ?? 0
  const homeHits = teams?.home?.hits ?? 0
  const awayErrors = teams?.away?.errors ?? 0
  const homeErrors = teams?.home?.errors ?? 0

  // Pad to at least 9 innings
  const displayInnings = innings.length >= 9 ? innings : [
    ...innings,
    ...Array(9 - innings.length).fill(null),
  ]

  return (
    <div className="overflow-x-auto rounded-xl border border-navy-700">
      <table className="w-full text-sm font-mono">
        <thead>
          <tr className="border-b border-navy-700 bg-navy-800/60">
            <th className="text-left px-4 py-2 text-gray-400 font-medium w-24">Team</th>
            {displayInnings.map((_, i) => (
              <th key={i} className="px-2 py-2 text-gray-400 font-medium text-center w-8">
                {i + 1}
              </th>
            ))}
            <th className="px-3 py-2 text-white font-bold text-center border-l border-navy-600">R</th>
            <th className="px-3 py-2 text-gray-400 font-medium text-center">H</th>
            <th className="px-3 py-2 text-gray-400 font-medium text-center">E</th>
          </tr>
        </thead>
        <tbody>
          {/* Away */}
          <tr className="border-b border-navy-700/50">
            <td className="px-4 py-2 font-semibold text-white">
              {linescore.teams?.away?.team?.abbreviation ?? 'AWY'}
            </td>
            {displayInnings.map((inn, i) => (
              <td key={i} className="px-2 py-2 text-center text-gray-300">
                {inn?.away?.runs != null ? inn.away.runs : '—'}
              </td>
            ))}
            <td className="px-3 py-2 text-center font-bold text-white border-l border-navy-600">{awayRuns}</td>
            <td className="px-3 py-2 text-center text-gray-300">{awayHits}</td>
            <td className="px-3 py-2 text-center text-gray-300">{awayErrors}</td>
          </tr>
          {/* Home */}
          <tr>
            <td className="px-4 py-2 font-semibold text-white">
              {linescore.teams?.home?.team?.abbreviation ?? 'HME'}
            </td>
            {displayInnings.map((inn, i) => (
              <td key={i} className="px-2 py-2 text-center text-gray-300">
                {inn?.home?.runs != null ? inn.home.runs : '—'}
              </td>
            ))}
            <td className="px-3 py-2 text-center font-bold text-white border-l border-navy-600">{homeRuns}</td>
            <td className="px-3 py-2 text-center text-gray-300">{homeHits}</td>
            <td className="px-3 py-2 text-center text-gray-300">{homeErrors}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
