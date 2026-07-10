// Tests for `sync --establish` (greenfield combo 1) + the combo-2 "publish" branch bare `sync`
// gains alongside it (plans/sync-greenfield-establish). Everything runs in SCRATCH topologies via
// the U0 harness — the real repo's own board is never touched.
//
// The suite pins:
//   • the 4-combination matrix's two NEW/CHANGED cells: combo 1 (absent/absent) requires the
//     explicit `--establish` flag and produces the full establish receipt; combo 2 (present
//     locally / absent on origin) is now a PUBLISH under bare `sync`, not the old dead-end;
//   • decision 1 (LOCKED): bare `sync` on combo 1 keeps the pinned `sync: nothing to sync` string,
//     only ADDING a routing hint — never auto-publishes;
//   • decision 3 (LOCKED): the gitignore append lands in the WORKING TREE only, uncommitted;
//   • the keystone first-contact journey end to end (clone A establishes, clone B joins);
//   • the establish race (a teammate publishes between this run's own fetch and its push);
//   • idempotence: `--establish` re-run notes `already established` and behaves as an ordinary sync;
//   • the precondition ladder's structured refusals (no repo, no origin, unreachable origin, no
//     folder / empty / no index.md, a folder already committed at HEAD, a `board/…` namespace
//     branch, a nested `.git`) and the USAGE flag-combination guards.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, mkdir, readdir, rename } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { sync } from "../src/commands/sync.js";
import { init } from "../src/commands/init.js";
import { recipe } from "../src/commands/recipe.js";
import { list } from "../src/commands/list.js";
import {
  ESTABLISH_ALREADY,
  ESTABLISH_DONE,
  establishNextSteps,
} from "../src/commands/sync-establish.js";
import { GITIGNORE_ENTRY } from "../src/commands/sync-migrate.js";
import { CliError } from "../src/errors.js";
import { cliInvocation } from "../src/invocation.js";
import {
  BOARD_BRANCH,
  createEmptyRootBoardBranch,
  provisionBoardWorktree,
  pushBoardUpstream,
  stageAndCommit,
} from "../src/git.js";
import {
  BUNDLE_DIR,
  git,
  gitTry,
  initPlainBundleDir,
  makeGreenfieldTopology,
  writeBoardDoc,
  type BoardRepo,
} from "./git-harness.js";

const INV = cliInvocation();

// ── scaffolding (mirrors sync.test.ts / sync-migrate.test.ts) ─────────────────

async function withHome<T>(home: string, run: () => Promise<T>): Promise<T> {
  const originalHome = process.env.HOME;
  const originalUserProfile = process.env.USERPROFILE;
  process.env.HOME = home;
  process.env.USERPROFILE = home;
  try {
    return await run();
  } finally {
    if (originalHome === undefined) delete process.env.HOME;
    else process.env.HOME = originalHome;
    if (originalUserProfile === undefined) delete process.env.USERPROFILE;
    else process.env.USERPROFILE = originalUserProfile;
  }
}

async function runSync(home: string, argv: string[]): Promise<{ out: string; err?: CliError }> {
  const chunks: string[] = [];
  try {
    await withHome(home, () =>
      sync(argv, { stdout: (s: string) => void chunks.push(s), hookInstalled: () => true }),
    );
    return { out: chunks.join("") };
  } catch (err) {
    if (err instanceof CliError) return { out: chunks.join(""), err };
    throw err;
  }
}

async function runSyncJson(home: string, argv: string[]): Promise<Record<string, unknown>> {
  const { out, err } = await runSync(home, [...argv, "--json"]);
  assert.equal(err, undefined, `expected success, got ${err?.code}: ${err?.message}`);
  return JSON.parse(out) as Record<string, unknown>;
}

async function tempHome(): Promise<{ home: string; cleanup: () => Promise<void> }> {
  const home = await mkdtemp(path.join(tmpdir(), "aslite-establish-test-home-"));
  return { home, cleanup: () => rm(home, { recursive: true, force: true }) };
}

