// Vite build config for the `ui` SPA (plans/ui-v1.md rev 3.2).
//
// `publicDir: false` — packages/ui/public/index.html predates this package (item 43, the
// retired Cloudflare Access foundations pass): a placeholder shell for the WORKER's future
// `assets` binding, explicitly kept ("reused as-is") for that separate, not-yet-built hosted
// unit. Vite's default publicDir behavior copies public/*  verbatim into THIS build's dist/,
// which would collide with (or be overwritten by) the real built index.html below — disabling
// it leaves that file untouched for its own future consumer instead of forking/deleting it.
//
// Deterministic, hashed asset filenames (Vite's default) are what makes the CLI's embed step
// reproducible byte-for-byte given identical source (the skill-bundle drift gate depends on
// this — see packages/cli/scripts/embed-ui-assets.mjs).
// `vitest/config`'s `defineConfig` merges Vite's `UserConfig` with the `test` block's type —
// a drop-in replacement for `vite`'s own `defineConfig` that also typechecks `test` below.
import { defineConfig, type Plugin } from "vitest/config";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

/**
 * Ship the self-hosted Cormorant Garamond subset's OFL license text alongside the woff2 in
 * dist/ (embed-ui-assets.mjs gzips whatever lands in dist/ into the CLI's committed skill
 * bundle, and it ships in the npm package the same way) — OFL 1.1 §2 requires the copyright and
 * license notice travel with the Font Software, including a subsetted/modified copy, and a
 * sibling file that stays in `src/` (never built) satisfies neither the npm nor the skill
 * distribution channel. The font's own name-table IDs 0/13/14 carry a copy too (belt); this is
 * the plain-text suspenders, readable without a font parser.
 */
function shipFontLicense(): Plugin {
  return {
    name: "ship-font-license",
    generateBundle() {
      this.emitFile({
        type: "asset" as const,
        fileName: "assets/fonts/CormorantGaramond-OFL.txt",
        source: readFileSync(new URL("./src/assets/fonts/CormorantGaramond-OFL.txt", import.meta.url)),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), shipFontLicense()],
  publicDir: false,
  build: {
    outDir: "dist",
    sourcemap: false,
    // No inline scripts in the emitted HTML — required by the strict CSP the `ui` server sets
    // on every asset response (default-src 'self', no 'unsafe-inline').
    modulePreload: { polyfill: false },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: false,
  },
});
