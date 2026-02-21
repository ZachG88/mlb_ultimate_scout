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
          <h1 className="text-2xl font-bold text-white">Schedule</h1>
          <p className="text-gray-400 text-sm mt-0.5">{formatDateLabel(date)}</p>
        </div>
        <DatePicker value={date} onChange={setDate} />
      </div>

      {isLoading && <LoadingSpinner label="Loading games..." />}
      {isError && <ErrorMessage error={error} retry={refetch} />}

      {!isLoading && !isError && games?.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">⚾</p>
          <p>No games scheduled for this date.</p>
        </div>
      )}

      {/* Live Games */}
      {liveGames.length > 0 && (
        <Section title="Live" badge={liveGames.length} badgeColor="bg-green-600">
          {liveGames.map((g) => <GameCard key={g.gamePk} game={g} />)}
        </Section>
      )}

      {/* Scheduled / Preview */}
      {scheduledGames.length > 0 && (
        <Section title="Upcoming">
          {scheduledGames.map((g) => <GameCard key={g.gamePk} game={g} />)}
        </Section>
      )}

      {/* Final */}
      {finalGames.length > 0 && (
        <Section title="Final">
          {finalGames.map((g) => <GameCard key={g.gamePk} game={g} />)}
        </Section>
      )}
    </div>
  )
}

function Section({ title, badge, badgeColor = 'bg-navy-700', children }) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {badge != null && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${badgeColor}`}>
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
