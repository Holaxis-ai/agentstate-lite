/**
 * Pages-spike browser E2E (tasks/ui-pages-spike): the FULL experience the HTTP-level tests can't
 * prove — the launcher listing, the sandboxed opaque-origin iframe, the postMessage bridge
 * round-trip delivering data INTO the page, the structural network lock (a page's own fetch is
 * CSP-blocked), and a live update moving a card without a reload. Drives the REAL built CLI over a
 * fresh bundle seeded with the actual `examples/views` seed views (`harness.ts`) — Pulse/Roadmap
 * canonical `type: View`, About deliberately legacy `type: Page` (dual-read pinned end-to-end).
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

test("launcher lists the bundle's View docs (including a legacy Page doc)", async ({ page }) => {
  const ui = await bootUiOverPagesBundle([]);
  try {
    await page.goto(ui.url); // token -> cookie + SPA boot
    await expect(page.locator('[data-page-id="views-registry/pulse"]')).toBeVisible();
    await expect(page.locator('[data-page-id="views-registry/roadmap"]')).toBeVisible();
    // The legacy-typed About doc must list alongside the canonical Views (dual-read).
    await expect(page.locator('[data-page-id="pages-registry/about"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pulse — activity feed" })).toBeVisible();
  } finally {
    await ui.cleanup();
  }
});

test("a directly opened data Page completes its startup bridge queries before iframe load", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="views-registry/roadmap"]').click();

    const iframe = page.locator("iframe.page-frame-iframe");
    await expect(iframe).toBeVisible();
    // Opaque origin: allow-scripts and NOTHING else (no allow-same-origin).
    expect(await iframe.getAttribute("sandbox")).toBe("allow-scripts");

    // These requests are posted by Roadmap's inline startup script, before the parent sees the
    // iframe load event. The bridge round-tripped BOTH the Roadmap Item query and `edges` request:
    // item renders, and its rollup counts the two seeded (non-terminal) tasks it `contains`.
    const frame = page.frameLocator("iframe.page-frame-iframe");
    await expect(frame.locator(".item .title", { hasText: "Spike work" })).toBeVisible();
    await expect(frame.locator(".roll .count")).toHaveText("0/2 done");
  } finally {
    await ui.cleanup();
  }
});

test("a bundle-propose View can change one governed scalar only after trusted-shell confirmation", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="views-registry/trusted-action"]').click();
    const frame = page.frameLocator("iframe.page-frame-iframe");
    await expect(frame.locator("#status")).toHaveText("todo");

    // Simulate a hostile View timing the proposal so the user's next click lands on the shell's
    // predictable Apply target. Observe the trusted shell before proposing and click the button
    // in the same turn in which it is inserted; a real browser must leave the write untouched.
    await page.evaluate(() => {
      const state = window as Window & { __immediateApplyWasDisabled?: boolean };
      const observer = new MutationObserver(() => {
        const apply = Array.from(document.querySelectorAll<HTMLButtonElement>(".action-confirmation-buttons button"))
          .find((button) => button.textContent === "Apply change");
        if (!apply) return;
        state.__immediateApplyWasDisabled = apply.disabled;
        apply.click();
        observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
    await frame.getByRole("button", { name: "Mark Alpha done" }).click();
    const dialog = page.getByRole("dialog", { name: "Apply this bundle change?" });
    await expect(dialog).toBeVisible();
    await expect.poll(() => page.evaluate(() => (window as Window & { __immediateApplyWasDisabled?: boolean }).__immediateApplyWasDisabled)).toBe(true);
    await expect(frame.locator("#status")).toHaveText("todo");
    await expect(dialog).toContainText("tasks/alpha");
    await expect(dialog).toContainText("todo");
    await expect(dialog).toContainText("done");
    await expect(dialog).toContainText("e2e/human");
    const apply = dialog.getByRole("button", { name: "Apply change" });
    await expect(apply).toBeEnabled();
    await apply.click();

    await expect(frame.locator("#result")).toHaveText("committed");
    await expect(frame.locator("#status")).toHaveText("done");
    const persisted = JSON.parse(execFileSync(process.execPath, [CLI_DIST, "doc", "read", "tasks/alpha", "--dir", ui.dir, "--json"], { encoding: "utf8" }));
    expect(persisted.status).toBe("done");
    expect(persisted.actor).toBe("e2e/human");
  } finally {
    await ui.cleanup();
  }
});

test("About navigation opens Roadmap and its startup bridge queries under the target capability, with browser history", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);
    await page.locator('[data-page-id="pages-registry/about"]').click();
    const about = page.frameLocator("iframe.page-frame-iframe");
    await expect(about.getByRole("heading", { name: "About this bundle" })).toBeVisible();

    // Malformed/nonexistent targets stay put; the shell never constructs a route from them.
    const before = page.url();
    await about.locator("body").evaluate(() => {
      (window as unknown as { openPage: (id: string) => void }).openPage("views-registry/missing");
    });
    await page.waitForTimeout(100);
    expect(page.url()).toBe(before);

    await about.getByRole("button", { name: "Open the Roadmap view" }).click();
    await expect(page).toHaveURL(/view=page&id=views-registry%2Froadmap/);
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
    await page.locator('[data-page-id="views-registry/roadmap"]').click();
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
    await page.locator('[data-page-id="views-registry/roadmap"]').click();
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
    await page.locator('[data-page-id="views-registry/roadmap"]').click();
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
    await page.locator('[data-page-id="views-registry/roadmap"]').click();
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

test("F2 regression: a malformed View deep link shows a per-view error, NOT the terminal session-expired screen", async ({ page }) => {
  // The bug the 403 fix above introduced: mintPageNonce also 403s (code FORBIDDEN) for a
  // malformed View doc — an `entry` outside an accepted prefix, or one no registry doc has registered — and
  // such a doc IS clickable today (the launcher doesn't filter entries by prefix). Session-death
  // and this confinement-refusal share nothing but the status code; only getDoc's 403 may trip
  // the terminal recovery screen (PageFrame.tsx's loadPage).
  const ui = await bootUiOverPagesBundle([]);
  try {
    await writeDoc(
      { root: ui.dir },
      { id: "views-registry/bad", frontmatter: { type: "View", title: "Bad view", entry: "not-a-view-prefix/oops.html" }, body: "" },
    );

    await page.goto(ui.url); // establish the session cookie; malformed entries are filtered from the launcher
    const origin = new URL(ui.url).origin;
    await page.goto(`${origin}/?view=page&id=views-registry%2Fbad`);

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
    await page.locator('[data-page-id="views-registry/roadmap"]').click();
    const frame = page.frameLocator("iframe.page-frame-iframe");
    await expect(frame.locator(".item .title", { hasText: "Spike work" })).toBeVisible();

    // Delete the registry doc on disk via the CLI — the watcher pushes the removal over SSE.
    execFileSync(process.execPath, [CLI_DIST, "doc", "delete", "views-registry/roadmap", "--dir", ui.dir], { stdio: "ignore" });

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
    await page.locator('[data-page-id="views-registry/roadmap"]').click();

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

test("home surface: flat badged grid, live activity feed, first-run orientation that dismisses", async ({ page }) => {
  const ui = await bootUiOverPagesBundle(TASKS);
  try {
    await page.goto(ui.url);

    // First run: the orientation renders with the privacy promise; "Got it" dismisses and persists.
    const orientation = page.locator(".orientation");
    await expect(orientation).toBeVisible();
    await expect(orientation).toContainText(/stays private until you choose to share it/i);
    await orientation.getByRole("button", { name: "Got it" }).click();
    await expect(orientation).not.toBeVisible();
    await page.reload();
    await expect(page.locator('[data-page-id="views-registry/pulse"]')).toBeVisible();
    await expect(page.locator(".orientation")).not.toBeVisible();

    // Identity truth (PR-B): a git-less temp bundle is PRIVATE — chip up front, path only behind
    // the disclosure, sharing detail inside the panel. The isolated HOME has no catalog, so no
    // workspaces block renders.
    const chip = page.locator(".chip");
    await expect(chip).toHaveText("private — this computer only");
    await expect(page.locator(".launcher-meta")).not.toContainText(ui.dir);
    await page.locator(".where-btn").click();
    const panel = page.locator(".where-panel");
    await expect(panel).toContainText(ui.dir);
    await expect(panel).toContainText("not shared");
    await page.locator(".where-btn").click();
    await expect(panel).toHaveCount(0);
    await expect(page.locator(".workspaces-toggle")).toHaveCount(0);

    // ONE flat grid with capability badges — the capability-grouped sections are retired.
    await expect(page.locator(".launcher-grid")).toHaveCount(1);
    for (const retired of ["Dashboards", "Interactive", "Documents"]) {
      await expect(page.getByRole("heading", { name: retired, exact: true })).toHaveCount(0);
    }
    await expect(page.locator('[data-page-id="views-registry/roadmap"] .badge')).toHaveText("live data");
    await expect(page.locator('[data-page-id="pages-registry/about"] .badge')).toHaveText("artifact");

    // The activity feed lists the seeded Task docs (filtered: no registry docs, no conventions).
    const feed = page.locator(".feed-list");
    await expect(feed).toBeVisible();
    await expect(feed).toContainText("Alpha task");
    await expect(feed.locator(".feed-row", { hasText: "Pulse — activity feed" })).toHaveCount(0);

    // Live: a NEW doc written behind the server lands in the feed without a reload.
    execFileSync(process.execPath, [
      CLI_DIST, "doc", "write", "notes/live-probe",
      "--type", "Context Note", "--title", "Live probe note", "--actor", "e2e",
      "--dir", ui.dir,
    ]);
    await expect(feed).toContainText("Live probe note", { timeout: 15_000 });
    await expect(feed).toContainText("e2e");
  } finally {
    await ui.cleanup();
  }
});
