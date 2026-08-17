# ISV Member Portal Prototype — Product Requirements Document

**Version:** 2.1
**Status:** Draft for approval
**Supersedes:** ISV_Member_Portal_Prototype_Brief.docx (v1)
**Owner:** Credera Oceania
**Date:** 17 August 2026

---

## 1. Summary

A high-fidelity, interactive prototype of Independent Schools Victoria's future Member Portal. It is a front-end only build with mocked data and no live integrations. It exists to make ISV's future member experience tangible in a pitch setting, in under two minutes, without overstating what has been committed.

The prototype tells one story in three acts: **Know me → Help me find it → Help me do it**.

It is not a functional specification, a demonstration of the full RFP scope, or a technical proof of integration.

---

## 2. Problem statement

ISV's RFP is outcomes-focused rather than a detailed functional specification. Information architecture, taxonomy, content models and portal journeys are all expected to be confirmed during Discovery. That leaves a gap: ISV has described the outcome it wants but has no shared picture of what the experience actually feels like.

Written responses do not close this gap. A member portal either feels like an intelligent workspace or it feels like a website with a login, and no amount of prose settles which one is being proposed.

The prototype closes that gap. It gives ISV something to react to, and gives Credera a way to demonstrate product judgement rather than describe it.

---

## 3. Goals

| # | Goal | Measure |
|---|------|---------|
| G1 | A viewer understands the future member experience without narration | Unbriefed viewer can describe all three acts after a two-minute self-guided click-through |
| G2 | Role-based personalisation is legible, not just present | Viewer can state at least three specific differences between the Principal and Business Manager views after one switch |
| G3 | AI-assisted discovery reads as trustworthy, not magical | Every AI answer visibly carries source attribution and a human escalation pathway. No answer appears without both |
| G4 | The service journey feels like one system | Viewer completes Ask ISV to confirmed request without a visible system boundary or full page reload |
| G5 | The build survives scrutiny from a technical evaluator | Zero inline styles, zero CSS-in-JS, zero hard-coded visual values in JSX. All visual decisions resolve through tokens |
| G6 | Nothing in the prototype is indefensible against the source material | Every service, data field and content item traces to the RFP, the Q&A, ISV's public site, or is visibly flagged as illustrative |

---

## 4. Non-goals

Consolidated here so there is one place to check. Anything in this list is out of scope and should not be built, even where it would improve the demo.

**Functional**

- No live integrations of any kind. No Optimizely, Dynamics 365, Databricks, Moodle, Canto or Azure AD B2C connection.
- No Moodle two-way data exchange. Confirmed in the Q&A as a target state, but not demonstrable in a front-end prototype.
- No back end, no database, no API layer. All data is local JSON fixtures.
- No real authentication. The sign-in screen is a visual transition only.
- No real AI, model call or retrieval. Ask ISV is scripted and deterministic.
- No search index. Search results are pre-authored per scripted query.
- No form persistence beyond the session. State resets on reload.

**Scope**

- No analytics dashboards or data visualisations. The RFP does not support them in the portal.
- No member content upload journey. It is a confirmed RFP requirement but the Canto boundary sits outside this engagement, so it appears as a navigation entry point only.
- No admin, author or ISV staff-side views.
- No content management interface.
- No full resource library, event catalogue or professional learning catalogue. These appear as entry points and curated selections only.
- No profile or preference editing journey. Both appear as visible, reachable surfaces without a built-through flow.
- No personas beyond Principal and Business Manager.
- No screens beyond the seven listed in section 9.

**Quality**

- No formal WCAG audit or assistive technology certification. See section 15 for what is and is not committed.
- No cross-browser matrix beyond current Chrome, Safari and Edge.
- No performance budget or optimisation work.
- No test suite beyond the manual QA script in section 18.

---

## 5. Decisions taken

These were open in v1 and are now closed. Rationale is in the decision log at section 20.

| Decision | Resolution |
|----------|-----------|
| Brand approach | Approximate ISV's identity from public assets. Tokenised so it can be swapped without touching component logic |
| Ask ISV pattern | Command palette overlay, reachable from any screen |
| Sign-in | Include a minimal sign-in screen as the opening beat |
| Delivery | Hosted link for the pitch, plus repository handover |

---

## 6. Personas

Two roles, used to demonstrate personalisation. They are not a claim about ISV's final persona set.

### Principal

Priority areas, per the RFP: advocacy, strategic guidance, events, leadership resources, professional learning, school-specific engagement with ISV, priority ISV services, relevant news and updates.

The Principal should feel that ISV understands the role and surfaces what matters without requiring a search through the full portal.

### Business Manager

