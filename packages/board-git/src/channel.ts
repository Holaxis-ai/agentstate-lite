// `channel.ts` — the BoardChannel seam (board-git PR B, plans/board-git-package): a READ-ONLY
// classifier naming WHERE this project's board lives. Detection COMPOSES WITH — never replaces —
// the provisioning state machine: callers run it AFTER `retargetBoardInterior` and the heal/repair
// steps (`healStaleRebaseBeforeProvisioning`, `provisionBoardWorktree`'s worktree repair), and it
// never mutates anything — no fetch, no ref deletion, no repair. It may DESCRIBE a state the
// provisioning machine refuses; it must never re-route that machine's reviewed guidance.
//
// Rule 1 keys on the WEAK structural signature (worktree machinery owned by this repo — the
// porcelain signature helpers), NEVER `isProvisioned`: a rebase detaches HEAD, so a genuinely
// provisioned but wedged-mid-rebase board is never "on the board branch" until healed — keying on
// the branch would misclassify it as not-branch and regress the heal pipeline (this exact
// misclassification was fixed over multiple historical review rounds).
//
// Remote-unknown FAILS CLOSED (plans/board-git-package, second review required change 1):
// "definitively absent" requires a probe that SUCCEEDED; a dead probe with no previously fetched
// evidence is a typed INDETERMINATE outcome — never "absent", never `in-tree`, never `local-only`.
// Classifying uncertainty as in-tree could hide an existing shared board and create two competing
// board locations once connectivity returns.
import path from "node:path";

import { BoardGitError, isBoardGitError } from "./errors.js";
import {
  BOARD_BRANCH,
  BOARD_REF,
  BOARD_REMOTE,
  BUNDLE_DIR,
  NETWORK_TIMEOUT_MS,
  hasWorktreeSignature,
  preShareWindowError,
  repoTopLevel,
  runGit,
  worktreeRootResolves,
  worktreeRootResolvesForOwner,
  type NetworkBudgetOptions,
} from "./porcelain.js";
import { folderTreeAtHead, localBranchExists, refCommit, treeOf } from "./flow.js";

/**
 * The channel a project's board rides. `branch` is the dedicated-board-branch mode (checked out
 * as a linked worktree) — its `branch`/`remote` fields default to the porcelain channel constants
 * (`BOARD_BRANCH`/`BOARD_REMOTE`). `in-tree` is the bundle committed with code on the current
 * branch — a supported READ-SIDE mode (PR C, `intree.ts`): awareness/freshness ride the branch's
 * tracking upstream, delivery is the user's own `git pull`, and every write verb refuses with
 * guidance (sharing rides the normal commit/push, or `sync --establish` converts to `branch`).
 * `local-only` is a board that is neither provisioned nor tracked nor shared anywhere.
 */
export type BoardChannel =
  | { mode: "branch"; branch: string; remote: string }
  | { mode: "in-tree" }
  | { mode: "local-only" };

/** The probes detection can refuse to decide on (today: only the remote-board existence probe). */
export type ChannelProbeName = "remote-board";

/**
 * What is known about the remote board branch. `absent` is only ever a probe that SUCCEEDED
 * (a live `ls-remote` answering "no such ref", or no remote configured at all); a probe that
 * FAILED is `unknown` unless previously fetched evidence (`refs/remotes/origin/board`) exists.
 */
export type RemoteBoardState = "exists" | "absent" | "unknown";

/**
 * A detection outcome. Indeterminacy is NOT a durable mode — it is an explicit refusal to decide,
 * carrying which probe was unknowable and why. (PR B's interim `unsupported` kind is gone: PR C
 * shipped in-tree's read-side semantics, so `in-tree` is a real channel now.)
 */
export type ChannelDetection =
  | { kind: "channel"; channel: BoardChannel }
  | { kind: "indeterminate"; probe: ChannelProbeName; folderTracked: boolean; reason: string };

/** Why a tracked-folder detection refuses to decide under an unknown remote (fail closed). */
export const INDETERMINATE_TRACKED_REASON =
  `'${BUNDLE_DIR}/' is committed on the current branch, but ${BOARD_REMOTE} could not be checked ` +
  `for a shared '${BOARD_BRANCH}' branch — refusing to classify: an existing shared board must ` +
  `never be shadowed by guessing in-tree`;

/** Why an untracked-folder detection refuses to decide under an unknown remote (fail closed). */
export const INDETERMINATE_UNTRACKED_REASON =
  `${BOARD_REMOTE} could not be checked for a shared '${BOARD_BRANCH}' branch and no previously ` +
  `fetched evidence exists — refusing to classify: mode-sensitive operations (establish, ` +
  `conversion) should refuse and retry when ${BOARD_REMOTE} is reachable; local reads are unaffected`;

