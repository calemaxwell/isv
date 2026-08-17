/**
 * Resolves the "@/" path alias for plain Node, so verification scripts can
 * import application modules directly.
 *
 * Node 22 strips TypeScript types natively, so with this hook the QA gate
 * needs no build step and no native binary. That matters: esbuild, swc and
 * lightningcss are all platform-specific, and the checks should still run
 * whatever machine they are on.
 *
 * Usage: node --import ./scripts/alias-hook.mjs scripts/qa.mjs
 */
import { pathToFileURL } from "node:url";
import { register } from "node:module";

const SRC = new URL("../src/", import.meta.url).href;

export async function resolve(specifier, context, next) {
  // Application imports are extensionless. Try the TypeScript file, then an
  // index inside a directory, before falling through.
  const candidates = specifier.startsWith("@/")
    ? [SRC + specifier.slice(2)]
    : specifier.startsWith(".") || specifier.startsWith("file:")
      ? [new URL(specifier, context.parentURL ?? SRC).href]
      : [];

  for (const base of candidates) {
    if (/\.(ts|tsx|mjs|js|json)$/.test(base)) break;
    for (const suffix of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
      try {
        return await next(base + suffix, context);
      } catch {
        // try the next candidate
      }
    }
  }

  return next(specifier, context);
}

register(pathToFileURL(import.meta.filename));
