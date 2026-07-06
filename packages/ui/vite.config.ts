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
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
