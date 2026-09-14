---
name: submission-checklist
description: Use before marking any phase (especially Phase 6) as complete — walks through the Hackathon Template Compliance list and verifies each item for GridSentry.
---

# Submission Checklist

Walk through each item below in order. Check the actual state of the repository before marking anything ✓.

## 1. Repository Structure

- [ ] Repository is PUBLIC on GitHub.
- [ ] Repository was created from `bob-ai-hackathon-submission-template` via "Use this template" → "Create a new repository" (not a fork).
- [ ] Repository name is `bob-ai-hackathon-Team-ThirdEye` (matches `bob-ai-hackathon-[team-name]` pattern).
- [ ] No template files deleted or renamed: `submission.yaml`, `README.md`, `docs/`, `demo/`, `presentation/`, `CONTRIBUTING.md`, `.gitignore`, `.github/workflows/validate.yml`.

## 2. submission.yaml

Read `submission.yaml` and verify:
- [ ] All REQUIRED fields are filled (no empty strings, no placeholder values like "TODO").
- [ ] `team-name` is correct.
- [ ] `project-name` is correct ("GridSentry").
- [ ] `problem-statement` is filled.
- [ ] `team-members` list is populated.
- [ ] `demo-video-link` is not empty.
- [ ] `live-demo-url` is filled (use GitHub Pages URL or similar if deployed).

## 3. GitHub Actions

- [ ] Run: check `.github/workflows/validate.yml` exists and hasn't been modified.
- [ ] The "Validate Submission" workflow should be green on the `main` branch.

## 4. docs/ Directory

- [ ] `docs/problem-statement.md` exists and has content.
- [ ] `docs/solution-overview.md` exists and has content.
- [ ] `docs/architecture.md` exists and has content.
- [ ] `docs/setup-guide.md` exists and has content. Verify the setup steps yourself with `npm install && npm run dev`.

## 5. demo/ Directory

- [ ] `demo/demo-video-link.txt` contains a valid URL (3-5 minute video).
- [ ] `demo/live-demo-url.txt` contains a valid URL.
- [ ] `demo/screenshots/` contains at least 3 sequential screenshots.

## 6. presentation/ Directory

- [ ] A slide deck exists: `.pdf` or `.pptx` format.
- [ ] Slides cover: problem, solution, architecture, demo highlights, team.

## 7. README.md

- [ ] Top-level `README.md` explains what GridSentry is.
- [ ] Includes `npm install && npm run dev` instructions.
- [ ] Mentions the team name and hackathon.

## 8. App Technical Requirements

- [ ] `npm install && npm run dev` works with zero manual setup.
- [ ] No paid API keys required.
- [ ] App is entirely client-side (no backend).
- [ ] All 10 Core Features (F1-F10) from AGENTS.md are present and working.

## 9. Final Validation Steps

Run these commands and confirm they all pass:
```
npm run build    # must complete with 0 type errors
npm run lint     # must complete with 0 errors
npm run test     # all Vitest tests must pass
```

## 10. Team Member Requirements

Note to human: verify that:
- [ ] All team members have verified GitHub accounts.
- [ ] All team members have IBM BoB accounts.
- [ ] Submission form is ready to fill on 15 September, 12:00 PM - 11:45 PM via the IBM Bob AI Hackathon - CHARUSAT Submission Form.

## Report

After checking all items, summarise:
- Items that PASS ✓
- Items that FAIL ✗ (with what needs to be fixed)
- Any items that need human action (e.g. filling submission form, verifying accounts)
