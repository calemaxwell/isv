/**
 * The people at the school.
 *
 * ONE LIST, TWO USES, and that is the point rather than a convenience.
 *
 * It began as the staff picker behind event registration, because registering
 * colleagues is the interesting half of that flow and a free-text field does
 * not demonstrate it. The school account now reads and writes the same array.
 * A person added under Our people is selectable in event registration in the
 * same session, and a person marked as departed disappears from it.
 *
 * That is the whole argument of the school account area. Two lists would have
 * been easier to build and would have quietly conceded the point — every
 * school already has the person in three systems, and the reason ISV writes to
 * a Deputy who left in June is that nobody owns the list. Here somebody does.
 *
 * Deliberately long. A school of this size has dozens of staff, so the picker
 * has to be searchable rather than a list you scroll and hope.
 *
 * All ILLUSTRATIVE. Verify no name collides with a real person before the
 * prototype is shown, same check as the two personas.
 */

/**
 * What a person can reach in the portal.
 *
 * Three levels, not a permission matrix. The question a Business Manager
 * actually asks is "can she see the compliance material" — a matrix answers a
 * question nobody asked and takes a minute of the demo to explain.
 */
export type StaffAccess =
  /** Everything, including the school account itself */
  | "full"
  /** Everything except the school account */
  | "standard"
  /** Receives ISV communications, cannot sign in */
  | "none";

/**
 * Departed people are retained rather than deleted. Past registrations and
 * request history reference them, and a data model that loses the past to stop
 * an email is the wrong trade.
 */
export type StaffStatus = "active" | "invited" | "departed";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  /** Someone already registered cannot be added twice */
  alreadyRegisteredFor: string[];
  status: StaffStatus;
  access: StaffAccess;
  startedIso: string;
  /** Set when someone leaves the school */
  departedIso?: string;
  /** Absent for anyone who has never signed in */
  lastActiveIso?: string;
}

