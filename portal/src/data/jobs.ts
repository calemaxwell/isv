/**
 * Employment and HR.
 *
 * The one area of the portal where a member is not reading or requesting but
 * running a process: post an ad, watch applications arrive, shortlist,
 * close. That makes it the strongest demonstration in the prototype, because
 * everything else is retrieval and this is work.
 *
 * VOICE RULE, as everywhere. A job ad is the school's own content and can say
 * whatever a school would say. Anything attributed to ISV describes what ISV
 * provides — a template, a guide, an adviser — and never what employment law
 * requires. ISV publishes employment resources; it does not give legal
 * advice through a portal, and this data must not imply otherwise.
 *
 * All ILLUSTRATIVE. Verify no applicant name collides with a real person
 * before the prototype is shown, same check as the personas and the roster.
 */

export type JobStatus = "open" | "closed" | "draft";
export type ApplicantStatus = "new" | "shortlisted" | "declined";

export type EmploymentType =
  | "Full time, ongoing"
  | "Full time, fixed term"
  | "Part time, ongoing"
  | "Part time, fixed term"
  | "Casual";

export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  /** What they do now. The single most useful line when scanning a list. */
  current: string;
  years: number;
  appliedIso: string;
  status: ApplicantStatus;
  /** Two or three lines. Enough to decide whether to open the application. */
  summary: string;
  /** Registration and clearances a school checks first */
  vitCurrent: boolean;
  rightToWork: boolean;
}

export interface JobAd {
  id: string;
  title: string;
  department: string;
  employmentType: EmploymentType;
  /** Published salary range. Optional, because not every school publishes. */
  salary?: string;
  location: string;
  status: JobStatus;
  postedIso: string;
  closesIso: string;
  /** Set when the ad is closed early */
  closedIso?: string;
  summary: string;
  about: string[];
  responsibilities: string[];
  requirements: string[];
  /** Who at the school fields questions about the role */
  contactName: string;
  contactEmail: string;
  source: "ILLUSTRATIVE";
  sourceNote: string;
}

const NOTE = "Fictional vacancy at the fictional demo school.";

export const seededJobs: JobAd[] = [
  {
    id: "job-classroom-teacher-maths",
    title: "Classroom Teacher — Mathematics",
    department: "Senior School",
    employmentType: "Full time, ongoing",
    salary: "$88,000 – $118,000",
    location: "Camberwell",
    status: "open",
    postedIso: "2026-08-04",
    closesIso: "2026-09-05",
    summary:
      "Teaching Mathematics across Years 9 to 12, including VCE Methods, from the start of the 2027 school year.",
    about: [
      "Ashwood Grange is a co-educational Independent school of 842 students from Prep to Year 12, in Camberwell.",
      "The Mathematics faculty is eight staff and works as a genuine team: shared planning, shared assessment, and a habit of sitting in on each other's classes.",
    ],
    responsibilities: [
      "Teach Mathematics across Years 9 to 12, including VCE Mathematical Methods",
      "Contribute to faculty planning and moderation",
      "Take a pastoral group",
      "Participate in the school's co-curricular programme",
    ],
    requirements: [
      "Current VIT registration",
      "A teaching qualification with a Mathematics method",
      "Experience with VCE Mathematical Methods, or readiness to take it on",
    ],
    contactName: "David Okonjo",
    contactEmail: "d.okonjo@ashwoodgrange.vic.edu.au",
    source: "ILLUSTRATIVE",
    sourceNote: NOTE,
  },
  {
    id: "job-learning-support",
    title: "Learning Support Officer",
    department: "Inclusion",
    employmentType: "Part time, ongoing",
    salary: "$62,000 – $71,000 pro rata",
    location: "Camberwell",
    status: "open",
    postedIso: "2026-07-28",
    closesIso: "2026-08-29",
    summary:
      "Three days a week supporting students with additional needs across the Junior and Middle School.",
    about: [
      "The Inclusion team works alongside classroom teachers rather than withdrawing students wherever it can be avoided.",
      "This role suits someone who is comfortable in a classroom, patient, and able to hold a relationship with a student over years rather than terms.",
    ],
    responsibilities: [
      "Support students with additional needs in class and in small groups",
      "Work with teachers on adjustments and documentation",
      "Contribute to individual learning plans",
    ],
    requirements: [
      "A current Working with Children Check",
      "Experience supporting students with additional needs",
      "Certificate IV in Education Support, or equivalent experience",
    ],
    contactName: "Chidi Nkemelu",
    contactEmail: "c.nkemelu@ashwoodgrange.vic.edu.au",
    source: "ILLUSTRATIVE",
    sourceNote: NOTE,
  },
  {
    id: "job-finance-officer",
    title: "Finance Officer",
    department: "Business Office",
    employmentType: "Full time, fixed term",
    location: "Camberwell",
    status: "closed",
    postedIso: "2026-05-12",
    closesIso: "2026-06-13",
    closedIso: "2026-06-13",
    summary:
      "Twelve month parental leave cover in the Business Office, covering accounts payable and fee administration.",
    about: [
      "The Business Office is six staff and handles finance, payroll, procurement and facilities administration for the school.",
    ],
    responsibilities: [
      "Accounts payable and reconciliation",
      "Fee administration and family correspondence",
      "Support the month end process",
    ],
    requirements: [
      "Experience in a finance or bookkeeping role",
      "A current Working with Children Check",
    ],
    contactName: "Linh Nguyen",
    contactEmail: "l.nguyen@ashwoodgrange.vic.edu.au",
    source: "ILLUSTRATIVE",
    sourceNote: NOTE,
  },
];

