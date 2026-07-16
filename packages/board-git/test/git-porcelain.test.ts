/**
 * U1 acceptance suite for the git porcelain layer (`src/porcelain.ts` + `src/diff.ts` +
 * `classifyGitError` in `src/errors.ts`), consuming the U0 harness (`./git-harness.ts`).
 * Failures are asserted on the tier's OWN `BoardGitError` code; the code→exit/envelope
 * projection is pinned by the CLI's `test/board-git-errors.test.ts` parity table (this package
 * never imports CLI source — the import-direction rule its own gate enforces on `src/`, honored
 * by the tests too). Every test named by [plans/sync-verb-implementation] §U1:
 *
 *   staged/unstaged user code untouched (any branch) · new/modified/deleted doc committed ·
 *   env-leak override (GIT_DIR set → `-C` still wins) · ff-only swallow matrix · conflict →
 *   detect+collect+CLEAN abort (worktree pristine, NO export file) · GIT_BUSY structured-retry
 *   envelope against the held-index.lock fixture · non-empty-dir refusal · already-checked-out
 *   idempotence · commit-grammar strings (incl. never-"1 docs", multi-actor) · changesSince
 *   actor-from-frontmatter (git author ≠ frontmatter actor → frontmatter wins) · dangling-cursor
 *   guard.
 *
 * Hermeticity: the porcelain under test spreads the AMBIENT env (scrubbing only
 * GIT_DIR/GIT_WORK_TREE/GIT_INDEX_FILE), so this suite pins identity + neutralizes host git
 * config via process.env BEFORE any fixture is built — commits made by `stageAndCommit` never
 * depend on a developer's ~/.gitconfig.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { mkdtemp, rm, writeFile, readFile, rename } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  BOARD_BRANCH,
  BUNDLE_DIR,
  git,
  gitTry,
  makeTwoCloneTopology,
  deprovisionBoard,
  writeBoardDoc,
  modifyBoardDoc,
  deleteBoardDoc,
  readBoardFile,
  commitBoard,
  boardHead,
  pushBoard,
  divergeSameDoc,
  divergeDifferentDoc,
  danglingCursorSha,
  wedgeMidRebase,
  isMidRebase,
  holdIndexLock,
  plantDirtyUserCode,
  plantStagedUserCode,
  plantNonEmptyBundleDir,
  originBoardHead,
  type BoardRepo,
} from "./git-harness.js";

import {
  isProvisioned,
  provisionBoardWorktree,
  runGit,
  detectStaleRebase,
  abortStaleRebase,
  stageAndCommit,
  fetchRebase,
  push,
  ffPull,
  changesSince,
  diffDocsBetween,
  unpushedCount,
  classifyGitError,
  isBoardGitError,
} from "../src/index.js";

// ── hermetic ambient env (the porcelain inherits process.env; pin identity + neutralize host
//    config so `stageAndCommit`'s commits work on any machine, gitconfig or not) ──────────────
process.env.GIT_CONFIG_SYSTEM = "/dev/null";
process.env.GIT_CONFIG_GLOBAL = "/dev/null";
process.env.GIT_CONFIG_NOSYSTEM = "1";
process.env.GIT_AUTHOR_NAME = "Porcelain Suite";
process.env.GIT_AUTHOR_EMAIL = "porcelain@example.invalid";
process.env.GIT_COMMITTER_NAME = "Porcelain Suite";
process.env.GIT_COMMITTER_EMAIL = "porcelain@example.invalid";

/** git status --porcelain lines for a repo dir. */
function porcelain(dir: string): string[] {
  return git(dir, ["status", "--porcelain"]).split("\n").filter((l) => l.length > 0);
}

/** Run `fn`, asserting it throws, and RETURN the thrown value (node:assert.throws returns void). */
function capture(fn: () => unknown): unknown {
  try {
    fn();
  } catch (err) {
    return err;
  }
  assert.fail("expected the call to throw");
}

/** Commit subject / body of a board worktree's HEAD. */
function headSubject(boardDir: string): string {
  return git(boardDir, ["log", "-1", "--format=%s"]).trim();
}
function headBody(boardDir: string): string {
  return git(boardDir, ["log", "-1", "--format=%b"]);
}

/** Plant a second repository's `board` worktree at another repo's conventional board path. */
async function plantForeignBoardWorktreeAt(scratchDir: string, boardPath: string): Promise<string> {
  const foreignRoot = path.join(scratchDir, "foreign");
  git(scratchDir, ["init", "-b", "main", foreignRoot]);
  await writeFile(path.join(foreignRoot, "README.md"), "# foreign project\n");
  git(foreignRoot, ["add", "-A"]);
  git(foreignRoot, ["commit", "-m", "foreign: initial"]);
  git(foreignRoot, ["checkout", "--orphan", BOARD_BRANCH]);
  git(foreignRoot, ["rm", "-rf", "."]);
  await writeFile(path.join(foreignRoot, "foreign.md"), "# Foreign board\n");
  git(foreignRoot, ["add", "-A"]);
  git(foreignRoot, ["commit", "-m", "foreign: board"]);
  git(foreignRoot, ["checkout", "main"]);
  git(foreignRoot, ["worktree", "add", boardPath, BOARD_BRANCH]);
  return foreignRoot;
}

// ── user code untouched (staged + unstaged, any branch) ───────────────────────

test("user code untouched: staged + unstaged main-worktree changes survive commit/push/ffPull on ANY branch", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    // "Any branch": the user is mid-feature, not on main.
    git(topo.a.root, ["checkout", "-b", "feature/wip"]);
    const dirty = await plantDirtyUserCode(topo.a);
    const staged = await plantStagedUserCode(topo.a);
    const rootBefore = porcelain(topo.a.root).sort();

    await writeBoardDoc(topo.a, "tasks/u1", { frontmatter: { type: "Task", title: "U1", actor: "mike" }, body: "# U1\n" });
    const commit = stageAndCommit(topo.a.board);
    assert.equal(commit.committed, true);
    push(topo.a.board);
    assert.deepEqual(ffPull(topo.a.board), { updated: false });

    assert.equal(git(topo.a.root, ["rev-parse", "--abbrev-ref", "HEAD"]).trim(), "feature/wip");
    assert.deepEqual(porcelain(topo.a.root).sort(), rootBefore, "user-code status byte-identical");
    const lines = porcelain(topo.a.root);
    assert.ok(lines.some((l) => l.startsWith(" M") && l.includes(dirty)), "unstaged edit still unstaged");
    assert.ok(lines.some((l) => l.startsWith("A ") && l.includes(staged)), "staged file still staged");
  } finally {
    await topo.cleanup();
  }
});

