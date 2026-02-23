/**
 * StatcastPanel — in-game batted ball Statcast data.
 *
 * Data from liveData.plays.allPlays[].playEvents[].hitData:
 *   launchSpeed   — exit velocity (mph)
 *   launchAngle   — launch angle (degrees)
 *   totalDistance — projected distance (ft)
 *   trajectory    — "ground_ball" | "line_drive" | "fly_ball" | "popup"
 *   hardness      — "soft" | "medium" | "hard"
 */

// ── Barrel definition (simplified MLB Statcast) ───────────────────────────────
// Barrel: EV ≥ 98 mph AND 8° ≤ LA ≤ 50°  (with EV threshold relaxing per MLB spec)
function isBarrel(ev, la) {
  if (ev == null || la == null) return false
  if (ev >= 98  && la >= 8  && la <= 50) return true
  if (ev >= 95  && la >= 15 && la <= 40) return true
  return false
}
function isHardHit(ev) { return ev != null && ev >= 95 }

// Trajectory label
const TRAJ_LABEL = {
  ground_ball:  'GB',
  line_drive:   'LD',
  fly_ball:     'FB',
  popup:        'PU',
  bunt_grounder:'BG',
}

function qualityLabel(ev, la) {
  if (isBarrel(ev, la)) return { text: 'Barrel', cls: 'text-mlb-red' }
  if (isHardHit(ev))    return { text: 'Hard Hit', cls: 'text-amber-400' }
  return null
}

// ── Extract batted-ball events from allPlays ───────────────────────────────────
function extractBattedBalls(allPlays) {
  const results = []
  for (const play of allPlays ?? []) {
    const hitEvent = play.playEvents?.find(
      (e) => e.hitData?.launchSpeed != null || e.hitData?.launchAngle != null
    )
    if (!hitEvent) continue
    const hd = hitEvent.hitData
    results.push({
      inning:  play.about?.inning,
      half:    play.about?.halfInning === 'top' ? '▲' : '▼',
      batter:  play.matchup?.batter?.fullName ?? '—',
      pitcher: play.matchup?.pitcher?.fullName ?? '—',
      event:   play.result?.event ?? '—',
      ev:      hd.launchSpeed,
      la:      hd.launchAngle,
      dist:    hd.totalDistance,
      traj:    hd.trajectory,
    })
  }
  // Sort newest first (reverse inning order)
  return results.reverse()
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function StatcastPanel({ allPlays }) {
  const balls = extractBattedBalls(allPlays)

  if (balls.length === 0) {
    return (
      <div className="card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-4 rounded-full bg-mlb-red shrink-0" />
          <h3 className="section-label">Statcast</h3>
        </div>
        <p className="text-gray-600 text-sm">No batted ball data available.</p>
      </div>
    )
  }

  // Summary metrics
  const withEV   = balls.filter((b) => b.ev != null)
  const avgEV    = withEV.length ? (withEV.reduce((s, b) => s + b.ev, 0) / withEV.length).toFixed(1) : null
  const maxEV    = withEV.length ? Math.max(...withEV.map((b) => b.ev)).toFixed(1) : null
  const barrels  = balls.filter((b) => isBarrel(b.ev, b.la)).length
  const hardHits = balls.filter((b) => isHardHit(b.ev)).length
  const hardHitPct = withEV.length ? Math.round((hardHits / withEV.length) * 100) : null

  return (
    <div className="space-y-6">
      {/* ── Summary tiles ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Tile label="Avg Exit Velo" value={avgEV != null ? `${avgEV} mph` : '—'} />
        <Tile label="Max Exit Velo" value={maxEV != null ? `${maxEV} mph` : '—'} accent />
        <Tile label="Barrels"       value={barrels} />
        <Tile label="Hard Hit %"    value={hardHitPct != null ? `${hardHitPct}%` : '—'} />
      </div>

      {/* ── Batted ball table ── */}
      <div className="card rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-navy-700/60 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-mlb-red shrink-0" />
          <h3 className="section-label">Batted Balls</h3>
          <span className="ml-auto text-xs text-gray-600 font-mono">{balls.length} events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full stat-table">
            <thead>
              <tr>
                <th className="text-left">Batter</th>
                <th className="text-left hidden sm:table-cell">Event</th>
                <th className="text-center">EV</th>
                <th className="text-center">LA</th>
                <th className="text-center hidden sm:table-cell">Dist</th>
                <th className="text-center">Type</th>
                <th className="text-center hidden sm:table-cell">Inn</th>
              </tr>
            </thead>
            <tbody>
              {balls.map((b, idx) => {
                const barrel   = isBarrel(b.ev, b.la)
                const hardHit  = !barrel && isHardHit(b.ev)
                const quality  = qualityLabel(b.ev, b.la)

                return (
                  <tr
                    key={idx}
                    className={barrel ? 'bg-mlb-red/5' : hardHit ? 'bg-amber-500/5' : ''}
                  >
                    {/* Batter */}
                    <td className="font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={barrel ? 'text-mlb-red' : hardHit ? 'text-amber-300' : 'text-gray-200'}>
                          {b.batter}
                        </span>
                        {quality && (
                          <span className={`text-[9px] font-black uppercase tracking-wide ${quality.cls} hidden sm:inline`}>
                            {quality.text}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Event */}
                    <td className="text-gray-400 text-xs hidden sm:table-cell">{b.event}</td>

                    {/* EV */}
                    <td className={`text-center font-mono font-bold tabular-nums ${
                      barrel ? 'text-mlb-red' : hardHit ? 'text-amber-300' : 'text-gray-300'
                    }`}>
                      {b.ev != null ? `${b.ev.toFixed(1)}` : '—'}
                    </td>

                    {/* LA */}
                    <td className="text-center font-mono text-gray-400 tabular-nums">
                      {b.la != null ? `${b.la > 0 ? '+' : ''}${Math.round(b.la)}°` : '—'}
                    </td>

                    {/* Distance */}
                    <td className="text-center font-mono text-gray-500 tabular-nums hidden sm:table-cell">
                      {b.dist != null ? `${Math.round(b.dist)} ft` : '—'}
                    </td>

                    {/* Trajectory */}
                    <td className="text-center text-[11px] font-mono text-gray-600">
                      {TRAJ_LABEL[b.traj] ?? '—'}
                    </td>

                    {/* Inning */}
                    <td className="text-center text-gray-600 text-xs font-mono hidden sm:table-cell">
                      {b.half}{b.inning}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Tile({ label, value, accent }) {
  return (
    <div className="card rounded-xl px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">{label}</p>
      <p className={`text-xl font-black font-mono tabular-nums ${accent ? 'text-mlb-red' : 'text-white'}`}>
        {value}
      </p>
    </div>
  )
}
