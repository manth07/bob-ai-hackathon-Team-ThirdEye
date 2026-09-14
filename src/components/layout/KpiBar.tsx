import React from 'react'

const KpiBar: React.FC = () => {
  return (
    <div className="border-b border-[#1F2A44] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8B95A8]">
        Fleet Overview
      </p>
      <div className="flex flex-col gap-3">
        {/* Placeholder KPI cards — populated in Phase 4 */}
        <div className="rounded-lg border border-[#1F2A44] bg-[#0B1220] p-3">
          <p className="text-xs text-[#8B95A8]">Assets Monitored</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[#E7ECF5]">—</p>
        </div>
        <div className="rounded-lg border border-[#1F2A44] bg-[#0B1220] p-3">
          <p className="text-xs text-[#8B95A8]">Critical Risk</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[#EF4444]">—</p>
        </div>
        <div className="rounded-lg border border-[#1F2A44] bg-[#0B1220] p-3">
          <p className="text-xs text-[#8B95A8]">Top Action</p>
          <p className="mt-1 text-sm font-medium text-[#E7ECF5]">Loading…</p>
        </div>
      </div>
    </div>
  )
}

export default KpiBar
