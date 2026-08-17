/**
 * Resource files.
 *
 * A resource is a thing you take away, so the portal has to say what you are
 * about to get before you click. Format, size and length are the three
 * things people check, and a template is a very different proposition to a
 * forty page guide.
 *
 * Kept separate from content.ts because format is a property of the file,
 * not of the resource. The same guidance could ship as a PDF this year and a
 * web page next year without the resource itself changing.
 *
 * All ILLUSTRATIVE. Sizes and page counts are plausible, not measured.
 */

export type FileKind = "pdf" | "doc" | "sheet" | "slides" | "web";

export interface ResourceFile {
  kind: FileKind;
  /** What the label reads. "PDF", "Word template", and so on. */
  label: string;
  size?: string;
  /** Pages for a document, sheets for a workbook */
  extent?: string;
}

const FILES: Record<string, ResourceFile> = {
  "resource-compliance-policies": {
    kind: "doc",
    label: "Word template",
    size: "148 KB",
    extent: "12 pages",
  },
  "resource-child-safety": {
    kind: "pdf",
    label: "PDF",
    size: "1.4 MB",
    extent: "28 pages",
  },
  "resource-registration": {
    kind: "pdf",
    label: "PDF",
    size: "2.1 MB",
    extent: "44 pages",
  },
  "resource-governance": {
    kind: "pdf",
    label: "PDF",
    size: "980 KB",
    extent: "18 pages",
  },
  "resource-people-culture": {
    kind: "doc",
    label: "Word template",
    size: "212 KB",
    extent: "9 pages",
  },
  "resource-vision-strategy": {
    kind: "slides",
    label: "PowerPoint template",
    size: "3.6 MB",
    extent: "22 slides",
  },
  "resource-learning-wellbeing": {
    kind: "pdf",
    label: "PDF",
    size: "1.1 MB",
    extent: "24 pages",
  },
  "resource-isrecruit-overview": {
    kind: "web",
    label: "Web page",
  },
};

/** Everything not listed is a PDF. It is the honest default for guidance. */
export function resourceFile(id: string): ResourceFile {
  return FILES[id] ?? { kind: "pdf", label: "PDF" };
}

/** "PDF · 1.4 MB · 28 pages", with the empty parts dropped. */
export function fileMeta(id: string): string {
  const file = resourceFile(id);
  return [file.label, file.size, file.extent].filter(Boolean).join(" · ");
}
