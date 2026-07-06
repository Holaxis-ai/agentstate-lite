/**
 * CLI integration for Stage-2 auth Part B — the `join`/`whoami --remote`/`invite`/
 * `member`/`key` commands (`../src/commands/{join,whoami,invite,member,key}.ts`,
 * `../src/auth-client.ts`) against the ENDPOINT CONTRACT Part A shipped
 * (`packages/worker/src/auth-routes.ts`).
 *
 * `packages/worker` is a private, D1/R2-specific deployment package this CLI package must
 * never depend on (see the module doc comments in `auth-client.ts`/`join.ts` etc. — the
 * built CLI bundle stays zero-dep single-file). So, mirroring `remote-auth.test.ts`'s own
 * "mock over globalThis.fetch" style (rather than `remote.test.ts`'s "inject the real
 * router" style, which only works for the bundle-scoped surface `@agentstate-lite/server`
 * ships in-repo), this file implements a MINIMAL in-memory mock of the auth-routes.ts
 * contract: the same request/response JSON shapes and status codes, without D1, hashing,
 * or rate-limiting (those are Part A's own concern and already covered by its own test
 * suite) — just enough fidelity to prove the CLI speaks the wire contract correctly and
 * classifies the server's responses into the right exit codes.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { join } from "../src/commands/join.js";
import { whoami } from "../src/commands/whoami.js";
import { invite } from "../src/commands/invite.js";
import { member } from "../src/commands/member.js";
import { key } from "../src/commands/key.js";
import { toExit } from "../src/errors.js";
import { getApiKeyForOrigin } from "../src/credentials.js";

const REMOTE_URL = "http://auth-test.local";
const ROOT_KEY = "root-bootstrap-secret";
const DEFAULT_BUNDLE = "default";

type Role = "admin" | "writer" | "reader";

interface MockUser {
  id: string;
  display: string | null;
}
interface MockMembership {
  userId: string;
  bundle: string;
  role: Role;
}
interface MockInvite {
  id: string;
  token: string;
  bundle: string;
  role: Role;
  expiresAt: string;
  createdBy: string;
  redeemedBy: string | null;
  redeemedAt: string | null;
  revokedAt: string | null;
  displayHint: string | null;
}
interface MockKey {
  id: string;
  token: string;
  userId: string;
  label: string | null;
  keyPrefix: string;
  lastFour: string;
  createdBy: string;
  createdAt: string;
  revokedAt: string | null;
}

/** Escape a raw secret for use inside a `RegExp` "does this string appear anywhere in stdout" check. */
function escapeForRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
function errorResponse(status: number, code: string, message: string): Response {
  return jsonResponse(status, { error: { code, message } });
}

/**
 * A minimal in-memory stand-in for `MembershipStore` + `auth-routes.ts`'s dispatch —
 * single-bundle ("default"), no hashing/pepper (tokens are compared directly; this file
 * is testing the CLI's wire-contract adherence, not Part A's own credential hygiene,
 * which has its own test suite in packages/worker).
 */
class MockAuthServer {
  users = new Map<string, MockUser>();
  memberships: MockMembership[] = [];
  invites: MockInvite[] = [];
  keys: MockKey[] = [];
  /** Test introspection: the most recently minted raw key token (join or key mint), so a test can assert stdout never contains it. */
  lastMintedToken: string | undefined;

  private mintToken(prefix: string): string {
    const token = `${prefix}_${randomUUID().replace(/-/g, "")}`;
    this.lastMintedToken = token;
    return token;
  }

  private identify(req: Request): { userId: string; method: string } | null {
    const m = /^Bearer\s+(.+)$/i.exec(req.headers.get("authorization") ?? "");
    if (!m) return null;
    const token = m[1]!.trim();
    if (token === ROOT_KEY) return { userId: "root", method: "root" };
    const row = this.keys.find((k) => k.token === token && !k.revokedAt);
    return row ? { userId: row.userId, method: "api-key" } : null;
  }

