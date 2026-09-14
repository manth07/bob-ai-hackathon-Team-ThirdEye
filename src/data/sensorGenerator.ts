// data/sensorGenerator.ts — Deterministic sensor time-series per asset

import type { Asset, SensorReading } from '../types/domain'
import { mulberry32, SEED } from './assets'

// Fixed reference date — never use Date.now()
const REF_DATE = new Date('2025-01-01T00:00:00Z')

type SensorRange = {
  tempMin: number; tempMax: number
  loadMin: number; loadMax: number
  vibMin: number; vibMax: number
  oilMin: number; oilMax: number
}

const SENSOR_RANGES: Record<string, SensorRange> = {
  transformer: { tempMin: 55, tempMax: 75, loadMin: 60, loadMax: 90, vibMin: 0.5, vibMax: 2.5, oilMin: 50, oilMax: 95 },
  substation:  { tempMin: 40, tempMax: 65, loadMin: 55, loadMax: 85, vibMin: 0.3, vibMax: 2.0, oilMin: 60, oilMax: 98 },
  feeder:      { tempMin: 30, tempMax: 55, loadMin: 50, loadMax: 80, vibMin: 0.1, vibMax: 1.5, oilMin: 70, oilMax: 100 },
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// Returns the numeric ID from the asset id string e.g. "asset-007" -> 7
function assetNumId(asset: Asset): number {
  return parseInt(asset.id.replace('asset-', ''), 10)
}

/**
 * Generate 24 daily sensor readings (one per day, last 24 days before REF_DATE)
 * plus a latest reading (day 0 = REF_DATE).
 */
export function generateSensorHistory(asset: Asset): SensorReading[] {
  const rng = mulberry32(SEED + assetNumId(asset) * 1000)
  const range = SENSOR_RANGES[asset.type]
  const readings: SensorReading[] = []

  // ~15% of assets get a stress event seeded around last 30 days
  const hasStressEvent = rng() < 0.15
  const stressDay = Math.floor(rng() * 20) + 2 // day 2-21 before ref date

  for (let dayOffset = 24; dayOffset >= 0; dayOffset--) {
    const ts = new Date(REF_DATE)
    ts.setUTCDate(ts.getUTCDate() - dayOffset)

    // Base values drift slowly with noise
    const baseTemp = lerp(range.tempMin, range.tempMax, rng())
    const baseLoad = lerp(range.loadMin, range.loadMax, rng())
    const baseVib = lerp(range.vibMin, range.vibMax, rng())
    const baseOil = lerp(range.oilMin, range.oilMax, rng())

    // Stress event spike
    const isStressDay = hasStressEvent && Math.abs(dayOffset - stressDay) <= 3
    const stressMult = isStressDay ? 1.0 + rng() * 0.35 : 1.0

    readings.push({
      assetId: asset.id,
      timestamp: ts.toISOString(),
      temperature: round2(Math.min(baseTemp * stressMult, range.tempMax * 1.4)),
      load: round2(Math.min(baseLoad * stressMult, 135)),
      vibration: round2(Math.min(baseVib * stressMult, range.vibMax * 1.6)),
      oilQuality: round2(Math.max(baseOil / stressMult, 15)),
    })
  }

  return readings
}

/**
 * Returns only the most recent reading (index 24, i.e. REF_DATE).
 */
export function getLatestReading(asset: Asset): SensorReading {
  const history = generateSensorHistory(asset)
  return history[history.length - 1]
}
