/**
 * Quad-backend parity: {@link D1R2Backend} must return results IDENTICAL to
 * `FilesystemBackend`/`MemoryBackend` for the same engine operations, with
 * BYTE-IDENTICAL content-addressed version tokens — the same invariant
 * `packages/core/test/dual-backend.test.ts`'s `scenario()` fixture proves for the other
 * two adapters (and `wire-protocol.test.ts` proves for `RemoteBackend`). The scenario
 * below is a reduced DUPLICATE of that fixture's shape (test BODY duplication, per the
 * unit's plan — not a second copy of engine logic: every operation below calls core's
 * OWN `writeDoc`/`query`/`readDoc`/`backlinks`/`freshness`/`writeDocVersioned`,
 * exactly as `dual-backend.test.ts` does).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  writeDoc,
  writeDocVersioned,
  query,
  list,
  readDoc,
  deleteDoc,
  backlinks,
  freshness,
  FilesystemBackend,
  MemoryBackend,
  RemoteBackend,
  VersionConflict,
} from "@agentstate-lite/core";
import type { Bundle } from "@agentstate-lite/core";
import { createRouterForBackend } from "@agentstate-lite/server";

import { D1R2Backend } from "../src/d1r2-backend.js";
import { createTestEnv } from "./env.js";

const T_DOC = "2026-06-01T09:00:00.000Z";
const T_NOTE = "2026-06-15T12:00:00.000Z";
const NOW = new Date("2026-07-01T12:00:00.000Z");
const NOTE_ID = "context-notes/agentstate-lite/claude-orchestrator/cycle-quad";

/** Reduced duplicate of `packages/core/test/scenario.ts`, run against a given bundle. */
async function scenario(bundle: Bundle): Promise<unknown> {
  await writeDoc(bundle, {
    id: "concepts/alpha",
    frontmatter: { type: "Concept", title: "Alpha", timestamp: T_DOC },
    body: "Alpha body. See [Beta](beta.md).",
  });
  await writeDoc(bundle, {
    id: "concepts/beta",
    frontmatter: { type: "Concept", title: "Beta", timestamp: T_DOC },
    body: "Beta body.",
  });
  await writeDoc(bundle, {
    id: "tables/users",
    frontmatter: { type: "BigQuery Table", title: "Users", timestamp: T_DOC },
    body: "A table. Related: [Alpha](../concepts/alpha.md).",
  });

  await writeDoc(bundle, {
    id: NOTE_ID,
    frontmatter: {
      type: "Context Note",
      title: "cycle-quad",
      timestamp: T_NOTE,
      tags: ["claude-orchestrator", "agentstate-lite", "cycle-quad"],
    },
    body: "# Summary\n\nProving the seam over D1R2Backend too.\n\nSee [Alpha](/concepts/alpha.md).",
  });

  const all = await query(bundle);
  const concepts = await list(bundle, { type: "Concept" });
  const alpha = await readDoc(bundle, "concepts/alpha");
  const betaBacklinks = await backlinks(bundle, "concepts/beta");
  const alphaBacklinks = await backlinks(bundle, "concepts/alpha");
  const noteDoc = await readDoc(bundle, NOTE_ID);
  const noteFreshness = freshness(noteDoc, { now: NOW });

  return {
    queryIds: all.map((d) => ({ id: d.id, type: d.frontmatter.type, ts: d.frontmatter.timestamp })),
    conceptIds: concepts.map((d) => d.id),
    alpha: { id: alpha.id, frontmatter: alpha.frontmatter, body: alpha.body.replace(/\s+$/, "") },
    betaBacklinks,
    alphaBacklinks,
    note: { id: noteDoc.id, frontmatter: noteDoc.frontmatter, body: noteDoc.body.replace(/\s+$/, "") },
    freshness: noteFreshness.verdict,
  };
}

test("D1R2Backend: core operations return results identical to FilesystemBackend and MemoryBackend", async () => {
  const fsRoot = await mkdtemp(path.join(tmpdir(), "okf-d1r2-parity-fs-"));
  const env = await createTestEnv();
  try {
    const fsResult = await scenario({ root: fsRoot, backend: new FilesystemBackend(fsRoot) });
    const memResult = await scenario({ root: "mem://parity", backend: new MemoryBackend() });
    const d1r2Result = await scenario({ root: "d1r2://parity", backend: new D1R2Backend(env.db, env.bucket) });

    assert.deepEqual(memResult, fsResult);
    assert.deepEqual(d1r2Result, fsResult, "D1R2Backend must return results identical to FilesystemBackend");

    const r = fsResult as { conceptIds: string[]; betaBacklinks: string[]; alphaBacklinks: string[]; freshness: string };
    assert.deepEqual(r.conceptIds, ["concepts/alpha", "concepts/beta"]);
    assert.deepEqual(r.betaBacklinks, ["concepts/alpha"]);
    assert.deepEqual(r.alphaBacklinks, [NOTE_ID, "tables/users"]);
    assert.equal(r.freshness, "fresh");
  } finally {
    await rm(fsRoot, { recursive: true, force: true });
    await env.dispose();
  }
});