// ── new / modified / deleted docs cross the wire ──────────────────────────────

test("stageAndCommit: new, modified, AND deleted docs are committed with the right verbs", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    await writeBoardDoc(topo.a, "tasks/fresh", { frontmatter: { type: "Task", title: "Fresh", actor: "mike" }, body: "# Fresh\n" });
    await modifyBoardDoc(topo.a, "tasks/seed-one", { body: "# Seed one\n\nEDITED\n" });
    await deleteBoardDoc(topo.a, "notes/welcome");

    const r = stageAndCommit(topo.a.board);
    assert.equal(r.committed, true);
    assert.ok(r.sha);
    const byId = new Map(r.docs.map((d) => [d.docId, d]));
    assert.equal(byId.get("tasks/fresh")?.verb, "added");
    assert.equal(byId.get("tasks/seed-one")?.verb, "updated");
    assert.equal(byId.get("notes/welcome")?.verb, "deleted");
    // The deletion's kind/actor come from the OUTGOING (HEAD) version's frontmatter.
    assert.equal(byId.get("notes/welcome")?.kind, "Note");
    assert.equal(byId.get("notes/welcome")?.actor, "mike");

    assert.equal(porcelain(topo.a.board).length, 0, "clean after commit");
    // All three cross the wire.
    push(topo.a.board);
    const pull = ffPull(topo.b.board);
    assert.deepEqual(pull, { updated: true });
    assert.match(await readBoardFile(topo.b, "tasks/fresh.md"), /Fresh/);
    assert.match(await readBoardFile(topo.b, "tasks/seed-one.md"), /EDITED/);
    assert.ok(!existsSync(path.join(topo.b.board, "notes", "welcome.md")), "deletion crossed");
  } finally {
    await topo.cleanup();
  }
});

test("stageAndCommit: nothing to commit is an idempotent no-op", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    const head = boardHead(topo.a);
    assert.deepEqual(stageAndCommit(topo.a.board), { committed: false, docs: [] });
    assert.equal(boardHead(topo.a), head, "HEAD unmoved");
  } finally {
    await topo.cleanup();
  }
});

// ── env-leak override ─────────────────────────────────────────────────────────

test("env leak: inherited GIT_DIR/GIT_WORK_TREE/GIT_INDEX_FILE are scrubbed — `-C` still wins", async () => {
  const topo = await makeTwoCloneTopology();
  const saved = {
    dir: process.env.GIT_DIR,
    work: process.env.GIT_WORK_TREE,
    index: process.env.GIT_INDEX_FILE,
  };
  try {
    process.env.GIT_DIR = "/nonexistent/leaked.git";
    process.env.GIT_WORK_TREE = "/nonexistent/leaked-tree";
    process.env.GIT_INDEX_FILE = "/nonexistent/leaked-index";
    await writeBoardDoc(topo.a, "tasks/leak", { frontmatter: { type: "Task", title: "Leak", actor: "mike" }, body: "# Leak\n" });
    const r = stageAndCommit(topo.a.board);
    assert.equal(r.committed, true, "commit lands in the board worktree, not the leaked GIT_DIR");
    assert.equal(unpushedCount(topo.a.board), 1);
  } finally {
    if (saved.dir === undefined) delete process.env.GIT_DIR;
    else process.env.GIT_DIR = saved.dir;
    if (saved.work === undefined) delete process.env.GIT_WORK_TREE;
    else process.env.GIT_WORK_TREE = saved.work;
    if (saved.index === undefined) delete process.env.GIT_INDEX_FILE;
    else process.env.GIT_INDEX_FILE = saved.index;
    await topo.cleanup();
  }
});

// ── ff-only swallow matrix ────────────────────────────────────────────────────

test("ffPull swallow matrix: not-a-repo (bare mkdtemp)", async () => {
  const bare = await mkdtemp(path.join(tmpdir(), "aslite-not-a-repo-"));
  try {
    assert.deepEqual(ffPull(bare), { updated: false, swallowed: "not-a-repo" });
    assert.deepEqual(ffPull(path.join(bare, "missing-subdir")), { updated: false, swallowed: "not-a-repo" });
  } finally {
    await rm(bare, { recursive: true, force: true });
  }
});

test("ffPull swallow matrix: no remote / no upstream (git remote remove origin)", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    git(topo.a.root, ["remote", "remove", "origin"]);
    const r = ffPull(topo.a.board);
    assert.equal(r.updated, false);
    assert.equal(r.swallowed, "no-upstream");
  } finally {
    await topo.cleanup();
  }
});

test("ffPull swallow matrix: detached HEAD in the board worktree", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    git(topo.a.board, ["checkout", "--detach"]);
    assert.deepEqual(ffPull(topo.a.board), { updated: false, swallowed: "detached-head" });
  } finally {
    await topo.cleanup();
  }
});

test("ffPull swallow matrix: divergence refuses ff and is swallowed", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    await divergeSameDoc(topo);
    assert.deepEqual(ffPull(topo.b.board), { updated: false, swallowed: "diverged" });
  } finally {
    await topo.cleanup();
  }
});

test("ffPull swallow matrix: dirty-worktree overwrite refusal is swallowed", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    await modifyBoardDoc(topo.a, "tasks/seed-one", { body: "# Seed one\n\nA's push\n" });
    commitBoard(topo.a, "board: A edits");
    pushBoard(topo.a);
    // B has an UNCOMMITTED edit to the same file the incoming ff would rewrite.
    await modifyBoardDoc(topo.b, "tasks/seed-one", { body: "# Seed one\n\nB uncommitted\n" });
    assert.deepEqual(ffPull(topo.b.board), { updated: false, swallowed: "dirty" });
    assert.match(await readBoardFile(topo.b, "tasks/seed-one.md"), /B uncommitted/, "local edit intact");
  } finally {
    await topo.cleanup();
  }
});

test("ffPull swallow matrix: unreachable remote is swallowed (best-effort auth/network); merge still runs against last-known origin/board", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    git(topo.a.root, ["remote", "set-url", "origin", "/nonexistent/black-hole.git"]);
    const r = ffPull(topo.a.board);
    assert.equal(r.updated, false, "already at last-known origin/board");
    // Local-path transport reports "does not appear to be a git repository" — classified AUTH
    // per the DOCUMENTED best-effort heuristic (GitHub answers not-found for unauthorized).
    assert.equal(r.swallowed, "auth");
  } finally {
    await topo.cleanup();
  }
});

