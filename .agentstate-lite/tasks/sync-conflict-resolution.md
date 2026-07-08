---
type: Task
title: >-
  U3b sync conflict resolution: converging keep-theirs/export-yours +
  show-incoming
status: done
priority: '1'
description: >-
  U3b SHIPPED (commit d353745, branch feat/sync-conflict-resolution). Converging
  conflict mechanic replaces U3a's interim guard: new git.ts op
  fetchRebaseResolving implements the verified sequence verbatim (export :3
  local FIRST — the rebase inversion — then checkout origin/board -- <path>,
  add, GIT_EDITOR=true rebase --continue; LOOP until rebase state gone; empty
  replays advanced via --skip; unexpected failure aborts before rethrow so the
  worktree is NEVER mid-state). fetchRebase stays detect-only. sync exits
  CONFLICT(5) with amended pack (c): per-doc 'doc <id> — teammate's version
  kept; yours saved at <path> — reconcile with doc update' (reserved paths
  verbatim, no doc-update suffix), rows {id|path,kind,title,yours,theirs}, help
  chain show-incoming → doc update --body-file → sync; throwPostCommitFailure
  safety-prefix composition preserved; conflicted run deliberately SKIPS push
  (next sync pushes everything). Exports:
  ~/.agentstate/sync/exports/<key-digest>/<relPath> (0700/0600, never in a
  worktree, stable per doc). --show-incoming <id>: git show origin/board:<path>,
  full doc-read semantics (truncate + --out + --out - stderr envelope), labeled
  'as of last fetch', absent-upstream = expected state. Tests 38 green in the
  sync suites (27 sync.test.ts incl. repinned converge strings + 11
  sync-conflict.test.ts: BINDING 3-assert convergence e2e w/ reconcile chain,
  multi-commit loop, log.md reserved conflict, mixed-batch landing,
  show-incoming matrix); npm run check fully green; built-CLI two-clone conflict
  smoke verified end to end. Plugin 1.0.15 both manifests (NOTE: parallel
  actor-attribution branch may collide on the number — reconcile at merge).
  Caveats: cursor/cache not advanced on a conflicted run (next sync re-reports
  the delta); exports are utf8-only (a binary blob on the board would
  re-encode); a concept id whose basename contains a dot still labels as a raw
  path (pre-existing isRawPathEntry residual).
assignee: brian-claude
timestamp: '2026-07-08T15:45:50.118Z'
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
