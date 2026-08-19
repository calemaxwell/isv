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
  brandImage: "/brand/isv-wordmark.svg",
  brandTarget: "_self",

  // Brand
  colorPrimary: "#c8102e", // VERIFY BEFORE PITCH — see DECISIONS.md
  colorSecondary: "#16294a",

  // Chrome
  appBg: "#f4f2ee",
  appContentBg: "#fbfaf8",
  appPreviewBg: "#fbfaf8",
  appBorderColor: "#e8e4dd",
  appBorderRadius: 4,

  // Type. The same stacks the product uses, so a heading in the sidebar
  // and a heading in a story are the same shape.
  fontBase:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',

  textColor: "#161a22",
  textInverseColor: "#fbfaf8",
  textMutedColor: "#5c6370",

  barTextColor: "#5c6370",
  barSelectedColor: "#16294a",
  barHoverColor: "#16294a",
  barBg: "#fbfaf8",

  inputBg: "#fbfaf8",
  inputBorder: "#d8d2c8",
  inputTextColor: "#161a22",
  inputBorderRadius: 3,
});
