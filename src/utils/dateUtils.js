/**
 * Returns today's date in ET (Eastern Time) as YYYY-MM-DD.
 * MLB schedules are organized around Eastern Time.
 */
export function todayEST() {
  return new Date()
    .toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

/** Format a UTC ISO string to a readable local time, e.g. "7:05 PM ET" */
export function formatGameTime(isoString) {
  if (!isoString) return 'TBD'
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
    timeZoneName: 'short',
  })
}

/** Format a date string to a display label, e.g. "Saturday, Sep 1" */
export function formatDateLabel(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

/** Current MLB season year */
export function currentSeason() {
  const now = new Date()
  // MLB season runs March–October; use previous year if it's before March
  return now.getMonth() < 2 ? now.getFullYear() - 1 : now.getFullYear()
}