test("D1R2Backend produces BYTE-IDENTICAL content-addressed version tokens to FilesystemBackend/MemoryBackend for the same document", async () => {
  const fsRoot = await mkdtemp(path.join(tmpdir(), "okf-d1r2-parity-fs2-"));
  const env = await createTestEnv();
  try {
    const doc = {
      id: "concepts/v",
      frontmatter: { type: "Concept", title: "V", timestamp: T_DOC },
      body: "identical body",
    };

    const fsWritten = await writeDocVersioned({ root: fsRoot, backend: new FilesystemBackend(fsRoot) }, doc);
    const memWritten = await writeDocVersioned({ root: "mem://v", backend: new MemoryBackend() }, doc);
    const d1r2Written = await writeDocVersioned({ root: "d1r2://v", backend: new D1R2Backend(env.db, env.bucket) }, doc);

    assert.equal(memWritten.version, fsWritten.version);
    assert.equal(d1r2Written.version, fsWritten.version, "D1R2Backend must compute the SAME content-addressed version as FilesystemBackend");
    assert.match(fsWritten.version, /^sha256:[0-9a-f]{64}$/);
  } finally {
    await rm(fsRoot, { recursive: true, force: true });
    await env.dispose();
  }
});

test("PARITY holds with agent attribution: supplying WriteOptions.agent does NOT perturb the content-addressed version token — byte-identical across Filesystem/Memory/RemoteBackend/D1R2Backend, with and without an agent", async () => {
  const fsRootNoAgent = await mkdtemp(path.join(tmpdir(), "okf-d1r2-parity-agent-fs-a-"));
  const fsRootAgent = await mkdtemp(path.join(tmpdir(), "okf-d1r2-parity-agent-fs-b-"));
  const env = await createTestEnv();
  try {
    const doc = {
      id: "concepts/agent-parity",
      frontmatter: { type: "Concept", title: "Agent Parity", timestamp: T_DOC },
      body: "identical body regardless of agent",
    };

    const remoteServerBackend = new MemoryBackend();
    const remoteRouter = createRouterForBackend(remoteServerBackend);
    const remote = new RemoteBackend({ baseUrl: "http://parity.local", bundle: "test", fetchImpl: remoteRouter });

    // No agent supplied at all.
    const fsNoAgent = await writeDocVersioned({ root: fsRootNoAgent, backend: new FilesystemBackend(fsRootNoAgent) }, doc);
    const memNoAgent = await writeDocVersioned({ root: "mem://parity-agent-a", backend: new MemoryBackend() }, doc);
    const remoteNoAgent = await writeDocVersioned({ root: "remote://parity-agent-a", backend: remote }, doc);
    const d1r2NoAgent = await writeDocVersioned({ root: "d1r2://parity-agent-a", backend: new D1R2Backend(env.db, env.bucket) }, doc);

    assert.equal(memNoAgent.version, fsNoAgent.version);
    assert.equal(remoteNoAgent.version, fsNoAgent.version);
    assert.equal(d1r2NoAgent.version, fsNoAgent.version);
    assert.match(fsNoAgent.version, /^sha256:[0-9a-f]{64}$/);

    // WITH an agent supplied — the same content, a different WriteOptions.agent.
    const fsAgent = await writeDocVersioned(
      { root: fsRootAgent, backend: new FilesystemBackend(fsRootAgent) },
      doc,
      { agent: "collab-3" },
    );
    const memAgent = await writeDocVersioned({ root: "mem://parity-agent-b", backend: new MemoryBackend() }, doc, {
      agent: "collab-3",
    });
    const remoteAgent = await writeDocVersioned({ root: "remote://parity-agent-b", backend: remote }, { ...doc, id: "concepts/agent-parity-2" }, {
      agent: "collab-3",
    });
    const d1r2Agent = await writeDocVersioned(
      { root: "d1r2://parity-agent-b", backend: new D1R2Backend(env.db, env.bucket) },
      { ...doc, id: "concepts/agent-parity-3" },
      { agent: "collab-3" },
    );

    // Same content -> same token, regardless of agent, and identical to the no-agent case.
    assert.equal(fsAgent.version, fsNoAgent.version, "supplying agent must not perturb the content-addressed version token");
    assert.equal(memAgent.version, fsNoAgent.version);
    assert.equal(remoteAgent.version, fsNoAgent.version);
    assert.equal(d1r2Agent.version, fsNoAgent.version);
    assert.match(fsAgent.version, /^sha256:[0-9a-f]{64}$/);
  } finally {
    await rm(fsRootNoAgent, { recursive: true, force: true });
    await rm(fsRootAgent, { recursive: true, force: true });
    await env.dispose();
  }
});

