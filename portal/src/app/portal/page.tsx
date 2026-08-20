"use client";

import { useEffect, useState } from "react";
import { memberAlerts } from "@/data/alerts";
import { areaLabel } from "@/data/areas";
import { parentStories } from "@/data/parents";
import { greetingByRole } from "@/data/modules";
import { portalNavigation } from "@/data/navigation";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import {
  Field,
  SectionHeader,
  Wrap,
  isInverseField,
} from "@/components/layout";
import {
  Artwork,
  EmptyState,
  StoryCard,
  StoryGrid,
  EventTile,
  IndexList,
  LeadEventTile,
  RequestRow,
  ScheduleList,
  ServiceTile,
  Tile,
  TileBody,
  TileGrid,
  TileHeading,
  TileLink,
  TilePill,
  UpdateLead,
  categoryLabel,
} from "@/components/patterns";
import { AppLink, ArrowIcon, Eyebrow, LinkButton, Text } from "@/components/primitives";
import { useMember } from "@/lib/member-context";
import {
  getService,
  greetingForTime,
  isNearSchool,
  selectContentByIds,
  selectEvents,
  selectInterestLearning,
  selectRoleLearning,
  selectModules,
  selectRequests,
  selectServicesByIds,
  selectUpdates,
  relativeUpcoming,
} from "@/lib/selectors";
import type { ModuleDef } from "@/types";

/**
 * Screens 1 and 2 — the Principal and Business Manager landing pages.
 *
 * One route, one component tree. Only the composition and the data selected
 * change between roles. This is the architectural demonstration and must not
 * become two pages.
 */
export default function PortalPage() {
  const { role, switchToken } = useMember();
  const modules = selectModules(role);

  return (
    <AppShell>
      <main key={switchToken}>
        {modules.map((module) => (
          <Module key={module.id} module={module} />
        ))}
      </main>
      <AskIsv />
    </AppShell>
  );
}

function Module({ module }: { module: ModuleDef }) {
  const inverse = isInverseField(module.field);

  return (
    <Field
      tone={module.field}
      tight={module.itemType === "request" || module.itemType === "nav"}
      wash={module.itemType === "header"}
      className="module-enter"
    >
      <Wrap>
        {module.itemType !== "header" ? (
          <SectionHeader
            heading={module.heading}
            moreLabel={module.moreLabel}
            moreHref={module.moreHref}
            inverse={inverse}
            id={module.id === "mod-nav" ? "portal-navigation" : undefined}
          />
        ) : null}

        <ModuleBody module={module} />
      </Wrap>
    </Field>
  );
}

