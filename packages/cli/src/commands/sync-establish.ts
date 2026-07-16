// `agentstate-lite sync --establish` — the explicit local-bundle -> shared-board transition.
//
// TWO CASES, ONE VERB. Greenfield (the folder is uncommitted): snapshot first, publish second,
// convert the local folder last — until the exact board commit exists on origin, the user's only
// bundle copy is never renamed or modified; the local conversion keeps a deterministic backup
// until the provisioned worktree is verified, and a git-dir marker makes an interrupted post-push
// conversion resumable without guessing from branch names, `index.md`, or crash debris.
// Committed-folder (the folder is already committed on the current branch): preview-first and
// `--yes`-gated — see the committed-case section below for its own safety model.
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import { resolveProjectBinding } from "../bundle.js";
import { classifyGitError, type GitFailure } from "../board-git-errors.js";
import { CliError } from "../errors.js";
import {
  BOARD_BRANCH,
  BOARD_REF,
  BOARD_REMOTE,
  BUNDLE_DIR,
  GITIGNORE_ENTRY,
  assertBundleBytesMatchCommit,
  boardNamespaceConflicts,
  ensureBoardGitignoreWorkingTree,
  fetchOrigin,
  fetchOriginRequired,
  isProvisioned,
  provisionBoardWorktree,
  pushBoardCommit,
  pushBoardUpstream,
  repoTopLevel,
  runGit,
  setBoardUpstream,
  snapshotBundleCommit,
  unpushedCount,
  withIgnoreEntry,
  type BundleSnapshotCommit,
} from "../git.js";
import { defaultSyncStore } from "../cursor.js";
import { render, type OutputMode } from "../output.js";
import { resolveBundleKey, singleActor } from "../sync-engine.js";
import { hookInstallHintOnce, type SyncCliDeps } from "./sync.js";

export const ESTABLISH_DONE =
  "the shared board is live — .agentstate-lite/ now syncs over the 'board' branch";
export const ESTABLISH_ALREADY = "already established";

const ESTABLISH_MARKER_KEY = "agentstate.establishCommit";
/** Write-time provenance for the committed case's crash window: only the executing clone has it. */
const COMMITTED_MARKER_KEY = "agentstate.establishCommittedShare";

export function establishNextSteps(inv: string): string[] {
  return [
    `teammates just run '${inv} sync' — it provisions automatically`,
    `'${inv} hook install' keeps session start board-aware`,
  ];
}

function failureOf(args: string[], r: { status: number; stdout: string; stderr: string }): GitFailure {
  return { args, status: r.status, stdout: r.stdout, stderr: r.stderr };
}

function mustGit(dir: string, args: string[], input?: string): string {
  const r = runGit(dir, args, input !== undefined ? { input } : {});
  if (r.status !== 0) throw classifyGitError(failureOf(args, r));
  return r.stdout;
}

function refCommit(top: string, ref: string): string | undefined {
  const r = runGit(top, ["rev-parse", "--verify", "--quiet", ref]);
  const value = r.stdout.trim();
  return r.status === 0 && value ? value : undefined;
}

function treeOf(top: string, commit: string): string | undefined {
  return refCommit(top, `${commit}^{tree}`);
}

function isAncestor(top: string, ancestor: string, descendant: string): boolean {
  return runGit(top, ["merge-base", "--is-ancestor", ancestor, descendant]).status === 0;
}

