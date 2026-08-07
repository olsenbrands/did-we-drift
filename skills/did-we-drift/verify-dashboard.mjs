#!/usr/bin/env node
// Checks a did-we-drift dashboard before it is reported as done.
//
// Usage:  node verify-dashboard.mjs <dashboard.html> [--ssot <plan.md> ...]
//
// WHAT A GREEN RUN PROVES: the page is self-contained, its data is inert and parses,
// its rendering code is byte-identical to the shipped template, it renders, it escapes
// its inputs, its meter agrees with its own rows, every row claiming "built" was
// re-verified in THIS audit pass, and its quoted goal and step IDs exist verbatim in
// the plan documents it cites. It does NOT prove the statuses describe reality — only
// the audit and a human can. Never call a green run "verified correct".
//
// SAFETY: this checker NEVER executes code from the page under test. The data block is
// inert JSON, parsed directly. Rendering is done by the TRUSTED renderer shipped beside
// this script, run against that data in a `node --permission` child with a cleared
// environment. A page whose renderer differs from the template FAILS and is never run.

import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const argv = process.argv.slice(2);
const target = argv.find((a) => !a.startsWith("--") && /\.html?$/i.test(a));
const ssotArgs = argv.reduce(
  (acc, a, i) => (a === "--ssot" && argv[i + 1] ? acc.concat(argv[i + 1]) : acc),
  []
);

if (!target) {
  console.error("usage: verify-dashboard.mjs <dashboard.html> [--ssot <plan.md> ...]");
  process.exit(2);
}

const html = readFileSync(target, "utf8");
const skillDir = dirname(fileURLToPath(import.meta.url));

let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};
const note = (name, detail = "") =>
  console.log(`SKIP  ${name}${detail ? " — " + detail : ""}`);

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// ---------------------------------------------------------------- static checks

const placeholders = html.match(/\{\{[^}]*\}\}/g) || [];
check("no unfilled {{placeholders}}", placeholders.length === 0, placeholders.join(", "));