  private isAdmin(userId: string, bundle: string): boolean {
    if (userId === "root") return true;
    return this.memberships.some((m) => m.userId === userId && m.bundle === bundle && m.role === "admin");
  }
  private isAnyAdmin(userId: string): boolean {
    if (userId === "root") return true;
    return this.memberships.some((m) => m.userId === userId && m.role === "admin");
  }
  private countAdmins(bundle: string): number {
    return this.memberships.filter((m) => m.bundle === bundle && m.role === "admin").length;
  }

  /** Seed an invite directly (bypassing an HTTP call) — the test-setup shortcut most tests use. */
  seedInvite(input: { role: Role; bundle?: string; displayHint?: string | null; expiresInHours?: number }): MockInvite {
    const inv: MockInvite = {
      id: randomUUID(),
      token: this.mintToken("invite"),
      bundle: input.bundle ?? DEFAULT_BUNDLE,
      role: input.role,
      expiresAt: new Date(Date.now() + (input.expiresInHours ?? 24) * 3_600_000).toISOString(),
      createdBy: "root",
      redeemedBy: null,
      redeemedAt: null,
      revokedAt: null,
      displayHint: input.displayHint ?? null,
    };
    this.invites.push(inv);
    return inv;
  }

  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const { pathname } = url;

    if (pathname === "/v0/join" && req.method === "POST") {
      const body = (await req.json().catch(() => ({}))) as { invite_token?: string; display?: string };
      const token = body.invite_token;
      const now = new Date();
      const inv = token
        ? this.invites.find(
            (i) => i.token === token && !i.revokedAt && !i.redeemedAt && new Date(i.expiresAt) > now,
          )
        : undefined;
      if (!inv) {
        return errorResponse(400, "INVITE_INVALID", "invite token is invalid, expired, revoked, or already used");
      }
      const userId = randomUUID();
      inv.redeemedBy = userId;
      inv.redeemedAt = now.toISOString();
      this.users.set(userId, { id: userId, display: body.display ?? inv.displayHint ?? null });
      this.memberships.push({ userId, bundle: inv.bundle, role: inv.role });
      const rawKey = this.mintToken("key");
      this.keys.push({
        id: randomUUID(),
        token: rawKey,
        userId,
        label: null,
        keyPrefix: rawKey.slice(0, 8),
        lastFour: rawKey.slice(-4),
        createdBy: userId,
        createdAt: now.toISOString(),
        revokedAt: null,
      });
      return jsonResponse(201, {
        user_id: userId,
        role: inv.role,
        bundle: inv.bundle,
        api_key: rawKey,
        key_prefix: rawKey.slice(0, 8),
      });
    }

    const identity = this.identify(req);
    if (!identity) return errorResponse(401, "AUTH_REQUIRED", "missing or invalid API key");

    if (pathname === "/v0/whoami" && req.method === "GET") {
      if (identity.userId === "root") {
        return jsonResponse(200, {
          user_id: "root",
          display: "root",
          method: "root",
          memberships: [{ bundle: DEFAULT_BUNDLE, role: "admin" }],
          bootstrap: true,
        });
      }
      const user = this.users.get(identity.userId) ?? null;
      const memberships = this.memberships
        .filter((m) => m.userId === identity.userId)
        .map((m) => ({ bundle: m.bundle, role: m.role }));
      return jsonResponse(200, {
        user_id: identity.userId,
        display: user?.display ?? null,
        method: identity.method,
        memberships,
      });
    }

