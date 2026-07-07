---
type: Task
title: >-
  U3b sync conflict resolution: converging keep-theirs/export-yours +
  show-incoming
status: todo
priority: '1'
description: >-
  U3b. The converging conflict mechanic (keep upstream, export local, complete
  rebase) with the ours/theirs inversion warning and exact verified sequence,
  plus show-incoming and the binding convergence test. Deps: sync-command-core.
timestamp: '2026-07-07T21:20:03.176Z'
---
# U3b — conflict resolution + `--show-incoming`

Builder brief. Plan: [plans/sync-verb-implementation](../plans/sync-verb-implementation.md)
§U3b. String contract:
[research/sync-verb-ux-review](../research/sync-verb-ux-review.md) amended pack (c). Evidence
(why abort-and-retry was rejected):
[research/sync-verb-review](../research/sync-verb-review.md) Round 2 ship-blocker 1.

## Definition of done

Ships the CONVERGING conflict mechanic, REPLACING U3a's interim guard. It replaces
abort-and-retry, which infinite-loops (`git rebase` replays ORIGINAL commits, so abort →
doc-update-fix → re-sync re-hits the identical conflict).

### WARNING — rebase INVERTS ours/theirs

During `rebase origin/board` you replay your LOCAL commits ONTO origin/board, so HEAD /
stage-2 ("ours") is the UPSTREAM version and stage-3 ("theirs") is YOUR local commit's
version. This inversion is exactly why the mechanic uses EXPLICIT refs (`origin/board`,
`:3:`) and NEVER `--ours` / `--theirs`.

### Exact verified sequence (implement verbatim; test-pinned)

Per conflicted `<path>`:
1. `git show :3:<path> > <export-file>`  — FIRST. `:3:` = theirs-in-rebase = YOUR local
   version → "yours saved".
2. `git checkout origin/board -- <path>`  — keep the UPSTREAM (teammate's) version.
3. `git add -- <path>`

Then advance the rebase non-interactively:
- `GIT_EDITOR=true GIT_SEQUENCE_EDITOR=true git rebase --continue`

LOOP the whole per-path block + continue UNTIL `git rev-parse --git-path rebase-merge` is
GONE (multiple local commits can each stop the rebase). The worktree is NEVER left
mid-state; non-conflicted local changes still land.

Exit CONFLICT(5) with the per-doc string (adjudication D):
  "teammate's version kept; yours saved at <path> — reconcile with doc update"

Reconcile = `doc update` with the merged body (a NEW write on top); then sync pushes
cleanly. Converges in ONE pass, loses nothing.

### Amended pack (c) (adjudication D)

Drop the phrase "nothing was overwritten". Conflict rows carry `{id, kind, title, yours,
theirs}` plus the export path per doc. Help chain: `sync --show-incoming <id>` → `doc update
<id> --body-file <file>` → `sync`.

### `sync --show-incoming <id>`

Prints the upstream version via `git show origin/board:<path>` in canonical markdown with
FULL doc-read semantics (truncation + `--out` hatch; `--out -` routes the envelope to
STDERR per gate-1). Renders deleted-upstream as a STATE, not a fatal. STALENESS is a
conscious deferral (adjudication G): output is labeled "as of last fetch" — no implicit
fetch.

## BINDING convergence acceptance test (deps: U3a)

Follow the documented chain (show-incoming → doc update → sync) and assert ALL THREE:
(i) landed content == origin/board's version;
(ii) the export file is BYTE-IDENTICAL to the local version;
(iii) the teammate's version is NOT clobbered in a two-founder e2e.
Plus: multi-commit loop terminates (rebase-merge gone); deleted-upstream show-incoming
state.

## Gates

Builder → independent Reviewer → QA. Deps: sync-command-core (U3a).

[depends on](sync-command-core.md)
