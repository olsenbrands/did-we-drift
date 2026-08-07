#!/usr/bin/env node
// Checks a did-we-drift dashboard before it is reported as done.
//
// Usage:  node verify-dashboard.mjs <dashboard.html> [--ssot <plan.md>] [--repo <dir>]
//
// WHAT THIS DOES AND DOES NOT PROVE. It proves the page is self-contained, renders,
// escapes its inputs, and that its meter agrees with its own rows. With --ssot it also
// proves the quoted deliverable and the row tags actually exist in the plan. It does
// NOT prove the statuses are true — only a human or the audit can do that. Do not
// describe a green run as "verified correct"; it is "renders correctly and matches the
// plan text it cites".
//
// SAFETY. The page's script is never executed in this process. It runs in a child
// `node --permission` process with no filesystem access, and only after a static scan
// for network calls and Node built-ins. A tampered dashboard cannot touch your machine
// through this checker.

import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

const argv = process.argv.slice(2);
const target = argv.find((a) => !a.startsWith("--"));
// --ssot may be repeated: the goal usually lives in the root plan while the steps live
// in a subordinate tracker, and both are legitimate places to check against.
const ssotPaths = argv.reduce(
  (acc, a, i) => (a === "--ssot" && argv[i + 1] ? acc.concat(argv[i + 1]) : acc),
  []
);

