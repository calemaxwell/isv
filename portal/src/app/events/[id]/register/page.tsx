"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, Wrap } from "@/components/layout";
import { Button, Eyebrow, Text } from "@/components/primitives";
import { eventDetail } from "@/data/events";
import { placesLeft, type StaffMember } from "@/data/roster";
import { useMember } from "@/lib/member-context";
import {
  formatDate,
  formatDateWithYear,
  fullName,
  getContent,
  relativeUpcoming,
} from "@/lib/selectors";

type Step = "sessions" | "who" | "details" | "done";

/**
 * Event registration.
 *
 * The interesting half of this flow is registering other people, because
 * that is what a Principal or Business Manager actually does and it is the
 * half most portals handle badly. So the flow is built around four things:
 *
 *   1. You can register colleagues without registering yourself.
 *   2. Someone already registered cannot be added twice, and the row says why.
 *   3. Capacity is enforced against the whole selection, not one seat at a time.
 *   4. Registering someone else means ISV emails them. That is stated before
 *      you commit, and you can redirect the confirmations to yourself.
 *
 * Requirements are collected per attendee rather than once for the booking,
 * because a dietary or access need belongs to a person, not to a group.
 */
export default function EventRegisterPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { member, school, people } = useMember();
  const event = getContent(params.id);

  const detail = eventDetail(params.id);
  const series = detail.sessions;

  // A series asks which sessions first, because that answer changes who you
  // would bring and how many places you are taking.
  const [step, setStep] = useState<Step>(series ? "sessions" : "who");
  const [chosenSessions, setChosenSessions] = useState<string[]>(
    series ? series.map((x) => x.id) : [],
  );
  const [self, setSelf] = useState(true);
  const [picked, setPicked] = useState<string[]>([]);
  const [needs, setNeeds] = useState<Record<string, string>>({});
  const [notifyMe, setNotifyMe] = useState(false);
  const [query, setQuery] = useState("");

  const me = useMemo(
    () => people.find((s) => s.name === fullName(member)),
    [people, member],
  );

  /**
   * Read from the school account's list, not from the fixture.
   *
   * Somebody added under Our people is selectable here in the same session,
   * and somebody marked as departed is gone from it. That is the point of
   * holding one list: a school that keeps its own record current gets a
   * registration picker that is current, without doing anything twice.
   */
  const colleagues = useMemo(
    () =>
      people.filter((s) => s.id !== me?.id && s.status !== "departed"),
    [people, me],
  );

  /**
   * Selected people stay at the top. Without that, choosing someone and then
   * searching for the next person makes the first choice vanish, and you
   * lose track of who you have picked.
   */
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? colleagues.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.role.toLowerCase().includes(q),
        )
      : colleagues;

    return [...matches].sort((a, b) => {
      const aPicked = picked.includes(a.id) ? 0 : 1;
      const bPicked = picked.includes(b.id) ? 0 : 1;
      return aPicked - bPicked || a.name.localeCompare(b.name);
    });
  }, [colleagues, query, picked]);

  if (!event || !event.eventIso) {
    return (
      <AppShell>
        <Field>
          <Wrap>
            <Text as="h1" size="display">
              We couldn&rsquo;t find that session
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

  const places = placesLeft(event.id);
  const meAlready = me?.alreadyRegisteredFor.includes(event.id) ?? false;
  const count = (self && !meAlready ? 1 : 0) + picked.length;
  const overCapacity = count > places;
  const nobody = count === 0;

  const attendees: { id: string; name: string; email: string; role: string }[] =
    [
      ...(self && !meAlready
        ? [
            {
              id: "self",
              name: fullName(member),
              email: me?.email ?? "",
              role: member.roleLabel,
            },
          ]
        : []),
      ...picked
        .map((id) => colleagues.find((c) => c.id === id))
        .filter((c): c is StaffMember => Boolean(c))
        .map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          role: c.role,
        })),
    ];

  const othersCount = picked.length;

  function toggleSession(id: string) {
    setChosenSessions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function toggle(id: string) {
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  return (
    <AppShell>
      <Field tight wash>
        <Wrap>
          <Eyebrow className="mb-3.5">
            Register · {relativeUpcoming(event.eventIso)}
          </Eyebrow>
          <Text as="h1" size="display" measure="narrow">
            {event.title}
          </Text>
          <Text size="small" tone="secondary" className="mt-4">
            {formatDateWithYear(event.eventIso)} · {event.location} ·{" "}
            {event.format}
          </Text>

          <ol className="step-rail" aria-label="Registration steps">
            {series ? (
              <li data-state={step === "sessions" ? "current" : "done"}>
                Sessions
              </li>
            ) : null}
            <li
              data-state={
                step === "who"
                  ? "current"
                  : step === "sessions"
                    ? "ahead"
                    : "done"
              }
            >
              Who&rsquo;s coming
            </li>
            <li
              data-state={
                step === "details"
                  ? "current"
                  : step === "done"
                    ? "done"
                    : "ahead"
              }
            >
              Details
            </li>
            <li data-state={step === "done" ? "current" : "ahead"}>
              Confirmed
            </li>
          </ol>
        </Wrap>
      </Field>

      {/* ---------------- Step 0: series only ---------------- */}
      {step === "sessions" && series ? (
        <Field>
          <Wrap>
            <div className="split-editorial">
              <div>
                <Text as="h2" size="h2" className="section-header">
                  Which sessions
                </Text>
                <Text size="small" tone="secondary" className="mb-7">
                  All sessions are selected. Come to as many or as few as you
                  like — you can change this later without re-registering.
                </Text>

                <div className="pick-list">
                  {series.map((session) => (
                    <label key={session.id} className="pick-row">
                      <input
                        type="checkbox"
                        checked={chosenSessions.includes(session.id)}
                        onChange={() => toggleSession(session.id)}
                      />
                      <span className="pick-body">
                        <Text as="span" size="small" className="font-semibold">
                          {session.topic}
                        </Text>
                        <Text as="span" size="micro" tone="tertiary">
                          {formatDate(session.dateIso)} · {session.time}
                        </Text>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 flex gap-4">
                  <button
                    type="button"
                    className="pick-clear"
                    onClick={() => setChosenSessions(series.map((x) => x.id))}
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    className="pick-clear"
                    onClick={() => setChosenSessions([])}
                  >
                    Clear all
                  </button>
                </div>
              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">Your selection</Eyebrow>
                <Text as="p" size="h3">
                  {chosenSessions.length} of {series.length}
                </Text>
                <Text size="small" tone="secondary" className="mt-1.5">
                  {chosenSessions.length === 0
                    ? "No sessions selected"
                    : "sessions selected"}
                </Text>

                <Text size="micro" tone="tertiary" className="mt-5">
                  {detail.deliveryNote}
                </Text>

                <div className="mt-7 grid gap-3">
                  <Button
                    block
                    disabled={chosenSessions.length === 0}
                    onClick={() => setStep("who")}
                  >
                    Continue
                  </Button>
                  <Button
                    variant="secondary"
                    block
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    Back to the session
                  </Button>
                </div>
              </aside>
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- Step 1 ---------------- */}
      {step === "who" ? (
        <Field>
          <Wrap>
            <div className="split-editorial">
              <div>
                <Text as="h2" size="h2" className="section-header">
                  Who&rsquo;s coming
                </Text>

                <label className="pick-list">
                  <span className="sr-only">Search staff</span>
                  <input
                    type="search"
                    className="control control-input"
                    placeholder="Search by name or role"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>

                <div className="pick-count mt-5">
                  <Text as="span" size="micro" tone="tertiary">
                    {shown.length} of {colleagues.length} staff
                  </Text>
                  {picked.length > 0 ? (
                    <button
                      type="button"
                      className="pick-clear"
                      onClick={() => setPicked([])}
                    >
                      Clear {picked.length} selected
                    </button>
                  ) : null}
                </div>

                <div className="pick-list">
                  <label className="pick-row" data-disabled={meAlready}>
                    <input
                      type="checkbox"
                      checked={self && !meAlready}
                      disabled={meAlready}
                      onChange={(e) => setSelf(e.target.checked)}
                    />
                    <span className="pick-body">
                      <Text as="span" size="small" className="font-semibold">
                        {fullName(member)}
                      </Text>
                      <Text as="span" size="micro" tone="tertiary">
                        You · {member.roleLabel}
                      </Text>
                    </span>
                    {meAlready ? (
                      <Text as="span" size="micro" tone="tertiary">
                        Already registered
                      </Text>
                    ) : null}
                  </label>

                </div>

                <div className="pick-scroll">
                  <div className="pick-list">
                  {shown.map((person) => {
                    const already = person.alreadyRegisteredFor.includes(
                      event.id,
                    );
                    return (
                      <label
                        key={person.id}
                        className="pick-row"
                        data-disabled={already}
                      >
                        <input
                          type="checkbox"
                          checked={picked.includes(person.id)}
                          disabled={already}
                          onChange={() => toggle(person.id)}
                        />
                        <span className="pick-body">
                          <Text
                            as="span"
                            size="small"
                            className="font-semibold"
                          >
                            {person.name}
                          </Text>
                          <Text as="span" size="micro" tone="tertiary">
                            {person.role}
                          </Text>
                        </span>
                        {already ? (
                          <Text as="span" size="micro" tone="tertiary">
                            Already registered
                          </Text>
                        ) : null}
                      </label>
                    );
                  })}
                  {shown.length === 0 ? (
                    <div className="py-6">
                      <Text size="small" tone="secondary">
                        No staff match &ldquo;{query}&rdquo;.
                      </Text>
                    </div>
                  ) : null}
                  </div>
                </div>

                <Text size="micro" tone="tertiary" className="mt-4">
                  Staff listed are the contacts ISV holds for {school.name}.
                  You can add someone else at the next step.
                </Text>
              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">Your selection</Eyebrow>

                <Text as="p" size="h3">
                  {count} {count === 1 ? "place" : "places"}
                </Text>
                <Text size="small" tone="secondary" className="mt-1.5">
                  {places} available
                </Text>

                {overCapacity ? (
                  <div className="notice notice-error mt-5">
                    <Text as="span" size="small">
                      There {places === 1 ? "is" : "are"} only {places}{" "}
                      {places === 1 ? "place" : "places"} left. Remove{" "}
                      {count - places}{" "}
                      {count - places === 1 ? "person" : "people"} to continue,
                      or ask ISV about the waiting list.
                    </Text>
                  </div>
                ) : null}

                {!self && othersCount > 0 && !overCapacity ? (
                  <div className="notice mt-5">
                    <Text as="span" size="small">
                      You&rsquo;re registering{" "}
                      {othersCount === 1 ? "someone else" : "colleagues"} and
                      not attending yourself.
                    </Text>
                  </div>
                ) : null}

                <div className="mt-7 grid gap-3">
                  <Button
                    block
                    disabled={nobody || overCapacity}
                    onClick={() => setStep("details")}
                  >
                    Continue
                  </Button>
                  <Button
                    variant="secondary"
                    block
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    Back to the session
                  </Button>
                </div>
              </aside>
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- Step 2 ---------------- */}
      {step === "details" ? (
        <Field>
          <Wrap>
            <div className="split-editorial">
              <div>
                <Text as="h2" size="h2" className="section-header">
                  Anything we should know
                </Text>
                <Text size="small" tone="secondary" className="mb-7">
                  Dietary or access requirements, asked per person because
                  they belong to a person. Leave blank if there are none.
                </Text>

                <div className="pick-list">
                  {attendees.map((person) => (
                    <div key={person.id} className="need-row">
                      <span className="pick-body">
                        <Text as="span" size="small" className="font-semibold">
                          {person.name}
                        </Text>
                        <Text as="span" size="micro" tone="tertiary">
                          {person.role}
                        </Text>
                      </span>
                      <input
                        type="text"
                        className="control control-input"
                        placeholder="Dietary or access requirements"
                        value={needs[person.id] ?? ""}
                        onChange={(e) =>
                          setNeeds((prev) => ({
                            ...prev,
                            [person.id]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>

                {othersCount > 0 ? (
                  <div className="notice mt-8">
                    <Text as="span" size="small">
                      ISV will email joining details directly to the{" "}
                      {othersCount === 1 ? "colleague" : "colleagues"} you have
                      registered.
                    </Text>
                    <label className="pick-inline mt-3">
                      <input
                        type="checkbox"
                        checked={notifyMe}
                        onChange={(e) => setNotifyMe(e.target.checked)}
                      />
                      <Text as="span" size="small">
                        Send their confirmations to me as well
                      </Text>
                    </label>
                  </div>
                ) : null}
              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">Registering</Eyebrow>
                <ul className="summary-list">
                  {attendees.map((person) => (
                    <li key={person.id}>
                      <Text as="span" size="small">
                        {person.name}
                      </Text>
                    </li>
                  ))}
                </ul>

                <Text size="micro" tone="tertiary" className="mt-5">
                  {series
                    ? `${chosenSessions.length} of ${series.length} sessions`
                    : `${formatDateWithYear(event.eventIso)} · ${event.location}`}
                </Text>

                <div className="mt-7 grid gap-3">
                  <Button block onClick={() => setStep("done")}>
                    Confirm {count} {count === 1 ? "place" : "places"}
                  </Button>
                  <Button
                    variant="secondary"
                    block
                    onClick={() => setStep("who")}
                  >
                    Change who&rsquo;s coming
                  </Button>
                </div>
              </aside>
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- Step 3 ---------------- */}
      {step === "done" ? (
        <Field>
          <Wrap>
            <div className="split-editorial">
              <div>
                <Text as="h2" size="display" measure="narrow">
                  {count === 1 ? "You\u2019re registered" : "All registered"}
                </Text>

                <Text
                  size="lede"
                  tone="secondary"
                  measure="reading"
                  className="mt-4"
                >
                  {self
                    ? `We'll see you on ${formatDateWithYear(event.eventIso)}.`
                    : `${othersCount === 1 ? "Your colleague is" : "Your colleagues are"} booked in for ${formatDateWithYear(event.eventIso)}.`}
                </Text>

                <Text as="h3" size="h3" className="mt-10 mb-3">
                  What happens next
                </Text>
                <ul className="event-covers">
                  <li>
                    <Text as="span" size="small">
                      {self
                        ? "Joining details are emailed to you."
                        : "Joining details are emailed to each person registered."}
                      {othersCount > 0 && notifyMe
                        ? " A copy comes to you as well."
                        : ""}
                    </Text>
                  </li>
                  <li>
                    <Text as="span" size="small">
                      The session appears under what&rsquo;s coming up in your
                      portal.
                    </Text>
                  </li>
                  <li>
                    <Text as="span" size="small">
                      Change or cancel any place from the same screen.
                    </Text>
                  </li>
                </ul>
              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">Registered</Eyebrow>
                <ul className="summary-list">
                  {attendees.map((person) => (
                    <li key={person.id}>
                      <Text as="span" size="small" className="font-semibold">
                        {person.name}
                      </Text>
                      <Text as="span" size="micro" tone="tertiary">
                        {person.email}
                      </Text>
                      {needs[person.id] ? (
                        <Text as="span" size="micro" tone="tertiary">
                          {needs[person.id]}
                        </Text>
                      ) : null}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 grid gap-3">
                  <Button block onClick={() => router.push("/portal")}>
                    Back to the portal
                  </Button>
                  <Button
                    variant="secondary"
                    block
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    View the session
                  </Button>
                </div>
              </aside>
            </div>
          </Wrap>
        </Field>
      ) : null}

      <AskIsv />
    </AppShell>
  );
}