// ── delete parity (DELETE-operation pass): identical true/false results + versions()->[] ──

test("delete: identical true/false results across FilesystemBackend, MemoryBackend, and D1R2Backend for present + absent + re-delete", async () => {
  const fsRoot = await mkdtemp(path.join(tmpdir(), "okf-d1r2-parity-delete-fs-"));
  const env = await createTestEnv();
  try {
    const backends: Bundle[] = [
      { root: fsRoot, backend: new FilesystemBackend(fsRoot) },
      { root: "mem://parity-delete", backend: new MemoryBackend() },
      { root: "d1r2://parity-delete", backend: new D1R2Backend(env.db, env.bucket) },
    ];
    const results: unknown[] = [];
    for (const bundle of backends) {
      await writeDoc(bundle, { id: "concepts/gone", frontmatter: { type: "Concept", title: "Gone", timestamp: T_DOC }, body: "x" });
      const present = await deleteDoc(bundle, "concepts/gone");
      const stillExists = await bundle.backend!.exists("concepts/gone");
      const reDelete = await deleteDoc(bundle, "concepts/gone");
      const neverWritten = await deleteDoc(bundle, "concepts/never-written");
      const versionsAfter = await bundle.backend!.versions("concepts/gone");
      results.push({ present, stillExists, reDelete, neverWritten, versionsAfter });
    }
    assert.deepEqual(results[0], { present: true, stillExists: false, reDelete: false, neverWritten: false, versionsAfter: [] });
    assert.deepEqual(results[1], results[0]);
    assert.deepEqual(results[2], results[0], "D1R2Backend must return results identical to FilesystemBackend/MemoryBackend");
  } finally {
    await rm(fsRoot, { recursive: true, force: true });
    await env.dispose();
  }
});

test("D1R2Backend blob version token is byte-identical to core's blobVersion primitive (same content-addressing, no new hash path)", async () => {
  const env = await createTestEnv();
  try {
    const { blobVersion } = await import("@agentstate-lite/core");
    const bytes = new Uint8Array([0, 1, 2, 3, 254, 255]);
    const backend = new D1R2Backend(env.db, env.bucket);
    const version = await backend.writeBlob("x.bin", bytes);
    assert.equal(version, blobVersion(bytes));
  } finally {
    await env.dispose();
  }
});

// ── F1 regression: a CAS write of byte-identical content must be a TRUE no-op ──────────
//
// Found in review: a CAS write whose new content hashes to the SAME value as the caller's
// `expectedVersion` (a redundant "re-assert the current state" write) was growing
// `doc_history` by one revision instead of true-no-op'ing, unlike `MemoryBackend`'s
// content-address short-circuit. Fixed in `write()`/`writeBlob()` by checking
// `version === options.expectedVersion` BEFORE attempting any write. These tests pin the
// fix by running the IDENTICAL operation sequence against both adapters and asserting
// their observable state (history length for docs; version + bytes for blobs, which carry
// no `versions()` on the seam) stays IDENTICAL.

