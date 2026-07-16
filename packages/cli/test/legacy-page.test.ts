/**
 * The legacy-naming primitive (src/legacy-page.ts, plans/rename-page-kind-to-view Option C+ Unit 2):
 * ONE predicate feeding two read-only surfaces —
 *
 *   1. the write-time nudge: `new`/`doc write`/`doc update` SUCCESS receipts carry the ONE hint
 *      line when (and only when) the produced doc is typed 'Page'; never on reads, never a block;
 *   2. `status`'s `legacy_naming` audit section: count + ids of Page-typed docs plus an
 *      informational count of items under the legacy pages-registry//pages/ prefixes, omitted
 *      entirely on a legacy-free bundle.
 *
 * Runs the command functions in-process against real temp filesystem bundles (the
 * `doc.test.ts`/`status.test.ts` pattern, including the explicit `readStdin` override — see
 * doc.test.ts's test-authoring note).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { initBundle, writeBlob, writeDoc } from "@agentstate-lite/core";

import {
  isLegacyPageDoc,
  legacyPagePrefixOf,
  LEGACY_PAGE_BLOB_PREFIX,
  LEGACY_PAGE_REGISTRY_PREFIX,
  LEGACY_PAGE_TYPE_HINT,
} from "../src/legacy-page.js";
import { doc } from "../src/commands/doc.js";
import { newCommand } from "../src/commands/new.js";
import { status } from "../src/commands/status.js";

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "agentstate-lite-legacy-page-test-"));
}

/** Run `doc` in-process, capturing + parsing its `--json` stdout (stdin explicitly "not a pipe"). */
async function runDocJson(argv: string[]): Promise<Record<string, unknown>> {
  let out = "";
  await doc([...argv, "--json"], { stdout: (s) => (out += s), readStdin: async () => undefined });
  return JSON.parse(out) as Record<string, unknown>;
}

/** Run `new` in-process, capturing + parsing its `--json` stdout. */
async function runNewJson(argv: string[]): Promise<Record<string, unknown>> {
  let out = "";
  await newCommand([...argv, "--json"], { stdout: (s) => (out += s) });
  return JSON.parse(out) as Record<string, unknown>;
}

/** Run `status` in-process, capturing + parsing its `--json` stdout. */
async function runStatusJson(argv: string[]): Promise<Record<string, unknown>> {
  let out = "";
  await status([...argv, "--json"], { stdout: (s) => (out += s) });
  return JSON.parse(out) as Record<string, unknown>;
}

// ── 1. The predicate itself ──────────────────────────────────────────────────────────────────────

test("isLegacyPageDoc: 'Page' matches, trimmed; 'View'/case-variants/non-strings never do", () => {
  assert.equal(isLegacyPageDoc({ type: "Page" }), true);
  assert.equal(isLegacyPageDoc({ type: " Page " }), true, "surrounding whitespace is trimmed");
  assert.equal(isLegacyPageDoc({ type: "\tPage\n" }), true);
  assert.equal(isLegacyPageDoc({ type: "View" }), false);
  assert.equal(isLegacyPageDoc({ type: "page" }), false, "type values are case-sensitive — 'page' is another type, not a near-miss");
  assert.equal(isLegacyPageDoc({ type: "PAGE" }), false);
  assert.equal(isLegacyPageDoc({ type: "Pages" }), false);
  assert.equal(isLegacyPageDoc({ type: "Page " + "x" }), false);
  assert.equal(isLegacyPageDoc({}), false, "a missing type is not legacy");
  assert.equal(isLegacyPageDoc({ type: 5 }), false, "a non-string type is not legacy");
  assert.equal(isLegacyPageDoc({ type: ["Page"] }), false);
});

test("legacyPagePrefixOf: informational classifier — legacy prefixes report, everything else is null", () => {
  assert.equal(legacyPagePrefixOf("pages-registry/dash"), LEGACY_PAGE_REGISTRY_PREFIX);
  assert.equal(legacyPagePrefixOf("pages/dash.html"), LEGACY_PAGE_BLOB_PREFIX);
  assert.equal(legacyPagePrefixOf("views-registry/dash"), null);
  assert.equal(legacyPagePrefixOf("views/dash.html"), null);
  assert.equal(legacyPagePrefixOf("pages-registry2/dash"), null, "prefix match is segment-exact, not substring");
  assert.equal(legacyPagePrefixOf("notes/pages/dash"), null, "only a LEADING legacy prefix classifies");
  assert.equal(legacyPagePrefixOf(""), null);
});

// ── 2. The write-time nudge (authoring moments only) ─────────────────────────────────────────────

