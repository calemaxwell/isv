import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * Storybook for the ISV prototype.
 *
 * The point of this is not testing. It is that the pitch makes a claim about
 * a design system, and a system you can only see assembled into pages is a
 * claim rather than a thing. Here every component stands on its own, with
 * every variant visible at once, which is what a system actually looks like.
 *
 * It is also the handover artefact. Whoever builds this properly starts from
 * these stories, not from the screens.
 */
const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  /**
   * react-docgen-typescript rather than the default react-docgen.
   *
   * The default parses the JavaScript and gets prop names but not much else.
   * This one reads the TypeScript, so every table carries the real union
   * members, whether a prop is required, its default, and the doc comment
   * above it. That is the difference between a props list and something you
   * can generate CMS fields from.
   */
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Without this every component inherits the whole of HTMLAttributes
      // and the table becomes two hundred rows of noise.
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },

  staticDirs: [],
  viteFinal: async (viteConfig) => {
    // Same alias the app uses. Without it every story import breaks.
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      "@": path.resolve(root, "../src"),
    };
    return viteConfig;
  },
};

export default config;
