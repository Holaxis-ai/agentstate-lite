/**
 * Tri-backend contract tests, part 3: `RemoteBackend` over the wire-protocol v0
 * reference router (`@agentstate-lite/server`), wired with NO SOCKETS for the
 * contract tests — the router is injected directly as `RemoteBackend`'s fetch
 * transport, so these are deterministic and fast while still exercising the real
 * HTTP-shaped request/response envelopes (headers, status codes, JSON bodies) end
 * to end. One dedicated test at the bottom boots a REAL `node:http` listener via
 * `serve()` for a socket-level smoke check.
 *
 * `dual-backend.test.ts` already proves `FilesystemBackend` and `MemoryBackend`
 * return identical results for the SAME `scenario()`; this file proves `RemoteBackend`
 * closes the loop — the same scenario, engine CAS, reserved-file CAS, and `readMany`
 * behavior must hold identically over the wire, and every version token must be
 * byte-identical to a local backend's (the content-addressed invariant crossing the
 * wire unchanged — `docs/WIRE-PROTOCOL.md` principle 3).
 *
 * Note on module identity: the router's capabilities endpoint does
 * `backend instanceof MemoryBackend` against the COMPILED `@agentstate-lite/core`
 * it imports transitively via `@agentstate-lite/server`. The server-side backend
 * constructed here therefore uses `MemoryBackend` imported from the `@agentstate-lite/core`
 * package (not the local `../src` module) so that check observes a true match — the
 * rest of this file uses the local `../src` imports, matching `dual-backend.test.ts`.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { createRouter, serve } from "@agentstate-lite/server";
import { MemoryBackend as ServerMemoryBackend } from "@agentstate-lite/core";

import { RemoteBackend } from "../src/remote-backend.js";
import { MemoryBackend } from "../src/memory-backend.js";
import {
  writeDocVersioned,
  readDocVersioned,
  appendLog,
  readLog,
  readBlob,
  writeBlob,
  existsBlob,
  listBlobs,
} from "../src/bundle.js";
import { VersionConflict, blobVersion } from "../src/versioning.js";
import { scenario, T_DOC } from "./scenario.js";
import type {
  Bundle,
  ConceptId,
  DeleteOptions,
  OkfDocument,
  ReservedFilename,
  StorageBackend,
  WriteOptions,
} from "../src/types.js";

/** A fresh `RemoteBackend` wired to an in-process router over a fresh server-side
 * `MemoryBackend`, with the router injected AS the fetch transport (no sockets). */
function freshWireBundle(): Bundle {
  const serverBackend = new ServerMemoryBackend();
  const router = createRouter({ root: "mem://wire-server", backend: serverBackend });
  const remote = new RemoteBackend({ baseUrl: "http://wire.local", bundle: "test", fetchImpl: router });
  return { root: "wire://client", backend: remote };
}

/**
 * A `StorageBackend` wrapper that records every call it receives — used to prove a
 * rejected (traversal / invalid-id / invalid-dir) request never reaches the backend
 * at all, not just that it happens to 4xx.
 */
class SpyBackend implements StorageBackend {
  readonly calls: string[] = [];
  private readonly inner: StorageBackend;
  constructor(inner: StorageBackend) {
    this.inner = inner;
  }
  read(id: ConceptId) {
    this.calls.push(`read:${id}`);
    return this.inner.read(id);
  }
  readMany(ids: ConceptId[]) {
    this.calls.push(`readMany:${ids.join(",")}`);
    return this.inner.readMany(ids);
  }
  write(id: ConceptId, doc: OkfDocument, options?: WriteOptions) {
    this.calls.push(`write:${id}`);
    return this.inner.write(id, doc, options);
  }
  exists(id: ConceptId) {
    this.calls.push(`exists:${id}`);
    return this.inner.exists(id);
  }
  list(prefix?: string) {
    this.calls.push(`list:${prefix ?? ""}`);
    return this.inner.list(prefix);
  }
  versions(id: ConceptId) {
    this.calls.push(`versions:${id}`);
    return this.inner.versions(id);
  }
  readReserved(dir: string, name: ReservedFilename) {
    this.calls.push(`readReserved:${dir}/${name}`);
    return this.inner.readReserved(dir, name);
  }
  writeReserved(dir: string, name: ReservedFilename, content: string, options?: WriteOptions) {
    this.calls.push(`writeReserved:${dir}/${name}`);
    return this.inner.writeReserved(dir, name, content, options);
  }
  // Forwarding stub so this class keeps satisfying `StorageBackend` after the DELETE-operation
  // pass added `delete` to the seam — exercised directly by this file's "wire security: DELETE
  // ..." tests below (unlike the blob stubs' original note, which predates the blob routes
  // existing at all).
  delete(id: ConceptId, options?: DeleteOptions) {
    this.calls.push(`delete:${id}`);
    return this.inner.delete(id, options);
  }
  // Forwarding stubs so this class keeps satisfying `StorageBackend` after Part A added
  // the blob methods to the seam. Not exercised by any test in THIS file (no blob route
  // exists on the router yet — that's Part B); present only to keep the class compiling.
  readBlob(key: string) {
    this.calls.push(`readBlob:${key}`);
    return this.inner.readBlob(key);
  }
  writeBlob(key: string, bytes: Uint8Array, contentType?: string, options?: WriteOptions) {
    this.calls.push(`writeBlob:${key}`);
    return this.inner.writeBlob(key, bytes, contentType, options);
  }
  deleteBlob(key: string, options?: DeleteOptions) {
    this.calls.push(`deleteBlob:${key}`);
    return this.inner.deleteBlob(key, options);
  }
  existsBlob(key: string) {
    this.calls.push(`existsBlob:${key}`);
    return this.inner.existsBlob(key);
  }
  listBlobs(prefix?: string) {
    this.calls.push(`listBlobs:${prefix ?? ""}`);
    return this.inner.listBlobs(prefix);
  }
}

