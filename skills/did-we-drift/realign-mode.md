# Basis recovery — what to do when there is nothing admissible to measure against

Read this when §3 resolves `Baseline: NONE` and the project has real history. Most projects that
reach this state are not negligent: their intent lives in chat, in the user's head, or in a
document an agent wrote on their behalf. The audit's job stops being "grade the work" and becomes
"help the user declare a finish line, then start measuring from there."

**This is the expanded form of §3a.7's scaffold proposal, never an alternative to it.** One
recovery path, not two. It adds no verdict token — the verdict stays `INCONCLUSIVE (NONE)` until
a basis is admissible.

**Attended only.** It needs the user's words. Unattended: record the PENDING marker (B6), keep
working under B1's limit, and stop rather than invent scope.

## The prime directive: ratification governs FORWARD

A sentence the user ratifies today did not govern the work that predates it. Grading old commits
against a new sentence turns observed work into retrospective scope — the exact thing §3a.1
forbids, laundered through a ratification ceremony and made harder to see.

So the recovery has **two ledgers, and they never merge**:

- **Forward — the basis.** From the ratification commit onward, ordinary AUDIT MODE applies.
- **Backward — reconciliation.** Everything before it is dispositioned, never graded:
  `RETAIN` (it serves the ratified sentence) · `PARK` (real, out of scope, keep the code) ·
  `REVERT` (remove it) · `UNKNOWN` (needs a decision later).

Record the boundary as `START-OF-GOVERNANCE: <sha> (<date>)`. The first stamp after ratification
carries `Since: <that sha>`. **Never report a trend or an unmapped ratio spanning the boundary** —
there was no basis on the far side of it, so the number would be fiction.

## B0. Default to the one-minute exit

The people who land here are, by definition, people who did not write a plan. Do not answer them
with an afternoon of process. Unless the user asks for the full pass (or the build is large and
multi-session — then see "Deep archaeology" below), the whole recovery is three things:

1. **Up to 3 candidate sentences**, oldest intent first, each with a dated citation and its
   "this would exclude: …" line. (Mechanism: §3a.6 — do not restate it.)