test("ffPull: fast-forwards when origin/board is ahead", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    await modifyBoardDoc(topo.a, "tasks/seed-two", { body: "# Seed two\n\nfrom A\n" });
    commitBoard(topo.a, "board: A edits seed-two");
    pushBoard(topo.a);
    assert.deepEqual(ffPull(topo.b.board), { updated: true });
    assert.match(await readBoardFile(topo.b, "tasks/seed-two.md"), /from A/);
    assert.deepEqual(ffPull(topo.b.board), { updated: false }, "second pull is a clean no-op");
  } finally {
    await topo.cleanup();
  }
});

// ── conflict: detect + collect + CLEAN abort (adjudication A — zero data movement) ─

test("fetchRebase: same-doc divergence → conflict DETECTED, ids collected, clean abort, worktree pristine, NO export file", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    const d = await divergeSameDoc(topo);
    const r = fetchRebase(topo.b.board);
    assert.deepEqual(r, { status: "conflict", conflictedDocIds: ["tasks/seed-one"] });
    assert.ok(!isMidRebase(topo.b), "no mid-rebase state left behind");
    assert.equal(porcelain(topo.b.board).length, 0, "worktree pristine (no export/untracked files)");
    assert.equal(boardHead(topo.b), d.bHead, "local board HEAD restored — zero data movement");
    assert.match(await readBoardFile(topo.b, d.docPath), /changed by B/, "B's version untouched");
  } finally {
    await topo.cleanup();
  }
});

test("fetchRebase: different-doc divergence replays cleanly (no conflict)", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    await divergeDifferentDoc(topo);
    assert.deepEqual(fetchRebase(topo.b.board), { status: "clean" });
    assert.ok(!isMidRebase(topo.b));
    // Both sides' edits are present after the replay.
    assert.match(await readBoardFile(topo.b, "tasks/seed-one.md"), /changed by A/);
    assert.match(await readBoardFile(topo.b, "tasks/seed-two.md"), /changed by B/);
  } finally {
    await topo.cleanup();
  }
});

// ── stale-rebase detect + abort (consumed at sync entry, adjudication C) ──────

test("detectStaleRebase/abortStaleRebase: a wedged mid-rebase worktree is detected and aborted clean", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    const d = await wedgeMidRebase(topo);
    assert.equal(detectStaleRebase(topo.b.board), true);
    abortStaleRebase(topo.b.board);
    assert.equal(detectStaleRebase(topo.b.board), false);
    assert.ok(!isMidRebase(topo.b));
    assert.equal(porcelain(topo.b.board).length, 0, "pristine after abort");
    assert.equal(boardHead(topo.b), d.bHead, "restored to the pre-rebase local tip");
  } finally {
    await topo.cleanup();
  }
});

// ── GIT_BUSY: structured retry envelope against the held-index.lock fixture ───

test("GIT_BUSY: a held index.lock yields a structured RETRY envelope, never a raw git strand", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    await writeBoardDoc(topo.a, "tasks/busy", { frontmatter: { type: "Task", title: "Busy", actor: "mike" }, body: "# Busy\n" });
    const lock = holdIndexLock(topo.a);
    try {
      const err = capture(() => stageAndCommit(topo.a.board));
      assert.ok(isBoardGitError(err));
      assert.equal(err.code, "GIT_BUSY");
      assert.equal(err.details?.retryable, true, "the structured-retry signal");
      // exit/envelope projection: the CLI's parity table (test/board-git-errors.test.ts).
      assert.doesNotMatch(err.message, /fatal:|Unable to create/i, "no raw git strand");
    } finally {
      lock.release();
    }
    // Once released, the same op succeeds — the envelope's retry advice is true.
    assert.equal(stageAndCommit(topo.a.board).committed, true);
  } finally {
    await topo.cleanup();
  }
});

// ── provisioning: self-heal, refusal, idempotence ─────────────────────────────

test("provision: fresh unprovisioned clone self-heals from origin/board; isProvisioned tracks it", async () => {
  const topo = await makeTwoCloneTopology({ provision: false });
  try {
    assert.equal(isProvisioned(topo.a.root), false);
    const r = provisionBoardWorktree(topo.a.root);
    assert.equal(r.kind, "provisioned");
    assert.ok(r.kind === "provisioned" && existsSync(path.join(r.boardPath, "index.md")), "bundle at board root");
    assert.equal(isProvisioned(topo.a.root), true);
    // Idempotent: a second call is "already".
    assert.equal(provisionBoardWorktree(topo.a.root).kind, "already");
  } finally {
    await topo.cleanup();
  }
});

test("provision: deprovisioned clone re-provisions (self-heal), and works from a subdirectory of the repo", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    deprovisionBoard(topo.a);
    assert.equal(isProvisioned(topo.a.root), false);
    const r = provisionBoardWorktree(path.join(topo.a.root, "src"));
    assert.equal(r.kind, "provisioned");
    assert.equal(isProvisioned(topo.a.root), true);
  } finally {
    await topo.cleanup();
  }
});

test("provision: pre-existing EMPTY .agentstate-lite dir is resolved (removed, then added)", async () => {
  const topo = await makeTwoCloneTopology({ provision: false });
  try {
    mkdirSync(topo.a.board, { recursive: true });
    const r = provisionBoardWorktree(topo.a.root);
    assert.equal(r.kind, "provisioned");
    assert.ok(existsSync(path.join(topo.a.board, "index.md")));
  } finally {
    await topo.cleanup();
  }
});

test("provision: pre-existing NON-EMPTY non-worktree .agentstate-lite is REFUSED with guidance (never a blind add)", async () => {
  const topo = await makeTwoCloneTopology({ provision: false });
  try {
    await plantNonEmptyBundleDir(topo.a);
    assert.equal(isProvisioned(topo.a.root), false, "a plain non-empty dir is not 'provisioned'");
    const err = capture(() => provisionBoardWorktree(topo.a.root));
    assert.ok(isBoardGitError(err));
    assert.equal(err.code, "RUNTIME");
    assert.match(err.message, /move it aside/i, "guidance, not a raw git error");
    assert.ok(err.help, "carries a fixing command");
    assert.ok(existsSync(path.join(topo.a.board, "stray.md")), "the pre-existing content is untouched");
  } finally {
    await topo.cleanup();
  }
});

