import type { RequestField, Service } from "@/types";

/**
 * DATA-SPEC.md section 7, revised.
 *
 * The isEducation products no longer appear as services. They are areas of
 * the portal, defined in data/areas.ts. What remains here are ISV support
 * pathways: a member describes what they need and an ISV adviser follows up.
 *
 * SOURCE POSITION, and it needs saying plainly in the room. RFP s4 names
 * compliance, governance, employment relations, finance and funding as
 * member priority areas. A priority area is not a published service. These
 * four are modelled as request pathways into ISV's existing support, and
 * every one is marked ILLUSTRATIVE except compliance, which has partial
 * grounding in isComply's published reference to expert support.
 *
 * There is no response time field anywhere in this file. ISV has not
 * published one.
 */

const ISV_EMAIL = "enquiries@is.vic.edu.au";
const ISV_PHONE = "03 9825 7200";

const baseRequestFields: RequestField[] = [
  {
    id: "name",
    label: "Your name",
    type: "text",
    required: true,
    prefillFrom: "member.fullName",
  },
  {
    id: "role",
    label: "Your role",
    type: "text",
    required: true,
    prefillFrom: "member.roleLabel",
  },
  {
    id: "school",
    label: "School",
    type: "text",
    required: true,
    prefillFrom: "school.name",
  },
  {
    id: "email",
    label: "Email",
    type: "text",
    required: true,
    prefillFrom: "member.email",
  },
  {
    id: "phone",
    label: "Phone",
    type: "text",
    required: false,
    prefillFrom: "member.phone",
  },
];

const detailFields = (options: string[]): RequestField[] => [
  {
    id: "area",
    label: "What area does this relate to",
    type: "select",
    required: true,
    options,
  },
  {
    id: "detail",
    label: "Describe what you need help with",
    type: "textarea",
    required: true,
    helpText: "Include any relevant dates or deadlines",
  },
  {
    id: "urgency",
    label: "How urgent is this",
    type: "radio",
    required: true,
    options: ["Within a week", "Within a month", "No fixed deadline"],
  },
];

const commonRequestable = {
  requestable: true as const,
  contactEmail: ISV_EMAIL,
  contactPhone: ISV_PHONE,
  includedInMembership: true,
  inclusionNote: "Included in our ISV membership",
  deliveredBy: "An ISV adviser",
  nextStepNote: "An ISV adviser will be in touch",
};

export const services: Service[] = [
  {
    id: "service-compliance-support",
    slug: "compliance-support",
    name: "Compliance support",
    summary:
      "Request guidance from ISV on compliance obligations, governance practice and regulatory requirements affecting your school.",
    description: [
      "ISV maintains model policies, guidance materials and templates that Member Schools can adapt, structured around the VRQA minimum standards. Where a question is specific to your school's registration status or current policy set, an ISV adviser can work through it with you directly.",
      "Requests are logged against your school and stay visible in the portal, so you can see where things sit without chasing an email thread.",
    ],
    category: "governance-compliance-risk",
    relevantTo: ["principal", "business-manager"],
    requestLabel: "Request compliance support",
    requestFields: [
      ...baseRequestFields,
      ...detailFields([
        "Child safety",
        "School registration",
        "Governance and board practice",
        "Student wellbeing",
        "Staff employment",
        "Other",
      ]),
    ],
    ...commonRequestable,
    source: "PUBLIC",
    sourceNote:
      'ISV\'s compliance product page describes "support from our industry experts". Reinforced by the compliance and governance priority areas in RFP s4. Verify against the RFP text before the prototype is shown.',
  },
  {
    id: "service-employment-relations",
    slug: "employment-relations-support",
    name: "Employment relations support",
    summary:
      "Request advice from ISV on employment matters affecting your school, including workplace policy and staff employment practice.",
    description: [
      "ISV's resource library holds policies, procedures and templates covering people and culture. Where a question is specific to your school, an ISV adviser can work through it with you directly.",
      "Requests are logged against your school and stay visible in the portal alongside your other requests.",
    ],
    category: "people-culture",
    relevantTo: ["principal", "business-manager"],
    requestLabel: "Request employment relations support",
    requestFields: [
      ...baseRequestFields,
      ...detailFields([
        "Staff employment",
        "Workplace policy",
        "Enterprise agreement",
        "Recruitment",
        "Other",
      ]),
    ],
    ...commonRequestable,
    source: "ILLUSTRATIVE",
    sourceNote:
      "Informed by the employment relations priority area in RFP s4. A priority area is not a published service. Describe this in the walkthrough as a proposed request pathway.",
  },
  {
    id: "service-governance-strategy",
    slug: "governance-and-strategy-support",
    name: "Governance and strategy support",
    summary:
      "Request advice on board practice, strategic planning and school improvement priorities.",
    description: [
      "ISV's resource library covers vision and strategy alongside governance and board practice. Where your school is working through a planning cycle or a board question, an ISV adviser can talk it through with you.",
      "Requests are logged against your school and stay visible in the portal.",
    ],
    category: "vision-strategy",
    relevantTo: ["principal"],
    requestLabel: "Request governance support",
    requestFields: [
      ...baseRequestFields,
      ...detailFields([
        "Board composition and practice",
        "Strategic planning",
        "School improvement",
        "Risk and delegation",
        "Other",
      ]),
    ],
    ...commonRequestable,
    source: "ILLUSTRATIVE",
    sourceNote:
      "Informed by the strategic guidance and governance priority areas in RFP s4. A proposed request pathway, not a published service.",
  },
  {
    id: "service-funding-finance",
    slug: "funding-and-finance-support",
    name: "Funding and finance support",
    summary:
      "Request guidance on funding, financial reporting and the operational side of running your school.",
    description: [
      "ISV's resource library covers facilities, operations and finance, including reporting and budgeting templates. Where a funding or reporting question is specific to your school, an ISV adviser can help.",
      "Requests are logged against your school and stay visible in the portal.",
    ],
    category: "facilities-operations-finance",
    relevantTo: ["business-manager"],
    requestLabel: "Request finance support",
    requestFields: [
      ...baseRequestFields,
      ...detailFields([
        "Funding",
        "Financial reporting",
        "Budgeting",
        "Facilities and operations",
        "Other",
      ]),
    ],
    ...commonRequestable,
    source: "ILLUSTRATIVE",
    sourceNote:
      "Informed by the finance and funding priority areas in RFP s4. A proposed request pathway, not a published service.",
  },
];
