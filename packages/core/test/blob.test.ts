/**
 * Contract tests for blob storage on the {@link StorageBackend} seam (Stage-1 Unit 2a
 * Part A — core + seam): opaque bytes + a content-type, addressed by a bundle-relative
 * key DISJOINT from the concept-document namespace, versioned by a RAW-BYTES content
 * hash (never the doc-shaped `contentVersion`/`versionOfBytes`), CAS-able via the same
 * `WriteOptions` concept documents use, guarded against traversal / `.md` collision /
 * dot-prefixed segments at every op.
 *
 * Dual-adapter here (FilesystemBackend + MemoryBackend) by design — `RemoteBackend`'s
 * blob methods are REAL as of Part B (wire-protocol v0.1), but its tri-adapter parity,
 * CAS-over-HTTP, and traversal-guard coverage lives in `wire-protocol.test.ts` (it
 * needs the reference router as a transport, which this file deliberately does not
 * depend on).
 *
 * Mirrors `dual-backend.test.ts`'s RUNNERS pattern so every parity assertion runs
 * identically over both adapters.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { writeDoc, list, readBlob, writeBlob, existsBlob, listBlobs, deleteBlob } from "../src/bundle.js";
import { FilesystemBackend } from "../src/backend.js";
import { MemoryBackend } from "../src/memory-backend.js";
import { blobVersion, VersionConflict } from "../src/versioning.js";
import { assertSafeBlobKey } from "../src/paths.js";
import { resolveContentType } from "../src/content-type.js";
import type { Bundle, Version } from "../src/types.js";
import { T_DOC } from "./scenario.js";

/** Run `fn` against a bundle over a fresh temp-dir FilesystemBackend, then clean up. */
async function withFsBundle(fn: (bundle: Bundle) => Promise<void>): Promise<void> {
  const root = await mkdtemp(path.join(tmpdir(), "okf-blob-fs-"));
  try {
    await fn({ root, backend: new FilesystemBackend(root) });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

/** Run `fn` against a bundle over a fresh MemoryBackend (its `root` is inert). */
async function withMemBundle(fn: (bundle: Bundle) => Promise<void>): Promise<void> {
  await fn({ root: "mem://blob-bundle", backend: new MemoryBackend() });
}

/** The two Part-A adapters, driven through the identical runner shape. */
const RUNNERS = [
  ["FilesystemBackend", withFsBundle],
  ["MemoryBackend", withMemBundle],
] as const;

const enc = (s: string) => new TextEncoder().encode(s);

/** Bytes 0x00-0xFF, including invalid-UTF-8 sequences — the B1 binary-fidelity fixture. */
const BINARY_FIXTURE = new Uint8Array(256);
for (let i = 0; i < 256; i++) BINARY_FIXTURE[i] = i;

// ── parity: write/read/exists/list round-trip across both adapters ───────────

for (const [name, run] of RUNNERS) {
  test(`${name}: blob write/read/exists/list round-trip`, async () => {
    await run(async (bundle) => {
      assert.equal(await existsBlob(bundle, "artifacts/report.html"), false);
      assert.equal(await readBlob(bundle, "artifacts/report.html"), null);

      const bytes = enc("<html><body>hi</body></html>");
      const v1 = await writeBlob(bundle, "artifacts/report.html", bytes, "text/html; charset=utf-8");
      assert.match(v1, /^sha256:[0-9a-f]{64}$/);

      assert.equal(await existsBlob(bundle, "artifacts/report.html"), true);
      const read = await readBlob(bundle, "artifacts/report.html");
      assert.ok(read);
      assert.deepEqual([...read!.bytes], [...bytes]);
      assert.equal(read!.version, v1);

      assert.deepEqual(await listBlobs(bundle, "artifacts/"), ["artifacts/report.html"]);
      assert.equal(await readBlob(bundle, "nope/absent.bin"), null);
    });
  });

  test(`${name}: BINARY FIXTURE (0x00-0xFF, invalid UTF-8) round-trips byte-identical (B1 regression)`, async () => {
    await run(async (bundle) => {
      const v1 = await writeBlob(bundle, "artifacts/binary.dat", BINARY_FIXTURE);
      const read = await readBlob(bundle, "artifacts/binary.dat");
      assert.ok(read);
      assert.deepEqual([...read!.bytes], [...BINARY_FIXTURE]);
      assert.equal(read!.version, v1);
      assert.equal(read!.version, blobVersion(BINARY_FIXTURE));
    });
  });
}

test("blob version token is byte-identical across FilesystemBackend and MemoryBackend for the SAME bytes", async () => {
  let fsVersion = "";
  await withFsBundle(async (bundle) => {
    fsVersion = await writeBlob(bundle, "artifacts/binary.dat", BINARY_FIXTURE);
  });
  let memVersion = "";
  await withMemBundle(async (bundle) => {
    memVersion = await writeBlob(bundle, "artifacts/binary.dat", BINARY_FIXTURE);
  });
  assert.equal(fsVersion, memVersion);
  assert.equal(fsVersion, blobVersion(BINARY_FIXTURE));
});

// ── raw-bytes versioning: a SEPARATE primitive from the doc-shaped hashes (B1) ─

test("blobVersion hashes RAW bytes with no string/UTF-8 step (binary fidelity)", () => {
  // A lone continuation byte (0x80) is INVALID UTF-8 — routed through a string-based
  // hash it would decode to U+FFFD before hashing, silently colliding with any other
  // byte sequence that decodes the same lossy way. blobVersion must never do that.
  const invalidUtf8 = new Uint8Array([0x80, 0x81, 0xff, 0x00, 0x01]);
  const v = blobVersion(invalidUtf8);
  assert.match(v, /^sha256:[0-9a-f]{64}$/);
  const other = new Uint8Array([0x80, 0x82, 0xff, 0x00, 0x01]);
  assert.notEqual(v, blobVersion(other), "distinct byte sequences must hash to distinct versions");
});

// ── CAS + expect-absent ────────────────────────────────────────────────────

for (const [name, run] of RUNNERS) {
  test(`${name}: writeBlob CAS rejects a stale expectedVersion`, async () => {
    await run(async (bundle) => {
      const v1 = await writeBlob(bundle, "artifacts/x.bin", enc("v1"));
      const v2 = await writeBlob(bundle, "artifacts/x.bin", enc("v2")); // unconditional overwrite
      assert.notEqual(v1, v2);

      await assert.rejects(
        () => writeBlob(bundle, "artifacts/x.bin", enc("v3"), undefined, { expectedVersion: v1 }),
        (err: unknown) => {
          assert.ok(err instanceof VersionConflict);
          assert.equal(err.expected, v1);
          assert.equal(err.actual, v2);
          return true;
        },
      );
      assert.equal((await readBlob(bundle, "artifacts/x.bin"))!.version, v2); // unmutated

      const v3 = await writeBlob(bundle, "artifacts/x.bin", enc("v3"), undefined, { expectedVersion: v2 });
      assert.notEqual(v3, v2);
      assert.equal((await readBlob(bundle, "artifacts/x.bin"))!.version, v3);

      // CAS against a not-yet-existing blob is a conflict (current version is "none").
      await assert.rejects(
        () => writeBlob(bundle, "artifacts/ghost.bin", enc("x"), undefined, { expectedVersion: v1 }),
        (err: unknown) => err instanceof VersionConflict && err.actual === null,
      );
    });
  });

  test(`${name}: writeBlob honors expectedVersion: null as expect-absent create`, async () => {
    await run(async (bundle) => {
      const v1 = await writeBlob(bundle, "artifacts/fresh.bin", enc("one"), undefined, { expectedVersion: null });
      assert.match(v1, /^sha256:[0-9a-f]{64}$/);
      assert.equal((await readBlob(bundle, "artifacts/fresh.bin"))!.version, v1);

      await assert.rejects(
        () => writeBlob(bundle, "artifacts/fresh.bin", enc("two"), undefined, { expectedVersion: null }),
        (err: unknown) => {
          assert.ok(err instanceof VersionConflict);
          assert.equal(err.expected, null);
          assert.equal(err.actual, v1);
          return true;
        },
      );
      assert.equal((await readBlob(bundle, "artifacts/fresh.bin"))!.version, v1); // unmutated
    });
  });
}

// ── concurrent CAS writers (B3) ────────────────────────────────────────────

test("FilesystemBackend: N concurrent CAS blob writes to the SAME key produce exactly ONE winner and N-1 typed VersionConflicts (writeBlob's check-then-write runs inside the SAME per-key mutex as docs)", async () => {
  await withFsBundle(async (bundle) => {
    const baseVersion = await writeBlob(bundle, "hot/cas.bin", enc("base"));

    const N = 10;
    const results = await Promise.allSettled(
      Array.from({ length: N }, (_, i) =>
        writeBlob(bundle, "hot/cas.bin", enc(`v${i}`), undefined, { expectedVersion: baseVersion }),
      ),
    );

    const fulfilled = results.filter((r): r is PromiseFulfilledResult<Version> => r.status === "fulfilled");
    const rejected = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
    assert.equal(fulfilled.length, 1, "exactly one CAS blob write racing the same expectedVersion must win");
    assert.equal(rejected.length, N - 1, "every other racer must observe a genuine conflict, not silent loss");
    for (const r of rejected) {
      assert.ok(r.reason instanceof VersionConflict, `expected a VersionConflict, got ${String(r.reason)}`);
      assert.equal(r.reason.expected, baseVersion);
    }

    const final = await readBlob(bundle, "hot/cas.bin");
    assert.equal(final!.version, fulfilled[0]!.value);
  });
});

// ── delete (DELETE operation, symmetric with dual-backend.test.ts's doc-delete coverage) ──

for (const [name, run] of RUNNERS) {
  test(`${name}: deleteBlob removes a present blob (true), and afterward readBlob/existsBlob/listBlobs all agree it's gone; a re-delete is idempotent (false)`, async () => {
    await run(async (bundle) => {
      await writeBlob(bundle, "artifacts/gone.bin", enc("bye"));
      assert.equal(await existsBlob(bundle, "artifacts/gone.bin"), true);

      assert.equal(await deleteBlob(bundle, "artifacts/gone.bin"), true);

      assert.equal(await readBlob(bundle, "artifacts/gone.bin"), null);
      assert.equal(await existsBlob(bundle, "artifacts/gone.bin"), false);
      assert.deepEqual(await listBlobs(bundle, "artifacts/"), []);

      assert.equal(await deleteBlob(bundle, "artifacts/gone.bin"), false); // idempotent
    });
  });

  test(`${name}: deleteBlob on a NEVER-WRITTEN key is a no-op (false), not an error`, async () => {
    await run(async (bundle) => {
      assert.equal(await deleteBlob(bundle, "never/written.bin"), false);
    });
  });

  test(`${name}: deleteBlob honors expectedVersion CAS — match succeeds, a stale (present but mismatched) version conflicts, and an ABSENT key returns false regardless of expectedVersion`, async () => {
    await run(async (bundle) => {
      const v1 = await writeBlob(bundle, "artifacts/cas-delete.bin", enc("v1"));
      const v2 = await writeBlob(bundle, "artifacts/cas-delete.bin", enc("v2"));
      assert.notEqual(v1, v2);

      await assert.rejects(
        () => deleteBlob(bundle, "artifacts/cas-delete.bin", { expectedVersion: v1 }),
        (err: unknown) => {
          assert.ok(err instanceof VersionConflict);
          assert.equal(err.expected, v1);
          assert.equal(err.actual, v2);
          return true;
        },
      );
      assert.equal(await existsBlob(bundle, "artifacts/cas-delete.bin"), true); // unmutated

      assert.equal(await deleteBlob(bundle, "artifacts/cas-delete.bin", { expectedVersion: v2 }), true);
      assert.equal(await existsBlob(bundle, "artifacts/cas-delete.bin"), false);

      // Now ABSENT: any expectedVersion (even a plausible stale one) returns false, never a conflict.
      assert.equal(await deleteBlob(bundle, "artifacts/cas-delete.bin", { expectedVersion: v1 }), false);
    });
  });

  test(`${name}: deleteBlob rejects every unsafe key shape (guard applies to delete too, I1)`, async () => {
    await run(async (bundle) => {
      for (const key of UNSAFE_BLOB_KEYS) {
        await assert.rejects(() => deleteBlob(bundle, key), /blob key/i, `deleteBlob('${key}') must reject`);
      }
    });
  });
}

test("FilesystemBackend: N concurrent CAS blob deletes racing the SAME expectedVersion converge to exactly ONE true winner and N-1 idempotent false losers (never a VersionConflict)", async () => {
  await withFsBundle(async (bundle) => {
    const baseVersion = await writeBlob(bundle, "hot/cas-delete.bin", enc("base"));

    const N = 10;
    const results = await Promise.allSettled(
      Array.from({ length: N }, () => deleteBlob(bundle, "hot/cas-delete.bin", { expectedVersion: baseVersion })),
    );
    assert.deepEqual(results.filter((r) => r.status === "rejected"), []);
    const values = results.map((r) => (r as PromiseFulfilledResult<boolean>).value);
    assert.equal(values.filter((v) => v === true).length, 1);
    assert.equal(values.filter((v) => v === false).length, N - 1);
    assert.equal(await existsBlob(bundle, "hot/cas-delete.bin"), false);
  });
});

// ── guards: traversal, .md (incl. case-insensitive), reserved names, dot-segments (I1) ─

const UNSAFE_BLOB_KEYS = [
  "../../../etc/passwd",
  "/etc/passwd",
  "artifacts/../../../etc/passwd",
  "artifacts/report.md", // collides with the concept-document namespace
  "artifacts/report.MD", // B6: case-insensitive
  "index.md", // reserved filename (subsumed by the .md check)
  "LOG.MD", // reserved filename, upper-case
  ".git/config", // dot-prefixed leading segment
  "artifacts/.hidden.bin", // dot-prefixed non-leading segment
  "artifacts/", // trailing slash, names no file
];

test("assertSafeBlobKey: pure guard rejects every unsafe shape directly", () => {
  for (const key of UNSAFE_BLOB_KEYS) {
    assert.throws(() => assertSafeBlobKey(key), /blob key/i, `assertSafeBlobKey('${key}') must throw`);
  }
  assertSafeBlobKey("artifacts/report.html"); // sanity: a normal key stays valid
});

for (const [name, run] of RUNNERS) {
  test(`${name}: readBlob/writeBlob/existsBlob all reject every unsafe key shape (guard applies to EVERY op, I1)`, async () => {
    await run(async (bundle) => {
      for (const key of UNSAFE_BLOB_KEYS) {
        await assert.rejects(() => readBlob(bundle, key), /blob key/i, `readBlob('${key}') must reject`);
        await assert.rejects(() => writeBlob(bundle, key, enc("x")), /blob key/i, `writeBlob('${key}') must reject`);
        await assert.rejects(() => existsBlob(bundle, key), /blob key/i, `existsBlob('${key}') must reject`);
      }
    });
  });
}

test("FilesystemBackend: an unsafe blob key never creates a file outside the bundle root (belt-and-suspenders)", async () => {
  await withFsBundle(async (bundle) => {
    for (const key of ["../../../../tmp/pwned.bin", "/tmp/pwned.bin"]) {
      await assert.rejects(() => writeBlob(bundle, key, enc("pwned")));
    }
    // Sanity: a SAFE sibling write still lands exactly inside the bundle root.
    await writeBlob(bundle, "safe/blob.bin", enc("ok"));
    assert.equal(await existsBlob(bundle, "safe/blob.bin"), true);
  });
});

// ── listBlobs: prefix filter + dot-entry exclusion (I3) ───────────────────────

for (const [name, run] of RUNNERS) {
  test(`${name}: listBlobs prefix filters to keys starting with the given prefix`, async () => {
    await run(async (bundle) => {
      await writeBlob(bundle, "artifacts/a.bin", enc("a"));
      await writeBlob(bundle, "artifacts/sub/b.bin", enc("b"));
      await writeBlob(bundle, "other/c.bin", enc("c"));

      assert.deepEqual(await listBlobs(bundle, "artifacts/"), ["artifacts/a.bin", "artifacts/sub/b.bin"]);
      assert.deepEqual(await listBlobs(bundle, "other/"), ["other/c.bin"]);
      assert.deepEqual(
        (await listBlobs(bundle)).sort(),
        ["artifacts/a.bin", "artifacts/sub/b.bin", "other/c.bin"].sort(),
      );
    });
  });
}

test("FilesystemBackend: listBlobs skips dot-entries on disk (I3 — the WALK itself excludes atomicWrite-shaped temp files and dotfiles, not just the write-time guard)", async () => {
  await withFsBundle(async (bundle) => {
    await writeBlob(bundle, "artifacts/keep.bin", enc("kept"));
    // Simulate a leftover atomicWrite temp file and a stray dotfile/dot-dir directly on
    // disk (bypassing writeBlob's guard entirely, the way a real leftover would) to prove
    // the LISTING walk itself excludes dot-entries.
    await writeFile(path.join(bundle.root, ".artifacts-keep.bin.12345.deadbeef.tmp"), "leftover");
    await mkdir(path.join(bundle.root, ".git"), { recursive: true });
    await writeFile(path.join(bundle.root, ".git", "config"), "junk");

    assert.deepEqual(await listBlobs(bundle), ["artifacts/keep.bin"]);
  });
});

// ── content-type: ONE resolution point, per-adapter persistence posture (B5) ──

test("resolveContentType: explicit override wins, else inferred from extension, else application/octet-stream (the ONE MIME source)", () => {
  assert.equal(resolveContentType("artifacts/report.html"), "text/html; charset=utf-8");
  assert.equal(resolveContentType("artifacts/report.html", "application/x-custom"), "application/x-custom");
  assert.equal(resolveContentType("artifacts/data.unknownext"), "application/octet-stream");
  assert.equal(resolveContentType("artifacts/noext"), "application/octet-stream");
});

for (const [name, run] of RUNNERS) {
  test(`${name}: writeBlob with NO explicit content-type infers from the key extension identically on both adapters`, async () => {
    await run(async (bundle) => {
      await writeBlob(bundle, "artifacts/report.html", enc("<p>hi</p>"));
      assert.equal((await readBlob(bundle, "artifacts/report.html"))!.contentType, "text/html; charset=utf-8");

      await writeBlob(bundle, "artifacts/data.bin", enc("raw"));
      assert.equal((await readBlob(bundle, "artifacts/data.bin"))!.contentType, "application/octet-stream");
    });
  });
}

test("FilesystemBackend: writeBlob accepts-but-does-NOT-persist an explicit content-type override — readBlob always infers from the key extension (documented divergence, B5)", async () => {
  await withFsBundle(async (bundle) => {
    await writeBlob(bundle, "artifacts/report.html", enc("<p>hi</p>"), "application/x-custom-override");
    const read = await readBlob(bundle, "artifacts/report.html");
    assert.equal(read!.contentType, "text/html; charset=utf-8"); // the override did NOT stick
  });
});

test("MemoryBackend: writeBlob PERSISTS an explicit content-type override — readBlob returns exactly what was stored (documented divergence, B5)", async () => {
  await withMemBundle(async (bundle) => {
    await writeBlob(bundle, "artifacts/report.html", enc("<p>hi</p>"), "application/x-custom-override");
    const read = await readBlob(bundle, "artifacts/report.html");
    assert.equal(read!.contentType, "application/x-custom-override"); // the override DID stick
  });
});

// ── blob-free / blob-carrying bundles: the concept walk never sees blobs ──────

for (const [name, run] of RUNNERS) {
  test(`${name}: a bundle carrying blobs is byte-identical to a blob-free bundle from the concept walk's perspective (list/query never see blobs)`, async () => {
    await run(async (bundle) => {
      await writeDoc(bundle, {
        id: "concepts/alpha",
        frontmatter: { type: "Concept", title: "Alpha", timestamp: T_DOC },
        body: "Alpha.",
      });
      const before = (await list(bundle)).map((d) => d.id);

      await writeBlob(bundle, "artifacts/report.html", enc("<p>hi</p>"));
      await writeBlob(bundle, "artifacts/data.bin", enc("raw"));

      const after = (await list(bundle)).map((d) => d.id);
      assert.deepEqual(after, before);
      assert.deepEqual(after, ["concepts/alpha"]);
    });
  });
}

// RemoteBackend's blob methods are now REAL (wire-protocol v0.1, Stage-1 Unit 2a Part
// B) — the tri-adapter parity, CAS-over-HTTP, and traversal-guard coverage for
// RemoteBackend lives in `wire-protocol.test.ts` (it needs the reference router as a
// transport, which this file deliberately does not depend on). This file stays
// dual-adapter (fs+mem) by design.

// ── unit-review fixes ──────────────────────────────────────────────────────

test("MemoryBackend: writeBlob copies a Buffer's bytes rather than aliasing them — mutating the caller's buffer AFTER the write must not mutate the stored blob (Buffer.prototype.slice() returns a VIEW, not a copy)", async () => {
  const mem = new MemoryBackend();
  const bundle: Bundle = { root: "mem://buffer-alias", backend: mem };
  const original = Buffer.from("original content");
  await writeBlob(bundle, "artifacts/x.bin", original);

  // Mutate the SOURCE buffer in place after the write returned.
  original.fill(0);
  assert.equal(original.toString("utf8"), "\0".repeat(original.length));

  const stored = await readBlob(bundle, "artifacts/x.bin");
  assert.equal(Buffer.from(stored!.bytes).toString("utf8"), "original content");
});

test("MemoryBackend: readBlob returns a copy too — mutating the RETURNED bytes must not mutate the stored blob on a subsequent read", async () => {
  const mem = new MemoryBackend();
  const bundle: Bundle = { root: "mem://buffer-alias-read", backend: mem };
  await writeBlob(bundle, "artifacts/x.bin", Buffer.from("stable"));

  const first = await readBlob(bundle, "artifacts/x.bin");
  first!.bytes.fill(0);

  const second = await readBlob(bundle, "artifacts/x.bin");
  assert.equal(Buffer.from(second!.bytes).toString("utf8"), "stable");
});

test("FilesystemBackend: existsBlob returns false for a DIRECTORY-shaped path (a sibling key leaves a real directory on disk), matching MemoryBackend's directory-free model", async () => {
  await withFsBundle(async (bundle) => {
    // Writing "artifacts/x/y.bin" creates a real directory "artifacts/x" on disk.
    await writeBlob(bundle, "artifacts/x/y.bin", enc("nested"));
    assert.equal(await existsBlob(bundle, "artifacts/x/y.bin"), true);
    // "artifacts/x" itself is a DIRECTORY, not a blob — must report false, not true
    // (a bare pathExists()-style check would wrongly say true here).
    assert.equal(await existsBlob(bundle, "artifacts/x"), false);
    // A MemoryBackend has no such collision to begin with (no directory concept at
    // all) — "artifacts/x" was simply never written as a key, so it is trivially
    // false there too; the interesting case is FilesystemBackend's disk reality.
  });
});

test("FilesystemBackend: readBlob returns null (not a throw) for a DIRECTORY-shaped path (EISDIR treated as absent, same as ENOENT)", async () => {
  await withFsBundle(async (bundle) => {
    await writeBlob(bundle, "artifacts/x/y.bin", enc("nested"));
    assert.equal(await readBlob(bundle, "artifacts/x"), null);
  });
});

test("FilesystemBackend: readBlob PROPAGATES a real fs error (ENOTDIR) rather than silently reporting 'absent' — a blanket catch would misreport a genuine failure as a normal miss", async () => {
  await withFsBundle(async (bundle) => {
    // "artifacts/x.bin" is a FILE; treating it as a directory to read a NESTED path
    // underneath it is a genuine filesystem error (ENOTDIR) — deterministic and
    // non-flaky (no chmod/permissions involved), unlike ENOENT/EISDIR, which readBlob
    // legitimately treats as "no blob here."
    await writeBlob(bundle, "artifacts/x.bin", enc("a file, not a dir"));
    await assert.rejects(
      () => readBlob(bundle, "artifacts/x.bin/nested.bin"),
      (err: unknown) => {
        assert.equal((err as NodeJS.ErrnoException).code, "ENOTDIR");
        return true;
      },
    );
  });
});

for (const [name, run] of RUNNERS) {
  test(`${name}: a byte-identical re-write with expectedVersion set to the CURRENT version is a true no-op — returns the SAME token, not a new one (A2)`, async () => {
    await run(async (bundle) => {
      const bytes = enc("stable content");
      const v1 = await writeBlob(bundle, "artifacts/x.bin", bytes);
      const v2 = await writeBlob(bundle, "artifacts/x.bin", bytes, undefined, { expectedVersion: v1 });
      assert.equal(v2, v1, "a byte-identical CAS re-write must return the identical version token");
      assert.equal((await readBlob(bundle, "artifacts/x.bin"))!.version, v1);
    });
  });
}

test("assertSafeBlobKey: rejects a '.md'-ending NON-FINAL segment, not just the final one — 'report.md/attachment.png' would otherwise create an on-disk directory literally named 'report.md', colliding with a future concept doc at id 'report'", () => {
  assert.throws(() => assertSafeBlobKey("report.md/attachment.png"), /blob key/i);
  assert.throws(() => assertSafeBlobKey("a/Report.MD/b/c.bin"), /blob key/i); // case-insensitive, any depth
  assert.throws(() => assertSafeBlobKey("index.md/nested.bin"), /blob key/i); // a reserved name mid-path too
});

for (const [name, run] of RUNNERS) {
  test(`${name}: writeBlob/readBlob/existsBlob all reject a '.md'-ending non-final segment (not just the final one)`, async () => {
    await run(async (bundle) => {
      const key = "report.md/attachment.png";
      await assert.rejects(() => writeBlob(bundle, key, enc("x")), /blob key/i);
      await assert.rejects(() => readBlob(bundle, key), /blob key/i);
      await assert.rejects(() => existsBlob(bundle, key), /blob key/i);
    });
  });
}
