// services/weatherService.ts — Fetch live forecast per asset from Open-Meteo (free, no key)
// Falls back to mock data on network failure; marks forecast with isEstimated=true.

import type { Asset, WeatherForecast } from '../types/domain'

// Open-Meteo free API — no key required
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast'
const WEATHER_PARAMS = 'temperature_2m,windspeed_10m,precipitation,weathercode'

// ---- In-memory cache to avoid duplicate fetches per session ----
const forecastCache = new Map<string, WeatherForecast>()

// ---- Mock fallback generator (deterministic by lat/lng) ----
function mockForecast(asset: Asset): WeatherForecast {
  // Deterministic from lat/lng: stable demo data when API unavailable
  const seed = Math.abs(Math.round(asset.lat * 100 + asset.lng * 100)) % 100
  const temperature_2m = 20 + (seed % 20) - 5         // 15-35°C range
  const windspeed_10m = 5 + (seed % 50)                // 5-55 km/h
  const precipitation = seed < 30 ? seed * 0.5 : 0     // occasional rain
  const weathercode = seed < 20 ? 80 : seed < 30 ? 61 : seed < 40 ? 3 : 1

  return {
    assetId: asset.id,
    timestamp: new Date('2025-01-01T00:00:00Z').toISOString(),
    temperature_2m,
    windspeed_10m,
    precipitation,
    weathercode,
    isEstimated: true,
  }
}

// ---- Open-Meteo response type (only the fields we use) ----
interface OpenMeteoResponse {
  current_weather?: {
    temperature: number
    windspeed: number
    weathercode: number
  }
  hourly?: {
    precipitation?: number[]
  }
}

/**
 * Fetch the current weather forecast for a single asset.
 * Returns an estimated (mock) forecast on any network or parse error.
 */
export async function fetchWeatherForAsset(asset: Asset): Promise<WeatherForecast> {
  // Return cached result if available
  const cached = forecastCache.get(asset.id)
  if (cached) return cached

  const url =
    `${OPEN_METEO_BASE}?latitude=${asset.lat}&longitude=${asset.lng}` +
    `&current_weather=true&hourly=${WEATHER_PARAMS}&forecast_days=1&timezone=auto`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`[weatherService] HTTP ${response.status} for asset ${asset.id}`)
      return mockForecast(asset)
    }

    const data = (await response.json()) as OpenMeteoResponse
    const cw = data.current_weather

    if (!cw) {
      console.error(`[weatherService] Missing current_weather for asset ${asset.id}`)
      return mockForecast(asset)
    }

    // Best-effort precipitation from hourly[0] (current hour)
    const precipitation = data.hourly?.precipitation?.[0] ?? 0

    const forecast: WeatherForecast = {
      assetId: asset.id,
      timestamp: new Date().toISOString(),
      temperature_2m: cw.temperature,
      windspeed_10m: cw.windspeed,
      precipitation,
      weathercode: cw.weathercode,
      isEstimated: false,
    }

    forecastCache.set(asset.id, forecast)
    return forecast
  } catch (err) {
    console.error(`[weatherService] Fetch failed for asset ${asset.id}:`, err)
    return mockForecast(asset)
  }
}

/**
 * Fetch forecasts for all assets, batching by unique lat/lng pairs
 * to minimise API calls (assets in the same region share a call).
 *
 * Returns a Map<assetId, WeatherForecast>.
 */
export async function fetchWeatherForAllAssets(
  assets: Asset[],
): Promise<Map<string, WeatherForecast>> {
  const results = new Map<string, WeatherForecast>()

  // Group by rounded lat/lng to ~0.1° precision for batching
  const locationGroups = new Map<string, Asset[]>()
  for (const asset of assets) {
    const key = `${Math.round(asset.lat * 10) / 10},${Math.round(asset.lng * 10) / 10}`
    const group = locationGroups.get(key) ?? []
    group.push(asset)
    locationGroups.set(key, group)
  }

  // Fetch one representative per location group, share with siblings
  const promises = Array.from(locationGroups.values()).map(async (group) => {
    const representative = group[0]
    const forecast = await fetchWeatherForAsset(representative)

    for (const asset of group) {
      const assetForecast: WeatherForecast = {
        ...forecast,
        assetId: asset.id,
        // Cache under each asset id too
      }
      forecastCache.set(asset.id, assetForecast)
      results.set(asset.id, assetForecast)
    }
  })

  await Promise.allSettled(promises)

  // Fill any gaps with mock (should not happen, but safety net)
  for (const asset of assets) {
    if (!results.has(asset.id)) {
      const fallback = mockForecast(asset)
      results.set(asset.id, fallback)
      console.warn(`[weatherService] Using estimated forecast for asset ${asset.id}`)
    }
  }

  return results
}

/** Clear the in-memory cache (useful for testing). */
export function clearWeatherCache(): void {
  forecastCache.clear()
}
