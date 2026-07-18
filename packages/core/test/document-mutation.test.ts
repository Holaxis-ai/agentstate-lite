import assert from "node:assert/strict";
import { test } from "node:test";

import { readDocVersioned, writeDocVersioned } from "../src/bundle.js";
import {
  DocumentNotFoundError,
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

class RaceEveryWriteBackend extends MemoryBackend {
  private racing = false;
  writeAttempts = 0;

  startRacing(): void {
    this.racing = true;
  }

  override async write(id: ConceptId, doc: OkfDocument, options: WriteOptions = {}): Promise<Version> {
    if (this.racing && id === "notes/a") {
      this.writeAttempts++;
      const current = await this.read(id);
      await super.write(id, {
        ...current.doc,
        body: `${current.doc.body}|competitor-${this.writeAttempts}`,
      }, { expectedVersion: options.expectedVersion, actor: "competitor" });
    }
    return super.write(id, doc, options);
  }
}

class ReadFailureBackend extends MemoryBackend {
  private readonly failure: unknown;

  constructor(failure: unknown) {
    super();
    this.failure = failure;
  }

  override async read(_id: ConceptId): Promise<never> {
    throw this.failure;
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

test("overwrite re-reads after a CAS race and returns its final persisted receipt", async () => {
  const backend = new RaceOnceBackend();
  const bundle = bundleFor(backend);
  await writeDocVersioned(bundle, { id: "notes/a", ...candidate("A", "base") });
  backend.raceNextWrite("notes/a", { id: "notes/a", ...candidate("A", "base|theirs") });

  const seen: string[] = [];
  const result = await mutateDocument({
    bundle,
    id: "notes/a",
    mode: "overwrite",
    registry: EMPTY_REGISTRY,
    strict: false,
    actor: "mike/codex",
    buildCandidate: (existing) => {
      seen.push(existing!.body);
      return candidate("A", `${existing!.body}|mine`);
    },
  });

  const head = await readDocVersioned(bundle, "notes/a");
  assert.deepEqual(seen, ["base", "base|theirs"]);
  assert.equal(result.changed, true);
  assert.equal(result.doc.body, "base|theirs|mine");
  assert.equal(result.version, head.version);
  assert.deepEqual(result.warnings, []);
  assert.equal((await backend.versions("notes/a"))[0]?.actor, "mike/codex");
});

test("overwrite reports its write posture even when the candidate is byte-identical", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);
  const initial = await writeDocVersioned(bundle, { id: "notes/a", ...candidate("A", "same") });

  const result = await mutateDocument({
    bundle,
    id: "notes/a",
    mode: "overwrite",
    registry: EMPTY_REGISTRY,
    strict: false,
    buildCandidate: (existing) => ({
      frontmatter: structuredClone(existing!.frontmatter),
      body: existing!.body,
    }),
  });

  assert.equal(result.changed, true);
  assert.equal(result.version, initial.version);
  assert.deepEqual(result.warnings, []);
});

test("onAbsent:create retries an expect-absent patch against a concurrent creator", async () => {
  const backend = new RaceOnceBackend();
  const bundle = bundleFor(backend);
  backend.raceNextWrite("notes/a", { id: "notes/a", ...candidate("A", "theirs") });

  const seen: Array<string | undefined> = [];
  const result = await mutateDocument({
    bundle,
    id: "notes/a",
    mode: "patch",
    registry: EMPTY_REGISTRY,
    strict: false,
    onAbsent: "create",
    buildCandidate: (existing) => {
      seen.push(existing?.body);
      return candidate("A", existing ? `${existing.body}|mine` : "mine");
    },
  });

  assert.deepEqual(seen, [undefined, "theirs"]);
  assert.equal(result.doc.body, "theirs|mine");
  assert.equal(result.version, (await readDocVersioned(bundle, "notes/a")).version);
});

test("maxAttempts bounds ordinary document retries", async () => {
  const backend = new RaceEveryWriteBackend();
  const bundle = bundleFor(backend);
  await writeDocVersioned(bundle, { id: "notes/a", ...candidate("A", "base") });
  backend.startRacing();

  await assert.rejects(
    () => mutateDocument({
      bundle,
      id: "notes/a",
      mode: "patch",
      registry: EMPTY_REGISTRY,
      strict: false,
      maxAttempts: 2,
      buildCandidate: (existing) => candidate("A", `${existing!.body}|mine`),
    }),
    VersionConflict,
  );

  assert.equal(backend.writeAttempts, 2);
});

test("non-ENOENT read failures propagate unchanged", async () => {
  for (const failure of [new Error("backend unavailable"), null]) {
    const bundle = bundleFor(new ReadFailureBackend(failure));
    await assert.rejects(
      () => mutateDocument({
        bundle,
        id: "notes/a",
        mode: "patch",
        registry: EMPTY_REGISTRY,
        strict: false,
        buildCandidate: () => candidate("A", "body"),
      }),
      (error: unknown) => error === failure,
    );
  }
});

test("array-valued frontmatter participates structurally in patch no-op detection", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);
  await writeDocVersioned(bundle, {
    id: "notes/a",
    frontmatter: {
      type: "Note",
      title: "A",
      tags: ["alpha", "beta"],
      emptyArray: [],
      secondEmptyArray: [],
      thirdEmptyArray: [],
      metadata: {},
      timestamp: "2026-07-16T00:00:00.000Z",
    },
    body: "same",
  });

  const patchFrontmatter = (update: (frontmatter: Record<string, unknown>) => void) =>
    mutateDocument({
      bundle,
      id: "notes/a",
      mode: "patch",
      registry: EMPTY_REGISTRY,
      strict: false,
      buildCandidate: (existing) => {
        const frontmatter = structuredClone(existing!.frontmatter) as Record<string, unknown>;
        update(frontmatter);
        return { frontmatter, body: existing!.body };
      },
    });

  const equal = await patchFrontmatter(() => undefined);
  assert.equal(equal.changed, false);
  assert.deepEqual(equal.warnings, []);

  const oneElementChanged = await patchFrontmatter((frontmatter) => {
    frontmatter.tags = ["alpha", "gamma"];
  });
  assert.equal(oneElementChanged.changed, true);

  const lengthChanged = await patchFrontmatter((frontmatter) => {
    frontmatter.tags = ["alpha"];
  });
  assert.equal(lengthChanged.changed, true);

  const arrayToObject = await patchFrontmatter((frontmatter) => {
    frontmatter.tags = {};
  });
  assert.equal(arrayToObject.changed, true);

  const emptyArrayToEmptyObject = await patchFrontmatter((frontmatter) => {
    frontmatter.emptyArray = {};
  });
  assert.equal(emptyArrayToEmptyObject.changed, true);

  const emptyArrayToNonemptyArray = await patchFrontmatter((frontmatter) => {
    frontmatter.secondEmptyArray = ["new"];
  });
  assert.equal(emptyArrayToNonemptyArray.changed, true);

  const emptyArrayToArrayLikeObject = await patchFrontmatter((frontmatter) => {
    frontmatter.thirdEmptyArray = { length: 0 };
  });
  assert.equal(emptyArrayToArrayLikeObject.changed, true);

  const objectToPrimitive = await patchFrontmatter((frontmatter) => {
    frontmatter.metadata = 1;
  });
  assert.equal(objectToPrimitive.changed, true);
});

