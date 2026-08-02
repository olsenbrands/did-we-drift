---
name: did-we-drift
description: Use when ending a build gate, phase, or wave; resuming a multi-session project; before ratifying/accepting a plan; or when a build feels over-engineered or off-course from the user's deliverable. Also use when planning docs are missing, contradictory, duplicated, stale, or live only in gitignored/local files.
---

# Did We Drift

## Overview

Drift is measurable only against a written deliverable through ONE version-controlled plan.
This skill audits both layers: the durable tracking surface (does it exist? is it sufficient?)
and the recent work (does it map to that surface?). When the surface is missing, the audit's
product is a scaffold proposal to the user — never a vibes assessment.

## Procedure

**1. Discover the tracking surface** (bounded commands — do NOT read the whole repo):
- Tracked candidates: `git ls-files | grep -iE '(^|/)(PLAN|ROADMAP|TRACKER|BACKLOG|TODO|MILESTONE|LAUNCH)[^/]*\.md$'` plus `docs/`, `.planning/`, and roadmap/status sections of CLAUDE.md / AGENTS.md / README.
- Hidden candidates: the same names among untracked/ignored files (`git status --short --ignored -- <candidate dirs>`; confirm with `git check-ignore -v <file>`). A gitignored or local-only plan is NOT durable — a future agent cloning the repo never sees it. Say so.
- Record every doc claiming authority ("authoritative", "source of truth", "this file wins", "START HERE") and its last-touched date vs. recent commit activity.

**2. Score sufficiency — all six required:**

| # | Requirement | Mechanical check |
|---|---|---|
| D1 | Deliverable: one sentence, phrased as a user outcome | quote it verbatim in the report |
| D2 | Exactly ONE authoritative doc, version-controlled, with a "this file wins" rule | authority-claim count == 1 AND `git ls-files` lists it |
| D3 | Tasks/stages carry an observable DONE-WHEN and an EVIDENCE slot filled by the change that completes them | slots exist; ticked boxes have evidence |
| D4 | Written drift definition (unmapped work, parked items started, budget overrun, truth forks) | the SSOT defines drift |
| D5 | Check cadence: audit runs at the end of every gate/phase/wave, with a fixed verdict vocabulary | the SSOT says when to audit and how |
| D6 | Dated WAITING-ON-USER list | section exists, items dated |

**3a. Any D missing → SCAFFOLD MODE.** Report exactly which D-numbers are missing and what
each absence costs. Then propose — do not silently create — an upgrade of ONE existing document
(the strongest candidate; never add a second authority; a new file only if nothing upgradeable
exists) using `template.md` in this skill's directory. Name the file and the sections you would
add. Build it only on the user's yes.

**3b. All six present → AUDIT MODE:**
- `git log --oneline <last-audit-or-last-evidence-commit>..HEAD` — map every commit to an open
  task in the SSOT. Unmappable commits are drift; name them.
- Spot-check one ticked task: run/inspect its DONE-WHEN. A tick without passing evidence is drift.
- Check: parked/out-of-scope items untouched; budgets not exceeded (>2× = report); WAITING-ON-USER
  items older than 3 days surfaced.

**4. Report — exactly this shape, verdict first:**

```
VERDICT: ON TRACK | DRIFTED | BLOCKED
Deliverable: "<the sentence, quoted from the SSOT (or MISSING)>"
Findings: <numbered; each carries a file:line, commit hash, or command output>
Corrections (smallest first): revert it | park it | legitimize it (add task + why to the SSOT)
Missing structure: <D-numbers with scaffold proposal, or "none">
Next check due: end of <the next named gate/phase/wave>
```

BLOCKED means every open task waits on the user — then the findings section is just the dated
blocked list, nothing else.

## Rules

- Correct drift with the smallest edit to the SSOT — never by writing a new plan document.
- "Repo too big to read" is not a blocker: the audit is the bounded commands above, not full reading.
- A verdict in prose is not a verdict. One of the three words, first line, every time.
- Every course-correction suggestion must reference the deliverable sentence, not taste.
- The audit changes nothing without the user's yes except the SSOT's own audit stamp.

## Common mistakes

- Treating a gitignored or local-only tracker as durable state — future agents never inherit it.
- Accepting two "authoritative" docs because both look maintained; count == 1 or D2 fails.
- Trusting status with no evidence ("basically done", ticked-from-memory boxes).
- Scaffolding a new document when an existing one can be upgraded — doc multiplication IS drift.
- Ending the report without "Next check due" — an audit that doesn't re-arm dies with the session.