export interface DetectBoardChannelOptions {
  /**
   * Replace the remote-board probe (injected for deterministic tests, or by a caller that already
   * holds a fresher answer). Receives the repo top; defaults to {@link probeRemoteBoardState}.
   */
  remoteBoardState?: (top: string) => RemoteBoardState;
  /** Network budget for the DEFAULT probe (ignored when `remoteBoardState` is injected). */
  budget?: NetworkBudgetOptions;
}

/** A fresh `branch` channel populated from the porcelain defaults (never a shared mutable). */
function branchChannel(): ChannelDetection {
  return { kind: "channel", channel: { mode: "branch", branch: BOARD_BRANCH, remote: BOARD_REMOTE } };
}

function localOnlyChannel(): ChannelDetection {
  return { kind: "channel", channel: { mode: "local-only" } };
}

/**
 * What is known about `origin/board`, without mutating anything — the same evidence model
 * `provisionBoardWorktree` uses, minus its ref writes:
 *
 *  - no `origin` remote configured → structural: `absent` (nothing can exist there), unless a
 *    leftover fetched ref says a board existed (`exists` — stale evidence still counts);
 *  - live `ls-remote --exit-code` answers 0 → `exists`; answers 2 → `absent` (a SUCCESSFUL probe
 *    saying "no such ref" — this overrides stale fetched evidence, exactly as provisioning's
 *    `remoteBoardKnownAbsent` does, except detection never deletes the stale ref);
 *  - the probe FAILED (offline, auth-denied, dead host, timeout) → previously fetched evidence
 *    (`refs/remotes/origin/board`) reads as `exists` (the offline-join path provisioning already
 *    honors); no evidence → `unknown`. NEVER `absent` off a dead probe — a "Repository not found"
 *    from an unauthorized private remote must not read as "no board exists".
 */
export function probeRemoteBoardState(top: string, budget: NetworkBudgetOptions = {}): RemoteBoardState {
  const fetchedRef = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0;
  const hasOrigin = runGit(top, ["remote", "get-url", BOARD_REMOTE]).status === 0;
  if (!hasOrigin) return fetchedRef ? "exists" : "absent";
  let probeStatus: number | null = null;
  try {
    probeStatus = runGit(top, ["ls-remote", "--exit-code", BOARD_REMOTE, `refs/heads/${BOARD_BRANCH}`], {
      timeoutMs: budget.fetchTimeoutMs ?? NETWORK_TIMEOUT_MS,
      connectTimeoutSeconds: budget.connectTimeoutSeconds,
    }).status;
  } catch (err) {
    // A fired timeout is a failed probe, not a verdict; anything else (GIT_MISSING) is real.
    if (!isBoardGitError(err) || err.code !== "TRANSIENT") throw err;
    probeStatus = null;
  }
  if (probeStatus === 0) return "exists";
  if (probeStatus === 2) return "absent";
  return fetchedRef ? "exists" : "unknown";
}

/**
 * True when this repo's OWN common dir carries a worktree REGISTRATION for the conventional board
 * path — the structural "ours, but the pointers are stale" signal for rule 1's second arm (a
 * moved/remounted checkout whose worktree-side `.git` file no longer resolves). Read from
 * `git worktree list --porcelain` (the registration side, which survives worktree-side breakage);
 * the recorded path may be the OLD absolute path, so only its basename is matched. A dangling
 * `.git` FILE with no registration here (e.g. a `cp -r`'d board folder from another repo) is NOT
 * this repo's board and falls through to the tracked/untracked rows.
 */
function ownerRegistersBoardWorktree(top: string): boolean {
  const r = runGit(top, ["worktree", "list", "--porcelain"]);
  if (r.status !== 0) return false;
  return r.stdout
    .split("\n")
    .some((l) => l.startsWith("worktree ") && path.basename(l.slice("worktree ".length).trim()) === BUNDLE_DIR);
}

/**
 * True ONLY when locally held `origin/board` objects PROVE the shared branch was never seeded
 * from this folder: every root commit's tree differs from `HEAD:.agentstate-lite`'s tree. Any
 * unverifiable state (no fetched ref, unreadable history) returns false, deliberately routing to
 * the pre-share-window arm — its pull-first guidance is the reviewer-proven safe default for a
 * tracked folder facing an existing remote board, and it is what today's provisioning emits for
 * BOTH states.
 */
