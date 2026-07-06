/**
 * Kind conventions — the bundle-declared document-kind registry (`../src/kinds.ts`).
 *
 * Covers: registry build over both adapters + one wire-parity check (the SAME
 * discovery/validation/horizon logic over `RemoteBackend`, router-as-transport, no
 * sockets — mirroring `wire-protocol.test.ts`'s pattern); prefix-scoping (a
 * `Convention` doc OUTSIDE `conventions/` is not discovered — documented behavior,
 * not a bug); required/enum/section validation incl. the empty-description and
 * YAML-boolean-enum-member edge cases; horizon parsing incl. malformed;
 * malformed-convention skip; duplicate-`governs`.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { createRouter } from "@agentstate-lite/server";
import { MemoryBackend as ServerMemoryBackend } from "@agentstate-lite/core";

import { initBundle, query, writeDoc } from "../src/bundle.js";
import { FilesystemBackend } from "../src/backend.js";
import { MemoryBackend } from "../src/memory-backend.js";
import { RemoteBackend } from "../src/remote-backend.js";
import {
  CONVENTIONS_PREFIX,
  CONVENTION_TYPE,
  freshnessHorizonMs,
  kindConventionDoc,
  loadKinds,
  validateAgainstKind,
  type KindConvention,
} from "../src/kinds.js";
import type { Bundle, OkfDocument } from "../src/types.js";

const T = "2026-07-02T00:00:00.000Z";

/**
 * A GENERIC synthetic kind fixture (shape-identical to the CLI's `context-notes` recipe's
 * `CONTEXT_NOTE_KIND`, which moved out of core in Recipes Unit A — see `packages/cli/src/recipes.ts`).
 * These generic-derivation tests (`freshnessHorizonMs`/`validateAgainstKind`/`kindConventionDoc`)
 * exercise core's pure helpers and do not need the REAL Context Note kind; a local fixture keeps
 * them independent of the CLI's recipe content.
 */
const NOTE_KIND_FIXTURE: KindConvention = {
  id: "conventions/context-note",
  title: "Context Note",
  governs: "Context Note",
  path: "context-notes/",
  fields: { required: ["title", "timestamp"], optional: ["description", "tags"], values: {} },
  sections: ["Summary"],
  freshnessHorizon: "24h",
};

/** A `Roadmap Item` kind convention doc, matching the plan's worked example shape. */
const ROADMAP_KIND_DOC: OkfDocument = {
  id: "conventions/roadmap-item",
  frontmatter: {
    type: CONVENTION_TYPE,
    title: "Roadmap Item",
    governs: "Roadmap Item",
    path: "roadmap/",
    fields: {
      required: ["title", "status"],
      optional: ["horizon"],
      values: { status: ["planned", "active", "done"] },
    },
    sections: ["Why", "Done when"],
    freshness_horizon: "30d",
    timestamp: T,
  },
  body: "Roadmap items track committed-but-not-yet-built work.",
};