test("F1 regression (docs): a CAS write of byte-identical content is a true no-op — versions().length is IDENTICAL across D1R2Backend and MemoryBackend", async () => {
  const env = await createTestEnv();
  try {
    const doc = { id: "concepts/f1", frontmatter: { type: "Concept", title: "F1", timestamp: T_DOC }, body: "stable body" };
    const mem = new MemoryBackend();
    const d1r2 = new D1R2Backend(env.db, env.bucket);

    const memV1 = await mem.write("concepts/f1", doc);
    const d1r2V1 = await d1r2.write("concepts/f1", doc);
    assert.equal(d1r2V1, memV1);

    // Redundant CAS write of IDENTICAL content against the current version — a true no-op.
    const memV2 = await mem.write("concepts/f1", doc, { expectedVersion: memV1 });
    const d1r2V2 = await d1r2.write("concepts/f1", doc, { expectedVersion: d1r2V1 });
    assert.equal(memV2, memV1);
    assert.equal(d1r2V2, d1r2V1);

    const memHistory = await mem.versions("concepts/f1");
    const d1r2History = await d1r2.versions("concepts/f1");
    assert.equal(memHistory.length, 1);
    assert.equal(d1r2History.length, memHistory.length, "D1R2Backend must not grow history on a redundant identical-content CAS write");
  } finally {
    await env.dispose();
  }
});

test("F1 regression (blobs): a CAS write of byte-identical bytes is a true no-op — same version + content across D1R2Backend and MemoryBackend", async () => {
  const env = await createTestEnv();
  try {
    const bytes = new TextEncoder().encode("stable blob content");
    const mem = new MemoryBackend();
    const d1r2 = new D1R2Backend(env.db, env.bucket);

    const memV1 = await mem.writeBlob("art/f1.bin", bytes);
    const d1r2V1 = await d1r2.writeBlob("art/f1.bin", bytes);
    assert.equal(d1r2V1, memV1);

    // Redundant CAS write of IDENTICAL bytes against the current version — a true no-op on both.
    const memV2 = await mem.writeBlob("art/f1.bin", bytes, undefined, { expectedVersion: memV1 });
    const d1r2V2 = await d1r2.writeBlob("art/f1.bin", bytes, undefined, { expectedVersion: d1r2V1 });
    assert.equal(memV2, memV1);
    assert.equal(d1r2V2, d1r2V1);

    const memRead = await mem.readBlob("art/f1.bin");
    const d1r2Read = await d1r2.readBlob("art/f1.bin");
    assert.equal(d1r2Read!.version, memRead!.version);
    assert.deepEqual(d1r2Read!.bytes, memRead!.bytes);
  } finally {
    await env.dispose();
  }
});

// ── JC1: blob CAS no-op requires BYTES *and* content-type unchanged, not bytes alone ──
//
// Review finding: the original F1 fix for blobs short-circuited on the bytes-derived
// version alone, silently dropping a content-type-only change made via CAS with
// `expectedVersion` equal to the CURRENT bytes-version. `MemoryBackend.writeBlob`'s own
// idempotency check requires BOTH `version` and `contentType` unchanged before treating a
// write as a no-op — a content-type-only change is a REAL update it applies. These two
// tests pin both halves of that contract against `MemoryBackend`.

test("JC1 case 1 (blobs): CAS re-write with SAME bytes AND SAME content-type is a true no-op on both adapters", async () => {
  const env = await createTestEnv();
  try {
    const bytes = new TextEncoder().encode("<h1>hi</h1>");
    const mem = new MemoryBackend();
    const d1r2 = new D1R2Backend(env.db, env.bucket);

    const memV1 = await mem.writeBlob("jc1/case1.html", bytes, "text/html");
    const d1r2V1 = await d1r2.writeBlob("jc1/case1.html", bytes, "text/html");
    assert.equal(d1r2V1, memV1);

    // Redundant CAS write: SAME bytes, SAME explicit content-type, expectedVersion == current.
    const memV2 = await mem.writeBlob("jc1/case1.html", bytes, "text/html", { expectedVersion: memV1 });
    const d1r2V2 = await d1r2.writeBlob("jc1/case1.html", bytes, "text/html", { expectedVersion: d1r2V1 });
    assert.equal(memV2, memV1, "MemoryBackend: true no-op, version unchanged");
    assert.equal(d1r2V2, d1r2V1, "D1R2Backend: true no-op, version unchanged");

    const memRead = await mem.readBlob("jc1/case1.html");
    const d1r2Read = await d1r2.readBlob("jc1/case1.html");
    assert.equal(d1r2Read!.contentType, memRead!.contentType);
    assert.equal(d1r2Read!.contentType, "text/html");
  } finally {
    await env.dispose();
  }
});

