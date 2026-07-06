/**
 * Through-the-Worker wire contract tests (Stage-1 Unit 2b Part B/C; Stage-2 auth Part A):
 * invoke the exported `fetch` handler (`../src/worker.ts`) DIRECTLY with `Request` objects —
 * no real sockets, no `wrangler dev` — reusing the `getPlatformProxy` D1/R2 harness
 * (`test/env.ts`) the rest of this package's tests already use. Proves the pieces this unit
 * adds actually compose: `D1R2Backend` -> `createRouterForBackend` -> `createAuthGate`,
 * wired exactly as `worker.ts` wires them, not each piece tested in isolation.
 *
 * ENUMERATED CHANGE (Stage-2 auth Part A): `envWithKey` gained a `pepper` parameter,
 * DEFAULTED to a constant `PEPPER` so every pre-existing call site below is unchanged —
 * the fail-closed gate now requires BOTH `API_KEY` and `KEY_PEPPER`, so without this every
 * test here would have failed closed (500 RUNTIME) on the newly-added secret, not because
 * of anything these tests are actually checking. The one test that deliberately unsets
 * `API_KEY` (`envWithKey(testEnv.db, testEnv.bucket, undefined)`) keeps `pepper` at its
 * default specifically so it isolates "API_KEY missing" from "KEY_PEPPER missing" — see
 * `auth.test.ts` for the NEW pepper-missing case this split makes room for.
 */
import test from "node:test";
import assert from "node:assert/strict";

import worker, { type Env } from "../src/worker.js";
import { createTestEnv } from "./env.js";
import { MembershipStore } from "../src/membership-store.js";
import { fingerprint, hmacSha256Hex, mintApiKeyToken } from "../src/tokens.js";

const API_KEY = "test-worker-api-key";
const PEPPER = "test-worker-pepper";

/** Mint an active `api_keys` row for `userId` and return the raw (never-again-visible) key — mirrors `auth.test.ts`'s helper. */
async function mintKeyFor(store: MembershipStore, id: string, userId: string): Promise<string> {
  const raw = mintApiKeyToken();
  const keyHash = await hmacSha256Hex(PEPPER, raw);
  const { prefix, lastFour } = fingerprint(raw);
  await store.mintApiKey({ id, keyHash, keyPrefix: prefix, lastFour, userId, label: null, createdBy: "root", createdAt: "2026-07-02T00:00:00.000Z" });
  return raw;
}

/** A stub ExecutionContext — this handler never calls waitUntil/passThroughOnException. */
const ctx = {
  waitUntil: () => {},
  passThroughOnException: () => {},
  props: {},
} as unknown as Parameters<typeof worker.fetch>[2];

function envWithKey(db: Env["DB"], bucket: Env["BUCKET"], apiKey: string | undefined, pepper: string | undefined = PEPPER): Env {
  return { DB: db, BUCKET: bucket, API_KEY: apiKey, KEY_PEPPER: pepper };
}

function authed(path: string, init: RequestInit = {}): Request {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${API_KEY}`);
  return new Request(`http://worker.local${path}`, { ...init, headers });
}

test("worker fetch: an unauthenticated request is rejected with 401 AUTH_REQUIRED before touching D1/R2", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, API_KEY);
    const res = await worker.fetch(new Request("http://worker.local/v0/bundles/default/docs"), env, ctx);
    assert.equal(res.status, 401);
    const body = (await res.json()) as { error: { code: string } };
    assert.equal(body.error.code, "AUTH_REQUIRED");
  } finally {
    await testEnv.dispose();
  }
});

test("worker fetch: a wrong API key is rejected with 401 AUTH_REQUIRED", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, API_KEY);
    const res = await worker.fetch(
      new Request("http://worker.local/v0/bundles/default/docs", { headers: { Authorization: "Bearer nope" } }),
      env,
      ctx,
    );
    assert.equal(res.status, 401);
  } finally {
    await testEnv.dispose();
  }
});

test("worker fetch: an unconfigured API_KEY fails CLOSED (500 RUNTIME) even with a well-formed Authorization header", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, undefined);
    const res = await worker.fetch(authed("/v0/bundles/default/docs"), env, ctx);
    assert.equal(res.status, 500);
    const body = (await res.json()) as { error: { code: string } };
    assert.equal(body.error.code, "RUNTIME");
  } finally {
    await testEnv.dispose();
  }
});

