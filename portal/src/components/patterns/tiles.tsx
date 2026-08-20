import clsx from "clsx";
import type { ReactNode } from "react";
import { AppLink, LinkButton, Text } from "@/components/primitives";
import { formatDate, relativeUpcoming } from "@/lib/selectors";
import type { ContentItem, Service } from "@/types";

/**
 * The mosaic tile system. Used as an in-page element for browse modules:
 * services, events, learning and news.
 *
 * Scan modules (updates, requests, resources) stay as ruled lists. A member
 * looking for what changed reads rows faster than tiles, and the brief rules
 * out making the whole page a card grid.
 */

export type TileTone =
  | "paper"
  | "sand"
  | "mist"
  | "ochre"
  | "clay"
  | "forest";

/**
 * No white tiles. A white box on a page reads as a component sitting on top
 * of the design rather than part of it, and eight of them in a column is
 * what made the middle of the page feel repetitive. Every tone is a tint of
 * the palette instead.
 *
 * The 2026 rebrand inverted five of these six. Ocean and Sunshine are
 * lighter than the page ground rather than darker than it, so where clay
 * and ochre used to be dark blocks with white text, they are now bright
 * tints with dark text. Only Deep still carries inverse copy.
 */
const TONE: Record<TileTone, string> = {
  paper: "border-transparent bg-sunken text-primary",
  sand: "border-transparent bg-field-sand text-primary",
  mist: "border-transparent bg-field-mist text-primary",
  ochre: "border-transparent bg-accent-ochre text-on-tint",
  clay: "border-transparent bg-accent-clay text-on-tint",
  forest: "bg-field-forest text-inverse",
};

const PILL: Record<TileTone, string> = {
  paper: "bg-page text-action",
  sand: "bg-page text-action",
  mist: "bg-page text-action",
  ochre: "bg-page text-action",
  clay: "bg-page text-action",
  forest: "bg-inverse text-action",
};

/**
 * Only the Deep field takes inverse body copy. On Ocean and Sunshine the
 * page's own faint tone fails 4.5:1, so those two use a dedicated pair
 * solved against the tint: 5.50 on Ocean, 6.44 on Sunshine.
 */
const BODY: Record<TileTone, string> = {
  paper: "text-secondary",
  sand: "text-secondary",
  mist: "text-secondary",
  ochre: "text-on-tint-soft",
  clay: "text-on-tint-soft",
  forest: "text-inverse-soft",
};

const SPAN: Record<number, string> = {
  1: "",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
};

export function TileGrid({ children }: { children: ReactNode }) {
  return <div className="tile-grid">{children}</div>;
}