    if (pathname === "/v0/invites") {
      if (req.method === "POST") {
        if (!this.isAdmin(identity.userId, DEFAULT_BUNDLE)) return errorResponse(403, "FORBIDDEN", "insufficient role");
        const body = (await req.json().catch(() => ({}))) as {
          role?: Role;
          expires_in_hours?: number;
          display_hint?: string;
        };
        if (!body.role) return errorResponse(400, "USAGE", "role is required");
        const inv = this.seedInvite({
          role: body.role,
          expiresInHours: body.expires_in_hours,
          displayHint: body.display_hint ?? null,
        });
        inv.createdBy = identity.userId;
        return jsonResponse(201, {
          invite_id: inv.id,
          token: inv.token,
          expires_at: inv.expiresAt,
          bundle: inv.bundle,
          role: inv.role,
          ...(identity.userId === "root" ? { bootstrap: true } : {}),
        });
      }
      if (req.method === "GET") {
        if (!this.isAdmin(identity.userId, DEFAULT_BUNDLE)) return jsonResponse(200, { count: 0, invites: [] });
        return jsonResponse(200, {
          count: this.invites.length,
          invites: this.invites,
          ...(identity.userId === "root" ? { bootstrap: true } : {}),
        });
      }
    }
    const inviteMatch = /^\/v0\/invites\/([^/]+)$/.exec(pathname);
    if (inviteMatch && req.method === "DELETE") {
      if (!this.isAdmin(identity.userId, DEFAULT_BUNDLE)) return errorResponse(403, "FORBIDDEN", "insufficient role");
      const inv = this.invites.find((i) => i.id === inviteMatch[1]);
      if (!inv) return errorResponse(404, "NOT_FOUND", `no invite '${inviteMatch[1]}'`);
      const changed = !inv.revokedAt;
      if (changed) inv.revokedAt = new Date().toISOString();
      return jsonResponse(200, { invite_id: inv.id, changed, ...(identity.userId === "root" ? { bootstrap: true } : {}) });
    }

    if (pathname === "/v0/members" && req.method === "GET") {
      if (!this.isAdmin(identity.userId, DEFAULT_BUNDLE)) return errorResponse(403, "FORBIDDEN", "insufficient role");
      const members = this.memberships
        .filter((m) => m.bundle === DEFAULT_BUNDLE)
        .map((m) => ({ userId: m.userId, bundle: m.bundle, role: m.role, display: this.users.get(m.userId)?.display ?? null }));
      return jsonResponse(200, { count: members.length, members, ...(identity.userId === "root" ? { bootstrap: true } : {}) });
    }
    const roleMatch = /^\/v0\/members\/([^/]+)\/role$/.exec(pathname);
    if (roleMatch && req.method === "PUT") {
      if (!this.isAdmin(identity.userId, DEFAULT_BUNDLE)) return errorResponse(403, "FORBIDDEN", "insufficient role");
      const userId = roleMatch[1]!;
      const body = (await req.json().catch(() => ({}))) as { role?: Role };
      if (!body.role) return errorResponse(400, "USAGE", "role is required");
      const existing = this.memberships.find((m) => m.userId === userId && m.bundle === DEFAULT_BUNDLE);
      const before = existing?.role ?? null;
      // Mirrors auth-routes.ts's wouldRemoveLastAdmin: root's own actions are never blocked;
      // a non-root admin demoting the LAST real admin of the bundle (possibly themselves) is.
      if (identity.userId !== "root" && before === "admin" && body.role !== "admin" && this.countAdmins(DEFAULT_BUNDLE) <= 1) {
        return errorResponse(409, "LAST_ADMIN", `cannot demote '${userId}' — they are the last admin of '${DEFAULT_BUNDLE}'`);
      }
      const changed = existing?.role !== body.role;
      if (existing) existing.role = body.role;
      else this.memberships.push({ userId, bundle: DEFAULT_BUNDLE, role: body.role });
      return jsonResponse(200, {
        user_id: userId,
        bundle: DEFAULT_BUNDLE,
        role: body.role,
        changed,
        ...(identity.userId === "root" ? { bootstrap: true } : {}),
      });
    }
    const memberMatch = /^\/v0\/members\/([^/]+)$/.exec(pathname);
    if (memberMatch && req.method === "DELETE") {
      if (!this.isAdmin(identity.userId, DEFAULT_BUNDLE)) return errorResponse(403, "FORBIDDEN", "insufficient role");
      const userId = memberMatch[1]!;
      const idx = this.memberships.findIndex((m) => m.userId === userId && m.bundle === DEFAULT_BUNDLE);
      const currentRole = idx >= 0 ? this.memberships[idx]!.role : null;
      if (identity.userId !== "root" && currentRole === "admin" && this.countAdmins(DEFAULT_BUNDLE) <= 1) {
        return errorResponse(409, "LAST_ADMIN", `cannot remove '${userId}' — they are the last admin of '${DEFAULT_BUNDLE}'`);
      }
      const changed = idx >= 0;
      if (idx >= 0) this.memberships.splice(idx, 1);
      let revokedKeys = 0;
      for (const k of this.keys) {
        if (k.userId === userId && !k.revokedAt) {
          k.revokedAt = new Date().toISOString();
          revokedKeys++;
        }
      }
      return jsonResponse(200, {
        user_id: userId,
        bundle: DEFAULT_BUNDLE,
        changed,
        revoked_keys: revokedKeys,
        ...(identity.userId === "root" ? { bootstrap: true } : {}),
      });
    }

