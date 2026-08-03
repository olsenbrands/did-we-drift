# DEEP mode — contamination-scaled fan-out

Read this only when a Preflight trigger fired. DEEP exists for one reason: the dominant audit
error is confirmation, not reading capacity — an agent that reads the plan first will
charitably map commits onto tasks. The only accuracy-generating property is **plan-blindness
of the work lane**; everything else is cost. Cap: **3 seats.** Announce crew, reason, and cost
before dispatch. Never run DEEP twice on the same window. DEEP's cost must be justified by the
decision it informs.

## Crew scales with contamination

**Case 1 — the primary is a fresh session (did not author the work): ONE worker.**
- Work-lane worker: reads ONLY `git log`, diffs, tests, code. **Forbidden from opening any
  file matching the discovery patterns in SKILL.md §1.** Output: "the last N commits, grouped
  into what was actually being built, in its own words" — observations with hashes, no
  verdict.
- The primary holds plan-lane (SSOT/trackers/decision records → cited claims of what should
  be happening), the D1–D6 scoring, and **basis resolution (SKILL.md §3/§3a — admissibility,
  precedence, pointer pin, work map)** — all mechanical, no bias risk, never a separate seat —
  then diffs the two accounts and writes the report.

**Case 2 — the primary authored work under audit (self-audit): the primary holds NO lane.**
- Two lane workers: plan-lane (reads only SSOT/trackers/decision records) and work-lane
  (as above, plan-blind).
- One **blind synthesis seat**: receives the two lane reports VERBATIM plus **the resolved basis
  — its quoted scope with citation, its status (RATIFIED | PROVISIONAL), and the work map with
  its FULL/PARTIAL rating** — never the primary's hypothesis, draft mapping, correction ideas,
  or the lane identities. Giving it the scope sentence without the status or the map rating is a
  protocol error: it cannot apply "ON TRACK requires FULL" (SKILL.md §3b) or attach the
  `(PROVISIONAL)` parenthetical it never knew it needed. It may open a cited source only to
  resolve a stated conflict between the lanes. Output: work verdict + grade + smallest
  correction, with the baseline axis carried through.
- **Cross-model when available** (the bias being corrected is the primary's own generative
  prior; fresh context on the same family only partly breaks it). The report's `Auditor:`
  line states which was obtained.
- The primary may overrule the synthesis seat but must print that it did, and why.

## Lane report shape (both lanes)

```
LANE: plan | work
Window: <sha..sha | dates>
Account: <numbered claims/observations, each with file:line or commit hash>
Unresolved: <things this lane could not determine from its read scope>
```

The verdict still comes out in SKILL.md §4's report shape — **both axes**, stamped per §5 with
its `baseline:` / `basis:` / `dwd:v3` fields — with `Auditor: cross-model` or `(same model,
independent context)` stated honestly.

**DEEP never manufactures a basis.** If §3 resolves to `Baseline: NONE`, the answer is
`INCONCLUSIVE` and no crew is dispatched: fan-out buys independence from confirmation bias, not
a plan the project never declared. Spending three seats to grade work against nothing is the
expensive version of the vacuous ON TRACK.
