import { useState } from 'react'
import { useSchedule } from '../hooks/useSchedule'
import { todayEST, formatDateLabel } from '../utils/dateUtils'
import GameCard from '../components/games/GameCard'
import DatePicker from '../components/ui/DatePicker'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function HomePage() {
  const [date, setDate] = useState(todayEST())
  const { data: games, isLoading, isError, error, refetch } = useSchedule(date)

  const liveGames = games?.filter((g) => g.status.abstractGameState === 'Live') ?? []
  const finalGames = games?.filter((g) => g.status.abstractGameState === 'Final') ?? []
  const scheduledGames = games?.filter(
    (g) => g.status.abstractGameState !== 'Live' && g.status.abstractGameState !== 'Final'
  ) ?? []

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Schedule</h1>
          <p className="text-gray-500 text-sm mt-0.5">{formatDateLabel(date)}</p>
        </div>
        <DatePicker value={date} onChange={setDate} />
      </div>

      {isLoading && <LoadingSpinner label="Loading games..." />}
      {isError && <ErrorMessage error={error} retry={refetch} />}

      {!isLoading && !isError && games?.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">⚾</p>
          <p className="text-lg font-medium">No games scheduled</p>
          <p className="text-sm mt-1 text-gray-600">Try a different date</p>
        </div>
      )}

      {liveGames.length > 0 && (
        <Section
          title="Live Now"
          badge={liveGames.length}
          badgeClass="bg-status-live/20 text-status-live ring-1 ring-status-live/40"
          accentClass="bg-status-live"
        >
          {liveGames.map((g) => <GameCard key={g.gamePk} game={g} />)}
        </Section>
      )}

      {scheduledGames.length > 0 && (
        <Section title="Upcoming" accentClass="bg-mlb-blue">
          {scheduledGames.map((g) => <GameCard key={g.gamePk} game={g} />)}
        </Section>
      )}

      {finalGames.length > 0 && (
        <Section title="Final" accentClass="bg-gray-600">
          {finalGames.map((g) => <GameCard key={g.gamePk} game={g} />)}
        </Section>
      )}
    </div>
  )
}

function Section({ title, badge, badgeClass = '', accentClass = 'bg-mlb-red', children }) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <span className={`w-1 h-5 rounded-full shrink-0 ${accentClass}`} />
        <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
        {badge != null && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  )
}