test("nudge: 'doc write --type Page' succeeds and carries the exact hint line; View/other types never do", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);

    const page = await runDocJson(["write", "pages-registry/dash", "--type", "Page", "--title", "Dash", "--dir", dir]);
    assert.equal(page.doc, "written", "the nudge never blocks — the write succeeded");
    assert.equal(page.hint, LEGACY_PAGE_TYPE_HINT);

    const view = await runDocJson(["write", "views-registry/dash", "--type", "View", "--title", "Dash", "--dir", dir]);
    assert.equal("hint" in view, false, "a View-typed doc gets no hint");

    const task = await runDocJson(["write", "tasks/t1", "--type", "Task", "--title", "T", "--dir", dir]);
    assert.equal("hint" in task, false, "an unrelated type gets no hint");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("nudge: 'doc update' hints when the RESULT doc is Page-typed — including a --type Page retype — and not otherwise", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await runDocJson(["write", "pages-registry/dash", "--type", "Page", "--title", "Dash", "--dir", dir]);
    await runDocJson(["write", "views-registry/fresh", "--type", "View", "--title", "Fresh", "--dir", dir]);
    await runDocJson(["write", "notes/plain", "--type", "Concept", "--title", "Plain", "--dir", dir]);

    const patched = await runDocJson(["update", "pages-registry/dash", "--title", "Dash v2", "--dir", dir]);
    assert.equal(patched.doc, "updated");
    assert.equal(patched.hint, LEGACY_PAGE_TYPE_HINT);

    const viewPatched = await runDocJson(["update", "views-registry/fresh", "--title", "Fresh v2", "--dir", dir]);
    assert.equal("hint" in viewPatched, false);

    // Retyping TO Page is an authoring moment producing a Page-typed doc — it hints.
    const retyped = await runDocJson(["update", "notes/plain", "--type", "Page", "--dir", dir]);
    assert.equal(retyped.hint, LEGACY_PAGE_TYPE_HINT);

    // Retyping AWAY from Page produces a View-typed doc — no hint.
    const migratedByHand = await runDocJson(["update", "pages-registry/dash", "--type", "View", "--dir", dir]);
    assert.equal("hint" in migratedByHand, false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("nudge: 'new' of a bundle-declared Page kind hints; another kind does not", async () => {
  const dir = await tempDir();
  try {
    const bundle = await initBundle(dir);
    const now = new Date().toISOString();
    await writeDoc(bundle, {
      id: "conventions/page",
      frontmatter: { type: "Convention", governs: "Page", fields: { required: ["title"], optional: [] }, timestamp: now },
      body: "The legacy Page kind.",
    });
    await writeDoc(bundle, {
      id: "conventions/widget",
      frontmatter: { type: "Convention", governs: "Widget", fields: { required: ["title"], optional: [] }, timestamp: now },
      body: "An unrelated kind.",
    });

    const page = await runNewJson(["Page", "pages-registry/dash", "--title", "Dash", "--dir", dir]);
    assert.equal(page.new, "written", "the nudge never blocks — the create succeeded");
    assert.equal(page.hint, LEGACY_PAGE_TYPE_HINT);

    const widget = await runNewJson(["Widget", "widgets/w1", "--title", "W", "--dir", dir]);
    assert.equal("hint" in widget, false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("nudge: NEVER fires on reads — 'doc read' of a Page-typed doc carries no hint", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    await runDocJson(["write", "pages-registry/dash", "--type", "Page", "--title", "Dash", "--body", "A dashboard.", "--dir", dir]);

    let out = "";
    await doc(["read", "pages-registry/dash", "--dir", dir, "--json"], {
      stdout: (s) => (out += s),
      readStdin: async () => undefined,
    });
    const read = JSON.parse(out) as Record<string, unknown>;
    assert.equal("hint" in read, false, "reads are not authoring moments");
    assert.ok(!out.includes("legacy name"), "no legacy prose anywhere in a read");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── 3. The `status` legacy_naming audit section ──────────────────────────────────────────────────

/**
 * A mixed bundle: two Page-typed docs (one under the legacy registry prefix, one elsewhere), one
 * View-typed doc under a forward prefix, one unrelated doc, and one blob under the legacy
 * `pages/` prefix. Expected: page_typed_docs = 2; legacy_prefix_items = 2 (the pages-registry doc
 * + the pages/ blob — a Page-typed doc under the old prefix legitimately counts in BOTH labels).
 */
async function makeMixedLegacyBundle(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await tempDir();
  const bundle = await initBundle(dir);
  const now = new Date().toISOString();
  await writeDoc(bundle, {
    id: "pages-registry/dash",
    frontmatter: { type: "Page", title: "Dash", entry: "pages/dash.html", timestamp: now },
    body: "",
  });
  await writeDoc(bundle, {
    id: "notes/legacy-typed",
    frontmatter: { type: "Page", title: "Stray legacy-typed doc", timestamp: now },
    body: "",
  });
  await writeDoc(bundle, {
    id: "views-registry/fresh",
    frontmatter: { type: "View", title: "Fresh", entry: "views/fresh.html", timestamp: now },
    body: "",
  });
  await writeDoc(bundle, {
    id: "notes/plain",
    frontmatter: { type: "Concept", title: "Plain", timestamp: now },
    body: "",
  });
  await writeBlob(bundle, "pages/dash.html", new TextEncoder().encode("<html></html>"), "text/html");
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

test("status: legacy_naming counts a seeded mixed bundle correctly — Page-typed docs and old-prefix items, separately labeled", async () => {
  const { dir, cleanup } = await makeMixedLegacyBundle();
  try {
    const result = await runStatusJson(["--dir", dir]);
    const legacy = result.legacy_naming as Record<string, unknown>;
    assert.ok(legacy, "expected a legacy_naming section on a bundle carrying legacy items");

    assert.equal(legacy.page_typed_docs, 2);
    const typedRows = legacy.page_typed_rows as { shown: number; total: number; rows: { id: string }[] };
    assert.equal(typedRows.total, 2);
    assert.deepEqual(
      typedRows.rows.map((r) => r.id).sort(),
      ["notes/legacy-typed", "pages-registry/dash"],
    );

    assert.equal(legacy.legacy_prefix_items, 2);
    const prefixRows = legacy.legacy_prefix_rows as { shown: number; total: number; rows: { id: string; store: string }[] };
    assert.equal(prefixRows.total, 2);
    assert.ok(prefixRows.rows.some((r) => r.id === "pages-registry/dash" && r.store === "doc"));
    assert.ok(prefixRows.rows.some((r) => r.id === "pages/dash.html" && r.store === "blob"));
    // Forward-prefix (views-registry//views/) and unrelated items never appear.
    assert.ok(!prefixRows.rows.some((r) => r.id.startsWith("views")));
    assert.ok(!typedRows.rows.some((r) => r.id === "views-registry/fresh" || r.id === "notes/plain"));

    // Informational, never a warning: the section is labeled, and the report's finding counts are
    // untouched by legacy items (they are legal, not findings).
    assert.equal(typeof legacy.note, "string");
    assert.ok((legacy.note as string).includes("informational"));
  } finally {
    await cleanup();
  }
});

test("status: legacy_naming is read-only and re-runnable — two invocations return identical sections, and nothing was mutated", async () => {
  const { dir, cleanup } = await makeMixedLegacyBundle();
  try {
    const first = await runStatusJson(["--dir", dir]);
    const second = await runStatusJson(["--dir", dir]);
    assert.deepEqual(second.legacy_naming, first.legacy_naming);
    assert.equal(second.docs, first.docs);
  } finally {
    await cleanup();
  }
});

test("status: legacy_naming is OMITTED entirely on a legacy-free bundle (clean empty-state, matching the omit-if-empty idiom)", async () => {
  const dir = await tempDir();
  try {
    const bundle = await initBundle(dir);
    const now = new Date().toISOString();
    await writeDoc(bundle, {
      id: "views-registry/fresh",
      frontmatter: { type: "View", title: "Fresh", entry: "views/fresh.html", timestamp: now },
      body: "",
    });
    await writeBlob(bundle, "views/fresh.html", new TextEncoder().encode("<html></html>"), "text/html");
    const result = await runStatusJson(["--dir", dir]);
    assert.equal("legacy_naming" in result, false, "a legacy-free bundle's report gains nothing");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("status: legacy_naming row lists honor --limit with explicit shown/total (never a silent truncation)", async () => {
  const { dir, cleanup } = await makeMixedLegacyBundle();
  try {
    const result = await runStatusJson(["--dir", dir, "--limit", "1"]);
    const legacy = result.legacy_naming as Record<string, unknown>;
    assert.equal(legacy.page_typed_docs, 2, "the COUNT is always the full total");
    const typedRows = legacy.page_typed_rows as { shown: number; total: number; rows: unknown[] };
    assert.equal(typedRows.shown, 1);
    assert.equal(typedRows.total, 2);
    assert.equal(typedRows.rows.length, 1);
    const prefixRows = legacy.legacy_prefix_rows as { shown: number; total: number; rows: unknown[] };
    assert.equal(prefixRows.shown, 1);
    assert.equal(prefixRows.total, 2);
  } finally {
    await cleanup();
  }
});
