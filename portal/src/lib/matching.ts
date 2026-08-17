import { askIsvEntries, suggestedQuestionIds } from "@/data/ask-isv";
import type { AskIsvEntry, Role } from "@/types";

/**
 * PRD.md section 10. Fully specified so two builders produce identical
 * behaviour.
 *
 * 1. Lowercase the query and strip punctuation
 * 2. Split on whitespace into tokens
 * 3. One point per matchTerm equal to a query token EXACTLY
 * 4. Filter candidates to the active persona
 * 5. Highest score wins, threshold two matched terms
 * 6. Tie-break by entry order, lowest id first
 *
 * Whole-token matching only. Substring matching is a build defect: under it
 * "term" in A4 matches "determine" and "where" in A2 matches "everywhere".
 */

export const MATCH_THRESHOLD = 2;

export function tokenise(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function scoreEntry(entry: AskIsvEntry, tokens: string[]): number {
  const unique = new Set(tokens);
  return entry.matchTerms.filter((term) => unique.has(term.toLowerCase()))
    .length;
}

export function entriesForRole(role: Role): AskIsvEntry[] {
  return askIsvEntries.filter((entry) => entry.relevantTo.includes(role));
}

export function matchQuery(query: string, role: Role): AskIsvEntry | null {
  const tokens = tokenise(query);
  if (tokens.length === 0) return null;

  const scored = entriesForRole(role)
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter((candidate) => candidate.score >= MATCH_THRESHOLD)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.id.localeCompare(b.entry.id);
    });

  return scored[0]?.entry ?? null;
}

export function getEntry(id: string): AskIsvEntry | undefined {
  return askIsvEntries.find((entry) => entry.id === id);
}

export function suggestedForRole(role: Role): AskIsvEntry[] {
  return (suggestedQuestionIds[role] ?? [])
    .map((id) => getEntry(id))
    .filter((entry): entry is AskIsvEntry => Boolean(entry))
    .filter((entry) => entry.relevantTo.includes(role));
}

export function followUpsFor(entry: AskIsvEntry, role: Role): AskIsvEntry[] {
  return entry.followUpIds
    .map((id) => getEntry(id))
    .filter((f): f is AskIsvEntry => Boolean(f))
    .filter((f) => f.relevantTo.includes(role));
}