test("persistActor without an actor does not synthesize an actor field", async () => {
  const backend = new MemoryBackend();
  const result = await mutateDocument({
    bundle: bundleFor(backend),
    id: "notes/a",
    mode: "create-only",
    registry: EMPTY_REGISTRY,
    strict: false,
    persistActor: true,
    buildCandidate: () => candidate("A", "body"),
  });

  assert.equal(Object.prototype.hasOwnProperty.call(result.doc.frontmatter, "actor"), false);
});

test("typed document mutation failures carry stable consumer-facing metadata", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);

  await assert.rejects(
    () => mutateDocument({
      bundle,
      id: "notes/missing",
      mode: "patch",
      registry: EMPTY_REGISTRY,
      strict: false,
      buildCandidate: () => candidate("A", "body"),
    }),
    (error: unknown) => {
      assert.ok(error instanceof DocumentNotFoundError);
      assert.equal(error.name, "DocumentNotFoundError");
      assert.equal(error.id, "notes/missing");
      assert.equal(error.message, "no concept document at id 'notes/missing'");
      return true;
    },
  );

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
      id: "notes/invalid",
      mode: "create-only",
      registry,
      strict: true,
      buildCandidate: () => ({ frontmatter: { type: "Note" }, body: "body" }),
    }),
    (error: unknown) => {
      assert.ok(error instanceof KindConformanceError);
      assert.equal(error.name, "KindConformanceError");
      assert.equal(error.id, "notes/invalid");
      assert.equal(error.governs, "Note");
      assert.ok(error.violations.length >= 2);
      assert.equal(
        error.message,
        `'notes/invalid' does not satisfy the 'Note' kind: ${error.violations.map((warning) => warning.message).join("; ")}`,
      );
      return true;
    },
  );
});

