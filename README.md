# Did We Drift

**When you let an AI agent build for hours, it rarely fails loudly. It wanders.**

You give an agent a goal and let it work. Every step it takes looks sensible on its own. But
small reasonable choices stack up, and forty commits later the project has quietly become
something you never asked for. Nothing ever announced the turn. That's drift, and by the time
it's obvious, it's expensive.

`/did-we-drift` is a ten-minute check that answers one question: **is what my agents built still
the thing I asked for?** It reads your project's planning notes to find out what you said you
wanted, reads the actual commits to find out what got built, compares the two, and tells you
straight whether you're on course — with the specific commit hashes and file lines behind every
claim, so you can check its work.

**Who it's for:** anyone who lets AI agents write code over long stretches without watching every
step. Solo builders running overnight sessions, teams handing a project between sessions or
between people, and anyone who's opened a repo after a few days away and thought "wait, why did
it build *that*?" It works whether your planning lives in a tidy plan file, is scattered across
a few documents, or barely exists yet.

**What you get back** is a short report that always looks the same, starting with a one-word
verdict — on track, drifted, inconclusive, or blocked — followed by what you're being measured
against, what each commit was doing, which claims of "done" actually hold up when run, and if
something went sideways, the smallest fix that puts it right: undo it, shelve it, or decide it's
actually what you want now and write that down. Nothing gets changed without you saying yes.
Because the report has a fixed shape, you can put two of them side by side months apart and
compare them directly — even if different AI models produced them.

**When to run it:** at the end of any work session or milestone, when you pick a project back up
after time away, and before you kick off a long unattended run. That last one matters most — a
check *before* the sprint tells you whether your plan is solid enough to hand over, while a
check *after* only tells you how far things went. If you run agents in long loops, add one line
to your instructions telling the agent to run this skill and follow its verdict, and it becomes
an automatic guardrail rather than something you have to remember.

---

## Why drift is hard to see

- Agents optimize the next step, not the destination — every detour is locally rational.
- Plans multiply instead of updating: each session writes its own tracker or handoff note, and
  the truth forks.
- "Done" gets claimed without runnable evidence, then inherited as fact.
- Goalposts move silently: a plan file edited mid-sprint makes every *later* commit look
  on-plan forever.
- The next session trusts whichever document it reads first.

A point-in-time code review catches none of this. A drift audit catches all of it.

## Two questions, never confused for each other

Most drift tools collapse two different questions into one answer. This one keeps them apart,
because they have different answers and different fixes:

| Axis | Question | Reported as |
|---|---|---|
| **The work** | Is the build going where you asked? | `VERDICT:` — on track, drifted, inconclusive, blocked |
| **The basis** | How solid is the thing we measured against? | `Baseline:` — ratified, provisional, none |

That separation is the heart of v3. A project with real intent scattered across a few documents
gets **graded on its work** *and* told its planning is scattered. It is never told it has no
plan — which is what the previous version did, and which read to people as "your project is
unplanned" when it wasn't.

## What it actually does

**1. Finds what you declared you wanted.** Bounded searches — never a full repo read — locate
your planning documents, including ones hiding in `.gitignore` (those aren't durable; a future
session cloning the repo never sees them, and the report says so).

**2. Scores the planning surface** against six requirements: a falsifiable one-sentence
deliverable, exactly one root authority, tasks with checkable evidence, a written definition of
drift, an audit cadence, and a dated baseline of verified facts.

**3. Builds a basis to measure against.** If all six pass, your plan is the basis. If some fail,
the skill reconstructs a **provisional** basis from what you actually declared — a dated
instruction you wrote, an intent statement in a README — and grades against that while telling
you it's unratified. To be usable, a source must be yours (agent-drafted text approved by
silence never counts), cover the whole project rather than one slice, and exclude something
real. A vague mission statement that rules nothing out is rejected no matter how officially it's
published, because measuring against it would certify anything as on-course.

**The deliverable is never invented from your code.** "The code does X, so X must have been the
plan" would legitimize every drift ever committed. The skill quotes and cites; when a choice is
needed, it offers up to three cited candidates with an explicit "this would exclude…" line for
each, and you pick. If nothing you declared survives — pure code, no stated intent anywhere —
the honest answer is `INCONCLUSIVE`, not a guess.

