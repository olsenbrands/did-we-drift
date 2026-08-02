# Did We Drift

**Agent-built projects don't fail loudly — they drift.**

Built in public by [DontSleepOnAI](https://dontsleeponai.com). This skill was born from a real
week: a shipped, revenue-ready product got re-planned — by capable, well-meaning agents — into a
~90-day certification program. Every individual step was locally rational. The sum was a detour.
The forensic audit that untangled it became this skill, and its very first catch was a bug its
own author accidentally planted while building its test fixture. A checker that catches its
author is a checker worth keeping.

## What it does

One audit, two layers:

1. **The durable tracking surface** — does the documentation that *prevents* drift actually
   exist, version-controlled, in this repo? Six required properties:

   | # | Requirement |
   |---|---|
   | D1 | A one-sentence deliverable, phrased as a user outcome |
   | D2 | Exactly ONE authoritative plan doc, tracked in git, with a "this file wins" rule |
   | D3 | Tasks with observable DONE-WHENs and EVIDENCE filled by the completing change |
   | D4 | A written definition of drift |
   | D5 | An audit cadence (end of every gate/phase/wave) with a fixed verdict vocabulary |
   | D6 | A dated WAITING-ON-USER list |

   Anything missing → **scaffold mode**: the skill tells the user exactly what's absent, what
   it costs, and proposes upgrading ONE existing document (never adding a competing one) from
   [`template.md`](skills/did-we-drift/template.md). It builds nothing without a yes.

2. **The work itself** — every commit since the last audit is mapped to an open task; ticked
   boxes get their evidence spot-checked; parked items, budgets, and stale user-blockers are
   verified. Unmappable work is drift, by definition, with the smallest correction attached:
   *revert it, park it, or legitimize it* — never "write a new plan document."

Every run ends in the same fixed shape, so audits compare across sessions, models, and months:

```
VERDICT: ON TRACK | DRIFTED | BLOCKED
Deliverable: "<quoted from the single source of truth>"
Findings: <numbered, each with file:line, commit hash, or command output>
Corrections (smallest first): ...
Missing structure: <D-numbers + scaffold proposal, or "none">
Next check due: end of <the next named gate/phase/wave>
```

`BLOCKED` is the underrated verdict: it means the agents aren't the bottleneck — you are, and
here's the dated list.

## Install

**Claude Code — recommended.** Paste this into a Claude Code session:

```
Install this skill globally on my machine: https://github.com/olsenbrands/did-we-drift
```

Claude clones this repo and copies `skills/did-we-drift/` to `~/.claude/skills/did-we-drift/`.
That's the whole install — one skill, two files, no scripts, no dependencies.

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

Test-driven, per the skill-writing discipline: a baseline agent audited a planted-drift fixture
*without* the skill first (it found the obvious rot but produced no stable verdict, no
sufficiency framework, no scaffold, no re-arm — and read every file, which doesn't survive real
repos). The skill was written against those exact gaps, then verified on three scenarios: a
deliberately drifted project (caught, with evidence), a healthy project with a subtle
evidence-integrity defect (caught — the author's own accidental bug), and an owner-blocked
project (correctly `BLOCKED`, not falsely `DRIFTED`). Zero loopholes surfaced across the runs.

## License

MIT — see [LICENSE](LICENSE).
