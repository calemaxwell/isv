/**
 * The Parents Website.
 *
 * ISV already publishes a substantial parent-facing masthead at
 * theparentswebsite.com.au. Schools share it with their communities but
 * mostly find it by accident, which is a waste of something ISV has already
 * built and paid for.
 *
 * Surfacing it in the member portal is the argument: the school's front door
 * to ISV should include the thing the school forwards to families. It also
 * demonstrates cross-property content without inventing anything.
 *
 * SOURCE. Titles, categories, read times and dates are taken from the live
 * site and are PUBLIC. The one-line summaries here are written for the
 * prototype rather than lifted, so they are marked as such. Verify the four
 * stories are still current before the pitch — this is a live masthead and
 * the front page moves.
 */

export interface ParentStory {
  id: string;
  title: string;
  /** Our own standfirst, not the site's */
  summary: string;
  category: "Features" | "News" | "Opinion";
  readMinutes: number;
  publishedIso: string;
  href: string;
  /**
   * ISV's own image from the live article. Not stock, so nothing here needs
   * a licensing caveat — it is ISV publishing ISV's picture.
   */
  imageUrl?: string;
  source: "PUBLIC";
  sourceNote: string;
}

const SITE = "https://theparentswebsite.com.au";

export const parentStories: ParentStory[] = [
  {
    id: "parents-teens-cars",
    title: "Teens and cars: what parents need to know",
    summary:
      "Maggie Dent on why capable teenagers still make poor decisions behind the wheel, and what helps.",
    category: "Features",
    readMinutes: 10,
    publishedIso: "2026-08-06",
    href: `${SITE}/teens-cars-what-parents-need-to-know-by-maggie-dent/`,
    imageUrl:
      "https://theparentswebsite.com.au/app/uploads/2025/03/Teens-driving-1800-1350x900.jpg",
    source: "PUBLIC",
    sourceNote:
      "Real article on theparentswebsite.com.au. Summary written for the prototype.",
  },
  {
    id: "parents-bullying",
    title: "What can you do if your child is being bullied?",
    summary:
      "Researchers Deborah Green and Barbara Spears on working with the school rather than around it.",
    category: "News",
    readMinutes: 6,
    publishedIso: "2026-08-11",
    href: `${SITE}/what-can-you-do-if-your-child-is-being-bullied/`,
    source: "PUBLIC",
    sourceNote:
      "Real article on theparentswebsite.com.au. Summary written for the prototype.",
  },
  {
    id: "parents-listening",
    title: "Listening is helping",
    summary:
      "Children rarely lead with the real concern. Ross Judd on hearing the thing underneath it.",
    category: "Features",
    readMinutes: 5,
    publishedIso: "2026-08-06",
    href: `${SITE}/listening-is-helping/`,
    imageUrl:
      "https://theparentswebsite.com.au/app/uploads/2025/03/Listening-1800a-1350x900.jpg",
    source: "PUBLIC",
    sourceNote:
      "Real article on theparentswebsite.com.au. Summary written for the prototype.",
  },
  {
    id: "parents-smartphone",
    title: "How can you tell if your child is ready for a smartphone?",
    summary:
      "Joanne Orlando on the alternatives, and the boundaries worth setting if the answer is yes.",
    category: "News",
    readMinutes: 7,
    publishedIso: "2026-07-30",
    href: `${SITE}/how-can-you-tell-if-your-child-is-ready-for-a-smartphone-what-are-the-alternatives/`,
    source: "PUBLIC",
    sourceNote:
      "Real article on theparentswebsite.com.au. Summary written for the prototype.",
  },
];
