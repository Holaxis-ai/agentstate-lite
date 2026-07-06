/**
 * Unit tests for `auth.ts` (Stage-2 auth Part A, evolving the Stage-1 Unit 2b Part C
 * single-shared-secret gate): {@link ApiKeyVerifier}, the {@link authenticate} chain
 * runner (including the SEAM-CONFORMANCE requirement — a test-only stub verifier
 * registered alongside `ApiKeyVerifier` proves multi-verifier dispatch order and that
 * authorization runs from membership regardless of WHICH verifier resolved the
 * identity), and {@link createAuthGate} (fail-closed on either missing secret, 401 on
 * a bad/missing credential, 403 on an authenticated-but-under-permissioned request,
 * rate limiting). A trivial stub `bundleRouter` (records whether it was called, echoes
 * 200 with the `X-Actor` header it received) isolates this middleware from the REAL
 * `D1R2Backend`-backed router — `worker.test.ts` covers the full stack.
 *
 * ENUMERATED CHANGE from the prior revision of this file: the old `withApiKey` tests
 * are REPLACED wholesale (that function no longer exists — its behavior is subsumed by
 * `createAuthGate`'s root-key path). Every scenario the old tests covered (correct key
 * passes, wrong/missing key -> 401 AUTH_REQUIRED, unset/blank key fails closed -> 500
 * RUNTIME, case-insensitive `Bearer`, a non-Bearer scheme rejected) is preserved below,
 * now exercised through `createAuthGate` with a real `MembershipStore` — plus the NEW
 * KEY_PEPPER half of the fail-closed condition, and everything role/rate-limit related
 * this unit adds.
 */
import test from "node:test";
import assert from "node:assert/strict";

import {
  ApiKeyVerifier,
  authenticate,
  classifyBundleRoute,
  constantTimeEqual,
  createAuthGate,
  type IdentityVerifier,
} from "../src/auth.js";
import { MembershipStore } from "../src/membership-store.js";
import { createRateLimiters } from "../src/rate-limit.js";
import { fingerprint, hmacSha256Hex, mintApiKeyToken } from "../src/tokens.js";
import { createTestEnv } from "./env.js";

const API_KEY = "test-root-key";
const PEPPER = "test-pepper";

/** Mint an active `api_keys` row for `userId` and return the raw (never-again-visible) key. */
async function mintKeyFor(store: MembershipStore, id: string, userId: string): Promise<string> {
  const raw = mintApiKeyToken();
  const keyHash = await hmacSha256Hex(PEPPER, raw);
  const { prefix, lastFour } = fingerprint(raw);
  await store.mintApiKey({ id, keyHash, keyPrefix: prefix, lastFour, userId, label: null, createdBy: "root", createdAt: "2026-07-02T00:00:00.000Z" });
  return raw;
}

async function withStore(fn: (store: MembershipStore) => Promise<void>): Promise<void> {
  const env = await createTestEnv();
  try {
    await fn(new MembershipStore(env.db));
  } finally {
    await env.dispose();
  }
}

function stubRouter(): { calls: Request[]; router: (req: Request) => Promise<Response> } {
  const calls: Request[] = [];
  const router = async (req: Request): Promise<Response> => {
    calls.push(req);
    return new Response(JSON.stringify({ actor: req.headers.get("X-Actor") }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  return { calls, router };
}

function bearer(path: string, token: string | undefined, init: RequestInit = {}): Request {
  const headers = new Headers(init.headers);
  if (token !== undefined) headers.set("Authorization", `Bearer ${token}`);
  return new Request(`http://worker.local${path}`, { ...init, headers });
}

// ── ApiKeyVerifier ───────────────────────────────────────────────────────────────────

test("ApiKeyVerifier: the root API_KEY resolves the virtual 'root' identity (constant-time match)", async () => {
  await withStore(async (store) => {
    const verifier = new ApiKeyVerifier(API_KEY, PEPPER, store);
    const identity = await verifier.verify(bearer("/v0/whoami", API_KEY));
    assert.deepEqual(identity, { userId: "root", method: "root" });
  });
});

test("ApiKeyVerifier: a wrong/unknown token resolves null (no root match, no api_keys row)", async () => {
  await withStore(async (store) => {
    const verifier = new ApiKeyVerifier(API_KEY, PEPPER, store);
    assert.equal(await verifier.verify(bearer("/v0/whoami", "nope")), null);
    assert.equal(await verifier.verify(bearer("/v0/whoami", undefined)), null);
  });
});

test("ApiKeyVerifier: a minted, active api_keys row resolves that user's identity via HMAC lookup", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-1", display: "Alice", createdAt: "2026-07-02T00:00:00.000Z" });
    const raw = await mintKeyFor(store, "k-1", "u-1");

    const verifier = new ApiKeyVerifier(API_KEY, PEPPER, store);
    const identity = await verifier.verify(bearer("/v0/whoami", raw));
    assert.deepEqual(identity, { userId: "u-1", method: "api-key" });

    // A revoked key no longer resolves.
    await store.revokeKey("k-1");
    assert.equal(await verifier.verify(bearer("/v0/whoami", raw)), null);
  });
});

