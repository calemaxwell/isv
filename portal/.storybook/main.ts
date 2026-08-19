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
