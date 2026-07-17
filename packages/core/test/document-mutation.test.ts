import assert from "node:assert/strict";
import { test } from "node:test";

import { readDocVersioned, writeDocVersioned } from "../src/bundle.js";
import {
  KindConformanceError,
  mutateDocument,
} from "../src/document-mutation.js";
import { MemoryBackend } from "../src/memory-backend.js";
import { VersionConflict } from "../src/versioning.js";
import type { KindConvention, KindRegistry } from "../src/kinds.js";
import type { Bundle, ConceptId, OkfDocument, Version, WriteOptions } from "../src/types.js";

const EMPTY_REGISTRY: KindRegistry = { kinds: new Map(), warnings: [] };

function bundleFor(backend: MemoryBackend): Bundle {
  return { root: "/unused", backend };
}

function candidate(title: string, body: string, timestamp = "2026-07-16T00:00:00.000Z") {
  return { frontmatter: { type: "Note", title, timestamp }, body };
}

class RaceOnceBackend extends MemoryBackend {
  private race?: { id: ConceptId; doc: OkfDocument };

  raceNextWrite(id: ConceptId, doc: OkfDocument): void {
    this.race = { id, doc };
  }

  override async write(id: ConceptId, doc: OkfDocument, options: WriteOptions = {}): Promise<Version> {
    if (this.race?.id === id) {
      const race = this.race;
      this.race = undefined;
      await super.write(id, race.doc, { expectedVersion: options.expectedVersion, actor: "competitor" });
    }
    return super.write(id, doc, options);
  }
}

test("create-only is an expect-absent CAS and reports the winning head after a concurrent create", async () => {
  const backend = new RaceOnceBackend();
  const bundle = bundleFor(backend);
  backend.raceNextWrite("notes/a", { id: "notes/a", ...candidate("Competitor", "theirs") });

  await assert.rejects(
    () => mutateDocument({
      bundle,
      id: "notes/a",
      mode: "create-only",
      registry: EMPTY_REGISTRY,
      strict: false,
      buildCandidate: () => candidate("Mine", "mine"),
    }),
    VersionConflict,
  );

  assert.equal((await readDocVersioned(bundle, "notes/a")).doc.body, "theirs");
  assert.equal((await backend.versions("notes/a")).length, 1);
});

test("ordinary patch re-reads, re-decides, and merges after a benign CAS race", async () => {
  const backend = new RaceOnceBackend();
  const bundle = bundleFor(backend);
  await writeDocVersioned(bundle, { id: "notes/a", ...candidate("A", "base") });
  backend.raceNextWrite("notes/a", { id: "notes/a", ...candidate("A", "base|theirs") });

  const seen: string[] = [];
  const result = await mutateDocument({
    bundle,
    id: "notes/a",
    mode: "patch",
    registry: EMPTY_REGISTRY,
    strict: false,
    buildCandidate: (existing) => {
      seen.push(existing!.body);
      return { frontmatter: { ...existing!.frontmatter }, body: `${existing!.body}|mine` };
    },
  });

  assert.deepEqual(seen, ["base", "base|theirs"]);
  assert.equal(result.doc.body, "base|theirs|mine");
  assert.equal(result.version, (await readDocVersioned(bundle, "notes/a")).version);
  assert.equal((await backend.versions("notes/a")).length, 3);
});

test("explicit expectedVersion is a hard single-shot CAS checked before no-op convergence", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);
  const stale = (await writeDocVersioned(bundle, { id: "notes/a", ...candidate("A", "v1") })).version;
  const current = await writeDocVersioned(bundle, { id: "notes/a", ...candidate("A", "v2") });

  await assert.rejects(
    () => mutateDocument({
      bundle,
      id: "notes/a",
      mode: "patch",
      registry: EMPTY_REGISTRY,
      strict: false,
      expectedVersion: stale,
      buildCandidate: (existing) => ({
        frontmatter: { ...existing!.frontmatter },
        body: existing!.body,
      }),
    }),
    (error: unknown) => error instanceof VersionConflict && error.actual === current.version,
  );

  assert.equal((await backend.versions("notes/a")).length, 2);
});

test("semantic patch no-op ignores an auto-refreshed timestamp and returns the unchanged final receipt", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);
  const initial = await writeDocVersioned(bundle, { id: "notes/a", ...candidate("A", "same") });

  const result = await mutateDocument({
    bundle,
    id: "notes/a",
    mode: "patch",
    registry: EMPTY_REGISTRY,
    strict: false,
    actor: "mike/codex",
    persistActor: true,
    buildCandidate: (existing) => ({
      frontmatter: { ...existing!.frontmatter, timestamp: "2026-07-17T00:00:00.000Z" },
      body: existing!.body,
    }),
  });

  assert.equal(result.changed, false);
  assert.equal(result.version, initial.version);
  assert.equal(result.doc.frontmatter.actor, undefined);
  assert.equal((await backend.versions("notes/a")).length, 1);
});

test("strict kind rejection is typed, happens after timestamp defaulting, and performs no write", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);
  const noteKind: KindConvention = {
    id: "conventions/note",
    title: "Note",
    governs: "Note",
    fields: {
      required: ["title", "timestamp", "status"],
      optional: [],
      values: {},
      terminal: {},
      descriptions: {},
    },
  };
  const registry: KindRegistry = { kinds: new Map([["Note", noteKind]]), warnings: [] };

  await assert.rejects(
    () => mutateDocument({
      bundle,
      id: "notes/a",
      mode: "create-only",
      registry,
      strict: true,
      buildCandidate: () => ({ frontmatter: { type: "Note", title: "A" }, body: "body" }),
    }),
    (error: unknown) =>
      error instanceof KindConformanceError
      && error.violations.some((warning) => warning.field === "status")
      && !error.violations.some((warning) => warning.field === "timestamp"),
  );

  assert.deepEqual(await backend.list(), []);
});

test("writes propagate actor attribution and return the actual persisted head version", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);

  const result = await mutateDocument({
    bundle,
    id: "notes/a",
    mode: "create-only",
    registry: EMPTY_REGISTRY,
    strict: false,
    actor: "mike/codex",
    persistActor: true,
    buildCandidate: () => candidate("A", "body"),
  });

  const head = await readDocVersioned(bundle, "notes/a");
  const history = await backend.versions("notes/a");
  assert.equal(result.changed, true);
  assert.equal(result.version, head.version);
  assert.equal(result.doc.frontmatter.actor, "mike/codex");
  assert.equal(history[0]!.actor, "mike/codex");
});
