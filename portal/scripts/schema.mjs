/**
 * Component schema export.
 *
 * Reads the TypeScript of every component and writes out what each one
 * accepts: prop names, types, whether they are required, defaults, the
 * allowed values for a union, and the doc comment above them.
 *
 * The point is CMS modelling. A component's props are its content type —
 * StoryCard's props are exactly the fields an author needs to fill in to
 * publish a story card. Deriving the model from the code rather than
 * writing it by hand means the two cannot drift, and when a prop is added
 * the schema says so on the next build.
 *
 *   node scripts/schema.mjs
 *
 * Writes src/generated/component-schema.json, which the Storybook content
 * model page renders and which anything else can consume.
 *
 * Scope note. This reads React components. JobAd and Applicant in
 * src/data/jobs.ts are records a member writes rather than content a
 * component renders, so they are not here — they are typed and commented in
 * that file, and a CMS would model them as editable records rather than as
 * published content types.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withCustomConfig } from "react-docgen-typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "src/generated/component-schema.json");

/**
 * The components worth modelling.
 *
 * Not everything in the library is a content type. Layout primitives shape
 * a page; these are the things an author would actually fill in. Grouped
 * the way a CMS would group them.
 */
const GROUPS = [
  {
    group: "Content blocks",
    note: "Authored one at a time. Each maps to a CMS content type.",
    file: "src/components/patterns/stories.tsx",
    include: ["StoryCard", "FeaturedBand"],
  },
  {
    group: "Content blocks",
    note: "Authored one at a time. Each maps to a CMS content type.",
    file: "src/components/patterns/tiles.tsx",
    include: ["Tile", "TilePill", "ServiceTile", "EventTile", "LeadEventTile"],
  },
  {
    group: "Collections",
    note: "Take a list. In a CMS these are a reference field plus display options.",
    file: "src/components/patterns/index.tsx",
    include: ["IndexList", "ScheduleList", "UpdateLead", "RequestRow", "FileIcon", "Artwork", "EmptyState"],
  },
  {
    group: "Page structure",
    note: "How a page is assembled. Usually editor-facing settings rather than content.",
    file: "src/components/layout/index.tsx",
    include: ["Field", "Wrap", "SectionHeader", "Cell", "CellGrid"],
  },
  {
    group: "Screens",
    note: "A whole templated screen. One CMS page type each.",
    file: "src/components/features/listing.tsx",
    include: ["ListingScreen"],
  },
  {
    group: "Primitives",
    note: "Presentational. Rarely modelled directly, but the vocabulary a CMS field maps onto.",
    file: "src/components/primitives/index.tsx",
    include: ["Text", "Button", "LinkButton", "AppLink", "Badge", "Eyebrow", "Avatar"],
  },
];

const parser = withCustomConfig(path.join(root, "tsconfig.json"), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Anything inherited from React's own DOM typings is noise here — an
  // author is never going to fill in onAnimationEndCapture.
  propFilter: (prop) =>
    // children comes from React's own typings but it is the slot an author
    // fills, so it stays. Everything else inherited from node_modules goes.
    prop.name === "children" ||
    (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
});

/**
 * Union members, so a CMS can render a select rather than a free text field.
 *
 * Two shapes have to be handled. A plain union comes back as an enum with a
 * value array. A cva variant comes back as a raw string — `"mega" | "h2" |
 * null` — because the type is derived rather than declared, and those are
 * the most useful ones to expose, so they get parsed out of the string.
 */
function options(type) {
  if (type?.name === "enum" && Array.isArray(type.value)) {
    const values = type.value
      .map((v) => String(v.value).replace(/^"|"$/g, ""))
      .filter((v) => v !== "undefined" && v !== "null");
    return values.length > 1 ? values : undefined;
  }

  const raw = type?.name ?? "";
  if (raw.includes("|") && raw.includes('"')) {
    const values = [...raw.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    return values.length > 1 ? values : undefined;
  }

  return undefined;
}

/** A rough CMS field type. A starting point for mapping, not a decision. */
function fieldKind(prop) {
  const raw = prop.type?.name ?? "";
  if (options(prop.type)) return "select";
  if (raw === "boolean" || raw === "boolean | null") return "boolean";
  if (raw === "number") return "number";
  if (raw === "string") return "text";
  if (raw === "ElementType") return "not-authored";
  if (raw === "ReactNode" || /ReactNode|ReactElement/.test(raw)) return "slot";
  if (/\[\]|Array</.test(raw)) return "reference-list";
  if (/=>/.test(raw)) return "not-authored";
  return "unknown";
}

const results = [];
let propCount = 0;

for (const entry of GROUPS) {
  const abs = path.join(root, entry.file);
  if (!fs.existsSync(abs)) {
    console.error(`  missing: ${entry.file}`);
    continue;
  }

  for (const doc of parser.parse(abs)) {
    if (!entry.include.includes(doc.displayName)) continue;

    const props = Object.values(doc.props ?? {})
      .map((prop) => {
        propCount += 1;
        return {
          name: prop.name,
          type: prop.type?.name ?? "unknown",
          required: Boolean(prop.required),
          default: prop.defaultValue?.value ?? null,
          description: (prop.description ?? "").trim() || null,
          options: options(prop.type) ?? null,
          fieldKind: fieldKind(prop),
        };
      })
      .sort((a, b) =>
        a.required === b.required
          ? a.name.localeCompare(b.name)
          : Number(b.required) - Number(a.required),
      );

    results.push({
      name: doc.displayName,
      group: entry.group,
      groupNote: entry.note,
      file: entry.file,
      description: (doc.description ?? "").trim() || null,
      props,
    });
  }
}

results.sort(
  (a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name),
);

const payload = {
  generatedNote:
    "Generated by scripts/schema.mjs from the component TypeScript. Do not edit by hand — run npm run schema.",
  componentCount: results.length,
  propCount,
  components: results,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");

console.log(
  `${results.length} components, ${propCount} props → src/generated/component-schema.json`,
);
for (const c of results) {
  console.log(`  ${String(c.props.length).padStart(2)}  ${c.group} / ${c.name}`);
}
