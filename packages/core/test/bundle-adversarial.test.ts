import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { FilesystemBackend } from "../src/backend.js";
import {
  deleteDoc,
  docVersions,
  initBundle,
  matchesFilter,
  parseLinks,
  query,
  queryEdges,
  queryHeads,
  readDocVersioned,
  writeDocVersioned,
} from "../src/bundle.js";
import { InvalidInputError } from "../src/errors.js";
import { parseMarkdown } from "../src/frontmatter.js";
import { GENERATED_INDEX_MARKER } from "../src/index-marker.js";
import { MemoryBackend } from "../src/memory-backend.js";
import { VersionConflict } from "../src/versioning.js";
import type {
  Bundle,
  ConceptId,
  HeadResult,
  OkfDocument,
  QueryFilter,
  ReservedFilename,
  Version,
  WriteOptions,
} from "../src/types.js";

const T = "2026-07-18T00:00:00.000Z";

function memoryBundle(root = "mem://bundle"): Bundle {
  return { root, backend: new MemoryBackend() };
}

function doc(id: ConceptId, frontmatter: OkfDocument["frontmatter"], body = ""): OkfDocument {
  return { id, frontmatter, body };
}

test("initBundle writes one deterministic root index with expect-absent CAS and preserves it thereafter", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "okf-init-contract-"));
  const original = FilesystemBackend.prototype.writeReserved;
  const writes: Array<{
    dir: string;
    name: ReservedFilename;
    content: string;
    options: WriteOptions | undefined;
  }> = [];
  FilesystemBackend.prototype.writeReserved = async function (dir, name, content, options) {
    writes.push({ dir, name, content, options });
    return original.call(this, dir, name, content, options);
  };

  try {
    const bundle = await initBundle(root, { okfVersion: "9.4" });
    assert.equal(bundle.root, path.resolve(root));
    assert.equal(writes.length, 1);
    assert.equal(writes[0]!.dir, "");
    assert.equal(writes[0]!.name, "index.md");
    assert.deepEqual(writes[0]!.options, { expectedVersion: null });
    assert.match(writes[0]!.content, /okf_version: ['"]?9\.4['"]?/);
    assert.match(
      writes[0]!.content,
      new RegExp(`${GENERATED_INDEX_MARKER}\\n# ${path.basename(root)}\\n\\nAn Open Knowledge Format bundle\\.\\n$`),
    );

    await initBundle(root, { okfVersion: "never-overwrite" });
    assert.equal(writes.length, 1, "an existing root index must remain byte-untouched");
    const raw = (await new FilesystemBackend(bundle.root).readReserved("", "index.md"))!;
    const parsed = parseMarkdown(raw.content);
    assert.deepEqual({ body: parsed.body, okfVersion: parsed.frontmatter.okf_version }, {
      body: `${GENERATED_INDEX_MARKER}\n# ${path.basename(root)}\n\nAn Open Knowledge Format bundle.\n`,
      okfVersion: "9.4",
    });
  } finally {
    FilesystemBackend.prototype.writeReserved = original;
    await rm(root, { recursive: true, force: true });
  }
});

test("initBundle swallows only the expect-absent VersionConflict from a winning racer", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "okf-init-race-"));
  const original = FilesystemBackend.prototype.writeReserved;
  const sentinel = new Error("disk exploded");

  try {
    FilesystemBackend.prototype.writeReserved = async function (dir, name, content, options) {
      const version = await original.call(this, dir, name, content, options);
      throw new VersionConflict("index.md", null, version);
    };
    const raced = await initBundle(root);
    const raw = (await new FilesystemBackend(raced.root).readReserved("", "index.md"))!;
    assert.equal(parseMarkdown(raw.content).frontmatter.okf_version, "0.1", "the default version remains deterministic");

    await rm(root, { recursive: true, force: true });
    FilesystemBackend.prototype.writeReserved = async function () {
      throw sentinel;
    };
    await assert.rejects(() => initBundle(root), (error: unknown) => error === sentinel);
  } finally {
    FilesystemBackend.prototype.writeReserved = original;
    await rm(root, { recursive: true, force: true });
  }
});

