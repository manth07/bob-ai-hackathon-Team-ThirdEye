import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useGridStore } from '../../store/useGridStore'
import AssetMarker from './AssetMarker'

const RiskMap: React.FC = () => {
  const { rankedAssets, selectedAssetId, selectAsset } = useGridStore()

  // Centre on Gujarat, India
  const CENTER: [number, number] = [22.4, 72.0]
  const ZOOM = 7

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={CENTER}
        zoom={ZOOM}
        style={{ height: '100%', width: '100%', background: '#0B1220' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        {rankedAssets.map((ra) => (
          <AssetMarker
            key={ra.asset.id}
            rankedAsset={ra}
            isSelected={ra.asset.id === selectedAssetId}
            onSelect={selectAsset}
          />
        ))}
      </MapContainer>
      {/* Map legend */}
      <div className="absolute bottom-4 right-4 z-[1000] rounded-lg border border-[#1F2A44] bg-[#131B2E]/90 p-3 backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#8B95A8]">Risk Tier</p>
        {(['critical', 'high', 'medium', 'low'] as const).map((tier) => (
          <div key={tier} className="flex items-center gap-2 py-0.5">
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor:
                  tier === 'critical' ? '#EF4444' :
                  tier === 'high' ? '#F97316' :
                  tier === 'medium' ? '#EAB308' : '#22C55E',
              }}
            />
            <span className="text-xs text-[#E7ECF5] capitalize">{tier}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RiskMap
