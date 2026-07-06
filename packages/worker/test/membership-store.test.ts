/**
 * Contract tests for {@link MembershipStore} — the ONE module through which every
 * access to the five Stage-2 auth tables happens. Covers users/identities/
 * memberships/invites/api_keys/auth_events CRUD, and the atomic `redeemInvite`
 * concurrency invariant: N=10 concurrent redemptions of the SAME token must yield
 * EXACTLY one winner (same style as `test/race.test.ts`'s D1R2Backend CAS races —
 * one atomic D1 statement per attempt, `Promise.allSettled` over N concurrent calls
 * to the SAME low-level method within ONE test environment).
 */
import test from "node:test";
import assert from "node:assert/strict";

import { MembershipStore } from "../src/membership-store.js";
import { fingerprint, hmacSha256Hex, mintApiKeyToken, mintInviteToken } from "../src/tokens.js";
import { ulid } from "../src/ulid.js";
import { createTestEnv } from "./env.js";

const PEPPER = "test-pepper";
const T0 = "2026-07-02T00:00:00.000Z";

async function withStore(fn: (store: MembershipStore) => Promise<void>): Promise<void> {
  const env = await createTestEnv();
  try {
    await fn(new MembershipStore(env.db));
  } finally {
    await env.dispose();
  }
}

// ── users / identities ───────────────────────────────────────────────────────────────

test("users: createUser/getUser round-trip; absent user is null", async () => {
  await withStore(async (store) => {
    assert.equal(await store.getUser("nope"), null);
    await store.createUser({ id: "u-1", display: "Alice", createdAt: T0 });
    assert.deepEqual(await store.getUser("u-1"), { id: "u-1", display: "Alice", createdAt: T0 });
  });
});

test("identities: linkIdentity/findUserByIdentity round-trip", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-1", display: null, createdAt: T0 });
    await store.linkIdentity("agent", "u-1", "u-1");
    assert.equal(await store.findUserByIdentity("agent", "u-1"), "u-1");
    assert.equal(await store.findUserByIdentity("agent", "nope"), null);
  });
});

// ── memberships ──────────────────────────────────────────────────────────────────────

test("memberships: setMembership upserts (create then change role); getRole/listMemberships/listAllBundles/listMembers/removeMembership", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-1", display: "Alice", createdAt: T0 });
    assert.equal(await store.getRole("u-1", "default"), null);

    await store.setMembership("u-1", "default", "reader");
    assert.equal(await store.getRole("u-1", "default"), "reader");

    await store.setMembership("u-1", "default", "admin"); // upsert: role change, not a duplicate row
    assert.equal(await store.getRole("u-1", "default"), "admin");

    await store.setMembership("u-1", "other-bundle", "writer");
    assert.deepEqual(await store.listMemberships("u-1"), [
      { userId: "u-1", bundle: "default", role: "admin" },
      { userId: "u-1", bundle: "other-bundle", role: "writer" },
    ]);
    assert.deepEqual(await store.listAllBundles(), ["default", "other-bundle"]);

    const members = await store.listMembers("default");
    assert.equal(members.length, 1);
    assert.equal(members[0]!.userId, "u-1");
    assert.equal(members[0]!.display, "Alice");

    assert.equal(await store.removeMembership("u-1", "default"), true);
    assert.equal(await store.getRole("u-1", "default"), null);
    assert.equal(await store.removeMembership("u-1", "default"), false, "removing an absent membership is idempotent-false, not an error");
  });
});

// ── invites ──────────────────────────────────────────────────────────────────────────

test("invites: createInvite/listInvites/getInvite never expose token_hash; revokeInvite is idempotent", async () => {
  await withStore(async (store) => {
    const tokenHash = await hmacSha256Hex(PEPPER, mintInviteToken());
    await store.createInvite({
      id: "inv-1",
      tokenHash,
      bundle: "default",
      role: "writer",
      expiresAt: "2026-08-01T00:00:00.000Z",
      createdBy: "root",
      displayHint: "for Bob",
    });

    const got = await store.getInvite("inv-1");
    assert.ok(got);
    assert.equal((got as unknown as { tokenHash?: string }).tokenHash, undefined, "token_hash must never be selected out");
    assert.equal(got!.bundle, "default");
    assert.equal(got!.role, "writer");
    assert.equal(got!.displayHint, "for Bob");
    assert.equal(got!.redeemedAt, null);
    assert.equal(got!.revokedAt, null);

    const list = await store.listInvites("default");
    assert.equal(list.length, 1);
    assert.equal(list[0]!.id, "inv-1");
    assert.deepEqual(await store.listInvites("some-other-bundle"), []);

    assert.equal(await store.revokeInvite("inv-1"), true);
    assert.equal((await store.getInvite("inv-1"))!.revokedAt !== null, true);
    assert.equal(await store.revokeInvite("inv-1"), false, "revoking an already-revoked invite is idempotent-false");
    assert.equal(await store.revokeInvite("nope"), false);
  });
});

