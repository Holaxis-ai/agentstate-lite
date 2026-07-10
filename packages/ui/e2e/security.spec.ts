/**
 * Token/session security spec (plans/ui-v1.md rev 3.2): a request carrying NEITHER the per-run
 * token NOR a valid session cookie must be rejected (403) — the trust boundary a bare loopback
 * proxy would otherwise widen past the 0600 credentials file. Uses Playwright's `request`
 * fixture (no browser, no cookie jar) rather than a `page`, so "no credentials at all" is
 * exactly what's under test.
 */
import { test, expect, request as playwrightRequest } from "@playwright/test";
import { bootUiOverDirBundle, bootUiOverPagesBundle } from "./harness.js";

test("a request with no token and no session cookie is rejected (403)", async () => {
  const instance = await bootUiOverDirBundle([]);
  try {
    const bareOrigin = new URL(instance.url).origin;
    const ctx = await playwrightRequest.newContext();
    try {
      const shellRes = await ctx.get(bareOrigin + "/");
      expect(shellRes.status()).toBe(403);

      const apiRes = await ctx.get(bareOrigin + "/v0/bundles/default/docs?fields=frontmatter&type=Task");
      expect(apiRes.status()).toBe(403);
    } finally {
      await ctx.dispose();
    }
  } finally {
    await instance.cleanup();
  }
});

test("the tokenized URL exchanges for a session cookie that then authorizes plain requests", async () => {
  const instance = await bootUiOverDirBundle([]);
  try {
    const ctx = await playwrightRequest.newContext();
    try {
      const first = await ctx.get(instance.url); // carries ?token=...
      expect(first.status()).toBe(200);
      expect(first.headers()["set-cookie"] ?? "").toMatch(/HttpOnly/i);
      expect(first.headers()["content-security-policy"] ?? "").toContain("default-src 'self'");

      const bareOrigin = new URL(instance.url).origin;
      // Playwright's request context persists cookies from prior responses automatically.
      const withCookie = await ctx.get(bareOrigin + "/v0/bundles/default/docs?fields=frontmatter&type=Task");
      expect(withCookie.status()).toBe(200);
    } finally {
      await ctx.dispose();
    }
  } finally {
    await instance.cleanup();
  }
});

test("P1: the session token never reaches a framed page — address bar scrubbed, document.referrer empty inside the iframe", async ({ page }) => {
  const ui = await bootUiOverPagesBundle([{ id: "tasks/alpha", frontmatter: { type: "Task", title: "Alpha task", status: "todo" }, body: "" }]);
  try {
    const token = new URL(ui.url).searchParams.get("token");
    expect(token).toBeTruthy();

    await page.goto(ui.url); // carries ?token= exactly once — the exchange request
    // The SPA scrubbed the one-shot token from the address bar before rendering anything.
    await expect
      .poll(() => page.url(), { message: "the address bar should not keep the bootstrap token" })
      .not.toContain(token as string);

    // The session survives the scrub (cookie-auth'd from here on): open a page.
    await page.locator('[data-page-id="pages-registry/roadmap"]').click();
    const handle = await page.waitForSelector("iframe.page-frame-iframe");
    const frame = await handle.contentFrame();
    if (!frame) throw new Error("iframe had no content frame");
    await expect(page.frameLocator("iframe.page-frame-iframe").locator(".item .title", { hasText: "Spike work" })).toBeVisible();

    // Inside the untrusted page: NO referrer at all — above all, not the tokenized shell URL.
    const referrer = await frame.evaluate(() => document.referrer);
    expect(referrer).toBe("");
    expect(referrer).not.toContain(token as string);
  } finally {
    await ui.cleanup();
  }
});

test("a mutation without X-Requested-With is rejected even with a valid session cookie", async () => {
  const instance = await bootUiOverDirBundle([{ id: "tasks/alpha", frontmatter: { type: "Task", title: "T", status: "todo" }, body: "" }]);
  try {
    const ctx = await playwrightRequest.newContext();
    try {
      await ctx.get(instance.url); // establish the session cookie
      const bareOrigin = new URL(instance.url).origin;
      const res = await ctx.put(bareOrigin + "/v0/bundles/default/docs/tasks/alpha", {
        data: { frontmatter: { type: "Task", title: "T", status: "done" }, body: "" },
        // deliberately no X-Requested-With header
      });
      expect(res.status()).toBe(403);
    } finally {
      await ctx.dispose();
    }
  } finally {
    await instance.cleanup();
  }
});
