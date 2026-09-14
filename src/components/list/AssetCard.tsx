import React from 'react'
import type { RankedAsset } from '../../types/domain'
import RiskBadge from './RiskBadge'

interface AssetCardProps {
  rankedAsset: RankedAsset
  isSelected: boolean
  onSelect: (id: string) => void
}

const ASSET_TYPE_ICONS: Record<string, string> = {
  transformer: '⚡',
  substation: '🔌',
  feeder: '📡',
}

const AssetCard: React.FC<AssetCardProps> = ({ rankedAsset, isSelected, onSelect }) => {
  const { asset, riskScore, rank } = rankedAsset

  const borderColor = isSelected ? 'border-[#3B82F6]' : 'border-[#1F2A44]'
  const bgColor = isSelected ? 'bg-[#1a2540]' : 'bg-[#0B1220] hover:bg-[#131B2E]'

  return (
    <button
      onClick={() => onSelect(asset.id)}
      className={`w-full rounded-lg border p-3 text-left transition-colors duration-150 ${borderColor} ${bgColor}`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-[#1F2A44] text-xs font-mono text-[#8B95A8]">
            {rank}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#E7ECF5]">
              {ASSET_TYPE_ICONS[asset.type]} {asset.name}
            </p>
            <p className="text-xs text-[#8B95A8]">{asset.type} · {asset.region}</p>
          </div>
        </div>
        <RiskBadge tier={riskScore.tier} score={Math.round(riskScore.total)} />
      </div>
      {/* Score bar */}
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#1F2A44]">
        <div
          className="h-1 rounded-full transition-all duration-300"
          style={{
            width: `${riskScore.total}%`,
            backgroundColor:
              riskScore.tier === 'critical' ? '#EF4444' :
              riskScore.tier === 'high' ? '#F97316' :
              riskScore.tier === 'medium' ? '#EAB308' : '#22C55E',
          }}
        />
      </div>
    </button>
  )
}

export default AssetCard
