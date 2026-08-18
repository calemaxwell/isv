import Image from "next/image";
import clsx from "clsx";
import type { ReactNode } from "react";
import { AppLink, Text } from "@/components/primitives";

/**
 * Four-across story cards.
 *
 * Used for The Parents Website band and for latest news. Deliberately mixes
 * photographic cards with flat colour cards in the same row: four identical
 * image cards is a blog index, and four identical colour blocks is a swatch
 * chart. Alternating gives the row a rhythm and lets the colour carry the
 * items that have no photograph worth using.
 *
 * Images are stock stand-ins, seeded so the same card shows the same picture
 * on every run — which matters when the demo is rehearsed. Replace with
 * ISV's own library before the pitch.
 */

export type StoryTone = "image" | "navy" | "clay" | "ochre" | "sand" | "mist";

const TONE: Record<StoryTone, string> = {
  image: "bg-field-sand text-primary",
  navy: "bg-field-forest text-inverse",
  clay: "bg-accent-clay text-inverse",
  ochre: "bg-accent-ochre text-inverse",
  sand: "bg-field-sand text-primary",
  mist: "bg-field-mist text-primary",
};

const BODY: Record<StoryTone, string> = {
  image: "text-secondary",
  navy: "text-inverse-soft",
  clay: "text-inverse-soft",
  ochre: "text-inverse-soft",
  sand: "text-secondary",
  mist: "text-secondary",
};

export function StoryGrid({ children }: { children: ReactNode }) {
  return <div className="story-grid">{children}</div>;
}

export function StoryCard({
  tone = "sand",
  imageUrl,
  eyebrow,
  title,
  summary,
  meta,
  href,
  external = false,
  linkLabel = "Read more",
}: {
  tone?: StoryTone;
  /** Present only when tone is "image" */
  imageUrl?: string;
  eyebrow: string;
  title: string;
  summary: string;
  meta?: string;
  href: string;
  external?: boolean;
  linkLabel?: string;
}) {
  const withImage = tone === "image" && imageUrl;
  // Text tone has to be stated. Left to inherit, the primitive applies its
  // own default colour and the headings on the dark cards went black.
  const inverse = tone === "navy" || tone === "clay" || tone === "ochre";

  return (
    <article className={clsx("story-card", TONE[tone])}>
      {withImage ? (
        <span className="story-image">
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
            className="object-cover"
          />
        </span>
      ) : null}

      <span className="story-body">
        <Text
          as="span"
          size="micro"
          tone={inverse ? "inverseFaint" : "tertiary"}
          className="block font-semibold uppercase tracking-badge"
        >
          {eyebrow}
        </Text>

        <Text
          as="h3"
          size="h3"
          tone={inverse ? "inverse" : "primary"}
          className="mt-2.5 block"
        >
          <AppLink
            href={href}
            className="tile-title-link"
            {...(external
              ? { target: "_blank", rel: "noreferrer" }
              : {})}
          >
            {title}
          </AppLink>
        </Text>

        <p className={clsx("mt-2 text-small leading-relaxed", BODY[tone])}>
          {summary}
        </p>

        <span className="story-foot">
          {meta ? (
            <Text
              as="span"
              size="micro"
              tone={inverse ? "inverseFaint" : "tertiary"}
              className="block"
            >
              {meta}
            </Text>
          ) : null}
          <span className="mt-2 block text-small font-semibold underline underline-offset-4">
            {linkLabel}
            {external ? " ↗" : ""}
          </span>
        </span>
      </span>
    </article>
  );
}

/**
 * Featured band for a listing screen.
 *
 * One lead at display size and two beside it. A listing that opens straight
 * into a filter bar and a ruled index is efficient and completely flat — the
 * band gives the page somewhere to start and says which three things ISV
 * thinks matter this week.
 *
 * The three featured items are removed from the index below. Showing them
 * twice, one directly under the other, reads as a bug.
 */
export function FeaturedBand({
  lead,
  rest,
}: {
  lead: {
    eyebrow: string;
    title: string;
    summary: string;
    meta?: string;
    href: string;
  };
  rest: {
    id: string;
    eyebrow: string;
    title: string;
    summary: string;
    meta?: string;
    href: string;
  }[];
}) {
  return (
    <div className="featured-band">
      <article className="featured-lead">
        <Text
          as="span"
          size="micro"
          tone="inverseFaint"
          className="block font-semibold uppercase tracking-badge"
        >
          {lead.eyebrow}
        </Text>
        <Text
          as="h2"
          size="mega"
          tone="inverse"
          measure="narrow"
          className="mt-4 block"
        >
          <AppLink href={lead.href} className="tile-title-link">
            {lead.title}
          </AppLink>
        </Text>
        <p className="mt-4 max-w-reading text-lede text-inverse-soft">
          {lead.summary}
        </p>
        <span className="mt-auto pt-8 block">
          {lead.meta ? (
            <Text as="span" size="micro" tone="inverseFaint" className="block">
              {lead.meta}
            </Text>
          ) : null}
          <span className="mt-2 block text-small font-semibold text-inverse underline underline-offset-4">
            Read the article
          </span>
        </span>
      </article>

      <div className="featured-side">
        {rest.map((item) => (
          <article key={item.id} className="featured-item">
            <Text
              as="span"
              size="micro"
              tone="tertiary"
              className="block font-semibold uppercase tracking-badge"
            >
              {item.eyebrow}
            </Text>
            <Text as="h3" size="h2" className="mt-2 block">
              <AppLink href={item.href} className="tile-title-link">
                {item.title}
              </AppLink>
            </Text>
            <Text
              as="p"
              size="small"
              tone="secondary"
              className="mt-2 block"
            >
              {item.summary}
            </Text>
            {item.meta ? (
              <Text as="span" size="micro" tone="tertiary" className="mt-3 block">
                {item.meta}
              </Text>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
