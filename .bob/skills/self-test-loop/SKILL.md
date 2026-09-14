---
name: self-test-loop
description: Use at the end of every phase — runs the bounded build → lint → test → dev-server → verify loop, logs each attempt, and stops at the loop limit instead of retrying forever.
---

# Self-Test Loop

Run this loop at the end of every phase implementation, before marking a phase complete or committing.

## Loop Protocol

### Step 1 — Build Check
```
npm run build
```
Must complete with **zero TypeScript errors**. Warnings are acceptable; errors are not.
If it fails: read the actual error, find the root cause, apply the minimal fix. Do NOT add `any` types or comment out errors.

### Step 2 — Lint Check
```
npm run lint
```
Must complete with **zero errors**. Warnings are acceptable.
If it fails: fix the lint errors. Common causes: unused imports, missing return types on exported functions, `any` usage.

### Step 3 — Test Check
```
npm run test -- --run
```
Must show **all tests passing** (0 failures).
If it fails: read the actual assertion errors, fix the code (not the tests, unless the test is clearly wrong).

### Step 4 — Dev Server Check
```
npm run dev
```
Start the server and check the **terminal output** for runtime errors or unhandled exceptions. Look for:
- Red error messages in the console output
- "Failed to compile" or similar
- Unhandled promise rejections

Do NOT spend a Bobcoin just launching the dev server — check the startup output and stop it (`Ctrl+C` equivalent).

### Step 5 — Acceptance Criteria Verification
Re-read the current phase's acceptance criteria from PHASES.md and verify each one manually:
- Can you confirm it passes from the code/test output alone? Do so.
- If it requires visual confirmation (e.g. "map renders"), note it as "requires visual check" and proceed.

## Budget Limits — READ THIS BEFORE LOOPING

- Each phase gets **2 loop attempts** from its own budget.
- If a phase needs a 3rd+ attempt, draw from the **shared 4-Bobcoin Debug Reserve**.
- Track every draw in MEMORY.md's Bobcoin Usage Tracker AND the Test & Debug Loop Log.
- **Hard stop at 5 total attempts on a single issue**, Debug Reserve or not.
  - At attempt 5, if it's still failing: STOP. Log the exact error and everything tried. Report to the user.
  - Never continue looping past attempt 5 — it's a design problem, not a bug.
- If the Debug Reserve hits zero while a phase is still failing: STOP immediately and report to the user.

## After Each Loop Attempt

Use the `memory-checkpoint` skill to log the attempt in MEMORY.md before deciding whether to loop again.

Format for MEMORY.md Test & Debug Loop Log table:

| Phase | Attempt # | What was tested | Result | Fix applied | Coins used |
|-------|-----------|-----------------|--------|-------------|------------|
| N     | 1         | build+lint+test | PASS   | none        | N          |

## What "Pass" Means

The loop is considered **passed** when ALL of the following are true:
1. `npm run build` completes with zero errors.
2. `npm run lint` completes with zero errors.
3. `npm run test -- --run` shows all tests passing.
4. Dev server starts without errors in terminal output.
5. All of the current phase's acceptance criteria are verified.

Only then: commit, update MEMORY.md, and move to the next phase.
