import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { isvTheme } from "./theme";
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
  // Autodocs on everything. A component without a props table is a picture.
  tags: ["autodocs"],
  decorators: [withMember],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    options: {
      /**
       * Foundations, then components with their properties, then galleries.
       *
       * Components come before Gallery because the properties are the
       * useful thing — a gallery shows what a component looks like, the
       * component page shows what it accepts, and only the second one can
       * be turned into a CMS model.
       */
      storySort: {
        order: [
          "Foundations",
          ["Overview", "Content model"],
          "Components",
          ["Content blocks", "Collections", "Page structure", "Screens", "Primitives"],
          "Gallery",
        ],
      },
    },
    docs: { theme: isvTheme },
    a11y: {
      // Contrast was solved numerically rather than by eye, so it is worth
      // having the checker run on every story and say so out loud.
      test: "todo",
    },
    backgrounds: { disable: true },
  },
};

export default preview;