test("provision: board branch checked out at a NON-conventional path = idempotent success (already)", async () => {
  const topo = await makeTwoCloneTopology({ provision: false });
  try {
    // Check the board branch out somewhere else, so the conventional add hits git's
    // "already checked out" refusal.
    git(topo.a.root, ["fetch", "origin"]);
    git(topo.a.root, ["worktree", "add", "--no-track", "-b", BOARD_BRANCH, path.join(topo.a.root, "elsewhere"), `origin/${BOARD_BRANCH}`]);
    const r = provisionBoardWorktree(topo.a.root);
    assert.equal(r.kind, "already");
  } finally {
    await topo.cleanup();
  }
});

test("provisionBoardWorktree: a FOREIGN repo's board worktree at .agentstate-lite is refused, and the emitted remedy is executable verbatim", async () => {
  const topo = await makeTwoCloneTopology({ provision: false });
  try {
    const foreignRoot = await plantForeignBoardWorktreeAt(topo.dir, topo.a.board);
    assert.equal(git(topo.a.board, ["rev-parse", "--abbrev-ref", "HEAD"]).trim(), BOARD_BRANCH);
    assert.notEqual(
      git(topo.a.board, ["rev-parse", "--git-common-dir"]).trim(),
      git(topo.a.root, ["rev-parse", "--git-common-dir"]).trim(),
      "precondition: the checkout belongs to the foreign repo, despite sitting at this repo's board path",
    );
    assert.equal(isProvisioned(topo.a.root), false, "a foreign board worktree is not provisioned");

    const err = capture(() => provisionBoardWorktree(topo.a.root));
    assert.ok(isBoardGitError(err));
    assert.equal(err.code, "RUNTIME");
    assert.match(err.message, /belongs to a different git repository/i);
    assert.match(err.message, new RegExp(topo.a.root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.ok(err.help, "carries a fixing command");
    assert.ok(
      err.help.startsWith(`mv '${topo.a.board}' '${topo.a.board}.bak'`),
      "remedy uses absolute paths, so it works from any invocation directory",
    );

    const command = err.help.split("  # ")[0]!;
    execFileSync("/bin/sh", ["-c", command], { cwd: foreignRoot, stdio: "pipe" });
    assert.equal(existsSync(topo.a.board), false, "verbatim remedy moved the foreign checkout aside");
    assert.equal(existsSync(`${topo.a.board}.bak`), true, "backup path exists for manual recovery");
  } finally {
    await topo.cleanup();
  }
});

// ── worktree portability: relative pointers + repair self-heal (2026-07-08 field finding) ─────

test("provision: a FRESH worktree add writes RELATIVE pointers when the running git supports it (feature-gated on git capability, never on a version string)", async () => {
  const topo = await makeTwoCloneTopology({ provision: false });
  try {
    const r = provisionBoardWorktree(topo.a.root);
    assert.equal(r.kind, "provisioned");
    const gitFile = (await readFile(path.join(topo.a.board, ".git"), "utf8")).trim();
    assert.match(gitFile, /^gitdir:\s*/);
    const isRelative = !gitFile.slice("gitdir:".length).trim().startsWith("/");
    if (isRelative) {
      assert.match(gitFile, /^gitdir:\s*\.\./, "git >= 2.48: a fresh add writes a relative pointer");
    } else {
      // The running git predates 2.48 (worktree.useRelativePaths is an unknown config key, silently
      // ignored) — the absolute fallback must still work end-to-end; the relative-form assertion
      // is a no-op on this machine rather than a failure.
      console.log(
        `NOTE: running git does not support worktree.useRelativePaths (observed absolute pointer: ${gitFile}) — relative-path assertion skipped`,
      );
    }
    assert.equal(isProvisioned(topo.a.root), true);
  } finally {
    await topo.cleanup();
  }
});

test("provisionBoardWorktree: THE MOUNT-MOVE FIELD FINDING — stale ABSOLUTE pointers (repo moved/remounted) self-repair via `git worktree repair`; outcome 'repaired'; worktree fully functional afterward", async () => {
  // provision:true — the harness's own raw `worktree add` (no relative-paths config) writes
  // ABSOLUTE pointers, exactly the pre-2.48-shaped state a sandbox/devcontainer mount-move breaks.
  const topo = await makeTwoCloneTopology();
  try {
    const staleGitFile = (await readFile(path.join(topo.a.board, ".git"), "utf8")).trim();
    assert.match(staleGitFile, /^gitdir:\s*\//, "precondition: the harness's own provisioning wrote ABSOLUTE pointers");

    const movedRoot = path.join(path.dirname(topo.a.root), `moved-${path.basename(topo.a.root)}`);
    await rename(topo.a.root, movedRoot);
    const movedBoard = path.join(movedRoot, BUNDLE_DIR);

    // From the moved location, the linked worktree's OWN git plumbing is entirely broken — exactly
    // the sandbox field finding (it reads as "not a git repository" from its own directory).
    assert.notEqual(
      gitTry(movedBoard, ["rev-parse", "--show-toplevel"]).status,
      0,
      "the moved worktree's own git plumbing is broken pre-repair",
    );
    assert.equal(isProvisioned(movedRoot), false, "reads as unprovisioned pre-repair");

    const outcome = provisionBoardWorktree(movedRoot);
    assert.equal(outcome.kind, "repaired");
    assert.equal(outcome.boardPath, movedBoard);
    assert.equal(isProvisioned(movedRoot), true, "healthy after repair");

    const repairedGitFile = (await readFile(path.join(movedBoard, ".git"), "utf8")).trim();
    assert.ok(!repairedGitFile.includes(topo.a.root), `no longer pointing at the OLD path: ${repairedGitFile}`);

    // End-to-end: the repaired worktree is a genuinely FUNCTIONAL linked worktree, not merely
    // readable — commit, push, and a teammate's pull all still work against it.
    const movedRepo: BoardRepo = { name: "A-moved", root: movedRoot, board: movedBoard };
    await modifyBoardDoc(movedRepo, "tasks/seed-one", { body: "# Seed one\n\npost-repair edit\n" });
    const commit = stageAndCommit(movedRepo.board);
    assert.equal(commit.committed, true);
    push(movedRepo.board);
    assert.deepEqual(ffPull(topo.b.board), { updated: true });
    assert.match(await readBoardFile(topo.b, "tasks/seed-one.md"), /post-repair edit/);
  } finally {
    await topo.cleanup();
  }
});

test("provisionBoardWorktree: a worktree signature repair CANNOT fix refuses with REWORDED guidance (never phrased as if it were foreign junk)", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    const gitFileContent = (await readFile(path.join(topo.a.board, ".git"), "utf8")).trim();
    const m = /^gitdir:\s*(.+)$/.exec(gitFileContent);
    assert.ok(m, "expected a gitdir: line");
    // Break the worktree BEYOND repair: delete its git-internal registration entirely (the main
    // repo's per-worktree admin dir) while leaving the `.git` FILE — the worktree SIGNATURE —
    // untouched, so `hasWorktreeSignature` still reads true and the repair path is attempted.
    const adminDir = path.resolve(topo.a.board, m![1]!);
    await rm(adminDir, { recursive: true, force: true });

    const err = capture(() => provisionBoardWorktree(topo.a.root));
    assert.ok(isBoardGitError(err));
    assert.equal(err.code, "RUNTIME");
    assert.match(
      err.message,
      /stale pointers that 'git worktree repair' could not fix/i,
      "reworded to name what was actually observed",
    );
    assert.doesNotMatch(err.message, /is not the shared board checkout/i, "distinct from the plain-foreign wording");
    assert.match(err.help ?? "", /^mv /, "still a non-destructive mv, never rm");
    assert.ok(existsSync(path.join(topo.a.board, "tasks", "seed-one.md")), "pre-existing bundle CONTENT is untouched");
  } finally {
    await topo.cleanup();
  }
});

// ── cold-review finding: a HEALTHY worktree that just isn't genuinely `board` ──────────────────
//
// `git worktree repair` exits 0 (a true no-op) on a worktree whose pointers were NEVER stale —
// so a bare "did the plumbing resolve" recheck after repair cannot, by itself, prove the worktree
// is genuinely the shared board checkout. Two ways a healthy-but-wrong worktree can sit at
// `.agentstate-lite`: checked out to some OTHER branch entirely, or left on a plain detached HEAD
// for a reason that has NOTHING to do with sync's own rebase machinery. Both must REFUSE, never
// silently adopt the directory as "repaired" — the U3a #1 never-touch guarantee is about content
// as much as location: sync must never commit/rebase/push whatever happens to be checked out at
// the conventional path.

test("provisionBoardWorktree: a HEALTHY worktree checked out to a DIFFERENT branch entirely is refused, never silently adopted as 'repaired'", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    // The worktree's OWN git plumbing is perfectly fine — just parked on an unrelated branch (a
    // teammate's own sidecar use of the same conventional path, or a stray manual checkout).
    git(topo.a.board, ["checkout", "-b", "totally-unrelated-branch"]);
    assert.equal(isProvisioned(topo.a.root), false, "not provisioned: HEAD isn't board");

    const before = git(topo.a.board, ["rev-parse", BOARD_BRANCH]).trim();
    const err = capture(() => provisionBoardWorktree(topo.a.root));
    assert.ok(isBoardGitError(err));
    assert.equal(err.code, "RUNTIME");
    assert.match(err.message, /not checked out to the '?board'? branch/i, "names the actual observed state");
    assert.doesNotMatch(err.message, /stale pointers/i, "distinct from the unrepairable-pointers wording");
    assert.doesNotMatch(err.message, /is not the shared board checkout/i, "distinct from the plain-foreign wording");
    assert.match(err.help ?? "", /^mv /, "still a non-destructive mv, never rm");

    // Never silently adopted: the board branch's own tip is untouched, and the checked-out branch
    // (and its content) survives exactly as it was.
    assert.equal(git(topo.a.board, ["rev-parse", BOARD_BRANCH]).trim(), before, "board ref unmoved");
    assert.equal(git(topo.a.board, ["rev-parse", "--abbrev-ref", "HEAD"]).trim(), "totally-unrelated-branch");
  } finally {
    await topo.cleanup();
  }
});