function readMarker(top: string, key: string): string | undefined {
  try {
    const value = readFileSync(markerPath(top, key), "utf8").trim();
    return /^[0-9a-f]{40,64}$/.test(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

function writeMarker(top: string, key: string, commit: string): void {
  const target = markerPath(top, key);
  const temporary = `${target}.tmp-${process.pid}`;
  writeFileSync(temporary, `${commit}\n`, { mode: 0o600 });
  renameSync(temporary, target);
}

function clearMarker(top: string, key: string): void {
  try {
    unlinkSync(markerPath(top, key));
  } catch {
    // Already absent (or cleanup will be retried on the next explicit establish).
  }
}

function markerPath(top: string, key: string): string {
  return path.join(mustGit(top, ["rev-parse", "--absolute-git-dir"]).trim(), key);
}

/**
 * The tree object of the committed `.agentstate-lite/` folder at HEAD, or null when the current
 * branch carries no such folder (or carries a non-directory of that name) — the structural router
 * between the greenfield and committed-folder establish cases.
 */
function folderTreeAtHead(top: string): string | null {
  const r = runGit(top, ["rev-parse", "--verify", "--quiet", `HEAD:${BUNDLE_DIR}`]);
  if (r.status !== 0) return null;
  const sha = r.stdout.trim();
  const t = runGit(top, ["cat-file", "-t", sha]);
  if (t.status !== 0 || t.stdout.trim() !== "tree") return null;
  return sha;
}

function folderPresentInCodeIndex(top: string): boolean {
  const r = runGit(top, ["ls-files", "--", BUNDLE_DIR]);
  return r.status === 0 && r.stdout.trim().length > 0;
}

/** Reject filesystem indirection before any ref, remote, index, or folder mutation. */
function assertPlainBundleShape(bundlePath: string, inv: string): void {
  const runInitHelp = `${inv} init --dir ${BUNDLE_DIR}`;
  if (!existsSync(bundlePath)) {
    throw new CliError(
      "RUNTIME",
      `no '${BUNDLE_DIR}/' folder here to establish — run '${runInitHelp}' first, then re-run establish`,
      { help: runInitHelp },
    );
  }
  const root = lstatSync(bundlePath);
  if (root.isSymbolicLink() || !root.isDirectory()) {
    throw new CliError(
      "RUNTIME",
      `'${bundlePath}' must be a real, plain directory — symlinks and non-directories are never followed by establish`,
    );
  }
  if (existsSync(path.join(bundlePath, ".git"))) {
    throw new CliError(
      "RUNTIME",
      `'${bundlePath}' already contains its own '.git' — establish only operates on a plain bundle folder`,
    );
  }
  if (readdirSync(bundlePath).length === 0) {
    throw new CliError("RUNTIME", `'${bundlePath}' is empty — run '${runInitHelp}' first`, {
      help: runInitHelp,
    });
  }
  const indexPath = path.join(bundlePath, "index.md");
  if (!existsSync(indexPath)) {
    throw new CliError(
      "RUNTIME",
      `'${bundlePath}' doesn't look like an OKF bundle (no index.md) — run '${runInitHelp}' first`,
      { help: runInitHelp },
    );
  }
  const index = lstatSync(indexPath);
  if (index.isSymbolicLink() || !index.isFile()) {
    throw new CliError("RUNTIME", `'${indexPath}' must be a real file — establish never follows it through a symlink`);
  }
}

function assertFreshSource(top: string, boardPath: string, inv: string): void {
  assertPlainBundleShape(boardPath, inv);
  if (folderPresentInCodeIndex(top)) {
    throw new CliError(
      "RUNTIME",
      `'${BUNDLE_DIR}/' is staged in the code branch's index — establish refuses to leave board files ` +
        `queued for a later code commit; unstage them, then re-run`,
      { help: `git restore --staged -- ${BUNDLE_DIR}` },
    );
  }
}

async function assertNotBoundElsewhere(top: string, boardPath: string): Promise<void> {
  const binding = await resolveProjectBinding(top);
  if (!binding) return;
  const boundIsConventional = path.resolve(binding.target) === boardPath;
  if (boundIsConventional) return;
  throw new CliError(
    "RUNTIME",
    `a project binding (${binding.file}) points this project's bundle out of the git-sync tier ` +
      `(the conventional path is '${BUNDLE_DIR}/')`,
    { help: `fix or remove ${binding.file} if you want to share this bundle over the board branch` },
  );
}

function gitignoreNote(top: string): string {
  const gi = ensureBoardGitignoreWorkingTree(top);
  return gi.changed
    ? `${gi.path} — appended '${GITIGNORE_ENTRY}' (uncommitted; commit it so teammates' clones stay clean)`
    : `${gi.path} — already ignores '${BUNDLE_DIR}/'`;
}

interface ConversionResult {
  boardPath: string;
  boardCommit: string;
  gitignore: string;
}

/** The only backup-deletion boundary: re-read the backup immediately before removing it. */
function removeVerifiedBackup(top: string, backupPath: string, expectedCommit: string, inv: string): void {
  if (!existsSync(backupPath)) return;
  assertPlainBundleShape(backupPath, inv);
  const backupSnapshot = snapshotBundleCommit(top, backupPath);
  const expectedTree = treeOf(top, expectedCommit);
  if (!expectedTree) throw new CliError("RUNTIME", `the establishment commit has no readable tree (${expectedCommit})`);
  if (backupSnapshot.tree !== expectedTree) {
    throw new CliError("CONFLICT", `the establishment backup at ${backupPath} changed; it was not removed`);
  }
  assertBundleBytesMatchCommit(top, backupPath, expectedCommit);
  rmSync(backupPath, { recursive: true, force: false });
}

/** Finish the post-publish local swap, retaining the deterministic backup until every check passes. */
function finishLocalConversion(
  top: string,
  sourcePath: string,
  publishedCommit: string,
  expectedTree: string,
  inv: string,
): ConversionResult {
  const boardPath = path.join(top, BUNDLE_DIR);
  const backupPath = `${boardPath}.establish-backup`;
  const remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
  if (!remoteCommit || !isAncestor(top, publishedCommit, remoteCommit)) {
    throw new CliError(
      "CONFLICT",
      `origin/${BOARD_BRANCH} no longer contains this establishment's published snapshot — the local bundle is untouched`,
    );
  }

  if (isProvisioned(top)) {
    const current = mustGit(boardPath, ["rev-parse", "HEAD"]).trim();
    if (!isAncestor(top, publishedCommit, current)) {
      throw new CliError("CONFLICT", "the provisioned board does not contain the establishment snapshot");
    }
    assertBundleBytesMatchCommit(top, boardPath, publishedCommit);
    setBoardUpstream(boardPath);
    const note = gitignoreNote(top);
    removeVerifiedBackup(top, backupPath, publishedCommit, inv);
    clearMarker(top, ESTABLISH_MARKER_KEY);
    return { boardPath, boardCommit: current, gitignore: note };
  }

  assertPlainBundleShape(sourcePath, inv);
  const currentSnapshot = snapshotBundleCommit(top, sourcePath);
  if (currentSnapshot.tree !== expectedTree) {
    throw new CliError(
      "CONFLICT",
      `the local bundle changed after its establishment snapshot was created — nothing was moved; ` +
        `review the local changes, then re-run '${inv} sync --establish'`,
      { details: { expected_tree: expectedTree, actual_tree: currentSnapshot.tree } },
    );
  }

  if (sourcePath === boardPath) {
    if (existsSync(backupPath)) {
      throw new CliError("RUNTIME", `establish recovery backup already exists at ${backupPath}; nothing was moved`);
    }
    renameSync(boardPath, backupPath);
    sourcePath = backupPath;
  }

  try {
    const outcome = provisionBoardWorktree(top);
    if (outcome.kind !== "provisioned" && outcome.kind !== "already") {
      throw new CliError("RUNTIME", `board provisioning returned '${outcome.kind}' after publication`);
    }
    const provisionedPath = outcome.boardPath;
    const current = mustGit(provisionedPath, ["rev-parse", "HEAD"]).trim();
    if (!isAncestor(top, publishedCommit, current)) {
      throw new CliError("CONFLICT", "the provisioned board does not contain the establishment snapshot");
    }
    if (runGit(provisionedPath, ["status", "--porcelain"]).stdout.trim()) {
      throw new CliError("RUNTIME", "the newly provisioned board worktree is unexpectedly dirty");
    }
    assertBundleBytesMatchCommit(top, provisionedPath, publishedCommit);
    setBoardUpstream(provisionedPath);
    const note = gitignoreNote(top);
    removeVerifiedBackup(top, sourcePath, publishedCommit, inv);
    clearMarker(top, ESTABLISH_MARKER_KEY);
    return { boardPath: provisionedPath, boardCommit: current, gitignore: note };
  } catch (err) {
    if (!existsSync(boardPath) && existsSync(backupPath)) renameSync(backupPath, boardPath);
    throw err;
  }
}

export type EstablishOutcome = { already: true } | { already: false };

async function renderEstablished(
  top: string,
  conversion: ConversionResult,
  snapshot: Pick<BundleSnapshotCommit, "docs">,
  inv: string,
  mode: OutputMode,
  stdout: (s: string) => void,
  deps: Partial<SyncCliDeps>,
): Promise<EstablishOutcome> {
  const key = resolveBundleKey(conversion.boardPath);
  await defaultSyncStore.refreshMarker(key);
  if (snapshot.docs.length > 0) await defaultSyncStore.recordSelfActors(key, snapshot.docs.map((d) => d.actor));
  await defaultSyncStore.writeCursor(key, { tier: "git", token: conversion.boardCommit });
  await defaultSyncStore.writeCache(key, {
    updatedAt: new Date().toISOString(),
    delta: [],
    unpushedCount: unpushedCount(conversion.boardPath) ?? 0,
    uncommittedCount: 0,
  });

  const receipt: Record<string, unknown> = {
    established: ESTABLISH_DONE,
    board_commit: conversion.boardCommit,
    committed: snapshot.docs.length,
  };
  const actor = singleActor(snapshot.docs);
  if (actor) receipt.actor = actor;
  receipt.pushed = `${BOARD_REMOTE}/${BOARD_BRANCH} (tracking set)`;
  receipt.gitignore = conversion.gitignore;
  receipt.next_steps = establishNextSteps(inv);
  const hint = await hookInstallHintOnce(key, inv, deps.hookInstalled);
  if (hint) receipt.hint = hint;
  stdout(render(receipt, mode));
  return { already: false };
}

export async function establishBoard(
  dir: string,
  inv: string,
  mode: OutputMode,
  stdout: (s: string) => void,
  deps: Partial<SyncCliDeps>,
  opts: { yes?: boolean } = {},
): Promise<EstablishOutcome> {
  const top = repoTopLevel(dir);
  if (!top) {
    throw new CliError("RUNTIME", "not inside a git repository — establish needs a repo with an 'origin' remote");
  }
  if (runGit(top, ["remote", "get-url", BOARD_REMOTE]).status !== 0) {
    throw new CliError("RUNTIME", `this repository has no '${BOARD_REMOTE}' remote`);
  }

  // The COMMITTED-FOLDER case routes structurally, before any network op: a `.agentstate-lite/`
  // tree committed at HEAD means the greenfield safety model (rename + convert the folder) must
  // never run — the code branch still tracks those paths. A fully shared clone (folder no longer
  // committed) never enters this branch, so its leftover local crumbs can't produce stale guidance.
  const committedTree = folderTreeAtHead(top);
  if (committedTree !== null) {
    return establishCommitted(top, inv, mode, Boolean(opts.yes), committedTree, stdout);
  }
  fetchOriginRequired(top);

  const boardPath = path.join(top, BUNDLE_DIR);
  const backupPath = `${boardPath}.establish-backup`;
  let marker = readMarker(top, ESTABLISH_MARKER_KEY);
  let remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
  const localCommit = refCommit(top, `refs/heads/${BOARD_BRANCH}`);

  // Completed state: ordinary sync owns it. A leftover verified backup/marker is cleanup from a
  // post-publish crash, never evidence for another publication.
  if (isProvisioned(top) && remoteCommit) {
    if (marker) {
      if (!isAncestor(top, marker, remoteCommit)) {
        throw new CliError(
          "CONFLICT",
          `the provisioned board does not contain the interrupted establishment snapshot (${marker})`,
        );
      }
      const markerTree = treeOf(top, marker);
      if (!markerTree) {
        throw new CliError("RUNTIME", `the establishment marker names an unavailable tree (${marker})`);
      }
      // These are part of conversion too. Complete them before deleting the only pre-conversion
      // copy, so a failure remains resumable with the marker and backup intact.
      setBoardUpstream(boardPath);
      gitignoreNote(top);
      assertBundleBytesMatchCommit(top, boardPath, marker);
      removeVerifiedBackup(top, backupPath, marker, inv);
      clearMarker(top, ESTABLISH_MARKER_KEY);
    }
    return { already: true };
  }

  // Explicit publication of a local-only board, including a legacy branch that has not yet been
  // materialized at the conventional path. Bare sync and SessionStart never take this path.
  if (localCommit && !remoteCommit) {
    if (!isProvisioned(top)) {
      const provisioned = provisionBoardWorktree(top);
      if (provisioned.kind !== "provisioned" && provisioned.kind !== "already") {
        throw new CliError("RUNTIME", "the local board branch could not be provisioned for explicit establishment");
      }
    }
    const indexPath = path.join(boardPath, "index.md");
    if (!existsSync(indexPath) || lstatSync(indexPath).isSymbolicLink() || !lstatSync(indexPath).isFile()) {
      throw new CliError("RUNTIME", `the local '${BOARD_BRANCH}' worktree is not a valid bundle (root index.md missing)`);
    }
    pushBoardUpstream(boardPath);
    fetchOriginRequired(top);
    remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
    if (!remoteCommit) throw new CliError("RUNTIME", "board push succeeded but origin/board could not be verified");
    const conversion: ConversionResult = {
      boardPath,
      boardCommit: mustGit(boardPath, ["rev-parse", "HEAD"]).trim(),
      gitignore: gitignoreNote(top),
    };
    return renderEstablished(top, conversion, { docs: [] }, inv, mode, stdout, deps);
  }

  const recoverySource = existsSync(backupPath) ? backupPath : boardPath;
  if (marker) {
    const markerTree = treeOf(top, marker);
    if (!markerTree) {
      throw new CliError("RUNTIME", `the establishment marker names an unavailable commit (${marker}); nothing was moved`);
    }
    assertPlainBundleShape(recoverySource, inv);
    const currentSnapshot = snapshotBundleCommit(top, recoverySource);
    if (currentSnapshot.tree !== markerTree) {
      throw new CliError("CONFLICT", "the local bundle changed since the interrupted establishment snapshot; nothing was moved");
    }

    if (!remoteCommit) {
      try {
        pushBoardCommit(top, marker);
      } catch (err) {
        if (fetchOrigin(top)) remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
        if (!remoteCommit) {
          throw err;
        }
      }
      fetchOriginRequired(top);
      remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
    }
    if (!remoteCommit || !isAncestor(top, marker, remoteCommit)) {
      throw new CliError(
        "CONFLICT",
        `a different origin/${BOARD_BRANCH} appeared while establishing; the local bundle remains untouched`,
      );
    }
    const conversion = finishLocalConversion(top, recoverySource, marker, markerTree, inv);
    return renderEstablished(top, conversion, currentSnapshot, inv, mode, stdout, deps);
  }

  if (remoteCommit) {
    if (existsSync(boardPath) || existsSync(backupPath)) {
      throw new CliError(
        "CONFLICT",
        `origin/${BOARD_BRANCH} already exists while this clone also has a local bundle — establish ` +
          `will not guess that they are identical or replace either one`,
        { help: `move the local folder aside, run '${inv} sync' to join, then reconcile deliberately` },
      );
    }
    return { already: true };
  }
  if (localCommit) {
    throw new CliError(
      "RUNTIME",
      `a local '${BOARD_BRANCH}' branch already exists but is not the conventional board worktree; nothing was published`,
    );
  }
  if (existsSync(backupPath)) {
    throw new CliError(
      "RUNTIME",
      `an establishment backup already exists at ${backupPath}, but this clone has no matching ` +
        `establishment marker; nothing was published or moved`,
    );
  }

  const namespaceConflicts = boardNamespaceConflicts(top);
  if (namespaceConflicts.length > 0) {
    throw new CliError("RUNTIME", `branches named '${BOARD_BRANCH}/…' block establishment: ${namespaceConflicts.join(", ")}`, {
      details: { conflicting_branches: namespaceConflicts },
    });
  }
  assertFreshSource(top, boardPath, inv);
  await assertNotBoundElsewhere(top, boardPath);

  const snapshot = snapshotBundleCommit(top, boardPath);
  writeMarker(top, ESTABLISH_MARKER_KEY, snapshot.sha);
  marker = snapshot.sha;
  try {
    pushBoardCommit(top, snapshot.sha);
  } catch (err) {
    if (fetchOrigin(top)) remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
    if (!remoteCommit) {
      throw err;
    }
  }
  fetchOriginRequired(top);
  remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
  if (!remoteCommit || !isAncestor(top, snapshot.sha, remoteCommit)) {
    throw new CliError(
      "CONFLICT",
      `a teammate published a different origin/${BOARD_BRANCH} first; the local bundle remains untouched`,
      { details: { snapshot_commit: snapshot.sha } },
    );
  }

  const conversion = finishLocalConversion(top, boardPath, marker, snapshot.tree, inv);
  return renderEstablished(top, conversion, snapshot, inv, mode, stdout, deps);
}

// ── the committed-folder case ─────────────────────────────────────────────────
//
// The bundle is a plain folder committed on the current branch. Same verb, different safety model
// (preview-first, `--yes`-gated — heavier than greenfield because it stages a change to the CODE
// branch's future):
//   • FILES, NOT HISTORY: the `board` branch is one fresh ROOT commit over `HEAD:.agentstate-lite`'s
//     tree — no parents, so the folder's pre-share history (and anything scrubbed out of it) never
//     enters the shared branch, and `board` can never be merged into the code branch by accident.
//   • PR-SHAPED REMOVAL: the folder-removal + .gitignore commit is built with PLUMBING ONLY
//     (`ls-tree` → `mktree` → `commit-tree`) on a new local `board-cleanup` branch — the working
//     tree, the index, and the current branch are never touched, and nothing on the current branch
//     is pushed; the HUMAN pushes that branch and opens the PR.
//   • NOT PROVISIONED HERE: until the cleanup PR merges, the current branch still TRACKS the folder
//     — a board checkout at that path would read as phantom modifications, and the user's own
//     `git checkout`/`git restore` would rewrite frozen copies over it, pushing stale content over
//     teammates' board updates on the next sync. Every clone shares one safe journey instead:
//     merge the PR → `git pull` (the folder vanishes) → `sync` (it returns as the live board).
//   • NEVER any `git clean`: the rollout note's `git clean -fdx` line is copy for teammates —
//     nothing here executes it.

/** The local branch the folder-removal commit is prepared on — the human pushes it and opens the PR. */
export const CLEANUP_BRANCH = "board-cleanup";

// ── pinned strings (test-pinned; no worktree/linked/subtree vocabulary, no retired framing) ──

export const ESTABLISH_COMMITTED_PREVIEW = "preview — nothing has been changed; re-run with --yes to execute";

export const ESTABLISH_COMMITTED_ALREADY = "already established — a board branch already exists on origin";

export const ESTABLISH_COMMITTED_DONE =
  "the board branch is live on origin — push the cleanup branch and open its PR to finish";

/**
 * The both-worlds honesty line (test-pinned): between the board push and the cleanup-PR merge the
 * project runs in two worlds at once, and the receipt must say exactly what that means — most
 * importantly that the folder still committed on the code branch is a DEAD COPY nobody should
 * write to.
 */
export function bothWorldsLine(branch: string): string {
  return (
    `until the cleanup PR merges, this project is in a BOTH-WORLDS state: the shared board ` +
    `lives on the '${BOARD_BRANCH}' branch (live on ${BOARD_REMOTE}), while '${branch}' still ` +
    `carries the old committed folder. That folder is now a FROZEN SNAPSHOT that receives no ` +
    `further updates: treat it as read-only, don't write docs into it, and never merge ` +
    `'${BOARD_BRANCH}' into '${branch}'. Sync starts working on each clone once the PR merges ` +
    `and that clone runs 'git pull'`
  );
}

/**
 * The rollout-note copy: the heads-up to forward to teammates BEFORE the cleanup PR merges.
 * Emitted in the preview AND repeated in the receipt. The `git clean -fdx` line is COPY ONLY —
 * nothing on this path ever executes a `git clean`.
 */
export function rolloutNote(inv: string, branch: string): string[] {
  return [
    `after your next 'git pull', ${BUNDLE_DIR}/ disappears from '${branch}' — nothing is lost: ` +
      `the next '${inv} sync' re-creates it from the shared board branch`,
    `from then on '${inv} sync' — not 'git pull' — updates the board`,
    `you may notice a '${BOARD_BRANCH}' branch on the remote — never merge it into '${branch}'`,
    `'git clean -fdx' on '${branch}' removes the board checkout (recoverable — the next sync ` +
      `re-creates it from ${BOARD_REMOTE}; unpushed board commits are why you sync first)`,
    `re-run '${inv} hook install' so session start stays board-aware`,
  ];
}

/** The preview record — a genuinely useful dry run: what branch, what commits, what leaves where. */
export function committedPreviewRecord(inv: string, branch: string): Record<string, unknown> {
  return {
    establish: ESTABLISH_COMMITTED_PREVIEW,
    create:
      `a new '${BOARD_BRANCH}' branch whose ONE root commit carries the current committed files ` +
      `of ${BUNDLE_DIR}/ — files only: the folder's history stays on '${branch}'`,
    push: `the new '${BOARD_BRANCH}' branch to ${BOARD_REMOTE}, with tracking (git push -u ${BOARD_REMOTE} ${BOARD_BRANCH})`,
    commit:
      `ONE commit on a new local '${CLEANUP_BRANCH}' branch removing ${BUNDLE_DIR}/ from ` +
      `'${branch}' and adding it to .gitignore — NOT pushed: you push that branch and open the ` +
      `PR yourself; nothing on '${branch}' is pushed or changed`,
    after_merge:
      `once the PR merges, on every clone: 'git pull' makes ${BUNDLE_DIR}/ vanish from ` +
      `'${branch}', and the next '${inv} sync' re-creates it from the ${BOARD_BRANCH} branch — ` +
      `nothing is lost`,
    both_worlds: bothWorldsLine(branch),
    before_you_run:
      `every board writer should sync — at minimum commit — their board changes first: board work ` +
      `sitting uncommitted or unpushed on another machine cannot be detected from here, and it ` +
      `will NOT be on the new branch`,
    verified:
      `this preview already checked the machine-checkable preconditions: ${BOARD_REMOTE} is ` +
      `reachable, '${branch}' is not behind ${BOARD_REMOTE}/${branch} on board changes, and no ` +
      `'${BOARD_BRANCH}/…' branches exist (they would block creating the '${BOARD_BRANCH}' branch)`,
    rollout_note: rolloutNote(inv, branch),
    run: `${inv} sync --establish --yes`,
  };
}

/** The receipt/recovery next-steps chain (one source — the crash-recovery path re-emits it). */
export function committedNextSteps(inv: string, branch: string): string[] {
  return [
    `push the cleanup branch: git push -u ${BOARD_REMOTE} ${CLEANUP_BRANCH}`,
    `open a PR from '${CLEANUP_BRANCH}' into '${branch}' and merge it`,
    `after the merge lands: 'git pull', then '${inv} sync' — ${BUNDLE_DIR}/ vanishes from ` +
      `'${branch}' and comes back as the live shared board`,
  ];
}

/** True when `refs/heads/<name>` resolves. */
function localBranchExists(top: string, name: string): boolean {
  return runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${name}`]).status === 0;
}

/**
 * The behind-origin freshness guard's probe: the commits on `origin/<branch>` that this clone
 * does NOT have and that TOUCH the board folder. Establishing past such a commit is the
 * reviewer-driven disaster (U5 review HIGH 1): the teammate's board commit is orphaned on the
 * frozen folder FOREVER (the root commit is cut from stale HEAD, the cleanup PR merges cleanly,
 * and sync refuses everywhere). Returns null when `origin/<branch>` doesn't resolve (a
 * never-pushed branch — nothing to be behind of); commits that DON'T touch the folder are
 * deliberately not blocking (the board tree is identical either way).
 */
function behindBoardCommits(top: string, branch: string): string[] | null {
  const remoteRef = `refs/remotes/${BOARD_REMOTE}/${branch}`;
  if (runGit(top, ["rev-parse", "--verify", "--quiet", remoteRef]).status !== 0) return null;
  return mustGit(top, ["rev-list", `HEAD..${remoteRef}`, "--", BUNDLE_DIR])
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

/** Throw the behind-origin refusal when {@link behindBoardCommits} found any. */
function assertNotBehindOnBoard(top: string, inv: string, branch: string): void {
  const behind = behindBoardCommits(top, branch);
  if (behind !== null && behind.length > 0) {
    throw new CliError(
      "RUNTIME",
      `establish refused: '${branch}' is behind ${BOARD_REMOTE}/${branch} with board changes — ` +
        `establishing from this stale state would strand a teammate's board commits on the frozen ` +
        `folder forever`,
      {
        details: { behind_board_commits: behind.length, commits: behind.slice(0, 20) },
        help: `git pull, then re-run ${inv} sync --establish --yes`,
      },
    );
  }
}

interface TreeEntry {
  mode: string;
  type: string;
  sha: string;
  name: string;
}

/** Parse `ls-tree -z` output (NUL-terminated `<mode> <type> <sha>\t<name>` records). */
function parseLsTreeZ(out: string): TreeEntry[] {
  return out
    .split("\0")
    .filter((l) => l.length > 0)
    .map((l) => {
      const tab = l.indexOf("\t");
      const [mode = "", type = "", sha = ""] = l.slice(0, tab).split(" ");
      return { mode, type, sha, name: l.slice(tab + 1) };
    });
}

/**
 * Git's tree-entry sort key: entries are ordered by name bytes, with a directory comparing as if
 * suffixed by `/` — required because inserting a new `.gitignore` entry must keep the listing in
 * the canonical order `mktree` records.
 */
function treeSortKey(e: TreeEntry): string {
  return e.type === "tree" ? `${e.name}/` : e.name;
}

/** The board branch's one attributed root-commit message (attribution = the git author running it). */
function boardCommitMessage(branch: string): string {
  return (
    `board: bundle shared from '${branch}' (files only)\n\n` +
    `One-time establishment: the bundle's current files, moved onto the dedicated ` +
    `'${BOARD_BRANCH}' branch.\nThe folder's history stays on '${branch}'.\n`
  );
}

/** The removal commit's message (rides the human-opened cleanup PR). */
function removalCommitMessage(inv: string, branch: string): string {
  return (
    `board: move ${BUNDLE_DIR}/ to the '${BOARD_BRANCH}' branch\n\n` +
    `The board now lives on its own '${BOARD_BRANCH}' branch (pushed to ${BOARD_REMOTE}) and is ` +
    `ignored on '${branch}'.\nOnce this lands: 'git pull' (the folder vanishes), then ` +
    `'${inv} sync' (it returns as the live shared board).\n`
  );
}

/**
 * Create the board branch's ROOT commit (files, not history): `git commit-tree` over the folder's
 * tree at HEAD with NO parents, then point `refs/heads/board` at it. Object-store and ref writes
 * only; the working tree and index are untouched.
 */
function createBoardRootCommit(top: string, treeSha: string, branch: string): string {
  const sha = mustGit(top, ["commit-tree", treeSha], boardCommitMessage(branch)).trim();
  mustGit(top, ["branch", BOARD_BRANCH, sha]);
  return sha;
}

/**
 * Build the folder-removal commit with PLUMBING ONLY — HEAD's top-level tree minus the
 * `.agentstate-lite` entry, with `.gitignore` gaining the entry — parented on HEAD. The working
 * tree, the index, and the current branch are never touched, which also means any STAGED user
 * code stays exactly as staged.
 */
function createRemovalCommit(top: string, inv: string, branch: string): string {
  const headTree = mustGit(top, ["rev-parse", "HEAD^{tree}"]).trim();
  const entries = parseLsTreeZ(mustGit(top, ["ls-tree", "-z", headTree])).filter(
    (e) => e.name !== BUNDLE_DIR,
  );

  const existing = entries.find((e) => e.name === ".gitignore");
  const base = existing ? mustGit(top, ["cat-file", "blob", existing.sha]) : "";
  const updated = withIgnoreEntry(base);
  if (updated !== base) {
    const blob = mustGit(top, ["hash-object", "-w", "--stdin"], updated).trim();
    if (existing) {
      existing.sha = blob;
    } else {
      entries.push({ mode: "100644", type: "blob", sha: blob, name: ".gitignore" });
    }
  }

  entries.sort((a, b) => (treeSortKey(a) < treeSortKey(b) ? -1 : treeSortKey(a) > treeSortKey(b) ? 1 : 0));
  const mktreeInput = entries.map((e) => `${e.mode} ${e.type} ${e.sha}\t${e.name}\0`).join("");
  const newTree = mustGit(top, ["mktree", "-z"], mktreeInput).trim();
  return mustGit(top, ["commit-tree", newTree, "-p", "HEAD"], removalCommitMessage(inv, branch)).trim();
}

/**
 * The committed-folder establishment. Preconditions are verified for BOTH the preview and the
 * execution — the preview is a dry run of the whole act, refusals included:
 *
 *  1. `origin` must be REACHABLE (a dead fetch refuses — the act cannot complete offline anyway,
 *     the mandatory push would fail, and a stale view of origin blinds the freshness guard);
 *  2. NOT already shared (a board branch on origin → `already established`, exit 0 — idempotent,
 *     with state-aware follow-ups, see {@link alreadyShared});
 *  3. on a real branch (not detached, not `board` itself);
 *  4. NOT behind `origin/<branch>` on commits touching the board folder, and no `board/…`
 *     branches locally or on the remote (they make `refs/heads/board` uncreatable);
 *  5. no uncommitted changes under `.agentstate-lite/` (the refusal names them — they would be
 *     silently stranded in the frozen snapshot otherwise);
 *  6. no pre-existing `board-cleanup` branch, and any pre-existing LOCAL `board` branch must be
 *     the reusable remnant of an interrupted run (single root commit over the same tree).
 *
 * The one precondition that CANNOT be checked from here — every board writer has synced (at
 * minimum committed) their board changes — is stated as documented comms in the preview.
 */
async function establishCommitted(
  top: string,
  inv: string,
  mode: OutputMode,
  yes: boolean,
  treeSha: string,
  stdout: (s: string) => void,
): Promise<EstablishOutcome> {
  const fetchOk = fetchOrigin(top);

  // IDEMPOTENCE FIRST: a board branch on origin means the establishment already happened (here,
  // on a teammate's clone, or in an interrupted run that got at least as far as the push) — exit
  // 0. Checked even off a failed fetch (the last-known origin/board still proves it).
  if (refCommit(top, `refs/remotes/${BOARD_REF}`)) {
    await alreadyShared(top, inv, mode, yes, fetchOk, stdout);
    return { already: false };
  }

  // A dead fetch REFUSES: the act cannot complete offline anyway (the mandatory `push -u` would
  // fail after mutating local refs), and proceeding on a stale view of origin is exactly the hole
  // that lets a teammate's board commit go unseen.
  if (!fetchOk) {
    throw new CliError(
      "TRANSIENT",
      `establish refused: could not reach '${BOARD_REMOTE}' — the committed-folder case verifies ` +
        `freshness against the remote and must push the board branch, neither of which can happen ` +
        `offline; get online, then re-run`,
      { details: { retryable: true } },
    );
  }

  const branchR = runGit(top, ["rev-parse", "--abbrev-ref", "HEAD"]);
  const branch = branchR.status === 0 ? branchR.stdout.trim() : "HEAD";
  if (branch === "HEAD") {
    throw new CliError(
      "RUNTIME",
      `the repository is on a detached HEAD — check out the branch that carries the committed ` +
        `${BUNDLE_DIR}/ folder, then re-run`,
    );
  }
  if (branch === BOARD_BRANCH) {
    throw new CliError(
      "RUNTIME",
      `the current branch is '${BOARD_BRANCH}' — run establish from the branch that carries the ` +
        `committed folder ('${BOARD_BRANCH}' is the branch establishment creates)`,
    );
  }

  // The behind-origin freshness guard — the fetch above succeeded, so this view of
  // origin/<branch> is LIVE. Runs before the local-state refusals: a stale clone must hear
  // "git pull" before anything else.
  assertNotBehindOnBoard(top, inv, branch);

  // REFUSE on uncommitted board changes, naming them: the board branch carries HEAD's tree, so
  // anything uncommitted would be silently stranded in the frozen snapshot.
  const status = runGit(top, ["status", "--porcelain", "--", BUNDLE_DIR]);
  const dirty = (status.status === 0 ? status.stdout : "")
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0)
    .map((l) => ({ status: l.slice(0, 2).trim(), path: l.slice(3) }));
  if (dirty.length > 0) {
    const shown = dirty.slice(0, 20);
    throw new CliError(
      "RUNTIME",
      `establish refused: ${BUNDLE_DIR}/ has uncommitted changes — commit (or discard) them ` +
        `first so the board branch carries the board's real current state`,
      {
        details: { uncommitted: { shown: shown.length, total: dirty.length, rows: shown } },
        help: `commit the board changes, then re-run ${inv} sync --establish --yes`,
      },
    );
  }

  if (localBranchExists(top, CLEANUP_BRANCH)) {
    throw new CliError(
      "RUNTIME",
      `a '${CLEANUP_BRANCH}' branch already exists — if it is left over from an interrupted ` +
        `establishment, push it and open its PR (or delete it: git branch -D ${CLEANUP_BRANCH}), ` +
        `then re-run`,
    );
  }

  // `board/…` branches (local or remote) make `refs/heads/board` uncreatable — a ref
  // directory/file conflict git reports only at push time. Refuse EARLY, naming the offenders.
  const namespaceConflicts = boardNamespaceConflicts(top);
  if (namespaceConflicts.length > 0) {
    throw new CliError(
      "RUNTIME",
      `establish refused: branches named '${BOARD_BRANCH}/…' exist — git cannot create a ` +
        `'${BOARD_BRANCH}' branch alongside them: ${namespaceConflicts.join(", ")}`,
      {
        details: { conflicting_branches: namespaceConflicts },
        help: `delete or rename these branches, then re-run ${inv} sync --establish --yes`,
      },
    );
  }

  // A pre-existing LOCAL board branch is reusable ONLY as the remnant of an interrupted run
  // (created here, crashed before the push): a single root commit over exactly this tree.
  let reuseBoardSha: string | null = null;
  if (localBranchExists(top, BOARD_BRANCH)) {
    const sha = mustGit(top, ["rev-parse", `refs/heads/${BOARD_BRANCH}`]).trim();
    const tree = mustGit(top, ["rev-parse", `refs/heads/${BOARD_BRANCH}^{tree}`]).trim();
    const count = mustGit(top, ["rev-list", "--count", `refs/heads/${BOARD_BRANCH}`]).trim();
    if (tree === treeSha && count === "1") {
      reuseBoardSha = sha;
    } else {
      throw new CliError(
        "RUNTIME",
        `a local '${BOARD_BRANCH}' branch already exists and does not match the committed ` +
          `folder — if it is left over from an interrupted establishment, delete it ` +
          `(git branch -D ${BOARD_BRANCH}); if it is used for something else, rename it — then re-run`,
      );
    }
  }

  if (!yes) {
    stdout(render(committedPreviewRecord(inv, branch), mode));
    return { already: false };
  }

  // EXECUTE. Ordering is the recovery story: the board branch is created, the crash marker is
  // written, and the push lands FIRST (a failure before or during the push leaves the current
  // branch bit-for-bit untouched, and a re-run reuses the local root commit); the removal commit
  // is prepared only after origin has the board. The marker — not the local branch's mere
  // existence — is what later identifies THIS clone as the interrupted executor (a teammate who
  // merely checked out the board branch during the window must never be offered the recovery).
  const boardSha = reuseBoardSha ?? createBoardRootCommit(top, treeSha, branch);
  writeMarker(top, COMMITTED_MARKER_KEY, boardSha);
  pushBoardUpstream(top);
  const removalSha = createRemovalCommit(top, inv, branch);
  mustGit(top, ["branch", CLEANUP_BRANCH, removalSha]);
  clearMarker(top, COMMITTED_MARKER_KEY);

  const receipt: Record<string, unknown> = {
    established: ESTABLISH_COMMITTED_DONE,
    board_commit: boardSha,
    pushed: `${BOARD_REMOTE}/${BOARD_BRANCH} (tracking set)`,
    cleanup_branch: CLEANUP_BRANCH,
    cleanup_commit: removalSha,
    next_steps: committedNextSteps(inv, branch),
    both_worlds: bothWorldsLine(branch),
    tell_your_teammates: rolloutNote(inv, branch),
  };
  stdout(render(receipt, mode));
  return { already: false };
}

