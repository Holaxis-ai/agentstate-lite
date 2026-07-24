// Tests for scripts/migrate-legacy-view-names.mjs (Phase 2a of the legacy-deprecation path).
// Requires built dists (run through `npm run test:scripts` after a repo-root build; a missing
// core dist is built here as a fallback so the suite never manufactures phantom failures).

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { before } from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = path.join(repoRoot, "scripts", "migrate-legacy-view-names.mjs");
const CORE_DIST = path.join(repoRoot, "packages", "core", "dist", "index.js");

before(async () => {
  if (existsSync(CORE_DIST)) return;
  const npmCli = process.env.npm_execpath?.trim();
  if (!npmCli) throw new Error("packages/core/dist is missing and npm_execpath is unset — build from the repo root first");
  await execFileAsync(process.execPath, [npmCli, "run", "build", "-w", "@agentstate-lite/core"], {
    cwd: repoRoot,
    maxBuffer: 10 * 1024 * 1024,
  });
});

// Dynamic imports so the `before` fallback build can run first.
const core = () => import(CORE_DIST);
const script = () => import(SCRIPT);

const OLD_BRIDGE_CONVENTION_BODY = "# View\n\nThe OLD shipped convention: bridge required.\n";

/**
 * The full fixture matrix from the task spec: a Page-typed valid registration, a Page-typed
 * non-registration doc, a bridge-only View, a both-fields View, an access-only View, an invalid
 * bridge value, an OLD bridge-required View convention, and a Page-kind convention.
 */
async function makeFixtureBundle() {
  const { initBundle, writeDoc } = await core();
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-migrate-fixture-"));
  const bundle = await initBundle(dir);
  const T = "2026-07-01T00:00:00.000Z";
  await writeDoc(bundle, {
    id: "pages-registry/dash",
    frontmatter: { type: "Page", title: "Dash", entry: "pages/dash.html", bridge: "bundle-read", timestamp: T },
    body: "A Page-typed VALID registration at a legacy location.\n",
  });
  await writeDoc(bundle, {
    id: "notes/scratch-page",
    frontmatter: { type: "Page", title: "Scratch", timestamp: T },
    body: "A Page-typed NON-registration doc (no entry, off-prefix).\n",
  });
  await writeDoc(bundle, {
    id: "views-registry/pulse",
    frontmatter: { type: "View", title: "Pulse", entry: "views/pulse.html", bridge: "none", timestamp: T },
    body: "A bridge-only View.\n",
  });
  await writeDoc(bundle, {
    id: "views-registry/board",
    frontmatter: {
      type: "View",
      title: "Board",
      entry: "views/board.html",
      access: "bundle-read",
      bridge: "bundle-propose",
      timestamp: T,
    },
    body: "A both-fields View — access alone decides; bridge is dropped, never merged.\n",
  });
  await writeDoc(bundle, {
    id: "views-registry/roadmap",
    frontmatter: { type: "View", title: "Roadmap", entry: "views/roadmap.html", access: "bundle-read", timestamp: T },
    body: "An access-only View — untouched.\n",
  });
  await writeDoc(bundle, {
    id: "views-registry/weird",
    frontmatter: { type: "View", title: "Weird", entry: "views/weird.html", bridge: "write-everything", timestamp: T },
    body: "An invalid capability value — copied verbatim, warned, never fixed.\n",
  });
  await writeDoc(bundle, {
    id: "conventions/view",
    frontmatter: {
      type: "Convention",
      title: "View",
      governs: "View",
      path: "views-registry/",
      fields: {
        required: ["title", "entry", "bridge"],
        optional: ["description"],
        values: { bridge: ["none", "bundle-read", "bundle-propose"] },
        terminal: {},
      },
      timestamp: T,
    },
    body: OLD_BRIDGE_CONVENTION_BODY,
  });
  await writeDoc(bundle, {
    id: "conventions/page",
    frontmatter: {
      type: "Convention",
      title: "Page",
      governs: "Page",
      path: "pages-registry/",
      fields: { required: ["title", "entry"], optional: ["description"], values: {}, terminal: {} },
      timestamp: T,
    },
    body: "# Page\n\nA convention teaching the dead legacy kind name.\n",
  });
  return { dir, bundle };
}

async function versionMap(bundle) {
  const { query, readDocVersioned } = await core();
  const docs = await query(bundle);
  const map = new Map();
  for (const doc of docs) map.set(doc.id, (await readDocVersioned(bundle, doc.id)).version);
  return map;
}