test("writeDocVersioned rejects every empty or non-string type before storage", async () => {
  const bundle = memoryBundle();
  for (const type of [undefined, null, 0, false, "", "   "]) {
    await assert.rejects(
      () => writeDocVersioned(bundle, doc(`bad/${String(type)}`, { type } as never)),
      (error: unknown) =>
        error instanceof InvalidInputError &&
        error.message === `OKF §9.2: frontmatter.type is required and must be non-empty (concept 'bad/${String(type)}').`,
    );
  }
  assert.deepEqual(await bundle.backend!.list(), []);
});

test("writeDocVersioned normalizes ordering, timestamp, and absent body without mutating the input", async () => {
  const bundle = memoryBundle();
  const input = {
    id: "notes/normalized",
    frontmatter: { timestamp: "  preserved  ", title: "N", type: "Note", extra: false },
    body: undefined,
  } as unknown as OkfDocument;
  const written = await writeDocVersioned(bundle, input);

  assert.deepEqual(Object.keys(written.doc.frontmatter), ["type", "title", "extra", "timestamp"]);
  assert.deepEqual(written.doc.frontmatter, {
    type: "Note",
    title: "N",
    extra: false,
    timestamp: "  preserved  ",
  });
  assert.equal(written.doc.body, "");
  assert.equal(input.body, undefined);

  for (const [id, timestamp] of [["blank", " "], ["number", 0], ["null", null]] as const) {
    const defaulted = await writeDocVersioned(
      bundle,
      doc(`notes/defaulted-${id}`, { type: "Note", timestamp } as never, "body"),
    );
    assert.match(String(defaulted.doc.frontmatter.timestamp), /^\d{4}-\d\d-\d\dT/);
    assert.notEqual(defaulted.doc.frontmatter.timestamp, timestamp);
  }
});

test("write, versioned read, and history all reject reserved ids at the engine boundary", async () => {
  const bundle = memoryBundle();
  const cases = [
    ["index.md", "index.md"],
    ["nested/log.md", "nested/log.md"],
  ] as const;

  for (const [id, rel] of cases) {
    await assert.rejects(
      () => writeDocVersioned(bundle, doc(id, { type: "Concept" })),
      (error: unknown) =>
        error instanceof InvalidInputError &&
        error.message === `'${id}' maps to a reserved file (${rel}); use the index/log accessors, not writeDoc.`,
    );
    for (const operation of [
      () => readDocVersioned(bundle, id),
      () => docVersions(bundle, id),
    ]) {
      await assert.rejects(
        operation,
        (error: unknown) =>
          error instanceof InvalidInputError &&
          error.message === `'${id}' is a reserved file (index.md / log.md), not a concept document.`,
      );
    }
  }
});

test("deleteDoc still admits ordinary ids and remains idempotent after enforcing reserved-file guards", async () => {
  const bundle = memoryBundle();
  await writeDocVersioned(bundle, doc("notes/delete-me", { type: "Note", timestamp: T }));
  assert.equal(await deleteDoc(bundle, "notes/delete-me"), true);
  assert.equal(await deleteDoc(bundle, "notes/delete-me"), false);
});

test("matchesFilter distinguishes absent facets, empty tag filters, arrays, nulls, and falsey scalars", () => {
  const candidate = {
    id: "tasks/a",
    frontmatter: { type: "Task", tags: "not-an-array", status: ["todo", "done"], zero: 0, flag: false, empty: null },
  };
  assert.equal(matchesFilter(candidate, { tags: [] }), true);
  assert.equal(matchesFilter(candidate, { tags: ["not-an-array"] }), false);
  assert.equal(matchesFilter(candidate, { fields: { status: "done" } }), true);
  assert.equal(matchesFilter(candidate, { fields: { status: "missing" } }), false);
  assert.equal(matchesFilter(candidate, { fields: { zero: "0", flag: "false" } }), true);
  assert.equal(matchesFilter(candidate, { fields: { empty: "null" } }), false);
  assert.equal(matchesFilter(candidate, { fields: { absent: "undefined" } }), false);
  assert.equal(matchesFilter(candidate, { prefix: "tasks/", type: "Task", fields: { status: "done" } }), true);
});

