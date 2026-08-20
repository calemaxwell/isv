import { allContent, events, learning, news, updates } from "@/data/content";
import { members } from "@/data/members";
import { moduleComposition } from "@/data/modules";
import { school } from "@/data/school";
import { services } from "@/data/services";
import type {
  ContentItem,
  Member,
  ModuleDef,
  Role,
  School,
  Service,
  ServiceRequest,
} from "@/types";

/**
 * Every role-based and interest-based rule in the prototype lives in this
 * file. PRD QA P5: no component filters by role. Components receive data and
 * render it.
 */

export function getMember(role: Role): Member {
  const found = members.find((m) => m.role === role);
  if (!found) throw new Error(`No member fixture for role: ${role}`);
  return found;
}

export function getSchool(): School {
  return school;
}

export function fullName(member: Member): string {
  return `${member.firstName} ${member.lastName}`;
}

export function getContent(id: string): ContentItem | undefined {
  return allContent.find((c) => c.id === id);
}

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function requestableServices(): Service[] {
  return services.filter((s) => s.requestable);
}

/** Persona filter. The single place relevantTo is applied. */
export function isRelevantTo<T extends { relevantTo: Role[] }>(
  item: T,
  role: Role,
): boolean {
  return item.relevantTo.includes(role);
}

export function selectContentByIds(ids: string[], role: Role): ContentItem[] {
  return ids
    .map((id) => getContent(id))
    .filter((c): c is ContentItem => Boolean(c))
    .filter((c) => isRelevantTo(c, role));
}

export function selectServicesByIds(ids: string[], role: Role): Service[] {
  return ids
    .map((id) => getService(id))
    .filter((s): s is Service => Boolean(s))
    .filter((s) => isRelevantTo(s, role));
}

/**
 * The interest join. Professional learning selects on Member.interests
 * matched against ContentItem.interestTags rather than on role, ordered by
 * match count so the strongest match leads. There is no label announcing
 * this: the member sees different sessions, which is the point.
 */
/**
 * Every learning item open to a role, in date order.
 *
 * Separate from selectInterestLearning on purpose. That one is the
 * personalisation claim and must stay driven by interestTags; this one is
 * the plain role filter used to fill out a list once the interest matches
 * are exhausted.
 */
export function selectRoleLearning(role: Role): ContentItem[] {
  return learning
    .filter((item) => isRelevantTo(item, role))
    .sort((a, b) => (a.eventIso ?? "").localeCompare(b.eventIso ?? ""));
}

export function selectInterestLearning(member: Member): ContentItem[] {
  const interests = member.interests.map((i) => i.toLowerCase());

  return learning
    .filter((item) => isRelevantTo(item, member.role))
    .map((item) => ({
      item,
      matches: item.interestTags.filter((tag) =>
        interests.includes(tag.toLowerCase()),
      ).length,
    }))
    .filter((entry) => entry.matches > 0)
    .sort((a, b) => {
      if (b.matches !== a.matches) return b.matches - a.matches;
      return (a.item.eventIso ?? "9999").localeCompare(b.item.eventIso ?? "9999");
    })
    .map((entry) => entry.item);
}

export function selectModules(role: Role): ModuleDef[] {
  return moduleComposition[role];
}

/** Most recent first. The module that makes the portal feel live. */
export function selectUpdates(role: Role, limit = 4): ContentItem[] {
  return updates
    .filter((item) => isRelevantTo(item, role))
    .sort((a, b) => b.publishedIso.localeCompare(a.publishedIso))
    .slice(0, limit);
}

/** Soonest first. Events and learning are both date-bearing. */
export function selectUpcoming(items: ContentItem[], role: Role): ContentItem[] {
  return items
    .filter((item) => isRelevantTo(item, role))
    .sort((a, b) => (a.eventIso ?? "9999").localeCompare(b.eventIso ?? "9999"));
}

/** Latest news for a persona, newest first. */
export function selectNews(role: Role): ContentItem[] {
  return news
    .filter((item) => isRelevantTo(item, role))
    .sort((a, b) => b.publishedIso.localeCompare(a.publishedIso));
}

export function selectEvents(role: Role): ContentItem[] {
  return selectUpcoming(events, role);
}

/**
 * Near the member's school. Compares the event region to the school region.
 * Rendered as a quiet marker on the tile, not as a module-level label.
 */
export function isNearSchool(item: ContentItem): boolean {
  return Boolean(item.region) && item.region === school.region;
}

/** "3 days ago", "Last week". Derived, never authored. */
export function relativeDate(iso: string, from: Date = new Date()): string {
  if (!iso) return "";
  const then = new Date(`${iso}T00:00:00`);
  const days = Math.round(
    (from.setHours(0, 0, 0, 0) - then.getTime()) / 86_400_000,
  );

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "Last week";
  if (days < 31) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(iso);
}

/** "In 3 weeks", "Next week". Used on events and learning. */
export function relativeUpcoming(iso: string, from: Date = new Date()): string {
  if (!iso) return "";
  const then = new Date(`${iso}T00:00:00`);
  const days = Math.round(
    (then.getTime() - from.setHours(0, 0, 0, 0)) / 86_400_000,
  );

  if (days < 0) return "Passed";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  if (days < 14) return "Next week";
  if (days < 31) return `In ${Math.floor(days / 7)} weeks`;
  const months = Math.round(days / 30);
  return months <= 1 ? "Next month" : `In ${months} months`;
}

/**
 * The same phrase, for use inside a sentence.
 *
 * relativeUpcoming is sentence case because it usually stands alone in a pill
 * or an eyebrow. Dropped mid-sentence it produced "due Next month", which is
 * the kind of thing that reads as sloppy long before anyone works out why.
 */
export function relativeUpcomingInline(
  iso: string,
  from: Date = new Date(),
): string {
  const phrase = relativeUpcoming(iso, from);
  return phrase ? phrase.charAt(0).toLowerCase() + phrase.slice(1) : phrase;
}

export function selectRequests(
  requests: ServiceRequest[],
  member: Member,
): ServiceRequest[] {
  return requests
    .filter((r) => r.submittedByMemberId === member.id)
    .sort((a, b) => b.submittedIso.localeCompare(a.submittedIso));
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatDateWithYear(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function greetingForTime(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