/** A fresh router over a `SpyBackend`-wrapped `MemoryBackend`, for the traversal tests. */
function freshSpiedRouter(): { router: (req: Request) => Promise<Response>; spy: SpyBackend } {
  const spy = new SpyBackend(new ServerMemoryBackend());
  const router = createRouter({ root: "mem://wire-spy", backend: spy });
  return { router, spy };
}

/** Assert `res` is a 4xx with a structured `{ error: { code, message } }` envelope. */
async function assertUsageEnvelope(res: Response): Promise<void> {
  assert.ok(res.status >= 400 && res.status < 500, `expected a 4xx status, got ${res.status}`);
  const body = (await res.json()) as { error?: { code?: string; message?: string } };
  assert.ok(body.error, "expected a structured { error } envelope");
  assert.ok(typeof body.error?.code === "string" && body.error.code.length > 0);
  assert.ok(typeof body.error?.message === "string" && body.error.message.length > 0);
}

test("wire security: GET .../docs/../../etc/passwd never reaches the backend (URL dot-segments collapse away from the docs route; still 4xx)", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(new Request("http://wire.local/v0/bundles/test/docs/../../etc/passwd"));
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: GET .../docs/a/../../b never reaches the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(new Request("http://wire.local/v0/bundles/test/docs/a/../../b"));
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: an id that decodes to an absolute path ('/etc/passwd') is rejected before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  // %2F is an encoded '/', so this id-path-segment decodes (as a single segment, per
  // decodeId's per-segment decodeURIComponent) to the absolute string '/etc/passwd' —
  // the real vector: it survives URL dot-segment collapsing because there are no
  // literal '/' characters in the raw path segment for the URL parser to normalize.
  const res = await router(new Request("http://wire.local/v0/bundles/test/docs/%2Fetc%2Fpasswd"));
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: an id containing a literal '..' segment (delivered via decodeId's per-segment decode) is rejected before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  // %2e%2e%2f%2e%2e%2f encodes "../../" with the slashes escaped too, so it arrives as
  // ONE raw path segment (no literal '/' for the URL parser to dot-collapse) and only
  // becomes multi-segment after decodeId's decodeURIComponent.
  const res = await router(
    new Request("http://wire.local/v0/bundles/test/docs/%2e%2e%2f%2e%2e%2fetc%2fpasswd"),
  );
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: HEAD with an invalid id returns a bodiless 4xx and never touches the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(
    new Request("http://wire.local/v0/bundles/test/docs/%2Fetc%2Fpasswd", { method: "HEAD" }),
  );
  assert.ok(res.status >= 400 && res.status < 500);
  assert.equal(await res.text(), "");
  assert.deepEqual(spy.calls, []);
});

