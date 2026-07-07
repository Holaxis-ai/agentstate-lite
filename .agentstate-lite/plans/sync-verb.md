---
type: Plan
title: >-
  sync verb v2: board branch + linked worktree — folder-scoped by construction
  (panel-reviewed)
timestamp: '2026-07-07T19:39:02.435Z'
---
# sync verb — design v2 (board branch + linked worktree)

v2 pinned 2026-07-07, superseding v1 after the 4-agent panel review
([research/sync-verb-review](../research/sync-verb-review.md)) showed v1's shared-branch
porcelain unsafe in the common case. Architecture change recorded in
[decisions/board-branch-sync](../decisions/board-branch-sync.md) (Brian approved; Mike to
confirm before migration executes). The driving requirement, from Brian directly: sync must
touch ONLY `.agentstate-lite/`. Git cannot pull or push a folder on a shared branch —
those operations are branch-atomic — so folder scoping is achieved STRUCTURALLY: the
bundle lives on a dedicated `board` branch (branch root = bundle root) checked out as a
linked worktree at `.agentstate-lite/`, gitignored on main.

## What changed from v1 (each traced to a panel finding)

- v1's `git pull --rebase` on the shared branch refused on any unstaged change, could
  corrupt uncommitted user code via `--autostash` while exiting 0, rebased the founders'
  own code commits, and stranded the repo mid-rebase on conflict. Under the board
  worktree, sync physically cannot touch user code: the rebase replays only bundle
  commits, conflicts occur only in docs, and the worktree has its OWN index (no
  index.lock contention with the user's git).
- v1's pathspec commit silently dropped NEW (untracked) docs. v2 stages first: `add -A`
  inside the worktree, then commit.
- v1 folded the pull into the SessionStart home view, violating home()'s structural
  offline guarantee. v2 splits them (below).
- v1's cursor had no error branch. v2 specifies guard + re-anchor + honest reporting.
- v1 named no push trigger. v2 wires the loop's other half (below).

## Shape

`aslite sync [--pull-only]` — shell to SYSTEM git, always `git -C <worktree>`, env
scrubbed (unset GIT_DIR / GIT_WORK_TREE / GIT_INDEX_FILE — inherited values override `-C`),
GIT_TERMINAL_PROMPT=0, GIT_SSH_COMMAND='ssh -o BatchMode=yes -o ConnectTimeout=10':

0. **provision**: worktree absent but `board` exists on origin → `git worktree add
   .agentstate-lite board` (self-healing clone). No git repo at all → definitive
   "sync: nothing to sync", exit 0. All worktree internals via `git rev-parse --git-path`
   (in a linked worktree `.git` is a FILE — never assume a directory).
1. **commit**: `git add -A` → `git commit -m "board: <actor> — N docs"`; skip when
   `git diff --cached --quiet` (idempotent no-op).
2. **pull**: `git fetch origin` → `git rebase @{u}` inside the worktree. On conflict:
   collect ids via `diff --name-only --diff-filter=U`, then `git rebase --abort` — NEVER
   leave the worktree mid-rebase — and exit CONFLICT(5) reporting both versions per doc
   with resolution routed through `doc update` (never hand-edited conflict markers).
3. **push** (`--pull-only` skips 1 and 3).
4. **Envelope**: `{committed, pulled, pushed, conflicts{shown,total,rows}}` (cap()
   convention); "sync: nothing to sync" exit 0. classifyGitError chokepoint: git-missing →
   RUNTIME(1) with help "install git", auth → AUTH(4), unresolved conflict → CONFLICT(5).
   No raw git output on stdout, ever. Precondition failures (detached HEAD, no upstream)
   are structured errors naming the state.

## The four rules (v1's, upgraded)

1. **Git optional** — unchanged. Stated plainly now: the awareness value lives in this
   tier; a git-less bundle gets zero awareness by design.
2. **Path-scoped, always** — now BY CONSTRUCTION (the synced branch contains only the
   bundle), not by per-command discipline.
3. **AXI at the boundary** — unchanged, plus the non-interactive guards above.
4. **Command layer only** — unchanged; the engine never learns git exists. Placement:
   new `cli/src/git.ts` + `cli/src/cursor.ts`; `packages/core` untouched.

## Awareness cursor

Keyed per BUNDLE (repo remote URL + subpath; fallback: absolute bundle root), stored in
`~/.agentstate/` with credentials.ts's atomic-write/0600 discipline, as an OPAQUE
`{tier: "git", token: <sha>}` — the future D1 tier ships `{tier: "d1", token: <seq>}`
behind the same `changesSince(cursor) → {docId, actor}[]` interface, keeping the CLI
surface tier-agnostic. Guard `git cat-file -e <token>^{commit}` before diffing; on miss,
re-anchor to HEAD and report "delta unavailable (history rewritten)" — never silently
skip unseen changes. Two-dot diff (snapshot-to-snapshot; requires object existence, not
ancestry).

## SessionStart (split, preserving home's offline guarantee)

A SEPARATE hook step runs `sync --pull-only`: `fetch` + `merge --ff-only @{u}` in the
worktree (fail-soft: swallows not-a-repo, no-upstream, detached HEAD, divergence, dirty
refusal, auth/network — every nonzero exit), computes the delta + unpushed-commit count,
CACHES both to a file, advances the cursor. `home()` stays fs-only/offline/instant and
renders from the cache: "since your last session: N docs changed — <actor>: <ids>" plus
the honesty backstop: "M local board commits not yet pushed — run sync when online."
Hook wiring is a named open decision: extend axi-sdk-js installSessionStartHooks for a
second managed entry, or `hook install --with-sync` (default: --with-sync — no external
dependency). The richer human render (verb + kind + title, chronological) belongs to the
activity feed (plans/ui-orientation-brief) consuming the SAME derivation — one primitive,
two faces.

## Push triggers (the loop's other half)

- The SKILL's typical flow and the unit-close convention end with `sync` — recording work
  is not done until it is shared.
- Optional Stop/SessionEnd hook mirroring the pull step.
- The SessionStart unpushed-count is the backstop when both were missed.

## Migration (one-time; the current bundle is committed on main)

`git subtree split -P .agentstate-lite -b board` (preserves the folder's history as the
branch), push `board`; remove the folder from main's tree + gitignore it; provision
worktrees per clone (or let sync self-provision). Scriptable; candidate `sync --migrate`.
Human-gated: runs on this repo only after Mike confirms the decision doc.

## Carried unchanged from v1

Conflict model (one doc = one file; git 3-way merges different-doc concurrency; same-doc
= CAS-conflict-at-sync-time; escalation to `serve` as a shared head or the frozen worker
is CONFIG, not build). Real-time ladder parked with wake conditions. Non-goals: no
daemon, no auto-commit-per-write, no submodules (the linked worktree is NOT a submodule —
same repo, no gitlink), no embedded git library (system git inherits the user's auth —
still the whole point), no cross-repo multi-bundle orchestration.
