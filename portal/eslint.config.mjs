import js from "@eslint/js";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

/**
 * PRD s14: the styling rules are enforced, not just written down.
 * Configured before feature work rather than retrofitted.
 *
 * The Tailwind arbitrary-value ban is checked by scripts/qa.mjs (B3), which
 * understands which utilities are visual. ESLint covers inline styles and
 * CSS-in-JS imports.
 */
export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "scripts/**", "tmp/**", "next-env.d.ts"] },
  js.configs.recommended,
  {
    files: ["*.mjs"],
    languageOptions: { globals: { process: "readonly" } },
  },
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { react },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { window: "readonly", document: "readonly", HTMLElement: "readonly" },
    },
    rules: {
      "react/forbid-dom-props": ["error", { forbid: ["style"] }],
      "react/forbid-component-props": ["error", { forbid: ["style"] }],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "styled-components", message: "No CSS-in-JS. PRD s14." },
            { name: "@emotion/react", message: "No CSS-in-JS. PRD s14." },
            { name: "@emotion/styled", message: "No CSS-in-JS. PRD s14." },
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