**4. Grades the work.** Every commit since the last check is classified (routine maintenance,
bookkeeping, substantive, or unassessable) and mapped onto your sanctioned work. Only unmapped
*substantive* work counts as drift, so merges and dependency bumps don't trigger false alarms.
Completion claims are sampled adversarially — the highest-impact finished task, the most recent
one marked done, one area you said to stay out of — and **actually run**. What can't be run is
reported `EVIDENCE: UNVERIFIABLE` rather than quietly passed.

**5. Never certifies more than it checked.** If the plan names a goal but no enumerable list of
sanctioned work, the skill says so and refuses to declare "on track." Finding no drift when you
had nothing to compare against isn't a clean bill of health — it's an unfinished audit, and it
gets labeled one.

## The report

```
VERDICT: ON TRACK | DRIFTED (MINOR|MATERIAL|CAPTURED) | INCONCLUSIVE | BLOCKED
Baseline: RATIFIED | PROVISIONAL (basis: <path>#L<a>-L<b>@<fingerprint>, dated …, age …) | NONE
Work map: FULL (<k> sanctioned tasks) | PARTIAL (<what's unmapped territory>) | n/a (no basis)
Auditor: same session that produced the work | fresh session | cross-model
Mode: QUICK | QUICK (first audit) | DEEP (<trigger>) | DEEP INDICATED, NOT RUN (<why>)
Since: <sha | "first audit">   Scope: <what was inspected; exclusions>
Deliverable: "<quoted, with its citation>" | NONE ADMISSIBLE (<why>)
Findings: <numbered, each with a file:line, commit hash, or command output>
Trend: unmapped <n>/<m> (prev <n>/<m>)   Snoozed: <n> (oldest <date>)
Corrections (smallest first): revert it | park it | legitimize it
Missing structure: <which requirements fail + scaffold proposal, or "none">
Standing ask: <the one open question, or none>
Next check due: end of <the next gate/phase/wave>
```

**Drift grades.** `MINOR` — the *record* is wrong (a task ticked with no evidence, a stale date);
the fix is an edit. `MATERIAL` — real work happened outside the plan; the goal itself is intact;
undo it, shelve it, or adopt it. `CAPTURED` — the goal itself moved without your say-so; you're
required before work continues, and this one can't be postponed. A messy *plan document* is
never graded as drift at any level — that's reported on the basis axis, so one problem never gets
counted twice.

`BLOCKED` is the underrated verdict: your agents aren't the bottleneck — *you* are, and here's
the dated list of what's waiting on you.

Each run appends one line to your plan's `## AUDIT LOG`, so the next check knows where to start
and the **trend** becomes visible. Two "on track" verdicts with a rising unmapped ratio is the
earliest drift signal a single verdict can't show you.

## Inside long autonomous runs

Add one line to your loop or goal directive: *"First run the did-we-drift skill and obey its
verdict."* Then:

- Bookkeeping fixes itself and reports. Real drift interrupts with plain-English before/after
  consequences and **one** question: fix and continue, fix and restart (you get a regenerated
  resume prompt that picks up where things left off), or decline.
- **Silence never counts as approval.** An unattended iteration defers the question and keeps
  working only inside already-sanctioned scope — it never invents work to fill a gap.
- A moved goal always stops the run. Declined drift is remembered with a stable ID and
  re-surfaces compressed; it never quietly becomes sanctioned scope.
- The run is **bound to one plan**, re-verified every audit, so a multi-plan repo can't cause
  your sprint to be graded against the wrong document.

Full protocol: [`interrupt-mode.md`](skills/did-we-drift/interrupt-mode.md).

## Guarding against a biased auditor

The enemy of an honest verdict isn't reading capacity — it's **confirmation**. An agent that
reads the plan first will charitably map commits onto tasks, and a session auditing *its own*
work has a live incentive to grade everything trivial, because a harsher grade stops its own run.

`did-we-drift` treats that as an engineering problem. A cheap worker reads **only** commits,
diffs, and code — forbidden from opening any planning document — and reports what was actually
being built, in its own words. Drift is what falls out when that account is compared against the
plan. When the auditing session wrote the code under audit, it holds no lane at all: two blind
lanes report to a synthesis agent that never sees the primary's theory or even which lane was
which, **cross-model when available**. Every report states the independence it actually got —
`cross-model` or `(same model, independent context)` — never implying more.

