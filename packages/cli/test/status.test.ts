/**
 * `agentstate-lite status` — the read-only whole-bundle health report.
 *
 * Runs the command function in-process (no subprocess) against a real temp filesystem bundle,
 * mirroring `kinds.test.ts`'s / `link.test.ts`'s pattern. The `--remote` parity test additionally
 * boots a real `@agentstate-lite/server` `serve()` instance, mirroring `kinds.test.ts`'s own
 * `--remote` test.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { initBundle, writeDoc, type Bundle } from "@agentstate-lite/core";
import { serve, type ServerHandle } from "@agentstate-lite/server";

import { status } from "../src/commands/status.js";
import { CliError } from "../src/errors.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../../..");
const SAMPLE_BUNDLE = path.join(REPO_ROOT, "examples/sample-bundle");

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "agentstate-lite-status-test-"));
}

/** Run `status`, capturing its `--json` stdout and parsing the envelope. */
async function runJson(argv: string[]): Promise<Record<string, unknown>> {
  let out = "";
  await status([...argv, "--json"], { stdout: (s) => (out += s) });
  return JSON.parse(out) as Record<string, unknown>;
}

/**
 * A fixture bundle exercising every finding class the plan calls for:
 *   - `conventions/widget`   — declares the `Widget` kind (required title+status, an enum-restricted
 *                              `status`, a 1h freshness horizon).
 *   - `conventions/broken`   — a malformed convention (no `governs`) -> a registry warning.
 *   - `widgets/missing-title`— governed, missing the required `title` -> a kind-lint warning.
 *   - `widgets/bad-enum`     — governed, `status` outside the declared enum -> a kind-lint warning.
 *   - `widgets/linker`       — links to a target that doesn't exist -> an unresolved link.
 *   - `widgets/anchor`       — links to `widgets/missing-title`, so THAT doc is not an orphan; but
 *                              nothing links to `anchor` itself, so `anchor` IS an orphan.
 *   - `widgets/orphan`       — no inbound or outbound links at all -> an orphan.
 *   - `widgets/stale-one`    — governed, timestamp 2h old against the kind's 1h horizon -> stale.
 *   - `widgets/no-ts`        — governed, written directly to disk with NO `timestamp` field at all
 *                              (the engine's `writeDoc` always stamps one, so this bypasses it on
 *                              purpose) -> counted `no_timestamp`.
 *   - `widgets/self-linker`  — links ONLY to itself. A self-link must not rescue a doc from orphan
 *                              status (status.ts explicitly excludes `l.to === doc.id` from the
 *                              inbound set), so this doc IS an orphan despite having an outbound link.
 * 10 docs total; every doc except `missing-title` has zero inbound links from an OTHER concept doc
 * (9 orphans).
 */
