import { create } from "storybook/theming";

/**
 * Storybook wearing ISV's clothes.
 *
 * Worth doing because this is a client-facing artefact, not an internal
 * tool. A default-purple Storybook says "here is our component library";
 * one in the schools' own navy and red says "here is yours". The values are
 * the same tokens the product uses, so the chrome and the components cannot
 * disagree.
 */
export const isvTheme = create({
  base: "light",

  brandTitle: "Independent Schools Victoria — design system",
  brandUrl: "/",
  brandImage: "/brand/isv-stacked.png",
  brandTarget: "_self",

  // Brand — the 2026 identity
  colorPrimary: "#2985e0",   // Royal Blue, used as a mark
  colorSecondary: "#2756a0", // Deep Blue, the action colour

  // Chrome
  appBg: "#f6fbfd",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e3edf3",
  appBorderRadius: 4,

  // Type. The same stacks the product uses, so a heading in the sidebar
  // and a heading in a story are the same shape.
  fontBase:
    '"Avenir Next", Avenir, "Nunito Sans", "Segoe UI", system-ui, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',

  textColor: "#12233d",
  textInverseColor: "#ffffff",
  textMutedColor: "#5f6c7b",

  barTextColor: "#5f6c7b",
  barSelectedColor: "#2756a0",
  barHoverColor: "#2756a0",
  barBg: "#ffffff",

  inputBg: "#ffffff",
  inputBorder: "#7a8997",
  inputTextColor: "#12233d",
  inputBorderRadius: 4,
});
