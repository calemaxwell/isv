"use client";

import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { ListingScreen } from "@/components/features/listing";
import { news, updates } from "@/data/content";

/**
 * News listing.
 *
 * Perspectives articles and ISV updates in one index. They are different
 * lengths but they answer the same question — what has ISV said lately —
 * and the topic filter separates them better than two pages would.
 */
export default function NewsListingPage() {
  const items = [...news, ...updates].sort((a, b) =>
    b.publishedIso.localeCompare(a.publishedIso),
  );

  return (
    <AppShell>
      <ListingScreen
        eyebrow="From ISV"
        heading="News and updates"
        intro="Articles, sector commentary and updates from across ISV, newest first."
        items={items}
        facets={["category", "area", "recency"]}
        featuredCount={3}
        hrefFor={(item) => `/news/${item.id}`}
        actionLabel="Read"
        actionHrefFor={(item) => `/news/${item.id}`}
        emptyBody="Try a broader topic. Everything ISV has published recently is listed here."
      />
      <AskIsv />
    </AppShell>
  );
}
