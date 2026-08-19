import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Text } from "@/components/primitives";

/**
 * All body and heading text.
 *
 * Three axes: size, tone and measure. Serif for statements, sans for
 * everything you actually read. The inverse tones exist in three steps
 * because a single inverse colour makes every dark panel flat — and the
 * faint step is the one that fails contrast if you are careless, so all
 * three were solved numerically against every ground.
 */
const meta = {
  title: "Components/Primitives/Text",
  component: Text,
  parameters: { layout: "padded" },
  decorators: [(Story) => <div className="px-gutter py-10"><Story /></div>],
  args: {
    size: "body",
    tone: "primary",
    measure: "none",
    mono: false,
    children:
      "Independent Schools Victoria champions choice and diversity in education.",
  },
  argTypes: { as: { control: false } },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};
export const Mega: Story = { args: { size: "mega", measure: "narrow" } };
export const Display: Story = { args: { size: "display", measure: "narrow" } };
export const Lede: Story = { args: { size: "lede", tone: "secondary", measure: "reading" } };
export const Micro: Story = { args: { size: "micro", tone: "tertiary" } };
export const Reading: Story = {
  name: "Reading measure",
  args: {
    measure: "reading",
    children:
      "School improvement planning has changed shape over the last decade. Where a plan was once a document produced for a registration cycle and then filed, schools increasingly treat it as something that has to survive contact with a term.",
  },
};
