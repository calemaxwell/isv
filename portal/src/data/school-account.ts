/**
 * What ISV holds about the school.
 *
 * The school record in `school.ts` is the short version every screen reads —
 * name, suburb, enrolment. This is the long version the school maintains: the
 * fields that go stale, and the people ISV writes to when it needs the school
 * rather than a person.
 *
 * VOICE RULE, binding here as everywhere. These are records ISV holds. None of
 * them is a legal obligation, and nothing in this file may imply one. A
 * nominated contact is a name ISV has on file so it knows who to write to, and
 * the roles below are deliberately administrative for that reason.
 *
 * All ILLUSTRATIVE. Fictional school, fictional people, fictional numbers.
 */

/** Fields go stale silently. This is what makes that visible. */
export type ConfirmState = "confirmed" | "needs-confirming";

export interface AccountField {
  id: string;
  label: string;
  value: string;
  /** Free text, a choice, or a number */
  kind: "text" | "select" | "number" | "email" | "tel";
  options?: string[];
  /** When the school last told ISV this was right */
  confirmedIso: string;
  help?: string;
}

export interface AccountGroup {
  id: string;
  heading: string;
  /** Why this group matters, in the school's own terms */
  note: string;
  fields: AccountField[];
}

/**
 * Twelve months. Long enough that confirming is an annual habit rather than
 * nagging, short enough that a Principal who left eighteen months ago is
 * flagged before the next renewal.
 */
const STALE_MONTHS = 12;

export function confirmState(
  confirmedIso: string,
  today = new Date(),
): ConfirmState {
  const then = new Date(confirmedIso);
  const months =
    (today.getFullYear() - then.getFullYear()) * 12 +
    (today.getMonth() - then.getMonth());
  return months >= STALE_MONTHS ? "needs-confirming" : "confirmed";
}

export const accountGroups: AccountGroup[] = [
  {
    id: "group-identity",
    heading: "The school",
    note: "How ISV refers to us in correspondence, in the member directory, and in the sector figures it publishes.",
    fields: [
      {
        id: "field-name",
        label: "School name",
        value: "Ashwood Grange School",
        kind: "text",
        confirmedIso: "2026-02-11",
      },
      {
        id: "field-abn",
        label: "ABN",
        value: "62 004 118 927",
        kind: "text",
        confirmedIso: "2026-02-11",
        help: "Used on our membership invoice.",
      },
      {
        id: "field-sector",
        label: "Type",
        value: "Independent, co-educational",
        kind: "select",
        options: [
          "Independent, co-educational",
          "Independent, girls",
          "Independent, boys",
        ],
        confirmedIso: "2026-02-11",
      },
      {
        id: "field-years",
        label: "Year levels",
        value: "Prep to Year 12",
        kind: "select",
        options: [
          "Prep to Year 6",
          "Year 7 to Year 12",
          "Prep to Year 12",
          "Early Learning to Year 12",
        ],
        confirmedIso: "2026-02-11",
      },
      {
        id: "field-affiliation",
        label: "Religious affiliation",
        value: "Non-denominational",
        kind: "select",
        options: [
          "Non-denominational",
          "Anglican",
          "Catholic",
          "Uniting Church",
          "Jewish",
          "Islamic",
          "Other",
        ],
        confirmedIso: "2025-03-04",
      },
    ],
  },
  {
    id: "group-where",
    heading: "Where we are",
    note: "Where ISV sends post, and the address it holds for us.",
    fields: [
      {
        id: "field-address",
        label: "Street address",
        value: "2 Hollybank Rise",
        kind: "text",
        confirmedIso: "2026-02-11",
      },
      {
        id: "field-suburb",
        label: "Suburb",
        value: "Camberwell",
        kind: "text",
        confirmedIso: "2026-02-11",
      },
      {
        id: "field-postcode",
        label: "Postcode",
        value: "3124",
        kind: "text",
        confirmedIso: "2026-02-11",
      },
      {
        id: "field-campuses",
        label: "Campuses",
        value: "2",
        kind: "number",
        confirmedIso: "2025-03-04",
        help: "Camberwell and Surrey Hills.",
      },
      {
        id: "field-phone",
        label: "Main phone",
        value: "03 5550 0100",
        kind: "tel",
        confirmedIso: "2026-02-11",
      },
      {
        id: "field-general-email",
        label: "General enquiries",
        value: "office@ashwoodgrange.vic.edu.au",
        kind: "email",
        confirmedIso: "2026-02-11",
      },
      {
        id: "field-website",
        label: "Website",
        value: "ashwoodgrange.vic.edu.au",
        kind: "text",
        confirmedIso: "2025-03-04",
      },
    ],
  },
  {
    id: "group-size",
    heading: "How big we are",
    note: "The figures ISV holds for us. They move every year, and nothing tells ISV unless we do.",
    fields: [
      {
        id: "field-enrolment",
        label: "Total enrolment",
        value: "842",
        kind: "number",
        confirmedIso: "2026-02-11",
      },
      {
        id: "field-staff-teaching",
        label: "Teaching staff",
        value: "94",
        kind: "number",
        confirmedIso: "2025-03-04",
      },
      {
        id: "field-staff-other",
        label: "Non-teaching staff",
        value: "58",
        kind: "number",
        confirmedIso: "2025-03-04",
      },
      {
        id: "field-boarding",
        label: "Boarding",
        value: "No",
        kind: "select",
        options: ["No", "Yes"],
        confirmedIso: "2026-02-11",
      },
    ],
  },
];

/* ============================================================
   Nominated contacts
   ============================================================ */

/**
 * The roles ISV holds a named person for.
 *
 * NOT SOURCED FROM ISV, so every one of them is deliberately administrative:
 * who to write to about membership, about a booking, about general
 * correspondence. An earlier draft had a child safety contact and a compliance
 * contact, which was wrong twice over. Neither is published by ISV, and in
 * Victoria both read as statutory nominations rather than as a name on file —
 * the portal would have been implying a school is required to appoint them.
 *
 * The set is still one of two things to confirm with ISV before the pitch. The
 * difference is that being wrong now costs a label, not a legal implication.
 */
export interface NominatedContact {
  id: string;
  role: string;
  /** What ISV uses this contact for, in the school's terms */
  purpose: string;
  staffId: string;
}

export const nominatedContacts: NominatedContact[] = [
  {
    id: "nominated-principal",
    role: "Principal",
    purpose: "Correspondence addressed to the head of the school.",
    staffId: "staff-ellery",
  },
  {
    id: "nominated-business",
    role: "Business manager",
    purpose: "Membership, invoices and anything to do with running the school.",
    staffId: "staff-okonjo",
  },
  {
    id: "nominated-learning",
    role: "Professional learning contact",
    purpose: "Bookings and session details for our staff.",
    staffId: "staff-tanaka",
  },
  {
    id: "nominated-comms",
    role: "Communications contact",
    purpose: "Where ISV's general correspondence goes.",
    staffId: "staff-abbott",
  },
];

/** Who last confirmed the whole record, and when. */
export const lastConfirmed = {
  byName: "David Okonjo",
  iso: "2026-02-11",
};
