// Tests for `session-start` (sync-verb plan §U4) — the ONE SessionStart hook command: a
// time-boxed best-effort board pull, then the home render IN-PROCESS.
//
// Two layers, mirroring the codebase's convention:
//   1. Pure-function unit tests for the moment-(e) string builders (research/sync-verb-ux-review
//      (e); machine-honest per the cursor-honesty adjudication) and `buildBoardBlock`'s folding —
//      the exact strings are PINNED here.
//   2. Integration tests over `git-harness.ts` topologies, driving `sessionStart()` /
//      `sessionStartPull()` / `home()` with real git, real `~/.agentstate/sync` state (HOME
//      swapped to a temp dir), and — for the time-box test — a REAL hanging remote (a `hang://`
//      remote helper that sleeps; spawnSync's timeout kill is the enforcement under test,
//      empirically verified to unblock even while the helper grandchild still holds the pipes).
//
// The home offline-guarantee suite (home.test.ts) is deliberately UNTOUCHED — this file only adds
// coverage for the new board surface.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, realpath, rm, writeFile } from "node:fs/promises";
import { chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  BOARD_OFFLINE_NOTE,
  BOARD_UP_TO_DATE,
  actorPhrase,
  boardFirstContactLine,
  buildBoardBlock,
  docLine,
  defaultLoadBoardStatus,
  home,
  hookUpdateNote,
  sinceLine,
  uncommittedLine,
  unpushedLine,
  type BoardStatus,
} from "../src/commands/home.js";
import {
  SESSION_START_PULL_BUDGET_MS,
  sessionStart,
  sessionStartPull,
} from "../src/commands/session-start.js";
import { sync } from "../src/commands/sync.js";
import { resolveBundleKey } from "@agentstate-lite/board-git";
import {
  HOOK_TIMEOUT_SECONDS,
  buildOpenCodePluginSource,
  hook,
  hookNeedsUpdate,
  sessionStartHookCommand,
} from "../src/commands/hook.js";
import { readCursor, readMarker, readSelfActors, type AwarenessCache } from "../src/cursor.js";
import { initBundle, writeDoc } from "@agentstate-lite/core";
import { addCatalogEntry } from "../src/catalog.js";
import {
  commitBoard,
  git,
  makeTwoCloneTopology,
  modifyBoardDoc,
  pushBoard,
  writeBoardDoc,
  type BoardRepo,
} from "../../board-git/test/git-harness.js";

// ── scaffolding (mirrors sync.test.ts) ───────────────────────────────────────

async function withHome<T>(home: string, run: () => Promise<T>): Promise<T> {
  const prevHome = process.env.HOME;
  const prevProfile = process.env.USERPROFILE;
  process.env.HOME = home;
  process.env.USERPROFILE = home;
  try {
    return await run();
  } finally {
    process.env.HOME = prevHome;
    process.env.USERPROFILE = prevProfile;
  }
}

async function tempHome(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "aslite-session-start-home-"));
}

function capture(): { out: () => string; stdout: (s: string) => void } {
  let buf = "";
  return { out: () => buf, stdout: (s: string) => void (buf += s) };
}

/** Run `sessionStart` in-process under a swapped HOME, capturing the render. */
async function runSessionStart(
  home: string,
  argv: string[],
  deps: Parameters<typeof sessionStart>[1] = {},
): Promise<string> {
  const cap = capture();
  await withHome(home, () => sessionStart(argv, { stdout: cap.stdout, ...deps }));
  return cap.out();
}

/** Run plain `home` in-process under a swapped HOME, capturing the render. */
async function runHome(homeDir: string, argv: string[]): Promise<string> {
  const cap = capture();
  // Neutralize the hook-freshness probe: it reads the REAL user home/cwd scopes by design, and
  // these tests assert board strings, not hook state.
  await withHome(homeDir, () => home(argv, { stdout: cap.stdout, hookNeedsUpdate: () => false }));
  return cap.out();
}

async function runSync(home: string, argv: string[]): Promise<string> {
  const cap = capture();
  await withHome(home, () => sync(argv, { stdout: cap.stdout }));
  return cap.out();
}

function row(actor: string, verb = "updated", kind = "Task", title = "Seed one") {
  return { docId: "tasks/seed-one", verb, kind, title, actor };
}

function cacheOf(delta: ReturnType<typeof row>[], counts?: Partial<AwarenessCache>): AwarenessCache {
  return {
    updatedAt: "2026-07-08T00:00:00.000Z",
    delta,
    unpushedCount: 0,
    uncommittedCount: 0,
    ...counts,
  };
}

