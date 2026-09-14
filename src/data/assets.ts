// data/assets.ts — Deterministic fleet of 35 grid assets seeded with mulberry32 PRNG

import type { Asset, AssetType, CriticalityTier } from '../types/domain'

// ---- Seeded RNG ----
export const SEED = 42

export function mulberry32(seed: number): () => number {
  let s = seed
  return function (): number {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---- Asset configuration ----
const ASSET_COUNT = 35

type RegionSpec = { name: string; latBase: number; lngBase: number }

const REGIONS: RegionSpec[] = [
  { name: 'North', latBase: 23.2, lngBase: 72.6 },
  { name: 'South', latBase: 21.4, lngBase: 71.2 },
  { name: 'East', latBase: 22.8, lngBase: 73.8 },
  { name: 'West', latBase: 22.3, lngBase: 70.4 },
  { name: 'Central', latBase: 22.6, lngBase: 72.0 },
]

const CRITICALITY_TIERS: CriticalityTier[] = ['critical', 'high', 'medium', 'low']
// distribution: ~20% critical, ~30% high, ~30% medium, ~20% low
const CRITICALITY_WEIGHTS = [0.20, 0.30, 0.30, 0.20]

// 14 transformers, 11 substations, 10 feeders
const TYPE_COUNTS: Record<AssetType, number> = {
  transformer: 14,
  substation: 11,
  feeder: 10,
}

const RATED_CAPACITY_RANGES: Record<AssetType, [number, number]> = {
  transformer: [500, 5000],
  substation: [2000, 10000],
  feeder: [200, 1000],
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

// ---- Generate the fleet ----
function generateAssets(): Asset[] {
  const rng = mulberry32(SEED)
  const assets: Asset[] = []

  // Build ordered list of types
  const typeList: AssetType[] = []
  for (const [type, count] of Object.entries(TYPE_COUNTS) as [AssetType, number][]) {
    for (let i = 0; i < count; i++) typeList.push(type)
  }

  // Shuffle types deterministically
  for (let i = typeList.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [typeList[i], typeList[j]] = [typeList[j], typeList[i]]
  }

  for (let i = 0; i < ASSET_COUNT; i++) {
    const id = `asset-${String(i + 1).padStart(3, '0')}`
    const type = typeList[i]
    const regionSpec = REGIONS[i % REGIONS.length]
    const criticalityIdx = pickWeighted(rng, CRITICALITY_WEIGHTS)
    const criticality = CRITICALITY_TIERS[criticalityIdx]

    const [minCap, maxCap] = RATED_CAPACITY_RANGES[type]
    const capacity = Math.round(lerp(minCap, maxCap, rng()) / 100) * 100

    const installYear = Math.floor(lerp(1985, 2020, rng()))

    // Spread around the region base with ±0.3° jitter
    const lat = regionSpec.latBase + (rng() - 0.5) * 0.6
    const lng = regionSpec.lngBase + (rng() - 0.5) * 0.6

    const typeName = type.charAt(0).toUpperCase() + type.slice(1)
    const regionIdx = Math.floor(rng() * 10) + 1
    const name = `${regionSpec.name} ${typeName} ${regionIdx}`

    assets.push({
      id,
      name,
      type,
      lat: Math.round(lat * 10000) / 10000,
      lng: Math.round(lng * 10000) / 10000,
      criticalityTier: criticality,
      ratedCapacityKVA: capacity,
      installYear,
      region: regionSpec.name,
    })
  }

  return assets
}

export const ASSETS: Asset[] = generateAssets()
