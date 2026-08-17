import type { AskIsvEntry } from "@/types";

/**
 * DATA-SPEC.md section 13.
 *
 * Three rules govern this file and each of them is checked by QA:
 *
 * 1. VOICE. Answers describe what ISV provides. They never state what a
 *    regulation requires. "Victorian schools must comply with X" is advice
 *    ISV has not authorised the prototype to give.
 * 2. FOLLOW-UPS. Every followUpId must be reachable by every persona that
 *    can reach the parent entry. This is the failure mode that passes a
 *    naive id-existence check.
 * 3. BANDS. No id appears in both the sources band and a related band, and
 *    related bands are persona-filtered at render.
 */
export const askIsvEntries: AskIsvEntry[] = [
  {
    id: "A1",
    question:
      "What do we need to have in place for the Child Safe Standards this year?",
    matchTerms: [
      "child",
      "safe",
      "safety",
      "standards",
      "protection",
      "safeguarding",
    ],
    relevantTo: ["principal", "business-manager"],
    answer:
      "ISV's compliance area covers the Child Safe Standards alongside the VRQA minimum standards for the care, safety and welfare of students. It holds model policies, guidance materials and templates that schools can adapt, and the compliance policies for Member Schools are maintained in partnership with Russell Kennedy. What applies to your school depends on your registration status and current policy set, which ISV can review with you directly.",
    sources: [
      {
        refId: "resource-child-safety",
        refType: "content",
        title: "Child safety policy templates and guidance",
        isvSystem: "area-compliance",
        recencyLabel: "Maintained by ISV",
      },
      {
        refId: "resource-registration",
        refType: "content",
        title: "School registration and VRQA minimum standards",
        isvSystem: "area-compliance",
        recencyLabel: "Maintained by ISV",
      },
      {
        refId: "resource-compliance-policies",
        refType: "content",
        title: "Compliance policies for Member Schools",
        isvSystem: "area-isv",
        recencyLabel: "Maintained by ISV",
      },
    ],
    relatedResourceIds: ["resource-governance", "resource-learning-wellbeing"],
    relatedServiceIds: ["service-compliance-support"],
    relatedLearningIds: ["learning-governance-essentials"],
    followUpIds: ["A2", "A3", "A6"],
    source: "PUBLIC",
    sourceNote:
      "Every claim maps to ISV's published product descriptions. The answer deliberately does not state what the standards require.",
  },
  {
    id: "A2",
    question: "Where do I find ISV's model policies and templates?",
    matchTerms: [
      "model",
      "policy",
      "policies",
      "template",
      "templates",
      "find",
      "where",
    ],
    relevantTo: ["principal", "business-manager"],
    answer:
      "ISV maintains policies, procedures, templates and operational resources in the resource library, organised across six areas: vision and strategy; governance, compliance and risk; learning and wellbeing; facilities, operations and finance; people and culture; and communications and relationships. Compliance-specific model policies and guidance materials sit in the compliance area, which is structured around the VRQA minimum standards.",
    sources: [
      {
        refId: "resource-governance",
        refType: "content",
        title: "Governance, compliance and risk resources",
        isvSystem: "area-resources",
        recencyLabel: "Maintained by ISV",
      },
      {
        refId: "resource-child-safety",
        refType: "content",
        title: "Child safety policy templates and guidance",
        isvSystem: "area-compliance",
        recencyLabel: "Maintained by ISV",
      },
    ],
    relatedResourceIds: [
      "resource-compliance-policies",
      "resource-people-culture",
      "resource-vision-strategy",
    ],
    relatedServiceIds: ["service-compliance-support"],
    relatedLearningIds: [],
    followUpIds: ["A1", "A3", "A6"],
    source: "PUBLIC",
    sourceNote: "Close to verbatim from the ISV products page. Product names replaced with portal areas, lineage in data/areas.ts.",
  },
  {
    id: "A3",
    question: "What are our school registration obligations?",
    matchTerms: [
      "registration",
      "register",
      "vrqa",
      "minimum",
      "standards",
      "obligations",
      "renew",
    ],
    relevantTo: ["principal", "business-manager"],
    answer:
      "ISV's compliance area is structured around the VRQA minimum standards, which cover the care, safety and welfare of students, curriculum and student learning, enrolment, school governance, staff employment and school infrastructure, among other requirements. It includes guidance materials to help maintain your school's registration. For obligations specific to your school, ISV can advise directly.",
    sources: [
      {
        refId: "resource-registration",
        refType: "content",
        title: "School registration and VRQA minimum standards",
        isvSystem: "area-compliance",
        recencyLabel: "Maintained by ISV",
      },
      {
        refId: "resource-compliance-policies",
        refType: "content",
        title: "Compliance policies for Member Schools",
        isvSystem: "area-isv",
        recencyLabel: "Maintained by ISV",
      },
    ],
    relatedResourceIds: ["resource-child-safety", "resource-governance"],
    relatedServiceIds: ["service-compliance-support"],
    relatedLearningIds: ["learning-governance-essentials"],
    followUpIds: ["A1", "A2", "A6"],
    source: "PUBLIC",
    sourceNote:
      'ISV\'s own page ends the standards list with "and more", so the answer says "among other requirements" rather than presenting six as exhaustive.',
  },
  {
    id: "A4",
    question:
      "What professional learning is available for our leadership team this term?",
    matchTerms: [
      "professional",
      "learning",
      "development",
      "training",
      "leadership",
      "team",
      "term",
      "course",
    ],
    relevantTo: ["principal"],
    answer:
      "ISV's professional learning area is a hub of learning options that lets staff choose and track their own pathway, offering blended learning and access to ISV programmes as well as connections with subject experts. Current offerings are listed in ISV's learning and development programme.",
    sources: [
      {
        refId: "learning-isv-programme",
        refType: "content",
        title: "ISV professional learning programme",
        isvSystem: "area-isv",
        recencyLabel: "Open now",
      },
      {
        refId: "resource-learning-wellbeing",
        refType: "content",
        title: "Learning and wellbeing resources",
        isvSystem: "area-resources",
        recencyLabel: "Maintained by ISV",
      },
    ],
    relatedResourceIds: ["resource-vision-strategy", "resource-governance"],
    relatedServiceIds: ["service-governance-strategy"],
    relatedLearningIds: ["learning-governance-essentials"],
    followUpIds: ["A5", "A2", "A1"],
    source: "PUBLIC",
    sourceNote:
      "Describes the professional learning area rather than a named product. ISV runs a top-level learning and development programme, published on is.vic.edu.au.",
  },
  {
    id: "A5",
    question:
      "How can we benchmark our school's performance against other Independent schools?",
    matchTerms: [
      "benchmark",
      "compare",
      "performance",
      "data",
      "analytics",
      "effectiveness",
      "survey",
      "improvement",
    ],
    relevantTo: ["principal"],
    answer:
      "ISV's school insights area supports this in two ways. It aggregates ISV data sets with publicly available data sets so schools can benchmark against other schools and generate reports, and it holds the school effectiveness surveys, which provide a measure of school effectiveness benchmarked against other Independent schools and were developed by and for Independent schools.",
    sources: [
      {
        refId: "resource-vision-strategy",
        refType: "content",
        title: "Vision and strategy planning resources",
        isvSystem: "area-resources",
        recencyLabel: "Maintained by ISV",
      },
      {
        refId: "resource-governance",
        refType: "content",
        title: "Governance, compliance and risk resources",
        isvSystem: "area-resources",
        recencyLabel: "Maintained by ISV",
      },
    ],
    relatedResourceIds: ["resource-compliance-policies", "resource-learning-wellbeing"],
    relatedServiceIds: ["service-governance-strategy"],
    relatedLearningIds: ["learning-governance-essentials"],
    followUpIds: ["A4", "A2", "A6"],
    source: "PUBLIC",
    sourceNote: "Close to verbatim from the ISV products page. Product names replaced with portal areas, lineage in data/areas.ts.",
  },
  {
    id: "A6",
    question:
      "Who do I contact at ISV about an employment relations question?",
    matchTerms: [
      "employment",
      "relations",
      "staff",
      "industrial",
      "workplace",
      "contact",
      "employee",
      "enterprise",
      "agreement",
    ],
    relevantTo: ["principal", "business-manager"],
    answer:
      "The resource library holds policies, procedures and templates covering people and culture, which includes employment matters. For a question specific to your school, you can request employment relations support through the portal and an ISV adviser will follow up, or contact ISV directly on 03 9825 7200.",
    sources: [
      {
        refId: "resource-people-culture",
        refType: "content",
        title: "People and culture policies and templates",
        isvSystem: "area-resources",
        recencyLabel: "Maintained by ISV",
      },
      {
        refId: "resource-governance",
        refType: "content",
        title: "Governance, compliance and risk resources",
        isvSystem: "area-resources",
        recencyLabel: "Maintained by ISV",
      },
    ],
    relatedResourceIds: [
      "resource-learning-wellbeing",
      "resource-compliance-policies",
    ],
    relatedServiceIds: ["service-employment-relations"],
    relatedLearningIds: ["learning-employment-relations"],
    followUpIds: ["A1", "A2", "A3"],
    source: "PUBLIC",
    sourceNote:
      "Contact details are published, and the resource library description derives from isConnect's published navigational areas. The employment relations service is ILLUSTRATIVE and is deliberately kept out of the sources band: citing an invented service as an attributed source undermines the thing the source band exists to demonstrate. Match term 'hr' was removed because it substring-matches 'through'.",
  },
  {
    id: "A7",
    question: "How do we advertise a vacancy at our school?",
    matchTerms: [
      "advertise",
      "vacancy",
      "vacancies",
      "job",
      "recruit",
      "hire",
      "hiring",
      "applicant",
      "resume",
      "opportunity",
    ],
    relevantTo: ["business-manager"],
    answer:
      "ISV's careers and employment area serves Independent schools across Victoria. Member Schools can advertise employment vacancies, search resumes and manage email applications, and publish a school profile to help attract suitable applicants.",
    sources: [
      {
        refId: "resource-isrecruit-overview",
        refType: "content",
        title: "Advertising a vacancy at your school",
        isvSystem: "area-employment",
        recencyLabel: "Maintained by ISV",
      },
      {
        refId: "resource-people-culture",
        refType: "content",
        title: "People and culture policies and templates",
        isvSystem: "area-resources",
        recencyLabel: "Maintained by ISV",
      },
    ],
    relatedResourceIds: ["resource-governance", "resource-compliance-policies"],
    relatedServiceIds: ["service-employment-relations"],
    relatedLearningIds: ["learning-employment-relations"],
    followUpIds: ["A6", "A2", "A1"],
    source: "PUBLIC",
    sourceNote: "Close to verbatim from the ISV products page. Product names replaced with portal areas, lineage in data/areas.ts.",
  },
] satisfies AskIsvEntry[];

/** DATA-SPEC s13. Every id here must be reachable by that persona. */
export const suggestedQuestionIds: Record<string, string[]> = {
  principal: ["A1", "A4", "A5", "A3"],
  "business-manager": ["A6", "A7", "A1", "A2"],
};

export const noMatchCopy = {
  headline: "I can't answer that from ISV's current knowledge base.",
  body: "Try one of the questions below, or contact ISV directly and someone will help.",
};