test("wire security: GET .../docs/{id}/versions with an invalid id is rejected before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(
    new Request("http://wire.local/v0/bundles/test/docs/%2Fetc%2Fpasswd/versions"),
  );
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: PUT a doc with an invalid id is rejected (via the engine's own guard) before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(
    new Request("http://wire.local/v0/bundles/test/docs/%2Fetc%2Fpasswd", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ frontmatter: { type: "T" }, body: "pwned" }),
    }),
  );
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: DELETE .../docs/%2Fetc%2Fpasswd (an id that decodes to an absolute path) never reaches the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(
    new Request("http://wire.local/v0/bundles/test/docs/%2Fetc%2Fpasswd", { method: "DELETE" }),
  );
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: DELETE /docs/index.md (a reserved filename) is rejected 400 USAGE before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(new Request("http://wire.local/v0/bundles/test/docs/index.md", { method: "DELETE" }));
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: DELETE /docs/log.md (the other reserved filename) is rejected 400 USAGE before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(new Request("http://wire.local/v0/bundles/test/docs/log.md", { method: "DELETE" }));
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: POST /docs:read-many rejects the WHOLE batch when any id is a traversal payload, never touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(
    new Request("http://wire.local/v0/bundles/test/docs:read-many", {
      method: "POST",
      headers: { "content-type": "application/json" },
      // The traversal payload arrives verbatim in the JSON body — no URL encoding
      // involved, so this is the cleanest proof the id validation itself (not URL
      // parsing) is what rejects it.
      body: JSON.stringify({ ids: ["good", "../../etc/passwd"] }),
    }),
  );
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: GET /reserved/{name}?dir=../outside is rejected before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(
    new Request(`http://wire.local/v0/bundles/test/reserved/log.md?dir=${encodeURIComponent("../outside")}`),
  );
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: PUT /reserved/{name}?dir=/absolute is rejected before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(
    new Request(`http://wire.local/v0/bundles/test/reserved/log.md?dir=${encodeURIComponent("/absolute")}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content: "pwned" }),
    }),
  );
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire: core operations return identical results over RemoteBackend as over a local MemoryBackend", async () => {
  const wireResult = await scenario(freshWireBundle());
  const localResult = await scenario({ root: "mem://local", backend: new MemoryBackend() });
  assert.deepEqual(wireResult, localResult);

  const r = wireResult as { conceptIds: string[]; betaBacklinks: string[]; alphaBacklinks: string[]; freshness: string };
  assert.deepEqual(r.conceptIds, ["concepts/alpha", "concepts/beta"]);
  assert.deepEqual(r.betaBacklinks, ["concepts/alpha"]);
  assert.equal(r.freshness, "fresh");
});

test("wire: content-addressed version token crosses the wire unchanged", async () => {
  const doc: OkfDocument = {
    id: "concepts/alpha",
    frontmatter: { type: "Concept", title: "Alpha", timestamp: T_DOC },
    body: "Alpha body.",
  };
  const local = await writeDocVersioned({ root: "mem://local", backend: new MemoryBackend() }, doc);
  const wire = await writeDocVersioned(freshWireBundle(), doc);
  assert.match(wire.version, /^sha256:[0-9a-f]{64}$/);
  assert.equal(wire.version, local.version);
});

test("wire: backend-level compare-and-swap rejects a stale expectedVersion (412 -> reconstructed VersionConflict)", async () => {
  const backend = freshWireBundle().backend!;
  const base: OkfDocument = { id: "d", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" };

  const v1 = await backend.write("d", base);
  const v2 = await backend.write("d", { ...base, body: "two" });
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
  assert.equal((await backend.read("d")).version, v2);

  const v3 = await backend.write("d", { ...base, body: "three" }, { expectedVersion: v2 });
  assert.notEqual(v3, v2);
});

test("wire: engine compare-and-swap (writeDocVersioned + expectedVersion) rejects a stale version, over the wire", async () => {
  const bundle = freshWireBundle();
  const doc: OkfDocument = { id: "concepts/cas", frontmatter: { type: "Concept", title: "Cas", timestamp: T_DOC }, body: "v1" };
  const first = await writeDocVersioned(bundle, doc);
  const second = await writeDocVersioned(bundle, { ...doc, body: "v2" });
  assert.notEqual(second.version, first.version);

  await assert.rejects(
    () => writeDocVersioned(bundle, { ...doc, body: "v3" }, { expectedVersion: first.version }),
    (err: unknown) => {
      assert.ok(err instanceof VersionConflict);
      assert.equal(err.expected, first.version);
      assert.equal(err.actual, second.version);
      return true;
    },
  );
  assert.equal((await readDocVersioned(bundle, "concepts/cas")).version, second.version);

  const third = await writeDocVersioned(bundle, { ...doc, body: "v3" }, { expectedVersion: second.version });
  assert.notEqual(third.version, second.version);
});

test("wire: write honors expectedVersion: null as expect-absent create", async () => {
  const backend = freshWireBundle().backend!;
  const doc: OkfDocument = { id: "created-if-absent", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" };

  const v1 = await backend.write("created-if-absent", doc, { expectedVersion: null });
  assert.match(v1, /^sha256:[0-9a-f]{64}$/);

  await assert.rejects(
    () => backend.write("created-if-absent", { ...doc, body: "two" }, { expectedVersion: null }),
    (err: unknown) => {
      assert.ok(err instanceof VersionConflict);
      assert.equal(err.expected, null);
      assert.equal(err.actual, v1);
      return true;
    },
  );
});

test("wire: DELETE /docs/{id} — present -> 200 {deleted:true}, absent -> 200 {deleted:false} (never 404, per the wire's absence-is-success contract)", async () => {
  const backend = freshWireBundle().backend!;
  await backend.write("concepts/to-delete", { id: "concepts/to-delete", frontmatter: { type: "T", timestamp: T_DOC }, body: "x" });

  assert.equal(await backend.delete("concepts/to-delete"), true);
  await assert.rejects(() => backend.read("concepts/to-delete"), (err: unknown) => {
    assert.equal((err as NodeJS.ErrnoException).code, "ENOENT");
    return true;
  });
  assert.equal(await backend.delete("concepts/to-delete"), false); // idempotent re-delete
  assert.equal(await backend.delete("concepts/never-existed"), false); // never-written id
});

test("wire: DELETE /docs/{id} with a stale If-Match -> 412 -> RemoteBackend reconstructs a typed VersionConflict; a match succeeds", async () => {
  const backend = freshWireBundle().backend!;
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

  assert.equal(await backend.delete("concepts/cas-delete", { expectedVersion: v2 }), true);
  assert.equal(await backend.exists("concepts/cas-delete"), false);

  // Now absent: a CAS delete against any expectedVersion still returns false, never a conflict.
  assert.equal(await backend.delete("concepts/cas-delete", { expectedVersion: v1 }), false);
});

test("wire: raw DELETE /docs/{id} response shape is exactly { deleted } with a 200 status, no version headers", async () => {
  const serverBackend = new ServerMemoryBackend();
  const bundle: Bundle = { root: "mem://wire-delete-shape", backend: serverBackend };
  const router = createRouter(bundle);
  await writeDocVersioned(bundle, { id: "shape", frontmatter: { type: "T", timestamp: T_DOC }, body: "x" });

  const res = await router(new Request("http://wire.local/v0/bundles/test/docs/shape", { method: "DELETE" }));
  assert.equal(res.status, 200);
  const body = (await res.json()) as { deleted: boolean };
  assert.deepEqual(body, { deleted: true });

  const absentRes = await router(new Request("http://wire.local/v0/bundles/test/docs/never-here", { method: "DELETE" }));
  assert.equal(absentRes.status, 200);
  assert.deepEqual((await absentRes.json()) as { deleted: boolean }, { deleted: false });
});

test("wire: readMany batch-reads in input order and rejects (ENOENT-shaped) on a missing id", async () => {
  const bundle = freshWireBundle();
  const backend = bundle.backend!;
  for (const id of ["z/last", "a/first", "m/mid"]) {
    await writeDocVersioned(bundle, { id, frontmatter: { type: "T", timestamp: T_DOC }, body: id });
  }
  const ids = ["m/mid", "a/first", "z/last"];
  const results = await backend.readMany(ids);
  assert.deepEqual(results.map((r) => r.doc.id), ids); // input order preserved
  for (const r of results) assert.match(r.version, /^sha256:/);

  assert.deepEqual(await backend.readMany([]), []);
  await assert.rejects(
    () => backend.readMany(["a/first", "does/not-exist"]),
    (err: unknown) => {
      assert.ok(err && typeof err === "object" && (err as NodeJS.ErrnoException).code === "ENOENT");
      return true;
    },
  );
});

test("wire: reserved-file writeReserved honors compare-and-swap and expect-absent, over the wire", async () => {
  const backend = freshWireBundle().backend!;
  const c1 = "# Log\n\n- one\n";

  const v1 = await backend.writeReserved("", "log.md", c1, { expectedVersion: null });
  assert.match(v1, /^sha256:[0-9a-f]{64}$/);
  const read1 = await backend.readReserved("", "log.md");
  assert.ok(read1);
  assert.equal(read1!.content, c1);
  assert.equal(read1!.version, v1);

  await assert.rejects(
    () => backend.writeReserved("", "log.md", "# Log\n\n- two\n", { expectedVersion: "sha256:" + "0".repeat(64) }),
    (err: unknown) => err instanceof VersionConflict && err.actual === v1,
  );

  const v2 = await backend.writeReserved("", "log.md", "# Log\n\n- two\n", { expectedVersion: v1 });
  assert.notEqual(v2, v1);
  assert.equal((await backend.readReserved("", "log.md"))!.version, v2);

  assert.equal(await backend.readReserved("nope", "index.md"), null);
});

test("wire: appendLog's read-CAS-write retry works transparently over RemoteBackend", async () => {
  const bundle = freshWireBundle();
  const when = new Date("2026-07-01T00:00:00.000Z");
  await appendLog(bundle, { dir: "", entry: "first entry", when });
  await appendLog(bundle, { dir: "", entry: "second entry", when });
  const log = await readLog(bundle, "");
  assert.match(log ?? "", /first entry/);
  assert.match(log ?? "", /second entry/);
});

test("wire: GET /docs list endpoint carries count + type/tag filters + fields=frontmatter projection", async () => {
  const serverBackend = new ServerMemoryBackend();
  const bundle: Bundle = { root: "mem://wire-list", backend: serverBackend };
  const router = createRouter(bundle);
  const listUrl = "http://wire.local/v0/bundles/test/docs";

  await writeDocVersioned(bundle, { id: "a", frontmatter: { type: "Concept", title: "A", tags: ["x"], timestamp: T_DOC }, body: "" });
  await writeDocVersioned(bundle, { id: "b", frontmatter: { type: "Concept", title: "B", tags: ["y"], timestamp: T_DOC }, body: "" });
  await writeDocVersioned(bundle, { id: "c", frontmatter: { type: "Other", title: "C", timestamp: T_DOC }, body: "" });

  const all = await router(new Request(listUrl));
  const allBody = (await all.json()) as { count: number; docs: Array<{ id: string }> };
  assert.equal(allBody.count, 3);
  assert.deepEqual(allBody.docs.map((d) => d.id).sort(), ["a", "b", "c"]);

  const byType = await router(new Request(`${listUrl}?type=Concept`));
  const byTypeBody = (await byType.json()) as { count: number; docs: Array<{ id: string; type?: string }> };
  assert.equal(byTypeBody.count, 2);
  for (const row of byTypeBody.docs) assert.equal(row.type, "Concept");

  const byTag = await router(new Request(`${listUrl}?tag=y`));
  const byTagBody = (await byTag.json()) as { count: number; docs: Array<{ id: string }> };
  assert.deepEqual(byTagBody.docs.map((d) => d.id), ["b"]);

  const withFrontmatter = await router(new Request(`${listUrl}?fields=frontmatter`));
  const fmBody = (await withFrontmatter.json()) as { docs: Array<{ id: string; frontmatter?: Record<string, unknown> }> };
  assert.ok(fmBody.docs[0]?.frontmatter);
  assert.equal(typeof fmBody.docs[0]?.frontmatter?.type, "string");
});

test("wire: POST /docs:read-many reports 404 + { missing } when any id is absent", async () => {
  const serverBackend = new ServerMemoryBackend();
  const bundle: Bundle = { root: "mem://wire-read-many", backend: serverBackend };
  const router = createRouter(bundle);
  await writeDocVersioned(bundle, { id: "present", frontmatter: { type: "T", timestamp: T_DOC }, body: "" });

  const res = await router(
    new Request("http://wire.local/v0/bundles/test/docs:read-many", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: ["present", "absent"] }),
    }),
  );
  assert.equal(res.status, 404);
  const body = (await res.json()) as { error: { code: string; details?: { missing: string[] } } };
  assert.equal(body.error.code, "NOT_FOUND");
  assert.deepEqual(body.error.details?.missing, ["absent"]);
});

test("wire: GET /docs/{id}/versions returns [] for never-written, and the real chain for MemoryBackend", async () => {
  const serverBackend = new ServerMemoryBackend();
  const bundle: Bundle = { root: "mem://wire-versions", backend: serverBackend };
  const router = createRouter(bundle);

  const neverWritten = await router(new Request("http://wire.local/v0/bundles/test/docs/nope/versions"));
  assert.equal(neverWritten.status, 200);
  assert.deepEqual((await neverWritten.json()) as { versions: unknown[] }, { versions: [] });

  await writeDocVersioned(bundle, { id: "v", frontmatter: { type: "T", timestamp: T_DOC }, body: "one" }, { actor: "alice" });
  await writeDocVersioned(bundle, { id: "v", frontmatter: { type: "T", timestamp: T_DOC }, body: "two" }, { actor: "bob" });
  const res = await router(new Request("http://wire.local/v0/bundles/test/docs/v/versions"));
  const body = (await res.json()) as { versions: Array<{ actor: string }> };
  assert.equal(body.versions.length, 2);
  assert.equal(body.versions[0]!.actor, "bob"); // newest-first
  assert.equal(body.versions[1]!.actor, "alice");
});

test("wire: X-Agent round-trips alongside X-Actor — router reads it into options.agent, wire JSON carries it, RemoteBackend.versions() parses VersionInfo.agent; a write with no X-Agent leaves agent absent end to end", async () => {
  const serverBackend = new ServerMemoryBackend();
  const router = createRouter({ root: "mem://wire-agent", backend: serverBackend });

  // Direct PUT with BOTH X-Actor and X-Agent, bypassing RemoteBackend's write() (which
  // deliberately does not send X-Agent — only the auth'd worker manufactures it).
  const putRes = await router(
    new Request("http://wire.local/v0/bundles/test/docs/concepts/agented", {
      method: "PUT",
      headers: { "content-type": "application/json", "X-Actor": "root", "X-Agent": "collab-3" },
      body: JSON.stringify({ frontmatter: { type: "Concept", timestamp: T_DOC }, body: "one" }),
    }),
  );
  assert.equal(putRes.status, 200);

  // A control write with NO X-Agent header.
  const controlRes = await router(
    new Request("http://wire.local/v0/bundles/test/docs/concepts/unagented", {
      method: "PUT",
      headers: { "content-type": "application/json", "X-Actor": "root" },
      body: JSON.stringify({ frontmatter: { type: "Concept", timestamp: T_DOC }, body: "one" }),
    }),
  );
  assert.equal(controlRes.status, 200);

  // Raw wire JSON carries `agent` only for the agented write.
  const versionsRes = await router(new Request("http://wire.local/v0/bundles/test/docs/concepts/agented/versions"));
  const versionsBody = (await versionsRes.json()) as { versions: Array<{ actor: string; agent?: string }> };
  assert.equal(versionsBody.versions.length, 1);
  assert.equal(versionsBody.versions[0]!.actor, "root");
  assert.equal(versionsBody.versions[0]!.agent, "collab-3");

  const controlVersionsRes = await router(
    new Request("http://wire.local/v0/bundles/test/docs/concepts/unagented/versions"),
  );
  const controlVersionsBody = (await controlVersionsRes.json()) as { versions: Array<{ actor: string; agent?: string }> };
  assert.equal(controlVersionsBody.versions.length, 1);
  assert.ok(!("agent" in controlVersionsBody.versions[0]!), "no X-Agent sent -> no agent key in the wire JSON");

  // RemoteBackend.versions() parses `agent` through into VersionInfo.agent.
  const remote = new RemoteBackend({ baseUrl: "http://wire.local", bundle: "test", fetchImpl: router });
  const agentedVersions = await remote.versions("concepts/agented");
  assert.equal(agentedVersions.length, 1);
  assert.equal(agentedVersions[0]!.actor, "root");
  assert.equal(agentedVersions[0]!.agent, "collab-3");

  const unagentedVersions = await remote.versions("concepts/unagented");
  assert.equal(unagentedVersions.length, 1);
  assert.equal(unagentedVersions[0]!.agent, undefined);
});

test("wire: GET /v0/capabilities reports the backend's real capabilities (MemoryBackend = the hard case)", async () => {
  const serverBackend = new ServerMemoryBackend();
  const router = createRouter({ root: "mem://wire-caps", backend: serverBackend });
  const res = await router(new Request("http://wire.local/v0/capabilities"));
  assert.equal(res.status, 200);
  const body = (await res.json()) as Record<string, unknown>;
  assert.deepEqual(body, { history: true, enforced_cas: true, projections: true, backlinks: false, blobs: true });
});

test("wire: error envelopes on 404 and 412 follow the { error: { code, message, details? } } shape", async () => {
  const serverBackend = new ServerMemoryBackend();
  const bundle: Bundle = { root: "mem://wire-errors", backend: serverBackend };
  const router = createRouter(bundle);

  const notFoundRes = await router(new Request("http://wire.local/v0/bundles/test/docs/nope"));
  assert.equal(notFoundRes.status, 404);
  const notFoundBody = (await notFoundRes.json()) as { error: { code: string; message: string } };
  assert.equal(notFoundBody.error.code, "NOT_FOUND");
  assert.ok(notFoundBody.error.message.length > 0);

  await writeDocVersioned(bundle, { id: "conflict-me", frontmatter: { type: "T", timestamp: T_DOC }, body: "v1" });
  const conflictRes = await router(
    new Request("http://wire.local/v0/bundles/test/docs/conflict-me", {
      method: "PUT",
      headers: { "content-type": "application/json", "If-Match": "sha256:" + "0".repeat(64) },
      body: JSON.stringify({ frontmatter: { type: "T", timestamp: T_DOC }, body: "v2" }),
    }),
  );
  assert.equal(conflictRes.status, 412);
  const conflictBody = (await conflictRes.json()) as { error: { code: string; details?: { expected: string; actual: string } } };
  assert.equal(conflictBody.error.code, "VERSION_CONFLICT");
  assert.ok(conflictBody.error.details?.expected);
  assert.ok(conflictBody.error.details?.actual);
});

test("wire: serve() boots a real node:http listener; one GET round-trips, then close()", async () => {
  const serverBackend = new ServerMemoryBackend();
  const bundle: Bundle = { root: "mem://wire-smoke", backend: serverBackend };
  await writeDocVersioned(bundle, { id: "smoke", frontmatter: { type: "T", title: "Smoke", timestamp: T_DOC }, body: "hello" });

  const handle = await serve({ bundle, port: 0 });
  try {
    assert.equal(handle.host, "127.0.0.1");
    assert.ok(handle.port > 0);
    const res = await fetch(`http://${handle.host}:${handle.port}/v0/bundles/test/docs/smoke`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as { id: string; body: string };
    assert.equal(body.id, "smoke");
    assert.equal(body.body, "hello");
    // Production repair (Stage-1 Unit 2b): the version now rides X-Version (bare, primary,
    // edge-proof) AND a properly RFC-7232-QUOTED ETag (secondary) — the original unquoted
    // bare-token ETag this pinned was itself the defect (Cloudflare's edge strips an invalid
    // ETag under Brotli compression; see router.ts's versionHeaders doc comment).
    assert.match(res.headers.get("x-version") ?? "", /^sha256:/);
    assert.match(res.headers.get("etag") ?? "", /^"sha256:[0-9a-f]{64}"$/);
  } finally {
    await handle.close();
  }
});