test("constantTimeEqual: equal and unequal digests", () => {
  const a = new Uint8Array([1, 2, 3]);
  const b = new Uint8Array([1, 2, 3]);
  const c = new Uint8Array([1, 2, 4]);
  assert.equal(constantTimeEqual(a, b), true);
  assert.equal(constantTimeEqual(a, c), false);
});

// ── authenticate() chain + seam conformance ─────────────────────────────────────────

test("authenticate: runs verifiers in order, first non-null wins (seam-conformance: a stub verifier ahead of ApiKeyVerifier)", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-2", display: "Bob", createdAt: "2026-07-02T00:00:00.000Z" });
    await store.setMembership("u-2", "default", "writer");

    let stubCalls = 0;
    const stub: IdentityVerifier = {
      async verify(req) {
        stubCalls++;
        return req.headers.get("X-Stub-Auth") === "yes" ? { userId: "u-2", method: "stub" } : null;
      },
    };
    const apiKeyVerifier = new ApiKeyVerifier(API_KEY, PEPPER, store);

    // Stub matches: it wins, and ApiKeyVerifier is never consulted (order matters).
    let apiKeyCalls = 0;
    const countingApiKeyVerifier: IdentityVerifier = { verify: (r) => { apiKeyCalls++; return apiKeyVerifier.verify(r); } };
    const identity = await authenticate(new Request("http://x/v0/whoami", { headers: { "X-Stub-Auth": "yes" } }), [
      stub,
      countingApiKeyVerifier,
    ]);
    assert.deepEqual(identity, { userId: "u-2", method: "stub" });
    assert.equal(stubCalls, 1);
    assert.equal(apiKeyCalls, 0, "the first non-null verifier wins — later verifiers in the chain must not run");

    // Stub does not match this request: falls through to ApiKeyVerifier.
    const identity2 = await authenticate(bearer("/v0/whoami", API_KEY), [stub, apiKeyVerifier]);
    assert.deepEqual(identity2, { userId: "root", method: "root" });
  });
});

test("seam conformance: middleware authorizes from MEMBERSHIP regardless of which verifier resolved the identity", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-3", display: "Carol", createdAt: "2026-07-02T00:00:00.000Z" });
    await store.setMembership("u-3", "default", "writer");

    const stub: IdentityVerifier = {
      async verify(req) {
        return req.headers.get("X-Stub-Auth") === "yes" ? { userId: "u-3", method: "stub" } : null;
      },
    };
    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [stub, new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });

    // u-3 is a WRITER on "default" via a membership row — reachable via the stub
    // verifier alone, proving authorization consults the store, not the verifier.
    const writeRes = await gate(
      new Request("http://x/v0/bundles/default/docs/x", {
        method: "PUT",
        headers: { "X-Stub-Auth": "yes", "content-type": "application/json" },
        body: JSON.stringify({ frontmatter: { type: "T" }, body: "b" }),
      }),
    );
    assert.equal(writeRes.status, 200);

    // A route class the writer role does NOT satisfy (admin) still 403s through the stub path.
    const adminRes = await gate(
      new Request("http://x/v0/invites", {
        method: "POST",
        headers: { "X-Stub-Auth": "yes", "content-type": "application/json" },
        body: JSON.stringify({ role: "reader" }),
      }),
    );
    assert.equal(adminRes.status, 403);
  });
});

