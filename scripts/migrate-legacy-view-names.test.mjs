// Tests for scripts/migrate-legacy-view-names.mjs (Phase 2a of the legacy-deprecation path).
// Requires built dists (run through `npm run test:scripts` after a repo-root build; a missing
// core dist is built here as a fallback so the suite never manufactures phantom failures).

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
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

function writeRawDoc(dir, relative, content) {
  const target = path.join(dir, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
}

/**
 * The full fixture matrix from the task spec plus the fix-round additions: a Page-typed valid
 * registration, a Page-typed non-registration doc WITHOUT a timestamp (raw-authored, F4), a
 * bridge-only View, a both-fields View, an access-only View, an invalid bridge value, a
 * NON-View doc with an own `bridge` field (F6 negative scope), a KNOWN PRIOR SHIPPED View
 * convention (the bridge-required form), and a Page-kind convention.
 */
async function makeFixtureBundle() {
  const { initBundle, writeDoc } = await core();
  const { loadPriorShippedViewConventions } = await script();
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-migrate-fixture-"));
  const bundle = await initBundle(dir);
  const T = "2026-07-01T00:00:00.000Z";
  await writeDoc(bundle, {
    id: "pages-registry/dash",
    frontmatter: { type: "Page", title: "Dash", entry: "pages/dash.html", bridge: "bundle-read", timestamp: T },
    body: "A Page-typed VALID registration at a legacy location.\n",
  });
  // Raw-authored (external shape): Page-typed docs WITHOUT a usable timestamp in all three
  // spellings — absent, empty string, and bare YAML null. The engine write stamps each with the
  // current time, and the receipt must report every one (F4 + round-2 variant).
  writeRawDoc(
    dir,
    "notes/scratch-page.md",
    "---\ntype: Page\ntitle: Scratch\n---\nA Page-typed NON-registration doc (no entry, off-prefix, no timestamp).\n",
  );
  writeRawDoc(
    dir,
    "notes/empty-ts.md",
    '---\ntype: Page\ntitle: Empty timestamp\ntimestamp: ""\n---\nAn empty-string timestamp is unusable — stamping must be disclosed.\n',
  );
  writeRawDoc(
    dir,
    "notes/null-ts.md",
    "---\ntype: Page\ntitle: Null timestamp\ntimestamp:\n---\nA bare YAML null timestamp is unusable — stamping must be disclosed.\n",
  );
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
  // F6 negative scope: `bridge` is only the View kind's legacy spelling — a doc of any OTHER
  // type carrying an own `bridge` field is out of scope and must never be touched.
  await writeDoc(bundle, {
    id: "notes/bridge-note",
    frontmatter: { type: "Note", title: "Bridge note", bridge: "bundle-read", timestamp: T },
    body: "A Note about a bridge — not a View; the field is ordinary user data here.\n",
  });
  // The View convention as a KNOWN PRIOR SHIPPED form (the bridge-required one) — swaps silently.
  const priorForm = loadPriorShippedViewConventions()[0];
  await writeDoc(bundle, {
    id: "conventions/view",
    frontmatter: priorForm.frontmatter,
    body: priorForm.body,
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
  const { query, readDoc, readDocVersioned } = await core();
  const { dir, bundle } = await makeFixtureBundle();
  try {
    const untouchedBefore = (await versionMap(bundle)).get("views-registry/roadmap");
    const bridgeNoteBefore = (await readDocVersioned(bundle, "notes/bridge-note")).version;

    const receipt = await migrateBundle(bundle);
    assert.equal(receipt.dry_run, false);
    assert.equal(receipt.types_flipped, 4, "every Page-typed doc flips, registration-valid or not");
    assert.equal(receipt.bridge_renamed, 3, "dash + pulse + weird");
    assert.equal(receipt.bridge_removed, 1, "board's shadowed bridge is dropped");
    assert.equal(receipt.timestamp_added, 3, "absent, empty-string, AND null timestamps are all REPORTED (F4)");
    assert.deepEqual(receipt.timestamp_added_docs, ["notes/empty-ts", "notes/null-ts", "notes/scratch-page"]);
    assert.equal(receipt.convention_swapped, "swapped", "a known prior shipped form swaps silently");
    assert.deepEqual(receipt.page_conventions_deleted, ["conventions/page"]);
    assert.deepEqual(receipt.skipped_docs, []);
    assert.equal(receipt.warnings.length, 1);
    assert.equal(receipt.warnings[0].id, "views-registry/weird");
    assert.match(receipt.warnings[0].warning, /copied verbatim/);

    // Zero Page types, zero own-bridge fields on View-typed docs — and NO file moves: ids stay put.
    assert.equal((await query(bundle, { type: "Page" })).length, 0);
    for (const doc of await query(bundle)) {
      if (doc.id === "notes/bridge-note") continue; // out of scope by design (F6)
      assert.ok(!Object.hasOwn(doc.frontmatter, "bridge"), `${doc.id} still carries own bridge`);
    }
    const dash = await readDoc(bundle, "pages-registry/dash");
    assert.equal(dash.frontmatter.type, "View");
    assert.equal(dash.frontmatter.access, "bundle-read");
    assert.equal(dash.frontmatter.entry, "pages/dash.html", "blob keys stay exactly where they are");
    for (const id of ["notes/scratch-page", "notes/empty-ts", "notes/null-ts"]) {
      const stamped = await readDoc(bundle, id);
      assert.equal(stamped.frontmatter.type, "View");
      assert.ok(
        typeof stamped.frontmatter.timestamp === "string" && stamped.frontmatter.timestamp.trim() !== "",
        `${id}: the engine stamped a usable timestamp — and the receipt said so`,
      );
    }
    const board = await readDoc(bundle, "views-registry/board");
    assert.equal(board.frontmatter.access, "bundle-read", "a leftover bridge can never widen access");
    const weird = await readDoc(bundle, "views-registry/weird");
    assert.equal(weird.frontmatter.access, "write-everything", "invalid values copy verbatim, never 'fixed'");

    // F6: the non-View doc with an own bridge field is byte/version-stable and keeps its field.
    const bridgeNote = await readDocVersioned(bundle, "notes/bridge-note");
    assert.equal(bridgeNote.version, bridgeNoteBefore, "a non-View doc with own bridge is never written");
    assert.equal(bridgeNote.doc.frontmatter.bridge, "bundle-read");
    assert.equal(bridgeNote.doc.frontmatter.type, "Note");

    // Convention swapped to THE canonical shipped content (single-sourced from the repo file).
    const canonical = loadCanonicalViewConvention();
    const swapped = await readDoc(bundle, "conventions/view");
    assert.deepEqual(swapped.frontmatter, canonical.frontmatter);
    assert.equal(swapped.body, canonical.body);
    await assert.rejects(() => readDoc(bundle, "conventions/page"), /ENOENT/);

    // The access-only View was never written (same version token).
    assert.equal((await versionMap(bundle)).get("views-registry/roadmap"), untouchedBefore);

    // Idempotence: run 2 is all zeros and writes nothing (byte-identical version map).
    const beforeSecond = await versionMap(bundle);
    const second = await migrateBundle(bundle);
    assert.equal(second.types_flipped, 0);
    assert.equal(second.bridge_renamed, 0);
    assert.equal(second.bridge_removed, 0);
    assert.equal(second.timestamp_added, 0);
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
    assert.equal(receipt.types_flipped, 4);
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
    assert.equal(receipt.types_flipped, 4);
    assert.equal(receipt.bridge_renamed, 3);
    assert.equal(receipt.bridge_removed, 1);
    assert.equal(receipt.timestamp_added, 3, "dry-run projects absent, empty, AND null stampings too (F4)");
    assert.deepEqual(receipt.timestamp_added_docs, ["notes/empty-ts", "notes/null-ts", "notes/scratch-page"]);
    assert.equal(receipt.convention_swapped, "would_swap");
    assert.deepEqual(receipt.page_conventions_deleted, ["conventions/page"]);
    assert.equal(receipt.warnings.length, 1);

    assert.deepEqual(await versionMap(bundle), before, "dry-run must not write a byte");
    assert.equal((await query(bundle, { type: "Page" })).length, 4);
    assert.equal((await readDoc(bundle, "conventions/page")).frontmatter.governs, "Page");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("F1: a malformed Page-shaped doc never crashes a run — receipt always lands, deletion stays blocked", async () => {
  const { migrateBundle, loadPriorShippedViewConventions } = await script();
  const { initBundle, writeDoc, readDoc } = await core();
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-migrate-broken-"));
  try {
    const bundle = await initBundle(dir);
    await writeDoc(bundle, {
      id: "pages-registry/ok",
      frontmatter: { type: "Page", title: "OK", entry: "pages/ok.html", bridge: "none", timestamp: "2026-07-01T00:00:00.000Z" },
      body: "the readable sibling\n",
    });
    const priorForm = loadPriorShippedViewConventions()[0];
    await writeDoc(bundle, { id: "conventions/view", frontmatter: priorForm.frontmatter, body: priorForm.body });
    await writeDoc(bundle, {
      id: "conventions/page",
      frontmatter: { type: "Convention", title: "Page", governs: "Page", path: "pages-registry/" },
      body: "# Page\n",
    });
    // The reviewer's fixture shape: raw Page-shaped doc with an unterminated YAML flow sequence.
    const brokenRaw = "---\ntype: Page\ntitle: Broken\nentry: [unterminated\n---\nnever parses\n";
    writeRawDoc(dir, "pages-registry/broken.md", brokenRaw);

    // Dry-run: honest — reports the skip, plans NO Page-convention deletion.
    const dry = await migrateBundle(bundle, { dryRun: true });
    assert.equal(dry.skipped_docs.length, 1);
    assert.equal(dry.skipped_docs[0].id, "pages-registry/broken");
    assert.deepEqual(dry.page_conventions_deleted, [], "an unreadable doc blocks the deletion plan");
    assert.ok(dry.warnings.some((w) => w.id === "pages-registry/broken" && /unreadable/.test(w.warning)));
    assert.ok(dry.warnings.some((w) => w.id === "conventions/page" && /kept/.test(w.warning)));

    // REAL run: completes with a receipt (the pre-fix crash was the post-write re-query), the
    // readable sibling migrates, the broken doc's bytes are untouched, the Page convention stays.
    const receipt = await migrateBundle(bundle);
    assert.equal(receipt.types_flipped, 1);
    assert.equal(receipt.skipped_docs.length, 1, "skips are DEDUPED across every scan");
    assert.equal(receipt.convention_swapped, "swapped");
    assert.deepEqual(receipt.page_conventions_deleted, []);
    assert.ok(receipt.warnings.some((w) => w.id === "conventions/page" && /kept/.test(w.warning)));
    assert.equal((await readDoc(bundle, "pages-registry/ok")).frontmatter.type, "View");
    assert.equal((await readDoc(bundle, "conventions/page")).frontmatter.governs, "Page");
    assert.equal(await readFile(path.join(dir, "pages-registry", "broken.md"), "utf8"), brokenRaw);

    // And a second run still converges without a crash.
    const second = await migrateBundle(bundle);
    assert.equal(second.types_flipped, 0);
    assert.deepEqual(second.page_conventions_deleted, []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("F2: a non-bundle directory is refused before any write", async () => {
  const { migrateBundle } = await script();
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-migrate-nonbundle-"));
  try {
    const raw = "---\ntype: Page\ntitle: Loose\n---\nA Page-typed file in a plain directory.\n";
    writeRawDoc(dir, "loose-page.md", raw);

    await assert.rejects(() => migrateBundle({ root: dir }), /not a bundle root/);

    await assert.rejects(
      () => execFileAsync(process.execPath, [SCRIPT, "--dir", dir], { cwd: repoRoot }),
      (err) => err.code === 2 && /not a bundle root/.test(err.stderr),
    );
    assert.equal(await readFile(path.join(dir, "loose-page.md"), "utf8"), raw, "nothing was written");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("F3: a customized View convention is never silently destroyed", async () => {
  const { migrateBundle, loadCanonicalViewConvention } = await script();
  const { initBundle, writeDoc, readDoc, readDocVersioned } = await core();
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-migrate-custom-"));
  const exportLeftover = `${dir.replace(/[\\/]+$/, "")}.pre-swap.conventions-view.md`;
  try {
    const bundle = await initBundle(dir);
    const customBody = "# View\n\nRECOVERY-CRITICAL local operating notes that exist nowhere else.\n";
    await writeDoc(bundle, {
      id: "conventions/view",
      frontmatter: {
        type: "Convention",
        title: "View",
        governs: "View",
        path: "views-registry/",
        fields: { required: ["title", "entry", "access", "owner"], optional: [], values: {}, terminal: {} },
        timestamp: "2026-07-01T00:00:00.000Z",
      },
      body: customBody,
    });
    const before = (await readDocVersioned(bundle, "conventions/view")).version;

    // Dry-run, default: reports the skip decision.
    const dryDefault = await migrateBundle(bundle, { dryRun: true });
    assert.equal(dryDefault.convention_swapped, "skipped_customized");
    // Dry-run, with the flag: reports the swap AND the export path it would use.
    const dryFlag = await migrateBundle(bundle, { dryRun: true, overwriteCustomConventions: true });
    assert.equal(dryFlag.convention_swapped, "would_swap_customized");
    assert.equal(typeof dryFlag.convention_export, "string");
    assert.ok(!existsSync(dryFlag.convention_export), "dry-run writes no export file");

    // Real run, default: skip + warning, content untouched.
    const skipped = await migrateBundle(bundle);
    assert.equal(skipped.convention_swapped, "skipped_customized");
    assert.ok(skipped.warnings.some((w) => w.id === "conventions/view" && /customized/.test(w.warning)));
    assert.equal((await readDocVersioned(bundle, "conventions/view")).version, before, "never written by default");

    // Real run, explicit flag: export first, then swap; receipt names the export path.
    const swapped = await migrateBundle(bundle, { overwriteCustomConventions: true });
    assert.equal(swapped.convention_swapped, "swapped_customized");
    assert.equal(typeof swapped.convention_export, "string");
    const exported = await readFile(swapped.convention_export, "utf8");
    // The export must be a REAL OKF markdown doc (frontmatter + body), re-promotable as-is —
    // not a serialized object wrapper. Round-trip it through THE one parser to prove it.
    const { parseMarkdown } = await core();
    const reparsed = parseMarkdown(exported, "export.md");
    assert.equal(reparsed.frontmatter.governs, "View");
    assert.deepEqual(reparsed.frontmatter.fields.required, ["title", "entry", "access", "owner"]);
    assert.equal(reparsed.body, customBody, "the destroyed body survives byte-for-byte in the export");
    const now = await readDoc(bundle, "conventions/view");
    assert.deepEqual(now.frontmatter, loadCanonicalViewConvention().frontmatter);

    // Idempotence: a further run is a no-op.
    const third = await migrateBundle(bundle, { overwriteCustomConventions: true });
    assert.equal(third.convention_swapped, false);
  } finally {
    await rm(dir, { recursive: true, force: true });
    await rm(exportLeftover, { force: true });
  }
});

// Round-4 finding: a non-Convention doc parked on conventions/view was invisible to the
// type-filtered planning scan — dry-run said would_create, the CAS create was refused SILENTLY,
// and the Page convention was still deleted, leaving migrated View docs ungoverned. Both
// occupant shapes (wrong type, wrong governs) must share one rule: visible at plan time, the
// occupied outcome in the receipt, and the Page convention KEPT with the reason.
test("an occupant on conventions/view blocks creation AND preserves the Page convention — both occupant shapes", async () => {
  const { migrateBundle } = await script();
  const { initBundle, writeDoc, readDoc, readDocVersioned } = await core();
  const occupants = [
    {
      label: "non-Convention occupant (type: Note)",
      frontmatter: { type: "Note", title: "Parked", timestamp: "2026-07-01T00:00:00.000Z" },
    },
    {
      label: "Convention governing something else (governs: Term)",
      frontmatter: { type: "Convention", title: "Term", governs: "Term", timestamp: "2026-07-01T00:00:00.000Z" },
    },
  ];
  for (const occupant of occupants) {
    const dir = await mkdtemp(path.join(tmpdir(), "aslite-migrate-occupied-"));
    try {
      const bundle = await initBundle(dir);
      await writeDoc(bundle, { id: "conventions/view", frontmatter: occupant.frontmatter, body: "parked content\n" });
      await writeDoc(bundle, {
        id: "conventions/page",
        frontmatter: { type: "Convention", title: "Page", governs: "Page", path: "pages-registry/" },
        body: "# Page\n",
      });
      await writeDoc(bundle, {
        id: "pages-registry/dash",
        frontmatter: { type: "Page", title: "Dash", entry: "pages/dash.html", timestamp: "2026-07-01T00:00:00.000Z" },
        body: "a legacy registration\n",
      });
      const occupantBefore = (await readDocVersioned(bundle, "conventions/view")).version;

      // Dry-run projects the SAME decision as the real run — occupied, never would_create.
      const dry = await migrateBundle(bundle, { dryRun: true });
      assert.equal(dry.convention_swapped, "skipped_occupied", occupant.label);
      assert.deepEqual(dry.page_conventions_deleted, [], occupant.label);
      assert.ok(
        dry.warnings.some((w) => w.id === "conventions/view" && /left untouched/.test(w.warning)),
        occupant.label,
      );
      assert.ok(
        dry.warnings.some((w) => w.id === "conventions/page" && /ungoverned/.test(w.warning)),
        `${occupant.label}: dry-run must state WHY the Page convention is kept`,
      );

      // Real run: types still flip; occupant untouched; Page convention KEPT with the reason.
      const receipt = await migrateBundle(bundle);
      assert.equal(receipt.types_flipped, 1, occupant.label);
      assert.equal(receipt.convention_swapped, "skipped_occupied", occupant.label);
      assert.deepEqual(receipt.page_conventions_deleted, [], occupant.label);
      assert.ok(
        receipt.warnings.some((w) => w.id === "conventions/view" && /left untouched/.test(w.warning)),
        occupant.label,
      );
      assert.ok(
        receipt.warnings.some((w) => w.id === "conventions/page" && /ungoverned/.test(w.warning)),
        `${occupant.label}: the receipt must state WHY the Page convention is kept`,
      );
      assert.equal((await readDoc(bundle, "pages-registry/dash")).frontmatter.type, "View", occupant.label);
      assert.equal((await readDoc(bundle, "conventions/page")).frontmatter.governs, "Page", occupant.label);
      const after = await readDocVersioned(bundle, "conventions/view");
      assert.equal(after.version, occupantBefore, `${occupant.label}: the occupant is never written`);
      assert.equal(after.doc.frontmatter.type, occupant.frontmatter.type, occupant.label);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
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
    assert.equal(parsed.bundles[0].types_flipped, 4);
    assert.equal(parsed.bundles[0].timestamp_added, 3);

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