test("worker fetch: a valid key reaches the router and performs a REAL doc write against D1+R2", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, API_KEY);

    const writeRes = await worker.fetch(
      authed("/v0/bundles/default/docs/concepts/alpha", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ frontmatter: { type: "Concept", title: "Alpha" }, body: "hello from the worker" }),
      }),
      env,
      ctx,
    );
    assert.equal(writeRes.status, 200);
    const writeBody = (await writeRes.json()) as { version: string };
    assert.match(writeBody.version, /^sha256:[0-9a-f]{64}$/);

    const readRes = await worker.fetch(authed("/v0/bundles/default/docs/concepts/alpha"), env, ctx);
    assert.equal(readRes.status, 200);
    const readBody = (await readRes.json()) as { frontmatter: { title: string }; body: string };
    assert.equal(readBody.frontmatter.title, "Alpha");
    // stringifyDoc (the canonical OKF serialization D1R2Backend stores/re-parses) normalizes
    // the body to end with a trailing newline — the same convention every other adapter's
    // round-trip observes (see e.g. dual-backend.test.ts's `body.trim()` comparisons).
    assert.equal(readBody.body.trim(), "hello from the worker");
  } finally {
    await testEnv.dispose();
  }
});

test("worker fetch: agent attribution end to end — a writer's client-claimed X-Actor lands as agent in doc_history, under the server-set principal, surfaced through GET .../versions", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, API_KEY);
    const store = new MembershipStore(testEnv.db);

    await store.createUser({ id: "u-collab", display: null, createdAt: "2026-07-02T00:00:00.000Z" });
    await store.setMembership("u-collab", "default", "writer");
    const writerKey = await mintKeyFor(store, "k-collab", "u-collab");

    const writeRes = await worker.fetch(
      new Request("http://worker.local/v0/bundles/default/docs/concepts/agented", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${writerKey}`,
          "content-type": "application/json",
          "X-Actor": "collab-3", // client-claimed actor -> attested as agent under the real principal
        },
        body: JSON.stringify({ frontmatter: { type: "Concept", title: "Agented" }, body: "hello" }),
      }),
      env,
      ctx,
    );
    assert.equal(writeRes.status, 200);

    const versionsRes = await worker.fetch(authed("/v0/bundles/default/docs/concepts/agented/versions"), env, ctx);
    assert.equal(versionsRes.status, 200);
    const versionsBody = (await versionsRes.json()) as { versions: Array<{ actor: string; agent?: string }> };
    assert.equal(versionsBody.versions.length, 1);
    assert.equal(versionsBody.versions[0]!.actor, "u-collab", "actor is the real, unforgeable principal");
    assert.equal(versionsBody.versions[0]!.agent, "collab-3", "agent is the client-attested label under that principal");

    // A control write with no client-claimed X-Actor -> no agent recorded.
    const controlRes = await worker.fetch(
      new Request("http://worker.local/v0/bundles/default/docs/concepts/unagented", {
        method: "PUT",
        headers: { Authorization: `Bearer ${writerKey}`, "content-type": "application/json" },
        body: JSON.stringify({ frontmatter: { type: "Concept", title: "Unagented" }, body: "hello" }),
      }),
      env,
      ctx,
    );
    assert.equal(controlRes.status, 200);
    const controlVersionsRes = await worker.fetch(authed("/v0/bundles/default/docs/concepts/unagented/versions"), env, ctx);
    const controlVersionsBody = (await controlVersionsRes.json()) as { versions: Array<{ actor: string; agent?: string }> };
    assert.equal(controlVersionsBody.versions.length, 1);
    assert.equal(controlVersionsBody.versions[0]!.actor, "u-collab");
    assert.ok(!("agent" in controlVersionsBody.versions[0]!), "no client-claimed actor -> no agent key in the response");
  } finally {
    await testEnv.dispose();
  }
});

test("worker fetch: a CAS conflict on a doc write maps to 412 through the full worker stack", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, API_KEY);

    const first = await worker.fetch(
      authed("/v0/bundles/default/docs/concepts/beta", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ frontmatter: { type: "Concept" }, body: "v1" }),
      }),
      env,
      ctx,
    );
    assert.equal(first.status, 200);

    // Stale If-Match: expect-absent create ("*"), which must now conflict since the doc exists.
    const staleCreate = await worker.fetch(
      authed("/v0/bundles/default/docs/concepts/beta", {
        method: "PUT",
        headers: { "content-type": "application/json", "If-None-Match": "*" },
        body: JSON.stringify({ frontmatter: { type: "Concept" }, body: "v2" }),
      }),
      env,
      ctx,
    );
    assert.equal(staleCreate.status, 412);
    const body = (await staleCreate.json()) as { error: { code: string } };
    assert.equal(body.error.code, "VERSION_CONFLICT");
  } finally {
    await testEnv.dispose();
  }
});

test("worker fetch: blob PUT/GET round-trip serves the exact bytes with the content-type resolved from D1 (never trusting R2's own metadata)", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, API_KEY);
    const bytes = new TextEncoder().encode("<h1>hi from the worker</h1>");

    const putRes = await worker.fetch(
      authed("/v0/bundles/default/blobs/artifacts/report.html", {
        method: "PUT",
        headers: { "content-type": "text/html" },
        body: bytes,
      }),
      env,
      ctx,
    );
    assert.equal(putRes.status, 200); // unconditional write (no If-None-Match) -> 200, not 201

    const getRes = await worker.fetch(authed("/v0/bundles/default/blobs/artifacts/report.html"), env, ctx);
    assert.equal(getRes.status, 200);
    assert.equal(getRes.headers.get("content-type"), "text/html");
    const gotBytes = new Uint8Array(await getRes.arrayBuffer());
    assert.deepEqual(gotBytes, bytes);
  } finally {
    await testEnv.dispose();
  }
});

test("worker fetch: doc GET carries BOTH the bare X-Version (primary, edge-proof) and a properly RFC-7232-quoted ETag (production repair, Stage-1 Unit 2b)", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, API_KEY);

    const writeRes = await worker.fetch(
      authed("/v0/bundles/default/docs/concepts/version-headers", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ frontmatter: { type: "Concept" }, body: "checking version headers" }),
      }),
      env,
      ctx,
    );
    const writeBody = (await writeRes.json()) as { version: string };

    const readRes = await worker.fetch(authed("/v0/bundles/default/docs/concepts/version-headers"), env, ctx);
    assert.equal(readRes.status, 200);
    assert.equal(readRes.headers.get("x-version"), writeBody.version, "X-Version carries the bare token");
    assert.equal(
      readRes.headers.get("etag"),
      `"${writeBody.version}"`,
      "ETag carries the SAME token, correctly RFC-7232-quoted",
    );
  } finally {
    await testEnv.dispose();
  }
});

test("worker fetch: blob GET/HEAD carry BOTH X-Version and a quoted ETag too (not just docs)", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, API_KEY);
    const bytes = new TextEncoder().encode("blob version-header check");

    const putRes = await worker.fetch(
      authed("/v0/bundles/default/blobs/artifacts/version-headers.txt", {
        method: "PUT",
        headers: { "content-type": "text/plain" },
        body: bytes,
      }),
      env,
      ctx,
    );
    const putBody = (await putRes.json()) as { version: string };

    const getRes = await worker.fetch(authed("/v0/bundles/default/blobs/artifacts/version-headers.txt"), env, ctx);
    assert.equal(getRes.headers.get("x-version"), putBody.version);
    assert.equal(getRes.headers.get("etag"), `"${putBody.version}"`);

    const headRes = await worker.fetch(
      authed("/v0/bundles/default/blobs/artifacts/version-headers.txt", { method: "HEAD" }),
      env,
      ctx,
    );
    assert.equal(headRes.headers.get("x-version"), putBody.version);
    assert.equal(headRes.headers.get("etag"), `"${putBody.version}"`);
  } finally {
    await testEnv.dispose();
  }
});

test("worker fetch: a write's If-Match honors BOTH the bare token AND a quoted/weak-prefixed reflection of it (router-side tolerance)", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, API_KEY);

    const createRes = await worker.fetch(
      authed("/v0/bundles/default/docs/concepts/if-match-tolerance", {
        method: "PUT",
        headers: { "content-type": "application/json", "If-None-Match": "*" },
        body: JSON.stringify({ frontmatter: { type: "Concept" }, body: "v1" }),
      }),
      env,
      ctx,
    );
    const v1 = ((await createRes.json()) as { version: string }).version;

    // A quoted If-Match (as a strict RFC-7232 client, or an intermediary reflecting the
    // response ETag back verbatim, might send) must be accepted identically to the bare form.
    const quotedRes = await worker.fetch(
      authed("/v0/bundles/default/docs/concepts/if-match-tolerance", {
        method: "PUT",
        headers: { "content-type": "application/json", "If-Match": `"${v1}"` },
        body: JSON.stringify({ frontmatter: { type: "Concept" }, body: "v2" }),
      }),
      env,
      ctx,
    );
    assert.equal(quotedRes.status, 200, "a quoted If-Match must CAS-succeed identically to the bare form");
    const v2 = ((await quotedRes.json()) as { version: string }).version;

    // A weak-prefixed If-Match (W/"...") must ALSO be accepted.
    const weakRes = await worker.fetch(
      authed("/v0/bundles/default/docs/concepts/if-match-tolerance", {
        method: "PUT",
        headers: { "content-type": "application/json", "If-Match": `W/"${v2}"` },
        body: JSON.stringify({ frontmatter: { type: "Concept" }, body: "v3" }),
      }),
      env,
      ctx,
    );
    assert.equal(weakRes.status, 200, "a weak-prefixed If-Match must ALSO CAS-succeed");
  } finally {
    await testEnv.dispose();
  }
});

test("worker fetch (DELETE-operation pass, full stack): a reader's DELETE is 403 FORBIDDEN, a writer's DELETE is 200 {deleted:true}, and the doc is then genuinely gone (a follow-up GET is 404) — through the REAL worker.fetch entry point over D1R2Backend + createAuthGate, exactly as production wires them", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, API_KEY);
    const store = new MembershipStore(testEnv.db);

    await store.createUser({ id: "u-reader", display: null, createdAt: "2026-07-02T00:00:00.000Z" });
    await store.setMembership("u-reader", "default", "reader");
    const readerKey = await mintKeyFor(store, "k-reader", "u-reader");

    await store.createUser({ id: "u-writer", display: null, createdAt: "2026-07-02T00:00:00.000Z" });
    await store.setMembership("u-writer", "default", "writer");
    const writerKey = await mintKeyFor(store, "k-writer", "u-writer");

    // Seed the doc as root (admin everywhere).
    const writeRes = await worker.fetch(
      authed("/v0/bundles/default/docs/concepts/deleteme", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ frontmatter: { type: "Concept" }, body: "will be deleted" }),
      }),
      env,
      ctx,
    );
    assert.equal(writeRes.status, 200);

    // A reader's DELETE is 403 — never reaches the backend, so the doc must survive.
    const readerDeleteReq = new Request("http://worker.local/v0/bundles/default/docs/concepts/deleteme", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${readerKey}` },
    });
    const readerRes = await worker.fetch(readerDeleteReq, env, ctx);
    assert.equal(readerRes.status, 403);
    const readerBody = (await readerRes.json()) as { error: { code: string } };
    assert.equal(readerBody.error.code, "FORBIDDEN");

    const stillThereRes = await worker.fetch(authed("/v0/bundles/default/docs/concepts/deleteme"), env, ctx);
    assert.equal(stillThereRes.status, 200, "a 403'd delete attempt must not have touched the doc");

    // A writer's DELETE succeeds.
    const writerDeleteReq = new Request("http://worker.local/v0/bundles/default/docs/concepts/deleteme", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${writerKey}` },
    });
    const writerRes = await worker.fetch(writerDeleteReq, env, ctx);
    assert.equal(writerRes.status, 200);
    const writerBody = (await writerRes.json()) as { deleted: boolean };
    assert.deepEqual(writerBody, { deleted: true });

    // The doc is genuinely gone: a follow-up GET (even as root) is 404.
    const goneRes = await worker.fetch(authed("/v0/bundles/default/docs/concepts/deleteme"), env, ctx);
    assert.equal(goneRes.status, 404);

    // Idempotent: a second writer delete on the now-absent doc is 200 {deleted:false}, not an error.
    const secondDeleteRes = await worker.fetch(
      new Request("http://worker.local/v0/bundles/default/docs/concepts/deleteme", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${writerKey}` },
      }),
      env,
      ctx,
    );
    assert.equal(secondDeleteRes.status, 200);
    assert.deepEqual((await secondDeleteRes.json()) as { deleted: boolean }, { deleted: false });
  } finally {
    await testEnv.dispose();
  }
});

test("worker fetch: GET /v0/capabilities reports enforced_cas:true and blobs:true via D1R2Backend's self-declaration (auth still required)", async () => {
  const testEnv = await createTestEnv();
  try {
    const env = envWithKey(testEnv.db, testEnv.bucket, API_KEY);

    const unauthed = await worker.fetch(new Request("http://worker.local/v0/capabilities"), env, ctx);
    assert.equal(unauthed.status, 401, "capabilities is behind the gate too — no unauthenticated endpoint");

    const res = await worker.fetch(authed("/v0/capabilities"), env, ctx);
    assert.equal(res.status, 200);
    const body = (await res.json()) as { enforced_cas: boolean; blobs: boolean; history: boolean };
    assert.equal(body.enforced_cas, true);
    assert.equal(body.blobs, true);
    assert.equal(body.history, true);
  } finally {
    await testEnv.dispose();
  }
});