Priority areas, per the RFP: employment relations, finance, governance, funding, compliance, operational resources, professional learning, relevant events, ISV services.

The Business Manager sees the same underlying product system with different prioritisation and recommendations.

### Persona switching

A single control in the header switches between the two. The purpose is to demonstrate role-based personalisation within one application, not to present two applications. See section 11 for the interaction specification.

---

## 7. The three signature experiences

### Act 1: Know me

**Objective.** Demonstrate a personalised landing experience based on role, profile, preferences and school context. The member should feel that ISV knows who they are and what is relevant.

**Composition.** Personalised greeting, role and school context, priority items, recommended resources, relevant ISV services, relevant events, professional learning, search entry point, contact pathway, profile access, preference access, and active request status where applicable.

**Design behaviour.** Not a dense dashboard of equally weighted cards. The top of the page surfaces a small number of high-value items. Content then discloses progressively: immediate priorities, then recommended content and services, then upcoming opportunities, then broader portal content.

**Personalisation cues.** Used sparingly. Permitted labels: "Recommended for you", "Based on your role", "Relevant to your school", "Based on your interests".

The cue attaches to the **module header, not to individual items**. A module carries at most one cue and the cue describes why the whole module is there. Cueing every card produces exactly the promotional density the brief warns against. Maximum three cued modules per screen.

**What this proves.** Role-based personalisation, member relevance, content reuse, connected member context, clearer visibility of what ISV provides.

### Act 2: Help me find it

**Objective.** Demonstrate search and AI-assisted discovery as the primary route to trusted ISV information. The member should feel they can ask ISV a question and reach the right answer quickly.

**Response hierarchy.** Answer first, then supporting ISV sources, then relevant resources, then related services, then relevant events or professional learning, then suggested next steps, then contact ISV.

**Trust and guardrails.** Every answer carries visible source attribution. The answer is visually distinct from the source material. A human escalation pathway is always present. The interface must not imply that AI replaces ISV subject matter experts, and must not generate policy or advice that is not supported by an attributed source.

**What this proves.** Unified search, AI-assisted discovery, stronger self-service, trusted knowledge access, reduced member effort, clear escalation.

Full interaction specification at section 10.

### Act 3: Help me do it

**Objective.** Demonstrate that the portal is an entry point into ISV services, not only a content destination. The member should be able to act without knowing which system sits behind the experience.

**Journey.** Service discovery, service detail, member inclusion information, clear request action, pre-populated known member information, guided submission, confirmation, request visibility in the portal, request status, clear next step, contact pathway.

**Experience principle.** The portal is the experience layer. The member should never need to know whether Optimizely, Dynamics 365, Databricks, Moodle, identity services or another ISV platform is responsible for fulfilment.

**What this proves.** Self-service, service request submission, request status visibility, CRM-connected experience, reduced reliance on phone and email, one connected member experience.

---

## 8. Capability visibility matrix

This resolves the conflict in v1 between the capability set and the screen inventory. Every confirmed portal capability appears here with an explicit build depth. **Only capabilities marked "Built through" are implemented as journeys.** Everything else is a visible, correctly-labelled surface that demonstrates the capability exists in the product model.

