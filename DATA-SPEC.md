# ISV Member Portal Prototype — Mock Data Contract

**Version:** 1.3
**Status:** Draft for approval
**Companion to:** `PRD.md` v2.1
**Implemented by:** `portal/`
**Date:** 17 August 2026

---

## 1. Why this document exists

The brief says "do not invent member data" and "do not invent ISV services". The prototype has no back end and must run on mocked data. Those two facts collide unless the mock data is specified up front and traced to a source.

This document is that specification. It is the single source of truth for every piece of content in the prototype. A build agent should be able to work from this file alone and produce fixtures that survive scrutiny from someone who has read the RFP.

**Nothing may be added to the prototype that is not defined here.** If the build needs a field or a record that this document does not contain, that is a change request against this document, not an improvisation in code.

---

## 2. Source classification

Every record carries a `source` field. There are three permitted values and no others.

| Value | Meaning | Rule |
|-------|---------|------|
| `RFP` | Traceable to the ISV RFP, vendor briefing, or the consolidated Q&A | Cite the section in `sourceNote` |
| `PUBLIC` | Traceable to ISV's published website at `is.vic.edu.au` | Cite the page in `sourceNote` |
| `ILLUSTRATIVE` | A plausible example, invented for the prototype | Must not assert an ISV service, policy, position or commitment. Names, dates, identifiers and quantities only |

**The test for `ILLUSTRATIVE`.** If ISV read the record and said "we don't do that", it fails. If they said "that's not our exact wording but yes, roughly", it passes.

**Classification discipline.** A record is classified by what it asserts, not by what it is adjacent to. isLEAD being a published ISV product does not make an invented isLEAD briefing event `PUBLIC`. This is the most common way source integrity quietly fails.

### Pre-build verification

Four checks before fixtures are written. All are cheap and all prevent an avoidable moment in the room.

1. **School name collision.** Confirm the fictional school named below does not match a real ISV member school. If it does, change it.
2. **Person name collision.** Confirm no persona name matches a known ISV staff member or a Principal at a Victorian independent school.
3. **Publication dates.** Read the real publication dates for N1 to N4 from ISV's site. Do not invent them. See section 9.
4. **Requestable services.** Verify services 1 and 2 against the actual RFP text before authoring. See section 7.

---

## 3. File structure

```
/src
  /types
    index.ts            Type definitions. The contract.
  /data
    member.json         The two personas
    school.json         Shared school context
    services.json       ISV services
    resources.json      Resources (R1–R8)
    news.json           News and updates (N1–N4)
    events.json         Events (E4, E5)
    learning.json       Professional learning (E1, E2, E3)
    requests.json       Seeded service request
    ask-isv.json        Scripted questions and answers
    navigation.json     Navigation tree
  /lib
    selectors.ts        All role-based filtering and ordering
    matching.ts         Ask ISV keyword matching
    member-context.tsx  React context provider
```

`events.json` and `learning.json` hold the same `ContentItem` type and differ only by the `type` discriminator. The split exists so the two modules read independently in the selectors.

**Rule.** Fixtures are imported and typed at module load. A fixture that does not satisfy its type fails `tsc`. This is the enforcement mechanism, not a convention.

**Rule.** All role-based logic lives in `selectors.ts`. No component filters by role.

---

## 4. Type definitions

