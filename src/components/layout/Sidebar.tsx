import React from 'react'
import KpiBar from './KpiBar'
import AssetList from '../list/AssetList'

const Sidebar: React.FC = () => {
  return (
    <aside className="flex w-72 flex-shrink-0 flex-col overflow-hidden border-r border-[#1F2A44] bg-[#131B2E]">
      <KpiBar />
      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8B95A8]">
          Asset Risk Ranking
        </p>
        <AssetList />
      </div>
    </aside>
  )
}

export default Sidebar
