import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cell, CellGrid, Field, SectionHeader, Wrap } from "@/components/layout";
import { Text } from "@/components/primitives";

/**
 * Layout.
 *
 * A page in this system is a stack of Fields. Each one owns its ground and
 * its vertical padding, so a screen is composed by choosing bands rather
 * than by managing margins between sections.
 */
const meta: Meta = {
  title: "Layout/Field",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

function Body({ tone }: { tone: string }) {
  const inverse = tone === "forest" || tone === "ink";
  return (
    <Wrap>
      <Text
        as="h2"
        size="h2"
        tone={inverse ? "inverse" : "primary"}
        className="mb-2"
      >
        {tone}
      </Text>
      <Text
        size="small"
        tone={inverse ? "inverseSoft" : "secondary"}
        measure="reading"
      >
        Each field carries its own ground and padding. Stack them and the page
        gets rhythm without a single divider.
      </Text>
    </Wrap>
  );
}

export const Tones: Story = {
  name: "Field tones",
  render: () => (
    <>
      {(["paper", "warm", "sand", "mist", "forest"] as const).map((tone) => (
        <Field key={tone} tone={tone}>
          <Body tone={tone} />
        </Field>
      ))}
    </>
  ),
};

export const Padding: Story = {
  name: "Field padding",
  render: () => (
    <>
      <Field tone="warm">
        <Wrap>
          <Text size="small">Default — the standard band</Text>
        </Wrap>
      </Field>
      <Field tone="sand" tight>
        <Wrap>
          <Text size="small">Tight — for dense modules like requests</Text>
        </Wrap>
      </Field>
      <Field tone="mist" none>
        <Wrap>
          <Text size="small">None — for a hero image that must sit flush</Text>
        </Wrap>
      </Field>
      <Field wash>
        <Wrap>
          <Text size="small">Wash — the gradient the masthead sits on</Text>
        </Wrap>
      </Field>
    </>
  ),
};

export const Header: Story = {
  name: "Section header",
  render: () => (
    <>
      <Field>
        <Wrap>
          <SectionHeader heading="With a more link" moreLabel="All events" moreHref="/events" />
          <Text size="small" tone="secondary">
            The rule under the heading is the section keyline. Anything below it
            that draws its own top border produces a double line — which is why
            the header takes a data-rule=&ldquo;none&rdquo; escape hatch.
          </Text>
        </Wrap>
      </Field>
      <Field tone="forest">
        <Wrap>
          <SectionHeader heading="On an inverse field" moreLabel="All updates" inverse />
          <Text size="small" tone="inverseSoft">
            The rule switches to the inverse line colour automatically.
          </Text>
        </Wrap>
      </Field>
    </>
  ),
};

export const Cells: Story = {
  name: "Cell grid",
  render: () => (
    <Field>
      <Wrap>
        <SectionHeader heading="Cell grid" />
        <CellGrid>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Cell key={n}>
              <Text size="h3" as="h3">
                Cell {n}
              </Text>
              <Text size="small" tone="secondary" className="mt-2">
                Borders sit on the cells rather than the grid, so an incomplete
                last row does not render as a filled slab.
              </Text>
            </Cell>
          ))}
        </CellGrid>
      </Wrap>
    </Field>
  ),
};
