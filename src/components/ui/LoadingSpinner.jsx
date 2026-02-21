export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizeClass = { sm: 'h-5 w-5', md: 'h-10 w-10', lg: 'h-16 w-16' }[size]
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className={`${sizeClass} animate-spin rounded-full border-4 border-navy-700 border-t-mlb-red`}
      />
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  )
}
