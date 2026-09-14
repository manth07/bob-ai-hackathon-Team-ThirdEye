// data/incidentHistory.ts — Deterministic historical incident log per asset

import type { Asset, Incident, IncidentSeverity } from '../types/domain'
import { mulberry32, SEED } from './assets'

// Fixed reference date — never use Date.now()
const REF_DATE = new Date('2025-01-01T00:00:00Z')

const CAUSES = [
  'overload',
  'lightning strike',
  'equipment aging',
  'vegetation contact',
  'transformer oil leak',
  'insulator failure',
  'cable fault',
  'animal contact',
  'overheating',
] as const

const SEVERITIES: IncidentSeverity[] = ['minor', 'moderate', 'major', 'critical']
// distribution: 40% minor, 30% moderate, 20% major, 10% critical
const SEVERITY_WEIGHTS = [0.40, 0.30, 0.20, 0.10]

const DURATION_RANGES: Record<IncidentSeverity, [number, number]> = {
  minor:    [0.5, 4],
  moderate: [2, 12],
  major:    [8, 48],
  critical: [24, 168],
}

const COST_RANGES: Record<IncidentSeverity, [number, number]> = {
  minor:    [1_000, 10_000],
  moderate: [10_000, 100_000],
  major:    [100_000, 500_000],
  critical: [500_000, 2_000_000],
}

function pickWeighted(rng: () => number, weights: number[]): number {
  const r = rng()
  let cumulative = 0
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i]
    if (r < cumulative) return i
  }
  return weights.length - 1
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function assetNumId(asset: Asset): number {
  return parseInt(asset.id.replace('asset-', ''), 10)
}

/**
 * Generate 0–8 past incidents for an asset over the last 5 years before REF_DATE.
 */
export function generateIncidentHistory(asset: Asset): Incident[] {
  const numId = assetNumId(asset)
  const rng = mulberry32(SEED + numId * 999 + 77777)
  const incidents: Incident[] = []

  // Number of incidents: 0-8, biased toward lower counts
  const count = Math.floor(rng() * rng() * 9) // 0-8 with downward bias

  for (let i = 0; i < count; i++) {
    const severityIdx = pickWeighted(rng, SEVERITY_WEIGHTS)
    const severity = SEVERITIES[severityIdx]

    // Random date within last 5 years (1825 days)
    const daysAgo = Math.floor(rng() * 1825) + 1
    const incidentDate = new Date(REF_DATE)
    incidentDate.setUTCDate(incidentDate.getUTCDate() - daysAgo)

    const [minDur, maxDur] = DURATION_RANGES[severity]
    const duration = Math.round(lerp(minDur, maxDur, rng()) * 10) / 10

    const [minCost, maxCost] = COST_RANGES[severity]
    const cost = Math.round(lerp(minCost, maxCost, rng()) / 100) * 100

    const cause = CAUSES[Math.floor(rng() * CAUSES.length)]

    incidents.push({
      id: `inc-${asset.id}-${String(i + 1).padStart(2, '0')}`,
      assetId: asset.id,
      date: incidentDate.toISOString().split('T')[0],
      severity,
      cause,
      durationHours: duration,
      estimatedCostUSD: cost,
    })
  }

  // Sort by date ascending
  incidents.sort((a, b) => a.date.localeCompare(b.date))
  return incidents
}
