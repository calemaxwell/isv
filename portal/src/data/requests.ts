import type { ServiceRequest } from "@/types";

/**
 * DATA-SPEC.md section 11.
 *
 * One seeded request so the Principal landing page shows request status
 * before the demo creates a second one. Without it the module is empty on
 * first view and the capability reads as absent.
 *
 * The Business Manager has no requests on first load. That is correct and is
 * not padded. It also produces a genuine visible difference between views.
 */
export const seededRequests: ServiceRequest[] = [
  {
    id: "req-seed-001",
    reference: "ISV-2026-04817",
    serviceId: "service-employment-relations",
    submittedByMemberId: "member-principal",
    subject: "Advice on flexible working arrangements",
    submittedIso: "2026-08-06",
    status: "in-progress",
    statusLabel: "With ISV",
    nextStep: "An ISV adviser will contact you to confirm details",
    assignedTo: "An ISV adviser",
    timeline: [
      { label: "Submitted", iso: "2026-08-06", complete: true },
      { label: "Received by ISV", iso: "2026-08-07", complete: true },
      { label: "Adviser assigned", iso: "2026-08-09", complete: true },
      { label: "Response provided", iso: "", complete: false },
    ],
  },
] satisfies ServiceRequest[];

/** DATA-SPEC s11 generation rule. Nothing is invented at render time. */
let sessionCounter = 0;
const REFERENCE_BASE = 4818;

export function nextRequestIdentity(): { id: string; reference: string } {
  sessionCounter += 1;
  return {
    id: `req-session-${sessionCounter}`,
    reference: `ISV-2026-0${REFERENCE_BASE + sessionCounter - 1}`,
  };
}

export function resetRequestCounter(): void {
  sessionCounter = 0;
}