test("provisionBoardWorktree: a HEALTHY worktree on a plain detached HEAD (NOT mid-rebase) is refused, never silently adopted as 'repaired'", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    // Detach for a reason that has nothing to do with sync's own rebase machinery.
    git(topo.a.board, ["checkout", "--detach"]);
    assert.notEqual(gitTry(topo.a.board, ["symbolic-ref", "-q", "HEAD"]).status, 0, "genuinely detached");
    assert.equal(isMidRebase(topo.a), false, "sanity: NOT mid-rebase — the discriminator this test targets");
    assert.equal(isProvisioned(topo.a.root), false);

    const err = capture(() => provisionBoardWorktree(topo.a.root));
    assert.ok(isBoardGitError(err));
    assert.equal(err.code, "RUNTIME");
    assert.match(err.message, /not checked out to the '?board'? branch/i, "names the actual observed state");
    assert.match(err.help ?? "", /^mv /, "still a non-destructive mv, never rm");
    assert.ok(existsSync(path.join(topo.a.board, "tasks", "seed-one.md")), "pre-existing bundle CONTENT is untouched");
  } finally {
    await topo.cleanup();
  }
});

test("provisionBoardWorktree: the LEGITIMATE composite (moved + genuinely wedged mid-rebase FROM board) still resolves to 'repaired' — the wrong-branch guard does not regress this case", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    const div = await wedgeMidRebase(topo);
    assert.ok(isMidRebase(topo.b));
    const movedRoot = path.join(path.dirname(topo.b.root), `moved-${path.basename(topo.b.root)}`);
    await rename(topo.b.root, movedRoot);
    const outcome = provisionBoardWorktree(movedRoot);
    assert.equal(outcome.kind, "repaired", "a genuine board-originated wedge survives the tightened check");
    assert.ok(div.docId, "sanity: the divergence fixture actually produced a conflicted doc id");
  } finally {
    await topo.cleanup();
  }
});

