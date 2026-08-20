"use client";

import { Download } from "lucide-react";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, SectionHeader, Wrap } from "@/components/layout";
import { FileIcon } from "@/components/patterns";
import { Button, Eyebrow, LinkButton, Text } from "@/components/primitives";
import {
  currentPeriod,
  gst,
  money,
  remittance,
  subtotal,
  total,
} from "@/data/membership";
import { useMember } from "@/lib/member-context";
import { formatDateWithYear, relativeUpcoming } from "@/lib/selectors";

/**
 * Our membership.
 *
 * Answers "are we paid up" above the fold and then gets out of the way. That
 * is the question this screen exists for; everything else on it is filing.
 *
 * NO FEE CLAIM. The amounts belong to a fictional school and are illustrative.
 * The invoice is one line, because a breakdown would mean inventing what ISV
 * charges for. See data/membership.ts.
 */
export default function MembershipPage() {
  const { school, invoices } = useMember();

  const unpaid = invoices.filter((inv) => inv.status !== "paid");
  const owing = unpaid.reduce((sum, inv) => sum + total(inv), 0);
  const open = unpaid[0];

  return (
    <AppShell>
      {/* ---------------- Masthead ---------------- */}
      <Field wash tight>
        <Wrap>
          <Eyebrow className="mb-3.5">
            Our school account · {school.membershipStatus}
          </Eyebrow>
          <Text as="h1" size="display" measure="narrow">
            Our membership
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-4">
            {unpaid.length > 0
              ? `${money(owing)} outstanding on invoice ${open.number}, due ${relativeUpcoming(open.dueIso)}.`
              : "Everything is paid. Our invoices and receipts are kept here."}
          </Text>
        </Wrap>
      </Field>

      {/* ---------------- The period ---------------- */}
      <Field tone="warm" tight>
        <Wrap>
          <dl className="fact-list fact-list-row">
            <div>
              <dt>
                <Eyebrow>Membership year</Eyebrow>
              </dt>
              <dd>
                <Text as="span" size="h3">
                  {currentPeriod.label}
                </Text>
              </dd>
            </div>
            <div>
              <dt>
                <Eyebrow>Status</Eyebrow>
              </dt>
              <dd>
                <Text as="span" size="h3">
                  {currentPeriod.statusLabel}
                </Text>
              </dd>
            </div>
            <div>
              <dt>
                <Eyebrow>Runs to</Eyebrow>
              </dt>
              <dd>
                <Text as="span" size="h3">
                  {formatDateWithYear(currentPeriod.endIso)}
                </Text>
              </dd>
            </div>
            <div>
              <dt>
                <Eyebrow>Outstanding</Eyebrow>
              </dt>
              <dd>
                <Text as="span" size="h3">
                  {owing > 0 ? money(owing) : "Nothing"}
                </Text>
              </dd>
            </div>
          </dl>
        </Wrap>
      </Field>

      {/* ---------------- The open invoice ---------------- */}
      {open ? (
        <Field>
          <Wrap>
            <SectionHeader heading="What's owing" />
            <div className="split-editorial">
              <div>
                <div className="invoice">
                  <div className="invoice-head">
                    <span>
                      <Eyebrow>Invoice</Eyebrow>
                      <Text as="span" size="h2" className="mt-1 block">
                        {open.number}
                      </Text>
                    </span>
                    <span className="invoice-dates">
                      <Text as="span" size="micro" tone="tertiary" className="block">
                        Issued {formatDateWithYear(open.issuedIso)}
                      </Text>
                      <Text as="span" size="micro" tone="tertiary" className="block">
                        Due {formatDateWithYear(open.dueIso)}
                      </Text>
                    </span>
                  </div>

                  <ul className="invoice-lines">
                    {open.lines.map((line) => (
                      <li key={line.id}>
                        <span className="min-w-0">
                          <Text as="span" size="small" className="block">
                            {line.description}
                          </Text>
                          {line.note ? (
                            <Text
                              as="span"
                              size="micro"
                              tone="tertiary"
                              className="block"
                            >
                              {line.note}
                            </Text>
                          ) : null}
                        </span>
                        <Text as="span" size="small" mono>
                          {money(line.amount)}
                        </Text>
                      </li>
                    ))}
                  </ul>

                  <dl className="invoice-total">
                    <div>
                      <dt>
                        <Text as="span" size="small" tone="secondary">
                          Subtotal
                        </Text>
                      </dt>
                      <dd>
                        <Text as="span" size="small" mono>
                          {money(subtotal(open))}
                        </Text>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <Text as="span" size="small" tone="secondary">
                          GST
                        </Text>
                      </dt>
                      <dd>
                        <Text as="span" size="small" mono>
                          {money(gst(open))}
                        </Text>
                      </dd>
                    </div>
                    <div data-emphasis="true">
                      <dt>
                        <Text as="span" size="h3">
                          Total
                        </Text>
                      </dt>
                      <dd>
                        <Text as="span" size="h3" mono>
                          {money(total(open))}
                        </Text>
                      </dd>
                    </div>
                  </dl>
                </div>

              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">
                  Due {relativeUpcoming(open.dueIso)}
                </Eyebrow>
                <Text as="p" size="display" className="mb-6">
                  {money(total(open))}
                </Text>

                <div className="grid gap-3">
                  <LinkButton block href={`/school/membership/pay?invoice=${open.id}`}>
                    Pay this invoice
                  </LinkButton>
                  <Button block variant="secondary">
                    <span className="btn-icon">
                      <Download className="size-4" strokeWidth={1.9} aria-hidden />
                      Download the invoice
                    </span>
                  </Button>
                </div>

                <div className="mt-8 border-t border-line pt-6">
                  <Eyebrow className="mb-3">Paying by transfer</Eyebrow>
                  <dl className="fact-list">
                    <div>
                      <dt>
                        <Eyebrow>Account name</Eyebrow>
                      </dt>
                      <dd>
                        <Text as="span" size="small">
                          {remittance.accountName}
                        </Text>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <Eyebrow>BSB</Eyebrow>
                      </dt>
                      <dd>
                        <Text as="span" size="small" mono>
                          {remittance.bsb}
                        </Text>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <Eyebrow>Account</Eyebrow>
                      </dt>
                      <dd>
                        <Text as="span" size="small" mono>
                          {remittance.account}
                        </Text>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <Eyebrow>Reference</Eyebrow>
                      </dt>
                      <dd>
                        <Text as="span" size="small" mono>
                          {open.number}
                        </Text>
                      </dd>
                    </div>
                  </dl>
                </div>
              </aside>
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- History ---------------- */}
      <Field tone={open ? "warm" : "paper"}>
        <Wrap>
          <SectionHeader heading="Invoices" />
          <ul className="listing">
            {invoices.map((invoice) => (
              <li key={invoice.id}>
                <div className="listing-row">
                  <span className="listing-lead">
                    <Text as="span" size="small" className="font-semibold">
                      {invoice.status === "paid" ? "Paid" : "Outstanding"}
                    </Text>
                    <Text as="span" size="micro" tone="tertiary">
                      {invoice.paidIso
                        ? formatDateWithYear(invoice.paidIso)
                        : `Due ${formatDateWithYear(invoice.dueIso)}`}
                    </Text>
                  </span>

                  <span className="listing-body">
                    <span className="file-line">
                      <FileIcon kind="pdf" />
                      <span className="min-w-0">
                        <Text as="span" size="h3" className="block">
                          {invoice.number}
                        </Text>
                        <Text
                          as="span"
                          size="micro"
                          tone="tertiary"
                          className="mt-1 block"
                        >
                          {invoice.period}
                          {invoice.paidBy
                            ? ` · paid by ${invoice.paidBy === "card" ? "card" : "transfer"}`
                            : ""}
                          {invoice.paidReference ? ` · ${invoice.paidReference}` : ""}
                        </Text>
                      </span>
                    </span>
                  </span>

                  <span className="listing-action">
                    <Text as="span" size="small" tone="secondary">
                      {invoice.status === "paid" ? "Receipt" : "Open"}
                    </Text>
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <Text size="micro" tone="tertiary" measure="reading" className="mt-8">
            Illustrative amounts for a fictional school. This prototype states
            no ISV fee or rate.
          </Text>
        </Wrap>
      </Field>

      <Field tight>
        <Wrap>
          <LinkButton variant="secondary" href="/school">
            Back to our school account
          </LinkButton>
        </Wrap>
      </Field>

      <AskIsv />
    </AppShell>
  );
}
