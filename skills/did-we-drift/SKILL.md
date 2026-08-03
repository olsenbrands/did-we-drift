---
name: did-we-drift
description: Use when ending a build gate, phase, or wave; resuming a multi-session project; before ratifying/accepting a plan; or when a build feels over-engineered or off-course from the user's deliverable. Also use when planning docs are missing, contradictory, duplicated, stale, or live only in gitignored/local files.
---

# Did We Drift

## Overview

Drift is measurable only against declared intent. This skill audits two things on two separate
axes: **the work** (does it map to what was declared?) and **the basis** (how solid is the thing
we measured against?). Report both. A project whose plan is real but scattered gets graded and
told its plan is scattered — it is never told it has no plan. **The skill never authors or edits
the deliverable sentence, in any mode, and never copies an unratified sentence into the user's
files — it cites, and proposes candidates the user picks from.**

## 0. Preflight

- **Disclose the auditor** (goes in the report): `same session that produced the work` |
  `fresh session` | `cross-model`.
- **Pick the mode.** QUICK (this file, single agent, default) — unless ANY of these holds, in
  which case escalate to DEEP and follow `deep-mode.md` in this skill's directory:
  (i) this session authored work under audit; (ii) the last audit's substantive-unmapped ratio
  exceeded ~25%; (iii) the basis changed since the last stamp; (iv) a previous verdict on this
  window is contested or ambiguous; (v) the user asked for DEEP.
  A lone minor unmapped commit is never a trigger.
  **A first audit is not itself a trigger.** DEEP buys exactly one thing — plan-blindness that
  corrects the *primary's own* generative prior (deep-mode.md) — so it earns its cost only when
  the primary is contaminated. A fresh session auditing a first window has no such prior: it gets
  scrutiny volume, which QUICK's bounded commands already deliver. Say `first audit, QUICK` in the
  report and move on. Absent a prior stamp, trigger (ii) is unevaluable and simply does not fire.
- **If a trigger fires but fan-out is impossible** (no Agent tool, or the invoking instructions
  forbid spawning): do NOT silently downgrade, and do not refuse to grade. Run QUICK's structure,
  print `DEEP INDICATED, NOT RUN: <trigger> — <why>` in the report, and treat every ledger/plan
  claim as unproven until you have run it yourself. Note the direction of the uncorrected bias:
  it pushes toward *under*-reporting drift, so a DRIFTED verdict survives the gap and an ON TRACK
  verdict is the one to distrust.
- DEEP announces its crew, its reason, and its cost before dispatch.
- **Inside a /loop or /goal, verify the RUN BINDING first** (interrupt-mode.md §7): the
  directive's pinned `{repo, SSOT path, run-id}` must verify, and a disagreement between the
  pin and the stamp trail is a finding — never a tie to break silently.

## 1. Discover the tracking surface

Bounded commands — do NOT read the whole repo:
- Tracked candidates — the keyword may sit **anywhere in the filename**, not just at its start
  (`BUILD-DIRECTIVE.md`, `v2-ROADMAP.md`, and `notes/PROJECT-PLAN.md` must all match):
  `git ls-files | grep -iE '(PLAN|ROADMAP|TRACKER|BACKLOG|TODO|MILESTONE|LAUNCH|SPEC|ADR|DIRECTIVE|SEQUENCE|CHARTER|BRIEF|GOAL)[^/]*\.md$'`
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

**These six score the tracking SURFACE. They do not decide whether the work can be graded.**
A D-failure means the surface is deficient; it does not mean intent is absent. Intent that the
root file never absorbed is exactly what a D-failure looks like — and it is still intent.

## 3. Resolve the BASIS, then branch

The basis is what you measure work against. Resolve it before grading, and report it on its
own axis:

- **All six D's pass** → `Baseline: RATIFIED`; basis = the root authority. Go to §3b.
- **Any D fails** → build a PROVISIONAL basis (§3a). If it is admissible, go to §3b and grade
  against it — reporting `Baseline: PROVISIONAL`.
- **No admissible basis** → `Baseline: NONE`, `VERDICT: INCONCLUSIVE`. Report the failed
  D-numbers, what each absence costs, any drift signals you can name without a basis, and the
  §3a scaffold proposal. **Never grade work against nothing.**
  **If the project also has real history (any substantive commit, or dated activity in a non-git
  project), read `realign-mode.md` in this skill's directory and follow it** — it is the expanded
  form of §3a.7's proposal, never a second path beside it. It adds no verdict token: a recovery
  in progress is still `INCONCLUSIVE (NONE)`. Its core rule: **a ratified sentence governs
  forward from its own date**, so prior work is *reconciled*, never retroactively graded.

