import React from 'react'
import type { RiskTier } from '../../types/domain'

const RISK_COLORS: Record<RiskTier, { bg: string; text: string }> = {
  low:      { bg: 'bg-[#22C55E]/15', text: 'text-[#22C55E]' },
  medium:   { bg: 'bg-[#EAB308]/15', text: 'text-[#EAB308]' },
  high:     { bg: 'bg-[#F97316]/15', text: 'text-[#F97316]' },
  critical: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]' },
}

interface RiskBadgeProps {
  tier: RiskTier
  score?: number
  size?: 'sm' | 'md'
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ tier, score, size = 'sm' }) => {
  const { bg, text } = RISK_COLORS[tier]
  const textSize = size === 'md' ? 'text-sm' : 'text-xs'
  const label = tier.charAt(0).toUpperCase() + tier.slice(1)

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${textSize} ${bg} ${text}`}
      title={`Risk tier: ${label}${score !== undefined ? ` (${score}/100)` : ''}`}
    >
      <span aria-hidden="true">●</span>
      {label}
      {score !== undefined && <span className="font-mono">{score}</span>}
    </span>
  )
}

export default RiskBadge
