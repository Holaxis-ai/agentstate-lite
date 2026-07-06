/**
 * HTTP-level tests for the Stage-2 auth Part A surface, driven through the REAL
 * `worker.fetch` (`../src/worker.js`) — `D1R2Backend` + `MembershipStore` + the full
 * `createAuthGate` stack, exactly as `worker.test.ts` exercises the pre-existing
 * doc/blob routes. Covers: the join flow (success, oracle-freedom, an N=10 concurrent
 * race), whoami/bundles, invites/members/keys CRUD, the role matrix (reader/writer/
 * admin/root incl. the root bootstrap nag), the minted-key attribution round-trip
 * (join -> use key -> write attributed to the new user id in `doc_history.actor`,
 * verified via `GET /docs/{id}/versions`), and `auth_events` rows.
 */
import test from "node:test";
import assert from "node:assert/strict";

import worker, { type Env } from "../src/worker.js";
import { MembershipStore } from "../src/membership-store.js";
import { fingerprint, hmacSha256Hex, mintApiKeyToken, mintInviteToken } from "../src/tokens.js";
import { createTestEnv } from "./env.js";

const API_KEY = "test-root-key";
const PEPPER = "test-pepper";

// `worker.ts` hoists its rate limiters to MODULE scope deliberately (per-isolate realism —
// see `rate-limit.ts`), which means every test in THIS file shares the SAME `/v0/join` and
// auth-failure buckets keyed by client IP. Without a distinct `CF-Connecting-IP` per test,
// all of them fall back to the SAME "unknown" bucket and the join limiter (10/min by
// default) trips partway through this file, unrelated to whatever each test is actually
// checking. `nextIp()` hands every test (or, for the race test, every CONCURRENT call
// within one test that should legitimately share a bucket) an otherwise-unused synthetic
// IP so tests stay isolated from each other, the same way `createTestEnv()` isolates D1/R2.
let ipCounter = 0;
function nextIp(): string {
  return `10.50.0.${++ipCounter}`;
}

const ctx = { waitUntil: () => {}, passThroughOnException: () => {}, props: {} } as unknown as Parameters<typeof worker.fetch>[2];

function env(db: Env["DB"], bucket: Env["BUCKET"]): Env {
  return { DB: db, BUCKET: bucket, API_KEY, KEY_PEPPER: PEPPER };
}

function authed(path: string, token: string, init: RequestInit = {}): Request {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return new Request(`http://worker.local${path}`, { ...init, headers });
}

/** A JSON-bodied `RequestInit`, defaulting to `POST` (every call site below sends a body — `GET`/`HEAD` cannot). */
function json(body: unknown, init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  return { method: "POST", ...init, headers, body: JSON.stringify(body) };
}

/** Create an invite directly via the store (bypassing `POST /v0/invites`) for test setup convenience. */
async function seedInvite(db: Env["DB"], opts: { bundle?: string; role: "admin" | "writer" | "reader"; id?: string }): Promise<string> {
  const store = new MembershipStore(db);
  const token = mintInviteToken();
  const tokenHash = await hmacSha256Hex(PEPPER, token);
  await store.createInvite({
    id: opts.id ?? token.slice(0, 12),
    tokenHash,
    bundle: opts.bundle ?? "default",
    role: opts.role,
    expiresAt: "2099-01-01T00:00:00.000Z",
    createdBy: "root",
    displayHint: null,
  });
  return token;
}

async function join(db: Env["DB"], bucket: Env["BUCKET"], token: string, display?: string, ip: string = nextIp()) {
  const res = await worker.fetch(
    new Request("http://worker.local/v0/join", json({ invite_token: token, display }, { headers: { "CF-Connecting-IP": ip } })),
    env(db, bucket),
    ctx,
  );
  return { res, body: (await res.json()) as Record<string, unknown> };
}

// ── join ─────────────────────────────────────────────────────────────────────────────

test("POST /v0/join: a valid invite mints a user + membership + api_key, shown once, matching the invite's bundle/role", async () => {
  const testEnv = await createTestEnv();
  try {
    const token = await seedInvite(testEnv.db, { role: "writer" });
    const { res, body } = await join(testEnv.db, testEnv.bucket, token, "New Agent");
    assert.equal(res.status, 201);
    assert.equal(body.role, "writer");
    assert.equal(body.bundle, "default");
    assert.match(body.api_key as string, /^aslk_/);
    assert.ok(typeof body.user_id === "string" && body.user_id.length > 0);

    // whoami with the freshly minted key confirms the membership landed.
    const whoRes = await worker.fetch(authed("/v0/whoami", body.api_key as string), env(testEnv.db, testEnv.bucket), ctx);
    assert.equal(whoRes.status, 200);
    const who = (await whoRes.json()) as { user_id: string; memberships: Array<{ bundle: string; role: string }> };
    assert.equal(who.user_id, body.user_id);
    assert.deepEqual(who.memberships, [{ bundle: "default", role: "writer" }]);
  } finally {
    await testEnv.dispose();
  }
});

