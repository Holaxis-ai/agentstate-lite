/**
 * The legacy-naming primitive (src/legacy-page.ts, plans/rename-page-kind-to-view Option C+ Unit 2):
 * ONE predicate feeding two read-only surfaces —
 *
 *   1. the write-time nudge: `new`/`doc write`/`doc update`/`promote` (.md route) SUCCESS receipts
 *      carry the ONE hint line when (and only when) the produced doc is typed 'Page'; never on
 *      reads, never a block;
 *   2. `status`'s `legacy_naming` audit section: count + ids of Page-typed docs plus an
 *      informational, STORE-AWARE count of items under the legacy pages-registry//pages/
 *      prefixes, omitted entirely on a legacy-free bundle.
 *
 * Runs the command functions in-process against real temp filesystem bundles (the
 * `doc.test.ts`/`status.test.ts` pattern, including the explicit `readStdin` override — see
 * doc.test.ts's test-authoring note).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { initBundle, writeBlob, writeDoc } from "@agentstate-lite/core";

import {
  isLegacyPageDoc,
  isLegacyEntryBlobKey,
  isLegacyRegistryDocId,
  LEGACY_PAGE_TYPE_HINT,
} from "../src/legacy-page.js";
import { doc } from "../src/commands/doc.js";
import { newCommand } from "../src/commands/new.js";
import { promote } from "../src/commands/promote.js";
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

/** Run `promote` in-process, capturing + parsing its `--json` stdout. */
async function runPromoteJson(argv: string[]): Promise<Record<string, unknown>> {
  let out = "";
  await promote([...argv, "--json"], { stdout: (s) => (out += s) });
  return JSON.parse(out) as Record<string, unknown>;
}

// ── 1. The predicate itself ──────────────────────────────────────────────────────────────────────

test("isLegacyPageDoc: EXACT 'Page' only, matching core's exact grammar; 'View'/whitespace/case-variants/non-strings never do", () => {
  assert.equal(isLegacyPageDoc({ type: "Page" }), true);
  // EXACT, no trimming — the same strictness as core's `isPageTypeName`. A whitespace-padded
  // value can only reach consumers via a deliberately QUOTED YAML scalar (`type: " Page "`):
  // plain scalars are whitespace-trimmed by the YAML parser itself, and the one frontmatter
  // parse layer (core/src/frontmatter.ts) does no further `type` normalization. Core rejects
  // the quoted form as a registration, so counting it legacy here would nudge/audit a doc
  // dual-read does not accept.
  assert.equal(isLegacyPageDoc({ type: " Page " }), false, "quoted whitespace-padded type is not legacy (core's grammar is exact)");
  assert.equal(isLegacyPageDoc({ type: "\tPage\n" }), false);
  assert.equal(isLegacyPageDoc({ type: "View" }), false);
  assert.equal(isLegacyPageDoc({ type: "page" }), false, "type values are case-sensitive — 'page' is another type, not a near-miss");
  assert.equal(isLegacyPageDoc({ type: "PAGE" }), false);
  assert.equal(isLegacyPageDoc({ type: "Pages" }), false);
  assert.equal(isLegacyPageDoc({ type: "Page " + "x" }), false);
  assert.equal(isLegacyPageDoc({}), false, "a missing type is not legacy");
  assert.equal(isLegacyPageDoc({ type: 5 }), false, "a non-string type is not legacy");
  assert.equal(isLegacyPageDoc({ type: ["Page"] }), false);
});

