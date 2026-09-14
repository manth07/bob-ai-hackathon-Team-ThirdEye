import React from 'react'
import { useGridStore } from '../../store/useGridStore'
import { buildMaintenancePlan } from '../../engine/maintenancePlan'
import PlanRow from './PlanRow'

const MaintenancePlan: React.FC = () => {
  const { rankedAssets, selectedAssetId, selectAsset } = useGridStore()
  const plan = buildMaintenancePlan(rankedAssets)

  if (plan.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-sm text-[#8B95A8]">
        Loading maintenance plan…
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[#1F2A44]">
            {['#', 'Priority', 'Asset', 'Risk', 'Recommended Action', 'Timeframe', 'Est. Cost'].map(col => (
              <th key={col} className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#8B95A8]">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plan.map(item => (
            <PlanRow
              key={item.asset.id}
              item={item}
              isSelected={item.asset.id === selectedAssetId}
              onSelect={selectAsset}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MaintenancePlan
