---
type: Research
title: >-
  sync verb design review — 4-agent panel findings (red flags, survived attacks,
  verified command shapes)
timestamp: '2026-07-07T19:39:02.204Z'
---
# sync verb design review — 4-agent panel findings (2026-07-07)

Dialectic review of the v1 sync design: four epistemically isolated reviewers (adversarial
skeptic, git-mechanics specialist with empirical scratch-repo verification on git 2.39.5,
architecture/scope, consumer advocate). Unanimous shape: sound approach, NOT buildable as
written. This record is the evidence base for the v2 revision
([plans/sync-verb](../plans/sync-verb.md)) and the binding plan
([plans/sync-verb-implementation](../plans/sync-verb-implementation.md)).

## Red flags (convergent findings first)

1. **(3/4 reviewers; empirical) `git pull --rebase` on the shared branch fails or corrupts
   in the common case.** Refuses on ANY unstaged change anywhere; `--autostash` can write
   conflict markers into the user's uncommitted CODE files and exit 0 (reproduced); the
   whole-branch rebase replays the founders' own code commits; a doc conflict strands the
   entire repo mid-rebase, pushing agents into the raw-marker editing the skill forbids.
2. **(empirical) v1's `git commit -- <path>` silently drops NEW docs.** Pathspec commits
   only pick up tracked files — a freshly created task/note syncs "successfully" and never
   leaves the machine. Fix verified: `git add -A -- <path>` then pathspec commit, leaving
   the user's unrelated staged code intact.
3. **(2/4, disjoint evidence) SessionStart pull violates home()'s structural OFFLINE
   GUARANTEE** (home.ts:10-21, "never fetches") under the 10s hook timeout — and the hook
   surface installs exactly ONE command today. Fix: a separate `sync --pull-only` hook step
   caching awareness state to a file; home stays fs-only and instant.
4. **(3/4) The cursor-as-SHA has no error branch** — history rewrites (incl. sync's own
   rebase) dangle it → `fatal: Invalid revision range` (reproduced). Fix: `git cat-file -e`
   existence guard, re-anchor with an honest "delta unavailable (history rewritten)" note,
   per-BUNDLE keying (not per-machine), opaque `{tier, token}` shape for the future D1 seq
   tier.
5. **(consumer advocate) The push half of the loop has no trigger.** Only pulling is
   automated; writes rot locally unless an agent remembers a verb the skill never mentions;
   commit-succeeded-push-failed is invisible to the human. Fix: skill typical-flow +
   unit-close triggers, and SessionStart reports unpushed local board commits.

Also carried: GIT_DIR/GIT_WORK_TREE/GIT_INDEX_FILE env leakage overrides `-C` (reproduced —
scrub them); no cross-process lock (index.lock races between agents and the user's own
git); exit-code mapping unpinned (git-missing→1, auth→4, conflict→5; a conflicted run must
EXIT 5, never 0-with-an-array); GIT_TERMINAL_PROMPT=0 doesn't cover SSH prompts (add
GIT_SSH_COMMAND BatchMode) and auth-vs-missing-repo is only a coarse stderr heuristic;
detached HEAD / no-upstream unhandled; rename detection is threshold-based (decision:
doc identity == path, so A+D without `-M` is semantically correct).

## Survived attack (calibration)

git-as-the-change-feed core bet; one-doc-one-file 3-way merge for different-doc
concurrency; two-dot diff for awareness; GIT_TERMINAL_PROMPT=0 killing the hang class;
the detect step's AXI semantics; gate-3 engine git-blindness; scope cleanliness vs
docs/core; the `board:` commit prefix as a stable filter contract.

## Verified command shapes (scratch-repo-confirmed)

All with env scrubbed + `git -C <dir>`, GIT_TERMINAL_PROMPT=0, GIT_SSH_COMMAND BatchMode:
detect `rev-parse --is-inside-work-tree`; preconditions `symbolic-ref -q HEAD` /
`rev-parse --abbrev-ref @{u}` / dirty-tree `status --porcelain`; commit `add -A` →
`commit -m "board: <actor> — N docs"` (skip on `diff --cached --quiet`); conflict path
`diff --name-only --diff-filter=U` → `rebase --abort` → report; cursor
`cat-file -e <token>^{commit}` → `diff --name-status <token>..HEAD`; SessionStart
`fetch` + `merge --ff-only @{u}` swallowing every nonzero exit.

## Outcome

The whole-branch entanglement (flag 1) motivated v2's architecture change — dedicated
board branch + linked worktree, see
[decisions/board-branch-sync](../decisions/board-branch-sync.md). Flags 2–5 fixes carried
into v2 verbatim.