```ts
export type Source = 'RFP' | 'PUBLIC' | 'ILLUSTRATIVE';
export type Role = 'principal' | 'business-manager';

export interface Sourced {
  source: Source;
  sourceNote: string;
}

export interface School extends Sourced {
  id: string;
  name: string;
  suburb: string;
  state: string;
  sector: string;
  enrolment: number;
  membershipStatus: string;
  notionalSystemOfRecord: 'Dynamics 365';
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
  communicationPreferences: {
    channel: string;
    subscribed: boolean;
    frequency: string;
  }[];
  notionalSystemOfRecord: 'Dynamics 365';
}

export interface Service extends Sourced {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  category: Category;
  relevantTo: Role[];
  requestable: boolean;
  contactEmail: string;
  contactPhone: string;
  // Present only when requestable is true
  includedInMembership?: boolean;
  inclusionNote?: string;
  deliveredBy?: string;
  nextStepNote?: string;
  requestFields?: RequestField[];
  // Present only when the service is an isEducation product
  externalUrl?: string;
}

export type Category =
  | 'governance-compliance-risk'
  | 'people-culture'
  | 'facilities-operations-finance'
  | 'learning-wellbeing'
  | 'vision-strategy'
  | 'communications-relationships'
  | 'general';

export interface RequestField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'radio';
  required: boolean;
  prefillFrom?: 'member.firstName' | 'member.lastName' | 'member.email'
    | 'member.phone' | 'member.roleLabel' | 'school.name';
  options?: string[];
  helpText?: string;
}

export interface ContentItem extends Sourced {
  id: string;
  title: string;
  summary: string;
  type: 'resource' | 'news' | 'event' | 'learning';
  category: Category;
  relevantTo: Role[];
  interestTags: string[];
  publishedIso: string;
  recencyLabel: string;
  isvSystem: 'isConnect' | 'isComply' | 'isLearn' | 'isAnalyse'
    | 'isLEAD' | 'isRecruit' | 'ISV website';
  externalHandoff?: 'learning-platform' | 'none';
  // Required when type is 'event'
  eventIso?: string;
  location?: string;
}

export type PersonalisationCue =
  | 'Recommended for you'
  | 'Based on your role'
  | 'Relevant to your school'
  | 'Based on your interests';

export interface Module {
  id: string;
  heading: string;
  itemType: 'header' | 'content' | 'service' | 'request' | 'nav';
  cue?: PersonalisationCue;
  discoveryNote?: string;
  hasFilterBar: boolean;
  itemIds: string[];
}

export interface ServiceRequest {
  id: string;
  reference: string;
  serviceId: string;
  submittedByMemberId: string;
  submittedIso: string;
  status: 'submitted' | 'in-progress' | 'awaiting-you' | 'resolved';
  statusLabel: string;
  nextStep: string;
  assignedTo: string;
  timeline: { label: string; iso: string; complete: boolean }[];
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

export interface AnswerSource {
  refId: string;
  refType: 'content' | 'service';
  title: string;
  // Present only when refType is 'content'
  isvSystem?: ContentItem['isvSystem'];
  recencyLabel?: string;
}

export interface NavItem {
  id: string;
  label: string;
  navigates: boolean;
  discoveryNote?: string;
}
```

`PersonalisationCue` sits on `Module`, not on `ContentItem`. The cue describes why a whole module is present. Cueing individual cards produces the promotional density the brief warns against.

A source with `refType: 'service'` carries no `isvSystem` or `recencyLabel`, because services are not dated content. `SourceCitation` renders the label **"ISV service"** in place of the system and recency line. Service 2 is not an isEducation product and has no valid `isvSystem` value at all, which is why these fields are optional rather than defaulted.

`interestTags` join content to `Member.interests`. Values must match the interest strings in section 6 exactly. This field is what makes the "Based on your interests" cue honest rather than decorative, and a module carrying that cue selects on it.

---

## 5. School

One school, shared by both personas. This is deliberate: it isolates the personalisation demonstration to role.

| Field | Value | Source |
|-------|-------|--------|
| `name` | Ashwood Grange School | `ILLUSTRATIVE` |
| `suburb` | Camberwell | `ILLUSTRATIVE` |
| `state` | VIC | `ILLUSTRATIVE` |
| `sector` | Independent, co-educational, Prep to Year 12 | `ILLUSTRATIVE` |
| `enrolment` | 842 | `ILLUSTRATIVE` |
| `membershipStatus` | ISV Member School | `PUBLIC` (ISV uses "Member School" throughout its site) |
| `notionalSystemOfRecord` | Dynamics 365 | `RFP` s9 |

There is no relationship manager field. ISV has not published that such a role exists, and inventing one asserts a service model.

Verify the school name against ISV's member school list before build.

---

## 6. Members

Two records. Same school, same component tree, different priorities.

### Principal

| Field | Value | Source |
|-------|-------|--------|
| `role` | `principal` | `RFP` s4 |
| `roleLabel` | Principal | `RFP` s4 |
| `firstName` / `lastName` | Margaret Ellery | `ILLUSTRATIVE` |
| `email` | m.ellery@ashwoodgrange.vic.edu.au | `ILLUSTRATIVE` |
| `phone` | 03 5550 0142 | `ILLUSTRATIVE` |
| `interests` | School improvement, leadership development, advocacy, strategic planning | `RFP` s4 Principal priority areas |

### Business Manager

