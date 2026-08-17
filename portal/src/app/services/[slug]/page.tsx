"use client";

import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, Wrap } from "@/components/layout";
import { categoryLabel } from "@/components/patterns";
import {
  Button,
  Eyebrow,
  InclusionMark,
  LinkButton,
  Text,
} from "@/components/primitives";
import { useMember } from "@/lib/member-context";
import { getServiceBySlug } from "@/lib/selectors";

/**
 * Screen 4 — service detail. Bridges discovery into action.
 *
 * Asymmetric editorial layout. The action sits in a sand block against the
 * description so it holds its own without a coloured button competing with
 * body copy.
 */
export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { school, setContactOpen } = useMember();
  const service = getServiceBySlug(params.slug);

  if (!service) {
    return (
      <AppShell>
        <Field>
          <Wrap>
            <Text as="h1" size="display">
              We couldn&rsquo;t find that service
            </Text>
            <Text size="lede" tone="secondary" className="mt-4">
              It may have moved. Everything ISV offers is listed in the portal.
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

  return (
    <AppShell>
      <Field tight wash>
        <Wrap>
          <Eyebrow className="mb-3.5">{categoryLabel(service.category)}</Eyebrow>
          <Text as="h1" size="display" measure="narrow">
            {service.name}
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-4">
            {service.summary}
          </Text>
        </Wrap>
      </Field>

      <Field>
        <Wrap>
          <div className="split-editorial">
            <div>
              {service.description.map((paragraph) => (
                <Text
                  key={paragraph}
                  measure="reading"
                  className="mb-4 last:mb-0"
                >
                  {paragraph}
                </Text>
              ))}

              <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-6">
                {service.deliveredBy ? (
                  <div>
                    <dt>
                      <Eyebrow className="mb-1.5">Delivered by</Eyebrow>
                    </dt>
                    <dd className="text-small">{service.deliveredBy}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>
                    <Eyebrow className="mb-1.5">Phone</Eyebrow>
                  </dt>
                  <dd className="text-small">{service.contactPhone}</dd>
                </div>
                <div>
                  <dt>
                    <Eyebrow className="mb-1.5">Email</Eyebrow>
                  </dt>
                  <dd className="text-small">{service.contactEmail}</dd>
                </div>
              </dl>
            </div>

            <aside className="bg-field-sand p-8">
              {service.includedInMembership ? (
                <InclusionMark>{service.inclusionNote}</InclusionMark>
              ) : (
                <Eyebrow>{service.externalLabel}</Eyebrow>
              )}

              <Text as="p" size="h3" className="mt-4 mb-2.5">
                {school.name}
              </Text>
              <Text size="small" tone="secondary">
                {service.requestable
                  ? "Your school's membership includes this support at no additional cost."
                  : "Available to your school as an ISV Member School."}
              </Text>

              <div className="mt-7 grid gap-3">
                {service.requestable ? (
                  <Button
                    block
                    onClick={() =>
                      router.push(`/services/${service.slug}/request`)
                    }
                  >
                    {service.requestLabel ?? `Request ${service.name}`}
                  </Button>
                ) : (
                  <LinkButton
                    block
                    href={service.externalUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {service.externalLabel}
                  </LinkButton>
                )}
                <Button
                  variant="secondary"
                  block
                  onClick={() => setContactOpen(true)}
                >
                  Contact ISV instead
                </Button>
              </div>
            </aside>
          </div>
        </Wrap>
      </Field>

      <AskIsv />
    </AppShell>
  );
}