// ── classifyBundleRoute ──────────────────────────────────────────────────────────────

test("classifyBundleRoute: reader for reads (incl. docs:read-many, a POST), writer only for PUT to docs/reserved/blobs", () => {
  assert.equal(classifyBundleRoute("GET", "docs"), "reader");
  assert.equal(classifyBundleRoute("POST", "docs:read-many"), "reader");
  assert.equal(classifyBundleRoute("GET", "docs/x"), "reader");
  assert.equal(classifyBundleRoute("HEAD", "docs/x"), "reader");
  assert.equal(classifyBundleRoute("PUT", "docs/x"), "writer");
  assert.equal(classifyBundleRoute("GET", "docs/x/versions"), "reader");
  assert.equal(classifyBundleRoute("GET", "reserved/log.md"), "reader");
  assert.equal(classifyBundleRoute("PUT", "reserved/log.md"), "writer");
  assert.equal(classifyBundleRoute("GET", "blobs"), "reader");
  assert.equal(classifyBundleRoute("GET", "blobs/x"), "reader");
  assert.equal(classifyBundleRoute("PUT", "blobs/x"), "writer");
});

test("classifyBundleRoute (DELETE-operation pass): DELETE is writer-class on docs/blobs, same as PUT; reserved/ has no DELETE route so it stays reader-classified here (and 400s at the router)", () => {
  assert.equal(classifyBundleRoute("DELETE", "docs/x"), "writer");
  assert.equal(classifyBundleRoute("DELETE", "blobs/x"), "writer");
  assert.equal(classifyBundleRoute("DELETE", "docs"), "reader"); // bulk delete: no isWrite match, 400s at the router
  assert.equal(classifyBundleRoute("DELETE", "reserved/log.md"), "reader"); // no reserved DELETE route at all
});

// ── createAuthGate: fail-closed, 401, role enforcement, rate limiting ──────────────

test("createAuthGate: fails CLOSED (500 RUNTIME) when API_KEY is unset, even with a well-formed header", async () => {
  await withStore(async (store) => {
    const { router, calls } = stubRouter();
    const gate = createAuthGate({
      apiKey: undefined,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(undefined, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });
    const res = await gate(bearer("/v0/bundles/default/docs", API_KEY));
    assert.equal(res.status, 500);
    assert.equal(calls.length, 0);
    const body = (await res.json()) as { error: { code: string } };
    assert.equal(body.error.code, "RUNTIME");
  });
});

test("createAuthGate: fails CLOSED (500 RUNTIME) when KEY_PEPPER is unset — the NEW half of the fail-closed condition", async () => {
  await withStore(async (store) => {
    const { router, calls } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: undefined,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, undefined, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });
    const res = await gate(bearer("/v0/bundles/default/docs", API_KEY));
    assert.equal(res.status, 500);
    assert.equal(calls.length, 0);
    const body = (await res.json()) as { error: { code: string } };
    assert.equal(body.error.code, "RUNTIME");
  });
});

test("createAuthGate: a blank (whitespace-only) API_KEY or KEY_PEPPER also fails CLOSED", async () => {
  await withStore(async (store) => {
    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: "   ",
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier("   ", PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });
    const res = await gate(new Request("http://x/v0/bundles/default/docs"));
    assert.equal(res.status, 500);
  });
});

test("createAuthGate: missing/wrong credential is 401 AUTH_REQUIRED, never reaching bundleRouter", async () => {
  await withStore(async (store) => {
    const { router, calls } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });

    const noHeader = await gate(new Request("http://x/v0/bundles/default/docs"));
    assert.equal(noHeader.status, 401);
    const wrongKey = await gate(bearer("/v0/bundles/default/docs", "wrong"));
    assert.equal(wrongKey.status, 401);
    assert.equal(calls.length, 0);
    const body = (await wrongKey.json()) as { error: { code: string } };
    assert.equal(body.error.code, "AUTH_REQUIRED");
  });
});