| Field | Value | Source |
|-------|-------|--------|
| `role` | `business-manager` | `RFP` s4 |
| `roleLabel` | Business Manager | `RFP` s4 |
| `firstName` / `lastName` | David Okonjo | `ILLUSTRATIVE` |
| `email` | d.okonjo@ashwoodgrange.vic.edu.au | `ILLUSTRATIVE` |
| `phone` | 03 5550 0173 | `ILLUSTRATIVE` |
| `interests` | Employment relations, compliance reporting, school operations, funding | `RFP` s4 Business Manager priority areas |

Phone numbers use the Australian fiction-reserved range. A literal `XXXX` placeholder pre-fills a visible field during Act 3 and fails QA S1.

### Communication preferences

Identical structure for both, read-only. Four rows: ISV eCommunications (subscribed, weekly), Professional learning updates (subscribed, monthly), Advocacy and policy updates (Principal subscribed, Business Manager not), Event invitations (subscribed, as scheduled). All `ILLUSTRATIVE`. ISV's public site confirms an eCommunications subscription exists, which grounds the concept but not the specific rows.

---

## 7. Services

Eight services. Six trace directly to ISV's published isEducation suite. Two are requestable advice pathways and carry weaker grounding, which is disclosed here rather than glossed.

`Category` values are ISV's own isConnect navigational areas, taken verbatim from the published product page. Using ISV's real taxonomy rather than a constructed one is a meaningful credibility signal.

| # | Service | `slug` | Category | Relevant to | Requestable | Source |
|---|---------|--------|----------|-------------|-------------|--------|
| 1 | Compliance support from ISV | `compliance-support` | governance-compliance-risk | Both | Yes | `PUBLIC` /iscomply/ (isComply includes "support from our industry experts"), reinforced by `RFP` s4 |
| 2 | Employment relations support from ISV | `employment-relations-support` | people-culture | Both | Yes | `ILLUSTRATIVE`, informed by `RFP` s4 |
| 3 | isComply | `iscomply` | governance-compliance-risk | Both | No | `PUBLIC` /products/ |
| 4 | isConnect | `isconnect` | facilities-operations-finance | Both | No | `PUBLIC` /products/ |
| 5 | isLearn | `islearn` | learning-wellbeing | Both | No | `PUBLIC` /products/ |
| 6 | isAnalyse | `isanalyse` | vision-strategy | Principal | No | `PUBLIC` /products/ |
| 7 | isLEAD School Effectiveness Surveys | `islead` | vision-strategy | Principal | No | `PUBLIC` /products/ |
| 8 | isRecruit | `isrecruit` | people-culture | Business Manager | No | `PUBLIC` /products/ |

### Honest note on services 1 and 2

The RFP names employment relations, finance, governance, funding and compliance as **persona priority areas**. A priority area is not a service. Service 1 has partial public grounding through isComply's published reference to expert support. Service 2 does not, and is marked `ILLUSTRATIVE`.

**Two consequences, both mandatory.**

1. Verify both against the RFP text before fixtures are authored. If the RFP names these services, re-source them and this note comes out.
2. Until then, the walkthrough describes them as *a proposed request pathway into ISV's existing support*, not as existing named ISV services. Do not let the demo imply otherwise.

Services 3 to 8 are discovery and access surfaces only. They use ISV's published product descriptions for `summary` and `description`, the general ISV contact details for `contactEmail` and `contactPhone`, and carry `externalUrl`. They have no `deliveredBy`, `inclusionNote` or `requestFields`, which is why those fields are optional on the type.

### Service 1 detail

This is the demo service. It carries the Act 3 journey.

| Field | Value |
|-------|-------|
| `summary` | Request guidance from ISV on compliance obligations, governance practice and regulatory requirements affecting your school. |
| `description` | Two to three sentences expanding the summary. Must describe what ISV provides, never what a regulation requires. Bound by the Voice rule in section 13 |
| `includedInMembership` | `true` |
| `inclusionNote` | Included in your school's ISV membership |
| `deliveredBy` | An ISV adviser |
| `nextStepNote` | An ISV adviser will be in touch |
| `contactEmail` | enquiries@is.vic.edu.au (`PUBLIC`) |
| `contactPhone` | 03 9825 7200 (`PUBLIC`) |

