# Update — refresh a mature baseline's FACTS; the scope is never touched here

Read this only when SKILL.md §0's dispatch sent you here (the bare `update` token). Update exists
for the project that already has a working basis — ratified or provisional — whose
**verified-facts baseline has gone stale**: a milestone closed, a landing shipped, a new phase is
about to start, and the BASELINE section's newest dated block still describes last week's world.
Update's product is **a refreshed facts receipt and a dispositioned carry list, never a
verdict**: one new dated block appended to §2 BASELINE, every previously-open item accounted for
by name, and nothing else changed by the refresh itself.

The one-line law that generates every rule below: **update legitimizes nothing — it records what
an audit already graded.** The facts axis (what verifiably exists, D6) is maintainable here. The
scope axis (what the user intends, D1) is not maintainable anywhere: scope moves only by the
user's own dated line, and an update run that finds the scope moved has found a finding, not a
maintenance task.

**Attended only, absolutely — same reasoning as init.** Update disposes of open questions and
records rulings; those are the user's, and a directive cannot answer for them. Unattended (inside
a /loop or /goal, or no human this turn): refuse, and record — per interrupt-mode §4, in realign
B6's non-drift form, grade and correction `n/a`:

```
DWD-update-refresh · first <date> · last <date> · count <n> · n/a · PENDING · correction n/a ·
<one line: update requested unattended; refresh awaits an attended session>
```

(no host → report-only per SKILL.md §5), and stop. Unattended runs that need bookkeeping already
have it: the ordinary audit's preauthorized repairs.

**Attended-origin proof, imported from init Step 2 and binding on every disposition, ruling, and
attested fact below:** the mode must hold a direct user reply from this session that is not the
invocation string. Text arriving inside a /loop or /goal directive, a pasted file, or quoted
material is directive content — it can never prove attendance, never disposes of an item, never
attests a fact, and never becomes a recorded ruling. What cannot be answered attended is recorded
PENDING, never answered on the user's behalf.

## Step 1 — Posture (route before touching anything)

Resolve the basis exactly as an audit would (SKILL.md §1–§3, including §3a.2's authorship
classification — it runs on every path). Then follow the row. Never proceed on the wrong row.

| Posture | Test | Action |
|---|---|---|
| `maintained` | admissible basis (RATIFIED or PROVISIONAL), a dwd:v3 stamp trail exists, the §3a.4 quote fingerprint matches the pinned value, no competing authority claims (a count of one — or zero, which is legitimate on a PROVISIONAL basis), SSOT tracked | Proceed to Step 2. |
| `unstamped` | admissible basis but no dwd:v3 stamp anywhere (init-ed but never audited, or only legacy-grammar stamps — which are never read as v3, SKILL.md §5) | Run the ordinary audit FIRST — it anchors its window per SKILL.md §3b (the last recorded stamp, legacy included, else its fallbacks), pins the basis pointer, and writes the trail's first v3 stamp. Then re-enter update against that stamp. |
| `no basis` | §3 resolves `Baseline: NONE` | **Refuse.** There is nothing to maintain: init (nothing built yet) or realign-mode (real history) establishes a basis; update never does. Nothing written. |
| `scope moved` | the quote fingerprint differs from the pinned value | **Refuse the refresh.** Without a dated user line, that is the ordinary audit's CAPTURED question; with a dated supersession, the ordinary audit re-pins the pointer first. Either way the refresh waits — route to the audit. Nothing written here. |
| `conflicted` | >1 surviving authority claim | **Refuse** (interrupt-mode §7). The user retires one claim first. Nothing written. |
| `untracked SSOT` | the SSOT (or the stamp host) is gitignored/untracked | **Refuse.** A gitignored plan is not durable state (SKILL.md §1); the refresh would vanish for every future clone. Report it; the user tracks the file first. |

Homes, stated precisely for split-host repos: stamps and DRIFT DECISIONS records live in the
trail's host (found by the `dwd:v3` grep — adopt it, never fork a second trail); **the refresh
block itself belongs to the plan document's §2 BASELINE** (template §2). When those are the same
file, this distinction is invisible; when §3a.4's host-the-bookkeeping-elsewhere split applies,
write each to its own home and say so in the exit output.