const network = [
  [/https?:\/\//, "absolute URL"], [/\/\/cdn/, "CDN reference"],
  [/<img\s/i, "<img>"], [/<link\s/i, "<link>"], [/@import/, "CSS @import"],
  [/\bfetch\s*\(/, "fetch()"], [/XMLHttpRequest/, "XMLHttpRequest"],
  [/WebSocket/, "WebSocket"], [/EventSource/, "EventSource"],
  [/navigator\.sendBeacon/, "sendBeacon"], [/\bimport\s+.*\bfrom\b/, "ES import"]
];
const netHits = network.filter(([re]) => re.test(html)).map(([, n]) => n);
check("self-contained (nothing that would leave the machine)", netHits.length === 0,
  netHits.join(", "));

// The renderer is checked byte-for-byte below, so this scan exists to catch a page
// carrying extra code at all — including the indirect routes to host objects that a
// plain name-based deny-list misses.
const pageScripts = [...html.matchAll(/<script(?![^>]*type=["']application\/json)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((m) => m[1]).join("\n");
const danger = [
  [/\brequire\s*\(/, "require()"], [/\bimport\s*\(/, "dynamic import()"],
  [/\bprocess\b/, "process"], [/child_process/, "child_process"],
  [/\beval\s*\(/, "eval()"], [/\bFunction\s*\(/, "Function() constructor"],
  [/\bconstructor\s*\[/, "constructor indexing"],
  [/\[\s*["'`]constructor/, "constructor indexing"],
  [/globalThis\s*\[/, "globalThis indexing"],
  [/localStorage|sessionStorage|indexedDB/, "browser storage"]
];
const dangerHits = danger.filter(([re]) => re.test(pageScripts)).map(([, n]) => n);
check("page carries no host-reaching constructs", dangerHits.length === 0,
  dangerHits.join(", "));

check("theme: dark via prefers-color-scheme", /@media \(prefers-color-scheme: dark\)/.test(html));
check("theme: explicit light and dark overrides",
  /\[data-theme="dark"\]/.test(html) && /\[data-theme="light"\]/.test(html));
const bp = html.match(/@media \(max-width: (\d+)px\)/);
check("stacks on narrow screens", !!bp && Number(bp[1]) <= 800, bp ? bp[1] + "px" : "none");
check("page declares a language", /<html[^>]*\slang=/.test(html));
check("page has a main landmark", /role=["']main["']|<main[\s>]/.test(html));

// Reserved authority vocabulary must not appear in the page's own prose.
const dataMatch = html.match(
  /<script id="dashboard-data" type="application\/json">([\s\S]*?)<\/script>/
);
const chrome = dataMatch ? html.replace(dataMatch[0], "") : html;
const reserved = [/this file wins/i, /\bauthoritative\b/i, /source of truth/i];
const reservedHits = reserved.filter((re) => re.test(chrome)).map(String);
check("page claims no authority of its own", reservedHits.length === 0, reservedHits.join(", "));

// ------------------------------------------------ inert data + trusted renderer

const tplPath = resolve(skillDir, "dashboard-template.html");
if (!existsSync(tplPath)) {
  check("template found beside this checker", false, tplPath);
  console.log(`\n${failures} CHECK(S) FAILED`);
  process.exit(1);
}
const tpl = readFileSync(tplPath, "utf8");
const rendererOf = (s) => s.slice(s.lastIndexOf("<script>") + 8, s.lastIndexOf("</script>"));
const norm = (s) => s.replace(/\s+/g, " ").trim();

let data = null;
let modern = !!dataMatch;

if (!modern) {
  note("data block", "page predates the inert-JSON data block — regenerate it from the " +
    "template; only static checks can run, and its own code is never executed here");
} else {
  check("data block is inert JSON in its own script tag", true);
  check("no raw </script> inside the data block", !/<\/script/i.test(dataMatch[1]));
  try {
    data = JSON.parse(dataMatch[1]);
    check("data parses as strict JSON", true);
  } catch (e) {
    check("data parses as strict JSON", false, String(e.message).slice(0, 140));
  }
  // Renderer integrity is now a FAIL, not a note: a page whose rendering code was
  // edited is not a dashboard this checker will vouch for, and we never run it.
  const same = norm(rendererOf(html)) === norm(rendererOf(tpl));
  check("rendering code is byte-identical to the template", same,
    same ? "" : "data-only refreshes must not touch the renderer; regenerate the page");
  if (!same) modern = false;
}

let out = null;
if (modern && data) {
  // Render with the TRUSTED renderer against the page's data. Nothing from the page
  // under test is executed. Child runs with --permission and a cleared environment.
  const harness = `
const DATA = JSON.parse(process.argv.find((a) => a.startsWith("{")) || "{}");
const els = {};
const mk = (id) => ({ id, textContent: "", innerHTML: "", style: {}, attrs: {},
  setAttribute(k,v){this.attrs[k]=v;}, getAttribute(k){return this.attrs[k];},
  classList:{ added:[], add(c){ if(!this.added.includes(c)) this.added.push(c); },
    remove(c){ this.added = this.added.filter(x=>x!==c); },
    contains(c){ return this.added.includes(c); } } });
const listeners = [];
globalThis.document = { title:"",
  getElementById:(id)=>(els[id] ||= mk(id)),
  addEventListener:(e,fn)=>listeners.push([e,fn]) };
let error = null;
try {
${rendererOf(tpl).replace(
    /const DASHBOARD_DATA = JSON\.parse\([\s\S]*?\);/,
    "const DASHBOARD_DATA = DATA;"
  )}
  const ready = listeners.find(([e]) => e === "DOMContentLoaded");
  if (ready) ready[1]();
} catch (e) { error = String((e && e.stack) || e); }
const dump = {};
for (const [k,v] of Object.entries(els))
  dump[k] = { textContent:v.textContent, innerHTML:v.innerHTML,
              classes:v.classList.added, attrs:v.attrs };
console.log("<<<JSON>>>" + JSON.stringify({ error, dump }));
`;
  const run = (payload) => {
    const raw = execFileSync(process.execPath, ["--permission", "-", JSON.stringify(payload)], {
      input: harness, encoding: "utf8", timeout: 20000,
      stdio: ["pipe", "pipe", "pipe"],
      env: {}   // cleared: nothing from the parent environment is reachable
    });
    return JSON.parse(raw.slice(raw.indexOf("<<<JSON>>>") + 10));
  };
  try {
    out = run(data);
    check("renders without throwing", !out.error,
      out.error ? out.error.split("\n")[0] : "");
  } catch (e) {
    check("renders in a sandboxed process", false, String(e.stderr || e.message).slice(0, 240));
  }

  // Escaping: feed hostile strings through the SAME trusted renderer.
  try {
    const H = '<img src=x onerror=alert(1)>"&\'</script>';
    const probe = JSON.parse(JSON.stringify(data));
    probe.rows = [{ tag: H, planned: H, why: H, status: "built", started: H, finished: H,
      elapsed: H, expected: H, howItWent: H, evidence: H, evidenceKind: "command",
      technical: H, lastVerified: H }];
    probe.backlog = { title: H, items: [{ name: H, note: H }] };
    probe.verdict = { ...probe.verdict, corrections: [H] };
    probe.sources = [{ role: H, path: "/tmp", href: H }];
    const all = Object.values(run(probe).dump).map((e) => e.innerHTML).join("");
    check("hostile input is escaped everywhere it renders",
      !/<img src=x/.test(all) && !/<\/script>/.test(all) && /&lt;img/.test(all));
  } catch (e) {
    check("hostile input is escaped everywhere it renders", false,
      String(e.message).slice(0, 160));
  }
}

// ----------------------------------------------------------------- DOM checks

if (out && !out.error && data) {
  const at = (id) => out.dump[id] || { textContent: "", innerHTML: "", classes: [], attrs: {} };
  const rows = at("rows-container").innerHTML;
  const planStatus = data.baseline?.planStatus || "agreed";
  const noPlan = planStatus === "none";

  check("renders one row per planned step",
    (rows.match(/class="row"/g) || []).length === (data.rows?.length || 0),
    `${(rows.match(/class="row"/g) || []).length} rows`);
  check("left column carries plain-language text", /class="planned-text"/.test(rows));
  check("status shown as icon + word, never colour alone",
    /(✓|◐|○|·)/.test(rows) && /(Built|In progress|Not started|On the old plan)/.test(rows));
  check("internal IDs render only as muted badges", /class="tag-badge"/.test(rows));
  check("the agreed sentence is quoted, not paraphrased",
    /^“.+”$/.test(at("deliverable").textContent),
    at("deliverable").textContent.slice(0, 56) + "…");
  check("no hand-set percentage in the data", !/"percent"\s*:/.test(JSON.stringify(data)));

  const built = data.rows.filter((r) => r.status === "built").length;
  const pct = data.rows.length ? Math.round((built / data.rows.length) * 100) : 0;

  if (noPlan) {
    check("no progress meter when there is no agreed plan",
      at("meter-section").classes.includes("hidden"), "must be hidden, not recoloured");
    check("the page says the plan is no longer agreed",
      !at("quarantine-banner").classes.includes("hidden"));
    const claim = /\d+\s*%|\bof (two|three|four|five|six|seven|eight|nine|ten|\d+)\b|\b(finished|built|complete)\b/i;
    const top = at("headline").textContent + " " + at("subheading").textContent;
    check("neither headline nor subheading claims progress", !claim.test(top),
      (top.match(claim) || [""])[0]);
    // The half-fix this replaces: hiding the meter while green "Built" pills stayed.
    check("no step still shows as finished",
      !/status-pill built/.test(rows) && !/>Built</.test(rows),
      "rows must render as a record of the old plan, not as progress");
  } else {
    check("meter matches a hand-count of the rows",
      at("meter-label").innerHTML.includes(`${pct}% built`) &&
      at("meter-label").innerHTML.includes(`${built} of ${data.rows.length}`),
      at("meter-label").innerHTML.replace(/<[^>]*>/g, ""));
    check("meter has a text alternative",
      /percent built/.test(at("meter-track").attrs["aria-label"] || ""));
  }

  check("headline states the answer", at("headline").textContent.length > 0,
    at("headline").textContent);
  check("subheading gives current state", at("subheading").textContent.length > 0);

  const techRows = data.rows.filter((r) => r.technical).length;
  check("every row with jargon hides it behind a disclosure",
    (rows.match(/Want the technical specs\?/g) || []).length === techRows,
    `${techRows} disclosures`);
  check("technical detail is collapsed by default", !/<details class="tech" open/.test(rows));

  const jargon = [
    [/\.(ts|js|tsx|mjs|py|sql|html|css)\b/, "source filename"],
    [/\.md\b/, "document filename"],
    [/\b[a-z-]+\/[a-z-]+\//, "file path"],
    [/\b[A-Z]{2,}-\d+\b/, "ticket ID"],
    [/\b[0-9a-f]{7,40}\b/, "commit hash"],
    [/\b(API|SQL|CLI|HTTP|WS|JSON|YAML|CSS|DOM|SDK|CRUD|ORM|SSOT|PR)\b/, "acronym"],
    [/`[^`]+`/, "code span"]
  ];
  const visible = [
    data.baseline?.headline, data.baseline?.subheading, data.baseline?.baselineNote,
    data.verdict?.headline, data.verdict?.explanation,
    ...(data.verdict?.corrections || []),
    ...(data.waitingOnYou || []).map((w) => w.decision),
    ...(data.sinceLastLook?.changes || []),
    ...data.rows.flatMap((r) => [r.planned, r.why, r.howItWent, r.evidence]),
    ...(data.backlog?.items || []).flatMap((i) => [i.name, i.note])
  ].filter(Boolean).join("  ");
  const leaks = jargon.filter(([re]) => re.test(visible))
    .map(([re, n]) => `${n} (${(visible.match(re) || [])[0]})`);
  check("no jargon in the fields shown by default", leaks.length === 0, leaks.join("; "));

  // Per-row honesty, row by row.
  const faults = [];
  data.rows.forEach((r, i) => {
    const id = r.tag || `row ${i + 1}`;
    if (r.status === "not_started" && (r.started || r.finished || r.howItWent))
      faults.push(`${id}: not started but carries history`);
    if (r.status !== "built" && /shipped|released|went out/i.test(r.evidence || ""))
      faults.push(`${id}: unfinished but its proof claims it shipped`);
    if (r.status === "built" && r.evidenceKind &&
        !["command", "signed-off", "external"].includes(r.evidenceKind))
      faults.push(`${id}: unknown evidence kind "${r.evidenceKind}"`);
  });
  check("each row's facts match its own status", faults.length === 0, faults.join("; "));

  // THE ALL-ROW GUARANTEE, made checkable. Every finished row must carry the id of the
  // audit that re-verified it. A pass that skipped re-derivation cannot produce these.
  if (!noPlan) {
    const runId = data.baseline?.auditRunId || "";
    check("the page records which audit produced it", runId.length > 0,
      runId || "set baseline.auditRunId");
    const stale = data.rows.filter((r) => r.status === "built" && r.lastVerified !== runId)
      .map((r) => `${r.tag || "?"}=${r.lastVerified || "(none)"}`);
    check("every finished step was re-checked in this audit pass",
      runId.length > 0 && stale.length === 0,
      stale.length ? `not re-checked: ${stale.join(", ")}` : `${built} finished step(s)`);
  }

  check("'what changed' is populated or explicitly empty",
    at("since-list").innerHTML.length > 0 || !at("since-empty").classes.includes("hidden"));
  const waitingShown = !at("waiting-section").classes.includes("hidden");
  check("'waiting on you' shown only when there is something",
    waitingShown === ((data.waitingOnYou || []).length > 0),
    waitingShown ? `${data.waitingOnYou.length} items` : "hidden");
  check("verdict panel takes its colour from the severity",
    at("verdict-section").classes.includes(data.verdict.severity), data.verdict.severity);

  const src = data.sources || [];
  if (src.length) {
    const srcHtml = at("sources-list").innerHTML;
    check("source paths are shown in full", src.every((s) => s.path.startsWith("/")));
    check("source links are relative, so they survive moving machines",
      src.every((s) => s.href && !/^([a-z]+:|\/)/i.test(s.href)),
      src.filter((s) => !s.href || /^([a-z]+:|\/)/i.test(s.href))
        .map((s) => s.href || "(none)").join(", ") || "all relative");
    check("full paths are visible as the link text",
      src.every((s) => srcHtml.includes(esc(s.path))));
    const missing = src.filter((s) => !existsSync(s.path));
    check("every source document exists", missing.length === 0,
      missing.map((s) => s.path).join(", ") || "all present");
  } else {
    check("sources section hidden when there are none",
      at("sources-section").classes.includes("hidden"));
  }

  // ---------------------------------------------------------- provenance
  // Plan paths are taken from the page's OWN source list when --ssot is not passed, so
  // the provenance check cannot be skipped by omitting a flag.
  const derived = src.map((s) => s.path).filter((p) => /\.md$/i.test(p) && existsSync(p));
  const plans = (ssotArgs.length ? ssotArgs : derived).filter(existsSync);
  ssotArgs.filter((p) => !existsSync(p))
    .forEach((p) => check(`plan document exists: ${p}`, false));

  if (plans.length) {
    const corpus = plans.map((p) => readFileSync(p, "utf8")).join("\n");
    // Compare the WORDS, not the markdown: plans quote their goal inside blockquotes
    // and bold markers, and a literal match would teach the next agent to "fix" a
    // mismatch by paraphrasing the sentence — the one thing it must never do.
    const words = (s) => String(s)
      .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
      .replace(/^[ \t]*>+[ \t]?/gm, "").replace(/[*_`]/g, "")
      .replace(/\s+/g, " ").trim();
    const sentence = words(data.baseline?.deliverable || "");
    check("the quoted goal appears verbatim in the plan",
      !!sentence && words(corpus).includes(sentence),
      sentence ? `checked against ${plans.length} document(s)` : "no goal in the data");
    const tags = data.rows.map((r) => r.tag).filter(Boolean);
    const orphans = tags.filter((t) => !corpus.includes(t));
    check("every step on the page exists in the plan", orphans.length === 0,
      orphans.length ? `not found: ${orphans.join(", ")}` : `${tags.length} steps matched`);
  } else {
    check("the page cites a plan that can be checked", false,
      "no plan document found in the page's sources and none passed with --ssot — " +
      "provenance cannot be verified");
  }
}

console.log(
  failures === 0
    ? "\nALL CHECKS PASSED — renders correctly, matches the plan text it cites, and every\n" +
      "finished step was re-checked in this pass. This does NOT prove the statuses\n" +
      "describe reality; only the audit and a human can."
    : `\n${failures} CHECK(S) FAILED`
);
process.exit(failures === 0 ? 0 : 1);
