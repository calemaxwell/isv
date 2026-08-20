import type { ModuleDef, Role } from "@/types";

/**
 * DATA-SPEC.md section 14.
 *
 * Both personas render from the same component tree. Only this composition
 * and the data it selects change.
 *
 * There are no personalisation cue labels. The content changing between
 * roles is the demonstration, and the greeting says what changed in plain
 * words. A chip reading "Based on your role" was telling the member what
 * they could already see.
 *
 * The learning module carries no itemIds: it is interest-driven and resolved
 * by selectInterestLearning, which matches ContentItem.interestTags against
 * Member.interests. That join is what makes the cue honest.
 */
/**
 * The two landings are ordered differently on purpose.
 *
 * A Principal opens the portal looking outward. What has moved in the
 * sector, what other schools are doing, where the thinking is going. Their
 * page leads with change and perspective; the transactional material sits
 * further down because it is not why they came.
 *
 * A Business Manager opens the portal with a job in hand. Their page leads
 * with open requests and the support pathways that close them, then the
 * templates, then everything else. Reading is the last thing they came for.
 *
 * So it is not the same page reordered. It is a different argument about
 * what the member is here to do, and the headings change with it — the same
 * module wears different language depending on who is reading it.
 */
export const moduleComposition: Record<Role, ModuleDef[]> = {
  /* ---------------------------------------------------------------
     Principal — outward and forward.
     Change → perspective → development → sector → support → admin.
     --------------------------------------------------------------- */
  principal: [
    {
      id: "mod-header",
      heading: "",
      itemType: "header",
      field: "paper",
      hasFilterBar: false,
      itemIds: [],
    },
    {
      id: "mod-updates",
      heading: "Across the sector",
      itemType: "update",
      field: "warm",
      moreLabel: "All updates",
      moreHref: "/news",
      hasFilterBar: false,
      itemIds: [],
    },
    {
      id: "mod-news",
      heading: "Perspectives",
      itemType: "content",
      field: "paper",
      moreLabel: "All perspectives",
      moreHref: "/news",
      hasFilterBar: false,
      itemIds: ["news-school-improvement", "news-complex-world"],
    },
    {
      id: "mod-learning",
      heading: "Your leadership development",
      itemType: "content",
      field: "warm",
      moreLabel: "All learning",
      moreHref: "/events",
      hasFilterBar: false,
      itemIds: [],
    },
    {
      id: "mod-events",
      heading: "Where the sector gathers",
      itemType: "content",
      field: "paper",
      moreLabel: "All events",
      moreHref: "/events",
      hasFilterBar: false,
      itemIds: [
        "event-principals-breakfast",
        "event-islead-briefing",
        "event-arts-learning-festival",
      ],
    },
    {
      id: "mod-parents",
      heading: "Support for parents",
      itemType: "parents",
      field: "mist",
      moreLabel: "The Parents Website",
      moreHref: "https://theparentswebsite.com.au",
      hasFilterBar: false,
      itemIds: [],
    },
    {
      id: "mod-resources",
      heading: "Thinking and frameworks",
      itemType: "content",
      field: "warm",
      moreLabel: "Resource library",
      moreHref: "/resources",
      hasFilterBar: false,
      itemIds: [
        "resource-vision-strategy",
        "resource-governance",
        "resource-learning-wellbeing",
      ],
    },
    {
      id: "mod-services",
      heading: "Bring ISV in",
      itemType: "service",
      field: "paper",
      moreLabel: "All support",
      moreHref: "/portal",
      hasFilterBar: false,
      itemIds: [
        "service-governance-strategy",
        "service-compliance-support",
        "service-employment-relations",
      ],
    },
    {
      id: "mod-requests",
      heading: "Your requests",
      itemType: "request",
      field: "sand",
      hasFilterBar: false,
      itemIds: [],
    },
    {
      id: "mod-nav",
      heading: "Explore the portal",
      itemType: "nav",
      field: "warm",
      hasFilterBar: false,
      itemIds: [],
    },
  ],

  /* ---------------------------------------------------------------
     Business Manager — inward and immediate.
     Open work → support → templates → change → training → reading.
     --------------------------------------------------------------- */
  "business-manager": [
    {
      id: "mod-header",
      heading: "",
      itemType: "header",
      field: "paper",
      hasFilterBar: false,
      itemIds: [],
    },
    {
      id: "mod-requests",
      heading: "Open with ISV",
      itemType: "request",
      field: "sand",
      hasFilterBar: false,
      itemIds: [],
    },
    {
      // Only the Business Manager sees this. Hiring is their work, and a
      // Principal who needs it goes through the menu like anything else.
      id: "mod-hiring",
      heading: "Hiring",
      itemType: "hiring",
      field: "paper",
      moreLabel: "Employment and HR",
      moreHref: "/employment",
      hasFilterBar: false,
      itemIds: [],
    },
    {
      id: "mod-services",
      heading: "Get an answer from ISV",
      itemType: "service",
      field: "paper",
      moreLabel: "All support",
      moreHref: "/portal",
      hasFilterBar: false,
      itemIds: [
        "service-employment-relations",
        "service-funding-finance",
        "service-compliance-support",
      ],
    },
    {
      id: "mod-resources",
      heading: "Templates and guidance",
      itemType: "content",
      field: "warm",
      moreLabel: "Resource library",
      moreHref: "/resources",
      hasFilterBar: false,
      itemIds: [
        "resource-people-culture",
        "resource-compliance-policies",
        "resource-child-safety",
        "resource-registration",
      ],
    },
    {
      id: "mod-updates",
      heading: "What's changed at ISV",
      itemType: "update",
      field: "paper",
      moreLabel: "All updates",
      moreHref: "/news",
      hasFilterBar: false,
      itemIds: [],
    },
    {
      id: "mod-learning",
      heading: "Training for you and your team",
      itemType: "content",
      field: "warm",
      moreLabel: "All learning",
      moreHref: "/events",
      hasFilterBar: false,
      itemIds: [],
    },
    {
      id: "mod-events",
      heading: "Coming up",
      itemType: "content",
      field: "paper",
      moreLabel: "All events",
      moreHref: "/events",
      hasFilterBar: false,
      itemIds: [
        "event-business-managers-forum",
        "event-registration-briefing",
        "event-arts-learning-festival",
      ],
    },
    {
      id: "mod-news",
      heading: "Worth a read",
      itemType: "content",
      field: "warm",
      moreLabel: "All news",
      moreHref: "/news",
      hasFilterBar: false,
      itemIds: ["news-business-manager-priorities", "news-inside-our-schools"],
    },
    {
      id: "mod-parents",
      heading: "Support for parents",
      itemType: "parents",
      field: "mist",
      moreLabel: "The Parents Website",
      moreHref: "https://theparentswebsite.com.au",
      hasFilterBar: false,
      itemIds: [],
    },
    {
      id: "mod-nav",
      heading: "Explore the portal",
      itemType: "nav",
      field: "paper",
      hasFilterBar: false,
      itemIds: [],
    },
  ],
};

/** Greeting copy. Names what changed, not just who the member is. */
export const greetingByRole: Record<Role, string> = {
  // Must match what is actually on the screen beneath it.
  principal:
    "Four ISV updates since you last looked, your employment relations request has moved forward, and three sessions are running near your school.",
  "business-manager":
    "One request open with ISV, four updates since you last looked, including refreshed people and culture templates, and two sessions near your school.",
};
