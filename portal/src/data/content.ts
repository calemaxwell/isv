import type { ContentItem } from "@/types";

/**
 * DATA-SPEC.md sections 8, 9 and 10.
 *
 * VERIFY BEFORE THE PROTOTYPE IS SHOWN (DATA-SPEC s2 check 3): every item
 * marked VERIFY-DATE below is real ISV published content. Read its actual
 * publication date from is.vic.edu.au and replace publishedIso. Dates on real
 * ISV content are checkable, so an invented one is checkable too.
 */

const AUTHORED = "2026-08-17";

/* ---------- Resources (DATA-SPEC s8) ---------- */
export const resources: ContentItem[] = [
  {
    id: "resource-compliance-policies",
    title: "Compliance policies for Member Schools",
    summary:
      "ISV's compliance policy collection for Member Schools, maintained in partnership with Russell Kennedy.",
    type: "resource",
    category: "governance-compliance-risk",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: AUTHORED,
    recencyLabel: "Maintained by ISV",
    isvSystem: "area-isv",
    source: "PUBLIC",
    sourceNote: "Published on is.vic.edu.au, in partnership with Russell Kennedy",
  },
  {
    id: "resource-child-safety",
    title: "Child safety policy templates and guidance",
    summary:
      "Model policies, guidance materials and templates covering the care, safety and welfare of students.",
    type: "resource",
    category: "governance-compliance-risk",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: AUTHORED,
    recencyLabel: "Maintained by ISV",
    isvSystem: "area-compliance",
    source: "PUBLIC",
    sourceNote:
      "Compliance area. Derived from isComply, which covers care, safety and welfare of students per the ISV products page",
  },
  {
    id: "resource-registration",
    title: "School registration and VRQA minimum standards",
    summary:
      "Guidance materials structured around the standards that govern school registration in Victoria.",
    type: "resource",
    category: "governance-compliance-risk",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: AUTHORED,
    recencyLabel: "Maintained by ISV",
    isvSystem: "area-compliance",
    source: "PUBLIC",
    sourceNote: "Compliance area. Derived from isComply, structured around the VRQA minimum standards",
  },
  {
    id: "resource-governance",
    title: "Governance, compliance and risk resources",
    summary:
      "Policies, procedures and operational templates from the governance, compliance and risk area of the resource library.",
    type: "resource",
    category: "governance-compliance-risk",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: AUTHORED,
    recencyLabel: "Maintained by ISV",
    isvSystem: "area-resources",
    source: "PUBLIC",
    sourceNote: "Resource library area. Derived from an isConnect navigational area, ISV products page",
  },
  {
    id: "resource-people-culture",
    title: "People and culture policies and templates",
    summary:
      "Employment and workplace practice resources from the people and culture area of the resource library.",
    type: "resource",
    category: "people-culture",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: AUTHORED,
    recencyLabel: "Maintained by ISV",
    isvSystem: "area-resources",
    source: "PUBLIC",
    sourceNote: "Resource library area. Derived from an isConnect navigational area, ISV products page",
  },
  {
    id: "resource-vision-strategy",
    title: "Vision and strategy planning resources",
    summary:
      "Planning templates and guidance from the vision and strategy area of the resource library.",
    type: "resource",
    category: "vision-strategy",
    relevantTo: ["principal"],
    interestTags: [],
    publishedIso: AUTHORED,
    recencyLabel: "Maintained by ISV",
    isvSystem: "area-resources",
    source: "PUBLIC",
    sourceNote: "Resource library area. Derived from an isConnect navigational area, ISV products page",
  },
  {
    id: "resource-learning-wellbeing",
    title: "Learning and wellbeing resources",
    summary:
      "Curriculum, learning and student wellbeing resources from the learning and wellbeing area of the resource library.",
    type: "resource",
    category: "learning-wellbeing",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: AUTHORED,
    recencyLabel: "Maintained by ISV",
    isvSystem: "area-resources",
    source: "PUBLIC",
    sourceNote: "Resource library area. Derived from an isConnect navigational area, ISV products page",
  },
  {
    id: "resource-isrecruit-overview",
    title: "Advertising a vacancy at your school",
    summary:
      "How Member Schools advertise vacancies, search resumes and manage applications through the careers area.",
    type: "resource",
    category: "people-culture",
    relevantTo: ["business-manager"],
    interestTags: [],
    publishedIso: AUTHORED,
    recencyLabel: "Maintained by ISV",
    isvSystem: "area-employment",
    source: "PUBLIC",
    sourceNote: "ISV products page, is.vic.edu.au/products",
  },
] satisfies ContentItem[];