**There is no response time field.** ISV has not published one. "Within two business days" is the kind of small fabrication that costs credibility out of all proportion to what it adds. `deliveredBy` reads "An ISV adviser" rather than naming a team, because ISV's team structure is not published.

**Request fields**

| Field | Type | Required | Prefill |
|-------|------|----------|---------|
| Your name | text | Yes | `member.firstName` + `member.lastName` |
| Your role | text | Yes | `member.roleLabel` |
| School | text | Yes | `school.name` |
| Email | text | Yes | `member.email` |
| Phone | text | No | `member.phone` |
| What area does this relate to | select | Yes | Options: Child safety, School registration, Governance and board practice, Student wellbeing, Staff employment, Other |
| Describe what you need help with | textarea | Yes | Help text: "Include any relevant dates or deadlines" |
| How urgent is this | radio | Yes | Options: Within a week, Within a month, No fixed deadline |

Pre-filled fields render as populated and editable, with a quiet inline note reading "From your ISV member profile". This is the moment that proves connected member context, so make it visible. Do not name Dynamics.

### Service 2 detail

Service 2 is requestable, is the lead service card on the Business Manager landing page, and is the subject of the seeded request. It needs the same detail as Service 1 or those three surfaces break.

| Field | Value |
|-------|-------|
| `summary` | Request advice from ISV on employment matters affecting your school, including workplace policy and staff employment practice. |
| `description` | Two to three sentences expanding the summary, bound by the Voice rule in section 13 |
| `includedInMembership` | `true` |
| `inclusionNote` | Included in your school's ISV membership |
| `deliveredBy` | An ISV adviser |
| `nextStepNote` | An ISV adviser will be in touch |
| `contactEmail` | enquiries@is.vic.edu.au (`PUBLIC`) |
| `contactPhone` | 03 9825 7200 (`PUBLIC`) |
| `requestFields` | Identical to Service 1, except the "What area does this relate to" options become: Staff employment, Workplace policy, Enterprise agreement, Recruitment, Other |

Service 2 remains `ILLUSTRATIVE`. Specifying it fully makes it buildable. It does not make it real, and the walkthrough framing in the note above still applies.

---

## 8. Resources

Eight items. Each maps to a real ISV content area.

| # | Title | System | Category | Relevant to | Source |
|---|-------|--------|----------|-------------|--------|
| R1 | Compliance policies for Member Schools | ISV website | governance-compliance-risk | Both | `PUBLIC` (published, in partnership with Russell Kennedy) |
| R2 | Child safety policy templates and guidance | isComply | governance-compliance-risk | Both | `PUBLIC` (isComply covers care, safety and welfare of students) |
| R3 | School registration and VRQA minimum standards | isComply | governance-compliance-risk | Both | `PUBLIC` (isComply is structured around VRQA minimum standards) |
| R4 | Governance, compliance and risk resources | isConnect | governance-compliance-risk | Both | `PUBLIC` (isConnect navigational area) |
| R5 | People and culture policies and templates | isConnect | people-culture | Both | `PUBLIC` (isConnect navigational area) |
| R6 | Vision and strategy planning resources | isConnect | vision-strategy | Principal | `PUBLIC` (isConnect navigational area) |
| R7 | Learning and wellbeing resources | isConnect | learning-wellbeing | Both | `PUBLIC` (isConnect navigational area) |
| R8 | Careers and employment hub overview | isRecruit | people-culture | Business Manager | `PUBLIC` /products/ |

R5 is available to both roles. It is a source on A6, which both personas can reach, and scoping it to one role would leave a Principal with a single source there, below the two-source minimum. A Principal also plainly cares about employment policy.

`summary` describes the resource area in one sentence. It must not assert an ISV position, a policy requirement or a specific piece of guidance. Describe what the area contains, not what it says.

`publishedIso` and `recencyLabel`: these are ISV product areas rather than dated articles. Set `recencyLabel` to "Maintained by ISV" for all eight and set `publishedIso` to the fixture authoring date. Do not invent update dates for content ISV can check.

`interestTags` is `[]` for all eight. Resources are selected by role and category, never by interest.

---

## 9. News and updates

Four items, all real ISV published content. Use ISV's own headlines close to verbatim. This is the cheapest credibility available.

