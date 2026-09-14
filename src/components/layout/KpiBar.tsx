import React from 'react'
import { useGridStore } from '../../store/useGridStore'
import type { RiskTier } from '../../types/domain'

const KpiBar: React.FC = () => {
  const { rankedAssets, weatherLoading, weatherError } = useGridStore()

  const totalAssets = rankedAssets.length
  const criticalCount = rankedAssets.filter(ra => ra.riskScore.tier === 'critical').length
  const highCount = rankedAssets.filter(ra => ra.riskScore.tier === 'high').length
  const topAsset = rankedAssets[0]

  const tierColor: Record<RiskTier, string> = {
    critical: 'text-[#EF4444]',
    high: 'text-[#F97316]',
    medium: 'text-[#EAB308]',
    low: 'text-[#22C55E]',
  }

  return (
    <div className="border-b border-[#1F2A44] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8B95A8]">
          Fleet Overview
        </p>
        {weatherLoading && (
          <span className="text-xs text-[#3B82F6]">↻ Live weather…</span>
        )}
        {weatherError && !weatherLoading && (
          <span className="text-xs text-[#EAB308]">⚠ Est. weather</span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-[#1F2A44] bg-[#0B1220] p-3">
          <p className="text-xs text-[#8B95A8]">Assets Monitored</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[#E7ECF5]">
            {totalAssets || '—'}
          </p>
        </div>
        <div className="rounded-lg border border-[#1F2A44] bg-[#0B1220] p-3">
          <p className="text-xs text-[#8B95A8]">Critical / High Risk</p>
          <p className="mt-1 font-mono text-2xl font-semibold">
            <span className="text-[#EF4444]">{criticalCount}</span>
            <span className="text-[#8B95A8] text-base"> / </span>
            <span className="text-[#F97316]">{highCount}</span>
          </p>
        </div>
        <div className="rounded-lg border border-[#1F2A44] bg-[#0B1220] p-3">
          <p className="text-xs text-[#8B95A8]">Top Priority Asset</p>
          {topAsset ? (
            <div className="mt-1">
              <p className={`text-sm font-semibold ${tierColor[topAsset.riskScore.tier]}`}>
                #{topAsset.rank} {topAsset.asset.name}
              </p>
              <p className="mt-0.5 text-xs text-[#8B95A8]">
                Score {topAsset.riskScore.total}/100 — {topAsset.riskScore.tier.toUpperCase()}
              </p>
            </div>
          ) : (
            <p className="mt-1 text-sm text-[#8B95A8]">Loading…</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default KpiBar
