"use client";

import { useParams, useRouter } from "next/navigation";
import { Download, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, Wrap } from "@/components/layout";
import { FileIcon, IndexList, categoryLabel } from "@/components/patterns";
import { Button, Eyebrow, Text } from "@/components/primitives";
import { areaLabel } from "@/data/areas";
import { resources } from "@/data/content";
import { fileMeta, resourceFile } from "@/data/files";
import { useMember } from "@/lib/member-context";
import { getContent, relativeDate } from "@/lib/selectors";

/**
 * Resource detail.
 *
 * A resource is a thing you take away, so the page is arranged around
 * getting it: what it is, whether it is the right one, and the download.
 * The related band matters more here than anywhere else in the portal,
 * because members who want one template usually want the next one too.
 */
export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { role, school, setContactOpen } = useMember();
  const resource = getContent(params.id);

  if (!resource) {
    return (
      <AppShell>
        <Field>
          <Wrap>
            <Text as="h1" size="display">
              We couldn&rsquo;t find that resource
            </Text>
            <Text size="lede" tone="secondary" className="mt-4">
              It may have been replaced. Everything current is in the library.
            </Text>
            <div className="mt-8">
              <Button onClick={() => router.push("/resources")}>
                Back to the library
              </Button>
            </div>
          </Wrap>
        </Field>
        <AskIsv />
      </AppShell>
    );
  }

  const file = resourceFile(resource.id);
  const isWeb = file.kind === "web";

  const related = resources
    .filter(
      (item) =>
        item.id !== resource.id &&
        item.relevantTo.includes(role) &&
        (item.category === resource.category ||
          item.isvSystem === resource.isvSystem),
    )
    .slice(0, 4);

  return (
    <AppShell>
      <Field tight wash>
        <Wrap>
          <Eyebrow className="mb-3.5">
            {categoryLabel(resource.category)} · {areaLabel(resource.isvSystem)}
          </Eyebrow>
          <Text as="h1" size="display" measure="narrow">
            {resource.title}
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-4">
            {resource.summary}
          </Text>
        </Wrap>
      </Field>

      <Field>
        <Wrap>
          <div className="split-editorial">
            <div>
              <Text measure="reading" className="mb-4">
                This resource is published by ISV for member schools. It sets
                out practice ISV sees working across Independent schools and is
                written to be adapted to your own school&rsquo;s position
                rather than adopted unchanged.
              </Text>
              <Text measure="reading" className="mb-4">
                If you want to work through how it applies to {school.name}, an
                ISV adviser can go through it with you.
              </Text>

              <Text as="h2" size="h3" className="mt-9 mb-3">
                Before you use it
              </Text>
              <ul className="event-covers">
                <li>
                  <Text as="span" size="small">
                    Check it against your school&rsquo;s own policies and
                    council decisions.
                  </Text>
                </li>
                <li>
                  <Text as="span" size="small">
                    ISV updates this material as practice changes, so work from
                    the version in the portal.
                  </Text>
                </li>
                <li>
                  <Text as="span" size="small">
                    Ask ISV if anything in it does not fit your setting.
                  </Text>
                </li>
              </ul>

              <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-6">
                <div>
                  <dt>
                    <Eyebrow className="mb-1.5">Published</Eyebrow>
                  </dt>
                  <dd className="text-small">
                    {relativeDate(resource.publishedIso)}
                  </dd>
                </div>
                <div>
                  <dt>
                    <Eyebrow className="mb-1.5">Area</Eyebrow>
                  </dt>
                  <dd className="text-small">
                    {areaLabel(resource.isvSystem)}
                  </dd>
                </div>
                <div>
                  <dt>
                    <Eyebrow className="mb-1.5">Topic</Eyebrow>
                  </dt>
                  <dd className="text-small">
                    {categoryLabel(resource.category)}
                  </dd>
                </div>
                <div>
                  <dt>
                    <Eyebrow className="mb-1.5">Format</Eyebrow>
                  </dt>
                  <dd className="text-small">{fileMeta(resource.id)}</dd>
                </div>
              </dl>
            </div>

            <aside className="bg-field-sand p-8">
              <Eyebrow className="mb-4">Included in your membership</Eyebrow>

              {/* Format first. A member deciding whether to click wants to
                  know what lands on their desktop before anything else. */}
              <div className="file-line">
                <FileIcon kind={file.kind} large />
                <span className="min-w-0">
                  <Text as="span" size="small" className="block font-semibold">
                    {file.label}
                  </Text>
                  <Text as="span" size="micro" tone="tertiary" className="block">
                    {[file.size, file.extent].filter(Boolean).join(" · ") ||
                      "Opens in your browser"}
                  </Text>
                </span>
              </div>

              <Text size="small" tone="secondary" className="mt-5">
                Available to every staff member at {school.name} at no
                additional cost.
              </Text>

              <div className="mt-7 grid gap-3">
                <Button block>
                  <span className="btn-icon">
                    {isWeb ? (
                      <ExternalLink className="size-4" strokeWidth={1.8} aria-hidden />
                    ) : (
                      <Download className="size-4" strokeWidth={1.8} aria-hidden />
                    )}
                    {isWeb ? "Open resource" : `Download ${file.label}`}
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  block
                  onClick={() => setContactOpen(true)}
                >
                  Ask ISV about this
                </Button>
              </div>
            </aside>
          </div>
        </Wrap>
      </Field>

      {related.length > 0 ? (
        <Field tone="warm">
          <Wrap>
            <Text as="h2" size="h2" className="section-header">
              Related in the library
            </Text>
            <IndexList items={related} hrefFor={(item) => `/resources/${item.id}`} />
          </Wrap>
        </Field>
      ) : null}

      <AskIsv />
    </AppShell>
  );
}