    if (pathname === "/v0/keys") {
      if (req.method === "POST") {
        const body = (await req.json().catch(() => ({}))) as { label?: string; new_agent_label?: string };
        let targetUserId = identity.userId;
        if (body.new_agent_label) {
          if (!this.isAnyAdmin(identity.userId)) return errorResponse(403, "FORBIDDEN", "insufficient role");
          targetUserId = randomUUID();
          this.users.set(targetUserId, { id: targetUserId, display: body.new_agent_label });
        } else if (identity.userId === "root") {
          return errorResponse(400, "USAGE", "root cannot self-mint a key");
        }
        const rawKey = this.mintToken("key");
        const rec: MockKey = {
          id: randomUUID(),
          token: rawKey,
          userId: targetUserId,
          label: body.label ?? null,
          keyPrefix: rawKey.slice(0, 8),
          lastFour: rawKey.slice(-4),
          createdBy: identity.userId,
          createdAt: new Date().toISOString(),
          revokedAt: null,
        };
        this.keys.push(rec);
        return jsonResponse(201, {
          id: rec.id,
          user_id: targetUserId,
          api_key: rawKey,
          key_prefix: rec.keyPrefix,
          last_four: rec.lastFour,
          label: rec.label,
          ...(identity.userId === "root" ? { bootstrap: true } : {}),
        });
      }
      if (req.method === "GET") {
        const admin = this.isAnyAdmin(identity.userId);
        const rows = admin ? this.keys : this.keys.filter((k) => k.userId === identity.userId);
        const keys = rows.map((k) => ({
          id: k.id,
          keyPrefix: k.keyPrefix,
          lastFour: k.lastFour,
          userId: k.userId,
          label: k.label,
          createdBy: k.createdBy,
          createdAt: k.createdAt,
          revokedAt: k.revokedAt,
        }));
        return jsonResponse(200, { count: keys.length, keys, ...(admin && identity.userId === "root" ? { bootstrap: true } : {}) });
      }
    }
    const keyMatch = /^\/v0\/keys\/([^/]+)$/.exec(pathname);
    if (keyMatch && req.method === "DELETE") {
      const admin = this.isAnyAdmin(identity.userId);
      const rec = this.keys.find((k) => k.id === keyMatch[1]);
      if (!rec || (!admin && rec.userId !== identity.userId)) return errorResponse(404, "NOT_FOUND", `no key '${keyMatch[1]}'`);
      const changed = !rec.revokedAt;
      if (changed) rec.revokedAt = new Date().toISOString();
      return jsonResponse(200, { id: rec.id, changed });
    }

    return errorResponse(404, "NOT_FOUND", `no route for ${req.method} ${pathname}`);
  }
}

async function withFetch<T>(server: MockAuthServer, run: () => Promise<T>): Promise<T> {
  const original = globalThis.fetch;
  globalThis.fetch = ((req: Request) => server.handle(req)) as typeof fetch;
  try {
    return await run();
  } finally {
    globalThis.fetch = original;
  }
}

async function withHome<T>(home: string, run: () => Promise<T>): Promise<T> {
  const originalHome = process.env.HOME;
  const originalUserProfile = process.env.USERPROFILE;
  process.env.HOME = home;
  process.env.USERPROFILE = home;
  try {
    return await run();
  } finally {
    if (originalHome === undefined) delete process.env.HOME;
    else process.env.HOME = originalHome;
    if (originalUserProfile === undefined) delete process.env.USERPROFILE;
    else process.env.USERPROFILE = originalUserProfile;
  }
}