## 3a. Build the PROVISIONAL basis

A basis has TWO parts. **Both are required to grade work at all:**
- **(i) SCOPE** — a falsifiable statement of the outcome being built.
- **(ii) WORK MAP** — an enumerable universe of sanctioned work (stage list, sanctioned
  sequence, ticketed plan, milestone set) that commits can be mapped ONTO. Without it,
  "unmapped 0/0" is vacuous, not clean.

**1. Inventory declared-intent sources SEPARATELY from observed work.** Provenance ladder,
strongest first: ratified user direction > plans > issues/READMEs > implementation evidence.
**Implementation evidence may corroborate a basis; it may never supply one** — "the code does X,
so X was the plan" legitimizes every drift ever committed.

**2. Admissibility — a source may supply SCOPE only if ALL of these hold:**
- **User-authored — and this bullet requires POSITIVE evidence, not merely the absence of
  doubt.** Classify every candidate scope source as exactly one value and print it:
  `USER-RATIFIED` (a dated line the user wrote, or text the user quoted and ratified in their own
  words) · `UNKNOWN` · `AGENT-DRAFTED`. **AGENT-DRAFTED is inadmissible for scope; UNKNOWN may
  support a PROVISIONAL basis but never a RATIFIED one.**
  Why the burden runs this way: the most common way a long build starts is a user asking an
  agent to write the directive that will govern it. That produces an impeccable document —
  dated, project-wide, falsifiable, citable, often saying "do not invent new scope" — that no
  human ever authored. **Agent-drafted text approved by silence is NEVER user direction.**

  **Evidence FOR user authorship** (any one, cited, is enough to reach USER-RATIFIED provided no
  strong tell below fires): the user's own first-person voice about their intent ("I want…",
  "…without a new dated line from me") · a dated attribution to a named person alongside a quoted
  statement · a dated line in which the user adopts or restates text in their own words.

  **Tells AGAINST — agent-drafted.** All mechanical, and each one describes something a *human*
  writing about their own project has no reason to write. **`git blame` is not a tell** — in
  agent-driven repos it names the human for text the agent typed, reporting the wrong answer with
  full confidence.

  | Tell | Check | Weight |
  |---|---|---|
  | The commit that introduced the scope sentence also touches source | `git log -S '<sentence>' --oneline`, then `git show --stat <sha>` | strong — whatever wrote the code wrote the sentence |
  | Self-maintenance clause: rewrite this file back into itself for the next session | read it | strong — the bootloader pattern (interrupt-mode.md §6) |
  | A work-continuation instruction addressed to an executor: "continue working until…", "keep going until…", "…that is done" | read it | strong |
  | The authority file was created after the bulk of the code | `git log --diff-filter=A` vs the first substantive commit | advisory — post-hoc rationalization |
  | Refers to the user in the third person ("ask Sam", "the user wants") | read it | **advisory only, never decisive** — users write instructions *to* their agents this way |

  **A stop condition is NOT a tell.** "Stop when X is live", "done when the flag ships" is a scope
  boundary — exactly what a good user directive contains. Only an instruction telling a *reader to
  keep working* counts. Nor is "the plan was committed alongside other planning files": writing
  your plan and committing it once is ordinary human behaviour, not evidence of anything.

  **Decision rule, and it is three-way — the middle value is not a failure:**

  | Classification | When | What it permits |
  |---|---|---|
  | `USER-RATIFIED` | evidence-for present, no strong tell | any basis, including RATIFIED |
  | `UNKNOWN` | no strong tell, but no evidence-for either | **a PROVISIONAL basis only** — print the status and carry the ratification ask |
  | `AGENT-DRAFTED` | any strong tell fires | nothing: inadmissible for scope → `Baseline: NONE` |

  `UNKNOWN` is the ordinary state of most real projects and it is **admissible for PROVISIONAL** —
  that is precisely what "provisional" means. Do not collapse it into NONE: doing so would refuse
  to grade every project whose planning is merely undocumented rather than agent-written, which is
  the failure this whole two-axis design exists to end. Only a positive strong tell disqualifies a
  source. None of the three values is drift, and none is an accusation — say which tells fired,
  cite them, and move on.

  **Retroactive case.** If a basis pinned by earlier audits is now classified AGENT-DRAFTED, it
  was never admissible: report `Baseline: NONE`, print
  `PRIOR STAMPS UNSOUND (audits <dates>)`, and **never rewrite the old stamps**. Do **not** grade
  this CAPTURED — CAPTURED means scope *moved*, and its ratify-or-revert remedy is meaningless
  when nothing was ever ratified.