| Capability | Build depth | How it appears |
|---|---|---|
| Secure authenticated experience | Visual only | Sign-in screen, authenticating transition |
| Single sign-on | Visual only | SSO button on sign-in screen |
| Role-based access | Visual only | Demonstrated as role-based personalisation. Access enforcement is not represented, and nothing is withheld from either role |
| Member and school context | Built through | Header, greeting, pre-populated form fields. Notionally CRM-owned, per section 12 |
| Role-based personalisation | Built through | Landing page composition and ordering |
| Interest-based personalisation | Built through | One module per persona is interest-driven, cued "Based on your interests" |
| Profile and preference personalisation | Visual only | Profile panel is reachable and populated but does not drive composition |
| School-context personalisation | Visual only | School named in greeting and pre-fill. Both personas share one school, so it does not vary |
| Relevant content, services, events, learning | Built through | Curated modules on both landing pages |
| Resource and knowledge library | Entry point | Navigation item and a curated selection on landing. No catalogue page |
| Strong search | Built through | Ask ISV overlay |
| Filtering | Entry point | Filter control visible on curated lists, non-functional |
| Recommendations | Built through | Recommended modules, role-driven |
| Reusable content across Website and Portal | Architectural | Same components render both personas from one fixture set |
| Content targeting by role and audience | Built through | Fixture-level role tagging |
| Service discovery | Built through | Landing modules and Ask ISV related services |
| Clear service pathways | Built through | Service detail screen |
| Service request submission | Built through | Guided request flow |
| Request status visibility | Built through | Confirmation and status screen, plus landing page status card |
| Hand-off to ISV team | Visual only | Assigned ISV team and clear next step on confirmation. No published response time is stated |
| Guided Contact Us pathway | Entry point | Contact action present on every screen, opens the contact panel defined in section 12 |
| Direct contact pathway | Entry point | Phone and email surfaced on service detail |
| Event discovery | Entry point | Curated events on landing. No catalogue |
| Professional learning discovery | Entry point | Curated learning on landing. No catalogue |
| Registration pathways | Visual only | Register action visible, labelled "Opens in ISV professional learning" |
| Transition to connected learning platform | Visual only | Labelled external handoff, no navigation. Moodle is never named in member-facing copy |
| Unified search | Built through | Ask ISV |
| AI-assisted search | Built through (scripted) | Ask ISV answers |
| Conversational support | Built through (scripted) | Follow-up questions in Ask ISV |
| Source attribution | Built through | Source list on every answer |
| Human escalation | Built through | Escalation pathway on every answer and no-match state |
| Search analytics | Out of scope | Not represented |
| Future AI roadmap | Out of scope | Not represented |
| Member profile | Entry point | Reachable profile summary panel, read-only |
| Communication preferences | Entry point | Visible within profile panel, read-only |
| Consent and preference management | Entry point | Visible within profile panel, read-only |
| Member-uploaded content | Entry point | Navigation item only. Canto boundary noted in the walkthrough, not in the UI |

---

## 9. Screen inventory

Seven screens. Nothing else is built.

| # | Screen | Route | Purpose |
|---|--------|-------|---------|
| 0 | Sign-in | `/` | Opening beat. SSO action, authenticating transition |
| 1 | Principal landing | `/portal` | Demonstrate "Know me" |
| 2 | Business Manager landing | `/portal` (role state) | Demonstrate role-based adaptation using the same components |
| 3 | Ask ISV overlay | Overlay on any route | Demonstrate "Help me find it" |
| 4 | Service detail | `/services/[slug]` | Bridge discovery into action |
| 5 | Service request flow | `/services/[slug]/request` | Demonstrate "Help me do it" |
| 6 | Request confirmation and status | `/requests/[id]` | Show the connected outcome |

Screens 1 and 2 are the same route and the same component tree. They differ only in the data selected and the order of composition. This is a deliberate architectural demonstration and must not be implemented as two pages.

The profile panel is an overlay on screens 1 and 2, not a separate route.

**Deep linking.** Only ids present in session state resolve. Requests created during the demo resolve for the rest of the session. After a reload only the seeded request survives, and any other id renders a defined empty state pointing back to the portal. Do not leave this to a crash, because someone will reload the confirmation screen.

---

## 10. Ask ISV interaction specification

This was undefined in v1 and is the highest-risk element of the demo. It is fully specified here.

### Entry

- A persistent search field sits in the portal header on every authenticated screen.
- Placeholder: `Ask ISV a question`
- Keyboard shortcut `⌘K` / `Ctrl+K` opens the overlay from anywhere.
- Focusing or clicking the field opens a full-screen overlay. The underlying page dims and remains visible at the edges to preserve the sense of one continuous application.
- The overlay is a Radix Dialog. It traps focus, closes on `Escape`, and returns focus to the trigger.

### Empty state

On open, before any query, the overlay shows:

- The query input, focused.
- Four suggested questions, drawn from the active persona's fixture set.
- A short line of orienting copy establishing what Ask ISV draws on.

### Query handling

Matching is deterministic keyword scoring against the `matchTerms` array on each scripted answer, filtered to the active persona. Fully specified so two builders produce identical behaviour:

1. Lowercase the query and strip all punctuation.
2. Split on whitespace into tokens.
3. Score one point per `matchTerm` that equals a query token exactly. Whole-token matching only. Substring matching is a build defect: under it, `term` in A4 matches "determine" and `where` in A2 matches "everywhere".
4. Filter candidates to those whose `relevantTo` includes the active persona.
5. Highest score wins. Threshold: at least two matched terms.
6. Tie-break by entry order, lowest ID first.

**Matched query.** Answer renders in the specified hierarchy: answer body, then sources, then resources, then related services, then events or learning, then suggested follow-ups, then the contact pathway.

**No match.** This is a designed state, not a failure state, and it is one of the strongest trust moments in the demo. The overlay shows:

> I can't answer that from ISV's current knowledge base.

followed by the four suggested questions and a prominent contact pathway. Nothing is fabricated. The demo driver should be told this state is intentional and worth showing.

### Answer generation behaviour

