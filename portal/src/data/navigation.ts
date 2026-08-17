import type { NavItem } from "@/types";

/**
 * DATA-SPEC.md section 12.
 *
 * Every item now goes somewhere real. Where the prototype does not build an
 * area out, the item points at the closest screen that exists rather than at
 * an anchor — a navigation row that scrolls you back to the navigation is
 * worse than not offering it.
 */
export const portalNavigation: NavItem[] = [
  {
    id: "nav-resources",
    label: "Resources and knowledge",
    navigates: true,
    href: "/resources",
  },
  { id: "nav-events", label: "Events and sessions", navigates: true, href: "/events" },
  { id: "nav-news", label: "News and updates", navigates: true, href: "/news" },
  {
    id: "nav-learning",
    label: "Professional learning",
    navigates: true,
    href: "/events",
  },
  { id: "nav-upload", label: "Share content with ISV", navigates: true, href: "#contact" },
  { id: "nav-profile", label: "My profile", navigates: true, href: "#profile" },
  { id: "nav-contact", label: "Contact ISV", navigates: true, href: "#contact" },
] satisfies NavItem[];
