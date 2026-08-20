/**
 * Membership and invoices.
 *
 * NO FEE CLAIM. This is binding and it is the reason the file reads the way it
 * does. ISV's real membership pricing is not known to this build, so the
 * prototype states no rate, no per-student basis and no fee schedule. The
 * amounts below belong to a fictional school and are labelled ILLUSTRATIVE.
 * If asked in the room, the answer is that the figure is a placeholder.
 *
 * That constraint shapes the invoice too. One line — membership, for a period
 * — rather than a breakdown, because a breakdown would be inventing what ISV
 * charges for. The invoice shows structure, which is what the screen is
 * demonstrating, without making a claim about price.
 *
 * GST is shown because an Australian tax invoice shows it, and a Business
 * Manager notices immediately when it is missing.
 *
 * PRIOR YEARS CARRY NO VISIBLE AMOUNT. Three consecutive figures rising a few
 * per cent a year is a fee schedule and an implied escalation rate, whatever
 * the ILLUSTRATIVE label says — a Business Manager in the room reads it as
 * ISV's pricing trajectory. The history list renders status, period and how it
 * was paid, which is the whole job of a filing screen. The amounts held here
 * are deliberately unordered so no rate can be inferred from the source
 * either.
 */

export type InvoiceStatus = "outstanding" | "paid" | "overdue";

/** How the school paid. Both are offered; neither is the default. */
export type PaymentMethod = "eft" | "card";

export interface InvoiceLine {
  id: string;
  description: string;
  /** Context ISV already holds, shown as context and never as a rate */
  note?: string;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  /** The membership period the invoice covers */
  period: string;
  issuedIso: string;
  dueIso: string;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  /** Set once paid */
  paidIso?: string;
  paidBy?: PaymentMethod;
  /** Last four digits, or the EFT reference */
  paidReference?: string;
  source: "ILLUSTRATIVE";
}

const GST_RATE = 0.1;

export function subtotal(invoice: Invoice): number {
  return invoice.lines.reduce((sum, line) => sum + line.amount, 0);
}
export function gst(invoice: Invoice): number {
  return Math.round(subtotal(invoice) * GST_RATE * 100) / 100;
}
export function total(invoice: Invoice): number {
  return subtotal(invoice) + gst(invoice);
}

/**
 * Australian format, cents always shown.
 *
 * An invoice is a tax document and a Business Manager reconciles it against a
 * bank line, so 17,220 and 17,220.00 are not the same thing on the page.
 */
export function money(amount: number): string {
  return amount.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  });
}

export const seededInvoices: Invoice[] = [
  {
    id: "invoice-2027",
    number: "ISV-2027-04188",
    period: "1 January to 31 December 2027",
    issuedIso: "2026-08-04",
    dueIso: "2026-09-30",
    status: "outstanding",
    lines: [
      {
        id: "line-membership-2027",
        description: "Independent Schools Victoria membership",
        note: "1 January to 31 December 2027",
        amount: 17_220,
      },
    ],
    source: "ILLUSTRATIVE",
  },
  {
    id: "invoice-2026",
    number: "ISV-2026-04188",
    period: "1 January to 31 December 2026",
    issuedIso: "2025-08-05",
    dueIso: "2025-09-30",
    status: "paid",
    paidIso: "2025-09-11",
    paidBy: "eft",
    paidReference: "ASHWOOD-ISV-26",
    lines: [
      {
        id: "line-membership-2026",
        description: "Independent Schools Victoria membership",
        note: "1 January to 31 December 2026",
        amount: 16_940,
      },
    ],
    source: "ILLUSTRATIVE",
  },
  {
    id: "invoice-2025",
    number: "ISV-2025-04188",
    period: "1 January to 31 December 2025",
    issuedIso: "2024-08-06",
    dueIso: "2024-09-30",
    status: "paid",
    paidIso: "2024-09-24",
    paidBy: "eft",
    paidReference: "ASHWOOD-ISV-25",
    lines: [
      {
        id: "line-membership-2025",
        description: "Independent Schools Victoria membership",
        note: "1 January to 31 December 2025",
        amount: 17_040,
      },
    ],
    source: "ILLUSTRATIVE",
  },
];

/**
 * Remittance details for the EFT path.
 *
 * Fictional account numbers. The BSB is outside the allocated Australian
 * range so it cannot resolve to a real institution.
 */
export const remittance = {
  accountName: "Independent Schools Victoria",
  bsb: "999-999",
  account: "0000 0000",
  referenceHint: "Quote the invoice number as the payment reference.",
  email: "accounts@isv.example",
};

/** The membership period currently running. */
export const currentPeriod = {
  label: "2026 membership year",
  startIso: "2026-01-01",
  endIso: "2026-12-31",
  statusLabel: "Active",
};