test("provisionBoardWorktree: PROBE-E (cold review) — a wedge started from a NON-board branch, then moved, REFUSES rather than silently returning 'repaired'", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    const board = topo.a.board;
    // Two sibling branches, NEITHER of them `board`, diverging on the same file — a genuine
    // conflict that has NOTHING to do with the board branch at all.
    git(board, ["checkout", "-b", "not-board"]);
    await writeFile(path.join(board, "scratch.txt"), "A\n");
    git(board, ["add", "-A"]);
    git(board, ["commit", "-m", "not-board: base"]);

    git(board, ["checkout", "-b", "not-board-side"]);
    await writeFile(path.join(board, "scratch.txt"), "B\n");
    git(board, ["add", "-A"]);
    git(board, ["commit", "-m", "not-board-side: edit"]);

    git(board, ["checkout", "not-board"]);
    await writeFile(path.join(board, "scratch.txt"), "C\n");
    git(board, ["add", "-A"]);
    git(board, ["commit", "-m", "not-board: edit"]);

    const r = gitTry(board, ["rebase", "not-board-side"]);
    assert.notEqual(r.status, 0, "sanity: the rebase conflicted");
    assert.ok(isMidRebase(topo.a), "sanity: genuinely wedged, and NOT from board");

    const movedRoot = path.join(path.dirname(topo.a.root), `moved-${path.basename(topo.a.root)}`);
    await rename(topo.a.root, movedRoot);

    const err = capture(() => provisionBoardWorktree(movedRoot));
    assert.ok(isBoardGitError(err), "must REFUSE — rebaseWasFromBoardBranch is false here, so repairedWorktreeIsBoard must reject it despite being mid-rebase");
    assert.equal(err.code, "RUNTIME");
    assert.match(err.message, /not checked out to the '?board'? branch/i, "the wrong-branch wording, not a false 'repaired'");
    assert.match(err.help ?? "", /^mv /, "still a non-destructive mv, never rm");
  } finally {
    await topo.cleanup();
  }
});

test("provision: not a git repo at all → no_repo (caller emits `sync: nothing to sync`)", async () => {
  const bare = await mkdtemp(path.join(tmpdir(), "aslite-no-repo-"));
  try {
    assert.deepEqual(provisionBoardWorktree(bare), { kind: "no_repo" });
    assert.equal(isProvisioned(bare), false);
  } finally {
    await rm(bare, { recursive: true, force: true });
  }
});

test("provision: a repo with NO board branch anywhere → no_board", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-no-board-"));
  try {
    git(dir, ["init", "-b", "main", "."]);
    await writeFile(path.join(dir, "README.md"), "# plain repo\n");
    git(dir, ["add", "-A"]);
    git(dir, ["commit", "-m", "initial"]);
    assert.deepEqual(provisionBoardWorktree(dir), { kind: "no_board", remoteState: "absent" });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("provision: a timed-out remote check degrades to unknown within the supplied budget", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-board-timeout-"));
  try {
    git(dir, ["init", "-b", "main", "."]);
    await writeFile(path.join(dir, "README.md"), "# plain repo\n");
    git(dir, ["add", "-A"]);
    git(dir, ["commit", "-m", "initial"]);
    git(dir, ["remote", "add", "origin", "ext::sleep 2"]);
    git(dir, ["config", "protocol.ext.allow", "always"]);

    const started = Date.now();
    assert.deepEqual(provisionBoardWorktree(dir, { fetchTimeoutMs: 100 }), {
      kind: "no_board",
      remoteState: "unknown",
    });
    assert.ok(Date.now() - started < 1_000, "the sleeping remote was abandoned inside the budget");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── commit grammar (test-pinned strings) ──────────────────────────────────────

test("commit grammar: single doc → `board: <actor> — <verb> <id>`; body carries verb-kind-id", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    await modifyBoardDoc(topo.a, "tasks/seed-one", { body: "# Seed one\n\ntweak\n" });
    const r = stageAndCommit(topo.a.board);
    assert.equal(r.subject, "board: mike — updated tasks/seed-one");
    assert.equal(headSubject(topo.a.board), "board: mike — updated tasks/seed-one");
    assert.match(headBody(topo.a.board), /^updated Task tasks\/seed-one$/m);
  } finally {
    await topo.cleanup();
  }
});

test("commit grammar: multi-doc single actor → `board: <actor> — N docs` (never `1 docs`)", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    await writeBoardDoc(topo.a, "tasks/g-one", { frontmatter: { type: "Task", title: "G1", actor: "mike" }, body: "# G1\n" });
    await writeBoardDoc(topo.a, "tasks/g-two", { frontmatter: { type: "Task", title: "G2", actor: "mike" }, body: "# G2\n" });
    const r = stageAndCommit(topo.a.board);
    assert.equal(r.subject, "board: mike — 2 docs");
    assert.doesNotMatch(r.subject ?? "", /\b1 docs\b/);
    const body = headBody(topo.a.board);
    assert.match(body, /^added Task tasks\/g-one$/m);
    assert.match(body, /^added Task tasks\/g-two$/m);
  } finally {
    await topo.cleanup();
  }
});

test("commit grammar: multi-actor → `board: N docs from M actors` (subject names actor only when exactly one)", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    await modifyBoardDoc(topo.a, "tasks/seed-one", { body: "# Seed one\n\nby mike\n" }); // actor mike
    await modifyBoardDoc(topo.a, "tasks/seed-two", { body: "# Seed two\n\nby brian\n" }); // actor brian
    await deleteBoardDoc(topo.a, "notes/welcome"); // actor mike (from HEAD frontmatter)
    const r = stageAndCommit(topo.a.board);
    assert.equal(r.subject, "board: 3 docs from 2 actors");
    assert.doesNotMatch(r.subject ?? "", /mike|brian/, "no single actor named in a multi-actor subject");
    const body = headBody(topo.a.board);
    assert.match(body, /^updated Task tasks\/seed-one$/m);
    assert.match(body, /^updated Task tasks\/seed-two$/m);
    assert.match(body, /^deleted Note notes\/welcome$/m);
  } finally {
    await topo.cleanup();
  }
});

// ── changesSince: enriched feed, actor FROM FRONTMATTER (adjudication F) ──────

test("changesSince: actor comes from the doc's FRONTMATTER, never the commit subject or git author", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    const cursor = boardHead(topo.b);
    // Git author AND commit subject both say alice; the doc's frontmatter says mike.
    await modifyBoardDoc(topo.a, "tasks/seed-one", { frontmatter: { actor: "mike" }, body: "# Seed one\n\nmoved\n" });
    commitBoard(topo.a, "board: alice — updated tasks/seed-one", { author: { name: "alice", email: "alice@example.invalid" } });
    pushBoard(topo.a);
    assert.deepEqual(ffPull(topo.b.board), { updated: true });

    const r = changesSince(topo.b.board, cursor);
    assert.ok(r.ok);
    assert.deepEqual(r.changes, [
      { docId: "tasks/seed-one", actor: "mike", verb: "updated", kind: "Task", title: "Seed one" },
    ]);
  } finally {
    await topo.cleanup();
  }
});

