/**
 * Pages-spike server tests (tasks/ui-pages-spike): the privilege split (a page nonce is rejected
 * by every data route — the REQUIRED security assertion), the mint gating, the page CSP, and the
 * pure change-differ + nonce-registry cores. The end-to-end privilege split boots the REAL
 * `bootUiServer` over a temp bundle, mirroring `ui.test.ts`.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { initBundle, writeBlob, type Bundle } from "@agentstate-lite/core";
import { createRouter } from "@agentstate-lite/server";
import { bootUiServer, type UiServerHandle } from "../src/ui/server.js";
import { PageNonceRegistry, pageCsp } from "../src/ui/pages.js";
import { diffSnapshots, isEmptyChange, type Snapshot } from "../src/ui/watch.js";

// ── PageNonceRegistry ───────────────────────────────────────────────────────

test("PageNonceRegistry: mint returns an opaque nonce that resolves to its ONE key", () => {
  const reg = new PageNonceRegistry();
  const nonce = reg.mint("pages/a.html");
  assert.equal(reg.resolve(nonce), "pages/a.html");
  assert.notEqual(nonce, "pages/a.html");
  assert.equal(reg.resolve("never-minted"), null);
});

test("PageNonceRegistry: two mints of the same key yield DISTINCT nonces", () => {
  const reg = new PageNonceRegistry();
  assert.notEqual(reg.mint("pages/a.html"), reg.mint("pages/a.html"));
});

test("PageNonceRegistry: an expired nonce resolves to null (and is swept)", () => {
  const reg = new PageNonceRegistry(-1000); // already-expired TTL
  const nonce = reg.mint("pages/a.html");
  assert.equal(reg.resolve(nonce), null);
  assert.equal(reg.size(), 0);
});

test("pageCsp: locks the page to inert bytes — connect-src 'none', frame-ancestors 'self'", () => {
  const csp = pageCsp();
  assert.match(csp, /connect-src 'none'/);
  assert.match(csp, /default-src 'none'/);
  assert.match(csp, /frame-ancestors 'self'/);
});

// ── diffSnapshots ─────────────────────────────────────────────────────────────

function snap(docs: Record<string, string>, blobs: Record<string, string> = {}): Snapshot {
  return { docs: new Map(Object.entries(docs)), blobs: new Map(Object.entries(blobs)) };
}

test("diffSnapshots: reports changed (new + moved) and removed docs", () => {
  const prev = snap({ a: "v1", b: "v1" });
  const next = snap({ a: "v2", b: "v1", c: "v1" });
  const d = diffSnapshots(prev, next);
  assert.deepEqual(d.docs.changed.sort((x, y) => x.id.localeCompare(y.id)), [
    { id: "a", version: "v2" },
    { id: "c", version: "v1" },
  ]);
  assert.deepEqual(d.docs.removed, []);
});

test("diffSnapshots: reports removed docs and blob changes independently", () => {
  const prev = snap({ a: "v1" }, { "pages/p.html": "b1" });
  const next = snap({}, { "pages/p.html": "b2" });
  const d = diffSnapshots(prev, next);
  assert.deepEqual(d.docs.removed, ["a"]);
  assert.deepEqual(d.blobs.changed, [{ key: "pages/p.html", version: "b2" }]);
});

test("isEmptyChange: true iff nothing moved on either side", () => {
  assert.equal(isEmptyChange(diffSnapshots(snap({ a: "v1" }), snap({ a: "v1" }))), true);
  assert.equal(isEmptyChange(diffSnapshots(snap({ a: "v1" }), snap({ a: "v2" }))), false);
});

// ── privilege split (end-to-end over a real listener) ─────────────────────────

const SECRET = "test-session-secret-pages-spike";

async function bootPagesServer(): Promise<{ handle: UiServerHandle; origin: string; cleanup: () => Promise<void> }> {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-ui-pages-"));
  await initBundle(dir);
  const bundle: Bundle = { root: dir };
  await writeBlob(bundle, "pages/test.html", Buffer.from("<!doctype html><title>t</title><p>hi</p>"), "text/html; charset=utf-8");
  const handle = await bootUiServer({ mode: "dir", port: 0, router: createRouter(bundle), bundle, sessionSecret: SECRET });
  const origin = `http://${handle.host}:${handle.port}`;
  return {
    handle,
    origin,
    cleanup: async () => {
      await handle.close();
      await rm(dir, { recursive: true, force: true });
    },
  };
}

test("REQUIRED: a page nonce is rejected by every data route (it is not the session secret)", async () => {
  const { origin, cleanup } = await bootPagesServer();
  try {
    // Mint a nonce with a valid session (cookie + X-Requested-With).
    const mint = await fetch(`${origin}/__page/mint`, {
      method: "POST",
      headers: { cookie: `aslite_ui_session=${SECRET}`, "content-type": "application/json", "x-requested-with": "test" },
      body: JSON.stringify({ key: "pages/test.html" }),
    });
    assert.equal(mint.status, 200);
    const { nonce, url } = (await mint.json()) as { nonce: string; url: string };

    // The nonce as a data-route ?token= is NOT the session secret -> 403.
    assert.equal((await fetch(`${origin}/v0/bundles/default/docs?token=${nonce}`)).status, 403);
    // The nonce as a data-route cookie -> 403.
    assert.equal(
      (await fetch(`${origin}/v0/bundles/default/docs`, { headers: { cookie: `aslite_ui_session=${nonce}` } })).status,
      403,
    );

    // But the nonce DOES serve its one page's bytes, WITHOUT any session cookie (opaque-origin iframe).
    const page = await fetch(`${origin}${url}`);
    assert.equal(page.status, 200);
    assert.match(page.headers.get("content-type") ?? "", /text\/html/);
    assert.match(page.headers.get("content-security-policy") ?? "", /connect-src 'none'/);
  } finally {
    await cleanup();
  }
});

test("the session token does NOT open the page route to arbitrary keys (it is not a nonce)", async () => {
  const { origin, cleanup } = await bootPagesServer();
  try {
    // Presenting the session secret where a nonce is expected resolves to no key -> 403.
    assert.equal((await fetch(`${origin}/__page/${SECRET}`)).status, 403);
  } finally {
    await cleanup();
  }
});

test("mint requires BOTH a session AND X-Requested-With (CSRF belt)", async () => {
  const { origin, cleanup } = await bootPagesServer();
  try {
    const body = JSON.stringify({ key: "pages/test.html" });
    const headersJson = { "content-type": "application/json" };
    // No session at all.
    assert.equal((await fetch(`${origin}/__page/mint`, { method: "POST", headers: headersJson, body })).status, 403);
    // Session cookie but no X-Requested-With.
    assert.equal(
      (await fetch(`${origin}/__page/mint`, { method: "POST", headers: { ...headersJson, cookie: `aslite_ui_session=${SECRET}` }, body })).status,
      403,
    );
    // Both present -> ok.
    assert.equal(
      (
        await fetch(`${origin}/__page/mint`, {
          method: "POST",
          headers: { ...headersJson, cookie: `aslite_ui_session=${SECRET}`, "x-requested-with": "test" },
          body,
        })
      ).status,
      200,
    );
  } finally {
    await cleanup();
  }
});

test("mint of an unsafe key (traversal / reserved .md) is a USAGE error, not a nonce", async () => {
  const { origin, cleanup } = await bootPagesServer();
  try {
    const res = await fetch(`${origin}/__page/mint`, {
      method: "POST",
      headers: { cookie: `aslite_ui_session=${SECRET}`, "content-type": "application/json", "x-requested-with": "test" },
      body: JSON.stringify({ key: "../../etc/hosts" }),
    });
    assert.equal(res.status, 400);
  } finally {
    await cleanup();
  }
});
