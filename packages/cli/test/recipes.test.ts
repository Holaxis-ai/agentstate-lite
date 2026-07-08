/**
 * Recipes Unit B (pluggable recipes) — the CLI recipe verbs (`recipes` list, `recipe add
 * <name-or-path>`), `init`'s default-recipe application, and command-level integration for the
 * `recipe-source.ts` seam. Pure-pipeline / path-safety unit tests for the seam itself live in
 * `recipe-source.test.ts`.
 *
 * Covers (C.2 test matrix):
 *  1. Built-in re-hosted: BYTE-IDENTICAL seed guarantee (init's `conventions/context-note.md`
 *     matches the pre-refactor engine-side seed, modulo the always-dynamic `timestamp`); `recipes`
 *     lists `context-notes` applied:true after init; `recipe add context-notes` on a fresh bundle.
 *  2. External loads+applies through the SAME path (`recipe add <fixture path>`).
 *  3. Idempotency (built-in AND external) + does-not-disturb-a-hand-edited-doc.
 *  4. Conflict surfaced: a DIFFERENT doc id governing the same type -> KIND_DUPLICATE_GOVERNS in
 *     the receipt `warnings`, never silently dropped, CAS never overwrites.
 *  5. Malformed manifest / not-found / empty -> structured CliError("USAGE"), exit 2, no stack.
 *  7. Conventions-free / gate-3 unaffected: `init --recipe none` is bare.
 *
 * Plus the pre-existing `status` kind-horizon coupling and Fork-4 generic-path parity proofs, and
 * `--remote` parity for `recipe add` — updated for the widened `LoadedRecipe` shape, unchanged in
 * spirit. Runs command functions in-process (no subprocess) against a real temp filesystem bundle.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { initBundle, writeDoc, parseMarkdown, loadKinds, CONVENTION_TYPE, type Bundle } from "@agentstate-lite/core";
import { serve, type ServerHandle } from "@agentstate-lite/server";

import { init } from "../src/commands/init.js";
import { recipes } from "../src/commands/recipes.js";
import { recipe } from "../src/commands/recipe.js";
import { status } from "../src/commands/status.js";
import { doc } from "../src/commands/doc.js";
import { newCommand } from "../src/commands/new.js";
import { list } from "../src/commands/list.js";
import { pull } from "../src/commands/pull.js";
import { promote } from "../src/commands/promote.js";
import { link } from "../src/commands/link.js";
import { CliError } from "../src/errors.js";
import {
  CONTEXT_NOTE_SEED_BODY,
  TASK_SEED_BODY,
  ROADMAP_SEED_BODY,
  ROADMAP_ITEM_SEED_BODY,
  ROADMAP_DESC_BODY,
  applyRecipe,
} from "../src/recipes.js";
import { CONTEXT_NOTES_RECIPE } from "../src/recipe-source.js";

const T = "2026-07-01T00:00:00.000Z";
const EXAMPLE_RECIPE_FIXTURE = path.resolve(import.meta.dirname, "fixtures/example-recipe");

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "agentstate-lite-recipes-test-"));
}

/**
 * Run a command function, capturing its `--json` stdout and parsing the envelope. Passes a
 * `readStdin` stub (like `doc.test.ts`'s `runDoc`) so a body-less `doc update`/`doc write` never
 * falls through to `defaultReadStdin`, which reads REAL `process.stdin` and hangs under `node --test`.
 */
async function runJson(
  cmd: (
    argv: string[],
    deps: { stdout: (s: string) => void; readStdin?: () => Promise<string | undefined> },
  ) => Promise<void>,
  argv: string[],
): Promise<Record<string, unknown>> {
  let out = "";
  await cmd([...argv, "--json"], { stdout: (s) => (out += s), readStdin: async () => undefined });
  return JSON.parse(out) as Record<string, unknown>;
}

/** The expected `conventions/context-note.md` frontmatter, minus the always-dynamic `timestamp`. */
const EXPECTED_CONTEXT_NOTE_FRONTMATTER = {
  type: CONVENTION_TYPE,
  title: "Context Note",
  governs: "Context Note",
  path: "context-notes/",
  fields: { required: ["title", "timestamp"], optional: ["description", "tags"] },
  sections: ["Summary"],
  freshness_horizon: "24h",
};

// ── Row 1: built-in re-hosted ──────────────────────────────────────────────────────────────────

