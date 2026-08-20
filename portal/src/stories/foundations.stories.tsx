import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Eyebrow, Text } from "@/components/primitives";

/**
 * Foundations.
 *
 * The tokens, shown rather than listed. A colour table with hex values is a
 * spreadsheet; what a design system needs to communicate is what each colour
 * is *for*, so every swatch here carries its job.
 */
const meta: Meta = {
  title: "Foundations/Overview",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

function Panel({
  heading,
  note,
  children,
}: {
  heading: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-gutter py-field-tight">
      <div className="mx-auto max-w-wide">
        <Text as="h2" size="h2" className="section-header">
          {heading}
        </Text>
        {note ? (
          <Text size="small" tone="secondary" measure="reading" className="mb-8">
            {note}
          </Text>
        ) : null}
        {children}
      </div>
    </section>
  );
}

function Swatch({
  token,
  name,
  job,
}: {
  token: string;
  name: string;
  job: string;
}) {
  return (
    <div className="grid gap-2.5">
      <div className="h-20 rounded-tile border border-line" data-swatch={token} />
      <div>
        <Text as="span" size="small" className="block font-semibold">
          {name}
        </Text>
        <Text as="span" size="micro" tone="tertiary" className="mt-0.5 block">
          {job}
        </Text>
        <Text
          as="span"
          size="micro"
          tone="tertiary"
          mono
          className="mt-1 block"
        >
          {token}
        </Text>
      </div>
    </div>
  );
}

const BRAND = [
  {
    token: "--isv-deep",
    name: "Deep Blue",
    job: "Action. The only brand blue that clears 4.5:1.",
  },
  {
    token: "--isv-royal",
    name: "Royal Blue",
    job: "Seen, not read. Marks, focus, display. 3.80:1.",
  },
  {
    token: "--isv-ocean",
    name: "Ocean Blue",
    job: "Bright tint. Dark text on it, never text itself.",
  },
  {
    token: "--isv-sun",
    name: "Sunshine Yellow",
    job: "Attention. A ground, never a label.",
  },
];

const FIELDS = [
  { token: "--color-page", name: "Paper", job: "The default page ground." },
  { token: "--color-field-warm", name: "Cool", job: "Alternate band." },
  { token: "--color-field-sand", name: "Sand", job: "Aside and decision blocks." },
  { token: "--color-field-mist", name: "Mist", job: "Quiet informational band." },
  { token: "--color-accent-clay", name: "Sunshine", job: "Attention. Dark text." },
  { token: "--color-field-forest", name: "Deep", job: "Statement. White text." },
];

const TYPE = [
  { size: "mega" as const, name: "Mega", job: "Page statement. Light weight." },
  { size: "display" as const, name: "Display", job: "Screen title. Light weight." },
  { size: "h2" as const, name: "H2", job: "Section heading." },
  { size: "h3" as const, name: "H3", job: "Card and row heading." },
  { size: "lede" as const, name: "Lede", job: "Standfirst under a title." },
  { size: "body" as const, name: "Body", job: "Reading copy." },
  { size: "small" as const, name: "Small", job: "Supporting copy in rows." },
  { size: "micro" as const, name: "Micro", job: "Meta, dates, captions." },
];

export const Colour: Story = {
  render: () => (
    <>
      <Panel
        heading="Brand"
        note="The 2026 identity, and the roles are not the obvious ones. Royal is the brightest blue and reads as the natural primary, but at 3.80:1 it fails AA for text — so Deep carries every control and every link, and Royal is reserved for the things that are seen rather than read. Ocean and Sunshine are lighter than most page grounds, which makes them tint tiles with dark copy, the exact inverse of the red and gold blocks they replace."
      >
        <div className="story-swatches">
          {BRAND.map((c) => (
            <Swatch key={c.token} {...c} />
          ))}
        </div>
      </Panel>

      <Panel
        heading="Fields"
        note="A page is a stack of bands, and each band has a job. Alternating them is what gives a long page rhythm without adding borders or cards."
      >
        <div className="story-swatches">
          {FIELDS.map((c) => (
            <Swatch key={c.token} {...c} />
          ))}
        </div>
      </Panel>
    </>
  ),
};

export const Typography: Story = {
  render: () => (
    <Panel
      heading="Type scale"
      note="One family, differentiated by weight. The old system used a Palatino serif for statements; the new wordmark is a light geometric sans and its lightness does most of the work, so display sizes drop in weight rather than reaching for a second family. Avenir Next ships on macOS and is the closest match; swap in ISV's licensed font when it arrives."
    >
      <div className="grid gap-8">
        {TYPE.map((t) => (
          <div key={t.name} className="row-rule pb-6">
            <Eyebrow className="mb-2">
              {t.name} · {t.job}
            </Eyebrow>
            <Text size={t.size}>
              Independent Schools Victoria champions choice and diversity
            </Text>
          </div>
        ))}
      </div>
    </Panel>
  ),
};

export const Radius: Story = {
  name: "Shape and rhythm",
  render: () => (
    <Panel
      heading="Shape"
      note="Held at 4px through the rebrand, deliberately. The new mark is entirely curve and the obvious move is to soften the interface to match — which would make the portal look like every other SaaS product. A fluid logo against a disciplined interface is a position, and the restraint is what keeps this reading as an institution."
    >
      <div className="story-swatches">
        <div className="grid gap-2.5">
          <div className="h-20 rounded-tile bg-field-sand" />
          <Text as="span" size="small" className="font-semibold">
            Tile · 4px
          </Text>
        </div>
        <div className="grid gap-2.5">
          <div className="h-20 rounded-md bg-field-sand" />
          <Text as="span" size="small" className="font-semibold">
            Control · 3px
          </Text>
        </div>
        <div className="grid gap-2.5">
          <div className="h-20 rounded-pill bg-field-sand" />
          <Text as="span" size="small" className="font-semibold">
            Pill · labels only
          </Text>
        </div>
      </div>
    </Panel>
  ),
};
