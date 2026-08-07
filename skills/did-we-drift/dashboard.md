# The drift dashboard — a plain-language VIEW of the audit

Read this when SKILL.md §4 or init-mode.md Step 9 sends you here. It defines one artifact:
a single self-contained HTML page at `docs/drift-dashboard.html` (or the host the user named)
that answers, for someone who has read none of the planning documents and watched none of the
work: **what were we building, how far along is it, and is it going wrong?**

## 0. The dashboard is a view, never an authority

Non-negotiable, and it is what keeps the dashboard from failing the skill's own D2 check:

- It **never carries authority language** — no "this file wins", no "authoritative", no
  "source of truth". Adding one would manufacture a second D2 claim in the project.
- It is **never a discovery candidate** (§1), **never a scope source** (§3a.1 — it is derived
  from the basis, so treating it as intent is circular), and **never cited** as a basis,
  a citation, or evidence for anything.
- On any disagreement between the dashboard and the SSOT, **the SSOT is right** and the
  dashboard is corrected to match — never the reverse, and never "both are updated to agree".
- Commits that touch only the dashboard classify as **BOOKKEEPING** in §3b, so they never
  enter an unmapped ratio and never count as drift.
- The audit stamp still goes to the SSOT's `## AUDIT LOG` (§5). **A dashboard refresh is never
  a substitute for the stamp** — a page nobody parses is not an audit trail.

## 1. When it fires

| Situation | What happens |
|---|---|
| `/did-we-drift init` completes (typed-sentence path or adoption path) | Generate the dashboard from the template. **No verdict** — §3's init panel. |
| Init refuses because the repo is already `ratified` (init-mode Step 1) | Offer to generate **just the dashboard** if the repo has none. Nothing else is written. |
| Ordinary audit (QUICK or DEEP), dashboard exists | After the verdict is computed, refresh `DASHBOARD_DATA` (§2). Silent — no browser. |
| Ordinary audit, dashboard missing, durable host exists | Generate it from the current audit (§4 covers the never-ran-init case). Say so in one report line. |
| Ordinary audit, dashboard missing, no durable host | Do not create directories. Ask where it should live; report that none was written. |
| **`/did-we-drift dashboard`**, or the user asks to see progress in prose | The full §5 procedure: audit, re-derive **every** row's status, re-run what is runnable, refresh, check, **open**, then report and stamp. |
| `Baseline: NONE` | See §6. The planned column has no honest source; do not invent one. |

**Write authorization.** Generating and refreshing the dashboard is on SKILL.md §5's allow-list
as a **bookkeeping repair (a derived view)** — it needs no separate yes, because it asserts
nothing the SSOT does not already assert. Two things are *not* covered by that allow-list and
still need the user's word: **choosing a host directory that does not exist**, and any edit to
the SSOT the refresh made you want to make. Fix the SSOT through the normal §5 table, then let
the dashboard follow it.

## 2. The refresh — edit `DASHBOARD_DATA` and nothing else

The page renders entirely from one object at the top of its single `<script>` block. A refresh
rewrites values inside that object. **Never restyle, never re-lay-out, never touch the rendering
code below the `END DASHBOARD_DATA` marker** — a user who has learned to read this page should
never have to re-learn it because an auditor redecorated.

**Refresh the schema you find, not the schema you wanted.** A dashboard generated before the
current template will have different field names and may be missing fields entirely. Fill the
fields it has; **never migrate a working page to the template's shape to gain a field** — that
is a layout change wearing a refresh's clothes. Where a field has no home, carry the fact in the
explanation paragraph instead. The template is for pages that do not exist yet.

