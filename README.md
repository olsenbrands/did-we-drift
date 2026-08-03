# Did We Drift

**Autonomous coding sprints don't fail loudly — they drift.**

You hand an agent a goal and let it run — a `/loop`, a `/goal` directive, an overnight sprint.
Every iteration makes a locally reasonable choice. Forty commits later the build is somewhere
you never asked it to go, and nothing ever *announced* the turn. Handoffs make it worse: each
fresh session reconstructs your intent from whatever documents it happens to find, and by then
the documents disagree with each other.

`/did-we-drift` turns "are my agents still building the thing I asked for?" into a ten-minute,
evidence-cited answer — one that any agent, on any model, can produce today and reproduce
comparably next month.

## Why drift happens (and why you don't see it)

- Agents optimize the next step, not the destination — every detour is locally rational.
- Plans multiply instead of updating: each session writes its own tracker or handoff note, and
  the truth forks.
- "Done" gets claimed without runnable evidence, then inherited as fact.
- Goalposts move silently: a plan file edited mid-sprint makes every *later* commit look
  on-plan forever.
- The next session trusts whichever document it reads first.

A point-in-time code review catches none of this. A drift audit catches all of it.

## What it does

One audit, two layers, four possible verdicts:

1. **The durable tracking surface** — does the documentation that *prevents* drift exist,
   version-controlled, in the repo? Six required properties:

   | # | Requirement |
   |---|---|
   | D1 | A one-sentence deliverable, a user outcome, **falsifiable** — it must exclude something tempting, or it's a banner |
   | D2 | Exactly ONE **root** authority, durable; agreeing pointers are healthy, disagreeing ones fail; out-of-repo authorities count via a tracked pointer file |
   | D3 | Tasks with observable DONE-WHENs and **valid** evidence (non-code projects: signed-off evidence with provenance) |
   | D4 | A written definition of drift |
   | D5 | An audit cadence + fixed verdict vocabulary + what each audit must surface |
   | D6 | A dated BASELINE of verified facts — without it, "not built" and "built but broken" are indistinguishable |

   Anything missing → verdict **NO BASELINE** and scaffold mode: an *evidence-derived*
   proposal, not an empty template. Facts (baseline, stages) are mined from your repo; stages
   are tagged `SHIPPED | IN-FLIGHT | UNSANCTIONED`, so drift-in-progress surfaces as a question
   instead of quietly becoming the plan. **The deliverable sentence is never derived from
   code** — the skill presents up to three cited candidates (ranked by an intent-provenance
   ladder: your own ratified words > plans > issues/READMEs > implementation evidence), each
   with an explicit "this would exclude:…" line, and *you* pick. Nothing is built without a yes.

2. **The work itself** — every commit since the last audit stamp is *classified* (maintenance /
   bookkeeping / substantive / unassessable; only unmapped **substantive** work counts as
   drift), the deliverable sentence's own git history is diffed (silently moved goalposts are
   the highest-severity drift there is), and completion claims are sampled adversarially —
   highest-impact task, most recent tick, one parked area — and **run**, or reported
   `EVIDENCE: UNVERIFIABLE`, never passed on a read.

Every run ends in the same fixed shape, so audits compare across sessions, models, and months:

```
VERDICT: ON TRACK | DRIFTED (MINOR|MATERIAL|CAPTURED) | BLOCKED | NO BASELINE
Auditor: same session that produced the work | fresh session | cross-model
Since: <sha | "first audit">   Scope: <what was inspected; exclusions>
Deliverable: "<quoted from the root authority>"
Findings: <numbered, evidence-cited>
Trend: unmapped <n>/<m> (prev <n>/<m>)
Corrections (smallest first): revert it | park it | legitimize it
Missing structure: <D-numbers + scaffold proposal, or "none">
Next check due: end of <the next gate/phase/wave>
```

