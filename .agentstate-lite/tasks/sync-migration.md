---
type: Task
title: U5 migrate this repo's bundle to the board branch (Mike-gated)
status: in_progress
priority: '1'
description: >-
  U5. sync --migrate (yes-guarded, idempotent) subtree-split to the board branch
  with push -u; never runs git clean; records discipline. HUMAN-GATED on Mike.
  Deps: sync-command-core.
actor: brian-claude
assignee: brian-claude
timestamp: '2026-07-09T16:51:44.446Z'
---
# U5 — migration of THIS repo's bundle (HUMAN-GATED: Mike)

Builder brief. Plan: [plans/sync-verb-implementation](../plans/sync-verb-implementation.md)
§U5. Decision:
[decisions/board-branch-sync](../decisions/board-branch-sync.md) (Mike confirms before
execution).

## Definition of done

`sync --migrate` — guarded, never on the everyday path; requires `--yes`; idempotent →
"already migrated". Steps:
- `git subtree split -P .agentstate-lite -b board` (preserves the folder's history)
- `git push -u origin board` (the `-u` is load-bearing — the split branch has no tracking
  config)
- remove the folder from main's tree + gitignore it; both founders' machines provision
  worktrees on their next sync.

PRECONDITIONS: every founder syncs (at minimum commits) board state first; `--migrate`
REFUSES if uncommitted board changes exist.

Migration NEVER executes any `git clean` (adjudication H) — the `git clean -fdx` line exists
ONLY as rollout-note copy (see COMMS).

## COMMS

One-time heads-up in the PRE-migration rollout note (reassurance lives here; post-migration
first render is backup): after `git pull`, `.agentstate-lite/` briefly disappears from main
and is re-created on the next aslite command; nothing is lost; from then on `aslite sync`,
not `git pull`, updates the board. The "you may notice a `board` branch in GitHub — never
merge it into main" aside gains one line: `git clean -fdx` on main removes the board
checkout (recoverable — re-provisions from origin; unpushed board commits are why you sync
first). Prompt founders to re-run `hook install` (adjudication E).

## RECORDS DISCIPLINE

Update tasks/git-sharing + docs/core so "git pull IS the sharing mechanism" never outlives
the mechanism. No user-facing string contains "worktree"/"linked"/"subtree".

## Acceptance criteria

- `--migrate` requires `--yes`; idempotent "already migrated"; refuses on uncommitted board
  changes
- board pushed with `-u`; folder removed from main + gitignored
- NO `git clean` invoked anywhere in the migration path
- rollout-note copy present (incl. the `git clean -fdx` reassurance line)

## Gates

Builder → independent Reviewer → QA. Deps: sync-command-core (U3a). HUMAN GATE: Mike
confirms decisions/board-branch-sync before this executes on the repo.

[depends on](sync-command-core.md)
