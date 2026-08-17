import type { School } from "@/types";

/**
 * DATA-SPEC.md section 5. One school, shared by both personas, so the
 * personalisation demonstration is isolated to role.
 *
 * PRE-BUILD CHECK (DATA-SPEC s2): verify this name does not collide with a
 * real ISV member school before the prototype is shown.
 */
export const school: School = {
  id: "school-ashwood-grange",
  name: "Ashwood Grange School",
  suburb: "Camberwell",
  state: "VIC",
  sector: "Independent, co-educational, Prep to Year 12",
  enrolment: 842,
  membershipStatus: "ISV Member School",
  region: "Inner eastern Melbourne",
  notionalSystemOfRecord: "Dynamics 365",
  source: "ILLUSTRATIVE",
  sourceNote:
    'Fictional school. "ISV Member School" is ISV\'s own published term for member schools.',
} satisfies School;
