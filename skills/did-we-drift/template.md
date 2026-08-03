# Scaffold template — upgrade the project's strongest existing plan doc with these sections

Adapt names/stages to the project. Keep it ONE file. It must be version-controlled.

```markdown
# <PLAN-NAME> — <project>

**STATUS:** PROPOSED | RATIFIED (user's word turns it RATIFIED; record the date)
**This file wins.** If any other document disagrees with this file, this file is authoritative.
All other plans carry a `STATUS: SUPERSEDED → see <this file>` banner.

## 1. THE DELIVERABLE
> One sentence, phrased as what a user/customer can do when this ships.

Exclusion check: this sentence deliberately excludes <one plausible, tempting piece of work>.
(If nothing is excluded, it is a banner, not a deliverable — rewrite it.)

## 2. BASELINE
Verified facts a fresh agent needs (SHAs, deployed versions, known live defects), dated.

## 3. STAGES
Per stage: **WHY** (which deliverable step it unblocks) · **DONE-WHEN** (a command or
observable) · **budget** (S/M/L) · `- [ ]` box · **EVIDENCE:** (filled by the same
commit-series that finishes the work — a tick without evidence is invalid).

## 4. PARKED
Work that must not start without a new dated user line here.

## 5. DRIFT — definition, detection, recovery
Drift = (a) work serving no open stage; (b) starting PARKED items; (c) new process/evidence
machinery beyond the agreed toolchain; (d) a stage past 2× budget without a stop-report;
(e) state recorded outside this file. Audit protocol: run the did-we-drift skill at the end of
every stage and at session start; verdict vocabulary ON TRACK / DRIFTED (MINOR|MATERIAL|CAPTURED)
/ INCONCLUSIVE / BLOCKED, reported alongside a baseline status of RATIFIED | PROVISIONAL | NONE;
recovery = smallest edit (revert | park | legitimize with task + why), never a new document.

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
- <date> · <HEAD sha> · <work-verdict[+grade]> · unmapped <n>/<m> · next check: <gate>[ · run:<run-id>] · baseline:<RATIFIED|PROVISIONAL|NONE> · basis:<path#L<a>-L<b>@fingerprint|-> · age:<gates>/<since-date|-> · dwd:v3
```
