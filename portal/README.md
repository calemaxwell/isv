# ISV Member Portal — Prototype

## What this is

A high-fidelity, interactive prototype of Independent Schools Victoria's future Member Portal. Front end only, mocked data, no live integrations.

It tells one story in three acts: **Know me → Help me find it → Help me do it**.

## Why it exists

ISV's RFP describes an outcome but not an experience. A member portal either feels like an intelligent workspace or it feels like a website with a login, and no amount of prose settles which one is being proposed. This gives ISV something to react to.

Full context in [`../PRD.md`](../PRD.md). Every piece of content traces to [`../DATA-SPEC.md`](../DATA-SPEC.md).

## How to run it

```bash
cd portal
npm install
npm run dev
```

Then open <http://localhost:3000>.

## How to use it

The demo is a single continuous journey. Run it in this order.

**Act 1 — Know me**

1. Sign in. There is no authentication; the button transitions you into the portal as the Principal.
2. The landing page is composed for a Principal: an open request, leadership-relevant news, strategy resources, and services that match the role.
3. Switch role to Business Manager using the control in the header. The page reprioritises without navigating or reloading. Same components, different composition.
4. Switch back to Principal.

**Act 2 — Help me find it**

5. Press `⌘K` or click the search field. Ask ISV opens as a full-screen overlay on the ink field.
6. Ask: *"What do we need to have in place for the Child Safe Standards this year?"*
7. The answer streams in. Sources appear only after it finishes, which is deliberate.
8. Follow the related service through to compliance support.

**Act 3 — Help me do it**

9. On the service page, choose **Request compliance support**.
10. Your name, role, school, email and phone are already filled in, marked "From your ISV member profile".
11. Submit without a description to see validation, then complete and submit.
12. The confirmation carries a reference, a status and a clear next step.
13. Return to the portal. The new request is listed alongside the seeded one.

**Worth showing deliberately:** ask Ask ISV something off-script. It declines and offers a human. That is a designed state, not a failure, and it is why an unexpected question from the room cannot break the demo.

## Verification

```bash
npm run verify     # typecheck, lint, QA gate, matching tests
npm run qa         # QA gate only
```

`npm run qa` runs the machine-checkable rows of PRD section 18: no inline styles, no CSS-in-JS, no Tailwind arbitrary values, source integrity, Ask ISV chain integrity, cue budget, referential integrity. It prints the manual checks that still need a human at the end.

## How it is built

| Concern | Approach |
|---|---|
| Framework | Next.js App Router, React 19, TypeScript |
| Styling | Tailwind CSS v4, three-layer token system in `src/app/globals.css` |
| Behaviour | Radix UI for dialogs, menus and focus management |
| Data | Typed fixtures in `src/data`, validated at compile time |
| Role logic | All of it in `src/lib/selectors.ts`. No component filters by role |

### Token layers

1. **Primitive** — the raw palette in `:root`. The only place brand values live. Replacing the ISV brand means editing this block and nothing else.
2. **Semantic** — mapped into the Tailwind theme, so every utility resolves through a named role rather than a raw value.
3. **Component** — control heights, field padding, cell padding.

### The colour field system

Colour separates modules and sets pace, replacing the card wall. A field carries a whole module, never a single card.

| Field | Job |
|---|---|
| Paper | Primary reading surface |
| Warm | Quiet separation |
| Sand | The member's own items. Requests, saved things |
| Mist | Anything leading to an ISV service |
| Clay | Editorial accent, used sparingly |
| Forest | One moment per page |
| Ink | Ask ISV, and nothing else |

### Directory map

```
src/
  app/                    Routes. Seven screens.
  components/
    primitives/           Text, Button, Badge, icons
    layout/               Field, Wrap, SectionHeader, CellGrid
    patterns/             Cards, IndexList, timeline, artwork, empty states
    features/             AppShell, RoleSwitcher, panels, Ask ISV
  data/                   Typed fixtures. The contract.
  lib/
    selectors.ts          Every role and interest rule
    matching.ts           Ask ISV keyword matching
    member-context.tsx    Session state
  types/                  Type definitions
scripts/
  qa.mjs                  QA gate
  match-test.ts           Ask ISV matching tests
```

## Dependencies

Node 20 or later. Everything else installs with `npm install`. No API keys, no environment variables, no services.

## Known limitations

These are deliberate. Scope is set in PRD section 4.

- **No integrations.** No Optimizely, Dynamics 365, Databricks, Moodle, Canto or Azure AD B2C.
- **No authentication.** Sign-in is a visual transition.
- **No AI.** Ask ISV is scripted and deterministic. Seven questions, keyword matched, filtered by role.
- **Session state only.** Requests reset on reload. Only the seeded request survives a refresh, so `/requests/[id]` deep links resolve for that reference alone. Anything else renders a defined empty state.
- **Entry points, not journeys.** Resource library, events, professional learning, member upload, profile editing and filtering are visible and correctly labelled but do not navigate through. See the capability matrix in PRD section 8.
- **Accessibility is designed and verified, not audited.** No conformance report, no assistive technology testing.
- **Imagery is a stand-in.** The artwork panels are CSS-generated placeholders for ISV's isArtworks collection, subject to licensing confirmation.

## Before this is shown to ISV

Four checks, all cheap, all listed by `npm run qa`.

1. **Names.** Confirm "Ashwood Grange School", "Margaret Ellery" and "David Okonjo" do not collide with a real ISV member school, staff member or serving Principal.
2. **Dates.** Replace every `VERIFY-DATE` marker in `src/data/content.ts` with the real publication date from ISV's site. Dates on real ISV content are checkable.
3. **Services.** Verify the two requestable advice services against the RFP text. If the RFP does not name them, describe them in the walkthrough as a proposed request pathway rather than existing ISV services.
4. **Brand.** Sample ISV's real palette and type from the live site into the primitive token block.