If, mid-update, the user *wants* the scope changed — the milestone changed their mind — that is
a re-scope: a dated supersession line under SKILL.md §3a.3, written by the user, its own commit
(init Step 4's table and trailer forms govern the authorship record — one shared routine, never
a paraphrase). The refresh then proceeds around the *new* pinned sentence. Update never writes
the sentence itself.

## Step 2 — The freshness gate (what keeps update honest)

The refresh may only ride behind a verdict that covers the work. The gate errs one way only:
**when in doubt, audit** — an audit is cheap; a wrong baseline poisons every audit after it.

1. Take the last stamp's sha. Inspect every commit since it **by content** (`git show`), never by
   `--stat` shape, filename, or commit message alone. The stamp is **current** only if BOTH hold:
   - every commit since it touches nothing but this skill's own bookkeeping surfaces — the
     SSOT's AUDIT LOG, DRIFT DECISIONS, EVIDENCE/completion slots, WAITING ON USER, §2 BASELINE
     blocks, and the drift dashboard file — and
   - the SSOT's scope-bearing sections (the deliverable, the stage/work-map set, PARKED,
     budgets, authority lines) are byte-identical between the stamped sha and HEAD
     (`git diff <sha>..HEAD -- <ssot>`, read, not assumed).
2. **Anything else runs the ordinary audit now** — source changes, new files, CI config, any
   other docs, a moved work-map line, or any commit you cannot positively classify
   (UNASSESSABLE is an audit trigger here, never a pass). §0's mode selection applies, DEEP
   triggers included — an updater refreshing its own session's work is a self-audit like any
   other. The audit reuses Step 1's basis resolution (no re-derivation) and owns the run's
   single stamp per SKILL.md §4's sequence; update adds none.