| # | Title | `isvSystem` | Category | Relevant to | Source |
|---|-------|-------------|----------|-------------|--------|
| N1 | Term 3 priorities for school business managers | ISV website | general | Business Manager | `PUBLIC` (ISV Perspectives blog) |
| N2 | Strengthening school improvement through evidence, voice and contemporary research | ISV website | general | Principal | `PUBLIC` (ISV Perspectives blog) |
| N3 | Inside Our Schools: Berengarra School | ISV website | general | Both | `PUBLIC` |
| N4 | Helping children navigate a complex world | ISV website | general | Both | `PUBLIC` (ISV Perspectives blog) |

**Dates.** Read the real publication date for each from ISV's site at fixture authoring time and set `publishedIso` accordingly. Derive `recencyLabel` from that date. These are real posts on a public site, so an invented date is checkable and wrong.

`summary` uses the real standfirst or opening sentence where one exists. Do not write a new summary for a real ISV article.

`interestTags` is `[]` for all four.

---

## 10. Events and professional learning

| # | Title | Type | File | `isvSystem` | Category | Relevant to | `interestTags` | Handoff | Source |
|---|-------|------|------|-------------|----------|-------------|----------------|---------|--------|
| E1 | ISV professional learning programme | learning | learning.json | ISV website | learning-wellbeing | Both | leadership development, school operations | `learning-platform` | `PUBLIC` (/learning-and-development/) |
| E2 | Governance essentials for school leaders | learning | learning.json | isLearn | governance-compliance-risk | Both | leadership development, school improvement | `learning-platform` | `ILLUSTRATIVE` |
| E3 | Employment relations update for business managers | learning | learning.json | isLearn | people-culture | Business Manager | employment relations | `learning-platform` | `ILLUSTRATIVE` |
| E4 | Arts Learning Festival | event | events.json | ISV website | general | Both | — | `none` | `PUBLIC` |
| E5 | isLEAD School Effectiveness Surveys briefing | event | events.json | isLEAD | vision-strategy | Principal | school improvement | `none` | `ILLUSTRATIVE` |

E1 drops the "Term 3" framing, which was an addition to ISV's real page title. Its `isvSystem` is `ISV website`, not isLearn: ISV runs a top-level learning and development programme separately from the isLearn product, and conflating them is the exact error A4's answer copy is written to avoid.

E5 is `ILLUSTRATIVE`. isLEAD is a published product, but a briefing event for it is invented.

E4 is available to both roles. Without this the Business Manager's events module renders empty.

**`interestTags`** must match the interest strings in section 6 exactly, lowercased. These values are what drive the "Based on your interests" modules in section 14. All resources and news items carry `interestTags: []`.

**Dates.** E4 is real ISV content: read its real event date and location from ISV's site, and set `publishedIso`, `eventIso` and `location` accordingly. E1 likewise for `publishedIso`. E2, E3 and E5 are `ILLUSTRATIVE`, so set `publishedIso` to the fixture authoring date, `eventIso` to a date four to eight weeks ahead of the demo, `location` to "Online" for E5, and `recencyLabel` to "Upcoming". `eventIso` and `location` are required whenever `type` is `event`.

**Summaries.** E1 and E4 use ISV's real published description. E2, E3 and E5 use a one-sentence `ILLUSTRATIVE` summary that describes the session without asserting an ISV position or a curriculum.

Items with `externalHandoff: 'learning-platform'` display a quiet indicator on their register action reading **"Opens in ISV professional learning"**. Moodle is never named in member-facing copy.

---

## 11. Seeded service request

One seeded request, so the Principal landing page shows request status before the demo creates a second one. Without it the status module is empty on first view and the capability reads as absent.

| Field | Value |
|-------|-------|
| `id` | `req-seed-001` |
| `reference` | `ISV-2026-04817` |
| `serviceId` | Service 2 |
| `subject` | Advice on flexible working arrangements (`ILLUSTRATIVE`) |
| `submittedByMemberId` | Principal |
| `submittedIso` | Eleven days before the fixture authoring date |
| `status` | `in-progress` |
| `statusLabel` | With ISV |
| `nextStep` | An ISV adviser will contact you to confirm details |
| `assignedTo` | An ISV adviser |
| `timeline` | Submitted (complete, `submittedIso`), Received by ISV (complete, +1 day), Adviser assigned (complete, +3 days), Response provided (incomplete, no iso) |

All `ILLUSTRATIVE`. Incomplete timeline steps carry an empty `iso` and render without a date.