**The progress meter is computed, never stored.** The template counts row statuses at render
time, so the percentage cannot drift from the rows it describes. There is no percentage field to
set, and adding one would create the disagreement the design removes. Steps are weighted
**equally** and the raw count always shows beside the percentage ("43% built — 3 of 7 steps
finished"); in-progress work is its own bar segment, never counted as half a step.

Field by field, sourced from the audit you just ran:

| Field | Source | Rule |
|---|---|---|
| `baseline.headline` | the program + the meter | one line, the answer first: "Your cockpit redesign is 43% built" |
| `baseline.subheading` | the verdict + counts | one sentence of current state in human terms |
| `baseline.deliverable` | the basis's scope sentence | **quoted verbatim**, never paraphrased, never authored here |
| `baseline.deliverableCitation` | the `Deliverable:` line | path + who ratified it + date |
| `baseline.baselineNote` | the `Baseline:` axis | RATIFIED → "You wrote and confirmed this plan on `<date>`." · PROVISIONAL → "Reconstructed from `<cite>` — you have not confirmed it in your own words yet." |
| `baseline.planStatus` | the `Baseline:` axis | `agreed` (RATIFIED) · `unverified` (PROVISIONAL) · `none` (NONE). **This one changes what the page shows** — §6 |
| `baseline.lastUpdated` | today | every refresh, even a no-op one |
| `sinceLastLook` | the previous stamp | §2f |
| `waitingOnYou` | the SSOT's WAITING ON USER section | §2f |
| `rows[].tag` | the stage/task ID | badge only — never the only thing a row says |
| `rows[].planned` | the work map | plain language (§2c) |
| `rows[].why` | the stage's WHY | the real-world scenario (§2c) |
| `rows[].status` | the evidence slots | §2a — mechanical, never optimistic |
| `rows[].started` `.finished` `.elapsed` `.expected` | git + the stage's slots | §2d |
| `rows[].howItWent` | the stage's slots + review log + deviations | §2d |
| `rows[].evidence` | the SSOT's EVIDENCE slot + §3b sampling | empty when there is none |
| `rows[].technical` | everything jargon | §2c — the only place jargon is allowed |
| `verdict.severity` | the verdict token | §2b — drives the panel colour |
| `verdict.headline` | the verdict token | §2b's translation — the token itself never appears |
| `verdict.explanation` | the findings | one paragraph: what was checked, what it means, what happens next |
| `verdict.stats` | `Trend:` | e.g. `{label: "Work outside the plan", value: "0 of 12 changes"}` |
| `verdict.corrections` | `Corrections (smallest first):` | one line each, plain language |
| `sources` | §1's discovery output | §2e — absolute paths |
| `backlog` | the SSOT's PARKED section | empty `items` hides the section |

### 2a. Status is derived, never guessed

Each status needs an **observable** in the SSOT or the commit log. "Nearly there" is not one.

| Status | Set it when |
|---|---|
| `built` | the stage's box is ticked in the SSOT **and** its EVIDENCE slot is filled **and** that evidence survived §3b sampling (or was not sampled this pass) |
| `partial` | the box is unticked and the stage is observably underway — the SSOT records it open or in-flight (a dated marker, **not** merely appearing on the list), **or** substantive work in the window maps to it. Also: the box is ticked but its evidence failed sampling or came back `EVIDENCE: UNVERIFIABLE` |
| `not_started` | no such observable exists |

Two directions to get wrong, so both are named:

- **A ticked box with broken evidence is `partial`**, with the failure written into the
  `howItWent` line. That is the MINOR record-integrity finding made visible; showing it as Built
  would launder the exact defect the audit just caught.
- **A stage that is merely listed in the plan is `not_started`**, however imminent, and no row
  is ever promoted on intent or momentum. A dispatched work order with a dated open marker in
  the SSOT is `partial` — the marker is the observable, not the enthusiasm. Nothing reaches
  `built` without a ticked box *and* evidence.

**One row per plan row.** If a row's badge covers a group whose boxes disagree — some ticked,
some not — `built` is a claim about all of them. Either split the row to match the plan, or say
in `howItWent` exactly what is not done and where it went (a parked item belongs in the backlog
section, named).

### 2b. Verdict translation — the token never appears on the page

| Verdict | `severity` | `verdict.headline` |
|---|---|---|
| `ON TRACK` | `ok` | "On track — the work matches the plan" |
| `ON TRACK (PROVISIONAL)` | `ok` | "On track against a plan you have not confirmed yet" |
| `DRIFTED (MINOR)` | `warn` | "On course, but the record has gaps" |
| `DRIFTED (MATERIAL)` | `alert` | "Off course — work is happening outside the plan" |
| `DRIFTED (CAPTURED)` | `alert` | "The plan itself changed without your say-so" |
| `INCONCLUSIVE (NONE)` | `neutral` | "Can't tell — there is no agreed plan to measure against" |
| `INCONCLUSIVE (PARTIAL MAP)` | `neutral` | "Can't fully tell — the plan doesn't cover everything being built" |
| `BLOCKED` | `warn` | "Everything is waiting on a decision from you" |

`severity` colours the verdict panel, so a bad answer **looks** different from a good one at a
glance. Never soften a severity to make the page calmer: downgrading `alert` to `warn` because
the finding is awkward to explain is the drift this whole skill exists to catch, committed by
the auditor. Adapt the wording to the project; never invent a *state* the verdict vocabulary
does not have.

### 2c. Two voices, and only one of them is on by default

This is the rule the page lives or dies by. Every row speaks **twice**:

| Field | Voice | Contains |
|---|---|---|
| `planned` | plain | what the step gives a person, in the words they would use |
| `why` | plain | the scenario: what was broken or missing before, and what changes for someone real |
| `howItWent` | plain | how the build actually went — reviews, bugs, anything skipped |
| `evidence` | plain | what proves it, said plainly ("Went out to real users in version beta.17") — **this one is easy to forget: it renders by default, so a raw commit id or test name here defeats the whole rule** |
| `technical` | jargon | everything else: file paths, module names, acronyms, ticket IDs, commit shas, flags, schema, test names, the commands that prove it |

Everything else the reader sees without clicking obeys the plain voice too: the headline, the
subheading, the verdict, the corrections, the waiting-on-you questions, what-changed, and the
backlog. The rule is simply: **if it is visible without opening a disclosure, it is plain.**

**Default view is jargon-free. No exceptions, no "but this one is unavoidably technical".**
If a step genuinely resists plain description, that is a signal the *plan* is written in jargon —
describe the user-visible consequence instead, and put the mechanism in `technical`.

The `why` field carries a **scenario**, not a restatement. Test it: does it name something a
person does, sees, or stops suffering?

- ❌ `planned:` "S1.1 markup + tokens + CSS skeleton, script stubbed"
- ❌ `why:` "This implements the S1.1 stage of the redesign plan." (restates the label)
- ✅ `planned:` "Put the new page's skeleton into the real product — the two-pane layout,
  colours and styles, no behaviour yet"
- ✅ `why:` "Right now the new design only exists as a standalone mock-up nobody can reach.
  After this, the real product opens to the new layout — it just won't do anything yet."
- ✅ `technical:` "Ports PROD markup/CSS from design/cockpit-2026-08/cockpit.html into
  packages/cli/src/cockpit-ui.ts; adds assets/mat-tokens.css; render path stubbed pending the
  S1.2 view-model adapter. Fences: no relay changes, MOCK-marker content never ships."
- ✅ badge: `S1.1`

**`technical` is where the auditor gets to be itself.** Put the checkable specifics there — shas,
paths, commands — because that is what makes the plain-language claim falsifiable rather than
merely friendly.

### 2d. Times and "how it went" — derive what git proves, record the rest

Two sources, in this order. **Anything neither source supplies is written as an empty string and
renders as "not recorded"** — never omitted, never estimated, never inferred from how long a
stage "felt".

**(i) Derive from git now.** These are real and checkable today:

```
# every commit that names the stage, oldest first
git log --reverse --date=format:'%b %-d, %Y, %-l:%M%p' \
        --format='%ad · %h %s' --grep='<STAGE-ID>'
# what the ticking commit touched
git show --stat <sha>
```

- `started` = the author date of the **earliest** commit naming the stage or in its evidence trail.
- `finished` = the author date of the commit that **ticked the box** / filled EVIDENCE.
- `elapsed` = the span between them in a human unit ("took 2 days", "took 3 hours").
- `howItWent` = scraped from the tracker's own **review log** and **deviations** sections when
  they exist, plus revert/fix commits inside the span.

**Say what these times actually measure.** They are commit *author* timestamps — when the work
was recorded, not when a human started thinking, and they survive rebases and can be back-dated.
Never present them as more precise than that, and put the shas in `technical` so the reader can
check them.

**`expected` has no source until a stage carries a budget.** Fill it only from the stage's own
declared budget (`template.md` §3's S/M/L, or an explicit duration), translated to plain words —
`M` → `"expected a few days"`. **If the stage declares no budget, leave `expected` empty.** There
is no honest way to derive it, and a checker that demanded one would be asking an agent to invent
a deadline. Same rule as every other missing fact: absent beats guessed.

**(ii) Record going forward.** So future stages carry the parts git cannot know, each stage in the
SSOT gains five slots alongside EVIDENCE, filled by the same commit-series that finishes the work
(`template.md` §3):

```
STARTED:  <date time>          FINISHED: <date time>
REVIEWS:  <n> rounds           BUGS:     <n> found, <n> fixed
SKIPPED:  <what and why | none>
```

These are **evidence slots, not scope**: empty at init, filled on completion, and a tick with
none of them filled is the same MINOR record defect as a tick with no evidence. When both sources
speak, the recorded slot wins over the derived guess — a human writing "2 review rounds" knows
something `git log` does not.

**`SKIPPED` is the one that earns its place.** A step that shipped with something quietly dropped
is exactly what a progress page normally hides. Surface it in `howItWent`, in plain words, on the
row that claims to be Built.

### 2e. Sources — every document, as a clickable absolute path

`sources` lists the real documents behind the page: the root authority, subordinate trackers, the
audit log's host, the backlog, and any design or work-order document the rows depend on. Each
entry is `{ role, path, href }`:

| Key | Value | Why |
|---|---|---|
| `role` | plain language: what the document is FOR | "LAUNCH-PLAN.md" tells the reader nothing; "The plan everything is measured against" does |
| `path` | the full absolute path | shown as the link text, so it can be copied straight into a terminal |
| `href` | the same file **relative to the dashboard** (`../PLAN.md`) | the actual link target |

**Why the link and the text differ.** The dashboard is usually committed to the repo. An absolute
`file://` link bakes in one machine's home directory, so it dies the moment anyone else opens the
page — while a relative link keeps working everywhere. Showing the absolute path as the *text*
keeps what a person actually wants (something to paste into a terminal) without making the link
itself fragile. Compute `href` with a path-relative operation against the dashboard's own
directory; never hand-build it.

- **Regenerate on every refresh.** Paths move; a dead link is worse than no link. The checker
  confirms every listed document exists.
- **The absolute path still contains a username**, and it is committed. Harmless in a private
  repo; mention it if the project is or may become public, and offer to shorten the displayed
  path to a repo-relative one.
- List the audit-log host explicitly, so the stamp trail is one click away.

### 2f. What changed, and what is waiting on you

**`sinceLastLook`** — `lastCheckedDate` is the previous stamp's date; `changes` is one plain
sentence per thing that moved since it: steps that finished, steps that started, work found
outside the plan, decisions answered. **An empty list still renders** ("Nothing has changed since
then") — a quiet week is information, and hiding the section would make "nothing happened"
indistinguishable from "nobody checked". First audit → leave `lastCheckedDate` empty; the page
says so itself.

**`waitingOnYou`** — one entry per dated item in the SSOT's WAITING ON USER section, plus any
PENDING decision in DRIFT DECISIONS, as `{ since, decision }`. `decision` is written as **the
question the user has to answer**, not as a status label:

- ❌ "UX-6 wording decision pending"
- ✅ "Should pausing the conversation announce itself in the room? It would cost up to three
  paid messages per session."

Empty array hides the section. Never pad it to look thorough.

## 3. The init panel — baseline set, no verdict

Init never grades (init-mode.md). Its dashboard must not either:

- every row `status: "not_started"`, every timing/history field `""` — the slots are empty by
  construction at init, and any other value would be invented;
- rows still carry full `planned`, `why`, and `technical` text — the *plan* is known at init even
  though the progress is not, and this is the moment that text is cheapest to write well;
- `baseline.planStatus`: `"agreed"` on the typed-sentence path, `"unverified"` on the adoption
  path — **never `"none"`**: init only reaches this point because a basis was just established;
- `verdict.severity: "neutral"`, `verdict.headline`: **"Baseline just set — first audit pending"**;
- `verdict.explanation`: what was agreed, that nothing has been measured yet, and that the first
  real check comes from a fresh session;
- `verdict.stats`: `[]`; `sinceLastLook.lastCheckedDate`: `""`;
- `verdict.corrections`: the one real next action, e.g. *"Run the drift check from a fresh
  session to independently confirm this baseline."*
- the meter renders 0% by construction — do not dress it up.

**`ON TRACK` in any wording is forbidden here.** An init dashboard claiming the build is on track
is init certifying its own homework in a nicer font.

Write it in init's **second** commit (Step 9's "everything else"), never the ratification commit,
and never in a commit that touches source.

## 4. The never-ran-init case

A user who never ran init still gets a dashboard: run the ordinary audit to its verdict first,
then build the page from what the audit actually resolved.

- Planned rows come from the **work map** (§3a.5) — the same enumerable set of sanctioned work
  the audit graded against. Never from the commits, never from the code.
- `why` and `technical` are written from the stage's own WHY and DONE-WHEN. Where a stage has no
  WHY, `why` stays empty rather than being invented — and that gap belongs in the report as a D3
  observation.
- `Work map: PARTIAL` → build from the stages that exist, and add one final row with `tag: ""`,
  `planned: "Work being built that the plan does not describe yet"`, `status: "partial"`, and the
  unmapped areas in `howItWent`. That is the PARTIAL rating made visible, not a stage — and it is
  deliberately counted in the meter's denominator, so the percentage cannot look complete while
  unmapped work exists.
- `baseline.baselineNote` carries the PROVISIONAL wording, and `verdict.corrections` leads with
  the ratification ask.

## 5. `/did-we-drift dashboard` — check the work, then show it

The user typing `dashboard` (or asking in prose: "show me the dashboard", "show me what's been
worked on", "are we on track?") is asking one thing: **show me where this really stands, now.**
That is a request for a fresh answer, not a re-render of the last one. It is a display flag, not
a mode — nothing is skipped, and the audit's semantics are untouched.

Run these in order. Do not shortcut to step 5.

**1. Run the ordinary audit, in full.** Window resolution, commit classification, work-map
mapping, basis-history check, verdict — SKILL.md §3b and §4, unchanged. The token adds work; it
never removes any.

**2. Re-derive EVERY row's status, not just the sampled ones.** This is the "double check" the
user is paying for, and it is the one place a dashboard request is stricter than a routine audit.
§3b samples three items by risk; here you walk the whole list, because the user is about to look
at every row and believe it. For each row, re-read the box and the evidence slot in the SSOT and
re-apply §2a. Cheap and bounded — it is reading a tracker, not re-running a build.

Watch for the four things that rot quietly between audits:
- a row still `built` whose evidence no longer resolves (file moved, commit rewritten, test gone);
- a row still `not_started` that quietly began — the SSOT now carries a dated open marker, or
  commits in the window map to it;
- a row still `partial` that actually finished — box ticked and evidence filled since last time;
- a row whose plan text changed, so the page is describing a step that no longer exists.

**3. Re-run the evidence you can actually run.** Anything runnable behind a `built` row gets run,
not read (§3b). What is only inspectable comes back `EVIDENCE: UNVERIFIABLE` and the row drops to
`partial` with the reason in `howItWent`. **A row that cannot be re-verified is never left green
just because it was green last week.**

**4. Refresh `DASHBOARD_DATA` completely** (§2): statuses, evidence, timings and build history,
what changed since the last stamp, waiting-on-you, the verdict panel and its severity, the
corrections, the stats, the source links, and `lastUpdated`. Then **run the checker** (§9) —
including `--ssot`, since you have the plan paths in hand from step 1. A dashboard you are about
to put in front of someone is exactly the one worth verifying.

**5. Open it.** `open <path>` on macOS; `xdg-open` on Linux; `start` on Windows.

**6. Still print the §4 report and write the §5 stamp.** The page is the view; the report and the
stamp are the audit. Opening a browser never replaces either, and "I showed you the dashboard" is
not an audit trail.

Then say, in two or three sentences, **what changed since they last looked and what needs them** —
the same content as the page's top two panels. A user who asked to be shown something should not
have to read the whole page to learn the one thing that moved.

### The cases that need care

| Situation | What to do |
|---|---|
| **No dashboard exists yet** | Generate it (§4's never-ran-init path) and open it. The user explicitly asked to see it, so this is not the silent-refresh case. No durable host → ask where it should live; do not invent a directory. |
| **`Baseline: NONE`** | Do not fabricate a page to satisfy the request. If one exists, refresh it to the quarantined state (§6) and open it — that IS the honest answer to "where do we stand". If none exists, explain in plain words that there is no agreed finish line to measure against, and offer `/did-we-drift init` or the recovery pass. Never render a progress page over an inadmissible plan. |
| **Unattended** (inside a `/loop` or `/goal`, no human this turn) | Refresh, **never open a browser** — there is nobody at the screen and a stray window is a real annoyance on a shared machine. Note in the report that the page was updated and where it is. |
| **Nothing changed since the last audit** | Still refresh, still open. "I checked, and nothing moved" is a legitimate answer to the question, and §4's no-change suppression governs the *report's* length, never whether the page opens. |
| **The audit turns up a MATERIAL or CAPTURED problem** | Handle the interrupt first (interrupt-mode.md), then refresh and open. The user gets the bad news in the conversation, not only in a browser tab they might close. |

**An audit nobody asked to see refreshes the file silently.** Never open a browser at someone who
only asked for an audit. Offering to regenerate a missing dashboard is a closing line in the
report; it **never spends interrupt-mode §2's one question**, which belongs to safety corrections.

## 6. When there is no admissible basis

`Baseline: NONE` means the planned column has no honest source. Deriving it from the code would
be §3a.1's cardinal error rendered in HTML.

- **No dashboard exists** → do not create one. One report line: the dashboard needs an agreed
  finish line first; `/did-we-drift init` or the recovery pass (realign-mode.md) produces one.
- **A dashboard exists** → set **`baseline.planStatus: "none"`**, and write `quarantineTitle` /
  `quarantineBody` saying plainly that the plan behind these rows is no longer admissible and
  why. Leave `rows` as they are — they are a record of the last known plan, not a fresh claim —
  and refresh `lastUpdated`, `baselineNote`, `sinceLastLook`, and the verdict panel to the
  `INCONCLUSIVE (NONE)` translation at `severity: "neutral"`.

**`planStatus: "none"` is what makes that honest, and it is structural.** Setting it hides the
progress meter outright and shows a warning band; the deliverable is relabelled *"What we USED to
be measured against"* and dimmed. **A percentage computed against an inadmissible plan is a lie**,
and the earlier version of this page happily printed "29% built" directly above a verdict reading
"there is no agreed plan to measure against" — the exact false confidence this skill exists to
prevent, produced by the skill itself.

Hiding the meter is not enough on its own: **the headline and subheading must also stop claiming
progress.** "Two of seven steps are finished" is the same lie in prose. Say what is true instead —
what the page is now, and what would make it measurable again. The checker enforces both.

## 7. Plain language is a hard requirement, not a polish pass

Every user-facing string obeys the global PLAIN-LANGUAGE REPORTING PROTOCOL. Assume the reader
just walked into the room.

- No unexplained acronyms, stage numbers, ticket IDs, tool names, or section references outside
  `technical` and the muted `tag` badge.
- Never omit or soften a failure, risk, or cost because it is hard to explain simply. Explain it
  simply. A skipped requirement, a known bug, a stalled step, an unratified plan — all of these
  get said out loud, in words that land.
- Write for the person paying for the work, not the person who did it.

## 8. Design — what the page is for, and the rules that keep it that way

**Intent.** This page has one job: let someone who has been away from the project understand its
state in about ten seconds, then drill only where they choose to. Everything follows from that —
the answer sits in the headline, the shape sits in the meter, the detail hides behind
disclosures, and nothing competes with the verdict.

**The colour system is four semantic roles and nothing else**, defined once as CSS variables in
both themes:

| Role | Means | Used by |
|---|---|---|
| `ok` | finished, on track | Built pills, the filled meter, an `ok` verdict panel |
| `warn` | underway, or the record has gaps | In-progress pills, the striped meter segment, `warn` panels, the waiting-on-you edge |
| `alert` | off course, or the plan itself moved | `alert` verdict panels only |
| `neutral` | not started, or cannot tell | Not-started pills, `neutral` panels |

Rules that hold in every project:

- **Colour never carries meaning alone.** Every coloured thing also states its meaning as an
  icon *and* a word (`✓ Built`, `◐ In progress`, `○ Not started`). A reader who cannot
  distinguish the colours loses nothing.
- **Do not add a fifth role, and never use a role decoratively.** Green means finished; it does
  not mean "nice".
- **Both themes, always.** Light and dark via `prefers-color-scheme`, with `data-theme`
  overrides. Never ship a page that is only legible in one.
- **One structural accent** (links, markers, disclosure arrows). It is not a status colour.
- **Detail hides, it never disappears.** Jargon, backlog, and specifics live behind `<details>`
  disclosures that print expanded — collapsed is not the same as hidden.
- **No decoration that costs a request.** No CDN, no web fonts, no icon libraries, no images.
  System font stack, text glyphs, CSS shapes. This is a hard constraint, not an aesthetic one.
- **Density is the enemy.** One idea per line, generous spacing, two columns on desktop and one
  below 760px with the column headings dropped (they mislead once rows stack).

**When the user asks for a different look**, change the template's variables and rules — never
one project's page. A dashboard that looks different from every other dashboard has to be
re-learned, which is the cost this section exists to avoid.

## 9. Generating from the template, and proving it works

Copy `dashboard-template.html` from this skill's directory to the host path and replace every
`{{PLACEHOLDER}}` — they exist only inside `DASHBOARD_DATA` and the `<title>`.

**Then run the checker. Every time, on generate AND on refresh, before reporting done.** Pass
`--ssot` once per plan document — the root plan and any subordinate tracker the rows came from:

```
node ~/.claude/skills/did-we-drift/verify-dashboard.mjs <dashboard.html> \
     --ssot <root-plan.md> [--ssot <tracker.md> ...]
```

It exits non-zero on failure. It checks what prose cannot enforce: no unfilled placeholders, no
request that would leave the machine, no way for project text to break out of the data block,
both themes, the script parses, the rendering code is unmodified from the template, the page
renders, the meter matches a hand-count of the rows, every row's jargon sits behind a collapsed
disclosure, no jargon in the fields shown by default, each row's facts match its own status, the
verdict panel wears its severity's colour, links are relative while paths display in full, every
listed document exists, hostile input stays escaped, and — with `--ssot` — **that the quoted goal
appears verbatim in the plan and every step on the page exists there.**

**Be honest about what a green run means.** It proves the page renders correctly and matches the
plan text it cites. It does **not** prove the statuses are true — nothing automated can. Never
report a passing run as "verified correct"; the audit and a human decide that.

**The page's script never runs in your process.** The checker executes it in a `node --permission`
child with no filesystem access, after statically scanning for network calls and host-reaching
constructs. Do not "simplify" that by evaluating the page directly: dashboards live in repos that
agents wrote, which is exactly where a poisoned file comes from.

A red check is a defect in the page, not in the checker — fix the data and re-run. Then open it
once and read it as a person would: does the headline answer the question, and could someone who
has never seen the project follow every word outside the technical panels?

## Common mistakes

- Treating the dashboard as the deliverable. The verdict, the report, and the stamp are the
  audit's product; this page is how a human reads them.
- Refreshing the dashboard and forgetting the `## AUDIT LOG` stamp.
- Marking a row `built` because work was dispatched, promised, or looks nearly done.
- Letting jargon leak out of `technical` into `planned`, `why`, or `howItWent`.
- Writing `why` as a restatement of `planned` instead of a real-world scenario.
- Estimating a start time, a duration, or a review count. "not recorded" is the honest answer and
  it costs nothing.
- Hiding a skipped requirement or a known bug because the row otherwise says Built.
- Softening `severity` so the page looks calmer than the verdict.
- Setting a percentage by hand — it is computed from the rows on purpose.
- Paraphrasing the deliverable sentence to make it fit the layout.
- Rewriting the page's HTML or CSS during a refresh instead of only `DASHBOARD_DATA`.
- Opening a browser during an ordinary audit nobody asked to see.
- **Treating `/did-we-drift dashboard` as "render the page".** It means *check the work, then show
  me* — the audit runs first, and every row's status is re-derived, not just the sampled ones.
  Re-opening yesterday's numbers answers a question the user did not ask.
- Leaving a row green because it was green last time, when its evidence no longer resolves.
- Opening a browser on an unattended run, where nobody is at the screen.
- Creating a `docs/` directory to host it without asking.
- Writing "this file wins" anywhere on the page.
