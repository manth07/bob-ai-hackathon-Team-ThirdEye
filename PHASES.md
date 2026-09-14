# PHASES.md

Total budget: 50 Bobcoins across 7 build phases plus a shared Debug Reserve. Do not start the next phase until the current one's acceptance criteria - including its test-debug loop - pass and are committed.

Budget map: Phase 0 (4) + Phase 1 (5) + Phase 2 (4) + Phase 3 (7) + Phase 4 (9) + Phase 5 (8) + Phase 6 (9) + Debug Reserve (4) = 50.

Every phase's acceptance criteria implicitly include: "passes the per-phase Test & Debug Loop in .bob/rules/01-project-rules.md (build clean, lint clean, tests pass, dev server starts clean)."

## Phase 0 - Setup & Scaffolding (Budget: 4, incl. up to 2 loop attempts)
- Initialise Vite + React + TypeScript + Tailwind + ESLint/Prettier.
- Create the full folder skeleton from AGENTS.md's Architecture section (empty files where needed).
- Fill every REQUIRED field in `submission.yaml`.
- Build a base layout shell (Header + empty content area).
- Commit: `Phase 0: project scaffolding`.

Acceptance: `npm install && npm run dev` shows the shell app with no console errors; GitHub Actions "Validate Submission" is green; test-debug loop passes.

## Phase 1 - Synthetic Data Layer (Budget: 5, incl. up to 2 loop attempts)
- `types/domain.ts` - Asset, SensorReading, Incident, RiskScore interfaces.
- `data/assets.ts` - 30-40 seeded assets (transformer/substation/feeder) with lat/lng, criticality tier.
- `data/sensorGenerator.ts` - seeded time-series sensor data per asset.
- `data/incidentHistory.ts` - seeded past incidents per asset/area.

Acceptance: data is deterministic across reloads; visible via a temporary debug view or console table; test-debug loop passes.

## Phase 2 - Weather Integration (Budget: 4, incl. up to 2 loop attempts)
- `services/weatherService.ts` - fetch forecast per asset location from Open-Meteo; batch/cache requests; fallback to mock data with an "estimated weather" badge on failure.

Acceptance: weather data populates for all assets; disabling network shows the fallback badge instead of crashing; test-debug loop passes.

## Phase 3 - Risk Scoring Engine (Budget: 7, incl. up to 2 loop attempts)
- `engine/riskScoring.ts` - composite 0-100 score from sensor health, weather risk, and incident weight.
- `engine/ranking.ts` - sort by score and grid-impact severity.
- `engine/explain.ts` - plain-English reason string per asset (top contributing factor).
- Vitest unit tests on the scoring function - these become part of every future loop run.

Acceptance: scores always within 0 to 100; ranking order stable and explainable; unit tests pass; test-debug loop passes.

## Phase 4 - Dashboard UI Core (Budget: 9, incl. up to 2 loop attempts)
- `store/useGridStore.ts` (Zustand) wiring data and engine output to the UI.
- Layout: Header, Sidebar, KPI bar.
- `components/map` - colour-coded risk map (React-Leaflet).
- `components/list` - ranked asset list/cards with risk badges.

Acceptance: map and list render live computed data; selecting an asset in either view highlights it in the other; test-debug loop passes.

## Phase 5 - Asset Detail & Maintenance Plan (Budget: 8, incl. up to 2 loop attempts)
- `components/detail` - sensor trend charts (Recharts), weather panel, plain-English explanation.
- `engine/maintenancePlan.ts` - turns the ranked list into a prioritised action plan.
- `components/plan` - maintenance plan table/view.

Acceptance: selecting any asset shows its full detail and its place in the maintenance plan; plan updates live if underlying data changes; test-debug loop passes.

## Phase 6 - Polish, Docs, Final Loop & Demo Prep (Budget: 9, incl. up to 2 loop attempts)
- Visual polish per AGENTS.md's Design section; loading/error states verified everywhere.
- Fill `docs/problem-statement.md`, `docs/solution-overview.md`, `docs/architecture.md`, `docs/setup-guide.md` (test the setup steps yourself).
- Polish top-level `README.md`.
- Record a 3-5 minute demo video; capture at least 3 sequential screenshots into `demo/screenshots/`; fill `demo-video-link.txt` and `live-demo-url.txt`.
- Build the slide deck outline in `presentation/`.
- **Run the Final Full-System Loop** (see .bob/rules/01-project-rules.md) - full production build, full user-flow walkthrough, every phase's acceptance criteria re-checked, submission-checklist skill run.
- Final MEMORY.md wrap-up entry declaring the project demo-ready.

Acceptance: every item in the Hackathon Template Compliance section passes; "Validate Submission" is green; Final Full-System Loop passes with zero open issues; project is demo-ready.

## Debug Reserve (Budget: 4)
A shared pool any phase can draw from if it needs more than its included 2 loop attempts. Track draws against it in MEMORY.md's Bobcoin Usage Tracker. If it hits zero while a phase is still failing, stop and report to the user rather than continuing to spend - see the loop limits in .bob/rules/01-project-rules.md.
