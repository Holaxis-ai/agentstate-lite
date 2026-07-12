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
import { writeDoc } from "@agentstate-lite/core";
import { bootUiOverPagesBundle, bootUiServerInProcess, seedPagesBundle, CLI_DIST } from "./harness.js";

const TASKS = [
  { id: "tasks/alpha", frontmatter: { type: "Task", title: "Alpha task", status: "todo" }, body: "" },
  { id: "tasks/beta", frontmatter: { type: "Task", title: "Beta task", status: "blocked" }, body: "" },
];

test("launcher lists the bundle's Page docs", async ({ page }) => {
  const ui = await bootUiOverPagesBundle([]);
  try {
    await page.goto(ui.url); // token -> cookie + SPA boot
    await expect(page.locator('[data-page-id="pages-registry/pulse"]')).toBeVisible();
    await expect(page.locator('[data-page-id="pages-registry/roadmap"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pulse — activity feed" })).toBeVisible();
  } finally {
    await ui.cleanup();
  }
});

test("opening a page frames a sandboxed (allow-scripts only) iframe and the bridge delivers data", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="pages-registry/roadmap"]').click();

    const iframe = page.locator("iframe.page-frame-iframe");
    await expect(iframe).toBeVisible();
    // Opaque origin: allow-scripts and NOTHING else (no allow-same-origin).
    expect(await iframe.getAttribute("sandbox")).toBe("allow-scripts");

    // The bridge round-tripped BOTH the Roadmap Item query and the `edges` request: the seeded
    // item renders, and its rollup counts the two seeded (non-terminal) tasks it `contains`.
    const frame = page.frameLocator("iframe.page-frame-iframe");
    await expect(frame.locator(".item .title", { hasText: "Spike work" })).toBeVisible();
    await expect(frame.locator(".roll .count")).toHaveText("0/2 done");
  } finally {
    await ui.cleanup();
  }
});

test("a content Page opens a registered data Page under the target's capability, with browser history", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="pages-registry/about"]').click();
    const about = page.frameLocator("iframe.page-frame-iframe");
    await expect(about.getByRole("heading", { name: "About this bundle" })).toBeVisible();

    // Malformed/nonexistent targets stay put; the shell never constructs a route from them.
    const before = page.url();
    await about.locator("body").evaluate(() => {
      (window as unknown as { openPage: (id: string) => void }).openPage("pages-registry/missing");
    });
    await page.waitForTimeout(100);
    expect(page.url()).toBe(before);

    await about.getByRole("button", { name: "Open the Roadmap Page" }).click();
    await expect(page).toHaveURL(/view=page&id=pages-registry%2Froadmap/);
    const roadmap = page.frameLocator("iframe.page-frame-iframe");
    // Target capability is resolved independently: Roadmap receives bundle data although About
    // was bridge:none.
    await expect(roadmap.locator(".item .title", { hasText: "Spike work" })).toBeVisible();

    await page.goBack();
    await expect(page.frameLocator("iframe.page-frame-iframe").getByRole("heading", { name: "About this bundle" })).toBeVisible();
    await page.goForward();
    await expect(page.frameLocator("iframe.page-frame-iframe").locator(".item .title", { hasText: "Spike work" })).toBeVisible();
  } finally {
    await ui.cleanup();
  }
});

test("the sandboxed page is structurally blocked from reaching the data API (connect-src 'none')", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="pages-registry/roadmap"]').click();
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
    await page.locator('[data-page-id="pages-registry/roadmap"]').click();
    const handle = await page.waitForSelector("iframe.page-frame-iframe");
    const frame = await handle.contentFrame();
    if (!frame) throw new Error("iframe had no content frame");
    await expect(page.frameLocator("iframe.page-frame-iframe").locator(".item").first()).toBeVisible();

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
    await page.locator('[data-page-id="pages-registry/roadmap"]').click();
    const frame = page.frameLocator("iframe.page-frame-iframe");
    const spike = frame.locator(".item", { hasText: "Spike work" });
    // Neither seeded task is done/canceled yet.
    await expect(spike.locator(".roll .count")).toHaveText("0/2 done");

    // The server goes away mid-session: the stream drops FOR REAL (socket severed).
    await first.close();
    await page.waitForTimeout(500); // let the client notice the drop

    // The change happens DURING the outage — its SSE frame is lost for good.
    execFileSync(process.execPath, [CLI_DIST, "doc", "update", "tasks/alpha", "--status", "done", "--dir", dir], {
      stdio: "ignore",
    });

    // Same bundle, same port, same secret: the stream reconnects and the resync must recover the
    // missed change even though its delta frame never arrived — the rollup counter moves.
    second = await bootUiServerInProcess({ dir, port: first.port, sessionSecret: secret });
    await expect(spike.locator(".roll .count")).toHaveText("1/2 done", {
      timeout: 20_000,
    });
  } finally {
    await first.close().catch(() => {}); // already closed on the happy path
    await second?.close();
    await rm(dir, { recursive: true, force: true });
  }
});

