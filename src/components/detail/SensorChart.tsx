import React from 'react'
import type { SensorReading } from '../../types/domain'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

interface SensorChartProps {
  readings: SensorReading[]
  field: keyof Pick<SensorReading, 'temperature' | 'load' | 'vibration' | 'oilQuality'>
  label: string
  unit: string
  color: string
  domain?: [number | 'auto', number | 'auto']
}

const SensorChart: React.FC<SensorChartProps> = ({ readings, field, label, unit, color, domain }) => {
  const data = readings.map((r, i) => ({
    day: i === readings.length - 1 ? 'Now' : `D-${readings.length - 1 - i}`,
    value: r[field] as number,
  }))

  return (
    <div className="rounded-lg border border-[#1F2A44] bg-[#0B1220] p-3">
      <p className="mb-2 text-xs font-semibold text-[#8B95A8]">
        {label} <span className="text-[#E7ECF5]">({unit})</span>
      </p>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="#1F2A44" strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tick={{ fill: '#8B95A8', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={7}
          />
          <YAxis
            tick={{ fill: '#8B95A8', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            domain={domain ?? ['auto', 'auto']}
            width={36}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#131B2E',
              border: '1px solid #1F2A44',
              borderRadius: '6px',
              color: '#E7ECF5',
              fontSize: '12px',
            }}
            formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, label]}
            labelStyle={{ color: '#8B95A8' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SensorChart