function provisionedStatus(
  cache: AwarenessCache | null,
  extra?: Partial<Extract<BoardStatus, { state: "provisioned" }>>,
): BoardStatus {
  return { state: "provisioned", cache, selfActors: [], unpushed: null, uncommitted: null, ...extra };
}

const INV = "aslite";

// ── 1. pinned moment-(e) strings (pure) ───────────────────────────────────────

test("budget constants: pull budget ≤ 7s, under the 10s hook timeout (plan §U4)", () => {
  assert.ok(SESSION_START_PULL_BUDGET_MS <= 7_000);
  assert.ok(SESSION_START_PULL_BUDGET_MS < HOOK_TIMEOUT_SECONDS * 1000);
});

test("moment (e) strings: since-line, per-doc human line, backstop lines — exact pins", () => {
  assert.equal(sinceLine([row("mike"), row("mike"), row("mike")]), "3 board changes from mike");
  assert.equal(sinceLine([row("mike")]), "1 board change from mike");
  assert.equal(docLine(row("mike", "updated", "Task", "Seed one")), 'mike · updated Task "Seed one"');
  assert.equal(docLine(row("sara", "added", "Note", "Welcome")), 'sara · added Note "Welcome"');
  assert.equal(docLine(row("jo", "deleted", "unknown", "old-doc")), 'jo · deleted "old-doc"');
  assert.equal(unpushedLine(2), "2 local board commits not yet pushed — run sync when online");
  assert.equal(unpushedLine(1), "1 local board commit not yet pushed — run sync when online");
  assert.equal(uncommittedLine(3), "3 uncommitted board changes — run sync to share them");
  assert.equal(uncommittedLine(1), "1 uncommitted board change — run sync to share it");
  assert.equal(BOARD_OFFLINE_NOTE, "board sync offline — showing last known state");
});

test("actor phrase is built from the ACTUAL actors — never assumes one teammate", () => {
  assert.equal(actorPhrase([row("mike")]), "mike");
  assert.equal(actorPhrase([row("mike"), row("sara")]), "mike and sara");
  assert.equal(actorPhrase([row("mike"), row("sara"), row("jo"), row("mike")]), "mike, sara and jo");
  assert.equal(
    sinceLine([row("mike"), row("sara")]),
    "2 board changes from mike and sara",
  );
});

test("buildBoardBlock: clean provisioned board → the pinned 'up to date' string", () => {
  const { block, firstContact } = buildBoardBlock(provisionedStatus(cacheOf([])), undefined, INV);
  assert.equal(block, BOARD_UP_TO_DATE);
  assert.equal(firstContact, undefined);
});

test("buildBoardBlock: offline pull → pinned note + last-known delta labeled as_of", () => {
  const status = provisionedStatus(cacheOf([row("mike")]));
  const { block } = buildBoardBlock(status, { offline: true }, INV);
  assert.ok(block && typeof block === "object");
  const rec = block as Record<string, unknown>;
  assert.equal(rec.note, BOARD_OFFLINE_NOTE);
  assert.equal(rec.since_this_machine_last_synced, "1 board change from mike");
  assert.equal(rec.as_of, "2026-07-08T00:00:00.000Z");
});

test("buildBoardBlock: ONLY a cache-refreshing pull skips as_of; a local-state swallow keeps it", () => {
  const status = provisionedStatus(cacheOf([row("mike")]));
  // A SUCCESSFUL pull (refreshed: the cache was just rewritten) — no freshness label needed.
  const fresh = buildBoardBlock(status, { offline: false, refreshed: true }, INV);
  assert.equal((fresh.block as Record<string, unknown>).as_of, undefined);
  assert.equal((fresh.block as Record<string, unknown>).note, undefined);
  // A local-state-swallowed pull (diverged/dirty): offline:false but the cache was NOT refreshed
  // — the as_of label must attach (review round: `!pull || pull.offline` let this read as fresh).
  const swallowed = buildBoardBlock(status, { offline: false }, INV);
  assert.equal((swallowed.block as Record<string, unknown>).as_of, "2026-07-08T00:00:00.000Z");
});

test("buildBoardBlock: self-authored rows are filtered from the human count", () => {
  const status = provisionedStatus(cacheOf([row("brian"), row("mike"), row("brian")]), {
    selfActors: ["brian"],
  });
  const { block } = buildBoardBlock(status, { offline: false }, INV);
  const rec = block as Record<string, unknown>;
  assert.equal(rec.since_this_machine_last_synced, "1 board change from mike");
  assert.deepEqual(rec.changes, ['mike · updated Task "Seed one"']);
  // ALL rows self-authored + zero counts ⇒ clean.
  const allSelf = buildBoardBlock(
    provisionedStatus(cacheOf([row("brian")]), { selfActors: ["brian"] }),
    { offline: false },
    INV,
  );
  assert.equal(allSelf.block, BOARD_UP_TO_DATE);
});