/**
 * A board branch exists on origin while the folder is still committed at HEAD — the establishment
 * already happened SOMEWHERE and this clone sits in the both-worlds window. Exit 0 always
 * (idempotence), but the follow-up must match this clone's ACTUAL state:
 *
 *  (a) a local `board-cleanup` branch exists → the removal commit is prepared; guide to pushing
 *      it and opening the PR (the lost-receipt case on the happy path). Any leftover crash marker
 *      is cleared — the work it protected is done;
 *  (b) the CRASH WINDOW — this clone's own crash marker exists (written before the push, cleared
 *      after the cleanup branch lands), but no `board-cleanup` branch — → the removal commit is
 *      genuinely missing: RE-CREATE it (with `--yes`; without, say exactly what a `--yes` re-run
 *      will do). Guarded by the same freshness rules as a fresh run (live fetch + not-behind),
 *      plus two provenance checks a heuristic could not make: the marker's commit must be
 *      contained in origin/board (a different published board refuses), and its tree must still
 *      match HEAD's folder (newer board commits on the code branch would be silently stranded);
 *  (c) no marker (a teammate's clone that simply hasn't pulled the removal yet — even one that
 *      checked out the board branch locally) → a truthful note, probed against origin's actual
 *      state. Never a removal-commit re-creation here — that would race the real PR.
 *
 * The fully-shared state (folder no longer committed) never reaches this function: establishBoard
 * routes it to the greenfield/ordinary path structurally, so leftover local crumbs (a stale
 * cleanup branch, a stale marker) cannot produce stale guidance there.
 */