export const schoolRoster: StaffMember[] = [
  {
    id: "staff-ellery",
    name: "Margaret Ellery",
    role: "Principal",
    email: "m.ellery@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "full",
    startedIso: "2019-01-14",
    lastActiveIso: "2026-08-19",
  },
  {
    id: "staff-okonjo",
    name: "David Okonjo",
    role: "Business Manager",
    email: "d.okonjo@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "full",
    startedIso: "2020-07-06",
    lastActiveIso: "2026-08-20",
  },
  {
    id: "staff-whitmore",
    name: "Priya Whitmore",
    role: "Deputy Principal",
    email: "p.whitmore@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: ["event-principals-breakfast"],
    status: "active",
    access: "full",
    startedIso: "2017-01-16",
    lastActiveIso: "2026-08-18",
  },
  {
    id: "staff-tanaka",
    name: "Ken Tanaka",
    role: "Head of Wellbeing",
    email: "k.tanaka@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2018-04-09",
    lastActiveIso: "2026-08-12",
  },
  {
    id: "staff-abbott",
    name: "Sarah Abbott",
    role: "Head of Compliance",
    email: "s.abbott@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2022-01-17",
    lastActiveIso: "2026-08-11",
  },
  {
    id: "staff-nguyen",
    name: "Linh Nguyen",
    role: "Finance Manager",
    email: "l.nguyen@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2021-09-13",
    lastActiveIso: "2026-08-19",
  },
  {
    id: "staff-oreilly",
    name: "Tom O'Reilly",
    role: "Facilities Manager",
    email: "t.oreilly@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "none",
    startedIso: "2014-02-10",
  },
  {
    id: "staff-mcallister",
    name: "Fiona McAllister",
    role: "Head of Junior School",
    email: "f.mcallister@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2015-01-19",
    lastActiveIso: "2026-08-04",
  },
  {
    id: "staff-devi",
    name: "Anjali Devi",
    role: "Head of Senior School",
    email: "a.devi@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2019-07-15",
    lastActiveIso: "2026-08-06",
  },
  {
    id: "staff-brackley",
    name: "Simon Brackley",
    role: "Director of Teaching and Learning",
    email: "s.brackley@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: ["event-islead-briefing"],
    status: "active",
    access: "standard",
    startedIso: "2016-01-18",
    lastActiveIso: "2026-07-30",
  },
  {
    id: "staff-halloran",
    name: "Bridget Halloran",
    role: "HR Manager",
    email: "b.halloran@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "full",
    startedIso: "2021-02-01",
    lastActiveIso: "2026-08-15",
  },
  {
    id: "staff-costa",
    name: "Marco Costa",
    role: "ICT Manager",
    email: "m.costa@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "none",
    startedIso: "2019-11-04",
  },
  {
    id: "staff-yildirim",
    name: "Elif Yildirim",
    role: "Registrar",
    email: "e.yildirim@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2022-06-20",
    lastActiveIso: "2026-08-07",
  },
  {
    id: "staff-paterson",
    name: "Grace Paterson",
    role: "Head of Curriculum",
    email: "g.paterson@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2021-01-18",
    lastActiveIso: "2026-07-24",
  },
  {
    id: "staff-nkemelu",
    name: "Chidi Nkemelu",
    role: "Head of Inclusion",
    email: "c.nkemelu@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2020-02-03",
    lastActiveIso: "2026-08-13",
  },
  {
    id: "staff-bartlett",
    name: "Helen Bartlett",
    role: "Payroll Officer",
    email: "h.bartlett@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "none",
    startedIso: "2021-04-19",
  },
  {
    id: "staff-rasmussen",
    name: "Erik Rasmussen",
    role: "Head of Sport",
    email: "e.rasmussen@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "none",
    startedIso: "2020-01-20",
  },
  {
    id: "staff-lam",
    name: "Wendy Lam",
    role: "Community Relations Manager",
    email: "w.lam@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2023-08-07",
    lastActiveIso: "2026-07-16",
  },
  {
    id: "staff-okafor",
    name: "Ngozi Okafor",
    role: "Head of Early Learning",
    email: "n.okafor@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2023-01-16",
    lastActiveIso: "2026-06-18",
  },
  {
    id: "staff-mcgrath",
    name: "Daniel McGrath",
    role: "Property and Risk Officer",
    email: "d.mcgrath@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "none",
    startedIso: "2022-08-22",
  },
  {
    id: "staff-sorensen",
    name: "Astrid Sorensen",
    role: "Head of Careers",
    email: "a.sorensen@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2024-01-15",
    lastActiveIso: "2026-05-21",
  },
  {
    id: "staff-ravel",
    name: "Josephine Ravel",
    role: "Enrolments Manager",
    email: "j.ravel@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "active",
    access: "standard",
    startedIso: "2022-03-14",
    lastActiveIso: "2026-08-05",
  },
  /* Left in May and still has portal access.
     The single most common thing wrong with a school's record, and the
     reason this area exists. Deliberately seeded so the walkthrough has
     something real to fix rather than a screen of tidy rows. */
  {
    id: "staff-doyle",
    name: "Catherine Doyle",
    role: "Head of Digital Learning",
    email: "c.doyle@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
    status: "departed",
    access: "standard",
    startedIso: "2018-01-15",
    departedIso: "2026-05-29",
    lastActiveIso: "2026-05-26",
  },
];

/** Anyone still at the school. What every other screen should be reading. */
export const activeStaff = () =>
  schoolRoster.filter((person) => person.status !== "departed");

/**
 * People who have left but still hold portal access.
 *
 * Surfaced on the school account as the thing waiting on you, because nobody
 * goes looking for it. It is the clearest demonstration in the area: one row,
 * one click, and ISV stops writing to someone who left in May.
 */
export const staleAccess = (people: StaffMember[]) =>
  people.filter(
    (person) => person.status === "departed" && person.access !== "none",
  );

/** Places left, so the flow has a real constraint to handle. */
export const eventCapacity: Record<string, number> = {
  "event-principals-breakfast": 4,
  "event-business-managers-forum": 12,
  "event-islead-briefing": 40,
  "event-registration-briefing": 60,
  "event-arts-learning-festival": 200,
  "learning-governance-essentials": 3,
  "learning-leading-improvement": 18,
  "learning-employment-relations": 25,
  "learning-financial-management": 20,
  "learning-child-safety-practice": 16,
  "learning-isv-programme": 999,
};

export function placesLeft(eventId: string): number {
  return eventCapacity[eventId] ?? 25;
}