export const seededApplicants: Applicant[] = [
  // Mathematics
  {
    id: "app-1",
    jobId: "job-classroom-teacher-maths",
    name: "Rebecca Salinas",
    current: "Head of Mathematics, independent school, regional Victoria",
    years: 11,
    appliedIso: "2026-08-14",
    status: "new",
    summary:
      "Eleven years teaching, four leading a faculty. Has run VCE Methods to Year 12 for six consecutive years. Moving to Melbourne for family reasons.",
    vitCurrent: true,
    rightToWork: true,
  },
  {
    id: "app-2",
    jobId: "job-classroom-teacher-maths",
    name: "Tom Aldridge",
    current: "Classroom Teacher, government secondary college",
    years: 6,
    appliedIso: "2026-08-12",
    status: "shortlisted",
    summary:
      "Six years across Years 7 to 12. Has taught Methods once, as a shared class. Strong referee comments on classroom practice.",
    vitCurrent: true,
    rightToWork: true,
  },
  {
    id: "app-3",
    jobId: "job-classroom-teacher-maths",
    name: "Priya Raghavan",
    current: "Graduate teacher, completing final placement",
    years: 0,
    appliedIso: "2026-08-15",
    status: "new",
    summary:
      "Graduating this year with Mathematics and Physics methods. Placement report describes unusually strong subject knowledge for a graduate.",
    vitCurrent: false,
    rightToWork: true,
  },
  {
    id: "app-4",
    jobId: "job-classroom-teacher-maths",
    name: "Michael Sturt",
    current: "Data analyst, considering a career change",
    years: 0,
    appliedIso: "2026-08-08",
    status: "declined",
    summary:
      "No teaching qualification and no VIT registration. Has asked about pathways into teaching.",
    vitCurrent: false,
    rightToWork: true,
  },
  {
    id: "app-5",
    jobId: "job-classroom-teacher-maths",
    name: "Helen Brightwell",
    current: "Classroom Teacher, independent school, inner east",
    years: 9,
    appliedIso: "2026-08-16",
    status: "new",
    summary:
      "Nine years in one school, currently teaching Years 9 to 11. Looking for VCE Methods, which her current school cannot offer her.",
    vitCurrent: true,
    rightToWork: true,
  },
  // Learning Support
  {
    id: "app-6",
    jobId: "job-learning-support",
    name: "Anna Petrides",
    current: "Learning Support Officer, primary school",
    years: 5,
    appliedIso: "2026-08-11",
    status: "shortlisted",
    summary:
      "Five years in a similar role. Cert IV in Education Support. Specific experience with students on the autism spectrum.",
    vitCurrent: true,
    rightToWork: true,
  },
  {
    id: "app-7",
    jobId: "job-learning-support",
    name: "Joseph Kimani",
    current: "Integration Aide, government primary",
    years: 3,
    appliedIso: "2026-08-13",
    status: "new",
    summary:
      "Three years as an integration aide. Part way through Cert IV. Available the three days the role needs.",
    vitCurrent: true,
    rightToWork: true,
  },
  {
    id: "app-8",
    jobId: "job-learning-support",
    name: "Claire Nunn",
    current: "Casual relief teacher",
    years: 2,
    appliedIso: "2026-08-09",
    status: "new",
    summary:
      "Relief teaching across several schools since qualifying. Looking for something ongoing and part time.",
    vitCurrent: true,
    rightToWork: true,
  },
];

/**
 * ISV resources that belong to this area.
 *
 * These are ids from the resource library rather than a second copy of the
 * content, so a change in one place shows up in both.
 */
export const employmentResourceIds = [
  "resource-people-culture",
  "resource-child-safety",
  "resource-compliance-policies",
  "resource-isrecruit-overview",
];

/** The employment templates a school reaches for when hiring. */
export const hiringTemplates = [
  {
    id: "tpl-position-description",
    title: "Position description template",
    note: "Structure, selection criteria, and the sections a school forgets.",
  },
  {
    id: "tpl-employment-contract",
    title: "Employment contract templates",
    note: "Ongoing, fixed term and casual, for teaching and non-teaching staff.",
  },
  {
    id: "tpl-interview-guide",
    title: "Interview guide and scoring sheet",
    note: "Structured questions and a consistent way to record answers.",
  },
  {
    id: "tpl-referee-check",
    title: "Referee check form",
    note: "The questions worth asking, and a record of the answers.",
  },
  {
    id: "tpl-offer-letter",
    title: "Letter of offer",
    note: "With the appointment details a school needs to confirm in writing.",
  },
  {
    id: "tpl-induction",
    title: "New staff induction checklist",
    note: "First day, first week, first term.",
  },
];

/** Blank ad, so posting starts from a shape rather than an empty page. */
export function draftJob(id: string): JobAd {
  return {
    id,
    title: "",
    department: "",
    employmentType: "Full time, ongoing",
    location: "Camberwell",
    status: "draft",
    postedIso: new Date().toISOString().slice(0, 10),
    closesIso: "",
    summary: "",
    about: [],
    responsibilities: [],
    requirements: [],
    contactName: "",
    contactEmail: "",
    source: "ILLUSTRATIVE",
    sourceNote: NOTE,
  };
}
