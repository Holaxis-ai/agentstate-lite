/**
 * `agentstate-lite` zero-arg home view — the content-first dashboard (AXI §8) + the offline
 * fallback (AXI §7/§10). Mirrors `kinds.test.ts`'s/`status.test.ts`'s in-process, dep-injected
 * pattern for the fast, mockable cases (A1.1-A1.5, A1.7-A1.9) and adds a real-filesystem pair
 * (A1.6) that exercises the DEFAULT `summarizeBundle` end to end, offline, directory-scoped.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { initBundle, writeDoc, type OkfDocument } from "@agentstate-lite/core";

// HERMETIC CWD (found live, 2026-07-06): `home()` peeks at the project binding by walking UP
// from the cwd, so a REAL `.agentstate.json` anywhere above the test process's cwd — including
// the repo's own untracked one — leaks into every in-process test in this file and changes the
// dashboard/remote-pointer output. node --test runs each file in its own process, so a
// module-top chdir into a binding-free temp dir makes the whole file hermetic; tests that
// chdir themselves capture and restore their OWN `origCwd`, which composes with this.
process.chdir(await mkdtemp(path.join(tmpdir(), "aslite-hermetic-home-")));

import {
  buildHomeView,
  home,
  summarizeDocs,
  type BundleSummary,
  type HomeRow,
  type UnreadableBundle,
} from "../src/commands/home.js";

const INVOKE = "npx -y agentstate-lite";
const BASE_DEPS = { binPath: () => "/bin/agentstate-lite", invocation: () => INVOKE };

function row(id: string, timestamp: string): HomeRow {
  return { id, type: "Note", title: id.split("/").pop() ?? id, timestamp };
}

/** A minimal `OkfDocument` for exercising the REAL `summarizeDocs` fold (empty timestamp = missing). */
function docOf(id: string, timestamp: string): OkfDocument {
  return { id, frontmatter: { type: "Note", title: id.split("/").pop() ?? id, timestamp }, body: "" };
}

function summaryWithDocs(rows: HomeRow[], total?: number): BundleSummary {
  const byType: Record<string, number> = {};
  for (const r of rows) byType[r.type] = (byType[r.type] ?? 0) + 1;
  return {
    root: "~/bundle",
    docs: total ?? rows.length,
    byType,
    recent: { shown: rows.length, total: total ?? rows.length, rows },
  };
}

const EMPTY_BUNDLE: BundleSummary = {
  root: "~/bundle",
  docs: 0,
  byType: {},
  recent: { shown: 0, total: 0, rows: [] },
};

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "agentstate-lite-home-test-"));
}

test("A1.1 dashboard: bundle present, docs>0 — bundle block content", () => {
  const rows = [row("notes/a", "2026-07-02T00:00:00.000Z")];
  const summary = summaryWithDocs(rows);
  const view = buildHomeView(BASE_DEPS, summary);
  const bundle = view.bundle as Record<string, unknown>;
  assert.equal(bundle.root, "~/bundle");
  assert.equal(bundle.docs, 1);
  assert.deepEqual(bundle.by_type, { Note: 1 });
  const recent = bundle.recent as BundleSummary["recent"];
  assert.equal(recent.shown, 1);
  assert.equal(recent.total, 1);
  assert.deepEqual(recent.rows[0], { id: "notes/a", type: "Note", title: "a", timestamp: "2026-07-02T00:00:00.000Z" });
  assert.deepEqual(bundle.next, [`${INVOKE} list`, `${INVOKE} status`, `${INVOKE} view`]);
  assert.equal(view.getting_started, undefined);
});

test("A1.2 ordering: identity -> bundle -> commands (live content before the manual)", () => {
  const summary = summaryWithDocs([row("notes/a", "2026-07-02T00:00:00.000Z")]);
  const view = buildHomeView(BASE_DEPS, summary);
  const keys = Object.keys(view);
  assert.equal(keys[0], "agentstate-lite");
  assert.equal(keys[1], "bundle");
  assert.ok(keys.indexOf("commands") > keys.indexOf("bundle"));
});

test("A1.3 no-bundle fallback: no bundle block, getting_started hint, commands present, resolves", async () => {
  const view = buildHomeView(BASE_DEPS, null);
  assert.equal(view.bundle, undefined);
  assert.equal(typeof view.getting_started, "string");
  assert.match(view.getting_started as string, new RegExp(`${INVOKE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} init`));
  assert.ok(view.commands);

  // home() itself must resolve (never reject) with a null summarizer.
  let out = "";
  await home([], {
    binPath: () => "/bin/agentstate-lite",
    invocation: () => INVOKE,
    stdout: (s) => (out += s),
    summarizeBundle: async () => null,
  });
  assert.ok(out.length > 0);
});

test("home --json is honored (renders valid JSON, not silently ignored TOON)", async () => {
  let toon = "";
  await home([], { binPath: () => "/bin/agentstate-lite", invocation: () => INVOKE, stdout: (s) => (toon += s), summarizeBundle: async () => null });

  let jsonOut = "";
  await home(["--json"], { binPath: () => "/bin/agentstate-lite", invocation: () => INVOKE, stdout: (s) => (jsonOut += s), summarizeBundle: async () => null });

  // --json actually changes the format (was previously declared-but-ignored) and parses as JSON.
  assert.notEqual(jsonOut, toon);
  const parsed = JSON.parse(jsonOut) as Record<string, unknown>;
  assert.ok(parsed["agentstate-lite"], "the identity header survives into the JSON view");
});

