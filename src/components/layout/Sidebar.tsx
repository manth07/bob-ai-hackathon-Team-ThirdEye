import React from 'react'
import KpiBar from './KpiBar'

const Sidebar: React.FC = () => {
  return (
    <aside className="flex w-72 flex-shrink-0 flex-col overflow-hidden border-r border-[#1F2A44] bg-[#131B2E]">
      <KpiBar />
      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8B95A8]">
          Asset Risk Ranking
        </p>
        {/* Asset list placeholder — populated in Phase 4 */}
        <div className="flex items-center justify-center py-8 text-sm text-[#8B95A8]">
          Loading assets…
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
