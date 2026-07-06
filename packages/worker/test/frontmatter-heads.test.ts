/**
 * D1 frontmatter heads (`plans/d1-frontmatter-heads.md`): `D1R2Backend.queryHeads`
 * serves `{ id, frontmatter, version }` from the D1 head index ALONE.
 *
 * The load-bearing claims, each pinned against the REAL local D1/R2 simulation:
 *
 *   1. Every head-writing statement (unconditional upsert, expect-absent create, CAS
 *      update) populates the `frontmatter` column, and a scan then performs ZERO R2
 *      GETs — counted through a wrapped bucket, not inferred.
 *   2. Heads are parity-identical to `readMany`-derived heads, with byte-identical
 *      version tokens (the cross-backend invariant).
 *   3. A legacy row (NULL column — pre-0004) or a corrupt column reads through R2,
 *      still returns the correct head, and self-heals on the doc's next real write.
 *   4. The LIKE prefix push-down escapes `%`/`_` — a literal `_` in a prefix cannot
 *      over-match.
 *   5. `GET /docs` through the real router rides `queryHeads` (zero R2 GETs) for both
 *      the thin row and the `fields=frontmatter` projection.
 */
import test from "node:test";
import assert from "node:assert/strict";

import type { R2Bucket } from "@cloudflare/workers-types";
import { writeDocVersioned, queryHeads as engineQueryHeads } from "@agentstate-lite/core";
import type { Bundle } from "@agentstate-lite/core";
import { createRouterForBackend } from "@agentstate-lite/server";

import { D1R2Backend } from "../src/d1r2-backend.js";
import { createTestEnv } from "./env.js";

const T = "2026-07-04T00:00:00.000Z";

/** Wrap a bucket so the test can COUNT content reads (the whole point of the column). */
function countingBucket(bucket: R2Bucket): { bucket: R2Bucket; gets: () => number } {
  let gets = 0;
  const wrapper = {
    put: (key: string, value: unknown, options?: unknown) =>
      (bucket as unknown as { put: (k: string, v: unknown, o?: unknown) => unknown }).put(key, value, options),
    get: (key: string) => {
      gets += 1;
      return (bucket as unknown as { get: (k: string) => unknown }).get(key);
    },
  } as unknown as R2Bucket;
  return { bucket: wrapper, gets: () => gets };
}

test("all three head-writing statements populate the column; queryHeads is zero-R2 with byte-identical versions", async () => {
  const env = await createTestEnv();
  try {
    const counting = countingBucket(env.bucket);
    const backend = new D1R2Backend(env.db, counting.bucket);
    const bundle: Bundle = { root: "d1r2://heads", backend };

    // Statement 1: unconditional upsert (create + overwrite).
    await writeDocVersioned(bundle, {
      id: "tasks/a",
      frontmatter: { type: "Task", title: "A", timestamp: T, status: "todo" },
      body: "body-a",
    });
    const a2 = await writeDocVersioned(bundle, {
      id: "tasks/a",
      frontmatter: { type: "Task", title: "A", timestamp: T, status: "done" },
      body: "body-a2",
    });
    // Statement 2: expect-absent create.
    const b = await writeDocVersioned(
      bundle,
      { id: "tasks/b", frontmatter: { type: "Task", title: "B", timestamp: T }, body: "body-b" },
      { expectedVersion: null },
    );
    // Statement 3: CAS update.
    const b2 = await writeDocVersioned(
      bundle,
      { id: "tasks/b", frontmatter: { type: "Task", title: "B2", timestamp: T }, body: "body-b2" },
      { expectedVersion: b.version },
    );
    await writeDocVersioned(bundle, {
      id: "notes/c",
      frontmatter: { type: "Note", title: "C", timestamp: T },
      body: "body-c",
    });

    const before = counting.gets();
    const heads = (await backend.queryHeads({})).sort((x, y) => x.id.localeCompare(y.id));
    assert.equal(counting.gets(), before, "a column-backed scan must perform ZERO R2 GETs");

    // Parity: identical to readMany-derived heads, byte-identical version tokens.
    const ids = heads.map((h) => h.id);
    assert.deepEqual(ids, ["notes/c", "tasks/a", "tasks/b"]);
    const reads = await backend.readMany(ids);
    assert.deepEqual(
      heads,
      reads.map((r) => ({ id: r.doc.id, frontmatter: r.doc.frontmatter, version: r.version })),
    );
    assert.equal(heads.find((h) => h.id === "tasks/a")!.version, a2.version);
    assert.equal(heads.find((h) => h.id === "tasks/b")!.version, b2.version);

    // Engine-level parity: queryHeads(bundle, filter) rides the push-down + re-filter.
    const tasks = await engineQueryHeads(bundle, { type: "Task" });
    assert.deepEqual(tasks.map((h) => h.id), ["tasks/a", "tasks/b"]);
    assert.equal((tasks[0]!.frontmatter as { status?: string }).status, "done");
  } finally {
    await env.dispose();
  }
});