test("redeemInvite: a valid, unredeemed, unexpired token wins and creates user+identity+membership+key+audit-event atomically", async () => {
  await withStore(async (store) => {
    const rawToken = mintInviteToken();
    const tokenHash = await hmacSha256Hex(PEPPER, rawToken);
    await store.createInvite({
      id: "inv-ok",
      tokenHash,
      bundle: "default",
      role: "writer",
      expiresAt: "2099-01-01T00:00:00.000Z",
      createdBy: "root",
      displayHint: "hinted display",
    });

    const userId = ulid();
    const rawKey = mintApiKeyToken();
    const keyHash = await hmacSha256Hex(PEPPER, rawKey);
    const { prefix, lastFour } = fingerprint(rawKey);

    const result = await store.redeemInvite({
      tokenHash,
      now: T0,
      userId,
      display: null, // falls back to the invite's display_hint
      apiKeyId: "key-ok",
      keyHash,
      keyPrefix: prefix,
      lastFour,
      eventId: "evt-ok",
    });
    assert.deepEqual(result, { bundle: "default", role: "writer" });

    assert.deepEqual(await store.getUser(userId), { id: userId, display: "hinted display", createdAt: T0 });
    assert.equal(await store.findUserByIdentity("invite", "inv-ok"), userId);
    assert.equal(await store.getRole(userId, "default"), "writer");
    const activeKey = await store.findActiveKeyByHash(keyHash);
    assert.deepEqual(activeKey, { id: "key-ok", userId });

    const events = await store.listEvents({ event: "invite_redeemed" });
    assert.equal(events.length, 1);
    assert.equal(events[0]!.actorUserId, userId);

    // The SAME token cannot be redeemed twice, even by a different candidate user id.
    const second = await store.redeemInvite({
      tokenHash,
      now: T0,
      userId: ulid(),
      display: null,
      apiKeyId: "key-second",
      keyHash: "irrelevant",
      keyPrefix: "irrelevant",
      lastFour: "0000",
      eventId: "evt-second",
    });
    assert.equal(second, null);
  });
});

test("redeemInvite: unknown / revoked / expired tokens all report the SAME failure (null) — oracle-freedom at the store layer", async () => {
  await withStore(async (store) => {
    const attempt = (tokenHash: string) =>
      store.redeemInvite({
        tokenHash,
        now: T0,
        userId: ulid(),
        display: null,
        apiKeyId: ulid(),
        keyHash: ulid(),
        keyPrefix: "x",
        lastFour: "0000",
        eventId: ulid(),
      });

    // Unknown token.
    assert.equal(await attempt("sha256-of-nothing"), null);

    // Revoked token.
    const revokedHash = await hmacSha256Hex(PEPPER, mintInviteToken());
    await store.createInvite({ id: "inv-revoked", tokenHash: revokedHash, bundle: "default", role: "reader", expiresAt: "2099-01-01T00:00:00.000Z", createdBy: "root", displayHint: null });
    await store.revokeInvite("inv-revoked");
    assert.equal(await attempt(revokedHash), null);

    // Expired token.
    const expiredHash = await hmacSha256Hex(PEPPER, mintInviteToken());
    await store.createInvite({ id: "inv-expired", tokenHash: expiredHash, bundle: "default", role: "reader", expiresAt: "2020-01-01T00:00:00.000Z", createdBy: "root", displayHint: null });
    assert.equal(await attempt(expiredHash), null);
  });
});