test("store-aware classifiers: doc ids classify only against pages-registry/, blob keys only against pages/", () => {
  assert.equal(isLegacyRegistryDocId("pages-registry/dash"), true);
  assert.equal(isLegacyRegistryDocId("pages/manual"), false, "a doc under pages/ is NOT a legacy item — that prefix belongs to the BLOB store");
  assert.equal(isLegacyRegistryDocId("views-registry/dash"), false);
  assert.equal(isLegacyRegistryDocId("pages-registry2/dash"), false, "prefix match is segment-exact, not substring");
  assert.equal(isLegacyRegistryDocId("notes/pages-registry/dash"), false, "only a LEADING legacy prefix classifies");
  assert.equal(isLegacyRegistryDocId(""), false);

  assert.equal(isLegacyEntryBlobKey("pages/dash.html"), true);
  assert.equal(isLegacyEntryBlobKey("pages-registry/dash"), false, "a registry-prefixed key is not a legacy BLOB item");
  assert.equal(isLegacyEntryBlobKey("views/dash.html"), false);
  assert.equal(isLegacyEntryBlobKey("notes/pages/dash.html"), false);
  assert.equal(isLegacyEntryBlobKey(""), false);
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

test("nudge: 'promote' of a Page-typed .md registry doc hints (the documented View-authoring route); View docs and blob promotions never do", async () => {
  const dir = await tempDir();
  const files = await tempDir();
  try {
    await initBundle(dir);
    await writeFile(
      path.join(files, "legacy.md"),
      "---\ntype: Page\ntitle: Legacy Dash\nentry: pages/legacy.html\n---\nA legacy-typed registry doc.\n",
    );
    await writeFile(
      path.join(files, "fresh.md"),
      "---\ntype: View\ntitle: Fresh Dash\nentry: views/fresh.html\n---\nA current registry doc.\n",
    );
    await writeFile(path.join(files, "dash.html"), "<html></html>");

    const legacy = await runPromoteJson([path.join(files, "legacy.md"), "--doc-key", "pages-registry/legacy.md", "--dir", dir]);
    assert.equal(legacy.promote, "written", "the nudge never blocks — the promotion succeeded");
    assert.equal(legacy.route, "doc");
    assert.equal(legacy.hint, LEGACY_PAGE_TYPE_HINT);

    const fresh = await runPromoteJson([path.join(files, "fresh.md"), "--doc-key", "views-registry/fresh.md", "--dir", dir]);
    assert.equal("hint" in fresh, false, "a View-typed promotion gets no hint");

    // Blob promotions have no frontmatter to inspect — even under the legacy blob prefix.
    const blob = await runPromoteJson([path.join(files, "dash.html"), "--doc-key", "pages/dash.html", "--dir", dir]);
    assert.equal(blob.route, "blob");
    assert.equal("hint" in blob, false, "blob promotions are untouched");
  } finally {
    await rm(dir, { recursive: true, force: true });
    await rm(files, { recursive: true, force: true });
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

test("status: legacy_naming is STORE-AWARE — a concept doc under pages/ is never counted; the registry doc and pages/ blob still are", async () => {
  const dir = await tempDir();
  try {
    const bundle = await initBundle(dir);
    const now = new Date().toISOString();
    // The cross-store decoy: an unrelated concept doc whose id merely lives under pages/ —
    // that prefix is legacy only in the BLOB store, so this doc must NOT count.
    await writeDoc(bundle, {
      id: "pages/manual",
      frontmatter: { type: "Note", title: "A doc that just lives under pages/", timestamp: now },
      body: "",
    });
    await writeDoc(bundle, {
      id: "pages-registry/dash",
      frontmatter: { type: "Page", title: "Dash", entry: "pages/dash.html", timestamp: now },
      body: "",
    });
    await writeBlob(bundle, "pages/dash.html", new TextEncoder().encode("<html></html>"), "text/html");

    const result = await runStatusJson(["--dir", dir]);
    const legacy = result.legacy_naming as Record<string, unknown>;
    assert.equal(legacy.legacy_prefix_items, 2, "registry doc + pages/ blob only — never the pages/ concept doc");
    const prefixRows = legacy.legacy_prefix_rows as { rows: { id: string; store: string }[] };
    assert.ok(prefixRows.rows.some((r) => r.id === "pages-registry/dash" && r.store === "doc"));
    assert.ok(prefixRows.rows.some((r) => r.id === "pages/dash.html" && r.store === "blob"));
    assert.ok(!prefixRows.rows.some((r) => r.id === "pages/manual"), "the cross-store decoy doc must not appear");
  } finally {
    await rm(dir, { recursive: true, force: true });
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
