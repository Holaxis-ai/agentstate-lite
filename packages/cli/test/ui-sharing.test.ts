/**
 * Sharing-chip classifier truth table (designs/home-surface; plans/home-surface-build PR-B) over
 * REAL temp git repos — every state row pinned, including the two FABRICATION cases the design
 * review caught (a wrong "shared" for an in-tree bundle with no remote, and for a local-only
 * board branch): those rows are the reason this classifier exists, so they are asserted
 * explicitly against the shared kinds. Offline throughout — no row performs a network operation
 * (the classifier is local-evidence-only by design).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { classifySharing, createWorkspacesLoader, humanizeRemote } from "../src/ui/sharing.js";

function git(cwd: string, ...args: string[]): void {
  execFileSync("git", args, { cwd, stdio: "ignore" });
}

async function tempProject(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), "aslite-sharing-"));
  return dir;
}

/** Init a git repo with one commit so HEAD exists (identity pinned local to the repo). */
function initRepo(dir: string): void {
  git(dir, "init", "--initial-branch=main");
  git(dir, "config", "user.email", "t@example.invalid");
  git(dir, "config", "user.name", "t");
  git(dir, "config", "commit.gpgsign", "false");
  execFileSync("git", ["commit", "--allow-empty", "-m", "root"], { cwd: dir, stdio: "ignore" });
}

async function conventionalBoard(dir: string): Promise<string> {
  const board = path.join(dir, ".agentstate-lite");
  await mkdir(board, { recursive: true });
  await writeFile(path.join(board, "index.md"), "---\nokf_version: '0.1'\n---\n");
  return board;
}

/** Fabricate LOCAL evidence that origin/board was fetched (no network: a plain ref write). */
function fakeFetchedBoardRef(dir: string): void {
  git(dir, "update-ref", "refs/remotes/origin/board", "HEAD");
}

