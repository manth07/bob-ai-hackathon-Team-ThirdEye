import React, { useEffect, useState } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import RiskMap from './components/map/RiskMap'
import AssetDetail from './components/detail/AssetDetail'
import MaintenancePlan from './components/plan/MaintenancePlan'
import { useGridStore } from './store/useGridStore'

type Tab = 'detail' | 'plan'

const App: React.FC = () => {
  const initialize = useGridStore(s => s.initialize)
  const [activeTab, setActiveTab] = useState<Tab>('detail')

  useEffect(() => {
    initialize().catch(console.error)
  }, [initialize])

  return (
    <div className="flex h-screen flex-col bg-[#0B1220]">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        <section className="flex flex-1 flex-col overflow-hidden">
          {/* Map area — upper portion */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <RiskMap />
          </div>
          {/* Bottom panel — tabs for detail & plan */}
          <div className="flex h-[45%] flex-shrink-0 flex-col border-t border-[#1F2A44] bg-[#131B2E]">
            {/* Tab bar */}
            <div className="flex border-b border-[#1F2A44] bg-[#0B1220]">
              {([['detail', 'Asset Detail'], ['plan', 'Maintenance Plan']] as [Tab, string][]).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                    activeTab === tab
                      ? 'border-b-2 border-[#3B82F6] text-[#3B82F6]'
                      : 'text-[#8B95A8] hover:text-[#E7ECF5]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'detail' ? <AssetDetail /> : <MaintenancePlan />}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
