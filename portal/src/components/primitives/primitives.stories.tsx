import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  AlertIcon,
  ArrowIcon,
  Avatar,
  Badge,
  Button,
  ChevronIcon,
  Divider,
  Eyebrow,
  InclusionMark,
  InfoIcon,
  LinkButton,
  SearchIcon,
  Text,
  ThinkingDots,
} from "@/components/primitives";

/**
 * Primitives.
 *
 * Every variant on one screen. This is the check that catches the things
 * page-by-page review never does: a tone that only works on one ground, a
 * size that collides with the one above it, a state nobody styled.
 */
const meta: Meta = {
  title: "Gallery/Primitives",
  tags: ["!autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

function Row({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="row-rule py-7">
      <Eyebrow className="mb-1.5">{label}</Eyebrow>
      {note ? (
        <Text size="small" tone="secondary" measure="reading" className="mb-4">
          {note}
        </Text>
      ) : null}
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

export const Buttons: Story = {
  render: () => (
    <div className="px-gutter">
      <Row
        label="Variants"
        note="Primary is navy because navy is the action colour. Secondary is a hairline, not a grey fill — a filled secondary competes with the primary and the pair stops having a hierarchy."
      >
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="quiet">Quiet</Button>
        <Button disabled>Disabled</Button>
      </Row>

      <Row label="Sizes">
        <Button size="base">Base</Button>
        <Button size="sm">Small</Button>
      </Row>

      <Row
        label="On an inverse ground"
        note="The inverse variants exist because a navy button on a navy field is invisible. Shown on the field they are built for."
      >
        <span className="flex flex-wrap gap-4 rounded-tile bg-field-forest p-6">
          <Button variant="onInverse">On inverse</Button>
          <Button variant="ghostInverse">Ghost inverse</Button>
        </span>
      </Row>

      <Row label="As a link" note="Renders an anchor, and routes internal hrefs through next/link.">
        <LinkButton href="/portal">Go to the portal</LinkButton>
        <LinkButton variant="secondary" href="https://is.vic.edu.au">
          External
        </LinkButton>
      </Row>

      <Row label="Block">
        <span className="w-72">
          <Button block>Full width</Button>
        </span>
      </Row>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="px-gutter">
      <Row label="Tones">
        <span className="grid gap-2">
          <Text tone="primary">Primary — the default reading colour</Text>
          <Text tone="secondary">Secondary — supporting copy</Text>
          <Text tone="tertiary">Tertiary — meta and captions</Text>
          <Text tone="action">Action — navy, used for links</Text>
          <Text tone="error">Error — deliberately browner than brand red</Text>
        </span>
      </Row>

      <Row
        label="Inverse tones"
        note="Three steps, not one. A single inverse colour makes every dark panel flat, and the faint step is the one that fails contrast if you are careless — these were solved numerically against all six grounds."
      >
        <span className="grid gap-2 rounded-tile bg-field-forest p-6">
          <Text tone="inverse">Inverse</Text>
          <Text tone="inverseSoft">Inverse soft</Text>
          <Text tone="inverseFaint">Inverse faint</Text>
        </span>
      </Row>

      <Row label="Measure" note="Line length is capped so long copy stays readable.">
        <span className="grid gap-4">
          <Text measure="reading">
            Reading measure. School improvement planning has changed shape over
            the last decade, and schools increasingly treat a plan as something
            that has to survive contact with a term rather than a document
            produced for a registration cycle.
          </Text>
          <Text measure="narrow" size="h3">
            Narrow measure, used for headings that would otherwise run the full
            width of a wide screen
          </Text>
        </span>
      </Row>

      <Row label="Eyebrow">
        <Eyebrow>Governance, compliance and risk</Eyebrow>
      </Row>
    </div>
  ),
};

export const Marks: Story = {
  render: () => (
    <div className="px-gutter">
      <Row label="Badge">
        <Badge>Included</Badge>
        <span className="rounded-tile bg-field-forest p-4">
          <Badge inverse>On inverse</Badge>
        </span>
      </Row>

      <Row label="Inclusion mark" note="Says the thing costs nothing extra, without a price.">
        <InclusionMark>Included in your membership</InclusionMark>
      </Row>

      <Row label="Avatar">
        <Avatar initials="ME" />
        <Avatar initials="DO" />
      </Row>

      <Row label="Icons" note="Hand-drawn at 16px on a 1.5 stroke, to sit with lucide at 1.6.">
        <SearchIcon />
        <ArrowIcon />
        <ChevronIcon />
        <InfoIcon />
        <AlertIcon />
      </Row>

      <Row label="Thinking" note="Ask ISV's waiting state. Three dots, staggered.">
        <ThinkingDots />
      </Row>

      <Row label="Divider">
        <span className="w-full">
          <Divider />
        </span>
      </Row>
    </div>
  ),
};