// ── blobs: opaque bytes served by content-type (wire-protocol v0.1) ──────────

/** Bytes 0x00-0xFF, including invalid-UTF-8 sequences — the B1 binary-fidelity fixture, over the wire. */
const WIRE_BINARY_FIXTURE = new Uint8Array(256);
for (let i = 0; i < 256; i++) WIRE_BINARY_FIXTURE[i] = i;

const enc = (s: string) => new TextEncoder().encode(s);

test("wire: blob write/read/exists/list over RemoteBackend matches a local MemoryBackend, incl. the BINARY FIXTURE crossing the wire byte-identical with the identical version token (B1, over HTTP)", async () => {
  const wire = freshWireBundle();
  const local: Bundle = { root: "mem://local-blob", backend: new MemoryBackend() };

  assert.equal(await existsBlob(wire, "artifacts/report.html"), false);
  assert.equal(await readBlob(wire, "artifacts/report.html"), null);

  const htmlBytes = enc("<html><body>hi</body></html>");
  const wireVersion = await writeBlob(wire, "artifacts/report.html", htmlBytes, "text/html; charset=utf-8");
  const localVersion = await writeBlob(local, "artifacts/report.html", htmlBytes, "text/html; charset=utf-8");
  assert.equal(wireVersion, localVersion);

  const wireRead = await readBlob(wire, "artifacts/report.html");
  assert.ok(wireRead);
  assert.deepEqual([...wireRead!.bytes], [...htmlBytes]);
  assert.equal(wireRead!.version, wireVersion);
  assert.equal(wireRead!.contentType, "text/html; charset=utf-8");
  assert.equal(await existsBlob(wire, "artifacts/report.html"), true);
  assert.deepEqual(await listBlobs(wire, "artifacts/"), ["artifacts/report.html"]);

  // The B1 regression, crossing the wire: a real binary fixture (incl. invalid-UTF-8
  // byte sequences) must round-trip byte-identical and hash identically over HTTP.
  const binVersion = await writeBlob(wire, "artifacts/binary.dat", WIRE_BINARY_FIXTURE);
  assert.equal(binVersion, blobVersion(WIRE_BINARY_FIXTURE));
  const binRead = await readBlob(wire, "artifacts/binary.dat");
  assert.ok(binRead);
  assert.deepEqual([...binRead!.bytes], [...WIRE_BINARY_FIXTURE]);
  assert.equal(binRead!.version, blobVersion(WIRE_BINARY_FIXTURE));
});