- **Project-wide**: it states the outcome, not one slice of it. A gate/slice instruction
  ("close the Windows gate; hold Mac this pass") is an **OVERLAY** on whatever full-scope basis
  survives — never a replacement for it. Treating a slice as the whole is how an audit reports
  ON TRACK while half the deliverable is quietly abandoned.
- **Falsifiable**: it passes the same exclusion test as D1 — name one plausible, tempting piece
  of work it EXCLUDES. A banner ("make makers' lives easier") excludes nothing and is
  **inadmissible**, no matter how prominently it is published.
- **Immutably citable**: path + line range + a fingerprint over those lines (§3a.4).

**3. Precedence.** Latest-dated wins **only** among admissible project-wide user sources, and
only where supersession is explicit. Otherwise the broader surviving basis stands and the newer
instruction is recorded as an overlay. Within non-user sources, weight toward the EARLIEST
intent (that is where scope creep shows). A written deliverable that contradicts a later
admissible user source is a **finding** (retire it), not a candidate. Same-date conflicts,
unclear scope coverage, or >1 surviving root claim → unresolved dual authority → `Baseline: NONE`
(§3, and interrupt-mode.md §7). **Never break an authority tie silently to manufacture a basis.**

**4. Pin it — by POINTER, never by copying the sentence.** Record in the stamp (§5) only:
`basis:<path>#L<a>-L<b>@<quote-fingerprint>`, where the fingerprint is the first 7 hex of a hash
over **the quoted scope lines alone** (e.g. `sed -n '<a>,<b>p' <path> | shasum | cut -c1-7`). The
sentence itself stays in the source and is *quoted* in the report. This keeps the "never authors
the deliverable" rule absolute: nothing unratified is ever written into the user's plan. **No new
write permission is needed or granted.**

**Fingerprint the QUOTED LINES, never the whole file blob.** A file-blob pin breaks itself: the
mandatory stamp (§5) appended to that same file changes its blob, so the next audit reads "basis
moved" and raises a false CAPTURED alarm the skill manufactured with its own allow-listed write.
Subsequent audits grade against the pinned pointer; a changed **fingerprint** — the scope text
itself moving — is a reportable finding before anything else is graded. A changed file elsewhere
is not.

**Host the bookkeeping elsewhere when you can.** Prefer writing the stamp and DRIFT DECISIONS to
a durable tracked doc that is NOT the file holding the pinned basis. If the basis file is the only
candidate, the fingerprint rule above makes writing there safe — but say in the report which host
you chose and why, and never add authority language ("this file wins") to a host you picked for
bookkeeping convenience: that would manufacture a second D2 claim.

**5. Resolve the WORK MAP** from the same declared-intent sources (never from the commits you
are about to grade): `FULL` = an enumerable set of sanctioned tasks/stages covering the scope;
`PARTIAL` = scope exists but the sanctioned-work universe is incomplete or absent.

**6. The standing ask** (not the product of the audit — the verdict is): one line offering the
ratification pick. Present full candidates (≤3 sentences, each with dated citation and its
"this would exclude: …" line) **only** on the first provisional audit, and when ratification is
actually offered (§4 aging). Otherwise carry one compact reference line, so a standing ask never
becomes a recurring menu. Printing the candidates and *spending the interrupt question* are
separate acts: on a first audit you may print them while the single question still goes to a
competing MATERIAL or CAPTURED correction (interrupt-mode.md §2).

**7. Scaffold proposal** (whenever any D fails, at every basis status): propose upgrading ONE
existing document — the strongest candidate, never a competing authority — per `template.md`.
BASELINE facts auto-fill (HEAD sha, versions, what runs/fails). Stages derived from activity are
tagged `SHIPPED | IN-FLIGHT | UNSANCTIONED`; UNSANCTIONED = real work no candidate scope covers,
surfaced as a question, never absorbed. List conflicts between sources explicitly. Build only on
the user's yes.

## 3b. AUDIT MODE — grade the work

Runs identically for a RATIFIED or PROVISIONAL basis.

