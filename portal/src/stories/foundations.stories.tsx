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
    token: "--isv-navy",
    name: "Navy",
    job: "Action. Every control that does something.",
  },
  {
    token: "--isv-red",
    name: "Red",
    job: "Accent. Attention, never a default state.",
  },
  {
    token: "--isv-gold",
    name: "Gold",
    job: "Third voice. Darkened to clear AA on white.",
  },
  {
    token: "--isv-teal",
    name: "Teal",
    job: "Supporting. Used sparingly, mostly in tints.",
  },
];

const FIELDS = [
  { token: "--color-page", name: "Paper", job: "The default page ground." },
  { token: "--color-field-warm", name: "Warm", job: "Alternate band." },
  { token: "--color-field-sand", name: "Sand", job: "Aside and decision blocks." },
  { token: "--color-field-mist", name: "Mist", job: "Quiet informational band." },
  { token: "--color-accent-clay", name: "Clay", job: "Red field. Urgency." },
  { token: "--color-field-forest", name: "Forest", job: "Navy field. Statement." },
];

const TYPE = [
  { size: "mega" as const, name: "Mega", job: "Page statement. Serif." },
  { size: "display" as const, name: "Display", job: "Screen title. Serif." },
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
        note="Navy carries action and red carries accent, not the other way round. A page where every button is red has no way left to say something is urgent. Gold was darkened from ISV's published value because the original failed AA badly on white — that change is logged in DECISIONS.md and needs confirming against the brand guidelines before the pitch."
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
      note="Serif for statements, sans for everything you actually read. The jump between mega and body is deliberate and large — a scale with eight indistinguishable steps gives a designer nothing to work with."
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
      note="Four pixels, not eighteen. The whole visual argument is editorial rather than app-like, and a soft corner is the fastest way to lose that. Pills are the one exception, and only for labels."
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
