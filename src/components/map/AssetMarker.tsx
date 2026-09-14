import React from 'react'
import type { RankedAsset } from '../../types/domain'
import { CircleMarker, Tooltip } from 'react-leaflet'

interface AssetMarkerProps {
  rankedAsset: RankedAsset
  isSelected: boolean
  onSelect: (id: string) => void
}

const TIER_COLORS = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#EAB308',
  low: '#22C55E',
}

const CRITICALITY_RADIUS = {
  critical: 12,
  high: 10,
  medium: 8,
  low: 6,
}

const AssetMarker: React.FC<AssetMarkerProps> = ({ rankedAsset, isSelected, onSelect }) => {
  const { asset, riskScore } = rankedAsset
  const color = TIER_COLORS[riskScore.tier]
  const radius = CRITICALITY_RADIUS[asset.criticalityTier]

  return (
    <CircleMarker
      center={[asset.lat, asset.lng]}
      radius={isSelected ? radius + 3 : radius}
      pathOptions={{
        fillColor: color,
        fillOpacity: isSelected ? 1.0 : 0.85,
        color: isSelected ? '#ffffff' : '#ffffff',
        weight: isSelected ? 2 : 1,
      }}
      eventHandlers={{
        click: () => onSelect(asset.id),
      }}
    >
      <Tooltip direction="top" offset={[0, -8]}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', lineHeight: '1.4' }}>
          <strong>{asset.name}</strong><br />
          {asset.type} · {asset.region}<br />
          Risk: <strong>{riskScore.total}/100</strong> ({riskScore.tier.toUpperCase()})
        </div>
      </Tooltip>
    </CircleMarker>
  )
}

export default AssetMarker
