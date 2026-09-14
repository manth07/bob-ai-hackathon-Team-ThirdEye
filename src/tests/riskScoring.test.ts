// src/tests/riskScoring.test.ts — Unit tests for the risk scoring engine

import { describe, it, expect } from 'vitest'
import {
  computeSensorHealthScore,
  computeWeatherRiskScore,
  computeIncidentWeight,
  computeRiskScore,
  getRiskTier,
} from '../engine/riskScoring'
import type { Asset, SensorReading, WeatherForecast, Incident } from '../types/domain'

// ---- Fixtures ----
const baseAsset: Asset = {
  id: 'asset-001',
  name: 'Test Transformer',
  type: 'transformer',
  lat: 22.5,
  lng: 72.0,
  criticalityTier: 'high',
  ratedCapacityKVA: 2000,
  installYear: 2000,
  region: 'North',
}

const normalReading: SensorReading = {
  assetId: 'asset-001',
  timestamp: '2025-01-01T00:00:00Z',
  temperature: 65,     // safe range
  load: 70,            // safe range
  vibration: 1.0,      // normal
  oilQuality: 80,      // good
}

const criticalReading: SensorReading = {
  assetId: 'asset-001',
  timestamp: '2025-01-01T00:00:00Z',
  temperature: 115,    // above safe range
  load: 120,           // overloaded
  vibration: 7.0,      // very high
  oilQuality: 10,      // very poor
}

const calmWeather: WeatherForecast = {
  assetId: 'asset-001',
  timestamp: '2025-01-01T00:00:00Z',
  temperature_2m: 25,
  windspeed_10m: 10,
  precipitation: 0,
  weathercode: 1,
  isEstimated: false,
}

const stormWeather: WeatherForecast = {
  assetId: 'asset-001',
  timestamp: '2025-01-01T00:00:00Z',
  temperature_2m: 42,
  windspeed_10m: 95,
  precipitation: 60,
  weathercode: 95,
  isEstimated: false,
}

const noIncidents: Incident[] = []

const heavyIncidents: Incident[] = [
  {
    id: 'inc-001',
    assetId: 'asset-001',
    date: '2024-10-01',       // within 3 months of ref date 2025-01-01
    severity: 'critical',
    cause: 'overload',
    durationHours: 48,
    estimatedCostUSD: 1_000_000,
  },
  {
    id: 'inc-002',
    assetId: 'asset-001',
    date: '2024-06-01',
    severity: 'major',
    cause: 'lightning strike',
    durationHours: 24,
    estimatedCostUSD: 200_000,
  },
]

// ---- getRiskTier ----
describe('getRiskTier', () => {
  it('returns low for score < 25', () => {
    expect(getRiskTier(0)).toBe('low')
    expect(getRiskTier(24.9)).toBe('low')
  })

  it('returns medium for score 25-49', () => {
    expect(getRiskTier(25)).toBe('medium')
    expect(getRiskTier(49.9)).toBe('medium')
  })

  it('returns high for score 50-74', () => {
    expect(getRiskTier(50)).toBe('high')
    expect(getRiskTier(74.9)).toBe('high')
  })

  it('returns critical for score >= 75', () => {
    expect(getRiskTier(75)).toBe('critical')
    expect(getRiskTier(100)).toBe('critical')
  })
})

// ---- computeSensorHealthScore ----
describe('computeSensorHealthScore', () => {
  it('returns a value between 0 and 100', () => {
    const normal = computeSensorHealthScore(baseAsset, normalReading)
    const critical = computeSensorHealthScore(baseAsset, criticalReading)
    expect(normal).toBeGreaterThanOrEqual(0)
    expect(normal).toBeLessThanOrEqual(100)
    expect(critical).toBeGreaterThanOrEqual(0)
    expect(critical).toBeLessThanOrEqual(100)
  })

  it('critical readings produce higher score than normal readings', () => {
    const normal = computeSensorHealthScore(baseAsset, normalReading)
    const critical = computeSensorHealthScore(baseAsset, criticalReading)
    expect(critical).toBeGreaterThan(normal)
  })

  it('works for all asset types', () => {
    const substationAsset: Asset = { ...baseAsset, type: 'substation' }
    const feederAsset: Asset = { ...baseAsset, type: 'feeder' }
    const s1 = computeSensorHealthScore(substationAsset, normalReading)
    const s2 = computeSensorHealthScore(feederAsset, normalReading)
    expect(s1).toBeGreaterThanOrEqual(0)
    expect(s1).toBeLessThanOrEqual(100)
    expect(s2).toBeGreaterThanOrEqual(0)
    expect(s2).toBeLessThanOrEqual(100)
  })
})