test("POST /v0/join: unknown / expired / revoked / already-redeemed tokens ALL produce the identical 400 INVITE_INVALID envelope", async () => {
  const testEnv = await createTestEnv();
  try {
    const bogus = await join(testEnv.db, testEnv.bucket, "totally-bogus-token");
    assert.equal(bogus.res.status, 400);
    assert.equal((bogus.body as { error: { code: string } }).error.code, "INVITE_INVALID");
    const bogusMessage = (bogus.body as { error: { message: string } }).error.message;

    const expiredToken = mintInviteToken();
    const store = new MembershipStore(testEnv.db);
    await store.createInvite({
      id: "inv-expired",
      tokenHash: await hmacSha256Hex(PEPPER, expiredToken),
      bundle: "default",
      role: "reader",
      expiresAt: "2020-01-01T00:00:00.000Z",
      createdBy: "root",
      displayHint: null,
    });
    const expired = await join(testEnv.db, testEnv.bucket, expiredToken);
    assert.equal(expired.res.status, 400);
    assert.equal((expired.body as { error: { code: string; message: string } }).error.code, "INVITE_INVALID");
    assert.equal((expired.body as { error: { message: string } }).error.message, bogusMessage, "identical message regardless of failure cause");

    const revokedToken = await seedInvite(testEnv.db, { role: "reader", id: "inv-revoked" });
    await store.revokeInvite("inv-revoked");
    const revoked = await join(testEnv.db, testEnv.bucket, revokedToken);
    assert.equal(revoked.res.status, 400);
    assert.equal((revoked.body as { error: { message: string } }).error.message, bogusMessage);

    const reusedToken = await seedInvite(testEnv.db, { role: "reader", id: "inv-reused" });
    const first = await join(testEnv.db, testEnv.bucket, reusedToken);
    assert.equal(first.res.status, 201);
    const second = await join(testEnv.db, testEnv.bucket, reusedToken);
    assert.equal(second.res.status, 400);
    assert.equal((second.body as { error: { message: string } }).error.message, bogusMessage);
  } finally {
    await testEnv.dispose();
  }
});

test("POST /v0/join: N=10 concurrent joins on ONE token yield exactly 1 winner (201) and 9 losers (400 INVITE_INVALID)", async () => {
  const testEnv = await createTestEnv();
  try {
    const token = await seedInvite(testEnv.db, { role: "reader" });
    const N = 10;
    const ip = nextIp(); // ALL N racers share ONE fresh bucket on purpose: N == the default limit, so none should be rate-limited — the invite's own CAS is what must produce exactly 1 winner.
    const results = await Promise.all(
      Array.from({ length: N }, () =>
        worker.fetch(new Request("http://worker.local/v0/join", json({ invite_token: token }, { headers: { "CF-Connecting-IP": ip } })), env(testEnv.db, testEnv.bucket), ctx),
      ),
    );
    const statuses = results.map((r) => r.status).sort();
    assert.deepEqual(statuses, [201, ...Array(N - 1).fill(400)]);
  } finally {
    await testEnv.dispose();
  }
});

