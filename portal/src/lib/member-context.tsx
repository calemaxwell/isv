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
import {
  seededInvoices,
  type Invoice,
  type PaymentMethod,
} from "@/data/membership";
import { nextRequestIdentity, seededRequests } from "@/data/requests";
import {
  schoolRoster,
  type StaffAccess,
  type StaffMember,
} from "@/data/roster";
import {
  accountGroups,
  nominatedContacts as seededNominated,
  type NominatedContact,
} from "@/data/school-account";
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

  /**
   * The school account.
   *
   * Here for the same reason jobs are, and one reason more. The people list is
   * read by two areas — the school account writes it, event registration reads
   * it — so it cannot live in either page. Adding somebody under Our people
   * and finding them in the registration picker a moment later is the
   * demonstration the area exists to give, and it only works if the list is
   * held above both routes.
   */
  people: StaffMember[];
  addPerson: (person: {
    name: string;
    role: string;
    email: string;
    access: StaffAccess;
  }) => StaffMember;
  updatePerson: (id: string, patch: Partial<StaffMember>) => void;
  setPersonAccess: (id: string, access: StaffAccess) => void;
  departPerson: (id: string) => void;
  restorePerson: (id: string) => void;
  /** Nomination blocking a departure, if any. Drives the guard in the UI. */
  nominationFor: (staffId: string) => NominatedContact | undefined;

  nominated: NominatedContact[];
  setNominee: (contactId: string, staffId: string) => void;

  /** School fields, keyed by field id. Only what has been changed is held. */
  accountValues: Record<string, string>;
  accountConfirmed: Record<string, string>;
  setAccountValue: (fieldId: string, value: string) => void;
  confirmGroup: (groupId: string) => void;
  accountNeedsConfirming: number;

  invoices: Invoice[];
  outstanding: number;
  payInvoice: (id: string, method: PaymentMethod, reference: string) => void;
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
  const [people, setPeople] = useState<StaffMember[]>([...schoolRoster]);
  const [nominated, setNominated] = useState<NominatedContact[]>([
    ...seededNominated,
  ]);
  const [accountValues, setAccountValues] = useState<Record<string, string>>({});
  const [accountConfirmed, setAccountConfirmed] = useState<
    Record<string, string>
  >({});
  const [invoices, setInvoices] = useState<Invoice[]>([...seededInvoices]);

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

  /* ---------------- School account: people ---------------- */

  const addPerson = useCallback(
    (draft: {
      name: string;
      role: string;
      email: string;
      access: StaffAccess;
    }) => {
      const person: StaffMember = {
        id: `staff-${Date.now()}`,
        name: draft.name,
        role: draft.role,
        email: draft.email,
        alreadyRegisteredFor: [],
        // Invited, not active. Somebody who has been added has not yet signed
        // in, and a list that shows them as active is lying about the one
        // thing this screen is for.
        status: "invited",
        access: draft.access,
        startedIso: new Date().toISOString().slice(0, 10),
      };
      setPeople((current) => [person, ...current]);
      return person;
    },
    [],
  );

  const updatePerson = useCallback((id: string, patch: Partial<StaffMember>) => {
    setPeople((current) =>
      current.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  }, []);

  const setPersonAccess = useCallback((id: string, access: StaffAccess) => {
    setPeople((current) =>
      current.map((p) => (p.id === id ? { ...p, access } : p)),
    );
  }, []);

  /**
   * Departing somebody revokes their access in the same step.
   *
   * Two controls would produce exactly the bug the screen exists to fix — a
   * school marks a leaver as departed, feels finished, and ISV keeps writing
   * to her. If she has left, she cannot sign in.
   */
  const departPerson = useCallback((id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setPeople((current) =>
      current.map((p) =>
        p.id === id
          ? { ...p, status: "departed", departedIso: today, access: "none" }
          : p,
      ),
    );
  }, []);

  const restorePerson = useCallback((id: string) => {
    setPeople((current) =>
      current.map((p) =>
        p.id === id
          ? { ...p, status: "active", departedIso: undefined, access: "standard" }
          : p,
      ),
    );
  }, []);

  const nominationFor = useCallback(
    (staffId: string) => nominated.find((n) => n.staffId === staffId),
    [nominated],
  );

  const setNominee = useCallback((contactId: string, staffId: string) => {
    setNominated((current) =>
      current.map((n) => (n.id === contactId ? { ...n, staffId } : n)),
    );
  }, []);

  /* ---------------- School account: the record ---------------- */

  const setAccountValue = useCallback((fieldId: string, value: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setAccountValues((current) => ({ ...current, [fieldId]: value }));
    // Changing a field is confirming it. Asking somebody to type a new
    // enrolment figure and then tick a box to say they meant it is the kind
    // of thing that makes people stop maintaining a record.
    setAccountConfirmed((current) => ({ ...current, [fieldId]: today }));
  }, []);

  const confirmGroup = useCallback((groupId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const group = accountGroups.find((g) => g.id === groupId);
    if (!group) return;
    setAccountConfirmed((current) => {
      const next = { ...current };
      for (const field of group.fields) next[field.id] = today;
      return next;
    });
  }, []);

  /** How many fields are still sitting on an old confirmation. */
  const accountNeedsConfirming = useMemo(() => {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    return accountGroups
      .flatMap((group) => group.fields)
      .filter((field) => {
        const iso = accountConfirmed[field.id] ?? field.confirmedIso;
        return new Date(iso) < cutoff;
      }).length;
  }, [accountConfirmed]);

  /* ---------------- School account: membership ---------------- */

  const payInvoice = useCallback(
    (id: string, method: PaymentMethod, reference: string) => {
      const today = new Date().toISOString().slice(0, 10);
      setInvoices((current) =>
        current.map((inv) =>
          inv.id === id
            ? {
                ...inv,
                status: "paid",
                paidIso: today,
                paidBy: method,
                paidReference: reference,
              }
            : inv,
        ),
      );
    },
    [],
  );

  const outstanding = useMemo(
    () => invoices.filter((inv) => inv.status !== "paid").length,
    [invoices],
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
      people,
      addPerson,
      updatePerson,
      setPersonAccess,
      departPerson,
      restorePerson,
      nominationFor,
      nominated,
      setNominee,
      accountValues,
      accountConfirmed,
      setAccountValue,
      confirmGroup,
      accountNeedsConfirming,
      invoices,
      outstanding,
      payInvoice,
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
      people,
      addPerson,
      updatePerson,
      setPersonAccess,
      departPerson,
      restorePerson,
      nominationFor,
      nominated,
      setNominee,
      accountValues,
      accountConfirmed,
      setAccountValue,
      confirmGroup,
      accountNeedsConfirming,
      invoices,
      outstanding,
      payInvoice,
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