export function Tile({
  tone = "paper",
  span = 1,
  rows = 1,
  as: rawTag = "div",
  interactive = false,
  className,
  children,
  ...rest
}: {
  tone?: TileTone;
  span?: 1 | 2 | 3 | 4;
  rows?: 1 | 2;
  as?: "div" | "a" | "button" | "article";
  interactive?: boolean;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  // An interactive tile that points at a route has to be a client-side
  // link like everything else. Cast is safe: every `as="a"` call site
  // supplies an href, which is spread through `rest`.
  const Tag = (rawTag === "a" ? AppLink : rawTag) as React.ElementType;

  return (
    <Tag
      data-interactive={interactive || undefined}
      className={clsx(
        "tile",
        TONE[tone],
        SPAN[span],
        rows === 2 && "lg:row-span-2",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function TilePill({
  tone = "paper",
  children,
}: {
  tone?: TileTone;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-block rounded-pill px-3 py-1.5 text-pill font-semibold uppercase tracking-badge",
        PILL[tone],
      )}
    >
      {children}
    </span>
  );
}

export function TileBody({
  tone = "paper",
  children,
}: {
  tone?: TileTone;
  children: ReactNode;
}) {
  return (
    <p className={clsx("mt-3 text-small leading-relaxed", BODY[tone])}>
      {children}
    </p>
  );
}

export function TileLink({ children }: { children: ReactNode }) {
  return (
    <span className="tile-link mt-auto pt-6 text-small font-semibold underline underline-offset-4">
      {children}
    </span>
  );
}

export function TileHeading({
  children,
  serif = false,
  className,
}: {
  children: ReactNode;
  serif?: boolean;
  className?: string;
}) {
  return (
    <h3
      className={clsx(
        serif
          ? "font-display text-display font-normal"
          : "text-h2 font-semibold",
        className,
      )}
    >
      {children}
    </h3>
  );
}

/* ============================================================
   Composed tiles
   ============================================================ */

export function ServiceTile({
  service,
  href,
  tone = "paper",
  span = 1,
  rows = 1,
  lead = false,
  pill = true,
}: {
  service: Service;
  href: string;
  tone?: TileTone;
  span?: 1 | 2 | 3 | 4;
  rows?: 1 | 2;
  lead?: boolean;
  /**
   * Off in the support module. Every pathway there is included in
   * membership, so three identical pills stacked across the row said
   * nothing and pushed the headings down.
   */
  pill?: boolean;
}) {
  return (
    <Tile as="a" interactive href={href} tone={tone} span={span} rows={rows}>
      {pill ? (
        <span className="mb-4">
          <TilePill tone={tone}>
            {service.includedInMembership
              ? "Included in your membership"
              : service.externalLabel}
          </TilePill>
        </span>
      ) : null}
      <TileHeading serif={lead}>{service.name}</TileHeading>
      {lead ? <TileBody tone={tone}>{service.summary}</TileBody> : null}
      <TileLink>
        {service.requestable ? "Request support" : "Open"}
      </TileLink>
    </Tile>
  );
}

function meta(item: ContentItem): string {
  return [item.format, item.location]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(" · ");
}

/**
 * The date is the thing a member scans an event list for, so it carries
 * display weight rather than sitting in a small grey chip.
 */
function EventDate({
  item,
  large = false,
  inverse = false,
}: {
  item: ContentItem;
  large?: boolean;
  inverse?: boolean;
}) {
  if (!item.eventIso) return null;
  const [day, month] = formatDate(item.eventIso).split(" ");

  return (
    <span className="flex flex-none items-baseline gap-1.5">
      <span
        className={clsx(
          "font-display leading-none",
          large ? "text-mega" : "text-display",
        )}
      >
        {day}
      </span>
      <span
        className={clsx(
          "text-micro font-semibold uppercase tracking-badge",
          inverse ? "text-inverse-soft" : "text-tertiary",
        )}
      >
        {month.slice(0, 3)}
      </span>
    </span>
  );
}

/** The soonest event. Takes a colour block, a summary and an action. */
export function LeadEventTile({
  item,
  near = false,
  tone = "forest",
  action,
}: {
  item: ContentItem;
  near?: boolean;
  tone?: TileTone;
  action?: ReactNode;
}) {
  // Only Deep is a dark ground now. Ocean and Sunshine are bright tints.
  const inverse = tone === "forest";

  return (
    <Tile tone={tone} span={2} rows={2}>
      <span
        className={clsx(
          "mb-3 block text-micro font-semibold uppercase tracking-eyebrow",
          inverse ? "text-inverse-soft" : "text-tertiary",
        )}
      >
        {item.eventIso ? relativeUpcoming(item.eventIso) : "Running now"}
        {near ? " · Near your school" : ""}
      </span>

      <span className="mb-5 block">
        <EventDate item={item} large inverse={inverse} />
      </span>

      <TileHeading serif>
        <AppLink href={`/events/${item.id}`} className="tile-title-link">
          {item.title}
        </AppLink>
      </TileHeading>
      <TileBody tone={tone}>{item.summary}</TileBody>

      <span className="mt-auto pt-7">
        <span
          className={clsx(
            "block text-micro",
            inverse ? "text-inverse-faint" : "text-tertiary",
          )}
        >
          {meta(item)}
        </span>
        {action ? <span className="mt-4 block">{action}</span> : null}
      </span>
    </Tile>
  );
}

/** Everything after the lead. Horizontal, date-led, compact. */
export function EventTile({
  item,
  near = false,
  tone = "paper",
  span = 2,
  actionLabel = "Register",
}: {
  item: ContentItem;
  near?: boolean;
  tone?: TileTone;
  span?: 1 | 2 | 3 | 4;
  actionLabel?: string;
}) {
  return (
    <Tile tone={tone} span={span} className="justify-center">
      <span className="flex items-start gap-6">
        <EventDate item={item} />
        <span className="min-w-0 flex-1">
          <TileHeading className="text-h3">
            <AppLink href={`/events/${item.id}`} className="tile-title-link">
              {item.title}
            </AppLink>
          </TileHeading>
          <Text as="span" size="micro" tone="tertiary" className="mt-1.5 block">
            {meta(item)}
            {item.eventIso ? ` · ${relativeUpcoming(item.eventIso)}` : ""}
            {near ? " · Near your school" : ""}
          </Text>
          {/* Summary on the secondary tiles too. Without it they were a
              title and a meta line floating in a large box. */}
          <TileBody tone={tone}>{item.summary}</TileBody>
          <span className="mt-5 block">
            <LinkButton
              variant="secondary"
              size="sm"
              href={`/events/${item.id}/register`}
            >
              {actionLabel}
            </LinkButton>
          </span>
        </span>
      </span>
    </Tile>
  );
}