- **Resolve the window**, first match wins: (1) the HEAD sha recorded in the last `AUDIT LOG`
  stamp; (2) **no stamp exists → repo start**, reported as `Since: first audit`. "The last
  evidence commit" is NOT a window anchor — on a first audit the most recent evidence row is
  usually written *at* HEAD, which would make the window empty and silently skip the entire
  history. When no stamp exists, audit everything and say so.
- **Classify every commit in the window:** MAINTENANCE (merges, reverts, lockfiles,
  formatting, CI config, docs-only) · BOOKKEEPING (SSOT ticks, evidence, stamps) ·
  SUBSTANTIVE · UNASSESSABLE. Map SUBSTANTIVE commits to the WORK MAP; **only unmapped
  SUBSTANTIVE work is drift.** Maintenance/bookkeeping are counts, not findings.
- **ON TRACK requires `Work map: FULL`.** With `PARTIAL`, absence of mapped drift proves
  nothing — the verdict is `INCONCLUSIVE`, unless you positively identified drift, in which
  case DRIFTED stands at its grade. You may always report drift you found; you may only certify
  its absence when your map covers the territory.
- **Basis-history check:** `git log -p --follow -- <basis path>`, diff the scope statement over
  time. A change without a dated user line = DRIFTED (CAPTURED), whatever else is true. For a
  pinned provisional basis, a changed blob sha gets the same treatment.
- **Evidence sampling, risk-weighted and adversarial:** the highest-impact completed task +
  the most recently ticked + one PARKED/negative-scope area. RUN what is runnable; what is
  only inspectable is reported `EVIDENCE: UNVERIFIABLE`, never passed.
- Budgets and PARKED are checked iff the basis defines them. Compute unmapped ratio `n/m`
  (substantive-unmapped / substantive) and its delta vs the previous stamp.

## 4. Report — exactly this shape, verdict first

```
VERDICT: ON TRACK | DRIFTED (MINOR|MATERIAL|CAPTURED) | INCONCLUSIVE | BLOCKED
Baseline: RATIFIED | PROVISIONAL (basis: <path>#L<a>-L<b>@<fingerprint>, dated <source date>, pinned <date>, age <n> gates / since <date>) | NONE
Authorship: USER-RATIFIED (<the ratifying line's citation>) | AGENT-DRAFTED (<tells that fired>) | UNKNOWN (<what is missing>) | n/a (no candidate)
Work map: FULL (<k> sanctioned tasks from <source>) | PARTIAL (<what is unmapped territory>) | n/a (no basis)
Auditor: same session that produced the work | fresh session | cross-model
Attendance: present | unattended
Mode: QUICK | QUICK (first audit) | DEEP (<trigger>) | DEEP INDICATED, NOT RUN (<trigger> — <why>)
Since: <sha | "first audit">   Scope: <repos/roots inspected; exclusions>
Deliverable: "<quoted from the basis, with its citation>" | NONE ADMISSIBLE (<why>)
Findings: <numbered; each carries a file:line, commit hash, or command output>
Trend: unmapped <n>/<m> (prev <n>/<m>)   Snoozed: <n> (oldest <date>) | none
Corrections (smallest first): revert it | park it | legitimize it (task + why in the SSOT)
Missing structure: <D-numbers + scaffold proposal, or "none">
Standing ask: <one line: the ratification pick> | none
Next check due: end of <the next named gate/phase/wave>
```

**When `Baseline:` is not RATIFIED the VERDICT line carries it in parentheses**, so the caveat
travels with the verdict and cannot be skimmed past. RATIFIED takes no parenthetical. The
complete worked set — use these exact forms, so two auditors on the same repo produce the same
string:

```
VERDICT: ON TRACK                              (all six D's pass)
VERDICT: ON TRACK (PROVISIONAL)                (reconstructed basis, FULL work map)
VERDICT: DRIFTED (MATERIAL)                    (ratified basis)
VERDICT: DRIFTED (MATERIAL, PROVISIONAL)       (grade first, then basis status)
VERDICT: INCONCLUSIVE (NONE)                   (no admissible basis)
VERDICT: INCONCLUSIVE (PARTIAL MAP)            (basis exists; map can't certify absence)
VERDICT: BLOCKED                               (every open task waits on the user)
```

`Work map: n/a (no basis)` is mandatory whenever `Baseline: NONE` — FULL and PARTIAL both
presuppose a scope to map against, so neither is true when scope itself is absent.

