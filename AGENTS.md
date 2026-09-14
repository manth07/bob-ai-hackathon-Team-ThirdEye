# AGENTS.md - GridSentry Project Context
(Bob loads this file automatically, every conversation, every mode.)

## Project
Name: GridSentry
Tagline: Predict power outages before they happen.
Hackathon problem statement: U1 - Power Outage Prediction & Grid Equipment Failure Advisor (Utilities track, IBM Bob AI Innovation Hackathon)
Team: Team ThirdEye
Repository: bob-ai-hackathon-Team-ThirdEye

## Problem
Utilities run maintenance on fixed calendar schedules instead of actual equipment condition. Sensor data that could predict failures weeks in advance is ignored, and weather forecasts are never combined with it in real time. Transformer and substation failures cause blackouts that cost utilities $1M+ per hour.

## What We're Building
GridSentry is a browser-based advisor that:

- Monitors a simulated fleet of grid assets (transformers, substations, feeders) using synthetic sensor data.
- Pulls live weather forecasts for each asset's location.
- Combines sensor health, weather risk, and historical incident data into one Risk Score (0-100) per asset.
- Ranks assets by risk and grid-impact severity.
- Explains, in plain English, why each asset is risky.
- Generates a prioritised maintenance plan the operator can act on today.

## Target Users
- Primary: utility grid operations / maintenance planners who currently rely on fixed-calendar maintenance.
- Secondary (for the hackathon): judges - must understand the value within a 3-minute demo with zero utilities background.

## Core Features (MVP - build these, nothing more)

| # | Feature | Description |
| --- | --- | --- |
| F1 | Synthetic asset fleet | 30-40 grid assets with type, location, criticality tier |
| F2 | Sensor simulation | Seeded synthetic sensor time series per asset (temperature, load, vibration, oil quality) |
| F3 | Live weather integration | Real forecast per asset location via a free, keyless API |
| F4 | Historical incidents | Synthetic past-incident log per asset/area (cause, duration, cost) |
| F5 | Risk scoring engine | Weighted composite score combining F2, F3, and F4 |
| F6 | Risk map | Interactive map, colour-coded markers by risk tier |
| F7 | Ranked list | Sortable list of assets by risk and grid impact |
| F8 | Asset detail view | Sensor trend charts, weather panel, plain-English "why" |
| F9 | Maintenance plan | Prioritised, ranked action list with recommended timeframe |
| F10 | Dashboard KPIs | Total assets monitored, number critical, top recommended action |

## Explicitly Out of Scope
- No login/auth, no multi-user accounts
- No real backend server or database (client-side only)
- No real SCADA/utility integration
- No mobile app / native app
- No payments, notifications, or emails
- No deployment pipeline beyond what's needed to run locally

## Success Criteria
- `npm install && npm run dev` runs with zero manual setup.
- A judge with no utilities background understands the problem and solution within 60 seconds of the demo.
- Every official submission requirement (Part 1 and Part 3 of the hackathon guide) is met.
- The app passes Bob's own autonomous test-and-debug loop (see .bob/rules/01-project-rules.md) with zero build errors and zero failing tests before it is called done.
- Build stays within the 50-Bobcoin budget (see PHASES.md).

## Architecture

### Guiding Principle
Everything runs client-side in the browser. No backend, no database, no server deployment. This keeps the build small, keeps it inside the Bobcoin budget, and lets any judge run it with two commands.