test("P1: a session-rotating restart surfaces 'Connection lost' instead of staying silently stale (adversarial-review fold-in)", async ({ page }) => {
  // The restart the review flagged: unlike the SSE-resilience test above (which pins the SAME
  // secret across the restart to prove reconnect recovery), THIS restart mints a genuinely
  // DIFFERENT secret — the real "stable port, rotated session" case. The open tab's cookie is
  // now dead everywhere; the interceptor's 403 handling (queryClient.ts / interceptor.ts) must
  // surface a clear recovery screen the moment ANY request the shell makes needs the session,
  // not a per-view "could not load" banner (the review's "silently stale" finding).
  const dir = await seedPagesBundle(TASKS);
  const first = await bootUiServerInProcess({ dir, sessionSecret: "restart-403-first-secret" });
  let second: Awaited<ReturnType<typeof bootUiServerInProcess>> | undefined;
  try {
    await page.goto(`http://127.0.0.1:${first.port}/?token=restart-403-first-secret`);
    await page.locator('[data-page-id="pages-registry/roadmap"]').click();
    await expect(page.locator("iframe.page-frame-iframe")).toBeVisible();

    // The server goes away and comes back on the SAME port with a DIFFERENT secret — the open
    // tab's cookie no longer authenticates anything.
    await first.close();
    second = await bootUiServerInProcess({ dir, port: first.port, sessionSecret: "restart-403-second-secret" });

    // The first request the dead cookie can no longer carry: navigating back to the launcher
    // (mounting `pagesQuery`, which polls the new server directly regardless of SSE state).
    await page.locator(".page-back").click();
    await expect(page.getByRole("heading", { name: "Connection lost" })).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(".relogin-screen")).toContainText(/reopen the url/i);
  } finally {
    await second?.close();
    await first.close().catch(() => {}); // already closed on the happy path
    await rm(dir, { recursive: true, force: true });
  }
});

test("F2 regression: a malformed Page deep link shows a per-view error, NOT the terminal session-expired screen", async ({ page }) => {
  // The bug the 403 fix above introduced: mintPageNonce also 403s (code FORBIDDEN) for a
  // malformed Page doc — an `entry` outside `pages/`, or one no Page doc has registered — and
  // such a doc IS clickable today (the launcher doesn't filter entries by prefix). Session-death
  // and this confinement-refusal share nothing but the status code; only getDoc's 403 may trip
  // the terminal recovery screen (PageFrame.tsx's loadPage).
  const ui = await bootUiOverPagesBundle([]);
  try {
    await writeDoc(
      { root: ui.dir },
      { id: "pages-registry/bad", frontmatter: { type: "Page", title: "Bad page", entry: "not-a-page-prefix/oops.html" }, body: "" },
    );

    await page.goto(ui.url); // establish the session cookie; malformed entries are filtered from the launcher
    const origin = new URL(ui.url).origin;
    await page.goto(`${origin}/?view=page&id=pages-registry%2Fbad`);

    await expect(page.locator(".view-status-error")).toContainText(/could not open page/i);
    await expect(page.getByRole("heading", { name: "Connection lost" })).toHaveCount(0);
  } finally {
    await ui.cleanup();
  }
});

test("P1: deleting an open page's registry doc revokes the frame — the iframe closes and the bridge goes with it", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="pages-registry/roadmap"]').click();
    const frame = page.frameLocator("iframe.page-frame-iframe");
    await expect(frame.locator(".item .title", { hasText: "Spike work" })).toBeVisible();

    // Delete the registry doc on disk via the CLI — the watcher pushes the removal over SSE.
    execFileSync(process.execPath, [CLI_DIST, "doc", "delete", "pages-registry/roadmap", "--dir", ui.dir], { stdio: "ignore" });

    // The open frame is torn down (not merely stale) and an explicit revoked state shows.
    await expect(page.locator("iframe.page-frame-iframe")).toHaveCount(0, { timeout: 10_000 });
    await expect(page.locator(".view-status-error")).toContainText("registry doc was removed");
  } finally {
    await ui.cleanup();
  }
});

test("a status change streams live into the open page (roadmap rollup updates, no reload)", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="pages-registry/roadmap"]').click();

    const frame = page.frameLocator("iframe.page-frame-iframe");
    const spike = frame.locator(".item", { hasText: "Spike work" });
    // Neither seeded task (alpha: todo, beta: blocked) is done/canceled yet.
    await expect(spike.locator(".roll .count")).toHaveText("0/2 done");

    // Flip alpha to done on disk via the CLI — the ui server's fs.watch picks it up and pushes over SSE.
    execFileSync(process.execPath, [CLI_DIST, "doc", "update", "tasks/alpha", "--status", "done", "--dir", ui.dir], {
      stdio: "ignore",
    });

    // Within a moment the item's rollup counts it, without a page reload.
    await expect(spike.locator(".roll .count")).toHaveText("1/2 done", {
      timeout: 10_000,
    });
  } finally {
    await ui.cleanup();
  }
});
