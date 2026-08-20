# Decisions — build phase

Product and scope decisions live in the PRD decision log. This file records decisions made during the build.

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-17 | Fixtures authored as TypeScript with `satisfies` and an explicit type annotation, not JSON | DATA-SPEC required fixtures to be "typed at import" so a malformed fixture fails the build. A JSON import plus a cast does not do that. `satisfies` gives real compile-time failure. The explicit annotation is also needed: `satisfies` alone narrows `relevantTo` to literal tuples and breaks `Array.includes` |
| 2026-08-17 | Tailwind v4 with CSS-first `@theme` | The token architecture the PRD specifies maps directly onto `@theme`. Semantic tokens become utilities, so `bg-field-sand` is the only way to reach that colour and raw hex cannot enter a component |
| 2026-08-17 | Component classes in `@layer components` for artwork, timeline connectors, index hover and stagger | These need percentage positioning, pseudo-element connectors and nth-child delays. Expressing them as Tailwind arbitrary values would breach QA B3. Every value in them still resolves through a token |
| 2026-08-17 | Module stagger by `:nth-child` rather than an inline custom property | The obvious implementation passes the index through `style={{ "--module-index": i }}`, which is an inline style and fails QA B1. Position-based delays achieve the same thing |
| 2026-08-17 | Interest-driven learning module ordered by match count, descending | DATA-SPEC s14 listed a fixed order. Sorting by how many of the member's interests a session matches is more honest for a module cued "Based on your interests", and it produces the specified order for the Business Manager. The Principal order differs from the table by one position |
| 2026-08-17 | `resource-people-culture` relevant to both roles, not Business Manager only | It is a source for A6, which both personas can reach. Restricted to one role it would leave a Principal with a single source, breaching the two-source minimum. A Principal cares about employment policy, so this is also just correct |
| 2026-08-17 | Greeting resolved after mount, not during render | The portal page is prerendered at build time, so a time-based greeting computed during render is baked in and mismatches on hydration. Caught by the render smoke test |
| 2026-08-17 | `distDir` overridable by `NEXT_DIST_DIR` | The workspace mount does not permit `unlink`, so Next's export cleanup fails there. Verification builds redirect output. Does not affect `npm run dev` |
| 2026-08-17 | ESLint covers inline styles and CSS-in-JS. Arbitrary values are checked by `scripts/qa.mjs` | `eslint-config-next` is currently incompatible with ESLint 9 in this toolchain. Rather than pin an old version, the two rules the PRD actually mandates are enforced directly, and the arbitrary-value check lives in the QA gate where it can be scoped to visual utilities and not fire on `data-[...]` variants |
| 2026-08-17 | Radix `data-highlighted` styling moved to a `.menu-item` class | Keeps the arbitrary-value grep a clean signal rather than something with known exceptions |
| 2026-08-17 | Ask ISV sources render as buttons, and only service sources navigate | Content sources point at resource areas the prototype does not build through. A link that goes nowhere is worse than one that visibly does nothing |
| 2026-08-17 | No Playwright, no automated screenshots | Browser binaries cannot install in the build sandbox. Verification is a render smoke test against the production server plus the manual checklist in the QA gate output |

## Fixes after code review

A review pass against the PRD and DATA-SPEC found 38 issues. The substantive resolutions:

| Decision | Rationale |
|---|---|
| `--isv-ink-faint` darkened from `#8C857A` to `#6B6459` | It measured 3.50:1 on paper and 2.86:1 on sand, and it carries most of the small type in the product. Now 5.60:1 and 4.58:1. A primitive-layer edit, so nothing else changed |
| New `--color-line-control` at a higher contrast than `line-firm` | Control boundaries need 3:1 under WCAG 1.4.11. `line-firm` is a hairline rule colour and measures 1.61:1, which is right for a rule and wrong for the edge of a text input |
| Ask ISV state moved into `MemberContext` | The overlay is mounted per route, so component-local state was lost on every navigation. PRD s10 requires the last answer to survive to the end of the session |
| Content sources render as static rows; only service sources are buttons | They were buttons that closed the overlay and pushed a hash. The natural gesture after "sources appear" is to click source 01, and that wiped the answer off the screen mid-demo |
| `IndexList` rows and content cards are no longer interactive | They had hover affordances and no handlers, so they were invisible to keyboard and screen reader while looking live. Five index rows also all pointed at the same anchor |
| Answers stream in sentence chunks over ~1s | PRD s10 specified streaming and the build showed the whole answer at once, making the default and reduced-motion paths identical |
| Related learning band implemented, and specified for all seven entries | `relatedLearningIds` was authored and never rendered, so A4 was missing a band the PRD hierarchy requires |
| Ask ISV full-screen breakpoint moved from `sm` to `md` | Tailwind's `sm` is 640px. PRD s16 and QA R2 require full screen below 768px, so 640 to 767 was showing an inset card |
| Discovery sentence moved from per-chip to per-group | It appeared seven times on a landing page. PRD s12 says keep it quiet; at seven instances it read as hedging |
| Profile and contact panel state lifted to context | Three prominent "Contact ISV" buttons and both live nav items did nothing. PRD s12 says the contact action must do something when clicked |
| `requestLabel` added to `Service` | The button copy was derived by string-matching the service name, which would silently mislabel any third requestable service |
| Form values re-sync when the member changes | Switching role with the form open kept the previous member's details while the header showed the new one, and submitted under a mismatched identity |
| News module moved to the clay field; saved-resources module to sand | Clay was defined in the approved field system and never used, so the system shipped a tone thinner than signed off. Sand is reserved for the member's own items |
| Artwork added to the confirmation screen | The approved imagery budget is three: sign-in, news feature, confirmation. The closing beat had lost its one |
| Principal greeting rewritten | It claimed a compliance request when the request on screen is an employment relations one, and asserted resource updates that no fixture supports |
| `.control` classes replace per-field styling | Border, focus, invalid and prefill states were duplicated four times, which is why the contrast and labelling defects had to be fixed in four places |

## Open

| Item | Needed by | Owner |
|---|---|---|
| ISV brand sample into the primitive token block | Before the pitch | Credera |
| isArtworks licensing confirmation for portal use | Before the pitch | Credera |
| Real publication dates for the four news items | Before the pitch | Credera |
| RFP verification of the two requestable advice services | Before fixtures are final | Credera |
| School and persona name collision check | Before the pitch | Credera |
| Editorial serif licence, if the Palatino stand-in is replaced | Before the pitch | Credera |


## Round two — depth on the landing page

Feedback: the artwork blended into the page, news alone was not enough, and events and learning were thin.