async function withFsBundle(fn: (bundle: Bundle) => Promise<void>): Promise<void> {
  const root = await mkdtemp(path.join(tmpdir(), "okf-kinds-fs-"));
  try {
    await fn({ root, backend: new FilesystemBackend(root) });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function withMemBundle(fn: (bundle: Bundle) => Promise<void>): Promise<void> {
  await fn({ root: "mem://kinds-bundle", backend: new MemoryBackend() });
}

const RUNNERS = [
  ["FilesystemBackend", withFsBundle],
  ["MemoryBackend", withMemBundle],
] as const;

for (const [name, run] of RUNNERS) {
  test(`${name}: loadKinds discovers a Convention doc under conventions/ and parses its declared shape`, async () => {
    await run(async (bundle) => {
      await writeDoc(bundle, ROADMAP_KIND_DOC);
      const registry = await loadKinds(bundle);
      assert.deepEqual(registry.warnings, []);
      assert.equal(registry.kinds.size, 1);
      const kind = registry.kinds.get("Roadmap Item");
      assert.ok(kind);
      assert.equal(kind!.id, "conventions/roadmap-item");
      assert.equal(kind!.path, "roadmap/");
      assert.deepEqual(kind!.fields.required, ["title", "status"]);
      assert.deepEqual(kind!.fields.optional, ["horizon"]);
      assert.deepEqual(kind!.fields.values, { status: ["planned", "active", "done"] });
      assert.deepEqual(kind!.sections, ["Why", "Done when"]);
      assert.equal(kind!.freshnessHorizon, "30d");
      assert.equal(freshnessHorizonMs(kind!), 30 * 86_400_000);
    });
  });

  test(`${name}: loadKinds is a cheap empty registry for a conventions-free bundle`, async () => {
    await run(async (bundle) => {
      await writeDoc(bundle, { id: "concepts/a", frontmatter: { type: "Concept", timestamp: T }, body: "x" });
      const registry = await loadKinds(bundle);
      assert.equal(registry.kinds.size, 0);
      assert.deepEqual(registry.warnings, []);
    });
  });

  test(`${name}: prefix-scoping — a Convention doc OUTSIDE conventions/ is not discovered`, async () => {
    await run(async (bundle) => {
      await writeDoc(bundle, { ...ROADMAP_KIND_DOC, id: "specs/roadmap-item" });
      const registry = await loadKinds(bundle);
      assert.equal(registry.kinds.size, 0, "a Convention doc outside conventions/ must not register a kind");
    });
  });

  test(`${name}: malformed convention docs are skipped with a collected warning, never thrown`, async () => {
    await run(async (bundle) => {
      await writeDoc(bundle, {
        id: "conventions/no-governs",
        frontmatter: { type: CONVENTION_TYPE, title: "Broken", timestamp: T },
        body: "missing 'governs'.",
      });
      await writeDoc(bundle, ROADMAP_KIND_DOC);
      const registry = await loadKinds(bundle);
      assert.equal(registry.kinds.size, 1);
      assert.ok(registry.kinds.has("Roadmap Item"));
      assert.equal(registry.warnings.length, 1);
      assert.equal(registry.warnings[0]!.code, "KIND_CONVENTION_MALFORMED");
      assert.match(registry.warnings[0]!.message, /no-governs/);
    });
  });

  test(`${name}: duplicate governs — first-by-id declaration wins, the shadowed one warns`, async () => {
    await run(async (bundle) => {
      await writeDoc(bundle, { ...ROADMAP_KIND_DOC, id: "conventions/a-roadmap-item" });
      await writeDoc(bundle, { ...ROADMAP_KIND_DOC, id: "conventions/z-roadmap-item", body: "a second declaration" });
      const registry = await loadKinds(bundle);
      assert.equal(registry.kinds.size, 1);
      assert.equal(registry.kinds.get("Roadmap Item")!.id, "conventions/a-roadmap-item"); // first-by-id
      assert.equal(registry.warnings.length, 1);
      assert.equal(registry.warnings[0]!.code, "KIND_DUPLICATE_GOVERNS");
    });
  });

  test(`${name}: a malformed freshness_horizon is ignored with a warning, kind still registers`, async () => {
    await run(async (bundle) => {
      await writeDoc(bundle, {
        ...ROADMAP_KIND_DOC,
        frontmatter: { ...ROADMAP_KIND_DOC.frontmatter, freshness_horizon: "not-a-horizon" },
      });
      const registry = await loadKinds(bundle);
      const kind = registry.kinds.get("Roadmap Item");
      assert.ok(kind);
      assert.equal(freshnessHorizonMs(kind!), undefined);
      assert.ok(registry.warnings.some((w) => w.code === "KIND_HORIZON_MALFORMED"));
    });
  });

  test(`${name}: a ZERO freshness_horizon ("0h") is rejected the same as malformed — never an instantly-stale horizon (F7 regression)`, async () => {
    await run(async (bundle) => {
      await writeDoc(bundle, {
        ...ROADMAP_KIND_DOC,
        frontmatter: { ...ROADMAP_KIND_DOC.frontmatter, freshness_horizon: "0h" },
      });
      const registry = await loadKinds(bundle);
      const kind = registry.kinds.get("Roadmap Item");
      assert.ok(kind);
      assert.equal(freshnessHorizonMs(kind!), undefined, "a zero horizon must not silently make everything instantly stale");
      assert.ok(registry.warnings.some((w) => w.code === "KIND_HORIZON_MALFORMED"));
    });
  });

  test(`${name}: a convention declaring a CLI-reserved field name ('type') is filtered out with a warning, not silently accepted (F2 regression)`, async () => {
    await run(async (bundle) => {
      await writeDoc(bundle, {
        id: "conventions/hijack",
        frontmatter: {
          type: CONVENTION_TYPE,
          title: "Hijack",
          governs: "Hijack",
          fields: { required: ["title", "type"], optional: ["dir"] },
          timestamp: T,
        },
        body: "A convention that tries to declare reserved field names as its own.",
      });
      const registry = await loadKinds(bundle);
      const kind = registry.kinds.get("Hijack");
      assert.ok(kind);
      // 'type' and 'dir' are filtered OUT of required/optional entirely — never reachable as a
      // `new --<field>` flag, and never overwrites the governed `type` at write time.
      assert.deepEqual(kind!.fields.required, ["title"]);
      assert.deepEqual(kind!.fields.optional, []);
      const warning = registry.warnings.find((w) => w.code === "KIND_RESERVED_FIELD");
      assert.ok(warning, "expected a KIND_RESERVED_FIELD warning");
      assert.match(warning!.message, /type/);
      assert.match(warning!.message, /dir/);
    });
  });
}

// ── convention-doc shape warnings (usability finding F2: agents fed 8 wrong YAML shapes for enum
// constraints and every one was silently accepted, enforcing nothing; a required list fed OBJECTS
// silently corrupted to "[object Object]" entries). parseConventionDoc must be STRICT inside the
// blocks core owns (`fields:`) and PERMISSIVE everywhere else (OKF §9 permits unknown
// frontmatter) — these tests pin that asymmetry. ─────────────────────────────────────────────

test("loadKinds: an unrecognized key inside 'fields:' (not required/optional/values) warns naming the key + valid keys, and contributes nothing", async () => {
  await withMemBundle(async (bundle) => {
    await writeDoc(bundle, {
      id: "conventions/fields-enum",
      frontmatter: {
        type: CONVENTION_TYPE,
        governs: "Status Kind",
        // 'fields.enum' is one of the 8 wrong shapes the F2 study caught agents reaching for.
        fields: { required: ["title"], optional: [], enum: ["a", "b"] },
        timestamp: T,
      },
      body: "A convention with a misplaced 'fields.enum' key.",
    });
    const registry = await loadKinds(bundle);
    const kind = registry.kinds.get("Status Kind");
    assert.ok(kind);
    assert.deepEqual(kind!.fields.required, ["title"]);
    assert.deepEqual(kind!.fields.values, {}); // the bogus key enforces NOTHING — never silently accepted
    const warning = registry.warnings.find((w) => w.code === "KIND_CONVENTION_UNKNOWN_FIELDS_KEY");
    assert.ok(warning, "expected a KIND_CONVENTION_UNKNOWN_FIELDS_KEY warning");
    assert.match(warning!.message, /fields\.enum/);
    assert.match(warning!.message, /fields\.required.*fields\.optional.*fields\.values/);
  });
});

test("loadKinds: an object member in 'fields.required' warns and is DROPPED, never stringified to '[object Object]' (F2 regression)", async () => {
  await withMemBundle(async (bundle) => {
    await writeDoc(bundle, {
      id: "conventions/objects-in-required",
      frontmatter: {
        type: CONVENTION_TYPE,
        governs: "Objects Kind",
        // 'required' fed a list of OBJECTS — the exact silent-corruption case from the study.
        fields: { required: ["title", { name: "status" }], optional: [] },
        timestamp: T,
      },
      body: "A convention whose 'required' list carries an object member.",
    });
    const registry = await loadKinds(bundle);
    const kind = registry.kinds.get("Objects Kind");
    assert.ok(kind);
    assert.deepEqual(kind!.fields.required, ["title"]); // the object member is DROPPED, not stringified
    assert.ok(!kind!.fields.required.some((f) => f.includes("object Object")));
    const warning = registry.warnings.find((w) => w.code === "KIND_CONVENTION_BAD_MEMBER");
    assert.ok(warning, "expected a KIND_CONVENTION_BAD_MEMBER warning");
    assert.match(warning!.message, /fields\.required/);
  });
});

test("loadKinds: a 'fields.values' key naming a field NOT in required/optional warns (a declared constraint on an undeclared field)", async () => {
  await withMemBundle(async (bundle) => {
    await writeDoc(bundle, {
      id: "conventions/undeclared-values",
      frontmatter: {
        type: CONVENTION_TYPE,
        governs: "Undeclared Kind",
        // 'status' is constrained but never declared required/optional.
        fields: { required: ["title"], optional: [], values: { status: ["planned", "done"] } },
        timestamp: T,
      },
      body: "A convention constraining 'status' without declaring it required/optional.",
    });
    const registry = await loadKinds(bundle);
    const kind = registry.kinds.get("Undeclared Kind");
    assert.ok(kind);
    assert.deepEqual(kind!.fields.values, { status: ["planned", "done"] }); // still registers — a warning, not a rejection
    const warning = registry.warnings.find((w) => w.code === "KIND_CONVENTION_UNDECLARED_VALUES_FIELD");
    assert.ok(warning, "expected a KIND_CONVENTION_UNDECLARED_VALUES_FIELD warning");
    assert.match(warning!.message, /status/);
  });
});

test("loadKinds: a top-level near-miss constraint key ('enum'/'enums'/'values'/'constraints') warns 'did you mean fields.values?'", async () => {
  await withMemBundle(async (bundle) => {
    await writeDoc(bundle, {
      id: "conventions/top-level-enum",
      frontmatter: {
        type: CONVENTION_TYPE,
        governs: "Top Level Kind",
        fields: { required: ["title"], optional: [] },
        enum: ["a", "b"], // one of the 8 wrong shapes the F2 study caught agents reaching for
        timestamp: T,
      },
      body: "A convention with a top-level 'enum:' key instead of fields.values.",
    });
    const registry = await loadKinds(bundle);
    assert.ok(registry.kinds.get("Top Level Kind")); // still registers — a warning, not a rejection
    const warning = registry.warnings.find((w) => w.code === "KIND_CONVENTION_MISPLACED_KEY");
    assert.ok(warning, "expected a KIND_CONVENTION_MISPLACED_KEY warning");
    assert.match(warning!.message, /fields\.values/);
  });
});

test("loadKinds: an arbitrary OTHER top-level frontmatter key produces NO warning (permissive outside fields:, per OKF §9's unknown-frontmatter tolerance)", async () => {
  await withMemBundle(async (bundle) => {
    await writeDoc(bundle, {
      id: "conventions/extra-key",
      frontmatter: {
        type: CONVENTION_TYPE,
        governs: "Extra Key Kind",
        fields: { required: ["title"], optional: [] },
        owner: "team-foo", // an arbitrary producer-added key, not in the small deny-adjacent set
        status_enum: ["a", "b"], // a field-name-keyed near-miss — deliberately NOT denylisted
        timestamp: T,
      },
      body: "A convention with harmless extra top-level keys a producer might legitimately add.",
    });
    const registry = await loadKinds(bundle);
    assert.deepEqual(registry.warnings, []);
    assert.ok(registry.kinds.get("Extra Key Kind"));
  });
});

test("wire: loadKinds over a RemoteBackend bundle equals a local bundle (router-as-transport, no sockets)", async () => {
  const serverBackend = new ServerMemoryBackend();
  const serverBundle: Bundle = { root: "mem://kinds-wire-server", backend: serverBackend };
  await writeDoc(serverBundle, ROADMAP_KIND_DOC);
  const router = createRouter(serverBundle);
  const remoteBundle: Bundle = {
    root: "wire://kinds-client",
    backend: new RemoteBackend({ baseUrl: "http://wire.local", bundle: "test", fetchImpl: router }),
  };

  const localBundle: Bundle = { root: "mem://kinds-wire-local", backend: new MemoryBackend() };
  await writeDoc(localBundle, ROADMAP_KIND_DOC);

  const [remoteRegistry, localRegistry] = await Promise.all([loadKinds(remoteBundle), loadKinds(localBundle)]);
  assert.deepEqual(remoteRegistry.warnings, localRegistry.warnings);
  assert.deepEqual([...remoteRegistry.kinds.entries()], [...localRegistry.kinds.entries()]);
  const kind = remoteRegistry.kinds.get("Roadmap Item");
  assert.ok(kind);
  assert.equal(freshnessHorizonMs(kind!), 30 * 86_400_000);
});

test("freshnessHorizonMs: parses <n>(m|h|d); undefined for absent/malformed", () => {
  assert.equal(freshnessHorizonMs({ ...NOTE_KIND_FIXTURE, freshnessHorizon: "24h" }), 24 * 3_600_000);
  assert.equal(freshnessHorizonMs({ ...NOTE_KIND_FIXTURE, freshnessHorizon: "15m" }), 15 * 60_000);
  assert.equal(freshnessHorizonMs({ ...NOTE_KIND_FIXTURE, freshnessHorizon: "2d" }), 2 * 86_400_000);
  assert.equal(freshnessHorizonMs({ ...NOTE_KIND_FIXTURE, freshnessHorizon: undefined }), undefined);
  assert.equal(freshnessHorizonMs({ ...NOTE_KIND_FIXTURE, freshnessHorizon: "24hours" }), undefined);
  assert.equal(freshnessHorizonMs({ ...NOTE_KIND_FIXTURE, freshnessHorizon: "h24" }), undefined);
});

test("validateAgainstKind: required/enum/section warnings, incl. the optional-empty-description + summary-only-section case", () => {
  const roadmapKind = {
    id: "conventions/roadmap-item",
    title: "Roadmap Item",
    governs: "Roadmap Item",
    path: "roadmap/",
    fields: { required: ["title", "status"], optional: ["horizon"], values: { status: ["planned", "active", "done"] } },
    sections: ["Why", "Done when"],
  };

  // Missing required 'status', bad enum value, missing declared section.
  const bad: OkfDocument = {
    id: "roadmap/x",
    frontmatter: { type: "Roadmap Item", title: "X", status: "unstarted", timestamp: T },
    body: "# Why\n\nBecause.\n",
  };
  const warnings = validateAgainstKind(bad, roadmapKind);
  const codes = warnings.map((w) => w.code).sort();
  assert.deepEqual(codes, ["KIND_FIELD_VALUE", "KIND_SECTION_MISSING"]);

  // A fully-conforming instance produces no warnings.
  const good: OkfDocument = {
    id: "roadmap/y",
    frontmatter: { type: "Roadmap Item", title: "Y", status: "planned", timestamp: T },
    body: "# Why\n\nBecause.\n\n# Done when\n\nWhen shipped.\n",
  };
  assert.deepEqual(validateAgainstKind(good, roadmapKind), []);

  // The NOTE_KIND_FIXTURE (shape-identical to the CLI's context-notes recipe kind): a Context
  // Note instance can legitimately carry an EMPTY description (optional, not required) — a
  // Context Note with title+timestamp but no description must not fail its own convention. The
  // summary-only body is DELIBERATE: the fixture's `sections:` declares only `Summary` (the one
  // section the recipe scaffolds and every instance carries), so the most common minimal shape
  // must pass clean — the alert-fatigue guard this design pins.
  const note: OkfDocument = {
    id: "context-notes/w/s/c",
    frontmatter: { type: "Context Note", title: "c", description: "", timestamp: T, tags: ["s", "w", "c"] },
    body: "# Summary\n\nHi.\n",
  };
  assert.deepEqual(validateAgainstKind(note, NOTE_KIND_FIXTURE), []);

  // Missing title entirely on a Context Note IS a violation (the `# Summary` body isolates the
  // title violation from the fixture's Summary-section lint).
  const noTitle: OkfDocument = {
    id: "context-notes/w/s/c2",
    frontmatter: { type: "Context Note", timestamp: T },
    body: "# Summary\n\nHi.\n",
  };
  const noTitleWarnings = validateAgainstKind(noTitle, NOTE_KIND_FIXTURE);
  assert.equal(noTitleWarnings.length, 1);
  assert.equal(noTitleWarnings[0]!.code, "KIND_FIELD_MISSING");
  assert.equal(noTitleWarnings[0]!.field, "title");
});

test("validateAgainstKind: enum comparison tolerates a YAML-1.1-coerced non-string allowed value (unquoted 'no'/'on' etc.)", () => {
  // gray-matter/js-yaml parses an unquoted `no`/`yes`/`on`/`off` scalar as a BOOLEAN, so an author
  // who writes `values: flag: [no, yes]` unquoted ends up with `[false, true]` at the frontmatter
  // layer. validateAgainstKind must String-coerce both the allowed list and the actual field value
  // rather than crashing or silently never-matching.
  const kind = {
    id: "conventions/flagged",
    title: "Flagged",
    governs: "Flagged",
    fields: { required: [], optional: [], values: { flag: [false, true] as unknown as string[] } },
  };
  const doc: OkfDocument = { id: "flagged/x", frontmatter: { type: "Flagged", flag: false, timestamp: T }, body: "" };
  assert.deepEqual(validateAgainstKind(doc, kind), []); // 'false' coerces to allowed 'false'

  const badDoc: OkfDocument = { id: "flagged/y", frontmatter: { type: "Flagged", flag: "maybe", timestamp: T }, body: "" };
  const warnings = validateAgainstKind(badDoc, kind);
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0]!.code, "KIND_FIELD_VALUE");
});