Grades: **MINOR** = a record-integrity defect **about the work record** — a tick with no evidence,
a mis-cited evidence sha, a stale date, a missing stamp: a claim about work that doesn't hold up.
**MATERIAL** = substantive work outside the work map, a PARKED item started, or >2× budget with no
stop-report; scope intact — revert/park/legitimize.

**A deficient plan document is not drift at any grade.** Missing sections, a stale workstream line,
an unabsorbed deliverable, two docs disagreeing — those are D-failures. They belong to the
`Baseline:` axis, `Missing structure:`, and `Standing ask:`, and they are already fully reported
there. Grading them DRIFTED double-counts one defect onto both axes and re-creates exactly the
conflation this skill exists to end: "is the surface sufficient?" and "is the work drifting?" are
different questions with different answers. Work on course + deficient surface =
`ON TRACK (PROVISIONAL)` with the D-failures listed — never DRIFTED.
**CAPTURED** = the scope statement or task set moved without a dated user line — the user is
required before further work, and CAPTURED is never snoozable. **INCONCLUSIVE** = the audit
could not grade (no admissible basis, or PARTIAL map with no positive drift found); it is a
statement about the AUDIT, never an accusation about the project — say which of the two it is.
BLOCKED = every open task waits on the user (partial blockers are findings, not BLOCKED).

**Ratification-debt aging (PROVISIONAL only).** A provisional basis goes stale after **two
distinct named gate closes AND ≥14 calendar days** since it was first pinned — counted once per
gate, so repeated same-day audits never age it. Before that: carry the compact standing-ask
line, nothing more. After that: mark the basis low-confidence, and at the next **attended**
audit offer the ratification pick — **only if no MATERIAL, CAPTURED, or PENDING decision is
competing for the question** (a safety correction always outranks ratification debt). Unattended
runs carry one debt reference and may continue existing in-scope work; **scope expansion
requires a pick.**

**No-change suppression:** same verdict and unchanged basis + evidence since the last stamp →
one line + stamp, not a full report (stamps and DRIFT DECISIONS records are bookkeeping and
don't count as changes; neither does an unchanged standing ask).

**On any DRIFTED verdict, read `interrupt-mode.md` in this skill's directory and follow it** —
grade-gated: MINOR applies and reports without spending a question — **but only for bookkeeping
repairs; a MINOR finding whose fix is a content edit still needs the user's yes** (§5's table);
MATERIAL presents slotted consequence scenarios and asks ONE question (attended) or records
PENDING (unattended); silence never snoozes — only an explicit user decline does. On a PROVISIONAL basis, every interrupt is framed
`graded against the provisional basis reconstructed from <cite>` — a user who disputes the
reconstruction has thereby been handed the ratification decision at its most concrete.

## 5. The audit stamp (mandatory in EVERY mode, including INCONCLUSIVE)

Append ONE line to the SSOT's `## AUDIT LOG` (create the **section** if absent — never the
**file**; see the no-host rule below):

```
<date> · <HEAD sha> · <work-verdict[+grade]> · unmapped <n>/<m> · next check: <gate>[ · run:<run-id>] · baseline:<RATIFIED|PROVISIONAL|NONE> · basis:<path#L<a>-L<b>@fingerprint|-> · basis-auth:<user-dated|user-ratified-post-hoc(<n> commits)|unknown|agent-drafted> · age:<gates>/<since-date|-> [· realign:<date>] · dwd:v3
```

**Null forms — use these exact spellings so stamps sort and compare.** With no basis
(`Baseline: NONE`): `unmapped n/a` · `basis:-` · `age:-/-`. On a first audit with a basis:
`age:0/<date-pinned>`. Never invent a variant (`n/a(NONE)`, `0/0`, `-`), and never leave a field
out — a missing field and an empty field read differently to the next auditor.

**Reading legacy stamps:** a stamp with no `dwd:v3` token predates the two-axis grammar. Its
`NO BASELINE` means **LEGACY-INSUFFICIENT** — "some D requirement was missing" — and must NEVER
be read as `NONE` (no intent existed) or rewritten. Leave old stamps exactly as they are.

**No host, no write.** If the project has no durable tracked document to host the stamp, it is
**reported verbatim in the audit output and carried as the first line of the scaffold proposal** —
you do not create a file to hold it. Creating one is indistinguishable from unilaterally creating
structure, which §3a.7 gates behind the user's yes. "Mandatory" governs *producing* the stamp,
never *manufacturing a host* for it. This covers two cases: no document exists at all, **and a
document exists but you just ruled its content inadmissible** — writing an audit trail into a file
whose authority you have declined would lend it the standing you withheld. In the second case say
which file you declined to write to, and why.

