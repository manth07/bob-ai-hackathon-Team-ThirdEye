# .bob/rules/01-project-rules.md
(Auto-injected into every Bob conversation and every mode for this project.)

## Use
- React 18, Vite, TypeScript (strict mode), Tailwind CSS, Recharts, React-Leaflet, Zustand, Open-Meteo (no key), date-fns, Vitest.
- Function components and hooks only.
- Seeded / deterministic random generation for all synthetic data (same seed gives the same demo every time).

## Avoid
- Any backend framework, database, or ORM - this project is client-side only.
- Any API that requires a paid key, billing setup, or OAuth.
- Redux, MobX, or any state library beyond Zustand.
- CSS-in-JS libraries, inline `style={{}}` beyond one-off cases - use Tailwind classes.
- The TypeScript `any` type - define a real interface in `types/domain.ts` instead.
- Class components, jQuery, or any pre-hooks React pattern.
- Committing `node_modules/`, `.env`, or any real API key.
- Adding a feature not listed in AGENTS.md's Core Features without first logging it as a suggestion in MEMORY.md - no silent scope creep.

## Error Handling Standards
- Every fetch/async call wrapped in try/catch.
- Every component that depends on async data renders explicit loading, error, and success states.
- Never let the UI go blank or white-screen on an error - always show a fallback message.
- Log errors to console with enough context (asset ID, operation) to debug quickly.

## Boundaries for the AI (Bob)
1. Read first. At the start of every session, read MEMORY.md before doing anything else.
2. Log every change. After finishing any file or task, append an entry to MEMORY.md. Mandatory, not optional.
3. Work phase by phase. Follow PHASES.md in order. Do not start Phase N+1 until Phase N's acceptance criteria (including its test-debug loop, below) pass and are committed.
4. Never touch protected files/folders. Do not delete or rename: `submission.yaml`, `README.md`, `docs/`, `demo/`, `presentation/`, `CONTRIBUTING.md`, `.gitignore`, `.github/workflows/validate.yml`. Only edit their contents.
5. Batch your work. Implement a full phase's files in as few turns as possible.
6. Checkpoint, don't chat. Only pause for human confirmation at the end of each phase. Otherwise keep working autonomously.
7. No invented requirements. If something is ambiguous, make the simplest reasonable choice, note it in MEMORY.md's Decisions Log, and keep moving.
8. Commit discipline. One commit per phase (or clearly-scoped sub-task): `Phase N: <short description>`.
9. Stay runnable. Never leave the app in a broken/uncompilable state at the end of a working session.

## Autonomous Test & Debug Loop Protocol ("Loop Engineering")
This is how Bob proves a phase actually works, not just compiles. Run it with the `self-test-loop` skill.

**Per-phase loop** - run after implementing any phase's files, before marking it complete:
1. Run `npm run build` (or `tsc --noEmit`) - must complete with zero type errors.
2. Run `npm run lint` - must complete with zero errors (warnings are OK).
3. Run `npm run test` (Vitest) - all tests must pass.
4. Start the dev server (`npm run dev`) briefly and check the startup/console output for runtime errors or unhandled exceptions.
5. Re-check that phase's specific acceptance criteria in PHASES.md, one by one.

If any step fails:
- Read the actual error, form a hypothesis about the root cause, and apply the smallest fix that addresses it (not a workaround that just hides the symptom).
- Re-run the full loop (steps 1-5) from the top.
- Log the attempt in MEMORY.md's Test & Debug Loop Log: phase, attempt number, what failed, fix applied, Bobcoins used.

**Loop limits - this is what keeps looping from turning into unbounded spending:**
- Each phase gets up to 2 loop attempts included in its own budget in PHASES.md.
- If a phase needs more than 2 attempts, draw extra attempts from the shared 4-Bobcoin Debug Reserve in PHASES.md.
- If the Debug Reserve is exhausted and the phase still fails: STOP. Do not keep looping. Log the exact failure and everything you already tried in MEMORY.md, then tell the user directly instead of continuing to spend.
- Never exceed 5 total attempts on a single issue, budget or no budget - past that point it's a design problem, not a bug, and needs a human decision.

**Final Full-System Loop** - required before declaring the project done, run as part of Phase 6:
1. Run `npm run build` for a production build.
2. Serve the production build locally and walk the entire user flow end to end: load app -> KPI bar -> map -> ranked list -> select an asset -> detail + charts -> its place in the maintenance plan.
3. Re-verify every acceptance criterion from every phase in PHASES.md, not just Phase 6's.
4. Run the `submission-checklist` skill against the Hackathon Template Compliance section below.
5. Only once all of the above pass, write a final MEMORY.md entry declaring the project demo-ready.

If this final loop finds a problem, fix it and repeat, governed by the same loop limits above, drawing from the Debug Reserve.

## Hackathon Template Compliance - STRICT, NON-NEGOTIABLE
These come directly from the official IBM Bob AI Innovation Hackathon Guide and override any convenience shortcut:

- The repository must stay Public at all times.
- It must be created from the official `bob-ai-hackathon-submission-template` using "Use this template" then "Create a new repository" - never "Fork", never a different template. (Already done for this repo.)
- Repository name must follow the pattern `bob-ai-hackathon-[team-name]`. (Already done: `bob-ai-hackathon-Team-ThirdEye`.)
- Do not delete or rename any existing template file or folder.
- `submission.yaml` - every field marked REQUIRED must be filled; no empty strings.
- The "Validate Submission" GitHub Action must be green before considering any phase, or the whole project, "done".
- `demo/` must contain a 3-5 minute demo video link (`demo-video-link.txt`) and at least 3 sequential screenshots in `demo/screenshots/` before submission.
- `presentation/` must contain a slide deck (.pdf or .pptx).
- The First-Round Submission form is open only on 15 September, 12:00 PM - 11:45 PM - submit via the IBM Bob AI Hackathon - CHARUSAT Submission Form. Do not wait until the last few minutes.
- Every team member needs a verified GitHub account and an IBM BoB account, and the whole team fills out the combined submission form.

## Budget Rules - 50 Bobcoins Total
- Each phase in PHASES.md has a target Bobcoin ceiling, inclusive of its first 2 debug-loop attempts. Treat it as a hard budget.
- Prefer one well-specified Agent-mode task over several exploratory Ask-mode back-and-forths.
- Use Plan mode once at the very start rather than re-planning per phase.
- Reserve Subagents and heavy research for genuinely ambiguous technical questions - not for things already decided in AGENTS.md.
- After each phase, check the remaining Bobcoin balance (Account/General settings) and log it in MEMORY.md.
- Do not regenerate work that already passed its phase's acceptance criteria "just to polish" - save polish for Phase 6.
