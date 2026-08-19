import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FileIcon } from "@/components/patterns";

/**
 * The format mark on a resource.
 *
 * Format is the first thing a member checks before downloading, so it gets
 * a mark rather than a line of text. A Word template is a very different
 * proposition to a forty page PDF.
 */
const meta = {
  title: "Components/Collections/FileIcon",
  component: FileIcon,
  parameters: { layout: "centered" },
  args: { kind: "pdf", large: false },
} satisfies Meta<typeof FileIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pdf: Story = {};
export const Doc: Story = { args: { kind: "doc" } };
export const Sheet: Story = { args: { kind: "sheet" } };
export const Slides: Story = { args: { kind: "slides" } };
export const Web: Story = { args: { kind: "web" } };
export const Large: Story = { args: { large: true } };