test("buildBoardBlock: backstop both counts — live counts preferred, cache counts the fallback", () => {
  const live = buildBoardBlock(
    provisionedStatus(cacheOf([], { unpushedCount: 9, uncommittedCount: 9 }), {
      unpushed: 2,
      uncommitted: 1,
    }),
    undefined,
    INV,
  );
  const rec = live.block as Record<string, unknown>;
  assert.equal(rec.unpushed, "2 local board commits not yet pushed — run sync when online");
  assert.equal(rec.uncommitted, "1 uncommitted board change — run sync to share it");
  const cached = buildBoardBlock(
    provisionedStatus(cacheOf([], { unpushedCount: 3, uncommittedCount: 0 })),
    undefined,
    INV,
  );
  assert.equal(
    (cached.block as Record<string, unknown>).unpushed,
    "3 local board commits not yet pushed — run sync when online",
  );
});

test("buildBoardBlock: cache note (re-anchor) and pull notes surface; changes list is capped", () => {
  const rows = Array.from({ length: 15 }, (_, i) => row("mike", "updated", "Task", `Doc ${i}`));
  const status = provisionedStatus(cacheOf(rows, { note: "delta unavailable (history rewritten)" }));
  const { block } = buildBoardBlock(status, { offline: true, notes: ["extra"] }, INV);
  const rec = block as Record<string, unknown>;
  assert.equal(rec.since_this_machine_last_synced, "15 board changes from mike");
  assert.equal((rec.changes as string[]).length, 10);
  assert.equal(rec.note, `${BOARD_OFFLINE_NOTE}; extra; delta unavailable (history rewritten)`);
});

test("buildBoardBlock: unprovisioned → probe-gated first-contact line (run sync, NEVER init)", () => {
  const { block, firstContact } = buildBoardBlock({ state: "unprovisioned" }, undefined, INV);
  assert.equal(block, undefined);
  assert.equal(firstContact, boardFirstContactLine(INV));
  assert.equal(firstContact, "not yet provisioned — run `aslite sync` to set it up");
  assert.ok(!firstContact!.includes("init"));
});

test("buildBoardBlock: no board status → no block, even when a pull outcome exists", () => {
  assert.deepEqual(buildBoardBlock(null, { offline: true }, INV), {});
});

// ── 2. integration: two-clone e2e over the harness ───────────────────────────

test("two-clone e2e: A pushes, B's session-start renders A's changes attributed (moment (e))", async () => {
  const topo = await makeTwoCloneTopology();
  const homeB = await tempHome();
  try {
    // A (teammate "mike") modifies a seed doc and adds a new one; pushes to origin/board.
    await modifyBoardDoc(topo.a, "tasks/seed-one", { body: "# Seed one\n\nrevised\n" });
    await writeBoardDoc(topo.a, "tasks/fresh", {
      frontmatter: { type: "Task", title: "Fresh work", actor: "mike" },
      body: "# Fresh work\n\nnew\n",
    });
    commitBoard(topo.a, "board: mike — 2 docs");
    pushBoard(topo.a);

    // B's session start: pull-then-render, one command, in-process.
    const out = await runSessionStart(homeB, ["--dir", topo.b.root]);

    assert.match(out, /since_this_machine_last_synced: 2 board changes from mike/);
    // TOON escapes the inner quotes inside array items — assert on the stable substrings.
    assert.ok(out.includes("mike · updated Task") && out.includes("Seed one"), out);
    assert.ok(out.includes("mike · added Task") && out.includes("Fresh work"), out);
    // The render is the full home view (identity header + bundle dashboard) — not a bare receipt.
    assert.match(out, /agentstate-lite/);
    assert.match(out, /bundle:/);

    // Cursor advanced to B's post-pull HEAD (successful pull).
    const key = await withHome(homeB, async () => resolveBundleKey(topo.b.board));
    const cursor = await withHome(homeB, () => readCursor(key));
    assert.ok(cursor, "expected a cursor after a successful pull");
    assert.equal(cursor!.token, git(topo.b.board, ["rev-parse", "HEAD"]).trim());

    // Marker refreshed by the pull step.
    assert.ok(await withHome(homeB, () => readMarker(key)));

    // A second session with nothing new: clean → the pinned 'board: up to date'.
    const again = await runSessionStart(homeB, ["--dir", topo.b.root]);
    assert.match(again, /board: up to date/);
  } finally {
    await topo.cleanup();
    await rm(homeB, { recursive: true, force: true });
  }
});

