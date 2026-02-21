/** Format batting average to 3 decimal places, e.g. ".312" */
export function fmtAvg(val) {
  if (val == null) return '.---'
  const n = parseFloat(val)
  if (isNaN(n)) return val
  return n.toFixed(3).replace(/^0/, '')
}

/** Format ERA/WHIP to 2 decimal places */
export function fmtRate(val, decimals = 2) {
  if (val == null) return '-.--'
  const n = parseFloat(val)
  return isNaN(n) ? val : n.toFixed(decimals)
}

/** Format a win-loss percentage */
export function fmtPct(val) {
  if (val == null) return '.---'
  const n = parseFloat(val)
  return isNaN(n) ? val : n.toFixed(3).replace(/^0/, '')
}

/** Convert innings pitched decimal (e.g. 6.2) to display format */
export function fmtIP(val) {
  if (val == null) return '0.0'
  return String(val)
}

/** Summarize a game status into a display label and color class */
export function gameStatusInfo(status) {
  const state = status?.abstractGameState
  const detail = status?.detailedState ?? ''

  if (state === 'Live') {
    return { label: detail || 'Live', color: 'text-green-400 animate-pulse' }
  }
  if (state === 'Final') {
    return { label: 'Final', color: 'text-gray-400' }
  }
  return { label: detail || 'Scheduled', color: 'text-blue-400' }
}