async function makeFixtureBundle(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await tempDir();
  const bundle = await initBundle(dir);
  const now = new Date().toISOString();

  await writeDoc(bundle, {
    id: "conventions/widget",
    frontmatter: {
      type: "Convention",
      title: "Widget",
      governs: "Widget",
      fields: { required: ["title", "status"], optional: [], values: { status: ["active", "done"] } },
      freshness_horizon: "1h",
      timestamp: now,
    },
    body: "The Widget kind.",
  });
  await writeDoc(bundle, {
    id: "conventions/broken",
    frontmatter: { type: "Convention", title: "Broken", timestamp: now },
    body: "Missing 'governs' — malformed.",
  });
  await writeDoc(bundle, {
    id: "widgets/missing-title",
    frontmatter: { type: "Widget", status: "active", timestamp: now },
    body: "No title.",
  });
  await writeDoc(bundle, {
    id: "widgets/bad-enum",
    frontmatter: { type: "Widget", title: "Bad", status: "cancelled", timestamp: now },
    body: "Status outside the declared enum.",
  });
  await writeDoc(bundle, {
    id: "widgets/linker",
    frontmatter: { type: "Widget", title: "Linker", status: "active", timestamp: now },
    body: "See [ghost](../ghosts/nope.md) for details.",
  });
  await writeDoc(bundle, {
    id: "widgets/anchor",
    frontmatter: { type: "Widget", title: "Anchor", status: "active", timestamp: now },
    body: "Points at [missing-title](missing-title.md).",
  });
  await writeDoc(bundle, {
    id: "widgets/orphan",
    frontmatter: { type: "Widget", title: "Orphan", status: "active", timestamp: now },
    body: "Nobody links here, and this links nowhere.",
  });
  const oldTs = new Date(Date.now() - 2 * 3_600_000).toISOString(); // 2h old > 1h horizon
  await writeDoc(bundle, {
    id: "widgets/stale-one",
    frontmatter: { type: "Widget", title: "Stale", status: "active", timestamp: oldTs },
    body: "Old by the declared horizon.",
  });
  // Bypasses writeDoc (which always stamps a timestamp) to produce a governed doc with NO
  // timestamp field at all — the shape a hand-edited external file could take.
  await mkdir(path.join(dir, "widgets"), { recursive: true });
  await writeFile(
    path.join(dir, "widgets", "no-ts.md"),
    "---\ntype: Widget\ntitle: NoTS\nstatus: active\n---\nNo timestamp at all.\n",
  );
  await writeDoc(bundle, {
    id: "widgets/self-linker",
    frontmatter: { type: "Widget", title: "SelfLinker", status: "active", timestamp: now },
    body: "Links to [itself](self-linker.md) — must not rescue itself from orphan status.",
  });

  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

test("status: examples/sample-bundle characterization — a fully clean bundle (pinned values, exit 0, no finding blocks)", async () => {
  const result = await runJson(["--dir", SAMPLE_BUNDLE]);
  assert.equal(result.docs, 4);
  assert.equal(result.kinds, 0);
  assert.equal(result.kind_warnings, 0);
  assert.equal(result.unresolved_links, 0);
  assert.equal(result.orphans, 0);
  assert.equal(result.stale, 0);
  assert.equal(result.no_timestamp, 0);
  assert.equal(result.registry_warnings, 0);
  assert.equal(result.link_type_violations, 0);
  assert.equal(result.missing_expected_links, 0);
  // A clean report omits every row-list block rather than emitting ten empty categories.
  for (const key of [
    "kind_lint",
    "unresolved",
    "orphan_docs",
    "stale_docs",
    "no_timestamp_docs",
    "registry_lint",
    "link_type_violations_rows",
    "missing_expected_links_rows",
  ]) {
    assert.equal(key in result, false, `expected no '${key}' key on a clean report`);
  }
});

test("status: a conventions-free freshly-initialized bundle is equally clean", async () => {
  const dir = await tempDir();
  try {
    await initBundle(dir);
    const result = await runJson(["--dir", dir]);
    assert.equal(result.docs, 0);
    assert.equal(result.kinds, 0);
    assert.equal(result.kind_warnings, 0);
    assert.equal(result.unresolved_links, 0);
    assert.equal(result.orphans, 0);
    assert.equal(result.stale, 0);
    assert.equal(result.no_timestamp, 0);
    assert.equal(result.registry_warnings, 0);
    assert.equal(result.link_type_violations, 0);
    assert.equal(result.missing_expected_links, 0);
    assert.equal("link_type_violations_rows" in result, false);
    assert.equal("missing_expected_links_rows" in result, false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("status: fixture bundle exercises every finding class with the correct counts + rows", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    const result = await runJson(["--dir", dir]);

    assert.equal(result.docs, 10);
    assert.equal(result.kinds, 1);

    // The Widget kind declares no 'links'/'expects_inbound' — the graph lints stay at zero, no
    // row-list blocks, over a fixture built entirely for the OTHER finding classes.
    assert.equal(result.link_type_violations, 0);
    assert.equal(result.missing_expected_links, 0);
    assert.equal("link_type_violations_rows" in result, false);
    assert.equal("missing_expected_links_rows" in result, false);

    // Kind lint: exactly the missing-title + bad-enum warnings, minimal {id,field,code} rows.
    assert.equal(result.kind_warnings, 2);
    const lint = result.kind_lint as { shown: number; total: number; rows: Record<string, unknown>[] };
    assert.equal(lint.shown, 2);
    assert.equal(lint.total, 2);
    assert.ok(
      lint.rows.some((r) => r.id === "widgets/missing-title" && r.field === "title" && r.code === "KIND_FIELD_MISSING"),
    );
    assert.ok(
      lint.rows.some((r) => r.id === "widgets/bad-enum" && r.field === "status" && r.code === "KIND_FIELD_VALUE"),
    );

    // Unresolved links: exactly the linker's dangling target — "unresolved", not "broken".
    assert.equal(result.unresolved_links, 1);
    const unresolved = result.unresolved as { shown: number; total: number; rows: Record<string, unknown>[] };
    assert.deepEqual(unresolved.rows, [{ from: "widgets/linker", href: "../ghosts/nope.md" }]);

    // Orphans: everything except missing-title (which anchor links to). Self-links never rescue.
    assert.equal(result.orphans, 9);
    const orphans = result.orphan_docs as { shown: number; total: number; rows: Record<string, unknown>[] };
    const orphanIds = orphans.rows.map((r) => r.id);
    assert.ok(orphanIds.includes("widgets/orphan"));
    assert.ok(orphanIds.includes("widgets/anchor")); // links OUT, but nothing links IN
    assert.ok(!orphanIds.includes("widgets/missing-title")); // rescued by anchor's inbound link
    assert.ok(orphanIds.includes("widgets/self-linker")); // links only to ITSELF — does not self-rescue
    // Every orphan row carries {id, type} — the type column is what lets a reader self-identify a
    // Convention doc (schema, not content) among the orphans (F4) without a second lookup.
    for (const row of orphans.rows) {
      assert.equal(typeof row.id, "string");
      assert.equal(typeof row.type, "string");
    }
    assert.ok(
      orphans.rows.some((r) => r.id === "conventions/widget" && r.type === "Convention"),
      "an expected, permanent Convention orphan self-identifies via its type column",
    );
    assert.ok(
      orphans.rows.some((r) => r.id === "conventions/broken" && r.type === "Convention"),
    );
    assert.ok(orphans.rows.some((r) => r.id === "widgets/orphan" && r.type === "Widget"));

    // Freshness sweep: stale-one exceeds the 1h horizon; no-ts has no timestamp at all.
    assert.equal(result.stale, 1);
    const stale = result.stale_docs as { shown: number; total: number; rows: Record<string, unknown>[] };
    assert.equal(stale.rows.length, 1);
    assert.equal(stale.rows[0]!.id, "widgets/stale-one");
    assert.equal(stale.rows[0]!.horizon_ms, 3_600_000);
    assert.ok((stale.rows[0]!.age_ms as number) > 3_600_000);

    // no_timestamp now carries its own rows[] block (F5) — {id, type}, capped like every other
    // category, instead of forcing a cross-reference against kind_lint to identify the doc.
    assert.equal(result.no_timestamp, 1);
    const noTimestamp = result.no_timestamp_docs as {
      shown: number;
      total: number;
      rows: Record<string, unknown>[];
    };
    assert.deepEqual(noTimestamp.rows, [{ id: "widgets/no-ts", type: "Widget" }]);

    // Registry warnings: the malformed convention doc, surfaced verbatim from loadKinds.
    assert.equal(result.registry_warnings, 1);
    const registryLint = result.registry_lint as { shown: number; total: number; rows: Record<string, unknown>[] };
    assert.equal(registryLint.rows[0]!.code, "KIND_CONVENTION_MALFORMED");
  } finally {
    await cleanup();
  }
});

test("status: a link to a reserved file (index.md/log.md) is never counted as unresolved (core resolveConceptId drops it before this scan sees it)", async () => {
  const dir = await tempDir();
  try {
    const bundle = await initBundle(dir);
    await writeDoc(bundle, {
      id: "widgets/reserved-linker",
      frontmatter: { type: "Widget", title: "ReservedLinker" },
      body:
        "See the [changelog](../log.md) and [home](../index.md) for context, " +
        "plus a genuinely [broken](./ghost.md) link.",
    });
    const result = await runJson(["--dir", dir]);
    assert.equal(result.docs, 1);
    // Only the genuinely-broken link counts; the two reserved-file targets are structurally never
    // concept edges (dropped upstream by resolveConceptId), not silently absorbed as "unresolved".
    assert.equal(result.unresolved_links, 1);
    const unresolved = result.unresolved as { shown: number; total: number; rows: Record<string, unknown>[] };
    assert.deepEqual(unresolved.rows, [{ from: "widgets/reserved-linker", href: "./ghost.md" }]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

/**
 * A GENERIC graph-lints fixture (not Task/Roadmap Item), pinning that nothing is hardcoded:
 *   - `conventions/box`   — declares 'Box', a link SOURCE: `links: {contains: Crate}`.
 *   - `conventions/crate` — declares 'Crate', a link TARGET: `expects_inbound: {contains: Box}`,
 *                            plus a `status` field (queued/active/done) for the triage signal.
 *   - `items/good-box` -> `items/good-crate` (text 'contains'): a CONFORMING edge (Box -> Crate) —
 *     satisfies good-crate's expects_inbound, never a violation.
 *   - `items/box-to-widget` -> `items/rogue` (text 'contains'): wrong TARGET (Box -> Widget, not
 *     Crate) — a link_type_violations row.
 *   - `items/rogue` -> `items/good-crate` (text 'contains'): wrong SOURCE (Widget -> Crate, not
 *     Box -> Crate) — a SECOND link_type_violations row. (`items/rogue` is type 'Widget', an
 *     undeclared kind, so it never itself appears in any kind-governed finding.)
 *   - `items/missing-crate` (status: queued) and `items/done-crate` (status: done) — Crate
 *     instances with NO inbound 'contains' edge from a Box at all -> two missing_expected_links
 *     rows, used to pin the status-in-row + non-done-first sort.
 */
async function makeGraphLintFixtureBundle(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await tempDir();
  const bundle = await initBundle(dir);
  const now = new Date().toISOString();

  await writeDoc(bundle, {
    id: "conventions/box",
    frontmatter: {
      type: "Convention",
      governs: "Box",
      fields: { required: ["title"], optional: [] },
      links: { contains: "Crate" },
      timestamp: now,
    },
    body: "Box declares its typed-edge vocabulary.",
  });
  await writeDoc(bundle, {
    id: "conventions/crate",
    frontmatter: {
      type: "Convention",
      governs: "Crate",
      fields: { required: ["title", "status"], optional: [], values: { status: ["queued", "active", "done"] } },
      expects_inbound: { contains: "Box" },
      timestamp: now,
    },
    body: "Crate declares its inbound-link expectation.",
  });
  await writeDoc(bundle, {
    id: "items/good-box",
    frontmatter: { type: "Box", title: "Good Box", timestamp: now },
    body: "Contains a [contains](good-crate.md).",
  });
  await writeDoc(bundle, {
    id: "items/box-to-widget",
    frontmatter: { type: "Box", title: "Box To Widget", timestamp: now },
    body: "Contains a [contains](rogue.md).",
  });
  await writeDoc(bundle, {
    id: "items/rogue",
    frontmatter: { type: "Widget", title: "Rogue", timestamp: now },
    body: "Contains a [contains](good-crate.md).",
  });
  await writeDoc(bundle, {
    id: "items/good-crate",
    frontmatter: { type: "Crate", title: "Good Crate", status: "active", timestamp: now },
    body: "",
  });
  await writeDoc(bundle, {
    id: "items/missing-crate",
    frontmatter: { type: "Crate", title: "Missing Crate", status: "queued", timestamp: now },
    body: "",
  });
  await writeDoc(bundle, {
    id: "items/done-crate",
    frontmatter: { type: "Crate", title: "Done Crate", status: "done", timestamp: now },
    body: "",
  });

  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

test("status: link_type_violations — every edge violating a declared 'links' vocabulary, bundle-wide (same rule as 'link add's write-time lint)", async () => {
  const { dir, cleanup } = await makeGraphLintFixtureBundle();
  try {
    const result = await runJson(["--dir", dir]);
    assert.equal(result.link_type_violations, 2);
    const violations = result.link_type_violations_rows as {
      shown: number;
      total: number;
      rows: Record<string, unknown>[];
    };
    assert.equal(violations.total, 2);
    assert.ok(
      violations.rows.some(
        (r) => r.from === "items/box-to-widget" && r.to === "items/rogue" && r.text === "contains" && r.expected === "Box -> Crate",
      ),
      "expected the wrong-TARGET violation row",
    );
    assert.ok(
      violations.rows.some(
        (r) => r.from === "items/rogue" && r.to === "items/good-crate" && r.text === "contains" && r.expected === "Box -> Crate",
      ),
      "expected the wrong-SOURCE violation row",
    );
    // The CONFORMING edge (good-box -> good-crate) must never appear as a violation.
    assert.ok(!violations.rows.some((r) => r.from === "items/good-box"));
  } finally {
    await cleanup();
  }
});

test("status: missing_expected_links — Crate instances lacking a conforming inbound 'contains' edge from a Box; status-in-row + non-done-first sort", async () => {
  const { dir, cleanup } = await makeGraphLintFixtureBundle();
  try {
    const result = await runJson(["--dir", dir]);
    assert.equal(result.missing_expected_links, 2);
    const missing = result.missing_expected_links_rows as {
      shown: number;
      total: number;
      rows: Record<string, unknown>[];
    };
    assert.equal(missing.total, 2);
    // Non-done first (missing-crate, status: queued), then done (done-crate) — never plain id order.
    assert.deepEqual(missing.rows.map((r) => r.id), ["items/missing-crate", "items/done-crate"]);
    assert.equal(missing.rows[0]!.status, "queued");
    assert.deepEqual(missing.rows[0]!.missing, ["contains"]);
    assert.equal(missing.rows[1]!.status, "done");
    assert.deepEqual(missing.rows[1]!.missing, ["contains"]);
    // good-crate received a CONFORMING inbound edge (from good-box, a real Box) — it must NOT appear,
    // even though it also received a non-conforming inbound edge (from rogue, a Widget).
    assert.ok(!missing.rows.some((r) => r.id === "items/good-crate"));
  } finally {
    await cleanup();
  }
});

test("status: missing_expected_links omits the 'status' key when the declaring kind has no status field", async () => {
  const dir = await tempDir();
  try {
    const bundle = await initBundle(dir);
    const now = new Date().toISOString();
    await writeDoc(bundle, {
      id: "conventions/tag",
      frontmatter: { type: "Convention", governs: "Tag", fields: { required: ["title"], optional: [] }, timestamp: now },
      body: "Tag kind — a link SOURCE only.",
    });
    await writeDoc(bundle, {
      id: "conventions/note",
      frontmatter: {
        type: "Convention",
        governs: "Note",
        fields: { required: ["title"], optional: [] }, // no 'status' field declared
        expects_inbound: { "tagged by": "Tag" },
        timestamp: now,
      },
      body: "Note kind — expects an inbound 'tagged by' edge from a Tag; declares no status field.",
    });
    await writeDoc(bundle, {
      id: "items/lonely-note",
      frontmatter: { type: "Note", title: "Lonely", timestamp: now },
      body: "",
    });

    const result = await runJson(["--dir", dir]);
    assert.equal(result.missing_expected_links, 1);
    const missing = result.missing_expected_links_rows as { rows: Record<string, unknown>[] };
    assert.equal(missing.rows.length, 1);
    assert.equal(missing.rows[0]!.id, "items/lonely-note");
    assert.equal("status" in missing.rows[0]!, false, "a kind with no declared status field must not get a status key");
    assert.deepEqual(missing.rows[0]!.missing, ["tagged by"]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("status: --limit caps each category's row list with an explicit shown/total; --limit 0 is unlimited", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    const capped = await runJson(["--dir", dir, "--limit", "1"]);
    const lint = capped.kind_lint as { shown: number; total: number; rows: unknown[] };
    assert.equal(lint.shown, 1);
    assert.equal(lint.total, 2);
    assert.equal(lint.rows.length, 1);

    const unlimited = await runJson(["--dir", dir, "--limit", "0"]);
    const lintUnlimited = unlimited.kind_lint as { shown: number; total: number; rows: unknown[] };
    assert.equal(lintUnlimited.shown, 2);
    assert.equal(lintUnlimited.total, 2);
  } finally {
    await cleanup();
  }
});

test("status: a malformed --limit is a USAGE error (exit 2)", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    await assert.rejects(
      () => status(["--dir", dir, "--limit", "not-a-number", "--json"]),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "USAGE");
        assert.equal(err.exitCode, 2);
        return true;
      },
    );
  } finally {
    await cleanup();
  }
});

test("status: exit is ALWAYS 0 when the analysis runs, findings or not; no bundle is NOT_FOUND (exit 6)", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    // A bundle FULL of findings still resolves without throwing (exit 0) — findings are reports.
    await status(["--dir", dir], { stdout: () => {} });
  } finally {
    await cleanup();
  }

  const emptyDir = await tempDir();
  try {
    await assert.rejects(
      () => status(["--dir", emptyDir]),
      (err: unknown) => {
        assert.ok(err instanceof CliError);
        assert.equal(err.code, "NOT_FOUND");
        assert.equal(err.exitCode, 6);
        return true;
      },
    );
  } finally {
    await rm(emptyDir, { recursive: true, force: true });
  }
});

test("status: TOON (agent-facing default, no --json) renders the summary keys", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    let out = "";
    await status(["--dir", dir], { stdout: (s) => (out += s) });
    for (const key of [
      "docs:",
      "kinds:",
      "kind_warnings:",
      "unresolved_links:",
      "orphans:",
      "stale:",
      "no_timestamp:",
      "registry_warnings:",
      "link_type_violations:",
      "missing_expected_links:",
    ]) {
      assert.ok(out.includes(key), `expected TOON output to contain '${key}', got:\n${out}`);
    }
  } finally {
    await cleanup();
  }
});

test("--remote: status against a served bundle is identical to the same bundle read locally", async () => {
  const { dir, cleanup } = await makeFixtureBundle();
  try {
    const local = await runJson(["--dir", dir]);
    const handle: ServerHandle = await serve({ bundle: { root: dir } as Bundle, port: 0 });
    try {
      const url = `http://${handle.host}:${handle.port}`;
      const remote = await runJson(["--remote", url]);
      // Every field is deterministic EXCEPT `stale_docs[].age_ms`, which is `now - timestamp`
      // recomputed at each invocation's own instant — the two calls run moments apart, so the
      // raw ms values legitimately differ. Compare those separately (both exceed the horizon,
      // and are within a generous jitter window of each other) and deep-equal everything else.
      const localStale = (local.stale_docs as { rows: Record<string, unknown>[] } | undefined)?.rows ?? [];
      const remoteStale = (remote.stale_docs as { rows: Record<string, unknown>[] } | undefined)?.rows ?? [];
      assert.equal(remoteStale.length, localStale.length);
      for (let i = 0; i < localStale.length; i++) {
        assert.equal(remoteStale[i]!.id, localStale[i]!.id);
        assert.equal(remoteStale[i]!.horizon_ms, localStale[i]!.horizon_ms);
        assert.ok((localStale[i]!.age_ms as number) > (localStale[i]!.horizon_ms as number));
        assert.ok((remoteStale[i]!.age_ms as number) > (remoteStale[i]!.horizon_ms as number));
        assert.ok(
          Math.abs((remoteStale[i]!.age_ms as number) - (localStale[i]!.age_ms as number)) < 5_000,
          "age_ms should be within a few seconds across the two invocations",
        );
      }
      const stripAge = (v: Record<string, unknown>): Record<string, unknown> => {
        const clone = structuredClone(v);
        if (clone.stale_docs) {
          (clone.stale_docs as { rows: Record<string, unknown>[] }).rows = (
            clone.stale_docs as { rows: Record<string, unknown>[] }
          ).rows.map(({ age_ms, ...rest }) => rest);
        }
        return clone;
      };
      assert.deepEqual(stripAge(remote), stripAge(local));
    } finally {
      await handle.close();
    }
  } finally {
    await cleanup();
  }
});

test("status reports a corrupt doc as the `malformed` finding instead of crashing", async () => {
  const dir = await tempDir();
  try {
    const bundle = await initBundle(dir);
    await writeDoc(bundle, {
      id: "notes/good",
      frontmatter: { type: "Concept", title: "Good", timestamp: "2026-07-01T00:00:00.000Z" },
      body: "",
    });
    // A doc with an unterminated YAML flow sequence — js-yaml cannot parse it.
    await mkdir(path.join(dir, "notes"), { recursive: true });
    await writeFile(path.join(dir, "notes", "bad.md"), "---\ntype: [unclosed\ntitle: bad\n---\nbody\n");

    const out = await runJson(["--dir", dir]);
    // The report runs (exit 0, no crash) and headlines the corrupt doc.
    assert.equal(out.malformed, 1);
    const block = out.malformed_docs as { total: number; rows: Array<{ id: string; reason: string }> };
    assert.equal(block.total, 1);
    assert.equal(block.rows[0]?.id, "notes/bad");
    assert.ok((block.rows[0]?.reason ?? "").length > 0);
    // The healthy doc is still counted in the scan.
    assert.equal(out.docs, 1);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