function verifiedForeignBoardRoot(top: string): boolean {
  const folderTree = folderTreeAtHead(top);
  if (folderTree === null) return false;
  if (refCommit(top, `refs/remotes/${BOARD_REF}`) === undefined) return false;
  const roots = runGit(top, ["rev-list", "--max-parents=0", `refs/remotes/${BOARD_REF}`]);
  if (roots.status !== 0) return false;
  const shas = roots.stdout
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (shas.length === 0) return false;
  return shas.every((sha) => treeOf(top, sha) !== folderTree);
}

/** The genuinely-dual refusal: two competing board locations, verified against local objects. */
function dualBoardError(boardPath: string): BoardGitError {
  return new BoardGitError(
    "CONFLICT",
    `a shared '${BOARD_BRANCH}' branch exists on ${BOARD_REMOTE} AND '${BUNDLE_DIR}' is committed ` +
      `on the current branch with content that never seeded that branch — two competing board ` +
      `locations; nothing is safe to adopt automatically`,
    {
      details: { path: boardPath, state: "dual-board" },
      help:
        `choose one explicitly: keep the shared branch (reconcile the committed folder's docs onto ` +
        `it, then remove the folder from this branch), or keep the committed folder (coordinate ` +
        `with your team before retiring the remote '${BOARD_BRANCH}' branch)`,
    },
  );
}

/**
 * Classify WHERE this project's board lives (the detection matrix, plans/board-git-package §The
 * BoardChannel seam — every row pinned by `test/channel.test.ts`):
 *
 *  1. board worktree signature owned by this repo (incl. wedged mid-rebase and stale-pointer
 *     states — heal/repair's business, not detection's) → `branch`, no remote probe at all;
 *  2. tracked folder + remote board seeded from it (or unverifiable) → the pre-share-window
 *     refusal, verbatim (`preShareWindowError` — ONE factory shared with provisioning);
 *  3. tracked folder + VERIFIED foreign remote board → the typed dual-board refusal;
 *  4. tracked folder + remote definitively absent → `in-tree` (the supported read-side mode);
 *  5. tracked folder + remote unknown → typed indeterminate (never in-tree, never absent);
 *  6. untracked + a local `board` branch → `branch` (the join/provision `local_board` path —
 *     adoption policy stays with provisioning; no remote probe needed);
 *  7. untracked + remote board exists → `branch` (JOIN — the common onboarding state);
 *  8. untracked + remote definitively absent → `local-only`;
 *  9. untracked + remote unknown → typed indeterminate;
 * 10. no git repo at all → `local-only`.
 *
 * "Tracked" means the CONVENTIONAL `.agentstate-lite/` folder is a tree at HEAD — a bundle
 * committed anywhere else is not this seam's business (v1 scoping). READ-ONLY throughout; callers
 * compose it after `retargetBoardInterior` + the entry heal, exactly where sync's own resolution
 * runs today.
 */
export function detectBoardChannel(dir: string, options: DetectBoardChannelOptions = {}): ChannelDetection {
  const top = repoTopLevel(dir);
  if (!top) return localOnlyChannel();

  const boardPath = path.join(top, BUNDLE_DIR);

  if (hasWorktreeSignature(boardPath)) {
    if (worktreeRootResolvesForOwner(boardPath, top)) return branchChannel();
    if (!worktreeRootResolves(boardPath) && ownerRegistersBoardWorktree(top)) return branchChannel();
    // Resolvable-but-foreign machinery (another repo's checkout parked here, a submodule), or an
    // unregistered dangling `.git` file: not this repo's board — fall through to the tracked/
    // untracked rows; the provisioning state machine owns the refusal guidance for the path.
  }

  const tracked = folderTreeAtHead(top) !== null;

  if (!tracked && localBranchExists(top, BOARD_BRANCH)) return branchChannel();

  const remote = options.remoteBoardState
    ? options.remoteBoardState(top)
    : probeRemoteBoardState(top, options.budget);

  if (tracked) {
    if (remote === "exists") {
      if (verifiedForeignBoardRoot(top)) throw dualBoardError(boardPath);
      // The truth-fix arm (PR C): "exists" off stale fetched evidence with no configured remote
      // must not claim the branch "exists on origin" — the factory words the no-remote state.
      throw preShareWindowError(boardPath, runGit(top, ["remote", "get-url", BOARD_REMOTE]).status === 0);
    }
    if (remote === "absent") {
      return { kind: "channel", channel: { mode: "in-tree" } };
    }
    return { kind: "indeterminate", probe: "remote-board", folderTracked: true, reason: INDETERMINATE_TRACKED_REASON };
  }

  if (remote === "exists") return branchChannel();
  if (remote === "absent") return localOnlyChannel();
  return { kind: "indeterminate", probe: "remote-board", folderTracked: false, reason: INDETERMINATE_UNTRACKED_REASON };
}
