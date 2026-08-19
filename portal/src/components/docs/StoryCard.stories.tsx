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
  parameters: { layout: "fullscreen" },
  // Page padding only. A width constraint belongs on the stories that show
  // one card — put it here and it also squeezes the grid, because story
  // decorators compose with meta decorators rather than replacing them.
  decorators: [
    (Story) => (
      <div className="px-gutter py-12">
        <Story />
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

/** One card at the width it actually renders at in a three-across grid. */
const single: NonNullable<Story["decorators"]> = [
  (Story) => (
    <div className="story-single">
      <Story />
    </div>
  ),
];

export const Default: Story = { decorators: single };

export const WithImage: Story = {
  name: "With an image",
  decorators: single,
  args: {
    tone: "image",
    imageUrl:
      "https://theparentswebsite.com.au/app/uploads/2025/03/Teens-driving-1800-1350x900.jpg",
  },
};

export const Colour: Story = {
  name: "Flat colour",
  decorators: single,
  args: { tone: "clay" },
};

export const External: Story = {
  name: "Linking off-site",
  decorators: single,
  args: {
    tone: "navy",
    external: true,
    href: "https://theparentswebsite.com.au",
  },
};

/**
 * All six tones in the grid they are designed for, so the comparison is
 * like for like. Card heights equalise because the grid stretches them.
 */
export const EveryTone: Story = {
  name: "Every tone",
  render: (args) => (
    <StoryGrid>
      {(["sand", "mist", "image", "navy", "clay", "ochre"] as const).map(
        (tone) => (
          <StoryCard
            key={tone}
            {...args}
            tone={tone}
            eyebrow={tone}
            imageUrl={
              tone === "image"
                ? "https://theparentswebsite.com.au/app/uploads/2025/03/Listening-1800a-1350x900.jpg"
                : undefined
            }
          />
        ),
      )}
    </StoryGrid>
  ),
};
