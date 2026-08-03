---
name: did-we-drift
description: Use when ending a build gate, phase, or wave; resuming a multi-session project; before ratifying/accepting a plan; or when a build feels over-engineered or off-course from the user's deliverable. Also use when planning docs are missing, contradictory, duplicated, stale, or live only in gitignored/local files.
---

# Did We Drift

## Overview

Drift is measurable only against a written deliverable through ONE root authority. This skill
audits both layers: the durable tracking surface (does it exist? is it sufficient?) and the
recent work (does it map to that surface?). When the surface is missing, the audit's product is
an evidence-derived scaffold proposal for the user — never a vibes assessment. **The skill never
authors or edits the deliverable sentence, in any mode — it only proposes cited candidates the
user picks from.**

## 0. Preflight

- **Disclose the auditor** (goes in the report): `same session that produced the work` |
  `fresh session` | `cross-model`.
- **Pick the mode.** QUICK (this file, single agent, default) — unless ANY of these holds, in
  which case escalate to DEEP and follow `deep-mode.md` in this skill's directory:
  (i) this session authored work under audit; (ii) no prior audit stamp exists; (iii) the last
  audit's substantive-unmapped ratio exceeded ~25%; (iv) the deliverable sentence changed since
  the last stamp; (v) a previous verdict on this window is contested or ambiguous; (vi) the
  user asked for DEEP. A lone minor unmapped commit is never a trigger. Triggers (ii) and
  (iii) apply to AUDIT MODE only — when discovery is clearly heading to SCAFFOLD MODE, stay
  single-agent: the intent/work inventory is scaffold's fan-out.
- DEEP announces its crew, its reason, and its cost before dispatch.

## 1. Discover the tracking surface

Bounded commands — do NOT read the whole repo:
- Tracked candidates: `git ls-files | grep -iE '(^|/)(PLAN|ROADMAP|TRACKER|BACKLOG|TODO|MILESTONE|LAUNCH|SPEC|ADR)[^/]*\.md$'`
  plus `docs/`, `.planning/`, `decisions/`, and roadmap/status sections of CLAUDE.md /
  AGENTS.md / README.
- Hidden candidates: the same names among untracked/ignored files (`git status --short
  --ignored -- <candidate dirs>`; confirm with `git check-ignore -v`). A gitignored or
  local-only plan is NOT durable — a future agent cloning the repo never sees it. Say so.
- No git? Fall back to filesystem discovery with file dates as the activity signal, and say
  the audit is date-based, not commit-based.
- Multi-repo program? Expect ONE root SSOT holding an authority map that names each repo's
  subordinate register. Out-of-repo authority (issue tracker, Linear)? D2 is satisfied by a
  tracked pointer file naming it with a snapshot date.
- Record every authority CLAIM ("this file wins", "authoritative", "source of truth") and
  every POINTER ("X wins"), with last-touched dates.

## 2. Score sufficiency — all six required