test("POST /v0/join: malformed body (no invite_token) is 400 USAGE, distinct from the oracle-free INVITE_INVALID", async () => {
  const testEnv = await createTestEnv();
  try {
    const res = await worker.fetch(
      new Request("http://worker.local/v0/join", json({}, { headers: { "CF-Connecting-IP": nextIp() } })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(res.status, 400);
    const body = (await res.json()) as { error: { code: string } };
    assert.equal(body.error.code, "USAGE");
  } finally {
    await testEnv.dispose();
  }
});

// ── whoami / bundles ─────────────────────────────────────────────────────────────────

test("GET /v0/whoami and GET /v0/bundles: root sees the bootstrap nag and every bundle as admin", async () => {
  const testEnv = await createTestEnv();
  try {
    await seedInvite(testEnv.db, { bundle: "another-bundle", role: "writer", id: "inv-other" }); // gives listAllBundles something extra to surface

    const whoRes = await worker.fetch(authed("/v0/whoami", API_KEY), env(testEnv.db, testEnv.bucket), ctx);
    const who = (await whoRes.json()) as { user_id: string; bootstrap: boolean };
    assert.equal(who.user_id, "root");
    assert.equal(who.bootstrap, true);

    const bundlesRes = await worker.fetch(authed("/v0/bundles", API_KEY), env(testEnv.db, testEnv.bucket), ctx);
    const bundlesBody = (await bundlesRes.json()) as { bundles: Array<{ bundle: string; role: string }>; bootstrap: boolean };
    assert.ok(bundlesBody.bundles.some((b) => b.bundle === "default" && b.role === "admin"));
    assert.equal(bundlesBody.bootstrap, true);
  } finally {
    await testEnv.dispose();
  }
});

// ── invites / members / keys (admin-gated) ──────────────────────────────────────────

test("POST /v0/invites requires admin; a writer gets 403, an admin gets 201", async () => {
  const testEnv = await createTestEnv();
  try {
    const writerToken = await seedInvite(testEnv.db, { role: "writer", id: "inv-for-writer" });
    const { body: writerJoin } = await join(testEnv.db, testEnv.bucket, writerToken);

    const denied = await worker.fetch(
      authed("/v0/invites", writerJoin.api_key as string, json({ role: "reader" })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(denied.status, 403);
    const deniedBody = (await denied.json()) as { error: { code: string } };
    assert.equal(deniedBody.error.code, "FORBIDDEN");

    const adminToken = await seedInvite(testEnv.db, { role: "admin", id: "inv-for-admin" });
    const { body: adminJoin } = await join(testEnv.db, testEnv.bucket, adminToken);

    const created = await worker.fetch(
      authed("/v0/invites", adminJoin.api_key as string, json({ role: "reader", expires_in_hours: 1 })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(created.status, 201);
    const createdBody = (await created.json()) as { token: string; invite_id: string; bootstrap?: boolean };
    assert.match(createdBody.token, /^aslinv_/);
    assert.equal(createdBody.bootstrap, undefined, "no bootstrap nag for a REAL admin");

    // A real admin can also redeem, revoke, and list.
    const listRes = await worker.fetch(authed(`/v0/invites?bundle=default`, adminJoin.api_key as string), env(testEnv.db, testEnv.bucket), ctx);
    const listBody = (await listRes.json()) as { count: number };
    assert.ok(listBody.count >= 1);

    const revokeRes = await worker.fetch(
      authed(`/v0/invites/${createdBody.invite_id}`, adminJoin.api_key as string, { method: "DELETE" }),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(revokeRes.status, 200);
    const revokeBody = (await revokeRes.json()) as { changed: boolean };
    assert.equal(revokeBody.changed, true);
    const revokeAgain = await worker.fetch(
      authed(`/v0/invites/${createdBody.invite_id}`, adminJoin.api_key as string, { method: "DELETE" }),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal((await revokeAgain.json() as { changed: boolean }).changed, false, "idempotent re-revoke");
  } finally {
    await testEnv.dispose();
  }
});

test("GET /v0/members, PUT /v0/members/{id}/role, DELETE /v0/members/{id}: admin-gated, role change is idempotency-aware, removal revokes keys", async () => {
  const testEnv = await createTestEnv();
  try {
    const adminToken = await seedInvite(testEnv.db, { role: "admin", id: "inv-admin-2" });
    const { body: adminJoin } = await join(testEnv.db, testEnv.bucket, adminToken);

    const memberToken = await seedInvite(testEnv.db, { role: "reader", id: "inv-member" });
    const { body: memberJoin } = await join(testEnv.db, testEnv.bucket, memberToken);
    const memberUserId = memberJoin.user_id as string;

    const membersRes = await worker.fetch(authed("/v0/members?bundle=default", adminJoin.api_key as string), env(testEnv.db, testEnv.bucket), ctx);
    const membersBody = (await membersRes.json()) as { members: Array<{ userId: string; role: string }> };
    assert.ok(membersBody.members.some((m) => m.userId === memberUserId && m.role === "reader"));

    const roleRes = await worker.fetch(
      authed(`/v0/members/${memberUserId}/role`, adminJoin.api_key as string, json({ bundle: "default", role: "writer" }, { method: "PUT" })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(roleRes.status, 200);
    assert.equal((await roleRes.json() as { changed: boolean }).changed, true);

    // Setting the SAME role again is a no-op (`changed: false`).
    const roleAgain = await worker.fetch(
      authed(`/v0/members/${memberUserId}/role`, adminJoin.api_key as string, json({ bundle: "default", role: "writer" }, { method: "PUT" })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal((await roleAgain.json() as { changed: boolean }).changed, false);

    // Removing the member ALSO revokes their keys — the just-minted join key stops working.
    const removeRes = await worker.fetch(
      authed(`/v0/members/${memberUserId}?bundle=default`, adminJoin.api_key as string, { method: "DELETE" }),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(removeRes.status, 200);
    const removeBody = (await removeRes.json()) as { changed: boolean; revoked_keys: number };
    assert.equal(removeBody.changed, true);
    assert.ok(removeBody.revoked_keys >= 1);

    const revokedKeyUse = await worker.fetch(authed("/v0/whoami", memberJoin.api_key as string), env(testEnv.db, testEnv.bucket), ctx);
    assert.equal(revokedKeyUse.status, 401, "a removed member's key is revoked, not just unmembered");
  } finally {
    await testEnv.dispose();
  }
});

test("POST /v0/keys: self-mint requires no admin; minting for another user or a new agent DOES", async () => {
  const testEnv = await createTestEnv();
  try {
    const writerToken = await seedInvite(testEnv.db, { role: "writer", id: "inv-writer-3" });
    const { body: writerJoin } = await join(testEnv.db, testEnv.bucket, writerToken);

    // Self-mint: no admin role needed.
    const selfMint = await worker.fetch(authed("/v0/keys", writerJoin.api_key as string, json({ label: "second device" })), env(testEnv.db, testEnv.bucket), ctx);
    assert.equal(selfMint.status, 201);
    const selfMintBody = (await selfMint.json()) as { id: string; user_id: string; api_key: string };
    assert.equal(selfMintBody.user_id, writerJoin.user_id);

    // Minting for someone else: 403 without admin.
    const forOther = await worker.fetch(
      authed("/v0/keys", writerJoin.api_key as string, json({ new_agent_label: "sneaky agent" })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(forOther.status, 403);

    // An admin CAN mint a brand-new agent key.
    const adminToken = await seedInvite(testEnv.db, { role: "admin", id: "inv-admin-3" });
    const { body: adminJoin } = await join(testEnv.db, testEnv.bucket, adminToken);
    const agentMint = await worker.fetch(
      authed("/v0/keys", adminJoin.api_key as string, json({ new_agent_label: "ci-bot" })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(agentMint.status, 201);
    const agentBody = (await agentMint.json()) as { id: string; user_id: string; api_key: string; last_four: string };
    assert.notEqual(agentBody.user_id, adminJoin.user_id);
    assert.equal(agentBody.last_four, agentBody.api_key.slice(-4));

    // GET /v0/keys: self sees only their own; admin sees ALL (deployment-wide).
    const selfList = await worker.fetch(authed("/v0/keys", writerJoin.api_key as string), env(testEnv.db, testEnv.bucket), ctx);
    const selfListBody = (await selfList.json()) as { keys: Array<{ userId: string }> };
    assert.ok(selfListBody.keys.every((k) => k.userId === writerJoin.user_id));

    const adminList = await worker.fetch(authed("/v0/keys", adminJoin.api_key as string), env(testEnv.db, testEnv.bucket), ctx);
    const adminListBody = (await adminList.json()) as { keys: Array<{ userId: string }>; bootstrap?: boolean };
    assert.ok(adminListBody.keys.some((k) => k.userId === agentBody.user_id));
    assert.ok(adminListBody.keys.some((k) => k.userId === writerJoin.user_id));

    // DELETE /v0/keys/{id}: self-own works.
    const ownRevoke = await worker.fetch(
      authed(`/v0/keys/${selfMintBody.id}`, writerJoin.api_key as string, { method: "DELETE" }),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(ownRevoke.status, 200);
    assert.equal((await ownRevoke.json() as { changed: boolean }).changed, true);

    // Another user's key needs admin: the writer cannot revoke the admin-minted agent's
    // key — L1 fix: this is now a UNIFORM 404 (not 403), identical to what a
    // non-existent key id would return, so the response never becomes an existence
    // oracle for a caller with no right to know either way (see "L1" test below for
    // the direct absent-vs-not-mine comparison).
    const forbiddenRevoke = await worker.fetch(
      authed(`/v0/keys/${agentBody.id}`, writerJoin.api_key as string, { method: "DELETE" }),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(forbiddenRevoke.status, 404);
    // ...but the admin can.
    const adminRevoke = await worker.fetch(
      authed(`/v0/keys/${agentBody.id}`, adminJoin.api_key as string, { method: "DELETE" }),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(adminRevoke.status, 200);
  } finally {
    await testEnv.dispose();
  }
});

test("B2 (adversarial review, BLOCKER, fixed): a 'user_id' field in the mint body is IGNORED — an admin cannot mint a usable credential for an EXISTING human user_id (impersonation vector closed)", async () => {
  const testEnv = await createTestEnv();
  try {
    const humanToken = await seedInvite(testEnv.db, { role: "writer", id: "inv-b2-human" });
    const { body: humanJoin } = await join(testEnv.db, testEnv.bucket, humanToken);

    const adminToken = await seedInvite(testEnv.db, { role: "admin", id: "inv-b2-admin" });
    const { body: adminJoin } = await join(testEnv.db, testEnv.bucket, adminToken);

    // The admin tries to mint a key "for" the human's user_id — the OLD vector.
    const res = await worker.fetch(
      authed("/v0/keys", adminJoin.api_key as string, json({ user_id: humanJoin.user_id })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(res.status, 201, "the request still succeeds — but as a SELF-mint, not an impersonation");
    const body = (await res.json()) as { user_id: string };
    assert.equal(body.user_id, adminJoin.user_id, "the minted key belongs to the CALLER (admin), never the named human — the field is inert");
    assert.notEqual(body.user_id, humanJoin.user_id);

    // The human's own key list is unaffected — no extra key silently appeared for them.
    const humanKeys = await worker.fetch(authed("/v0/keys", humanJoin.api_key as string), env(testEnv.db, testEnv.bucket), ctx);
    const humanKeysBody = (await humanKeys.json()) as { keys: unknown[] };
    assert.equal(humanKeysBody.keys.length, 1, "only the join-minted key — nothing minted on their behalf by the admin's request");
  } finally {
    await testEnv.dispose();
  }
});

test("M1 (adversarial review): root self-mint is a clean 400 USAGE reject, and no api_keys row for user_id='root' is EVER created", async () => {
  const testEnv = await createTestEnv();
  try {
    const res = await worker.fetch(authed("/v0/keys", API_KEY, json({ label: "root's own key?" })), env(testEnv.db, testEnv.bucket), ctx);
    assert.equal(res.status, 400);
    const body = (await res.json()) as { error: { code: string } };
    assert.equal(body.error.code, "USAGE");

    const store = new MembershipStore(testEnv.db);
    assert.deepEqual(await store.listKeys("root"), [], "no api_keys row ever exists for the virtual 'root' identity");

    // Root minting an AGENT key (not a self-mint) is unaffected — only self-mint is rejected.
    const agentRes = await worker.fetch(authed("/v0/keys", API_KEY, json({ new_agent_label: "root-minted-agent" })), env(testEnv.db, testEnv.bucket), ctx);
    assert.equal(agentRes.status, 201);
  } finally {
    await testEnv.dispose();
  }
});

test("L1: DELETE /v0/keys/{id} gives a non-owner, non-admin caller the IDENTICAL 404 whether the key is absent or belongs to someone else — no existence oracle", async () => {
  const testEnv = await createTestEnv();
  try {
    const ownerToken = await seedInvite(testEnv.db, { role: "writer", id: "inv-l1-owner" });
    const { body: ownerJoin } = await join(testEnv.db, testEnv.bucket, ownerToken);
    const otherToken = await seedInvite(testEnv.db, { role: "writer", id: "inv-l1-other" });
    const { body: otherJoin } = await join(testEnv.db, testEnv.bucket, otherToken);

    const mintRes = await worker.fetch(authed("/v0/keys", ownerJoin.api_key as string, json({ label: "owner's key" })), env(testEnv.db, testEnv.bucket), ctx);
    const mintBody = (await mintRes.json()) as { id: string };

    const notMine = await worker.fetch(authed(`/v0/keys/${mintBody.id}`, otherJoin.api_key as string, { method: "DELETE" }), env(testEnv.db, testEnv.bucket), ctx);
    const absent = await worker.fetch(authed(`/v0/keys/totally-bogus-id`, otherJoin.api_key as string, { method: "DELETE" }), env(testEnv.db, testEnv.bucket), ctx);

    // Same status + error CODE either way — the actual security property. The message
    // legitimately echoes back the id the CALLER supplied (which differs between the
    // two requests here only because the test used two different ids) — that's not a
    // leak, since the caller already knows what id they asked for; comparing the
    // status/code (not the caller-echoed message text) is the right invariant.
    assert.equal(notMine.status, 404);
    assert.equal(absent.status, 404);
    const notMineBody = (await notMine.json()) as { error: { code: string } };
    const absentBody = (await absent.json()) as { error: { code: string } };
    assert.equal(notMineBody.error.code, "NOT_FOUND");
    assert.equal(absentBody.error.code, "NOT_FOUND");

    // Stronger check: querying the SAME (not-mine) id twice — once for a caller
    // without access, once for the genuinely-owning caller — is what actually proves
    // no additional information leaked: the non-owner's response never reveals more
    // than "not found", regardless of the id's real state.
    const notMineAgain = await worker.fetch(authed(`/v0/keys/${mintBody.id}`, otherJoin.api_key as string, { method: "DELETE" }), env(testEnv.db, testEnv.bucket), ctx);
    assert.equal(notMineAgain.status, 404, "still 404 on a second probe of the SAME real (but not-theirs) id — no state change, no leak");
  } finally {
    await testEnv.dispose();
  }
});

test("B1: every auth-route that accepts a bundle rejects anything other than 'default' with 400 USAGE (create/list invites, list/set-role/remove members)", async () => {
  const testEnv = await createTestEnv();
  try {
    const adminToken = await seedInvite(testEnv.db, { role: "admin", id: "inv-b1-admin" });
    const { body: adminJoin } = await join(testEnv.db, testEnv.bucket, adminToken);
    const key = adminJoin.api_key as string;
    const BAD = "not-default";

    const assertUsage = async (res: Response) => {
      assert.equal(res.status, 400);
      const body = (await res.json()) as { error: { code: string } };
      assert.equal(body.error.code, "USAGE");
    };

    await assertUsage(await worker.fetch(authed("/v0/invites", key, json({ role: "reader", bundle: BAD })), env(testEnv.db, testEnv.bucket), ctx));
    await assertUsage(await worker.fetch(authed(`/v0/invites?bundle=${BAD}`, key), env(testEnv.db, testEnv.bucket), ctx));
    await assertUsage(await worker.fetch(authed(`/v0/members?bundle=${BAD}`, key), env(testEnv.db, testEnv.bucket), ctx));
    await assertUsage(
      await worker.fetch(authed(`/v0/members/${adminJoin.user_id}/role`, key, json({ role: "reader", bundle: BAD }, { method: "PUT" })), env(testEnv.db, testEnv.bucket), ctx),
    );
    await assertUsage(
      await worker.fetch(authed(`/v0/members/${adminJoin.user_id}?bundle=${BAD}`, key, { method: "DELETE" }), env(testEnv.db, testEnv.bucket), ctx),
    );

    // And directly confirms the cross-bundle repro this closes: no invite for a
    // non-default bundle can ever be CREATED in the first place, so no membership for
    // one can ever exist, so there is nothing for a role lookup to find at any OTHER
    // bundle name — the gate's own B1 test (auth.test.ts) proves the URL-path half.
    const store = new MembershipStore(testEnv.db);
    assert.deepEqual(await store.listAllBundles(), ["default"]);
  } finally {
    await testEnv.dispose();
  }
});

test("L3: demoting or removing the LAST admin of the bundle is rejected (409 LAST_ADMIN); root is exempt from the guard", async () => {
  const testEnv = await createTestEnv();
  try {
    const soleAdminToken = await seedInvite(testEnv.db, { role: "admin", id: "inv-l3-sole" });
    const { body: soleAdminJoin } = await join(testEnv.db, testEnv.bucket, soleAdminToken);
    const soleAdminKey = soleAdminJoin.api_key as string;
    const soleAdminId = soleAdminJoin.user_id as string;

    // Self-demotion of the only admin is rejected.
    const demote = await worker.fetch(
      authed(`/v0/members/${soleAdminId}/role`, soleAdminKey, json({ role: "writer" }, { method: "PUT" })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(demote.status, 409);
    const demoteBody = (await demote.json()) as { error: { code: string } };
    assert.equal(demoteBody.error.code, "LAST_ADMIN");
    assert.equal(await new MembershipStore(testEnv.db).getRole(soleAdminId, "default"), "admin", "the role must NOT have actually changed");

    // Self-removal of the only admin is also rejected.
    const remove = await worker.fetch(
      authed(`/v0/members/${soleAdminId}`, soleAdminKey, { method: "DELETE" }),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(remove.status, 409);
    assert.equal((await remove.json() as { error: { code: string } }).error.code, "LAST_ADMIN");

    // With a SECOND admin present, the guard no longer applies — demoting ONE of two
    // admins is fine, since the other remains. Bring in a second admin via root
    // (still exempt itself) BEFORE testing this, so the sole admin stays "admin"
    // throughout this part rather than reusing the now-demoted state above.
    const secondAdminToken = await seedInvite(testEnv.db, { role: "admin", id: "inv-l3-second" });
    const { body: secondAdminJoin } = await join(testEnv.db, testEnv.bucket, secondAdminToken);
    const store = new MembershipStore(testEnv.db);
    assert.equal(await store.countAdmins("default"), 2, "sole-admin + second-admin = 2 real admins at this point");

    const okDemote = await worker.fetch(
      authed(`/v0/members/${secondAdminJoin.user_id}/role`, soleAdminKey, json({ role: "reader" }, { method: "PUT" })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(okDemote.status, 200, "with 2 admins, demoting ONE of them is not the last-admin case");
    assert.equal(await store.countAdmins("default"), 1, "exactly one real admin remains — the guard would now block demoting THIS one");

    // Root is EXEMPT from the guard even against the now-sole remaining admin.
    const rootDemote = await worker.fetch(
      authed(`/v0/members/${soleAdminId}/role`, API_KEY, json({ role: "writer" }, { method: "PUT" })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(rootDemote.status, 200);
    assert.equal(await store.getRole(soleAdminId, "default"), "writer");
    assert.equal(await store.countAdmins("default"), 0, "root can legitimately bring the real-admin count to zero — it remains the backstop");
  } finally {
    await testEnv.dispose();
  }
});

// ── role matrix (through the real worker) ───────────────────────────────────────────

test("role matrix: reader is read-only, writer adds doc/blob writes, admin adds the new admin routes, root does everything with the bootstrap nag", async () => {
  const testEnv = await createTestEnv();
  try {
    const roles = { reader: "inv-matrix-reader", writer: "inv-matrix-writer", admin: "inv-matrix-admin" } as const;
    const keys: Record<string, string> = {};
    for (const [role, id] of Object.entries(roles)) {
      const token = await seedInvite(testEnv.db, { role: role as "admin" | "writer" | "reader", id });
      const { body } = await join(testEnv.db, testEnv.bucket, token);
      keys[role] = body.api_key as string;
    }

    const putDoc = (key: string) =>
      worker.fetch(
        authed("/v0/bundles/default/docs/matrix-doc", key, json({ frontmatter: { type: "T" }, body: "x" }, { method: "PUT" })),
        env(testEnv.db, testEnv.bucket),
        ctx,
      );
    const getDocs = (key: string) => worker.fetch(authed("/v0/bundles/default/docs", key), env(testEnv.db, testEnv.bucket), ctx);
    const createInvite = (key: string) =>
      worker.fetch(authed("/v0/invites", key, json({ role: "reader" })), env(testEnv.db, testEnv.bucket), ctx);

    // reader: GET ok, PUT forbidden, admin route forbidden.
    assert.equal((await getDocs(keys.reader!)).status, 200);
    assert.equal((await putDoc(keys.reader!)).status, 403);
    assert.equal((await createInvite(keys.reader!)).status, 403);

    // writer: GET ok, PUT ok, admin route forbidden.
    assert.equal((await getDocs(keys.writer!)).status, 200);
    assert.equal((await putDoc(keys.writer!)).status, 200);
    assert.equal((await createInvite(keys.writer!)).status, 403);

    // admin: everything ok, no bootstrap nag.
    assert.equal((await getDocs(keys.admin!)).status, 200);
    assert.equal((await putDoc(keys.admin!)).status, 200);
    const adminInvite = await createInvite(keys.admin!);
    assert.equal(adminInvite.status, 201);
    assert.equal((await adminInvite.json() as { bootstrap?: boolean }).bootstrap, undefined);

    // root: everything ok, WITH the bootstrap nag on the admin route.
    assert.equal((await getDocs(API_KEY)).status, 200);
    assert.equal((await putDoc(API_KEY)).status, 200);
    const rootInvite = await createInvite(API_KEY);
    assert.equal(rootInvite.status, 201);
    assert.equal((await rootInvite.json() as { bootstrap?: boolean }).bootstrap, true);
  } finally {
    await testEnv.dispose();
  }
});

// ── attribution round-trip ──────────────────────────────────────────────────────────

test("minted-key auth round-trip: join -> write with the minted key -> the write is attributed to the NEW user id in doc_history.actor (via versions())", async () => {
  const testEnv = await createTestEnv();
  try {
    const token = await seedInvite(testEnv.db, { role: "writer", id: "inv-attribution" });
    const { body } = await join(testEnv.db, testEnv.bucket, token);
    const apiKey = body.api_key as string;
    const userId = body.user_id as string;

    const writeRes = await worker.fetch(
      authed(
        "/v0/bundles/default/docs/attribution-check",
        apiKey,
        json({ frontmatter: { type: "Concept", title: "Attribution" }, body: "written by the new user" }, { method: "PUT" }),
      ),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(writeRes.status, 200);

    const versionsRes = await worker.fetch(
      authed("/v0/bundles/default/docs/attribution-check/versions", apiKey),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(versionsRes.status, 200);
    const versionsBody = (await versionsRes.json()) as { versions: Array<{ actor: string }> };
    assert.equal(versionsBody.versions.length, 1);
    assert.equal(versionsBody.versions[0]!.actor, userId, "the doc_history row is attributed to the MINTED KEY'S internal user id, not root/default");
  } finally {
    await testEnv.dispose();
  }
});

// ── auth_events ──────────────────────────────────────────────────────────────────────

test("auth_events: rows are written for key mint/revoke, invite create/redeem/revoke, membership change, and access denied", async () => {
  const testEnv = await createTestEnv();
  try {
    const adminToken = await seedInvite(testEnv.db, { role: "admin", id: "inv-events-admin" });
    const { body: adminJoin } = await join(testEnv.db, testEnv.bucket, adminToken); // -> invite_redeemed

    const invRes = await worker.fetch(authed("/v0/invites", adminJoin.api_key as string, json({ role: "reader" })), env(testEnv.db, testEnv.bucket), ctx);
    const invBody = (await invRes.json()) as { invite_id: string };
    await worker.fetch(authed(`/v0/invites/${invBody.invite_id}`, adminJoin.api_key as string, { method: "DELETE" }), env(testEnv.db, testEnv.bucket), ctx); // -> invite_revoked

    const keyRes = await worker.fetch(authed("/v0/keys", adminJoin.api_key as string, json({ label: "x" })), env(testEnv.db, testEnv.bucket), ctx);
    const keyBody = (await keyRes.json()) as { id: string };
    await worker.fetch(authed(`/v0/keys/${keyBody.id}`, adminJoin.api_key as string, { method: "DELETE" }), env(testEnv.db, testEnv.bucket), ctx); // -> key_revoked

    await worker.fetch(authed(`/v0/members/${adminJoin.user_id}/role`, adminJoin.api_key as string, json({ bundle: "default", role: "admin" }, { method: "PUT" })), env(testEnv.db, testEnv.bucket), ctx); // no-op but still a membership_changed event path

    // access_denied: a reader tries an admin route.
    const readerToken = await seedInvite(testEnv.db, { role: "reader", id: "inv-events-reader" });
    const { body: readerJoin } = await join(testEnv.db, testEnv.bucket, readerToken);
    await worker.fetch(authed("/v0/invites", readerJoin.api_key as string, json({ role: "reader" })), env(testEnv.db, testEnv.bucket), ctx);

    const store = new MembershipStore(testEnv.db);
    const events = await store.listEvents();
    const kinds = new Set(events.map((e) => e.event));
    for (const expected of ["invite_redeemed", "invite_created", "invite_revoked", "key_minted", "key_revoked", "membership_changed", "access_denied"]) {
      assert.ok(kinds.has(expected), `expected an auth_events row for '${expected}', got kinds: ${[...kinds].join(", ")}`);
    }
  } finally {
    await testEnv.dispose();
  }
});

test("privilege-escalation guard: a non-admin cannot set-role or remove members (self-promotion refused)", async () => {
  // These routes SELF-authorize via their own requireAdmin() call site (the generic gate does not
  // re-check them), so their denial paths need direct coverage — otherwise dropping one guard in a
  // refactor would silently open self-escalation while the invite-create denial test still passed.
  const testEnv = await createTestEnv();
  try {
    const adminToken = await seedInvite(testEnv.db, { role: "admin", id: "esc-admin" });
    const { body: adminJoin } = await join(testEnv.db, testEnv.bucket, adminToken);

    const writerToken = await seedInvite(testEnv.db, { role: "writer", id: "esc-writer" });
    const { body: writerJoin } = await join(testEnv.db, testEnv.bucket, writerToken);
    const writerUserId = writerJoin.user_id as string;

    const readerToken = await seedInvite(testEnv.db, { role: "reader", id: "esc-reader" });
    const { body: readerJoin } = await join(testEnv.db, testEnv.bucket, readerToken);
    const readerUserId = readerJoin.user_id as string;

    // 1) THE escalation path: a writer promotes ITSELF to admin → 403 FORBIDDEN.
    const selfEscalate = await worker.fetch(
      authed(`/v0/members/${writerUserId}/role`, writerJoin.api_key as string, json({ bundle: "default", role: "admin" }, { method: "PUT" })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(selfEscalate.status, 403, "a writer cannot promote itself");
    assert.equal((await selfEscalate.json() as { error: { code: string } }).error.code, "FORBIDDEN");

    // 2) A reader attempting set-role on another member → 403.
    const readerSetRole = await worker.fetch(
      authed(`/v0/members/${writerUserId}/role`, readerJoin.api_key as string, json({ bundle: "default", role: "reader" }, { method: "PUT" })),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(readerSetRole.status, 403, "a reader cannot change roles");

    // 3) A writer attempting to REMOVE another member → 403.
    const writerRemove = await worker.fetch(
      authed(`/v0/members/${readerUserId}?bundle=default`, writerJoin.api_key as string, { method: "DELETE" }),
      env(testEnv.db, testEnv.bucket),
      ctx,
    );
    assert.equal(writerRemove.status, 403, "a writer cannot remove members");

    // The guards held: an admin read confirms the writer is STILL a writer and the reader survives.
    const membersRes = await worker.fetch(authed("/v0/members?bundle=default", adminJoin.api_key as string), env(testEnv.db, testEnv.bucket), ctx);
    const membersBody = (await membersRes.json()) as { members: Array<{ userId: string; role: string }> };
    assert.equal(membersBody.members.find((m) => m.userId === writerUserId)?.role, "writer", "self-escalation left no trace");
    assert.ok(membersBody.members.some((m) => m.userId === readerUserId), "the reader was not removed by a non-admin");
  } finally {
    await testEnv.dispose();
  }
});
