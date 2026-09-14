# MEMORY.md - Living Project Log

Bob: read this file first, every session. Update it - don't skip this - after every completed task, after every test-debug loop attempt, and always at the end of a phase.

## Status
ALL PHASES COMPLETE. Project is demo-ready pending: (1) actual screenshots in demo/screenshots/, (2) a real demo video link in demo/demo-video-link.txt, (3) an actual slide deck PDF/PPTX in presentation/, and (4) team member real names/emails in submission.yaml.

## Current Phase
Phase 6 — Complete

## Completed
- Phase 0: Project scaffolding (Vite+React+TS+Tailwind+ESLint, folder skeleton, submission.yaml, base layout shell, 6 skills)
- Phase 1: Synthetic data layer (assets.ts, sensorGenerator.ts, incidentHistory.ts, domain types)
- Phase 2: Weather integration (Open-Meteo + mock fallback with isEstimated badge)
- Phase 3: Risk scoring engine (riskScoring.ts, ranking.ts, explain.ts, 22 Vitest unit tests)
- Phase 4: Dashboard UI core (Zustand store, RiskMap, AssetList, KpiBar, full layout)
- Phase 5: Asset detail & maintenance plan (SensorChart, WeatherPanel, AssetDetail, MaintenancePlan, PlanRow)
- Phase 6: Polish, docs, README, demo prep, final build clean

## In Progress
(none — all phases done)

## Next Up
Human actions before submission:
1. Take 3-4 screenshots of the running app → place in demo/screenshots/
2. Record a 3-5 minute demo video → update demo/demo-video-link.txt
3. Create slide deck from presentation/SLIDES-OUTLINE.md → save as PDF/PPTX in presentation/
4. Update submission.yaml with real team member names and emails
5. (Optional) Deploy to GitHub Pages or Vercel → update demo/live-demo-url.txt
6. Submit via IBM Bob AI Hackathon - CHARUSAT Submission Form on 15 September 12:00–11:45 PM

## Decisions Log
- Used mulberry32 PRNG for deterministic seeding (lightweight, no deps, same result every reload).
- Reference date for all time calculations: `new Date('2025-01-01')` — consistent across builds.
- jsdom installed as devDep so vitest environment works.
- Added placeholder `src/tests/smoke.test.ts` so vitest doesn't fail "no test files found" in Phase 0.
- vite.config.ts uses `/// <reference types="vitest" />` triple-slash directive to avoid TS2769 on `test` config key.
- Explanation logic co-located in riskScoring.ts (not explain.ts) to avoid circular imports.
- explain.ts is a re-export shim for getRiskTier — satisfies the folder skeleton requirement.
- Zustand set() uses functional form `set((s) => ...)` for selectedAssetId to read current state.
- App uses tab UI (Asset Detail / Maintenance Plan) for the bottom panel rather than a split view.
- Chunk size warning from Vite (713kB) is a non-blocking advisory — not an error.

## Known Issues / Blockers
- demo/screenshots/ contains only a README placeholder — real screenshots must be taken manually.
- demo/demo-video-link.txt has a placeholder URL — real video must be recorded and linked.
- presentation/ contains only SLIDES-OUTLINE.md — actual slide deck must be created.
- submission.yaml team member names/emails are placeholders — must be updated with real info.
- The Vite chunk size advisory (713kB unminified) could be resolved with dynamic imports, but is not a build error and doesn't affect functionality.

## Test & Debug Loop Log

| Phase | Attempt # | What was tested | Result | Fix applied | Coins used |
| --- | --- | --- | --- | --- | --- |
| 0 | 1 | build+lint+test | build FAIL (vite.config `test` key TS error) | Added `/// <reference types="vitest" />` | ~1 |
| 0 | 2 | build+lint+test | PASS — build clean, lint clean, 1 test passing | - | ~1 |
| 1 | 1 | build+lint+test | build FAIL (unused ASSET_TYPES var) | Removed unused const | ~0.5 |
| 1 | 2 | build+lint+test | PASS | - | ~0.5 |
| 2 | 1 | build+lint+test | PASS first try | - | ~0.5 |
| 3 | 1 | build+lint+test | PASS first try — 23 tests passing | - | ~0.5 |
| 4 | 1 | build+lint+test | PASS first try | - | ~0.5 |
| 5 | 1 | build+lint+test | PASS first try (chunk warning, not error) | - | ~0.5 |
| 6 | 1 | build+lint+test | PASS first try | - | ~0.5 |