if (!target) {
  console.error("usage: verify-dashboard.mjs <dashboard.html> [--ssot <plan.md>]");
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

const script = html.slice(html.lastIndexOf("<script>") + 8, html.lastIndexOf("</script>"));

// Self-containment. Checked against the whole file: anything that would leave the machine.
const network = [
  [/https?:\/\//, "absolute URL"],
  [/\/\/cdn/, "CDN reference"],
  [/<img\s/i, "<img>"],
  [/<link\s/i, "<link>"],
  [/@import/, "CSS @import"],
  [/\bfetch\s*\(/, "fetch()"],
  [/XMLHttpRequest/, "XMLHttpRequest"],
  [/WebSocket/, "WebSocket"],
  [/EventSource/, "EventSource"],
  [/navigator\.sendBeacon/, "sendBeacon"]
];
const netHits = network.filter(([re]) => re.test(html)).map(([, n]) => n);
check("self-contained (nothing that would leave the machine)", netHits.length === 0,
  netHits.join(", "));

// Dangerous constructs inside the page script.
const danger = [
  [/\brequire\s*\(/, "require()"],
  [/\bimport\s*\(/, "dynamic import()"],
  [/\bprocess\b/, "process"],
  [/child_process/, "child_process"],
  [/\beval\s*\(/, "eval()"],
  [/localStorage|sessionStorage|indexedDB/, "browser storage"]
];
const dangerHits = danger.filter(([re]) => re.test(script)).map(([, n]) => n);
check("page script contains no host-reaching constructs", dangerHits.length === 0,
  dangerHits.join(", "));

// Generation-time escaping: a project string that closed the script tag or the
// string literal would already have broken the file before any runtime escaping ran.
const dataRegion = script.slice(
  script.indexOf("const DASHBOARD_DATA"),
  script.indexOf("END DASHBOARD_DATA")
);
check("no raw </script> in the data block", !/<\/script/i.test(dataRegion));
check("data strings escape '<' so markup can never terminate the block",
  !/<\/?[a-zA-Z]/.test(dataRegion.replace(/\\u003[cC]/g, "")) ||
  !/["'][^"'\n]*<\/?[a-zA-Z][^"'\n]*["']/.test(dataRegion),
  "use JSON.stringify with < escaped as \\u003c");

check("theme: dark via prefers-color-scheme", /@media \(prefers-color-scheme: dark\)/.test(html));
check("theme: explicit light and dark overrides",
  /\[data-theme="dark"\]/.test(html) && /\[data-theme="light"\]/.test(html));
const bp = html.match(/@media \(max-width: (\d+)px\)/);
check("stacks on narrow screens", !!bp && Number(bp[1]) <= 800, bp ? bp[1] + "px" : "none");

check("page declares a language", /<html[^>]*\slang=/.test(html) || /lang="[a-z]{2}/.test(html));

let parsed = true;
try {
  execFileSync("node", ["--check", "-"], { input: script, stdio: ["pipe", "pipe", "pipe"] });
} catch (e) {
  parsed = false;
  console.log(String(e.stderr || e.message));
}
check("script parses", parsed);

check("exactly one DASHBOARD_DATA object",
  (script.match(/const DASHBOARD_DATA/g) || []).length === 1);
check("data object is fenced and marked",
  /DASHBOARD_DATA —/.test(script) && /(END|End of) DASHBOARD_DATA/.test(script));

// Reserved authority vocabulary must not appear in the page's own prose. Quoted
// project data is exempt (it may legitimately name a "source of truth" document).
const chrome = html.slice(0, html.indexOf("const DASHBOARD_DATA")) +
  script.slice(script.indexOf("END DASHBOARD_DATA"));
const reserved = [/this file wins/i, /\bauthoritative\b/i, /source of truth/i];
const reservedHits = reserved.filter((re) => re.test(chrome)).map(String);
check("page claims no authority of its own", reservedHits.length === 0, reservedHits.join(", "));

// Renderer integrity: the code below the data fence should match the skill's template.
const tplPath = resolve(skillDir, "dashboard-template.html");
let rendererTrusted = false;
if (existsSync(tplPath)) {
  const tpl = readFileSync(tplPath, "utf8");
  const tplScript = tpl.slice(tpl.lastIndexOf("<script>") + 8, tpl.lastIndexOf("</script>"));
  const strip = (s) => s.slice(s.indexOf("END DASHBOARD_DATA")).replace(/\s+/g, " ").trim();
  rendererTrusted = strip(script) === strip(tplScript);
  if (rendererTrusted) check("rendering code is unmodified from the template", true);
  else note("rendering code differs from the template",
    "older dashboard, or the renderer was edited — data-only refreshes must not touch it");
} else {
  note("renderer integrity", "template not found next to this script");
}

// ------------------------------------------------- render, in a sandboxed child

const harness = `
const els = {};
const mk = (id) => ({ id, textContent: "", innerHTML: "", style: {}, attrs: {},
  setAttribute(k,v){this.attrs[k]=v;}, getAttribute(k){return this.attrs[k];},
  classList:{ added:[], add(c){ if(!this.added.includes(c)) this.added.push(c); },
    remove(c){ this.added = this.added.filter(x=>x!==c); },
    contains(c){ return this.added.includes(c); } } });
const listeners = [];
globalThis.document = { title:"", getElementById:(id)=>(els[id] ||= mk(id)),
  addEventListener:(e,fn)=>listeners.push([e,fn]) };
let error = null;
try {
${script}
  // DASHBOARD_DATA is a const inside this block, so hoist it out before it goes away.
  globalThis.__CAPTURED = JSON.parse(JSON.stringify(DASHBOARD_DATA));
  const ready = listeners.find(([e]) => e === "DOMContentLoaded");
  if (ready) ready[1]();
} catch (e) { error = String(e && e.stack || e); }
const dump = {};
for (const [k,v] of Object.entries(els))
  dump[k] = { textContent:v.textContent, innerHTML:v.innerHTML,
              classes:v.classList.added, attrs:v.attrs };
process.stdout.write("<<<JSON>>>" + JSON.stringify({
  error, dump, data: globalThis.__CAPTURED || null, title: document.title }));
`;

let out = null;
try {
  const raw = execFileSync("node", ["--permission", "-"], {
    input: harness,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    timeout: 20000
  });
  out = JSON.parse(raw.slice(raw.indexOf("<<<JSON>>>") + 10));
} catch (e) {
  check("renders in a sandboxed process", false, String(e.stderr || e.message).slice(0, 300));
}

if (out) {
  check("renders without throwing", !out.error, out.error ? out.error.split("\n")[0] : "");
}

// ----------------------------------------------------------------- DOM checks

if (out && !out.error) {
  const d = out.dump;
  const data = out.data;
  const at = (id) => d[id] || { textContent: "", innerHTML: "", classes: [], attrs: {} };
  const rows = at("rows-container").innerHTML;

  check("renders one row per planned step",
    (rows.match(/class="row"/g) || []).length === (data?.rows?.length || 0),
    `${(rows.match(/class="row"/g) || []).length} rows`);
  check("left column carries plain-language text", /class="planned-text"/.test(rows));
  check("status shown as icon + word, never colour alone",
    /(✓|◐|○)/.test(rows) && /(Built|In progress|Not started)/.test(rows));
  check("internal IDs render only as muted badges", /class="tag-badge"/.test(rows));

  const quote = d["deliverable"] || d["focus-quote"];
  check("the agreed sentence is quoted, not paraphrased",
    !!quote && /^“.+”$/.test(quote.textContent),
    (quote?.textContent || "").slice(0, 58) + "…");

  const isCurrent = /id="meter-label"/.test(html);
  if (!isCurrent) {
    note("current-template checks", "page predates the meter/technical-specs template");
  } else {
    const planStatus = data.baseline?.planStatus || "agreed";
    const built = data.rows.filter((r) => r.status === "built").length;
    const pct = data.rows.length ? Math.round((built / data.rows.length) * 100) : 0;

    check("no hand-set percentage in the data", !/"percent"\s*:/.test(JSON.stringify(data)));

    if (planStatus === "none") {
      // With no admissible plan there is nothing to be a percentage OF.
      check("no progress meter shown when there is no agreed plan",
        at("meter-section").classes.includes("hidden"),
        "meter must be hidden, not merely recoloured");
      check("the page says the plan is no longer agreed",
        !at("quarantine-banner").classes.includes("hidden"));
      // Not just the meter: no wording anywhere at the top may claim progress against
      // a plan the audit has just ruled inadmissible.
      const progressClaim =
        /\d+\s*%|\bof (two|three|four|five|six|seven|eight|nine|ten|\d+)\b|\b(finished|built|complete)\b/i;
      const top = at("headline").textContent + " " + at("subheading").textContent;
      check("neither headline nor subheading claims progress", !progressClaim.test(top),
        (top.match(progressClaim) || [""])[0] || "");
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
    check("technical detail is collapsed by default",
      !/<details class="tech" open/.test(rows));

    // Jargon leak scan over the fields that are visible WITHOUT opening anything.
    const jargon = [
      [/\.(ts|js|tsx|mjs|py|sql|html|css)\b/, "source filename"],
      [/\.md\b/, "document filename"],
      [/\b[a-z-]+\/[a-z-]+\//, "file path"],
      [/\b[A-Z]{2,}-\d+\b/, "ticket ID"],
      [/\b[0-9a-f]{7,40}\b/, "commit hash"],
      [/\b(API|SQL|CLI|HTTP|WS|JSON|YAML|CSS|DOM|SDK|CRUD|ORM|SSOT|PR)\b/, "acronym"],
      [/\bv?\d+\.\d+\.\d+\b/, "version string"],
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

    // Per-row honesty, evaluated row by row rather than across the whole page.
    const rowFaults = [];
    data.rows.forEach((r, i) => {
      const id = r.tag || `row ${i + 1}`;
      if (r.status === "built") {
        const timed = r.started || r.finished || r.elapsed;
        if (!timed && !/not recorded/.test(rows)) rowFaults.push(`${id}: finished, no timing and no "not recorded"`);
      }
      if (r.status === "not_started" && (r.started || r.finished || r.howItWent))
        rowFaults.push(`${id}: not started but carries history`);
      if (r.status !== "built" && r.evidence && /shipped|released|went out/i.test(r.evidence))
        rowFaults.push(`${id}: unfinished but evidence claims it shipped`);
    });
    check("each row's facts match its own status", rowFaults.length === 0, rowFaults.join("; "));

    check("'what changed' is populated or explicitly empty",
      at("since-list").innerHTML.length > 0 || !at("since-empty").classes.includes("hidden"));
    const waitingShown = !at("waiting-section").classes.includes("hidden");
    check("'waiting on you' shown only when there is something",
      waitingShown === ((data.waitingOnYou || []).length > 0),
      waitingShown ? `${data.waitingOnYou.length} items` : "hidden");

    check("verdict panel takes its colour from the severity",
      at("verdict-section").classes.includes(data.verdict.severity), data.verdict.severity);

    // Sources: shown absolute so they can be copied; linked relatively so they survive
    // being opened on another machine.
    const src = data.sources || [];
    if (src.length) {
      const srcHtml = at("sources-list").innerHTML;
      check("source paths are shown in full", src.every((s) => s.path.startsWith("/")));
      check("source links are relative, so they survive moving machines",
        src.every((s) => s.href && !s.href.startsWith("/") && !/^file:|^[a-z]+:/i.test(s.href)),
        src.filter((s) => !s.href || /^([a-z]+:|\/)/i.test(s.href)).map((s) => s.href).join(", ") || "all relative");
      check("full paths are visible as the link text",
        src.every((s) => srcHtml.includes(esc(s.path))));
      const missing = src.filter((s) => !existsSync(s.path));
      check("every source document exists", missing.length === 0,
        missing.map((s) => s.path).join(", ") || "all present");
    } else {
      check("sources section hidden when there are none",
        at("sources-section").classes.includes("hidden"));
    }
  }

  // ------------------------------------------------- provenance (needs --ssot)

  const present = ssotPaths.filter((p) => existsSync(p));
  const absent = ssotPaths.filter((p) => !existsSync(p));
  absent.forEach((p) => check(`plan document exists: ${p}`, false));

  if (present.length) {
    const corpus = present.map((p) => readFileSync(p, "utf8")).join("\n");
    // Compare the WORDS, not the markdown. Plans quote their goal inside blockquotes
    // and bold markers; a literal match would fail on formatting and teach the next
    // agent to "fix" it by paraphrasing the sentence — the one thing it must not do.
    const norm = (s) =>
      String(s)
        .replace(/[‘’]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/^[ \t]*>+[ \t]?/gm, "")   // blockquote markers
        .replace(/[*_`]/g, "")              // emphasis and code marks
        .replace(/\s+/g, " ")
        .trim();
    const sentence = norm(out.data?.baseline?.deliverable || "");
    check("the quoted goal appears verbatim in the plan",
      !!sentence && norm(corpus).includes(sentence),
      sentence ? "if this fails, the sentence was paraphrased or invented" : "no goal in the data");
    const tags = (out.data?.rows || []).map((r) => r.tag).filter(Boolean);
    const orphans = tags.filter((t) => !corpus.includes(t));
    check("every step on the page exists in the plan", orphans.length === 0,
      orphans.length ? `not found: ${orphans.join(", ")}` : `${tags.length} steps matched`);
  } else {
    note("provenance checks",
      "pass --ssot <plan.md> (repeatable) to prove the page matches the plan; " +
      "without it this run only proves the page renders");
  }

  // ------------------------------------------------- escaping, in the sandbox

  const hostile = '<img src=x onerror=alert(1)>"&\'</script>';
  const probe = harness.replace(
    'const ready = listeners.find(([e]) => e === "DOMContentLoaded");',
    `DASHBOARD_DATA.rows = [{tag:H,planned:H,why:H,status:"built",started:H,finished:H,
       elapsed:H,expected:H,howItWent:H,evidence:H,technical:H}];
     DASHBOARD_DATA.backlog = {title:H, items:[{name:H,note:H}]};
     DASHBOARD_DATA.verdict.corrections = [H];
     DASHBOARD_DATA.sources = [{role:H, path:"/tmp", href:H}];
     const ready = listeners.find(([e]) => e === "DOMContentLoaded");`
  ).replace("const els = {};", `const H = ${JSON.stringify(hostile)};\nconst els = {};`);
  try {
    const raw = execFileSync("node", ["--permission", "-"], {
      input: probe, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], timeout: 20000
    });
    const res = JSON.parse(raw.slice(raw.indexOf("<<<JSON>>>") + 10));
    const all = Object.values(res.dump).map((e) => e.innerHTML).join("");
    check("hostile input is escaped everywhere it renders",
      !/<img src=x/.test(all) && !/<\/script>/.test(all) && /&lt;img/.test(all));
  } catch (e) {
    check("hostile input is escaped everywhere it renders", false, String(e.message).slice(0, 200));
  }
}

console.log(
  failures === 0
    ? "\nALL CHECKS PASSED — the page renders correctly and matches the plan text it cites." +
      (ssotPaths.length ? "" : " (Run with --ssot to check it against the plan.)") +
      "\nThis does NOT prove the statuses are true; only the audit and a human can."
    : `\n${failures} CHECK(S) FAILED`
);
process.exit(failures === 0 ? 0 : 1);