test("validateAgainstKind: an enum-restricted field carrying an ARRAY is a KIND_FIELD_ARITY violation; non-enum arrays stay a feature", () => {
  const kind = {
    id: "conventions/roadmap-item",
    title: "Roadmap Item",
    governs: "Roadmap Item",
    fields: { required: ["title", "status"], optional: ["labels"], values: { status: ["planned", "active", "done"] } },
  };

  // Two ALLOWED members still violate arity — each passes the element-wise membership
  // check, which is exactly why this used to persist silently (even under --strict).
  const twoStatus: OkfDocument = {
    id: "roadmap/x",
    frontmatter: { type: "Roadmap Item", title: "X", status: ["planned", "done"], timestamp: T },
    body: "",
  };
  assert.deepEqual(validateAgainstKind(twoStatus, kind).map((w) => w.code), ["KIND_FIELD_ARITY"]);

  // A NON-enum field keeps its array feature untouched (`labels` has no values constraint).
  const arrayLabels: OkfDocument = {
    id: "roadmap/y",
    frontmatter: { type: "Roadmap Item", title: "Y", status: "planned", labels: ["a", "b"], timestamp: T },
    body: "",
  };
  assert.deepEqual(validateAgainstKind(arrayLabels, kind), []);

  // An array with a BAD member reports BOTH the arity violation and the membership one.
  const badMember: OkfDocument = {
    id: "roadmap/z",
    frontmatter: { type: "Roadmap Item", title: "Z", status: ["planned", "nope"], timestamp: T },
    body: "",
  };
  assert.deepEqual(
    validateAgainstKind(badMember, kind)
      .map((w) => w.code)
      .sort(),
    ["KIND_FIELD_ARITY", "KIND_FIELD_VALUE"],
  );
});

