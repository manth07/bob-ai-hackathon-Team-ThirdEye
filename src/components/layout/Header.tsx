import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[#1F2A44] bg-[#0B1220] px-6">
      <div className="flex items-center gap-3">
        {/* Grid icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="10" height="10" rx="2" fill="#3B82F6" opacity="0.8" />
          <rect x="16" y="2" width="10" height="10" rx="2" fill="#3B82F6" opacity="0.4" />
          <rect x="2" y="16" width="10" height="10" rx="2" fill="#3B82F6" opacity="0.4" />
          <rect x="16" y="16" width="10" height="10" rx="2" fill="#EF4444" opacity="0.8" />
        </svg>
        <h1 className="text-xl font-semibold text-[#E7ECF5] tracking-tight">
          GridSentry
        </h1>
        <span className="rounded-full bg-[#3B82F6]/15 px-2 py-0.5 text-xs font-medium text-[#3B82F6]">
          LIVE
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-[#8B95A8]">Power Outage Prediction &amp; Grid Advisor</span>
        <span className="flex items-center gap-1.5 text-xs text-[#22C55E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
          System Nominal
        </span>
      </div>
    </header>
  )
}

export default Header
