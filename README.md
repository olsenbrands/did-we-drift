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

It also keeps a **plain-language dashboard** of the answer: one page showing what you planned
beside what actually got built, written for someone who watched none of the work. Say *"show me
the dashboard"* any time. [See what it looks like.](#seeing-it-the-dashboard)

**Who it's for:** anyone who lets AI agents write code over long stretches without watching every
step. Solo builders running overnight sessions, teams handing a project between sessions or
between people, and anyone who's opened a repo after a few days away and thought "wait, why did
it build *that*?" It works whether your planning lives in a tidy plan file, is scattered across
a few documents, or barely exists yet.

**If you never wrote a plan, this still works — that's the point.** Most real projects get
organized *after* the building starts, if ever. The check doesn't scold you for that and it
doesn't refuse to answer. It finds whatever you actually said you wanted — a note, a message, a
line in a README — shows it back to you, and asks you to confirm or correct it in one sentence.
Only then does it measure. And it will tell you something uncomfortable if it's true: that the
"plan" in your repo was written by an agent, not by you.

**What you get back** is a short report that always looks the same, starting with a one-word
verdict — on track, drifted, inconclusive, or blocked — followed by what you're being measured
against, what each commit was doing, which claims of "done" actually hold up when run, and if
something went sideways, the smallest fix that puts it right: undo it, shelve it, or decide it's
actually what you want now and write that down. Nothing gets changed without you saying yes.
Because the report has a fixed shape, you can put two of them side by side months apart and
compare them directly — even if different AI models produced them.

**When to run it:** at the end of any work session or milestone, when you pick a project back up
after time away, and before you kick off a long unattended run. If you run agents in long loops,
add one line to your instructions telling the agent to run this skill and follow its verdict, and
it becomes an automatic guardrail rather than something you have to remember.

**And when you're starting fresh, don't wait for the first check — run `/did-we-drift init`.**
You write a plan with your agent the way you always do; then, before any build work starts, init
turns that plan into the one baseline document every future check will measure against. The agent
does all the formatting and structure. The only thing it cannot do for you — by design — is write
the finish line: **you type one sentence saying what "done" means, in your own words**, and it's
recorded with your name, the date, and your exact words preserved in the project's history, where
any future audit (by any AI, on any machine) can verify it came from you. Thirty seconds of
typing, and every check afterward skips the archaeology and answers only the question you care
about: *is the work still on course?*

The whole system is a lifecycle: **start right** (`init`) → **stay right** (the audit at every
milestone) → **get interrupted only when it matters** (real drift asks you one question) →
**recover if you started wrong** (basis recovery reconstructs a goal from what you actually said).
Users who run init never need the recovery path at all.

---

## Start audit-ready: `/did-we-drift init`

Init exists because of a pattern we kept finding in real projects: nearly every long autonomous
run starts with someone telling an agent *"write me the plan and keep working until it's done."*
The agent writes an impeccable-looking plan — dated, detailed, even saying "do not invent new
scope" — and no human ever authored the goal it enforces. Months later, nobody can prove what the
project was supposed to be.

Init closes that at the source. Run it once, after the plan exists and before the build starts:

- **It builds one plan file, not a pile.** Your draft plan gets upgraded in place into the single
  authoritative document: the goal, the stages with checkable done-conditions, a verified record
  of what currently works, the drift rules, and the audit schedule. One file wins; that's a rule.
- **The finish line is yours, provably.** Init proposes candidates from your own plan, but the
  sentence that governs everything must come from you — typed in your words, landing in its own
  commit with your verbatim reply preserved. If you're in a hurry and just say "adopt it," init
  records that honestly as *adopted, not authored*, tells you the baseline will read as
  provisional until you write it yourself, and moves on. It never forges your signature.
- **It never grades its own work.** Init produces a receipt, not a verdict. The proof comes when
  you run a plain `/did-we-drift` afterward — ideally from a fresh session or a different AI —
  and it independently returns `Baseline: RATIFIED` with nothing missing. Init even prints the
  exact report you should expect, so you'll know at a glance if something's off.
- **Existing work is handled honestly.** If commits predate init, they're recorded behind a dated
  boundary and dispositioned (keep / shelve / undo / decide later) — never retroactively graded
  against a goal that didn't exist when they were written.
- **Launching a loop?** Init records the run-to-plan binding and hands you the one line to put in
  your directive: *"First run the did-we-drift skill and obey its verdict."*

Full procedure: [`init-mode.md`](skills/did-we-drift/init-mode.md).

## Best practices — the step-by-step

**Starting a new project (the golden path):**