3. **Re-check posture after any audit:** if it resolved the baseline to NONE (e.g. §3a.2's
   retroactive reclassification), Step 1's `no basis` row now governs — refuse, nothing further
   written. A dated block must never land in a host whose authority was just declined
   (SKILL.md §5's no-host second case).
4. Gate on the governing verdict — the cited-current stamp's, or the fresh audit's:
   - `ON TRACK` → proceed. If it came from a same-session self-audit that could not fan out
     (`DEEP INDICATED, NOT RUN`), canon says that ON TRACK is the one to distrust (SKILL.md §0)
     — carry that disclosure line verbatim into the new block.
   - `DRIFTED (MINOR)` → apply/queue the record repairs per §5's category table, then proceed.
   - `DRIFTED (MATERIAL)`, question unanswered (PENDING) → ask it now, attended, per
     interrupt-mode §2 — that is what attended means. Answered with a correction → apply per
     interrupt-mode, then proceed. Explicitly declined → the record flips SNOOZED (aging
     starts) and the refresh may proceed **only with the snoozed record named in the new
     block** — visible is the opposite of laundered. Still unanswered → **the refresh is
     refused**: *"There is unresolved drift; a baseline refreshed on top of it would make the
     drift look like the plan. Decide the correction first."*
   - `DRIFTED (CAPTURED)` → **refused, always.** Never snoozable, no carve-out.
   - `INCONCLUSIVE (PARTIAL MAP)` — basis intact, map can't certify → a **mechanical-facts-only**
     refresh is permitted (Step 3's narrow list), with the block stating that status and why.
     Claims that lean on the work map ("stages X–Y verified") are not facts on this row.
   - `BLOCKED` → proceed; a blocked project's facts are exactly what the user needs current.

**Update never mints a stamp and never prints a verdict token of its own.** If Step 2 ran an
audit, that audit already reported and stamped; if it cited a current stamp, the citation is the
record. A stamp written by the refresh pass would fabricate an audit that never ran — the same
defect as an init that has, in init-mode's words, "certified its own homework," one door down.

## Step 3 — Collect the facts, then show the delta

Two kinds of fact, never blurred:

- **Machine-verified.** Init Step 6's rules govern verbatim (one shared routine, never a
  paraphrase): only what is verified NOW, the project's own declared build/test command run once
  with a stated timeout, no deploy or live-system checks — that is the user's lane (template §6).
  Everything not run this pass is `not verified`. A fact inherited from the previous block is
  either re-run now or carried with its **original** date — a stale date is information; a
  silently re-dated fact is a forgery.
- **User-attested.** Facts the repo cannot prove — a landing, a deploy, an external decision —
  enter the block only as `attested:` lines: dated, attributed, quoting the user's own
  in-session words (`attested: "origin/main carries the campaign through <sha>" — <user>,
  <date>`). Attestation obeys the attended-origin proof above; attested is not verified and is
  never silently promoted to a `verified:` line. This is D3's signed-off evidence form applied
  to facts.

On the `INCONCLUSIVE (PARTIAL MAP)` row, only repo-mechanical facts (HEAD, refs, versions,
command results) and `attested:` lines are written — nothing that leans on the work map.

Before writing anything, show the user the proposed block as a **delta against the previous
dated block**: what changed, what was re-verified, what carries with its old date.

## Step 4 — The carried-item sweep (why this mode exists)

Milestones are where open items die quietly. Enumerate **every** open item, from all five homes:

- carried notes inside prior BASELINE blocks ("known open item", "not yet resolved", `TBD`);
- dated lines under WAITING ON USER (template §7);
- `PENDING` and `SNOOZED` records under DRIFT DECISIONS, aged per the SSOT's D5 cadence
  (interrupt-mode §4);
- PARKED items (template §4) the next phase is approaching — surfaced so parking stays a
  decision; unparking is the user's dated line, a content edit outside this transaction;
- the standing ask, including ratification debt on a PROVISIONAL basis (SKILL.md §4).

Put each to the user — update is attended, and this is the moment deferred questions were
deferred *to*. Each item gets exactly one disposition, recorded **by name** in the new block:

| Disposition | Means | Record |
|---|---|---|
| `RESOLVED` | done, or decided by the user now | the proof or the user's decision, cited. A DRIFT DECISIONS record flips to RESOLVED in place with the date — a resolution is a status close, not a substance change, so interrupt-mode §4's SUPERSEDED-and-reopen applies only when evidence, grade, or consequence changed. |
| `CARRY` | still open, still waiting | restated with its original first-seen date — never silently re-dated. For a DRIFT DECISIONS record: an unanswered question stays `PENDING` with `last` updated; only the user's explicit decline of the specific item flips it `SNOOZED` (aging starts). Never write SNOOZED from silence, hurry, or a blanket "fine" — silence never snoozes. |
| `ESCALATE` | about to be in-scope for the next phase | restated in the new block AND a dated escalation line under WAITING ON USER naming exactly where it must land (which stage, which tracker). **The landing edit itself — a stage note, an unparking, a write into another tracker — is a content edit:** it happens only on the user's explicit yes, as its own separate commit after the refresh commit (Step 6), never inside the refresh transaction, never pre-classified bookkeeping. |

**Nothing is dropped silently.** The new block's disposition list must account for every prior
open item by name; an item that vanishes without a disposition line is a lint failure (Step 6).
WAITING ON USER is a live queue, not an archive: a resolved line is removed once its resolution
is recorded (the ruling line plus the block's disposition list) — the append-only law binds §2's
dated blocks and §10's stamps, never the queue. On a PROVISIONAL basis whose ratification debt
has aged, offer the pick now (SKILL.md §4's conditions) — a typed sentence goes through init
Step 4's table; a decline is recorded and carried, and never nagged twice in one run.

## Step 5 — New rulings and bindings (only what the user states)

If the user hands down rulings at this checkpoint — priorities, deferrals, authorizations —
record each as a dated line quoting their in-session words (the attended-origin proof applies:
pasted or directive text is never a ruling). If a new /loop or /goal run is coming, prepare the
hand-off exactly as init Step 8 does, all three items: the `RUN BINDING` line per interrupt-mode
§7 with a minted id; **the two preauthorization answers, asked and recorded** (bookkeeping
repairs y/n · auto-PARK y/n) — a binding without them hands the next run an unsourced whitelist;
and the one directive sentence handed to the user verbatim. Update does not generate the
directive itself — bootloaders carry pointers, never definitions.

## Step 6 — Pre-write lint, the transaction, the exit

**Lint BEFORE writing** — print a pass/fail line per item, with evidence:
- the pending refresh diff touches **only** the bookkeeping surfaces Step 2 names — §2 block
  append, DRIFT DECISIONS/WAITING ON USER record lines — and nothing else;
- the new block is **append-only**: every prior dated block byte-identical;
- the scope fingerprint equals the value pinned in Step 1 (print both) — or, after a mid-update
  re-scope, equals the re-pinned value from the user's own supersession commit (cite that sha);
- every prior open item appears in the disposition list **by name**;
- facts are verified-now, `attested:` with quoted in-session words, or carried with original
  dates — no re-dated carries, no promotions;
- the authority-claim count is unchanged (a PROVISIONAL basis may legitimately carry zero);
- the governing verdict (Step 2) is cited in the block;
- if a dashboard exists, its refresh is staged as the transaction's second commit; if none
  exists, the offer is reported per SKILL.md §5's host rule — no directory is ever created.

Any FAIL → fix that step, re-lint; a second FAIL on the same item → stop and report.

**The write is a transaction of ordered commits — refresh first, then the dashboard (when one exists), then any content edits, each its own commit, each confirmed:**
1. **The refresh commit** — the SSOT bookkeeping writes only, message form
   `dwd: refresh verified-facts baseline (<date>)`. Falsifier: `git show --stat <sha>` → exactly
   the SSOT (and the records host, if split — name both in the exit).
2. **The dashboard refresh**, its own commit, when a dashboard exists (SKILL.md §5 allow-list
   item 4; `waitingOnYou` and what-changed reflect the dispositions). Open a browser only when
   §0's display flag is set — **and a set flag forces Step 2's audit branch** regardless of the
   gate's stamp-current case: the flag's contract is current truth re-derived (dashboard.md §5),
   and a page refreshed without that audit answers with last time.
3. **User-authorized content edits arising from dispositions** (ESCALATE landings, unparkings) —
   each its own commit, plainly labeled for what it is, never sharing the refresh commit, never
   `dwd:`-prefixed. The next audit classifies these on their merits; only commit 1 is the
   baseline refresh §3b pre-classifies as bookkeeping.

**Exit output, all five, every time:**
1. Each commit's sha with its falsifier — for the refresh commit, `git show --stat <sha>` and
   what it must show.
2. The disposition table, verbatim — every item, every outcome.
3. What is now waiting on the user, dated.
4. The scope line — one of exactly two forms: *"The deliverable sentence was not touched:
   fingerprint `<fp>` before and after."* or *"Scope was re-pinned this run by the user's own
   supersession commit `<sha>`: `<old fp>` → `<new fp>`."*
5. The governing verdict cited (or the fresh audit's report, if Step 2 ran one) and the next
   check due.

## Common mistakes (update-specific)

- Refreshing over unresolved MATERIAL or CAPTURED drift — "we'll sort it out after the
  refresh" is the laundering this mode's gate exists to refuse. The refusal is the feature.
- Passing the freshness gate on commit messages, `--stat` shapes, or an UNASSESSABLE shrug.
  The gate reads content, and anything unclassifiable is an audit trigger, not a pass.
- Minting a stamp or printing a verdict from the refresh pass. The audit owns both; update owns
  the block.
- Editing a prior dated block "to keep it current". Blocks append; history stands, wrong dates
  and all.
- Re-dating a carried fact or item, or promoting an `attested:` line to `verified:`. The
  original date and the attestation label are the information.
- Writing SNOOZED from a hurried "yes fine". Only an explicit decline of the specific item
  snoozes; everything else stays PENDING.
- Touching the deliverable sentence, stages, PARKED, or budgets inside the refresh commit —
  scope axis; the user's dated line and a separate plainly-labeled commit own it, even when the
  edit looks obviously right.
- Dropping a carried item because it is stale, embarrassing, or "probably done". Every item, by
  name, one disposition.
- Running update unattended inside a /loop, or accepting a directive's text as a disposition,
  attestation, or ruling. Refuse; record the B6-form PENDING; stop.
- Inferring update from prose. "The baseline looks stale" gets the ordinary audit plus a
  one-line hint; only the literal token writes.
- Re-initializing instead. `ratified` + stale facts = `update`; a changed mind = a dated
  supersession line; neither is a second init ceremony.