async function withApiKeyEnv<T>(value: string | undefined, run: () => Promise<T>): Promise<T> {
  const ENV = "AGENTSTATE_LITE_API_KEY";
  const original = process.env[ENV];
  if (value === undefined) delete process.env[ENV];
  else process.env[ENV] = value;
  try {
    return await run();
  } finally {
    if (original === undefined) delete process.env[ENV];
    else process.env[ENV] = original;
  }
}

async function withTempHome<T>(run: (home: string) => Promise<T>): Promise<T> {
  const home = await mkdtemp(path.join(tmpdir(), "agentstate-lite-auth-cli-test-"));
  try {
    return await withHome(home, () => run(home));
  } finally {
    await rm(home, { recursive: true, force: true });
  }
}

/** Run `run`, catch whatever it throws, and push it through `toExit` — exactly what `cli.ts`'s `formatError` does in production. */
async function exitOf(run: () => Promise<void>): Promise<ReturnType<typeof toExit>> {
  try {
    await run();
  } catch (err) {
    return toExit(err);
  }
  throw new Error("expected run() to throw");
}

test("join: an invalid/unknown invite token maps to USAGE, exit 2, no key stored", async () => {
  const server = new MockAuthServer();
  await withTempHome((home) =>
    withFetch(server, async () => {
      const { exitCode, envelope } = await exitOf(() =>
        join(["--remote", REMOTE_URL, "--invite", "totally-bogus-token", "--json"], {}),
      );
      assert.equal(exitCode, 2);
      assert.equal(envelope.error.code, "USAGE");
      assert.match(envelope.error.message, /invite/i);
      const stored = await getApiKeyForOrigin(new URL(REMOTE_URL).origin, home);
      assert.equal(stored, undefined, "no key should be stored on a failed join");
    }),
  );
});

test("join: a valid invite redeems, stores the minted key origin-keyed, and NEVER prints it; whoami --remote then authenticates with the stored key", async () => {
  const server = new MockAuthServer();
  const inv = server.seedInvite({ role: "writer" });

  await withTempHome((home) =>
    withFetch(server, async () => {
      let joinOut = "";
      await join(["--remote", REMOTE_URL, "--invite", inv.token, "--display", "Ada", "--json"], {
        stdout: (s) => (joinOut += s),
      });
      const mintedKey = server.lastMintedToken!;
      assert.ok(mintedKey, "the mock should have minted a key during join");
      assert.doesNotMatch(joinOut, new RegExp(escapeForRegex(mintedKey)));
      assert.doesNotMatch(joinOut, /"api_key"/);

      const parsedJoin = JSON.parse(joinOut) as { joined: boolean; user_id: string; role: string; bundle: string };
      assert.equal(parsedJoin.joined, true);
      assert.equal(parsedJoin.role, "writer");
      assert.equal(parsedJoin.bundle, "default");

      const stored = await getApiKeyForOrigin(new URL(REMOTE_URL).origin, home);
      assert.equal(stored, mintedKey, "join must store the minted key, origin-keyed");

      // A subsequent --remote command with NO env override authenticates purely from the
      // credentials file join just wrote.
      let whoamiOut = "";
      await whoami(["--remote", REMOTE_URL, "--json"], { stdout: (s) => (whoamiOut += s) });
      const parsedWhoami = JSON.parse(whoamiOut) as {
        user_id: string;
        memberships: { bundle: string; role: string }[];
      };
      assert.equal(parsedWhoami.user_id, parsedJoin.user_id);
      assert.deepEqual(parsedWhoami.memberships, [{ bundle: "default", role: "writer" }]);
    }),
  );
});

test("whoami --remote: the root bootstrap identity reports bootstrap:true and an admin membership", async () => {
  const server = new MockAuthServer();
  await withApiKeyEnv(ROOT_KEY, () =>
    withFetch(server, async () => {
      let out = "";
      await whoami(["--remote", REMOTE_URL, "--json"], { stdout: (s) => (out += s) });
      const parsed = JSON.parse(out) as { user_id: string; bootstrap?: boolean };
      assert.equal(parsed.user_id, "root");
      assert.equal(parsed.bootstrap, true);
    }),
  );
});

