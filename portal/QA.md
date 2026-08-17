# QA — current state

Test definitions live in PRD section 18. This file records what passes today.

Run `npm run verify` to reproduce the automated rows.

## Automated

```
npm run verify
```

| Row | Test | Status |
|---|---|---|
| B1 | Zero inline styles in `/src` | Pass |
| B2 | Zero CSS-in-JS imports | Pass |
| B3 | Zero Tailwind arbitrary values in `/src` | Pass |
| B5 | `tsc --noEmit` clean | Pass |
| B6 | ESLint clean | Pass |
| I1 | Every fixture record carries a valid source | Pass |
| I2 | No `ILLUSTRATIVE` service in an Ask ISV sources band | Pass |
| I5 | No answer states what a regulation requires | Pass |
| I6 | No response time or service level anywhere | Pass |
| S5 | No platform named in member-facing copy | Pass |
| A2 | Every answer carries at least two sources | Pass |
| A5 | Every follow-up reachable by every persona that reaches the parent | Pass |
| A9 | Related resources band non-empty for every persona after filtering | Pass |
| A11 | Whole-token matching, not substring | Pass |
| A12 | Every source reachable by every persona that reaches it | Pass |
| A13 | No id in both the sources band and a related band | Pass |
| P1 | At least five visible differences between the two landings | Pass |
| P7 | No more than three cued modules per persona | Pass |
| P8 | Interest-cued module resolves via `interestTags` | Pass |
| REF | Every module `itemId` resolves | Pass |
| U1 | No update asserts a requirement, deadline or commencement | Pass |
| U2 | Every update describes ISV activity | Pass |
| U3 | Every update is `ILLUSTRATIVE` with an explanation | Pass |
| U4 | Both personas see at least three updates | Pass |
| E1 | Every dated event or session has a format | Pass |
| E2 | Both personas have an event near their school | Pass |

25 automated checks in total, plus 14 Ask ISV matching cases covering all seven scripted questions, persona scoping in both directions, the two substring traps, and two off-script queries.

## Render smoke test

Production build served locally, all six routes returning 200 with expected content. Verified present on the Principal landing: greeting, member name, school, seeded request `ISV-2026-04817`, both personalisation cues, three role-appropriate services, the Discovery notes, and the empty saved-resources state. Verified absent: every banned platform name, every internal source field.

`/requests/does-not-exist` renders the defined empty state rather than crashing.

## Not yet run

These need a human and a browser. They are printed at the end of every `npm run qa`.

| Row | Test |
|---|---|
| N1, N2, N3 | Full narrative run, under two minutes, no reload between steps 7 and 16 |
| N4 | Unbriefed viewer describes all three acts |
| P2, P4 | Component identity by inspection; switch under 500ms with no layout shift |
| A3, A7, A8, A10, A14 | Source ordering, focus trap, `⌘K` reachability, state clearing, session retention |
| X4 | Contrast — recomputed by hand and passing, but not yet machine-verified in browser |
| S1, S2, S3, S4, S6, S7, S8 | Prefill correctness, validation, confirmation, persistence, contact panel, unknown id, inert nav |
| X1, X2, X3, X5, X6, X7 | axe scan, keyboard, focus visibility, reduced motion, zoom, screen reader |
| R1 to R4 | Breakpoints, mobile Ask ISV sheet, touch targets, horizontal overflow |
| I7 | School and persona name collision check |
| Layout | Tile rows fill at 1280px and 1920px for both personas, with no orphan cells |

## Known issues

| Issue | Severity | Notes |
|---|---|---|
| Contrast fixed at the primitive layer | Resolved | `--isv-ink-faint` was failing AA on paper, warm and sand. Now clears 4.5:1 on all three |
| Control borders fixed | Resolved | New `--color-line-control` meets the 3:1 non-text requirement |
| Four news items carry the fixture authoring date | Must fix before showing | Marked `VERIFY-DATE` in `src/data/content.ts`. Real ISV posts, so the dates are checkable |
| Arts Learning Festival date and location are assumed | Must fix before showing | Real ISV event. Read the real values |
| Brand palette is a strategy, not ISV's | Must fix before showing | Sample into the primitive token block |
| Artwork panels are CSS placeholders | Should fix | Replace with isArtworks assets, subject to licensing |
| Serif is a system stack | Should fix | Palatino / Iowan Old Style renders well on macOS. A licensed editorial serif would carry the direction further |
| Discovery-status copy removed by direction | Accepted | PRD s12 specified four Discovery surfaces. All removed so the prototype presents as finished. The framing moves to the spoken walkthrough |
| `next build` fails on the workspace mount | Cosmetic | Mount blocks `unlink` during export cleanup. Use `NEXT_DIST_DIR`. `npm run dev` is unaffected |