2. **The capability groups actually built**, one line each, tagged `SHIPPED | IN-FLIGHT |
   UNSANCTIONED` (§3a.7's vocabulary — **do not invent a second one**). Derive groups from
   top-level source directories or an existing stage list, never ad hoc.
3. **One question:** "Reply with one sentence, or a candidate number."

Nothing is written until the reply arrives.

## B1. Hold the line — with an observable test, not "in scope"

"Keep doing in-scope work" is undecidable here: the whole problem is that scope is unknown.
Replace it with something checkable without a basis:

> Work may continue **extending a capability group that already ships**. Starting a **new**
> capability group is the thing that pauses until ratification.

Log every continuation into B0's inventory so the user sees it at ratification time. Unattended
runs additionally need the bound directive's preauthorization to continue at all.

## B2. Inventory intent — bounded, and separated by authorship

Same discipline as §1: bounded commands, not a whole-repo read. Cap the timeline at ~12 dated
items; if more exist, keep the earliest and the most recent and say how many were elided.

Collect: dated lines in tracked docs · README/charter intent statements · issue or ticket text ·
commit messages that state intent (evidence of intent only, never a basis) · external
collaborator artifacts (design packages, contractor specs — admissible only under the same §3a.2
tests as anything else).

Run §3a.2's authorship classification on **every** candidate and group the output into two
visibly separate buckets: **user-authored** and **agent-authored (quarantined)**. That separation
is the deliverable of this step. A project whose entire quarantine bucket is full and whose
user-authored bucket is empty has just been told something true and important about itself.

## B3. Intent before artifacts — and the intent pass is code-blind

Present the candidate sentences **before** the built-work inventory, and derive them without
reading source. Showing a user everything that exists and then asking "so what are you building?"
derives scope from code with the user's fingerprints on it. Recognition beats recall — a user
months into a build cannot write a deliverable from a blank page, but reacts accurately to their
own old sentences.

In DEEP, this is a lane rule: the intent lane may not open source files, exactly mirroring the
work lane's ban on opening plan files (deep-mode.md).

After the user picks, show the inventory. Remedies for `UNSANCTIONED` groups at this moment are
**`PARK` or `DECIDE-LATER` only.** Widening the sentence to cover work already built is a
separate, later, explicitly labelled act — *"you are widening the deliverable ratified `<date>`
from X to Y because of work already built"* — never a checkbox offered alongside the inventory.
Offering "legitimize" here re-admits the anchor B3 exists to prevent.

## B4. Prove it grades BEFORE anything is written

Run two deterministic checks on the picked sentence, in this order, **before any durable write**:

1. **D1 exclusion test** — it must exclude one plausible, tempting piece of work.
2. **Work-map rating** — is there an enumerable set of sanctioned work (FULL), or only the
   sentence (PARTIAL)?

Failing (1) means the sentence is a banner: return to candidates. It is never written.
Passing (1) with PARTIAL is fine and honest: write it, and report
`INCONCLUSIVE (PARTIAL MAP)` with the unmapped groups listed as candidate stages for next time.

Writing first and testing after is the trap: `template.md` stamps `STATUS: RATIFIED` and marks
competitors `SUPERSEDED`, so a failed test leaves a bad authority installed and the alternatives
retired — strictly worse than where the user started.

## B5. Write once, and record the provenance honestly

Upgrade ONE existing document per `template.md` (§3a.7 — unchanged). Additionally record:

- the sentence **verbatim**, with the user's date;
- `START-OF-GOVERNANCE: <sha> (<date>)`;
- that it was ratified during a basis recovery over `<n>` prior commits;
- the backward ledger from the prime directive (retain / park / revert / unknown).

That annotation is the anti-laundering guard: the file must never imply the sentence governed
work that predates it. Saying so costs one line and keeps the record honest.

**Marking other documents `SUPERSEDED` is a content edit in someone else's file — it needs the
user's yes, per §5's table, and it is not covered by the yes that ratified the sentence.** Ask for
both, or ask once and list every file the yes covers.

## B6. If the user does not answer

Many will defer for weeks while building continues. Do not invent a state for this — hand it to
machinery that already exists: open a `DWD-realign-basis` record in DRIFT DECISIONS
(interrupt-mode.md §4). That gives PENDING-never-becomes-SNOOZED, cadence aging, and the existing
escalation (the same finding surviving two consecutive stamps stops the loop).

That record is **not a graded drift**, so the ledger's grade and correction fields carry the
literal token `n/a` — never a fabricated grade, never a correction ID for a manifest you did not
build. Use exactly this form:

```
DWD-realign-basis · first <date> · last <date> · count <n> · n/a · PENDING · correction n/a ·
<one line: what is missing and what was asked>
```

If there is no durable host for that record, §5's no-host rule applies: carry it in the report and
as the scaffold proposal's first line. **Never manufacture a file to hold bookkeeping — and never
repurpose an unrelated file as a substitute host.** A file that makes no authority claim and was
never meant to carry project state (a bare README, a licence) is not a free host: writing an audit
trail into it is still creating structure the user did not agree to. A tracked doc the project
already uses to record state (an evidence ledger, a changelog) is a legitimate host; say which you
chose and why.

Verdict while unanswered stays `INCONCLUSIVE (NONE)` — opening a recovery does not improve the
baseline axis. Re-offer the ask on a cadence, not every audit; a standing ask must never become a
recurring menu.

## Repeat passes

A later recovery is **not** automatically a failed first one — projects legitimately re-scope, and
an explicit dated supersession is the ordinary §3a.3 path. Stamp each pass `realign:<date>`. A
second pass that again resolves to `Baseline: NONE` *is* the failed-ratification case: say so
plainly, with both dates.

## Deep archaeology (escalation, not default)

For large multi-session builds where B0's three candidates are genuinely insufficient, expand B2:
walk the intent timeline in full, and — **only if the user names a specific file and is present** —
a local conversation record may be read as a memory aid.

Transcripts are **`RECOLLECTION`: below issues/READMEs on the ladder, and never admissible as a
basis.** Never glob a conversation directory. Never quote transcript content into any report,
stamp, file, or proposal — surface a count and a paraphrase and ask the user to restate it. Three
reasons, each independently sufficient: they hold credentials, unrelated work, and other people's
data; they are local, rotatable, and invisible to a fresh clone, so they can never satisfy
"immutably citable"; and they are the one store where an old prompt-injection payload sits
verbatim, waiting to be quoted back as the user's own declared intent. A recollection becomes a
basis only when the user writes it into a tracked file themselves — then cite that file.

## The cheapest prevention, worth telling the user

The moment you tell an autonomous run "keep working until it's done," you have delegated the
definition of done. Before starting one: write the finish line yourself, in one sentence, in a
tracked file — then let the agent write everything else. Thirty seconds of typing prevents this
entire procedure.