function ModuleBody({ module }: { module: ModuleDef }) {
  const { role, member, requests } = useMember();

  switch (module.itemType) {
    case "header":
      return <Masthead />;

    case "parents":
      return <ParentsBand />;

    case "hiring":
      return <HiringBand />;


    case "request": {
      const mine = selectRequests(requests, member);
      if (mine.length === 0) {
        return (
          <EmptyState
            heading="No open requests"
            body="Requests we make through the portal appear here, so we can follow where each one sits."
          />
        );
      }
      return (
        <div className="request-panel">
          {mine.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              serviceName={getService(request.serviceId)?.name ?? "ISV service"}
              href={`/requests/${request.id}`}
            />
          ))}
        </div>
      );
    }

    /**
     * SUPPORT — three equal colour blocks.
     *
     * Every browse module used to be a 2x2 lead beside two tiles, so
     * resources, support and learning read as one repeated shape. Each now
     * has its own structure. This is the action module, so it gets the
     * boldest: three full-height blocks, navy, red and gold, no hierarchy
     * between them because a member picks by need rather than prominence.
     */
    case "service": {
      const services = selectServicesByIds(module.itemIds, role);
      const tones = ["forest", "clay", "ochre"] as const;
      return (
        <div className="support-grid">
          {services.slice(0, 3).map((service, i) => (
            <ServiceTile
              key={service.id}
              service={service}
              href={`/services/${service.slug}`}
              tone={tones[i]}
              lead
              pill={false}
            />
          ))}
        </div>
      );
    }

    case "content": {
      if (module.id === "mod-news") return <NewsModule ids={module.itemIds} />;

      /**
       * RESOURCES — editorial index, no tiles at all.
       *
       * This is a scan surface. Rows read faster than cards and the numbered
       * index is the strongest editorial pattern we have, so it also gives
       * the middle of the page a shape that is not a grid.
       */
      if (module.id === "mod-resources") {
        // Resources now have a detail screen, so the rows are links.
        return (
          <IndexList
            items={selectContentByIds(module.itemIds, role)}
            hrefFor={(item) => `/resources/${item.id}`}
          />
        );
      }

      /**
       * LEARNING — one block, then a ruled schedule.
       *
       * A split rather than a grid. The next session takes a colour block on
       * the left and everything after it is a dated list on the right, which
       * is how a term programme actually reads.
       */
      if (module.id === "mod-learning") {
        const sessions = selectInterestLearning(member);
        if (sessions.length === 0) return null;
        // Two featured sessions side by side. One block at full width was
        // taller than the three modules above it put together, which made a
        // recommendation look like an announcement.
        const featured = sessions.slice(0, 2);
        // Interest-matched sessions run out at four. Top the list up with
        // other learning open to this role rather than leaving a half row —
        // the interest match is still what orders the top of the module.
        const shown = sessions.map((item) => item.id);
        const topUp = selectRoleLearning(role).filter(
          (item) => !shown.includes(item.id),
        );
        const rest = [...sessions.slice(2), ...topUp].slice(0, 3);
        const tones = ["clay", "forest"] as const;

        return (
          <div className="grid gap-6">
            <TileGrid>
              {featured.map((item, i) => (
                <LeadEventTile
                  key={item.id}
                  item={item}
                  near={isNearSchool(item)}
                  tone={tones[i]}
                  action={
                    <LinkButton
                      variant="onInverse"
                      size="sm"
                      href={`/events/${item.id}/register`}
                    >
                      Register
                    </LinkButton>
                  }
                />
              ))}
            </TileGrid>
            {rest.length > 0 ? (
              <ScheduleList items={rest} columns={1} />
            ) : null}
          </div>
        );
      }

      // Lead takes a 2x2 colour block, the next two sit beside it, and any
      // remainder runs full width. Every row closes at four columns.
      const [nextUp, ...later] = selectEvents(role);
      if (!nextUp) return null;
      return (
        <TileGrid>
          <LeadEventTile
            item={nextUp}
            near={isNearSchool(nextUp)}
            action={
              <LinkButton
                variant="onInverse"
                size="sm"
                href={`/events/${nextUp.id}/register`}
              >
                Register
              </LinkButton>
            }
          />
          {later.slice(0, 2).map((item) => (
            <EventTile
              key={item.id}
              item={item}
              near={isNearSchool(item)}
              tone={isNearSchool(item) ? "sand" : "paper"}
            />
          ))}
          {later.slice(2).map((item) => (
            <EventTile
              key={item.id}
              item={item}
              near={isNearSchool(item)}
              tone={isNearSchool(item) ? "sand" : "paper"}
              span={4}
            />
          ))}
        </TileGrid>
      );
    }

    case "update": {
      const items = selectUpdates(role);
      if (items.length === 0) {
        return (
          <EmptyState
            heading="Nothing new since my last visit"
            body="Updates to ISV resources, guidance and briefings will appear here."
          />
        );
      }
      return (
        <UpdateLead
          items={items}
          sinceLabel="Since my last visit"
          contextLine={updateContextLine(items)}
        />
      );
    }

    case "empty":
      return (
        <EmptyState
          heading="Nothing saved yet"
          body="Resources we save from the library appear here, ready to come back to."
        />
      );

    case "nav":
      return <PortalNavigation />;

    default:
      return null;
  }
}

function Masthead() {
  const { member, school, role, setAskOpen } = useMember();
  const openAsk = () => setAskOpen(true);

  // The page is prerendered at build time, so a time-based greeting computed
  // during render would be baked in and then mismatch on hydration. Resolve
  // it after mount instead. "Good morning" is the stable first paint.
  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => setGreeting(greetingForTime()), []);

  const upcoming = selectEvents(role);
  const nearCount = upcoming.filter(isNearSchool).length;

  return (
    <div>
      <div className="masthead-row">
        <div className="masthead-lead">
          {/* The school name is the way into the school account. It is the
              one thing on this page that is unambiguously about the school
              rather than the person, so it is where somebody looks. */}
          <Eyebrow className="mb-3.5">
            <AppLink href="/school" className="masthead-school">
              {school.name}
            </AppLink>{" "}
            · {school.suburb}
          </Eyebrow>
          <Text as="h1" size="mega">
            {greeting},
            <br />
            {member.firstName}
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-4">
            {greetingByRole[role]}
          </Text>
        </div>
        <MastheadAlert />
      </div>

      {/* Three orienting tiles under the greeting. The masthead is where a
          member decides what to do next, so it carries the shortcuts. */}
      <div className="mt-10">
        <TileGrid>
          <Tile tone="forest" span={2} interactive as="button" onClick={openAsk}>
            <span className="mb-4">
              <TilePill tone="forest">Ask ISV</TilePill>
            </span>
            <TileHeading serif>Ask a question in your own words</TileHeading>
            <TileBody tone="forest">
              Answers drawn from ISV&rsquo;s resources, always with sources.
            </TileBody>
            <TileLink>Open search</TileLink>
          </Tile>

          <Tile tone="mist">
            <TileHeading className="text-h3">Next up</TileHeading>
            <Text as="span" size="small" tone="secondary" className="mt-2 block">
              {upcoming[0]?.title}
            </Text>
            <Text as="span" size="micro" tone="tertiary" className="mt-auto pt-6 block">
              {upcoming[0]?.eventIso ? relativeUpcoming(upcoming[0].eventIso) : ""}
            </Text>
          </Tile>

          <Tile tone="sand">
            <TileHeading className="text-h3">Near us</TileHeading>
            <Text as="span" size="small" tone="secondary" className="mt-2 block">
              {nearCount} {nearCount === 1 ? "session" : "sessions"} running in{" "}
              {school.region.toLowerCase()}
            </Text>
            <Text as="span" size="micro" tone="tertiary" className="mt-auto pt-6 block">
              {school.suburb}
            </Text>
          </Tile>
        </TileGrid>
      </div>
    </div>
  );
}

