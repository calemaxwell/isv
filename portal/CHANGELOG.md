# Changelog

## 0.6.0 — 20 August 2026

The school account, and a voice correction across the portal.

### Added

- **School account.** Five screens under `/school`: a hub that opens on what is wrong rather than on what the school is, editable school details with confirmation ageing, people and portal access, membership, and a payment flow.
- **One people list.** `schoolRoster` is now held in `MemberProvider` and read by both the school account and event registration. Somebody added under Our people is selectable in the registration picker in the same session; somebody marked as departed disappears from it. QA SA2 fails the build if any page imports the fixture directly and forks the record.
- **Confirmation ageing.** Every school detail carries the date it was last confirmed. Anything over twelve months old is flagged on the field and counted on the hub. A field nobody has touched in eighteen months previously looked identical to one confirmed yesterday, which is why a record goes stale without anybody deciding to let it.
- **Portal access.** Three levels — full, standard, none — rather than a permission matrix. Departing somebody revokes their access in the same action, because two separate controls reproduce exactly the failure the screen exists to fix.
- **Payment, two ways.** Bank transfer and card, presented side by side with neither as the default. The transfer path records the payment against the invoice rather than showing bank details and shrugging.
- **Seeded defect.** One staff member left in May and still has portal access. The walkthrough has something real to fix rather than a screen of tidy rows.
- **QA SA1–SA4.** No ISV fee rate or basis; the people list is never forked; the area never asserts a legal obligation; no em dash in product copy.

### Changed

- **Page container 1080 → 1200px, wide 1240 → 1320px.** The old measure put content at 1000px inside the gutters, leaving 180px of dead margin each side on a 1440 screen. Reading measures are set in `ch` and are unaffected, so this widened grids and tiles and left body copy alone.
- **Portal chrome now speaks in the school's own voice.** "Your requests" became "Our requests", "Included in your membership" became "Included in our membership", "Your profile" became "My profile". The school's things are our; the signed-in person's things are my. ISV's published content — article bodies, service descriptions, event copy — stays in ISV's voice, because rewriting that would make ISV sound like it works at the school.
- **Renewal and contact alerts** now route into the school account instead of opening the profile panel.

### Fixed after audit

The new area was audited against the content-integrity rules before commit. Eighteen findings, all applied:

- **Three consecutive membership amounts rising ~3.5% a year read as a fee schedule** regardless of the ILLUSTRATIVE label. Prior-year invoices no longer render an amount at all — status, period and how it was paid is the whole job of a filing list — and the held figures are deliberately unordered.
- **The illustrative-amount label sat inside the open-invoice block**, so it unmounted the moment the invoice was paid. Paying is the scripted demo path, so the amounts would have gone bare live in the room. Moved outside the conditional and repeated through the payment flow.
- **"Child safety contact" and "Compliance contact"** were removed as nominated roles. Neither is published by ISV, and in Victoria both read as statutory nominations rather than as a name on file. Replaced with professional learning and communications contacts, which are unambiguously administrative.
- **The street address resolved to a real property in Camberwell.** Replaced.
- Removed claims ISV has not published: card brands accepted, "the invoice closes immediately", "how most schools do this", "receipts are kept for as long as we are a member school", a renewal-time verification process, and location matching of sessions to a school's address.
- Fixed a voice collision in the payment flow where "tell us when it went out" meant tell ISV, in an area where "us" is the school everywhere else.
- Removed the em dash from rendered copy in the nominated-contact selects, two employment fields, an event description and the request timeline placeholder.


## 0.1.0 — 17 August 2026

First build. All seven screens, both personas, the full three-act narrative.

### Added