test("createAuthGate: 'bearer' lowercase scheme is accepted identically to 'Bearer' (RFC 7235 §2.1)", async () => {
  await withStore(async (store) => {
    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });
    const res = await gate(
      new Request("http://x/v0/bundles/default/docs", { headers: { Authorization: `bearer ${API_KEY}` } }),
    );
    assert.equal(res.status, 200);
  });
});

test("createAuthGate: a non-Bearer Authorization scheme is rejected with 401", async () => {
  await withStore(async (store) => {
    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });
    const res = await gate(new Request("http://x/v0/bundles/default/docs", { headers: { Authorization: "Basic dXNlcjpwYXNz" } }));
    assert.equal(res.status, 401);
  });
});

test("createAuthGate: root reaches the (only) default bundle unconditionally (admin everywhere, virtually)", async () => {
  await withStore(async (store) => {
    const { router, calls } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });
    const res = await gate(bearer("/v0/bundles/default/docs", API_KEY));
    assert.equal(res.status, 200);
    assert.equal(calls.length, 1);
    assert.equal(calls[0]!.headers.get("X-Actor"), "root", "root's writes/reads are attributed as 'root'");
  });
});

test("B1 (adversarial review, single-bundle enforcement): ANY bundle name other than 'default' is rejected 400 USAGE at the gate, even for root — closes the cross-bundle read this fixes", async () => {
  await withStore(async (store) => {
    const { router, calls } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });

    // A membership for a non-default bundle can no longer even be granted (B1 also
    // guards auth-routes.ts), but even a HAND-CRAFTED request naming one is rejected
    // before any role lookup or backend call — proven here directly against the gate,
    // independent of whether such a membership row could exist.
    const res = await gate(bearer("/v0/bundles/some-other-bundle/docs", API_KEY));
    assert.equal(res.status, 400);
    assert.equal(calls.length, 0, "the bundle router is never reached for a rejected bundle name");
    const body = (await res.json()) as { error: { code: string } };
    assert.equal(body.error.code, "USAGE");
  });
});

test("createAuthGate: a reader-role key gets 403 FORBIDDEN on a write route, 200 on a read route", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-reader", display: null, createdAt: "2026-07-02T00:00:00.000Z" });
    await store.setMembership("u-reader", "default", "reader");
    const raw = await mintKeyFor(store, "k-reader", "u-reader");

    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });

    const readRes = await gate(bearer("/v0/bundles/default/docs", raw));
    assert.equal(readRes.status, 200);

    const writeRes = await gate(
      bearer("/v0/bundles/default/docs/x", raw, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ frontmatter: { type: "T" }, body: "b" }),
      }),
    );
    assert.equal(writeRes.status, 403);
    const body = (await writeRes.json()) as { error: { code: string } };
    assert.equal(body.error.code, "FORBIDDEN");

    // access_denied was recorded.
    const events = await store.listEvents({ event: "access_denied" });
    assert.ok(events.some((e) => e.actorUserId === "u-reader"));
  });
});

test("createAuthGate (DELETE-operation pass): a reader-role key gets 403 FORBIDDEN on a DELETE route, a writer-role key gets 200 (the stub router's canned response)", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-reader-del", display: null, createdAt: "2026-07-02T00:00:00.000Z" });
    await store.setMembership("u-reader-del", "default", "reader");
    const readerKey = await mintKeyFor(store, "k-reader-del", "u-reader-del");

    await store.createUser({ id: "u-writer-del", display: null, createdAt: "2026-07-02T00:00:00.000Z" });
    await store.setMembership("u-writer-del", "default", "writer");
    const writerKey = await mintKeyFor(store, "k-writer-del", "u-writer-del");

    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });

    const readerRes = await gate(bearer("/v0/bundles/default/docs/x", readerKey, { method: "DELETE" }));
    assert.equal(readerRes.status, 403);
    const readerBody = (await readerRes.json()) as { error: { code: string } };
    assert.equal(readerBody.error.code, "FORBIDDEN");

    const writerRes = await gate(bearer("/v0/bundles/default/docs/x", writerKey, { method: "DELETE" }));
    assert.equal(writerRes.status, 200);
  });
});