test("JC1 case 2 (blobs): CAS write with SAME bytes but DIFFERENT content-type is APPLIED (not silently dropped) on both adapters", async () => {
  const env = await createTestEnv();
  try {
    const bytes = new TextEncoder().encode("<h1>hi</h1>");
    const mem = new MemoryBackend();
    const d1r2 = new D1R2Backend(env.db, env.bucket);

    const memV1 = await mem.writeBlob("jc1/case2.html", bytes, "text/html");
    const d1r2V1 = await d1r2.writeBlob("jc1/case2.html", bytes, "text/html");
    assert.equal(d1r2V1, memV1);

    // SAME bytes (so the version token cannot change — it is bytes-derived), but a
    // DIFFERENT content-type, via CAS against the CURRENT (bytes-derived) version.
    const memV2 = await mem.writeBlob("jc1/case2.html", bytes, "application/octet-stream", { expectedVersion: memV1 });
    const d1r2V2 = await d1r2.writeBlob("jc1/case2.html", bytes, "application/octet-stream", { expectedVersion: d1r2V1 });

    // The version token is unchanged on BOTH (bytes didn't change) ...
    assert.equal(memV2, memV1);
    assert.equal(d1r2V2, d1r2V1);

    // ... but the content-type change was APPLIED on both — not silently dropped.
    const memRead = await mem.readBlob("jc1/case2.html");
    const d1r2Read = await d1r2.readBlob("jc1/case2.html");
    assert.equal(memRead!.contentType, "application/octet-stream", "MemoryBackend must apply a content-type-only change");
    assert.equal(d1r2Read!.contentType, "application/octet-stream", "D1R2Backend must apply a content-type-only change (JC1 fix)");
    assert.equal(d1r2Read!.contentType, memRead!.contentType);
  } finally {
    await env.dispose();
  }
});

// ── PARITY regression: expect-absent re-create of BYTE-IDENTICAL content ────────────────
//
// A second `expectedVersion: null` (expect-absent create) write of the SAME content to an
// already-created-once doc must be a typed `VersionConflict` on EVERY backend — the wire's
// 412 that the CLI classifies as ALREADY_EXISTS (exit 5). D1R2Backend's expect-absent path
// appends `doc_history` via `SELECT … WHERE EXISTS (doc_heads WHERE id=? AND version=? AND
// seq=1)` — a guard that ALSO matches a PRE-EXISTING head left by a prior byte-identical
// create (same content ⇒ same version token, seq still 1). It therefore fired the append even
// though the head INSERT lost, colliding with the existing doc_history(id, seq) PK and raising
// a RAW D1 constraint error (enveloped as an opaque 400 USAGE) instead of the typed conflict
// the other three backends give. Different-content re-creates never hit this (the guard's
// `version=?` misses), which is why the pre-existing expect-absent test (contract.test.ts,
// `body: "two"`) did not catch it. This pins the byte-identical case at parity with MemoryBackend.
test("PARITY (expect-absent re-create, BYTE-IDENTICAL): a 2nd expectedVersion:null write of the SAME content to a created-once doc throws VersionConflict on BOTH D1R2Backend and MemoryBackend — never a raw doc_history(id,seq) PK error", async () => {
  const env = await createTestEnv();
  try {
    const doc = { id: "concepts/dup", frontmatter: { type: "Concept", title: "Dup", timestamp: T_DOC }, body: "identical body" };
    const mem = new MemoryBackend();
    const d1r2 = new D1R2Backend(env.db, env.bucket);

    // First expect-absent create wins on both, with byte-identical version tokens.
    const memV1 = await mem.write("concepts/dup", doc, { expectedVersion: null });
    const d1r2V1 = await d1r2.write("concepts/dup", doc, { expectedVersion: null });
    assert.equal(d1r2V1, memV1);

    // A SECOND expect-absent create of BYTE-IDENTICAL content (same version token, head still at
    // seq=1) must be a typed VersionConflict on BOTH — not a raw constraint error on D1R2.
    await assert.rejects(
      () => mem.write("concepts/dup", doc, { expectedVersion: null }),
      (err: unknown) => err instanceof VersionConflict && (err as InstanceType<typeof VersionConflict>).actual === memV1,
    );
    await assert.rejects(
      () => d1r2.write("concepts/dup", doc, { expectedVersion: null }),
      (err: unknown) => err instanceof VersionConflict && (err as InstanceType<typeof VersionConflict>).actual === d1r2V1,
    );

    // The losing re-create left history untouched — exactly the one creating revision on both.
    assert.equal((await mem.versions("concepts/dup")).length, 1);
    assert.equal((await d1r2.versions("concepts/dup")).length, 1, "D1R2Backend must not grow (or corrupt) history on a losing byte-identical expect-absent re-create");
  } finally {
    await env.dispose();
  }
});