test("wire: RemoteBackend.readBlob returns null (not a rejection) for an absent blob; existsBlob returns false", async () => {
  const backend = freshWireBundle().backend!;
  assert.equal(await backend.readBlob("nope/absent.bin"), null);
  assert.equal(await backend.existsBlob("nope/absent.bin"), false);
});

test("wire: blob CAS rejects a stale expectedVersion (412 -> reconstructed VersionConflict); CAS against the current version succeeds", async () => {
  const backend = freshWireBundle().backend!;

  const v1 = await backend.writeBlob("artifacts/x.bin", enc("v1"));
  const v2 = await backend.writeBlob("artifacts/x.bin", enc("v2"));
  assert.notEqual(v1, v2);

  await assert.rejects(
    () => backend.writeBlob("artifacts/x.bin", enc("v3"), undefined, { expectedVersion: v1 }),
    (err: unknown) => {
      assert.ok(err instanceof VersionConflict);
      assert.equal(err.expected, v1);
      assert.equal(err.actual, v2);
      return true;
    },
  );

  const v3 = await backend.writeBlob("artifacts/x.bin", enc("v3"), undefined, { expectedVersion: v2 });
  assert.notEqual(v3, v2);
  assert.equal((await backend.readBlob("artifacts/x.bin"))!.version, v3);
});