/* ---------- News (DATA-SPEC s9) ---------- */
export const news: ContentItem[] = [
  {
    id: "news-business-manager-priorities",
    title: "Term 3 priorities for school business managers",
    summary:
      "What school business managers are focused on this term, from the ISV Perspectives blog.",
    type: "news",
    category: "general",
    relevantTo: ["business-manager"],
    interestTags: [],
    publishedIso: AUTHORED, // VERIFY-DATE
    recencyLabel: "Recently published", // VERIFY-DATE: derive from the real date
    isvSystem: "area-isv",
    source: "PUBLIC",
    sourceNote: "Real ISV Perspectives blog post title. Verify publication date.",
  },
  {
    id: "news-school-improvement",
    title:
      "Strengthening school improvement through evidence, voice and contemporary research",
    summary:
      "How Independent schools are using evidence and student voice to shape improvement priorities.",
    type: "news",
    category: "general",
    relevantTo: ["principal"],
    interestTags: [],
    publishedIso: AUTHORED, // VERIFY-DATE
    recencyLabel: "Recently published", // VERIFY-DATE: derive from the real date
    isvSystem: "area-isv",
    source: "PUBLIC",
    sourceNote: "Real ISV Perspectives blog post title. Verify publication date.",
  },
  {
    id: "news-inside-our-schools",
    title: "Inside Our Schools: Berengarra School",
    summary:
      "Celebrating the diversity of Independent schools across Victoria.",
    type: "news",
    category: "general",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: AUTHORED, // VERIFY-DATE
    recencyLabel: "Recently published", // VERIFY-DATE: derive from the real date
    isvSystem: "area-isv",
    source: "PUBLIC",
    sourceNote: "Real ISV feature. Verify publication date.",
  },
  {
    id: "news-complex-world",
    title: "Helping children navigate a complex world",
    summary:
      "In a world of conflict, how do we raise informed rather than overwhelmed children?",
    type: "news",
    category: "general",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: AUTHORED, // VERIFY-DATE
    recencyLabel: "Recently published", // VERIFY-DATE: derive from the real date
    isvSystem: "area-isv",
    source: "PUBLIC",
    sourceNote: "Real ISV Perspectives blog post. Verify publication date.",
  },
] satisfies ContentItem[];

