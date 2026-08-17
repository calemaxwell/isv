"use client";

import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, Wrap } from "@/components/layout";
import { Artwork, RequestTimeline } from "@/components/patterns";
import { Button, Eyebrow, Text } from "@/components/primitives";
import { useMember } from "@/lib/member-context";
import { formatDateWithYear, getService } from "@/lib/selectors";

/**
 * Screen 6 — confirmation and status.
 *
 * The forest field, used once per page. Large, quiet, and specific about what
 * happens next. No celebration graphic, no tick animation. The reference is
 * monospaced so it reads as something you can quote back.
 *
 * Request state is in memory, so only ids present in session state resolve.
 * After a reload only the seeded request survives. Anything else renders the
 * defined empty state rather than crashing.
 */
export default function RequestPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getRequest, setContactOpen } = useMember();

  const request = getRequest(params.id);

  if (!request) {
    return (
      <AppShell>
        <Field>
          <Wrap>
            <Text as="h1" size="display" measure="narrow">
              We can&rsquo;t find that request
            </Text>
            <Text size="lede" tone="secondary" measure="reading" className="mt-4">
              This prototype keeps requests in memory for the session, so
              anything created earlier is cleared on reload. Your open requests
              are listed in the portal.
            </Text>
            <div className="mt-8 flex flex-wrap gap-3">
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

  const service = getService(request.serviceId);
  const isNew = request.status === "submitted";

  return (
    <AppShell>
      <Field tone="forest">
        <Wrap>
          <Eyebrow inverse className="mb-3.5">
            {isNew ? "Request submitted" : "Request in progress"}
          </Eyebrow>

          <Text as="h1" size="mega" tone="inverse" measure="narrow">
            {isNew ? "We have your request" : request.subject}
          </Text>

          <Text
            size="lede"
            tone="inverseSoft"
            measure="reading"
            className="mt-5"
          >
            {request.nextStep}. You can follow this request from your portal at
            any time.
          </Text>

          <dl className="mt-11 flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <dt>
                <Eyebrow inverse className="mb-2">
                  Reference
                </Eyebrow>
              </dt>
              <dd className="font-mono text-small text-inverse">
                {request.reference}
              </dd>
            </div>
            <div>
              <dt>
                <Eyebrow inverse className="mb-2">
                  Status
                </Eyebrow>
              </dt>
              <dd className="text-small text-inverse">{request.statusLabel}</dd>
            </div>
            <div>
              <dt>
                <Eyebrow inverse className="mb-2">
                  Service
                </Eyebrow>
              </dt>
              <dd className="text-small text-inverse">
                {service?.name ?? "ISV service"}
              </dd>
            </div>
            <div>
              <dt>
                <Eyebrow inverse className="mb-2">
                  Submitted
                </Eyebrow>
              </dt>
              <dd className="text-small text-inverse">
                {formatDateWithYear(request.submittedIso)}
              </dd>
            </div>
          </dl>

          <div className="mt-11 flex flex-wrap gap-3">
            <Button variant="onInverse" onClick={() => router.push("/portal")}>
              Back to portal
            </Button>
            <Button variant="ghostInverse" onClick={() => setContactOpen(true)}>
              Contact ISV about this
            </Button>
          </div>

          {/* The closing beat of the narrative. design-imagery.html budgets
              three images for the whole demo: sign-in, the news feature, and
              here. */}
          <Artwork
            variant="b"
            caption="Student artwork · isArtworks collection"
            className="mt-12"
          />
        </Wrap>
      </Field>

      <Field tone="sand" tight>
        <Wrap>
          <Text as="h2" size="h2" className="mb-7 border-b border-line pb-3.5">
            Progress
          </Text>
          <div className="border border-line bg-surface p-cell">
            <RequestTimeline request={request} />
          </div>
          <Text size="micro" tone="tertiary" className="mt-4">
            Assigned to {request.assignedTo}
          </Text>
        </Wrap>
      </Field>

      <AskIsv />
    </AppShell>
  );
}