class ReverseListBackend extends MemoryBackend {
  override async list(prefix?: string): Promise<ConceptId[]> {
    return (await super.list(prefix)).reverse();
  }
}

class UnsortedHeadsBackend extends MemoryBackend {
  override async queryHeads(_filter?: QueryFilter): Promise<HeadResult[]> {
    return [
      { id: "z", frontmatter: { type: "Task" }, version: "sha256:" + "3".repeat(64) as Version },
      { id: "ignored", frontmatter: { type: "Note" }, version: "sha256:" + "2".repeat(64) as Version },
      { id: "a", frontmatter: { type: "Task" }, version: "sha256:" + "1".repeat(64) as Version },
    ];
  }
}

class BatchFailureBackend extends MemoryBackend {
  private readonly failure: unknown;

  constructor(failure: unknown) {
    super();
    this.failure = failure;
  }

  override async readMany(_ids: ConceptId[]): Promise<never> {
    throw this.failure;
  }
}

class PerDocFailureBackend extends MemoryBackend {
  readonly failure = new Error("per-doc storage failure");

  override async readMany(_ids: ConceptId[]): Promise<never> {
    throw Object.assign(new Error("listed document vanished"), { code: "ENOENT" });
  }

  override async read(id: ConceptId) {
    if (id === "bad") throw this.failure;
    return super.read(id);
  }
}

test("query owns deterministic id ordering even when a backend returns reversed ids", async () => {
  const backend = new ReverseListBackend();
  const bundle: Bundle = { root: "mem://reverse", backend };
  await backend.write("z", doc("z", { type: "T", timestamp: T }));
  await backend.write("a", doc("a", { type: "T", timestamp: T }));
  await backend.write("m", doc("m", { type: "T", timestamp: T }));
  assert.deepEqual((await query(bundle)).map((entry) => entry.id), ["a", "m", "z"]);
});

test("queryHeads re-applies filtering and deterministic ordering to an over-returning push-down", async () => {
  const bundle: Bundle = { root: "mem://heads", backend: new UnsortedHeadsBackend() };
  const heads = await queryHeads(bundle, { type: "Task" });
  assert.deepEqual(heads.map((entry) => entry.id), ["a", "z"]);
});

test("query never converts arbitrary batch or fallback read failures into vanished/malformed skips", async () => {
  const batchFailure = new Error("batch storage failure");
  const batch = new BatchFailureBackend(batchFailure);
  await batch.write("a", doc("a", { type: "T", timestamp: T }));
  const batchSkips: unknown[] = [];
  await assert.rejects(
    () => query({ root: "mem://batch", backend: batch }, {}, { onSkip: (entry) => batchSkips.push(entry) }),
    (error: unknown) => error === batchFailure,
  );
  assert.deepEqual(batchSkips, []);

  const fallback = new PerDocFailureBackend();
  await fallback.write("bad", doc("bad", { type: "T", timestamp: T }));
  const skipped: unknown[] = [];
  await assert.rejects(
    () => query({ root: "mem://fallback", backend: fallback }, {}, { onSkip: (entry) => skipped.push(entry) }),
    (error: unknown) => error === fallback.failure,
  );
  assert.deepEqual(skipped, []);
});

test("parseLinks remains the public path to the one markdown-link resolver", () => {
  const links = parseLinks(memoryBundle(), doc("notes/a", { type: "Note" }, "[Task](../tasks/t.md) [web](https://example.com)"));
  assert.deepEqual(links, [{ from: "notes/a", to: "tasks/t", text: "Task", href: "../tasks/t.md" }]);
});

test("edge selectors normalize one leading slash and strip only a terminal markdown extension", async () => {
  const bundle = memoryBundle();
  await writeDocVersioned(bundle, doc("notes/a", { type: "Note", timestamp: T }, "[Task](../tasks/t.md) [Deep](../tasks/t/suffix.md)"));
  assert.deepEqual(
    (await queryEdges(bundle, { from: "/notes/a", to: "/tasks/t.md" })).map((edge) => edge.to),
    ["tasks/t"],
  );
  assert.deepEqual(await queryEdges(bundle, { to: "tasks/t.md/suffix" }), []);
});
