---
name: memory-checkpoint
description: Use after every completed task or phase — appends a structured entry to MEMORY.md with what changed, files touched, loop attempts, Bobcoins used, and next steps.
---

# Memory Checkpoint

Append a new entry to `MEMORY.md` immediately after completing any task. Never skip this step.

## Steps

1. Read the current `MEMORY.md` to find the last entry and current state.

2. Update the **Status** section to reflect current phase.

3. Update **Current Phase** and **Completed** / **In Progress** / **Next Up** sections.

4. Append a new dated entry to a **Session Log** section (create it if it doesn't exist yet) with this format:

```markdown
### [Phase N] - [Task Name] - [YYYY-MM-DD]

**What changed:**
- Brief description of files created/modified and what they do.

**Files touched:**
- `path/to/file.ts` — what it contains/does

**Test & Debug Loop:**
- Attempt 1: [pass/fail] — [what was tested, what happened]
- Attempt 2 (if needed): [pass/fail] — [fix applied]

**Bobcoins used this phase:** N (of budget M)
**Debug Reserve remaining:** N

**Next up:** [next task or phase]
```

5. Update the **Test & Debug Loop Log** table (in MEMORY.md's existing table) with a new row for every loop attempt:

| Phase | Attempt # | What was tested | Result | Fix applied | Coins used |

6. Update the **Bobcoin Usage Tracker** table: fill in the "Used" and "Remaining" columns for the current phase.

7. If any ambiguous decision was made, add it to **Decisions Log**.

8. If any issue was found but not yet fixed, add it to **Known Issues / Blockers**.

9. When Phase 6 is complete and all checks pass, update **Final Full-System Loop Status** checkboxes.

## Rules

- This tool call is MANDATORY after every phase and every test-debug loop attempt. Not optional.
- Be accurate about Bobcoin counts — if unsure, estimate conservatively (round up).
- Keep entries concise — 5-10 lines is enough. Avoid padding.
- Never delete previous entries from MEMORY.md.
