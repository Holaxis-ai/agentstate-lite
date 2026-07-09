---
type: Task
title: U5 migrate this repo's bundle to the board branch (Mike-gated)
status: in_progress
priority: '1'
description: >-
  COMMAND SHIPPED 2026-07-09, commit 2e6bc39 (TEMPORARY flag; execution pending,
  human-timed): sync --migrate — --yes-gated with structured preview; idempotent
  'already migrated'; refuses on uncommitted board changes naming them; rider 1
  applied (files-not-history ROOT commit — the original subtree-split step
  SUPERSEDED); git push -u origin board; PR-shaped removal on a local
  board-migration branch per Brian's adjudication (nothing on the current branch
  pushed by the command; both-worlds window named honestly). Never runs git
  clean. Ship-use-DELETE lifecycle: removed in a follow-up PR after the founders
  execute; wake condition = a real external team asking for it. Task closes when
  the founders EXECUTE the migration. Deps: sync-command-core.
actor: builder-u5
assignee: brian-claude
timestamp: '2026-07-09T17:19:58.295Z'
---
# U5 — migration of THIS repo's bundle (COMMAND SHIPPED; execution human-timed)

Builder brief + build record. Plan:
[plans/sync-verb-implementation](../plans/sync-verb-implementation.md) §U5. Decision:
[decisions/board-branch-sync](../decisions/board-branch-sync.md) (Mike CONFIRMED 2026-07-07,
two riders).

## What shipped (2026-07-09 — the COMMAND only; execution is a separate founders' act)

`sync --migrate` — guarded, never on the everyday path; requires `--yes` (without it: a
structured preview/dry-run including the rollout-note copy); idempotent → "already migrated"
(exit 0) once a board branch exists on origin; REFUSES on uncommitted board changes, naming
them. As built:

- **Rider 1 (files, not history) SUPERSEDES this task's original `git subtree split` step**:
  the board branch is created as a fresh ROOT commit — `git commit-tree` over
  `HEAD:.agentstate-lite`'s tree, no parents, ONE attributed migration commit. The folder's
  pre-migration history (and anything ever scrubbed) never enters the shared branch.
- `git push -u origin board` — the `-u` is load-bearing (tracking config; panel round 2).
- **PR-shaped removal (Brian's 2026-07-09 adjudication)**: the folder-removal + .gitignore
  commit is built with PLUMBING ONLY (`ls-tree` → `mktree` → `commit-tree`) on a new LOCAL
  `board-migration` branch — working tree, index, and current branch untouched; NOTHING on
  the current branch is pushed by the command. The human pushes that branch and opens the PR.
  Until it merges, the receipt names the BOTH-WORLDS state honestly: board branch live on
  origin, the still-committed folder a FROZEN SNAPSHOT nobody should write to.
- The migrating clone is deliberately NOT self-provisioned during the window (while the
  current branch still tracks the folder, a provisioned board checkout would be overlaid by
  the user's own `git checkout` — git treats ignored files as expendable). Both founders share
  ONE journey: merge the PR → `git pull` (folder vanishes) → `sync` (returns loudly, rider 2).
- Migration NEVER executes any `git clean` (adjudication H) — the `git clean -fdx` line is
  rollout-note COPY, emitted in the preview and receipt.

Code: `packages/cli/src/commands/sync-migrate.ts` (+ dispatch in `commands/sync.ts`, two
porcelain ops in `git.ts`); tests: `packages/cli/test/sync-migrate.test.ts` over the new
`makeCommittedFolderTopology` harness fixture (9 tests: full two-clone e2e with the
vanish-reappear journey run via the receipt's verbatim commands, files-not-history pinned as
exactly-one-commit, preview mutates nothing, idempotence incl. the teammate case, the
uncommitted-changes refusal, structured refusals, interrupted-run recovery, flag combos,
forbidden-vocabulary sweep). No user-facing string contains "worktree"/"linked"/"subtree".

## LIFECYCLE: ship → use → DELETE (Brian, 2026-07-09)

`--migrate` is TEMPORARY, not a product feature: it exists for the founders' one-time
migration of this repo and is scheduled for REMOVAL in a follow-up PR after execution (flag +
module + tests deleted together). It is surfaced in `sync --help` only — zero mentions in the
skill channels or the compact command reference. Wake condition for re-adding: a real
external team asking to move a committed board folder to branch-sharing — the reviewed
implementation lives in git history.

## COMMS

The rollout note is emitted by the command itself (preview + receipt): after `git pull`,
`.agentstate-lite/` briefly disappears from main and is re-created on the next aslite
command; nothing is lost; from then on `aslite sync`, not `git pull`, updates the board; the
"never merge `board` into main" aside; the `git clean -fdx` reassurance line (copy only);
re-run `hook install` (adjudication E).

## Remaining to close this task

The founders EXECUTE the migration on this repo (run `sync --migrate --yes`, push the
`board-migration` branch, merge its PR, both pull + sync), then the follow-up removal PR
deletes the flag. Task stays in_progress until execution.

[depends on](sync-command-core.md)
