import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import TeamsPage from './pages/TeamsPage'
import TeamDetailPage from './pages/TeamDetailPage'
import GameDetailPage from './pages/GameDetailPage'
import PlayersPage from './pages/PlayersPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:teamId" element={<TeamDetailPage />} />
        <Route path="/games/:gamePk" element={<GameDetailPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl mb-4">⚾</p>
      <h2 className="text-2xl font-bold text-white mb-2">404 — Foul Ball</h2>
      <p className="text-gray-400">This page doesn't exist.</p>
    </div>
  )
}