## Session Log

### [Phase 0] - Scaffolding & Skills - 2025-01-01
- Created 6 skills, full project skeleton, layout shell, submission.yaml, domain types.
- **Bobcoins used this phase:** ~2 | **Debug Reserve remaining:** 4

### [Phase 1] - Synthetic Data Layer
- assets.ts (35 assets, mulberry32), sensorGenerator.ts (24-day history), incidentHistory.ts (0-8 incidents).
- 1 quick fix: remove unused ASSET_TYPES const.
- **Bobcoins used this phase:** ~1 | **Debug Reserve remaining:** 4

### [Phase 2] - Weather Integration
- weatherService.ts: Open-Meteo fetch, in-memory cache, location batching, mock fallback, clearWeatherCache().
- PASS first try.
- **Bobcoins used this phase:** ~0.5 | **Debug Reserve remaining:** 4

### [Phase 3] - Risk Scoring Engine
- riskScoring.ts (composite formula, clamp, tiers, explanation), ranking.ts, explain.ts (re-export shim).
- 22 Vitest unit tests in riskScoring.test.ts — all pass.
- **Bobcoins used this phase:** ~1 | **Debug Reserve remaining:** 4

### [Phase 4] - Dashboard UI Core
- Zustand store (mock-first + live weather refetch), KpiBar, RiskMap (React-Leaflet + CARTO), AssetMarker, AssetList, AssetCard, RiskBadge, updated Sidebar.
- **Bobcoins used this phase:** ~1 | **Debug Reserve remaining:** 4

### [Phase 5] - Asset Detail & Maintenance Plan
- maintenancePlan.ts engine, SensorChart (Recharts), WeatherPanel, AssetDetail, PlanRow, MaintenancePlan, App tab UI.
- **Bobcoins used this phase:** ~1 | **Debug Reserve remaining:** 4

### [Phase 6] - Polish, Docs, Final Loop
- README.md, docs/problem-statement.md, docs/solution-overview.md, docs/architecture.md, docs/setup-guide.md.
- demo/demo-video-link.txt, demo/live-demo-url.txt, demo/screenshots/README.md, presentation/SLIDES-OUTLINE.md.
- Final build: ✓ zero errors. Lint: ✓ zero errors. Tests: ✓ 23/23 pass.
- **Bobcoins used this phase:** ~1 | **Debug Reserve remaining:** 4

## Final Full-System Loop Status
Partially run — build/lint/test loop complete. Visual walkthrough requires human confirmation (browser required).

- [x] Production build clean (✓ vite build, 0 TS errors)
- [x] Lint clean (✓ 0 errors)
- [x] All tests passing (✓ 23/23)
- [ ] Full user-flow walkthrough (requires browser — run `npm run dev`)
- [ ] submission-checklist: screenshots, video, slides, real team info still needed
- [ ] Project declared demo-ready (pending human-action items above)

## Bobcoin Usage Tracker

| Phase | Budget | Used | Remaining | Notes |
| --- | --- | --- | --- | --- |
| 0 | 4 | ~2 | ~2 | 2 loop attempts (1 build fix) |
| 1 | 5 | ~1.5 | ~3.5 | 1 quick fix (unused var) |
| 2 | 4 | ~0.5 | ~3.5 | PASS first try |
| 3 | 7 | ~1 | ~6 | PASS first try, 22 unit tests |
| 4 | 9 | ~1 | ~8 | PASS first try |
| 5 | 8 | ~1 | ~7 | PASS first try |
| 6 | 9 | ~1 | ~8 | PASS first try |
| Debug Reserve | 4 | 0 | 4 | Untouched |
| Total | 50 | ~8 | ~42 | Well under budget |
