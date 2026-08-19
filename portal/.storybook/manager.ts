import { addons } from "storybook/manager-api";
import { isvTheme } from "./theme";

// The sidebar, toolbar and docs chrome. The stories themselves are already
// on ISV's palette; this makes the frame around them match.
addons.setConfig({
  theme: isvTheme,
  sidebar: {
    showRoots: true,
  },
});