test("N=10 concurrent redeemInvite racing the SAME token: exactly 1 winner, 9 losers (null), single-use enforced", async () => {
  await withStore(async (store) => {
    const rawToken = mintInviteToken();
    const tokenHash = await hmacSha256Hex(PEPPER, rawToken);
    await store.createInvite({
      id: "inv-race",
      tokenHash,
      bundle: "default",
      role: "reader",
      expiresAt: "2099-01-01T00:00:00.000Z",
      createdBy: "root",
      displayHint: null,
    });

    const N = 10;
    const attempts = Array.from({ length: N }, (_, i) => {
      const userId = ulid();
      return store
        .redeemInvite({
          tokenHash,
          now: T0,
          userId,
          display: `racer-${i}`,
          apiKeyId: ulid(),
          keyHash: ulid(),
          keyPrefix: "x",
          lastFour: "0000",
          eventId: ulid(),
        })
        .then((result) => ({ userId, result }));
    });

    const outcomes = await Promise.all(attempts);
    const winners = outcomes.filter((o) => o.result !== null);
    const losers = outcomes.filter((o) => o.result === null);
    assert.equal(winners.length, 1, "exactly one concurrent redeemInvite racing the same token must win");
    assert.equal(losers.length, N - 1);

    // The winner's user row actually exists and owns the membership; no loser's user row does.
    const winnerId = winners[0]!.userId;
    assert.ok(await store.getUser(winnerId));
    assert.equal(await store.getRole(winnerId, "default"), "reader");
    for (const loser of losers) {
      assert.equal(await store.getUser(loser.userId), null, "a losing candidate's user row must never have been created");
    }

    const events = await store.listEvents({ event: "invite_redeemed" });
    assert.equal(events.length, 1, "exactly one audit event, not N");
  });
});

// ── api keys ─────────────────────────────────────────────────────────────────────────

test("api keys: mintApiKey/findActiveKeyByHash/getKey/listKeys never select key_hash; revokeKey and revokeAllKeysForUser are idempotent/counted", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-1", display: "Alice", createdAt: T0 });

    const raw1 = mintApiKeyToken();
    const hash1 = await hmacSha256Hex(PEPPER, raw1);
    const fp1 = fingerprint(raw1);
    await store.mintApiKey({ id: "k-1", keyHash: hash1, keyPrefix: fp1.prefix, lastFour: fp1.lastFour, userId: "u-1", label: "laptop", createdBy: "root", createdAt: T0 });

    const raw2 = mintApiKeyToken();
    const hash2 = await hmacSha256Hex(PEPPER, raw2);
    const fp2 = fingerprint(raw2);
    await store.mintApiKey({ id: "k-2", keyHash: hash2, keyPrefix: fp2.prefix, lastFour: fp2.lastFour, userId: "u-1", label: null, createdBy: "root", createdAt: T0 });

    assert.deepEqual(await store.findActiveKeyByHash(hash1), { id: "k-1", userId: "u-1" });
    const got = await store.getKey("k-1");
    assert.equal(got!.userId, "u-1");
    assert.equal(got!.revokedAt, null);

    const keys = await store.listKeys("u-1");
    assert.equal(keys.length, 2);
    for (const k of keys) assert.equal((k as unknown as { keyHash?: string }).keyHash, undefined, "key_hash must never be selected out");

    assert.equal(await store.revokeKey("k-1"), true);
    assert.equal(await store.findActiveKeyByHash(hash1), null, "a revoked key no longer resolves");
    assert.equal(await store.revokeKey("k-1"), false, "idempotent: already revoked");

    const revokedCount = await store.revokeAllKeysForUser("u-1");
    assert.equal(revokedCount, 1, "only k-2 was still active");
    assert.equal(await store.findActiveKeyByHash(hash2), null);
  });
});

test("listKeys with no userId lists EVERY key deployment-wide (admin scope)", async () => {
  await withStore(async (store) => {
    await store.createUser({ id: "u-1", display: null, createdAt: T0 });
    await store.createUser({ id: "u-2", display: null, createdAt: T0 });
    for (const [id, userId] of [
      ["k-1", "u-1"],
      ["k-2", "u-2"],
    ] as const) {
      const raw = mintApiKeyToken();
      const hash = await hmacSha256Hex(PEPPER, raw);
      const fp = fingerprint(raw);
      await store.mintApiKey({ id, keyHash: hash, keyPrefix: fp.prefix, lastFour: fp.lastFour, userId, label: null, createdBy: "root", createdAt: T0 });
    }
    assert.equal((await store.listKeys()).length, 2);
  });
});

// ── audit events ─────────────────────────────────────────────────────────────────────

test("recordEvent/listEvents: append-only, filterable by event, actorUserId may be null (anonymous denial)", async () => {
  await withStore(async (store) => {
    await store.recordEvent("u-1", "key_minted", JSON.stringify({ key_id: "k-1" }));
    await store.recordEvent(null, "access_denied", JSON.stringify({ path: "/v0/whoami" }));

    const all = await store.listEvents();
    assert.equal(all.length, 2);
    const denied = await store.listEvents({ event: "access_denied" });
    assert.equal(denied.length, 1);
    assert.equal(denied[0]!.actorUserId, null);
  });
});
