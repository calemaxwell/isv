import type { Member } from "@/types";

/**
 * DATA-SPEC.md section 6.
 *
 * Phone numbers use the Australian fiction-reserved range. A literal
 * placeholder would render in a visible form field during Act 3 and fail
 * QA S1.
 *
 * PRE-BUILD CHECK (DATA-SPEC s2): verify neither name collides with a known
 * ISV staff member or a serving Victorian Independent school Principal.
 */
export const members: Member[] = [
  {
    id: "member-principal",
    role: "principal",
    roleLabel: "Principal",
    firstName: "Margaret",
    lastName: "Ellery",
    email: "m.ellery@ashwoodgrange.vic.edu.au",
    phone: "03 5550 0142",
    schoolId: "school-ashwood-grange",
    interests: [
      "school improvement",
      "leadership development",
      "advocacy",
      "strategic planning",
    ],
    communicationPreferences: [
      { channel: "ISV eCommunications", subscribed: true, frequency: "Weekly" },
      {
        channel: "Professional learning updates",
        subscribed: true,
        frequency: "Monthly",
      },
      {
        channel: "Advocacy and policy updates",
        subscribed: true,
        frequency: "As published",
      },
      {
        channel: "Event invitations",
        subscribed: true,
        frequency: "As scheduled",
      },
    ],
    notionalSystemOfRecord: "Dynamics 365",
    source: "ILLUSTRATIVE",
    sourceNote:
      "Fictional person. Interests derive from the Principal priority areas named in RFP s4.",
  },
  {
    id: "member-business-manager",
    role: "business-manager",
    roleLabel: "Business Manager",
    firstName: "David",
    lastName: "Okonjo",
    email: "d.okonjo@ashwoodgrange.vic.edu.au",
    phone: "03 5550 0173",
    schoolId: "school-ashwood-grange",
    interests: [
      "employment relations",
      "compliance reporting",
      "school operations",
      "funding",
    ],
    communicationPreferences: [
      { channel: "ISV eCommunications", subscribed: true, frequency: "Weekly" },
      {
        channel: "Professional learning updates",
        subscribed: true,
        frequency: "Monthly",
      },
      {
        channel: "Advocacy and policy updates",
        subscribed: false,
        frequency: "Not subscribed",
      },
      {
        channel: "Event invitations",
        subscribed: true,
        frequency: "As scheduled",
      },
    ],
    notionalSystemOfRecord: "Dynamics 365",
    source: "ILLUSTRATIVE",
    sourceNote:
      "Fictional person. Interests derive from the Business Manager priority areas named in RFP s4.",
  },
] satisfies Member[];
