/**
 * School staff roster.
 *
 * Needed because registering colleagues is the interesting half of event
 * registration and a free-text form does not demonstrate it. In production
 * this list comes from the school's member records in CRM, which is exactly
 * the "connected member context" claim the prototype is making. Here it is a
 * fixture, and the walkthrough should say so.
 *
 * Deliberately long. A school of this size has dozens of staff, so the
 * picker has to be searchable rather than a list you scroll and hope.
 *
 * All ILLUSTRATIVE. Verify no name collides with a real person before the
 * prototype is shown, same check as the two personas.
 */
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  /** Someone already registered cannot be added twice */
  alreadyRegisteredFor: string[];
}

export const schoolRoster: StaffMember[] = [
  {
    id: "staff-ellery",
    name: "Margaret Ellery",
    role: "Principal",
    email: "m.ellery@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-okonjo",
    name: "David Okonjo",
    role: "Business Manager",
    email: "d.okonjo@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-whitmore",
    name: "Priya Whitmore",
    role: "Deputy Principal",
    email: "p.whitmore@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: ["event-principals-breakfast"],
  },
  {
    id: "staff-tanaka",
    name: "Ken Tanaka",
    role: "Head of Wellbeing",
    email: "k.tanaka@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-abbott",
    name: "Sarah Abbott",
    role: "Head of Compliance",
    email: "s.abbott@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-nguyen",
    name: "Linh Nguyen",
    role: "Finance Manager",
    email: "l.nguyen@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-oreilly",
    name: "Tom O'Reilly",
    role: "Facilities Manager",
    email: "t.oreilly@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-mcallister",
    name: "Fiona McAllister",
    role: "Head of Junior School",
    email: "f.mcallister@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-devi",
    name: "Anjali Devi",
    role: "Head of Senior School",
    email: "a.devi@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-brackley",
    name: "Simon Brackley",
    role: "Director of Teaching and Learning",
    email: "s.brackley@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: ["event-islead-briefing"],
  },
  {
    id: "staff-halloran",
    name: "Bridget Halloran",
    role: "HR Manager",
    email: "b.halloran@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-costa",
    name: "Marco Costa",
    role: "ICT Manager",
    email: "m.costa@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-yildirim",
    name: "Elif Yildirim",
    role: "Registrar",
    email: "e.yildirim@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-paterson",
    name: "Grace Paterson",
    role: "Head of Curriculum",
    email: "g.paterson@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-nkemelu",
    name: "Chidi Nkemelu",
    role: "Head of Inclusion",
    email: "c.nkemelu@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-bartlett",
    name: "Helen Bartlett",
    role: "Payroll Officer",
    email: "h.bartlett@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-rasmussen",
    name: "Erik Rasmussen",
    role: "Head of Sport",
    email: "e.rasmussen@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-lam",
    name: "Wendy Lam",
    role: "Community Relations Manager",
    email: "w.lam@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-okafor",
    name: "Ngozi Okafor",
    role: "Head of Early Learning",
    email: "n.okafor@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-mcgrath",
    name: "Daniel McGrath",
    role: "Property and Risk Officer",
    email: "d.mcgrath@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-sorensen",
    name: "Astrid Sorensen",
    role: "Head of Careers",
    email: "a.sorensen@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
  {
    id: "staff-ravel",
    name: "Josephine Ravel",
    role: "Enrolments Manager",
    email: "j.ravel@ashwoodgrange.vic.edu.au",
    alreadyRegisteredFor: [],
  },
];

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
