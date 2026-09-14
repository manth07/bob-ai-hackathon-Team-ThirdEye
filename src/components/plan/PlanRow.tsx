import React from 'react'
import type { MaintenancePlanItem } from '../../types/domain'
import RiskBadge from '../list/RiskBadge'

interface PlanRowProps {
  item: MaintenancePlanItem
  isSelected: boolean
  onSelect: (id: string) => void
}

const PRIORITY_COLORS = {
  immediate: { bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', text: 'text-[#EF4444]' },
  urgent:    { bg: 'bg-[#F97316]/10', border: 'border-[#F97316]/30', text: 'text-[#F97316]' },
  scheduled: { bg: 'bg-[#EAB308]/10', border: 'border-[#EAB308]/30', text: 'text-[#EAB308]' },
  routine:   { bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]/30', text: 'text-[#22C55E]' },
}

const PRIORITY_LABELS = {
  immediate: '🚨 Immediate',
  urgent:    '⚠️ Urgent',
  scheduled: '📅 Scheduled',
  routine:   '✅ Routine',
}

const PlanRow: React.FC<PlanRowProps> = ({ item, isSelected, onSelect }) => {
  const { bg, border, text } = PRIORITY_COLORS[item.priority]
  const isHighlighted = isSelected ? 'ring-1 ring-[#3B82F6]' : ''

  return (
    <tr
      className={`cursor-pointer transition-colors duration-150 hover:bg-[#131B2E] ${isSelected ? 'bg-[#1a2540]' : ''}`}
      onClick={() => onSelect(item.asset.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(item.asset.id)}
    >
      <td className={`px-3 py-2 text-center font-mono text-sm font-semibold text-[#8B95A8] ${isHighlighted}`}>
        {item.rank}
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${bg} ${border} border ${text}`}>
            {PRIORITY_LABELS[item.priority]}
          </span>
        </div>
      </td>
      <td className="px-3 py-2">
        <p className="text-sm font-medium text-[#E7ECF5]">{item.asset.name}</p>
        <p className="text-xs text-[#8B95A8]">{item.asset.type} · {item.asset.region}</p>
      </td>
      <td className="px-3 py-2">
        <RiskBadge tier={item.riskScore.tier} score={Math.round(item.riskScore.total)} />
      </td>
      <td className="px-3 py-2 text-xs text-[#8B95A8] max-w-[200px]">
        {item.recommendedAction}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-[#E7ECF5]">{item.timeframe}</td>
      <td className="px-3 py-2 whitespace-nowrap text-xs font-mono text-[#8B95A8]">{item.estimatedCost}</td>
    </tr>
  )
}

export default PlanRow
