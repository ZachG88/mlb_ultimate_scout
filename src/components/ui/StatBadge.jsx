export default function StatBadge({ label, value, highlight = false }) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg px-3 py-2 ${
        highlight ? 'bg-mlb-red/20 border border-mlb-red/40' : 'bg-navy-800'
      }`}
    >
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
      <span className={`text-lg font-bold font-mono ${highlight ? 'text-mlb-red' : 'text-white'}`}>
        {value ?? '—'}
      </span>
    </div>
  )
}
