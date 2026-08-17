/**
 * Event and session detail.
 *
 * The listing carries a title, a date and a one-line summary. A detail page
 * needs more than that, and the more has to stay inside the voice rules:
 * every line describes what ISV runs, who tends to come, and what happens in
 * the room. Nothing here states a legal requirement, a deadline, or an
 * outcome ISV has not published.
 *
 * All ILLUSTRATIVE. The Arts Learning Festival is a real ISV event, so its
 * detail is deliberately thin — better a short true page than a full page of
 * invented programme.
 */

export interface Presenter {
  name: string;
  title: string;
  bio: string;
  /** Initials stand in for a photo. No invented headshots. */
  initials: string;
}

/**
 * A session within a series. ISV's real webinar series run monthly with a
 * different topic each time and members attend as few or as many as they
 * like, so a session has to be individually selectable.
 */
export interface Session {
  id: string;
  dateIso: string;
  time: string;
  topic: string;
}

export interface EventDetail {
  /** Two or three paragraphs. What the session is and how it runs. */
  about: string[];
  /** Short, scannable. Not a curriculum. */
  covers: string[];
  /** Who tends to be in the room. Descriptive, not a restriction. */
  audience: string;
  /** Venue or platform line beneath the date */
  venueNote: string;
  /** Arrival to close. Empty array renders nothing. */
  runsheet: { time: string; label: string }[];
  /** What it costs a member school. Almost always included. */
  cost: string;
  /** How it is delivered and when joining details arrive */
  deliveryNote: string;
  /** Recording availability, where ISV offers one */
  recordingNote?: string;
  /** ISV staff running it */
  presenters: Presenter[];
  /**
   * Present only for a series. When set, registration asks which sessions
   * before it asks anything else, because that choice changes everything
   * downstream.
   */
  sessions?: Session[];
  /** Where to go if registration itself is the problem */
  helpEmail: string;
}

