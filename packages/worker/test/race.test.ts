/**
 * Concurrency invariant tests for {@link D1R2Backend}: N concurrent compare-and-swap
 * writers racing the SAME `expectedVersion` (docs and blobs), and N concurrent
 * expect-absent creates targeting the SAME id, must each produce EXACTLY one winner and
 * N-1 typed `VersionConflict`s — never a silent lost update (every writer reporting
 * success) and never a spurious double-winner.
 *
 * The concurrency mechanism is a single atomic D1 statement per attempt (a conditional
 * `UPDATE ... WHERE id = ? AND version = ?`, or a create-only `INSERT` relying on the
 * PRIMARY KEY's UNIQUE constraint) — see `d1r2-backend.ts`'s module doc comment. D1
 * executes each prepared statement as one atomic unit against the database, so this
 * should hold even under genuine concurrency, not just because Node's event loop
 * interleaves promises.
 *
 * HONEST CAVEAT (see the Part A report): this exercises Wrangler's LOCAL D1 simulation
 * (`getPlatformProxy`, backed by workerd + SQLite), reached over one `d1r2Backend`'s worth
 * of parallel promises from a single Node process. It proves the CAS invariant holds
 * against this local simulator's actual concurrency behavior (whatever it turns out to
 * be — serialized per statement, or genuinely interleaved); it does NOT by itself prove
 * production Cloudflare D1's cross-colo/cross-request concurrency behaves identically.
 * The invariant under test is the one the seam's contract actually requires (exactly one
 * winner, no silent loss) — same shape as `dual-backend.test.ts`'s
 * `FilesystemBackend`/`MemoryBackend` race tests.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { VersionConflict } from "@agentstate-lite/core";
import type { OkfDocument, Version } from "@agentstate-lite/core";

import { D1R2Backend } from "../src/d1r2-backend.js";
import { createTestEnv } from "./env.js";

const T_DOC = "2026-06-01T09:00:00.000Z";

async function withBackend(fn: (backend: D1R2Backend) => Promise<void>): Promise<void> {
  const env = await createTestEnv();
  try {
    await fn(new D1R2Backend(env.db, env.bucket));
  } finally {
    await env.dispose();
  }
}

test("N=10 concurrent CAS doc writers racing one expectedVersion: exactly 1 winner + 9 VersionConflict", async () => {
  await withBackend(async (backend) => {
    const base: OkfDocument = { id: "hot/cas", frontmatter: { type: "T", timestamp: T_DOC }, body: "base" };
    const baseVersion = await backend.write("hot/cas", base);

    const N = 10;
    const results = await Promise.allSettled(
      Array.from({ length: N }, (_, i) => backend.write("hot/cas", { ...base, body: `v${i}` }, { expectedVersion: baseVersion })),
    );

    const fulfilled = results.filter((r): r is PromiseFulfilledResult<Version> => r.status === "fulfilled");
    const rejected = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
    assert.equal(fulfilled.length, 1, "exactly one CAS write racing the same expectedVersion must win");
    assert.equal(rejected.length, N - 1, "every other racer must observe a genuine conflict, not silent loss");
    for (const r of rejected) {
      assert.ok(r.reason instanceof VersionConflict, `expected a VersionConflict, got ${String(r.reason)}`);
      assert.equal(r.reason.expected, baseVersion);
    }

    // The stored doc reflects EXACTLY the winner's write, and history recorded exactly 2
    // revisions (base + the one winner) — not a torn/duplicated state.
    const final = await backend.read("hot/cas");
    assert.equal(final.version, fulfilled[0]!.value);
    assert.equal((await backend.versions("hot/cas")).length, 2);
  });
});

test("N=10 concurrent expect-absent CREATEs targeting the SAME id: exactly 1 winner + 9 VersionConflict(expected: null)", async () => {
  await withBackend(async (backend) => {
    const N = 10;
    const results = await Promise.allSettled(
      Array.from({ length: N }, (_, i) =>
        backend.write("hot/create", { id: "hot/create", frontmatter: { type: "T", timestamp: T_DOC }, body: `v${i}` }, { expectedVersion: null }),
      ),
    );

    const fulfilled = results.filter((r): r is PromiseFulfilledResult<Version> => r.status === "fulfilled");
    const rejected = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
    assert.equal(fulfilled.length, 1, "exactly one expect-absent create must win");
    assert.equal(rejected.length, N - 1);
    for (const r of rejected) {
      assert.ok(r.reason instanceof VersionConflict);
      assert.equal(r.reason.expected, null);
      assert.equal(r.reason.actual, fulfilled[0]!.value, "every loser must see the WINNER's version as current");
    }
    assert.equal((await backend.versions("hot/create")).length, 1, "only the winner's single revision was ever recorded");
  });
});

test("N=10 concurrent UNCONDITIONAL writes to the SAME id all settle, and the final doc is exactly one writer's full body (no torn write)", async () => {
  await withBackend(async (backend) => {
    const N = 10;
    const bodies = Array.from({ length: N }, (_, i) => `unconditional-v${i}`);
    const results = await Promise.allSettled(
      bodies.map((body) => backend.write("hot/last-writer", { id: "hot/last-writer", frontmatter: { type: "T", timestamp: T_DOC }, body })),
    );
    assert.deepEqual(results.filter((r) => r.status === "rejected"), []);

    const finalBody = (await backend.read("hot/last-writer")).doc.body.trim();
    assert.ok(bodies.includes(finalBody), `final body '${finalBody}' must be exactly one writer's full, untorn body`);
  });
});

test("N=10 concurrent CAS blob writers racing one expectedVersion: exactly 1 winner + 9 VersionConflict", async () => {
  await withBackend(async (backend) => {
    const baseVersion = await backend.writeBlob("hot/blob.bin", new TextEncoder().encode("base"));

    const N = 10;
    const results = await Promise.allSettled(
      Array.from({ length: N }, (_, i) =>
        backend.writeBlob("hot/blob.bin", new TextEncoder().encode(`v${i}`), undefined, { expectedVersion: baseVersion }),
      ),
    );

    const fulfilled = results.filter((r): r is PromiseFulfilledResult<Version> => r.status === "fulfilled");
    const rejected = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
    assert.equal(fulfilled.length, 1, "exactly one CAS blob write racing the same expectedVersion must win");
    assert.equal(rejected.length, N - 1);
    for (const r of rejected) {
      assert.ok(r.reason instanceof VersionConflict);
      assert.equal(r.reason.expected, baseVersion);
    }

    const final = await backend.readBlob("hot/blob.bin");
    assert.equal(final!.version, fulfilled[0]!.value);
  });
});

test("N=10 concurrent CAS doc deletes racing the SAME expectedVersion: exactly 1 true winner + 9 idempotent false losers (NEVER a VersionConflict — absence always wins over a stale-version check)", async () => {
  await withBackend(async (backend) => {
    const base: OkfDocument = { id: "hot/cas-delete", frontmatter: { type: "T", timestamp: T_DOC }, body: "base" };
    const baseVersion = await backend.write("hot/cas-delete", base);

    const N = 10;
    const results = await Promise.allSettled(
      Array.from({ length: N }, () => backend.delete("hot/cas-delete", { expectedVersion: baseVersion })),
    );
    assert.deepEqual(results.filter((r) => r.status === "rejected"), [], "a delete race must never reject");
    const values = (results as PromiseFulfilledResult<boolean>[]).map((r) => r.value);
    assert.equal(values.filter((v) => v === true).length, 1, "exactly one racer actually deleted it");
    assert.equal(values.filter((v) => v === false).length, N - 1, "every other racer idempotently sees it already gone");

    assert.equal(await backend.exists("hot/cas-delete"), false);
    assert.deepEqual(await backend.versions("hot/cas-delete"), [], "history is purged once the winner's delete lands");
  });
});

test("N=10 concurrent UNCONDITIONAL doc deletes targeting the SAME id: exactly 1 true winner + 9 idempotent false losers", async () => {
  await withBackend(async (backend) => {
    await backend.write("hot/uncond-delete", { id: "hot/uncond-delete", frontmatter: { type: "T", timestamp: T_DOC }, body: "base" });

    const N = 10;
    const results = await Promise.allSettled(Array.from({ length: N }, () => backend.delete("hot/uncond-delete")));
    assert.deepEqual(results.filter((r) => r.status === "rejected"), []);
    const values = (results as PromiseFulfilledResult<boolean>[]).map((r) => r.value);
    assert.equal(values.filter((v) => v === true).length, 1);
    assert.equal(values.filter((v) => v === false).length, N - 1);
    assert.equal(await backend.exists("hot/uncond-delete"), false);
  });
});

test("a delete of a STALE (present but mismatched) version still conflicts, distinctly from the absent-target false case above", async () => {
  await withBackend(async (backend) => {
    const doc: OkfDocument = { id: "hot/stale-delete", frontmatter: { type: "T", timestamp: T_DOC }, body: "v1" };
    const v1 = await backend.write("hot/stale-delete", doc);
    await backend.write("hot/stale-delete", { ...doc, body: "v2" }); // moves the version, doc still present

    await assert.rejects(
      () => backend.delete("hot/stale-delete", { expectedVersion: v1 }),
      (err: unknown) => err instanceof VersionConflict && err.expected === v1,
    );
    assert.equal(await backend.exists("hot/stale-delete"), true);
  });
});

test("N=10 concurrent CAS blob deletes racing the SAME expectedVersion: exactly 1 true winner + 9 idempotent false losers", async () => {
  await withBackend(async (backend) => {
    const baseVersion = await backend.writeBlob("hot/cas-delete.bin", new TextEncoder().encode("base"));

    const N = 10;
    const results = await Promise.allSettled(
      Array.from({ length: N }, () => backend.deleteBlob("hot/cas-delete.bin", { expectedVersion: baseVersion })),
    );
    assert.deepEqual(results.filter((r) => r.status === "rejected"), []);
    const values = (results as PromiseFulfilledResult<boolean>[]).map((r) => r.value);
    assert.equal(values.filter((v) => v === true).length, 1);
    assert.equal(values.filter((v) => v === false).length, N - 1);
    assert.equal(await backend.existsBlob("hot/cas-delete.bin"), false);
  });
});

test("N=10 concurrent expect-absent blob CREATEs targeting the SAME key: exactly 1 winner + 9 VersionConflict(expected: null)", async () => {
  await withBackend(async (backend) => {
    const N = 10;
    const results = await Promise.allSettled(
      Array.from({ length: N }, (_, i) =>
        backend.writeBlob("hot/created.bin", new TextEncoder().encode(`v${i}`), undefined, { expectedVersion: null }),
      ),
    );

    const fulfilled = results.filter((r): r is PromiseFulfilledResult<Version> => r.status === "fulfilled");
    const rejected = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
    assert.equal(fulfilled.length, 1);
    assert.equal(rejected.length, N - 1);
    for (const r of rejected) {
      assert.ok(r.reason instanceof VersionConflict);
      assert.equal(r.reason.expected, null);
      assert.equal(r.reason.actual, fulfilled[0]!.value);
    }
  });
});
