"use client";

import { useMemo, useState } from "react";
import { Field, Wrap } from "@/components/layout";
import { FeaturedBand, FileIcon, categoryLabel } from "@/components/patterns";
import { Eyebrow, LinkButton, Text } from "@/components/primitives";
import { areaLabel } from "@/data/areas";
import { fileMeta, resourceFile } from "@/data/files";
import { formatDateWithYear, relativeUpcoming } from "@/lib/selectors";
import type { ContentItem } from "@/types";

/**
 * One listing screen, used by events, news and resources.
 *
 * Deliberately a traditional index rather than a tile grid. A member arrives
 * here having already decided what they are after, so the job is filtering
 * and scanning, not browsing. Tiles are for the landing page, where nobody
 * has decided anything yet.
 *
 * Filters are derived from the data rather than declared, so a listing can
 * never offer a filter that returns nothing.
 */

export type FacetKey = "category" | "area" | "format" | "recency";

interface Facet {
  key: FacetKey;
  label: string;
  options: { value: string; label: string }[];
}

function facetValue(item: ContentItem, key: FacetKey): string | undefined {
  switch (key) {
    case "category":
      return item.category;
    case "area":
      return item.isvSystem;
    case "format":
      return item.format;
    case "recency":
      return item.recencyLabel;
  }
}

function facetLabel(key: FacetKey, value: string): string {
  if (key === "category") return categoryLabel(value);
  if (key === "area") return areaLabel(value);
  return value;
}

export function ListingScreen({
  eyebrow,
  heading,
  intro,
  items,
  facets,
  hrefFor,
  actionLabel,
  actionHrefFor,
  dated = false,
  featuredCount = 0,
  files = false,
  emptyBody,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  items: ContentItem[];
  facets: FacetKey[];
  hrefFor: (item: ContentItem) => string;
  actionLabel: string;
  actionHrefFor: (item: ContentItem) => string;
  /** Events lead with a date. News and resources lead with a category. */
  dated?: boolean;
  /**
   * How many items to lift out of the index into a featured band. Three is
   * the only shape that works: one lead and two beside it.
   */
  featuredCount?: number;
  /** Resources carry a file format. News and events do not. */
  files?: boolean;
  emptyBody: string;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Partial<Record<FacetKey, string>>>({});

  const featured = items.slice(0, featuredCount);
  const indexed = items.slice(featuredCount);

  const built: Facet[] = useMemo(
    () =>
      facets
        .map((key) => {
          const seen = new Map<string, string>();
          for (const item of items) {
            const value = facetValue(item, key);
            if (value && !seen.has(value)) {
              seen.set(value, facetLabel(key, value));
            }
          }
          return {
            key,
            label:
              key === "category"
                ? "Topic"
                : key === "area"
                  ? "Area"
                  : key === "format"
                    ? "Format"
                    : "When",
            options: [...seen.entries()]
              .map(([value, label]) => ({ value, label }))
              .sort((a, b) => a.label.localeCompare(b.label)),
          };
        })
        // A filter with one option is not a filter.
        .filter((facet) => facet.options.length > 1),
    [facets, items],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return indexed.filter((item) => {
      if (
        q &&
        !`${item.title} ${item.summary} ${item.location ?? ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return built.every((facet) => {
        const chosen = active[facet.key];
        return !chosen || facetValue(item, facet.key) === chosen;
      });
    });
  }, [indexed, query, active, built]);

  const filtered = Object.values(active).some(Boolean) || query.trim() !== "";

  return (
    <>
      <Field tight wash>
        <Wrap>
          <Eyebrow className="mb-3.5">{eyebrow}</Eyebrow>
          <Text as="h1" size="display" measure="narrow">
            {heading}
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-4">
            {intro}
          </Text>
        </Wrap>
      </Field>

      {featured.length === 3 ? (
        <Field tight>
          <Wrap>
            <FeaturedBand
              lead={{
                eyebrow: categoryLabel(featured[0].category),
                title: featured[0].title,
                summary: featured[0].summary,
                meta: featured[0].recencyLabel,
                href: hrefFor(featured[0]),
              }}
              rest={featured.slice(1).map((item) => ({
                id: item.id,
                eyebrow: categoryLabel(item.category),
                title: item.title,
                summary: item.summary,
                meta: item.recencyLabel,
                href: hrefFor(item),
              }))}
            />
          </Wrap>
        </Field>
      ) : null}

      <Field tight>
        <Wrap>
          <div className="filter-bar">
            <label className="filter-search">
              <span className="sr-only">Search</span>
              <input
                type="search"
                className="control control-input"
                placeholder={`Search ${heading.toLowerCase()}`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            {built.map((facet) => (
              <label key={facet.key} className="filter-select">
                <span className="sr-only">{facet.label}</span>
                <select
                  className="control control-input"
                  value={active[facet.key] ?? ""}
                  onChange={(e) =>
                    setActive((prev) => ({
                      ...prev,
                      [facet.key]: e.target.value || undefined,
                    }))
                  }
                >
                  <option value="">{facet.label}: any</option>
                  {facet.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="filter-count">
            <Text as="span" size="micro" tone="tertiary">
              {results.length} of {indexed.length}
            </Text>
            {filtered ? (
              <button
                type="button"
                className="pick-clear"
                onClick={() => {
                  setQuery("");
                  setActive({});
                }}
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </Wrap>
      </Field>

      <Field tight>
        <Wrap>
          {results.length === 0 ? (
            <div className="py-10">
              <Text as="h2" size="h3" className="mb-2">
                Nothing matches those filters
              </Text>
              <Text size="small" tone="secondary" measure="reading">
                {emptyBody}
              </Text>
            </div>
          ) : (
            <ul className="listing">
              {results.map((item) => (
                <li key={item.id}>
                  <div className="listing-row">
                    <span className="listing-lead">
                      {dated && item.eventIso ? (
                        <>
                          <Text as="span" size="small" className="font-semibold">
                            {formatDateWithYear(item.eventIso)}
                          </Text>
                          <Text as="span" size="micro" tone="tertiary">
                            {relativeUpcoming(item.eventIso)}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text as="span" size="micro" tone="tertiary">
                            {categoryLabel(item.category)}
                          </Text>
                          <Text as="span" size="micro" tone="tertiary">
                            {item.recencyLabel}
                          </Text>
                        </>
                      )}
                    </span>

                    <span className="listing-body">
                      <Text as="span" size="h3" className="flex items-start gap-2.5">
                        {files ? (
                          <FileIcon kind={resourceFile(item.id).kind} />
                        ) : null}
                        <a href={hrefFor(item)} className="tile-title-link">
                          {item.title}
                        </a>
                      </Text>
                      <Text
                        as="span"
                        size="small"
                        tone="secondary"
                        className="mt-1.5 block"
                      >
                        {item.summary}
                      </Text>
                      <Text
                        as="span"
                        size="micro"
                        tone="tertiary"
                        className="mt-2.5 block"
                      >
                        {files
                          ? `${fileMeta(item.id)} · ${areaLabel(item.isvSystem)}`
                          : [
                              item.format,
                              item.location,
                              areaLabel(item.isvSystem),
                            ]
                              .filter(Boolean)
                              .filter((v, i, a) => a.indexOf(v) === i)
                              .join(" · ")}
                      </Text>
                    </span>

                    <LinkButton
                      variant="secondary"
                      size="sm"
                      href={actionHrefFor(item)}
                      className="listing-action"
                    >
                      {actionLabel}
                    </LinkButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Wrap>
      </Field>
    </>
  );
}
