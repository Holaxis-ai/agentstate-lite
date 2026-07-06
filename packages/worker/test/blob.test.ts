/**
 * Blob contract tests for {@link D1R2Backend}: opaque bytes + a content-type, CAS-able via
 * the same `WriteOptions` concept documents use, and — the B1 regression fixture every
 * adapter must pass (`packages/core/test/blob.test.ts`) — a 0x00-0xFF byte sequence
 * (including invalid-UTF-8 sequences) round-trips byte-identical with an identical
 * `blobVersion`, proving no string/UTF-8 step ever touches blob bytes on this backend.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { blobVersion, VersionConflict } from "@agentstate-lite/core";

import { D1R2Backend } from "../src/d1r2-backend.js";
import { createTestEnv } from "./env.js";

async function withBackend(fn: (backend: D1R2Backend) => Promise<void>): Promise<void> {
  const env = await createTestEnv();
  try {
    await fn(new D1R2Backend(env.db, env.bucket));
  } finally {
    await env.dispose();
  }
}

/** Bytes 0x00-0xFF, including invalid-UTF-8 sequences — the B1 binary-fidelity fixture. */
const BINARY_FIXTURE = new Uint8Array(256);
for (let i = 0; i < 256; i++) BINARY_FIXTURE[i] = i;

test("BINARY FIXTURE (0x00-0xFF, invalid UTF-8) round-trips byte-identical with an identical blobVersion", async () => {
  await withBackend(async (backend) => {
    const v1 = await backend.writeBlob("artifacts/binary.dat", BINARY_FIXTURE);
    assert.equal(v1, blobVersion(BINARY_FIXTURE)); // core's primitive, not a new hash path
    const read = await backend.readBlob("artifacts/binary.dat");
    assert.ok(read);
    assert.deepEqual(read!.bytes, BINARY_FIXTURE);
    assert.equal(read!.version, v1);
  });
});

test("readBlob/existsBlob/listBlobs on an absent key", async () => {
  await withBackend(async (backend) => {
    assert.equal(await backend.readBlob("nope.bin"), null);
    assert.equal(await backend.existsBlob("nope.bin"), false);
    assert.deepEqual(await backend.listBlobs(), []);
  });
});

test("writeBlob resolves content-type (explicit override > extension inference > default), and persists it", async () => {
  await withBackend(async (backend) => {
    await backend.writeBlob("report.html", new TextEncoder().encode("<h1>hi</h1>"));
    assert.equal((await backend.readBlob("report.html"))!.contentType, "text/html; charset=utf-8");

    await backend.writeBlob("no-ext", new Uint8Array([1, 2, 3]), "application/x-custom");
    assert.equal((await backend.readBlob("no-ext"))!.contentType, "application/x-custom");

    await backend.writeBlob("mystery", new Uint8Array([1]));
    assert.equal((await backend.readBlob("mystery"))!.contentType, "application/octet-stream");
  });
});

test("writeBlob CAS: expectedVersion: null is expect-absent create; a stale expectedVersion conflicts", async () => {
  await withBackend(async (backend) => {
    const b1 = new TextEncoder().encode("v1");
    const v1 = await backend.writeBlob("art/x.bin", b1, undefined, { expectedVersion: null });
    assert.equal(await backend.existsBlob("art/x.bin"), true);

    await assert.rejects(
      () => backend.writeBlob("art/x.bin", new TextEncoder().encode("v2"), undefined, { expectedVersion: null }),
      (err: unknown) => {
        assert.ok(err instanceof VersionConflict);
        assert.equal(err.expected, null);
        assert.equal(err.actual, v1);
        return true;
      },
    );

    const stale = "sha256:" + "0".repeat(64);
    await assert.rejects(
      () => backend.writeBlob("art/x.bin", new TextEncoder().encode("v2"), undefined, { expectedVersion: stale }),
      (err: unknown) => err instanceof VersionConflict && (err as InstanceType<typeof VersionConflict>).actual === v1,
    );

    const v2 = await backend.writeBlob("art/x.bin", new TextEncoder().encode("v2"), undefined, { expectedVersion: v1 });
    assert.notEqual(v2, v1);
    assert.equal((await backend.readBlob("art/x.bin"))!.version, v2);
  });
});

test("writeBlob is idempotent: a byte-identical AND content-type-identical unconditional re-write is a true no-op", async () => {
  await withBackend(async (backend) => {
    const bytes = new TextEncoder().encode("stable content");
    const v1 = await backend.writeBlob("stable.txt", bytes, "text/plain");
    const v2 = await backend.writeBlob("stable.txt", bytes, "text/plain");
    assert.equal(v1, v2);
    // A content-type CHANGE on otherwise-identical bytes is a real change, not a no-op.
    const v3 = await backend.writeBlob("stable.txt", bytes, "application/octet-stream");
    assert.equal(v3, v1); // bytes unchanged -> same version token
    assert.equal((await backend.readBlob("stable.txt"))!.contentType, "application/octet-stream");
  });
});

test("listBlobs sorts and filters by prefix; never includes a concept document", async () => {
  await withBackend(async (backend) => {
    await backend.writeBlob("z/last.bin", new Uint8Array([1]));
    await backend.writeBlob("a/first.bin", new Uint8Array([2]));
    await backend.writeBlob("m/mid.bin", new Uint8Array([3]));
    await backend.write("some/doc", { id: "some/doc", frontmatter: { type: "T", timestamp: "2026-06-01T00:00:00.000Z" }, body: "x" });

    assert.deepEqual(await backend.listBlobs(), ["a/first.bin", "m/mid.bin", "z/last.bin"]);
    assert.deepEqual(await backend.listBlobs("m/"), ["m/mid.bin"]);
  });
});

test("writeBlob/readBlob/existsBlob reject an unsafe key via core's assertSafeBlobKey (traversal, .md collision, dot-prefixed segments)", async () => {
  await withBackend(async (backend) => {
    await assert.rejects(() => backend.writeBlob("../../etc/passwd", new Uint8Array([1])), /blob key/i);
    await assert.rejects(() => backend.writeBlob("report.md", new Uint8Array([1])), /blob key/i);
    await assert.rejects(() => backend.readBlob(".hidden/x.bin"), /blob key/i);
  });
});

test("deleteBlob: the BINARY FIXTURE round-trips through write -> delete -> gone, with no residue in readBlob/existsBlob/listBlobs", async () => {
  await withBackend(async (backend) => {
    const v1 = await backend.writeBlob("artifacts/binary.dat", BINARY_FIXTURE);
    assert.equal(v1, blobVersion(BINARY_FIXTURE));

    assert.equal(await backend.deleteBlob("artifacts/binary.dat"), true);
    assert.equal(await backend.readBlob("artifacts/binary.dat"), null);
    assert.equal(await backend.existsBlob("artifacts/binary.dat"), false);
    assert.deepEqual(await backend.listBlobs(), []);

    // Idempotent re-delete.
    assert.equal(await backend.deleteBlob("artifacts/binary.dat"), false);
  });
});