const DETAILS: Record<string, EventDetail> = {
  "event-principals-breakfast": {
    about: [
      "A standing breakfast for Principals of Independent schools, held across the year in different parts of Melbourne. There is no presentation and no panel. The value is the table.",
      "Most people come with something specific they are working through. Sessions have covered staffing pressure, community expectations, board relationships and the practical side of school improvement planning. ISV staff attend and take away what they hear.",
    ],
    covers: [
      "Open discussion set by the people in the room",
      "What other Independent schools are working through right now",
      "Direct access to ISV advisers over the table",
    ],
    audience:
      "Principals and Heads of School. Numbers are held low deliberately so the conversation stays one conversation.",
    venueNote: "Breakfast served on arrival. Finishes before the school day.",
    runsheet: [
      { time: "7.15am", label: "Arrival and breakfast" },
      { time: "7.45am", label: "Discussion opens" },
      { time: "8.45am", label: "Close" },
    ],
    cost: "Included in your membership",
    deliveryNote: "Joining or venue details are emailed after you register.",
    presenters: [],
    helpEmail: "enquiries@is.vic.edu.au",
  },
  "event-business-managers-forum": {
    about: [
      "A working forum for the people who run the operational side of Independent schools. It is built around what Business Managers are actually dealing with in the current term rather than a fixed agenda set months ahead.",
      "ISV brings the sector view — what we are seeing across member schools — and the room brings the detail. Both halves matter.",
    ],
    covers: [
      "Operational pressures across the term",
      "Reporting, budgeting and staffing practice in other schools",
      "Questions taken directly to ISV advisers",
    ],
    audience:
      "Business Managers, Finance Managers and school operations staff.",
    venueNote: "Refreshments provided. Parking available on site.",
    runsheet: [
      { time: "9.30am", label: "Arrival" },
      { time: "10.00am", label: "Sector view from ISV" },
      { time: "10.45am", label: "Working discussion" },
      { time: "12.00pm", label: "Close and lunch" },
    ],
    cost: "Included in your membership",
    deliveryNote: "Joining or venue details are emailed after you register.",
    presenters: [],
    helpEmail: "enquiries@is.vic.edu.au",
  },
  "event-islead-briefing": {
    about: [
      "An overview of ISV's school effectiveness surveys: what they measure, how schools run them, and what the results look like once they come back.",
      "The second half works through a sample result set. Reading a survey report well is a skill, and it is the part schools most often ask us about.",
    ],
    covers: [
      "What the surveys measure and how they are run",
      "Reading a result set, using a worked example",
      "How schools have used results in their planning",
    ],
    audience:
      "Principals, Deputy Principals and anyone leading school improvement planning.",
    venueNote: "Online. Joining details are emailed the day before.",
    recordingNote:
      "A recording is available to member schools for 12 months.",
    presenters: [
      {
        name: "ISV School Insights",
        title: "School Insights, Independent Schools Victoria",
        bio: "ISV's insights team runs the school effectiveness surveys and works with schools on reading and using the results.",
        initials: "SI",
      },
    ],
    runsheet: [
      { time: "3.30pm", label: "Overview of the surveys" },
      { time: "4.00pm", label: "Worked example" },
      { time: "4.30pm", label: "Questions" },
      { time: "5.00pm", label: "Close" },
    ],
    cost: "Included in your membership",
    deliveryNote:
      "Online. A joining link is emailed 24 hours before the session.",
    helpEmail: "learning@is.vic.edu.au",
  },
  "event-registration-briefing": {
    about: [
      "A briefing on how ISV supports schools through registration and review, and what the support looks like in practice at each stage.",
      "It covers the resources available in the portal, when schools tend to reach out, and what an adviser can do alongside a school's own team.",
    ],
    covers: [
      "What ISV provides at each stage of a review cycle",
      "Which resources in the portal schools use most",
      "How to bring an ISV adviser in, and when",
    ],
    audience:
      "Principals, Business Managers and staff holding compliance responsibility.",
    venueNote: "Online. Recording available to member schools afterwards.",
    runsheet: [
      { time: "10.00am", label: "How ISV supports a review cycle" },
      { time: "10.40am", label: "Resources walkthrough" },
      { time: "11.15am", label: "Questions" },
      { time: "11.30am", label: "Close" },
    ],
    cost: "Included in your membership",
    deliveryNote: "Joining or venue details are emailed after you register.",
    presenters: [],
    helpEmail: "enquiries@is.vic.edu.au",
  },
  /**
   * A series. Modelled on how ISV actually runs recurring webinar
   * programmes: one enrolment, a different topic each month, and members
   * attend as few or as many as they like. That last part is why the
   * registration flow has to ask which sessions before it asks anything
   * else — it changes who you would bring and how many places you take.
   */
  "learning-child-safety-practice": {
    about: [
      "A monthly lunchtime series for school leaders and the staff who hold child safety responsibility. Each session runs for an hour over lunch, which is the only hour most people in these roles reliably have.",
      "Sessions are practical rather than theoretical. Each one works through what the topic looks like inside a school, using situations ISV has seen across member schools.",
      "You register once and attend the sessions that suit you. There is no expectation you come to all of them.",
    ],
    covers: [
      "One hour, once a month, over lunch",
      "A different topic each session, listed below",
      "Recordings available to member schools afterwards",
    ],
    audience:
      "Principals, Deputy Principals, Business Managers, and staff holding child safety or compliance responsibility.",
    venueNote: "Online. Attend the sessions that suit you.",
    runsheet: [],
    cost: "Included in your membership",
    deliveryNote:
      "Online. A joining link is emailed 24 hours before each session you have registered for.",
    recordingNote:
      "Recordings are available to member schools for 12 months after each session.",
    helpEmail: "learning@is.vic.edu.au",
    presenters: [
      {
        name: "ISV School Services",
        title: "School Services, Independent Schools Victoria",
        bio: "ISV's School Services advisers work with Member Schools on practice across compliance, risk and school operations.",
        initials: "SS",
      },
      {
        name: "ISV Professional Learning",
        title: "Learning and Development, Independent Schools Victoria",
        bio: "ISV's learning team designs and runs the professional learning programme for Member Schools.",
        initials: "PL",
      },
    ],
    sessions: [
      {
        id: "s-oct",
        dateIso: "2026-10-07",
        time: "1.00pm to 2.00pm",
        topic: "Building a child safe culture that staff recognise",
      },
      {
        id: "s-nov",
        dateIso: "2026-11-04",
        time: "1.00pm to 2.00pm",
        topic: "Record keeping that holds up under review",
      },
      {
        id: "s-dec",
        dateIso: "2026-12-02",
        time: "1.00pm to 2.00pm",
        topic: "Working with families when a concern is raised",
      },
      {
        id: "s-feb",
        dateIso: "2027-02-03",
        time: "1.00pm to 2.00pm",
        topic: "Induction and ongoing training for new staff",
      },
      {
        id: "s-mar",
        dateIso: "2027-03-03",
        time: "1.00pm to 2.00pm",
        topic: "Student voice in child safety practice",
      },
    ],
  },
  "event-arts-learning-festival": {
    about: [
      "ISV's festival celebrating arts learning across Independent schools. Student work is presented and performed across the programme.",
      "Programme details are published on the festival site closer to the date.",
    ],
    covers: [
      "Student work from across Independent schools",
      "Performance and exhibition across the programme",
    ],
    audience: "Open to member schools, students and families.",
    venueNote: "Programme and venue detail published closer to the date.",
    runsheet: [],
    cost: "Included in your membership",
    deliveryNote: "Joining or venue details are emailed after you register.",
    presenters: [],
    helpEmail: "enquiries@is.vic.edu.au",
  },
};

const LEARNING_FALLBACK: EventDetail = {
  cost: "Included in your membership",
  deliveryNote: "Joining or venue details are emailed after you register.",
  presenters: [],
  helpEmail: "enquiries@is.vic.edu.au",
  about: [
    "An ISV professional learning session. It runs as a working session rather than a lecture, and the material is drawn from what ISV sees across member schools.",
    "Places are limited so there is room for questions specific to your school.",
  ],
  covers: [
    "Practice drawn from across Independent schools",
    "Working through material against your own school's position",
    "Direct access to the ISV staff who run this area",
  ],
  audience: "Open to staff of ISV member schools.",
  venueNote: "Joining or venue details are emailed after you register.",
  runsheet: [],
};

export function eventDetail(id: string): EventDetail {
  return DETAILS[id] ?? LEARNING_FALLBACK;
}