DRIFTED grades: **MINOR** (bookkeeping — fix is an edit) · **MATERIAL** (real work outside the
plan; deliverable intact) · **CAPTURED** (the plan itself moved without you — you're required
before work continues). `BLOCKED` is the underrated verdict: your agents aren't the
bottleneck — *you* are, and here's the dated list. Each audit appends a one-line stamp to the
plan's `## AUDIT LOG`, so the next audit knows its window — and the unmapped-ratio *trend*
becomes visible: two ON TRACKs with a rising ratio is the earliest drift signal a single
verdict can't see.

## Built for loops, goals, and handoffs

- **Before a long sprint:** run it once. `NO BASELINE` means your plan can't support an
  autonomous run yet — and the skill scaffolds one from your repo's actual evidence, for your
  approval, before the loop burns a single iteration on an unanchored goal.
- **Inside a `/loop` or `/goal`:** put one line at the top of the directive — *"First run the
  did-we-drift skill and obey its verdict."* MINOR bookkeeping fixes itself and reports.
  MATERIAL drift interrupts with plain-English consequence scenarios — *"if left unchanged →
  this; if changed → that"* — and one question: fix and continue, fix and restart (you get a
  regenerated, pointer-only resume prompt that picks up where the sprint left off against the
  updated plan), or snooze. Declined drift is remembered with a stable ID and re-surfaces
  compressed — it never silently becomes sanctioned scope. Unattended iterations never guess:
  they defer the question as PENDING and stop rather than invent work. CAPTURED — the plan
  itself moved without you — always stops. The loop structurally cannot wander for six hours.
- **Across handoffs:** run it at session start. The new session doesn't inherit vibes or
  whichever handoff note it found first — it inherits a stamped window, a trend line, one
  document that wins, and a **run binding**, so an audit can never grade your sprint against
  the wrong plan in a multi-plan repo.

## QUICK by default, DEEP when it matters

QUICK is a bounded single-agent protocol (~10 minutes). DEEP fan-out auto-triggers only on
mechanical conditions — the auditing session authored the work it's judging, a contested
verdict, a high unmapped ratio, a changed deliverable sentence — and scales with contamination:
a fresh auditor gets one **plan-blind work-lane** worker (the only seat that buys accuracy); a
self-auditing session holds no lane itself and hands synthesis to a blind, preferably
cross-model seat that never sees the primary's hypothesis. Hard cap of three seats, crew and
cost announced first. Details: [`deep-mode.md`](skills/did-we-drift/deep-mode.md).

## Install

**Claude Code — recommended.** Paste this into a Claude Code session:

```
Install this skill globally on my machine: https://github.com/olsenbrands/did-we-drift
```

Claude clones this repo and copies `skills/did-we-drift/` to `~/.claude/skills/did-we-drift/`.
Three files, no scripts, no dependencies.

## When it triggers

Invoke it directly, or let your agent reach for it — the skill description fires on: ending a
build gate/phase/wave · resuming a multi-session project · before ratifying or accepting a
plan · a build that feels over-engineered · planning docs that are missing, contradictory,
duplicated, or living only in gitignored/local files. Pairs naturally with a plan document
that names the skill in its own audit-cadence section — then every future session re-arms the
check without being asked.

## How it was tested

Test-driven, not vibes-driven. v1 was written against a documented baseline failure (an
unguided agent auditing a planted-drift fixture: right instincts, no stable verdict, no
sufficiency framework, no re-arm) and verified across three fixture scenarios — during which it
caught a real bug its own author had accidentally planted in the test fixture. v2 went through
an adversarial cross-model design review — two independent reviewers from different model
families, identical briefs, read-only — whose convergent findings (the stamp grammar, the
commit taxonomy, the NO BASELINE verdict, severity grades, the never-derive-the-deliverable
guard) were folded in and re-verified against the same fixtures.

## License

MIT — see [LICENSE](LICENSE). Built by [DontSleepOnAI](https://dontsleeponai.com).
