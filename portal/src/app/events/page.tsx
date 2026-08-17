"use client";

import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { ListingScreen } from "@/components/features/listing";
import { events, learning } from "@/data/content";

/**
 * Events and sessions listing.
 *
 * Events and professional learning sit together because a member looking for
 * "what's on" does not separate them in their head, and splitting them made
 * two thin pages instead of one useful one.
 */
export default function EventsListingPage() {
  const items = [...events, ...learning].sort((a, b) =>
    (a.eventIso ?? "").localeCompare(b.eventIso ?? ""),
  );

  return (
    <AppShell>
      <ListingScreen
        eyebrow="What's on"
        heading="Events and sessions"
        intro="Everything ISV is running, in date order. Filter by format or topic to find what suits your school."
        items={items}
        facets={["format", "category", "area"]}
        dated
        hrefFor={(item) => `/events/${item.id}`}
        actionLabel="Register"
        actionHrefFor={(item) => `/events/${item.id}/register`}
        emptyBody="Try widening the format or topic. Everything ISV runs is listed here, so if nothing matches it may not be scheduled yet."
      />
      <AskIsv />
    </AppShell>
  );
}