/**
 * The one thing waiting on the member, in the masthead.
 *
 * The bell in the header carries the full count. This carries the single
 * most recent outstanding action, because a count tells you there is work
 * and a title tells you whether it matters today. Nothing renders when
 * nothing is outstanding — an empty state here would train members to
 * ignore the slot.
 */
function MastheadAlert() {
  const {
    role,
    resolvedAlerts,
    resolveAlert,
    setProfileOpen,
    setContactOpen,
  } = useMember();

  const mine = memberAlerts
    .filter(
      (a) =>
        a.kind === "action" &&
        a.relevantTo.includes(role) &&
        a.outstanding &&
        !resolvedAlerts.includes(a.id),
    )
    .sort((a, b) => b.receivedIso.localeCompare(a.receivedIso));

  const alert = mine[0];
  if (!alert) return null;

  // Same resolution path as the alerts panel, so acting from either place
  // clears the same item and the header count follows.
  function act() {
    if (!alert) return;
    resolveAlert(alert.id);
    if (alert.href === "#profile") setProfileOpen(true);
    else if (alert.href === "#contact") setContactOpen(true);
  }

  return (
    <button
      type="button"
      onClick={act}
      className="masthead-alert"
      aria-label={`${alert.title}. ${alert.actionLabel}`}
    >
      <span className="masthead-alert-mark" aria-hidden />
      <span className="masthead-alert-flag">
        Action needed{mine.length > 1 ? ` · ${mine.length}` : ""}
      </span>
      <span className="masthead-alert-title">{alert.title}</span>
      <ArrowIcon />
    </button>
  );
}

/**
 * The Parents Website band.
 *
 * ISV already runs a parent-facing masthead. Schools forward it to families
 * and mostly find it by accident, so putting it in the member portal costs
 * nothing and makes something ISV already owns visible where schools work.
 * These link out, and say so.
 */
function ParentsBand() {
  // Two of ISV's own images and one colour block between them, so the row
  // has a beat rather than reading as three identical photographs.
  const tones = ["image", "clay", "image"] as const;

  return (
    <>
      <StoryGrid>
        {parentStories.slice(0, 3).map((story, i) => (
          <StoryCard
            key={story.id}
            tone={tones[i] ?? "sand"}
            imageUrl={story.imageUrl}
            eyebrow={story.category}
            title={story.title}
            summary={story.summary}
            meta={`${story.readMinutes} min read`}
            href={story.href}
            external
          />
        ))}
      </StoryGrid>
      <Text size="micro" tone="tertiary" className="mt-6">
        Published by ISV on The Parents Website. Ready to share with our school
        community.
      </Text>
    </>
  );
}

/**
 * Hiring, on the Business Manager's landing page.
 *
 * A count and the roles it belongs to. The number is deliberately large
 * because this is the one module on the page that represents work waiting
 * rather than something to read, and it should be readable from across a
 * room during the walkthrough.
 */