test("changesSince: created/updated/deleted enrichment (deletion attributed from the cursor snapshot)", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    const cursor = boardHead(topo.b);
    await writeBoardDoc(topo.a, "tasks/born", { frontmatter: { type: "Task", title: "Born", actor: "brian" }, body: "# Born\n" });
    await modifyBoardDoc(topo.a, "tasks/seed-two", { body: "# Seed two\n\nmoved\n" }); // actor brian (seed)
    await deleteBoardDoc(topo.a, "notes/welcome"); // actor mike in the outgoing frontmatter
    commitBoard(topo.a, "board: churn", { author: { name: "alice", email: "alice@example.invalid" } });
    pushBoard(topo.a);
    assert.deepEqual(ffPull(topo.b.board), { updated: true });

    const r = changesSince(topo.b.board, cursor);
    assert.ok(r.ok);
    const byId = new Map(r.changes.map((c) => [c.docId, c]));
    assert.equal(r.changes.length, 3);
    assert.deepEqual(byId.get("tasks/born"), { docId: "tasks/born", actor: "brian", verb: "added", kind: "Task", title: "Born" });
    assert.deepEqual(byId.get("tasks/seed-two"), { docId: "tasks/seed-two", actor: "brian", verb: "updated", kind: "Task", title: "Seed two" });
    assert.deepEqual(byId.get("notes/welcome"), { docId: "notes/welcome", actor: "mike", verb: "deleted", kind: "Note", title: "Welcome" });
    assert.ok(r.changes.every((c) => c.actor !== "alice" && c.actor !== "Harness Bot"), "git identity never leaks into attribution");
  } finally {
    await topo.cleanup();
  }
});

test("changesSince: cursor == HEAD → empty delta; reserved-file churn is not a doc change", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    const r = changesSince(topo.a.board, boardHead(topo.a));
    assert.deepEqual(r, { ok: true, changes: [] });
  } finally {
    await topo.cleanup();
  }
});

// ── dangling-cursor guard ─────────────────────────────────────────────────────

test("changesSince: a rewritten-away cursor SHA reports `dangling` — never a fatal, never a silent skip", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    const gone = await danglingCursorSha(topo.a);
    assert.deepEqual(changesSince(topo.a.board, gone), { ok: false, reason: "dangling" });
    // A live token still works.
    assert.deepEqual(changesSince(topo.a.board, boardHead(topo.a)), { ok: true, changes: [] });
  } finally {
    await topo.cleanup();
  }
});

// ── push + unpushedCount ──────────────────────────────────────────────────────

test("push + unpushedCount: local commits count against explicit origin/board; push advances origin", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    assert.equal(unpushedCount(topo.a.board), 0);
    await writeBoardDoc(topo.a, "tasks/p-one", { frontmatter: { type: "Task", title: "P1", actor: "mike" }, body: "# P1\n" });
    stageAndCommit(topo.a.board);
    await writeBoardDoc(topo.a, "tasks/p-two", { frontmatter: { type: "Task", title: "P2", actor: "mike" }, body: "# P2\n" });
    stageAndCommit(topo.a.board);
    assert.equal(unpushedCount(topo.a.board), 2);
    push(topo.a.board);
    assert.equal(unpushedCount(topo.a.board), 0);
    assert.equal(originBoardHead(topo), boardHead(topo.a), "origin/board advanced to the local tip");
    // No origin/board ref at all → null (distinct from "0 unpushed").
    git(topo.a.root, ["remote", "remove", "origin"]);
    assert.equal(unpushedCount(topo.a.board), null);
  } finally {
    await topo.cleanup();
  }
});

test("push: an unreachable remote throws a CLASSIFIED BoardGitError (best-effort AUTH), never a raw strand", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    await writeBoardDoc(topo.a, "tasks/stranded", { frontmatter: { type: "Task", title: "Stranded", actor: "mike" }, body: "# S\n" });
    stageAndCommit(topo.a.board);
    git(topo.a.root, ["remote", "set-url", "origin", "/nonexistent/black-hole.git"]);
    const err = capture(() => push(topo.a.board));
    assert.ok(isBoardGitError(err));
    // Local-path "does not appear to be a git repository" → the DOCUMENTED best-effort AUTH bucket.
    assert.equal(err.code, "AUTH_REQUIRED");
  } finally {
    await topo.cleanup();
  }
});

// ── classifyGitError unit matrix (stable signals → taxonomy) ──────────────────

