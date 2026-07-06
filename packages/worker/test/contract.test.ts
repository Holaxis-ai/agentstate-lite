/**
 * Core `StorageBackend` contract tests for {@link D1R2Backend}: read/write, compare-and-
 * swap (a specific `expectedVersion`, `expectedVersion: null` expect-absent create, and
 * the unconditional last-writer-wins default), `readMany` batching, `versions()` history,
 * `exists`/`list`, and reserved-file (`index.md`/`log.md`) CAS. The assertion SHAPES here
 * mirror `packages/core/test/dual-backend.test.ts` (duplicated as test bodies, per the
 * unit's plan — not a second copy of engine logic, which stays imported from core).
 *
 * Every test gets a FRESH, isolated local D1 + R2 environment (`createTestEnv`), matching
 * the "fresh backend per test" convention `dual-backend.test.ts`'s `RUNNERS` pattern uses.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { VersionConflict } from "@agentstate-lite/core";
import type { OkfDocument } from "@agentstate-lite/core";

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

test("read/write round-trip: version is content-addressed and stable across reads", async () => {
  await withBackend(async (backend) => {
    const doc: OkfDocument = {
      id: "concepts/alpha",
      frontmatter: { type: "Concept", title: "Alpha", timestamp: T_DOC },
      body: "Alpha body.",
    };
    const written = await backend.write("concepts/alpha", doc);
    assert.match(written, /^sha256:[0-9a-f]{64}$/);

    const first = await backend.read("concepts/alpha");
    const again = await backend.read("concepts/alpha");
    assert.equal(first.version, written);
    assert.equal(first.version, again.version);
    assert.equal(first.doc.frontmatter.title, "Alpha");
    assert.equal(first.doc.body.trim(), "Alpha body.");
  });
});

test("read rejects (ENOENT-shaped) on an absent document", async () => {
  await withBackend(async (backend) => {
    await assert.rejects(() => backend.read("does/not-exist"), (err: unknown) => {
      assert.equal((err as NodeJS.ErrnoException).code, "ENOENT");
      return true;
    });
  });
});

test("compare-and-swap rejects a stale expectedVersion, and succeeds against the current version", async () => {
  await withBackend(async (backend) => {
    const base: OkfDocument = { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" };

    const v1 = await backend.write("d", base);
    const v2 = await backend.write("d", { ...base, body: "two" }); // unconditional overwrite
    assert.notEqual(v2, v1);

    await assert.rejects(
      () => backend.write("d", { ...base, body: "three" }, { expectedVersion: v1 }),
      (err: unknown) => {
        assert.ok(err instanceof VersionConflict);
        assert.equal(err.expected, v1);
        assert.equal(err.actual, v2);
        return true;
      },
    );
    // The rejected write did not mutate the document.
    assert.equal((await backend.read("d")).version, v2);

    const v3 = await backend.write("d", { ...base, body: "three" }, { expectedVersion: v2 });
    assert.notEqual(v3, v2);
    assert.equal((await backend.read("d")).version, v3);

    // CAS against a not-yet-existing document is a conflict (current version is "none").
    await assert.rejects(
      () => backend.write("ghost", base, { expectedVersion: v1 }),
      (err: unknown) => err instanceof VersionConflict && err.actual === null,
    );
  });
});

test("write honors expectedVersion: null as expect-absent create", async () => {
  await withBackend(async (backend) => {
    const doc: OkfDocument = { id: "created-if-absent", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" };

    const v1 = await backend.write("created-if-absent", doc, { expectedVersion: null });
    assert.match(v1, /^sha256:[0-9a-f]{64}$/);
    assert.equal((await backend.read("created-if-absent")).version, v1);

    await assert.rejects(
      () => backend.write("created-if-absent", { ...doc, body: "two" }, { expectedVersion: null }),
      (err: unknown) => {
        assert.ok(err instanceof VersionConflict);
        assert.equal(err.expected, null);
        assert.equal(err.actual, v1);
        return true;
      },
    );
    assert.equal((await backend.read("created-if-absent")).version, v1);
  });
});

test("unconditional write is idempotent: a byte-identical re-write does not grow history", async () => {
  await withBackend(async (backend) => {
    const doc: OkfDocument = { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" };
    await backend.write("d", doc, { actor: "alice" });
    await backend.write("d", { ...doc, body: "two" }, { actor: "bob" });
    await backend.write("d", { ...doc, body: "two" }); // identical content, unconditional

    const history = await backend.versions("d");
    assert.equal(history.length, 2, "the byte-identical re-write must not append a 3rd revision");
  });
});

test("versions() is newest-first and attributed; unconditional write defaults the actor", async () => {
  await withBackend(async (backend) => {
    const v1 = await backend.write("d", { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" }, { actor: "alice" });
    const v2 = await backend.write("d", { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "two" }, { actor: "bob" });
    const v3 = await backend.write("d", { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "three" });

    const history = await backend.versions("d");
    assert.equal(history.length, 3);
    assert.deepEqual(history.map((h) => h.version), [v3, v2, v1]);
    assert.equal(history[1]!.actor, "bob");
    assert.equal(history[2]!.actor, "alice");
    for (const h of history) assert.match(h.timestamp, /^\d{4}-\d\d-\d\dT/);

    assert.deepEqual(await backend.versions("nope"), []); // never-written id: no history, not an error
  });
});

test("exists / list", async () => {
  await withBackend(async (backend) => {
    assert.equal(await backend.exists("a/one"), false);
    for (const id of ["z/last", "a/first", "m/mid"]) {
      await backend.write(id, { id, frontmatter: { type: "T", timestamp: T_DOC }, body: id });
    }
    assert.equal(await backend.exists("a/first"), true);
    assert.deepEqual(await backend.list(), ["a/first", "m/mid", "z/last"]); // sorted
    assert.deepEqual(await backend.list("m/"), ["m/mid"]);
  });
});

test("readMany batch-reads in input order and rejects on a missing id", async () => {
  await withBackend(async (backend) => {
    for (const id of ["z/last", "a/first", "m/mid"]) {
      await backend.write(id, { id, frontmatter: { type: "T", timestamp: T_DOC }, body: id });
    }
    const ids = ["m/mid", "a/first", "z/last"];
    const results = await backend.readMany(ids);
    assert.deepEqual(results.map((r) => r.doc.id), ids);
    for (const r of results) assert.match(r.version, /^sha256:/);

    assert.deepEqual(await backend.readMany([]), []);
    await assert.rejects(() => backend.readMany(["a/first", "does/not-exist"]));
  });
});

// ── delete (DELETE operation) ─────────────────────────────────────────────────────────

test("delete removes a present doc (true); afterward read/exists/list/versions all agree it's gone (versions purged too — D5); a re-delete is idempotent (false)", async () => {
  await withBackend(async (backend) => {
    await backend.write("concepts/gone", { id: "concepts/gone", frontmatter: { type: "T", timestamp: T_DOC }, body: "x" }, { actor: "alice" });
    await backend.write("concepts/gone", { id: "concepts/gone", frontmatter: { type: "T", timestamp: T_DOC }, body: "y" }, { actor: "bob" });
    assert.equal((await backend.versions("concepts/gone")).length, 2);

    assert.equal(await backend.delete("concepts/gone"), true);

    await assert.rejects(() => backend.read("concepts/gone"), (err: unknown) => {
      assert.equal((err as NodeJS.ErrnoException).code, "ENOENT");
      return true;
    });
    assert.equal(await backend.exists("concepts/gone"), false);
    assert.ok(!(await backend.list()).includes("concepts/gone"));
    assert.deepEqual(await backend.versions("concepts/gone"), [], "doc_history must be purged too, not just the head");

    assert.equal(await backend.delete("concepts/gone"), false); // idempotent
  });
});

test("delete on a never-written id is a no-op (false), not an error", async () => {
  await withBackend(async (backend) => {
    assert.equal(await backend.delete("never/written"), false);
  });
});

test("delete honors expectedVersion CAS — match succeeds, a stale (present but mismatched) version conflicts, and an ABSENT target returns false regardless of expectedVersion", async () => {
  await withBackend(async (backend) => {
    const doc: OkfDocument = { id: "concepts/cas-delete", frontmatter: { type: "T", timestamp: T_DOC }, body: "v1" };
    const v1 = await backend.write("concepts/cas-delete", doc);
    const v2 = await backend.write("concepts/cas-delete", { ...doc, body: "v2" });
    assert.notEqual(v1, v2);

    await assert.rejects(
      () => backend.delete("concepts/cas-delete", { expectedVersion: v1 }),
      (err: unknown) => {
        assert.ok(err instanceof VersionConflict);
        assert.equal(err.expected, v1);
        assert.equal(err.actual, v2);
        return true;
      },
    );
    assert.equal(await backend.exists("concepts/cas-delete"), true); // rejected delete did not mutate
    assert.equal((await backend.versions("concepts/cas-delete")).length, 2, "a lost CAS delete must leave history untouched");

    assert.equal(await backend.delete("concepts/cas-delete", { expectedVersion: v2 }), true);
    assert.equal(await backend.exists("concepts/cas-delete"), false);

    // Now absent: a CAS delete against any expectedVersion returns false, never a conflict.
    assert.equal(await backend.delete("concepts/cas-delete", { expectedVersion: v1 }), false);
    assert.equal(await backend.delete("concepts/cas-delete", { expectedVersion: v2 }), false);
  });
});

test("delete rejects an unsafe concept id via core's assertSafeConceptId (not silently resolved)", async () => {
  await withBackend(async (backend) => {
    await assert.rejects(() => backend.delete("../../../../etc/passwd"), /concept id/i);
  });
});

test("deleteBlob removes a present blob (true); afterward readBlob/existsBlob/listBlobs all agree it's gone; a re-delete is idempotent (false)", async () => {
  await withBackend(async (backend) => {
    await backend.writeBlob("artifacts/gone.bin", new TextEncoder().encode("bye"));
    assert.equal(await backend.existsBlob("artifacts/gone.bin"), true);

    assert.equal(await backend.deleteBlob("artifacts/gone.bin"), true);

    assert.equal(await backend.readBlob("artifacts/gone.bin"), null);
    assert.equal(await backend.existsBlob("artifacts/gone.bin"), false);
    assert.deepEqual(await backend.listBlobs("artifacts/"), []);

    assert.equal(await backend.deleteBlob("artifacts/gone.bin"), false); // idempotent
  });
});

test("deleteBlob honors expectedVersion CAS — match succeeds, a stale version conflicts, and an ABSENT key returns false regardless of expectedVersion", async () => {
  await withBackend(async (backend) => {
    const v1 = await backend.writeBlob("artifacts/cas-delete.bin", new TextEncoder().encode("v1"));
    const v2 = await backend.writeBlob("artifacts/cas-delete.bin", new TextEncoder().encode("v2"));
    assert.notEqual(v1, v2);

    await assert.rejects(
      () => backend.deleteBlob("artifacts/cas-delete.bin", { expectedVersion: v1 }),
      (err: unknown) => {
        assert.ok(err instanceof VersionConflict);
        assert.equal(err.expected, v1);
        assert.equal(err.actual, v2);
        return true;
      },
    );
    assert.equal(await backend.existsBlob("artifacts/cas-delete.bin"), true);

    assert.equal(await backend.deleteBlob("artifacts/cas-delete.bin", { expectedVersion: v2 }), true);
    assert.equal(await backend.existsBlob("artifacts/cas-delete.bin"), false);
    assert.equal(await backend.deleteBlob("artifacts/cas-delete.bin", { expectedVersion: v1 }), false);
  });
});

test("deleteBlob rejects an unsafe blob key via core's assertSafeBlobKey", async () => {
  await withBackend(async (backend) => {
    await assert.rejects(() => backend.deleteBlob("../../../../etc/passwd"), /blob key/i);
    await assert.rejects(() => backend.deleteBlob("report.md"), /blob key/i);
  });
});

// ── reserved files (index.md / log.md) ───────────────────────────────────────────────

test("reserved files: read/write round-trip and CAS", async () => {
  await withBackend(async (backend) => {
    assert.equal(await backend.readReserved("", "log.md"), null);

    const c1 = "# Log\n\n- one\n";
    const v1 = await backend.writeReserved("", "log.md", c1); // unconditional create
    const read1 = await backend.readReserved("", "log.md");
    assert.ok(read1);
    assert.equal(read1!.content, c1);
    assert.equal(read1!.version, v1);

    await assert.rejects(
      () => backend.writeReserved("", "log.md", "# Log\n\n- two\n", { expectedVersion: "sha256:" + "0".repeat(64) }),
      (err: unknown) => {
        assert.ok(err instanceof VersionConflict);
        assert.equal(err.actual, v1);
        return true;
      },
    );
    assert.equal((await backend.readReserved("", "log.md"))!.content, c1);

    const v2 = await backend.writeReserved("", "log.md", "# Log\n\n- two\n", { expectedVersion: v1 });
    assert.notEqual(v2, v1);
    assert.equal((await backend.readReserved("", "log.md"))!.version, v2);

    // CAS against an absent reserved file (a different dir) is a conflict (current == none).
    await assert.rejects(
      () => backend.writeReserved("sub", "log.md", "x", { expectedVersion: v1 }),
      (err: unknown) => err instanceof VersionConflict && err.actual === null,
    );
  });
});

test("reserved files: expectedVersion: null is expect-absent create", async () => {
  await withBackend(async (backend) => {
    const c1 = "# Log\n\n- one\n";
    const v1 = await backend.writeReserved("fresh-dir", "log.md", c1, { expectedVersion: null });
    assert.equal((await backend.readReserved("fresh-dir", "log.md"))!.version, v1);

    await assert.rejects(
      () => backend.writeReserved("fresh-dir", "log.md", "# Log\n\n- two\n", { expectedVersion: null }),
      (err: unknown) => {
        assert.ok(err instanceof VersionConflict);
        assert.equal(err.expected, null);
        assert.equal(err.actual, v1);
        return true;
      },
    );
  });
});

// ── id/dir safety: proves D1R2Backend calls the SAME core guards as every other adapter ──

test("read/write reject an unsafe concept id via core's assertSafeConceptId (not silently resolved)", async () => {
  await withBackend(async (backend) => {
    await assert.rejects(() => backend.read("../../../../etc/passwd"), /concept id/i);
    await assert.rejects(
      () => backend.write("../../../../etc/passwd", { id: "x", frontmatter: { type: "T", timestamp: T_DOC }, body: "x" }),
      /concept id/i,
    );
  });
});

test("readReserved/writeReserved reject an unsafe dir via core's assertSafeReservedDir", async () => {
  await withBackend(async (backend) => {
    await assert.rejects(() => backend.readReserved("../../../../tmp", "log.md"), /directory/i);
    await assert.rejects(() => backend.writeReserved("../../../../tmp", "log.md", "x"), /directory/i);
  });
});