test("wire: DELETE /blobs/{key} — present -> 200 {deleted:true}, absent -> 200 {deleted:false} (never 404)", async () => {
  const backend = freshWireBundle().backend!;
  await backend.writeBlob("artifacts/to-delete.bin", enc("bye"));

  assert.equal(await backend.deleteBlob("artifacts/to-delete.bin"), true);
  assert.equal(await backend.readBlob("artifacts/to-delete.bin"), null);
  assert.equal(await backend.existsBlob("artifacts/to-delete.bin"), false);
  assert.equal(await backend.deleteBlob("artifacts/to-delete.bin"), false); // idempotent
  assert.equal(await backend.deleteBlob("artifacts/never-existed.bin"), false);
});

test("wire: DELETE /blobs/{key} with a stale If-Match -> 412 -> reconstructed VersionConflict; a match succeeds", async () => {
  const backend = freshWireBundle().backend!;
  const v1 = await backend.writeBlob("artifacts/cas-delete.bin", enc("v1"));
  const v2 = await backend.writeBlob("artifacts/cas-delete.bin", enc("v2"));
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
});

test("wire: PUT /blobs/{key} returns 201 + {version} + ETag on expect-absent create, 200 on an ordinary write (I4)", async () => {
  const serverBackend = new ServerMemoryBackend();
  const bundle: Bundle = { root: "mem://wire-blob-put", backend: serverBackend };
  const router = createRouter(bundle);

  const createRes = await router(
    new Request("http://wire.local/v0/bundles/test/blobs/artifacts/report.html", {
      method: "PUT",
      headers: { "content-type": "text/html; charset=utf-8", "If-None-Match": "*" },
      body: enc("<p>hi</p>"),
    }),
  );
  assert.equal(createRes.status, 201);
  const createBody = (await createRes.json()) as { version: string };
  assert.match(createBody.version, /^sha256:[0-9a-f]{64}$/);
  // Production repair (Stage-1 Unit 2b): X-Version carries the bare token (primary, edge-proof);
  // ETag now carries the RFC-7232-quoted form (this pinned the pre-fix bare ETag, itself the
  // defect Cloudflare's edge strips under Brotli — see router.ts's versionHeaders doc comment).
  assert.equal(createRes.headers.get("x-version"), createBody.version);
  assert.equal(createRes.headers.get("etag"), `"${createBody.version}"`);

  const overwriteRes = await router(
    new Request("http://wire.local/v0/bundles/test/blobs/artifacts/report.html", {
      method: "PUT",
      headers: { "content-type": "text/html; charset=utf-8" },
      body: enc("<p>updated</p>"),
    }),
  );
  assert.equal(overwriteRes.status, 200);

  // A second expect-absent create against the now-present key is a 412 conflict.
  const conflictRes = await router(
    new Request("http://wire.local/v0/bundles/test/blobs/artifacts/report.html", {
      method: "PUT",
      headers: { "content-type": "text/html; charset=utf-8", "If-None-Match": "*" },
      body: enc("<p>clobber attempt</p>"),
    }),
  );
  assert.equal(conflictRes.status, 412);
});

