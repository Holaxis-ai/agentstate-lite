/**
 * Contract tests for the hardened {@link StorageBackend} seam.
 *
 * The point of these tests is to prove the engine leaks NO filesystem assumptions:
 * a representative subset of core operations runs over BOTH the degenerate
 * {@link FilesystemBackend} (a temp dir) and the full {@link MemoryBackend}, and the
 * results must be identical. On top of that, targeted tests exercise the hard parts
 * of the contract — the version token surfaced on read, compare-and-swap conflict,
 * real version history, and batch `readMany`.
 *
 * Unlike `pure.test.ts`, these touch the YAML/fs runtime (via the filesystem adapter),
 * still under Node's built-in TypeScript stripping (see test/ts-loader.mjs).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  writeDoc,
  writeDocVersioned,
  readDoc,
  readDocVersioned,
  docVersions,
  deleteDoc,
  appendLog,
  regenerateIndex,
  readIndex,
  readLog,
  query,
} from "../src/bundle.js";
import { FilesystemBackend } from "../src/backend.js";
import { MemoryBackend } from "../src/memory-backend.js";
import { contentVersion, defaultActor, VersionConflict, versionOfBytes } from "../src/versioning.js";
import { assertSafeConceptId, pathFromConceptId } from "../src/paths.js";
import type { Bundle, OkfDocument, ReservedFilename, ReservedReadResult, StorageBackend } from "../src/types.js";
import { scenario, T_DOC, NOTE_ID } from "./scenario.js";

/** Run `fn` against a bundle over a fresh temp-dir FilesystemBackend, then clean up. */
async function withFsBundle(fn: (bundle: Bundle) => Promise<void>): Promise<void> {
  const root = await mkdtemp(path.join(tmpdir(), "okf-fs-"));
  try {
    await fn({ root, backend: new FilesystemBackend(root) });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

/** Run `fn` against a bundle over a fresh MemoryBackend (its `root` is inert). */
async function withMemBundle(fn: (bundle: Bundle) => Promise<void>): Promise<void> {
  await fn({ root: "mem://bundle", backend: new MemoryBackend() });
}

/** The two adapters, driven through the identical runner shape. */
const RUNNERS = [
  ["FilesystemBackend", withFsBundle],
  ["MemoryBackend", withMemBundle],
] as const;

test("dual-backend: core operations return identical results over filesystem and memory", async () => {
  let fsResult: unknown;
  let memResult: unknown;
  await withFsBundle(async (b) => void (fsResult = await scenario(b)));
  await withMemBundle(async (b) => void (memResult = await scenario(b)));

  assert.deepEqual(memResult, fsResult);

  // Spot-check the shared expectation so a mutually-wrong pair can't pass silently.
  const r = fsResult as {
    conceptIds: string[];
    betaBacklinks: { from: string; text: string }[];
    alphaBacklinks: { from: string; text: string }[];
    freshness: string;
  };
  assert.deepEqual(r.conceptIds, ["concepts/alpha", "concepts/beta"]);
  assert.deepEqual(r.betaBacklinks, [{ from: "concepts/alpha", text: "Beta" }]); // alpha → beta (relative link)
  assert.deepEqual(r.alphaBacklinks, [
    { from: NOTE_ID, text: "Alpha" },
    { from: "tables/users", text: "Alpha" },
  ]); // note + table both cite alpha
  assert.equal(r.freshness, "fresh");
});

test("read surfaces a content-addressed version token, identical across backends", async () => {
  const doc: OkfDocument = {
    id: "concepts/alpha",
    frontmatter: { type: "Concept", title: "Alpha", timestamp: T_DOC },
    body: "Alpha body.",
  };

  let fsVersion = "";
  await withFsBundle(async (bundle) => {
    const fs = bundle.backend!;
    await writeDoc(bundle, doc);
    const first = await fs.read("concepts/alpha");
    const again = await fs.read("concepts/alpha");
    assert.match(first.version, /^sha256:[0-9a-f]{64}$/);
    assert.equal(first.version, again.version); // stable across reads
    assert.equal(first.version, contentVersion(doc)); // == hash of the saved document
    fsVersion = first.version;
  });

  await withMemBundle(async (bundle) => {
    await writeDoc(bundle, doc);
    const memRead = await bundle.backend!.read("concepts/alpha");
    // Content-addressed: an engine-written doc hashes the same in both stores — the
    // token is a property of the bytes, not the backend.
    assert.equal(memRead.version, fsVersion);
  });
});

for (const [name, run] of RUNNERS) {
  test(`${name}: compare-and-swap rejects a stale expectedVersion`, async () => {
    await run(async (bundle) => {
      const backend = bundle.backend!;
      const base: OkfDocument = { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" };

      const v1 = await backend.write("d", base);
      const v2 = await backend.write("d", { ...base, body: "two" }); // unconditional overwrite
      assert.notEqual(v2, v1);

      // A CAS write against the now-stale v1 must be rejected, with a typed conflict.
      await assert.rejects(
        () => backend.write("d", { ...base, body: "three" }, { expectedVersion: v1 }),
        (err: unknown) => {
          assert.ok(err instanceof VersionConflict);
          assert.equal(err.expected, v1);
          assert.equal(err.actual, v2);
          return true;
        },
      );
      // ...and the rejected write did NOT mutate the document.
      assert.equal((await backend.read("d")).version, v2);

      // A CAS write against the current version succeeds.
      const v3 = await backend.write("d", { ...base, body: "three" }, { expectedVersion: v2 });
      assert.notEqual(v3, v2);
      assert.equal((await backend.read("d")).version, v3);

      // A CAS write to a not-yet-existing document is a conflict (current version is "none").
      await assert.rejects(
        () => backend.write("ghost", base, { expectedVersion: v1 }),
        (err: unknown) => err instanceof VersionConflict && err.actual === null,
      );
    });
  });

  test(`${name}: write honors expectedVersion: null as expect-absent create`, async () => {
    await run(async (bundle) => {
      const backend = bundle.backend!;
      const doc: OkfDocument = { id: "created-if-absent", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" };

      // Absent ⇒ expect-absent create succeeds.
      const v1 = await backend.write("created-if-absent", doc, { expectedVersion: null });
      assert.match(v1, /^sha256:[0-9a-f]{64}$/);
      assert.equal((await backend.read("created-if-absent")).version, v1);

      // Now present ⇒ a second expect-absent create is a conflict (expected: null, actual: v1).
      await assert.rejects(
        () => backend.write("created-if-absent", { ...doc, body: "two" }, { expectedVersion: null }),
        (err: unknown) => {
          assert.ok(err instanceof VersionConflict);
          assert.equal(err.expected, null);
          assert.equal(err.actual, v1);
          return true;
        },
      );
      // ...and the rejected write did not mutate the document.
      assert.equal((await backend.read("created-if-absent")).version, v1);
    });
  });

  test(`${name}: writeReserved honors expectedVersion: null as expect-absent create`, async () => {
    await run(async (bundle) => {
      const backend = bundle.backend!;
      const c1 = "# Log\n\n- one\n";

      // Absent ⇒ expect-absent create succeeds.
      const v1 = await backend.writeReserved("fresh-dir", "log.md", c1, { expectedVersion: null });
      assert.match(v1, /^sha256:[0-9a-f]{64}$/);
      assert.equal((await backend.readReserved("fresh-dir", "log.md"))!.version, v1);

      // Now present ⇒ a second expect-absent create is a conflict (expected: null, actual: v1).
      await assert.rejects(
        () => backend.writeReserved("fresh-dir", "log.md", "# Log\n\n- two\n", { expectedVersion: null }),
        (err: unknown) => {
          assert.ok(err instanceof VersionConflict);
          assert.equal(err.expected, null);
          assert.equal(err.actual, v1);
          return true;
        },
      );
      assert.equal((await backend.readReserved("fresh-dir", "log.md"))!.version, v1);
    });
  });

  test(`${name}: readMany batch-reads in input order and rejects on a missing id`, async () => {
    await run(async (bundle) => {
      const backend = bundle.backend!;
      for (const id of ["z/last", "a/first", "m/mid"]) {
        await writeDoc(bundle, { id, frontmatter: { type: "T", timestamp: T_DOC }, body: id });
      }

      const ids = ["m/mid", "a/first", "z/last"];
      const results = await backend.readMany(ids);
      assert.deepEqual(results.map((r) => r.doc.id), ids); // input order preserved
      for (const r of results) assert.match(r.version, /^sha256:/);

      assert.deepEqual(await backend.readMany([]), []);
      await assert.rejects(() => backend.readMany(["a/first", "does/not-exist"]));
    });
  });
}

// ── delete (DELETE operation, hard-delete, idempotent, non-cascading) ──────────

for (const [name, run] of RUNNERS) {
  test(`${name}: delete removes a present doc (true), and afterward read/exists/list/versions all agree it's gone; a re-delete is idempotent (false)`, async () => {
    await run(async (bundle) => {
      const backend = bundle.backend!;
      await writeDoc(bundle, { id: "concepts/gone", frontmatter: { type: "T", timestamp: T_DOC }, body: "x" });
      assert.equal(await backend.exists("concepts/gone"), true);

      assert.equal(await backend.delete("concepts/gone"), true);

      await assert.rejects(() => backend.read("concepts/gone"), (err: unknown) => {
        assert.equal((err as NodeJS.ErrnoException).code, "ENOENT");
        return true;
      });
      assert.equal(await backend.exists("concepts/gone"), false);
      assert.ok(!(await backend.list()).includes("concepts/gone"));
      assert.deepEqual(await backend.versions("concepts/gone"), []);

      // Idempotent: deleting an already-absent target is SUCCESS (false), never an error.
      assert.equal(await backend.delete("concepts/gone"), false);
    });
  });

  test(`${name}: delete on a NEVER-WRITTEN id is a no-op (false), not an error`, async () => {
    await run(async (bundle) => {
      assert.equal(await bundle.backend!.delete("never/written"), false);
    });
  });

  test(`${name}: delete honors expectedVersion CAS — match succeeds, a stale (present but mismatched) version conflicts, and an ABSENT target returns false regardless of expectedVersion (never a spurious conflict)`, async () => {
    await run(async (bundle) => {
      const backend = bundle.backend!;
      const doc: OkfDocument = { id: "concepts/cas-delete", frontmatter: { type: "T", timestamp: T_DOC }, body: "v1" };
      const v1 = await backend.write("concepts/cas-delete", doc);
      const v2 = await backend.write("concepts/cas-delete", { ...doc, body: "v2" }); // moves the version
      assert.notEqual(v1, v2);

      // Present but the CAS token is stale (points at v1, current is v2) -> VersionConflict.
      await assert.rejects(
        () => backend.delete("concepts/cas-delete", { expectedVersion: v1 }),
        (err: unknown) => {
          assert.ok(err instanceof VersionConflict);
          assert.equal(err.expected, v1);
          assert.equal(err.actual, v2);
          return true;
        },
      );
      assert.equal(await backend.exists("concepts/cas-delete"), true); // rejected delete did NOT mutate

      // CAS against the CURRENT version succeeds.
      assert.equal(await backend.delete("concepts/cas-delete", { expectedVersion: v2 }), true);
      assert.equal(await backend.exists("concepts/cas-delete"), false);

      // Now ABSENT: a CAS delete against ANY expectedVersion (even a plausible-looking stale
      // one) returns false — absence always wins over a stale-version check, never a conflict.
      assert.equal(await backend.delete("concepts/cas-delete", { expectedVersion: v1 }), false);
      assert.equal(await backend.delete("concepts/cas-delete", { expectedVersion: v2 }), false);
    });
  });

  test(`${name}: deleteDoc (engine) rejects reserved ids (index.md/log.md) — never reaches the backend's delete()`, async () => {
    await run(async (bundle) => {
      // Seed both reserved files so a (bug-induced) delete would be observable if it ran.
      await bundle.backend!.writeReserved("", "index.md", "# root\n");
      await bundle.backend!.writeReserved("", "log.md", "# Log\n");

      await assert.rejects(() => deleteDoc(bundle, "index.md"), /reserved file/i);
      await assert.rejects(() => deleteDoc(bundle, "log.md"), /reserved file/i);

      // Both reserved files are untouched.
      assert.ok((await readIndex(bundle)) !== null);
      assert.ok((await readLog(bundle)) !== null);
    });
  });
}

// ── delete CAS race: concurrent deletes converge to ONE winner + N-1 idempotent losers ──
//
// Unlike write's CAS race (every loser gets a genuine VersionConflict, because a write
// always leaves a DIFFERENT document in place for the next racer to observe as "current"),
// a delete race is asymmetric: the FIRST racer to actually run sees the shared
// expectedVersion as current and wins (true); every LATER racer — serialized behind the
// SAME per-key mutex `write`'s race tests already exercise — observes the document is now
// ABSENT and returns false, per DeleteOptions' idempotency contract (absence always wins
// over a stale-version check). Zero VersionConflicts are expected from either race below.

test("FilesystemBackend: N concurrent CAS deletes racing the SAME expectedVersion converge to exactly ONE true winner and N-1 idempotent false losers (never a VersionConflict)", async () => {
  await withFsBundle(async (bundle) => {
    const backend = bundle.backend!;
    const base: OkfDocument = { id: "hot/cas-delete", frontmatter: { type: "T", timestamp: T_DOC }, body: "base" };
    const baseVersion = await backend.write("hot/cas-delete", base);

    const N = 10;
    const results = await Promise.allSettled(
      Array.from({ length: N }, () => backend.delete("hot/cas-delete", { expectedVersion: baseVersion })),
    );
    assert.deepEqual(results.filter((r) => r.status === "rejected"), [], "no racer should ever reject");
    const values = results.map((r) => (r as PromiseFulfilledResult<boolean>).value);
    assert.equal(values.filter((v) => v === true).length, 1, "exactly one racer must have actually deleted it");
    assert.equal(values.filter((v) => v === false).length, N - 1, "every other racer must idempotently see it already gone");
    assert.equal(await backend.exists("hot/cas-delete"), false);
  });
});

test("MemoryBackend: N concurrent UNCONDITIONAL deletes racing the SAME id converge to exactly ONE true winner and N-1 idempotent false losers", async () => {
  const backend = new MemoryBackend();
  await backend.write("hot/uncond-delete", { id: "hot/uncond-delete", frontmatter: { type: "T", timestamp: T_DOC }, body: "base" });

  const N = 10;
  const results = await Promise.allSettled(Array.from({ length: N }, () => backend.delete("hot/uncond-delete")));
  assert.deepEqual(results.filter((r) => r.status === "rejected"), []);
  const values = results.map((r) => (r as PromiseFulfilledResult<boolean>).value);
  assert.equal(values.filter((v) => v === true).length, 1);
  assert.equal(values.filter((v) => v === false).length, N - 1);
  assert.equal(await backend.exists("hot/uncond-delete"), false);
});

test("MemoryBackend: delete purges the WHOLE version chain, not just the head — versions() reports [] after delete, matching a never-written concept", async () => {
  const mem = new MemoryBackend();
  await mem.write("d", { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" }, { actor: "alice" });
  await mem.write("d", { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "two" }, { actor: "bob" });
  assert.equal((await mem.versions("d")).length, 2);

  assert.equal(await mem.delete("d"), true);
  assert.deepEqual(await mem.versions("d"), []);
});

test("MemoryBackend: versions() records a real, newest-first, attributed history", async () => {
  const mem = new MemoryBackend();

  const v1 = await mem.write("d", { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" }, { actor: "alice" });
  const v2 = await mem.write("d", { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "two" }, { actor: "bob" });
  const v3 = await mem.write("d", { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "three" });

  const history = await mem.versions("d");
  assert.equal(history.length, 3);
  assert.deepEqual(history.map((h) => h.version), [v3, v2, v1]); // newest-first
  assert.equal(history[0]!.actor, defaultActor()); // v3 was unattributed → local default
  assert.equal(history[1]!.actor, "bob");
  assert.equal(history[2]!.actor, "alice");
  for (const h of history) assert.match(h.timestamp, /^\d{4}-\d\d-\d\dT/);

  // Idempotent: re-writing byte-identical content does not grow the chain.
  await mem.write("d", { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "three" });
  assert.equal((await mem.versions("d")).length, 3);

  // A never-written id has no history (not an error).
  assert.deepEqual(await mem.versions("nope"), []);
});

test("MemoryBackend: persists + returns agent alongside actor; a revision with no agent omits the field entirely", async () => {
  const mem = new MemoryBackend();

  await mem.write(
    "d",
    { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" },
    { actor: "root", agent: "collab-3" },
  );
  await mem.write("d", { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "two" }, { actor: "root" });

  const history = await mem.versions("d");
  assert.equal(history.length, 2);
  // Newest-first: the second write (actor only) has no agent.
  assert.equal(history[0]!.actor, "root");
  assert.equal(history[0]!.agent, undefined);
  assert.ok(!("agent" in history[0]!), "a never-agent'd revision omits the field entirely");
  // The first write's agent is preserved.
  assert.equal(history[1]!.actor, "root");
  assert.equal(history[1]!.agent, "collab-3");
});

test("FilesystemBackend: versions() is single-version by design (no history on a plain fs)", async () => {
  await withFsBundle(async (bundle) => {
    const fs = bundle.backend!;
    await writeDoc(bundle, { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" });
    await writeDoc(bundle, { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "two" });
    const history = await fs.versions("d");
    assert.equal(history.length, 1); // the filesystem keeps only the current revision
    assert.equal(history[0]!.timestamp, T_DOC); // reflected from frontmatter
    assert.match(history[0]!.version, /^sha256:/);
    assert.deepEqual(await fs.versions("nope"), []);
  });
});

// ── engine-surface versioning: the seam's hard-case capabilities threaded THROUGH the engine ──

for (const [name, run] of RUNNERS) {
  test(`${name}: engine compare-and-swap (writeDoc + expectedVersion) rejects a stale version`, async () => {
    await run(async (bundle) => {
      const doc: OkfDocument = {
        id: "concepts/cas",
        frontmatter: { type: "Concept", title: "Cas", timestamp: T_DOC },
        body: "v1",
      };
      const first = await writeDocVersioned(bundle, doc);
      assert.match(first.version, /^sha256:[0-9a-f]{64}$/);
      const second = await writeDocVersioned(bundle, { ...doc, body: "v2" }); // unconditional overwrite
      assert.notEqual(second.version, first.version);

      // CAS THROUGH THE ENGINE against the now-stale first version → typed conflict, no mutation.
      await assert.rejects(
        () => writeDoc(bundle, { ...doc, body: "v3" }, { expectedVersion: first.version }),
        (err: unknown) => {
          assert.ok(err instanceof VersionConflict);
          assert.equal(err.expected, first.version);
          assert.equal(err.actual, second.version);
          return true;
        },
      );
      assert.equal((await readDocVersioned(bundle, "concepts/cas")).version, second.version);

      // CAS against the current version succeeds and advances the version.
      const third = await writeDocVersioned(bundle, { ...doc, body: "v3" }, { expectedVersion: second.version });
      assert.notEqual(third.version, second.version);
      assert.equal((await readDocVersioned(bundle, "concepts/cas")).version, third.version);

      // CAS to a not-yet-existing concept is a conflict (current version is "none").
      await assert.rejects(
        () => writeDoc(bundle, { id: "concepts/ghost", frontmatter: { type: "T", timestamp: T_DOC }, body: "x" }, { expectedVersion: first.version }),
        (err: unknown) => err instanceof VersionConflict && err.actual === null,
      );
    });
  });

  test(`${name}: engine readDocVersioned surfaces the content-addressed token (== contentVersion, == write token)`, async () => {
    await run(async (bundle) => {
      const input: OkfDocument = {
        id: "concepts/v",
        frontmatter: { type: "Concept", title: "V", timestamp: T_DOC },
        body: "body",
      };
      const written = await writeDocVersioned(bundle, input);
      const read = await readDocVersioned(bundle, "concepts/v");
      assert.equal(read.version, written.version); // read token == write token
      // The input frontmatter is already in normalized order, so the saved serialization equals it.
      assert.equal(written.version, contentVersion(input));
      assert.match(read.version, /^sha256:[0-9a-f]{64}$/);
      // docVersions' head reflects the same current version.
      const history = await docVersions(bundle, "concepts/v");
      assert.equal(history[0]!.version, written.version);
    });
  });

  test(`${name}: reserved-file writeReserved honors compare-and-swap`, async () => {
    await run(async (bundle) => {
      const backend = bundle.backend!;
      const c1 = "# Log\n\n- one\n";

      const v1 = await backend.writeReserved("", "log.md", c1); // create (unconditional)
      assert.match(v1, /^sha256:[0-9a-f]{64}$/);
      const read1 = await backend.readReserved("", "log.md");
      assert.ok(read1);
      assert.equal(read1!.content, c1);
      assert.equal(read1!.version, v1); // read token == write token

      // Stale CAS → conflict; content is unchanged.
      await assert.rejects(
        () => backend.writeReserved("", "log.md", "# Log\n\n- two\n", { expectedVersion: "sha256:" + "0".repeat(64) }),
        (err: unknown) => {
          assert.ok(err instanceof VersionConflict);
          assert.equal(err.actual, v1);
          return true;
        },
      );
      assert.equal((await backend.readReserved("", "log.md"))!.content, c1);

      // CAS against the current version → succeeds and advances the version.
      const v2 = await backend.writeReserved("", "log.md", "# Log\n\n- two\n", { expectedVersion: v1 });
      assert.notEqual(v2, v1);
      assert.equal((await backend.readReserved("", "log.md"))!.version, v2);

      // CAS against an ABSENT reserved file is a conflict (current version is "none").
      await assert.rejects(
        () => backend.writeReserved("sub", "log.md", "x", { expectedVersion: v1 }),
        (err: unknown) => err instanceof VersionConflict && err.actual === null,
      );
      // An absent reserved file reads back as null.
      assert.equal(await backend.readReserved("nope", "index.md"), null);
    });
  });
}

test("reserved-file version token is content-addressed and identical across backends", async () => {
  const content = "# Log\n\n## 2026-07-01\n\n- **Update** thing\n";
  let fsV = "";
  await withFsBundle(async (b) => {
    fsV = await b.backend!.writeReserved("", "log.md", content);
  });
  const memV = await new MemoryBackend().writeReserved("", "log.md", content);
  assert.equal(memV, fsV); // same bytes ⇒ same token, regardless of backend
  assert.equal(fsV, versionOfBytes(content)); // and it is exactly the content-address of the bytes
});

/**
 * A {@link MemoryBackend} that fires a one-shot side effect right AFTER a `log.md`
 * read — simulating a concurrent writer that mutates the file between another
 * caller's read and its compare-and-swap write. Used to prove `appendLog`'s
 * read-CAS-write retry never loses the racing entry.
 */
class RacingMemoryBackend extends MemoryBackend {
  private pending: (() => Promise<void>) | null = null;
  /** Arm a one-shot concurrent write to run right after the next `log.md` read. */
  armRace(action: () => Promise<void>): void {
    this.pending = action;
  }
  override async readReserved(dir: string, name: ReservedFilename): Promise<ReservedReadResult | null> {
    const result = await super.readReserved(dir, name);
    if (name === "log.md" && this.pending) {
      const action = this.pending;
      this.pending = null; // one-shot: the injected read below won't re-trigger
      await action();
    }
    return result; // the PRE-race snapshot — its version is now stale
  }
}

test("appendLog resolves a concurrent-writer conflict via read-CAS-write retry (no lost update)", async () => {
  const backend = new RacingMemoryBackend();
  const bundle: Bundle = { root: "mem://race", backend };
  const when = new Date("2026-07-01T00:00:00.000Z");

  await appendLog(bundle, { dir: "", entry: "first entry", when });

  // A concurrent writer appends a line AFTER appendLog reads but BEFORE it writes, so
  // appendLog's expectedVersion goes stale → its CAS write conflicts → it re-reads and retries.
  backend.armRace(async () => {
    const cur = (await backend.readReserved("", "log.md"))!.content;
    await backend.writeReserved("", "log.md", cur + "- RACED entry\n");
  });

  await appendLog(bundle, { dir: "", entry: "second entry", when });

  const log = (await backend.readReserved("", "log.md"))!.content;
  // A naive read-modify-write would have overwritten the racing entry; the CAS retry preserves it.
  assert.match(log, /RACED entry/);
  assert.match(log, /first entry/);
  assert.match(log, /second entry/);
});

test("appendLog resolves a concurrent-writer CREATE race via expect-absent CAS (no lost update)", async () => {
  const backend = new RacingMemoryBackend();
  const bundle: Bundle = { root: "mem://race-create", backend };
  const when = new Date("2026-07-01T00:00:00.000Z");

  // Arm a race that fires on appendLog's FIRST read (which sees the file absent), and
  // concurrently CREATES log.md before appendLog's own expect-absent write lands. Before
  // `expectedVersion: null` this create race was unguarded (the first-ever create was
  // unconditional): appendLog's write would have silently clobbered the racer's file.
  backend.armRace(async () => {
    await backend.writeReserved("", "log.md", "# Log\n\n- RACED create\n");
  });

  await appendLog(bundle, { dir: "", entry: "first entry", when });

  const log = (await backend.readReserved("", "log.md"))!.content;
  assert.match(log, /RACED create/);
  assert.match(log, /first entry/);
});

/** Inject a one-shot competing `index.md` write after a read returns its snapshot. */
class RacingIndexMemoryBackend extends MemoryBackend {
  private pending: (() => Promise<void>) | null = null;
  listCalls = 0;
  readManyCalls = 0;
  indexReads = 0;

  armRace(action: () => Promise<void>): void {
    this.pending = action;
  }

  override async list(prefix?: string) {
    this.listCalls += 1;
    return super.list(prefix);
  }

  override async readMany(ids: string[]) {
    this.readManyCalls += 1;
    return super.readMany(ids);
  }

  override async readReserved(dir: string, name: ReservedFilename): Promise<ReservedReadResult | null> {
    const result = await super.readReserved(dir, name);
    if (name === "index.md") {
      this.indexReads += 1;
      if (this.pending) {
        const action = this.pending;
        this.pending = null;
        await action();
      }
    }
    return result;
  }
}

test("regenerateIndex retries an existing-index conflict against the fresh root version", async () => {
  const backend = new RacingIndexMemoryBackend();
  const bundle: Bundle = { root: "mem://index-race", backend };
  await writeDoc(bundle, {
    id: "alpha",
    frontmatter: { type: "Concept", title: "Alpha", timestamp: T_DOC },
    body: "Alpha body.",
  });
  await backend.writeReserved("", "index.md", "---\nokf_version: '0.4'\n---\n# stale root\n");

  backend.armRace(async () => {
    await writeDoc(bundle, {
      id: "beta",
      frontmatter: { type: "Concept", title: "Beta", timestamp: T_DOC },
      body: "Beta body.",
    });
    await backend.writeReserved("", "index.md", "---\nokf_version: '0.9'\n---\n# racing root\n");
  });

  const result = await regenerateIndex(bundle);

  assert.equal(backend.indexReads, 2, "the stale CAS must retry against a fresh index snapshot");
  assert.equal(backend.listCalls, 1, "an index conflict must not repeat the concept scan");
  assert.equal(backend.readManyCalls, 1, "an index conflict must not repeat the concept batch read");
  const persisted = (await backend.readReserved("", "index.md"))!.content;
  assert.equal(result, persisted, "the receipt must be the actual final content written");
  assert.match(persisted, /okf_version: ['"]?0\.9['"]?/);
  assert.match(persisted, /\* \[Alpha\]\(alpha\.md\)/);
  assert.doesNotMatch(persisted, /Beta/, "the deliberate one-scan policy does not rescan on an index retry");

  const healed = await regenerateIndex(bundle);
  assert.match(healed, /\* \[Beta\]\(beta\.md\)/, "the next regeneration self-heals a concurrent concept write");
});

test("regenerateIndex retries an absent-to-created index race without clobbering its root version", async () => {
  const backend = new RacingIndexMemoryBackend();
  const bundle: Bundle = { root: "mem://index-create-race", backend };
  await writeDoc(bundle, {
    id: "alpha",
    frontmatter: { type: "Concept", title: "Alpha", timestamp: T_DOC },
    body: "Alpha body.",
  });

  backend.armRace(async () => {
    await backend.writeReserved("", "index.md", "---\nokf_version: '0.8'\n---\n# concurrently created root\n");
  });

  const result = await regenerateIndex(bundle);

  assert.equal(backend.indexReads, 2, "the expect-absent conflict must retry against the created index");
  assert.equal(backend.listCalls, 1, "a create race must not repeat the concept scan");
  assert.equal(backend.readManyCalls, 1, "a create race must not repeat the concept batch read");
  const persisted = (await backend.readReserved("", "index.md"))!.content;
  assert.equal(result, persisted, "the receipt must be the actual final content written");
  assert.match(persisted, /okf_version: ['"]?0\.8['"]?/);
  assert.match(persisted, /\* \[Alpha\]\(alpha\.md\)/);
});

// ── path-traversal regression (P1 finding): the backend seam must guard ids/dirs ──
//
// `FilesystemBackend` performs its own id/dir validation now (`assertSafeConceptId` /
// `assertSafeReservedDir` from `paths.ts`, called before any path is realized), and
// `MemoryBackend` rejects the SAME unsafe ids/dirs for contract parity (an unsafe id is
// harmless against a plain Map key, but the two adapters must agree on rejecting it, or
// the dual-backend/wire contract tests above would diverge). These ids are synthesized,
// defanged strings — no real file on disk is ever touched by a passing test here.

/** A parent-dir-escaping id, an absolute id, and a mixed sub + parent-dir-escape id. */
const UNSAFE_CONCEPT_IDS = ["../../../../etc/passwd", "/etc/passwd", "concepts/../../../etc/passwd"];

/** Same shapes, but for the reserved-file `dir` argument (`""` = bundle root is separately valid). */
const UNSAFE_RESERVED_DIRS = ["../../../../tmp", "/tmp", "sub/../../../tmp"];

for (const [name, run] of RUNNERS) {
  test(`${name}: read/write/exists/versions reject an unsafe concept id (not silently resolved)`, async () => {
    await run(async (bundle) => {
      const backend = bundle.backend!;
      const okDoc: OkfDocument = { id: "placeholder", frontmatter: { type: "T", timestamp: T_DOC }, body: "x" };
      for (const evilId of UNSAFE_CONCEPT_IDS) {
        await assert.rejects(() => backend.read(evilId), /concept id/i, `read('${evilId}') must reject`);
        await assert.rejects(
          () => backend.write(evilId, { ...okDoc, id: evilId }),
          /concept id/i,
          `write('${evilId}') must reject`,
        );
        await assert.rejects(() => backend.versions(evilId), /concept id/i, `versions('${evilId}') must reject`);
        await assert.rejects(() => backend.exists(evilId), /concept id/i, `exists('${evilId}') must reject`);
        await assert.rejects(
          () => backend.readMany(["placeholder-ok-if-it-existed", evilId]),
          /concept id/i,
          `readMany([..., '${evilId}']) must reject`,
        );
      }
    });
  });

  test(`${name}: readReserved/writeReserved reject an unsafe dir (not silently resolved)`, async () => {
    await run(async (bundle) => {
      const backend = bundle.backend!;
      for (const evilDir of UNSAFE_RESERVED_DIRS) {
        await assert.rejects(
          () => backend.readReserved(evilDir, "log.md"),
          /directory/i,
          `readReserved('${evilDir}', ...) must reject`,
        );
        await assert.rejects(
          () => backend.writeReserved(evilDir, "log.md", "# Log\n"),
          /directory/i,
          `writeReserved('${evilDir}', ...) must reject`,
        );
      }
      // The bundle root itself ("") stays valid — the guard must not overreach.
      assert.equal(await backend.readReserved("", "log.md"), null);
    });
  });
}

test("path traversal: FilesystemBackend never creates a file outside its root for an unsafe id", async () => {
  // Belt-and-suspenders proof: even setting aside the upstream id guard, no write for any
  // of these ids leaves a byte on disk outside the temp bundle root.
  await withFsBundle(async (bundle) => {
    const backend = bundle.backend!;
    for (const evilId of UNSAFE_CONCEPT_IDS) {
      await assert.rejects(() =>
        backend.write(evilId, { id: evilId, frontmatter: { type: "T", timestamp: T_DOC }, body: "pwned" }),
      );
    }
    // Sanity: a SAFE sibling write still lands exactly inside the bundle root.
    await backend.write("safe/doc", { id: "safe/doc", frontmatter: { type: "T", timestamp: T_DOC }, body: "ok" });
    const raw = await readFile(path.join(bundle.root, "safe/doc.md"), "utf8");
    assert.match(raw, /ok/);
  });
});

test("CLI doc-read --out byte channel: the id guard runs BEFORE the abs path is built or fs is touched", async () => {
  // Mirrors `packages/cli/src/commands/doc.ts`'s byte-channel `runToTarget()`: it calls
  // `assertSafeConceptId(id)` before `pathFromConceptId`/`path.join` ever run, so a
  // traversal id is rejected without the raw-bytes read path ever reaching `fs.readFile`
  // (that command bypasses `readDoc`, so it must apply the SAME guard core applies).
  let fsReadFileCalls = 0;
  const guardedByteChannelRead = async (bundleRoot: string, id: string): Promise<Buffer> => {
    assertSafeConceptId(id); // <-- the fix: must run before any path is realized
    const rel = pathFromConceptId(id);
    const abs = path.join(bundleRoot, rel);
    fsReadFileCalls++;
    return readFile(abs);
  };

  const fakeBundleRoot = "/tmp/does-not-matter-for-this-test";
  for (const evilId of UNSAFE_CONCEPT_IDS) {
    await assert.rejects(
      () => guardedByteChannelRead(fakeBundleRoot, evilId),
      /concept id/i,
      `doc read --out must reject '${evilId}'`,
    );
  }
  assert.equal(fsReadFileCalls, 0, "a rejected id must never reach fs.readFile");
});

test("FilesystemBackend: concurrent unconditional writes to the SAME id never crash with ENOENT on rename (temp-filename collision, found by the CLI --remote multi-writer test)", async () => {
  // `atomicWrite` (backend.ts) used to name its temp file `.{basename}.{pid}.{Date.now()}.tmp`.
  // Many concurrent writes to the SAME target within one process can share a pid AND a
  // millisecond, so two writers could pick the IDENTICAL temp path: the second writer's
  // `fs.writeFile` silently clobbers the first's (same file), then the FIRST writer's
  // `fs.rename` succeeds and removes it, and the SECOND writer's `fs.rename` then fails with
  // ENOENT because its temp file no longer exists. This only needs write VOLUME on one id, not
  // CAS (unconditional writes hit the exact same `atomicWrite` code path), so it is reproduced
  // directly here rather than through the CAS retry machinery.
  await withFsBundle(async (bundle) => {
    const backend = bundle.backend!;
    const attempts = 40;
    const results = await Promise.allSettled(
      Array.from({ length: attempts }, (_, i) =>
        backend.write("hot/doc", { id: "hot/doc", frontmatter: { type: "T", timestamp: T_DOC }, body: `v${i}` }),
      ),
    );
    const rejected = results.filter((r) => r.status === "rejected");
    assert.deepEqual(rejected, [], `expected all ${attempts} concurrent writes to settle without throwing`);
    // The doc must land in a fully-written, non-corrupt state (whichever write landed last).
    const raw = await readFile(path.join(bundle.root, "hot/doc.md"), "utf8");
    assert.match(raw, /^v\d+$/m);
  });
});

test("FilesystemBackend: N concurrent CAS writes to the SAME id, same-process, produce exactly ONE winner and N-1 typed VersionConflicts (per-key mutex closes the check-then-write race)", async () => {
  // Before the per-key mutex in `FilesystemBackend` (`backend.ts`'s `locks`/`withLock`), this
  // test FAILED: `currentVersionAt` (the CAS check) and `atomicWrite` (the write) are separated
  // by two `await`s, so N concurrent writers racing the SAME `expectedVersion` could all read the
  // same pre-write version, all pass the check, and all proceed to write — a silent lost update
  // with EVERY writer reporting success and ZERO `VersionConflict`s thrown. Confirmed by
  // temporarily reverting the mutex and re-running: `fulfilled.length` came back > 1 (multiple
  // "winners") and some runs saw ZERO rejections at all, exactly the "silent lost update, no
  // conflict ever thrown" symptom this pass fixes. With the mutex, each write's full
  // check-then-write critical section is serialized per resolved path, so only the FIRST writer
  // to actually run can observe the shared `expectedVersion` as current; every other writer's
  // critical section runs after the doc has already moved on, so it genuinely conflicts.
  await withFsBundle(async (bundle) => {
    const backend = bundle.backend!;
    const base: OkfDocument = { id: "hot/cas", frontmatter: { type: "T", timestamp: T_DOC }, body: "base" };
    const baseVersion = await backend.write("hot/cas", base); // unconditional create establishes v0

    const N = 10;
    const results = await Promise.allSettled(
      Array.from({ length: N }, (_, i) =>
        backend.write("hot/cas", { ...base, body: `v${i}` }, { expectedVersion: baseVersion }),
      ),
    );

    const fulfilled = results.filter((r): r is PromiseFulfilledResult<Version> => r.status === "fulfilled");
    const rejected = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
    assert.equal(fulfilled.length, 1, "exactly one CAS write racing the same expectedVersion must win");
    assert.equal(rejected.length, N - 1, "every other racer must observe a genuine conflict, not silent loss");
    for (const r of rejected) {
      assert.ok(r.reason instanceof VersionConflict, `expected a VersionConflict, got ${String(r.reason)}`);
      assert.equal(r.reason.expected, baseVersion);
    }

    // The on-disk doc reflects EXACTLY the winner's write — not a torn/mixed state.
    const final = await backend.read("hot/cas");
    assert.equal(final.version, fulfilled[0]!.value);
  });
});

test("FilesystemBackend: N concurrent UNCONDITIONAL writes to the SAME id, same-process, all settle and the final doc is exactly one writer's full body (no crash, no lost temp file, no torn write)", async () => {
  await withFsBundle(async (bundle) => {
    const backend = bundle.backend!;
    const N = 12;
    const bodies = Array.from({ length: N }, (_, i) => `unconditional-v${i}`);
    const results = await Promise.allSettled(
      bodies.map((body) => backend.write("hot/last-writer", { id: "hot/last-writer", frontmatter: { type: "T", timestamp: T_DOC }, body })),
    );
    assert.deepEqual(results.filter((r) => r.status === "rejected"), []);

    // `stringifyDoc` appends a trailing newline to the body on round-trip; trim before comparing.
    const finalBody = (await backend.read("hot/last-writer")).doc.body.trimEnd();
    assert.ok(bodies.includes(finalBody), `final body '${finalBody}' must be exactly one writer's full, untorn body`);
  });
});

test("query tolerates a doc deleted between list and read (multi-writer scan race — hardening for the usability-round finding)", async () => {
  // The race: list() reports [a,b,c], but by the time the batch read runs, `b` has been deleted by a
  // concurrent writer, so readMany throws ENOENT. query() must SKIP the vanished doc and return the
  // survivors [a,c] — NOT fail the whole scan with an internal not-found (the exact multi-writer
  // read-side bug a usability round observed: a concurrent delete mid-scan surfaced a RUNTIME error).
  const enoent = (id: string): NodeJS.ErrnoException => {
    const e = new Error(`no concept document '${id}'`) as NodeJS.ErrnoException;
    e.code = "ENOENT";
    return e;
  };
  const surviving: Record<string, OkfDocument> = {
    a: { id: "a", frontmatter: { type: "T" }, body: "" },
    c: { id: "c", frontmatter: { type: "T" }, body: "" },
  };
  let readManyCalls = 0;
  const backend = {
    async list() {
      return ["a", "b", "c"];
    },
    async readMany() {
      readManyCalls++;
      throw enoent("b");
    },
    async read(id: string) {
      const d = surviving[id];
      if (!d) throw enoent(id);
      return { doc: d, version: "sha256:stub" };
    },
  } as unknown as StorageBackend;

  const result = await query({ root: "mem://race", backend });
  assert.deepEqual(
    result.map((d) => d.id),
    ["a", "c"],
  );
  assert.equal(readManyCalls, 1); // one-round-trip path tried first, then the per-doc skip fallback
});

test("query still propagates a NON-ENOENT backend error (the skip-fallback is scoped to vanished docs, not real failures)", async () => {
  const boom = new Error("backend exploded"); // no `.code` — a genuine failure, not a vanished doc
  const backend = {
    async list() {
      return ["a"];
    },
    async readMany() {
      throw boom;
    },
    async read() {
      throw boom;
    },
  } as unknown as StorageBackend;
  await assert.rejects(() => query({ root: "mem://boom", backend }), /backend exploded/);
});

// ── mutation-survivor pins (core-survivor-triage unit) ────────────────────────
// Red-proven pins for Stryker survivors from the first full core mutation report.

// kills: backend.ts:143:9 ConditionalExpression #54
// kills: backend.ts:143:9 MethodExpression #55
// kills: backend.ts:147:16 ConditionalExpression #65
// kills: backend.ts:147:16 LogicalOperator #67
// kills: backend.ts:147:54 StringLiteral #69
// kills: backend.ts:169:16 ConditionalExpression #87
// kills: backend.ts:169:16 LogicalOperator #89
// kills: backend.ts:169:35 MethodExpression #91
// kills: backend.ts:169:35 MethodExpression #92
test("pin: FilesystemBackend walks list only visible .md docs and only visible non-.md blobs (case-insensitive .md exclusion)", async () => {
  await withFsBundle(async (bundle) => {
    const { writeFile } = await import("node:fs/promises");
    await writeDoc(bundle, { id: "docs/a", frontmatter: { type: "Concept", timestamp: T_DOC }, body: "x" });
    await writeFile(path.join(bundle.root, "notes.txt"), "plain bytes");
    await writeFile(path.join(bundle.root, ".hidden.md"), "---\ntype: Concept\n---\nhidden");
    await writeFile(path.join(bundle.root, "REPORT.MD"), "raw"); // .MD: not a doc (case-sensitive walk), not a blob (case-INSENSITIVE exclusion)

    assert.deepEqual(await bundle.backend.list(), ["docs/a"]);
    assert.deepEqual(await bundle.backend.listBlobs(), ["notes.txt"]);
  });
});

// kills: backend.ts:374:11 ConditionalExpression #179
// kills: memory-backend.ts:163:17 MethodExpression #2429
// kills: memory-backend.ts:163:56 ConditionalExpression #2432
for (const [name, run] of RUNNERS) {
  test(`pin: ${name}: list honors a prefix filter`, async () => {
    await run(async (bundle) => {
      await writeDoc(bundle, { id: "alpha/x", frontmatter: { type: "Concept", timestamp: T_DOC }, body: "" });
      await writeDoc(bundle, { id: "beta/y", frontmatter: { type: "Concept", timestamp: T_DOC }, body: "" });
      assert.deepEqual(await bundle.backend.list("alpha/"), ["alpha/x"]);
    });
  });
}

// kills: memory-backend.ts:164:5 MethodExpression #2437
// kills: memory-backend.ts:164:14 ArrowFunction #2438
// kills: memory-backend.ts:269:5 MethodExpression #2518
// kills: memory-backend.ts:269:15 ArrowFunction #2519
test("pin: MemoryBackend list and listBlobs are lexicographically sorted regardless of write order", async () => {
  const backend = new MemoryBackend();
  await backend.write("b", { id: "b", frontmatter: { type: "Concept", timestamp: T_DOC }, body: "" });
  await backend.write("a", { id: "a", frontmatter: { type: "Concept", timestamp: T_DOC }, body: "" });
  await backend.writeBlob("b.bin", new TextEncoder().encode("b"));
  await backend.writeBlob("a.bin", new TextEncoder().encode("a"));
  assert.deepEqual(await backend.list(), ["a", "b"]);
  assert.deepEqual(await backend.listBlobs(), ["a.bin", "b.bin"]);
});

// kills: backend.ts:58:9 ConditionalExpression #2
// kills: backend.ts:58:34 ConditionalExpression #8
// kills: backend.ts:58:34 MethodExpression #10
// kills: backend.ts:58:47 StringLiteral #11
// kills: backend.ts:357:19 LogicalOperator #168
test("pin: FilesystemBackend versions() derives actor from updated_by/actor with type+trim guards, else defaultActor", async () => {
  await withFsBundle(async (bundle) => {
    const { writeFile } = await import("node:fs/promises");
    const cases: Array<[string, string, string]> = [
      ["a", 'updated_by: "alice"', "alice"],
      ["b", "updated_by: 42", defaultActor()],
      ["c", 'updated_by: "   "', defaultActor()],
      ["d", "", defaultActor()],
      ["e", 'actor: "bob"', "bob"],
    ];
    for (const [id, line, expected] of cases) {
      const fm = ["type: Concept", `timestamp: "${T_DOC}"`, line].filter(Boolean).join("\n");
      await writeFile(path.join(bundle.root, `${id}.md`), `---\n${fm}\n---\nbody\n`);
      const history = await bundle.backend.versions(id);
      assert.equal(history[0]?.actor, expected, `id '${id}'`);
    }
  });
});

// kills: memory-backend.ts:131:14 MethodExpression #2401
// kills: memory-backend.ts:134:14 MethodExpression #2406
test("pin: MemoryBackend trims write attribution — whitespace-only actor falls back, whitespace-only agent is omitted", async () => {
  const backend = new MemoryBackend();
  await backend.write("a", { id: "a", frontmatter: { type: "Concept", timestamp: T_DOC }, body: "" }, { actor: "   " });
  assert.equal((await backend.versions("a"))[0]?.actor, defaultActor());
  await backend.write("b", { id: "b", frontmatter: { type: "Concept", timestamp: T_DOC }, body: "" }, { actor: "x", agent: "   " });
  assert.equal((await backend.versions("b"))[0]?.agent, undefined);
});

// kills: backend.ts:178:34 Regex #96
// kills: backend.ts:178:44 StringLiteral #98
// kills: memory-backend.ts:84:34 Regex #2364
// kills: memory-backend.ts:84:44 StringLiteral #2366
// kills: memory-backend.ts:84:56 Regex #2367
// kills: memory-backend.ts:84:63 StringLiteral #2368
for (const [name, run] of RUNNERS) {
  test(`pin: ${name}: reserved-file dir spellings './x', 'x/', and 'x' address the SAME file`, async () => {
    await run(async (bundle) => {
      await bundle.backend.writeReserved("sub/nested", "index.md", "nested-index");
      assert.equal((await bundle.backend.readReserved("sub/nested", "index.md"))?.content, "nested-index");
      assert.equal((await bundle.backend.readReserved("./sub/nested", "index.md"))?.content, "nested-index");
      assert.equal((await bundle.backend.readReserved("sub/nested/", "index.md"))?.content, "nested-index");
      await bundle.backend.writeReserved("", "log.md", "root-log");
      assert.equal((await bundle.backend.readReserved("", "log.md"))?.content, "root-log");
    });
  });
}
