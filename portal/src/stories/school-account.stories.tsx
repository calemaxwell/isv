"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Field, SectionHeader, Wrap } from "@/components/layout";
import { Button, Eyebrow, Text } from "@/components/primitives";
import {
  gst,
  money,
  seededInvoices,
  subtotal,
  total,
} from "@/data/membership";
import { schoolRoster } from "@/data/roster";
import { accountGroups, confirmState, nominatedContacts } from "@/data/school-account";
import { formatDateWithYear } from "@/lib/selectors";

/**
 * School account.
 *
 * The patterns that only exist in this area: the confirmation flag on a
 * stale field, the access and status marks on a person, the invoice, and the
 * two payment cards. Each one is here because it carries an argument rather
 * than because it is a new shape.
 */
const meta: Meta = {
  title: "Gallery/School account",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const Confirmation: Story = {
  name: "Confirmation flags",
  render: () => {
    const fields = accountGroups[0].fields.concat(accountGroups[2].fields);
    return (
      <Field>
        <Wrap>
          <SectionHeader heading="A record that shows its age" />
          <Text size="small" tone="secondary" measure="reading" className="mb-9">
            A field nobody has touched in eighteen months looks identical to one
            confirmed yesterday, and that is exactly why ISV ends up writing to
            a Principal who left in 2023. Making the age of the record visible
            is the whole intervention — everything else on the screen is a form.
          </Text>

          <div className="form-grid">
            {fields.map((field) => {
              const state = confirmState(field.confirmedIso);
              return (
                <label key={field.id} className="form-row">
                  <span className="field-label">
                    <Eyebrow>{field.label}</Eyebrow>
                    {state === "needs-confirming" ? (
                      <span className="field-flag">Not confirmed</span>
                    ) : null}
                  </span>
                  <input
                    className="control control-input"
                    defaultValue={field.value}
                  />
                  <Text
                    as="span"
                    size="micro"
                    tone="tertiary"
                    className="mt-1.5 block"
                  >
                    Confirmed {formatDateWithYear(field.confirmedIso)}
                  </Text>
                </label>
              );
            })}
          </div>
        </Wrap>
      </Field>
    );
  },
};

export const People: Story = {
  name: "People — status and access",
  render: () => {
    const sample = [
      schoolRoster.find((p) => p.id === "staff-ellery")!,
      schoolRoster.find((p) => p.id === "staff-costa")!,
      schoolRoster.find((p) => p.id === "staff-doyle")!,
    ];
    const nominatedIds = nominatedContacts.map((n) => n.staffId);

    return (
      <Field>
        <Wrap>
          <SectionHeader heading="One row, three states" />
          <Text size="small" tone="secondary" measure="reading" className="mb-9">
            Nominated, no access, and departed-but-still-signed-in. The third is
            the most common thing wrong with a school&rsquo;s record and the
            reason the area exists.
          </Text>

          <ul className="listing">
            {sample.map((person) => {
              const nomination = nominatedContacts.find(
                (n) => n.staffId === person.id,
              );
              const departed = person.status === "departed";
              return (
                <li key={person.id}>
                  <div className="listing-row">
                    <span className="listing-lead">
                      <Text as="span" size="small" className="font-semibold">
                        {person.name}
                      </Text>
                      <Text as="span" size="micro" tone="tertiary">
                        {person.role}
                      </Text>
                    </span>
                    <span className="listing-body">
                      <Text as="span" size="small" tone="secondary" className="block">
                        {person.email}
                      </Text>
                      <span className="person-facts">
                        {nominatedIds.includes(person.id) ? (
                          <span className="person-flag" data-kind="nominated">
                            {nomination?.role}
                          </span>
                        ) : null}
                        {departed ? (
                          <span className="person-flag" data-kind="departed">
                            Left {formatDateWithYear(person.departedIso!)}
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
                      <select
                        className="control control-input control-sm"
                        defaultValue={person.access}
                        aria-label={`Access for ${person.name}`}
                      >
                        <option value="full">Full</option>
                        <option value="standard">Standard</option>
                        <option value="none">None</option>
                      </select>
                      <Button variant="quiet" size="sm">
                        {departed ? "Returned" : "They've left"}
                      </Button>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Wrap>
      </Field>
    );
  },
};

export const Access: Story = {
  name: "Access levels",
  render: () => (
    <Field tone="sand">
      <Wrap>
        <SectionHeader heading="Three levels, not a matrix" />
        <Text size="small" tone="secondary" measure="reading" className="mb-9">
          The question being asked is &ldquo;can she see the compliance
          material&rdquo;. A permission matrix answers a question nobody asked
          and costs a minute of anyone&rsquo;s attention. Radios rather than a
          select, because the difference between the three is the entire
          decision and a select hides it behind one word.
        </Text>
        <div className="access-choice max-w-md">
          {[
            ["Full", "Everything, including our school account"],
            ["Standard", "Everything except our school account"],
            ["None", "Receives ISV email, cannot sign in"],
          ].map(([label, note], i) => (
            <label key={label} className="access-option">
              <input type="radio" name="access-story" defaultChecked={i === 1} />
              <span>
                <Text as="span" size="small" className="block font-semibold">
                  {label}
                </Text>
                <Text as="span" size="micro" tone="tertiary" className="block">
                  {note}
                </Text>
              </span>
            </label>
          ))}
        </div>
      </Wrap>
    </Field>
  ),
};

export const InvoiceStory: Story = {
  name: "Invoice",
  render: () => {
    const invoice = seededInvoices[0];
    return (
      <Field>
        <Wrap>
          <SectionHeader heading="One line, on purpose" />
          <Text size="small" tone="secondary" measure="reading" className="mb-9">
            The invoice shows structure without making a claim about price. A
            breakdown would mean inventing what ISV charges for, so there is one
            line and an illustrative amount. GST is shown because an Australian
            tax invoice shows it and a Business Manager notices immediately when
            it is missing.
          </Text>

          <div className="invoice max-w-2xl">
            <div className="invoice-head">
              <span>
                <Eyebrow>Invoice</Eyebrow>
                <Text as="span" size="h2" className="mt-1 block">
                  {invoice.number}
                </Text>
              </span>
              <span className="invoice-dates">
                <Text as="span" size="micro" tone="tertiary" className="block">
                  Issued {formatDateWithYear(invoice.issuedIso)}
                </Text>
                <Text as="span" size="micro" tone="tertiary" className="block">
                  Due {formatDateWithYear(invoice.dueIso)}
                </Text>
              </span>
            </div>

            <ul className="invoice-lines">
              {invoice.lines.map((line) => (
                <li key={line.id}>
                  <span className="min-w-0">
                    <Text as="span" size="small" className="block">
                      {line.description}
                    </Text>
                    <Text as="span" size="micro" tone="tertiary" className="block">
                      {line.note}
                    </Text>
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
                    {money(subtotal(invoice))}
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
                    {money(gst(invoice))}
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
                    {money(total(invoice))}
                  </Text>
                </dd>
              </div>
            </dl>
          </div>

          <Text size="micro" tone="tertiary" measure="reading" className="mt-5">
            Illustrative amounts for a fictional school. This prototype states
            no ISV fee or rate.
          </Text>
        </Wrap>
      </Field>
    );
  },
};

export const PayMethods: Story = {
  name: "Payment methods",
  render: () => (
    <Field tone="warm">
      <Wrap>
        <SectionHeader heading="Two paths, neither the default" />
        <Text size="small" tone="secondary" measure="reading" className="mb-9">
          A school pays a peak body by transfer after somebody approves it.
          Forcing that through a card form to record a payment that already
          happened is the kind of thing that makes a Business Manager stop using
          a portal. Selection is two borders rather than a colour fill — a
          selected card that changes ground colour reads as disabled about as
          often as it reads as chosen.
        </Text>

        <div className="pay-choice">
          <button type="button" className="pay-option" data-selected>
            <Text as="span" size="h3" className="block">
              Bank transfer
            </Text>
            <Text as="span" size="small" tone="secondary" className="mt-2 block">
              Pay from our school account, then record it here so the invoice
              closes.
            </Text>
          </button>
          <button type="button" className="pay-option">
            <Text as="span" size="h3" className="block">
              Card
            </Text>
            <Text as="span" size="small" tone="secondary" className="mt-2 block">
              Pay now on a school credit card. Nothing is charged in the
              prototype.
            </Text>
          </button>
        </div>
      </Wrap>
    </Field>
  ),
};
