import React, { useEffect } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import RiskMap from './components/map/RiskMap'
import { useGridStore } from './store/useGridStore'

const App: React.FC = () => {
  const initialize = useGridStore(s => s.initialize)

  useEffect(() => {
    initialize().catch(console.error)
  }, [initialize])

  return (
    <div className="flex h-screen flex-col bg-[#0B1220]">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        <section className="flex flex-1 flex-col overflow-hidden">
          {/* Map area — 60% height */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: '55%' }}>
            <RiskMap />
          </div>
          {/* Detail panel placeholder — populated in Phase 5 */}
          <div className="flex h-48 flex-shrink-0 items-center justify-center border-t border-[#1F2A44] bg-[#131B2E]">
            <p className="text-sm text-[#8B95A8]">
              Select an asset to view sensor trends, weather, and maintenance plan →
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