test("no git repo at all → private (a plain folder shares nothing)", async () => {
  const dir = await tempProject();
  try {
    const board = await conventionalBoard(dir);
    assert.equal(classifySharing(board).kind, "private");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("WRONG-TARGET guard: a non-conventional --dir bundle inside a repo makes NO claim (unscoped)", async () => {
  const dir = await tempProject();
  try {
    initRepo(dir);
    const elsewhere = path.join(dir, "examples", "sample-bundle");
    await mkdir(elsewhere, { recursive: true });
    assert.equal(classifySharing(elsewhere).kind, "unscoped");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("untracked conventional board, no board evidence → private", async () => {
  const dir = await tempProject();
  try {
    initRepo(dir);
    const board = await conventionalBoard(dir);
    assert.equal(classifySharing(board).kind, "private");
    // An origin CODE remote alone is not a shared board.
    git(dir, "remote", "add", "origin", "https://github.com/org/repo.git");
    assert.equal(classifySharing(board).kind, "private");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("untracked + fetched origin/board → shared_branch (the JOIN state), remote humanized", async () => {
  const dir = await tempProject();
  try {
    initRepo(dir);
    const board = await conventionalBoard(dir);
    git(dir, "remote", "add", "origin", "git@github.com:org/repo.git");
    fakeFetchedBoardRef(dir);
    const summary = classifySharing(board);
    assert.equal(summary.kind, "shared_branch");
    assert.equal(summary.remote, "org/repo");
    assert.ok(summary.as_of, "every summary carries as_of");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("FABRICATION GUARD: a local-only board branch is private_local_branch, never shared", async () => {
  const dir = await tempProject();
  try {
    initRepo(dir);
    const board = await conventionalBoard(dir);
    git(dir, "branch", "board");
    // No remote at all:
    assert.equal(classifySharing(board).kind, "private_local_branch");
    // Even WITH a code remote — no fetched board ref means the branch never left this machine:
    git(dir, "remote", "add", "origin", "https://github.com/org/repo.git");
    assert.equal(classifySharing(board).kind, "private_local_branch");
    // Fetched evidence flips it:
    fakeFetchedBoardRef(dir);
    assert.equal(classifySharing(board).kind, "shared_branch");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("FABRICATION GUARD: tracked in-tree bundle with NO remote is private_intree_no_remote, never shared", async () => {
  const dir = await tempProject();
  try {
    initRepo(dir);
    const board = await conventionalBoard(dir);
    git(dir, "add", ".agentstate-lite");
    execFileSync("git", ["commit", "-m", "commit board with code"], { cwd: dir, stdio: "ignore" });
    assert.equal(classifySharing(board).kind, "private_intree_no_remote");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("tracked in-tree bundle WITH a remote → shared_intree", async () => {
  const dir = await tempProject();
  try {
    initRepo(dir);
    const board = await conventionalBoard(dir);
    git(dir, "add", ".agentstate-lite");
    execFileSync("git", ["commit", "-m", "commit board with code"], { cwd: dir, stdio: "ignore" });
    git(dir, "remote", "add", "origin", "https://gitlab.example.com/team/project.git");
    const summary = classifySharing(board);
    assert.equal(summary.kind, "shared_intree");
    assert.equal(summary.remote, "team/project");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("tracked folder + fetched origin/board (the pre-share/dual zone) → unavailable with a reason, never a guess", async () => {
  const dir = await tempProject();
  try {
    initRepo(dir);
    const board = await conventionalBoard(dir);
    git(dir, "add", ".agentstate-lite");
    execFileSync("git", ["commit", "-m", "commit board with code"], { cwd: dir, stdio: "ignore" });
    git(dir, "remote", "add", "origin", "https://github.com/org/repo.git");
    fakeFetchedBoardRef(dir);
    const summary = classifySharing(board);
    assert.equal(summary.kind, "unavailable");
    assert.match(String(summary.reason), /sync/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("a classification failure is unavailable — never a fabricated private (git unreachable)", async () => {
  const dir = await tempProject();
  const savedPath = process.env.PATH;
  try {
    initRepo(dir);
    const board = await conventionalBoard(dir);
    process.env.PATH = path.join(dir, "empty-bin"); // no git on PATH → porcelain throws
    const summary = classifySharing(board);
    assert.equal(summary.kind, "unavailable");
    assert.ok(summary.reason, "failure carries a reason");
  } finally {
    process.env.PATH = savedPath;
    await rm(dir, { recursive: true, force: true });
  }
});

test("humanizeRemote degrades: GitHub https/ssh → org/repo; host-only and paths degrade honestly", () => {
  assert.equal(humanizeRemote("https://github.com/org/repo.git"), "org/repo");
  assert.equal(humanizeRemote("git@github.com:org/repo.git"), "org/repo");
  assert.equal(humanizeRemote("https://gitlab.example.com/group/sub.git"), "group/sub");
  assert.equal(humanizeRemote("https://host.example.com/"), "host.example.com");
  assert.equal(humanizeRemote("/srv/git/team/project.git"), "team/project");
});

test("workspaces loader projects labels+paths from the catalog with the open entry marked (no probes)", async () => {
  const home = await mkdtemp(path.join(tmpdir(), "aslite-ws-home-"));
  const bundleRoot = path.join(home, "proj", ".agentstate-lite");
  try {
    await mkdir(path.join(home, ".agentstate"), { recursive: true });
    await mkdir(bundleRoot, { recursive: true });
    await writeFile(
      path.join(home, ".agentstate", "catalog.json"),
      JSON.stringify({
        schema_version: 1,
        entries: [
          { id: `bnd_${"0".repeat(32)}`, label: "zeta", locator: { kind: "local-path", path: "/nowhere/zeta" } },
          { id: `bnd_${"1".repeat(32)}`, label: "alpha", locator: { kind: "local-path", path: bundleRoot } },
        ],
      }),
    );
    const savedHome = process.env.HOME;
    process.env.HOME = home;
    try {
      const rows = await createWorkspacesLoader(bundleRoot)();
      assert.deepEqual(rows, [
        { label: "alpha", path: bundleRoot, open: true },
        { label: "zeta", path: "/nowhere/zeta", open: false },
      ]);
    } finally {
      process.env.HOME = savedHome;
    }
  } finally {
    await rm(home, { recursive: true, force: true });
  }
});
