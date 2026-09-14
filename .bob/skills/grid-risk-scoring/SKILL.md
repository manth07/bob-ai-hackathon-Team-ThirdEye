---
name: grid-risk-scoring
description: Use when building or touching engine/riskScoring.ts, ranking.ts, or explain.ts — encodes the risk-scoring formula, weightings, normalisation rules, and explanation-string templates for GridSentry.
---

# Grid Risk Scoring

## Formula

Risk Score = (sensorHealth × 0.45) + (weatherRisk × 0.30) + (incidentWeight × 0.25)

All three inputs are normalised to 0–100 before weighting. The final score is clamped to [0, 100].

## Component Details

### 1. Sensor Health Score (0-100, higher = more risk)

Inputs per asset (latest reading):
- `temperature`: normalise against safe range. For transformers: 0–85°C safe (0 risk → 100 risk at 120°C+). For substations/feeders: 0–75°C safe.
- `load`: % of rated capacity. Risk starts at 80% load. 80% → score 20, 100% → score 80, 120%+ → score 100.
- `vibration`: 0–2 mm/s normal. 2–5 mm/s medium risk. 5+ mm/s high risk.
- `oilQuality`: 0–100 index (100 = fresh oil). Risk = (100 - oilQuality). Below 40 = critical.

Combine as: `sensorHealth = (tempScore × 0.35) + (loadScore × 0.30) + (vibScore × 0.20) + (oilScore × 0.15)`

### 2. Weather Risk Score (0-100)

From Open-Meteo forecast (or mock fallback). Inputs:
- `windspeed_10m`: >60 km/h → risk 50, >90 km/h → risk 100 (linear between).
- `precipitation`: >20 mm/hr → risk 40, >50 mm/hr → risk 100.
- `temperature_2m`: <-10°C → risk 30; >38°C → risk 40 (additive with other factors, still clamp 0-100).
- `weathercode`: storm codes (45, 48, 51-67, 71-77, 80-99) add a flat +20 to weather risk score.

Combine: `weatherRisk = min(100, windRisk + precipRisk + tempRisk + stormBonus)`

### 3. Incident Weight (0-100)

Based on the asset's historical incident log:
- Count incidents in the last 2 years.
- Weighted by severity: minor=1, moderate=3, major=5, critical=10.
- Base score = min(100, weightedCount × 8).
- Recency bonus: most recent incident within 6 months → add 10; within 3 months → add 20.

## Risk Tiers

| Score | Tier | Color token |
|-------|------|-------------|
| 0–24 | Low | #22C55E |
| 25–49 | Medium | #EAB308 |
| 50–74 | High | #F97316 |
| 75–100 | Critical | #EF4444 |

## Ranking (`ranking.ts`)

Primary sort: Risk Score descending.
Tiebreaker: Criticality tier (critical > high > medium > low) then asset name alphabetically.

Export: `rankAssets(assets: Asset[], scores: Map<string, RiskScore>): RankedAsset[]`

## Explanation Strings (`explain.ts`)

Pick the single top-contributing factor (highest individual component) and return one of these templates:

- Sensor dominant: `"Elevated [sensor type] readings ([value][unit]) indicate potential [fault type]."`
- Weather dominant: `"Severe weather conditions ([condition]) present elevated stress risk."`
- Incident dominant: `"[N] incidents in the past [period], including a [severity] event on [date]."`
- Combined (score ≥75 and all components ≥30): `"Multiple compounding risk factors: [top two factors]."`

Always end with: `" Recommend [timeframe] inspection."` where timeframe is:
- Critical (≥75): "immediate (within 24h)"
- High (50-74): "urgent (within 7 days)"
- Medium (25-49): "scheduled (within 30 days)"
- Low (<25): "routine (next maintenance cycle)"

## Implementation Notes

- All scoring functions must be pure (no side effects, no network calls).
- Use the same seeded RNG from `data/assets.ts` — never `Math.random()`.
- Export `computeRiskScore(asset, latestSensors, forecast, incidents): RiskScore` from `riskScoring.ts`.
- `RiskScore` type defined in `types/domain.ts` must include: `{ assetId, total, sensorHealth, weatherRisk, incidentWeight, tier, explanation }`.