test("A1.4 empty bundle (present, 0 docs): distinct from no-bundle", () => {
  const view = buildHomeView(BASE_DEPS, EMPTY_BUNDLE);
  const bundle = view.bundle as Record<string, unknown>;
  assert.equal(bundle.docs, 0);
  assert.equal(bundle.recent, undefined);
  assert.equal(typeof bundle.help, "string");
  assert.match(bundle.help as string, /create the first doc/);
  assert.equal(view.getting_started, undefined);
});

test("A1.5 bundle-read-error -> offline fallback, home() still resolves (never rejects)", async () => {
  let out = "";
  let threw = false;
  try {
    await home([], {
      binPath: () => "/bin/agentstate-lite",
      invocation: () => INVOKE,
      stdout: (s) => (out += s),
      summarizeBundle: async () => {
        throw new Error("boom: permissions/malformed bundle");
      },
    });
  } catch {
    threw = true;
  }
  assert.equal(threw, false);
  assert.ok(out.includes("getting_started"));
});

test("A1.6 offline/directory-scoped: default deps, real bundle dir -> dashboard; non-bundle dir -> fallback", async () => {
  const bundleDir = await tempDir();
  const plainDir = await tempDir();
  try {
    const bundle = await initBundle(bundleDir);
    await writeDoc(bundle, {
      id: "notes/hello",
      frontmatter: { type: "Note", title: "Hello", timestamp: "2026-07-02T00:00:00.000Z" },
      body: "hi",
    });

    const origCwd = process.cwd();
    try {
      process.chdir(bundleDir);
      let out1 = "";
      await home([], { stdout: (s) => (out1 += s) });
      assert.ok(out1.includes("bundle"), "expected a dashboard inside a real bundle dir");
      assert.ok(out1.includes("notes/hello") || out1.includes("hello"));

      process.chdir(plainDir);
      let out2 = "";
      await home([], { stdout: (s) => (out2 += s) });
      assert.ok(out2.includes("getting_started"), "expected the offline fallback outside any bundle");
      assert.ok(!out2.includes("notes/hello"));
    } finally {
      process.chdir(origCwd);
    }
  } finally {
    await rm(bundleDir, { recursive: true, force: true });
    await rm(plainDir, { recursive: true, force: true });
  }
});

test("A1.7 recent ordering + cap (REAL summarizeDocs): timestamp desc, missing last, capped at 5, shown/total", () => {
  // Exercises the production sort directly (not an inline re-implementation) — a regression in the
  // real fold with many docs / missing timestamps is now caught here.
  const docs: OkfDocument[] = [
    docOf("notes/old", "2026-01-01T00:00:00.000Z"),
    docOf("notes/new", "2026-07-01T00:00:00.000Z"),
    docOf("notes/mid", "2026-04-01T00:00:00.000Z"),
    docOf("notes/no-ts-b", ""),
    docOf("notes/no-ts-a", ""),
    docOf("notes/newest", "2026-07-02T00:00:00.000Z"),
    docOf("notes/extra", "2026-02-01T00:00:00.000Z"),
  ];
  const summary = summarizeDocs(docs, "~/bundle");
  assert.equal(summary.docs, 7);
  assert.deepEqual(summary.byType, { Note: 7 });
  assert.equal(summary.recent.shown, 5);
  assert.equal(summary.recent.total, 7);
  assert.deepEqual(
    summary.recent.rows.map((r) => r.id),
    ["notes/newest", "notes/new", "notes/mid", "notes/extra", "notes/old"],
  );
  // …and buildHomeView renders that real summary faithfully.
  const recent = (buildHomeView(BASE_DEPS, summary).bundle as Record<string, unknown>)
    .recent as BundleSummary["recent"];
  assert.equal(recent.total, 7);
});

test("A1.7b byType ordering (REAL summarizeDocs): count desc, then type asc", () => {
  const docs: OkfDocument[] = [
    { id: "a", frontmatter: { type: "Concept" }, body: "" },
    { id: "b", frontmatter: { type: "Concept" }, body: "" },
    { id: "c", frontmatter: { type: "Note" }, body: "" },
    { id: "d", frontmatter: { type: "Design" }, body: "" },
  ];
  const summary = summarizeDocs(docs, "~/bundle");
  // Concept (2) first; Design and Note (1 each) follow in type-asc order.
  assert.deepEqual(Object.keys(summary.byType), ["Concept", "Design", "Note"]);
});

test("A1.8 home omits hosted credential identity while an explicit remote still orients bundle reads", () => {
  const local = buildHomeView(BASE_DEPS, null);
  assert.equal(local.auth, undefined);
  assert.equal(local.remotes, undefined);

  const scoped = buildHomeView(BASE_DEPS, null, "https://ex.workers.dev");
  assert.equal(scoped.auth, undefined);
  assert.deepEqual((scoped.remote as Record<string, unknown>).help, [
    `${INVOKE} list --remote https://ex.workers.dev`,
    `${INVOKE} status --remote https://ex.workers.dev`,
  ]);
});

