import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { MemberProvider } from "../src/lib/member-context";
import "../src/app/globals.css";

/**
 * Every story renders inside MemberProvider.
 *
 * Most components read the member, the school or the panel state from
 * context. Mocking that per story would mean maintaining a second version of
 * the fixtures; wrapping once means the stories show the same data the
 * screens do, and a change to the fixtures shows up here immediately.
 */
const withMember: Decorator = (Story) => (
  <MemberProvider>
    <div className="sb-canvas">
      <Story />
    </div>
  </MemberProvider>
);

const preview: Preview = {
  decorators: [withMember],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    options: {
      // Foundations first, then the system from the smallest piece up.
      storySort: {
        order: [
          "Foundations",
          ["Introduction", "Colour", "Typography", "Space and rhythm"],
          "Primitives",
          "Layout",
          "Patterns",
          "Features",
          "Screens",
        ],
      },
    },
    a11y: {
      // Contrast was solved numerically rather than by eye, so it is worth
      // having the checker run on every story and say so out loud.
      test: "todo",
    },
    backgrounds: { disable: true },
  },
};

export default preview;
