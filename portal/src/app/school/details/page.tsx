"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, SectionHeader, Wrap } from "@/components/layout";
import { Button, Eyebrow, LinkButton, Text } from "@/components/primitives";
import {
  accountGroups,
  confirmState,
  lastConfirmed,
} from "@/data/school-account";
import { useMember } from "@/lib/member-context";
import { formatDateWithYear } from "@/lib/selectors";

/**
 * Our details.
 *
 * Editable in place rather than behind an Edit button. The record is only
 * maintained if maintaining it is cheaper than ignoring it, and a mode switch
 * is the tax that makes people ignore it.
 *
 * The confirmation marks are the real content of the screen. A field nobody
 * has touched in eighteen months looks identical to a field confirmed
 * yesterday, and that is precisely why ISV ends up writing to a Principal who
 * left. Making the age of the record visible is the whole intervention.
 */
export default function SchoolDetailsPage() {
  const {
    accountValues,
    accountConfirmed,
    setAccountValue,
    confirmGroup,
    people,
    nominated,
    setNominee,
    accountNeedsConfirming,
  } = useMember();

  const [justConfirmed, setJustConfirmed] = useState<string | null>(null);

  const eligible = people.filter((p) => p.status !== "departed");

  function handleConfirm(groupId: string) {
    confirmGroup(groupId);
    setJustConfirmed(groupId);
    window.setTimeout(() => setJustConfirmed(null), 2400);
  }

  return (
    <AppShell>
      <Field wash tight>
        <Wrap>
          <Eyebrow className="mb-3.5">Our school account</Eyebrow>
          <Text as="h1" size="display" measure="narrow">
            Our details
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-4">
            {accountNeedsConfirming > 0
              ? `${accountNeedsConfirming} of these have not been confirmed in over a year. ISV is working from whatever we last told it.`
              : "Everything here has been confirmed within the last year."}
          </Text>
          <Text size="micro" tone="tertiary" className="mt-4">
            Last confirmed by {lastConfirmed.byName} on{" "}
            {formatDateWithYear(lastConfirmed.iso)}
          </Text>
        </Wrap>
      </Field>

      {accountGroups.map((group, index) => {
        const stale = group.fields.filter(
          (field) =>
            confirmState(accountConfirmed[field.id] ?? field.confirmedIso) ===
            "needs-confirming",
        ).length;

        return (
          <Field key={group.id} tone={index % 2 === 1 ? "warm" : "paper"}>
            <Wrap>
              <SectionHeader heading={group.heading} />
              <div className="split-editorial">
                <div>
                  <div className="form-grid">
                    {group.fields.map((field) => {
                      const value = accountValues[field.id] ?? field.value;
                      const confirmedIso =
                        accountConfirmed[field.id] ?? field.confirmedIso;
                      const state = confirmState(confirmedIso);

                      return (
                        <label key={field.id} className="form-row">
                          <span className="field-label">
                            <Eyebrow>{field.label}</Eyebrow>
                            {state === "needs-confirming" ? (
                              <span className="field-flag">Not confirmed</span>
                            ) : null}
                          </span>

                          {field.kind === "select" ? (
                            <select
                              className="control control-input"
                              value={value}
                              onChange={(e) =>
                                setAccountValue(field.id, e.target.value)
                              }
                            >
                              {field.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              className="control control-input"
                              type={
                                field.kind === "number"
                                  ? "number"
                                  : field.kind === "email"
                                    ? "email"
                                    : field.kind === "tel"
                                      ? "tel"
                                      : "text"
                              }
                              value={value}
                              onChange={(e) =>
                                setAccountValue(field.id, e.target.value)
                              }
                            />
                          )}

                          <Text
                            as="span"
                            size="micro"
                            tone="tertiary"
                            className="mt-1.5 block"
                          >
                            {field.help ? `${field.help} · ` : ""}
                            Confirmed {formatDateWithYear(confirmedIso)}
                          </Text>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <aside className="bg-field-sand p-8">
                  <Eyebrow className="mb-4">
                    {stale > 0 ? `${stale} to confirm` : "Confirmed"}
                  </Eyebrow>
                  <Text size="small" tone="secondary" className="mb-6">
                    {group.note}
                  </Text>

                  <Button
                    block
                    variant={stale > 0 ? "primary" : "secondary"}
                    onClick={() => handleConfirm(group.id)}
                  >
                    {justConfirmed === group.id ? (
                      <span className="btn-icon">
                        <Check className="size-4" strokeWidth={2} aria-hidden />
                        Confirmed
                      </span>
                    ) : (
                      "These are all correct"
                    )}
                  </Button>

                  <Text size="micro" tone="tertiary" className="mt-5">
                    Changing a field confirms it. This is for the ones that are
                    already right.
                  </Text>
                </aside>
              </div>
            </Wrap>
          </Field>
        );
      })}

      {/* ---------------- Nominated contacts ---------------- */}
      <Field id="contacts" tone="mist">
        <Wrap>
          <SectionHeader heading="Who ISV writes to" />
          <Text size="small" tone="secondary" measure="reading" className="mb-8">
            When ISV needs the school rather than a person, these are the names
            it has. Only people on our list can be nominated, and a nominated
            person cannot be removed from it while they hold the nomination.
          </Text>

          <div className="form-grid">
            {nominated.map((contact) => (
              <label key={contact.id} className="form-row">
                <span className="field-label">
                  <Eyebrow>{contact.role}</Eyebrow>
                  <span className="field-authority">Principal confirms</span>
                </span>
                <select
                  className="control control-input"
                  value={contact.staffId}
                  onChange={(e) => setNominee(contact.id, e.target.value)}
                >
                  {eligible.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name} · {person.role}
                    </option>
                  ))}
                </select>
                <Text
                  as="span"
                  size="micro"
                  tone="tertiary"
                  className="mt-1.5 block"
                >
                  {contact.purpose}
                </Text>
              </label>
            ))}
          </div>

          <Text size="micro" tone="tertiary" measure="reading" className="mt-8">
            These are records ISV holds so it knows who to contact. Both the
            Principal and the Business Manager can change them; the Principal is
            the authority for them.
          </Text>
        </Wrap>
      </Field>

      <Field tight>
        <Wrap>
          <div className="flex flex-wrap gap-3">
            <LinkButton variant="secondary" href="/school">
              Back to our school account
            </LinkButton>
            <LinkButton variant="quiet" href="/school/people">
              Manage our people
            </LinkButton>
          </div>
        </Wrap>
      </Field>

      <AskIsv />
    </AppShell>
  );
}
