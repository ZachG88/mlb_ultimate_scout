export default function DatePicker({ value, onChange }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-navy-800 border border-navy-600 text-white rounded-lg px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-mlb-red focus:border-transparent
                 [color-scheme:dark]"
    />
  )
}
