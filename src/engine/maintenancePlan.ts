// engine/maintenancePlan.ts — Turns ranked assets into a prioritised action plan

import type { RankedAsset, MaintenancePlanItem } from '../types/domain'

const ACTION_TEMPLATES: Record<string, Record<string, string>> = {
  immediate: {
    transformer: 'Emergency inspection and oil sampling. Prepare for possible transformer replacement.',
    substation: 'Emergency shutdown inspection. Verify all protection systems. Check bus bars and switchgear.',
    feeder: 'Immediate field inspection. Check for physical damage, vegetation contact, and insulator condition.',
  },
  urgent: {
    transformer: 'Priority maintenance: oil quality test, thermal imaging, load analysis, and connection tightening.',
    substation: 'Scheduled urgent inspection: relay testing, cooling system check, and grounding verification.',
    feeder: 'Field crew dispatch: check conductor condition, vegetation clearance, and hardware integrity.',
  },
  scheduled: {
    transformer: 'Scheduled preventive maintenance: full diagnostic suite including DGA and power factor testing.',
    substation: 'Routine inspection cycle with enhanced focus on identified risk factors.',
    feeder: 'Scheduled inspection: infrared thermography and condition assessment report.',
  },
  routine: {
    transformer: 'Standard maintenance per schedule. Monitor sensor trends for changes.',
    substation: 'Standard maintenance per schedule. Update asset records.',
    feeder: 'Standard inspection per schedule. Check hardware and connections.',
  },
}

const COST_ESTIMATES: Record<string, string> = {
  immediate: '$15,000 – $250,000+',
  urgent: '$5,000 – $50,000',
  scheduled: '$2,000 – $15,000',
  routine: '$500 – $3,000',
}

/**
 * Convert the ranked asset list into a prioritised maintenance plan.
 * Returns items sorted by urgency (rank), ready for display.
 */
export function buildMaintenancePlan(rankedAssets: RankedAsset[]): MaintenancePlanItem[] {
  return rankedAssets.map((ra) => {
    const { asset, riskScore, rank } = ra
    const tier = riskScore.tier

    const priority: MaintenancePlanItem['priority'] =
      tier === 'critical' ? 'immediate' :
      tier === 'high' ? 'urgent' :
      tier === 'medium' ? 'scheduled' : 'routine'

    const timeframe =
      tier === 'critical' ? 'Within 24 hours' :
      tier === 'high' ? 'Within 7 days' :
      tier === 'medium' ? 'Within 30 days' : 'Next maintenance cycle'

    const recommendedAction = ACTION_TEMPLATES[priority][asset.type]

    return {
      rank,
      asset,
      riskScore,
      recommendedAction,
      timeframe,
      estimatedCost: COST_ESTIMATES[priority],
      priority,
    }
  })
}
