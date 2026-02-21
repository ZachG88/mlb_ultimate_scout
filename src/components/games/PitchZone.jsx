/**
 * PitchZone — broadcast-style K-zone pitch location chart.
 *
 * SVG math (catcher's view, left = batter's right):
 *   ViewBox: 0 0 260 320
 *   pX: feet from plate center (positive = right side from catcher's view)
 *   pZ: feet above ground
 *
 *   X_CENTER = 130 (SVG center)
 *   X_SCALE  = 50 px/ft  →  svgX(pX) = 130 + pX * 50
 *   Z_SCALE  = 50 px/ft  →  svgY(pZ) = 20 + (5.0 − pZ) * 50
 *
 *   Plate width: 17 in = 1.4167 ft  →  ±0.7083 ft  →  ±35.4 SVG px
 *
 * Data path: liveData.plays.currentPlay.playEvents[].isPitch
 *   pitchData.coordinates.{pX, pZ}
 *   pitchData.{strikeZoneTop, strikeZoneBottom, startSpeed}
 *   details.type.{code, description}
 *   details.call.{code, description}
 */

// ── SVG coordinate helpers ─────────────────────────────────────────────────────
const VW = 260
const VH = 320

const X_CENTER  = 130
const X_SCALE   = 50
const Z_SCALE   = 50
const Z_DISPLAY = 5.0   // feet shown from 0 → 5.0
const Z_TOP_PAD = 20    // px above the pZ=5.0 line

const svgX = (pX) => X_CENTER + (pX ?? 0) * X_SCALE
const svgY = (pZ) => Z_TOP_PAD + (Z_DISPLAY - (pZ ?? 0)) * Z_SCALE

// Ground level (pZ = 0) in SVG px
const GROUND_Y = svgY(0)   // = 20 + 5*50 = 270

// Home plate edges
const PLATE_HALF      = 0.7083
const PLATE_LEFT      = svgX(-PLATE_HALF)   // ≈ 94.6
const PLATE_RIGHT     = svgX( PLATE_HALF)   // ≈ 165.4
const PLATE_W         = PLATE_RIGHT - PLATE_LEFT   // ≈ 70.8

// Default strike zone (updated per-pitch below)
const DEFAULT_SZ_TOP    = 3.5
const DEFAULT_SZ_BOTTOM = 1.5

