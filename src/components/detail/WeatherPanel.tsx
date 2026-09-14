import React from 'react'
import type { WeatherForecast } from '../../types/domain'

interface WeatherPanelProps {
  forecast: WeatherForecast
}

const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  56: 'Freezing drizzle', 57: 'Heavy freezing drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  66: 'Freezing rain', 67: 'Heavy freezing rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
  85: 'Snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Thunderstorm w/ heavy hail',
}

function weatherIcon(code: number): string {
  if (code === 0 || code === 1) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 48) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ forecast }) => {
  const description = WEATHER_DESCRIPTIONS[forecast.weathercode] ?? `Code ${forecast.weathercode}`
  const icon = weatherIcon(forecast.weathercode)

  return (
    <div className="rounded-lg border border-[#1F2A44] bg-[#0B1220] p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-[#8B95A8]">Current Weather</p>
        {forecast.isEstimated && (
          <span className="rounded-full bg-[#EAB308]/15 px-2 py-0.5 text-xs font-medium text-[#EAB308]">
            ⚠ Estimated
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-3xl" role="img" aria-label={description}>{icon}</span>
        <div>
          <p className="text-sm font-medium text-[#E7ECF5]">{description}</p>
          <p className="text-xs text-[#8B95A8]">
            {forecast.temperature_2m.toFixed(1)}°C · {forecast.windspeed_10m.toFixed(0)} km/h wind
            {forecast.precipitation > 0 && ` · ${forecast.precipitation.toFixed(1)} mm/hr`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default WeatherPanel