test("kindConventionDoc: round-trips through write/loadKinds to the same KindConvention shape", async () => {
  await withMemBundle(async (bundle) => {
    const doc = kindConventionDoc(NOTE_KIND_FIXTURE, "Prose about Context Notes.\n", T);
    assert.equal(doc.id, "conventions/context-note");
    assert.equal(doc.frontmatter.type, CONVENTION_TYPE);
    await writeDoc(bundle, doc);
    const registry = await loadKinds(bundle);
    const kind = registry.kinds.get("Context Note");
    assert.ok(kind);
    assert.equal(kind!.path, "context-notes/");
    assert.deepEqual(kind!.fields.required, ["title", "timestamp"]);
    assert.deepEqual(kind!.fields.optional, ["description", "tags"]);
    assert.equal(kind!.freshnessHorizon, "24h");
  });
});

// ── core never seeds (Recipes Unit A, CLAUDE.md gate 3) ──────────────────────────
//
// Context Note seeding moved OUT of core entirely into the CLI's recipe machinery
// (`packages/cli/src/recipes.ts`'s `context-notes` recipe + `applyRecipe`). The engine keeps only
// the generic `writeDocVersioned` expect-absent CAS primitive; it special-cases nothing about
// conventions. Coverage for the (now CLI-side) seed/idempotency/does-not-disturb-hand-edited
// behavior lives in `packages/cli/test/recipes.test.ts`.

test("initBundle: core never seeds — a bare init carries no conventions/ doc", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "okf-seed-off-"));
  try {
    const bundle = await initBundle(root);
    const registry = await loadKinds(bundle);
    assert.equal(registry.kinds.size, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

// ── list --fields fields on a Convention row: pin the nested-object rendering (Improvement 7) ──
// This exercises the CORE query path only (the CLI's TOON rendering of the resulting nested object
// is pinned separately in packages/cli/test — this test just locks in that `query` surfaces the raw
// `fields` object unmodified for a Convention row, which is what the CLI's `--fields` hatch reads).

test("query: a Convention doc's frontmatter.fields survives query() as a plain nested object (not stringified)", async () => {
  await withMemBundle(async (bundle) => {
    await writeDoc(bundle, ROADMAP_KIND_DOC);
    const docs = await query(bundle, { type: CONVENTION_TYPE });
    assert.equal(docs.length, 1);
    assert.deepEqual(docs[0]!.frontmatter.fields, {
      required: ["title", "status"],
      optional: ["horizon"],
      values: { status: ["planned", "active", "done"] },
    });
  });
});
