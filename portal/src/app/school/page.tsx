"use client";

import { AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, SectionHeader, Wrap } from "@/components/layout";
import {
  Tile,
  TileBody,
  TileGrid,
  TileHeading,
  TileLink,
  TilePill,
} from "@/components/patterns";
import { AppLink, Eyebrow, LinkButton, Text } from "@/components/primitives";
import { money, total } from "@/data/membership";
import { staleAccess } from "@/data/roster";
import { accountGroups, lastConfirmed } from "@/data/school-account";
import { useMember } from "@/lib/member-context";
import { formatDateWithYear, relativeUpcoming } from "@/lib/selectors";

/**
 * The school account.
 *
 * Opens with what is wrong rather than with what the school is. A Business
 * Manager arriving here has come to fix something, and a masthead that recites
 * the school's own name and address back at them before showing the unpaid
 * invoice wastes the only screen in the portal they came to on purpose.
 *
 * Three things live here, in the order they go wrong: the record ISV holds,
 * the people it writes to, and the membership. They sit in three different
 * places in a school today — a form somebody emailed, a spreadsheet in the
 * business office, and an invoice in the accounts inbox.
 */
export default function SchoolAccountPage() {
  const {
    school,
    people,
    invoices,
    nominated,
    accountValues,
    accountNeedsConfirming,
  } = useMember();

  const active = people.filter((p) => p.status !== "departed");
  const invited = people.filter((p) => p.status === "invited");
  const stale = staleAccess(people);
  const unpaid = invoices.filter((inv) => inv.status !== "paid");
  const owing = unpaid.reduce((sum, inv) => sum + total(inv), 0);

  const displayName = accountValues["field-name"] ?? school.name;

  /* What is actually waiting on somebody. Empty is a valid and good state. */
  const attention = [
    unpaid.length > 0
      ? {
          id: "attention-invoice",
          title: `${money(owing)} outstanding`,
          detail: `Invoice ${unpaid[0].number} · due ${relativeUpcoming(unpaid[0].dueIso)}`,
          href: "/school/membership",
          action: "Pay it",
        }
      : null,
    stale.length > 0
      ? {
          id: "attention-access",
          title: `${stale.length} ${stale.length === 1 ? "person has" : "people have"} left and can still sign in`,
          detail: stale.map((p) => p.name).join(", "),
          href: "/school/people",
          action: "Review access",
        }
      : null,
    accountNeedsConfirming > 0
      ? {
          id: "attention-record",
          title: `${accountNeedsConfirming} ${accountNeedsConfirming === 1 ? "detail" : "details"} not confirmed in over a year`,
          detail: "ISV is working from what we last told it.",
          href: "/school/details",
          action: "Confirm",
        }
      : null,
  ].filter(Boolean) as {
    id: string;
    title: string;
    detail: string;
    href: string;
    action: string;
  }[];

  return (
    <AppShell>
      {/* ---------------- Masthead ---------------- */}
      <Field wash tight>
        <Wrap>
          <div className="masthead-row">
            <div className="masthead-lead">
              <Eyebrow className="mb-3.5">
                {displayName} · {school.membershipStatus}
              </Eyebrow>
              <Text as="h1" size="mega">
                Our school account
              </Text>
              <Text
                size="lede"
                tone="secondary"
                measure="reading"
                className="mt-4"
              >
                What ISV holds about us, who it writes to, and where our
                membership sits. Last confirmed by {lastConfirmed.byName} on{" "}
                {formatDateWithYear(lastConfirmed.iso)}.
              </Text>
            </div>
          </div>
        </Wrap>
      </Field>

      {/* ---------------- Waiting on us ---------------- */}
      {attention.length > 0 ? (
        <Field tone="sand" tight>
          <Wrap>
            <SectionHeader heading="Waiting on us" />
            <div className="request-panel">
              {attention.map((item) => (
                <AppLink
                  key={item.id}
                  href={item.href}
                  className="applicant-row"
                >
                  <span className="attention-mark" aria-hidden>
                    <AlertTriangle className="size-4" strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0">
                    <Text as="span" size="h3" className="block">
                      {item.title}
                    </Text>
                    <Text
                      as="span"
                      size="micro"
                      tone="tertiary"
                      className="mt-1 block"
                    >
                      {item.detail}
                    </Text>
                  </span>
                  <Text as="span" size="small" tone="secondary">
                    {item.action}
                  </Text>
                </AppLink>
              ))}
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- The three areas ---------------- */}
      <Field>
        <Wrap>
          <SectionHeader heading="Manage" />
          <TileGrid>
            <Tile tone="mist" span={2} rows={2}>
              <span className="mb-4">
                <TilePill tone="mist">
                  {accountNeedsConfirming > 0
                    ? `${accountNeedsConfirming} to confirm`
                    : "Up to date"}
                </TilePill>
              </span>
              <TileHeading serif>
                <AppLink href="/school/details" className="tile-title-link">
                  Our details
                </AppLink>
              </TileHeading>
              <TileBody tone="mist">
                The name, address, size and shape of the school as ISV has it.
                Nothing tells ISV when these change except us.
              </TileBody>
              <span className="mt-auto pt-7 block">
                <Text as="span" size="micro" tone="tertiary" className="block">
                  {accountGroups.flatMap((g) => g.fields).length} details ·{" "}
                  {nominated.length} nominated contacts
                </Text>
                <TileLink>Open our details</TileLink>
              </span>
            </Tile>

            <Tile tone="ochre" span={2} rows={2}>
              <span className="mb-4">
                <TilePill tone="ochre">
                  {stale.length > 0
                    ? `${stale.length} to review`
                    : `${active.length} active`}
                </TilePill>
              </span>
              <TileHeading serif>
                <AppLink href="/school/people" className="tile-title-link">
                  Our people
                </AppLink>
              </TileHeading>
              <TileBody tone="ochre">
                Everyone ISV writes to, and what each of them can reach in the
                portal. Add someone and they are available everywhere else
                straight away.
              </TileBody>
              <span className="mt-auto pt-7 block">
                <Text as="span" size="micro" tone="tertiary" className="block">
                  {active.length} active
                  {invited.length > 0 ? ` · ${invited.length} invited` : ""}
                  {stale.length > 0 ? ` · ${stale.length} needing review` : ""}
                </Text>
                <TileLink>Manage our people</TileLink>
              </span>
            </Tile>

            <Tile tone={unpaid.length > 0 ? "forest" : "sand"} span={2} rows={2}>
              <span className="mb-4">
                <TilePill tone={unpaid.length > 0 ? "forest" : "sand"}>
                  {unpaid.length > 0
                    ? `Due ${relativeUpcoming(unpaid[0].dueIso)}`
                    : "Paid"}
                </TilePill>
              </span>
              <TileHeading serif>
                <AppLink href="/school/membership" className="tile-title-link">
                  Our membership
                </AppLink>
              </TileHeading>
              <TileBody tone={unpaid.length > 0 ? "forest" : "sand"}>
                {unpaid.length > 0
                  ? "Our renewal invoice is open. Pay it by transfer or by card, whichever suits how we do things."
                  : "Everything is paid. Invoices and receipts are kept here."}
              </TileBody>
              <span className="mt-auto pt-7 block">
                <Text
                  as="span"
                  size="micro"
                  tone={unpaid.length > 0 ? "inverseFaint" : "tertiary"}
                  className="block"
                >
                  {invoices.length} invoices on record
                </Text>
                {unpaid.length > 0 ? (
                  <span className="applicant-tally">
                    <span className="tally-figure">{money(owing)}</span>
                    <Text as="span" size="micro" tone="inverseSoft">
                      outstanding
                    </Text>
                  </span>
                ) : null}
                <TileLink>Open our membership</TileLink>
                <Text
                  as="span"
                  size="micro"
                  tone={unpaid.length > 0 ? "inverseFaint" : "tertiary"}
                  className="mt-3 block"
                >
                  Illustrative amount. This prototype states no ISV fee.
                </Text>
              </span>
            </Tile>
          </TileGrid>
        </Wrap>
      </Field>

      {/* ---------------- Nominated contacts ---------------- */}
      <Field tone="warm" tight>
        <Wrap>
          <SectionHeader
            heading="Who ISV writes to"
            moreLabel="Change these"
            moreHref="/school/details#contacts"
          />
          <Text size="small" tone="secondary" measure="reading" className="mb-8">
            When ISV needs the school rather than a person, these are the names
            it has. The Principal is the authority for them.
          </Text>
          <ul className="listing">
            {nominated.map((contact) => {
              const person = people.find((p) => p.id === contact.staffId);
              return (
                <li key={contact.id}>
                  <div className="listing-row">
                    <span className="listing-lead">
                      <Text as="span" size="small" className="font-semibold">
                        {contact.role}
                      </Text>
                    </span>
                    <span className="listing-body">
                      <Text as="span" size="h3" className="block">
                        {person?.name ?? "Not nominated"}
                      </Text>
                      <Text
                        as="span"
                        size="micro"
                        tone="tertiary"
                        className="mt-1 block"
                      >
                        {contact.purpose}
                      </Text>
                    </span>
                    <LinkButton
                      variant="secondary"
                      size="sm"
                      href="/school/details#contacts"
                      className="listing-action"
                    >
                      Change
                    </LinkButton>
                  </div>
                </li>
              );
            })}
          </ul>
        </Wrap>
      </Field>

      <AskIsv />
    </AppShell>
  );
}
