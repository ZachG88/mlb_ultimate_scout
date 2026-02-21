import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      {/* pb-20 on mobile leaves room above the fixed bottom nav */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 sm:pb-6">
        {children}
      </main>
    </div>
  )
}
