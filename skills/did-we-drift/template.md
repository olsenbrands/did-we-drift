# Scaffold template — upgrade the project's strongest existing plan doc with these sections

Adapt names/stages to the project. Keep it ONE file. It must be version-controlled.

```markdown
# <PLAN-NAME> — <project>

**STATUS:** PROPOSED | RATIFIED (user's word turns it RATIFIED; record the date)
**This file wins.** If any other document disagrees with this file, this file is authoritative.
All other plans carry a `STATUS: SUPERSEDED → see <this file>` banner.

## 1. THE DELIVERABLE
> One sentence, phrased as what a user/customer can do when this ships.

Written by <the user>, <date>. (If an agent drafted this sentence, it is not ratified until the
user restates or explicitly adopts it in a dated line of their own — see SKILL.md §3a.2.)

Exclusion check: this sentence deliberately excludes <one plausible, tempting piece of work>.
(If nothing is excluded, it is a banner, not a deliverable — rewrite it.)

<Only if this was ratified mid-flight, during a basis recovery:>
START-OF-GOVERNANCE: <sha> (<date>) — ratified during a basis-recovery pass over <n> prior
commits. This sentence governs work from this point forward; earlier work is dispositioned in
§2a, never retroactively graded against it.

## 2. BASELINE
Verified facts a fresh agent needs (SHAs, deployed versions, known live defects), dated.

## 2a. PRE-GOVERNANCE RECONCILIATION (only if §1 carries a START-OF-GOVERNANCE line)
Work that predates ratification, dispositioned — never graded. One line each:
- <capability group> · <commits> · RETAIN | PARK | REVERT | UNKNOWN · <one-line why>

## 3. STAGES
Per stage: **WHY** (which deliverable step it unblocks) · **IN PLAIN WORDS** (see below) ·
**DONE-WHEN** (a command or observable) · **budget** (S/M/L) · `- [ ]` box · **EVIDENCE:**
(filled by the same commit-series that finishes the work — a tick without evidence is invalid).

**IN PLAIN WORDS** — two sentences, no jargon, no acronyms, no stage numbers: what this step
gives a person, and what was broken or missing before it. Written once, here, so every future
report and dashboard quotes the same words instead of re-inventing them. If it can't be said
without jargon, the stage is not yet understood.

**Completion record** — five slots per stage, empty until the work finishes, then filled by the
same commit-series that ticks the box. Empty ones read as `not recorded`; never estimate them.
A tick with none of these filled is the same record defect as a tick with no evidence.
```
STARTED: <date time>   FINISHED: <date time>   REVIEWS: <n> rounds
BUGS: <n> found, <n> fixed   SKIPPED: <what and why | none>
```
`SKIPPED` is not optional politeness: a stage that shipped with something dropped must say so on
the row that claims to be done.

## 4. PARKED
Work that must not start without a new dated user line here.

## 5. DRIFT — definition, detection, recovery
Drift = (a) work serving no open stage; (b) starting PARKED items; (c) new process/evidence
machinery beyond the agreed toolchain; (d) a stage past 2× budget without a stop-report;
(e) state recorded outside this file. Audit protocol: run the did-we-drift skill at the end of
every stage and at session start; verdict vocabulary ON TRACK / DRIFTED (MINOR|MATERIAL|CAPTURED)
/ INCONCLUSIVE / BLOCKED, reported alongside a baseline status of RATIFIED | PROVISIONAL | NONE;
recovery = smallest edit (revert | park | legitimize with task + why), never a new document.
Plain-language view: `docs/drift-dashboard.html` is refreshed by each audit. It is a picture of
this file, never an authority — if the two disagree, this file is right and the picture is fixed.

## 6. OPERATING RULES
One writer at a time · review rounds capped (state the cap) · CI (or the project's test gate)
is the only evidence machinery · budgets are tripwires (>2× = stop and report) · user's lane
listed explicitly (money, releases, scope, live systems) · same-commit bookkeeping.

## 7. WAITING ON USER (dated; surface at every session start)
- <date> · <decision needed>

## 8. CHANGE RULES
The active session edits ticks/evidence/dates. Scope changes (new stages, unparking, changing
the deliverable) require a dated user line or the user's message quoted in the commit.

## 9. DRIFT DECISIONS
Drift findings awaiting or holding a user decision; RUN BINDING lines live here too.
- DWD-<kind>-<target> · first <date> · last <date> · count <n> · <grade> ·
  PENDING|SNOOZED|RESOLVED|SUPERSEDED · correction C-<n> · <one-line finding>
- RUN BINDING: run <id> → <SSOT path> (<date>)

## 10. AUDIT LOG
One appended line per audit, exact grammar (a line without a `dwd:` token predates this grammar;
read its `NO BASELINE` as LEGACY-INSUFFICIENT — some D was missing — never as "no intent existed",
and never rewrite it):
- <date> · <HEAD sha> · <work-verdict[+grade]> · unmapped <n>/<m> · next check: <gate>[ · run:<run-id>] · baseline:<RATIFIED|PROVISIONAL|NONE> · basis:<path#L<a>-L<b>@fingerprint|-> · basis-auth:<user-dated|user-ratified-post-hoc(<n> commits)|unknown|agent-drafted> · age:<gates>/<since-date|-> [· realign:<date>] · dwd:v3
```
