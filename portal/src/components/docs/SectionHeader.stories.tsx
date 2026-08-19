import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Field, SectionHeader, Wrap } from "@/components/layout";

/**
 * A section heading with an optional link to the full listing.
 *
 * The rule under the heading is the section keyline. Anything below it that
 * draws its own top border produces a double line, which is why there is a
 * `data-rule="none"` escape hatch for blocks that rule themselves.
 */
const meta = {
  title: "Components/Page structure/SectionHeader",
  component: SectionHeader,
  parameters: { layout: "fullscreen" },
  args: {
    heading: "Events and sessions",
    moreLabel: "All events",
    moreHref: "/events",
    inverse: false,
  },
  render: (args) => (
    <Field tone={args.inverse ? "forest" : "paper"}>
      <Wrap>
        <SectionHeader {...args} />
      </Wrap>
    </Field>
  ),
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoLink: Story = { name: "Without a link", args: { moreLabel: undefined } };
export const Inverse: Story = { name: "On a dark field", args: { inverse: true } };