test("classifyGitError: spawn ENOENT → GIT_MISSING (a distinct, branchable code)", () => {
  const err = classifyGitError({ args: ["fetch"], status: null, stdout: "", stderr: "", spawnErrorCode: "ENOENT" });
  assert.equal(err.code, "GIT_MISSING");
  assert.match(err.message, /isn't installed/);
});

test("classifyGitError: index.lock → GIT_BUSY with details.retryable", () => {
  const err = classifyGitError({
    args: ["add", "-A"],
    status: 128,
    stdout: "",
    stderr: "fatal: Unable to create '/repo/.git/worktrees/b/index.lock': File exists.\n\nAnother git process seems to be running in this repository...",
  });
  assert.equal(err.code, "GIT_BUSY");
  assert.equal(err.details?.retryable, true);
});

test("classifyGitError: missing origin / unresolvable origin/board → NO_UPSTREAM", () => {
  for (const stderr of [
    "fatal: 'origin' does not appear to be a git repository\nfatal: Could not read from remote repository.",
    "fatal: invalid upstream 'origin/board'",
    "merge: origin/board - not something we can merge",
    "fatal: couldn't find remote ref refs/heads/board",
  ]) {
    const err = classifyGitError({ args: ["rebase"], status: 1, stdout: "", stderr });
    assert.equal(err.code, "NO_UPSTREAM", stderr);
      assert.match(err.message, /isn't linked to a remote/);
  }
});

test("classifyGitError: credential signals → AUTH_REQUIRED (documented best-effort)", () => {
  for (const stderr of [
    "fatal: Authentication failed for 'https://github.com/x/y.git/'",
    "fatal: could not read Username for 'https://github.com': terminal prompts disabled",
    "git@github.com: Permission denied (publickey).",
    "ERROR: Repository not found.\nfatal: Could not read from remote repository.",
    "fatal: unable to access 'https://github.com/x/y.git/': The requested URL returned error: 403",
  ]) {
    const err = classifyGitError({ args: ["push"], status: 128, stdout: "", stderr });
    assert.equal(err.code, "AUTH_REQUIRED", stderr);
  }
});

test("classifyGitError: network signals → TRANSIENT, distinct from AUTH", () => {
  for (const f of [
    { stderr: "fatal: unable to access 'https://github.com/x/y.git/': Could not resolve host: github.com" },
    { stderr: "ssh: connect to host github.com port 22: Connection refused" },
    { stderr: "", timedOut: true },
  ]) {
    const err = classifyGitError({ args: ["fetch"], status: 128, stdout: "", stderr: f.stderr, timedOut: f.timedOut });
    assert.equal(err.code, "TRANSIENT", f.stderr || "(timeout)");
      assert.equal(err.details?.retryable, true);
  }
});

test("classifyGitError: unmerged-paths signals → CONFLICT; detached HEAD names the state", () => {
  const conflict = classifyGitError({
    args: ["merge"],
    status: 128,
    stdout: "",
    stderr: "error: Pulling is not possible because you have unmerged files.",
  });
  assert.equal(conflict.code, "CONFLICT");

  const detached = classifyGitError({
    args: ["push"],
    status: 128,
    stdout: "",
    stderr: "fatal: You are not currently on a branch.",
  });
  assert.equal(detached.code, "RUNTIME");
  assert.match(detached.message, /detached-HEAD/);
});

test("classifyGitError: anything else → structured RUNTIME carrying the op + first stderr line", () => {
  const err = classifyGitError({
    args: ["worktree", "add"],
    status: 128,
    stdout: "",
    stderr: "fatal: something entirely unexpected\nmore detail\n",
  });
  assert.equal(err.code, "RUNTIME");
  assert.equal(err.message, "git worktree failed: fatal: something entirely unexpected");
  assert.equal(err.details?.exit_status, 128);
});

// ── isProvisioned edge: a plain (non-worktree) dir never reads as provisioned ─

test("isProvisioned: false for a plain non-worktree .agentstate-lite dir (falls through to the parent repo)", async () => {
  const topo = await makeTwoCloneTopology({ provision: false });
  try {
    await plantNonEmptyBundleDir(topo.a);
    assert.equal(isProvisioned(topo.a.root), false);
    // And a genuine provision from clone B is unaffected by A's state.
    assert.equal(isProvisioned(topo.b.root), false);
    assert.equal(provisionBoardWorktree(topo.b.root).kind, "provisioned");
    assert.equal(isProvisioned(topo.b.root), true);
  } finally {
    await topo.cleanup();
  }
});

// ── time-box floor: non-positive timeoutMs never reaches spawnSync (PR#24 review, MEDIUM) ─

test("runGit timeoutMs <= 0: immediate TRANSIENT classification, NO child process spawned", async () => {
  // Node's spawnSync treats `timeout: 0` as NO timeout (empirically: it waits for the child
  // indefinitely), so a budget slice that decayed to 0 must never reach the spawn. The floor in
  // runGitBytes classifies it as an immediate fired timeout instead. NO-SPAWN PROOF: `git init`
  // has an observable side effect (creates `.git`) — after the call, the directory must be
  // untouched; and the call must return in microseconds, not a child-process round trip.
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-timeout-floor-"));
  try {
    for (const timeoutMs of [0, -5]) {
      const t0 = Date.now();
      let err: unknown = null;
      try {
        runGit(dir, ["init", "-b", "main", "."], { timeoutMs });
      } catch (e) {
        err = e;
      }
      assert.ok(Date.now() - t0 < 1_000, `must not wait on any child (timeoutMs ${timeoutMs})`);
      assert.ok(!existsSync(path.join(dir, ".git")), `git must never have run (timeoutMs ${timeoutMs})`);
      assert.ok(isBoardGitError(err));
      assert.equal(err.code, "TRANSIENT");
      assert.match(err.message, /timed out/);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── diffDocsBetween: the ONE consolidated ref-to-ref doc diff (changesSince + the receipt's
//    origin delta ride it; the prefix option is the in-tree seam, unused by today's callers) ──

test("diffDocsBetween: prefix scoping strips the prefix from doc ids, excludes outside-prefix paths, keeps reserved handling, survives non-ASCII paths", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-intree-diff-"));
  try {
    git(dir, ["init", "-b", "main", "."]);
    const bundle = path.join(dir, BUNDLE_DIR);
    mkdirSync(path.join(bundle, "tasks"), { recursive: true });
    await writeFile(path.join(bundle, "index.md"), "# Index\n");
    await writeFile(path.join(dir, "code.md"), "outside the prefix\n");
    git(dir, ["add", "-A"]);
    git(dir, ["commit", "-m", "base"]);
    const from = git(dir, ["rev-parse", "HEAD"]).trim();

    // Non-ASCII path pin: quotepath=off must hold through the prefix strip too.
    await writeFile(
      path.join(bundle, "tasks", "café.md"),
      "---\ntype: Task\ntitle: Café\nactor: mike\n---\n# C\n",
    );
    await writeFile(path.join(bundle, "index.md"), "# Index v2\n");
    await writeFile(path.join(dir, "code.md"), "changed outside\n");
    git(dir, ["add", "-A"]);
    git(dir, ["commit", "-m", "delta"]);
    const to = git(dir, ["rev-parse", "HEAD"]).trim();

    const scoped = diffDocsBetween(dir, from, to, { prefix: `${BUNDLE_DIR}/` });
    assert.deepEqual(scoped, [
      { docId: "tasks/café", actor: "mike", verb: "added", kind: "Task", title: "Café" },
    ]);
    // A bare prefix (no trailing slash) normalizes to the same scope.
    assert.deepEqual(diffDocsBetween(dir, from, to, { prefix: BUNDLE_DIR }), scoped);

    // UNSCOPED, the same range reports outside-prefix docs and prefix-qualified ids — exactly
    // the misattribution the prefix seam exists to prevent for in-tree mode.
    const unscoped = diffDocsBetween(dir, from, to);
    assert.deepEqual(
      unscoped.map((c) => c.docId).sort(),
      [`${BUNDLE_DIR}/tasks/café`, "code"].sort(),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("diffDocsBetween: a failed diff throws classified by default; tolerateDiffFailure reads as an empty delta (the receipt tolerance)", async () => {
  const topo = await makeTwoCloneTopology();
  try {
    const head = boardHead(topo.a);
    const bogus = "0123456789abcdef0123456789abcdef01234567";
    const err = capture(() => diffDocsBetween(topo.a.board, bogus, head));
    assert.ok(isBoardGitError(err), "default posture: classified throw, mirroring changesSince's mustGit");
    assert.deepEqual(diffDocsBetween(topo.a.board, bogus, head, { tolerateDiffFailure: true }), []);
  } finally {
    await topo.cleanup();
  }
});
