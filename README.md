# GridSentry — Power Outage Prediction & Grid Equipment Failure Advisor

**Team ThirdEye** · IBM Bob AI Innovation Hackathon · Problem Statement U1 (Utilities Track)

---

## What Is GridSentry?

GridSentry is a browser-based advisor that predicts power outages before they happen. It monitors a fleet of 35 simulated grid assets — transformers, substations, and feeders — combining live weather forecasts, synthetic sensor telemetry, and historical incident data into a single actionable **Risk Score (0–100)** per asset.

Operators see which assets are about to fail, why, and what to do about it — all in a dark-theme control-room interface with no login, no backend, and no paid APIs.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). No environment variables, no API keys, no backend setup required.

---

## Features

| # | Feature | Description |
|---|---------|-------------|
| F1 | Synthetic fleet | 35 grid assets (transformer/substation/feeder) across Gujarat, India with deterministic seeded data |
| F2 | Sensor simulation | 24-point daily sensor history per asset: temperature, load, vibration, oil quality |
| F3 | Live weather | Real forecast per asset via Open-Meteo (free, keyless) with estimated-weather fallback |
| F4 | Incident history | Seeded past-incident log per asset (cause, severity, cost, duration) |
| F5 | Risk scoring | Weighted composite score: 45% sensor + 30% weather + 25% incidents |
| F6 | Risk map | Interactive CARTO dark-matter map with colour-coded risk markers |
| F7 | Ranked list | Sortable asset list with risk badges and score bars |
| F8 | Asset detail | Sensor trend charts, weather panel, plain-English risk explanation |
| F9 | Maintenance plan | Prioritised action table: immediate → urgent → scheduled → routine |
| F10 | KPI bar | Fleet overview: total assets, critical/high counts, top priority asset |

---

## Tech Stack

- **React 18 + Vite** — fast dev loop, zero-config
- **TypeScript** (strict) — type safety throughout
- **Tailwind CSS** — dark control-room theme
- **Recharts** — sensor trend charts
- **React-Leaflet + CARTO** — interactive dark map
- **Open-Meteo API** — free, keyless weather
- **Zustand** — minimal state management
- **Vitest** — unit tests on the scoring engine

---

## Architecture

All logic runs **client-side in the browser**. No backend, no database, no server.

```
ASSETS (seeded)  +  SENSORS (seeded)  +  INCIDENTS (seeded)
                                +
                     Open-Meteo Weather API
                          ↓
                   Risk Scoring Engine
                  (sensor × 0.45 + weather × 0.30 + incidents × 0.25)
                          ↓
                   Ranked Asset List  →  Map  →  Detail  →  Plan
```

See [`docs/architecture.md`](docs/architecture.md) for full details.

---

## Project Structure

```
src/
├── data/          Seeded asset fleet, sensor generator, incident history
├── services/      Open-Meteo weather service with fallback
├── engine/        Risk scoring, ranking, explanation, maintenance plan
├── store/         Zustand store wiring data to UI
├── components/    Map, list, detail, plan, layout components
└── types/         Domain types (Asset, SensorReading, RiskScore, …)
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (zero errors required) |
| `npm run test` | Vitest unit tests |

---

## Team

**Team ThirdEye** — IBM Bob AI Innovation Hackathon, September 2025

Built with [IBM Bob AI](https://www.ibm.com/products/watsonx-code-assistant) (Bob AI Innovation Hackathon submission).
