// engine/riskScoring.ts — Composite 0-100 risk score from sensor health, weather, and incidents

import type { Asset, SensorReading, WeatherForecast, Incident, RiskScore, RiskTier } from '../types/domain'

// ---- Tier helpers ----
export function getRiskTier(score: number): RiskTier {
  if (score >= 75) return 'critical'
  if (score >= 50) return 'high'
  if (score >= 25) return 'medium'
  return 'low'
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// ---- Sensor Health Score (0-100, higher = more risk) ----

function temperatureScore(asset: Asset, temp: number): number {
  const maxSafe = asset.type === 'transformer' ? 85 : 75
  const maxCrit = asset.type === 'transformer' ? 120 : 100
  if (temp <= maxSafe) return (temp / maxSafe) * 10   // 0-10 in safe range
  return clamp(10 + ((temp - maxSafe) / (maxCrit - maxSafe)) * 90, 0, 100)
}

function loadScore(load: number): number {
  if (load <= 80) return (load / 80) * 20              // 0-20 in safe range
  if (load <= 100) return 20 + ((load - 80) / 20) * 60 // 20-80 in caution range
  return clamp(80 + ((load - 100) / 20) * 20, 0, 100) // 80-100+ in danger range
}

function vibrationScore(vibration: number): number {
  if (vibration <= 2) return (vibration / 2) * 20      // 0-20 normal
  if (vibration <= 5) return 20 + ((vibration - 2) / 3) * 60 // 20-80 medium
  return clamp(80 + ((vibration - 5) / 3) * 20, 0, 100)     // 80-100 critical
}

function oilQualityScore(oilQuality: number): number {
  return clamp(100 - oilQuality, 0, 100)
}

export function computeSensorHealthScore(asset: Asset, reading: SensorReading): number {
  const ts = temperatureScore(asset, reading.temperature)
  const ls = loadScore(reading.load)
  const vs = vibrationScore(reading.vibration)
  const os = oilQualityScore(reading.oilQuality)
  return clamp(ts * 0.35 + ls * 0.30 + vs * 0.20 + os * 0.15, 0, 100)
}

// ---- Weather Risk Score (0-100) ----

const STORM_CODES = new Set([45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99])

export function computeWeatherRiskScore(forecast: WeatherForecast): number {
  const { windspeed_10m, precipitation, temperature_2m, weathercode } = forecast

  // Wind risk
  const windRisk = windspeed_10m <= 60 ? (windspeed_10m / 60) * 50 : clamp(50 + ((windspeed_10m - 60) / 30) * 50, 0, 100)

  // Precipitation risk
  const precipRisk = precipitation <= 20 ? (precipitation / 20) * 40 : clamp(40 + ((precipitation - 20) / 30) * 60, 0, 100)

  // Temperature extremes
  const tempRisk = temperature_2m < -10 ? 30 : temperature_2m > 38 ? 40 : 0

  // Storm bonus
  const stormBonus = STORM_CODES.has(weathercode) ? 20 : 0

  return clamp(windRisk + precipRisk + tempRisk + stormBonus, 0, 100)
}

// ---- Incident Weight (0-100) ----

const SEVERITY_WEIGHTS = { minor: 1, moderate: 3, major: 5, critical: 10 } as const

export function computeIncidentWeight(incidents: Incident[], refDateStr: string): number {
  const refDate = new Date(refDateStr)
  const twoYearsAgo = new Date(refDate)
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

  const recentIncidents = incidents.filter(i => new Date(i.date) >= twoYearsAgo)

  const weightedCount = recentIncidents.reduce((sum, inc) => {
    return sum + SEVERITY_WEIGHTS[inc.severity]
  }, 0)

  let score = clamp(weightedCount * 8, 0, 100)

  // Recency bonus
  const sixMonthsAgo = new Date(refDate)
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const threeMonthsAgo = new Date(refDate)
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  const mostRecent = recentIncidents.reduce((latest: Date | null, inc) => {
    const d = new Date(inc.date)
    return latest === null || d > latest ? d : latest
  }, null)

  if (mostRecent) {
    if (mostRecent >= threeMonthsAgo) score = clamp(score + 20, 0, 100)
    else if (mostRecent >= sixMonthsAgo) score = clamp(score + 10, 0, 100)
  }

  return score
}

// ---- Composite score ----

const WEIGHTS = { sensorHealth: 0.45, weatherRisk: 0.30, incidentWeight: 0.25 }

export function computeRiskScore(
  asset: Asset,
  latestReading: SensorReading,
  forecast: WeatherForecast,
  incidents: Incident[],
): RiskScore {
  const sensorHealth = computeSensorHealthScore(asset, latestReading)
  const weatherRisk = computeWeatherRiskScore(forecast)
  const incidentWeight = computeIncidentWeight(incidents, '2025-01-01')

  const total = clamp(
    sensorHealth * WEIGHTS.sensorHealth +
    weatherRisk * WEIGHTS.weatherRisk +
    incidentWeight * WEIGHTS.incidentWeight,
    0,
    100,
  )

  const tier = getRiskTier(total)

  // Import explanation inline to avoid circular dep
  const explanation = buildExplanation(asset, sensorHealth, weatherRisk, incidentWeight, tier)

  return {
    assetId: asset.id,
    total: Math.round(total * 10) / 10,
    sensorHealth: Math.round(sensorHealth * 10) / 10,
    weatherRisk: Math.round(weatherRisk * 10) / 10,
    incidentWeight: Math.round(incidentWeight * 10) / 10,
    tier,
    explanation,
  }
}

// ---- Explanation builder (co-located here to avoid circular imports) ----

function buildExplanation(
  asset: Asset,
  sensorHealth: number,
  weatherRisk: number,
  incidentWeight: number,
  tier: RiskTier,
): string {
  const timeframe = getTimeframe(tier)
  const max = Math.max(sensorHealth, weatherRisk, incidentWeight)

  let reason: string
  if (max === sensorHealth && sensorHealth >= weatherRisk && sensorHealth >= incidentWeight) {
    reason = `Elevated sensor readings (health index ${Math.round(sensorHealth)}/100) indicate potential equipment stress.`
  } else if (max === weatherRisk) {
    reason = `Adverse weather conditions (risk index ${Math.round(weatherRisk)}/100) present elevated environmental stress.`
  } else {
    reason = `Historical incident pattern (weight ${Math.round(incidentWeight)}/100) signals recurring risk at this ${asset.type}.`
  }

  // Multi-factor note for critical assets
  if (tier === 'critical' && sensorHealth >= 30 && weatherRisk >= 30 && incidentWeight >= 30) {
    reason = `Multiple compounding risk factors: sensor stress (${Math.round(sensorHealth)}) + weather risk (${Math.round(weatherRisk)}) + incident history (${Math.round(incidentWeight)}).`
  }

  return `${reason} Recommend ${timeframe} inspection.`
}

function getTimeframe(tier: RiskTier): string {
  switch (tier) {
    case 'critical': return 'immediate (within 24h)'
    case 'high':     return 'urgent (within 7 days)'
    case 'medium':   return 'scheduled (within 30 days)'
    case 'low':      return 'routine (next maintenance cycle)'
  }
}
