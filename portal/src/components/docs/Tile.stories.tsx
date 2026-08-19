import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tile, TileBody, TileHeading, TileLink, TilePill } from "@/components/patterns";

/**
 * The base tile.
 *
 * Everything in the mosaic system is built from this. `span` and `rows` are
 * grid geometry rather than content — the grid is four columns wide and
 * every row has to close, or it leaves a hole.
 *
 * There are no white tiles on purpose. A white box on a warm page reads as
 * a component sitting on top of the design rather than part of it.
 */
const meta = {
  title: "Components/Content blocks/Tile",
  component: Tile,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="px-gutter py-10">
        <div className="tile-grid">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    tone: "sand",
    span: 2,
    rows: 1,
    interactive: false,
    children: null,
  },
  argTypes: {
    children: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tile {...args}>
      <span className="mb-4">
        <TilePill tone={args.tone}>Included in your membership</TilePill>
      </span>
      <TileHeading className="text-h3">Employment relations support</TileHeading>
      <TileBody tone={args.tone}>
        Request advice from ISV on employment matters affecting your school.
      </TileBody>
      <TileLink>Request support</TileLink>
    </Tile>
  ),
};

export const Lead: Story = {
  name: "Lead shape",
  args: { tone: "forest", span: 2, rows: 2 },
  render: Default.render,
};

export const FullWidth: Story = {
  name: "Full width",
  args: { tone: "clay", span: 4 },
  render: Default.render,
};
