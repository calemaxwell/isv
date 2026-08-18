"use client";

import { ArrowRight } from "lucide-react";
import { PublicShell } from "@/components/features/public-shell";
import { Field, Wrap } from "@/components/layout";
import { Artwork, StoryCard, StoryGrid } from "@/components/patterns";
import { AppLink, Eyebrow, LinkButton, SearchIcon, Text } from "@/components/primitives";
import { news } from "@/data/content";
import { events, learning } from "@/data/content";
import { parentStories } from "@/data/parents";
import { audiences, highlights, isv } from "@/data/public-site";
import { useMember } from "@/lib/member-context";
import { formatDateWithYear, relativeUpcoming } from "@/lib/selectors";

/**
 * The public ISV homepage.
 *
 * The real site opens with a positioning line and then asks the visitor to
 * find their own way. This version keeps ISV's own words and its own
 * structure, but adds one thing before the browsing starts: a visitor
 * arrives as one of three people — a family choosing a school, someone
 * working in a school, or someone following the sector — and saying so
 * costs one band and saves everybody the hunt.
 *
 * Same type, same palette, same tile system as the portal. That continuity
 * is half the argument: signing in should feel like going further into one
 * organisation, not crossing into a different product.
 */
export default function PublicHomePage() {
  const { setAskOpen } = useMember();
  const featured = news[0];
  const upcoming = [...events, ...learning]
    .filter((item) => item.eventIso)
    .sort((a, b) => (a.eventIso ?? "").localeCompare(b.eventIso ?? ""))
    .slice(0, 3);
  const stories = news.slice(1, 4);

  return (
    <PublicShell>
      {/* ---------------- Hero ---------------- */}
      <Field wash tight>
        <Wrap>
          <div className="hero-split">
            <div>
              <Eyebrow className="mb-5">Independent Schools Victoria</Eyebrow>
              <Text as="h1" size="mega" measure="narrow">
                {isv.positioning}
              </Text>
              <Text
                size="lede"
                tone="secondary"
                measure="reading"
                className="mt-6"
              >
                {isv.purpose[1]}
              </Text>

              {/* The primary way in. A visitor who can describe what they
                  want in their own words should not have to work out which
                  of seven menu items covers it. */}
              <button
                type="button"
                onClick={() => setAskOpen(true)}
                className="hero-ask"
              >
                <SearchIcon />
                <span className="hero-ask-label">
                  Ask ISV a question
                </span>
                <span className="hero-ask-go">
                  <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
                </span>
              </button>

              <Text size="micro" tone="tertiary" className="mt-3">
                Try &ldquo;what support is there for school
                registration?&rdquo;
              </Text>

              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton variant="secondary" href="#audiences">
                  Browse instead
                </LinkButton>
                <LinkButton variant="secondary" href="/sign-in">
                  Member sign in
                </LinkButton>
              </div>
            </div>

            <Artwork
              variant="b"
              caption="Student artwork · isArtworks"
              className="hero-artwork"
            />
          </div>
        </Wrap>
      </Field>

      {/* ---------------- Who you are ---------------- */}
      <Field id="audiences">
        <Wrap>
          <Text as="h2" size="h2" className="section-header">
            Where to start
          </Text>

          <div className="audience-grid">
            {audiences.map((item) => (
              <AppLink key={item.id} href={item.href} className="audience-card">
                <Text as="h3" size="h2" className="block">
                  {item.title}
                </Text>
                <Text size="small" tone="secondary" className="mt-2.5 block">
                  {item.body}
                </Text>
                <span className="audience-action">
                  {item.action}
                  <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
                </span>
              </AppLink>
            ))}
          </div>
        </Wrap>
      </Field>

      {/* ---------------- Purpose ---------------- */}
      <Field tone="forest">
        <Wrap>
          <div className="purpose-band">
            <div>
              <Text
                as="span"
                size="micro"
                tone="inverseFaint"
                className="block font-semibold uppercase tracking-eyebrow"
              >
                Our purpose
              </Text>
              <Text
                as="h2"
                size="mega"
                tone="inverse"
                measure="narrow"
                className="mt-4"
              >
                {isv.purposeLine}
              </Text>
            </div>
            <div className="purpose-copy">
              {isv.purpose.map((paragraph) => (
                <Text
                  key={paragraph}
                  size="lede"
                  tone="inverseSoft"
                  measure="reading"
                  className="mb-4 last:mb-0"
                >
                  {paragraph}
                </Text>
              ))}
            </div>
          </div>
        </Wrap>
      </Field>

      {/* ---------------- Featured + highlights ---------------- */}
      <Field>
        <Wrap>
          <Text
            as="h2"
            size="h2"
            className="section-header"
            data-rule="none"
          >
            What ISV does
          </Text>

          <div className="highlight-grid">
            {highlights.map((item) => (
              <AppLink key={item.id} href={item.href} className="highlight-card">
                <Text
                  as="span"
                  size="micro"
                  tone="tertiary"
                  className="block font-semibold uppercase tracking-badge"
                >
                  {item.eyebrow}
                </Text>
                <Text as="h3" size="h3" className="mt-2.5 block">
                  {item.title}
                </Text>
                <Text size="small" tone="secondary" className="mt-2 block">
                  {item.body}
                </Text>
              </AppLink>
            ))}
          </div>
        </Wrap>
      </Field>

      {/* ---------------- Learning ---------------- */}
      <Field tone="warm">
        <Wrap>
          <Text as="h2" size="h2" className="section-header">
            Learning and events
          </Text>

          <div className="public-events">
            {upcoming.map((item) => (
              <AppLink
                key={item.id}
                href={`/events/${item.id}`}
                className="public-event"
              >
                <Text as="span" size="micro" tone="tertiary" className="block">
                  {formatDateWithYear(item.eventIso as string)} ·{" "}
                  {relativeUpcoming(item.eventIso as string)}
                </Text>
                <Text as="h3" size="h3" className="mt-1.5 block">
                  {item.title}
                </Text>
                <Text size="small" tone="secondary" className="mt-2 block">
                  {item.summary}
                </Text>
                <Text as="span" size="micro" tone="tertiary" className="mt-3 block">
                  {[item.format, item.location]
                    .filter(Boolean)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .join(" · ")}
                </Text>
              </AppLink>
            ))}
          </div>

          <div className="mt-8">
            <LinkButton variant="secondary" href="/events">
              All learning and events
            </LinkButton>
          </div>
        </Wrap>
      </Field>

      {/* ---------------- Perspectives ---------------- */}
      <Field>
        <Wrap>
          <Text as="h2" size="h2" className="section-header">
            News and insights
          </Text>

          <div className="split-editorial">
            <AppLink href={`/news/${featured.id}`} className="feature-story">
              <Text
                as="span"
                size="micro"
                tone="tertiary"
                className="block font-semibold uppercase tracking-badge"
              >
                Perspectives · {featured.recencyLabel}
              </Text>
              <Text as="h3" size="display" measure="narrow" className="mt-3 block">
                {featured.title}
              </Text>
              <Text
                size="lede"
                tone="secondary"
                measure="reading"
                className="mt-4 block"
              >
                {featured.summary}
              </Text>
              <span className="audience-action">
                Read the article
                <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
              </span>
            </AppLink>

            <div className="feature-side">
              {stories.map((item) => (
                <AppLink
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="feature-row"
                >
                  <Text as="span" size="micro" tone="tertiary" className="block">
                    {item.recencyLabel}
                  </Text>
                  <Text as="h3" size="h3" className="mt-1 block">
                    {item.title}
                  </Text>
                </AppLink>
              ))}
            </div>
          </div>
        </Wrap>
      </Field>

      {/* ---------------- The Parents Website ---------------- */}
      <Field tone="mist">
        <Wrap>
          <Text as="h2" size="h2" className="section-header">
            For families
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mb-8">
            ISV publishes The Parents Website: independent news and resources
            for parents raising and educating children.
          </Text>

          <StoryGrid>
            {parentStories.slice(0, 3).map((story, i) => (
              <StoryCard
                key={story.id}
                tone={(["image", "clay", "image"] as const)[i]}
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
        </Wrap>
      </Field>

      {/* ---------------- Subscribe ---------------- */}
      <Field tone="sand" tight>
        <Wrap>
          <div className="subscribe-band">
            <div>
              <Text as="h2" size="h2">
                Keep up with ISV
              </Text>
              <Text size="small" tone="secondary" measure="reading" className="mt-2">
                Education news and insights from ISV, straight to your inbox.
              </Text>
            </div>
            <form
              className="subscribe-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="flex-1">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  className="control control-input"
                  placeholder="you@yourschool.vic.edu.au"
                />
              </label>
              <LinkButton href="#">Subscribe</LinkButton>
            </form>
          </div>
        </Wrap>
      </Field>
    </PublicShell>
  );
}
