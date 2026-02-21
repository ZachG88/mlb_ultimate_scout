export default function ErrorMessage({ error, retry }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="text-4xl">⚠️</div>
      <p className="text-red-400 font-medium">
        {error?.message ?? 'Something went wrong loading MLB data.'}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-mlb-red text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
