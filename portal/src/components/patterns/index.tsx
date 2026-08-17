import clsx from "clsx";
import {
  FileSpreadsheet,
  FileText,
  FileType,
  Globe,
  Presentation,
} from "lucide-react";
import type { ReactNode } from "react";
import { Cell, CellGrid } from "@/components/layout";
import { ArrowIcon, Badge, Button, Eyebrow, InclusionMark, InfoIcon, LinkButton, Text } from "@/components/primitives";
import { areaLabel } from "@/data/areas";
import { formatDate, relativeDate, relativeUpcoming } from "@/lib/selectors";
import type { FileKind } from "@/data/files";
import type { ContentItem, ServiceRequest, Service } from "@/types";

const CATEGORY_LABEL: Record<string, string> = {
  "governance-compliance-risk": "Governance, compliance and risk",
  "people-culture": "People and culture",
  "facilities-operations-finance": "Facilities, operations and finance",
  "learning-wellbeing": "Learning and wellbeing",
  "vision-strategy": "Vision and strategy",
  "communications-relationships": "Communications and relationships",
  general: "ISV",
};

export function categoryLabel(key: string): string {
  return CATEGORY_LABEL[key] ?? "ISV";
}

/* ============================================================
   ServiceCard
   ============================================================ */
export function ServiceCard({
  service,
  href,
}: {
  service: Service;
  href: string;
}) {
  return (
    <Cell as="a" interactive href={href} className="block no-underline">
      <Eyebrow className="mb-3">{categoryLabel(service.category)}</Eyebrow>
      <Text as="h3" size="h3" className="mb-2">
        {service.name}
      </Text>
      <Text size="small" tone="secondary">
        {service.summary}
      </Text>
      <p className="mt-6 flex items-center gap-2 text-micro text-tertiary">
        {service.includedInMembership ? (
          <InclusionMark>{service.inclusionNote}</InclusionMark>
        ) : (
          <span>{service.externalLabel}</span>
        )}
      </p>
    </Cell>
  );
}

/* ============================================================
   ContentCard — resources, news
   ============================================================ */
/**
 * Content and event cards are presentational. The prototype does not build
 * through to article or event pages, so they carry no hover affordance and no
 * handler. A card that looks clickable and is not is worse than a static one.
 */
export function ContentCard({ item }: { item: ContentItem }) {
  return (
    <Cell>
      <Eyebrow className="mb-3">{areaLabel(item.isvSystem)}</Eyebrow>
      <Text as="h3" size="h3" className="mb-2">
        {item.title}
      </Text>
      <Text size="small" tone="secondary">
        {item.summary}
      </Text>
      <p className="mt-6 text-micro text-tertiary">{item.recencyLabel}</p>
    </Cell>
  );
}

/* ============================================================
   UpdateList — "what has changed"
   Dated, categorised, most recent first. This is the module that
   makes the portal read as live rather than static.
   ============================================================ */
/**
 * The lead-and-stack treatment. One update carries the weight, the rest
 * compress to single lines, and the counter panel uses the width that the
 * uniform list was wasting.
 *
 * The counter is the bit that makes the personalisation claim land: it is a
 * number about the member, not about ISV.
 */
