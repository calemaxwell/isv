import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Field, Wrap } from "@/components/layout";
import { Text } from "@/components/primitives";

/**
 * A page band.
 *
 * A screen in this system is a stack of Fields. Each one owns its ground
 * and its vertical padding, so a page is composed by choosing bands rather
 * than by managing margins between sections. Alternating tones is what
 * gives a long page rhythm without a single divider.
 */
const meta = {
  title: "Components/Page structure/Field",
  component: Field,
  parameters: { layout: "fullscreen" },
  args: {
    tone: "paper",
    tight: false,
    none: false,
    wash: false,
    // Supplied by render, but the type requires it on args.
    children: null,
  },
  argTypes: { children: { control: false } },
  render: (args) => (
    <Field {...args}>
      <Wrap>
        <Text
          as="h2"
          size="h2"
          tone={args.tone === "forest" || args.tone === "ink" ? "inverse" : "primary"}
        >
          {args.tone}
        </Text>
        <Text
          size="small"
          tone={
            args.tone === "forest" || args.tone === "ink"
              ? "inverseSoft"
              : "secondary"
          }
          measure="reading"
          className="mt-2"
        >
          Change the tone and padding in the controls. Every band on every
          screen is one of these.
        </Text>
      </Wrap>
    </Field>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paper: Story = {};
export const Warm: Story = { args: { tone: "warm" } };
export const Sand: Story = { args: { tone: "sand" } };
export const Mist: Story = { args: { tone: "mist" } };
export const Forest: Story = { args: { tone: "forest" } };
export const Wash: Story = { name: "Masthead wash", args: { wash: true } };
export const Tight: Story = { name: "Tight padding", args: { tone: "warm", tight: true } };