/**
 * Hand-build combo 2 (present locally / absent on origin) directly over git.ts's OWN establish
 * primitives — never through `--establish` itself: an empty-root board branch, provisioned as the
 * conventional worktree, carrying one real committed doc that was never pushed.
 */
async function handBuildLocalOnlyBoard(repo: BoardRepo, id: string, body: string): Promise<void> {
  createEmptyRootBoardBranch(repo.root);
  const outcome = provisionBoardWorktree(repo.root);
  assert.equal(outcome.kind, "provisioned");
  await writeBoardDoc(repo, id, { frontmatter: { type: "Note", title: id }, body });
  const commit = stageAndCommit(repo.board);
  assert.equal(commit.committed, true);
}

// ── pure string tests ──────────────────────────────────────────────────────────

test("establish strings: pinned constants", () => {
  assert.equal(
    ESTABLISH_DONE,
    "the shared board is live — .agentstate-lite/ now syncs over the 'board' branch",
  );
  assert.equal(ESTABLISH_ALREADY, "already established");
  const steps = establishNextSteps(INV);
  assert.equal(steps.length, 2);
  assert.match(steps[0]!, /teammates just run/);
  assert.match(steps[1]!, /hook install/);
});

// ── matrix cell 1: absent/absent — bare sync hints, --establish publishes ─────