// ---- computeWeatherRiskScore ----
describe('computeWeatherRiskScore', () => {
  it('returns a value between 0 and 100', () => {
    const calm = computeWeatherRiskScore(calmWeather)
    const storm = computeWeatherRiskScore(stormWeather)
    expect(calm).toBeGreaterThanOrEqual(0)
    expect(calm).toBeLessThanOrEqual(100)
    expect(storm).toBeGreaterThanOrEqual(0)
    expect(storm).toBeLessThanOrEqual(100)
  })

  it('storm weather produces higher score than calm weather', () => {
    const calm = computeWeatherRiskScore(calmWeather)
    const storm = computeWeatherRiskScore(stormWeather)
    expect(storm).toBeGreaterThan(calm)
  })

  it('adds storm code bonus for known storm codes', () => {
    const clearWeather = { ...calmWeather, weathercode: 0, windspeed_10m: 10, precipitation: 0 }
    const stormCode = { ...calmWeather, weathercode: 95, windspeed_10m: 10, precipitation: 0 }
    const clear = computeWeatherRiskScore(clearWeather)
    const stormy = computeWeatherRiskScore(stormCode)
    expect(stormy).toBeGreaterThan(clear)
  })

  it('extreme cold adds temperature risk', () => {
    const cold = { ...calmWeather, temperature_2m: -15, windspeed_10m: 0, precipitation: 0, weathercode: 0 }
    const warm = { ...calmWeather, temperature_2m: 20, windspeed_10m: 0, precipitation: 0, weathercode: 0 }
    expect(computeWeatherRiskScore(cold)).toBeGreaterThan(computeWeatherRiskScore(warm))
  })
})

// ---- computeIncidentWeight ----
describe('computeIncidentWeight', () => {
  it('returns 0 for no incidents', () => {
    expect(computeIncidentWeight(noIncidents, '2025-01-01')).toBe(0)
  })

  it('returns a value between 0 and 100', () => {
    const score = computeIncidentWeight(heavyIncidents, '2025-01-01')
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('heavy incidents score higher than no incidents', () => {
    const heavy = computeIncidentWeight(heavyIncidents, '2025-01-01')
    const none = computeIncidentWeight(noIncidents, '2025-01-01')
    expect(heavy).toBeGreaterThan(none)
  })

  it('ignores incidents older than 2 years', () => {
    const old: Incident[] = [{
      id: 'old',
      assetId: 'asset-001',
      date: '2020-01-01',    // more than 2 years before 2025-01-01
      severity: 'critical',
      cause: 'overload',
      durationHours: 48,
      estimatedCostUSD: 1_000_000,
    }]
    expect(computeIncidentWeight(old, '2025-01-01')).toBe(0)
  })

  it('applies recency bonus for incidents within 3 months', () => {
    const recent: Incident[] = [{
      id: 'recent',
      assetId: 'asset-001',
      date: '2024-11-01',   // within 3 months
      severity: 'minor',
      cause: 'overload',
      durationHours: 1,
      estimatedCostUSD: 1_000,
    }]
    const older: Incident[] = [{
      id: 'older',
      assetId: 'asset-001',
      date: '2024-05-01',   // not within 6 months
      severity: 'minor',
      cause: 'overload',
      durationHours: 1,
      estimatedCostUSD: 1_000,
    }]
    expect(computeIncidentWeight(recent, '2025-01-01')).toBeGreaterThan(
      computeIncidentWeight(older, '2025-01-01'),
    )
  })
})

// ---- computeRiskScore ----
describe('computeRiskScore', () => {
  it('total score is always within 0-100', () => {
    const score = computeRiskScore(baseAsset, normalReading, calmWeather, noIncidents)
    expect(score.total).toBeGreaterThanOrEqual(0)
    expect(score.total).toBeLessThanOrEqual(100)
  })

  it('component scores are all within 0-100', () => {
    const score = computeRiskScore(baseAsset, criticalReading, stormWeather, heavyIncidents)
    expect(score.sensorHealth).toBeGreaterThanOrEqual(0)
    expect(score.sensorHealth).toBeLessThanOrEqual(100)
    expect(score.weatherRisk).toBeGreaterThanOrEqual(0)
    expect(score.weatherRisk).toBeLessThanOrEqual(100)
    expect(score.incidentWeight).toBeGreaterThanOrEqual(0)
    expect(score.incidentWeight).toBeLessThanOrEqual(100)
  })

  it('tier matches total score via getRiskTier', () => {
    const score = computeRiskScore(baseAsset, normalReading, calmWeather, noIncidents)
    expect(score.tier).toBe(getRiskTier(score.total))
  })

  it('explanation is a non-empty string', () => {
    const score = computeRiskScore(baseAsset, normalReading, calmWeather, noIncidents)
    expect(typeof score.explanation).toBe('string')
    expect(score.explanation.length).toBeGreaterThan(10)
  })

  it('high-risk inputs produce higher score than safe inputs', () => {
    const safe = computeRiskScore(baseAsset, normalReading, calmWeather, noIncidents)
    const dangerous = computeRiskScore(baseAsset, criticalReading, stormWeather, heavyIncidents)
    expect(dangerous.total).toBeGreaterThan(safe.total)
  })

  it('assetId matches the input asset', () => {
    const score = computeRiskScore(baseAsset, normalReading, calmWeather, noIncidents)
    expect(score.assetId).toBe(baseAsset.id)
  })
})