test("init applies context-notes BYTE-IDENTICALLY: body matches CONTEXT_NOTE_SEED_BODY verbatim, frontmatter matches modulo timestamp", async () => {
  const dir = await tempDir();
  try {
    await init(["--dir", dir], { stdout: () => {} });
    const raw = await readFile(path.join(dir, "conventions", "context-note.md"), "utf8");
    const { frontmatter, body } = parseMarkdown(raw);
    assert.equal(body, CONTEXT_NOTE_SEED_BODY);
    const { timestamp, ...rest } = frontmatter;
    assert.deepEqual(rest, EXPECTED_CONTEXT_NOTE_FRONTMATTER);
    assert.equal(typeof timestamp, "string");
    assert.ok(!Number.isNaN(Date.parse(timestamp as string)), `expected a valid ISO timestamp, got ${timestamp}`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("recipe add context-notes: idempotent — second add is changed:false, on-disk bytes unchanged", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const first = await runJson(recipe, ["add", "context-notes", "--dir", dir]);
    assert.equal(first.recipe, "added");
    assert.equal(first.id, "context-notes");
    assert.equal(first.version, "1");
    assert.equal(first.source, "builtin:context-notes");
    assert.equal(first.changed, true);
    const docsFirst = first.docs as Array<Record<string, unknown>>;
    assert.equal(docsFirst.length, 1);
    assert.equal(docsFirst[0]!.changed, true);
    assert.equal(docsFirst[0]!.id, "conventions/context-note");

    const bytesAfterFirst = await readFile(path.join(dir, "conventions", "context-note.md"), "utf8");

    const second = await runJson(recipe, ["add", "context-notes", "--dir", dir]);
    assert.equal(second.changed, false);
    const docsSecond = second.docs as Array<Record<string, unknown>>;
    assert.equal(docsSecond[0]!.changed, false);

    const bytesAfterSecond = await readFile(path.join(dir, "conventions", "context-note.md"), "utf8");
    assert.equal(bytesAfterSecond, bytesAfterFirst, "a no-op re-add must not touch the on-disk bytes");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("recipe add context-notes: does not disturb a bundle author's own hand-edited conventions/context-note.md", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const bundle: Bundle = { root: dir };
    await writeDoc(bundle, {
      id: "conventions/context-note",
      frontmatter: { type: CONVENTION_TYPE, title: "Context Note", governs: "Context Note", timestamp: T },
      body: "Custom prose the author wrote.",
    });

    const result = await runJson(recipe, ["add", "context-notes", "--dir", dir]);
    assert.equal(result.changed, false);
    const docs = result.docs as Array<Record<string, unknown>>;
    assert.equal(docs[0]!.changed, false);

    const registry = await loadKinds(bundle);
    const kind = registry.kinds.get("Context Note");
    assert.ok(kind);
    // The recipe's write lost the CAS race (file already existed) — the author's declaration (no
    // horizon, no path) survives untouched rather than being overwritten by the built-in recipe.
    assert.equal(kind!.freshnessHorizon, undefined);
    assert.equal(kind!.path, undefined);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("recipes: lists context-notes with applied:false on a bare bundle, applied:true after recipe add", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const before = await runJson(recipes, ["--dir", dir]);
    assert.equal(before.count, 3);
    const rowsBefore = before.recipes as Array<Record<string, unknown>>;
    assert.equal(rowsBefore.length, 3);
    assert.equal(rowsBefore[0]!.name, "context-notes");
    assert.equal(rowsBefore[0]!.version, "1");
    assert.equal(rowsBefore[0]!.applied, false);

    await recipe(["add", "context-notes", "--dir", dir], { stdout: () => {} });

    const after = await runJson(recipes, ["--dir", dir]);
    const rowsAfter = after.recipes as Array<Record<string, unknown>>;
    assert.equal(rowsAfter[0]!.applied, true);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── work-tracking: the second built-in recipe (first DOMAIN recipe) ───────────────────────────

test("recipes: lists ALL THREE built-ins — context-notes, work-tracking, roadmap", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const result = await runJson(recipes, ["--dir", dir]);
    assert.equal(result.count, 3);
    const rows = result.recipes as Array<Record<string, unknown>>;
    const names = rows.map((r) => r.name).sort();
    assert.deepEqual(names, ["context-notes", "roadmap", "work-tracking"]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("recipe add work-tracking: applies conventions/task.md, frontmatter matches the deployed reference bundle's hand-authored conventions/task modulo timestamp", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const result = await runJson(recipe, ["add", "work-tracking", "--dir", dir]);
    assert.equal(result.recipe, "added");
    assert.equal(result.id, "work-tracking");
    assert.equal(result.version, "1");
    assert.equal(result.source, "builtin:work-tracking");
    assert.equal(result.changed, true);
    const docs = result.docs as Array<Record<string, unknown>>;
    assert.equal(docs.length, 1);
    assert.equal(docs[0]!.id, "conventions/task");
    assert.equal(docs[0]!.changed, true);

    const raw = await readFile(path.join(dir, "conventions", "task.md"), "utf8");
    const { frontmatter, body } = parseMarkdown(raw);
    const { timestamp, ...rest } = frontmatter;
    assert.deepEqual(rest, {
      type: CONVENTION_TYPE,
      title: "Task",
      governs: "Task",
      path: "tasks/",
      links: { "depends on": "Task" },
      fields: {
        required: ["title", "status"],
        optional: ["priority", "assignee", "description"],
        values: { status: ["todo", "in_progress", "blocked", "done", "canceled"] },
        terminal: { status: ["done", "canceled"] },
      },
      freshness_horizon: "30d",
    });
    assert.equal(typeof timestamp, "string");
    assert.ok(!Number.isNaN(Date.parse(timestamp as string)), `expected a valid ISO timestamp, got ${timestamp}`);
    assert.equal(body, TASK_SEED_BODY);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("kinds: reports Task with required/optional/values/horizon after recipe add work-tracking", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await recipe(["add", "work-tracking", "--dir", dir], { stdout: () => {} });
    const bundle: Bundle = { root: dir };
    const registry = await loadKinds(bundle);
    const kind = registry.kinds.get("Task");
    assert.ok(kind);
    assert.deepEqual(kind!.fields.required, ["title", "status"]);
    assert.deepEqual(kind!.fields.optional, ["priority", "assignee", "description"]);
    assert.deepEqual(kind!.fields.values.status, ["todo", "in_progress", "blocked", "done", "canceled"]);
    assert.deepEqual(kind!.fields.terminal.status, ["done", "canceled"]);
    assert.equal(kind!.path, "tasks/");
    assert.equal(kind!.freshnessHorizon, "30d");
    assert.deepEqual(kind!.links, { "depends on": "Task" }, "the seeded Task kind declares its typed-edge vocabulary");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("new Task <id> --title --status: creates under tasks/ and validates; an out-of-enum --status is rejected, no write", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await recipe(["add", "work-tracking", "--dir", dir], { stdout: () => {} });

    const created = await runJson(newCommand, ["Task", "demo", "--title", "Demo", "--status", "todo", "--dir", dir]);
    assert.equal(created.id, "tasks/demo");
    assert.equal(created.type, "Task");

    const updated = await runJson(doc, ["update", "tasks/demo", "--status", "in_progress", "--dir", dir]);
    assert.equal(updated.changed, true);
    const readAfter = await runJson(doc, ["read", "tasks/demo", "--dir", dir]);
    assert.equal(readAfter.status, "in_progress");

    await assert.rejects(
      () =>
        doc(["update", "tasks/demo", "--status", "nope", "--dir", dir, "--json"], {
          stdout: () => {},
          readStdin: async () => undefined,
        }),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /status/);
        return true;
      },
    );
    // the rejected update must not have written — status stays 'in_progress'.
    const readAfterReject = await runJson(doc, ["read", "tasks/demo", "--dir", dir]);
    assert.equal(readAfterReject.status, "in_progress");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("kind-lint neutrality: a work-tracking Task written with --actor persists the actor and produces ZERO kind warnings in `status`", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await recipe(["add", "work-tracking", "--dir", dir], { stdout: () => {} });

    // `new` is STRICT — this create SUCCEEDING already proves the undeclared 'actor' frontmatter key
    // trips no kind warning (validateAgainstKind is not a top-level-key linter; OKF §9 permits
    // undeclared frontmatter). The `status` assertion below pins the same neutrality on the bundle lint.
    const created = await runJson(newCommand, [
      "Task", "attributed", "--title", "Attributed", "--status", "todo", "--actor", "alice", "--dir", dir,
    ]);
    assert.equal(created.id, "tasks/attributed");
    assert.equal("warnings" in created, false, "no kind warnings on the create receipt");

    // A kind-field patch (strict path) with --actor: still green, and the actor is OVERWRITTEN.
    const updated = await runJson(doc, ["update", "tasks/attributed", "--status", "in_progress", "--actor", "bob", "--dir", dir]);
    assert.equal(updated.changed, true);
    assert.equal("warnings" in updated, false, "no kind warnings on the update receipt");
    const read = await runJson(doc, ["read", "tasks/attributed", "--dir", dir]);
    assert.equal(read.actor, "bob", "the update's --actor superseded the create's");

    const health = await runJson(status, ["--dir", dir]);
    assert.equal(health.kind_warnings, 0, "the undeclared 'actor' frontmatter key must trip NO kind lint");
    assert.equal("kind_lint" in health, false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("recipe add work-tracking: idempotent — second add is changed:false, on-disk bytes unchanged", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const first = await runJson(recipe, ["add", "work-tracking", "--dir", dir]);
    assert.equal(first.changed, true);
    const bytesAfterFirst = await readFile(path.join(dir, "conventions", "task.md"), "utf8");

    const second = await runJson(recipe, ["add", "work-tracking", "--dir", dir]);
    assert.equal(second.changed, false);
    const docsSecond = second.docs as Array<Record<string, unknown>>;
    assert.equal(docsSecond[0]!.changed, false);

    const bytesAfterSecond = await readFile(path.join(dir, "conventions", "task.md"), "utf8");
    assert.equal(bytesAfterSecond, bytesAfterFirst, "a no-op re-add must not touch the on-disk bytes");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── roadmap: the third built-in recipe (work-tracking's companion; first MULTI-DOC built-in) ───

test("recipe add roadmap: applies conventions/roadmap.md AND conventions/roadmap-item.md, frontmatter faithful to the board's hand-authored conventions modulo timestamp", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const result = await runJson(recipe, ["add", "roadmap", "--dir", dir]);
    assert.equal(result.recipe, "added");
    assert.equal(result.id, "roadmap");
    assert.equal(result.version, "1");
    assert.equal(result.source, "builtin:roadmap");
    assert.equal(result.changed, true);
    const docs = result.docs as Array<Record<string, unknown>>;
    assert.equal(docs.length, 2);
    assert.deepEqual(
      docs.map((d) => d.id).sort(),
      ["conventions/roadmap", "conventions/roadmap-item"],
    );
    assert.ok(docs.every((d) => d.changed === true));

    const roadmapRaw = await readFile(path.join(dir, "conventions", "roadmap.md"), "utf8");
    const roadmapParsed = parseMarkdown(roadmapRaw);
    const { timestamp: ts1, ...roadmapRest } = roadmapParsed.frontmatter;
    assert.deepEqual(roadmapRest, {
      type: CONVENTION_TYPE,
      title: "Roadmap",
      governs: "Roadmap",
      links: { contains: "Roadmap Item" },
      fields: { required: ["title"], optional: [] },
    });
    assert.ok(!Number.isNaN(Date.parse(ts1 as string)), `expected a valid ISO timestamp, got ${ts1}`);
    assert.equal(roadmapParsed.body, ROADMAP_SEED_BODY);

    const itemRaw = await readFile(path.join(dir, "conventions", "roadmap-item.md"), "utf8");
    const itemParsed = parseMarkdown(itemRaw);
    const { timestamp: ts2, ...itemRest } = itemParsed.frontmatter;
    assert.deepEqual(itemRest, {
      type: CONVENTION_TYPE,
      title: "Roadmap Item",
      governs: "Roadmap Item",
      path: "roadmap-items/",
      links: { contains: "Task" },
      fields: {
        required: ["title", "status"],
        optional: ["description", "sequence"],
        values: { status: ["queued", "active", "done"] },
      },
    });
    assert.ok(!Number.isNaN(Date.parse(ts2 as string)), `expected a valid ISO timestamp, got ${ts2}`);
    assert.equal(itemParsed.body, ROADMAP_ITEM_SEED_BODY);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("kinds: reports Roadmap + Roadmap Item with the contains vocabulary and the item status enum after recipe add roadmap", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await recipe(["add", "roadmap", "--dir", dir], { stdout: () => {} });
    const registry = await loadKinds({ root: dir });

    const roadmapKind = registry.kinds.get("Roadmap");
    assert.ok(roadmapKind);
    assert.deepEqual(roadmapKind!.fields.required, ["title"]);
    assert.deepEqual(roadmapKind!.links, { contains: "Roadmap Item" });
    assert.equal(roadmapKind!.path, undefined, "the spine is one doc, not a scaffolded family");

    const itemKind = registry.kinds.get("Roadmap Item");
    assert.ok(itemKind);
    assert.equal(itemKind!.path, "roadmap-items/");
    assert.deepEqual(itemKind!.links, { contains: "Task" });
    assert.deepEqual(itemKind!.fields.required, ["title", "status"]);
    assert.deepEqual(itemKind!.fields.optional, ["description", "sequence"]);
    assert.deepEqual(itemKind!.fields.values.status, ["queued", "active", "done"]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("recipe add roadmap: idempotent — second add is changed:false, on-disk bytes of BOTH docs unchanged", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const first = await runJson(recipe, ["add", "roadmap", "--dir", dir]);
    assert.equal(first.changed, true);
    const roadmapAfterFirst = await readFile(path.join(dir, "conventions", "roadmap.md"), "utf8");
    const itemAfterFirst = await readFile(path.join(dir, "conventions", "roadmap-item.md"), "utf8");

    const second = await runJson(recipe, ["add", "roadmap", "--dir", dir]);
    assert.equal(second.changed, false);
    const docsSecond = second.docs as Array<Record<string, unknown>>;
    assert.ok(docsSecond.every((d) => d.changed === false));

    assert.equal(await readFile(path.join(dir, "conventions", "roadmap.md"), "utf8"), roadmapAfterFirst);
    assert.equal(await readFile(path.join(dir, "conventions", "roadmap-item.md"), "utf8"), itemAfterFirst);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("recipe add roadmap: does not disturb a hand-edited conventions/roadmap-item.md — the untouched sibling doc still applies", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const bundle: Bundle = { root: dir };
    await writeDoc(bundle, {
      id: "conventions/roadmap-item",
      frontmatter: { type: CONVENTION_TYPE, title: "Roadmap Item", governs: "Roadmap Item", timestamp: T },
      body: "Custom prose the author wrote.",
    });

    const result = await runJson(recipe, ["add", "roadmap", "--dir", dir]);
    // PARTIAL apply: the hand-edited doc loses nothing; the absent sibling is still created.
    assert.equal(result.changed, true);
    const docs = result.docs as Array<Record<string, unknown>>;
    const byId = new Map(docs.map((d) => [d.id, d.changed]));
    assert.equal(byId.get("conventions/roadmap-item"), false, "hand-edited doc must not be clobbered");
    assert.equal(byId.get("conventions/roadmap"), true, "absent sibling must still be created");

    const registry = await loadKinds(bundle);
    const itemKind = registry.kinds.get("Roadmap Item");
    assert.ok(itemKind);
    // The author's declaration (no path, no enum) survives untouched.
    assert.equal(itemKind!.path, undefined);
    assert.equal(itemKind!.fields.values.status, undefined);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("recipes: roadmap applied:false when only ONE of its two docs exists — applied means ALL docs present", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const bundle: Bundle = { root: dir };
    await writeDoc(bundle, {
      id: "conventions/roadmap",
      frontmatter: { type: CONVENTION_TYPE, title: "Roadmap", governs: "Roadmap", timestamp: T },
      body: "Hand-authored spine convention only.",
    });

    const before = await runJson(recipes, ["--dir", dir]);
    const rowBefore = (before.recipes as Array<Record<string, unknown>>).find((r) => r.name === "roadmap");
    assert.ok(rowBefore);
    assert.equal(rowBefore!.applied, false, "one-of-two docs present must NOT count as applied");

    await recipe(["add", "roadmap", "--dir", dir], { stdout: () => {} });
    const after = await runJson(recipes, ["--dir", dir]);
    const rowAfter = (after.recipes as Array<Record<string, unknown>>).find((r) => r.name === "roadmap");
    assert.equal(rowAfter!.applied, true);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── The board-parity drift gate: the built-in must stay faithful to the SOURCE conventions ─────

const BOARD_CONVENTIONS = path.resolve(import.meta.dirname, "../../../.agentstate-lite/conventions");

test("board parity: the roadmap recipe's kinds load IDENTICALLY to the repo board's hand-authored conventions/roadmap(-item).md (the extraction cannot drift from its source)", async () => {
  const recipeDir = await tempDir();
  const boardDir = await tempDir();
  try {
    await initBundle(recipeDir);
    await recipe(["add", "roadmap", "--dir", recipeDir], { stdout: () => {} });

    await initBundle(boardDir);
    await mkdir(path.join(boardDir, "conventions"), { recursive: true });
    for (const f of ["roadmap.md", "roadmap-item.md"]) {
      await writeFile(path.join(boardDir, "conventions", f), await readFile(path.join(BOARD_CONVENTIONS, f), "utf8"));
    }

    const fromRecipe = await loadKinds({ root: recipeDir });
    const fromBoard = await loadKinds({ root: boardDir });
    for (const governs of ["Roadmap", "Roadmap Item"]) {
      assert.deepEqual(
        fromRecipe.kinds.get(governs),
        fromBoard.kinds.get(governs),
        `the '${governs}' kind loaded from the built-in recipe must equal the board's hand-authored declaration`,
      );
    }
  } finally {
    await rm(recipeDir, { recursive: true, force: true });
    await rm(boardDir, { recursive: true, force: true });
  }
});

// ── The DOCUMENTED expects_inbound pairing chain — executed literally from the manifest body ───
//
// The roadmap recipe's manifest documents the one-step Task-kind pairing (pull → edit → promote)
// because a recipe's expect-absent CAS can never patch an EXISTING conventions/task doc and
// `kind field` edits only fields.{required,optional,values}. Per the repo's review conventions, a
// documented command chain is pinned by a test that literally runs the emitted strings: this test
// EXTRACTS the two command lines from ROADMAP_DESC_BODY's fenced block, binds the placeholders
// (the out-file path and the `<version from the pull receipt>` token), executes them, and asserts
// the lint the pairing exists to enable actually fires and then clears.

/** Extract the fenced pairing chain from the manifest body: [pullArgv, promoteArgv] templates. */
function pairingChainLines(body: string): string[] {
  const fence = body.match(/```\n([\s\S]*?)```/);
  assert.ok(fence, "the roadmap manifest body must carry the fenced pairing chain");
  return fence![1]!
    .split("\n")
    .filter((l) => l.trim() !== "" && !l.trim().startsWith("#"));
}

test("pairing chain: the documented pull → edit → promote steps in the roadmap manifest, executed literally, arm Task's expects_inbound and the missing_expected_links lint fires then clears", async () => {
  const dir = await tempDir();
  const work = await tempDir(); // the adopter's scratch dir, OUTSIDE the bundle
  try {
    await initBundle(dir);
    await recipe(["add", "work-tracking", "--dir", dir], { stdout: () => {} });
    await recipe(["add", "roadmap", "--dir", dir], { stdout: () => {} });

    const chain = pairingChainLines(ROADMAP_DESC_BODY);
    assert.equal(chain.length, 2, "the documented chain is exactly two commands (pull, promote)");
    assert.match(chain[0]!, /^agentstate-lite pull /);
    assert.match(chain[1]!, /^agentstate-lite promote /);
    // The placeholder bindings below assume these exact tokens — assert them BEFORE executing
    // anything, so manifest wording drift fails HERE as a clear assertion rather than silently
    // no-op'ing a .replace() (which would, e.g., pull task.md into the test process cwd).
    assert.match(chain[0]!, /--out task\.md/, "the documented pull must name its out-file 'task.md'");
    assert.match(chain[1]!, /^agentstate-lite promote task\.md /, "the documented promote must take 'task.md' as its file");
    assert.match(chain[1]!, /<version from the pull receipt>/, "the documented promote must carry the version placeholder");

    // Step 1 — the documented pull, out-path bound to the scratch dir.
    const outFile = path.join(work, "task.md");
    const pullArgv = chain[0]!
      .replace(/^agentstate-lite pull /, "")
      .replace("--out task.md", `--out ${outFile}`)
      .split(/\s+/);
    const pullReceipt = await runJson(pull, [...pullArgv, "--dir", dir]);
    const version = pullReceipt.version as string;
    assert.ok(version, "the pull receipt must carry the CAS version token the chain relies on");

    // Step 2 — the documented edit: add the two expects_inbound lines to the frontmatter.
    const pulled = await readFile(outFile, "utf8");
    assert.ok(!pulled.includes("expects_inbound"), "work-tracking's Task must NOT pre-declare the pairing");
    await writeFile(outFile, pulled.replace("\nfields:", "\nexpects_inbound:\n  contains: Roadmap Item\nfields:"));

    // Step 3 — the documented promote, placeholders bound (file path + version token).
    const promoteArgv = chain[1]!
      .replace(/^agentstate-lite promote task\.md /, `${outFile} `)
      .replace("<version from the pull receipt>", version)
      .split(/\s+/);
    const promoted = await runJson(promote, [...promoteArgv, "--dir", dir]);
    assert.equal(promoted.id, "conventions/task");

    // The pairing is armed: Task now expects an inbound `contains` from a Roadmap Item.
    const registry = await loadKinds({ root: dir });
    assert.deepEqual(registry.kinds.get("Task")!.expectsInbound, { contains: "Roadmap Item" });

    // An unowned task trips the lint …
    await runJson(newCommand, ["Task", "demo", "--title", "Demo", "--status", "todo", "--dir", dir]);
    const unowned = await runJson(status, ["--dir", dir]);
    assert.equal(unowned.missing_expected_links, 1);
    const rows = (unowned.missing_expected_links_rows as { rows: Array<Record<string, unknown>> }).rows;
    assert.equal(rows[0]!.id, "tasks/demo");
    assert.deepEqual(rows[0]!.missing, ["contains"]);

    // … and an owning Roadmap Item's typed `contains` link clears it.
    await runJson(newCommand, ["Roadmap Item", "item-1", "--title", "Item 1", "--status", "active", "--dir", dir]);
    await runJson(link, ["add", "roadmap-items/item-1", "tasks/demo", "--text", "contains", "--dir", dir]);
    const owned = await runJson(status, ["--dir", dir]);
    assert.equal(owned.missing_expected_links, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
    await rm(work, { recursive: true, force: true });
  }
});

test("gate 3 / conventions-free: init's default does NOT install roadmap — a bundle stays roadmap-free until it opts in", async () => {
  const dir = await tempDir();
  try {
    await init(["--dir", dir], { stdout: () => {} });
    const registry = await loadKinds({ root: dir });
    assert.equal(registry.kinds.has("Roadmap"), false);
    assert.equal(registry.kinds.has("Roadmap Item"), false);
    await assert.rejects(() => readFile(path.join(dir, "conventions", "roadmap.md")));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── Row 2: external loads+applies through the SAME path ───────────────────────────────────────

test("recipe add <path>: an EXTERNAL recipe folder loads via filesRecipeSource -> parseRecipeFiles -> applyRecipe, the SAME functions as the built-in", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const result = await runJson(recipe, ["add", EXAMPLE_RECIPE_FIXTURE, "--dir", dir]);
    assert.equal(result.recipe, "added");
    assert.equal(result.id, "example");
    assert.equal(result.version, "1");
    assert.equal(result.source, EXAMPLE_RECIPE_FIXTURE);
    assert.equal(result.changed, true);
    const docs = result.docs as Array<Record<string, unknown>>;
    assert.equal(docs.length, 1);
    assert.equal(docs[0]!.id, "conventions/example-term");

    const raw = await readFile(path.join(dir, "conventions", "example-term.md"), "utf8");
    const { frontmatter } = parseMarkdown(raw);
    assert.equal(frontmatter.type, CONVENTION_TYPE);
    assert.equal(frontmatter.governs, "Term");

    const bundle: Bundle = { root: dir };
    const registry = await loadKinds(bundle);
    assert.ok(registry.kinds.has("Term"), "kinds must report the new governs after an external recipe apply");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── Row 3: idempotency (external arm) ──────────────────────────────────────────────────────────

test("recipe add <path>: idempotent — second add of the SAME external recipe is changed:false, bytes unchanged", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const first = await runJson(recipe, ["add", EXAMPLE_RECIPE_FIXTURE, "--dir", dir]);
    assert.equal(first.changed, true);
    const bytesAfterFirst = await readFile(path.join(dir, "conventions", "example-term.md"), "utf8");

    const second = await runJson(recipe, ["add", EXAMPLE_RECIPE_FIXTURE, "--dir", dir]);
    assert.equal(second.changed, false);
    const docsSecond = second.docs as Array<Record<string, unknown>>;
    assert.equal(docsSecond[0]!.changed, false);

    const bytesAfterSecond = await readFile(path.join(dir, "conventions", "example-term.md"), "utf8");
    assert.equal(bytesAfterSecond, bytesAfterFirst);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── Row 4: conflict surfaced ────────────────────────────────────────────────────────────────────

test("recipe add: a DIFFERENT doc already governing the same type -> CAS never overwrites; KIND_DUPLICATE_GOVERNS surfaced in the receipt warnings", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const bundle: Bundle = { root: dir };
    // A hand-authored doc that ALSO governs 'Term', at a DIFFERENT id than the recipe's own.
    await writeDoc(bundle, {
      id: "conventions/my-term",
      frontmatter: { type: CONVENTION_TYPE, governs: "Term", timestamp: T },
      body: "Hand-authored, pre-existing.",
    });

    const result = await runJson(recipe, ["add", EXAMPLE_RECIPE_FIXTURE, "--dir", dir]);
    // The recipe's own doc (conventions/example-term) did not exist yet, so its own CAS write wins.
    assert.equal(result.changed, true);
    const docs = result.docs as Array<Record<string, unknown>>;
    assert.equal(docs[0]!.changed, true);

    // Both docs now exist on disk (CAS never overwrites — it only guards create-vs-exists at the
    // SAME id), but the registry keeps the first-declared 'Term' and warns about the shadowed one.
    const warnings = result.warnings as Array<Record<string, unknown>>;
    assert.ok(warnings, "expected a warnings array on the receipt");
    const dup = warnings.find((w) => w.code === "KIND_DUPLICATE_GOVERNS");
    assert.ok(dup, `expected a KIND_DUPLICATE_GOVERNS warning, got ${JSON.stringify(warnings)}`);

    // loadKinds' query results are id-sorted; 'conventions/example-term' sorts before
    // 'conventions/my-term', so the FIRST-BY-ID declaration that wins is the recipe's own doc,
    // not the hand-authored one — exactly what the existing loadKinds machinery already does,
    // with no new conflict-resolution logic added by this unit.
    const registry = await loadKinds(bundle);
    assert.equal(registry.kinds.get("Term")!.id, "conventions/example-term", "first-by-id declaration wins");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── Row 5: malformed manifest / not-found / empty -> structured CliError, no stack ─────────────

test("recipe add: an unknown recipe name is a USAGE error naming known recipes", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await assert.rejects(
      () => recipe(["add", "bogus-recipe", "--dir", dir, "--json"]),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /unknown recipe 'bogus-recipe'/);
        assert.match(err.message, /context-notes/);
        return true;
      },
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("recipe add <path>: a nonexistent folder -> RECIPE_NOT_FOUND, mapped to CliError USAGE exit 2", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await assert.rejects(
      () => recipe(["add", "./nope-does-not-exist", "--dir", dir, "--json"]),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        return true;
      },
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("recipe add <path>: a folder missing recipe.md -> RECIPE_MALFORMED, mapped to CliError USAGE exit 2, message names recipe.md", async () => {
  const dir = await tempDir();
  const badFolder = await tempDir();
  try {
    await initBundle(dir);
    // badFolder exists but has no recipe.md — a deliberately malformed external recipe.
    await assert.rejects(
      () => recipe(["add", badFolder, "--dir", dir, "--json"]),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        assert.match(err.message, /recipe\.md/);
        return true;
      },
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
    await rm(badFolder, { recursive: true, force: true });
  }
});

test("init --recipe <path>: works with no extra code — same resolveRecipe seam as recipe add", async () => {
  const dir = await tempDir();
  try {
    const result = await runJson(init, ["--dir", dir, "--recipe", EXAMPLE_RECIPE_FIXTURE]);
    assert.equal(result.recipe, "example");
    const bundle: Bundle = { root: dir };
    const registry = await loadKinds(bundle);
    assert.ok(registry.kinds.has("Term"));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── Row 7: conventions-free / gate-3 unaffected ────────────────────────────────────────────────

test("init --recipe none: a conventions-free bundle, unaffected — kinds registry empty, byte-for-byte as an external bundle", async () => {
  const dir = await tempDir();
  try {
    const result = await runJson(init, ["--dir", dir, "--recipe", "none"]);
    assert.equal(result.recipe, "none");
    const bundle: Bundle = { root: dir };
    const registry = await loadKinds(bundle);
    assert.equal(registry.kinds.size, 0);
    await assert.rejects(() => readFile(path.join(dir, "conventions", "context-note.md")));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("init: default (no --recipe) applies context-notes, reports recipe:context-notes", async () => {
  const dir = await tempDir();
  try {
    const result = await runJson(init, ["--dir", dir]);
    assert.equal(result.recipe, "context-notes");
    const bundle: Bundle = { root: dir };
    const registry = await loadKinds(bundle);
    assert.equal(registry.kinds.size, 1);
    assert.ok(registry.kinds.has("Context Note"));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("init: an unknown --recipe name is a USAGE error", async () => {
  const dir = await tempDir();
  try {
    await assert.rejects(
      () => init(["--dir", dir, "--recipe", "bogus", "--json"]),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.match(err.message, /unknown recipe 'bogus'/);
        return true;
      },
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("status coupling WITH the recipe: an old Context Note is reported stale under the applied 24h horizon (there is no bespoke note command anymore — status is the surviving generic freshness surface)", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await applyRecipe({ root: dir }, CONTEXT_NOTES_RECIPE);
    const bundle: Bundle = { root: dir };
    const oldTs = new Date(Date.now() - 25 * 3_600_000).toISOString(); // 25h old > 24h horizon
    await writeDoc(bundle, {
      id: "context-notes/old",
      frontmatter: { type: "Context Note", title: "old", timestamp: oldTs },
      body: "# Summary\n\nStale by the applied recipe's horizon.\n",
    });
    const result = await runJson(status, ["--dir", dir]);
    assert.equal(result.stale, 1);
    const staleDocs = result.stale_docs as { rows: Array<Record<string, unknown>> };
    assert.equal(staleDocs.rows[0]!.id, "context-notes/old");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("status coupling WITHOUT the recipe: the same old Context Note is NOT reported stale — no horizon declared, no kind to feed one", async () => {
  const dir = await tempDir();
  try {
    await init(["--dir", dir, "--recipe", "none"], { stdout: () => {} });
    const bundle: Bundle = { root: dir };
    const oldTs = new Date(Date.now() - 25 * 3_600_000).toISOString(); // 25h old, but no kind horizon here
    await writeDoc(bundle, {
      id: "context-notes/old",
      frontmatter: { type: "Context Note", title: "old", timestamp: oldTs },
      body: "# Summary\n\nNo horizon in a conventions-free bundle.\n",
    });
    const result = await runJson(status, ["--dir", dir]);
    assert.equal(result.stale, 0);
    assert.equal(result.kinds, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── Fork-4 generic-path parity proof: deleting the note command must not make an existing
// Context Note unreadable/uneditable, and the generic `new` verb must still create a governed one.

test("Fork-4: an EXISTING type:Context Note doc (written before the note command existed, or by any external producer) still reads via 'doc read' and patches via 'doc update' after the note command's deletion", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await applyRecipe({ root: dir }, CONTEXT_NOTES_RECIPE);
    const bundle: Bundle = { root: dir };
    await writeDoc(bundle, {
      id: "context-notes/legacy",
      frontmatter: { type: "Context Note", title: "legacy", timestamp: T },
      body: "# Summary\n\nOld note.\n",
    });

    const read = await runJson(doc, ["read", "context-notes/legacy", "--dir", dir]);
    assert.equal(read.title, "legacy");
    assert.equal(read.body, "# Summary\n\nOld note.\n");

    const updated = await runJson(doc, ["update", "context-notes/legacy", "--title", "legacy-2", "--dir", dir]);
    assert.equal(updated.changed, true);

    const readAfter = await runJson(doc, ["read", "context-notes/legacy", "--dir", dir]);
    assert.equal(readAfter.title, "legacy-2");
    assert.equal(readAfter.body, "# Summary\n\nOld note.\n");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("Fork-4: 'new \"Context Note\" <id>' creates a governed instance under the recipe's declared path, satisfying the kind (no --timestamp needed — the mutation pipeline auto-stamps it before strict validation)", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await applyRecipe({ root: dir }, CONTEXT_NOTES_RECIPE);

    const created = await runJson(newCommand, ["Context Note", "cycle-x", "--title", "cycle-x", "--dir", dir]);
    assert.equal(created.id, "context-notes/cycle-x");
    assert.equal(created.type, "Context Note");
    assert.ok(created.timestamp, "timestamp must be auto-stamped, not require --timestamp");

    const read = await runJson(doc, ["read", "context-notes/cycle-x", "--dir", dir]);
    assert.equal(read.body, "# Summary\n");

    const listed = await runJson(list, ["--type", "Context Note", "--dir", dir]);
    assert.equal(listed.count, 1);
    const rows = listed.docs as Array<Record<string, unknown>>;
    assert.equal(rows[0]!.id, "context-notes/cycle-x");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("--remote: recipe add against a served bundle, idempotent parity with the same operation run locally", async () => {
  const localDir = await tempDir();
  const remoteDir = await tempDir();
  try {
    await initBundle(localDir);
    await initBundle(remoteDir);
    const handle: ServerHandle = await serve({ bundle: { root: remoteDir }, port: 0 });
    const url = `http://${handle.host}:${handle.port}`;
    try {
      const localAdd = await runJson(recipe, ["add", "context-notes", "--dir", localDir]);
      const remoteAdd = await runJson(recipe, ["add", "context-notes", "--remote", url]);
      assert.equal(remoteAdd.changed, true);
      assert.equal(localAdd.id, remoteAdd.id);

      // Second add over --remote is a changed:false no-op, same as local.
      const remoteAddAgain = await runJson(recipe, ["add", "context-notes", "--remote", url]);
      assert.equal(remoteAddAgain.changed, false);

      const localRecipes = await runJson(recipes, ["--dir", localDir]);
      const remoteRecipes = await runJson(recipes, ["--remote", url]);
      assert.deepEqual(remoteRecipes, localRecipes);
    } finally {
      await handle.close();
    }
  } finally {
    await rm(localDir, { recursive: true, force: true });
    await rm(remoteDir, { recursive: true, force: true });
  }
});

// ── The SHIPPED example recipe (examples/recipes/claims) — a drift gate for the public example ──

const SHIPPED_CLAIMS_RECIPE = path.resolve(import.meta.dirname, "../../../examples/recipes/claims");

test("SHIPPED example recipe (examples/recipes/claims): applies cleanly, declares the Claim kind with the full lifecycle enum, and is idempotent — the repo's public example cannot rot", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const result = await runJson(recipe, ["add", SHIPPED_CLAIMS_RECIPE, "--dir", dir]);
    assert.equal(result.recipe, "added");
    assert.equal(result.id, "claims");
    assert.equal(result.version, "1.0.0");
    assert.equal(result.changed, true);
    const docs = result.docs as Array<Record<string, unknown>>;
    assert.equal(docs.length, 1);
    assert.equal(docs[0]!.id, "conventions/claim");

    const bundle: Bundle = { root: dir };
    const registry = await loadKinds(bundle);
    const claim = registry.kinds.get("Claim");
    assert.ok(claim, "the Claim kind must be declared after applying the shipped example recipe");
    assert.deepEqual(claim!.fields.required, ["title", "status", "reason"]);
    assert.deepEqual(claim!.fields.values?.status, ["active", "challenged", "locked", "deprecated"]);
    assert.deepEqual(claim!.links, { supersedes: "Claim" }, "the example recipe declares the supersession edge type");

    const again = await runJson(recipe, ["add", SHIPPED_CLAIMS_RECIPE, "--dir", dir]);
    assert.equal(again.changed, false, "re-applying the shipped recipe must be an idempotent no-op");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
