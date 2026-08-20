"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  seededApplicants,
  seededJobs,
  type Applicant,
  type ApplicantStatus,
  type JobAd,
} from "@/data/jobs";
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

  /**
   * Employment and HR.
   *
   * The one area where the member changes something rather than reading it,
   * so the state has to survive navigation: post an ad on one screen, see it
   * in the list on the next, shortlist on a third. Kept here for the same
   * reason Ask ISV is — the pages are mounted per route and this is not.
   */
  jobs: JobAd[];
  applicants: Applicant[];
  getJob: (id: string) => JobAd | undefined;
  applicantsFor: (jobId: string) => Applicant[];
  postJob: (job: Omit<JobAd, "id" | "status" | "postedIso">) => JobAd;
  closeJob: (id: string) => void;
  reopenJob: (id: string) => void;
  setApplicantStatus: (id: string, status: ApplicantStatus) => void;
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
  const [jobs, setJobs] = useState<JobAd[]>([...seededJobs]);
  const [applicants, setApplicants] = useState<Applicant[]>([
    ...seededApplicants,
  ]);

  const getJob = useCallback(
    (id: string) => jobs.find((job) => job.id === id),
    [jobs],
  );

  /** Newest first. A business manager wants what just arrived. */
  const applicantsFor = useCallback(
    (jobId: string) =>
      applicants
        .filter((a) => a.jobId === jobId)
        .sort((a, b) => b.appliedIso.localeCompare(a.appliedIso)),
    [applicants],
  );

  const postJob = useCallback(
    (draft: Omit<JobAd, "id" | "status" | "postedIso">) => {
      const job: JobAd = {
        ...draft,
        id: `job-${Date.now()}`,
        status: "open",
        postedIso: new Date().toISOString().slice(0, 10),
      };
      setJobs((current) => [job, ...current]);
      return job;
    },
    [],
  );

  const closeJob = useCallback((id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setJobs((current) =>
      current.map((job) =>
        job.id === id ? { ...job, status: "closed", closedIso: today } : job,
      ),
    );
  }, []);

  // Closing an ad by accident is the obvious mistake in this flow, so it is
  // reversible rather than a confirmation dialogue nobody reads.
  const reopenJob = useCallback((id: string) => {
    setJobs((current) =>
      current.map((job) =>
        job.id === id ? { ...job, status: "open", closedIso: undefined } : job,
      ),
    );
  }, []);

  const setApplicantStatus = useCallback(
    (id: string, status: ApplicantStatus) => {
      setApplicants((current) =>
        current.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    },
    [],
  );

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
      jobs,
      applicants,
      getJob,
      applicantsFor,
      postJob,
      closeJob,
      reopenJob,
      setApplicantStatus,
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
      jobs,
      applicants,
      getJob,
      applicantsFor,
      postJob,
      closeJob,
      reopenJob,
      setApplicantStatus,
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