test("createAuthGate: an authenticated identity with NO membership for the bundle also gets 403, not a silent pass", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-none", display: null, createdAt: "2026-07-02T00:00:00.000Z" });
    const raw = await mintKeyFor(store, "k-none", "u-none");

    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });
    const res = await gate(bearer("/v0/bundles/default/docs", raw));
    assert.equal(res.status, 403);
  });
});

test("createAuthGate: X-Actor is INJECTED from the resolved identity, overriding a client-supplied value", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-actor", display: null, createdAt: "2026-07-02T00:00:00.000Z" });
    await store.setMembership("u-actor", "default", "writer");
    const raw = await mintKeyFor(store, "k-actor", "u-actor");

    const { router, calls } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });
    await gate(bearer("/v0/bundles/default/docs", raw, { headers: { "X-Actor": "someone-else" } }));
    assert.equal(calls.length, 1);
    assert.equal(calls[0]!.headers.get("X-Actor"), "u-actor", "the identity's userId wins over a client-supplied X-Actor");
  });
});

test("createAuthGate: withActor splits principal/agent — X-Actor becomes the unforgeable principal (userId), X-Agent carries the client's claimed actor (attested label)", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-actor", display: null, createdAt: "2026-07-02T00:00:00.000Z" });
    await store.setMembership("u-actor", "default", "writer");
    const raw = await mintKeyFor(store, "k-actor-2", "u-actor");

    const { router, calls } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });
    await gate(bearer("/v0/bundles/default/docs", raw, { headers: { "X-Actor": "collab-3" } }));
    assert.equal(calls.length, 1);
    assert.equal(calls[0]!.headers.get("X-Actor"), "u-actor", "principal wins, server-set");
    assert.equal(calls[0]!.headers.get("X-Agent"), "collab-3", "the client's claimed actor is attested as its agent");
  });
});

test("createAuthGate: withActor sanitizes the client's claimed actor into X-Agent — control chars stripped, length capped at 64, blank/absent -> no X-Agent forwarded at all", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-sani", display: null, createdAt: "2026-07-02T00:00:00.000Z" });
    await store.setMembership("u-sani", "default", "writer");
    const raw = await mintKeyFor(store, "k-sani", "u-sani");

    const gate = () => {
      const { router, calls } = stubRouter();
      return {
        calls,
        gate: createAuthGate({
          apiKey: API_KEY,
          pepper: PEPPER,
          store,
          verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
          bundleRouter: router,
          rateLimiters: createRateLimiters(),
        }),
      };
    };

    // Control characters are stripped and the result trimmed.
    {
      const { gate: g, calls } = gate();
      await g(bearer("/v0/bundles/default/docs", raw, { headers: { "X-Actor": "  co\x01llab\x7f-9  " } }));
      assert.equal(calls[0]!.headers.get("X-Agent"), "collab-9");
    }

    // Longer than 64 chars is capped.
    {
      const { gate: g, calls } = gate();
      const long = "x".repeat(100);
      await g(bearer("/v0/bundles/default/docs", raw, { headers: { "X-Actor": long } }));
      assert.equal(calls[0]!.headers.get("X-Agent"), "x".repeat(64));
    }

    // A blank/whitespace-only claimed actor sanitizes to nothing -> no X-Agent header at all.
    {
      const { gate: g, calls } = gate();
      await g(bearer("/v0/bundles/default/docs", raw, { headers: { "X-Actor": "   " } }));
      assert.equal(calls[0]!.headers.has("X-Agent"), false);
    }

    // No X-Actor sent at all by the client -> no X-Agent forwarded.
    {
      const { gate: g, calls } = gate();
      await g(bearer("/v0/bundles/default/docs", raw));
      assert.equal(calls[0]!.headers.has("X-Agent"), false);
    }

    // A client cannot smuggle its OWN X-Agent header directly — it is always dropped/replaced.
    {
      const { gate: g, calls } = gate();
      await g(bearer("/v0/bundles/default/docs", raw, { headers: { "X-Agent": "forged" } }));
      assert.equal(calls[0]!.headers.has("X-Agent"), false, "an incoming X-Agent with no claimed X-Actor is dropped, not forwarded");
    }
  });
});

