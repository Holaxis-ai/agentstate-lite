---
type: Task
title: >-
  U3b sync conflict resolution: converging keep-theirs/export-yours +
  show-incoming
status: done
priority: '1'
description: >-
  U3b SHIPPED + two review-fix rounds (commits b744b70 impl, 63ed6c1 round-1
  fixes, 02bb0a6 round-2 fixes; branch feat/sync-conflict-resolution, rebased
  onto main's actor-attribution merge). Converging conflict mechanic replaces
  U3a's interim guard: git.ts fetchRebaseResolving implements the verified
  sequence verbatim (export :3 local FIRST — the rebase inversion — then
  checkout origin/board -- <path>, add, GIT_EDITOR=true rebase --continue; -z
  NUL-framed conflict list; LOOP until rebase state gone; empty replays
  --skip'd; unexpected failure aborts before rethrow — worktree NEVER
  mid-state). Exports at ~/.agentstate/sync/exports/<key-digest>/<relPath>: the
  blob's EXACT BYTES (runGitBytes is the one spawn site; runGit is its utf8
  projection) plus a <name>.body.md BODY-ONLY companion for parseable docs. sync
  exits CONFLICT(5) with amended pack (c): per-doc lines (doc label from the
  EXPLICIT isDoc discriminator carried on the conflict data — dotted ids like
  notes/v1.2 label correctly; deleted-upstream reads 'teammate's deletion kept …
  re-create with doc write'), rows
  {id|path,kind,title,yours,yours_body,frontmatter_differs,theirs}, help chain
  over the BODY export (literally executable; prefers a LANDED doc, doc-write
  fallback); safety-prefix composition preserved; conflicted run SKIPS push
  (next sync pushes). --show-incoming <id>: PROBE-FIRST id resolution
  (origin/board:<id>.md then raw fallback, ../absolute guarded), byte-exact
  --out/--out - channels, truncating text render labeled 'as of last fetch',
  absent-upstream = expected state. -c core.quotepath=off is a wrapper invariant
  (non-ASCII paths). Tests 48 green in the sync suites (31 sync.test.ts + 17
  sync-conflict.test.ts: binding 3-assert convergence chain, multi-commit loop,
  log.md reserved, mixed-batch, non-ASCII converge, both deletion directions,
  invalid-UTF-8 byte round-trip through export AND show-incoming --out,
  dotted-id conflict, literal character-for-character chain execution w/
  frontmatter-diff surfacing, show-incoming matrix); npm run check fully green.
  Plugin 1.0.16 both manifests. RETIRED caveats: utf8-only exports (now
  byte-exact) and the dotted-id raw-path residual (now structural). Remaining
  caveats: cursor/cache not advanced on a conflicted run (next sync re-reports
  the delta); a filename containing a literal TAB still breaks the merged
  name-status parsers (tracked as tasks/sync-nonascii-path-pins; the -z conflict
  list and byte channels are immune); a local frontmatter change is surfaced via
  frontmatter_differs but must be re-applied manually with doc update flags.
assignee: brian-claude
actor: builder-u3b
timestamp: '2026-07-08T17:14:23.447Z'
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