test("invite create prints the token once with a copy-pastable join hint; invite list/revoke round-trip (idempotent revoke)", async () => {
  const server = new MockAuthServer();
  await withApiKeyEnv(ROOT_KEY, () =>
    withFetch(server, async () => {
      let createOut = "";
      await invite(["create", "--remote", REMOTE_URL, "--role", "reader", "--json"], {
        stdout: (s) => (createOut += s),
      });
      const created = JSON.parse(createOut) as { invite_id: string; token: string; role: string; help: string[] };
      assert.equal(created.role, "reader");
      assert.ok(created.token.length > 0);
      assert.match(created.help[0]!, /join --remote/);
      assert.ok(created.help[0]!.includes(created.token));

      let listOut = "";
      await invite(["list", "--remote", REMOTE_URL, "--json"], { stdout: (s) => (listOut += s) });
      const listed = JSON.parse(listOut) as {
        count: number;
        invites: { id: string; role?: string; status?: string; created_by?: string }[];
      };
      assert.equal(listed.count, 1);
      assert.equal(listed.invites[0]!.id, created.invite_id);
      // Minimal default schema (§2): id/role/status present, the wide record fields opt-in only.
      assert.equal(listed.invites[0]!.status, "pending");
      assert.ok(listed.invites[0]!.role);
      assert.equal(listed.invites[0]!.created_by, undefined, "created_by is --fields-only");

      let revoke1 = "";
      await invite(["revoke", "--remote", REMOTE_URL, created.invite_id, "--json"], { stdout: (s) => (revoke1 += s) });
      assert.equal((JSON.parse(revoke1) as { changed: boolean }).changed, true);

      let revoke2 = "";
      await invite(["revoke", "--remote", REMOTE_URL, created.invite_id, "--json"], { stdout: (s) => (revoke2 += s) });
      assert.equal((JSON.parse(revoke2) as { changed: boolean }).changed, false, "revoking an already-revoked invite is idempotent");
    }),
  );
});

test("member list/set-role/remove round-trip: set-role is idempotent, remove revokes the member's keys", async () => {
  const server = new MockAuthServer();
  const inv = server.seedInvite({ role: "writer" });

  await withTempHome(() =>
    withFetch(server, async () => {
      let joinOut = "";
      await join(["--remote", REMOTE_URL, "--invite", inv.token, "--json"], { stdout: (s) => (joinOut += s) });
      const { user_id: userId } = JSON.parse(joinOut) as { user_id: string };

      await withApiKeyEnv(ROOT_KEY, async () => {
        let listOut = "";
        await member(["list", "--remote", REMOTE_URL, "--json"], { stdout: (s) => (listOut += s) });
        const listed = JSON.parse(listOut) as { members: { userId: string; role: string }[] };
        assert.ok(listed.members.some((m) => m.userId === userId && m.role === "writer"));

        let setRole1 = "";
        await member(["set-role", "--remote", REMOTE_URL, userId, "admin", "--json"], { stdout: (s) => (setRole1 += s) });
        assert.equal((JSON.parse(setRole1) as { changed: boolean; role: string }).changed, true);

        let setRole2 = "";
        await member(["set-role", "--remote", REMOTE_URL, userId, "admin", "--json"], { stdout: (s) => (setRole2 += s) });
        assert.equal((JSON.parse(setRole2) as { changed: boolean }).changed, false, "re-setting the same role is idempotent");

        let remove1 = "";
        await member(["remove", "--remote", REMOTE_URL, userId, "--json"], { stdout: (s) => (remove1 += s) });
        const removed1 = JSON.parse(remove1) as { changed: boolean; revoked_keys: number };
        assert.equal(removed1.changed, true);
        assert.equal(removed1.revoked_keys, 1, "the key minted at join should be revoked");

        let remove2 = "";
        await member(["remove", "--remote", REMOTE_URL, userId, "--json"], { stdout: (s) => (remove2 += s) });
        const removed2 = JSON.parse(remove2) as { changed: boolean; revoked_keys: number };
        assert.equal(removed2.changed, false, "removing an absent membership is idempotent");
        assert.equal(removed2.revoked_keys, 0);
      });
    }),
  );
});

