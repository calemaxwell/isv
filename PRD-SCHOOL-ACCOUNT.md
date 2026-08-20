# School account — Product Requirements Document

Extends PRD.md. Covers the fourth authenticated area of the member portal,
alongside Employment and HR, the resource library and events.

## Status

Approved — build

## Summary

One place where a Principal or Business Manager maintains the record ISV holds
about their school: the school's details, the people at the school and what
each of them can see, and the school's membership and what is owed on it.
Everything else in the portal answers "where is it". This answers "is what ISV
holds about us correct, and who at my school can act on it".

## Problem statement

A school's relationship with ISV is currently held in three places that do not
speak to each other.

The **school's own details** live in whatever ISV last collected. When a school
changes campus, changes Principal, or its enrolment moves by eighty students,
nothing tells ISV. The school finds out the record is stale when something
addressed to a Principal who left in 2023 arrives at reception.

The **people** live in a Business Manager's head. A Deputy leaves in June and
keeps receiving ISV communications into the following year, because nobody at
the school ever had a way to say she left. The reverse hurts more: a new Head
of Compliance starts in February and cannot see the compliance material she was
hired to act on, so somebody forwards her a PDF.

The **membership** lives in an invoice in the accounts inbox. A Business
Manager asked "are we paid up" has to go and find it.

The person who feels all three is the Business Manager. The Principal feels the
first and third, and cares about the second only when it goes wrong.

## Goals

1. A member can change what ISV holds about their school and see it take
   effect, without emailing anyone.
2. A member can answer "are we paid up" in under five seconds from the portal
   landing page, and act on the answer without leaving the portal.
3. A member can add a person, set what that person can see, and remove someone
   who has left — and the change is visible elsewhere in the same session.
4. **Measurable:** adding a staff member in the school account makes them
   selectable in event registration immediately, with no reload. This is the
   demonstration that the record is one record.

## Non-goals

- **Not a payroll or HR system.** Employment records, contracts and leave stay
  in Employment and HR or in the school's own systems. This area holds who a
  person is to ISV, not who they are to the school.
- **Not an ISV admin console.** A member maintains their own school. Nothing
  here edits another school, and nothing here is an ISV-side approval queue.
- **No real payment processing.** The payment screens are a prototype. No card
  is validated, stored or charged.
- **No fee schedule.** The prototype does not state, imply or derive ISV's real
  membership pricing. See Content integrity.
- **No new ISV services.** This area surfaces what ISV already holds. It does
  not introduce an ISV product, process or turnaround that ISV has not
  published.

## User stories

- As a Business Manager, I want to confirm our school's details at renewal so
  ISV is writing to the right people at the right address.
- As a Business Manager, I want to see whether our membership invoice is
  outstanding so I can answer the Principal without opening the accounts inbox.
- As a Business Manager, I want to pay the membership the way our school
  actually pays things, so I am not forced through a card form to record an
  EFT.
- As a Business Manager, I want to remove a staff member who has left so ISV
  stops writing to her.
- As a Business Manager, I want to give our new Head of Compliance access to
  the portal so she can find her own material.
- As a Principal, I want to see who at my school ISV holds as our official
  contacts, because those names represent the school.

## Functional requirements

### School details

1. The area displays every field ISV holds about the school, grouped as school
   identity, campuses and contact, and enrolment.
2. Each field is editable in place and saved to session state.
3. A field ISV has not been told about in over twelve months is marked as
   needing confirmation, and confirming it without changing it clears the mark.
4. The record shows when it was last confirmed and by whom.

### Nominated contacts

5. The area shows the roles ISV holds a named contact for at each school.
6. A nominated contact can be reassigned to any active person in the school's
   people list. A person not in that list cannot be nominated.
7. A change to a nominated contact is marked as confirmed by the Principal.
   Both personas can make the change; the record states the Principal is the
   authority for it.
8. A nominated contact cannot be removed from the people list while nominated.
   The interface says which nomination is blocking it.

### People and access

9. The list shows every person at the school known to ISV, with name, role,
   email, employment status and portal access level.
10. The list is searchable, because a school of this size has dozens of staff.
11. A member can add a person, edit a person, and mark a person as departed.
12. Portal access has three levels: **Full** (everything, including this area),
    **Standard** (everything except this area), and **None** (receives ISV
    communications, cannot sign in).
13. A person added here is immediately available in the event registration
    staff picker.
14. A departed person is retained rather than deleted, is excluded from the
    event registration picker, and stops receiving ISV communications.

### Membership and payment

15. The area shows the current membership period, its status, and the amount
    outstanding.
16. Invoice history is listed with issue date, due date, amount and status.
17. An invoice can be downloaded.
18. Payment offers two paths presented side by side, neither subordinate to the
    other: **pay by invoice** (records an EFT against the invoice and shows the
    remittance details) and **pay by card**.
