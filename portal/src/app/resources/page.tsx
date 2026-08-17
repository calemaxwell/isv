"use client";

import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { ListingScreen } from "@/components/features/listing";
import { resources } from "@/data/content";

/**
 * Resource library listing.
 *
 * The one screen where a member most often arrives knowing exactly what they
 * want, so search sits first and the filters narrow rather than browse.
 */
export default function ResourcesListingPage() {
  return (
    <AppShell>
      <ListingScreen
        eyebrow="Resource library"
        heading="Resources"
        intro="Guidance, templates and reference material published by ISV for member schools."
        items={resources}
        facets={["category", "area"]}
        files
        hrefFor={(item) => `/resources/${item.id}`}
        actionLabel="Download"
        actionHrefFor={(item) => `/resources/${item.id}`}
        emptyBody="Try a broader topic, or ask ISV in your own words and we'll point you at the right material."
      />
      <AskIsv />
    </AppShell>
  );
}