// ── Call → color ──────────────────────────────────────────────────────────────
function callColor(code) {
  switch (code) {
    case 'B':           return { bg: '#1D4ED8', border: '#60A5FA', text: 'Ball'          }
    case 'C':           return { bg: '#B91C1C', border: '#FCA5A5', text: 'Called K'      }
    case 'S': case 'T': return { bg: '#7F1D1D', border: '#FCA5A5', text: 'Swinging K'   }
    case 'F':           return { bg: '#92400E', border: '#FCD34D', text: 'Foul'          }
    case 'X': case 'D':
    case 'E':           return { bg: '#1F2937', border: '#9CA3AF', text: 'In Play'       }
    default:            return { bg: '#1E3A5F', border: '#4B6A8A', text: code ?? '?'     }
  }
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PitchZone({ currentPlay, className = 'mb-6' }) {
  const pitches = (currentPlay?.playEvents ?? []).filter((e) => e.isPitch)

  if (pitches.length === 0) {
    return (
      <div className={`card rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-4 rounded-full bg-mlb-blue shrink-0" />
          <h3 className="section-label">Pitch Zone</h3>
        </div>
        <p className="text-gray-600 text-sm">No pitches in current at-bat.</p>
      </div>
    )
  }

  // Strike zone from the most recent pitch that has it
  const withSz  = pitches.filter((p) => p.pitchData?.strikeZoneTop)
  const szPitch = withSz[withSz.length - 1]
  const szTop    = szPitch?.pitchData?.strikeZoneTop    ?? DEFAULT_SZ_TOP
  const szBottom = szPitch?.pitchData?.strikeZoneBottom ?? DEFAULT_SZ_BOTTOM

  const szTopY    = svgY(szTop)
  const szBotY    = svgY(szBottom)
  const szH       = szBotY - szTopY

  // 3×3 dividers
  const col = PLATE_W / 3
  const row = szH / 3

  return (
    <div className={`card rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-mlb-blue shrink-0" />
        <h3 className="section-label">Pitch Zone</h3>
        <span className="ml-auto text-xs text-gray-600 font-mono">
          {pitches.length} pitch{pitches.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── K-zone SVG ── */}
        <div className="w-full lg:flex-1 max-w-xs mx-auto lg:mx-0">
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="w-full"
            style={{ maxHeight: '360px' }}
            aria-label="Strike zone pitch location"
          >
            {/* Background */}
            <rect width={VW} height={VH} fill="#020B18" rx={6} />

            {/* ── Strike zone box ── */}
            {/* Outer glow */}
            <rect
              x={PLATE_LEFT - 2} y={szTopY - 2}
              width={PLATE_W + 4} height={szH + 4}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} rx={2}
            />
            {/* Zone fill */}
            <rect
              x={PLATE_LEFT} y={szTopY}
              width={PLATE_W} height={szH}
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth={1.5}
              rx={1}
            />

            {/* ── 3×3 grid ── */}
            {[1, 2].map((n) => (
              <line
                key={`v${n}`}
                x1={PLATE_LEFT + col * n} y1={szTopY}
                x2={PLATE_LEFT + col * n} y2={szBotY}
                stroke="rgba(255,255,255,0.2)" strokeWidth={0.8}
              />
            ))}
            {[1, 2].map((n) => (
              <line
                key={`h${n}`}
                x1={PLATE_LEFT} y1={szTopY + row * n}
                x2={PLATE_RIGHT} y2={szTopY + row * n}
                stroke="rgba(255,255,255,0.2)" strokeWidth={0.8}
              />
            ))}

            {/* ── Zone height labels ── */}
            <text
              x={PLATE_LEFT - 5} y={szTopY + 3}
              textAnchor="end" dominantBaseline="middle"
              fill="rgba(255,255,255,0.35)" fontSize={8} fontFamily="monospace"
            >
              {szTop.toFixed(1)}'
            </text>
            <text
              x={PLATE_LEFT - 5} y={szBotY}
              textAnchor="end" dominantBaseline="middle"
              fill="rgba(255,255,255,0.35)" fontSize={8} fontFamily="monospace"
            >
              {szBottom.toFixed(1)}'
            </text>

            {/* ── Home plate ── */}
            <polygon
              points={`
                ${PLATE_LEFT},${GROUND_Y + 5}
                ${PLATE_RIGHT},${GROUND_Y + 5}
                ${PLATE_RIGHT},${GROUND_Y + 16}
                ${X_CENTER},${GROUND_Y + 26}
                ${PLATE_LEFT},${GROUND_Y + 16}
              `}
              fill="#374151"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1}
            />

            {/* ── Pitches ── */}
            {pitches.map((pitch, idx) => {
              const pX = pitch.pitchData?.coordinates?.pX
              const pZ = pitch.pitchData?.coordinates?.pZ
              if (pX == null || pZ == null) return null

              const sx   = svgX(pX)
              const sy   = svgY(pZ)
              const code = pitch.details?.call?.code
              const { bg, border } = callColor(code)
              const isLatest = idx === pitches.length - 1

              return (
                <g key={pitch.index ?? idx}>
                  {/* Subtle glow on latest pitch */}
                  {isLatest && (
                    <circle cx={sx} cy={sy} r={16} fill={bg} opacity={0.2} />
                  )}
                  <circle
                    cx={sx} cy={sy} r={11}
                    fill={bg}
                    stroke={isLatest ? 'white' : border}
                    strokeWidth={isLatest ? 2 : 1}
                    opacity={isLatest ? 1 : 0.8}
                  />
                  {/* Pitch sequence number */}
                  <text
                    x={sx} y={sy}
                    textAnchor="middle" dominantBaseline="central"
                    fill="white" fontSize={7.5}
                    fontFamily="monospace" fontWeight="bold"
                  >
                    {idx + 1}
                  </text>
                </g>
              )
            })}

            {/* ── "Catcher's view" label ── */}
            <text
              x={X_CENTER} y={VH - 6}
              textAnchor="middle"
              fill="rgba(255,255,255,0.18)"
              fontSize={8} fontFamily="system-ui, sans-serif"
              fontStyle="italic"
            >
              catcher's view
            </text>
          </svg>
        </div>

        {/* ── Pitch list + legend ── */}
        <div className="w-full lg:w-56 shrink-0 flex flex-col gap-4">

          {/* Pitch-by-pitch table */}
          <div>
            <p className="section-label mb-2">Sequence</p>
            <div className="space-y-1">
              {pitches.map((pitch, idx) => {
                const code     = pitch.details?.call?.code
                const { bg, border } = callColor(code)
                const typeCode = pitch.details?.type?.code ?? '—'
                const typeDesc = pitch.details?.type?.description ?? typeCode
                const velo     = pitch.pitchData?.startSpeed
                const isLatest = idx === pitches.length - 1

                return (
                  <div
                    key={pitch.index ?? idx}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors ${
                      isLatest ? 'bg-navy-700/70 ring-1 ring-navy-500/60' : 'bg-navy-800/40'
                    }`}
                  >
                    {/* Colored number */}
                    <div
                      className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                      style={{ background: bg, boxShadow: `0 0 0 1px ${border}` }}
                    >
                      <span className="text-[9px] font-black text-white font-mono">{idx + 1}</span>
                    </div>

                    {/* Type code badge */}
                    <span className="text-[10px] font-black font-mono text-gray-400 w-6 shrink-0">
                      {typeCode}
                    </span>

                    {/* Full type name */}
                    <span className="text-xs text-gray-400 truncate flex-1">{typeDesc}</span>

                    {/* Velocity */}
                    {velo != null && (
                      <span className="text-xs font-mono text-gray-500 shrink-0">
                        {Math.round(velo)}
                      </span>
                    )}

                    {/* Call code */}
                    <span
                      className="text-[10px] font-black font-mono w-4 text-right shrink-0"
                      style={{ color: border }}
                    >
                      {code}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div>
            <p className="section-label mb-2">Legend</p>
            <div className="grid grid-cols-1 gap-1">
              {[
                { code: 'B', label: 'Ball'       },
                { code: 'C', label: 'Called K'   },
                { code: 'S', label: 'Swinging K' },
                { code: 'F', label: 'Foul'       },
                { code: 'X', label: 'In Play'    },
              ].map(({ code, label }) => {
                const { bg, border } = callColor(code)
                return (
                  <div key={code} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: bg, boxShadow: `0 0 0 1px ${border}` }}
                    />
                    <span className="text-[11px] text-gray-500">{label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