**Generation rule for demo-created requests.** `id` is `req-session-{n}` incrementing from 1. `reference` is `ISV-2026-0NNNN`, incrementing from `04818`. `submittedIso` is the current timestamp. `status` is `submitted`, `statusLabel` is "Received by ISV", and the first two timeline steps are complete. `nextStep` derives from the service's `nextStepNote` and `assignedTo` from its `deliveredBy`. Nothing about a generated request is invented at render time.

After Act 3 the Principal has two requests. After Act 3 the Principal has two requests. The status module renders a list, most recent first, and its heading is plural. Do not build it as a single-request module.

The Business Manager has no requests on first load. This is correct and should not be padded. It produces a genuine visible difference between the two views.

---

## 12. Navigation

The broader portal navigation module closes both landing pages and supplies four entry points in the capability matrix. Every item is listed here. Items with `navigates: false` are visible and correctly labelled but inert.

| Label | Navigates | Note |
|-------|-----------|------|
| Resources and knowledge | No | Represents the resource library entry point |
| Services | No | Represents the full service catalogue |
| Events | No | Represents event discovery |
| Professional learning | No | Represents professional learning discovery |
| Share content with ISV | No | Represents the member upload requirement. The Canto boundary is explained in the walkthrough, never in the interface |
| My profile | Yes | Opens the profile panel |
| Contact ISV | Yes | Opens the contact panel |

The module carries `discoveryNote`: "Full information architecture confirmed during Discovery."

Inert items are visibly non-interactive rather than clickable-and-broken. Someone in the room will click them.

---

## 13. Ask ISV script

Seven entries. Six are available to the Principal, five to the Business Manager, with four shared.

### Matching

Specified in `PRD.md` section 10. Lowercase, strip punctuation, whole-token matching only, filter to persona, threshold two, tie-break by lowest entry ID. Substring matching is a build defect.

### Follow-up rule

Every `followUpId` must be reachable by **every persona that can reach the parent entry**. The chains below satisfy this. Verify it again if any entry's `relevantTo` changes, because this is the failure mode that passes a naive ID-existence check.

| Entry | Available to | Follow-ups | Valid because |
|---|---|---|---|
| A1 | Both | A2, A3, A6 | All shared |
| A2 | Both | A1, A3, A6 | All shared |
| A3 | Both | A1, A2, A6 | All shared |
| A4 | Principal | A5, A2, A1 | All Principal-reachable |
| A5 | Principal | A4, A2, A6 | All Principal-reachable |
| A6 | Both | A1, A2, A3 | All shared |
| A7 | Business Manager | A6, A2, A1 | All Business Manager-reachable |

### Related learning band

Every entry carries `relatedLearningIds`. The band renders after related services and is persona-filtered and de-duplicated against sources like the others.

| Entry | Related learning |
|---|---|
| A1, A3 | E2 Governance essentials for school leaders |
| A2 | None |
| A4 | E2. E1 is already a source, and an id may not appear twice |
| A5 | E2 |
| A6, A7 | E3 Employment relations update for business managers |

This was absent from v1.1, which listed related learning for A4 only. A compliance answer that surfaces the governance session is useful, and leaving six of seven entries without the band would have made the specified hierarchy inconsistent.

### Voice rule

Answers describe **what ISV provides**. They do not state what a regulation requires. "Victorian schools must comply with X" is advice ISV has not authorised the prototype to give. "ISV's compliance resources cover X" is a description of a published product. The second is always correct and is never weaker in the room.

---

### A1 — the demo question

**Question.** What do we need to have in place for the Child Safe Standards this year?

**Match terms.** child, safe, safety, standards, protection, safeguarding

**Relevant to.** Both

**Answer.** ISV's compliance resources cover the Child Safe Standards alongside the VRQA minimum standards for the care, safety and welfare of students. isComply holds model policies, guidance materials and templates that schools can adapt, and the compliance policies for Member Schools are maintained in partnership with Russell Kennedy. What applies to your school depends on your registration status and current policy set, which ISV can review with you directly.

**Sources.** R2 (isComply), R3 (isComply), R1 (ISV website)

**Related resources.** R2, R4

**Related services.** Service 1, Service 3

**Follow-ups.** A2, A3, A6

**Classification.** `PUBLIC`. Every claim maps to ISV's published product descriptions. The answer deliberately does not state what the standards require, and routes to a human for anything school-specific.

### A2

**Question.** Where do I find ISV's model policies and templates?

