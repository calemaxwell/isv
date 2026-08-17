/**
 * Portal areas.
 *
 * ISV's published products (isComply, isConnect, isLearn, isAnalyse, isLEAD,
 * isRecruit) are treated as areas of one portal rather than as separate
 * applications. That is a better product story and it is what the RFP asks
 * for: one connected member experience, not seven front doors.
 *
 * SOURCE NOTE. Those product names were the strongest grounding this
 * prototype had, because every one of them is published on is.vic.edu.au.
 * Removing them means attribution now points at portal areas, which are
 * ILLUSTRATIVE constructs. The underlying capability each area describes is
 * still traceable to a real ISV product, recorded in `derivedFrom` below so
 * the lineage survives even though the name does not appear on screen.
 */

export interface PortalArea {
  id: string;
  label: string;
  /** The published ISV product this area's capability comes from */
  derivedFrom: string;
  /**
   * Where the area opens. Areas the prototype does not build through point
   * at the closest screen that is real, rather than at an anchor — a menu
   * item that scrolls you back to the menu is worse than no menu item.
   */
  href: string;
}

export const portalAreas: PortalArea[] = [
  {
    id: "area-employment",
    href: "/resources?topic=people-culture",
    label: "Employment and HR",
    derivedFrom: "ISV employment relations and isRecruit, is.vic.edu.au",
  },
  {
    id: "area-process",
    href: "/resources",
    label: "Process Management",
    derivedFrom: "ILLUSTRATIVE. No single published ISV product maps to this.",
  },
  {
    id: "area-compliance",
    href: "/resources",
    label: "Compliance",
    derivedFrom: "isComply, is.vic.edu.au/products",
  },
  {
    id: "area-insights",
    href: "/resources",
    label: "Insights",
    derivedFrom: "isAnalyse and isLEAD, is.vic.edu.au/products",
  },
  {
    id: "area-learning",
    href: "/events",
    label: "Learning",
    derivedFrom: "isLearn and ISV learning and development",
  },
  {
    id: "area-events",
    href: "/events",
    label: "Events",
    derivedFrom: "ISV events programme, is.vic.edu.au",
  },
  {
    id: "area-news",
    href: "/news",
    label: "News",
    derivedFrom: "ISV Perspectives, is.vic.edu.au",
  },
  {
    id: "area-resources",
    href: "/resources",
    label: "Resource library",
    derivedFrom: "isConnect, is.vic.edu.au/products",
  },
];

/**
 * Not navigation. Content attributed to ISV itself rather than to one area
 * of the portal still needs a label, but it does not belong in the menu.
 */
export const supportingAreas: PortalArea[] = [
  {
    id: "area-isv",
    href: "/news",
    label: "ISV",
    derivedFrom: "is.vic.edu.au",
  },
];

export type AreaId = (typeof portalAreas)[number]["id"];

export function areaLabel(id: string): string {
  return (
    [...portalAreas, ...supportingAreas].find((a) => a.id === id)?.label ??
    "ISV"
  );
}