async function alreadyShared(
  top: string,
  inv: string,
  mode: OutputMode,
  yes: boolean,
  fetchOk: boolean,
  stdout: (s: string) => void,
): Promise<void> {
  const rec: Record<string, unknown> = { establish: ESTABLISH_COMMITTED_ALREADY };
  const branchR = runGit(top, ["rev-parse", "--abbrev-ref", "HEAD"]);
  const branch = branchR.status === 0 ? branchR.stdout.trim() : "HEAD";
  const marker = readMarker(top, COMMITTED_MARKER_KEY);

  if (localBranchExists(top, CLEANUP_BRANCH)) {
    // (a) prepared but not landed: the PR is the only thing left.
    clearMarker(top, COMMITTED_MARKER_KEY);
    rec.note =
      `the folder-removal commit is already prepared on '${CLEANUP_BRANCH}' — push it and ` +
      `open its PR`;
    rec.next_steps = committedNextSteps(inv, branch === "HEAD" ? "the default branch" : branch);
  } else if (marker) {
    // (b) the crash window: this clone's own marker proves the interrupted run happened HERE.
    if (branch === "HEAD") {
      throw new CliError(
        "RUNTIME",
        `the repository is on a detached HEAD — check out the branch that carries the committed ` +
          `${BUNDLE_DIR}/ folder, then re-run '${inv} sync --establish --yes'`,
      );
    }
    if (!yes) {
      rec.note =
        `an interrupted establishment left the board branch pushed but no folder-removal commit — ` +
        `re-run '${inv} sync --establish --yes' to re-create it on '${CLEANUP_BRANCH}' ` +
        `(nothing has been changed by this run)`;
    } else if (!fetchOk) {
      throw new CliError(
        "TRANSIENT",
        `establish refused: could not reach '${BOARD_REMOTE}' — finishing the interrupted ` +
          `establishment re-creates the folder-removal commit, which must be cut from a fresh view ` +
          `of ${BOARD_REMOTE}; get online, then re-run`,
        { details: { retryable: true } },
      );
    } else {
      assertNotBehindOnBoard(top, inv, branch);
      const remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
      if (!remoteCommit || !isAncestor(top, marker, remoteCommit)) {
        throw new CliError(
          "CONFLICT",
          `origin/${BOARD_BRANCH} does not contain this clone's interrupted establishment ` +
            `snapshot — a different board was published; nothing was changed, and the committed ` +
            `folder here is untouched`,
          {
            details: { snapshot_commit: marker },
            help:
              `coordinate with whoever published origin/${BOARD_BRANCH}; to discard this clone's ` +
              `interrupted snapshot: git branch -D ${BOARD_BRANCH}`,
          },
        );
      }
      const markerTree = treeOf(top, marker);
      if (!markerTree) {
        throw new CliError("RUNTIME", `the establishment marker names an unavailable commit (${marker}); nothing was changed`);
      }
      const currentTree = folderTreeAtHead(top);
      if (currentTree !== markerTree) {
        throw new CliError(
          "CONFLICT",
          `${BUNDLE_DIR}/ changed on '${branch}' after the interrupted establishment pushed its ` +
            `snapshot — re-creating the folder-removal now would strand those newer board changes ` +
            `on the frozen folder; nothing was changed`,
          {
            details: { snapshot_tree: markerTree, current_tree: currentTree ?? "absent" },
            help:
              `the newer changes stay recoverable in '${branch}' history; after the cleanup PR ` +
              `merges and this clone joins via '${inv} sync', re-apply them with doc update`,
          },
        );
      }
      const removalSha = createRemovalCommit(top, inv, branch);
      mustGit(top, ["branch", CLEANUP_BRANCH, removalSha]);
      clearMarker(top, COMMITTED_MARKER_KEY);
      rec.recovered =
        `an interrupted establishment left the board branch pushed but no folder-removal commit — ` +
        `it has been re-created on '${CLEANUP_BRANCH}'`;
      rec.cleanup_branch = CLEANUP_BRANCH;
      rec.cleanup_commit = removalSha;
      rec.next_steps = committedNextSteps(inv, branch);
      rec.both_worlds = bothWorldsLine(branch);
    }
  } else {
    // (c) a clone that hasn't pulled the removal yet. Probe origin's actual state so the note
    // never asserts a PR that may or may not exist.
    const remoteRef = `refs/remotes/${BOARD_REMOTE}/${branch}`;
    const remoteBranchKnown =
      branch !== "HEAD" && runGit(top, ["rev-parse", "--verify", "--quiet", remoteRef]).status === 0;
    const landedUpstream =
      remoteBranchKnown && runGit(top, ["cat-file", "-e", `${remoteRef}:${BUNDLE_DIR}`]).status !== 0;
    rec.note = landedUpstream
      ? `this clone still carries the committed ${BUNDLE_DIR}/ folder and the folder-removal has ` +
        `already landed on '${branch}' — run 'git pull' (the folder vanishes), then '${inv} sync' ` +
        `(it returns as the live board)`
      : `this clone still carries the committed ${BUNDLE_DIR}/ folder — once the folder-removal ` +
        `lands on the default branch: 'git pull' (the folder vanishes), then '${inv} sync' ` +
        `(it returns as the live board)`;
  }

  stdout(render(rec, mode));
}
