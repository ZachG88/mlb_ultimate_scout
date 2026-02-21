export default function PlayerSearch({ value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search players by name..."
        className="w-full bg-navy-800 border border-navy-600 text-white rounded-xl
                   pl-9 pr-4 py-2.5 text-sm placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-mlb-red focus:border-transparent"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  )
}