**The complete allow-list of writes the skill may make without the user's yes:** (1) this stamp;
(2) DRIFT DECISIONS records (interrupt-mode.md §4); (3) **bookkeeping repairs** — preauthorized
by a bound directive (unattended) or by the user's yes (attended). Nothing else, in any mode. The
provisional basis is pinned **by pointer inside the stamp** — it needs no additional write, and no
unratified sentence is ever copied into the user's files.

**Bookkeeping repair vs content edit — the line that decides what needs a yes.** Grade never
grants write permission; *category* does.

| Category | Examples | Authorization |
|---|---|---|
| **Bookkeeping repair** | a stale date; a mis-cited evidence sha; a missing stamp; a tick whose evidence exists but is unlinked | preauthorized directive (unattended) or the user's yes (attended) |
| **Content edit** | anything touching the deliverable, stages, workstreams, PARKED, budgets, or authority language — including *deleting* a stale workstream line | **always** the user's yes, at every grade, in every mode |

A MINOR grade on a content edit does not make it applicable — MINOR describes the *finding's*
severity, not the edit's category. Retiring a workstream the ratified scope excludes is a scope
decision the user owns, however obviously correct it looks.

## Rules

- Two axes, always both: the work verdict answers "is the build on course"; the baseline status
  answers "how much should you trust that answer". Never let one silently stand in for the other.
- A ratified sentence governs FORWARD from its own date. Work that predates it is reconciled,
  never retroactively graded — and no trend or ratio may span a start-of-governance boundary.
- Authorship is three-way and only `AGENT-DRAFTED` disqualifies. `UNKNOWN` is the ordinary state
  of a real project and supports a PROVISIONAL basis — never collapse it into NONE.
- Correct drift with the smallest edit to the SSOT — never by writing a new plan document.
- The skill never authors or edits the deliverable sentence, and never copies an unratified one
  into the user's files. Cite it; propose candidates; the user picks.
- Never certify ON TRACK on a PARTIAL work map, and never build a basis out of the commits you
  are about to grade.
- A slice/gate instruction is an overlay, never the whole scope. "Approved by silence" is not
  user direction.
- "Repo too big to read" is not a blocker: the audit is the bounded commands above.
- A verdict in prose is not a verdict. One vocabulary token, first line, every time.
- Never grade DRIFTED on bookkeeping alone — that is MINOR, stated as such.
- Never run DEEP twice on the same window; never repeat an unchanged report in full.
- Independence honesty: if synthesis or verification ran on the same model family, print
  "(same model, independent context)" rather than implying independence not obtained.
- CAPTURED is never snoozable; PENDING (a deferred question) is never recorded as SNOOZED
  (an explicit decline).

## Common mistakes

- **Refusing to grade work you already graded.** If you classified the commits and mapped them,
  say what you found — a deficient surface is a `Baseline:` value, not a gag order.
- **Vacuous ON TRACK.** `unmapped 0/0` against no work map is not a clean audit; it is an
  ungraded one. Report PARTIAL and INCONCLUSIVE.
- **Accepting a directive the user commissioned but did not write.** Dated, falsifiable, and
  "do not invent new scope" are not authorship. Run the §3a.2 tells and print the verdict.
- **Grading history against a sentence ratified today** — that is deriving scope from code with
  a ratification ceremony wrapped around it.
- Inventing tag or verdict vocabulary mid-audit (a fifth stage tag, a new verdict word). If the
  existing set can't express it, that belongs in a finding, not a new token.
- Reconstructing scope from a banner that excludes nothing — inadmissible, however official.
- Treating the latest gate instruction as the whole deliverable, so abandoned scope never surfaces.
- Copying a provisional sentence into the user's plan "just to pin it" — pin the pointer.
- Treating a gitignored or local-only tracker as durable state.
- Counting agreeing POINTERS as competing authorities (only claims and disagreements fail D2).
- Calling maintenance/bookkeeping commits drift — classify first.
- Passing evidence you only read: run it or mark `EVIDENCE: UNVERIFIABLE`.
- Deriving scope from code — that enshrines drift as the plan.
- Reading an old `NO BASELINE` stamp as "this project had no plan".
- Ending without the stamp and "Next check due" — an audit that doesn't re-arm dies with
  the session.