19. The card path collects card details, shows what will be charged, and
    confirms. It is a prototype and stores nothing.
20. Payment updates the invoice status and the outstanding amount in session
    state, and the change is reflected on the portal landing page.

### Entry points

21. The area is reachable from portal navigation, from the school name in the
    portal masthead, and from the existing membership renewal alert.
22. The portal landing page shows outstanding membership as an alert only while
    something is outstanding.

## Permissions

Both personas have the same rights over the school account. The demo does not
contain a screen that is dead in one persona.

The single governance difference is on nominated contacts, which display as
Principal-confirmed and carry a line naming the Principal as the authority for
them. This shows ISV understands who holds authority in a school without
breaking the walkthrough when the role is switched mid-demo.

## Technical constraints

- Client state only, held in `MemberProvider`, for the same reason job and
  applicant state is: the pages are mounted per route and the provider is not,
  so a change made on one screen has to survive navigation to be demonstrable.
- The people list extends the existing `schoolRoster`. It is not a second list.
  Event registration and this area read the same records, which is requirement
  4 and the strongest thing this area demonstrates.
- No new colour is introduced. Any new surface reuses an existing field tone
  and is verified numerically against WCAG 2.2 AA rather than by eye.
- Reuses existing patterns — `step-rail`, `form-grid`, `listing`, `segment`,
  `fact-list`. A new pattern is only added where none of these fit.

## Content integrity

Carried forward from PRD.md and binding here.

- **No fee claim.** The invoice amount belongs to a fictional school and is
  labelled `ILLUSTRATIVE`. The prototype states no rate, no per-student basis
  and no fee schedule, because ISV's real pricing is not known to this build.
  The walkthrough must say the figure is illustrative if asked.
- **No invented ISV process.** Confirming school details at renewal is grounded
  in ISV's own existing alert copy — "Confirm your school's details and
  nominated contacts". Nothing beyond that is asserted about how ISV collects
  school data.
- **No response times or service levels.**
- **No platform names** in member-facing copy.
- **No legal framing.** Nothing here describes a regulatory obligation. A
  nominated child safety contact is a record ISV holds, not a compliance
  requirement the portal is asserting.

## QA guidelines

| ID | Check | Pass |
|----|-------|------|
| SA1 | Add a person in the school account, then open event registration | The new person appears in the picker without a reload |
| SA2 | Mark a person as departed, then open event registration | The person is absent from the picker |
| SA3 | Attempt to depart a nominated contact | Blocked, with the blocking nomination named |
| SA4 | Pay an invoice by card, then return to the portal landing page | Outstanding amount is cleared and the alert is gone |
| SA5 | Pay an invoice by EFT, then return to the landing page | Same result as SA4 |
| SA6 | Switch persona anywhere in the area | No screen becomes read-only or empty |
| SA7 | Search the people list | Filters on name, role and email |
| SA8 | Every new surface | Text and action contrast clears AA, verified numerically |
| SA9 | Read every string in the area | No fee rate, no response time, no platform name, no legal obligation |
| SA10 | Keyboard through the area | Every control reachable, focus visible on each |

## Open questions

None blocking. Two to confirm before the pitch:

1. Whether ISV wants card payment shown at all for the annual membership. A
   card form for a five-figure annual fee is the most likely thing to be
   queried in the room. Built as instructed; flagged for the walkthrough.
2. Which nominated contact roles ISV actually holds. The four in the build are
   plausible for a Victorian Independent school but are not sourced from ISV.

## Decision log

| Date | Decision | Rationale | Made by |
|------|----------|-----------|---------|
| 2026-08-20 | One people list shared with event registration | The connection is the argument. Two lists would have been easier to build and would have quietly conceded the point the prototype is making. | Cale |
| 2026-08-20 | Invoice and card presented side by side | Cale's call. Schools pay a peak body by invoice, so invoice-led was the recommendation; both were chosen so neither path is assumed. | Cale |
| 2026-08-20 | Same rights for both personas | A screen that goes read-only when the persona is switched is a bad moment in a pitch. Governance is shown on nominated contacts instead. | Cale |
| 2026-08-20 | Portal access is three levels, not a permission matrix | A Business Manager needs to answer "can she see the compliance material". A matrix answers a question nobody asked and takes a minute to explain. | Claude |
| 2026-08-20 | Departed people retained, not deleted | Event history and past registrations reference them. Deleting a person to stop email is a data model that loses the past. | Claude |
| 2026-08-20 | No fee rate stated anywhere | ISV's real pricing is unknown to this build, and a prototype that invents one makes a claim ISV would have to correct in the room. | Claude |