/* ---------- Updates (DATA-SPEC s9a) ----------
   What has changed since the member last looked. This is the module that
   makes the portal feel live rather than static.

   VOICE RULE, and it is the whole reason this content is defensible:
   every item describes something ISV has done to its own materials. None
   of them states what a regulation requires, when it takes effect, or what
   a school must do. "ISV has updated its child safety policy templates" is
   a fact about ISV. "Schools must review their child safety policy by
   March" is advice ISV has not authorised the prototype to give.

   All ILLUSTRATIVE. In the walkthrough these are described as examples of
   the update types the portal would surface, not as real ISV notices.
------------------------------------------------------------------ */
export const updates: ContentItem[] = [
  {
    id: "update-compliance-review",
    title: "Compliance resources reviewed for the new school year",
    summary:
      "ISV has completed its annual review of the compliance library, including model policies and guidance materials.",
    type: "update",
    category: "governance-compliance-risk",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: "2026-08-15",
    recencyLabel: "",
    isvSystem: "area-compliance",
    source: "ILLUSTRATIVE",
    sourceNote:
      "Describes ISV maintaining its own materials. Asserts no regulatory requirement.",
  },
  {
    id: "update-registration-briefings",
    title: "Term 4 registration briefing dates confirmed",
    summary:
      "ISV has confirmed the dates for its Term 4 briefings on school registration and the VRQA minimum standards.",
    type: "update",
    category: "governance-compliance-risk",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: "2026-08-14",
    recencyLabel: "",
    isvSystem: "area-isv",
    source: "ILLUSTRATIVE",
    sourceNote: "Describes an ISV briefing schedule.",
  },
  {
    id: "update-child-safety-templates",
    title: "Child safety policy templates updated",
    summary:
      "ISV has refreshed its child safety model policies and supporting templates.",
    type: "update",
    category: "governance-compliance-risk",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: "2026-08-12",
    recencyLabel: "",
    isvSystem: "area-compliance",
    source: "ILLUSTRATIVE",
    sourceNote:
      "Describes ISV updating its own templates. Does not state what the standards require.",
  },
  {
    id: "update-people-culture-templates",
    title: "People and culture policy templates updated",
    summary:
      "ISV has refreshed the employment and workplace practice templates in the resource library.",
    type: "update",
    category: "people-culture",
    relevantTo: ["business-manager"],
    interestTags: [],
    publishedIso: "2026-08-11",
    recencyLabel: "",
    isvSystem: "area-resources",
    source: "ILLUSTRATIVE",
    sourceNote: "Describes ISV updating its own templates.",
  },
  {
    id: "update-employment-recordkeeping",
    title: "New guidance on staff employment record keeping",
    summary:
      "ISV has published new guidance material covering employment record keeping practice for schools.",
    type: "update",
    category: "people-culture",
    relevantTo: ["business-manager"],
    interestTags: [],
    publishedIso: "2026-08-07",
    recencyLabel: "",
    isvSystem: "area-resources",
    source: "ILLUSTRATIVE",
    sourceNote: "Describes ISV publishing guidance. Asserts no legal obligation.",
  },
  {
    id: "update-board-governance",
    title: "New guidance on school board governance practice",
    summary:
      "ISV has published new material on board composition, meeting practice and delegation.",
    type: "update",
    category: "governance-compliance-risk",
    relevantTo: ["principal"],
    interestTags: [],
    publishedIso: "2026-08-05",
    recencyLabel: "",
    isvSystem: "area-resources",
    source: "ILLUSTRATIVE",
    sourceNote: "Describes ISV publishing guidance.",
  },
  {
    id: "update-financial-templates",
    title: "Financial reporting templates updated",
    summary:
      "ISV has updated the reporting and budgeting templates in the facilities, operations and finance area.",
    type: "update",
    category: "facilities-operations-finance",
    relevantTo: ["business-manager"],
    interestTags: [],
    publishedIso: "2026-08-03",
    recencyLabel: "",
    isvSystem: "area-resources",
    source: "ILLUSTRATIVE",
    sourceNote: "Describes ISV updating its own templates.",
  },
  {
    id: "update-school-improvement",
    title: "School improvement resources refreshed",
    summary:
      "ISV has updated its planning and school improvement materials in the vision and strategy area.",
    type: "update",
    category: "vision-strategy",
    relevantTo: ["principal"],
    interestTags: [],
    publishedIso: "2026-08-01",
    recencyLabel: "",
    isvSystem: "area-resources",
    source: "ILLUSTRATIVE",
    sourceNote: "Describes ISV updating its own materials.",
  },
];

