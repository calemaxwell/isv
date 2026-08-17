# Changelog

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
