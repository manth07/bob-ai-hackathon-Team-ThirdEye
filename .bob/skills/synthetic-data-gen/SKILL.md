---
name: synthetic-data-gen
description: Use when building or extending anything in data/ — encodes the seeded-random approach, asset schema, sensor time-series schema, and incident log schema for GridSentry.
---

# Synthetic Data Generation

## Seeded RNG Approach

Use a simple mulberry32 seeded PRNG so data is deterministic across every reload:

```ts
function mulberry32(seed: number) {
  return function(): number {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
```

Always initialise with a fixed seed constant (e.g. `SEED = 42`). Never use `Math.random()`.

## Asset Fleet (`data/assets.ts`)

Generate 35 assets total:
- 14 transformers, 11 substations, 10 feeders.
- Spread across a realistic geographic area (e.g. Gujarat, India — approx. lat 21–24°N, lng 70–74°E).
- Each asset:

```ts
interface Asset {
  id: string;          // "asset-001" through "asset-035"
  name: string;        // human-readable e.g. "North Transformer 1"
  type: AssetType;     // "transformer" | "substation" | "feeder"
  lat: number;
  lng: number;
  criticalityTier: CriticalityTier;  // "critical" | "high" | "medium" | "low"
  ratedCapacityKVA: number;          // transformers: 500-5000; substations: 2000-10000; feeders: 200-1000
  installYear: number;               // 1985-2020
  region: string;                    // e.g. "North", "South", "East", "West", "Central"
}
```

Assign criticality: ~20% critical, ~30% high, ~30% medium, ~20% low (using seeded RNG).

## Sensor Time Series (`data/sensorGenerator.ts`)

Generate 90 days of hourly readings per asset → 2160 readings per asset. For demo purposes, store only the last 24 data points (daily averages) plus the latest reading.

```ts
interface SensorReading {
  assetId: string;
  timestamp: string;   // ISO 8601
  temperature: number; // °C
  load: number;        // % of rated capacity
  vibration: number;   // mm/s
  oilQuality: number;  // 0-100 index
}
```

Base values by asset type:
- Transformer: temp 55–75°C, load 60–90%, vibration 0.5–2.5 mm/s, oilQuality 50–95
- Substation: temp 40–65°C, load 55–85%, vibration 0.3–2.0 mm/s, oilQuality 60–98
- Feeder: temp 30–55°C, load 50–80%, vibration 0.1–1.5 mm/s, oilQuality 70–100

Add deterministic "stress events" to ~15% of assets (spikes in one or two sensors around a seeded date in last 30 days).

Export: `generateSensorHistory(asset: Asset): SensorReading[]` (returns the 24 daily data points + latest).
Export: `getLatestReading(asset: Asset): SensorReading`.

## Incident History (`data/incidentHistory.ts`)

Generate 0–8 past incidents per asset over the last 5 years.

```ts
interface Incident {
  id: string;
  assetId: string;
  date: string;           // ISO 8601 date string
  severity: IncidentSeverity;  // "minor" | "moderate" | "major" | "critical"
  cause: string;          // e.g. "overload", "lightning strike", "equipment aging", "vegetation contact"
  durationHours: number;
  estimatedCostUSD: number;
}
```

Causes pool: ["overload", "lightning strike", "equipment aging", "vegetation contact", "transformer oil leak", "insulator failure", "cable fault", "animal contact", "overheating"].

Severity distribution: 40% minor, 30% moderate, 20% major, 10% critical.

Cost by severity: minor $1k-$10k, moderate $10k-$100k, major $100k-$500k, critical $500k-$2M.

Export: `generateIncidentHistory(asset: Asset): Incident[]`.

## Important Rules

- Every exported function must be pure and deterministic given the same asset input.
- Seed the RNG with `SEED + asset numeric ID` for per-asset variation.
- No `Date.now()` or `Math.random()` anywhere in data files.
- Timestamps use the current date minus N days (use a fixed reference date in the seed, not `new Date()`). Use `new Date('2025-01-01')` as the reference date for all time calculations.
