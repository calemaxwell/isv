/**
 * Article bodies.
 *
 * VOICE RULE, same as everywhere else. These are ISV Perspectives posts and
 * the titles are real, but the body copy here is written for the prototype.
 * It describes practice and what ISV provides. It does not state what a
 * regulation requires, quote a named person, or attribute a position to ISV.
 *
 * All ILLUSTRATIVE. Before the pitch, either replace with the real article
 * text or say plainly in the room that the body is representative.
 */

/**
 * Bylines.
 *
 * Initials rather than a photograph, and an ISV team rather than a named
 * individual. Inventing a headshot and a job title for a real organisation's
 * staff is a line worth not crossing in a prototype, and the voice rules
 * already forbid attributing a position to a named person. Swap in real
 * bylines and photographs before the pitch — the shape is right.
 */
export interface ArticleAuthor {
  name: string;
  title: string;
  initials: string;
  bio: string;
}

const AUTHORS: Record<string, ArticleAuthor> = {
  "news-school-improvement": {
    name: "ISV School Insights",
    title: "School Insights, Independent Schools Victoria",
    initials: "SI",
    bio: "Works with Member Schools on effectiveness surveys, benchmarking and improvement planning.",
  },
  "news-complex-world": {
    name: "ISV Learning and Wellbeing",
    title: "Learning and Wellbeing, Independent Schools Victoria",
    initials: "LW",
    bio: "Supports Member Schools on student wellbeing, learning practice and whole-school capability.",
  },
  "news-business-manager-priorities": {
    name: "ISV School Services",
    title: "School Services, Independent Schools Victoria",
    initials: "SS",
    bio: "Advises Member Schools on operations, employment relations, compliance and risk.",
  },
  "news-inside-our-schools": {
    name: "ISV Communications",
    title: "Communications, Independent Schools Victoria",
    initials: "CO",
    bio: "Tells the stories of Victoria's Independent schools and the communities they serve.",
  },
};

export function articleAuthor(id: string): ArticleAuthor {
  return (
    AUTHORS[id] ?? {
      name: "Independent Schools Victoria",
      title: "Independent Schools Victoria",
      initials: "ISV",
      bio: "Published by Independent Schools Victoria for Member Schools.",
    }
  );
}

export type ArticleBlock =
  | { kind: "para"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "pull"; text: string };

const BODIES: Record<string, ArticleBlock[]> = {
  "news-school-improvement": [
    {
      kind: "para",
      text: "School improvement planning has changed shape over the last decade. Where a plan was once a document produced for a registration cycle and then filed, schools increasingly treat it as something that has to survive contact with a term.",
    },
    {
      kind: "para",
      text: "The schools doing this well tend to share a habit rather than a template. They gather evidence continuously, they include student voice as a source rather than a courtesy, and they are willing to stop an initiative that is not working.",
    },
    { kind: "heading", text: "Evidence that people actually use" },
    {
      kind: "para",
      text: "Most schools have more data than they can act on. The constraint is rarely collection. It is deciding which two or three measures matter enough to change a decision, and then holding to them for long enough to see movement.",
    },
    {
      kind: "pull",
      text: "The constraint is rarely collection. It is deciding which measures matter enough to change a decision.",
    },
    {
      kind: "para",
      text: "Benchmarking against other Independent schools helps here, because it turns an internal number into a question. A result that looks unremarkable on its own often looks different beside the sector.",
    },
    { kind: "heading", text: "Student voice as evidence" },
    {
      kind: "para",
      text: "Schools that treat student voice as evidence rather than consultation ask different questions. Not whether students enjoyed something, but whether they can describe what they were learning and why it mattered.",
    },
    {
      kind: "para",
      text: "ISV's school effectiveness surveys and planning resources are built around this, and ISV advisers can work through what the results mean for your school specifically.",
    },
  ],
  "news-complex-world": [
    {
      kind: "para",
      text: "Children encounter more of the world, earlier, than any generation before them. Schools sit in the middle of that, asked to help young people make sense of events that adults are still processing.",
    },
    {
      kind: "para",
      text: "The instinct to shield is understandable. The schools navigating this well tend to do something harder: they build the capacity to look at something difficult, name it accurately, and put it down again.",
    },
    { kind: "heading", text: "Informed rather than overwhelmed" },
    {
      kind: "para",
      text: "The distinction that matters is between information and exposure. A student who understands why something is happening is usually less distressed than one who has absorbed the images without the frame.",
    },
    {
      kind: "pull",
      text: "A student who understands why something is happening is usually less distressed than one who has absorbed the images without the frame.",
    },
    {
      kind: "para",
      text: "That framing work is a whole-school capability rather than a wellbeing programme. It shows up in how staff answer an unplanned question in a corridor as much as in a scheduled lesson.",
    },
    {
      kind: "para",
      text: "ISV's learning and wellbeing resources cover practical approaches, and the professional learning programme runs sessions for staff working directly with this.",
    },
  ],
  "news-business-manager-priorities": [
    {
      kind: "para",
      text: "Term 3 is the point where the operational year stops being theoretical. Budgets meet reality, staffing plans meet resignations, and the compliance calendar starts to compress.",
    },
    {
      kind: "para",
      text: "Business managers we speak with tend to name the same three pressures: reporting that arrives faster than the data, staffing decisions made under time pressure, and the difficulty of getting a clear view across systems that were never designed to talk to each other.",
    },
    { kind: "heading", text: "What tends to help" },
    {
      kind: "para",
      text: "Schools that handle Term 3 comfortably usually front-load. They confirm contact and record accuracy early, they run the reporting cycle once as a rehearsal, and they resolve employment questions before they become urgent.",
    },
    {
      kind: "pull",
      text: "Schools that handle Term 3 comfortably usually front-load rather than work harder in October.",
    },
    {
      kind: "para",
      text: "ISV's resource library holds reporting and budgeting templates, and employment relations support is available where a question is specific to your school.",
    },
  ],
  "news-inside-our-schools": [
    {
      kind: "para",
      text: "Independent schools in Victoria are far less uniform than the label suggests. They differ in size, philosophy, faith, fee structure and the communities they serve, and that diversity is the point rather than a complication.",
    },
    {
      kind: "para",
      text: "Inside Our Schools looks at individual schools on their own terms: what they are trying to do, who they are doing it for, and what they have learned along the way.",
    },
    { kind: "heading", text: "Specialist settings" },
    {
      kind: "para",
      text: "Some schools exist to serve students who have not been well served elsewhere. The practice in those settings is often ahead of the sector, because the usual approaches were never available to them.",
    },
    {
      kind: "pull",
      text: "The practice in specialist settings is often ahead of the sector, because the usual approaches were never available to them.",
    },
    {
      kind: "para",
      text: "What travels from these schools is rarely a programme. It is a way of thinking about what a student needs before deciding what to offer them.",
    },
  ],
};

export function articleBody(id: string): ArticleBlock[] {
  return (
    BODIES[id] ?? [
      {
        kind: "para",
        text: "The full article is available on the ISV website.",
      },
    ]
  );
}