### High-Level Flow
1. App loads -> `data/assets.ts` generates a deterministic (seeded) list of grid assets with coordinates.
2. `data/sensorGenerator.ts` produces a seeded sensor-reading history per asset.
3. `data/incidentHistory.ts` produces a seeded incident log per asset/area.
4. `services/weatherService.ts` fetches a live forecast per asset location from Open-Meteo (no API key). On failure, falls back to cached mock data and shows an "estimated weather" badge.
5. `engine/riskScoring.ts` combines sensor health, weather risk, and incident weight into a 0-100 Risk Score per asset.
6. `engine/ranking.ts` sorts assets by Risk Score and grid-impact severity.
7. `engine/maintenancePlan.ts` turns the ranked list into a prioritised action plan.
8. `engine/explain.ts` generates a plain-English reason string per asset.
9. The Zustand store (`store/useGridStore.ts`) holds all of the above; UI components subscribe to it.
10. UI renders: KPI bar, then Map, Ranked list, Asset detail, and Maintenance plan.

### Folder & File Structure
Items marked [REQUIRED] come from the official hackathon template - never delete or rename them, only edit their contents.

```
bob-ai-hackathon-Team-ThirdEye/
|-- AGENTS.md                        (this file - Bob's auto-loaded context)
|-- PHASES.md                        (build + test-debug-loop plan)
|-- MEMORY.md                        (living log - read/write every session)
|-- .bob/
|   `-- rules/
|       `-- 01-project-rules.md      (auto-injected rules + loop protocol)
|-- submission.yaml                  [REQUIRED - fill every field]
|-- README.md                        [REQUIRED - project overview]
|-- src/                             [REQUIRED - all source code]
|   |-- main.tsx
|   |-- App.tsx
|   |-- components/
|   |   |-- layout/        (Header, Sidebar, KpiBar)
|   |   |-- map/            (RiskMap, AssetMarker)
|   |   |-- list/            (AssetList, AssetCard, RiskBadge)
|   |   |-- detail/          (AssetDetail, SensorChart, WeatherPanel)
|   |   |-- plan/             (MaintenancePlan, PlanRow)
|   |   `-- ui/                (Button, Card, Badge, Tooltip)
|   |-- data/
|   |   |-- assets.ts
|   |   |-- sensorGenerator.ts
|   |   `-- incidentHistory.ts
|   |-- services/
|   |   `-- weatherService.ts
|   |-- engine/
|   |   |-- riskScoring.ts
|   |   |-- ranking.ts
|   |   |-- maintenancePlan.ts
|   |   `-- explain.ts
|   |-- store/
|   |   `-- useGridStore.ts
|   |-- types/
|   |   `-- domain.ts
|   |-- styles/
|   |   `-- theme.css
|   |-- .env.example                [REQUIRED]
|   `-- README.md                    [REQUIRED]
|-- docs/                             [REQUIRED]
|   |-- problem-statement.md
|   |-- solution-overview.md
|   |-- architecture.md
|   `-- setup-guide.md
|-- demo/                             [REQUIRED]
|   |-- demo-video-link.txt
|   |-- live-demo-url.txt
|   `-- screenshots/
|-- presentation/                     [REQUIRED]
|-- CONTRIBUTING.md                   [REQUIRED]
|-- .gitignore                        [REQUIRED]
`-- .github/workflows/validate.yml    [REQUIRED]
```

### Tech Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | React 18 + Vite | Fast dev loop, zero-config, tiny Bobcoin footprint |
| Language | TypeScript | Type safety catches bugs before they cost a coin to fix |
| Styling | Tailwind CSS | No separate design files, fast to iterate |
| Charts | Recharts | Simple API, good defaults |
| Map | React-Leaflet + OpenStreetMap / CARTO tiles | Free, no API key |
| Weather | Open-Meteo API | Free, no API key, no billing risk |
| State | Zustand | Minimal boilerplate vs Redux |
| Testing | Vitest (unit tests on the scoring engine, used by the test-debug loop) | Cheap, fast, automatable confidence |
| Lint/Format | ESLint + Prettier | Keeps AI-generated code consistent and catches errors before runtime |

### Error Handling Architecture
- All network calls (`weatherService.ts`) wrapped in try/catch with a typed result-style return.
- On weather fetch failure: fall back to cached/mock forecast, show a visible "estimated weather" badge - never a blank screen or crash.
- All async UI states have three renders: loading, error, success - no unstated fourth state.
- Errors logged to console with the asset ID and operation name so the test-debug loop (and a human) can find them fast.

## Design

### Visual Direction
A dark, "grid-operations control room" aesthetic. High contrast, data-dense but uncluttered, risk communicated through colour plus label plus icon (never colour alone).

### Colour Palette

| Token | Hex | Use |
| --- | --- | --- |
| Background | #0B1220 | App background |
| Surface | #131B2E | Cards, panels |
| Border | #1F2A44 | Card/table borders, dividers |
| Text - primary | #E7ECF5 | Headings, key values |
| Text - muted | #8B95A8 | Secondary labels, captions |
| Brand / accent | #3B82F6 | Links, active states, primary buttons |
| Risk - Low | #22C55E | Low-risk tier |
| Risk - Medium | #EAB308 | Medium-risk tier |
| Risk - High | #F97316 | High-risk tier |
| Risk - Critical | #EF4444 | Critical-risk tier |

### Typography
- Headings & UI text: Inter (system-ui fallback).
- Numeric/KPI values: JetBrains Mono (or Roboto Mono).
- Scale: 24px page title, 20px section, 16px card title, 14px body, 12px captions/labels.
- Weight: 600 for headings/labels, 400 for body text.

### Components
- Cards: rounded-lg, 1px border in Border token, subtle shadow, 16px internal padding.
- Risk badge: pill shape, background is the risk-tier colour at 15% opacity, text is the risk-tier colour, always paired with the tier name as text.
- Buttons: solid brand-accent for primary actions, ghost/outline for secondary - 8px corner radius.
- Spacing: Tailwind's default 4px-based scale (4/8/12/16/24/32) only.

### Map & Charts
- Dark basemap (CARTO "dark matter" tiles). Markers: circle, colour equals risk tier, size equals grid-impact severity.
- Recharts styled to the same dark theme: subtle gridlines, tooltips using the Surface background with a Border-token outline.

### Motion & Accessibility
- 150-200ms transitions on hover/selection only. No page-transition animations.
- At least 4.5:1 text contrast. Risk tier always communicated by colour AND a text label/icon.

## Skills
Built-in Bob skills already available (Always on): `create-plan`, `create-skill`, `create-mode`, `configure-hooks`, `configure-mcp`, `build-mcp-server`, `office-insights`, `create-chart`.

Use `create-plan` once at the very start to turn PHASES.md into your working plan and todo list.

Use `create-skill` to author these six project-specific skills before Phase 1 begins:

| Skill | Purpose | Invoke when |
| --- | --- | --- |
| `grid-risk-scoring` | Encodes the risk-scoring formula, weightings, normalisation rules, and explanation-string templates. | Building or touching `engine/riskScoring.ts`, `ranking.ts`, `explain.ts`. |
| `synthetic-data-gen` | Encodes the seeded-random approach and data schema for assets/sensors/incidents. | Building or extending anything in `data/`. |
| `dashboard-component` | Encodes the Tailwind conventions, colour tokens, and component structure above. | Building any file in `components/`. |
| `submission-checklist` | Walks through the Hackathon Template Compliance list in .bob/rules/01-project-rules.md and verifies each item. | Before marking any phase, especially Phase 6, as complete. |
| `memory-checkpoint` | Appends a structured entry to MEMORY.md (what changed, files touched, next step, Bobcoins used). | After every completed task, without exception. |
| `self-test-loop` | Runs the bounded build -> lint -> test -> run -> verify loop defined in .bob/rules/01-project-rules.md, logs each attempt, and stops at the loop limit instead of retrying forever. | At the end of every phase, and as the mandatory Final Full-System Loop after Phase 6. |

Do not use `configure-mcp` or `build-mcp-server` for this project - there is no external tool/data source to connect to. Keep `office-insights` and `create-chart` available but only invoke them if a specific task calls for it.
