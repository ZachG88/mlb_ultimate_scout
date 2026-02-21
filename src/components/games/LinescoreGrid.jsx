export default function LinescoreGrid({ linescore }) {
  if (!linescore) return null

  const innings = linescore.innings ?? []
  const { teams } = linescore

  const awayRuns   = teams?.away?.runs   ?? 0
  const homeRuns   = teams?.home?.runs   ?? 0
  const awayHits   = teams?.away?.hits   ?? 0
  const homeHits   = teams?.home?.hits   ?? 0
  const awayErrors = teams?.away?.errors ?? 0
  const homeErrors = teams?.home?.errors ?? 0

  // Pad to at least 9 innings
  const displayInnings = innings.length >= 9
    ? innings
    : [...innings, ...Array(9 - innings.length).fill(null)]

  const currentInning = linescore.currentInning

  return (
    <div className="overflow-x-auto card rounded-xl">
      <table className="w-full text-sm font-mono">
        <thead>
          <tr className="border-b border-navy-700/60">
            <th className="text-left px-4 py-2.5 text-gray-500 font-bold w-16">Team</th>
            {displayInnings.map((_, i) => (
              <th
                key={i}
                className={`px-2 py-2.5 text-center w-8 font-bold ${
                  currentInning === i + 1 ? 'text-mlb-blue' : 'text-gray-600'
                }`}
              >
                {i + 1}
              </th>
            ))}
            <th className="px-3 py-2.5 text-mlb-red font-black text-center border-l border-navy-700/60">R</th>
            <th className="px-3 py-2.5 text-gray-500 font-bold text-center">H</th>
            <th className="px-3 py-2.5 text-gray-500 font-bold text-center">E</th>
          </tr>
        </thead>
        <tbody>
          {/* Away */}
          <tr className="border-b border-navy-700/40">
            <td className="px-4 py-2.5 font-black text-white">
              {linescore.teams?.away?.team?.abbreviation ?? 'AWY'}
            </td>
            {displayInnings.map((inn, i) => (
              <td key={i} className="px-2 py-2.5 text-center text-gray-400">
                {inn?.away?.runs != null ? inn.away.runs : <span className="text-gray-700">·</span>}
              </td>
            ))}
            <td className="px-3 py-2.5 text-center font-black text-mlb-red border-l border-navy-700/60">{awayRuns}</td>
            <td className="px-3 py-2.5 text-center text-gray-400">{awayHits}</td>
            <td className="px-3 py-2.5 text-center text-gray-400">{awayErrors}</td>
          </tr>
          {/* Home */}
          <tr>
            <td className="px-4 py-2.5 font-black text-white">
              {linescore.teams?.home?.team?.abbreviation ?? 'HME'}
            </td>
            {displayInnings.map((inn, i) => (
              <td key={i} className="px-2 py-2.5 text-center text-gray-400">
                {inn?.home?.runs != null ? inn.home.runs : <span className="text-gray-700">·</span>}
              </td>
            ))}
            <td className="px-3 py-2.5 text-center font-black text-mlb-red border-l border-navy-700/60">{homeRuns}</td>
            <td className="px-3 py-2.5 text-center text-gray-400">{homeHits}</td>
            <td className="px-3 py-2.5 text-center text-gray-400">{homeErrors}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