test("A1.10 unreadable bundle (present but a doc failed to read): status:unreadable, NOT the init hint", () => {
  const unreadable: UnreadableBundle = { root: "~/bundle", unreadable: true };
  const view = buildHomeView(BASE_DEPS, unreadable);
  const bundle = view.bundle as Record<string, unknown>;
  assert.equal(bundle.root, "~/bundle");
  assert.equal(bundle.status, "unreadable");
  assert.match(bundle.help as string, /could not be read/);
  assert.equal(bundle.recent, undefined);
  // The whole point: a present-but-unreadable bundle must NOT be misreported as "no bundle — run init".
  assert.equal(view.getting_started, undefined);
});

test("A1.11 default summarizer distinguishes unreadable from no-bundle: a malformed doc -> unreadable, home() exit 0", async () => {
  const bundleDir = await tempDir();
  try {
    await initBundle(bundleDir);
    // Write a raw concept file with UNPARSEABLE YAML frontmatter (unclosed flow sequence), bypassing
    // writeDoc's validation, so the bundle walk's frontmatter parse throws on it.
    await mkdir(path.join(bundleDir, "notes"), { recursive: true });
    await writeFile(path.join(bundleDir, "notes", "bad.md"), "---\ntype: [unclosed\n---\nbody\n");

    const origCwd = process.cwd();
    try {
      process.chdir(bundleDir);
      let out = "";
      let threw = false;
      try {
        await home([], { stdout: (s) => (out += s) });
      } catch {
        threw = true;
      }
      assert.equal(threw, false, "home() must never throw, even on an unreadable bundle");
      assert.ok(out.includes("unreadable"), "a present-but-unreadable bundle must report unreadable");
      assert.ok(!out.includes("getting_started"), "must NOT tell the agent to init over an existing bundle");
    } finally {
      process.chdir(origCwd);
    }
  } finally {
    await rm(bundleDir, { recursive: true, force: true });
  }
});

test("A1.12 project binding (directory-type, item 43 follow-on): home's dashboard resolves via the committed .agentstate.json and annotates the bundle block with `via`", async () => {
  const root = await tempDir();
  try {
    const sharedBundle = path.join(root, "shared");
    await initBundle(sharedBundle);
    await writeDoc(
      { root: sharedBundle },
      { id: "notes/hello", frontmatter: { type: "Note", title: "Hello", timestamp: "2026-07-02T00:00:00.000Z" }, body: "hi" },
    );
    const projectDir = path.join(root, "project"); // no bundle of its own here — only a binding
    await mkdir(projectDir, { recursive: true });
    await writeFile(path.join(projectDir, ".agentstate.json"), JSON.stringify({ bundle: "../shared" }));

    const origCwd = process.cwd();
    try {
      process.chdir(projectDir);
      let out = "";
      await home([], { stdout: (s) => (out += s) });
      assert.ok(out.includes("notes/hello"), "the dashboard should reflect the BOUND directory, not the (bundle-less) project dir");
      assert.ok(out.includes(".agentstate.json"), "the bundle block should note which file drove resolution");
    } finally {
      process.chdir(origCwd);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("A1.13 project binding (URL-type, item 43 follow-on): home shows the offline remote pointer annotated with a `via` note, never fetching (OFFLINE GUARANTEE preserved)", async () => {
  const projectDir = await tempDir();
  try {
    // Nothing listens on this port — if home ever actually fetched, this test would hang/error
    // instead of resolving promptly with a clean offline pointer.
    await writeFile(path.join(projectDir, ".agentstate.json"), JSON.stringify({ bundle: "http://127.0.0.1:1" }));

    const origCwd = process.cwd();
    try {
      process.chdir(projectDir);
      let out = "";
      await home([], { stdout: (s) => (out += s) });
      assert.ok(out.includes("http://127.0.0.1:1"));
      assert.ok(out.includes(".agentstate.json"));
      assert.ok(!out.includes("getting_started"));
    } finally {
      process.chdir(origCwd);
    }
  } finally {
    await rm(projectDir, { recursive: true, force: true });
  }
});

test("A1.14 malformed project binding: home NEVER throws (SessionStart hook safety) — surfaces project_binding_error and still falls back to getting_started", async () => {
  const projectDir = await tempDir();
  try {
    await writeFile(path.join(projectDir, ".agentstate.json"), "not json at all");

    const origCwd = process.cwd();
    try {
      process.chdir(projectDir);
      let out = "";
      let threw = false;
      try {
        await home([], { stdout: (s) => (out += s) });
      } catch {
        threw = true;
      }
      assert.equal(threw, false, "a malformed .agentstate.json must never crash the SessionStart hook");
      assert.ok(out.includes("project_binding_error"));
      assert.ok(out.includes("getting_started"));
    } finally {
      process.chdir(origCwd);
    }
  } finally {
    await rm(projectDir, { recursive: true, force: true });
  }
});
