"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Check, CreditCard } from "lucide-react";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, Wrap } from "@/components/layout";
import { Button, Eyebrow, LinkButton, Text } from "@/components/primitives";
import {
  money,
  remittance,
  total,
  type PaymentMethod,
} from "@/data/membership";
import { useMember } from "@/lib/member-context";
import { formatDateWithYear } from "@/lib/selectors";

type Step = "method" | "detail" | "done";

/**
 * Paying the membership.
 *
 * Two paths, side by side, neither presented as the default. A school pays a
 * peak body by transfer after somebody approves it, and forcing that through a
 * card form to record a payment that already happened is the kind of thing
 * that makes a Business Manager stop using a portal.
 *
 * The transfer path is not a dead end that shows bank details and shrugs. It
 * records the payment against the invoice, which is the actual job — the
 * money moved in the school's banking, and the portal needs to know.
 *
 * NOTHING IS CHARGED. No card is validated or stored. This is a prototype and
 * the walkthrough should say so if anybody asks.
 */
function PayFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const { invoices, payInvoice, member } = useMember();

  const requested = params.get("invoice");
  const invoice =
    invoices.find((inv) => inv.id === requested) ??
    invoices.find((inv) => inv.status !== "paid");

  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<PaymentMethod | null>(null);

  /* Transfer */
  const [paidOn, setPaidOn] = useState(new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState("");

  /* Card */
  const [cardName, setCardName] = useState(
    `${member.firstName} ${member.lastName}`,
  );
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  if (!invoice) {
    return (
      <AppShell>
        <Field>
          <Wrap>
            <Text as="h1" size="display">
              Nothing outstanding
            </Text>
            <Text size="lede" tone="secondary" measure="reading" className="mt-4">
              Every invoice on our account is paid.
            </Text>
            <div className="mt-8">
              <LinkButton href="/school/membership">
                Back to our membership
              </LinkButton>
            </div>
          </Wrap>
        </Field>
        <AskIsv />
      </AppShell>
    );
  }

  const amount = total(invoice);
  const last4 = cardNumber.replace(/\D/g, "").slice(-4);

  const transferReady = paidOn && reference.trim();
  const cardReady =
    cardName.trim() &&
    cardNumber.replace(/\D/g, "").length >= 12 &&
    expiry.trim() &&
    cvc.trim();

  function confirm() {
    if (!method) return;
    payInvoice(
      invoice!.id,
      method,
      method === "card" ? `card ending ${last4}` : reference.trim(),
    );
    setStep("done");
  }

  return (
    <AppShell>
      <Field wash tight>
        <Wrap>
          <Eyebrow className="mb-3.5">Our membership</Eyebrow>
          <Text as="h1" size="display" measure="narrow">
            {step === "done" ? "Paid" : `Pay ${money(amount)}`}
          </Text>

          <ol className="step-rail" aria-label="Steps">
            <li data-state={step === "method" ? "current" : "done"}>
              How we&rsquo;re paying
            </li>
            <li
              data-state={
                step === "detail"
                  ? "current"
                  : step === "method"
                    ? "ahead"
                    : "done"
              }
            >
              Details
            </li>
            <li data-state={step === "done" ? "current" : "ahead"}>Done</li>
          </ol>
        </Wrap>
      </Field>

      {/* ---------------- Step 1 — method ---------------- */}
      {step === "method" ? (
        <Field>
          <Wrap>
            <Text size="lede" tone="secondary" measure="reading" className="mb-9">
              Invoice {invoice.number}, {invoice.period}. Due{" "}
              {formatDateWithYear(invoice.dueIso)}.
            </Text>

            <div className="pay-choice">
              <button
                type="button"
                className="pay-option"
                data-selected={method === "eft" || undefined}
                onClick={() => setMethod("eft")}
              >
                <span className="pay-mark" aria-hidden>
                  <Building2 className="size-5" strokeWidth={1.7} />
                </span>
                <Text as="span" size="h3" className="block">
                  Bank transfer
                </Text>
                <Text as="span" size="small" tone="secondary" className="mt-2 block">
                  Pay from our school account, then record it here so the
                  invoice closes.
                </Text>
                <Text as="span" size="micro" tone="tertiary" className="mt-4 block">
                  Reference {invoice.number}
                </Text>
              </button>

              <button
                type="button"
                className="pay-option"
                data-selected={method === "card" || undefined}
                onClick={() => setMethod("card")}
              >
                <span className="pay-mark" aria-hidden>
                  <CreditCard className="size-5" strokeWidth={1.7} />
                </span>
                <Text as="span" size="h3" className="block">
                  Card
                </Text>
                <Text as="span" size="small" tone="secondary" className="mt-2 block">
                  Pay now on a school credit card. The invoice closes and the
                  receipt is on our account.
                </Text>
                <Text as="span" size="micro" tone="tertiary" className="mt-4 block">
                  Illustrative in this prototype
                </Text>
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button disabled={!method} onClick={() => setStep("detail")}>
                Continue
              </Button>
              <Button variant="quiet" onClick={() => router.push("/school/membership")}>
                Cancel
              </Button>
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- Step 2 — details ---------------- */}
      {step === "detail" ? (
        <Field>
          <Wrap>
            <div className="split-editorial">
              <div>
                {method === "eft" ? (
                  <>
                    <Text as="h2" size="h2" className="section-header">
                      Record the transfer
                    </Text>
                    <Text size="small" tone="secondary" measure="reading" className="mb-8">
                      Transfer the amount using the details opposite, then
                      record when it went out. The invoice closes once it is
                      recorded.
                    </Text>

                    <div className="form-grid">
                      <label className="form-row">
                        <Eyebrow>Date paid</Eyebrow>
                        <input
                          type="date"
                          className="control control-input"
                          value={paidOn}
                          onChange={(e) => setPaidOn(e.target.value)}
                        />
                      </label>
                      <label className="form-row">
                        <Eyebrow>Our payment reference</Eyebrow>
                        <input
                          className="control control-input"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                          placeholder={invoice.number}
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <Text as="h2" size="h2" className="section-header">
                      Card details
                    </Text>
                    <Text size="small" tone="secondary" measure="reading" className="mb-8">
                      A prototype. Nothing is validated, stored or charged, and
                      the amount is illustrative.
                    </Text>

                    <div className="form-grid">
                      <label className="form-row">
                        <Eyebrow>Name on the card</Eyebrow>
                        <input
                          className="control control-input"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          autoComplete="off"
                        />
                      </label>
                      <label className="form-row">
                        <Eyebrow>Card number</Eyebrow>
                        <input
                          className="control control-input"
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4000 0000 0000 0000"
                          autoComplete="off"
                        />
                      </label>
                      <div className="pay-pair">
                        <label className="form-row">
                          <Eyebrow>Expiry</Eyebrow>
                          <input
                            className="control control-input"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY"
                            autoComplete="off"
                          />
                        </label>
                        <label className="form-row">
                          <Eyebrow>Security code</Eyebrow>
                          <input
                            className="control control-input"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            placeholder="123"
                            autoComplete="off"
                          />
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">
                  {method === "eft" ? "Transfer to" : "Paying now"}
                </Eyebrow>

                {method === "eft" ? (
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
                          {invoice.number}
                        </Text>
                      </dd>
                    </div>
                  </dl>
                ) : null}

                <Text as="p" size="display" className="mt-6 mb-1">
                  {money(amount)}
                </Text>
                <Text size="micro" tone="tertiary" className="mb-7">
                  Invoice {invoice.number} · includes GST · illustrative amount
                </Text>

                <div className="grid gap-3">
                  <Button
                    block
                    disabled={method === "eft" ? !transferReady : !cardReady}
                    onClick={confirm}
                  >
                    {method === "eft"
                      ? "Record this payment"
                      : `Pay ${money(amount)}`}
                  </Button>
                  <Button block variant="quiet" onClick={() => setStep("method")}>
                    Back
                  </Button>
                </div>
              </aside>
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- Step 3 — done ---------------- */}
      {step === "done" ? (
        <Field>
          <Wrap>
            <div className="split-editorial">
              <div>
                <span className="done-mark" aria-hidden>
                  <Check className="size-6" strokeWidth={2} />
                </span>
                <Text as="h2" size="h2" className="mt-6">
                  Invoice {invoice.number} is settled
                </Text>
                <Text size="lede" tone="secondary" measure="reading" className="mt-4">
                  {method === "card"
                    ? `${money(amount)} paid by card ending ${last4}. The receipt is on our account.`
                    : `${money(amount)} recorded as paid by transfer on ${formatDateWithYear(paidOn)}, reference ${reference.trim()}.`}
                </Text>
                <Text size="micro" tone="tertiary" measure="reading" className="mt-6">
                  A prototype. No payment was processed, and the amount is
                  illustrative.
                </Text>

                <div className="mt-9 flex flex-wrap gap-3">
                  <LinkButton href="/school/membership">
                    Back to our membership
                  </LinkButton>
                  <LinkButton variant="secondary" href="/school">
                    Our school account
                  </LinkButton>
                </div>
              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">While we&rsquo;re here</Eyebrow>
                <Text size="small" tone="secondary" className="mb-6">
                  Renewal is a good moment to check ISV has the right details
                  and the right names for us.
                </Text>
                <div className="grid gap-3">
                  <LinkButton block variant="secondary" href="/school/details">
                    Confirm our details
                  </LinkButton>
                  <LinkButton block variant="quiet" href="/school/people">
                    Check who has access
                  </LinkButton>
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

/**
 * useSearchParams needs a Suspense boundary or the whole route opts out of
 * static rendering and the build warns. The fallback is never really seen —
 * the params resolve on the first pass — but it has to be a real shell rather
 * than null so the page does not flash empty.
 */
export default function PayPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <Field wash tight>
            <Wrap>
              <Eyebrow className="mb-3.5">Our membership</Eyebrow>
              <Text as="h1" size="display">
                Pay
              </Text>
            </Wrap>
          </Field>
        </AppShell>
      }
    >
      <PayFlow />
    </Suspense>
  );
}
