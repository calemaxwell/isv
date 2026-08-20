"use client";

import { useMemo, useState } from "react";
import { Plus, Search, UserMinus, UserPlus } from "lucide-react";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, SectionHeader, Wrap } from "@/components/layout";
import { EmptyState } from "@/components/patterns";
import { Button, Eyebrow, LinkButton, Text } from "@/components/primitives";
import { staleAccess, type StaffAccess } from "@/data/roster";
import { useMember } from "@/lib/member-context";
import { formatDateWithYear } from "@/lib/selectors";

type Filter = "active" | "invited" | "departed" | "all";

const ACCESS: { value: StaffAccess; label: string; note: string }[] = [
  {
    value: "full",
    label: "Full",
    note: "Everything, including this area",
  },
  {
    value: "standard",
    label: "Standard",
    note: "Everything except our school account",
  },
  {
    value: "none",
    label: "None",
    note: "Receives ISV email, cannot sign in",
  },
];

/**
 * Our people.
 *
 * The list ISV writes to, and the one thing on it a school can never keep
 * current by hand. It opens on whoever has left and still has access, because
 * that is the row nobody goes looking for and the one that matters most.
 *
 * Access is three levels rather than a permission matrix. The question being
 * asked is "can she see the compliance material", and a matrix answers a
 * question nobody asked at the cost of a minute of anyone's attention.
 *
 * Departing somebody revokes their access in the same action. Two separate
 * controls would reproduce exactly the failure this screen exists to fix.
 */
