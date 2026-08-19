import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StoryCard, StoryGrid } from "@/components/patterns";

/**
 * A story card.
 *
 * The content type behind the news band and the Support for parents band.
 * Its props are its CMS fields: an eyebrow, a title, a summary, a link and
 * a tone. `tone: "image"` is the only one that uses `imageUrl` — the others
 * are flat colour, because four identical photo cards in a row is a blog
 * index and four identical colour blocks is a swatch chart.
 */
const meta = {
  title: "Components/Content blocks/StoryCard",
  component: StoryCard,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="px-gutter py-10">
        <div className="max-w-sm">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    eyebrow: "Features",
    title: "Teens and cars: what parents need to know",
    summary:
      "Maggie Dent on why capable teenagers still make poor decisions behind the wheel, and what helps.",
    meta: "10 min read",
    href: "/news/news-school-improvement",
    linkLabel: "Read more",
    tone: "sand",
    external: false,
  },
} satisfies Meta<typeof StoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImage: Story = {
  name: "With an image",
  args: {
    tone: "image",
    imageUrl:
      "https://theparentswebsite.com.au/app/uploads/2025/03/Teens-driving-1800-1350x900.jpg",
  },
};

export const Colour: Story = {
  name: "Flat colour",
  args: { tone: "clay" },
};

export const External: Story = {
  name: "Linking off-site",
  args: { tone: "navy", external: true, href: "https://theparentswebsite.com.au" },
};

export const EveryTone: Story = {
  name: "Every tone",
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <Story />],
  render: (args) => (
    <div className="px-gutter py-10">
      <StoryGrid>
        {(["sand", "mist", "navy", "clay", "ochre"] as const).map((tone) => (
          <StoryCard key={tone} {...args} tone={tone} title={tone} />
        ))}
      </StoryGrid>
    </div>
  ),
};
