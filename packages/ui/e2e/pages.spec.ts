/**
 * Pages-spike browser E2E (tasks/ui-pages-spike): the FULL experience the HTTP-level tests can't
 * prove — the launcher listing, the sandboxed opaque-origin iframe, the postMessage bridge
 * round-trip delivering data INTO the page, the structural network lock (a page's own fetch is
 * CSP-blocked), and a live update moving a card without a reload. Drives the REAL built CLI over a
 * fresh bundle seeded with the actual `examples/pages` seed pages (`harness.ts`).
 */
import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { rm } from "node:fs/promises";
import { bootUiOverPagesBundle, bootUiServerInProcess, seedPagesBundle, CLI_DIST } from "./harness.js";

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

test("the sandboxed page cannot navigate its frame (or the top) to an external origin (frame-src 'self' + sandbox)", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    // frame-src 'self' reports a CSP violation to the shell's console when the framed page tries to
    // navigate anywhere off-origin — capture it as the definitive proof the escape was BLOCKED (the
    // request never leaves; the frame lands on a chrome-error page, NOT example.com).
    const frameSrcViolations: string[] = [];
    page.on("console", (m) => {
      if (/frame-src/i.test(m.text())) frameSrcViolations.push(m.text());
    });

    await page.goto(ui.url);
    const topOriginBefore = new URL(page.url()).origin;
    await page.locator('[data-page-id="pages-registry/board"]').click();
    const handle = await page.waitForSelector("iframe.page-frame-iframe");
    const frame = await handle.contentFrame();
    if (!frame) throw new Error("iframe had no content frame");
    await expect(page.frameLocator("iframe.page-frame-iframe").locator(".col").first()).toBeVisible();

    // From inside the page, attempt to escape to an external origin — self-nav (blocked by the
    // shell's frame-src 'self') and top-nav (blocked by the sandbox: no allow-top-navigation).
    await frame.evaluate(() => {
      try {
        (window.top as Window).location.href = "https://example.com/";
      } catch {
        /* top-nav blocked by sandbox */
      }
      try {
        window.location.href = "https://example.com/";
      } catch {
        /* self-nav blocked */
      }
    });
    await page.waitForTimeout(800);

    // The frame's off-origin navigation was blocked by frame-src 'self' (request never sent)...
    expect(frameSrcViolations.join("\n")).toMatch(/frame-src 'self'/);
    // ...the frame never reached example.com...
    const frameHandleNow = await page.$("iframe.page-frame-iframe");
    const frameNow = frameHandleNow ? await frameHandleNow.contentFrame() : null;
    expect(frameNow?.url() ?? "").not.toContain("example.com");
    // ...and the top page never left the ui origin (sandbox blocked top-nav).
    expect(new URL(page.url()).origin).toBe(topOriginBefore);
  } finally {
    await ui.cleanup();
  }
});

test("P1: an SSE outage self-heals — a change made while the stream was down appears after it returns (no permanent staleness)", async ({ page }) => {
  // The REAL outage this guards: the ui server restarts (the stable-port design invites exactly
  // this), the open tab's SSE stream dies, and a change lands while it is down — no frame will
  // ever replay it. The in-process boot seam lets the restarted server keep the same port AND
  // session secret, so the browser's cookie stays valid and recovery (reconnect -> resync ->
  // full reload/re-query) can be observed end-to-end.
  const dir = await seedPagesBundle(TASKS);
  const secret = "e2e-sse-resilience-fixed-secret";
  const first = await bootUiServerInProcess({ dir, sessionSecret: secret });
  let second: Awaited<ReturnType<typeof bootUiServerInProcess>> | undefined;
  try {
    await page.goto(`http://127.0.0.1:${first.port}/?token=${secret}`);
    await page.locator('[data-page-id="pages-registry/board"]').click();
    const frame = page.frameLocator("iframe.page-frame-iframe");
    await expect(frame.locator(".col", { hasText: "To do" }).locator(".card h3", { hasText: "Alpha task" })).toBeVisible();

    // The server goes away mid-session: the stream drops FOR REAL (socket severed).
    await first.close();
    await page.waitForTimeout(500); // let the client notice the drop

    // The change happens DURING the outage — its SSE frame is lost for good.
    execFileSync(process.execPath, [CLI_DIST, "doc", "update", "tasks/alpha", "--status", "in_progress", "--dir", dir], {
      stdio: "ignore",
    });

    // Same bundle, same port, same secret: the stream reconnects and the resync must recover the
    // missed change even though its delta frame never arrived.
    second = await bootUiServerInProcess({ dir, port: first.port, sessionSecret: secret });
    await expect(frame.locator(".col", { hasText: "In progress" }).locator(".card h3", { hasText: "Alpha task" })).toBeVisible({
      timeout: 20_000,
    });
  } finally {
    await first.close().catch(() => {}); // already closed on the happy path
    await second?.close();
    await rm(dir, { recursive: true, force: true });
  }
});

test("P1: deleting an open page's registry doc revokes the frame — the iframe closes and the bridge goes with it", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="pages-registry/board"]').click();
    const frame = page.frameLocator("iframe.page-frame-iframe");
    await expect(frame.locator(".card h3", { hasText: "Alpha task" })).toBeVisible();

    // Delete the registry doc on disk via the CLI — the watcher pushes the removal over SSE.
    execFileSync(process.execPath, [CLI_DIST, "doc", "delete", "pages-registry/board", "--dir", ui.dir], { stdio: "ignore" });

    // The open frame is torn down (not merely stale) and an explicit revoked state shows.
    await expect(page.locator("iframe.page-frame-iframe")).toHaveCount(0, { timeout: 10_000 });
    await expect(page.locator(".view-status-error")).toContainText("registry doc was removed");
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