test("one run migrates the full fixture matrix in place; a second run reports zero changes", async () => {
  const { migrateBundle, loadCanonicalViewConvention } = await script();
  const { query, readDoc } = await core();
  const { dir, bundle } = await makeFixtureBundle();
  try {
    const untouchedBefore = (await versionMap(bundle)).get("views-registry/roadmap");

    const receipt = await migrateBundle(bundle);
    assert.equal(receipt.dry_run, false);
    assert.equal(receipt.types_flipped, 2, "both Page-typed docs flip, registration-valid or not");
    assert.equal(receipt.bridge_renamed, 3, "dash + pulse + weird");
    assert.equal(receipt.bridge_removed, 1, "board's shadowed bridge is dropped");
    assert.equal(receipt.convention_swapped, "swapped");
    assert.deepEqual(receipt.page_conventions_deleted, ["conventions/page"]);
    assert.deepEqual(receipt.skipped_docs, []);
    assert.equal(receipt.warnings.length, 1);
    assert.equal(receipt.warnings[0].id, "views-registry/weird");
    assert.match(receipt.warnings[0].warning, /copied verbatim/);

    // Zero Page types, zero own-bridge fields — and NO file moves: ids stay put.
    assert.equal((await query(bundle, { type: "Page" })).length, 0);
    const all = await query(bundle);
    for (const doc of all) {
      assert.ok(!Object.hasOwn(doc.frontmatter, "bridge"), `${doc.id} still carries own bridge`);
    }
    const dash = await readDoc(bundle, "pages-registry/dash");
    assert.equal(dash.frontmatter.type, "View");
    assert.equal(dash.frontmatter.access, "bundle-read");
    assert.equal(dash.frontmatter.entry, "pages/dash.html", "blob keys stay exactly where they are");
    const scratch = await readDoc(bundle, "notes/scratch-page");
    assert.equal(scratch.frontmatter.type, "View");
    const board = await readDoc(bundle, "views-registry/board");
    assert.equal(board.frontmatter.access, "bundle-read", "a leftover bridge can never widen access");
    const weird = await readDoc(bundle, "views-registry/weird");
    assert.equal(weird.frontmatter.access, "write-everything", "invalid values copy verbatim, never 'fixed'");

    // Convention swapped to THE canonical shipped content (single-sourced from the repo file).
    const canonical = loadCanonicalViewConvention();
    const swapped = await readDoc(bundle, "conventions/view");
    assert.deepEqual(swapped.frontmatter, canonical.frontmatter);
    assert.equal(swapped.body, canonical.body);
    assert.ok(!swapped.body.includes(OLD_BRIDGE_CONVENTION_BODY.slice(2)));
    await assert.rejects(() => readDoc(bundle, "conventions/page"), /ENOENT/);

    // The access-only View was never written (same version token).
    assert.equal((await versionMap(bundle)).get("views-registry/roadmap"), untouchedBefore);

    // Idempotence: run 2 is all zeros and writes nothing (byte-identical version map).
    const beforeSecond = await versionMap(bundle);
    const second = await migrateBundle(bundle);
    assert.equal(second.types_flipped, 0);
    assert.equal(second.bridge_renamed, 0);
    assert.equal(second.bridge_removed, 0);
    assert.equal(second.convention_swapped, false);
    assert.deepEqual(second.page_conventions_deleted, []);
    assert.deepEqual(second.changed_docs, []);
    assert.deepEqual(second.warnings, []);
    assert.deepEqual(await versionMap(bundle), beforeSecond);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("a competing write inside the CAS window is retried from a fresh read and converges", async () => {
  const { migrateBundle } = await script();
  const { readDoc, writeDocVersioned } = await core();
  const { dir, bundle } = await makeFixtureBundle();
  try {
    const target = "pages-registry/dash";
    const attempts = [];
    const receipt = await migrateBundle(bundle, {
      hooks: {
        beforeDocWrite: async (id, attempt) => {
          if (id !== target) return;
          attempts.push(attempt);
          if (attempt === 0) {
            // Competing writer lands between the migration's read and its CAS write.
            const current = await readDoc(bundle, target);
            await writeDocVersioned(bundle, {
              id: target,
              frontmatter: current.frontmatter,
              body: "competing edit\n",
            });
          }
        },
      },
    });
    assert.deepEqual(attempts, [0, 1], "exactly one conflict, one retry");
    const dash = await readDoc(bundle, target);
    assert.equal(dash.frontmatter.type, "View", "the rename still lands");
    assert.equal(dash.frontmatter.access, "bundle-read");
    assert.equal(dash.body, "competing edit\n", "the competing writer's change is preserved, not clobbered");
    assert.equal(receipt.types_flipped, 2);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("dry-run writes nothing and reports exactly what a real run would do", async () => {
  const { migrateBundle } = await script();
  const { query, readDoc } = await core();
  const { dir, bundle } = await makeFixtureBundle();
  try {
    const before = await versionMap(bundle);
    const receipt = await migrateBundle(bundle, { dryRun: true });
    assert.equal(receipt.dry_run, true);
    assert.equal(receipt.types_flipped, 2);
    assert.equal(receipt.bridge_renamed, 3);
    assert.equal(receipt.bridge_removed, 1);
    assert.equal(receipt.convention_swapped, "would_swap");
    assert.deepEqual(receipt.page_conventions_deleted, ["conventions/page"]);
    assert.equal(receipt.warnings.length, 1);

    assert.deepEqual(await versionMap(bundle), before, "dry-run must not write a byte");
    assert.equal((await query(bundle, { type: "Page" })).length, 2);
    assert.equal((await readDoc(bundle, "conventions/page")).frontmatter.governs, "Page");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("CLI surface: --dry-run over --dir emits the receipt with the normalization note; no --dir exits 2", async () => {
  const { NORMALIZATION_NOTE } = await script();
  const { dir } = await makeFixtureBundle();
  try {
    const { stdout } = await execFileAsync(process.execPath, [SCRIPT, "--dir", dir, "--dry-run"], {
      cwd: repoRoot,
      maxBuffer: 10 * 1024 * 1024,
    });
    const parsed = JSON.parse(stdout);
    assert.equal(parsed.note, NORMALIZATION_NOTE);
    assert.match(parsed.note, /re-serialize whole documents to canonical form/);
    assert.equal(parsed.bundles.length, 1);
    assert.equal(parsed.bundles[0].bundle, dir);
    assert.equal(parsed.bundles[0].types_flipped, 2);

    await assert.rejects(
      () => execFileAsync(process.execPath, [SCRIPT], { cwd: repoRoot }),
      (err) => err.code === 2 && /usage:/.test(err.stderr),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("a conventions-free bundle gains no conventions; docs still rename", async () => {
  const { migrateBundle } = await script();
  const { initBundle, writeDoc, query, readDoc } = await core();
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-migrate-bare-"));
  try {
    const bundle = await initBundle(dir);
    await writeDoc(bundle, {
      id: "pages-registry/solo",
      frontmatter: { type: "Page", title: "Solo", entry: "pages/solo.html", bridge: "none" },
      body: "Legacy doc in a conventions-free bundle.\n",
    });
    const receipt = await migrateBundle(bundle);
    assert.equal(receipt.types_flipped, 1);
    assert.equal(receipt.bridge_renamed, 1);
    assert.equal(receipt.convention_swapped, false, "kind usage stays opt-in per bundle");
    assert.deepEqual(receipt.page_conventions_deleted, []);
    assert.equal((await readDoc(bundle, "pages-registry/solo")).frontmatter.type, "View");
    assert.equal((await query(bundle, { prefix: "conventions/", type: "Convention" })).length, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("a bundle whose only View convention was the Page one gets the shipped View convention as its replacement", async () => {
  const { migrateBundle, loadCanonicalViewConvention } = await script();
  const { initBundle, writeDoc, readDoc } = await core();
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-migrate-pageconv-"));
  try {
    const bundle = await initBundle(dir);
    await writeDoc(bundle, {
      id: "conventions/page",
      frontmatter: {
        type: "Convention",
        title: "Page",
        governs: "Page",
        path: "pages-registry/",
        fields: { required: ["title", "entry"], optional: [], values: {}, terminal: {} },
      },
      body: "# Page\n",
    });
    await writeDoc(bundle, {
      id: "pages-registry/dash",
      frontmatter: { type: "Page", title: "Dash", entry: "pages/dash.html" },
      body: "governed by the Page convention\n",
    });
    const receipt = await migrateBundle(bundle);
    assert.equal(receipt.convention_swapped, "created", "governance continuity: the View convention replaces the deleted Page one");
    assert.deepEqual(receipt.page_conventions_deleted, ["conventions/page"]);
    const created = await readDoc(bundle, "conventions/view");
    assert.deepEqual(created.frontmatter, loadCanonicalViewConvention().frontmatter);
    await assert.rejects(() => readDoc(bundle, "conventions/page"), /ENOENT/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