- Answers stream in token-grouped chunks over 900ms to 1400ms, with a brief thinking state first.
- Sources appear only after the answer body has finished rendering. This ordering is deliberate: it visually reinforces that the answer is derived from sources rather than decorated with them.
- Streaming is simulated. It respects `prefers-reduced-motion` by rendering the answer complete with a single fade.
- No typewriter cursor and no artificial slowness. The interaction should feel fast.

### Answer composition rules

- Answer body: maximum 120 words.
- Sources: two to four, each with title, ISV source system and a plain-language recency indicator. Every answer must carry at least two. An answer with fewer is a build defect.
- Related resources: one to three, counted **after** persona filtering. The resources band is part of the specified hierarchy, so no answer may leave it empty for either persona.
- Related services: zero to two.
- Related learning: zero to two.
- **Related bands are persona-filtered.** An item whose `relevantTo` excludes the active persona does not render, even where the script lists it. Without this, a Principal is shown a Business Manager resource in the middle of a demonstration of role-based targeting.
- **No id appears in more than one band.** An item cited as a source does not reappear as a related resource or service. The hierarchy exists to show the answer deriving from sources and then extending past them, and duplication collapses that.
- Unspecified bands are an empty array and do not render. They are not padded.
- Follow-up questions: three. Each must itself be a scripted query **and must be available to the persona that can reach it**. A follow-up that dead-ends into the no-match state is a build defect, and persona scope is the way this usually breaks.

### Exit

- Selecting a source, resource or service closes the overlay and navigates. The overlay does not persist behind the new screen.
- Query state is retained for the session, so reopening the overlay returns the last answer.
- **Query state clears on role switch.** Without this, switching persona and reopening the overlay can show a member an answer the script says is not available to their role. Clearing is the simpler and more defensible behaviour.

---

## 11. Role switcher interaction specification

The brief calls this a key demonstration moment. It was unspecified.

- Control sits in the header, adjacent to the member identity. Radix Dropdown, labelled with the current role.
- Switching does not navigate, reload, or re-authenticate. It is a client state change.
- On switch: the greeting, role label, module order, recommended content, services, learning and calls to action all update.
- The school context does not change. Both personas belong to the same school. This is important. It demonstrates that personalisation is role-driven within a shared school context.
- Transition: modules cross-fade and reflow over 220ms with a staggered 30ms offset. Under `prefers-reduced-motion`, content swaps with no transition.
- The AppShell, navigation and component set are visibly unchanged through the switch. Nothing should suggest two applications.
- A brief, non-blocking annotation may confirm the switch. It must not be a modal.

---

## 12. Data and mocking approach

All data is local, typed JSON. There are no network calls of any kind.

- Fixtures live in `/src/data`, one file per entity.
- Types live in `/src/types` and are the contract. Fixtures are typed on import so a malformed fixture fails the build.
- Data is read through a `MemberContext` React provider holding active persona, member, school and request state.
- Selectors, not components, decide what a persona sees. Components receive data and render it. A component that filters by role is a build defect.
- Request submission appends to in-memory state. It is visible on the landing page for the remainder of the session and resets on reload.

### Notional system of record

The brief requires that CRM is treated as the intended source for core member data. The prototype has no CRM, so this is carried as annotation rather than architecture.

- Member and school records carry a `notionalSystemOfRecord` field set to `Dynamics 365`.
- The field never renders in member-facing UI. It exists so the repository is self-documenting and so the walkthrough can state which data is CRM-owned without guessing.
- Pre-filled form fields display the note "From your ISV member profile". They must not name Dynamics.

### Discovery-status surfaces

The brief requires Discovery-status language where ISV has explicitly left future-state decisions open. Four surfaces carry it, and no others:

| Surface | Treatment |
|---|---|
| Filter controls on the two modules named in `DATA-SPEC.md` s14 | Visibly disabled, with a tooltip reading "Taxonomy and filtering confirmed during Discovery" |
| Broader portal navigation module | Section note reading "Full information architecture confirmed during Discovery" |
| Profile and preference panel | Panel note reading "Preference model confirmed during Discovery" |
| Contact panel | Panel note reading "The guided contact pathway is confirmed during Discovery" |

This is a credibility device, not a disclaimer. Keep it quiet, keep it to three places, and do not apply it to anything the RFP has actually confirmed.

### Contact panel

The contact action appears on every screen and must do something when clicked. It opens a panel containing: ISV phone `03 9825 7200`, `enquiries@is.vic.edu.au`, the school's name for context, and the Discovery note above. No form.