| Decision | Rationale |
|---|---|
| New "What's changed" module, second on both landing pages | News is editorial. It does not answer "what has moved since I last looked", which is the actual first question a Principal or Business Manager has. This is the module that makes the portal read as live rather than static |
| Updates are written in ISV voice and never assert a requirement | "ISV has refreshed its child safety templates" is a fact about ISV. "Schools must review their child safety policy by March" is advice ISV has not authorised. Two QA checks enforce this: U1 bans requirement, deadline and commencement language; U2 requires every summary to describe ISV activity |
| Events and learning gained dates, formats, locations and a region | Three items with no date is a list. Nine with "In 3 weeks · In person · Hawthorn" is a calendar. The depth is what makes the module credible |
| Location matching against the school region | Earns the "Relevant to your school" cue, which was defined in the type and never used. School and event both carry a region, and a match renders "Near your school" |
| Relative dates derived, never authored | "2 days ago" and "In 3 weeks" are computed from the ISO date. Authoring them would go stale the moment the demo is not run on the build date |
| Artwork ground moved to sand-deep | It used `--color-sunken` (#F5F1E8) and the news module sits on the clay field (#F6E9E2). Two percent apart, so the panel vanished into the page. One shape was also sand-deep and had to move to ink |
| Saved-resources module removed | It was never in DATA-SPEC, it implied a save capability the PRD does not cover, and the page did not need another module once updates arrived |
| Verification no longer needs a native binary | `tsx` broke the moment the dependency tree was reinstalled for macOS. A resolve hook plus Node's own type stripping runs the whole QA gate on plain Node, on any platform |


## Round three — lead-and-stack, mosaic, and holding the editorial line

Direction: updates treatment A at the top of the page, mosaic tiles as an in-page element, editorial system retained throughout.

| Decision | Rationale |
|---|---|
| Updates module becomes lead-and-stack | One item carries the weight, three compress to single rows, and a counter panel uses the width the uniform list was wasting. The counter is a number about the member, which is what makes the personalisation claim land |
| Mosaic tiles for browse modules only | Services, events, learning and news are browsed. Updates, requests and resources are scanned, and rows scan faster than tiles. Applying tiles by job rather than uniformly keeps the brief's "grid of unrelated cards" warning satisfied |
| Colour moved out of the page field and into the tile | With tiles carrying tone, coloured full-width fields underneath them compete. Fields alternate paper and warm now, and the tiles hold the colour |
| Tile radius 4px, not 18px | The first pass used bento softness. That reads as a different product to the editorial system signed off, so radius came back to the ruled scale, tiles took hairlines, and the hover lift became a ground shift matching the index rows |
| Tile spans computed to fill the row | Four columns with three or five items leaves a visible hole. The learning module caps at a lead plus two, the news remainder runs full width, and the events counter absorbs whatever is left |
| Filter bars removed, Discovery-status copy removed | The dashed disabled chips read as unfinished and the caveats undercut a sales asset. Noted as a deliberate reversal of PRD s12: the prototype now presents as complete, and the Discovery framing moves to the spoken walkthrough |
| Hairline grid technique changed | Cells previously sat on a line-coloured background with 1px gaps, so an incomplete final row rendered as a filled slab. Borders now sit on the cells, so empty space stays empty |
| Portal navigation became two ruled columns | Seven items never divide into three columns. Sub-labels and the Discovery note came out, and every item now presents as a real destination |

## 2026-08-20 — Rebrand to the new ISV identity

ISV launched a new brand. Royal Blue `#2985e0`, Deep Blue `#2756a0`, Ocean
Blue `#a0dbec`, Sunshine Yellow `#fce17c`, plus the logo's own `#0071b9`.
Values supplied by Cale; the logo blue was read from the wordmark SVG on
is.vic.edu.au.

**Decision: replace, not theme.** No toggle, no legacy palette. Walking into
an ISV room with the identity they retired is worse than any polish item on
the list.

**Deep is the action colour, not Royal.** Royal is the brighter blue and
reads as the obvious primary. At 3.80:1 on white it fails AA for text.
Deep clears 4.5:1 at 7.18. Royal is now reserved for things that are seen
rather than read — focus rings, marks, the logo gradient, large display
type. QA check C4 fails the build if `--color-action` ever points anywhere
but Deep.

**Ocean and Sunshine inverted.** The old red and gold were dark blocks
carrying white text. Both new colours are *lighter* than most page grounds
— 1.52:1 and 1.30:1 — so they are bright tints carrying dark text. Every
tile, the masthead alert and the story cards flipped. This is the single
biggest behavioural change and the one most likely to catch a future
contributor out, hence C3.

**Neutrals moved from warm to cool.** The old ramp was warm because navy
and red go corporate against pure white. ISV's stated intent is freshness
and clarity; warm greys read as heritage against it.

**The serif is gone.** Palatino said 1949. The new wordmark is a light
geometric sans and its lightness does most of the work, so display sizes
drop in weight rather than reaching for a second family. Avenir Next ships
on macOS and is the closest match to the wordmark, so the demo machine
renders the intended thing without a webfont dependency. Nunito Sans is the
fallback. Replace with ISV's licensed font when it arrives — one token.

**Radius held at 4px, deliberately.** The new mark is entirely curve and the
obvious move is to soften the interface to match. That would make the portal
look like every other SaaS product. A fluid logo against a disciplined
interface is a position, and it is now a position rather than a default —
worth being able to defend out loud.

**Four contrast checks added to QA.** With two brand colours lighter than
the page and one blue failing AA, the palette is one careless swap from an
inaccessible product. C1–C4 read the real hex values out of globals.css and
do the maths on every run.

Outstanding: confirm the four hex values against the brand guide, and get
the licensed brand font name.
