---
type: Context Note
title: 'Review: board-git package and BoardChannel plan'
actor: mike/codex
timestamp: '2026-07-16T00:05:43.218Z'
---
# Summary

Approve the direction, with changes required before this becomes a binding implementation plan. Extracting the Git tier behind a `BoardChannel` seam is the right architectural move: it gives Git behavior one owner, makes the CLI/package boundary mechanically enforceable, and creates a credible path to in-tree bundles without coupling ordinary document operations to Git.

The strongest product decision is keeping in-tree v1 read-side only. Fetching and reporting remote awareness while leaving delivery to ordinary repository pull/push avoids a second writer, hidden branch manipulation, and an accidental deployment system inside `sync`.

Verdict: approve the architecture, but revise the remote-unknown rule and the extraction sequence before implementation.

# What is already strong

- The proposed package boundary matches the current dependency pressure. Git porcelain, cursor calculation, diff consolidation, flow, and autopull form a coherent tier; command parsing, rendering, help, and process exit behavior should remain in the CLI.
- Mode-scoped cursors and reserved-path normalization are necessary safeguards against interpreting a branch-backed cursor under in-tree semantics.
- Detection after repair/healing, plus requiring a real worktree before selecting in-tree mode, is appropriately conservative.
- Consolidating the duplicated diff logic is valuable independently of the extraction.
- A private workspace bundled into the single npm CLI artifact is a good intermediate packaging choice. It creates a real source boundary without forcing a public multi-package install experience.

# Required changes

## 1. Fail closed when remote state is unknown

The detection matrix currently combines “remote board absent” and “remote state unknown” into the in-tree result. Those are not equivalent.

Current behavior deliberately refuses to recommend establishment while remote state is unknown. Classifying that same uncertainty as in-tree could hide an existing remote board and create two competing board locations after connectivity returns.

Split the case:

- remote board definitively absent + conventional directory tracked in the worktree → `in-tree`
- remote state unreachable or otherwise unknown → an indeterminate result or typed error that forbids mode-sensitive establishment/conversion

This does not require adding `unknown` as a durable `BoardChannel` mode if detection can return a typed failure. It does require making uncertainty explicit rather than treating it as absence.

## 2. Do not deliberately ship the forbidden package-to-CLI import

PR A currently extracts the package while retaining an import from `board-git` to CLI `errors.ts`, enforced through a temporary allowlist; PR A′ then introduces `BoardGitError` and repairs the boundary. That makes the package’s central architectural promise false in the first merged state and creates a transitional two-owner error model.

Prefer one of these sequences:

1. Introduce `BoardGitError` and the CLI mapping before the move, then mechanically relocate code with zero package imports from CLI code from day one.
2. Combine the error-boundary work with the mechanical move if it remains reviewable.

The import-direction test should have no temporary exception in any merged commit.

## 3. Split seam preparation from relocation

PR A is described as roughly 4,400 production lines plus about 2,200 moved test lines, while also removing inverted imports, consolidating diffs, injecting cursor storage, changing build wiring, and moving files. That is too many independently meaningful claims for one review unit.

A safer sequence is:

- **A0 — seam preparation in place:** introduce the package-neutral error type and CLI mapper, remove command-module imports from Git modules, consolidate diff calculation, define the cursor-store interface, and lock the intended public API with dependency tests.
- **A1 — mechanical extraction:** move the already layered modules and tests into `packages/board-git`, wire the workspace/build, and prove parity.
- **B — channel detection:** add the conservative branch/in-tree/local-only decision with an explicit indeterminate remote-state outcome.
- **C — in-tree read side:** add fetch/report behavior only, retaining the stated refusals for write-side sync and autopull.

This makes the relocation close to behavior-preserving and gives reviewers a much smaller surface on which to evaluate actual semantic changes.

## 4. Specify self-attribution as a post-success hook, not Git behavior in generic mutation code

Moving actor recording out of individual commands is sound, but generic `mutate.ts` should not discover Git state or write sync metadata directly. That layer serves every bundle/backend and should stay unaware of Git.

Define an injected post-persist hook at the command/bundle orchestration boundary with these invariants:

- it runs only after a substantive persisted mutation, never after a no-op or failed write;
- it is keyed to the exact resolved bundle/clone;
- recording is best-effort and cannot turn a successful document write into a failure;
- it performs no network work and does not add Git discovery to every generic mutation;
- callers that do not use the Git channel can omit it entirely.

This preserves the desired “all writes are attributed consistently” invariant without moving channel-specific policy into the core mutation primitive.

## 5. Refresh the prerequisite and link the work before implementation

`tasks/sync-migrate-removal` is a real prerequisite because `sync-migrate.ts` and `--migrate` still exist, but the task narrative also says PR #36 is merely ready to merge even though establishment behavior has already shipped. Refresh or split it so it represents only the remaining committed-folder unification and migration retirement.

The plan should also be linked to that prerequisite and to `roadmap-items/local-first-loop`. Its opening status line still says it is a local draft that has not been promoted, which is now stale.

# Public-boundary acceptance bar

Before A0/A1 starts, write down the exported API of `@agentstate-lite/board-git`. It should expose domain-neutral operations, typed results, and injected stores/adapters—not CLI invocations, help text, rendering, environment resolution, or exit behavior. In particular, `flow.ts` belongs in the package only to the extent that it expresses Git/channel orchestration rather than command UX.

The extraction is complete when:

- the package imports no CLI source and the rule has no allowlist;
- CLI command modules are leaves that consume package APIs rather than libraries imported by them;
- current branch-backed behavior and output remain covered by parity tests;
- unknown remote state cannot select or establish in-tree mode;
- in-tree v1 cannot push, create a board branch, or run autopull;
- the npm artifact still installs as one CLI and contains the bundled private workspace code.

# Evidence checked

The current tree confirms the plan is addressing real seams: `autopull.ts`, `session-start.ts`, and `home.ts` import helpers from the `sync` command module; diff interpretation exists in both `git.ts` and `commands/sync.ts`; Git code depends directly on CLI error types; and the migration path remains substantial. Existing tests and task language also confirm that remote-unknown is intentionally distinct from remote-absent today.

Overall: this is a strong plan, not premature modularization. Tightening the uncertainty rule and changing the first two PR boundaries would make it safer, easier to review, and more faithful to the architecture it is meant to establish.

[reviews](../plans/board-git-package.md)

[depends on](../tasks/sync-migrate-removal.md)

[supports](../roadmap-items/local-first-loop.md)
