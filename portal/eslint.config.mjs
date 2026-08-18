import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

/**
 * PRD s14: the styling rules are enforced, not just written down.
 * Configured before feature work rather than retrofitted.
 *
 * The Tailwind arbitrary-value ban is checked by scripts/qa.mjs (B3), which
 * understands which utilities are visual. ESLint covers inline styles and
 * CSS-in-JS imports.
 *
 * The Next plugin is here because it was not, and its absence cost us: with
 * no-html-link-for-pages switched off, nineteen internal links were written
 * as plain anchors and every navigation in the prototype was a full page
 * reload. Rules that are not enforced are decoration.
 */
export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "scripts/**", "tmp/**", "next-env.d.ts"] },
  js.configs.recommended,
  {
    files: ["*.mjs"],
    languageOptions: { globals: { process: "readonly" } },
  },
  ...tseslint.configs.recommended,
  // Registered unscoped as well. Next detects the plugin by resolving the
  // config for arbitrary paths, so a registration confined to src/** looks
  // to it like no plugin at all and it keeps warning.
  { plugins: { "@next/next": next } },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { react },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { window: "readonly", document: "readonly", HTMLElement: "readonly" },
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      // A route linked with a plain anchor is a full page load. This is the
      // rule that would have caught it the first time.
      "@next/next/no-html-link-for-pages": ["error", "src/app"],
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
