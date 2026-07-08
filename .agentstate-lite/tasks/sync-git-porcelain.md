---
type: Task
title: 'U1 git porcelain layer: git.ts spawn wrapper + ops + classifyGitError'
status: done
priority: '1'
description: >-
  SHIPPED (feat/sync-git-porcelain): packages/cli/src/git.ts — ONE spawn wrapper
  (env scrub GIT_DIR/GIT_WORK_TREE/GIT_INDEX_FILE, git -C,
  GIT_TERMINAL_PROMPT=0, GIT_SSH_COMMAND BatchMode+ConnectTimeout,
  GIT_EDITOR/GIT_SEQUENCE_EDITOR=true on rebase ops, per-op timeout
  30s/60s-network, --no-renames) + ops: isProvisioned, provisionBoardWorktree
  (fetch-first self-heal; non-empty-dir REFUSED with guidance; empty-dir
  resolved; already-checked-out idempotent; no_repo/no_board outcomes),
  detectStaleRebase/abortStaleRebase, stageAndCommit (add -A, skip-empty, -F -
  stdin message, grammar subject + verb-kind-id body, per-doc frontmatter
  enrichment incl. deleted-doc from HEAD), fetchRebase (DETECT-ONLY conflict:
  collect --diff-filter=U ids, clean abort, zero data movement), push, ffPull
  (full swallow matrix w/ reason vocabulary), changesSince (two-dot, cat-file -e
  dangling guard, actor PER-DOC FROM FRONTMATTER — {docId, actor, verb, kind,
  title}, matches U2's AwarenessDeltaRow shape), unpushedCount (null = no
  origin/board ref, distinct from 0). classifyGitError in errors.ts:
  GIT_MISSING/NO_UPSTREAM/GIT_BUSY (exit 1, GIT_BUSY carries details.retryable),
  AUTH_REQUIRED(4) vs TRANSIENT(1) best-effort, CONFLICT(5). TESTS:
  packages/cli/test/git-porcelain.test.ts — 39 tests over the U0 harness, all
  §U1 acceptance criteria; CLI suite 418→457, npm run check fully green.
  CAVEATS: (1) board commits use --no-verify (plan-silent; keeps user hook
  policy/interactive hooks off the machine branch); (2) GIT_SSH_COMMAND is
  forced unconditionally per the invariant — a user-set GIT_SSH_COMMAND env is
  overridden (~/.ssh/config still applies); (3) unreachable local-path remotes
  classify AUTH (documented best-effort not-found heuristic); (4)
  reserved-file-only commits get subject 'board: bundle maintenance' (grammar
  extension); (5) errors.ts CODE_EXIT lands in the committed plugin bundle →
  both manifests bumped 1.0.11→1.0.12 (U2 also took 1.0.12; orchestrator
  reconciles at merge).
assignee: builder-u1
timestamp: '2026-07-07T23:16:16.658Z'
---
# U1 — git porcelain layer

Builder brief. Plan: [plans/sync-verb-implementation](../plans/sync-verb-implementation.md)
§U1 + "Global porcelain invariants". Evidence:
[research/sync-verb-review](../research/sync-verb-review.md) (verified command shapes are
BINDING).

## Definition of done

NEW `packages/cli/src/git.ts`: ONE spawn wrapper + the ops below. NEW `classifyGitError` in
`errors.ts`. `packages/core` untouched (command-layer-only gate).

Spawn wrapper enforces the global invariants: `git -C <worktree>`; env scrub (unset GIT_DIR
/ GIT_WORK_TREE / GIT_INDEX_FILE); GIT_TERMINAL_PROMPT=0; GIT_SSH_COMMAND='ssh -o
BatchMode=yes -o ConnectTimeout=10'; per-op timeout. EXPLICIT `origin/board` refs
everywhere, NEVER `@{u}`. Worktree internals via `git rev-parse --git-path` (`.git` is a
FILE in a linked worktree). Rename detection OFF (`-M` omitted).

Ops:
- isProvisioned / provisionBoardWorktree — self-heal: `git fetch origin` BEFORE referencing
  `board`; absent-but-origin-has-board → `git worktree add .agentstate-lite board`;
  pre-existing NON-EMPTY `.agentstate-lite/` resolved-or-refused (never blind add);
  "already checked out" = idempotent success; no repo → caller emits `sync: nothing to
  sync` exit 0.
- stageAndCommit — `git add -A` → commit; skip on `git diff --cached --quiet`. Message via
  argv / `-F -` (NO shell interpolation). Grammar: `board:` prefix; single-doc `board:
  <actor> — updated <id>`; multi-doc `board: <actor> — N docs` (NEVER "1 docs"); multi-actor
  `board: N docs from M actors` (subject names actor only when exactly one); per-doc
  verb-kind-id list in the commit BODY (never parsed back).
- fetchRebase — `git fetch origin` → `git rebase origin/board`. CONFLICT = DETECT ONLY
  (adjudication A): collect ids via `diff --name-only --diff-filter=U`, then `git rebase
  --abort` cleanly. ZERO data movement, NO ours/theirs logic here. (The converging mechanic
  is U3b, built on these primitives.)
- push — `git push origin board`.
- ffPull — `git fetch origin` → `git merge --ff-only origin/board`, swallowing every
  nonzero exit (fail-soft matrix: not-a-repo, no-upstream, detached HEAD, divergence, dirty
  refusal, auth/network).
- changesSince(cursor) → enriched `{docId, actor, verb, kind, title}[]`. ACTOR IS READ
  PER-DOC FROM FRONTMATTER, never the commit subject (adjudication F). Two-dot
  `<token>..HEAD`, guarded by `git cat-file -e <token>^{commit}`.
- unpushedCount — commits ahead of `origin/board`.
- detectStaleRebase / abortStaleRebase — `rev-parse --git-path rebase-merge` present →
  abortable (consumed at SYNC ENTRY by U3a, adjudication C).

classifyGitError (mirror classifyBundleError): DISTINCT GIT_MISSING (exit 1), NO_UPSTREAM
(exit 1); GIT_BUSY (exit 1, adjudication B — `index.lock`/other git process → the op returns
a STRUCTURED RETRY envelope, never a raw strand); AUTH (exit 4) vs network (exit 1)
BEST-EFFORT; unresolved conflict → CONFLICT (exit 5). Precondition failures (detached HEAD,
no upstream) are structured errors naming the state. No raw git on stdout.

## Acceptance criteria (tests, deps: U0)

- staged-code-untouched; unstaged-user-code-untouched (any branch)
- new / modified / deleted doc committed
- env-leak override (GIT_DIR set → `-C` still wins)
- ff-only swallow matrix
- conflict → detect + collect + CLEAN abort, worktree pristine, NO export file
- GIT_BUSY structured-retry envelope against the U0 concurrent-sync fixture
- non-empty-dir refusal; already-checked-out idempotence
- commit-grammar strings (incl. never-"1 docs", multi-actor)
- changesSince actor-from-frontmatter (subject names X but frontmatter names Y → attributes
  to Y)

## Gates

Builder → independent Reviewer → QA. Deps: sync-test-harness (U0).

[depends on](sync-test-harness.md)
