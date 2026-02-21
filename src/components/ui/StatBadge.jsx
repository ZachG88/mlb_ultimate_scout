export default function StatBadge({ label, value, highlight = false }) {
  return (
    <div className={`flex flex-col items-center rounded-xl px-3 py-2 min-w-[48px] ${
      highlight
        ? 'bg-mlb-red/10 ring-1 ring-mlb-red/30'
        : 'bg-navy-700/50'
    }`}>
      <span className="text-xs text-gray-500 font-bold uppercase tracking-wide leading-none mb-1">
        {label}
      </span>
      <span className={`text-xl font-black font-mono leading-none tabular-nums ${
        highlight ? 'text-mlb-red' : 'text-white'
      }`}>
        {value ?? '—'}
      </span>
    </div>
  )
}