test("combo 1 (absent/absent): bare sync keeps 'nothing to sync' + adds an --establish hint", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    await initPlainBundleDir(topo.a);
    const rec = await runSyncJson(home, ["--dir", topo.a.root]);
    assert.equal(rec.sync, "nothing to sync", "the pinned string never changes (decision 1)");
    assert.equal(typeof rec.hint, "string");
    assert.match(rec.hint as string, /--establish/);
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("combo 1: bare sync with NO local bundle folder at all carries no establish hint", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    const rec = await runSyncJson(home, ["--dir", topo.a.root]);
    assert.equal(rec.sync, "nothing to sync");
    assert.equal("hint" in rec, false, "nothing establishABLE here — no folder, no hint to give");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("combo 1: --establish — full receipt, origin gets the board, working-tree gitignore, idempotent re-run", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    await initPlainBundleDir(topo.a);
    await writeBoardDoc(topo.a, "notes/hello", {
      frontmatter: { type: "Note", title: "Hello", actor: "mike" },
      body: "# Hello\n\nfirst doc\n",
    });

    const rec = await runSyncJson(home, ["--establish", "--dir", topo.a.root]);
    assert.equal(rec.established, ESTABLISH_DONE);
    assert.equal(typeof rec.board_commit, "string");
    assert.equal(rec.committed, 1, "index.md is reserved (never counted); the one concept doc is");
    assert.equal(rec.actor, "mike");
    assert.equal(rec.pushed, "origin/board (tracking set)");
    assert.equal(typeof rec.gitignore, "string");
    assert.match(rec.gitignore as string, /appended/);
    assert.deepEqual(rec.next_steps, establishNextSteps(INV));

    // origin now genuinely carries the board branch.
    assert.equal(
      gitTry(topo.origin, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status,
      0,
    );
    // the conventional path is now a linked worktree checked out on `board`.
    assert.equal(git(topo.a.board, ["rev-parse", "--abbrev-ref", "HEAD"]).trim(), BOARD_BRANCH);
    assert.equal(existsSync(path.join(topo.a.board, "notes", "hello.md")), true);

    // gitignore: WORKING TREE only, uncommitted (decision 3).
    const gitignorePath = path.join(topo.a.root, ".gitignore");
    assert.equal(existsSync(gitignorePath), true);
    assert.match(readFileSync(gitignorePath, "utf8"), new RegExp(GITIGNORE_ENTRY.replace("/", "\\/")));
    const status = git(topo.a.root, ["status", "--porcelain"]);
    assert.match(status, /\.gitignore/, ".gitignore itself is uncommitted");
    assert.doesNotMatch(
      status,
      /\.agentstate-lite/,
      "the board worktree itself never shows as a dirty path in the main worktree",
    );
    // never committed onto the code branch.
    const headTree = gitTry(topo.a.root, ["cat-file", "-e", "HEAD:.gitignore"]);
    assert.notEqual(headTree.status, 0, ".gitignore must not be committed to the code branch");

    // idempotent re-run: notes already-established, single lineage (no second empty-root commit).
    const boardCommitsBefore = git(topo.a.board, ["rev-list", "--count", "HEAD"]).trim();
    const rerun = await runSyncJson(home, ["--establish", "--dir", topo.a.root]);
    assert.equal(rerun.establish, ESTABLISH_ALREADY);
    assert.equal(rerun.sync, "already up to date");
    const boardCommitsAfter = git(topo.a.board, ["rev-list", "--count", "HEAD"]).trim();
    assert.equal(boardCommitsAfter, boardCommitsBefore, "re-running --establish never adds a second lineage");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("combo 1: user code + the working tree survive establish untouched", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    await initPlainBundleDir(topo.a);
    await runSyncJson(home, ["--establish", "--dir", topo.a.root]);
    assert.equal(existsSync(path.join(topo.a.root, "src", "app.js")), true);
    assert.equal(readFileSync(path.join(topo.a.root, "src", "app.js"), "utf8"), "export const x = 1;\n");
    assert.equal(git(topo.a.root, ["rev-parse", "--abbrev-ref", "HEAD"]).trim(), "main");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

// ── keystone first-contact journey (buildlist #1) ─────────────────────────────

test("keystone journey: clone A inits + recipe add work-tracking + --establish; clone B bare sync joins and sees the Task kind", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    const boardA = path.join(topo.a.root, BUNDLE_DIR);
    await withHome(home, () =>
      init(["--dir", boardA, "--recipe", "none", "--json"], { stdout: () => {} }),
    );
    await withHome(home, () =>
      recipe(["add", "work-tracking", "--dir", boardA, "--json"], { stdout: () => {} }),
    );

    const establishRec = await runSyncJson(home, ["--establish", "--dir", topo.a.root]);
    assert.equal(establishRec.established, ESTABLISH_DONE);

    // Clone B joins with a bare sync (no flag) — the existing provision/join path, unchanged.
    const joinRec = await runSyncJson(home, ["--dir", topo.b.root]);
    assert.ok("provisioned" in joinRec || "sync" in joinRec, "clone B's first sync provisions the board");

    const boardB = path.join(topo.b.root, BUNDLE_DIR);
    assert.equal(
      existsSync(path.join(boardB, "conventions", "task.md")),
      true,
      "the work-tracking convention doc synced to clone B",
    );

    const chunks: string[] = [];
    await withHome(home, () =>
      list(["--type", "Task", "--dir", boardB, "--json"], { stdout: (s: string) => void chunks.push(s) }),
    );
    const listRec = JSON.parse(chunks.join("")) as { count: number };
    assert.equal(typeof listRec.count, "number");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

// ── combo 2: present locally / absent on origin — bare sync PUBLISHES ─────────

test("combo 2: a hand-built local-only board — bare sync publishes with tracking; re-run is 'already up to date'", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    await handBuildLocalOnlyBoard(topo.a, "notes/local-only", "hand-built, never pushed");
    assert.equal(
      gitTry(topo.origin, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status !== 0,
      true,
      "origin genuinely has no board yet",
    );

    const rec = await runSyncJson(home, ["--dir", topo.a.root]);
    assert.equal(rec.published, "origin/board (tracking set)");
    assert.ok(typeof rec.pushed === "number" && (rec.pushed as number) >= 1);
    assert.equal(typeof rec.gitignore, "string");

    assert.equal(
      gitTry(topo.origin, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status,
      0,
      "origin now carries the board branch",
    );
    assert.equal(
      git(topo.origin, ["rev-parse", BOARD_BRANCH]).trim(),
      git(topo.a.board, ["rev-parse", "HEAD"]).trim(),
    );

    const rerun = await runSyncJson(home, ["--dir", topo.a.root]);
    assert.equal(rerun.sync, "already up to date");
    assert.equal("published" in rerun, false, "publishing is a one-time event, not repeated every run");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("combo 2: --pull-only pins the 'board not published yet' message (never publishes)", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    await handBuildLocalOnlyBoard(topo.a, "notes/local-only", "hand-built, never pushed");
    const { err } = await runSync(home, ["--pull-only", "--dir", topo.a.root]);
    assert.equal(err?.code, "NO_UPSTREAM");
    assert.match(err?.message ?? "", /board not published yet/);
    assert.equal(
      gitTry(topo.origin, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status !== 0,
      true,
      "--pull-only truly never publishes",
    );
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

// ── the establish race (teammate publishes between this run's fetch and its push) ─

test("race: a teammate's board lands on origin between establish's fetch and its push — nothing lost, converges", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    // Clone B races ahead and fully establishes+publishes first.
    await initPlainBundleDir(topo.b);
    await writeBoardDoc(topo.b, "notes/from-b", {
      frontmatter: { type: "Note", title: "From B", actor: "bob" },
      body: "# From B\n\nteammate's doc\n",
    });
    const bRec = await runSyncJson(home, ["--establish", "--dir", topo.b.root]);
    assert.equal(bRec.established, ESTABLISH_DONE);

    // Clone A independently reaches the SAME local state establish's own mutation would have —
    // an empty-root board branch, provisioned, carrying a real commit — WITHOUT yet reaching the
    // final push. This is the exact race window: A's own "no board yet" check is real (it ran
    // before B published), but publishing is a race against the network, not a lock.
    createEmptyRootBoardBranch(topo.a.root);
    const outcome = provisionBoardWorktree(topo.a.root);
    assert.equal(outcome.kind, "provisioned");
    await writeBoardDoc(topo.a, "notes/from-a", {
      frontmatter: { type: "Note", title: "From A", actor: "alice" },
      body: "# From A\n\nmy own doc\n",
    });
    const commitResult = stageAndCommit(topo.a.board);
    assert.equal(commitResult.committed, true);

    // A's own push (mirroring establishBoard's final step) is rejected: origin/board now names
    // B's UNRELATED history — never force-pushed.
    git(topo.a.root, ["fetch", "origin"]);
    assert.throws(() => pushBoardUpstream(topo.a.board));
    assert.equal(existsSync(path.join(topo.a.board, "notes", "from-a.md")), true, "nothing lost locally");

    // The documented fix: a plain sync (now combo 4 — both present, unrelated histories) converges.
    // Either outcome is acceptable — a clean rebase (non-overlapping paths can replay cleanly even
    // across unrelated roots) or a reported CONFLICT(5) — but it must NEVER be a raw/unclassified
    // failure, and nothing may be force-pushed or lost.
    const { out, err } = await runSync(home, ["--dir", topo.a.root, "--json"]);
    if (err) {
      assert.equal(err.code, "CONFLICT", "the converging mechanic's own terminal — never a raw git failure");
    } else {
      assert.ok(JSON.parse(out));
    }
    assert.equal(
      existsSync(path.join(topo.a.board, "notes", "from-a.md")) ||
        existsSync(path.join(topo.a.board, "notes", "from-b.md")),
      true,
      "at least one side's content is recoverable on disk either way",
    );
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

// ── crash states (self-heal, never bespoke recovery) ──────────────────────────

test("crash state: the empty-root branch was created but the folder was never renamed aside — plain sync's existing self-heal refuses safely, nothing lost", async () => {
  // establish's own step order (D3) creates the empty-root branch FIRST, then renames the folder
  // aside — so a crash between those two steps leaves a LOCAL `board` branch (empty root) alongside
  // the STILL-PLAIN, still-populated conventional folder. This is exactly the shape
  // `provisionBoardWorktree`'s pre-existing self-heal already refuses (a non-empty directory that
  // is not itself the board worktree) — a SAFE, non-destructive, actionable halt, not a silent
  // success; nothing here is bespoke recovery for establish specifically.
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    await initPlainBundleDir(topo.a);
    await writeBoardDoc(topo.a, "notes/hello", { frontmatter: { type: "Note", title: "Hello" }, body: "hi\n" });
    createEmptyRootBoardBranch(topo.a.root);

    const { err } = await runSync(home, ["--dir", topo.a.root]);
    assert.equal(err?.code, "RUNTIME");
    assert.match(err?.message ?? "", /move it aside/);
    assert.equal(existsSync(path.join(topo.a.board, "notes", "hello.md")), true, "nothing was touched, let alone lost");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("crash state: contents were moved into the provisioned worktree but never committed — plain sync's own commit step self-heals it", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    await initPlainBundleDir(topo.a);
    await writeBoardDoc(topo.a, "notes/hello", { frontmatter: { type: "Note", title: "Hello" }, body: "hi\n" });
    const original = topo.a.board;

    // Replicate establish's mutation up through "move contents in", stopping BEFORE stageAndCommit.
    createEmptyRootBoardBranch(topo.a.root);
    const aside = `${original}.establishing-crashtest`;
    await rm(original, { recursive: true, force: true });
    await mkdir(aside, { recursive: true });
    await writeBoardDoc({ ...topo.a, board: aside }, "notes/hello", {
      frontmatter: { type: "Note", title: "Hello" },
      body: "hi\n",
    });
    const outcome = provisionBoardWorktree(topo.a.root);
    assert.equal(outcome.kind, "provisioned");
    for (const name of await readdir(aside)) {
      await rename(path.join(aside, name), path.join(original, name));
    }
    await rm(aside, { recursive: true, force: true });
    // (deliberately no stageAndCommit / gitignore / push here — that's the crash point)

    const rec = await runSyncJson(home, ["--dir", topo.a.root]);
    assert.equal(rec.published, "origin/board (tracking set)", "the commit step picked up the moved content, then combo 2 published it");
    assert.equal(existsSync(path.join(topo.a.board, "notes", "hello.md")), true);
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("crash state: provisioned + committed but never pushed — the next plain sync completes (publishes)", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    await handBuildLocalOnlyBoard(topo.a, "notes/crash-recovered", "committed, never pushed");
    const rec = await runSyncJson(home, ["--dir", topo.a.root]);
    assert.equal(rec.published, "origin/board (tracking set)");
    assert.equal(
      gitTry(topo.origin, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status,
      0,
    );
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

// ── precondition ladder: structured refusals ──────────────────────────────────

test("establish refusals: no git repo at all, and a repo with no origin remote", async () => {
  const { home, cleanup } = await tempHome();
  try {
    const plain = await mkdtemp(path.join(tmpdir(), "aslite-establish-plain-"));
    try {
      const { err } = await runSync(home, ["--establish", "--dir", plain]);
      assert.equal(err?.code, "RUNTIME");
      assert.match(err?.message ?? "", /not inside a git repository/);
    } finally {
      await rm(plain, { recursive: true, force: true });
    }

    const noOrigin = await mkdtemp(path.join(tmpdir(), "aslite-establish-noorigin-"));
    try {
      git(noOrigin, ["init", "-b", "main"]);
      await writeFile(path.join(noOrigin, "f.txt"), "x");
      git(noOrigin, ["add", "-A"]);
      git(noOrigin, ["commit", "-m", "init"]);
      const { err } = await runSync(home, ["--establish", "--dir", noOrigin]);
      assert.equal(err?.code, "RUNTIME");
      assert.match(err?.message ?? "", /origin/);
    } finally {
      await rm(noOrigin, { recursive: true, force: true });
    }
  } finally {
    await cleanup();
  }
});

test("establish refusals: no folder / empty folder / no index.md all point at init", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    {
      const { err } = await runSync(home, ["--establish", "--dir", topo.a.root]);
      assert.equal(err?.code, "RUNTIME");
      assert.match(err?.message ?? "", /run '.*init/);
    }
    {
      await mkdir(topo.a.board, { recursive: true });
      const { err } = await runSync(home, ["--establish", "--dir", topo.a.root]);
      assert.equal(err?.code, "RUNTIME");
      assert.match(err?.message ?? "", /is empty/);
      await rm(topo.a.board, { recursive: true, force: true });
    }
    {
      await mkdir(topo.a.board, { recursive: true });
      await writeFile(path.join(topo.a.board, "stray.md"), "# not a bundle\n");
      const { err } = await runSync(home, ["--establish", "--dir", topo.a.root]);
      assert.equal(err?.code, "RUNTIME");
      assert.match(err?.message ?? "", /no index\.md/);
    }
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("establish refusal: a folder already committed at HEAD points at --migrate, not establish", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    await initPlainBundleDir(topo.a);
    await writeBoardDoc(topo.a, "notes/hello", { frontmatter: { type: "Note", title: "Hello" }, body: "hi\n" });
    git(topo.a.root, ["add", "-A"]);
    git(topo.a.root, ["commit", "-m", "committed the bundle folder directly"]);

    const { err } = await runSync(home, ["--establish", "--dir", topo.a.root]);
    assert.equal(err?.code, "RUNTIME");
    assert.match(err?.message ?? "", /sync --migrate/);
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("establish refusal: a nested .git inside the folder is refused, never adopted", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    await mkdir(topo.a.board, { recursive: true });
    await writeFile(path.join(topo.a.board, "index.md"), '---\nokf_version: "0.1"\n---\n');
    git(topo.a.board, ["init", "-b", "main"]);
    const { err } = await runSync(home, ["--establish", "--dir", topo.a.root]);
    assert.equal(err?.code, "RUNTIME");
    assert.match(err?.message ?? "", /\.git/);
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("establish refusal: a 'board/…' namespace branch blocks (uncreatable-ref hazard), named in details", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    git(topo.a.root, ["branch", `${BOARD_BRANCH}/stray`]);
    await initPlainBundleDir(topo.a);
    const { err } = await runSync(home, ["--establish", "--dir", topo.a.root]);
    assert.equal(err?.code, "RUNTIME");
    assert.deepEqual(err?.details?.conflicting_branches, [`${BOARD_BRANCH}/stray (local)`]);
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

test("establish refusal: unreachable origin classifies TRANSIENT", async () => {
  const topo = await makeGreenfieldTopology();
  const { home, cleanup } = await tempHome();
  try {
    await initPlainBundleDir(topo.a);
    git(topo.a.root, ["remote", "set-url", "origin", "https://127.0.0.1:1/nope.git"]);
    const { err } = await runSync(home, ["--establish", "--dir", topo.a.root]);
    assert.equal(err?.code, "TRANSIENT");
  } finally {
    await cleanup();
    await topo.cleanup();
  }
});

// ── USAGE guards ───────────────────────────────────────────────────────────────

test("sync flag combinations: --establish is mutually exclusive with --pull-only / --migrate / --show-incoming", async () => {
  const { home, cleanup } = await tempHome();
  try {
    for (const argv of [
      ["--establish", "--pull-only"],
      ["--establish", "--migrate"],
      ["--establish", "--show-incoming", "some/id"],
    ]) {
      const { err } = await runSync(home, argv);
      assert.equal(err?.code, "USAGE", `expected USAGE for ${JSON.stringify(argv)}`);
    }
  } finally {
    await cleanup();
  }
});
