/**
 * PitchCount — live pitch count panel for GameDetailPage.
 *
 * Data source: liveData from the v1.1 live feed.
 *   Current pitcher:  liveData.linescore.defense.pitcher
 *   Current batter:   liveData.linescore.offense.batter
 *   At-bat count:     liveData.plays.currentPlay.count  { balls, strikes, outs }
 *   Pitcher game log: liveData.boxscore.teams[side].players['ID<id>'].stats.pitching
 *     → numberOfPitches, strikes (thrown), strikeOuts, baseOnBalls, inningsPitched, era
 */
export default function PitchCount({ liveData }) {
  const defense = liveData?.linescore?.defense
  const offense = liveData?.linescore?.offense
  const currentPitcher = defense?.pitcher
  const currentBatter = offense?.batter
  const count = liveData?.plays?.currentPlay?.count

  // Resolve which boxscore side is currently pitching
  const bsTeams = liveData?.boxscore?.teams
  const defenseTeamId = defense?.team?.id
  const awayTeamId = bsTeams?.away?.team?.id
  const pitchingSide = defenseTeamId != null && defenseTeamId === awayTeamId ? 'away' : 'home'

  const pitcherStats = currentPitcher?.id
    ? bsTeams?.[pitchingSide]?.players?.[`ID${currentPitcher.id}`]?.stats?.pitching
    : null

  if (!currentPitcher) return null

  const pitchesThrown = pitcherStats?.numberOfPitches ?? 0
  const strikesThrown = pitcherStats?.strikes ?? 0
  const ballsThrown = pitchesThrown - strikesThrown

  // Pitch efficiency %
  const strikePercent = pitchesThrown > 0
    ? Math.round((strikesThrown / pitchesThrown) * 100)
    : null

  return (
    <div className="card rounded-xl p-4 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-mlb-blue shrink-0" />
        <h3 className="section-label">Live Pitch Count</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Pitcher info + stats */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-lg leading-tight truncate">{currentPitcher.fullName}</p>
          <p className="text-gray-500 text-xs mt-0.5">{defense?.team?.name ?? defense?.team?.abbreviation}</p>

          <div className="mt-3 grid grid-cols-4 gap-2">
            <PitchStat label="P" value={pitchesThrown} highlight />
            <PitchStat label="IP" value={pitcherStats?.inningsPitched ?? '—'} />
            <PitchStat label="K" value={pitcherStats?.strikeOuts ?? '—'} />
            <PitchStat label="BB" value={pitcherStats?.baseOnBalls ?? '—'} />
          </div>

          {/* Strike / Ball breakdown bar */}
          {pitchesThrown > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Strikes <span className="text-white font-mono font-bold">{strikesThrown}</span></span>
                <span className="text-gray-600">{strikePercent}% strikes</span>
                <span>Balls <span className="text-white font-mono font-bold">{ballsThrown}</span></span>
              </div>
              <div className="h-2 rounded-full bg-navy-700 overflow-hidden flex">
                <div
                  className="h-full bg-mlb-blue rounded-full transition-all duration-500"
                  style={{ width: `${strikePercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Current at-bat count */}
        {count != null && (
          <div className="flex flex-col items-center justify-center gap-2 bg-navy-700/50 rounded-xl px-5 py-3 min-w-[130px] shrink-0">
            <span className="section-label">Count</span>

            {/* Big number display */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black font-mono text-mlb-blue">{count.balls}</span>
              <span className="text-gray-600 text-2xl font-light">-</span>
              <span className="text-4xl font-black font-mono text-mlb-red">{count.strikes}</span>
            </div>

            {/* Dot indicators */}
            <div className="flex flex-col items-center gap-1">
              {/* Balls (blue) */}
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i < count.balls ? 'bg-mlb-blue' : 'bg-navy-600'
                    }`}
                  />
                ))}
              </div>
              {/* Strikes (red) */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i < count.strikes ? 'bg-mlb-red' : 'bg-navy-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-600 text-xs">
              {count.outs} out{count.outs !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Current batter */}
      {currentBatter && (
        <div className="mt-3 pt-3 border-t border-navy-700/50 flex items-center gap-2 flex-wrap">
          <span className="section-label">At Bat:</span>
          <span className="text-white text-sm font-semibold">{currentBatter.fullName}</span>
          <span className="text-gray-500 text-xs">({offense?.team?.abbreviation})</span>
        </div>
      )}
    </div>
  )
}

function PitchStat({ label, value, highlight }) {
  return (
    <div className={`flex flex-col items-center rounded-lg py-2 px-1 ${
      highlight
        ? 'bg-mlb-blue/10 ring-1 ring-mlb-blue/30'
        : 'bg-navy-700/50'
    }`}>
      <span className="text-xs text-gray-500 font-bold uppercase tracking-wide leading-none mb-1">{label}</span>
      <span className={`text-xl font-black font-mono leading-none ${highlight ? 'text-mlb-blue' : 'text-white'}`}>
        {value}
      </span>
    </div>
  )
}