/* ---------- Professional learning (DATA-SPEC s10) ---------- */
export const learning: ContentItem[] = [
  {
    id: "learning-isv-programme",
    title: "ISV professional learning programme",
    summary:
      "ISV's current professional learning offerings for staff across Independent schools.",
    type: "learning",
    category: "learning-wellbeing",
    relevantTo: ["principal", "business-manager"],
    interestTags: ["leadership development", "school operations"],
    publishedIso: AUTHORED, // VERIFY-DATE
    recencyLabel: "Open now",
    isvSystem: "area-isv",
    externalHandoff: "learning-platform",
    format: "Blended",
    source: "PUBLIC",
    sourceNote:
      "ISV learning and development programme, published on is.vic.edu.au.",
  },
  {
    id: "learning-governance-essentials",
    title: "Governance essentials for school leaders",
    summary:
      "An introduction to board practice, risk and compliance responsibilities for school leadership.",
    type: "learning",
    category: "governance-compliance-risk",
    relevantTo: ["principal", "business-manager"],
    interestTags: ["leadership development", "school improvement"],
    publishedIso: AUTHORED,
    recencyLabel: "Upcoming",
    isvSystem: "area-learning",
    externalHandoff: "learning-platform",
    eventIso: "2026-09-09",
    location: "Hawthorn",
    format: "In person",
    region: "Inner eastern Melbourne",
    source: "ILLUSTRATIVE",
    sourceNote: "Plausible session. Not a published ISV offering.",
  },
  {
    id: "learning-employment-relations",
    title: "Employment relations update for business managers",
    summary:
      "A practical session on workplace policy and employment practice for school operations staff.",
    type: "learning",
    category: "people-culture",
    relevantTo: ["business-manager"],
    interestTags: ["employment relations", "school operations"],
    publishedIso: AUTHORED,
    recencyLabel: "Upcoming",
    isvSystem: "area-learning",
    externalHandoff: "learning-platform",
    eventIso: "2026-09-02",
    location: "Online",
    format: "Online",
    source: "ILLUSTRATIVE",
    sourceNote: "Plausible session. Not a published ISV offering.",
  },
  {
    id: "learning-leading-improvement",
    title: "Leading school improvement",
    summary:
      "A programme for school leaders on using evidence and student voice to shape improvement priorities.",
    type: "learning",
    category: "vision-strategy",
    relevantTo: ["principal"],
    interestTags: ["school improvement", "leadership development"],
    publishedIso: AUTHORED,
    recencyLabel: "Upcoming",
    isvSystem: "area-learning",
    externalHandoff: "learning-platform",
    eventIso: "2026-09-16",
    location: "Camberwell",
    format: "Blended",
    region: "Inner eastern Melbourne",
    source: "ILLUSTRATIVE",
    sourceNote: "Plausible session. Not a published ISV offering.",
  },
  {
    id: "learning-financial-management",
    title: "Financial management for schools",
    summary:
      "Budgeting, reporting and financial governance practice for school business staff.",
    type: "learning",
    category: "facilities-operations-finance",
    relevantTo: ["business-manager"],
    interestTags: ["school operations", "funding"],
    publishedIso: AUTHORED,
    recencyLabel: "Upcoming",
    isvSystem: "area-learning",
    externalHandoff: "learning-platform",
    eventIso: "2026-09-23",
    location: "Hawthorn",
    format: "In person",
    region: "Inner eastern Melbourne",
    source: "ILLUSTRATIVE",
    sourceNote: "Plausible session. Not a published ISV offering.",
  },
  {
    id: "learning-child-safety-practice",
    title: "Child safety in practice",
    summary:
      "A workshop on putting child safety policies and procedures into day to day practice.",
    type: "learning",
    category: "governance-compliance-risk",
    relevantTo: ["principal", "business-manager"],
    interestTags: [
      "compliance reporting",
      "school improvement",
      "leadership development",
    ],
    publishedIso: AUTHORED,
    recencyLabel: "Upcoming",
    isvSystem: "area-learning",
    externalHandoff: "learning-platform",
    eventIso: "2026-10-07",
    location: "Box Hill",
    format: "In person",
    region: "Inner eastern Melbourne",
    source: "ILLUSTRATIVE",
    sourceNote: "Plausible session. Not a published ISV offering.",
  },
] satisfies ContentItem[];

