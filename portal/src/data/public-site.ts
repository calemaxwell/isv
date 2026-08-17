/**
 * The public ISV website.
 *
 * SOURCE. Almost everything here is PUBLIC and taken from is.vic.edu.au: the
 * positioning line, the purpose statement, the 1949 date, the address, the
 * ACN, the contact details and the Acknowledgement of Country are ISV's own
 * published words and are reproduced rather than invented.
 *
 * DELIBERATE OMISSION. The real site's footer lists the isEducation suite by
 * name (isConnect, isComply, isAnalyse, isLearn, isCommunicate, isRecruit,
 * isArtworks). Those are left out here on direction: the prototype's whole
 * argument is one connected portal rather than seven front doors, and
 * reproducing the seven-door footer on the way in would undercut it in the
 * room. Worth naming out loud in the walkthrough rather than hoping nobody
 * notices.
 */

export const isv = {
  positioning: "Independent Schools Victoria champions choice and diversity",
  purposeLine: "For students. For schools. For independence.",
  purpose: [
    "Since 1949, Independent Schools Victoria has been dedicated to diversity and choice in education.",
    "Through advocacy and support, we help families access schools that match the needs and values of every student.",
  ],
  phone: "03 9825 7200",
  email: "enquiries@is.vic.edu.au",
  address: "40 Rosslyn Street, West Melbourne VIC 3003",
  country: "Wurundjeri Country",
  acn: "ACN 661 541 439",
  acknowledgement:
    "Independent Schools Victoria acknowledges and pays respect to the original Custodians of this country. We are fully committed to reconciliation between Aboriginal and Torres Strait Islander Peoples and all other Australians.",
  source: "PUBLIC" as const,
  sourceNote: "is.vic.edu.au, reproduced.",
};

export interface PublicNavItem {
  /** Header. Short enough that seven of them fit on one line. */
  label: string;
  /** Footer and mobile, where there is room for the real thing. */
  longLabel: string;
  href: string;
}

/**
 * The real site's primary navigation, shortened for the header.
 *
 * "Learning and development" and "News and insights" are the site's own
 * section names and they belong in the footer, but seven labels of that
 * length wrap onto two lines and the bar stops reading as a bar. One word
 * each in the header, the full name everywhere there is room.
 */
export const publicNav: PublicNavItem[] = [
  { label: "About", longLabel: "About us", href: "#" },
  { label: "Schools", longLabel: "Independent schools", href: "#" },
  { label: "Learning", longLabel: "Learning and development", href: "/events" },
  { label: "News", longLabel: "News and insights", href: "/news" },
  { label: "Resources", longLabel: "Resources", href: "/resources" },
  { label: "Outreach", longLabel: "Outreach", href: "#" },
  { label: "Contact", longLabel: "Contact us", href: "#" },
];

/**
 * The three things the real homepage puts under "Site Highlights", rewritten
 * so they describe what a visitor gets rather than naming a product.
 */
export const highlights = [
  {
    id: "hl-compliance",
    eyebrow: "For member schools",
    title: "Compliance and reporting",
    body: "Guidance, templates and adviser support for schools working through registration, review and reporting.",
    href: "/resources",
  },
  {
    id: "hl-inside",
    eyebrow: "Inside our schools",
    title: "The diversity of Independent schools",
    body: "Victoria's Independent schools differ in size, philosophy, faith and the communities they serve. That diversity is the point.",
    href: "/news",
  },
  {
    id: "hl-news",
    eyebrow: "News and insights",
    title: "Perspectives from across the sector",
    body: "Media releases, sector commentary and practice from schools across Victoria.",
    href: "/news",
  },
];

/**
 * The audiences the site actually serves. The real homepage does not frame
 * itself this way, but the pitch argument is that a visitor arrives as one of
 * three people and the site should say so before they start hunting.
 */
export const audiences = [
  {
    id: "aud-families",
    title: "Choosing a school",
    body: "What Independent schools offer, how they differ, and how to find one that suits your child.",
    action: "For families",
    href: "#",
  },
  {
    id: "aud-schools",
    title: "Working in a school",
    body: "Advice, resources and professional learning for staff of ISV Member Schools.",
    action: "For member schools",
    href: "/sign-in",
  },
  {
    id: "aud-sector",
    title: "Following the sector",
    body: "ISV's position on the issues shaping education in Victoria, and the evidence behind it.",
    action: "For media and policy",
    href: "/news",
  },
];
