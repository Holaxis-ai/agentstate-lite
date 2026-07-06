/**
 * Playwright E2E config for the `ui` command (plans/ui-v1.md rev 3.2). Deliberately OUT of
 * `npm run check`/`npm test` (Playwright's browser download stays out of the fast gate) — run
 * via `npm run e2e -w @agentstate-lite/ui`.
 *
 * Every spec drives the REAL BUILT CLI (`packages/cli/dist/agentstate-lite.mjs ui ...`), not a
 * dev server — `webServer` isn't used here because each spec needs its OWN process per mode
 * (`--dir` over a fresh temp bundle, `--remote` proxying a fresh local `serve` instance) with a
 * dynamically OS-assigned port; see `e2e/harness.ts`.
 */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
