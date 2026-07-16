// `agentstate-lite sync --establish` — the explicit local-bundle -> shared-board transition.
//
// Safety model: snapshot first, publish second, convert the local folder last. Until the exact
// board commit exists on origin, the user's only bundle copy is never renamed or modified. The
// local conversion keeps a deterministic backup until the provisioned worktree is verified. A
// local git-config marker makes an interrupted post-push conversion resumable without guessing
// from branch names, `index.md`, or crash debris.
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

function readEstablishMarker(top: string): string | undefined {
  try {
    const value = readFileSync(establishMarkerPath(top), "utf8").trim();
    return /^[0-9a-f]{40,64}$/.test(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

function writeEstablishMarker(top: string, commit: string): void {
  const markerPath = establishMarkerPath(top);
  const temporary = `${markerPath}.tmp-${process.pid}`;
  writeFileSync(temporary, `${commit}\n`, { mode: 0o600 });
  renameSync(temporary, markerPath);
}

function clearEstablishMarker(top: string): void {
  try {
    unlinkSync(establishMarkerPath(top));
  } catch {
    // Already absent (or cleanup will be retried on the next explicit establish).
  }
}

function establishMarkerPath(top: string): string {
  return path.join(mustGit(top, ["rev-parse", "--absolute-git-dir"]).trim(), ESTABLISH_MARKER_KEY);
}

function folderCommittedAtHead(top: string): boolean {
  return runGit(top, ["cat-file", "-e", `HEAD:${BUNDLE_DIR}`]).status === 0;
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
  if (folderCommittedAtHead(top)) {
    throw new CliError(
      "RUNTIME",
      `'${BUNDLE_DIR}/' is already committed on this branch — use '${inv} sync --migrate' instead`,
      { help: `${inv} sync --migrate` },
    );
  }
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
    clearEstablishMarker(top);
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
    clearEstablishMarker(top);
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
): Promise<EstablishOutcome> {
  const top = repoTopLevel(dir);
  if (!top) {
    throw new CliError("RUNTIME", "not inside a git repository — establish needs a repo with an 'origin' remote");
  }
  if (runGit(top, ["remote", "get-url", BOARD_REMOTE]).status !== 0) {
    throw new CliError("RUNTIME", `this repository has no '${BOARD_REMOTE}' remote`);
  }
  fetchOriginRequired(top);

  const boardPath = path.join(top, BUNDLE_DIR);
  const backupPath = `${boardPath}.establish-backup`;
  let marker = readEstablishMarker(top);
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
      clearEstablishMarker(top);
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
  writeEstablishMarker(top, snapshot.sha);
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
