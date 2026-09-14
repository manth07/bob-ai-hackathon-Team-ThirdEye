import React from 'react'
import { useGridStore } from '../../store/useGridStore'
import AssetCard from './AssetCard'

const AssetList: React.FC = () => {
  const { rankedAssets, selectedAssetId, selectAsset } = useGridStore()

  if (rankedAssets.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[#8B95A8]">
        Loading assets…
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {rankedAssets.map((ra) => (
        <AssetCard
          key={ra.asset.id}
          rankedAsset={ra}
          isSelected={ra.asset.id === selectedAssetId}
          onSelect={selectAsset}
        />
      ))}
    </div>
  )
}

export default AssetList
