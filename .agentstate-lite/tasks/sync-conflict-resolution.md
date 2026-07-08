---
type: Task
title: >-
  U3b sync conflict resolution: converging keep-theirs/export-yours +
  show-incoming
status: done
priority: '1'
description: >-
  U3b SHIPPED across two PRs — records match git truth: PR #15 (merge 1f7f7b9)
  carried the converging mechanic + round-1 fixes (impl b744b70, round-1
  63ed6c1: quotepath invariant + -z conflict list, deletion-aware help,
  deletion-direction pins) PLUS Mike's review fix 00203a1 (structural
  absent-upstream detection); fix-round-2 AND the round-3 LOW notes landed as
  the FOLLOW-UP branch fix/sync-u3b-hardening (NOT in #15): byte-exact blob
  exports via runGitBytes (closes tasks/sync-binary-export), the explicit isDoc
  discriminator replacing the dot-in-basename heuristic (entryLabel; probe-first
  show-incoming id resolution folding Mike's cat-file probe into the candidate
  walk), the literally-executable reconcile chain (body-only .body.md export
  companion feeding --body-file; frontmatter_differs surfacing; rows carry
  yours/yours_body), and the round-3 LOWs: the fixing-verb suffix is keyed on
  the body export's existence (no doc-update hint when only the full export
  exists) and the body companion is skipped when the blob does not
  utf8-round-trip (a parses-but-corrupting decode never reaches the chain).
  MECHANIC (unchanged): git.ts fetchRebaseResolving — export :3 local FIRST (the
  rebase inversion), checkout origin/board -- <path>, add, GIT_EDITOR=true
  rebase --continue, LOOP until rebase state gone, empty replays --skip'd,
  abort-before-rethrow (worktree never mid-state); CONFLICT(5) with amended pack
  (c); conflicted run SKIPS push (next sync pushes); exports at
  ~/.agentstate/sync/exports/<key-digest>/<relPath>. Tests 50 green in the sync
  suites (32 sync.test.ts + 18 sync-conflict.test.ts incl. binding 3-assert
  convergence chain, multi-commit loop, log.md reserved, non-ASCII converge,
  both deletion directions, invalid-UTF-8 byte round-trip, dotted-id conflict,
  literal character-for-character chain execution, parses-but-non-roundtrippable
  fixture); npm run check green. Plugin 1.0.17 both manifests (main was 1.0.16).
  KNOWN LIMITATIONS: cursor/cache not advanced on a conflicted run (next sync
  re-reports the delta); TAB-in-filename residual tracked as
  tasks/sync-nonascii-path-pins; frontmatter_differs surfaces local frontmatter
  changes but does not auto-apply them; printed help chains are
  space-split-unquoted — an export path containing a space emits an ambiguous
  chain (cosmetic/platform-rare; the row's yours_body field is unambiguous).
assignee: brian-claude
actor: builder-u3b
timestamp: '2026-07-08T17:35:29.771Z'
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