test("LIKE prefix push-down escapes wildcards — a literal '_' cannot over-match", async () => {
  const env = await createTestEnv();
  try {
    const backend = new D1R2Backend(env.db, env.bucket);
    const bundle: Bundle = { root: "d1r2://like", backend };
    await writeDocVersioned(bundle, { id: "a_c/x", frontmatter: { type: "X", timestamp: T }, body: "x" });
    await writeDocVersioned(bundle, { id: "abc/y", frontmatter: { type: "X", timestamp: T }, body: "y" });

    const heads = await backend.queryHeads({ prefix: "a_c/" });
    assert.deepEqual(heads.map((h) => h.id), ["a_c/x"]);
    // And the engine path agrees (its matchesFilter re-check would also catch over-match).
    const viaEngine = await engineQueryHeads(bundle, { prefix: "a_c/" });
    assert.deepEqual(viaEngine.map((h) => h.id), ["a_c/x"]);
  } finally {
    await env.dispose();
  }
});

test("legacy NULL / corrupt column reads through R2 and self-heals on the next real write", async () => {
  const env = await createTestEnv();
  try {
    const counting = countingBucket(env.bucket);
    const backend = new D1R2Backend(env.db, counting.bucket);
    const bundle: Bundle = { root: "d1r2://legacy", backend };
    const w = await writeDocVersioned(bundle, {
      id: "legacy/doc",
      frontmatter: { type: "Legacy", title: "L", timestamp: T },
      body: "legacy-body",
    });

    // Simulate a pre-0004 row: the column is NULL.
    await env.db.prepare("UPDATE doc_heads SET frontmatter = NULL WHERE id = ?").bind("legacy/doc").run();
    let g = counting.gets();
    let heads = await backend.queryHeads({});
    assert.equal(counting.gets(), g + 1, "a NULL column costs exactly ONE R2 read-through");
    assert.deepEqual(heads[0], {
      id: "legacy/doc",
      frontmatter: { type: "Legacy", title: "L", timestamp: T },
      version: w.version,
    });

    // A corrupt column behaves exactly like NULL (defensive read-through, never a crash) —
    // including VALID-JSON-NON-OBJECT corruption: the literal `null` (which a naive
    // `parsed ?? readThrough` would mask into `frontmatter: undefined` and crash the thin
    // projection), a number, and an array must all read through, not be served verbatim.
    for (const corrupt of ["'{not json'", "'null'", "'123'", "'[]'"]) {
      await env.db.prepare(`UPDATE doc_heads SET frontmatter = ${corrupt} WHERE id = ?`).bind("legacy/doc").run();
      g = counting.gets();
      heads = await backend.queryHeads({});
      assert.equal(counting.gets(), g + 1, `column ${corrupt} must cost exactly one read-through`);
      assert.equal(heads[0]!.frontmatter.type, "Legacy", `column ${corrupt} must serve the REAL frontmatter`);
    }

    // A real write repopulates the column; the scan is zero-R2 again.
    await writeDocVersioned(bundle, {
      id: "legacy/doc",
      frontmatter: { type: "Legacy", title: "L2", timestamp: T },
      body: "legacy-body-2",
    });
    g = counting.gets();
    heads = await backend.queryHeads({});
    assert.equal(counting.gets(), g, "a healed column costs zero R2 reads");
    assert.equal(heads[0]!.frontmatter.title, "L2");
  } finally {
    await env.dispose();
  }
});

