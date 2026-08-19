import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ListingScreen } from "@/components/features/listing";
import { events, learning, news, resources } from "@/data/content";

/**
 * A whole listing screen.
 *
 * One CMS page type. Search plus metadata filters derived from the data
 * rather than declared, so a listing can never offer a filter that returns
 * nothing. `featuredCount` lifts the first three items into a band above
 * the index and removes them from it — showing them twice, one directly
 * under the other, reads as a bug.
 */
const meta = {
  title: "Components/Screens/ListingScreen",
  component: ListingScreen,
  parameters: { layout: "fullscreen" },
  args: {
    eyebrow: "From ISV",
    heading: "News and updates",
    intro:
      "Articles, sector commentary and updates from across ISV, newest first.",
    items: news,
    facets: ["category", "area", "recency"],
    featuredCount: 0,
    dated: false,
    files: false,
    hrefFor: (item) => `/news/${item.id}`,
    actionLabel: "Read",
    actionHrefFor: (item) => `/news/${item.id}`,
    emptyBody: "Try a broader topic.",
  },
  argTypes: {
    hrefFor: { control: false },
    actionHrefFor: { control: false },
    items: { control: false },
  },
} satisfies Meta<typeof ListingScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const News: Story = {};

export const NewsFeatured: Story = {
  name: "With a featured band",
  args: { featuredCount: 3 },
};

export const Events: Story = {
  name: "Events — date led",
  args: {
    eyebrow: "What's on",
    heading: "Events and sessions",
    intro: "Everything ISV is running, in date order.",
    items: [...events, ...learning].sort((a, b) =>
      (a.eventIso ?? "").localeCompare(b.eventIso ?? ""),
    ),
    facets: ["format", "category", "area"],
    dated: true,
    hrefFor: (item) => `/events/${item.id}`,
    actionLabel: "Register",
    actionHrefFor: (item) => `/events/${item.id}/register`,
    emptyBody: "Try widening the format or topic.",
  },
};

export const Resources: Story = {
  name: "Resources — with file marks",
  args: {
    eyebrow: "Resource library",
    heading: "Resources",
    intro: "Guidance, templates and reference material published by ISV.",
    items: resources,
    facets: ["category", "area"],
    files: true,
    hrefFor: (item) => `/resources/${item.id}`,
    actionLabel: "Download",
    actionHrefFor: (item) => `/resources/${item.id}`,
    emptyBody: "Try a broader topic.",
  },
};
