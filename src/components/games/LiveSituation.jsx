/**
 * LiveSituation — base state + defensive lineup for live games.
 *
 * Layout: base diamond (left) | vertical divider | defense list (right)
 * Accepts className prop so parent can control bottom margin.
 */

const DEFENSE_POSITIONS = [
  { key: 'pitcher',   abbr: 'P'  },
  { key: 'catcher',   abbr: 'C'  },
  { key: 'first',     abbr: '1B' },
  { key: 'second',    abbr: '2B' },
  { key: 'shortstop', abbr: 'SS' },
  { key: 'third',     abbr: '3B' },
  { key: 'left',      abbr: 'LF' },
  { key: 'center',    abbr: 'CF' },
  { key: 'right',     abbr: 'RF' },
]

export default function LiveSituation({ liveData, className = 'mb-6' }) {
  const offense = liveData?.linescore?.offense
  const defense = liveData?.linescore?.defense
  const outs    = liveData?.plays?.currentPlay?.count?.outs ?? liveData?.linescore?.outs ?? 0

  if (!offense && !defense) return null

  const onFirst  = !!offense?.first
  const onSecond = !!offense?.second
  const onThird  = !!offense?.third

  const runners = [
    onThird  && { base: '3B', name: offense.third.fullName  },
    onSecond && { base: '2B', name: offense.second.fullName },
    onFirst  && { base: '1B', name: offense.first.fullName  },
  ].filter(Boolean)

  return (
    <div className={`card rounded-xl p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1 h-4 rounded-full bg-mlb-red shrink-0" />
        <h3 className="section-label">Field Situation</h3>
      </div>

      <div className="flex gap-5 items-start">

        {/* ── Left: bases + runners + outs ── */}
        <div className="shrink-0 flex flex-col items-center gap-4">
          <BaseDiamond onFirst={onFirst} onSecond={onSecond} onThird={onThird} />

          {/* Runners */}
          <div className="w-full space-y-1.5 min-h-[36px]">
            {runners.length > 0 ? runners.map(({ base, name }) => (
              <div key={base} className="flex items-center gap-2">
                <span className="text-[11px] font-black font-mono text-amber-400 w-5 shrink-0">
                  {base}
                </span>
                <span className="text-[11px] text-amber-100/70 truncate max-w-[108px] font-medium">
                  {name}
                </span>
              </div>
            )) : (
              <p className="text-[11px] text-gray-700 italic">Bases empty</p>
            )}
          </div>

          {/* Outs */}
          <div className="flex items-center gap-2.5 w-full">
            <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
              Outs
            </span>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition-colors ${
                    i < outs
                      ? 'bg-mlb-red shadow-[0_0_4px_rgba(200,16,46,0.5)]'
                      : 'bg-navy-700 border border-navy-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="self-stretch w-px bg-navy-700/60 shrink-0" />

        {/* ── Right: defense list ── */}
        <div className="flex-1 min-w-0">
          <p className="section-label mb-3">Defense</p>
          <div className="space-y-px">
            {DEFENSE_POSITIONS.map(({ key, abbr }, idx) => {
              const player    = defense?.[key]
              const isPitcher = key === 'pitcher'
              // subtle group separators: after C (idx 1) and after 3B (idx 5)
              const hasDivider = idx === 1 || idx === 5

              return (
                <div key={key}>
                  <div className="flex items-center gap-3 py-1">
                    <span className={`text-[11px] font-black font-mono w-5 shrink-0 ${
                      isPitcher ? 'text-mlb-blue' : 'text-gray-600'
                    }`}>
                      {abbr}
                    </span>
                    <span className={`text-sm truncate leading-snug ${
                      !player
                        ? 'text-gray-700'
                        : isPitcher
                          ? 'text-blue-300 font-semibold'
                          : 'text-gray-200'
                    }`}>
                      {player?.fullName ?? '—'}
                    </span>
                  </div>
                  {hasDivider && (
                    <div className="h-px bg-navy-700/50 my-1" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Base diamond SVG ──────────────────────────────────────────────────────────
// viewBox 140×140
//   2B: (70, 14)   1B: (126, 70)   3B: (14, 70)   HP: (70, 126)

function BaseDiamond({ onFirst, onSecond, onThird }) {
  return (
    <svg viewBox="0 0 140 140" width="134" height="134" aria-label="Base situation">
      {/* Base paths */}
      {[
        [70, 14, 126, 70],
        [126, 70, 70, 126],
        [70, 126, 14, 70],
        [14, 70, 70, 14],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"
        />
      ))}

      {/* 3B */}
      <Base cx={14}  cy={70}  occupied={onThird}  />
      {/* 2B */}
      <Base cx={70}  cy={14}  occupied={onSecond} />
      {/* 1B */}
      <Base cx={126} cy={70}  occupied={onFirst}  />

      {/* Home plate pentagon */}
      <polygon
        points="70,115 80,121 80,129 60,129 60,121"
        fill="rgba(255,255,255,0.55)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />
    </svg>
  )
}

function Base({ cx, cy, occupied }) {
  return (
    <g>
      {occupied && (
        <circle cx={cx} cy={cy} r={17}
          fill="#F59E0B" opacity={0.15}
        />
      )}
      <rect
        x={cx - 10} y={cy - 10}
        width={20} height={20}
        fill={occupied ? '#F59E0B' : 'rgba(255,255,255,0.07)'}
        stroke={occupied ? '#FCD34D' : 'rgba(255,255,255,0.28)'}
        strokeWidth={occupied ? 1.5 : 1}
        transform={`rotate(45 ${cx} ${cy})`}
        rx={1}
      />
    </g>
  )
}