| # | Requirement | Mechanical check |
|---|---|---|
| D1 | Deliverable: one sentence, a user outcome, **falsifiable** | quote it; then name one plausible, tempting piece of work it EXCLUDES — if nothing is excluded it is a banner, not a deliverable: D1 fails with that printed |
| D2 | Exactly ONE **root** authority, durable (tracked, or tracked pointer to out-of-repo) | authority-CLAIM count == 1; pointers that agree with the root are healthy; a disagreeing pointer or second claim fails; subordinate registers pass iff the root names them |
| D3 | Tasks carry observable DONE-WHENs and **valid** evidence filled by the completing change | slots exist; ticked boxes cite evidence that could actually be checked (non-code projects may use signed-off manual/operational/external evidence with provenance) |
| D4 | Written drift definition | the SSOT defines drift |
| D5 | Audit cadence + fixed verdict vocabulary + what each audit must surface (incl. the dated waiting-on-user list, aged per the SSOT's own cadence or 3 *working* days) | the SSOT says when to audit, how, and what to surface |
| D6 | Dated BASELINE of verified facts | the SSOT states what verifiably exists/works as of a date — without it "not built" and "built but broken" are indistinguishable |

**3a. Any D missing → SCAFFOLD MODE (verdict: NO BASELINE).**
**3b. All six present → AUDIT MODE.**

## 3a. SCAFFOLD MODE — verdict NO BASELINE

Report exactly which D-numbers fail and what each absence costs, plus any observable drift
signals. Then build the proposal — pre-filled from evidence, never silently created, never an
empty template:
1. **Inventory declared-intent sources SEPARATELY from observed work.** Provenance ladder,
   strongest first: ratified user direction > plans > issues/READMEs > implementation
   evidence. Weight toward the EARLIEST intent.
2. **Deliverable candidates:** present ≤3 sentences, each with dated citations from
   declared-intent sources and an explicit "this would exclude: …" line. **The user picks or
   writes one.** Implementation evidence may support a candidate, never generate one.
3. **Facts are derivable:** BASELINE auto-fills (HEAD sha, versions, what runs/fails); the
   stage list derives from activity, each stage tagged `SHIPPED | IN-FLIGHT | UNSANCTIONED` —
   UNSANCTIONED = real work no candidate deliverable covers, surfaced as a question, never
   absorbed as scope. List conflicts between sources explicitly.
4. Propose upgrading ONE existing document (the strongest candidate; never add a competing
   authority) per `template.md`. Build only on the user's yes.

## 3b. AUDIT MODE

- **Resolve the window:** last `AUDIT LOG` stamp → else last evidence commit → else repo
  start (report `Since: first audit`).
- **Classify every commit in the window:** MAINTENANCE (merges, reverts, lockfiles,
  formatting, CI config, docs-only) · BOOKKEEPING (SSOT ticks, evidence, stamps) ·
  SUBSTANTIVE · UNASSESSABLE. Map SUBSTANTIVE commits to open tasks; **only unmapped
  SUBSTANTIVE work is drift.** Maintenance/bookkeeping are counts, not findings.
- **Deliverable-history check:** `git log -p --follow -- <ssot>`, diff the deliverable
  sentence over time. A change without a dated user line = DRIFTED (CAPTURED), whatever else
  is true.
- **Evidence sampling, risk-weighted and adversarial:** the highest-impact completed task +
  the most recently ticked + one PARKED/negative-scope area. RUN what is runnable; what is
  only inspectable is reported `EVIDENCE: UNVERIFIABLE`, never passed.
- Budgets and PARKED are checked iff the SSOT defines them. Compute unmapped ratio `n/m`
  (substantive-unmapped / substantive) and its delta vs the previous stamp.

## 4. Report — exactly this shape, verdict first

```
VERDICT: ON TRACK | DRIFTED (MINOR|MATERIAL|CAPTURED) | BLOCKED | NO BASELINE
Auditor: same session that produced the work | fresh session | cross-model
Since: <sha | "first audit">   Scope: <repos/roots inspected; exclusions>
Deliverable: "<quoted from the root authority (or MISSING)>"
Findings: <numbered; each carries a file:line, commit hash, or command output>
Trend: unmapped <n>/<m> (prev <n>/<m>)
Corrections (smallest first): revert it | park it | legitimize it (task + why in the SSOT)
Missing structure: <D-numbers + scaffold proposal, or "none">
Next check due: end of <the next named gate/phase/wave>
```

Grades: **MINOR** = bookkeeping/record integrity only (unevidenced tick, stale date, missing
stamp) — correction is an edit. **MATERIAL** = substantive work outside open stages or a
PARKED item started; deliverable intact — revert/park/legitimize. **CAPTURED** = the
deliverable sentence or stage set moved without a dated user line, or >2× budget with no
stop-report — the user is required before further work. BLOCKED = every open task waits on
the user (partial blockers are findings, not BLOCKED). **No-change suppression:** same verdict
and unchanged SSOT + evidence since the last stamp → one line + stamp, not a full report.

## 5. The audit stamp (mandatory)

Append ONE line to the SSOT's `## AUDIT LOG` (create the section if absent — this and the
stamp are the only writes the skill may make without the user's yes):

```
<date> · <HEAD sha> · <verdict[+grade]> · unmapped <n>/<m> · next check: <gate>
```

## Rules

- Correct drift with the smallest edit to the SSOT — never by writing a new plan document.
- The skill never authors or edits the deliverable sentence. Candidates only; the user picks.
- "Repo too big to read" is not a blocker: the audit is the bounded commands above.
- A verdict in prose is not a verdict. One vocabulary token, first line, every time.
- Never grade DRIFTED on bookkeeping alone — that is MINOR, stated as such.
- Never run DEEP twice on the same window; never repeat an unchanged report in full.
- Independence honesty: if synthesis or verification ran on the same model family, print
  "(same model, independent context)" rather than implying independence not obtained.

## Common mistakes

- Treating a gitignored or local-only tracker as durable state.
- Counting agreeing POINTERS as competing authorities (only claims and disagreements fail D2).
- Calling maintenance/bookkeeping commits drift — classify first.
- Passing evidence you only read: run it or mark `EVIDENCE: UNVERIFIABLE`.
- Deriving the deliverable sentence from code — that enshrines drift as the plan.
- Scaffolding a new document when an existing one can be upgraded.
- Ending without the stamp and "Next check due" — an audit that doesn't re-arm dies with
  the session.
