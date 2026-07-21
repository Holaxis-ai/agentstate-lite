// The home surface's sharing-chip classifier (designs/home-surface; plans/home-surface-build
// PR-B). Maps this bundle's board-channel evidence into ui-server's `SharingSummary` — the CLI
// owns the mapping, ui-server owns the shape vocabulary, the SPA owns the words.
//
// OFFLINE LOCAL-EVIDENCE ONLY (gate 5; design-review F4): no `ls-remote`, no network — the
// classification reads only what git already holds locally (fetched refs, remote config, HEAD
// trees), reusing board-git's ONE porcelain layer rather than growing a second git-parsing path.
// Consequence, stated: a shallow/single-branch clone whose shared board was never fetched can read
// `private` until its first fetch — `as_of` plus the sync-driven config refetch bound the window.
// The plan's "async spawns" is deliberately traded for porcelain reuse: the sync git reads run
// only on TTL expiry (~30s), tens of milliseconds, not per request.
//
// TRUTHFULNESS RULES (the review's F2/F3, pinned by test/ui-sharing.test.ts):
//  - never fabricate in EITHER direction — a wrong "shared" equals a wrong "private";
//  - any classification failure is `unavailable` with a reason, never a guessed state;
//  - the WRONG-TARGET guard: sharing is claimed ONLY for the repo's conventional board
//    (`<top>/.agentstate-lite`); any other served bundle inside a repo is `unscoped` (no claim).
import path from "node:path";
import { realpathSync } from "node:fs";
import type { SharingSummary, WorkspaceSummaryEntry } from "@agentstate-lite/ui-server";
import {
  BOARD_BRANCH,
  BOARD_REF,
  BOARD_REMOTE,
  BUNDLE_DIR,
  folderTreeAtHead,
  hasWorktreeSignature,
  localBranchExists,
  repoTopLevel,
  runGit,
  worktreeRootResolvesForOwner,
} from "@agentstate-lite/board-git";
import { loadCatalog } from "../catalog.js";

/** How long one classification is served before the local git evidence is re-read. */
export const SHARING_TTL_MS = 30_000;

/** Best-effort realpath (a missing path passes through — the comparison below just won't match). */
function realOr(p: string): string {
  try {
    return realpathSync(p);
  } catch {
    return p;
  }
}

/**
 * Humanize a git remote URL for the chip: a GitHub-shaped URL (https or scp-like ssh) degrades to
 * `org/repo`; anything else degrades to its host, else its path tail (review F2's non-GitHub rule).
 */
export function humanizeRemote(url: string): string {
  const trimmed = url.trim().replace(/\.git$/, "");
  const scpLike = /^[\w.-]+@([\w.-]+):(.+)$/.exec(trimmed);
  if (scpLike) {
    const [, host, tail] = scpLike;
    const parts = tail!.split("/").filter(Boolean);
    return parts.length >= 2 ? parts.slice(-2).join("/") : `${host}:${tail}`;
  }
  try {
    const parsed = new URL(trimmed);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts.length >= 2 ? parts.slice(-2).join("/") : parsed.host;
  } catch {
    const parts = trimmed.split("/").filter(Boolean);
    return parts.slice(-2).join("/") || trimmed;
  }
}

/** Local-evidence reads, isolated for the classifier below. */
function localEvidence(top: string): { originUrl: string | undefined; fetchedBoardRef: boolean; tracked: boolean } {
  const origin = runGit(top, ["remote", "get-url", BOARD_REMOTE]);
  const fetchedBoardRef = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0;
  return {
    originUrl: origin.status === 0 ? origin.stdout.trim() : undefined,
    fetchedBoardRef,
    tracked: folderTreeAtHead(top) !== null,
  };
}

/** Classify NOW (no cache) — exported pure-ish core, one row per truth-table state. */
export function classifySharing(bundleRoot: string, now: () => Date = () => new Date()): SharingSummary {
  const asOf = now().toISOString();
  try {
    const root = realOr(bundleRoot);
    // The board lives at <project>/.agentstate-lite; probe the PROJECT (the parent), so a linked
    // board WORKTREE (whose own top-level is the board folder itself) still anchors on the repo.
    const top = repoTopLevel(path.dirname(root));
    if (!top) return { kind: "private", as_of: asOf }; // a plain folder shares nothing
    if (realOr(path.join(top, BUNDLE_DIR)) !== root) return { kind: "unscoped", as_of: asOf };

    const evidence = localEvidence(top);
    const branchMode =
      (hasWorktreeSignature(root) && worktreeRootResolvesForOwner(root, top)) ||
      (!evidence.tracked && localBranchExists(top, BOARD_BRANCH));

    if (branchMode) {
      // Shared requires EVIDENCE the branch left this machine (a fetched origin/board ref) —
      // "origin exists" alone is a code remote, not a shared board (F2's local-only-branch row).
      if (evidence.fetchedBoardRef && evidence.originUrl) {
        return { kind: "shared_branch", remote: humanizeRemote(evidence.originUrl), as_of: asOf };
      }
      return { kind: "private_local_branch", as_of: asOf };
    }

    if (evidence.tracked) {
      if (evidence.fetchedBoardRef) {
        // Both a committed folder AND a shared branch: sync's pre-share-window/dual-board zone.
        // A determinate refusal state — reported as unavailable-with-reason, never a guess.
        return {
          kind: "unavailable",
          reason: `both a committed ${BUNDLE_DIR}/ folder and a fetched ${BOARD_REF} exist — run sync for guidance`,
          as_of: asOf,
        };
      }
      if (evidence.originUrl) {
        return { kind: "shared_intree", remote: humanizeRemote(evidence.originUrl), as_of: asOf };
      }
      return { kind: "private_intree_no_remote", as_of: asOf };
    }

    // Untracked, no board machinery here — but a fetched origin/board means a shared board exists
    // that this clone simply hasn't provisioned yet (the JOIN state).
    if (evidence.fetchedBoardRef && evidence.originUrl) {
      return { kind: "shared_branch", remote: humanizeRemote(evidence.originUrl), as_of: asOf };
    }
    return { kind: "private", as_of: asOf };
  } catch (err) {
    return { kind: "unavailable", reason: err instanceof Error ? err.message : String(err), as_of: asOf };
  }
}

/** TTL-cached loader for the ui server's config endpoint (the injection seam's dir-mode callback). */
export function createSharingLoader(bundleRoot: string, ttlMs: number = SHARING_TTL_MS): () => Promise<SharingSummary> {
  let cached: SharingSummary | undefined;
  let cachedAt = 0;
  return async () => {
    const nowMs = Date.now();
    if (!cached || nowMs - cachedAt >= ttlMs) {
      cached = classifySharing(bundleRoot);
      cachedAt = nowMs;
    }
    return cached;
  };
}

/** Registered-workspace rows for the home's collapsed block: labels + paths ONLY — deliberately NOT `listCatalogEntries` (its per-entry availability probes are the slow path home.ts also avoids). */
export function createWorkspacesLoader(bundleRoot: string): () => Promise<WorkspaceSummaryEntry[]> {
  const root = realOr(bundleRoot);
  return async () => {
    try {
      const catalog = await loadCatalog();
      return [...catalog.entries]
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((entry) => ({
          label: entry.label,
          path: entry.locator.path,
          open: realOr(entry.locator.path) === root,
        }));
    } catch {
      return []; // best-effort block — a malformed catalog never breaks the home
    }
  };
}