**Match terms.** model, policy, policies, template, templates, find, where

**Relevant to.** Both

**Answer.** ISV maintains policies, procedures, templates and operational resources in isConnect, organised across six areas: vision and strategy; governance, compliance and risk; learning and wellbeing; facilities, operations and finance; people and culture; and communications and relationships. Compliance-specific model policies and guidance materials sit in isComply, which is structured around the VRQA minimum standards.

**Sources.** R4 (isConnect), R2 (isComply)

**Related resources.** R1, R5, R6

**Related services.** Service 4, Service 3

**Follow-ups.** A1, A3, A6

**Classification.** `PUBLIC`. Close to verbatim from ISV's product page.

### A3

**Question.** What are our school registration obligations?

**Match terms.** registration, register, vrqa, minimum, standards, obligations, renew

**Relevant to.** Both

**Answer.** ISV's compliance resources are structured around the VRQA minimum standards, which cover the care, safety and welfare of students, curriculum and student learning, enrolment, school governance, staff employment and school infrastructure, among other requirements. isComply includes guidance materials to help maintain your school's registration. For obligations specific to your school, ISV can advise directly.

**Sources.** R3 (isComply), R1 (ISV website)

**Related resources.** R2, R4

**Related services.** Service 1, Service 3

**Follow-ups.** A1, A2, A6

**Classification.** `PUBLIC`. Note "among other requirements": ISV's own page ends the list with "and more", and presenting the six as exhaustive would overstate it.

### A4

**Question.** What professional learning is available for our leadership team this term?

**Match terms.** professional, learning, development, training, leadership, team, term, course

**Relevant to.** Principal

**Answer.** ISV's professional learning includes isLearn, a hub of learning options that lets staff choose and track their own pathway, offering blended learning and access to ISV programmes as well as connections with subject experts. Current offerings are listed in ISV's learning and development programme.

**Sources.** E1 (ISV website), R7 (isConnect)

**Related resources.** R7, R4

**Related learning.** E1, E2

**Follow-ups.** A5, A2, A1

**Classification.** `PUBLIC`. "Includes isLearn" rather than "is delivered through isLearn", because ISV runs a separate top-level learning and development programme.

### A5

**Question.** How can we benchmark our school's performance against other Independent schools?

**Match terms.** benchmark, compare, performance, data, analytics, effectiveness, survey, improvement

**Relevant to.** Principal

**Answer.** Two ISV products support this. isAnalyse aggregates ISV data sets with publicly available data sets so schools can benchmark against other schools and generate reports. isLEAD School Effectiveness Surveys provide a measure of school effectiveness, benchmarked against other Independent schools, and were developed by and for Independent schools.

**Sources.** Service 6 (isAnalyse), Service 7 (isLEAD)

**Related resources.** R6, R4

**Related services.** None. Both relevant services are already in the sources band, and an id may not appear twice

**Follow-ups.** A4, A2, A6

**Classification.** `PUBLIC`.

### A6

**Question.** Who do I contact at ISV about an employment relations question?

**Match terms.** employment, relations, staff, industrial, workplace, contact, employee, enterprise, agreement

**Relevant to.** Both

**Answer.** isConnect holds policies, procedures and templates covering people and culture, which includes employment matters. For a question specific to your school, you can request employment relations advice through the portal and an ISV adviser will follow up, or contact ISV directly on 03 9825 7200.

**Sources.** R5 (isConnect), R4 (isConnect)

**Related resources.** R5, R7

**Related services.** Service 2, Service 4

**Follow-ups.** A1, A2, A3

**Classification.** Contact details are `PUBLIC`. Sources are both `PUBLIC` isConnect areas.

Service 2 is deliberately **not** in the sources band. It is the one `ILLUSTRATIVE` service in the set, and citing an invented service as an attributed source undermines the exact thing the source band exists to demonstrate. It appears in the related services band instead, where the walkthrough framing already covers it.

Match term `hr` was removed because it substring-matches "through".

### A7

**Question.** How do we advertise a vacancy at our school?

**Match terms.** advertise, vacancy, vacancies, job, recruit, hire, hiring, applicant, resume, opportunity

**Relevant to.** Business Manager

**Answer.** isRecruit is ISV's careers and employment hub for Independent schools in Victoria. Member Schools can advertise employment vacancies, search resumes and manage email applications, and publish a school profile to help attract suitable applicants.