**The governing rule.** Every fixture record carries a `source` field with one of three values: `RFP`, `PUBLIC` (ISV's published website), or `ILLUSTRATIVE`. Nothing ships without one. Records marked `ILLUSTRATIVE` must be defensible as a plausible example and must never assert an ISV service, commitment or position that does not exist.

Full schema and content in `DATA-SPEC.md`.

---

## 13. Design system

### Brand approach

ISV's identity is approximated from public assets so the prototype reads as an ISV product rather than a generic template. Approximation is deliberately loose. This is a proposed future product, not a redesign of the current site.

**Build step.** Sample primary, secondary and accent colours, and the type stack, from `is.vic.edu.au` before writing the token set. Record the sampled values in `DECISIONS.md`. Do not proceed on assumed values.

**Constraints.**

- Brand values enter only at the primitive token layer. No component references a brand colour directly.
- The full identity must be replaceable by editing one token file.
- Do not reproduce the current site's layout, navigation or visual density. The point of the prototype is that the future portal is a different kind of product.
- Use the ISV logo as supplied or as sampled. Do not redraw it.

### Design north star

The portal should feel like an intelligent member workspace. It should not feel like a traditional association website, a SharePoint portal, a CRM dashboard, a generic enterprise admin interface, a grid of unrelated cards, or a set of disconnected systems.

**Visual qualities.** Generous whitespace. Strong hierarchy. Restrained colour. Large, confident typography. Simple navigation. Fine borders. Soft layering. Limited visual chrome. Clear action hierarchy. Progressive disclosure. Consistent component behaviour. Photography only where it carries meaning.

**Motion.** Subtle and functional. Used to communicate personalisation change, answer generation, state change, submission, confirmation, request progression and content expansion. No decorative animation. `prefers-reduced-motion` respected throughout.

### Stimulus

Used as reference for behaviour and quality, never as visual template. Do not copy the visual identity of any of these.

- **Notion** for clarity, modularity, whitespace, information hierarchy, workspace composition, progressive disclosure.
- **Perplexity** for answer-first search, natural-language interaction, source transparency, progressive exploration.
- **Linear** for product polish, interaction quality, responsive state change, restrained motion, high-quality micro-interactions.

### Token architecture

Three layers. Everything visual is tokenised, and the Tailwind theme maps to the token set.

1. **Primitive.** Raw colour palette, base spacing scale, font sizes, radius scale, motion durations. The only layer that holds brand values.
2. **Semantic.** `background-page`, `background-surface`, `text-primary`, `text-secondary`, `border-subtle`, `action-primary`, `status-success` and equivalents.
3. **Component.** Card padding, search field height, navigation spacing, button radius, section spacing.

Minimum token categories: colour, typography, font weight, line height, spacing, radius, border, shadow, layout width, breakpoint, motion, z-index, focus state, control height, icon size.

### Component architecture

**Primitives.** Button, Input, Text, Heading, Icon, Badge, Avatar, Divider, Surface, Link, Spinner, Skeleton, Tooltip.

**Patterns.** SearchInput, ContentCard, ServiceCard, EventCard, ResourceCard, StatusCard, RecommendationCard, ProfileSummary, EmptyState, SectionHeader, FilterBar, SourceCitation, ContactPathway.

**Features.**

- Personalisation: PersonalisedHeader, RecommendedContent, RoleSwitcher, RelevantServices, RelevantLearning
- Search: AskISV, SearchAnswer, SourceList, SuggestedQuestions, RelatedResources, EscalationPathway
- Services: ServiceDetail, ServiceRequestForm, RequestConfirmation, RequestStatus, RequestTimeline
- Profile: ProfileSummary, PreferenceManager, CommunicationPreferences

**Layout.** AppShell, Header, PortalNavigation, ContentContainer, Grid, Section, Stack.

`PrimaryNavigation` is dropped from v1's list. The header carries the logo, Ask ISV, the role switcher, member identity, and the profile and contact actions. There is no primary navigation bar, and specifying a component with nothing to render invites a builder to invent menu items. `PortalNavigation` renders the navigation module defined in `DATA-SPEC.md` section 12.

`RecommendationCard` and `RecommendedContent` are retained, and render the two cued modules.

**Governing principle.** Components do not own page coordinates. The parent layout determines placement and composition. This is what allows the same component set to serve both personas.

### Layout system

Responsive 12-column grid on desktop. Supported compositions: full width, 8/4, 7/5, 6/6, 4/4/4, stacked mobile. Avoid rigid dashboard layouts. Component ordering varies by persona without duplicating components.

---

## 14. Technical architecture

**Stack.** React, Next.js App Router, TypeScript, Tailwind CSS, Radix UI.

**Radix** provides behaviour and accessibility, not visual identity. Expected primitives: Dialog, Dropdown, Popover, Tabs, Accordion, Tooltip, Select, Navigation Menu.

**Styling rules.** These are non-negotiable and are checked at QA.

- No inline `style={{ ... }}`
- No CSS-in-JS
- No hard-coded visual values in JSX
- No Tailwind arbitrary values such as `mt-[17px]` or `bg-[#123456]`
- All visual decisions resolve through tokens
- CSS Modules only where Tailwind is genuinely unsuitable, such as complex animation
- `clsx` and `cva` for variant and state-based class composition

**Enforcement.** ESLint rules blocking inline styles and Tailwind arbitrary value syntax. Configured before feature work begins, not retrofitted.

**Relationship to Optimizely.** The brief is explicit that the proposed solution must not be positioned as a separate headless front end that consumes Optimizely content. This prototype is a standalone Next.js build, which appears to contradict that. It does not, and the distinction must be stated plainly whenever the prototype is shown.

The prototype is a demonstration artefact, not the proposed production architecture. The proposed production approach is Optimizely-native composition, with Optimizely acting as the experience and content delivery layer: page composition, content delivery, reusable components, content targeting, role-based variation, navigation, portal and search presentation, and forms. Every component in this prototype is built to map to an Optimizely-composable block.

Do not let this go unsaid in the room. A technical evaluator will ask.

**Delivery.** Deployed to a shareable URL for the pitch. Repository handed over with the README, this PRD, `DATA-SPEC.md`, `DECISIONS.md`, `QA.md` and `CHANGELOG.md`.

---

## 15. Accessibility

Target: WCAG 2.2 Level AA.

**Committed.** The prototype is designed and built to AA. Specifically: keyboard navigation throughout, visible focus states, correct semantic structure, ARIA patterns where required, colour contrast verified at AA against the sampled brand palette, error identification, accessible labels, touch target sizing, reduced motion support, accessible dialogs and overlays, form accessibility, screen reader compatible markup, and text resize to 200% without loss of content or function.

**Verified.** Automated axe scan on all seven screens with zero critical or serious violations. Full keyboard traversal of the demo narrative without a mouse. Contrast checked on every token pairing in use. Reflow checked at 200% and 400% browser zoom. One pass through the narrative in a single screen reader.

**Not committed.** No formal audit. No screen reader certification across NVDA, JAWS and VoiceOver. No assistive technology user testing. No accessibility conformance report.

State this distinction plainly if ISV asks. Radix provides accessible behaviour but does not on its own guarantee WCAG compliance, and the prototype should not be presented as certified.

---

## 16. Responsive and mobile behaviour

The RFP requires a mobile-first experience. Mobile is not a reduced desktop layout.

**Mobile priority order.** Personalised context, search, immediate member actions, key services, relevant content.

**On smaller screens.** Single-column service flows. Simplified navigation. Collapsed secondary content. Progressive disclosure. Wide data structures become accessible stacked or card patterns. Clear touch targets throughout.

Ask ISV becomes a full-screen sheet on mobile rather than a centred overlay.

The hierarchy holds at every breakpoint: Know me → Help me find it → Help me do it.

---

## 17. Demo narrative

One continuous journey. The viewer should never feel they are moving between unrelated systems.

**Act 1: Know me**

1. Principal signs in via SSO
2. Personalised landing page appears
3. Relevant information, services and learning are immediately visible
4. Switch role to Business Manager
5. The same portal reprioritises itself
6. Switch back to Principal

**Act 2: Help me find it**

7. Open Ask ISV from the header
8. Ask a realistic question grounded in ISV content
9. Answer streams in, followed by attributed sources
10. Discover a related ISV service from the answer

**Act 3: Help me do it**

11. Open the service
12. Start the request
13. Known member details are carried forward
14. Submit
15. See confirmation, request identifier and next step
16. Return to the portal and see the request and its current status on the landing page

**Total runtime target:** under two minutes at demonstration pace.

---

## 18. QA guidelines

Written before the build. Every item is pass or fail. No partial credit.

### Narrative

| # | Test | Pass condition |
|---|------|----------------|
| N1 | Full narrative run | All 16 steps complete without error, dead end or placeholder content |
| N2 | Runtime | Narrative completes in under two minutes at demonstration pace |
| N3 | Continuity | No full page reload between step 7 and step 16 |
| N4 | Unbriefed comprehension | A viewer with no context describes all three acts correctly after a self-guided run |

### Personalisation

| # | Test | Pass condition |
|---|------|----------------|
| P1 | Role difference | At least five visible differences between Principal and Business Manager landing pages |
| P2 | Component identity | Both landing pages render from the same component tree. Verified by inspection |
| P3 | School constancy | School context is identical across both roles |
| P4 | Switch performance | Switch completes within 500ms with no layout shift after settle |
| P5 | Role logic location | No component filters by role. All role logic sits in selectors |
| P6 | Cue placement | Cues render on module headers only. No card carries a cue |
| P7 | Cue budget | No more than three cued modules per screen, per persona |
| P8 | Interest join | The interest-cued module selects by matching `interestTags` against `Member.interests`, not by role. Verified by changing an interest value and seeing the module change |
| P9 | Discovery surfaces | Exactly four surfaces carry Discovery-status language, and they are the four named in section 12 |

### Ask ISV

| # | Test | Pass condition |
|---|------|----------------|
| A1 | Scripted coverage | Every scripted question returns a complete answer for its persona |
| A2 | Source presence | Every answer displays at least two attributed sources |
| A3 | Source ordering | Sources render only after the answer body completes |
| A4 | No-match state | Off-script input returns the designed no-match state. Nothing is fabricated |
| A5 | Follow-up integrity | Every suggested follow-up is a scripted query **and is available to the persona that can reach it**. Walk all follow-up chains in both roles |
| A6 | Escalation | A human contact pathway is present on every answer state including no-match |
| A7 | Overlay behaviour | Focus trapped, `Escape` closes, focus returns to trigger |
| A8 | Reachability | `⌘K` opens the overlay from `/portal` in both roles, `/services/[slug]`, `/services/[slug]/request` and `/requests/[id]` |
| A9 | Resources band | Every answer populates the related resources band. None renders empty |
| A10 | Role switch clears state | Switching role and reopening the overlay returns the empty state, not the previous answer |
| A11 | Token matching | Query "help me determine our long term direction" does not match A4. Query "is this available everywhere" does not match A2 |
| A12 | Band filtering | No answer renders an item whose `relevantTo` excludes the active persona |
| A13 | Band de-duplication | No id appears in both the sources band and a related band |
| A14 | Session retention | Reopening the overlay without switching role returns the previous answer |

### Service journey

| # | Test | Pass condition |
|---|------|----------------|
| S1 | Pre-population | Member name, role, school and contact details are pre-filled and correct for the active persona |
| S2 | Validation | Required-field validation fires with accessible, specific error messages |
| S3 | Confirmation | Confirmation displays a request identifier, current status and a clear next step |
| S4 | Persistence | The submitted request appears on the landing page for the remainder of the session |
| S5 | System opacity | No screen names Optimizely, Dynamics, Databricks, Moodle, Canto or Azure in the member-facing interface |
| S6 | Contact panel | The contact action opens the specified panel from all six authenticated surfaces |
| S7 | Unknown request id | `/requests/does-not-exist` renders the defined empty state, not an error |
| S8 | Inert navigation | Every `navigates: false` item is visibly non-interactive and does nothing on click |

### Build quality

| # | Test | Pass condition |
|---|------|----------------|
| B1 | Inline styles | Zero occurrences of `style={{` in `/src` |
| B2 | CSS-in-JS | Zero styled-components or emotion imports |
| B3 | Arbitrary values | Zero Tailwind arbitrary value syntax in `/src` |
| B4 | Token resolution | Every colour, spacing and type value resolves through a token |
| B5 | Type integrity | `tsc --noEmit` passes with zero errors |
| B6 | Lint | ESLint passes with zero errors |

### Accessibility

| # | Test | Pass condition |
|---|------|----------------|
| X1 | Automated scan | axe reports zero critical or serious violations on all seven screens |
| X2 | Keyboard | Full narrative completed without a mouse |
| X3 | Focus visibility | Visible focus indicator on every interactive element |
| X4 | Contrast | Every token pairing in use meets AA |
| X5 | Reduced motion | With `prefers-reduced-motion` set, no animation plays and all content remains reachable |
| X6 | Zoom and reflow | At 200% and 400% browser zoom on a 1280px viewport, no content or function is lost and no horizontal scroll appears |
| X7 | Screen reader | One full narrative pass in a single screen reader with no unlabelled control and no trapped state |

### Responsive

| # | Test | Pass condition |
|---|------|----------------|
| R1 | Breakpoints | All seven screens render correctly at 375px, 768px, 1280px and 1920px |
| R2 | Mobile Ask ISV | Renders as a full-screen sheet below 768px |
| R3 | Touch targets | All interactive targets at least 44px on mobile |
| R4 | No horizontal scroll | No horizontal overflow at any tested width |

### Source integrity

| # | Test | Pass condition |
|---|------|----------------|
| I1 | Traceability | Every fixture record carries a valid `source` value |
| I2 | Service grounding | Every service traces to `RFP` or `PUBLIC`, or is `ILLUSTRATIVE` and named in the walkthrough as a proposed pathway rather than an existing ISV service. No `ILLUSTRATIVE` service appears in an Ask ISV sources band |
| I3 | No invented capability | No screen implies functionality outside the capability matrix |
| I4 | No fabricated positions | No content asserts an ISV policy, position or commitment that cannot be sourced |
| I5 | No regulatory assertions | No answer states what a regulation requires. Answers describe what ISV provides and route to a human |
| I6 | No unpublished service levels | No response time, turnaround or service level appears anywhere in the interface |
| I7 | Name collision | The fictional school and both persona names are verified against real ISV member schools and staff |

---

## 19. Open questions

| # | Question | Needed by | Owner |
|---|----------|-----------|-------|
| Q1 | Is the ISV logo available as a vector asset, or is sampling from the site the only option? | Before token work | Credera |
| Q2 | Is there an approved RFP extract that can supply verbatim ISV content for Ask ISV source snippets? | Before fixture authoring | Credera |
| Q3 | Who drives the demo, and is it live or recorded as a fallback? | Before demo rehearsal | Credera |
| Q4 | Should the no-match state be shown deliberately during the demo, or held as a response to a question from the room? | Before demo rehearsal | Credera |
| Q5 | Is the hosted link password-protected, and for how long does it stay available to ISV after the pitch? | Before deployment | Credera |

---

## 20. Decision log

| Date | Decision | Rationale | Made by |
|------|----------|-----------|---------|
| 2026-08-17 | Approximate ISV brand from public assets rather than build a neutral system | The demo lands harder when it reads as an ISV product. Token isolation keeps the swap cost near zero if ISV supplies real brand direction | Cale Maxwell |
| 2026-08-17 | Ask ISV as a command palette overlay | Reachable from any screen, which preserves the continuous-journey requirement. A dedicated route would break the sense of one system mid-narrative | Cale Maxwell |
| 2026-08-17 | Include a minimal sign-in screen | Act 1 in v1 opened with "Principal signs in" but no screen existed. One low-cost screen sets up the personalisation reveal properly | Cale Maxwell |
| 2026-08-17 | Hosted link plus repository handover | Lets ISV click through independently after the session, which extends the life of the artefact past the pitch | Cale Maxwell |
| 2026-08-17 | Capability visibility matrix added to resolve scope conflict | v1 section 8 implied build scope that v1 section 18 did not fund. The matrix makes build depth explicit per capability | Credera |
| 2026-08-17 | Ask ISV no-match treated as a designed state | Refusing to answer off-script is a trust demonstration, not a failure. It also removes the largest live-demo risk | Credera |
| 2026-08-17 | Both personas share one school | Isolates the personalisation demonstration to role, which is what the brief asks to prove | Credera |
| 2026-08-17 | WCAG 2.2 AA stated as designed-and-verified, not audited | Honest scoping. Claiming certification on a prototype is indefensible under technical scrutiny | Credera |
| 2026-08-17 | Non-requestable services grounded in ISV's published isEducation suite. The two requestable advice services carry partial grounding only | Verification found that the two services carrying Act 3 were sourced to RFP persona priority areas, and a priority area is not a service. isComply's published description of "support from our industry experts" gives partial grounding. The residual gap is disclosed rather than papered over | Credera |
| 2026-08-17 | No response time or service level appears anywhere | ISV has not published one. Inventing a turnaround is the kind of small fabrication that costs credibility disproportionately | Credera |
| 2026-08-17 | Personalisation cues attach to module headers, not items | Cueing every card produces the promotional density the brief warns against, and made the three-cue budget unenforceable | Credera |
| 2026-08-17 | Optimizely positioning stated explicitly in section 14 | v1 forbade positioning the solution as a headless front end. The prototype is a standalone Next.js build, so the distinction between demonstration artefact and proposed architecture has to be made out loud | Credera |
| 2026-08-17 | Discovery-status labelling limited to four named surfaces | The brief asks for it, but applied broadly it reads as hedging. Four placements keep it a credibility signal | Credera |
| 2026-08-17 | Ask ISV related bands are persona-filtered and de-duplicated against sources | Showing a Principal a Business Manager resource, in the middle of demonstrating role-based targeting, undoes the demonstration. Duplication between bands collapses the answer hierarchy | Credera |
| 2026-08-17 | No `ILLUSTRATIVE` service may appear in an Ask ISV sources band | The source band is where the prototype claims rigour. Citing an invented service there is the worst possible place to do it | Credera |
