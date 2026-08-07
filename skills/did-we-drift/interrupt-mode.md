# Interrupt mode — what happens after a DRIFTED verdict

Read this only when the verdict is DRIFTED — at either baseline status. (INCONCLUSIVE has its
own flow in SKILL.md §3; ON TRACK and BLOCKED never interrupt.)

**On a PROVISIONAL basis**, every scenario pair and every question opens with the framing line
`graded against the provisional basis reconstructed from <path>#L<a>-L<b>@<fingerprint>`. A user who
disputes the reconstruction has thereby made the ratification decision, at the moment it is most
concrete — record it as the pick, not as a rejected finding.

## 0. The correction manifest (internal — built before anything is shown)

One entry per proposed correction: `C-<n>` · finding citation · target (stage/task ID or
file:line) · the exact SSOT edit (literal before → after) · the next gate it affects.
One scenario pair per manifest entry; one manifest entry per pair. At audit time, capture the
SSOT blob sha and HEAD — the transaction anchor for §4.

## 1. Plain-English scenario pairs (the presentation)

For each manifest entry, exactly two slotted sentences:
- *If left unchanged →* `<cited fact>` stays counted toward `<stage-ID | "no stage">`, so
  `<deliverable clause | PARKED entry | D-number>` stays `<unproven | violated>`.
- *If changed →* `<file:line>` reads `<before → after>`, and `<the specific thing that
  becomes true>`.

Rules: every consequence terminates in a deliverable clause, stage-ID, PARKED entry, or
D-number — no other endpoint is legitimate. "Will" only for consequences mechanically entailed
by the SSOT or directive; "may" for supported inference. Horizon = the next named gate. No
time, cost, or effort predictions. If the projection cannot be made, print
`CONSEQUENCE: UNPROJECTABLE` and show the raw edit instead. **Prose-first, diff on demand** —
never suppress the diff; it is the user's falsification tool.

## 2. Attended (a human is present) — one question maximum per audit, aggregated