- **Token system.** Three layers in `src/app/globals.css`. Primitive tokens hold the only brand values in the codebase. Semantic tokens map into the Tailwind theme so every utility resolves through a named role. Component tokens cover control heights and field padding.
- **Colour field system.** Seven fields, each with a defined job. Ink is reserved for Ask ISV and used nowhere else.
- **Seven screens.** Sign-in, Principal landing, Business Manager landing, Ask ISV overlay, service detail, request flow, confirmation and status.
- **Role switching.** Client state change, no navigation, no reload. Both landing states render from one route and one component tree.
- **Ask ISV.** Seven scripted questions, deterministic whole-token matching, persona filtering, streamed answer with sources rendering after the body completes, persona-filtered related bands, and the designed no-match state.
- **Service request flow.** Pre-filled member context with visible provenance, accessible validation, in-session persistence, confirmation with reference and next step.
- **Data layer.** Nine typed fixture sets. Every record carries a source classification and a note explaining it.
- **Selectors.** All role and interest logic in one file. No component filters by role.
- **QA gate.** `scripts/qa.mjs` covering 19 automated rows from PRD section 18, plus 14 Ask ISV matching cases. Prints the manual checklist on every run.
- **Lint rules.** Inline styles and CSS-in-JS imports blocked at the linter, configured before feature work rather than retrofitted.

### Deliberately not included

No integrations, no back end, no authentication, no AI, no analytics dashboards, no member upload journey, no catalogue pages. Scope is set in PRD section 4.

### Fixed during the build

- Time-based greeting was computed during render on a prerendered page, so it would have been baked in at build time and mismatched on hydration. Now resolved after mount.
- Module stagger initially used an inline custom property, which fails QA B1. Moved to `:nth-child` delays.
- Artwork positioning and the index grid initially used Tailwind arbitrary values, which fails QA B3. Moved to component classes where every value still resolves through a token.
- `resource-people-culture` was scoped to Business Manager only, which would have left a Principal with a single source on answer A6, below the two-source minimum.

### Fixed after code review

A review pass against the PRD and DATA-SPEC found 38 issues, five of them blocking. All blockers and every should-fix are closed.

**Accessibility.** Body-small text failed AA on three of seven colour fields; fixed at the primitive layer so nothing downstream changed. Control borders now meet the 3:1 non-text requirement. Added a `<main>` landmark and a skip link. Ask ISV now announces through a live region rather than updating silently. Radio validation focuses a real input instead of an unfocusable fieldset, and the group uses a `<legend>` rather than an invalid `<label for>`. Required and optional fields are marked. Touch targets raised to 44px on mobile. The role switcher is labelled with the current role at every width.

**Dead controls removed or wired.** Both live navigation items, three "Contact ISV" buttons and the external product buttons did nothing when clicked. Content cards, event cards and index rows had hover affordances with no handlers and no keyboard access; they are now plainly presentational.

**Ask ISV.** State moved into the provider so the last answer survives navigation. Answers stream in sentence chunks as specified. The related learning band is implemented. Content sources no longer close the overlay to go nowhere. Full-screen breakpoint corrected from 640px to 768px.

**Correctness.** Form values re-sync on role change, so a mid-form switch cannot submit one member's details under another's identity. The request button label comes from the service record rather than string-matching its name.

**Design.** The clay field was defined and unused, so the news module now carries it. The confirmation screen regained the artwork it was budgeted. The Principal greeting no longer describes a request that is not on screen.


## 0.2.0 — 17 August 2026

Depth on the landing page, after review.

### Added

- **"What's changed" module.** Second on both landing pages, above news. Dated, categorised, most recent first, and different per role. This is what answers "what has moved since I last looked", which news alone never did.
- **Update voice rule, enforced.** Every update describes something ISV has done to its own materials. Two QA checks: one bans requirement, deadline and commencement language, the other requires every summary to describe ISV activity. Nothing in the module states what a regulation requires.
- **Events and learning with real shape.** Nine dated items across the two modules, each with a format, a location and a relative date. Sorted soonest first.
- **Location awareness.** School and events carry a region. A match renders "Near your school" and earns the "Relevant to your school" cue, which had been defined in the type and never used. Both personas now sit at the three-cue budget.
- **Derived relative dates.** "2 days ago", "In 3 weeks", "Next month". Computed from the ISO date so they never go stale.

### Changed

- Artwork ground moved from `--color-sunken` to sand-deep. It was two percent away from the clay field it sits on and disappeared into the page.
- Saved-resources module removed. Never specified, implied a capability the PRD does not cover, and the page did not need it once updates arrived.
- Verification runs on plain Node through a resolve hook rather than `tsx`, so it no longer depends on a platform-specific binary.

### Fixed

- Undated learning items sorted first and rendered "undefined, undefined". They now sort last and render "Running now".
- "In 1 months" now reads "Next month".
- Online sessions rendered "Online · Online". Format and location are de-duplicated.
