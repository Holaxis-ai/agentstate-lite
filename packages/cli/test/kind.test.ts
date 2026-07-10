// `kind field <Kind> add/remove <name>` — editing a kind convention's declared schema (cold-start
// study: the recurring C3 maintenance-journey gap; `kinds` LISTS, `kind` EDITS).
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  initBundle,
  loadKinds,
  readDoc,
  writeDoc,
  CONVENTION_TYPE,
  MemoryBackend,
  type Bundle,
  type OkfDocument,
  type Version,
} from "@agentstate-lite/core";
import { serve, type ServerHandle } from "@agentstate-lite/server";
import { applyRecipe } from "../src/recipes.js";
import { CONTEXT_NOTES_RECIPE } from "../src/recipe-source.js";
import { kind } from "../src/commands/kind.js";
import { list } from "../src/commands/list.js";
import { status } from "../src/commands/status.js";
import { CliError } from "../src/errors.js";

/** Boot the reference server over `bundle` (a real socket listener, ephemeral port). */
async function bootServerOverBundle(bundle: Bundle): Promise<{ url: string; close: () => Promise<void> }> {
  const handle: ServerHandle = await serve({ bundle, port: 0 });
  return { url: `http://${handle.host}:${handle.port}`, close: () => handle.close() };
}

async function seeded(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-kind-test-"));
  await initBundle(dir);
  await applyRecipe({ root: dir }, CONTEXT_NOTES_RECIPE); // declares the Context Note kind
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

async function runKind(argv: string[]): Promise<Record<string, unknown>> {
  let out = "";
  await kind([...argv, "--json"], { stdout: (s) => (out += s) });
  return JSON.parse(out) as Record<string, unknown>;
}

test("kind field add: adds an optional field; the registry then declares it; idempotent re-add is changed:false", async () => {
  const { dir, cleanup } = await seeded();
  try {
    const r1 = await runKind(["field", "Context Note", "add", "due", "--dir", dir]);
    assert.equal(r1.changed, true);
    assert.ok((r1.optional as string[]).includes("due"));

    const reg = await loadKinds({ root: dir });
    assert.ok(reg.kinds.get("Context Note")!.fields.optional.includes("due"));

    const r2 = await runKind(["field", "Context Note", "add", "due", "--dir", dir]);
    assert.equal(r2.changed, false); // idempotent
  } finally {
    await cleanup();
  }
});

test("kind field add --values sets an enum and preserves governs/path (whole-convention preserved)", async () => {
  const { dir, cleanup } = await seeded();
  try {
    const r = await runKind(["field", "Context Note", "add", "level", "--values", "low,med,high", "--dir", dir]);
    assert.equal(r.changed, true);
    assert.deepEqual((r.values as Record<string, string[]>).level, ["low", "med", "high"]);

    // The edit touched ONLY fields — governs/path survive.
    const convId = (await loadKinds({ root: dir })).kinds.get("Context Note")!.id;
    const conv = await readDoc({ root: dir }, convId);
    assert.equal(conv.frontmatter.governs, "Context Note");
    assert.equal(conv.frontmatter.path, "context-notes/");
  } finally {
    await cleanup();
  }
});

test("kind field remove: drops the field; idempotent when already absent", async () => {
  const { dir, cleanup } = await seeded();
  try {
    const r1 = await runKind(["field", "Context Note", "remove", "tags", "--dir", dir]);
    assert.equal(r1.changed, true);
    assert.ok(!(r1.optional as string[]).includes("tags"));
    const r2 = await runKind(["field", "Context Note", "remove", "tags", "--dir", dir]);
    assert.equal(r2.changed, false);
  } finally {
    await cleanup();
  }
});

test("kind field guards: unknown kind, reserved field name, and a bad action are all USAGE (exit 2)", async () => {
  const { dir, cleanup } = await seeded();
  try {
    const cases: Array<[string[], RegExp]> = [
      [["field", "Bogus", "add", "x", "--dir", dir], /unknown kind 'Bogus'/],
      [["field", "Context Note", "add", "type", "--dir", dir], /reserved name/],
      [["field", "Context Note", "frobnicate", "x", "--dir", dir], /must be 'add' or 'remove'/],
    ];
    for (const [argv, re] of cases) {
      await assert.rejects(
        () => kind([...argv, "--json"], { stdout: () => {} }),
        (err: unknown) => {
          assert.ok(err instanceof CliError);
          assert.equal(err.code, "USAGE");
          assert.match(err.message, re);
          return true;
        },
      );
    }
  } finally {
    await cleanup();
  }
});

test("kind field preserves fields.* siblings it does not own: terminal (and unknown future keys) survive an unrelated edit, and list --open still filters", async () => {
  // Regression pin (PR #20 review, MAJOR): `kind field` used to REBUILD `fields` from a whitelist
  // of {required, optional, values}, so ANY kind-field edit silently destroyed a declared
  // `fields.terminal` — a clean exit-0 that turned `list --open` into a no-op. The fix is
  // structural: every sibling key under `fields` that the command does not own passes through
  // VERBATIM (lenient-parse posture), so a future declaration key cannot re-open the hole either —
  // pinned here with a deliberately-unrecognized `experimental` sibling alongside `terminal`.
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-kind-terminal-test-"));
  try {
    await initBundle(dir);
    await writeDoc(
      { root: dir },
      {
        id: "conventions/task",
        frontmatter: {
          type: CONVENTION_TYPE,
          title: "Task",
          governs: "Task",
          path: "tasks/",
          fields: {
            required: ["title", "status"],
            optional: [],
            values: { status: ["todo", "doing", "done", "canceled"] },
            terminal: { status: ["done", "canceled"] },
            experimental: { note: "an unrecognized future sibling — must survive verbatim" },
          },
          timestamp: "2026-07-01T00:00:00.000Z",
        },
        body: "A unit of work.",
      },
    );
    await writeDoc({ root: dir }, { id: "tasks/open", frontmatter: { type: "Task", title: "Open", status: "todo", timestamp: "2026-07-01T00:00:00.000Z" }, body: "" });
    await writeDoc({ root: dir }, { id: "tasks/done", frontmatter: { type: "Task", title: "Done", status: "done", timestamp: "2026-07-01T00:00:00.000Z" }, body: "" });

    const runListOpen = async (): Promise<string[]> => {
      let out = "";
      await list(["--type", "Task", "--open", "--dir", dir, "--json"], { stdout: (s) => (out += s) });
      const parsed = JSON.parse(out) as { docs: Array<{ id: string }> };
      return parsed.docs.map((d) => d.id).sort();
    };

    // Baseline: the terminal declaration is live — --open excludes the done Task.
    assert.deepEqual(await runListOpen(), ["tasks/open"], "baseline: --open filters before the edit");

    // The UNRELATED edit: add an optional field. Must not touch terminal or the unknown sibling.
    const r = await runKind(["field", "Task", "add", "due", "--dir", dir]);
    assert.equal(r.changed, true);

    // On-disk truth: the convention's raw frontmatter still carries BOTH sibling keys, verbatim.
    const conv = await readDoc({ root: dir }, "conventions/task");
    const fields = conv.frontmatter.fields as Record<string, unknown>;
    assert.deepEqual(fields.terminal, { status: ["done", "canceled"] }, "fields.terminal survived the unrelated edit");
    assert.deepEqual(
      fields.experimental,
      { note: "an unrecognized future sibling — must survive verbatim" },
      "an unrecognized fields.* sibling survived verbatim",
    );

    // Behavioral truth: --open still filters (the declaration still powers the derivation).
    assert.deepEqual(await runListOpen(), ["tasks/open"], "--open still filters after the edit");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("schema-evolution journey: kind field add --required makes status re-lint EXISTING docs; remove clears it", async () => {
  // The maintenance journey the `kind field` command exists for, verified across the command
  // boundary (kind → status): editing a kind's schema must be reflected when the SAME bundle's
  // pre-existing instances are re-linted — otherwise an evolved schema could silently report clean.
  const { dir, cleanup } = await seeded();
  try {
    // Two pre-existing Context Note instances (governed), neither carrying a `priority` field.
    await writeDoc({ root: dir }, { id: "notes/a", frontmatter: { type: "Context Note", title: "A", timestamp: "2026-07-01T00:00:00.000Z" }, body: "## Summary\n\nA." });
    await writeDoc({ root: dir }, { id: "notes/b", frontmatter: { type: "Context Note", title: "B", timestamp: "2026-07-01T00:00:00.000Z" }, body: "## Summary\n\nB." });

    const runStatus = async (): Promise<{ id: string; field: string }[]> => {
      let out = "";
      await status(["--limit", "0", "--dir", dir, "--json"], { stdout: (s) => (out += s) });
      const parsed = JSON.parse(out) as { kind_lint?: { rows: { id: string; field: string }[] } };
      return (parsed.kind_lint?.rows ?? []).filter((r) => r.field === "priority");
    };

    // Baseline: `priority` does not exist yet, so no doc is flagged for it.
    assert.equal((await runStatus()).length, 0, "no priority lint before the field exists");

    // Evolve the schema: add `priority` as REQUIRED.
    const added = await runKind(["field", "Context Note", "add", "priority", "--required", "--dir", dir]);
    assert.equal(added.changed, true);
    assert.ok((added.required as string[]).includes("priority"));

    // Re-lint: BOTH pre-existing docs are now flagged missing the newly-required field.
    const flagged = await runStatus();
    const flaggedIds = new Set(flagged.map((r) => r.id));
    assert.ok(flaggedIds.has("notes/a") && flaggedIds.has("notes/b"), "both existing docs now flagged for priority");

    // Roll it back: removing `priority` clears the warnings for those same docs.
    const removed = await runKind(["field", "Context Note", "remove", "priority", "--dir", dir]);
    assert.equal(removed.changed, true);
    assert.equal((await runStatus()).length, 0, "removing the field clears the lint");
  } finally {
    await cleanup();
  }
});

// ── Defect A (mutation-boundary consolidation): kind field's lost-update bug ───────────────────────
//
// `kind field` used to do an UNVERSIONED readDoc -> in-memory edit -> unconditional writeDoc with NO
// expectedVersion at all — a pure last-writer-wins race over the convention doc. Two concurrent `kind
// field add` calls declaring DIFFERENT fields would silently lose one: both read the same starting
// doc, both computed their own edit against it, and whichever write landed LAST won outright,
// clobbering the other's change with no error and no warning. Now routed through `mutateDoc`'s
// "patch" mode (a versioned read -> CAS write with a bounded conflict retry), the loser's retry
// re-reads the winner's write and re-applies its OWN edit on top — both fields survive.

// These two tests inject a competing write DETERMINISTICALLY at the exact moment our own write
// attempts to land — the same `backend.write` wrapper technique `doc.test.ts`'s coupleRead racer
// tests and `link.test.ts`'s addLink racer tests use — rather than relying on real concurrent
// `Promise.all` timing, which does not reliably reproduce this race (two real HTTP round-trips
// over loopback do not reliably overlap on the read/write critical section).

test("kind field: a competing writer's field-add (a DIFFERENT field) lands between our read and write — Defect A: both fields survive, not just the last writer's", async () => {
  const backend = new MemoryBackend();
  const bundle: Bundle = { root: "mem://kind-field-merge-race", backend };
  await applyRecipe(bundle, CONTEXT_NOTES_RECIPE); // declares the Context Note kind
  const registry = await loadKinds(bundle);
  const convId = registry.kinds.get("Context Note")!.id;

  // The FIRST time our own write attempts a real CAS write for the convention doc, inject a race:
  // a separate writer adds a DIFFERENT field first, using OUR OWN read's version (so it wins),
  // leaving our own write's token stale.
  const originalWrite = backend.write.bind(backend);
  let injected = false;
  backend.write = (async (id: string, d: OkfDocument, options?: { expectedVersion?: Version | null }) => {
    if (id === convId && !injected && options?.expectedVersion) {
      injected = true;
      const current = await backend.read(convId);
      const fm = current.doc.frontmatter;
      const fields = { ...(fm.fields as Record<string, unknown>) };
      const optional = Array.isArray(fields.optional) ? [...(fields.optional as string[])] : [];
      optional.push("field-b");
      await originalWrite(
        convId,
        { ...current.doc, frontmatter: { ...fm, fields: { ...fields, optional } } },
        { expectedVersion: options.expectedVersion },
      );
    }
    return originalWrite(id, d, options);
  }) as typeof backend.write;

  const server = await bootServerOverBundle(bundle);
  try {
    let out = "";
    await kind(["field", "Context Note", "add", "field-a", "--remote", server.url, "--json"], { stdout: (s) => (out += s) });
    const result = JSON.parse(out) as Record<string, unknown>;
    assert.equal(result.changed, true);

    // Both fields must be declared — a last-writer-wins (unversioned) write would show only
    // ONE of them here, since our own write would have silently clobbered the competing one.
    const conv = await readDoc(bundle, convId);
    const optional = (conv.frontmatter.fields as Record<string, unknown>).optional as string[];
    assert.ok(optional.includes("field-a"), "our own field survived");
    assert.ok(optional.includes("field-b"), "the competing writer's field survived (Defect A fix)");
  } finally {
    await server.close();
  }
});

test("kind field: a competing 'doc update'-style title edit lands between our read and write — never silently clobbered", async () => {
  const backend = new MemoryBackend();
  const bundle: Bundle = { root: "mem://kind-field-vs-title-race", backend };
  await applyRecipe(bundle, CONTEXT_NOTES_RECIPE);
  const registry = await loadKinds(bundle);
  const convId = registry.kinds.get("Context Note")!.id;

  // Same injection technique, but the competing write is an UNRELATED field (a title edit — the
  // shape a concurrent `doc update` to the SAME convention would make), never touching `fields` at
  // all — proving the fix isn't merely "two field edits happen to merge" but a genuine CAS retry.
  const originalWrite = backend.write.bind(backend);
  let injected = false;
  backend.write = (async (id: string, d: OkfDocument, options?: { expectedVersion?: Version | null }) => {
    if (id === convId && !injected && options?.expectedVersion) {
      injected = true;
      const current = await backend.read(convId);
      await originalWrite(
        convId,
        { ...current.doc, frontmatter: { ...current.doc.frontmatter, title: "Raced title" } },
        { expectedVersion: options.expectedVersion },
      );
    }
    return originalWrite(id, d, options);
  }) as typeof backend.write;

  const server = await bootServerOverBundle(bundle);
  try {
    let out = "";
    await kind(["field", "Context Note", "add", "field-c", "--remote", server.url, "--json"], { stdout: (s) => (out += s) });
    const result = JSON.parse(out) as Record<string, unknown>;
    assert.equal(result.changed, true);

    const conv = await readDoc(bundle, convId);
    const optional = (conv.frontmatter.fields as Record<string, unknown>).optional as string[];
    assert.ok(optional.includes("field-c"), "our own field survived");
    assert.equal(conv.frontmatter.title, "Raced title", "the competing writer's title edit survived");
  } finally {
    await server.close();
  }
});