test("non-strict patch returns kind warnings from the winning write decision", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);
  await writeDocVersioned(bundle, { id: "notes/a", ...candidate("A", "base") });
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

  const result = await mutateDocument({
    bundle,
    id: "notes/a",
    mode: "patch",
    registry: { kinds: new Map([["Note", noteKind]]), warnings: [] },
    strict: false,
    buildCandidate: (existing) => {
      const frontmatter = { ...existing!.frontmatter };
      delete frontmatter.title;
      return { frontmatter, body: "changed" };
    },
  });

  assert.equal(result.changed, true);
  assert.ok(result.warnings.some((warning) => warning.field === "title"));
  assert.ok(result.warnings.some((warning) => warning.field === "status"));
});

// ── mutation-survivor pins (core-survivor-triage unit) ────────────────────────
// Red-proven pins for Stryker survivors from the first full core mutation report.

// kills: document-mutation.ts:148:20 LogicalOperator #853
// kills: document-mutation.ts:148:37 StringLiteral #854
// kills: document-mutation.ts:199:11 ConditionalExpression #899
test("pin: a patch of a MISSING doc fails typed by default (onAbsent defaults to 'fail') and writes nothing", async () => {
  const { DocumentNotFoundError } = await import("../src/document-mutation.js");
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);
  await assert.rejects(
    () => mutateDocument({
      bundle,
      id: "missing/doc",
      mode: "patch",
      registry: EMPTY_REGISTRY,
      strict: false,
      buildCandidate: () => candidate("X", "x"),
    }),
    DocumentNotFoundError,
  );
  assert.deepEqual(await backend.list(), []);
});

// kills: document-mutation.ts:118:7 ConditionalExpression #830
// kills: document-mutation.ts:149:28 LogicalOperator #855
// kills: document-mutation.ts:228:34 BooleanLiteral #928
test("pin: compareTimestamp:true makes a timestamp-only refresh a REAL write", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);
  await writeDocVersioned(bundle, { id: "notes/a", ...candidate("A", "same") });

  const result = await mutateDocument({
    bundle,
    id: "notes/a",
    mode: "patch",
    registry: EMPTY_REGISTRY,
    strict: false,
    compareTimestamp: true,
    buildCandidate: (existing) => ({
      frontmatter: { ...existing!.frontmatter, timestamp: "2026-07-17T00:00:00.000Z" },
      body: existing!.body,
    }),
  });

  assert.equal(result.changed, true);
  assert.equal(result.doc.frontmatter.timestamp, "2026-07-17T00:00:00.000Z");
  assert.equal((await backend.versions("notes/a")).length, 2);
});

// kills: document-mutation.ts:129:7 LogicalOperator #834
// kills: document-mutation.ts:150:45 BooleanLiteral #858
test("pin: actor is NOT persisted into frontmatter unless persistActor is set", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);
  const result = await mutateDocument({
    bundle,
    id: "notes/a",
    mode: "create-only",
    registry: EMPTY_REGISTRY,
    strict: false,
    actor: "alice",
    buildCandidate: () => candidate("A", "body"),
  });
  assert.equal(Object.prototype.hasOwnProperty.call(result.doc.frontmatter, "actor"), false);
  assert.equal((await backend.versions("notes/a"))[0]?.actor, "alice"); // attribution still rides the WRITE, not the doc
});