export function UpdateLead({
  items,
  sinceLabel,
  contextLine,
}: {
  items: ContentItem[];
  sinceLabel: string;
  contextLine: string;
}) {
  const [lead, ...stack] = items;
  if (!lead) return null;

  return (
    <div>
      <div className="update-lead">
        <div>
          <span className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-pill bg-action-quiet px-2.5 py-1 text-micro font-semibold uppercase tracking-badge text-action">
              {categoryLabel(lead.category)}
            </span>
            <Text as="span" size="micro" tone="tertiary">
              {relativeDate(lead.publishedIso)} · {areaLabel(lead.isvSystem)}
            </Text>
          </span>

          <Text as="h3" size="display" measure="narrow">
            {lead.title}
          </Text>
          <Text size="body" tone="secondary" measure="narrow" className="mt-3">
            {lead.summary}
          </Text>

          <div className="mt-6">
            <Button variant="secondary">Open in {areaLabel(lead.isvSystem)}</Button>
          </div>
        </div>

        <aside className="bg-field-mist p-cell">
          <Eyebrow className="mb-3">{sinceLabel}</Eyebrow>
          <p className="font-serif text-mega leading-none">{items.length}</p>
          <Text size="small" tone="secondary" className="mt-3">
            {contextLine}
          </Text>
        </aside>
      </div>

      <ul>
        {stack.map((item) => (
          <li key={item.id}>
            <div className="row-hover row-rule update-stack-row py-4">
              <Text as="span" size="micro" tone="tertiary" mono>
                {relativeDate(item.publishedIso)}
              </Text>
              <Text as="span" size="body" className="font-semibold">
                {item.title}
              </Text>
              <Text as="span" size="micro" tone="tertiary" mono>
                {areaLabel(item.isvSystem)}
              </Text>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UpdateList({ items }: { items: ContentItem[] }) {
  return (
    <ul className="border-t border-line">
      {items.map((item) => (
        <li
          key={item.id}
          className="update-grid items-baseline border-b border-line py-index-row"
        >
          <span className="whitespace-nowrap font-mono text-micro text-tertiary">
            {relativeDate(item.publishedIso)}
          </span>
          <span>
            <span className="mb-1.5 flex flex-wrap items-center gap-2.5">
              <span className="rounded-sm bg-action-quiet px-2 py-0.5 text-micro font-semibold uppercase tracking-badge text-action">
                {categoryLabel(item.category)}
              </span>
              <Text as="span" size="micro" tone="tertiary">
                {areaLabel(item.isvSystem)}
              </Text>
            </span>
            <Text as="h3" size="h3" className="block">
              {item.title}
            </Text>
            <Text
              as="span"
              size="small"
              tone="secondary"
              measure="narrow"
              className="mt-1 block"
            >
              {item.summary}
            </Text>
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   EventCard — date-led, with a near-your-school marker
   ============================================================ */
export function EventCard({
  item,
  near = false,
}: {
  item: ContentItem;
  near?: boolean;
}) {
  return (
    <Cell>
      <span className="mb-3 flex flex-wrap items-center gap-2.5">
        <Eyebrow>
          {item.eventIso ? formatDate(item.eventIso) : item.recencyLabel}
        </Eyebrow>
        {item.eventIso ? (
          <Text as="span" size="micro" tone="action" className="font-semibold">
            {relativeUpcoming(item.eventIso)}
          </Text>
        ) : null}
      </span>

      <Text as="h3" size="h3" className="mb-2">
        {item.title}
      </Text>
      <Text size="small" tone="secondary">
        {item.summary}
      </Text>

      <p className="mt-5 flex flex-wrap items-center gap-2.5 text-micro text-tertiary">
        {/* Online sessions have no separate location, so the two are joined
            rather than printed as "Online · Online". */}
        <span>{[item.format, item.location].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(" · ")}</span>
        {near ? (
          <span className="rounded-sm border border-action-quiet bg-action-quiet px-2 py-0.5 font-semibold text-action">
            Near your school
          </span>
        ) : null}
      </p>
    </Cell>
  );
}

/* ============================================================
   IndexList — the editorial index. Numbered, ruled, hover shift.
   Replaces a card grid for anything list-shaped.
   ============================================================ */
export function IndexList({
  items,
  inverse = false,
  action,
  near,
  hrefFor,
}: {
  items: ContentItem[];
  inverse?: boolean;
  /** Rendered per row when the item has somewhere real to go */
  action?: (item: ContentItem) => ReactNode;
  /** Marks a row as near the member's school */
  near?: (item: ContentItem) => boolean;
  /** Supplied once a listing has real destinations to point rows at */
  hrefFor?: (item: ContentItem) => string;
}) {
  return (
    // No border-t. The section header rule is the top keyline; adding one
    // here draws a second rule a section gap below the first.
    <ul>
      {items.map((item, i) => (
        <li key={item.id}>
          {/* A row is only a link when hrefFor is given. Without it these
              point at areas the prototype does not build through, and five
              rows scrolling to the same anchor is worse than five rows that
              plainly do not navigate. */}
          <div className="row-hover row-rule index-grid relative items-baseline py-index-row">
            <span
              className={clsx(
                "font-mono text-micro",
                inverse ? "text-inverse-faint" : "text-tertiary",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <Text
                as="h3"
                size="h2"
                tone={inverse ? "inverse" : "primary"}
                className="block"
              >
                {hrefFor ? (
                  <a href={hrefFor(item)} className="tile-title-link">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </Text>
              <Text
                as="span"
                size="small"
                tone={inverse ? "inverseSoft" : "secondary"}
                measure="narrow"
                className="mt-1.5 block"
              >
                {item.summary}
              </Text>
              {item.format || item.eventIso ? (
                <span className="mt-2 flex flex-wrap items-center gap-2.5">
                  {item.eventIso ? (
                    <Text
                      as="span"
                      size="micro"
                      tone={inverse ? "inverse" : "action"}
                      className="font-semibold"
                    >
                      {formatDate(item.eventIso)} · {relativeUpcoming(item.eventIso)}
                    </Text>
                  ) : (
                    <Text
                      as="span"
                      size="micro"
                      tone={inverse ? "inverse" : "action"}
                      className="font-semibold"
                    >
                      Running now
                    </Text>
                  )}
                  <Text
                    as="span"
                    size="micro"
                    tone={inverse ? "inverseFaint" : "tertiary"}
                  >
                    {[item.format, item.location]
                      .filter(Boolean)
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .join(" · ")}
                  </Text>
                  {near?.(item) ? (
                    <Text
                      as="span"
                      size="micro"
                      tone={inverse ? "inverse" : "action"}
                      className="font-semibold"
                    >
                      Near your school
                    </Text>
                  ) : null}
                </span>
              ) : null}
              {action ? <span className="mt-3 block">{action(item)}</span> : null}
            </span>
            <span
              className={clsx(
                "hidden whitespace-nowrap text-micro sm:block",
                inverse ? "text-inverse-faint" : "text-tertiary",
              )}
            >
              {areaLabel(item.isvSystem)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   FilterBar — Discovery-status surface one of four.
   Visibly disabled, honestly labelled.
   ============================================================ */
export function FilterBar({
  labels,
  inverse = false,
}: {
  labels: string[];
  inverse?: boolean;
}) {
  // The Discovery sentence appears once for the group, not once per chip.
  // Repeated per chip it appeared six times on a landing page and read as
  // hedging rather than as a credibility signal.
  return (
    <div
      role="group"
      aria-label="Filters"
      aria-describedby="filter-discovery-note"
      className="mb-6"
    >
      <div className="flex flex-wrap gap-2.5">
        {labels.map((label) => (
          <button
            key={label}
            type="button"
            disabled
            className={clsx(
              "inline-flex h-control-sm cursor-not-allowed items-center gap-2 rounded-sm border border-dashed px-3 text-micro",
              inverse
                ? "border-line-inverse-firm text-inverse-faint"
                : "border-line-firm bg-sunken text-tertiary",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <Eyebrow inverse={inverse} className="mt-2.5" id="filter-discovery-note">
        Taxonomy and filtering confirmed during Discovery
      </Eyebrow>
    </div>
  );
}

/* ============================================================
   RequestTimeline
   ============================================================ */
export function RequestTimeline({ request }: { request: ServiceRequest }) {
  return (
    <ol className="flex flex-col gap-4 sm:flex-row sm:gap-0">
      {request.timeline.map((step) => (
        <li
          key={step.label}
          data-complete={step.complete}
          className="timeline-step relative flex-1 pt-5.5"
        >
          <span
            className={clsx(
              "block text-micro font-semibold",
              step.complete ? "text-primary" : "text-tertiary",
            )}
          >
            {step.label}
          </span>
          <span className="text-micro text-tertiary">
            {step.iso ? formatDate(step.iso) : "—"}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ============================================================
   ScheduleList — dated rows beside a lead block.

   Not a tile and not the numbered index. A term programme reads
   as a schedule, so it renders as one.
   ============================================================ */
export function ScheduleList({
  items,
  nearFn,
  columns = 2,
}: {
  items: ContentItem[];
  nearFn?: (item: ContentItem) => boolean;
  /**
   * One column when the list sits under a pair of featured tiles — two
   * columns there left a half-empty row and made three sessions look like
   * an afterthought.
   */
  columns?: 1 | 2;
}) {
  return (
    <ul className="schedule-list" data-columns={columns}>
      {items.map((item) => (
        <li key={item.id}>
          <div className="row-hover row-rule schedule-row py-4">
            {item.eventIso ? (
              <span className="flex flex-none items-baseline gap-1.5">
                <span className="font-serif text-h2 leading-none">
                  {formatDate(item.eventIso).split(" ")[0]}
                </span>
                <span className="text-micro font-semibold uppercase tracking-badge text-tertiary">
                  {formatDate(item.eventIso).split(" ")[1].slice(0, 3)}
                </span>
              </span>
            ) : (
              <span className="text-micro font-semibold uppercase tracking-badge text-tertiary">
                Ongoing
              </span>
            )}
            <span className="min-w-0">
              <Text as="span" size="h3" className="block">
                <a href={`/events/${item.id}`} className="tile-title-link">
                  {item.title}
                </a>
              </Text>
              <Text as="span" size="micro" tone="tertiary" className="mt-1 block">
                {[item.format, item.location]
                  .filter(Boolean)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .join(" · ")}
                {item.eventIso ? ` · ${relativeUpcoming(item.eventIso)}` : ""}
                {nearFn?.(item) ? " · Near your school" : ""}
              </Text>
            </span>
            <LinkButton
              variant="secondary"
              size="sm"
              className="justify-self-end"
              href={`/events/${item.id}/register`}
            >
              Register
            </LinkButton>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   RequestRow — the landing page treatment.

   The full timeline is detail, and detail belongs on the detail
   screen. Here a request only needs to answer three things: what
   it is, where it is up to, and how to get in. One ruled row does
   that in roughly a fifth of the height, and it stays tight when
   a second request arrives during the demo.
   ============================================================ */
export function RequestRow({
  request,
  serviceName,
  href,
}: {
  request: ServiceRequest;
  serviceName: string;
  href: string;
}) {
  const done = request.timeline.filter((s) => s.complete).length;
  const total = request.timeline.length;
  const current =
    request.timeline.filter((s) => s.complete).at(-1)?.label ??
    request.statusLabel;

  return (
    <a href={href} className="request-row">
      <span className="min-w-0">
        <Eyebrow className="mb-1.5">{serviceName}</Eyebrow>
        <Text as="span" size="h3" className="block">
          {request.subject}
        </Text>
      </span>

      <span className="flex items-center gap-3">
        <span className="flex gap-1" aria-hidden>
          {request.timeline.map((step) => (
            <span
              key={step.label}
              data-complete={step.complete}
              className="progress-segment"
            />
          ))}
        </span>
        <Text as="span" size="micro" tone="secondary" className="whitespace-nowrap">
          {current} · {done} of {total}
        </Text>
      </span>

      <span className="flex items-center gap-3 justify-self-end">
        <Text as="span" size="micro" tone="tertiary" mono className="hidden lg:inline">
          {request.reference}
        </Text>
        <ArrowIcon className="text-tertiary" />
      </span>
    </a>
  );
}

/* ============================================================
   RequestStatusCard — kept for the request detail screen
   ============================================================ */
export function RequestStatusCard({
  request,
  serviceName,
  href,
}: {
  request: ServiceRequest;
  serviceName: string;
  href: string;
}) {
  return (
    <article className="bg-sunken">
      <div className="flex flex-wrap items-start gap-5 border-b border-line p-cell">
        <div className="min-w-0 flex-1">
          <Eyebrow className="mb-2">{serviceName}</Eyebrow>
          <Text as="h3" size="h3" className="mb-1.5">
            {request.subject}
          </Text>
          <Text size="micro" tone="tertiary" mono>
            {request.reference}
          </Text>
        </div>
        <Badge>{request.statusLabel}</Badge>
      </div>

      <div className="p-cell">
        <RequestTimeline request={request} />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line p-cell">
        <Text size="micro" tone="tertiary">
          {request.nextStep}
        </Text>
        <a
          href={href}
          className="ml-auto inline-flex items-center gap-2 border-b border-line-firm pb-px text-small text-secondary transition-colors duration-150 hover:border-action hover:text-action"
        >
          View request <ArrowIcon />
        </a>
      </div>
    </article>
  );
}

/* ============================================================
   EmptyState — baseline rule texture, per the imagery rules
   ============================================================ */
export function EmptyState({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <div className="texture-rules border border-line px-8 py-11 text-center">
      <Text as="p" size="h3" className="mb-2">
        {heading}
      </Text>
      <Text size="small" tone="secondary" measure="narrow" className="mx-auto">
        {body}
      </Text>
    </div>
  );
}

/* ============================================================
   PrefillNote — the moment Act 3 proves connected member context.
   Deliberately visible rather than silent. Never names Dynamics.
   ============================================================ */
export function PrefillNote() {
  return (
    <span className="mt-1.5 flex items-center gap-1.5 text-micro text-tertiary">
      <InfoIcon />
      From your ISV member profile
    </span>
  );
}

/* ============================================================
   Artwork — student artwork stand-in.
   CSS-generated. Replace with real isArtworks assets, subject to
   licensing confirmation.
   ============================================================ */
export function Artwork({
  variant = "a",
  caption,
  className,
}: {
  variant?: "a" | "b";
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx("artwork", `artwork-${variant}`, className)}
      role="img"
      aria-label="Student artwork from the ISV isArtworks collection"
    >
      {/* The composition lives in a fixed-ratio canvas. Positioned as
          percentages of the outer box, the shapes stretched into smears
          whenever the panel was wider than it was tall. */}
      <span className="artwork-canvas" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <i key={n} />
        ))}
      </span>
      {caption ? (
        <span className="artwork-caption">{caption}</span>
      ) : null}
    </div>
  );
}

/* ============================================================
   FeatureBlock — editorial feature with artwork panel
   ============================================================ */
export function FeatureBlock({
  eyebrow,
  title,
  summary,
  action,
  caption,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  action: ReactNode;
  caption: string;
}) {
  return (
    <article className="grid border border-line md:grid-cols-2">
      <div className="p-cell md:p-10">
        <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
        <Text as="h3" size="display" className="mb-4">
          {title}
        </Text>
        <Text size="small" tone="secondary" measure="narrow">
          {summary}
        </Text>
        <div className="mt-7">{action}</div>
      </div>
      <Artwork variant="a" caption={caption} className="min-h-56" />
    </article>
  );
}

export { CellGrid };

export * from "./tiles";
export * from "./stories";

/* ============================================================
   FileIcon — what you are about to download

   Lucide icons at the same weight as the header icons, in a tinted
   square so the format reads before the label does.
   ============================================================ */
export function FileIcon({
  kind,
  large = false,
}: {
  kind: FileKind;
  large?: boolean;
}) {
  const Icon =
    kind === "sheet"
      ? FileSpreadsheet
      : kind === "slides"
        ? Presentation
        : kind === "web"
          ? Globe
          : kind === "doc"
            ? FileText
            : FileType;

  return (
    <span className={clsx("file-icon", large && "file-icon-lg")} aria-hidden>
      <Icon
        className={large ? "size-6" : "size-4.5"}
        strokeWidth={1.5}
      />
    </span>
  );
}
