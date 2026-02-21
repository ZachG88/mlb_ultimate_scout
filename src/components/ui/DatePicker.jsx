export default function DatePicker({ value, onChange }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-navy-800/80 border border-navy-600/60 text-white rounded-xl px-3 py-2 text-sm font-medium
                 focus:outline-none focus:ring-2 focus:ring-mlb-blue focus:border-transparent
                 hover:border-navy-500 transition-colors
                 [color-scheme:dark]"
    />
  )
}
