---
type: Plan
title: >-
  sync verb v2 — binding implementation plan (U0 harness → U6 skill; U5
  migration Mike-gated)
timestamp: '2026-07-07T19:39:02.551Z'
---
# sync verb v2 — binding implementation plan

Implements [plans/sync-verb](../plans/sync-verb.md) (v2, board branch + worktree).
Evidence base: [research/sync-verb-review](../research/sync-verb-review.md). Standing
gate honored: feedback infrastructure lands FIRST (U0) — no porcelain iteration loop
without a fast, dependable git test harness.

## Units, in dependency order

**U0 — test harness (BLOCKS ALL).** `packages/cli/test/git-harness.ts`: helpers that
build scratch repo topologies (bare origin + two clones), provision board branch +
worktree, and plant fixtures (dirty non-bundle tree, staged code, new/modified/deleted
docs, divergent histories, dangling cursor). Acceptance: consumed by ≥2 suites below;
runs hermetically under `npm test -w agentstate-lite`.

**U1 — git porcelain layer.** NEW `packages/cli/src/git.ts`: one spawn wrapper (env
scrub of GIT_DIR/GIT_WORK_TREE/GIT_INDEX_FILE, `-C`, GIT_TERMINAL_PROMPT=0,
GIT_SSH_COMMAND BatchMode, timeout) + ops: isProvisioned / provisionBoardWorktree (all
paths via `rev-parse --git-path`), stageAndCommit (add -A → commit, skip-empty),
fetchRebase (conflict → collect `--diff-filter=U` ids → `rebase --abort`), push, ffPull,
changesSince(cursor), unpushedCount. `classifyGitError` in `errors.ts` (RUNTIME/AUTH/
CONFLICT — mirrors classifyBundleError; maps by stable signals, never prose-matching
localized stderr where avoidable). Tests (deps: U0): every verified shape from the review
— staged-code-untouched, new-doc-committed, deleted-doc-committed, conflict-abort-restores-
clean-tree, env-leak override, ff-only swallow matrix, index.lock busy → structured retry
envelope. [deps: U0]

**U2 — cursor store.** NEW `packages/cli/src/cursor.ts`: opaque `{tier, token}`, per-
bundle key (remote URL + subpath; fallback abs path), atomic 0600/0700 writes reusing
credentials.ts machinery. Existence guard + re-anchor policy ("delta unavailable" note,
never silent). Tests incl. dangling-SHA and cross-bundle isolation. [deps: U0]

**U3 — the `sync` command.** Replace the NOT_IMPLEMENTED stub in
`packages/cli/src/commands/sync.ts`: flow steps 0–4 from the design; envelope via
render() + cap(); `--pull-only`; exit taxonomy (0/1/4/5); idempotent re-run; definitive
"nothing to sync". Update `reference.ts` usage/summary (drift gates regenerate both
SKILL.md channels). Tests: end-to-end two-clone founder scenario — A writes docs → sync →
B `sync --pull-only` sees the attributed delta; same-doc conflict → exit 5, clean tree,
both-versions guidance; push-fail after commit → unmistakable partial envelope. [deps:
U1, U2]

**U4 — SessionStart integration.** Awareness cache file written by the pull step;
`home.ts` reads the cache FS-ONLY and renders "since your last session" + the unpushed-
commits backstop — home's structural offline-guarantee test must stay green untouched.
Hook wiring: DEFAULT `hook install --with-sync` (second SessionStart entry; avoids the
axi-sdk-js dependency — if the sdk grows multi-entry support later, migrate). [deps: U3]

**U5 — migration of THIS repo's bundle** (the live consumer). `git subtree split` →
`board`, remove folder from main, gitignore, provision worktrees. Scripted; HUMAN-GATED:
executes only after Mike confirms
[decisions/board-branch-sync](../decisions/board-branch-sync.md). Both founders'
machines provision on their next sync. [deps: U3; gate: Mike]

**U6 — skill + docs truth pass.** `gen-skill.mjs`: typical flow ends with `sync`;
Workspaces section teaches the board-branch reality + unit-close trigger; plugin version
bump (BOTH manifests — check main's current version first); README quickstart re-read
against new behavior. [deps: U3]

## Roles and review gates

One Builder per unit; an independent Reviewer subagent per unit BEFORE merge (required
gate — Build → Review → QA, never Build → QA); QA = full `npm run check` + the two-clone
e2e + gate-1 AXI watch-points. Ship each unit branch + PR; Brian merges.

## Acceptance criteria (unit-close = all test-pinned)

- A conflicted sync NEVER leaves the worktree mid-rebase.
- User code — staged or unstaged, any branch — is untouched across every sync path.
- New, modified, AND deleted docs all cross the wire.
- home()'s offline-guarantee test unchanged and green.
- Dangling cursor → honest re-anchor note; never a silent skip, never a fatal.
- Every git failure lands structured with taxonomy codes; no raw git on stdout.

## Open decisions carried

- Hook wiring: default `--with-sync` unless axi-sdk-js multi-entry lands first.
- Rename detection: OFF (`-M` omitted) — doc identity IS its path; A+D is the true story.
- Mike's confirmation gates U5 only; U0–U4 and U6 can build now.