1. Write your plan with your agent, as detailed or as rough as you like.
2. Before any build work: run `/did-we-drift init`.
3. When it asks for the finish line, **type one sentence in your own words** and name one thing
   it deliberately excludes. Don't say "yes"; don't say "adopt 1." This is the single most
   valuable thirty seconds in the whole system — it's what makes the plan *yours* on the record.
4. Answer the two loop questions if you're about to launch one (may the agent auto-fix
   bookkeeping? may it auto-shelve out-of-scope work?).
5. Approve the writes. Say yes to the one-line pointer in CLAUDE.md — it makes every future
   session re-arm the check automatically.
6. **Verify:** run `/did-we-drift` from a fresh session (a different AI if you have one). Expect
   `ON TRACK · Baseline: RATIFIED`. Init printed the exact expected report; anything else is
   worth a look.
7. If you're launching a loop, put init's one-liner in your directive.

**During the build:**

8. Run `/did-we-drift` at the close of every phase or milestone, and at session start when
   resuming. (The CLAUDE.md pointer makes agents do this unprompted.)
9. Read both axes every time: `VERDICT:` is the work; `Baseline:` is how much to trust the
   measurement. `ON TRACK (PROVISIONAL)` means "on course, but ratify your goal when you get a
   minute."
10. On `DRIFTED`, answer the one question with the smallest fix that's true: undo it, shelve it,
    or — if the detour is actually what you want now — legitimize it with a dated line. Never
    just ignore it: declined drift is remembered and resurfaces.
11. Never edit the goal sentence casually. Changing it takes a dated line from you — a silent
    edit is the highest-severity drift there is, and the audit will catch it.

**Picking a project back up after time away:**

12. Run the audit *before* reading the code. The report tells you where things stand, what's
    waiting on you, and when the next check is due — faster and more honest than skimming
    commits.

**If you never wrote a plan and you're deep in a build:**

13. Just run `/did-we-drift`. It won't scold you and won't refuse — it finds what you actually
    said you wanted, shows you up to three candidate goals with sources and dates, and asks for
    one sentence. From there you're on the same footing as someone who ran init on day one.

**Habits that make every audit stronger:** phrase done-conditions as commands or observable
facts, not vibes · record evidence in the same commit that finishes the work · keep exactly one
authoritative plan file and date every decision in it · when an audit says `EVIDENCE:
UNVERIFIABLE`, treat it as a to-do, not an insult.

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

## Seeing it: the dashboard

A verdict in a terminal is precise and easy to skim past. So every audit also writes a single
self-contained page — `docs/drift-dashboard.html` — that answers "how's it going?" in about ten
seconds. Open it by double-clicking. No server, no build step, no network.

Ask *"show me the dashboard"* and the skill refreshes it and opens it. Any other audit updates it
silently.

```
Your cockpit redesign is 43% built
Three of seven steps are done. One is being worked on now.
████████████░░░░░░░░░░░░░░  43% built — 3 of 7 steps finished

WHAT WE PLANNED                        WHAT WE BUILT
Make your approve-or-deny answers      ✓ Built
actually reach your assistant.         When:  Aug 4, 9:12am → Aug 6, 8:47am · took 2 days
Before this, you could tap Approve     How it went: Three review rounds. Two bugs found
and nothing would happen.              and fixed. One thing deliberately left out: …
▸ Want the technical specs?            Proof: Went out to real users in version beta.17
```

**Written for the person paying for the work, not the person who did it.** Every step says what
it gives a real person and what was broken before it; the acronyms, file paths and commit hashes
live behind *"Want the technical specs?"* Internal stage IDs appear only as small muted badges.

- **A completion meter that can't lie.** The percentage is computed from the row statuses at
  render time — there is no number to set by hand, so it can never disagree with the list beneath
  it. Steps count equally and the raw count always shows alongside ("43% — 3 of 7").
- **Nothing is marked done on momentum.** Status comes from the evidence slots. A ticked box whose
  evidence doesn't hold up shows as *In progress* with the reason, not as Built.
- **Missing facts say "not recorded"** instead of vanishing, so a thin record never passes for a
  clean one. Anything a step quietly skipped is stated on the row that claims to be finished.
- **What changed since you last looked**, and **what's waiting on you** — the dated decisions
  blocking the build, written as the question you have to answer.
- **A bad verdict looks bad.** The panel takes its colour from the verdict; "off course" is never
  rendered in the same calm tone as "on track". Colour never carries meaning alone — every state
  is also an icon and a word.
- **Every source document is one click away**, with its full path shown for copying and a
  relative link so the page still works on someone else's machine.

**It is a view, never a second authority.** It makes no claim your plan doesn't already make, is
never cited as a basis, and if the two ever disagree the plan wins and the page is corrected. When
the audit finds no admissible plan, the meter is *hidden* rather than recoloured — a percentage
computed against a plan that was just ruled inadmissible is a lie, however pretty.