/* ---------- Events (DATA-SPEC s10) ---------- */
export const events: ContentItem[] = [
  {
    id: "event-arts-learning-festival",
    title: "Arts Learning Festival",
    summary:
      "ISV's festival celebrating arts learning across Independent schools.",
    type: "event",
    category: "general",
    relevantTo: ["principal", "business-manager"],
    interestTags: [],
    publishedIso: AUTHORED, // VERIFY-DATE
    recencyLabel: "Upcoming",
    isvSystem: "area-isv",
    externalHandoff: "none",
    eventIso: "2026-10-14", // VERIFY-DATE: real event, read the real date
    location: "Melbourne",
    format: "In person",
    source: "PUBLIC",
    sourceNote:
      "Real ISV event, artslearningfestival.com.au. Verify date and location.",
  },
  {
    id: "event-islead-briefing",
    title: "School effectiveness surveys briefing",
    summary:
      "An overview of ISV's school effectiveness surveys and how schools use the results.",
    type: "event",
    category: "vision-strategy",
    relevantTo: ["principal"],
    interestTags: ["school improvement"],
    publishedIso: AUTHORED,
    recencyLabel: "Upcoming",
    isvSystem: "area-insights",
    externalHandoff: "none",
    eventIso: "2026-09-24",
    location: "Online",
    format: "Online",
    source: "ILLUSTRATIVE",
    sourceNote:
      "School effectiveness surveys are a published ISV capability, but this briefing event is invented.",
  },
  {
    id: "event-principals-breakfast",
    title: "Principals' network breakfast",
    summary:
      "An informal gathering for Principals across the inner eastern schools network.",
    type: "event",
    category: "vision-strategy",
    relevantTo: ["principal"],
    interestTags: ["leadership development"],
    publishedIso: AUTHORED,
    recencyLabel: "Upcoming",
    isvSystem: "area-isv",
    externalHandoff: "none",
    eventIso: "2026-09-04",
    location: "Hawthorn",
    format: "In person",
    region: "Inner eastern Melbourne",
    source: "ILLUSTRATIVE",
    sourceNote: "Plausible network event. Not a published ISV event.",
  },
  {
    id: "event-business-managers-forum",
    title: "Business managers' forum",
    summary:
      "A termly forum for school business managers covering operations, finance and employment practice.",
    type: "event",
    category: "facilities-operations-finance",
    relevantTo: ["business-manager"],
    interestTags: ["school operations"],
    publishedIso: AUTHORED,
    recencyLabel: "Upcoming",
    isvSystem: "area-isv",
    externalHandoff: "none",
    eventIso: "2026-09-11",
    location: "Camberwell",
    format: "In person",
    region: "Inner eastern Melbourne",
    source: "ILLUSTRATIVE",
    sourceNote: "Plausible network event. Not a published ISV event.",
  },
  {
    id: "event-registration-briefing",
    title: "Term 4 school registration briefing",
    summary:
      "An ISV briefing on registration and the VRQA minimum standards ahead of Term 4.",
    type: "event",
    category: "governance-compliance-risk",
    relevantTo: ["principal", "business-manager"],
    interestTags: ["compliance reporting"],
    publishedIso: AUTHORED,
    recencyLabel: "Upcoming",
    isvSystem: "area-isv",
    externalHandoff: "none",
    eventIso: "2026-10-01",
    location: "Online",
    format: "Online",
    source: "ILLUSTRATIVE",
    sourceNote:
      "Plausible ISV briefing. Describes an ISV session, not a regulatory deadline.",
  },
] satisfies ContentItem[];

export const allContent: ContentItem[] = [
  ...resources,
  ...news,
  ...updates,
  ...learning,
  ...events,
];
