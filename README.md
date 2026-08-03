# Did We Drift

**Agent-built projects don't fail loudly — they drift.**

Built in public by [DontSleepOnAI](https://dontsleeponai.com). This skill was born from a real
week: a shipped, revenue-ready product got re-planned — by capable, well-meaning agents — into a
~90-day certification program. Every individual step was locally rational. The sum was a detour.
The forensic audit that untangled it became this skill, and its very first catch was a bug its
own author accidentally planted while building its test fixture. A checker that catches its
author is a checker worth keeping.

**v2** hardened v1 through an adversarial cross-model design review — a fresh-context Claude
reviewer and an OpenAI Codex reviewer, identical briefs, both independently returning
NEEDS-REVISION with convergent fixes — then re-verified the revision against the original test
fixtures before release.

## What it does

One audit, two layers, four possible verdicts:

1. **The durable tracking surface** — does the documentation that *prevents* drift exist,
   version-controlled, in this repo? Six required properties:

   | # | Requirement |
   |---|---|
   | D1 | A one-sentence deliverable, a user outcome, **falsifiable** — it must exclude something tempting, or it's a banner |
   | D2 | Exactly ONE **root** authority, durable; agreeing pointers are healthy, disagreeing ones fail; out-of-repo authorities count via a tracked pointer file |
   | D3 | Tasks with observable DONE-WHENs and **valid** evidence (non-code projects: signed-off evidence with provenance) |
   | D4 | A written definition of drift |
   | D5 | An audit cadence + fixed verdict vocabulary + what each audit must surface |
   | D6 | A dated BASELINE of verified facts — without it, "not built" and "built but broken" are indistinguishable |

   Anything missing → verdict **NO BASELINE** and scaffold mode: an *evidence-derived* proposal,
   not an empty template. Facts (baseline, stages) are mined from the repo; stages are tagged
   `SHIPPED | IN-FLIGHT | UNSANCTIONED` so drift-in-progress surfaces as a question instead of
   becoming the plan. **The deliverable sentence is never derived** — the skill presents ≤3
   cited candidates (ranked by an intent-provenance ladder: ratified user direction > plans >
   issues/READMEs > code) each with an explicit "this would exclude:…" line, and the user picks.
   Nothing is built without a yes.

2. **The work itself** — every commit since the last audit stamp is *classified*
   (maintenance / bookkeeping / substantive / unassessable; only unmapped **substantive** work
   is drift), the deliverable sentence's own git history is diffed (silently moved goalposts =
   the highest-severity drift there is), and evidence is sampled adversarially — highest-impact
   task, most recent tick, one parked area — **run**, or reported `EVIDENCE: UNVERIFIABLE`,
   never passed on a read.

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
plan; deliverable intact) · **CAPTURED** (the plan itself moved without the user — user
required). `BLOCKED` is the underrated verdict: the agents aren't the bottleneck — you are,
with the dated list. Each audit appends a one-line stamp to the plan's `## AUDIT LOG`, so the
next audit knows its window and the unmapped-ratio *trend* becomes visible — two ON TRACKs with
a rising ratio is the earliest drift signal a point verdict can't see.

## QUICK by default, DEEP when it matters

QUICK is a bounded single-agent protocol (~10 minutes). DEEP fan-out auto-triggers only on
mechanical conditions — the auditing session authored the work, a contested verdict, a high
unmapped ratio, a changed deliverable sentence — and scales with contamination: a fresh auditor
gets one **plan-blind work-lane** worker (the only seat that buys accuracy); a self-auditing
session holds no lane itself and hands synthesis to a blind, preferably cross-model seat that
never sees the primary's hypothesis. Hard cap of 3 seats, crew and cost announced first.
Details: [`deep-mode.md`](skills/did-we-drift/deep-mode.md).

## Install

**Claude Code — recommended.** Paste this into a Claude Code session:

```
Install this skill globally on my machine: https://github.com/olsenbrands/did-we-drift
```

Claude clones this repo and copies `skills/did-we-drift/` to `~/.claude/skills/did-we-drift/`.
Three files, no scripts, no dependencies.

## Use

Run it (or let your agent trigger it — the description fires on these situations):

- at the **end of every gate, phase, or wave** of a build;
- at **session start** on any multi-session project;
- **before ratifying or accepting a plan**;
- whenever a build **feels over-engineered** or planning docs are missing, contradictory,
  duplicated, or living only in gitignored/local files.

Pairs naturally with a plan document that names the skill in its own audit-cadence section —
then every future session re-arms the check without being asked, and any "check on this
progress" agent, on any model, produces a comparable verdict.

## How it was tested

Test-driven throughout, per the skill-writing discipline. **v1:** a baseline agent audited a
planted-drift fixture *without* the skill (it found the rot but produced no stable verdict, no
sufficiency framework, no scaffold, no re-arm), then the skill was verified on three scenarios —
including catching the author's own accidental fixture bug. **v2:** two independent reviewers
(Claude family and OpenAI Codex, identical briefs, read-only) each returned NEEDS-REVISION;
their convergent fixes — the audit-stamp grammar, the commit taxonomy, the NO BASELINE verdict,
DRIFTED severity grades, the never-derive-the-deliverable guard — were folded in and the
revision re-verified against the fixtures: the no-baseline case now yields `NO BASELINE` with
cited deliverable candidates, and the healthy case correctly invoked no-change suppression.

## License

MIT — see [LICENSE](LICENSE).
