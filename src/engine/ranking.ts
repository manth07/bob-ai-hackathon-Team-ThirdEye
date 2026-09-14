// engine/ranking.ts — Sort assets by risk score and grid-impact severity

import type { Asset, RiskScore, RankedAsset, CriticalityTier } from '../types/domain'

const CRITICALITY_ORDER: Record<CriticalityTier, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

/**
 * Sort assets by risk score descending, then criticality tier descending,
 * then name alphabetically as final tiebreaker.
 */
export function rankAssets(
  assets: Asset[],
  scores: Map<string, RiskScore>,
): RankedAsset[] {
  const sorted = [...assets].sort((a, b) => {
    const scoreA = scores.get(a.id)?.total ?? 0
    const scoreB = scores.get(b.id)?.total ?? 0

    if (scoreB !== scoreA) return scoreB - scoreA

    const critA = CRITICALITY_ORDER[a.criticalityTier]
    const critB = CRITICALITY_ORDER[b.criticalityTier]
    if (critB !== critA) return critB - critA

    return a.name.localeCompare(b.name)
  })

  return sorted.map((asset, index) => ({
    asset,
    riskScore: scores.get(asset.id)!,
    rank: index + 1,
  }))
}
