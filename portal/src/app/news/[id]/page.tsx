"use client";

import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, Wrap } from "@/components/layout";
import {
  Artwork,
  StoryCard,
  StoryGrid,
  categoryLabel,
} from "@/components/patterns";
import { AppLink, Button, Eyebrow, Text } from "@/components/primitives";
import { areaLabel } from "@/data/areas";
import { news, resources } from "@/data/content";
import {
  articleAuthor,
  articleBody,
  type ArticleBlock,
} from "@/data/articles";
import { useMember } from "@/lib/member-context";
import { getContent, relativeDate } from "@/lib/selectors";

/**
 * Article page.
 *
 * A reading surface, so it is the one screen in the portal that is a single
 * column at a proper measure. No tiles, no grid. The only things beside the
 * body are where it came from and what to read next.
 */
export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { role } = useMember();
  const article = getContent(params.id);

  if (!article) {
    return (
      <AppShell>
        <Field>
          <Wrap>
            <Text as="h1" size="display">
              We can&rsquo;t find that article
            </Text>
            <div className="mt-8">
              <Button onClick={() => router.push("/portal")}>
                Back to portal
              </Button>
            </div>
          </Wrap>
        </Field>
        <AskIsv />
      </AppShell>
    );
  }

  const body = articleBody(article.id);
  const author = articleAuthor(article.id);

  // Resources that share the article's topic or area. A reader who got this
  // far wants the material, not another article.
  const related = resources
    .filter(
      (item) =>
        item.relevantTo.includes(role) &&
        (item.category === article.category ||
          item.isvSystem === article.isvSystem),
    )
    .slice(0, 4);

  const more = news.filter((item) => item.id !== article.id).slice(0, 3);

  return (
    <AppShell>
      <Field wash tight>
        <Wrap>
          <span className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-pill bg-action-quiet px-2 py-0.5 text-pill font-semibold uppercase tracking-badge text-action">
              {categoryLabel(article.category)}
            </span>
            <Text as="span" size="micro" tone="tertiary">
              {relativeDate(article.publishedIso)} ·{" "}
              {areaLabel(article.isvSystem)}
            </Text>
          </span>

          <Text as="h1" size="mega" measure="narrow">
            {article.title}
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-5">
            {article.summary}
          </Text>
        </Wrap>
      </Field>

      <Field none>
        <Wrap>
          <Artwork
            variant="a"
            caption="Ruby N., Year 9 · isArtworks"
            className="article-hero"
          />
        </Wrap>
      </Field>

      <Field>
        <Wrap>
          <div className="article-layout">
            <article className="article-body">
              {body.map((block: ArticleBlock) =>
                block.kind === "pull" ? (
                  <blockquote key={block.text} className="article-pull">
                    {block.text}
                  </blockquote>
                ) : block.kind === "heading" ? (
                  <Text
                    key={block.text}
                    as="h2"
                    size="h2"
                    className="mt-10 mb-3"
                  >
                    {block.text}
                  </Text>
                ) : (
                  <Text key={block.text} measure="reading" className="mb-4">
                    {block.text}
                  </Text>
                ),
              )}
            </article>

            {/* Byline first, then the material. Who wrote it changes how you
                read it, so it belongs above the thing you take away. */}
            <aside className="article-rail">
              <div className="rail-card">
                <Eyebrow className="mb-4">Written by</Eyebrow>
                <div className="presenter">
                  <span className="presenter-mark" aria-hidden>
                    {author.initials}
                  </span>
                  <span className="min-w-0">
                    <Text as="span" size="small" className="block font-semibold">
                      {author.name}
                    </Text>
                    <Text as="span" size="micro" tone="tertiary" className="block">
                      {author.title}
                    </Text>
                  </span>
                </div>
                <Text size="small" tone="secondary" className="mt-4">
                  {author.bio}
                </Text>
                <Text size="micro" tone="tertiary" className="mt-4">
                  {relativeDate(article.publishedIso)} ·{" "}
                  {areaLabel(article.isvSystem)}
                </Text>
              </div>

              {related.length > 0 ? (
                <div className="rail-card rail-card-sand">
                  <Eyebrow className="mb-4">Related resources</Eyebrow>
                  <ul className="rail-list">
                    {related.map((item) => (
                      <li key={item.id}>
                        <AppLink href={`/resources/${item.id}`} className="rail-link">
                          <Text as="span" size="small" className="block font-medium">
                            {item.title}
                          </Text>
                          <Text as="span" size="micro" tone="tertiary" className="block">
                            {categoryLabel(item.category)}
                          </Text>
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </Wrap>
      </Field>

      {more.length > 0 ? (
        <Field tone="warm">
          <Wrap>
            <Text as="h2" size="h2" className="section-header">
              Related perspectives
            </Text>
            <StoryGrid>
              {more.map((item, i) => (
                <StoryCard
                  key={item.id}
                  tone={(["sand", "clay", "mist"] as const)[i] ?? "sand"}
                  eyebrow={categoryLabel(item.category)}
                  title={item.title}
                  summary={item.summary}
                  meta={item.recencyLabel}
                  href={`/news/${item.id}`}
                  linkLabel="Read the article"
                />
              ))}
            </StoryGrid>
          </Wrap>
        </Field>
      ) : null}

      <AskIsv />
    </AppShell>
  );
}