test("key mint (self + admin-minted agent) never leaks the secret outside the mint receipt; key list shows only prefix/last_four; key revoke is idempotent and a revoked key can no longer authenticate", async () => {
  const server = new MockAuthServer();
  let agentKeyId = "";
  let agentApiKey = "";

  await withApiKeyEnv(ROOT_KEY, () =>
    withFetch(server, async () => {
      // Admin (root) mints a brand-new agent's first key.
      let mintOut = "";
      await key(["mint", "--remote", REMOTE_URL, "--agent", "ci-bot", "--label", "ci", "--json"], {
        stdout: (s) => (mintOut += s),
      });
      const minted = JSON.parse(mintOut) as { id: string; user_id: string; api_key: string; label: string };
      assert.ok(minted.api_key.length > 0, "the mint receipt is the ONE deliberate place the secret is printed");
      assert.equal(minted.label, "ci");
      assert.notEqual(minted.user_id, "root", "an agent mint creates a brand-new user, never root itself");
      agentKeyId = minted.id;
      agentApiKey = minted.api_key;

      let listOut = "";
      await key(["list", "--remote", REMOTE_URL, "--json"], { stdout: (s) => (listOut += s) });
      assert.doesNotMatch(listOut, new RegExp(escapeForRegex(minted.api_key)));
      const listed = JSON.parse(listOut) as {
        keys: { id: string; key_prefix: string; label?: string; status?: string; user_id?: string }[];
      };
      const row = listed.keys.find((k) => k.id === minted.id);
      assert.ok(row);
      assert.equal(row!.key_prefix, minted.api_key.slice(0, 8));
      // Minimal default schema (§2): status is present, the wide record fields are NOT.
      assert.equal(row!.status, "active");
      assert.equal(row!.user_id, undefined, "user_id is opt-in via --fields, not in the default row");

      // The --fields all hatch brings the full record back (never the secret).
      let fullOut = "";
      await key(["list", "--fields", "all", "--remote", REMOTE_URL, "--json"], { stdout: (s) => (fullOut += s) });
      assert.doesNotMatch(fullOut, new RegExp(escapeForRegex(minted.api_key)));
      const full = JSON.parse(fullOut) as { keys: { id: string; user_id?: string }[] };
      const fullRow = full.keys.find((k) => k.id === minted.id);
      assert.ok(fullRow?.user_id, "user_id appears under --fields all");
    }),
  );

  // The agent SELF-mints a second key for itself — no admin role required — using ITS OWN
  // key as the bearer credential. The fresh secret appears in THIS receipt only, and never
  // in a later admin `key list` (which shows prefix/last_four exclusively).
  let selfMintedApiKey = "";
  await withApiKeyEnv(agentApiKey, () =>
    withFetch(server, async () => {
      let selfMintOut = "";
      await key(["mint", "--remote", REMOTE_URL, "--label", "self", "--json"], { stdout: (s) => (selfMintOut += s) });
      const selfMinted = JSON.parse(selfMintOut) as { user_id: string; api_key: string; label: string };
      assert.equal(selfMinted.label, "self");
      assert.notEqual(selfMinted.api_key, agentApiKey, "self-mint issues a FRESH key, not a copy of the caller's own");
      selfMintedApiKey = selfMinted.api_key;
    }),
  );

  await withApiKeyEnv(ROOT_KEY, () =>
    withFetch(server, async () => {
      let listOut = "";
      await key(["list", "--remote", REMOTE_URL, "--json"], { stdout: (s) => (listOut += s) });
      assert.doesNotMatch(listOut, new RegExp(escapeForRegex(selfMintedApiKey)), "a self-minted secret must never resurface in an admin key list either");

      let revoke1 = "";
      await key(["revoke", "--remote", REMOTE_URL, agentKeyId, "--json"], { stdout: (s) => (revoke1 += s) });
      assert.equal((JSON.parse(revoke1) as { changed: boolean }).changed, true);
      let revoke2 = "";
      await key(["revoke", "--remote", REMOTE_URL, agentKeyId, "--json"], { stdout: (s) => (revoke2 += s) });
      assert.equal((JSON.parse(revoke2) as { changed: boolean }).changed, false, "revoking an already-revoked key is idempotent");
    }),
  );

  // The revoked key can no longer authenticate at all: exit 4, AUTH_REQUIRED.
  await withApiKeyEnv(agentApiKey, () =>
    withFetch(server, async () => {
      const { exitCode, envelope } = await exitOf(() => member(["list", "--remote", REMOTE_URL, "--json"], {}));
      assert.equal(exitCode, 4);
      assert.equal(envelope.error.code, "AUTH_REQUIRED");
    }),
  );
});