A bundled checker (`verify-dashboard.mjs`) runs on every generate and refresh: it proves the page
renders, escapes its inputs, keeps jargon out of the default view, and — given your plan file —
that the quoted goal appears **verbatim** in it and every step on the page actually exists there.
It runs the page in a sandboxed process with no filesystem access, because dashboards live in
repos that agents wrote. A green run means the page renders and matches the plan text it cites;
it does *not* mean the statuses are true, and it says so.

Mechanics: [`dashboard.md`](skills/did-we-drift/dashboard.md).

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

## Who wrote your plan? (the trap almost nobody sees)

Nearly every long autonomous run starts the same way: *"write me a loop command that keeps you
working until this is done."* The agent writes it. It's dated. It's specific. It often says
"do not invent new scope." It looks exactly like a plan — and no human ever wrote a word of the
goal it enforces. Later sessions rewrite it. An audit reads it back to you as your own intent.
Nothing misbehaved, and yet nobody ever declared what "done" means.

`did-we-drift` treats that as a first-class finding rather than something an auditor has to
happen to notice. Every candidate goal is classified on **mechanical git evidence**:

| | Means | Can it be measured against? |
|---|---|---|
| `USER-RATIFIED` | dated words of yours, or text you adopted in your own words | yes — anything |
| `UNKNOWN` | nothing agent-written about it, but no proof it's yours either | yes, provisionally — the ordinary state of a real project |
| `AGENT-DRAFTED` | a strong tell fired | no — the audit reports it and asks you for a sentence |

