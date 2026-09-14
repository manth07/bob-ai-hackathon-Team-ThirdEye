# Architecture

## Overview

GridSentry is a fully client-side Single Page Application (SPA). All data generation, risk computation, and state management run in the browser. There is no backend server, no database, and no server-side rendering.

```
Browser
└── React 18 SPA (Vite build)
    ├── data/               Seeded deterministic data generators
    │   ├── assets.ts       35 grid assets (mulberry32 PRNG, seed=42)
    │   ├── sensorGenerator 24-point daily sensor history per asset
    │   └── incidentHistory Seeded past-incident log per asset
    ├── services/
    │   └── weatherService  Open-Meteo fetch → in-memory cache → mock fallback
    ├── engine/
    │   ├── riskScoring     Composite 0-100 score (sensor×0.45 + weather×0.30 + incident×0.25)
    │   ├── ranking         Sort by score + criticality + name
    │   ├── explain         Plain-English explanation string per asset
    │   └── maintenancePlan Ranked action plan from scored fleet
    ├── store/
    │   └── useGridStore    Zustand store — single source of truth for UI
    └── components/
        ├── layout/         Header, Sidebar, KpiBar
        ├── map/            RiskMap (React-Leaflet), AssetMarker
        ├── list/           AssetList, AssetCard, RiskBadge
        ├── detail/         AssetDetail, SensorChart, WeatherPanel
        └── plan/           MaintenancePlan, PlanRow
```

## Data Flow

```
App.initialize()
    │
    ├─ 1. Sync: Generate 35 assets (mulberry32, seed=42)
    ├─ 2. Sync: Generate sensor history + incidents per asset (seeded)
    ├─ 3. Sync: Build mock forecasts → compute risk scores → render immediately
    └─ 4. Async: Fetch Open-Meteo forecasts → recompute scores → re-render
              └─ on error: keep mock forecasts, show "⚠ Estimated" badge
```

## Risk Scoring Formula

```
sensorHealth  = temp(0.35) + load(0.30) + vibration(0.20) + oilQuality(0.15)
weatherRisk   = windRisk + precipRisk + tempRisk + stormBonus  [clamped 0-100]
incidentWeight = weightedRecentCount × 8 + recencyBonus        [clamped 0-100]

total = sensorHealth × 0.45 + weatherRisk × 0.30 + incidentWeight × 0.25
```

Risk Tiers: Low (0–24) · Medium (25–49) · High (50–74) · Critical (75–100)

## External Dependencies

| Dependency | Purpose | Cost | Key Required |
|-----------|---------|------|--------------|
| Open-Meteo | Weather forecast per lat/lng | Free | No |
| CARTO dark tiles | Map basemap | Free | No |
| OpenStreetMap | Map attribution | Free | No |

No paid APIs, no authentication, no CORS proxies.

## State Management

Zustand store ([`src/store/useGridStore.ts`](../src/store/useGridStore.ts)) holds:
- `assets` — the 35 grid assets
- `rankedAssets` — sorted `RankedAsset[]` with embedded risk scores
- `riskScores` — `Map<assetId, RiskScore>`
- `forecasts` — `Map<assetId, WeatherForecast>`
- `selectedAssetId` — currently highlighted asset
- `weatherLoading` / `weatherError` — weather fetch state

## Key Technical Decisions

- **mulberry32 PRNG** over `Math.random()` — deterministic, same demo every reload.
- **Reference date `2025-01-01`** — all time calculations use this fixed anchor, never `Date.now()`.
- **Mock-first rendering** — UI is never blank; data appears instantly, then updates when live weather arrives.
- **Co-located explanation in riskScoring.ts** — avoids circular imports between engine files.
