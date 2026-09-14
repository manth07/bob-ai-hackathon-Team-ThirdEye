// store/useGridStore.ts — Zustand store wiring data, engine, and weather to the UI

import { create } from 'zustand'
import type { Asset, RiskScore, RankedAsset, WeatherForecast } from '../types/domain'
import { ASSETS } from '../data/assets'
import { getLatestReading, generateSensorHistory } from '../data/sensorGenerator'
import { generateIncidentHistory } from '../data/incidentHistory'
import { computeRiskScore } from '../engine/riskScoring'
import { rankAssets } from '../engine/ranking'
import { fetchWeatherForAllAssets } from '../services/weatherService'

interface GridStore {
  // State
  assets: Asset[]
  rankedAssets: RankedAsset[]
  riskScores: Map<string, RiskScore>
  forecasts: Map<string, WeatherForecast>
  selectedAssetId: string | null
  weatherLoading: boolean
  weatherError: string | null

  // Actions
  initialize: () => Promise<void>
  selectAsset: (id: string | null) => void
}

// ---- Build risk scores from data (sync, no network) ----
function buildRiskScores(
  assets: Asset[],
  forecasts: Map<string, WeatherForecast>,
): Map<string, RiskScore> {
  const scores = new Map<string, RiskScore>()
  for (const asset of assets) {
    const latestReading = getLatestReading(asset)
    const incidents = generateIncidentHistory(asset)
    const forecast = forecasts.get(asset.id)

    // Skip if no forecast yet (will compute after weather loads)
    if (!forecast) continue

    const score = computeRiskScore(asset, latestReading, forecast, incidents)
    scores.set(asset.id, score)
  }
  return scores
}

// ---- Build mock forecasts for immediate render (before network responds) ----
function buildMockForecasts(assets: Asset[]): Map<string, WeatherForecast> {
  const map = new Map<string, WeatherForecast>()
  for (const asset of assets) {
    const seed = Math.abs(Math.round(asset.lat * 100 + asset.lng * 100)) % 100
    map.set(asset.id, {
      assetId: asset.id,
      timestamp: '2025-01-01T00:00:00Z',
      temperature_2m: 20 + (seed % 20) - 5,
      windspeed_10m: 5 + (seed % 50),
      precipitation: seed < 30 ? seed * 0.5 : 0,
      weathercode: seed < 20 ? 80 : seed < 30 ? 61 : seed < 40 ? 3 : 1,
      isEstimated: true,
    })
  }
  return map
}

export const useGridStore = create<GridStore>((set) => ({
  assets: ASSETS,
  rankedAssets: [],
  riskScores: new Map(),
  forecasts: new Map(),
  selectedAssetId: null,
  weatherLoading: false,
  weatherError: null,

  initialize: async () => {
    // Step 1: Render immediately with mock forecasts
    const mockForecasts = buildMockForecasts(ASSETS)
    const initialScores = buildRiskScores(ASSETS, mockForecasts)
    const initialRanked = rankAssets(ASSETS, initialScores)

    set({
      forecasts: mockForecasts,
      riskScores: initialScores,
      rankedAssets: initialRanked,
      weatherLoading: true,
      weatherError: null,
      // Auto-select the highest risk asset
      selectedAssetId: initialRanked[0]?.asset.id ?? null,
    })

    // Step 2: Fetch live weather and recompute
    try {
      const liveForecast = await fetchWeatherForAllAssets(ASSETS)
      const liveScores = buildRiskScores(ASSETS, liveForecast)
      const liveRanked = rankAssets(ASSETS, liveScores)

      set((s) => ({
        forecasts: liveForecast,
        riskScores: liveScores,
        rankedAssets: liveRanked,
        weatherLoading: false,
        weatherError: null,
        // Keep selected asset, update to live-ranked #1 only if nothing was manually selected
        selectedAssetId: s.selectedAssetId ?? liveRanked[0]?.asset.id ?? null,
      }))
    } catch (err) {
      console.error('[useGridStore] Weather fetch failed, keeping estimated data:', err)
      set({ weatherLoading: false, weatherError: 'Using estimated weather data.' })
    }
  },

  selectAsset: (id) => set({ selectedAssetId: id }),
}))

// Convenience selector hooks
export function useSelectedAsset() {
  const { assets, selectedAssetId } = useGridStore()
  return assets.find(a => a.id === selectedAssetId) ?? null
}

export function useSelectedRiskScore() {
  const { riskScores, selectedAssetId } = useGridStore()
  if (!selectedAssetId) return null
  return riskScores.get(selectedAssetId) ?? null
}

export function useSensorHistory(assetId: string | null) {
  if (!assetId) return []
  const asset = ASSETS.find(a => a.id === assetId)
  if (!asset) return []
  return generateSensorHistory(asset)
}