test("self-authored filtering e2e: my own synced docs never inflate my since-line", async () => {
  const topo = await makeTwoCloneTopology();
  const homeA = await tempHome();
  try {
    // A writes a doc attributed to brian and syncs it (sync records brian as a SELF actor).
    await writeBoardDoc(topo.a, "tasks/mine", {
      frontmatter: { type: "Task", title: "My own work", actor: "brian" },
      body: "# Mine\n",
    });
    await runSync(homeA, ["--dir", topo.a.root]);
    const key = await withHome(homeA, async () => resolveBundleKey(topo.a.board));
    assert.deepEqual(await withHome(homeA, () => readSelfActors(key)), ["brian"]);

    // The sync's own cache delta contains brian's row — but the render filters it: clean board.
    const out = await runSessionStart(homeA, ["--dir", topo.a.root]);
    assert.match(out, /board: up to date/);
    assert.ok(!out.includes("board change from brian"), "self-authored row must not render");
  } finally {
    await topo.cleanup();
    await rm(homeA, { recursive: true, force: true });
  }
});

test("backstop both counts e2e: unpushed commits AND uncommitted changes render after a pull", async () => {
  const topo = await makeTwoCloneTopology();
  const homeB = await tempHome();
  try {
    // Two local board commits not pushed…
    await writeBoardDoc(topo.b, "tasks/local-one", {
      frontmatter: { type: "Task", title: "Local one", actor: "brian" },
      body: "x\n",
    });
    commitBoard(topo.b, "board: brian — 1 doc");
    await writeBoardDoc(topo.b, "tasks/local-two", {
      frontmatter: { type: "Task", title: "Local two", actor: "brian" },
      body: "x\n",
    });
    commitBoard(topo.b, "board: brian — 1 doc");
    // …plus one uncommitted change sitting in the worktree.
    await writeBoardDoc(topo.b, "tasks/uncommitted", {
      frontmatter: { type: "Task", title: "Uncommitted", actor: "brian" },
      body: "x\n",
    });

    const out = await runSessionStart(homeB, ["--dir", topo.b.root]);
    assert.match(out, /unpushed: 2 local board commits not yet pushed — run sync when online/);
    assert.match(out, /uncommitted: 1 uncommitted board change — run sync to share it/);
  } finally {
    await topo.cleanup();
    await rm(homeB, { recursive: true, force: true });
  }
});

test("provisioning receipt: a fresh clone's session-start provisions LOUDLY and renders the bundle", async () => {
  const topo = await makeTwoCloneTopology({ provision: false });
  const homeB = await tempHome();
  try {
    const out = await runSessionStart(homeB, ["--dir", topo.b.root]);
    // Rider-2 announcement (the run that materialized the whole board must not read as a no-op).
    assert.match(out, /provisioned: .* — materialized from origin\/board/);
    // The freshly provisioned board's docs are the render's bundle dashboard (doc count).
    assert.match(out, /docs: 3/);
    // Marker + cursor exist (pull step completed).
    const key = await withHome(homeB, async () => resolveBundleKey(topo.b.board));
    assert.ok(await withHome(homeB, () => readMarker(key)));
    assert.ok(await withHome(homeB, () => readCursor(key)));
  } finally {
    await topo.cleanup();
    await rm(homeB, { recursive: true, force: true });
  }
});

// ── 3. first-contact matrix (probe-gated, never marker-only) ─────────────────

