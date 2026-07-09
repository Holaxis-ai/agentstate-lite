/**
 * Pages-spike browser E2E (tasks/ui-pages-spike): the FULL experience the HTTP-level tests can't
 * prove — the launcher listing, the sandboxed opaque-origin iframe, the postMessage bridge
 * round-trip delivering data INTO the page, the structural network lock (a page's own fetch is
 * CSP-blocked), and a live update moving a card without a reload. Drives the REAL built CLI over a
 * fresh bundle seeded with the actual `examples/pages` seed pages (`harness.ts`).
 */
import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { bootUiOverPagesBundle, CLI_DIST } from "./harness.js";

const TASKS = [
  { id: "tasks/alpha", frontmatter: { type: "Task", title: "Alpha task", status: "todo" }, body: "" },
  { id: "tasks/beta", frontmatter: { type: "Task", title: "Beta task", status: "blocked" }, body: "" },
];

test("launcher lists the bundle's Page docs", async ({ page }) => {
  const ui = await bootUiOverPagesBundle([]);
  try {
    await page.goto(ui.url); // token -> cookie + SPA boot
    await expect(page.locator('[data-page-id="pages-registry/activity-feed"]')).toBeVisible();
    await expect(page.locator('[data-page-id="pages-registry/board"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "Activity feed" })).toBeVisible();
  } finally {
    await ui.cleanup();
  }
});

test("opening a page frames a sandboxed (allow-scripts only) iframe and the bridge delivers data", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="pages-registry/board"]').click();

    const iframe = page.locator("iframe.page-frame-iframe");
    await expect(iframe).toBeVisible();
    // Opaque origin: allow-scripts and NOTHING else (no allow-same-origin).
    expect(await iframe.getAttribute("sandbox")).toBe("allow-scripts");

    // The bridge query round-tripped: the seeded tasks rendered INSIDE the iframe.
    const frame = page.frameLocator("iframe.page-frame-iframe");
    await expect(frame.locator(".card h3", { hasText: "Alpha task" })).toBeVisible();
    await expect(frame.locator(".card h3", { hasText: "Beta task" })).toBeVisible();
  } finally {
    await ui.cleanup();
  }
});

test("the sandboxed page is structurally blocked from reaching the data API (connect-src 'none')", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="pages-registry/board"]').click();
    const handle = await page.waitForSelector("iframe.page-frame-iframe");
    const frame = await handle.contentFrame();
    if (!frame) throw new Error("iframe had no content frame");
    // From inside the page's own context, any network call is CSP-blocked -> fetch rejects.
    const outcome = await frame.evaluate(async () => {
      try {
        await fetch("/v0/bundles/default/docs?fields=frontmatter&type=Task");
        return "REACHED_API";
      } catch (e) {
        return "blocked:" + (e instanceof Error ? e.name : String(e));
      }
    });
    expect(outcome).toMatch(/^blocked:/);
  } finally {
    await ui.cleanup();
  }
});

test("a status change streams live into the open page (card moves columns, no reload)", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="pages-registry/board"]').click();

    const frame = page.frameLocator("iframe.page-frame-iframe");
    // Alpha starts in the To-do column.
    await expect(frame.locator(".col", { hasText: "To do" }).locator(".card h3", { hasText: "Alpha task" })).toBeVisible();

    // Flip it on disk via the CLI — the ui server's fs.watch picks it up and pushes over SSE.
    execFileSync(process.execPath, [CLI_DIST, "doc", "update", "tasks/alpha", "--status", "in_progress", "--dir", ui.dir], {
      stdio: "ignore",
    });

    // Within a moment the card is in the In-progress column, without a page reload.
    await expect(frame.locator(".col", { hasText: "In progress" }).locator(".card h3", { hasText: "Alpha task" })).toBeVisible({
      timeout: 10_000,
    });
  } finally {
    await ui.cleanup();
  }
});
