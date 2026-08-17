/**
 * Ask ISV matching tests. PRD s18 rows A1, A4 and A11.
 *
 * A11 in particular is the reason whole-token matching is specified: under
 * substring matching "term" matches "determine" and "where" matches
 * "everywhere", and both would silently return a wrong answer in the demo.
 */
import { matchQuery } from "../src/lib/matching";
import type { Role } from "../src/types";

const cases: [string, Role, string | null][] = [
  ["What do we need for the Child Safe Standards?", "principal", "A1"],
  ["child safety policies", "business-manager", "A1"],
  ["where are the model policies", "principal", "A2"],
  ["school registration obligations", "principal", "A3"],
  ["what professional learning is available this term", "principal", "A4"],
  ["how do we benchmark performance data", "principal", "A5"],
  ["contact about employment relations", "business-manager", "A6"],
  ["how do we advertise a job vacancy", "business-manager", "A7"],

  // Persona scoping
  ["how do we advertise a job vacancy", "principal", null],
  ["how can we benchmark performance data", "business-manager", null],

  // A11 — whole-token matching, not substring
  ["help me determine our long term direction", "principal", null],
  ["is this available everywhere", "principal", null],

  // Off script, the designed no-match state
  ["what is the weather in melbourne today", "principal", null],
  ["can you write my newsletter", "business-manager", null],
];

let failed = 0;
for (const [query, role, expected] of cases) {
  const got = matchQuery(query, role)?.id ?? null;
  const ok = got === expected;
  if (!ok) failed += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"}  [${role.padEnd(16)}] ${(got ?? "no-match").padEnd(10)}` +
      `${ok ? "" : `expected ${expected ?? "no-match"} `}← "${query}"`,
  );
}

console.log(`\n${cases.length - failed}/${cases.length} matching cases passed.\n`);
process.exit(failed > 0 ? 1 : 0);
