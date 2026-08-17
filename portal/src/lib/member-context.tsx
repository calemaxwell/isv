"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { nextRequestIdentity, seededRequests } from "@/data/requests";
import { getMember, getSchool } from "@/lib/selectors";
import type { Member, Role, School, Service, ServiceRequest } from "@/types";

interface MemberContextValue {
  role: Role;
  member: Member;
  school: School;
  requests: ServiceRequest[];
  setRole: (role: Role) => void;
  submitRequest: (service: Service, subject: string) => ServiceRequest;
  getRequest: (id: string) => ServiceRequest | undefined;
  /** Bumped on every role switch so modules re-run their entry animation */
  switchToken: number;
  askOpen: boolean;
  setAskOpen: (open: boolean) => void;
  /**
   * Ask ISV state lives here rather than in the overlay, because the overlay
   * is mounted per route. Kept in the provider it survives navigation, which
   * is what PRD s10 means by "retained for the session".
   * All of it is cleared on role switch.
   */
  lastQuery: string;
  askEntryId: string | null;
  setAskResult: (query: string, entryId: string | null) => void;
  /** Panels are opened from the header and from the navigation module */
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  contactOpen: boolean;
  setContactOpen: (open: boolean) => void;
  alertsOpen: boolean;
  setAlertsOpen: (open: boolean) => void;
  /** Alerts the member has actioned this session */
  resolvedAlerts: string[];
  resolveAlert: (id: string) => void;
}

const MemberContext = createContext<MemberContextValue | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("principal");
  const [requests, setRequests] = useState<ServiceRequest[]>([
    ...seededRequests,
  ]);
  const [switchToken, setSwitchToken] = useState(0);
  const [askOpen, setAskOpen] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [askEntryId, setAskEntryId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([]);

  const resolveAlert = useCallback((id: string) => {
    setResolvedAlerts((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }, []);

  const setAskResult = useCallback((query: string, entryId: string | null) => {
    setLastQuery(query);
    setAskEntryId(entryId);
  }, []);

  const member = useMemo(() => getMember(role), [role]);
  const school = useMemo(() => getSchool(), []);

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
    setSwitchToken((t) => t + 1);
    // PRD s10: without this, switching persona and reopening the overlay can
    // show a member an answer the script says is not available to their role.
    setLastQuery("");
    setAskEntryId(null);
  }, []);

  const submitRequest = useCallback(
    (service: Service, subject: string) => {
      const { id, reference } = nextRequestIdentity();
      const today = new Date().toISOString().slice(0, 10);

      const created: ServiceRequest = {
        id,
        reference,
        serviceId: service.id,
        submittedByMemberId: member.id,
        subject,
        submittedIso: today,
        status: "submitted",
        statusLabel: "Received by ISV",
        // Derived from the service record. Nothing invented at render time.
        nextStep: service.nextStepNote ?? "An ISV adviser will be in touch",
        assignedTo: service.deliveredBy ?? "An ISV adviser",
        timeline: [
          { label: "Submitted", iso: today, complete: true },
          { label: "Received by ISV", iso: today, complete: true },
          { label: "Adviser assigned", iso: "", complete: false },
          { label: "Response provided", iso: "", complete: false },
        ],
      };

      setRequests((current) => [created, ...current]);
      return created;
    },
    [member.id],
  );

  const getRequest = useCallback(
    (id: string) => requests.find((r) => r.id === id || r.reference === id),
    [requests],
  );

  const value = useMemo<MemberContextValue>(
    () => ({
      role,
      member,
      school,
      requests,
      setRole,
      submitRequest,
      getRequest,
      switchToken,
      askOpen,
      setAskOpen,
      lastQuery,
      askEntryId,
      setAskResult,
      profileOpen,
      setProfileOpen,
      contactOpen,
      setContactOpen,
      alertsOpen,
      setAlertsOpen,
      resolvedAlerts,
      resolveAlert,
    }),
    [
      role,
      member,
      school,
      requests,
      setRole,
      submitRequest,
      getRequest,
      switchToken,
      askOpen,
      lastQuery,
      askEntryId,
      setAskResult,
      profileOpen,
      contactOpen,
      alertsOpen,
      resolvedAlerts,
      resolveAlert,
    ],
  );

  return (
    <MemberContext.Provider value={value}>{children}</MemberContext.Provider>
  );
}

export function useMember(): MemberContextValue {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMember must be used inside MemberProvider");
  }
  return context;
}