test("first-contact: fresh clone + origin/board exists → 'run sync' hint, NEVER 'run init'", async () => {
  const topo = await makeTwoCloneTopology({ provision: false });
  const homeB = await tempHome();
  try {
    // Plain home (no pull at all): the fs+local-git probe alone must steer to sync. A brand-new
    // clone has NO marker (per-clone keying) — this is exactly the probe-gated case.
    const out = await runHome(homeB, ["--dir", topo.b.root]);
    assert.match(out, /board: not yet provisioned — run `.* sync` to set it up/);
    assert.ok(!out.includes("getting_started"), "the init hint must be suppressed");
    assert.ok(!/run `[^`]*init`/.test(out), "no init hint may appear");
  } finally {
    await topo.cleanup();
    await rm(homeB, { recursive: true, force: true });
  }
});

test("first-contact: no board anywhere → today's behavior (init hint), no board block", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-noboard-"));
  const homeDir = await tempHome();
  try {
    git(dir, ["init", "-b", "main", "."]);
    await writeFile(path.join(dir, "README.md"), "# plain repo\n");
    git(dir, ["add", "-A"]);
    git(dir, ["commit", "-m", "initial"]);
    const out = await runHome(homeDir, ["--dir", dir]);
    assert.match(out, /getting_started: no OKF bundle found/);
    assert.ok(!out.includes("board:"), "no board block for a boardless repo");
  } finally {
    await rm(dir, { recursive: true, force: true });
    await rm(homeDir, { recursive: true, force: true });
  }
});

// ── 4. fail-soft matrix + time box ────────────────────────────────────────────

test("offline pull: unreachable origin → pinned offline note, cursor NOT advanced, render still appears", async () => {
  const topo = await makeTwoCloneTopology();
  const homeB = await tempHome();
  try {
    // First, a successful session start to plant a cursor + cache.
    await runSessionStart(homeB, ["--dir", topo.b.root]);
    const key = await withHome(homeB, async () => resolveBundleKey(topo.b.board));
    const cursorBefore = await withHome(homeB, () => readCursor(key));
    assert.ok(cursorBefore);

    // Teammate pushes; then B goes offline (origin URL points at nothing).
    await modifyBoardDoc(topo.a, "notes/welcome", { body: "# Welcome\n\nchanged\n" });
    commitBoard(topo.a, "board: mike — 1 doc");
    pushBoard(topo.a);
    git(topo.b.root, ["remote", "set-url", "origin", path.join(topo.dir, "gone.git")]);

    const out = await runSessionStart(homeB, ["--dir", topo.b.root]);
    assert.match(out, /board sync offline — showing last known state/);
    const cursorAfter = await withHome(homeB, () => readCursor(key));
    assert.equal(cursorAfter!.token, cursorBefore!.token, "cursor must not advance on a failed pull");
    // The marker is still refreshed by every pull step (the board demonstrably exists locally).
    assert.ok(await withHome(homeB, () => readMarker(key)));
  } finally {
    await topo.cleanup();
    await rm(homeB, { recursive: true, force: true });
  }
});

test("time-box fall-through: a REAL hanging remote is killed inside the budget and home still renders", async () => {
  const topo = await makeTwoCloneTopology();
  const homeB = await tempHome();
  const helperDir = await mkdtemp(path.join(tmpdir(), "aslite-hang-helper-"));
  const prevPath = process.env.PATH;
  try {
    // A remote helper that hangs: `git fetch` over hang:// blocks until killed. The pull step's
    // per-op spawnSync timeout (sliced from the remaining budget) is the enforcement under test.
    const helper = path.join(helperDir, "git-remote-hang");
    await writeFile(helper, "#!/bin/sh\nsleep 60\n");
    chmodSync(helper, 0o755);
    process.env.PATH = `${helperDir}${path.delimiter}${prevPath ?? ""}`;
    git(topo.b.root, ["remote", "set-url", "origin", "hang://black.hole/repo"]);

    const budgetMs = 1_500;
    const t0 = Date.now();
    const out = await runSessionStart(homeB, ["--dir", topo.b.root], { budgetMs });
    const elapsed = Date.now() - t0;

    assert.ok(elapsed < 5_000, `render must appear within the budget (took ${elapsed}ms)`);
    assert.match(out, /board sync offline — showing last known state/);
    assert.match(out, /agentstate-lite/); // the full home render fell through
  } finally {
    process.env.PATH = prevPath;
    await rm(helperDir, { recursive: true, force: true });
    await topo.cleanup();
    await rm(homeB, { recursive: true, force: true });
  }
});

test("zero-at-the-fetch-boundary: a budget that decays to 0 AFTER the guard never reaches spawnSync (PR#24 MEDIUM)", async () => {
  // The exact reported mechanism: the ffPull call site is guarded, but local ops run between the
  // guard and the `remaining()` evaluation of the fetch slice — a scripted clock passes every
  // guard (calls 1-4 stay at t0) and then jumps past the deadline, so the slice handed to the
  // fetch is EXACTLY 0. Node's spawnSync treats timeout:0 as NO timeout, so without the
  // runGitBytes floor this would hang on the hang:// helper for 60s, unpreemptable by any race.
  const topo = await makeTwoCloneTopology();
  const homeB = await tempHome();
  const helperDir = await mkdtemp(path.join(tmpdir(), "aslite-zero-boundary-"));
  const prevPath = process.env.PATH;
  try {
    const helper = path.join(helperDir, "git-remote-hang");
    await writeFile(helper, "#!/bin/sh\nsleep 60\n");
    chmodSync(helper, 0o755);
    process.env.PATH = `${helperDir}${path.delimiter}${prevPath ?? ""}`;
    git(topo.b.root, ["remote", "set-url", "origin", "hang://black.hole/repo"]);

    const budgetMs = 5_000;
    const t0real = Date.now();
    let calls = 0;
    // Calls 1-4: deadline mint, entry guard, provision slice, post-provision guard — all at t0.
    // Call 5+ (the ffPull slice and after): past the deadline → remaining() clamps to exactly 0.
    const scriptedNow = () => {
      calls += 1;
      return calls <= 4 ? t0real : t0real + budgetMs + 1_000;
    };
    const outcome = await withHome(homeB, () =>
      sessionStartPull(topo.b.root, budgetMs, scriptedNow),
    );
    const elapsed = Date.now() - t0real;

    assert.ok(elapsed < 5_000, `the 0 slice must classify immediately, never spawn (took ${elapsed}ms)`);
    assert.ok(outcome, "a provisioned board yields an outcome");
    assert.equal(outcome!.offline, true, "a zero-slice fetch is an offline outcome");
    assert.ok(outcome!.boardPath, "decay must have hit the FETCH boundary, past the entry guard");
    assert.equal(outcome!.refreshed, undefined, "no cache refresh on a floored pull");
    // Marker refreshed (board confirmed), cursor NOT advanced (no successful pull).
    const key = await withHome(homeB, async () => resolveBundleKey(topo.b.board));
    assert.ok(await withHome(homeB, () => readMarker(key)));
    assert.equal(await withHome(homeB, () => readCursor(key)), null);
  } finally {
    process.env.PATH = prevPath;
    await rm(helperDir, { recursive: true, force: true });
    await topo.cleanup();
    await rm(homeB, { recursive: true, force: true });
  }
});

test("zero budget at entry: the guard takes the offline path before ANY network op; render still appears", async () => {
  const topo = await makeTwoCloneTopology();
  const homeB = await tempHome();
  const helperDir = await mkdtemp(path.join(tmpdir(), "aslite-zero-entry-"));
  const prevPath = process.env.PATH;
  try {
    const helper = path.join(helperDir, "git-remote-hang");
    await writeFile(helper, "#!/bin/sh\nsleep 60\n");
    chmodSync(helper, 0o755);
    process.env.PATH = `${helperDir}${path.delimiter}${prevPath ?? ""}`;
    git(topo.b.root, ["remote", "set-url", "origin", "hang://black.hole/repo"]);

    const t0 = Date.now();
    const out = await runSessionStart(homeB, ["--dir", topo.b.root], { budgetMs: 0 });
    assert.ok(Date.now() - t0 < 5_000, "zero budget must never wait on the network");
    assert.match(out, /board sync offline — showing last known state/);
    assert.match(out, /agentstate-lite/);
  } finally {
    process.env.PATH = prevPath;
    await rm(helperDir, { recursive: true, force: true });
    await topo.cleanup();
    await rm(homeB, { recursive: true, force: true });
  }
});

test("fall-through belt: an injected pull that NEVER resolves still renders home at the budget", async () => {
  const homeDir = await tempHome();
  try {
    const t0 = Date.now();
    const out = await runSessionStart(homeDir, [], {
      budgetMs: 200,
      pull: () => new Promise(() => {}),
    });
    assert.ok(Date.now() - t0 < 3_000);
    assert.match(out, /agentstate-lite/);
    assert.match(out, /commands:/);
  } finally {
    await rm(homeDir, { recursive: true, force: true });
  }
});

test("session-start inherits non-empty workspace orientation from home", async () => {
  const homeDir = await realpath(await tempHome());
  const bundleDir = path.join(homeDir, "personal-bundle");
  try {
    await initBundle(bundleDir);
    await addCatalogEntry("personal", bundleDir, { home: homeDir });

    const out = await runSessionStart(homeDir, ["--json"], {
      budgetMs: 50,
      pull: async () => undefined,
    });
    const view = JSON.parse(out) as Record<string, any>;
    assert.equal(view.workspaces.count, 1);
    assert.equal(view.workspaces.shown, 1);
    assert.deepEqual(view.workspaces.entries, [{ label: "personal" }]);
    assert.match(view.workspaces.help, /catalog resolve <label-or-id> --field path$/);
    assert.doesNotMatch(JSON.stringify(view.workspaces), /(?:locator|personal-bundle|bnd_)/);
  } finally {
    await rm(homeDir, { recursive: true, force: true });
  }
});

test("fail-soft: a THROWING injected pull still renders (offline outcome), exit path clean", async () => {
  const homeDir = await tempHome();
  try {
    const out = await runSessionStart(homeDir, [], {
      pull: () => Promise.reject(new Error("boom")),
    });
    assert.match(out, /agentstate-lite/);
  } finally {
    await rm(homeDir, { recursive: true, force: true });
  }
});

test("local-state swallow (diverged) → honest 'run sync' note, not the offline note; stale cache labeled as_of", async () => {
  const topo = await makeTwoCloneTopology();
  const homeB = await tempHome();
  try {
    // A successful session start first, so a cache exists to be honestly labeled stale later.
    await runSessionStart(homeB, ["--dir", topo.b.root]);

    // B commits locally; A pushes a different commit — origin and B diverge.
    await writeBoardDoc(topo.b, "tasks/b-local", {
      frontmatter: { type: "Task", title: "B local", actor: "brian" },
      body: "x\n",
    });
    commitBoard(topo.b, "board: brian — 1 doc");
    await modifyBoardDoc(topo.a, "notes/welcome", { body: "# Welcome\n\nmoved\n" });
    commitBoard(topo.a, "board: mike — 1 doc");
    pushBoard(topo.a);

    const out = await runSessionStart(homeB, ["--dir", topo.b.root]);
    assert.match(out, /board pull skipped \(diverged\) — run `.* sync` to reconcile/);
    assert.ok(!out.includes(BOARD_OFFLINE_NOTE), "a divergence is not an offline state");
    // The swallowed pull did NOT refresh the cache — the render must carry the freshness label
    // (review round: offline:false must not read as "just pulled").
    assert.match(out, /as_of: /);
  } finally {
    await topo.cleanup();
    await rm(homeB, { recursive: true, force: true });
  }
});

test("sync's pull step also refreshes the marker (U4 inherited item 5: a synced repo presents it)", async () => {
  const topo = await makeTwoCloneTopology();
  const homeA = await tempHome();
  try {
    await runSync(homeA, ["--dir", topo.a.root]);
    const key = await withHome(homeA, async () => resolveBundleKey(topo.a.board));
    assert.ok(await withHome(homeA, () => readMarker(key)), "sync must refresh the board marker");
  } finally {
    await topo.cleanup();
    await rm(homeA, { recursive: true, force: true });
  }
});

test("defaultLoadBoardStatus: provisioned board reports live counts + cache; boardless dir → null", async () => {
  const topo = await makeTwoCloneTopology();
  const homeB = await tempHome();
  try {
    await writeBoardDoc(topo.b, "tasks/pending", {
      frontmatter: { type: "Task", title: "Pending", actor: "brian" },
      body: "x\n",
    });
    const status = await withHome(homeB, () => defaultLoadBoardStatus(topo.b.root));
    assert.ok(status && status.state === "provisioned");
    assert.equal(status.uncommitted, 1);
    assert.equal(status.unpushed, 0);
    assert.equal(await defaultLoadBoardStatus(tmpdir()), null);
  } finally {
    await topo.cleanup();
    await rm(homeB, { recursive: true, force: true });
  }
});

// ── 5. hook wiring (install/status/uninstall + the re-install prompt) ─────────

test("hook install wires `session-start` into all three runtimes; status/uninstall agree", async () => {
  const base = await mkdtemp(path.join(tmpdir(), "aslite-hook-base-"));
  try {
    const cap = capture();
    await hook(["install"], { base, stdout: cap.stdout });
    assert.match(cap.out(), /session-start/);

    const claude = JSON.parse(
      await import("node:fs/promises").then((fs) => fs.readFile(path.join(base, ".claude", "settings.json"), "utf8")),
    );
    const entry = claude.hooks.SessionStart[0].hooks[0];
    assert.ok(entry.command.endsWith(" session-start"), `claude hook command: ${entry.command}`);
    assert.equal(entry.timeout, HOOK_TIMEOUT_SECONDS);

    const codex = JSON.parse(
      await import("node:fs/promises").then((fs) => fs.readFile(path.join(base, ".codex", "hooks.json"), "utf8")),
    );
    assert.ok(codex.hooks.SessionStart[0].hooks[0].command.endsWith(" session-start"));

    const plugin = await import("node:fs/promises").then((fs) =>
      fs.readFile(path.join(base, ".config", "opencode", "plugins", "axi-agentstate-lite.js"), "utf8"),
    );
    assert.ok(plugin.includes("axi-sdk-js managed opencode plugin: agentstate-lite"));
    assert.ok(plugin.includes('"session-start"'));

    // A freshly installed hook needs no update…
    assert.equal(hookNeedsUpdate([base]), false);

    const capStatus = capture();
    await hook(["status"], { base, stdout: capStatus.stdout });
    assert.match(capStatus.out(), /installed: true/);
    assert.match(capStatus.out(), /session-start/);

    const capUn = capture();
    await hook(["uninstall"], { base, stdout: capUn.stdout });
    assert.match(capUn.out(), /installed: false/);
    assert.equal(hookNeedsUpdate([base]), false);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test("hook re-install prompt: a pre-session-start managed hook is detected and surfaced in home", async () => {
  const base = await mkdtemp(path.join(tmpdir(), "aslite-hook-old-"));
  const homeDir = await tempHome();
  try {
    // Seed the OLD hook shape (the pre-U4 home-only command — bare bin, no subcommand).
    await mkdir(path.join(base, ".claude"), { recursive: true });
    await writeFile(
      path.join(base, ".claude", "settings.json"),
      JSON.stringify(
        {
          hooks: {
            SessionStart: [
              { matcher: "", hooks: [{ type: "command", command: "agentstate-lite", timeout: 10 }] },
            ],
          },
        },
        null,
        2,
      ),
    );
    assert.equal(hookNeedsUpdate([base]), true);

    // home surfaces the self-clearing re-install prompt when the probe reports outdated.
    const cap = capture();
    await withHome(homeDir, () => home([], { stdout: cap.stdout, hookNeedsUpdate: () => true }));
    assert.match(cap.out(), /hook_update: .*predates `session-start` — re-run `.* hook install`/);
    assert.equal(hookUpdateNote(INV).includes("hook install"), true);

    // Re-running install rewrites the command — the prompt clears.
    const capIn = capture();
    await hook(["install"], { base, stdout: capIn.stdout });
    assert.equal(hookNeedsUpdate([base]), false);
  } finally {
    await rm(base, { recursive: true, force: true });
    await rm(homeDir, { recursive: true, force: true });
  }
});

test("sessionStartHookCommand: bare base passes through; a spaced path is quoted; plugin spawns argv", () => {
  assert.equal(sessionStartHookCommand("aslite"), "aslite session-start");
  assert.equal(
    sessionStartHookCommand("/Users/f b/agentstate-lite.mjs"),
    '"/Users/f b/agentstate-lite.mjs" session-start',
  );
  const src = buildOpenCodePluginSource("/opt/bin/agentstate-lite");
  assert.ok(src.includes('const command = "/opt/bin/agentstate-lite"'));
  assert.ok(src.includes('const commandArgs = ["session-start"]'));
});

// ── 6. no-repo / boardless session-start stays serene ─────────────────────────

test("session-start --dir on a BOARDLESS project with a committed bundle: dashboard, never 'run init'", async () => {
  // THIS repo's own pre-migration shape: a plain `.agentstate-lite/` bundle committed on main,
  // no `board` branch anywhere. The --dir bridge must fall back to home's DISCOVERY walk from
  // the project dir — treating the project dir as a literal bundle root dangled a wrong `init`
  // hint next to a real bundle (review round, fix 3).
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-committed-bundle-"));
  const homeDir = await tempHome();
  try {
    git(dir, ["init", "-b", "main", "."]);
    const bundleDir = path.join(dir, ".agentstate-lite");
    await initBundle(bundleDir);
    await writeDoc(
      { root: bundleDir },
      { id: "tasks/one", frontmatter: { type: "Task", title: "One" }, body: "x\n" },
    );
    git(dir, ["add", "-A"]);
    git(dir, ["commit", "-m", "main: committed bundle, no board branch"]);

    const out = await runSessionStart(homeDir, ["--dir", dir]);
    assert.match(out, /docs: 1/);
    assert.ok(!out.includes("getting_started"), "no init hint next to a real committed bundle");
    assert.ok(!/run `[^`]*init`/.test(out), "no init hint may appear");
    assert.ok(!out.includes("board sync offline"), "boardless is not an offline state");
  } finally {
    await rm(dir, { recursive: true, force: true });
    await rm(homeDir, { recursive: true, force: true });
  }
});

test("session-start outside any git repo: no board block, plain home render, resolves cleanly", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-norepo-"));
  const homeDir = await tempHome();
  try {
    const outcome = await withHome(homeDir, () => sessionStartPull(dir));
    assert.equal(outcome, undefined);
    const out = await runSessionStart(homeDir, ["--dir", dir]);
    assert.match(out, /getting_started: no OKF bundle found/);
    assert.ok(!out.includes("board sync offline"));
  } finally {
    await rm(dir, { recursive: true, force: true });
    await rm(homeDir, { recursive: true, force: true });
  }
});
