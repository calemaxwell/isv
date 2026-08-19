import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/primitives";

/**
 * A button.
 *
 * Primary is navy because navy is the action colour. Secondary is a
 * hairline rather than a grey fill — a filled secondary competes with the
 * primary and the pair stops having a hierarchy. The inverse variants exist
 * because a navy button on a navy field is invisible.
 */
const meta = {
  title: "Components/Primitives/Button",
  component: Button,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="px-gutter py-12">
        <Story />
      </div>
    ),
  ],
  args: {
    variant: "primary",
    size: "base",
    block: false,
    disabled: false,
    children: "Request support",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Quiet: Story = { args: { variant: "quiet" } };
export const Small: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true } };
export const OnInverse: Story = {
  name: "On a dark field",
  args: { variant: "onInverse" },
  decorators: [
    (Story) => (
      <div className="px-gutter py-10">
        <div className="rounded-tile bg-field-forest p-8">
          <Story />
        </div>
      </div>
    ),
  ],
};