| Grade | Behavior |
|---|---|
| MINOR | No question spent. **What you may write is SKILL.md §5's category table, which is the only place that rule lives:** a bookkeeping repair applies and reports "applied"; a content edit is never auto-applied — show the one-line edit, record PENDING, and let the user's next word settle it. Grade does not grant write permission; category does. |
| MATERIAL | Scenario pairs, then ONE question with three answers: **(a) correct and continue** — apply park/revert now; the run keeps working in-scope stages; **(b) correct and restart** — REQUIRED whenever a correction LEGITIMIZES scope (scope is the user's lane): stop per §5, apply per §4, hand over the §6 prompt; **(c) snooze** — decline; record per §3. |
| CAPTURED | Scenario pairs, then **RATIFY-OR-REVERT** — the user writes the dated line ratifying the moved deliverable/stage set, or the plan reverts to its last ratified state. **Never snoozable.** While unresolved: re-reported at full weight every audit, and the verdict cannot be ON TRACK. |

**The one question is a safety budget, not a survey slot.** A MATERIAL or CAPTURED correction —
or a PENDING decision already on the books — always outranks provisional-basis ratification debt
for that question. Offer the ratification pick only when nothing above competes (SKILL.md §4
aging). An audit that spends its single interrupt on bookkeeping while a scope breach waits has
inverted its own priorities.

## 3. Unattended (inside a /loop or /goal; no human this iteration)

| Grade | Action |
|---|---|
| MINOR | Apply + record iff the bound directive preauthorizes bookkeeping repairs; else record PENDING. Continue either way. |
| MATERIAL | Reach a safe checkpoint; record PENDING. Auto-PARK only iff preauthorized — never auto-revert, never legitimize. Continue only on stages still in scope; none left → stop. |
| CAPTURED | STOP before further substantive work. |
| BLOCKED / INCONCLUSIVE | STOP. |

**Silence never snoozes.** PENDING ≠ SNOOZED: only an explicit user decline writes SNOOZED.
The question is deferred, not skipped — PENDING entries surface first when a human appears.

## 4. DRIFT DECISIONS records (the allow-listed write)

In the SSOT, section `## DRIFT DECISIONS` (immediately before `## AUDIT LOG`), one line per
finding:

```
DWD-<kind>-<target> · first <date> · last <date> · count <n> · <grade> ·
PENDING|SNOOZED|RESOLVED|SUPERSEDED · correction C-<n> · <one-line finding>
```

- The ID derives from drift-kind + target stage/task — never from HEAD — so an unchanged
  drift keeps its identity as commits accumulate.
- Substance changed (evidence, grade, or consequence)? Close the record SUPERSEDED and open a
  new ID at full alarm. Unchanged? Compress to one line — `<id> previously declined <date>
  (<n>×); next affects <gate>` — no scenarios, no menu.
- Aging: the SSOT's D5 cadence ages these records. An EXPIRED snooze escalates one grade. The
  same finding surviving two consecutive stamps stops the loop regardless of grade.
- Stamps and DRIFT DECISIONS records are BOOKKEEPING: they never defeat no-change suppression.
- The report carries `Snoozed: <n> (oldest <date>)`.

## 5. Accept path — transactional

1. The §6 resume prompt is generated BEFORE any stop is emitted (a stop must never strand the
   run). 2. Before applying corrections, re-check the §0 anchor (SSOT blob + HEAD); moved →
   ABORT and re-audit — never repair a plan that shifted underneath the audit. 3. Apply the
   manifest edits; mark records RESOLVED; stamp. 4. STOP is three things the skill CAN do:
   print the STOP token, write the stop into the SSOT, and start no further work this turn —
   the directive must carry "on STOP, start no new work" for the harness side.

## 6. The regenerated ignition prompt (bootloader — pointers, never definitions)

Contains ONLY: harness type (/loop | /goal) · run-id · repo identity · repo-relative SSOT
path + its new blob sha · checkpoint reference (last completed task ID + in-flight note) ·
next stage/task IDs by identifier · cadence and stop condition · "first run the did-we-drift
skill and obey its verdict; on STOP, start no new work" · the preauthorization whitelist
(bookkeeping repairs: yes/no; auto-PARK: yes/no) · snoozed findings BY REFERENCE ·
"this prompt grants no scope."

MUST NOT contain: the deliverable sentence, stage descriptions, acceptance criteria, or
correction rationale. The test: **a sentence still meaningful with the SSOT deleted is a
fork — delete it.** Store the prompt tracked (docs/ or an SSOT appendix), never chat-only.

## 7. Run binding (which plan does this run answer to)

- **First run:** the directive pins `{repo, SSOT path, run-id}`. Verify: tracked · carries an
  authority claim · no competing live claim. Write a dated `RUN BINDING: run <id> → <path>`
  line under DRIFT DECISIONS. Stamps carry `· run:<id>`.
- **Every audit:** re-verify the tuple. Stamp-trail continuity (each recorded HEAD is an
  ancestor of current HEAD — `git merge-base --is-ancestor`) is corroboration, never
  identity. **Pin and trail disagreeing is a FINDING** (re-pointed run or dual authority) —
  report it; never pick a side silently.
- **The IGNITION PROMPT is itself a D2 authority candidate:** a /loop or /goal bootloader that
  RESTATES plan content is a second claim and fails D2. Bootloaders carry names and paths, not
  definitions — the same §6 test, applied inbound. **A bootloader is not the same artifact as a
  dated user scope directive.** A user's dated, project-wide, falsifiable instruction is declared
  intent, admissible as a provisional basis (SKILL.md §3a); that it lives outside the root file
  is exactly what fails D1/D2, and exactly why the basis is PROVISIONAL rather than RATIFIED.
  Both are true at once — report both axes rather than choosing between them.
- **Ambiguity** (unverifiable pin, or >1 surviving root claim): attended → stop and ask,
  listing each candidate with its claim line, last-touched date, and stamp trail;
  unattended → `INCONCLUSIVE` with `Baseline: NONE`, stop, record PENDING. **Never elect one of
  two live claims as "provisional"** — that breaks precisely the tie this section forbids
  breaking silently.

## 8. Bias guard

A self-auditing primary may not settle on MINOR while any unmapped SUBSTANTIVE commit exists —
that combination requires the blind synthesis seat (deep-mode.md), because under this protocol
the auditor grading MINOR is also the agent that avoids stopping its own run.