test("wire: GET /blobs list endpoint carries count + prefix filter + cursor pagination (B2, mirrors handleList)", async () => {
  const serverBackend = new ServerMemoryBackend();
  const bundle: Bundle = { root: "mem://wire-blob-list", backend: serverBackend };
  const router = createRouter(bundle);

  await writeBlob(bundle, "artifacts/a.bin", enc("a"));
  await writeBlob(bundle, "artifacts/b.bin", enc("b"));
  await writeBlob(bundle, "other/c.bin", enc("c"));

  const all = await router(new Request("http://wire.local/v0/bundles/test/blobs"));
  const allBody = (await all.json()) as { count: number; keys: string[]; next_cursor: string | null };
  assert.equal(allBody.count, 3);
  assert.deepEqual(allBody.keys.sort(), ["artifacts/a.bin", "artifacts/b.bin", "other/c.bin"]);
  assert.equal(allBody.next_cursor, null);

  const byPrefix = await router(new Request("http://wire.local/v0/bundles/test/blobs?prefix=artifacts/"));
  const byPrefixBody = (await byPrefix.json()) as { count: number; keys: string[] };
  assert.equal(byPrefixBody.count, 2);
  assert.deepEqual(byPrefixBody.keys, ["artifacts/a.bin", "artifacts/b.bin"]);

  const limited = await router(new Request("http://wire.local/v0/bundles/test/blobs?limit=1"));
  const limitedBody = (await limited.json()) as { count: number; keys: string[]; next_cursor: string | null };
  assert.equal(limitedBody.count, 3); // count is the TOTAL matched, not the page size
  assert.equal(limitedBody.keys.length, 1);
  assert.ok(limitedBody.next_cursor);
});

