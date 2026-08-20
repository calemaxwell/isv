#!/usr/bin/env node
/**
 * QA gate. Implements the machine-checkable rows of PRD.md section 18.
 *
 * Run: node scripts/qa.mjs
 *
 * The rows that need a human (narrative comprehension, keyboard traversal,
 * screen reader, zoom) are listed at the end as a manual checklist rather
 * than silently omitted.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const SRC = new URL("../src/", import.meta.url).pathname;
const results = [];
let failed = 0;

function check(id, description, fn) {
  try {
    const problems = fn();
    const ok = problems.length === 0;
    if (!ok) failed += 1;
    results.push({ id, description, ok, problems });
  } catch (error) {
    failed += 1;
    results.push({ id, description, ok: false, problems: [String(error)] });
  }
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.(ts|tsx)$/.test(entry)) files.push(full);
  }
  return files;
}

const files = walk(SRC);
const sources = files.map((file) => ({
  file: file.replace(SRC, "src/"),
  text: readFileSync(file, "utf8"),
}));

/* ---------- Build quality: B1, B2, B3 ---------- */
check("B1", "Zero inline styles in /src", () =>
  sources
    .filter(({ text }) => /style=\{\{/.test(text))
    .map(({ file }) => `${file} contains style={{`),
);

check("B2", "Zero CSS-in-JS imports", () =>
  sources
    .filter(({ text }) => /from\s+["'](styled-components|@emotion)/.test(text))
    .map(({ file }) => `${file} imports a CSS-in-JS library`),
);

check("B3", "Zero Tailwind arbitrary values in /src", () => {
  // Visual utility followed by a bracketed value, e.g. mt-[17px], bg-[#123].
  const pattern =
    /\b(?:m|p|w|h|size|gap|top|left|right|bottom|inset|text|bg|border|rounded|shadow|grid-cols|grid-rows|leading|tracking|min-w|max-w|min-h|max-h|translate|space)-(?:[xytrbl]-)?\[[^\]]+\]/g;
  const problems = [];
  for (const { file, text } of sources) {
    const found = text.match(pattern);
    if (found) problems.push(`${file}: ${[...new Set(found)].join(", ")}`);
  }
  return problems;
});

/* ---------- Source integrity: I1, I2, I5, I6 ---------- */
const { services } = await import(pathToFileURL(join(SRC, "data/services.ts")));
const { askIsvEntries, suggestedQuestionIds } = await import(
  pathToFileURL(join(SRC, "data/ask-isv.ts"))
);
const { allContent, learning } = await import(
  pathToFileURL(join(SRC, "data/content.ts"))
);
const { moduleComposition } = await import(
  pathToFileURL(join(SRC, "data/modules.ts"))
);
const { members } = await import(pathToFileURL(join(SRC, "data/members.ts")));

const VALID_SOURCES = new Set(["RFP", "PUBLIC", "ILLUSTRATIVE"]);
const everyRecord = [...services, ...allContent, ...askIsvEntries];

check("I1", "Every fixture record carries a valid source", () =>
  everyRecord
    .filter((r) => !VALID_SOURCES.has(r.source) || !r.sourceNote)
    .map((r) => `${r.id} has an invalid or unexplained source`),
);

check(
  "I2",
  "No ILLUSTRATIVE service appears in an Ask ISV sources band",
  () => {
    const illustrative = new Set(
      services.filter((s) => s.source === "ILLUSTRATIVE").map((s) => s.id),
    );
    const problems = [];
    for (const entry of askIsvEntries) {
      for (const source of entry.sources) {
        if (illustrative.has(source.refId)) {
          problems.push(`${entry.id} cites ILLUSTRATIVE service ${source.refId}`);
        }
      }
    }
    return problems;
  },
);

const REGULATORY_ASSERTION = [
  /schools must comply/i,
  /you must have/i,
  /is required by law/i,
  /the law requires/i,
  /schools are required to/i,
  /\bmust (?:review|submit|report|complete|lodge|update)\b/i,
  /\bcomes into (?:force|effect)\b/i,
  /\bnew (?:legislation|regulation|law|requirement)\b/i,
  /\bdeadline\b/i,
  /\btakes effect\b/i,
];

check("I5", "No answer states what a regulation requires", () =>
  askIsvEntries
    .filter((entry) => REGULATORY_ASSERTION.some((rx) => rx.test(entry.answer)))
    .map((entry) => `${entry.id} asserts a regulatory requirement`),
);

/* ---------- Updates voice rule ---------- */
const { updates, events, learning: learningItems } = await import(
  pathToFileURL(join(SRC, "data/content.ts"))
);

check(
  "U1",
  "No update asserts a regulatory requirement, deadline or commencement",
  () =>
    updates
      .filter((u) =>
        REGULATORY_ASSERTION.some(
          (rx) => rx.test(u.title) || rx.test(u.summary),
        ),
      )
      .map((u) => `${u.id} states a requirement rather than ISV activity`),
);

check("U2", "Every update describes something ISV has done", () => {
  // The voice rule made concrete: an update is about ISV maintaining its own
  // materials, running its own sessions, or publishing its own guidance.
  const isvVerb =
    /\bISV has\b|\bISV\b.*\b(updated|published|refreshed|reviewed|confirmed|completed)\b/i;
  return updates
    .filter((u) => !isvVerb.test(u.summary))
    .map((u) => `${u.id} summary does not describe ISV activity`);
});

check("U3", "Every update is ILLUSTRATIVE and carries a note", () =>
  updates
    .filter((u) => u.source !== "ILLUSTRATIVE" || !u.sourceNote)
    .map((u) => `${u.id} must be ILLUSTRATIVE with an explanation`),
);

check("U4", "Both personas see at least three updates", () =>
  ["principal", "business-manager"]
    .map((role) => ({
      role,
      count: updates.filter((u) => u.relevantTo.includes(role)).length,
    }))
    .filter((entry) => entry.count < 3)
    .map((entry) => `${entry.role} sees only ${entry.count} updates`),
);

check("E1", "Every event and dated session has a format", () =>
  [...events, ...learningItems]
    .filter((item) => item.eventIso && !item.format)
    .map((item) => `${item.id} has a date but no format`),
);

check("E2", "Both personas have an event near their school", () =>
  ["principal", "business-manager"]
    .map((role) => ({
      role,
      near: events.filter(
        (e) => e.relevantTo.includes(role) && e.region === "Inner eastern Melbourne",
      ).length,
    }))
    .filter((entry) => entry.near === 0)
    .map((entry) => `${entry.role} has no event near their school`),
);

check("I6", "No response time or service level anywhere", () => {
  const banned =
    /(within (two|three|five|\d+) business days|response within|turnaround|service level agreement|\bSLA\b)/i;
  const problems = [];
  for (const { file, text } of sources) {
    for (const [i, line] of text.split("\n").entries()) {
      // Comments explain why the rule exists and are not member-facing copy.
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) continue;
      if (banned.test(line)) {
        problems.push(`${file}:${i + 1} states a response time or service level`);
      }
    }
  }
  return problems;
});

check("S5", "No platform named in member-facing copy", () => {
  const banned = /(Optimizely|Dynamics 365|Databricks|Moodle|Canto|Azure AD)/;
  const problems = [];
  for (const { file, text } of sources) {
    if (file.startsWith("src/types")) continue;
    for (const [i, line] of text.split("\n").entries()) {
      // Comments, source notes and the notional system-of-record field are
      // documentation, not member-facing copy.
      const isComment = /^\s*(\/\/|\*|\/\*)/.test(line);
      const isMeta =
        /sourceNote|notionalSystemOfRecord|"Dynamics 365"|Notional/.test(line);
      if (!isComment && !isMeta && banned.test(line)) {
        problems.push(`${file}:${i + 1} names a platform`);
      }
    }
  }
  return problems;
});

/* ---------- Ask ISV: A2, A5, A9, A12, A13 ---------- */
const contentById = new Map(allContent.map((c) => [c.id, c]));
const serviceById = new Map(services.map((s) => [s.id, s]));

function reachableBy(refId, role) {
  const item = contentById.get(refId) ?? serviceById.get(refId);
  return item ? item.relevantTo.includes(role) : false;
}

check("A2", "Every answer carries at least two sources", () =>
  askIsvEntries
    .filter((entry) => entry.sources.length < 2)
    .map((entry) => `${entry.id} has ${entry.sources.length} source(s)`),
);

check(
  "A5",
  "Every follow-up is reachable by every persona that reaches the parent",
  () => {
    const byId = new Map(askIsvEntries.map((e) => [e.id, e]));
    const problems = [];
    for (const entry of askIsvEntries) {
      for (const followUpId of entry.followUpIds) {
        const followUp = byId.get(followUpId);
        if (!followUp) {
          problems.push(`${entry.id} follow-up ${followUpId} does not exist`);
          continue;
        }
        for (const role of entry.relevantTo) {
          if (!followUp.relevantTo.includes(role)) {
            problems.push(
              `${entry.id} follow-up ${followUpId} is unreachable for ${role}`,
            );
          }
        }
      }
    }
    return problems;
  },
);

check(
  "A9",
  "Related resources band is non-empty for every persona, after filtering",
  () => {
    const problems = [];
    for (const entry of askIsvEntries) {
      for (const role of entry.relevantTo) {
        const visible = entry.relatedResourceIds.filter((id) =>
          reachableBy(id, role),
        );
        if (visible.length === 0) {
          problems.push(`${entry.id} has no related resources for ${role}`);
        }
        if (visible.length > 3) {
          problems.push(
            `${entry.id} shows ${visible.length} related resources for ${role}, max is 3`,
          );
        }
      }
    }
    return problems;
  },
);

check("A12", "Every source is reachable by every persona that reaches it", () => {
  const problems = [];
  for (const entry of askIsvEntries) {
    for (const role of entry.relevantTo) {
      for (const source of entry.sources) {
        if (!reachableBy(source.refId, role)) {
          problems.push(
            `${entry.id} source ${source.refId} is not relevant to ${role}`,
          );
        }
      }
    }
  }
  return problems;
});

check("A13", "No id appears in both the sources band and a related band", () => {
  const problems = [];
  for (const entry of askIsvEntries) {
    const sourceIds = new Set(entry.sources.map((s) => s.refId));
    const related = [
      ...entry.relatedResourceIds,
      ...entry.relatedServiceIds,
      ...entry.relatedLearningIds,
    ];
    for (const id of related) {
      if (sourceIds.has(id)) {
        problems.push(`${entry.id} repeats ${id} across bands`);
      }
    }
  }
  return problems;
});

check("A-suggest", "Suggested questions are reachable by their persona", () => {
  const byId = new Map(askIsvEntries.map((e) => [e.id, e]));
  const problems = [];
  for (const [role, ids] of Object.entries(suggestedQuestionIds)) {
    for (const id of ids) {
      const entry = byId.get(id);
      if (!entry) problems.push(`${role} suggests missing entry ${id}`);
      else if (!entry.relevantTo.includes(role)) {
        problems.push(`${role} suggests ${id}, which that role cannot reach`);
      }
    }
  }
  return problems;
});

/* ---------- Personalisation: P1, P7, P8 ---------- */
check("P1", "At least five visible differences between the two landings", () => {
  const principal = moduleComposition.principal;
  const bm = moduleComposition["business-manager"];
  const differences = [];

  if (principal.length !== bm.length) differences.push("module count");
  const pIds = principal.map((m) => m.id).join(",");
  const bIds = bm.map((m) => m.id).join(",");
  if (pIds !== bIds) differences.push("module order");

  for (const module of principal) {
    const match = bm.find((m) => m.id === module.id);
    if (!match) {
      differences.push(`${module.id} present for Principal only`);
      continue;
    }
    if (module.itemIds.join(",") !== match.itemIds.join(",")) {
      differences.push(`${module.id} items`);
    }
    if (module.cue !== match.cue) differences.push(`${module.id} cue`);
  }

  return differences.length >= 5
    ? []
    : [`only ${differences.length} differences: ${differences.join("; ")}`];
});

check("P8", "The learning module resolves via interestTags, not role", () => {
  const problems = [];
  for (const [role, modules] of Object.entries(moduleComposition)) {
    const learningModule = modules.find((m) => m.id === "mod-learning");
    if (!learningModule) {
      problems.push(`${role} has no learning module`);
      continue;
    }
    if (learningModule.itemIds.length > 0) {
      problems.push(`${role} learning module uses hard-coded itemIds`);
    }
    const member = members.find((m) => m.role === role);
    const interests = member.interests.map((i) => i.toLowerCase());
    const matches = learning.filter(
      (item) =>
        item.relevantTo.includes(role) &&
        item.interestTags.some((tag) => interests.includes(tag.toLowerCase())),
    );
    if (matches.length === 0) {
      problems.push(`${role} learning module would render empty`);
    }
  }
  return problems;
});

/* ---------- Referential integrity ---------- */
check("REF", "Every module itemId resolves", () => {
  const problems = [];
  for (const [role, modules] of Object.entries(moduleComposition)) {
    for (const module of modules) {
      for (const id of module.itemIds) {
        const exists = contentById.has(id) || serviceById.has(id);
        if (!exists) problems.push(`${role}/${module.id} references ${id}`);
      }
    }
  }
  return problems;
});

check("REF-EVENT", "Every event has a date and location", () =>
  events
    .filter((e) => !e.eventIso || !e.location)
    .map((e) => `${e.id} is missing eventIso or location`),
);

/* ---------- Report ---------- */
const pad = (s, n) => String(s).padEnd(n);
console.log("\nISV Member Portal — QA gate (PRD s18)\n");
/* ---------- Contrast: C1–C4 ----------
   The rebrand made this non-optional. Two of the four brand colours are
   lighter than the page ground and one of the blues fails AA for text, so
   the palette is one careless swap away from an inaccessible product.
   These read the real values out of globals.css and do the maths. --- */
const css = readFileSync(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);
const tok = (name) => {
  const m = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  return m ? m[1] : null;
};
const srgb = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const lum = (hex) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const PAGE_GROUNDS = [
  "--isv-paper", "--isv-paper-cool", "--isv-ocean-tint",
  "--isv-sun-tint", "--isv-royal-tint", "--isv-deep-tint",
];

check("C1", "Body, secondary and faint ink clear AA on every page ground", () => {
  const bad = [];
  for (const g of PAGE_GROUNDS) {
    for (const t of ["--isv-ink", "--isv-ink-soft", "--isv-ink-faint"]) {
      const r = ratio(tok(t), tok(g));
      if (r < 4.5) bad.push(`${t} on ${g} ${r.toFixed(2)}`);
    }
  }
  return bad;
});

check("C2", "The action colour clears AA on every page ground", () => {
  const bad = [];
  for (const g of PAGE_GROUNDS) {
    const r = ratio(tok("--isv-deep"), tok(g));
    if (r < 4.5) bad.push(`action on ${g} ${r.toFixed(2)}`);
  }
  return bad;
});

check("C3", "Ocean and Sunshine tiles clear AA with their own text pair", () => {
  const bad = [];
  for (const g of ["--isv-ocean", "--isv-sun"]) {
    for (const t of ["--isv-on-tint", "--isv-on-tint-soft", "--isv-deep"]) {
      const r = ratio(tok(t), tok(g));
      if (r < 4.5) bad.push(`${t} on ${g} ${r.toFixed(2)}`);
    }
  }
  return bad;
});

check("C4", "Royal is never used where it would need to clear 4.5:1", () => {
  // Royal is 3.80:1 on white. It is legitimate for marks, focus rings and
  // large display type, and wrong for a link, a label or a text ground.
  // If it ever becomes the action colour this check fails loudly.
  const action = css.match(/--color-action:\s*var\((--isv-[a-z-]+)\)/);
  if (action && action[1] === "--isv-deep") return [];
  return [
    `--color-action points at ${action ? action[1] : "nothing"}, not --isv-deep`,
  ];
});


/**
 * Source with comments removed.
 *
 * The voice checks below scan for phrasing that must never reach a member. A
 * comment explaining the rule contains the very phrasing the rule forbids, so
 * scanning raw source makes every file that documents its own constraint fail.
 * What ships is the string literals; that is what these read.
 */
function code(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

/* ---------- School account: SA1, SA2, SA3 ---------- */

check("SA1", "Nothing states an ISV fee rate or fee basis", () => {
  // The prototype carries an illustrative invoice for a fictional school. It
  // must not imply how ISV actually prices membership — a per-student rate or
  // a fee schedule is a claim ISV would have to correct in the room.
  const banned =
    /\bper\s+(student|enrolment|pupil|head)\b|\bfee\s+(rate|schedule|scale)\b|\brate\s+of\s+\$/i;
  return sources
    .filter(({ file }) => /membership|school-account|app\/school\//.test(file))
    .filter(({ text }) => banned.test(code(text)))
    .map(({ file }) => `${file} implies an ISV fee basis`);
});

check("SA2", "The people list is read from context, never imported twice", () => {
  // One list, two uses. Event registration and the school account read the
  // same array through the provider. A page importing the fixture directly
  // would silently fork the record and quietly undo the argument the whole
  // area is making.
  return sources
    .filter(({ file }) => file.startsWith("src/app/"))
    .filter(({ text }) => /from "@\/data\/roster"/.test(text))
    .filter(({ text }) => /\bschoolRoster\b/.test(text))
    .map(({ file }) => `${file} imports schoolRoster instead of using people`);
});

check("SA3", "The school account never asserts a legal obligation", () => {
  // Same rule as updates and alerts. A nominated child safety contact is a
  // name ISV holds so it knows who to write to, not a role the portal is
  // telling a school it is required to appoint.
  const banned =
    /\b(you|schools?|we)\s+(are\s+)?(must|required to|obliged to|legally)\b|\bby law\b|\bcompliance requirement\b/i;
  return sources
    .filter(({ file }) => /school-account|membership\.ts|app\/school\//.test(file))
    .filter(({ text }) => banned.test(code(text)))
    .map(({ file }) => `${file} reads as a legal obligation`);
});


check("SA4", "No em dash in product copy", () => {
  // A house style rule, and one that slipped through in the school account on
  // the first pass. Story names are excluded: they are labels in the design
  // system's own navigation, read by the team rather than by a member.
  return sources
    .filter(({ file }) => !file.includes(".stories."))
    .flatMap(({ file, text }) => {
      const stripped = code(text);
      const found = [
        ...stripped.matchAll(/"([^"\n]*\u2014[^"\n]*)"/g),
        ...stripped.matchAll(/>\s*([^<>{}\n]*\u2014[^<>{}\n]*?)\s*</g),
      ].map((m) => m[1].trim());
      return found.map((s) => `${file}: ${s.slice(0, 60)}`);
    });
});


for (const result of results) {
  console.log(
    `${result.ok ? "PASS" : "FAIL"}  ${pad(result.id, 11)} ${result.description}`,
  );
  for (const problem of result.problems) console.log(`        ↳ ${problem}`);
}

console.log(
  `\n${results.length - failed}/${results.length} automated checks passed.\n`,
);

console.log("Manual checks still required before the demo:");
for (const row of [
  "N4  Unbriefed viewer describes all three acts",
  "X2  Full narrative completed without a mouse",
  "X6  200% and 400% zoom, no loss of content or function",
  "X7  One narrative pass in a screen reader",
  "R1  375 / 768 / 1280 / 1920 render check",
  "I7  School and persona name collision check",
  "Dates  Replace every VERIFY-DATE in src/data/content.ts",
]) {
  console.log(`  ${row}`);
}
console.log("");

process.exit(failed > 0 ? 1 : 0);