**Sources.** Service 8 (isRecruit), R8 (isRecruit)

**Related resources.** R5, R4

**Related services.** None. Service 8 is already in the sources band

**Follow-ups.** A6, A2, A1

**Classification.** `PUBLIC`. Close to verbatim from ISV's product page.

### No-match state

Triggered when no persona-available entry reaches two matched terms.

> I can't answer that from ISV's current knowledge base.
>
> Try one of the questions below, or contact ISV directly and someone will help.

Followed by the four suggested questions for the active persona and a contact pathway showing 03 9825 7200 and enquiries@is.vic.edu.au.

Render this calm and deliberate, not as an error. No warning colour, no error iconography. It demonstrates the guardrail, and it is why an unexpected question from the room cannot break the demo.

### Suggested questions on open

**Principal.** A1, A4, A5, A3
**Business Manager.** A6, A7, A1, A2

---

## 14. Screen composition

### Header, present on all authenticated screens

ISV logo, Ask ISV search field, role switcher, member name and school, profile action, contact action. These are AppShell concerns and do not appear in the landing page module lists below.

### Sign-in screen

Single fixture: ISV logo, one line of product framing, and an SSO action labelled "Sign in with your school account". Signing in always lands on the **Principal** view. Act 1 depends on that starting point.

### Principal landing modules

| # | Module | `itemType` | Cue | Filter bar | Items |
|---|--------|-----------|-----|-----------|-------|
| 1 | Personalised header | header | — | No | Greeting, role, school |
| 2 | Your requests | request | — | No | Seeded request, plus any created during the session |
| 3 | News and updates | content | — | No | N2, N4. Clay field, the editorial accent |
| 4 | Resources | content | Based on your role | Yes | R6, R4, R1 |
| 5 | ISV services | service | — | No | Service 1, Service 6, Service 7 |
| 6 | Professional learning | content | Based on your interests | Yes | E1, E2 |
| 7 | Events | content | — | No | E4, E5 |
| 8 | Saved resources | content | — | No | Empty state. Sand, because it holds the member's own items |
| 9 | Broader portal navigation | nav | — | No | Section 12, with Discovery note |

### Business Manager landing modules

| # | Module | `itemType` | Cue | Filter bar | Items |
|---|--------|-----------|-----|-----------|-------|
| 1 | Personalised header | header | — | No | Greeting, role, school |
| 2 | News and updates | content | — | No | N1, N3. Clay field, the editorial accent |
| 3 | ISV services | service | Based on your role | No | Service 2, Service 8, Service 3 |
| 4 | Resources | content | — | Yes | R5, R4, R2 |
| 5 | Professional learning | content | Based on your interests | Yes | E3, E1 |
| 6 | Events | content | — | No | E4 |
| 7 | Saved resources | content | — | No | Empty state. Sand, because it holds the member's own items |
| 8 | Broader portal navigation | nav | — | No | Section 12, with Discovery note |

Two cued modules per persona, within the three-module budget. The interest-cued module is genuinely interest-driven: its selector matches `ContentItem.interestTags` against `Member.interests` rather than filtering by role. That join is what makes the cue honest rather than a label.

The Business Manager has no requests module on first load. Do not add one.

**Filter bars** appear on the two modules marked above, on both personas. They are visibly disabled and carry the Discovery tooltip specified in `PRD.md` section 12. No other module renders one.

**Unused cues.** "Recommended for you" and "Relevant to your school" are permitted by the type but are not used in this composition. Both personas share one school, so "Relevant to your school" would be dishonest, and "Recommended for you" adds nothing over the two cues in use. Leave them in the type and unused.

---

## 15. Content that must not appear

A closing checklist. If any of these appear, source integrity has failed.

- Any ISV service not listed in section 7
- Any named ISV staff member or named ISV team
- Any real ISV member school presented with fabricated data
- Any statement of what a regulation requires, as opposed to what ISV provides
- Any ISV policy position, advocacy stance or submission content
- Any figure, statistic or benchmark presented as ISV data
- Any dashboard, chart or data visualisation
- Any named platform in member-facing copy: Optimizely, Dynamics 365, Databricks, Moodle, Canto, Azure AD B2C
- Any response time, turnaround or service level
- Any invented publication date on real ISV content
- Any AI answer with fewer than two attributed sources
- Any placeholder string visible in the interface
