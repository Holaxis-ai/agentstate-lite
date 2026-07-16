// `sync-engine.ts` — the git tier's NEUTRAL engine helpers (board-git A0 seam prep).
//
// These helpers used to live in `commands/sync.ts`, which made every other consumer (autopull.ts,
// commands/session-start.ts, commands/home.ts, commands/sync-establish.ts) import a COMMAND
// module for engine facts — the inverted dependency the board-git extraction plan names. This
// module un-inverts it: command modules import engine modules (git.ts, cursor.ts, this file),
// never each other. Command UX (arg parsing, envelopes, help text, exit mapping) stays in
// `commands/sync.ts`; nothing here renders, resolves invocations, or touches exit codes.
import { existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";

import {
  BOARD_REMOTE,
  BUNDLE_DIR,
  abortStaleRebase,
  detectStaleRebase,
  repoTopLevel,
  runGit,
  type DocChange,
  type ProvisionOutcome,
} from "./git.js";
import { bundleKey, type AwarenessDeltaRow } from "./cursor.js";

/** realpath when the path exists; the path unchanged otherwise (for stable comparisons). */
function realOrSame(p: string): string {
  try {
    return realpathSync(p);
  } catch {
    return p;
  }
}

/**
 * True when `p` is inside a LINKED git worktree: its per-worktree git dir differs from the shared
 * common dir. A standalone repo — including an unrelated nested repo squatting at the bundle path
 * (sync review round 2, finding 1) — resolves both to the SAME directory.
 */
function isLinkedWorktree(p: string): boolean {
  const r = runGit(p, ["rev-parse", "--absolute-git-dir", "--git-common-dir"]);
  if (r.status !== 0) return false;
  const [gitDirRaw, commonDirRaw] = r.stdout.trim().split("\n");
  if (!gitDirRaw || !commonDirRaw) return false;
  const commonDir = path.isAbsolute(commonDirRaw) ? commonDirRaw : path.resolve(p, commonDirRaw);
  return realOrSame(gitDirRaw) !== realOrSame(commonDir);
}

/** True for git's linked-worktree/submodule marker shape: a `.git` FILE, not a directory. */
function hasGitFileSignature(p: string): boolean {
  try {
    return statSync(path.join(p, ".git")).isFile();
  } catch {
    return false;
  }
}

/**
 * Path-only fallback for the mount-move case: stale worktree pointers make `repoTopLevel(dir)`
 * fail from inside `.agentstate-lite`, but the enclosing path still names the conventional board
 * checkout. Retarget to its parent so `provisionBoardWorktree` can run the repair path. The `.git`
 * FILE gate keeps this away from plain pre-migration bundle directories; independent nested repos
 * with a `.git` directory still fall through to the normal no-board/no-repo classification.
 */
function retargetStaleBoardInteriorByPath(dir: string): string | null {
  let cur = path.resolve(dir);
  for (;;) {
    if (path.basename(cur) === BUNDLE_DIR && hasGitFileSignature(cur)) {
      return path.dirname(cur);
    }
    const parent = path.dirname(cur);
    if (parent === cur) return null;
    cur = parent;
  }
}

/**
 * Sync run from INSIDE the board worktree — exactly where an agent sits right after
 * `doc write --dir .agentstate-lite` — used to fail with a leaked doubled path (sync review
 * round 2, finding 2). The structural signature of "standing inside the board" is a repo top that
 * is BOTH named `.agentstate-lite` AND a linked worktree; retarget to its parent directory (the
 * enclosing project), where the normal resolution — heal probe, then provisioning's idempotent
 * "already" branch — proceeds against the REAL board path.
 */
export function retargetBoardInterior(dir: string): string {
  try {
    const top = repoTopLevel(dir);
    if (top && path.basename(top) === BUNDLE_DIR && isLinkedWorktree(top)) {
      return path.dirname(top);
    }
  } catch {
    /* fall through — the normal flow classifies whatever this is */
  }
  return retargetStaleBoardInteriorByPath(dir) ?? dir;
}

/**
 * Sync's STEP-0 entry self-heal (adjudication C) — run BEFORE `provisionBoardWorktree`:
 * `isProvisioned` requires the `board` branch checked out, but a REBASE detaches HEAD, so a
 * genuinely-provisioned-but-wedged worktree would misclassify as a stray directory and the refusal
 * would fire before the heal ever ran. The probe touches ONLY a candidate that is (a) its OWN
 * worktree root (`repoTopLevel` resolves back to itself — never a plain subdirectory of the
 * enclosing repo, whose shared git dir an abort would destroy) and (b) a LINKED worktree (a
 * standalone nested repo at the bundle path must never be healed). Best-effort otherwise: any
 * other failure is swallowed — a genuine problem resurfaces, classified, from
 * `provisionBoardWorktree` right after.
 */
export function healStaleRebaseBeforeProvisioning(dir: string): void {
  try {
    const top = repoTopLevel(dir);
    if (!top) return;
    const candidateBoardPath = path.join(top, BUNDLE_DIR);
    if (!existsSync(candidateBoardPath)) return;
    const boardTop = repoTopLevel(candidateBoardPath);
    if (!boardTop || realOrSame(boardTop) !== realOrSame(candidateBoardPath)) return;
    if (!isLinkedWorktree(candidateBoardPath)) return;
    if (detectStaleRebase(candidateBoardPath)) {
      abortStaleRebase(candidateBoardPath);
    }
  } catch {
    /* best-effort probe only — see the doc comment above */
  }
}

/**
 * The per-clone cursor/cache/marker key (U2's `bundleKey`) for THIS board worktree — THE one
 * derivation (cache-per-clone review advisory (a): sync/home/session-start/autopull all REUSE
 * this; a second independent derivation is the real state-split risk). NOTE for callers: this
 * realpaths the board path itself (`realOrSame`) — pass the board worktree path as resolved from
 * the repo top, and do NOT pre-normalize it differently. Keyed by the `origin` remote URL (git
 * worktrees share one remote config with their main worktree) with an empty subpath (the board
 * branch's root IS the bundle root — gate 2) PLUS the board worktree's own realpath as the
 * checkout identity — two clones of one origin on one machine must never share a state file
 * (PR#13 review, item 4). Falls back to the absolute board path alone when no origin URL resolves
 * (U2's own path fallback for a remote-less repo).
 */
export function resolveBundleKey(boardPath: string): string {
  const checkoutRoot = realOrSame(boardPath);
  const r = runGit(boardPath, ["remote", "get-url", BOARD_REMOTE]);
  if (r.status === 0 && r.stdout.trim().length > 0) {
    return bundleKey({ remoteUrl: r.stdout.trim(), subpath: "", checkoutRoot });
  }
  return bundleKey({ root: checkoutRoot });
}

/** The single actor when every committed doc shares one (mirrors `git.ts`'s commit-subject grammar). */
export function singleActor(docs: DocChange[]): string | undefined {
  if (docs.length === 0) return undefined;
  const actors = new Set(docs.map((d) => d.actor));
  return actors.size === 1 ? docs[0]!.actor : undefined;
}

/**
 * Project the enriched delta feed into `AwarenessDeltaRow[]` (the cache's persisted shape). A
 * plain `DocChange[]` isn't directly assignable — `AwarenessDeltaRow` carries an index signature
 * for a future producer's extra fields, and `DocChange` (a fixed, non-indexed interface) doesn't
 * structurally satisfy it — so this rebuilds each row as a fresh object literal instead.
 */
export function toDeltaRows(changes: DocChange[]): AwarenessDeltaRow[] {
  return changes.map((c) => ({ docId: c.docId, verb: c.verb, kind: c.kind, title: c.title, actor: c.actor }));
}

/**
 * decisions/board-branch-sync rider 2 (binding): provisioning is a git mutation and must be
 * ANNOUNCEABLE — "says so in structured output — never a silent git mutation." Only `provisioned`
 * (a fresh materialize) and `repaired` (the stale-pointer self-heal) MUTATED anything this run;
 * `already`/`no_repo`/`no_board` did nothing to announce, so this returns `undefined` for them —
 * the omit-when-absent convention every envelope follows. Message pack shape (test-pinned): one
 * field, named for the outcome, `<path> — <what happened>`.
 */
export function provisionAnnouncement(outcome: ProvisionOutcome): Record<string, string> | undefined {
  if (outcome.kind === "provisioned") {
    // `source` distinguishes a clone/join from a pre-existing local `board` branch, so the
    // receipt never claims remote provenance for content that came from a local-only branch.
    const detail =
      outcome.source === "remote" ? "materialized from origin/board" : "materialized from the local board branch";
    return { provisioned: `${outcome.boardPath} — ${detail}` };
  }
  if (outcome.kind === "repaired") {
    return { repaired: `${outcome.boardPath} — worktree pointers repaired` };
  }
  return undefined;
}
