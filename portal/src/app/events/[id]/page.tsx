"use client";

import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, Wrap } from "@/components/layout";
import { ScheduleList, categoryLabel } from "@/components/patterns";
import { Button, Eyebrow, Text } from "@/components/primitives";
import { eventDetail } from "@/data/events";
import { placesLeft } from "@/data/roster";
import { useMember } from "@/lib/member-context";
import {
  formatDate,
  formatDateWithYear,
  getContent,
  isNearSchool,
  relativeUpcoming,
  selectEvents,
} from "@/lib/selectors";

/**
 * Event detail.
 *
 * The whole page is arranged around one decision: come or don't. So the
 * date, the place, the places left and the register control sit together in
 * a single block that stays visible, and everything else is the case for
 * saying yes.
 */
export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { role, school, setContactOpen } = useMember();
  const event = getContent(params.id);

  if (!event || !event.eventIso) {
    return (
      <AppShell>
        <Field>
          <Wrap>
            <Text as="h1" size="display">
              We couldn&rsquo;t find that session
            </Text>
            <Text size="lede" tone="secondary" className="mt-4">
              It may have run already. Everything coming up is listed in the
              portal.
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

  const detail = eventDetail(event.id);
  const places = placesLeft(event.id);
  const near = isNearSchool(event);
  const tight = places <= 6;

  const others = selectEvents(role)
    .filter((item) => item.id !== event.id)
    .slice(0, 3);

  return (
    <AppShell>
      <Field tight wash>
        <Wrap>
          <Eyebrow className="mb-3.5">
            {categoryLabel(event.category)} · {event.format}
            {near ? " · Near your school" : ""}
          </Eyebrow>

          <Text as="h1" size="display" measure="narrow">
            {event.title}
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-4">
            {event.summary}
          </Text>
        </Wrap>
      </Field>

      <Field>
        <Wrap>
          <div className="split-editorial">
            <div>
              {detail.about.map((paragraph) => (
                <Text key={paragraph} measure="reading" className="mb-4">
                  {paragraph}
                </Text>
              ))}

              <Text as="h2" size="h3" className="mt-9 mb-3">
                What it covers
              </Text>
              <ul className="event-covers">
                {detail.covers.map((line) => (
                  <li key={line}>
                    <Text as="span" size="small">
                      {line}
                    </Text>
                  </li>
                ))}
              </ul>

              {detail.sessions ? (
                <>
                  <Text as="h2" size="h3" className="mt-9 mb-1">
                    Sessions in the series
                  </Text>
                  <Text size="small" tone="secondary" className="mb-3">
                    Register once, then come to the sessions that suit you.
                  </Text>
                  <ul className="session-list">
                    {detail.sessions.map((session) => (
                      <li key={session.id} className="session-row">
                        <span className="session-when">
                          <Text as="span" size="small" className="font-semibold">
                            {formatDate(session.dateIso)}
                          </Text>
                          <Text as="span" size="micro" tone="tertiary">
                            {session.time}
                          </Text>
                        </span>
                        <Text as="span" size="small">
                          {session.topic}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {detail.runsheet.length > 0 ? (
                <>
                  <Text as="h2" size="h3" className="mt-9 mb-3">
                    On the day
                  </Text>
                  <dl className="event-runsheet">
                    {detail.runsheet.map((row) => (
                      <div key={row.time} className="event-runsheet-row">
                        <dt>
                          <Text as="span" size="micro" tone="tertiary">
                            {row.time}
                          </Text>
                        </dt>
                        <dd>
                          <Text as="span" size="small">
                            {row.label}
                          </Text>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : null}

              {detail.presenters.length > 0 ? (
                <>
                  <Text as="h2" size="h3" className="mt-9 mb-3">
                    Who runs it
                  </Text>
                  <div className="presenter-list">
                    {detail.presenters.map((person) => (
                      <div key={person.name} className="presenter">
                        <span className="presenter-mark" aria-hidden>
                          {person.initials}
                        </span>
                        <span className="min-w-0">
                          <Text as="span" size="small" className="font-semibold block">
                            {person.name}
                          </Text>
                          <Text as="span" size="micro" tone="tertiary" className="block">
                            {person.title}
                          </Text>
                          <Text as="span" size="small" tone="secondary" className="mt-1.5 block">
                            {person.bio}
                          </Text>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              <div className="mt-9 border-t border-line pt-6">
                <Eyebrow className="mb-1.5">Who comes</Eyebrow>
                <Text size="small" tone="secondary" measure="reading">
                  {detail.audience}
                </Text>
              </div>
            </div>

            {/* The decision block. Everything needed to say yes, in one
                place, in the order a member asks for it: when, where, is
                there room, and how do I get in. */}
            <aside className="bg-field-sand p-8">
              <Eyebrow className="mb-4">
                {relativeUpcoming(event.eventIso)}
              </Eyebrow>

              <Text as="p" size="h3">
                {detail.sessions
                  ? `${detail.sessions.length} sessions`
                  : formatDateWithYear(event.eventIso)}
              </Text>
              <Text size="small" tone="secondary" className="mt-1.5">
                {detail.sessions
                  ? `From ${formatDate(detail.sessions[0].dateIso)}`
                  : event.location}
              </Text>

              <dl className="fact-list mt-5">
                <div>
                  <dt>
                    <Eyebrow>Cost</Eyebrow>
                  </dt>
                  <dd>
                    <Text as="span" size="small">
                      {detail.cost}
                    </Text>
                  </dd>
                </div>
                <div>
                  <dt>
                    <Eyebrow>Delivery</Eyebrow>
                  </dt>
                  <dd>
                    <Text as="span" size="small">
                      {detail.deliveryNote}
                    </Text>
                  </dd>
                </div>
                {detail.recordingNote ? (
                  <div>
                    <dt>
                      <Eyebrow>Recording</Eyebrow>
                    </dt>
                    <dd>
                      <Text as="span" size="small">
                        {detail.recordingNote}
                      </Text>
                    </dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-6 border-t border-line pt-5">
                <Text
                  as="p"
                  size="small"
                  tone={tight ? "primary" : "secondary"}
                  className={tight ? "font-semibold" : undefined}
                >
                  {places} {places === 1 ? "place" : "places"} left
                </Text>
                <Text size="micro" tone="tertiary" className="mt-1">
                  {tight
                    ? "Held small on purpose."
                    : "Open to staff of member schools."}
                </Text>
              </div>

              <div className="mt-7 grid gap-3">
                <Button
                  block
                  onClick={() => router.push(`/events/${event.id}/register`)}
                >
                  Register
                </Button>
                <Button
                  variant="secondary"
                  block
                  onClick={() => setContactOpen(true)}
                >
                  Ask ISV about this session
                </Button>
              </div>

              <Text size="micro" tone="tertiary" className="mt-5">
                You can register colleagues from {school.name} at the same
                time. If you have trouble registering, contact{" "}
                {detail.helpEmail}.
              </Text>
            </aside>
          </div>
        </Wrap>
      </Field>

      {others.length > 0 ? (
        <Field tone="warm">
          <Wrap>
            <Text as="h2" size="h2" className="section-header">
              Also coming up
            </Text>
            <ScheduleList items={others} nearFn={isNearSchool} />
          </Wrap>
        </Field>
      ) : null}

      <AskIsv />
    </AppShell>
  );
}
