import type { Role } from "@/types";

/**
 * Quicklinks.
 *
 * Tailored to the member, and deliberately short. A quicklinks module that
 * lists everything is a second navigation. This one answers "what do I open
 * most weeks", which is a different and much shorter question.
 *
 * In production these would be ordered by the member's own usage. Here the
 * ordering is fixed per role and that difference is worth naming in the
 * walkthrough rather than pretending it is behavioural.
 */
export interface Quicklink {
  id: string;
  label: string;
  note: string;
  href: string;
  relevantTo: Role[];
}

export const quicklinks: Quicklink[] = [
  {
    id: "ql-policies",
    label: "Model policies",
    note: "Compliance",
    href: "/resources",
    relevantTo: ["principal", "business-manager"],
  },
  {
    id: "ql-registration",
    label: "Registration and standards",
    note: "Compliance",
    href: "/resources",
    relevantTo: ["principal", "business-manager"],
  },
  {
    id: "ql-templates",
    label: "Employment templates",
    note: "Resource library",
    href: "/resources",
    relevantTo: ["business-manager"],
  },
  {
    id: "ql-reporting",
    label: "Reporting templates",
    note: "Resource library",
    href: "/resources",
    relevantTo: ["business-manager"],
  },
  {
    id: "ql-board",
    label: "Board and governance",
    note: "Resource library",
    href: "/resources",
    relevantTo: ["principal"],
  },
  {
    id: "ql-improvement",
    label: "School improvement planning",
    note: "Resource library",
    href: "/resources",
    relevantTo: ["principal"],
  },
  {
    id: "ql-learning",
    label: "Book professional learning",
    note: "Professional learning",
    href: "/events",
    relevantTo: ["principal", "business-manager"],
  },
  {
    id: "ql-vacancies",
    label: "Advertise a vacancy",
    note: "Careers",
    href: "/resources",
    relevantTo: ["business-manager"],
  },
  {
    id: "ql-insights",
    label: "School insights",
    note: "Benchmarking",
    href: "/resources",
    relevantTo: ["principal"],
  },
];
