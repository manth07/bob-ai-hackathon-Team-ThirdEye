# Solution Overview

## GridSentry — Predict Power Outages Before They Happen

### What We Built

GridSentry is a **browser-based grid equipment failure advisor** that combines three data streams into a single, actionable risk score for every asset in a utility's grid fleet:

1. **Sensor telemetry** — temperature, load %, vibration (mm/s), oil quality index
2. **Live weather forecasts** — wind speed, precipitation, temperature extremes, storm codes
3. **Historical incident data** — past failures weighted by severity and recency

The result: a **0–100 Risk Score** per asset, ranked fleet-wide, with plain-English explanations and a prioritised maintenance plan.

### How It Works

```
Sensor Health Score   (45%)   — how stressed is the equipment right now?
Weather Risk Score    (30%)   — how dangerous are current conditions?
Incident Weight       (25%)   — does this asset have a failure history?
                        ↓
              Composite Risk Score (0-100)
              Tier: Low / Medium / High / Critical
                        ↓
        "Elevated sensor readings (health index 78/100) indicate
         potential equipment stress. Recommend urgent inspection."
                        ↓
              Maintenance Plan: Within 7 days — $5,000–$50,000
```

### Key Design Decisions

**Client-side only.** No backend, no database, no deployment complexity. Any judge can run it with `npm install && npm run dev`.

**Deterministic synthetic data.** The seeded mulberry32 PRNG ensures the same demo every time — no randomness across reloads, no "it worked yesterday" problems.

**Graceful weather fallback.** If Open-Meteo is unavailable, the app instantly falls back to deterministic mock forecasts and shows an "⚠ Estimated" badge — never a blank screen or crash.

**Plain-English explanations.** Every asset's risk is explained in one sentence: what's causing it, and what to do. No technical jargon required for a judge who has never seen a transformer.

### The Dashboard

| Panel | What it shows |
|-------|---------------|
| **KPI Bar** | Total assets monitored, critical/high counts, top priority asset |
| **Risk Map** | CARTO dark-matter map, colour-coded markers (green→red), click to select |
| **Asset List** | Ranked cards with score bars, selecting one highlights it on the map |
| **Asset Detail** | Sensor trend charts (24-day history), weather panel, risk breakdown |
| **Maintenance Plan** | Full fleet action table: priority, timeframe, recommended action, estimated cost |

### Impact

A utility operations team using GridSentry could shift from reactive emergency repairs to **proactive condition-based maintenance**:
- Catch a transformer at 85% oil degradation before it fails
- Flag an overloaded feeder before a windstorm doubles its stress
- Prioritise the asset with 3 critical incidents in the last 2 years for immediate inspection

The estimated cost difference: **$5,000 preventive vs $500,000+ emergency**.
