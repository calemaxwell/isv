import type { Role } from "@/types";

/**
 * Membership actions waiting on the member.
 *
 * The distinction that matters: "What's changed" is ISV telling you
 * something. Alerts are ISV asking you for something. Only the second
 * belongs behind a count in the header, because only the second goes away
 * when you act on it.
 *
 * VOICE RULE, same as updates. Every alert describes an ISV process, never
 * a legal obligation. "Your membership renewal is open" is a fact about
 * ISV's calendar. "You must renew by March or lose registration" is advice
 * ISV has not authorised.
 *
 * All ILLUSTRATIVE.
 */

export type AlertKind = "action" | "message";

export interface MemberAlert {
  id: string;
  kind: AlertKind;
  title: string;
  detail: string;
  /** Copy for the button that resolves it */
  actionLabel: string;
  href: string;
  relevantTo: Role[];
  receivedIso: string;
  /** Actions are outstanding. Messages are read or unread. */
  outstanding: boolean;
  source: "ILLUSTRATIVE";
  sourceNote: string;
}

export const memberAlerts: MemberAlert[] = [
  {
    id: "alert-renewal",
    kind: "action",
    title: "Membership renewal is open",
    detail:
      "Ashwood Grange School's ISV membership is due for renewal. Confirm your school's details and nominated contacts.",
    actionLabel: "Review details",
    href: "#profile",
    relevantTo: ["principal", "business-manager"],
    receivedIso: "2026-08-14",
    outstanding: true,
    source: "ILLUSTRATIVE",
    sourceNote: "Describes an ISV membership process, not a legal obligation.",
  },
  {
    id: "alert-contacts",
    kind: "action",
    title: "Two staff contacts need confirming",
    detail:
      "ISV holds contact records for your school that have not been confirmed this year.",
    actionLabel: "Confirm contacts",
    href: "#profile",
    relevantTo: ["business-manager"],
    receivedIso: "2026-08-11",
    outstanding: true,
    source: "ILLUSTRATIVE",
    sourceNote: "Describes ISV record keeping.",
  },
  {
    id: "alert-survey",
    kind: "action",
    title: "School effectiveness survey window opens next month",
    detail:
      "Register your school's participation to take part in this year's round.",
    actionLabel: "Register interest",
    href: "#contact",
    relevantTo: ["principal"],
    receivedIso: "2026-08-08",
    outstanding: true,
    source: "ILLUSTRATIVE",
    sourceNote: "Describes an ISV survey programme.",
  },
  {
    id: "message-adviser",
    kind: "message",
    title: "An ISV adviser replied to your request",
    detail:
      "Your employment relations request has a response from the adviser assigned to it.",
    actionLabel: "Open request",
    href: "/requests/req-seed-001",
    relevantTo: ["principal"],
    receivedIso: "2026-08-16",
    outstanding: true,
    source: "ILLUSTRATIVE",
    sourceNote: "Describes activity on the seeded request.",
  },
  {
    id: "message-registration",
    kind: "message",
    title: "Your registration is confirmed",
    detail:
      "Two colleagues from your school are registered for the governance session.",
    actionLabel: "View registration",
    href: "#contact",
    relevantTo: ["principal", "business-manager"],
    receivedIso: "2026-08-05",
    outstanding: false,
    source: "ILLUSTRATIVE",
    sourceNote: "Describes an ISV registration confirmation.",
  },
];
