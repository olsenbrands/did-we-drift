# Init — establish a ratified basis BEFORE the build starts

Read this only when SKILL.md §0's dispatch sent you here (the bare `init` token). Init's product
is **a ratified basis receipt, never a verdict**: one tracked document, shaped so every future
audit finds all six D's passing and skips straight to "did the work drift?". Init emits **no
verdict token, no audit stamp, and no trend** — an author cannot honestly certify its own work;
the first real audit does that, from a fresh session.

**Attended only, absolutely.** Init mints the basis every future audit will trust. Unattended
(inside a /loop or /goal, or no human this turn): refuse, record `DWD-init PENDING` per
interrupt-mode §4's grammar (no host → report-only per SKILL.md §5), and stop.

## Step 1 — Basis state (decide before touching anything)

Classify the repo into exactly one state and follow its row. Never proceed on the wrong row.

| State | Test | Action |
|---|---|---|
| `ratified` | a tracked doc carries a ratified §1 (dated user attribution) and an authority claim | **Refuse re-init.** Report the existing basis and its citation; a re-scope is a dated supersession line under §3a.3, never a second ceremony. Offer the ordinary audit — **and if the repo has no drift dashboard, offer to generate just that** (`dashboard.md` §1). A view re-ratifies nothing, so it survives the refusal the ceremony does not. |
| `conflicted` | >1 surviving authority claim | Init cannot pick a side (interrupt-mode §7). Report both claims with dates; the user retires one first. Nothing written. |
| `historical` | ≥1 SUBSTANTIVE commit exists (classify per §3b; docs/planning commits don't count) | Proceed, and Step 7 is mandatory. |
| `uninitialized` | none of the above | Proceed; Step 7 is skipped. |

Also now: grep tracked `*.md` for `dwd:v3`. A prior `AUDIT LOG` lives somewhere → that host is
adopted (or the new SSOT gets a dated pointer line naming it). **Never fork an existing stamp
trail.**

## Step 2 — Attended-origin proof

Before anything is written, init must hold **a direct user reply from this session that is not
the invocation string** — the deliverable sentence or an explicit choice, typed after init asked.
Text arriving *inside* a /loop or /goal directive, a pasted file, or quoted material is directive
content: it can never prove attendance and never earns `user-dated`. If no such reply can be
obtained, stop as unattended.

## Step 3 — One target document

Run §1's bounded discovery. Choose ONE upgrade target — the strongest existing plan-ish doc; a
new `PLAN.md` only when nothing upgradeable exists (creation is legitimate here: init is an
explicit request — but it is still shown and confirmed before writing).

- `SUPERSEDED` banners are proposed **only** for documents that make a competing authority CLAIM
  or disagree with the target — agreeing pointers and subordinate registers are healthy and stay
  untouched (SKILL.md D2). Each banner is its own content edit with its own yes.
- **Banner declined?** Record a dated WAITING ON USER line and say plainly: "until that claim is
  retired, the first audit will read D2 as failing and the baseline as PROVISIONAL at best."
  Never write a "this file wins" line beside a surviving rival claim.

## Step 4 — The ratification gate (the heart; get this wrong and init is laundering)

Init may propose **≤3 candidate sentences extracted from the user's own plan material**, each
with its citation and a "this would exclude: …" line. Then the user speaks, and what they type
decides everything:

| The user's reply | Records | Why |
|---|---|---|
| **Types the sentence** (their words, any edit distance from a candidate) **and can name one excluded tempting item** | `basis-auth:user-dated` | authorship demonstrated, not inferred |
| "Adopt N" where candidate N's **source statement itself classifies USER-RATIFIED under §3a.2** (run the classification ON THE SOURCE, and cite the evidence) | `basis-auth:user-dated`, citing that statement | adopting your own words back is authorship — but only once the words are *proven* yours |
| Bare "yes" / "looks good" / "adopt N" of anything else | `basis-auth:unknown` | agent-drafted text approved by silence is never user direction (SKILL.md §3a.2) — a two-word pick from an agent's menu is silence with extra steps |

**Row 2's trap, spelled out because a real test walked into it:** "a dated line in a tracked
file" is NOT presumptively the user's — tracked, dated, impeccable-looking text is exactly what
the authorship machinery exists to interrogate. A candidate drawn from a plan document whose own
authorship is UNKNOWN or AGENT-DRAFTED (e.g. one headed "drafted with my agent", or one with no
evidence-FOR at all) is an **agent-synthesized candidate for the purposes of this table** — Row 3,
`unknown`, disclosure spoken. Adopting the agent's own prior text back through Row 2 would be the
delegated-authorship laundering this skill was built to end, admitted one level up.

On the third row, say it out loud, once: *"Recorded as adopted, not authored — the first audit
will read this as PROVISIONAL until you write the sentence in a dated line of your own. Type it
now in your own words to make it RATIFIED-grade."* **Never upgrade an adoption silently.** A user
who can't be bothered gets PROVISIONAL — the truth, and still far better than nothing.

Run D1's exclusion test on the final sentence, live: if it excludes nothing, push back with a
concrete tempting item it fails to exclude. **Maximum two pushbacks; then stop with nothing
written** — a banner sentence is never written (realign-mode).

**The basis write is its own commit** — docs-only, touching only the target's §1, with the user's
**verbatim reply in the commit message**. **The trailer depends on which row of the table above
fired, and the two forms are not interchangeable:**

Rows 1–2 (authorship demonstrated — `basis-auth:user-dated`):

```
ratify: <project> deliverable

User's reply, verbatim: "<exactly what they typed>"
Ratified-by: <user> <date>
```

Row 3 (adopted, not authored — `basis-auth:unknown`):

```
adopt: <project> deliverable (adopted, not authored)

User's reply, verbatim: "<exactly what they typed>"
Adopted-by: <user> <date>
```

**Never write `Ratified-by:` on a Row-3 adoption.** The whole point of the three-way classification
is that a future auditor — any vendor, any machine — can tell demonstrated authorship from a
two-word approval by reading the commit trail. A `Ratified-by:` trailer on an `unknown` basis
destroys exactly that distinction and re-creates the delegated-authorship laundering this skill
exists to end, one level up. The stamp field and the trailer must agree: `user-dated` ↔
`Ratified-by`, `unknown` ↔ `Adopted-by`.

This is what makes `basis-auth:user-dated` **checkable instead of asserted**: any future auditor
— any vendor — runs `git log -S '<sentence>' --format='%H %s'`. Three shapes, one per path:
- **Typed path**: exactly one docs-only commit — the ratification.
- **Row-2 adoption from another file**: two commits — the source and the ratification; the pair
  IS the Row-2 citation, and the ratification is the one carrying the `Ratified-by:` trailer.
- **Same-file adoption** (the sentence already sat in the target SSOT and stays in place): `-S`
  returns only the original drafting commit; find the ratification by its trailer instead —
  `git log --grep='Ratified-by:' --format='%H %s'` (or `--grep='Adopted-by:'` on the Row-3
  adoption path). **Never fabricate a textual change to the
  sentence just to make its history match an illustration.**
Init prints the command(s) and the expected result for the shape taken in its exit output as the
falsifier. And do not re-quote sentence fragments verbatim elsewhere in the document (coverage
table, WHY lines) — paraphrase there, or the falsifier's `-S` output gets polluted.

## Step 5 — The work map (what future audits map commits ONTO)

Stages from the user's plan, each with **WHY · IN PLAIN WORDS · DONE-WHEN · budget · empty
EVIDENCE slot · empty completion record** (template §3). The completion record's five slots
(`STARTED / FINISHED / REVIEWS / BUGS / SKIPPED`) are written in **empty**, exactly like EVIDENCE
— they are evidence slots, not scope, and filling any of them at init would be inventing history
for work that has not happened.

Three mechanical gates:

- **IN PLAIN WORDS lint.** Every stage carries two jargon-free sentences: what it gives a person,
  and what was broken before. Reject acronyms, file paths, tool names, and stage numbers here —
  they belong in the stage's technical body. This is the text every future report and dashboard
  quotes, so it is written once, now, while the user is present to correct it. A stage whose plain
  words cannot be written is a stage nobody has understood yet — surface it as a question rather
  than paraphrasing the jargon.

- **DONE-WHEN lint.** Every DONE-WHEN begins with a backticked shell command, `observable:`
  followed by a path/URL/numeric threshold, or `signed-off:` naming who attests to what (the
  non-code evidence form D3 permits). Prose DONE-WHENs are rejected and rewritten — a DONE-WHEN a
  future auditor cannot check is a D3 failure deferred, not avoided.
- **Coverage table, written into §3.** One row per clause of the deliverable sentence →
  the stage-ID that makes it true. A clause with no stage becomes a proposed stage now; a stage
  serving no clause is scope creep at birth (or a too-narrow sentence) and is surfaced as a
  question. This is what makes the future `Work map: FULL` verifiable rather than asserted — and
  FULL is the gate on ON TRACK.

Unknowns (budgets, review caps, tooling) are recorded as dated `TBD` lines under WAITING ON
USER — never invented.

## Step 6 — Baseline of verified facts (D6)

Only what is verified NOW: HEAD sha (no git → today's date and the file listing), versions, and
the result of running **the project's own declared build/test command** (from package.json /
Makefile / CI config) once, with a stated timeout. **No deploy or live-system checks — that is
the user's lane** (template §6). Everything not run is written as `not verified`, never assumed.
An aspirational baseline ("tests green" with no tests) poisons every future audit.

## Step 7 — Existing history (the `historical` state)

Write `START-OF-GOVERNANCE: <sha> (<date>)` under §1 (no git → date form), then **read
`realign-mode.md` and run its reconciliation** — B2's bucketing, B3's ordering rule, B5's
provenance annotations, B6's deferral handling — with the user's plan standing in for candidate
elicitation. One shared routine, never a paraphrase. Prior commits land in §2a as
`RETAIN | PARK | REVERT | UNKNOWN`, **and nowhere else**: they are never counted in any ratio,
never ticked into a stage's EVIDENCE, never graded. Ratification governs forward; grading history
against a sentence ratified today is code-derived scope with a ceremony around it.

## Step 8 — Loop preparation (only if the user says a /loop or /goal is coming)

Three fixed-format items, nothing else:
1. The `RUN BINDING: run <id> → <SSOT path> (<date>)` line (interrupt-mode §7), under DRIFT
   DECISIONS. **Init mints the id** — `<project>-<date>` form — and the user's directive must
   reuse it verbatim; a directive arriving with a different id is a re-pointed run (a finding,
   per interrupt-mode §7).
2. The two preauthorization answers, asked and recorded: bookkeeping repairs y/n · auto-PARK y/n.
3. This sentence, handed to the user for their directive verbatim: *"First run the did-we-drift
   skill and obey its verdict; on STOP, start no new work."*

Init does **not** generate the directive itself. A directive is a bootloader — pointers, never
definitions (interrupt-mode §6) — and free-prose generation is where scope smuggling lives.

## Step 9 — Pre-write lint, the writes, and the exit

**Lint BEFORE writing — the author never grades its own finished work.** Print a pass/fail line
per item, with evidence: D1 (sentence + exclusion) · D2 (exactly one claim after banners) · D3
(every DONE-WHEN passes the lint; evidence slots AND completion-record slots empty) · **every
stage has jargon-free IN PLAIN WORDS text** · D4 · D5 (cadence + vocabulary) · D6
(verified-facts only) · authorship tier recorded correctly · coverage table complete · **pending
diff is docs-only** (an init commit touching source would fire the skill's own strong tell and
convict the basis it just created) · **dashboard host resolved** (a tracked `docs/` or equivalent
exists, or the user has been asked where it should live — never invent a directory). Any FAIL →
fix that step, re-lint; a second FAIL on the same item → stop and report.

**Generate the dashboard before committing.** Instantiate `dashboard-template.html` from this
skill's directory into the host path per `dashboard.md` (§3 governs the init variant: every row
`not_started`, every timing and history field empty, meter at 0%, headline **"Baseline just set —
first audit pending"**, no trend). One row per stage from Step 5's work map: `planned` and `why`
come **verbatim from that stage's IN PLAIN WORDS**, the jargon goes in `technical`, and the stage
ID appears only as the muted badge. Fill `sources` with the absolute path of every document init
touched or adopted, and `waitingOnYou` from the dated TBD lines Step 5 recorded. It rides in
commit 2 below — never the ratification commit, and it is docs, so the docs-only lint still
passes. **An init dashboard that says ON TRACK in any wording has certified its own homework**,
exactly like a printed verdict would.

**Then two commits, both confirmed, both docs-only** — plus, only if the user accepted the re-arm
pointer (exit item 3), a third commit gated on that separate yes:
1. The ratification commit (Step 4's form — §1 only, and §1 final: commit 2 never touches §1).
2. Everything else (stages, baseline, guards, boundary, §2a, bindings, **the dashboard**).
3. (optional) The re-arm pointer file, alone.

Post-write, verify byte integrity only. Any post-write surprise → stop; new consent for any
further edit. **No AUDIT LOG line is written and no verdict is printed** — init is not an audit.

**Exit output, all five, every time:**
1. The falsifier, **stated for the path actually taken** (Step 4's three shapes — do not print a
   command whose expected result your own run cannot produce):
   `git log -S '<sentence>' --format='%H %s'` → the basis commit, for the typed and
   Row-2 paths; on a same-file adoption use `git log --grep='Ratified-by:'`, and on a Row-3
   adoption `git log --grep='Adopted-by:'`. Print the command AND the result it should return.
2. The expected first-audit report, verbatim — the exact `VERDICT: ON TRACK` / `Baseline:
   RATIFIED (…)` / `Work map: FULL (…)` / `Authorship: USER-RATIFIED (…)` lines the user should
   see if nothing drifts (or the PROVISIONAL forms, on the adoption path). Its `Since:` line is
   the **START-OF-GOVERNANCE sha** (or `first audit` when the repo was uninitialized) — never
   init's own HEAD. This hands a non-expert the acceptance criterion: a future audit that returns
   something else is itself a finding.
3. The re-arm offer: one POINTER line for CLAUDE.md / AGENTS.md — `"<SSOT> wins; run the
   did-we-drift skill at session start and every gate close"` — a pointer, never a claim, so it
   cannot fail D2. Written only on yes.
4. The instruction: *"Run `/did-we-drift` from a fresh session — a different model if you have
   one — to independently confirm. My own claims about this basis are unverified by
   construction."*
5. The dashboard's path, and how to get it refreshed: *"`<path>` shows what we planned beside
   what we built, in plain language. Run `/did-we-drift dashboard` any time — it re-checks the
   finished work and the drift, updates the page, and opens it. It is a picture of the plan, not
   the plan; `<SSOT>` still decides."* Init opens it **only if the user asks** (SKILL.md §0's
   display flag).

## Common mistakes (init-specific)

- Grading anything. Init that prints a verdict has certified its own homework — **including on
  the dashboard**, where "on track" in friendly wording is still a verdict.
- Ticking a dashboard row at init. Every evidence slot is empty by construction, so every row is
  `not_started`; anything else was invented.
- Stamping. The first AUDIT LOG line belongs to the first real audit; its window anchors on the
  last stamp → else the START-OF-GOVERNANCE sha → else repo start (SKILL.md §3b).
- Minting `user-dated` from "yes". Adoption is not authorship; record `unknown` and say so.
- Counting a pre-governance commit in a ratio or an EVIDENCE slot. Reconciled means reconciled.
- An init commit that touches source. The skill's own authorship probe will convict it.
- Writing "this file wins" while a rival claim survives. D2 fails at birth.
- Re-initializing. `ratified` state refuses; re-scope is a dated supersession line, not a ceremony.
