import React from 'react'
import { useGridStore, useSelectedAsset, useSelectedRiskScore, useSensorHistory } from '../../store/useGridStore'
import RiskBadge from '../list/RiskBadge'
import SensorChart from './SensorChart'
import WeatherPanel from './WeatherPanel'

const AssetDetail: React.FC = () => {
  const selectedAsset = useSelectedAsset()
  const selectedRiskScore = useSelectedRiskScore()
  const { forecasts } = useGridStore()
  const sensorHistory = useSensorHistory(selectedAsset?.id ?? null)

  if (!selectedAsset || !selectedRiskScore) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-sm text-[#8B95A8]">
          Select an asset from the map or list to view details.
        </p>
      </div>
    )
  }

  const forecast = forecasts.get(selectedAsset.id)

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Asset header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#E7ECF5]">{selectedAsset.name}</h2>
          <p className="mt-0.5 text-xs text-[#8B95A8]">
            {selectedAsset.type} · {selectedAsset.region} · Est. {selectedAsset.installYear} ·{' '}
            {selectedAsset.ratedCapacityKVA.toLocaleString()} kVA
          </p>
        </div>
        <RiskBadge tier={selectedRiskScore.tier} score={Math.round(selectedRiskScore.total)} size="md" />
      </div>

      {/* Explanation */}
      <div className="mb-4 rounded-lg border border-[#1F2A44] bg-[#0B1220] p-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#8B95A8]">
          Risk Analysis
        </p>
        <p className="text-sm text-[#E7ECF5] leading-relaxed">{selectedRiskScore.explanation}</p>
        {/* Component scores */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Sensor', value: selectedRiskScore.sensorHealth },
            { label: 'Weather', value: selectedRiskScore.weatherRisk },
            { label: 'Incidents', value: selectedRiskScore.incidentWeight },
          ].map(({ label, value }) => (
            <div key={label} className="rounded border border-[#1F2A44] p-2">
              <p className="font-mono text-lg font-semibold text-[#E7ECF5]">{Math.round(value)}</p>
              <p className="text-xs text-[#8B95A8]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Sensor charts */}
        <SensorChart readings={sensorHistory} field="temperature" label="Temperature" unit="°C" color="#F97316" />
        <SensorChart readings={sensorHistory} field="load" label="Load" unit="%" color="#3B82F6" domain={[0, 135]} />
        <SensorChart readings={sensorHistory} field="vibration" label="Vibration" unit="mm/s" color="#EAB308" />
        <SensorChart readings={sensorHistory} field="oilQuality" label="Oil Quality" unit="idx" color="#22C55E" domain={[0, 100]} />
      </div>

      {/* Weather panel */}
      {forecast && <WeatherPanel forecast={forecast} />}
    </div>
  )
}

export default AssetDetail
