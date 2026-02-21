export default function PlayByPlay({ allPlays }) {
  if (!allPlays?.length) {
    return <p className="text-gray-500 py-8 text-center">No play data available yet.</p>
  }

  // Show last 20 plays in reverse chronological order
  const recent = [...allPlays].reverse().slice(0, 30)

  return (
    <div className="space-y-2">
      {recent.map((play, idx) => {
        const result = play.result
        const about = play.about
        const isScoring = result?.isOut === false && (result?.rbi > 0 || result?.eventType === 'home_run')

        return (
          <div
            key={play.atBatIndex ?? idx}
            className={`rounded-lg p-3 text-sm ${
              isScoring
                ? 'bg-mlb-red/10 border border-mlb-red/30'
                : 'bg-navy-800/50 border border-navy-700/50'
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <span className="text-gray-400 text-xs mr-2">
                  {about?.halfInning === 'top' ? '▲' : '▼'} {about?.inning}
                </span>
                <span className={`font-medium ${isScoring ? 'text-mlb-red' : 'text-white'}`}>
                  {result?.event ?? '—'}
                </span>
                {result?.description && (
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                    {result.description}
                  </p>
                )}
              </div>
              {result?.rbi > 0 && (
                <span className="shrink-0 text-xs font-bold bg-mlb-red text-white px-2 py-0.5 rounded-full">
                  {result.rbi} RBI
                </span>
              )}
            </div>
            {result?.awayScore != null && (
              <div className="mt-1 text-xs text-gray-500">
                Score: {result.awayScore} – {result.homeScore}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