export default function SchoolPeoplePage() {
  const {
    people,
    addPerson,
    setPersonAccess,
    departPerson,
    restorePerson,
    nominationFor,
  } = useMember();

  const [filter, setFilter] = useState<Filter>("active");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState<StaffAccess>("standard");
  const [added, setAdded] = useState<string | null>(null);

  const stale = staleAccess(people);

  const counts = {
    all: people.length,
    active: people.filter((p) => p.status === "active").length,
    invited: people.filter((p) => p.status === "invited").length,
    departed: people.filter((p) => p.status === "departed").length,
  };

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people
      .filter((p) => (filter === "all" ? true : p.status === filter))
      .filter((p) =>
        q
          ? p.name.toLowerCase().includes(q) ||
            p.role.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q)
          : true,
      );
  }, [people, filter, query]);

  const ready = name.trim() && role.trim() && email.trim();

  function submit() {
    const person = addPerson({
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      access,
    });
    setAdded(person.name);
    setName("");
    setRole("");
    setEmail("");
    setAccess("standard");
    setAdding(false);
    setFilter("invited");
  }

  return (
    <AppShell>
      {/* ---------------- Masthead ---------------- */}
      <Field wash tight>
        <Wrap>
          <div className="masthead-row">
            <div className="masthead-lead">
              <Eyebrow className="mb-3.5">Our school account</Eyebrow>
              <Text as="h1" size="mega">
                Our people
              </Text>
              <Text
                size="lede"
                tone="secondary"
                measure="reading"
                className="mt-4"
              >
                Everyone ISV writes to, and what each of them can reach in the
                portal. This is the same list the event registration picker
                reads, so anyone added here is available there straight away.
              </Text>
            </div>

            <Button onClick={() => setAdding((open) => !open)}>
              <span className="btn-icon">
                <Plus className="size-4" strokeWidth={2} aria-hidden />
                Add someone
              </span>
            </Button>
          </div>
        </Wrap>
      </Field>

      {/* ---------------- Stale access ---------------- */}
      {stale.length > 0 ? (
        <Field tone="sand" tight>
          <Wrap>
            <SectionHeader heading="Left, and can still sign in" />
            <Text
              size="small"
              tone="secondary"
              measure="reading"
              className="mb-8"
            >
              Access outlasts the person more often than anything else on our
              record. This is where we close it.
            </Text>
            <div className="request-panel">
              {stale.map((person) => (
                <div key={person.id} className="applicant-row">
                  <span className="min-w-0">
                    <Text as="span" size="h3" className="block">
                      {person.name}
                    </Text>
                    <Text
                      as="span"
                      size="micro"
                      tone="tertiary"
                      className="mt-1 block"
                    >
                      {person.role} · left{" "}
                      {person.departedIso
                        ? formatDateWithYear(person.departedIso)
                        : "recently"}
                    </Text>
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setPersonAccess(person.id, "none")}
                  >
                    <span className="btn-icon">
                      <UserMinus className="size-4" strokeWidth={2} aria-hidden />
                      Remove access
                    </span>
                  </Button>
                </div>
              ))}
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- Add someone ---------------- */}
      {adding ? (
        <Field tone="mist">
          <Wrap>
            <SectionHeader heading="Add someone" />
            <div className="split-editorial">
              <div className="form-grid">
                <label className="form-row">
                  <Eyebrow>Name</Eyebrow>
                  <input
                    className="control control-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Whitfield"
                  />
                </label>
                <label className="form-row">
                  <Eyebrow>Role at the school</Eyebrow>
                  <input
                    className="control control-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Head of Compliance"
                  />
                </label>
                <label className="form-row">
                  <Eyebrow>Email</Eyebrow>
                  <input
                    type="email"
                    className="control control-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="s.whitfield@ashwoodgrange.vic.edu.au"
                  />
                </label>
              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">What they can reach</Eyebrow>
                <div className="access-choice">
                  {ACCESS.map((option) => (
                    <label key={option.value} className="access-option">
                      <input
                        type="radio"
                        name="new-access"
                        value={option.value}
                        checked={access === option.value}
                        onChange={() => setAccess(option.value)}
                      />
                      <span>
                        <Text as="span" size="small" className="block font-semibold">
                          {option.label}
                        </Text>
                        <Text as="span" size="micro" tone="tertiary" className="block">
                          {option.note}
                        </Text>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-7 grid gap-3">
                  <Button block disabled={!ready} onClick={submit}>
                    <span className="btn-icon">
                      <UserPlus className="size-4" strokeWidth={2} aria-hidden />
                      Add to our people
                    </span>
                  </Button>
                  <Button block variant="quiet" onClick={() => setAdding(false)}>
                    Cancel
                  </Button>
                </div>

                <Text size="micro" tone="tertiary" className="mt-5">
                  They are added as invited until they sign in for the first
                  time.
                </Text>
              </aside>
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- The list ---------------- */}
      <Field>
        <Wrap>
          <SectionHeader heading="Everyone" />

          {added ? (
            <div className="notice mb-8">
              <Text as="span" size="small">
                {added} has been added. They are selectable in event
                registration now.
              </Text>
            </div>
          ) : null}

          <div className="filter-bar">
            <span className="people-search">
              <Search className="size-4" strokeWidth={1.9} aria-hidden />
              <input
                className="control control-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, role or email"
                aria-label="Search our people"
              />
            </span>

            <span className="segment">
              {(
                [
                  ["active", "Active"],
                  ["invited", "Invited"],
                  ["departed", "Left"],
                  ["all", "All"],
                ] as [Filter, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className="segment-option"
                  data-active={filter === value || undefined}
                  onClick={() => setFilter(value)}
                >
                  {label}
                  <span className="segment-count">{counts[value]}</span>
                </button>
              ))}
            </span>
          </div>

          {shown.length === 0 ? (
            <EmptyState
              heading="Nobody here"
              body="Try a different filter, or widen the search."
            />
          ) : (
            <ul className="listing">
              {shown.map((person) => {
                const nomination = nominationFor(person.id);
                const departed = person.status === "departed";

                return (
                  <li key={person.id}>
                    <div className="listing-row" data-status={person.status}>
                      <span className="listing-lead">
                        <Text as="span" size="small" className="font-semibold">
                          {person.name}
                        </Text>
                        <Text as="span" size="micro" tone="tertiary">
                          {person.role}
                        </Text>
                      </span>

                      <span className="listing-body">
                        <Text
                          as="span"
                          size="small"
                          tone="secondary"
                          className="block"
                        >
                          {person.email}
                        </Text>
                        <span className="person-facts">
                          {nomination ? (
                            <span className="person-flag" data-kind="nominated">
                              {nomination.role}
                            </span>
                          ) : null}
                          {person.status === "invited" ? (
                            <span className="person-flag" data-kind="invited">
                              Invited
                            </span>
                          ) : null}
                          {departed ? (
                            <span className="person-flag" data-kind="departed">
                              Left{" "}
                              {person.departedIso
                                ? formatDateWithYear(person.departedIso)
                                : ""}
                            </span>
                          ) : (
                            <Text as="span" size="micro" tone="tertiary">
                              {person.lastActiveIso
                                ? `Last signed in ${formatDateWithYear(person.lastActiveIso)}`
                                : "Never signed in"}
                            </Text>
                          )}
                        </span>
                      </span>

                      <span className="person-controls">
                        <label className="sr-only" htmlFor={`access-${person.id}`}>
                          Portal access for {person.name}
                        </label>
                        <select
                          id={`access-${person.id}`}
                          className="control control-input control-sm"
                          value={person.access}
                          onChange={(e) =>
                            setPersonAccess(
                              person.id,
                              e.target.value as StaffAccess,
                            )
                          }
                        >
                          {ACCESS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        {departed ? (
                          <Button
                            variant="quiet"
                            size="sm"
                            onClick={() => restorePerson(person.id)}
                          >
                            Returned
                          </Button>
                        ) : nomination ? (
                          <Button
                            variant="quiet"
                            size="sm"
                            disabled
                            title={`Nominated as our ${nomination.role.toLowerCase()}. Change that first.`}
                          >
                            Nominated
                          </Button>
                        ) : (
                          <Button
                            variant="quiet"
                            size="sm"
                            onClick={() => departPerson(person.id)}
                          >
                            They&rsquo;ve left
                          </Button>
                        )}
                      </span>
                    </div>

                    {nomination && !departed ? (
                      <Text
                        as="p"
                        size="micro"
                        tone="tertiary"
                        className="person-guard"
                      >
                        Nominated as our {nomination.role.toLowerCase()}. To
                        remove them, nominate someone else first.
                      </Text>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </Wrap>
      </Field>

      <Field tone="warm" tight>
        <Wrap>
          <div className="flex flex-wrap gap-3">
            <LinkButton variant="secondary" href="/school">
              Back to our school account
            </LinkButton>
            <LinkButton variant="quiet" href="/school/details#contacts">
              Change who ISV writes to
            </LinkButton>
          </div>
        </Wrap>
      </Field>

      <AskIsv />
    </AppShell>
  );
}