test("JSON-impure frontmatter (nested date → js-yaml Date) is NOT cached — column stays NULL, parity holds via read-through", async () => {
  const env = await createTestEnv();
  try {
    const counting = countingBucket(env.bucket);
    const backend = new D1R2Backend(env.db, counting.bucket);
    const bundle: Bundle = { root: "d1r2://impure", backend };
    // A NESTED unquoted date round-trips YAML as a Date object (only TOP-LEVEL dates are
    // ISO-normalized by the parse layer); JSON.stringify would silently turn it into an
    // ISO string, diverging the column from what read()/readMany() return. The write path
    // must therefore refuse to cache it.
    await writeDocVersioned(bundle, {
      id: "impure/doc",
      frontmatter: {
        type: "Impure",
        timestamp: T,
        meta: { created: new Date("2024-01-01T00:00:00.000Z") },
      } as unknown as import("@agentstate-lite/core").Frontmatter,
      body: "impure-body",
    });

    const row = await env.db
      .prepare("SELECT frontmatter FROM doc_heads WHERE id = ?")
      .bind("impure/doc")
      .first<{ frontmatter: string | null }>();
    assert.equal(row!.frontmatter, null, "an impure frontmatter must not be cached");

    // Parity holds anyway: the scan reads through and serves the EXACT parsed shapes
    // (nested Date object), identical to readMany.
    const g = counting.gets();
    const heads = await backend.queryHeads({});
    assert.equal(counting.gets(), g + 1);
    const reads = await backend.readMany(["impure/doc"]);
    assert.deepEqual(
      heads,
      reads.map((r) => ({ id: r.doc.id, frontmatter: r.doc.frontmatter, version: r.version })),
    );
    assert.ok(
      (heads[0]!.frontmatter as { meta?: { created?: unknown } }).meta?.created instanceof Date,
      "the read-through head must carry the exact parsed shape, not a JSON-mangled string",
    );
  } finally {
    await env.dispose();
  }
});

test("GET /docs through the real router rides queryHeads: zero R2 GETs for thin AND frontmatter rows", async () => {
  const env = await createTestEnv();
  try {
    const counting = countingBucket(env.bucket);
    const backend = new D1R2Backend(env.db, counting.bucket);
    const bundle: Bundle = { root: "d1r2://router", backend };
    await writeDocVersioned(bundle, {
      id: "tasks/t",
      frontmatter: { type: "Task", title: "T", timestamp: T, status: "in_progress" },
      body: "a body that must never be fetched for a scan",
    });
    const router = createRouterForBackend(backend);

    const g = counting.gets();
    const thin = await router(new Request("http://w.local/v0/bundles/default/docs"));
    assert.equal(thin.status, 200);
    const thinPayload = (await thin.json()) as { count: number; docs: Array<Record<string, unknown>> };
    assert.equal(thinPayload.count, 1);
    assert.deepEqual(Object.keys(thinPayload.docs[0]!).sort(), ["id", "timestamp", "title", "type", "version"]);

    const full = await router(new Request("http://w.local/v0/bundles/default/docs?fields=frontmatter&type=Task"));
    const fullPayload = (await full.json()) as { docs: Array<{ frontmatter: Record<string, unknown> }> };
    assert.equal(fullPayload.docs[0]!.frontmatter.status, "in_progress");
    assert.ok(!JSON.stringify(fullPayload).includes("a body that must never"), "no body may leave the route");

    assert.equal(counting.gets(), g, "the whole route must be served from D1 heads alone");
  } finally {
    await env.dispose();
  }
});
