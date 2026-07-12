/**
 * Pages-spike server tests (tasks/ui-pages-spike): the privilege split (a page nonce is rejected
 * by every data route — the REQUIRED security assertion), the mint gating, the page CSP, and the
 * pure change-differ + nonce-registry cores. The end-to-end privilege split boots the REAL
 * `bootUiServer` over a temp bundle, mirroring `ui.test.ts`.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createServer as createHttpServer, type Server, type ServerResponse } from "node:http";

import { deleteDoc, initBundle, writeBlob, writeDoc, RemoteBackend, type Bundle } from "@agentstate-lite/core";
import { createRouter, serve, type ServerHandle } from "@agentstate-lite/server";
import { bootUiServer, type UiServerHandle } from "../src/ui/server.js";
import { PageNonceRegistry, pageCsp } from "../src/ui/pages.js";
import { diffSnapshots, isEmptyChange, startWatcher, type Snapshot } from "../src/ui/watch.js";
import { writeUiUrlFile, clearUiUrlFile, uiUrlFilePath } from "../src/ui/url-file.js";

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

test("PageNonceRegistry: bounded by a cap — the oldest nonce is evicted once full (no unbounded growth)", () => {
  const reg = new PageNonceRegistry(60_000, 3);
  const oldest = reg.mint("pages/a.html");
  reg.mint("pages/b.html");
  reg.mint("pages/c.html");
  assert.equal(reg.size(), 3);
  reg.mint("pages/d.html"); // over cap -> evict the oldest
  assert.equal(reg.size(), 3);
  assert.equal(reg.resolve(oldest), null, "the oldest nonce was evicted");
});

test("pageCsp: locks the page to inert bytes — connect-src 'none', frame-ancestors 'self'", () => {
  const csp = pageCsp();
  assert.match(csp, /connect-src 'none'/);
  assert.match(csp, /default-src 'none'/);
  assert.match(csp, /frame-ancestors 'self'/);
});

// ── ui-url re-entry file (B6) ─────────────────────────────────────────────────

test("uiUrlFile: writes the URL 0600, and clear removes it ONLY when it still points at that url", async () => {
  const home = await mkdtemp(path.join(tmpdir(), "agentstate-lite-ui-home-"));
  try {
    const url = "http://127.0.0.1:54237/?token=abc123";
    await writeUiUrlFile(url, home);
    const p = uiUrlFilePath(home);
    assert.equal((await readFile(p, "utf8")).trim(), url);
    // 0600 — owner rw only (mode low 9 bits).
    assert.equal((await stat(p)).mode & 0o777, 0o600);

    // A clear for a DIFFERENT url must NOT remove another instance's pointer.
    await clearUiUrlFile("http://127.0.0.1:9/?token=someone-else", home);
    assert.equal((await readFile(p, "utf8")).trim(), url, "a non-matching clear left the file intact");

    // A clear for the matching url removes it.
    await clearUiUrlFile(url, home);
    await assert.rejects(() => readFile(p, "utf8"));
  } finally {
    await rm(home, { recursive: true, force: true });
  }
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

// ── remote watcher: serialized polls + abort on stop (P1 — remote concurrency) ─

function listenOn(server: Server): Promise<string> {
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address() as { port: number };
      resolve(`http://127.0.0.1:${addr.port}`);
    });
  });
}

async function waitFor(cond: () => boolean, ms = 5_000): Promise<void> {
  const deadline = Date.now() + ms;
  while (!cond()) {
    if (Date.now() > deadline) throw new Error("waitFor timed out");
    await new Promise((r) => setTimeout(r, 10));
  }
}

test("P1: remote watcher polls NEVER overlap — a slow stale read cannot emit a C->B->C regression", async () => {
  const staleDocs = [{ id: "doc", version: "vA" }];
  const freshDocs = [{ id: "doc", version: "vB" }];
  // Request 1 is the baseline (state A). Request 2 simulates a poll that STARTED before a write
  // and answers with the STALE state only 250ms later. Every request after that sees the fresh
  // state B immediately. Unserialized polls would interleave: a fast fresh poll lands (emit B),
  // then the slow stale one lands (emit a REGRESSION back to A and poison `last`), then the next
  // tick re-emits B — the observed C -> B -> C.
  let requestNo = 0;
  let active = 0;
  let maxConcurrent = 0;
  const server = createHttpServer((_req, res) => {
    requestNo++;
    active++;
    maxConcurrent = Math.max(maxConcurrent, active);
    const finish = (docs: { id: string; version: string }[]): void => {
      active--;
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ docs, next_cursor: null }));
    };
    if (requestNo === 1) finish(staleDocs);
    else if (requestNo === 2) setTimeout(() => finish(staleDocs), 250);
    else finish(freshDocs);
  });
  const origin = await listenOn(server);
  try {
    const emitted: string[] = [];
    const watcher = await startWatcher({
      mode: "remote",
      remoteBase: origin,
      pollMs: 30,
      onChange: (e) => emitted.push(...e.docs.changed.map((c) => c.version)),
    });
    // Several poll ticks elapse WHILE request 2 is still held open, then plenty for the catch-up.
    await new Promise((r) => setTimeout(r, 600));
    await watcher.stop();

    assert.equal(maxConcurrent, 1, "two snapshot requests must never be in flight at once");
    assert.deepEqual(emitted, ["vB"], `exactly one forward change, no stale re-emission (got: ${emitted.join(",") || "none"})`);
  } finally {
    server.close();
  }
});

test("P1: stop() ABORTS an in-flight snapshot request instead of leaving it dangling past shutdown", async () => {
  let requestNo = 0;
  let hungRes: ServerResponse | undefined;
  let hungClosed = false;
  const server = createHttpServer((_req, res) => {
    requestNo++;
    if (requestNo === 1) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ docs: [], next_cursor: null }));
      return;
    }
    // Never answer — the ONLY way this request ends is the client tearing it down.
    hungRes = res;
    res.once("close", () => {
      hungClosed = true;
    });
  });
  const origin = await listenOn(server);
  try {
    const errors: unknown[] = [];
    const watcher = await startWatcher({
      mode: "remote",
      remoteBase: origin,
      pollMs: 20,
      onChange: () => {},
      onError: (err) => errors.push(err),
    });
    await waitFor(() => hungRes !== undefined); // a poll is now genuinely in flight
    await watcher.stop();
    await waitFor(() => hungClosed); // ...and the abort tore it down server-visibly
    assert.equal(errors.length, 0, "an abort at shutdown is shutdown, not an error to report");
  } finally {
    server.close();
  }
});

// ── privilege split (end-to-end over a real listener) ─────────────────────────

const SECRET = "test-session-secret-pages-spike";

async function bootPagesServer(): Promise<{ handle: UiServerHandle; origin: string; dir: string; cleanup: () => Promise<void> }> {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-ui-pages-"));
  await initBundle(dir);
  const bundle: Bundle = { root: dir };
  // A registered page (blob + its type:Page registry doc), plus an OFF-LIMITS blob that is NOT a
  // page — the A1 confinement must refuse to mint a nonce for the latter.
  await writeBlob(bundle, "pages/test.html", Buffer.from("<!doctype html><title>t</title><p>hi</p>"), "text/html; charset=utf-8");
  await writeBlob(bundle, "secrets/creds.bin", Buffer.from("TOP-SECRET"), "application/octet-stream");
  await writeDoc(bundle, { id: "pages-registry/test", frontmatter: { type: "Page", title: "Test", entry: "pages/test.html" }, body: "" });
  // A kind convention with a terminal declaration — the /__ui/kinds endpoint's fixture.
  await writeDoc(bundle, {
    id: "conventions/task",
    frontmatter: {
      type: "Convention",
      title: "Task",
      governs: "Task",
      description: "A unit of work.",
      fields: {
        required: ["title", "status"],
        values: { status: ["todo", "done", "canceled"] },
        terminal: { status: ["done", "canceled"] },
        descriptions: { title: "A concise summary.", status: "Current state." },
      },
    },
    body: "# Task",
  });
  // Two linked docs — the /__ui/edges endpoint's fixture (mirrors core's own query-edges.test.ts fixture style).
  await writeDoc(bundle, { id: "tasks/a", frontmatter: { type: "Task", title: "A" }, body: "See [also b](b.md)." });
  await writeDoc(bundle, { id: "tasks/b", frontmatter: { type: "Task", title: "B" }, body: "" });
  await writeDoc(bundle, { id: "roadmap-items/x", frontmatter: { type: "Roadmap Item", title: "X" }, body: "[contains](../tasks/a.md)." });
  const handle = await bootUiServer({ mode: "dir", port: 0, router: createRouter(bundle), bundle, sessionSecret: SECRET });
  const origin = `http://${handle.host}:${handle.port}`;
  return {
    handle,
    origin,
    dir,
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

test("A1: mint is confined to REGISTERED page entries — an off-limits blob cannot be minted/exfiltrated", async () => {
  const { origin, cleanup } = await bootPagesServer();
  const mintKey = (key: string) =>
    fetch(`${origin}/__page/mint`, {
      method: "POST",
      headers: { cookie: `aslite_ui_session=${SECRET}`, "content-type": "application/json", "x-requested-with": "test" },
      body: JSON.stringify({ key }),
    });
  try {
    // A REAL, existing blob that is not a page (not under pages/, not a registered entry) -> refused.
    assert.equal((await mintKey("secrets/creds.bin")).status, 403);
    // Under the page prefix but NOT declared by any type:Page doc -> refused.
    assert.equal((await mintKey("pages/not-registered.html")).status, 403);
    // The registered page entry -> still minted (happy path intact).
    assert.equal((await mintKey("pages/test.html")).status, 200);
  } finally {
    await cleanup();
  }
});

test("kinds endpoint: session-gated, serves core's loadKinds registry (ONE registry — the bridge's open filter consumes it)", async () => {
  const { origin, cleanup } = await bootPagesServer();
  try {
    // No session -> 403 (it is a data endpoint, not page bytes).
    assert.equal((await fetch(`${origin}/__ui/kinds`)).status, 403);

    const res = await fetch(`${origin}/__ui/kinds`, { headers: { cookie: `aslite_ui_session=${SECRET}` } });
    assert.equal(res.status, 200);
    const body = (await res.json()) as {
      kinds: {
        governs: string;
        description?: string;
        fields: { terminal: Record<string, string[]>; descriptions: Record<string, string> };
      }[];
    };
    const task = body.kinds.find((k) => k.governs === "Task");
    assert.ok(task, "the bundle's Task convention is in the served registry");
    assert.deepEqual(task.fields.terminal, { status: ["done", "canceled"] });
    assert.equal(task.description, "A unit of work.");
    assert.deepEqual(task.fields.descriptions, { title: "A concise summary.", status: "Current state." });
  } finally {
    await cleanup();
  }
});

test("edges endpoint: session-gated, serves core's queryEdges over the mounted bundle (dir mode)", async () => {
  const { origin, cleanup } = await bootPagesServer();
  try {
    // No session -> 403 (it is a data endpoint, not page bytes).
    assert.equal((await fetch(`${origin}/__ui/edges`)).status, 403);

    const cookie = { cookie: `aslite_ui_session=${SECRET}` };

    // No filter: every derived edge in the fixture bundle.
    const all = await (await fetch(`${origin}/__ui/edges`, { headers: cookie })).json() as { edges: { from: string; to: string; text: string }[]; count: number };
    assert.equal(all.count, 2);
    assert.deepEqual(
      all.edges.map((e) => [e.from, e.to, e.text]).sort(),
      [
        ["roadmap-items/x", "tasks/a", "contains"],
        ["tasks/a", "tasks/b", "also b"],
      ],
    );

    // `to` scopes to backlinks of one target.
    const toA = await (await fetch(`${origin}/__ui/edges?to=tasks/a`, { headers: cookie })).json() as { edges: unknown[]; count: number };
    assert.equal(toA.count, 1);
    assert.deepEqual(toA.edges, [{ from: "roadmap-items/x", to: "tasks/a", text: "contains" }]);

    // `from` + `text` (repeatable `from`, exact-match `text`) ANDs both facets.
    const contains = await (
      await fetch(`${origin}/__ui/edges?from=roadmap-items/&text=contains`, { headers: cookie })
    ).json() as { edges: unknown[]; count: number };
    assert.equal(contains.count, 1);

    // A prefix `from` that matches nothing yields an empty (not error) result.
    const none = await (await fetch(`${origin}/__ui/edges?from=nowhere/`, { headers: cookie })).json() as { edges: unknown[]; count: number };
    assert.deepEqual(none, { edges: [], count: 0 });
  } finally {
    await cleanup();
  }
});

test("edges endpoint: serves core's queryEdges over a RemoteBackend bundle (remote mode) — same plumbing kindsResponse uses", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-ui-edges-remote-"));
  let remoteHandle: ServerHandle | undefined;
  let uiHandle: UiServerHandle | undefined;
  try {
    const bundle: Bundle = { root: dir };
    await initBundle(dir);
    await writeDoc(bundle, { id: "tasks/a", frontmatter: { type: "Task", title: "A" }, body: "See [also b](b.md)." });
    await writeDoc(bundle, { id: "tasks/b", frontmatter: { type: "Task", title: "B" }, body: "" });

    remoteHandle = await serve({ bundle, port: 0 });
    const remoteBase = `http://${remoteHandle.host}:${remoteHandle.port}`;
    const kindsBundle: Bundle = { root: remoteBase, backend: new RemoteBackend({ baseUrl: remoteBase, bundle: "default" }) };

    uiHandle = await bootUiServer({ mode: "remote", port: 0, remoteBase, kindsBundle, sessionSecret: SECRET });
    const origin = `http://${uiHandle.host}:${uiHandle.port}`;

    const res = await fetch(`${origin}/__ui/edges`, { headers: { cookie: `aslite_ui_session=${SECRET}` } });
    assert.equal(res.status, 200);
    const body = (await res.json()) as { edges: { from: string; to: string; text: string }[]; count: number };
    assert.equal(body.count, 1);
    assert.deepEqual(body.edges, [{ from: "tasks/a", to: "tasks/b", text: "also b" }]);
  } finally {
    await uiHandle?.close();
    await remoteHandle?.close();
    await rm(dir, { recursive: true, force: true });
  }
});

test("edges endpoint: a remote-upstream OUTAGE surfaces as a non-2xx error, never a 200 {edges:[]} (review fold-in — edges is primary data, not a display filter)", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "agentstate-lite-ui-edges-outage-"));
  let uiHandle: UiServerHandle | undefined;
  try {
    // Boot a REAL reference server, note its origin, then close it — the origin now genuinely
    // refuses connections (ECONNREFUSED), mirroring the review's exact repro ("killing the
    // reference server").
    const bundle: Bundle = { root: dir };
    await initBundle(dir);
    const remoteHandle = await serve({ bundle, port: 0 });
    const remoteBase = `http://${remoteHandle.host}:${remoteHandle.port}`;
    await remoteHandle.close();

    const kindsBundle: Bundle = { root: remoteBase, backend: new RemoteBackend({ baseUrl: remoteBase, bundle: "default" }) };
    uiHandle = await bootUiServer({ mode: "remote", port: 0, remoteBase, kindsBundle, sessionSecret: SECRET });
    const origin = `http://${uiHandle.host}:${uiHandle.port}`;

    const res = await fetch(`${origin}/__ui/edges`, { headers: { cookie: `aslite_ui_session=${SECRET}` } });
    assert.notEqual(res.status, 200, "an unreachable remote must NOT read as a successful empty edge list");
    assert.ok(res.status >= 500, `expected an error status, got ${res.status}`);
    const body = (await res.json()) as { error?: { code: string } };
    assert.ok(body.error, "a non-2xx edges response carries the wire error envelope, not a bare {edges:[]}");
  } finally {
    await uiHandle?.close();
    await rm(dir, { recursive: true, force: true });
  }
});

test("P2: remote mint paginates the Page registry to exhaustion — a page past the first wire page still opens", async () => {
  // A fake remote whose type=Page listing spans TWO cursor pages; the target entry exists ONLY on
  // the second. A first-page-only mint lookup (the old 500-doc ceiling) can never see it.
  const server = createHttpServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const json = (body: unknown): void => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(body));
    };
    if (url.searchParams.get("type") === "Page") {
      if (url.searchParams.get("cursor") === "page-2") {
        json({ docs: [{ id: "pages-registry/deep", version: "v1", frontmatter: { type: "Page", entry: "pages/deep.html" } }], next_cursor: null });
      } else {
        json({ docs: [{ id: "pages-registry/first", version: "v1", frontmatter: { type: "Page", entry: "pages/first.html" } }], next_cursor: "page-2" });
      }
      return;
    }
    json({ docs: [], next_cursor: null }); // the watcher's snapshot poll
  });
  const remoteOrigin = await listenOn(server);
  try {
    const handle = await bootUiServer({ mode: "remote", port: 0, remoteBase: remoteOrigin, sessionSecret: SECRET });
    try {
      const mint = (key: string) =>
        fetch(`http://${handle.host}:${handle.port}/__page/mint`, {
          method: "POST",
          headers: { cookie: `aslite_ui_session=${SECRET}`, "content-type": "application/json", "x-requested-with": "test" },
          body: JSON.stringify({ key }),
        });
      assert.equal((await mint("pages/deep.html")).status, 200, "an entry on the SECOND wire page must mint");
      assert.equal((await mint("pages/first.html")).status, 200);
      assert.equal((await mint("pages/not-registered.html")).status, 403, "confinement is intact across pagination");
    } finally {
      await handle.close();
    }
  } finally {
    server.close();
  }
});

test("B1: the shell asset CSP explicitly confines framing to same-origin (frame-src/child-src 'self')", async () => {
  const { origin, cleanup } = await bootPagesServer();
  try {
    const res = await fetch(`${origin}/`, { headers: { cookie: `aslite_ui_session=${SECRET}` } });
    assert.equal(res.status, 200);
    const csp = res.headers.get("content-security-policy") ?? "";
    assert.match(csp, /frame-src 'self'/);
    assert.match(csp, /child-src 'self'/);
  } finally {
    await cleanup();
  }
});

test("P1: deleting a page's registry doc revokes its LIVE nonce — page bytes stop serving immediately, not at TTL expiry", async () => {
  const { origin, dir, cleanup } = await bootPagesServer();
  try {
    const mint = await fetch(`${origin}/__page/mint`, {
      method: "POST",
      headers: { cookie: `aslite_ui_session=${SECRET}`, "content-type": "application/json", "x-requested-with": "test" },
      body: JSON.stringify({ key: "pages/test.html" }),
    });
    assert.equal(mint.status, 200);
    const { url } = (await mint.json()) as { url: string };

    // The nonce serves while the registry doc lives...
    assert.equal((await fetch(`${origin}${url}`)).status, 200);

    // ...and stops the moment the doc is gone, with the nonce still inside its TTL.
    await deleteDoc({ root: dir }, "pages-registry/test");
    const revoked = await fetch(`${origin}${url}`);
    assert.equal(revoked.status, 403);
  } finally {
    await cleanup();
  }
});

test("P1: retargeting a page's registry doc revokes its OLD nonce — the old key is no longer any Page's entry", async () => {
  const { origin, dir, cleanup } = await bootPagesServer();
  try {
    const mint = await fetch(`${origin}/__page/mint`, {
      method: "POST",
      headers: { cookie: `aslite_ui_session=${SECRET}`, "content-type": "application/json", "x-requested-with": "test" },
      body: JSON.stringify({ key: "pages/test.html" }),
    });
    assert.equal(mint.status, 200);
    const { url: oldUrl } = (await mint.json()) as { url: string };

    // The old nonce serves while its key is still the registry doc's entry...
    assert.equal((await fetch(`${origin}${oldUrl}`)).status, 200);

    // ...retarget the SAME registry doc to a DIFFERENT blob (mirrors a `doc update` that changes
    // `entry`, not a delete) — the mechanism is identical to the delete-revocation path above
    // (`registeredPageEntries` re-derives the live set at SERVE time), so this closes the
    // coverage gap between "doc removed" and "doc's entry moved out from under a live nonce".
    const bundle: Bundle = { root: dir };
    await writeBlob(bundle, "pages/test2.html", Buffer.from("<!doctype html><title>t2</title><p>hi again</p>"), "text/html; charset=utf-8");
    await writeDoc(bundle, { id: "pages-registry/test", frontmatter: { type: "Page", title: "Test", entry: "pages/test2.html" }, body: "" });

    // The OLD nonce now 403s — its key is no longer any Page's entry — even though it's still
    // inside its TTL and the registry doc it was minted from still exists (just retargeted, not
    // deleted).
    const revoked = await fetch(`${origin}${oldUrl}`);
    assert.equal(revoked.status, 403);

    // The new entry key mints and serves fine — retargeting isn't a one-way break.
    const remint = await fetch(`${origin}/__page/mint`, {
      method: "POST",
      headers: { cookie: `aslite_ui_session=${SECRET}`, "content-type": "application/json", "x-requested-with": "test" },
      body: JSON.stringify({ key: "pages/test2.html" }),
    });
    assert.equal(remint.status, 200);
    const { url: newUrl } = (await remint.json()) as { url: string };
    assert.equal((await fetch(`${origin}${newUrl}`)).status, 200);
  } finally {
    await cleanup();
  }
});

test("P1: shell assets AND page bytes both send Referrer-Policy: no-referrer (the tokenized shell URL must never ride a referrer)", async () => {
  const { origin, cleanup } = await bootPagesServer();
  try {
    const shell = await fetch(`${origin}/`, { headers: { cookie: `aslite_ui_session=${SECRET}` } });
    assert.equal(shell.status, 200);
    assert.equal(shell.headers.get("referrer-policy"), "no-referrer");

    const mint = await fetch(`${origin}/__page/mint`, {
      method: "POST",
      headers: { cookie: `aslite_ui_session=${SECRET}`, "content-type": "application/json", "x-requested-with": "test" },
      body: JSON.stringify({ key: "pages/test.html" }),
    });
    assert.equal(mint.status, 200);
    const { url } = (await mint.json()) as { url: string };
    const page = await fetch(`${origin}${url}`);
    assert.equal(page.status, 200);
    assert.equal(page.headers.get("referrer-policy"), "no-referrer");
  } finally {
    await cleanup();
  }
});