test("createAuthGate: any authenticated identity reaches /v0/capabilities (not bundle-scoped, no role check)", async () => {
  await withStore(async (store) => {
    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });
    const unauthed = await gate(new Request("http://x/v0/capabilities"));
    assert.equal(unauthed.status, 401);
    const authed = await gate(bearer("/v0/capabilities", API_KEY));
    assert.equal(authed.status, 200);
  });
});

test("createAuthGate: repeated auth failures from one IP trip the rate limiter (429 RATE_LIMITED)", async () => {
  await withStore(async (store) => {
    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(3, 60_000), // small limit so the test is fast
    });
    const ip = "203.0.113.7";
    const attempt = () => gate(bearer("/v0/bundles/default/docs", "wrong", { headers: { "CF-Connecting-IP": ip } }));

    assert.equal((await attempt()).status, 401);
    assert.equal((await attempt()).status, 401);
    assert.equal((await attempt()).status, 401);
    const limited = await attempt();
    assert.equal(limited.status, 429);
    const body = (await limited.json()) as { error: { code: string } };
    assert.equal(body.error.code, "RATE_LIMITED");
  });
});

test("createAuthGate: repeated POST /v0/join attempts from one IP trip the join limiter (429 RATE_LIMITED)", async () => {
  await withStore(async (store) => {
    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(API_KEY, PEPPER, store)],
      bundleRouter: router,
      rateLimiters: createRateLimiters(2, 60_000),
    });
    const ip = "203.0.113.8";
    const attempt = () =>
      gate(
        new Request("http://x/v0/join", {
          method: "POST",
          headers: { "content-type": "application/json", "CF-Connecting-IP": ip },
          body: JSON.stringify({ invite_token: "bogus" }),
        }),
      );

    assert.equal((await attempt()).status, 400); // INVITE_INVALID
    assert.equal((await attempt()).status, 400);
    const limited = await attempt();
    assert.equal(limited.status, 429);
  });
});

// ── M2: structured error envelope for a store/DB throw reaching the gate ──────────

test("M2 (adversarial review): a plain Error thrown by the store during auth-route dispatch becomes a structured 400 USAGE envelope, not a bare/unstructured failure", async () => {
  const env = await createTestEnv();
  try {
    class ThrowingStore extends MembershipStore {
      override async getUser(): Promise<never> {
        throw new Error("simulated D1 failure");
      }
    }
    const store = new ThrowingStore(env.db);
    // A stub verifier resolves identity WITHOUT touching the store, isolating the
    // throw to `handleWhoami`'s own `store.getUser()` call — proving the gate's
    // catch-all (auth.ts), not just ApiKeyVerifier's own error handling.
    const stub: IdentityVerifier = { async verify() { return { userId: "u-throws", method: "stub" }; } };
    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [stub],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });

    const res = await gate(new Request("http://x/v0/whoami"));
    assert.equal(res.status, 400, "a plain Error maps to 400 USAGE — the SAME taxonomy router.ts's own errorFromCaught uses");
    const body = (await res.json()) as { error: { code: string; message: string } };
    assert.equal(body.error.code, "USAGE");
    assert.match(body.error.message, /simulated D1 failure/);
  } finally {
    await env.dispose();
  }
});

test("M2: a non-Error throw maps to 500 RUNTIME, STILL a structured envelope", async () => {
  const env = await createTestEnv();
  try {
    class ThrowingStore extends MembershipStore {
      override async getUser(): Promise<never> {
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- deliberately non-Error, proving errorFromCaught's fallback branch
        throw "not-an-error-object";
      }
    }
    const store = new ThrowingStore(env.db);
    const stub: IdentityVerifier = { async verify() { return { userId: "u-throws-2", method: "stub" }; } };
    const { router } = stubRouter();
    const gate = createAuthGate({
      apiKey: API_KEY,
      pepper: PEPPER,
      store,
      verifiers: [stub],
      bundleRouter: router,
      rateLimiters: createRateLimiters(),
    });

    const res = await gate(new Request("http://x/v0/whoami"));
    assert.equal(res.status, 500);
    const body = (await res.json()) as { error: { code: string } };
    assert.equal(body.error.code, "RUNTIME");
  } finally {
    await env.dispose();
  }
});
