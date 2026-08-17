/**
 * The data contract. Defined in DATA-SPEC.md section 4.
 *
 * Fixtures are authored as TypeScript modules using `satisfies` rather than
 * JSON. Same contract, but a malformed fixture fails `tsc` for real, which a
 * JSON import plus a cast does not. Logged in DECISIONS.md.
 */

export type Source = "RFP" | "PUBLIC" | "ILLUSTRATIVE";

export type Role = "principal" | "business-manager";

export interface Sourced {
  source: Source;
  sourceNote: string;
}

export type Category =
  | "governance-compliance-risk"
  | "people-culture"
  | "facilities-operations-finance"
  | "learning-wellbeing"
  | "vision-strategy"
  | "communications-relationships"
  | "general";

export interface School extends Sourced {
  id: string;
  name: string;
  suburb: string;
  state: string;
  sector: string;
  enrolment: number;
  membershipStatus: string;
  region: string;
  notionalSystemOfRecord: "Dynamics 365";
}

export interface CommunicationPreference {
  channel: string;
  subscribed: boolean;
  frequency: string;
}

export interface Member extends Sourced {
  id: string;
  role: Role;
  roleLabel: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  schoolId: string;
  interests: string[];
  communicationPreferences: CommunicationPreference[];
  notionalSystemOfRecord: "Dynamics 365";
}

export interface RequestField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio";
  required: boolean;
  prefillFrom?:
    | "member.fullName"
    | "member.email"
    | "member.phone"
    | "member.roleLabel"
    | "school.name";
  options?: string[];
  helpText?: string;
}

export interface Service extends Sourced {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string[];
  category: Category;
  relevantTo: Role[];
  requestable: boolean;
  contactEmail: string;
  contactPhone: string;
  /** Present only when requestable */
  includedInMembership?: boolean;
  inclusionNote?: string;
  deliveredBy?: string;
  nextStepNote?: string;
  requestFields?: RequestField[];
  /** Button label. Avoids deriving copy by string-matching the service name. */
  requestLabel?: string;
  /** Present only for isEducation products */
  externalLabel?: string;
  externalUrl?: string;
}

/**
 * Portal areas, not products. See data/areas.ts for why the isEducation
 * product names no longer appear on screen and where the lineage is kept.
 */
export type IsvSystem =
  | "area-employment"
  | "area-process"
  | "area-compliance"
  | "area-insights"
  | "area-learning"
  | "area-events"
  | "area-news"
  | "area-resources"
  | "area-isv";

export interface ContentItem extends Sourced {
  id: string;
  title: string;
  summary: string;
  type: "resource" | "news" | "event" | "learning" | "update";
  category: Category;
  relevantTo: Role[];
  interestTags: string[];
  publishedIso: string;
  recencyLabel: string;
  isvSystem: IsvSystem;
  externalHandoff?: "learning-platform" | "none";
  /** Required when type is "event" or "learning" */
  eventIso?: string;
  location?: string;
  format?: "Online" | "In person" | "Blended";
  /** Used to mark an event as near the member's school */
  region?: string;
}

export type PersonalisationCue =
  | "Recommended for you"
  | "Based on your role"
  | "Relevant to your school"
  | "Based on your interests";

export type ModuleItemType =
  | "header"
  | "content"
  | "service"
  | "request"
  | "nav"
  | "update"
  | "parents"
  | "empty";

export interface ModuleDef {
  id: string;
  heading: string;
  itemType: ModuleItemType;
  field: FieldTone;
  discoveryNote?: string;
  hasFilterBar: boolean;
  moreLabel?: string;
  /** Listing route the moreLabel opens */
  moreHref?: string;
  itemIds: string[];
}

export type FieldTone =
  | "paper"
  | "warm"
  | "sand"
  | "mist"
  | "clay"
  | "forest"
  | "ink";

export type RequestStatus =
  | "submitted"
  | "in-progress"
  | "awaiting-you"
  | "resolved";

export interface TimelineStep {
  label: string;
  iso: string;
  complete: boolean;
}

export interface ServiceRequest {
  id: string;
  reference: string;
  serviceId: string;
  submittedByMemberId: string;
  submittedIso: string;
  status: RequestStatus;
  statusLabel: string;
  nextStep: string;
  assignedTo: string;
  subject: string;
  timeline: TimelineStep[];
}

export interface AnswerSource {
  refId: string;
  refType: "content" | "service";
  title: string;
  /** Present only when refType is "content" */
  isvSystem?: IsvSystem;
  recencyLabel?: string;
}

export interface AskIsvEntry extends Sourced {
  id: string;
  question: string;
  matchTerms: string[];
  relevantTo: Role[];
  answer: string;
  sources: AnswerSource[];
  relatedResourceIds: string[];
  relatedServiceIds: string[];
  relatedLearningIds: string[];
  followUpIds: string[];
}

export interface NavItem {
  id: string;
  label: string;
  navigates: boolean;
  href?: string;
  note?: string;
}