test("wire security: PUT /blobs/{key} with a traversal key ('%2Fetc%2Fpasswd') is rejected before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(
    new Request("http://wire.local/v0/bundles/test/blobs/%2Fetc%2Fpasswd", {
      method: "PUT",
      headers: { "content-type": "application/octet-stream" },
      body: new Uint8Array([1, 2, 3]),
    }),
  );
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: DELETE /blobs/{key} with a traversal key ('%2Fetc%2Fpasswd') is rejected before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(
    new Request("http://wire.local/v0/bundles/test/blobs/%2Fetc%2Fpasswd", { method: "DELETE" }),
  );
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: DELETE /blobs/{key} with a .md-ending key (case-insensitive) is rejected before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(new Request("http://wire.local/v0/bundles/test/blobs/artifacts/report.MD", { method: "DELETE" }));
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: GET /blobs/{key} with a .md-ending key (case-insensitive) is rejected before touching the backend (I1 — no accidental raw-doc channel)", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(new Request("http://wire.local/v0/bundles/test/blobs/artifacts/report.MD"));
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire security: HEAD /blobs/{key} with a dot-prefixed segment returns a bodiless 4xx and never touches the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(
    new Request("http://wire.local/v0/bundles/test/blobs/.git/config", { method: "HEAD" }),
  );
  assert.ok(res.status >= 400 && res.status < 500);
  assert.equal(await res.text(), "");
  assert.deepEqual(spy.calls, []);
});

test("wire security: GET /blobs/{key} with a '..' segment delivered via decodeBlobKey's per-segment decode (survives URL dot-segment collapsing) is rejected before touching the backend", async () => {
  const { router, spy } = freshSpiedRouter();
  // %2e%2e%2f%2e%2e%2f encodes "../../" with the slashes escaped too, so it arrives as
  // ONE raw path segment (no literal '/' for the URL parser to dot-collapse) and only
  // becomes multi-segment after decodeBlobKey's decodeURIComponent — mirrors the
  // analogous doc-route test above.
  const res = await router(
    new Request("http://wire.local/v0/bundles/test/blobs/%2e%2e%2f%2e%2e%2fetc%2fpasswd"),
  );
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

// ── D4: no bulk/reserved delete — DELETE on the collection or reserved-file routes 400s ──

test("wire: DELETE /docs (the collection route, bulk delete) is 400 USAGE — no bulk delete", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(new Request("http://wire.local/v0/bundles/test/docs", { method: "DELETE" }));
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire: DELETE /blobs (the collection route, bulk delete) is 400 USAGE — no bulk delete", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(new Request("http://wire.local/v0/bundles/test/blobs", { method: "DELETE" }));
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire: DELETE /reserved/log.md is 400 USAGE — reserved files have no delete route at all", async () => {
  const { router, spy } = freshSpiedRouter();
  const res = await router(new Request("http://wire.local/v0/bundles/test/reserved/log.md", { method: "DELETE" }));
  await assertUsageEnvelope(res);
  assert.deepEqual(spy.calls, []);
});

test("wire: serve() blob route — a REAL socket GET returns EXACT bytes with the correct Content-Type header (served-by-content-type acceptance, plan DoD #2)", async () => {
  const serverBackend = new ServerMemoryBackend();
  const bundle: Bundle = { root: "mem://wire-blob-smoke", backend: serverBackend };
  const htmlBytes = enc("<html><body>served by content-type</body></html>");
  await writeBlob(bundle, "artifacts/report.html", htmlBytes);

  const handle = await serve({ bundle, port: 0 });
  try {
    const res = await fetch(`http://${handle.host}:${handle.port}/v0/bundles/test/blobs/artifacts/report.html`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") ?? "", /^text\/html/);
    const bytes = new Uint8Array(await res.arrayBuffer());
    assert.deepEqual([...bytes], [...htmlBytes]);
    // Production repair (Stage-1 Unit 2b): X-Version (bare, primary, edge-proof) + a properly
    // RFC-7232-quoted ETag (secondary) — this pinned the pre-fix unquoted bare-token ETag,
    // itself the defect (Cloudflare's edge strips an invalid ETag under Brotli compression).
    assert.match(res.headers.get("x-version") ?? "", /^sha256:/);
    assert.match(res.headers.get("etag") ?? "", /^"sha256:[0-9a-f]{64}"$/);

    const headRes = await fetch(`http://${handle.host}:${handle.port}/v0/bundles/test/blobs/artifacts/report.html`, {
      method: "HEAD",
    });
    assert.equal(headRes.status, 200);
    assert.match(headRes.headers.get("content-type") ?? "", /^text\/html/);
    assert.equal(await headRes.text(), "");

    const missingRes = await fetch(`http://${handle.host}:${handle.port}/v0/bundles/test/blobs/artifacts/nope.bin`);
    assert.equal(missingRes.status, 404);
  } finally {
    await handle.close();
  }
});
