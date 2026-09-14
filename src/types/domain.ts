// GridSentry — Domain Types
// All types used across the application are defined here.

export type AssetType = 'transformer' | 'substation' | 'feeder'

export type CriticalityTier = 'critical' | 'high' | 'medium' | 'low'

export type RiskTier = 'critical' | 'high' | 'medium' | 'low'

export type IncidentSeverity = 'minor' | 'moderate' | 'major' | 'critical'

export interface Asset {
  id: string
  name: string
  type: AssetType
  lat: number
  lng: number
  criticalityTier: CriticalityTier
  ratedCapacityKVA: number
  installYear: number
  region: string
}

export interface SensorReading {
  assetId: string
  timestamp: string
  temperature: number   // °C
  load: number          // % of rated capacity
  vibration: number     // mm/s
  oilQuality: number    // 0-100 index
}

export interface Incident {
  id: string
  assetId: string
  date: string
  severity: IncidentSeverity
  cause: string
  durationHours: number
  estimatedCostUSD: number
}

export interface WeatherForecast {
  assetId: string
  timestamp: string
  temperature_2m: number      // °C
  windspeed_10m: number       // km/h
  precipitation: number       // mm/hr
  weathercode: number
  isEstimated: boolean        // true if using fallback mock data
}

export interface RiskScore {
  assetId: string
  total: number               // 0-100
  sensorHealth: number        // 0-100 component
  weatherRisk: number         // 0-100 component
  incidentWeight: number      // 0-100 component
  tier: RiskTier
  explanation: string
}

export interface RankedAsset {
  asset: Asset
  riskScore: RiskScore
  rank: number
}

export interface MaintenancePlanItem {
  rank: number
  asset: Asset
  riskScore: RiskScore
  recommendedAction: string
  timeframe: string
  estimatedCost: string
  priority: 'immediate' | 'urgent' | 'scheduled' | 'routine'
}