test("invite create --role rejects an invalid role client-side, exit 2, before any network call", async () => {
  const server = new MockAuthServer();
  await withFetch(server, async () => {
    const { exitCode, envelope } = await exitOf(() =>
      invite(["create", "--remote", REMOTE_URL, "--role", "superuser", "--json"], {}),
    );
    assert.equal(exitCode, 2);
    assert.equal(envelope.error.code, "USAGE");
  });
});

test("a non-admin caller is refused an admin-only route (member list): exit 2 (USAGE's exit code), but the code is preserved as FORBIDDEN, not collapsed to a generic USAGE", async () => {
  const server = new MockAuthServer();
  const inv = server.seedInvite({ role: "reader" });
  await withTempHome(() =>
    withFetch(server, async () => {
      await join(["--remote", REMOTE_URL, "--invite", inv.token, "--json"], { stdout: () => {} });
      const stored = await getApiKeyForOrigin(new URL(REMOTE_URL).origin);
      assert.ok(stored);

      const { exitCode, envelope } = await exitOf(() => member(["list", "--remote", REMOTE_URL, "--json"], {}));
      assert.equal(exitCode, 2, "exit 4 (AUTH) would mislead — re-authenticating grants no additional role");
      assert.equal(envelope.error.code, "FORBIDDEN", "the wire's 403 FORBIDDEN code must survive, not collapse into a generic USAGE");
    }),
  );
});

test("member set-role: demoting the LAST admin of the bundle is rejected with LAST_ADMIN, exit 5 (CONFLICT)", async () => {
  const server = new MockAuthServer();
  const inv = server.seedInvite({ role: "admin" });

  await withTempHome(() =>
    withFetch(server, async () => {
      let joinOut = "";
      await join(["--remote", REMOTE_URL, "--invite", inv.token, "--json"], { stdout: (s) => (joinOut += s) });
      const { user_id: adminUserId } = JSON.parse(joinOut) as { user_id: string };
      // The joined user is the ONLY admin of "default" — this key demotes/removes ITSELF below,
      // exactly the self-service case the last-admin guard exists to catch (root would be exempt,
      // but this caller authenticates as the admin user, not root).

      const { exitCode, envelope } = await exitOf(() =>
        member(["set-role", "--remote", REMOTE_URL, adminUserId, "writer", "--json"], {}),
      );
      assert.equal(exitCode, 5);
      assert.equal(envelope.error.code, "LAST_ADMIN");
    }),
  );
});

test("member remove: removing the LAST admin of the bundle is rejected with LAST_ADMIN, exit 5 (CONFLICT)", async () => {
  const server = new MockAuthServer();
  const inv = server.seedInvite({ role: "admin" });

  await withTempHome(() =>
    withFetch(server, async () => {
      let joinOut = "";
      await join(["--remote", REMOTE_URL, "--invite", inv.token, "--json"], { stdout: (s) => (joinOut += s) });
      const { user_id: adminUserId } = JSON.parse(joinOut) as { user_id: string };

      const { exitCode, envelope } = await exitOf(() => member(["remove", "--remote", REMOTE_URL, adminUserId, "--json"], {}));
      assert.equal(exitCode, 5);
      assert.equal(envelope.error.code, "LAST_ADMIN");
    }),
  );
});

test("invite revoke on an absent invite_id: exit 6 (NOT_FOUND), not the previous generic USAGE/exit 2", async () => {
  const server = new MockAuthServer();
  await withApiKeyEnv(ROOT_KEY, () =>
    withFetch(server, async () => {
      const { exitCode, envelope } = await exitOf(() =>
        invite(["revoke", "--remote", REMOTE_URL, "does-not-exist", "--json"], {}),
      );
      assert.equal(exitCode, 6);
      assert.equal(envelope.error.code, "NOT_FOUND");
    }),
  );
});
