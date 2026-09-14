# MEMORY.md - Living Project Log

Bob: read this file first, every session. Update it - don't skip this - after every completed task, after every test-debug loop attempt, and always at the end of a phase.

## Status
Phase 0 complete. Phase 1 in progress.

## Current Phase
Phase 1 - Synthetic Data Layer

## Completed
- Phase 0: Project scaffolding (Vite+React+TS+Tailwind+ESLint, folder skeleton, submission.yaml, base layout shell, 6 skills)

## In Progress
- Phase 1: Synthetic Data Layer

## Next Up
Phase 2 - Weather Integration

## Decisions Log
- Used mulberry32 PRNG for deterministic seeding (lightweight, no deps, same result every reload).
- Reference date for all time calculations: `new Date('2025-01-01')` — consistent across builds.
- jsdom installed as devDep so vitest environment works; @vitest/ui skipped (not needed for CI loop).
- Added placeholder `src/tests/smoke.test.ts` so vitest doesn't fail "no test files found" in Phase 0.
- tsconfig uses `"moduleResolution": "bundler"` per Vite 5 recommendation.
- vite.config.ts uses `/// <reference types="vitest" />` triple-slash directive to avoid TS2769 on `test` config key.

## Known Issues / Blockers
(none)

## Test & Debug Loop Log

| Phase | Attempt # | What was tested | Result | Fix applied | Coins used |
| --- | --- | --- | --- | --- | --- |
| 0 | 1 | build+lint+test | build FAIL (vite.config `test` key TS error) | Added `/// <reference types="vitest" />` | ~1 |
| 0 | 2 | build+lint+test | PASS — build clean, lint clean, 1 test passing | - | ~1 |

## Session Log

### [Phase 0] - Scaffolding & Skills - 2025-01-01

**What changed:**
- Created 6 project skills in `.bob/skills/`: grid-risk-scoring, synthetic-data-gen, dashboard-component, submission-checklist, memory-checkpoint, self-test-loop.
- Initialised full project: package.json, vite.config.ts, tsconfig*.json, eslint.config.js, tailwind.config.js, postcss.config.js, index.html.
- Created all source folder skeletons: src/types, src/data, src/services, src/engine, src/store, src/components (all subfolders), src/styles.
- Wrote domain types in `src/types/domain.ts`.
- Built base layout shell: Header, KpiBar, Sidebar, App.tsx.
- Filled `submission.yaml` with all required fields.
- Updated `src/.env.example` for GridSentry (no keys needed).
- Added `src/tests/smoke.test.ts` placeholder test.

**Files touched:**
- `.bob/skills/*/SKILL.md` (6 files)
- `package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.js`, `postcss.config.js`
- `index.html`, `src/main.tsx`, `src/App.tsx`
- `src/styles/theme.css`, `src/types/domain.ts`
- `src/components/layout/Header.tsx`, `KpiBar.tsx`, `Sidebar.tsx`
- All placeholder stub files in data/, engine/, services/, store/, components/
- `submission.yaml`, `src/.env.example`
- `src/tests/smoke.test.ts`

**Test & Debug Loop:**
- Attempt 1: build FAIL — vite.config.ts TS2769 error on `test` key. Fixed with `/// <reference types="vitest" />`.
- Attempt 2: PASS — build clean, lint clean, 1 test passing.

**Bobcoins used this phase:** ~2 (of budget 4)
**Debug Reserve remaining:** 4 (untouched)

**Next up:** Phase 1 - Synthetic Data Layer

## Final Full-System Loop Status
Not yet run. (Runs once, during Phase 6, after every phase is otherwise complete.)

- [ ] Production build clean
- [ ] Full user-flow walkthrough passes
- [ ] Every phase's acceptance criteria re-verified
- [ ] submission-checklist skill passes
- [ ] Project declared demo-ready

## Bobcoin Usage Tracker

| Phase | Budget | Used | Remaining | Notes |
| --- | --- | --- | --- | --- |
| 0 | 4 | ~2 | ~2 | 2 loop attempts (1 build fix) |
| 1 | 5 | - | - | |
| 2 | 4 | - | - | |
| 3 | 7 | - | - | |
| 4 | 9 | - | - | |
| 5 | 8 | - | - | |
| 6 | 9 | - | - | |
| Debug Reserve | 4 | 0 | 4 | Untouched |
| Total | 50 | ~2 | ~48 | |