// kills: document-mutation.ts:203:22 ConditionalExpression #910
test("pin: hard CAS with the CURRENT head version succeeds in one shot", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);
  const current = (await writeDocVersioned(bundle, { id: "notes/a", ...candidate("A", "v1") })).version;
  const result = await mutateDocument({
    bundle,
    id: "notes/a",
    mode: "patch",
    registry: EMPTY_REGISTRY,
    strict: false,
    expectedVersion: current,
    buildCandidate: (existing) => ({ frontmatter: { ...existing!.frontmatter }, body: "v2" }),
  });
  assert.equal(result.changed, true);
  assert.equal(result.doc.body, "v2");
});

// kills: document-mutation.ts:97:7 ConditionalExpression #781
// kills: document-mutation.ts:97:7 EqualityOperator #783
// kills: document-mutation.ts:102:7 ConditionalExpression #802
// kills: document-mutation.ts:102:7 ConditionalExpression #807
// kills: document-mutation.ts:102:7 LogicalOperator #808
// kills: document-mutation.ts:102:17 ConditionalExpression #809
// kills: document-mutation.ts:107:12 ConditionalExpression #816
// kills: document-mutation.ts:107:12 ConditionalExpression #819
// kills: document-mutation.ts:107:45 MethodExpression #821
test("pin: a frontmatter-only structural change is a REAL change — added keys, one-of-two changed, null→{} and 1→{}", async () => {
  const backend = new MemoryBackend();
  const bundle = bundleFor(backend);
  const ts = "2026-07-16T00:00:00.000Z";
  await writeDocVersioned(bundle, {
    id: "notes/a",
    frontmatter: { type: "Note", title: "A", timestamp: ts, extra: null, num: 1 },
    body: "same",
  });

  const patch = (mutate: (fm: Record<string, unknown>) => void) =>
    mutateDocument({
      bundle,
      id: "notes/a",
      mode: "patch",
      registry: EMPTY_REGISTRY,
      strict: false,
      buildCandidate: (existing) => {
        const fm = { ...existing!.frontmatter } as Record<string, unknown>;
        mutate(fm);
        return { frontmatter: fm, body: existing!.body };
      },
    });

  const added = await patch((fm) => { fm.added = "new"; });
  assert.equal(added.changed, true);
  assert.equal(added.doc.frontmatter.added, "new");

  const oneOfTwo = await patch((fm) => { fm.title = "B"; });
  assert.equal(oneOfTwo.changed, true);
  assert.equal(oneOfTwo.doc.frontmatter.title, "B");

  const nullToObject = await patch((fm) => { fm.extra = {}; });
  assert.equal(nullToObject.changed, true);
  assert.deepEqual(nullToObject.doc.frontmatter.extra, {});

  const numToObject = await patch((fm) => { fm.num = {}; });
  assert.equal(numToObject.changed, true);
  assert.deepEqual(numToObject.doc.frontmatter.num, {});
});

// kills: document-mutation.ts:140:7 LogicalOperator #844
// kills: document-mutation.ts:140:7 LogicalOperator #846
// kills: document-mutation.ts:140:25 ConditionalExpression #847
// kills: document-mutation.ts:140:25 EqualityOperator #848
test("pin: the strict kind gate only throws for strict AND governed AND violating — conforming strict writes and non-strict violations pass", async () => {
  const noteKind: KindConvention = {
    id: "conventions/note",
    title: "Note",
    governs: "Note",
    fields: { required: ["title", "timestamp"], optional: [], values: {}, terminal: {}, descriptions: {} },
  };
  const registry: KindRegistry = { kinds: new Map([["Note", noteKind]]), warnings: [] };

  // strict + governed + CONFORMING → succeeds.
  {
    const backend = new MemoryBackend();
    const bundle = bundleFor(backend);
    const result = await mutateDocument({
      bundle,
      id: "notes/ok",
      mode: "create-only",
      registry,
      strict: true,
      buildCandidate: () => candidate("A", "body"),
    });
    assert.equal(result.changed, true);
    assert.deepEqual(result.warnings, []);
  }

  // NON-strict + governed + VIOLATING → warns, never throws.
  {
    const backend = new MemoryBackend();
    const bundle = bundleFor(backend);
    const result = await mutateDocument({
      bundle,
      id: "notes/warned",
      mode: "create-only",
      registry,
      strict: false,
      buildCandidate: () => ({ frontmatter: { type: "Note" }, body: "no title" }),
    });
    assert.equal(result.changed, true);
    assert.ok(result.warnings.length > 0);
  }
});