function HiringBand() {
  const { jobs, applicants, applicantsFor } = useMember();
  const open = jobs.filter((job) => job.status === "open");
  const waiting = applicants.filter(
    (a) => a.status === "new" && open.some((job) => job.id === a.jobId),
  ).length;

  if (open.length === 0) {
    return (
      <EmptyState
        heading="No roles open"
        body="Post a job ad and applications will appear here."
      />
    );
  }

  return (
    <TileGrid>
      <Tile tone="forest" span={2} rows={2}>
        <span className="mb-4">
          <TilePill tone="forest">Waiting on you</TilePill>
        </span>
        <span className="block">
          <span className="hiring-figure">{waiting}</span>
        </span>
        <TileHeading serif>
          {waiting === 1 ? "application to review" : "applications to review"}
        </TileHeading>
        <TileBody tone="forest">
          Across {open.length} open {open.length === 1 ? "role" : "roles"}.
          Shortlist or set aside, both reversible.
        </TileBody>
        <span className="mt-auto pt-7 block">
          <LinkButton variant="onInverse" size="sm" href="/employment">
            Review applicants
          </LinkButton>
        </span>
      </Tile>

      {open.slice(0, 2).map((job) => {
        const list = applicantsFor(job.id);
        return (
          <Tile key={job.id} tone="sand" span={2} className="justify-center">
            <TileHeading className="text-h3">
              <AppLink
                href={`/employment/jobs/${job.id}`}
                className="tile-title-link"
              >
                {job.title}
              </AppLink>
            </TileHeading>
            <Text as="span" size="micro" tone="tertiary" className="mt-1.5 block">
              {job.employmentType} · closes {relativeUpcoming(job.closesIso)}
            </Text>
            <TileBody>
              {list.length} {list.length === 1 ? "application" : "applications"}
              {list.filter((a) => a.status === "shortlisted").length > 0
                ? `, ${list.filter((a) => a.status === "shortlisted").length} shortlisted`
                : ""}
            </TileBody>
          </Tile>
        );
      })}
    </TileGrid>
  );
}

function NewsModule({ ids }: { ids: string[] }) {
  const { role } = useMember();
  const items = selectContentByIds(ids, role);
  const [lead, ...rest] = items;
  if (!lead) return null;

  return (
    <TileGrid>
      <Tile tone="clay" span={2} rows={2}>
        <span className="mb-4">
          <TilePill tone="clay">{lead.recencyLabel}</TilePill>
        </span>
        <TileHeading serif>
          <AppLink href={`/news/${lead.id}`} className="tile-title-link">
            {lead.title}
          </AppLink>
        </TileHeading>
        <TileBody tone="clay">{lead.summary}</TileBody>
        <TileLink>Read the article</TileLink>
      </Tile>

      <Artwork
        variant="a"
        caption="Ruby N., Year 9 · isArtworks"
        className="rounded-tile lg:col-span-2 lg:row-span-2"
      />

      {/* Full width, so the row beneath the lead pair closes cleanly. */}
      {rest.map((item) => (
        <Tile key={item.id} tone="paper" span={4}>
          <span className="mb-4">
            <TilePill>{areaLabel(item.isvSystem)}</TilePill>
          </span>
          <TileHeading className="text-h3">
            <AppLink href={`/news/${item.id}`} className="tile-title-link">
              {item.title}
            </AppLink>
          </TileHeading>
          <TileBody>{item.summary}</TileBody>
        </Tile>
      ))}
    </TileGrid>
  );
}

/** One line about the member, derived from the updates they can see. */
function updateContextLine(items: { category: string }[]): string {
  const areas = [...new Set(items.map((i) => categoryLabel(i.category)))]
    .map((label) => label.split(",")[0].toLowerCase())
    .slice(0, 3);
  const list =
    areas.length > 1
      ? `${areas.slice(0, -1).join(", ")} and ${areas[areas.length - 1]}`
      : areas[0];
  return `updates across ${list}. Each one touches resources we use.`;
}

/**
 * Two ruled columns rather than a card grid. Seven items never divide into
 * three columns, and the leftover cells read as a hole in the page.
 */
function PortalNavigation() {
  const { setProfileOpen, setContactOpen } = useMember();

  const handlers: Record<string, () => void> = {
    "nav-profile": () => setProfileOpen(true),
    "nav-contact": () => setContactOpen(true),
    "nav-upload": () => setContactOpen(true),
  };

  const half = Math.ceil(portalNavigation.length / 2);
  const columns = [
    portalNavigation.slice(0, half),
    portalNavigation.slice(half),
  ];

  return (
    <div className="nav-columns">
      {columns.map((column, i) => (
        <ul key={i}>
          {column.map((item) => {
            const inner = (
              <>
                <Text as="span" size="h3" className="flex-1">
                  {item.label}
                </Text>
                <ArrowIcon className="text-tertiary" />
              </>
            );
            const cls =
              "row-hover row-rule flex w-full items-center gap-4 py-4 text-left no-underline text-primary";

            // Panels open in place; everything else is a real route.
            return (
              <li key={item.id}>
                {handlers[item.id] ? (
                  <button
                    type="button"
                    onClick={handlers[item.id]}
                    className={cls}
                  >
                    {inner}
                  </button>
                ) : (
                  <AppLink href={item.href ?? "#"} className={cls}>
                    {inner}
                  </AppLink>
                )}
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