The tells are evidence, not vibes: the commit that introduced the goal *also touches source*
(whatever wrote the code wrote the sentence) · a self-maintenance clause telling the file to
rewrite itself for the next session · an instruction telling a reader to *keep working* until
something is done. Deliberately **not** tells: a stop condition (that's what a good goal has),
being committed alongside other planning files (that's how people work), and `git blame` — which
in agent-driven repos names the human for text the agent typed, confidently and wrongly.

## When nothing is written down yet — basis recovery

Missing planning isn't a dead end, and the recovery is designed to take about a minute, because
the people who land here are by definition the people who didn't write a plan.

You get up to three candidate sentences drawn from things you actually said — oldest first, each
with its date, its source, and what it would *exclude* — plus the capability groups your repo
actually contains, and one question: reply with a sentence, or a number. Nothing is written until
you answer.

Two rules make this honest rather than theatre. **Intent is shown before the inventory**, and the
pass that gathers it can't read your source — showing you everything that exists and *then* asking
what you're building just derives the goal from the code with your fingerprints on it. And
**ratification governs forward**: the sentence you pick today did not govern last month's commits,
so the file records a dated start-of-governance marker, prior work is *reconciled*
(retain / park / revert / undecided) rather than retroactively graded, and no trend or ratio is
ever reported across that line. A ratified goal is a commitment, not a rewriting of history.

If your only intent lives in a chat log, it stays a **memory aid** — never globbed, never quoted
into any file or report, never a basis. Those logs hold credentials, other people's data, and any
old prompt-injection payload sitting there waiting to be quoted back as your own goal. Restate it
yourself in a tracked file and it becomes citable.

While you decide, work doesn't stop: it may continue **extending a capability group that already
ships**; starting a genuinely new one is what waits. And if there's no document to host even the
audit stamp, the skill hands you the line to keep rather than creating a file you didn't ask for.

Full procedure: [`realign-mode.md`](skills/did-we-drift/realign-mode.md).

## Install

**Claude Code — recommended.** Paste this into a Claude Code session:

```
Install this skill globally on my machine: https://github.com/olsenbrands/did-we-drift
```

Claude clones this repo and copies `skills/did-we-drift/` to `~/.claude/skills/did-we-drift/`.
Nine files. No dependencies and nothing to build — the one script it ships is the dashboard
checker, which uses only Node's standard library (Node 20+; the sandbox it renders in needs 20.6
or newer).

## When it triggers

Invoke it directly, or let your agent reach for it — the skill fires on: ending a build
gate/phase/wave · resuming a multi-session project · before ratifying or accepting a plan · a
build that feels over-engineered · planning docs that are missing, contradictory, duplicated, or
living only in gitignored/local files. It pairs naturally with a plan document that names the
skill in its own cadence section — then every future session re-arms the check unprompted.

## New in v3.3

- **A dashboard you can actually read** (above) — one self-contained page per project showing
  planned beside built, in plain language, with a completion meter computed from the rows so it
  can never overstate them. Generated at `init`, refreshed by every audit, opened on request.
- **Two voices per step.** What it gives a real person by default; every acronym, path and commit
  hash behind a *"Want the technical specs?"* disclosure. The plain wording is written **once**
  into the plan (a new `IN PLAIN WORDS` field per stage) so it can't drift between reports.
- **Build history worth reading.** Start and finish times derived from commit dates, plus five new
  stage slots — reviews, bugs, and anything **skipped** — filled by the commit series that
  finishes the work. Anything absent renders as `not recorded`; nothing is ever estimated.
- **A verdict that looks like what it says.** Verdict panels take their colour from the verdict,
  so "off course" stops rendering in the same calm tone as "on track".
- **The no-plan state is honest.** When no admissible plan exists, the meter is hidden and the
  goal is relabelled — the page cannot show a completion percentage for a plan it just rejected.
- **A bundled checker with real teeth** — with `--ssot` it proves the quoted goal appears verbatim
  in your plan and that every step on the page exists there, so an invented dashboard fails. It
  runs untrusted page code in a sandboxed process with no filesystem access.
- **Audit-rule fixes found by adversarial cross-model review:** the ratified path now runs the
  authorship test (an agent-written plan can no longer pass as user-ratified on document quality
  alone); scope movement is judged by the quote fingerprint, never a file blob, so routine
  bookkeeping can't trigger the strongest stop verdict; write permission is stated in exactly one
  place; and the verdict grammar now has a rule that generates every legal combination.

## New in v3.2

- **`/did-we-drift init`** — start audit-ready. One command after planning, before building:
  produces the ratified baseline document future audits measure against, with the user's
  finish-line sentence provably their own (verbatim words in a dedicated commit, verifiable by
  `git log` from any machine, any vendor).
- **A ratification that can't be forged or hollow.** Typing your sentence earns full RATIFIED
  standing; a reflex "adopt it" is recorded honestly as provisional — and the difference is
  stated out loud at the moment of choice, never discovered later.
- **Init never grades itself.** No verdict, no audit stamp — a receipt, plus the printed report a
  fresh independent audit is expected to return.
- **Governance boundary for existing work**: commits that predate init are dispositioned behind a
  dated line, never retroactively graded against the new goal.
- **Best-practices path documented** (above) — the thirty-second habit that makes the entire
  recovery machinery unnecessary.

## New in v3.1

- **Authorship is checked, not assumed.** Every candidate goal is classified `USER-RATIFIED` /
  `UNKNOWN` / `AGENT-DRAFTED` on mechanical git evidence — catching the case where you asked an
  agent to write the directive and no human-authored goal was ever created.
- **Basis recovery** for projects that never wrote a plan: a one-minute exit (candidates, what's
  built, one question), with full archaeology as opt-in escalation.
- **Ratification governs forward.** A goal you ratify today does not retroactively govern last
  month's commits; prior work is reconciled behind a dated boundary, never graded across it.
- **Conversation logs are a memory aid, never a source.** Never globbed, never quoted into any
  artifact, never a basis.
- **`UNKNOWN` authorship is admissible.** Not knowing who wrote your plan is the ordinary state
  of a real project — it earns a provisional verdict, not a refusal.

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

v3.1's authorship check was reviewed by two independent reviewers from different model families
before implementation, then tested against a repo whose governing directive was written by an
agent at the user's request — impeccable-looking, dated, falsifiable, and saying "do not invent
new scope." The first implementation **failed its own regression test**: two of its six tells had
no discriminating power (one fired on any goal containing a stop condition, the other on any plan
committed in a single commit — both ordinary human behaviour), and it convicted a genuine user
directive. Shipping it would have re-broken the case v3 exists to fix. The tells were narrowed to
the three that actually discriminate, and the check now requires a matched pair to pass: the
agent-written directive rejected, the genuine one accepted, on the same run of the same code.
A gate that convicts everyone is not a gate.

v3.2's init went through the same wringer. Two independent pre-implementation reviews killed
three pieces of the original design — a genesis stamp that fabricated an audit that never ran, a
self-check where the author certified its own work, and an adoption shortcut. The first
implementation then **failed its most important test**: a simulated user in a hurry, replying
only "yes" and "adopt 1," walked away with full user-authorship credit — laundering, one level
removed, through text the agent itself had drafted earlier. The fix requires the authorship test
to run on the *source* of any adopted sentence, not just the reply. On the re-test, the hurried
user got an honest provisional baseline and was told so at the moment of choice. The chained
proof then ran end-to-end: init on one fixture, followed by an *unprimed* auditor from a
different model family that was never told init had run — it independently discovered the basis,
verified the ratification commit by hash, and returned `Baseline: RATIFIED`. One test agent also
caught and fixed a defect in its own output mid-run, and refused to fabricate history to make a
pattern match — behaviors the text now encodes.

## License

MIT — see [LICENSE](LICENSE). Built by [DontSleepOnAI](https://dontsleeponai.com).