This stays bounded. A single-agent audit is the default and a first check never escalates on its
own; fan-out triggers only on mechanical conditions (self-audit, a contested verdict, a high
unmapped ratio, a changed deliverable), caps at three workers, and announces its cost first. If
fan-out is indicated but unavailable, the report says `DEEP INDICATED, NOT RUN` rather than
silently downgrading — and notes that the uncorrected bias runs toward *under*-reporting drift,
so a "drifted" verdict survives the gap while an "on track" one deserves more scepticism.

Crew rules and read scopes: [`deep-mode.md`](skills/did-we-drift/deep-mode.md). The scaffold
skeleton it proposes: [`template.md`](skills/did-we-drift/template.md).

## When nothing is written down yet

Missing planning isn't a dead end. The skill reports exactly which requirements fail and what
each absence costs, then proposes upgrading **one** existing document (never adding a competing
one) with facts mined from your repo: a dated baseline of what actually builds and runs, and a
stage list tagged `SHIPPED | IN-FLIGHT | UNSANCTIONED` — where "unsanctioned" means real work no
candidate goal covers, surfaced as a question instead of quietly becoming the plan. You approve
before anything is written. If there's no document to host even the audit stamp, the skill hands
you the line to keep rather than creating a file you didn't ask for.

## Install

**Claude Code — recommended.** Paste this into a Claude Code session:

```
Install this skill globally on my machine: https://github.com/olsenbrands/did-we-drift
```

Claude clones this repo and copies `skills/did-we-drift/` to `~/.claude/skills/did-we-drift/`.
Four files, no scripts, no dependencies.

## When it triggers

Invoke it directly, or let your agent reach for it — the skill fires on: ending a build
gate/phase/wave · resuming a multi-session project · before ratifying or accepting a plan · a
build that feels over-engineered · planning docs that are missing, contradictory, duplicated, or
living only in gitignored/local files. It pairs naturally with a plan document that names the
skill in its own cadence section — then every future session re-arms the check unprompted.

## New in v3

- **Two-axis verdict.** Work and basis are graded separately, so a real-but-scattered plan gets
  a usable verdict instead of a refusal.
- **`NO BASELINE` retired.** It's now `INCONCLUSIVE` plus `Baseline: NONE` — a statement about
  what the *audit* could establish, never an accusation that your project is unplanned. Stamps
  written by older versions are read as "some requirement was missing," never rewritten.
- **A basis needs a goal *and* a work map.** Without an enumerable list of sanctioned work,
  "zero unmapped commits" proves nothing; the skill now refuses to certify on-track from it.
- **Intent, pinned by reference.** The provisional basis is pinned by path, line range, and a
  fingerprint of the quoted lines — so the audit's own bookkeeping can't be mistaken for your
  goal changing, and no unratified sentence is ever written into your files.
- **Write permission by category, not severity.** Bookkeeping repairs can be automated; anything
  touching scope, stages, or parked work always needs your yes — however obvious the fix looks.
- **Slice instructions can't become the whole goal.** "Finish X this pass, hold Y" is treated as
  an overlay on the full goal, so half a deliverable can't be quietly abandoned while the audit
  reports on-track.

## How it was tested

Test-driven, not vibes-driven — the same discipline the skill applies to your project. Every
version starts by reproducing a real failure on a purpose-built fixture repo, then fixes it,
then re-verifies with fresh-context agents that were never told the expected answer.

v3 began with a reported field failure, reproduced on the bench. Its design was attacked by an
independent reviewer from a different model family *before* implementation — which caught that
the proposed fix could certify "on track" against nothing, and that its pinning mechanism would
have violated the skill's own never-write-the-goal rule. Verification ran across three fixtures,
including one built specifically to bait the new logic into a false pass: a vague, official
banner competing against a specific dated note, over work that had wandered into three unrelated
subsystems. It rejected the banner and caught the drift. Ten defects surfaced across the cycle —
several found by test agents doing the right thing *despite* the text — and all ten were fixed
and re-verified. Earlier rounds caught real bugs accidentally planted in the fixtures themselves.

## License

MIT — see [LICENSE](LICENSE). Built by [DontSleepOnAI](https://dontsleeponai.com).
