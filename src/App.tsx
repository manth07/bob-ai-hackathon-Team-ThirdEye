import React from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'

const App: React.FC = () => {
  return (
    <div className="flex h-screen flex-col bg-[#0B1220]">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        <section className="flex flex-1 flex-col overflow-hidden">
          {/* Map area — populated in Phase 4 */}
          <div className="flex flex-1 items-center justify-center border-b border-[#1F2A44] bg-[#0B1220]">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#1F2A44] bg-[#131B2E]">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" stroke="#3B82F6" strokeWidth="1.5" fill="none"/>
                  <path d="M16 8v8l4 4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="16" cy="16" r="2" fill="#3B82F6"/>
                </svg>
              </div>
              <p className="text-base font-semibold text-[#E7ECF5]">GridSentry</p>
              <p className="mt-1 text-sm text-[#8B95A8]">
                Risk map and asset data loading in Phase 4…
              </p>
              <p className="mt-4 text-xs text-[#8B95A8]">
                Phase 0: Scaffolding complete ✓
              </p>
            </div>
          </div>
          {/* Detail panel — populated in Phase 5 */}
          <div className="flex h-48 items-center justify-center bg-[#131B2E]">
            <p className="text-sm text-[#8B95A8]">Asset detail panel — Phase 5</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
