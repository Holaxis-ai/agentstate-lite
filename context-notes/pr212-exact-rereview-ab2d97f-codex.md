---
type: Context Note
title: PR 212 exact re-review at ab2d97f
actor: codex-pr212-independent-rereviewer
timestamp: '2026-08-07T15:47:44.782Z'
---
# Summary

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: independently determine whether exact SHA `ab2d97fff7fe391e7b46cf3509eef6631008288e` closes every frozen create-only safety and evidence invariant. This serves the ultimate goal by preventing an unsafe or unproven onboarding concurrency boundary from advancing to QA.

Verdict: **CHANGES_REQUESTED**. Exact HEAD was verified detached and clean in `/private/tmp/aslite-pr212-rereview`. No product code was edited, committed, pushed, or synced. Three frozen-contract gaps remain: one fail-open binding observation, incomplete provenance in a release-over-publish double fault, and installed-package evidence that cannot attribute its result to the production mutex.

## Findings

### P1 — post-resolution disappearance of a symlinked binding target still fails open and publishes

`packages/cli/src/bundle.ts:574-583` follows a valid symlinked binding target through `realpath`, then probes the resolved physical target through `optionalLstat`. `optionalLstat` maps every `ENOENT` to ordinary absence. Once `realpath` successfully established the physical target, a subsequent `ENOENT` is an unexpected disappearance, not proof that the binding simply points to a never-existing non-bundle.

A deterministic source probe created a valid `.agentstate.json` pointing to a symlinked empty non-bundle target, let `realpath` succeed, removed that physical target immediately before `lstat`, and injected `ENOENT`. Result: `outcome:"SUCCESS"`; create-only published `project/new-bundle/index.md`. This violates the explicit requirement that valid symlinked binding-file and symlinked non-bundle-target behavior remain compatible while observation errors fail closed.

Bounded correction: retain shared `parseProjectBinding` and valid symlink compatibility, but use an expected-presence probe after successful binding-target `realpath`; post-resolution `ENOENT`/shape loss must produce `RUNTIME` with phase/operation/path/fs_code before publish. Add a regression for this exact transition.

### P2 — release-over-publish double faults drop the masked publish path and filesystem code

`packages/cli/src/bundle.ts:971-982` copies only `prior_code`, `prior_phase`, and `prior_operation` from the decorated callback failure. It discards the masked publish failure's `path` and `fs_code`. The correction regression at `packages/cli/test/init-create-only.test.ts:736-773` checks only `prior_operation`, so it cannot detect this information loss.

A deterministic probe injected publish `EIO` at `<target>/index.md`, then a `FilesystemMutationLockError` during release. The outer envelope correctly reported release phase/operation and `publication_outcome:"started-or-uncertain"`, but contained no `prior_path` and no `prior_fs_code`; only `prior_code:"RUNTIME"`, `prior_phase:"pre-publish"`, and `prior_operation:"publish-index"` survived. This does not satisfy the frozen double-fault provenance contract.

Bounded correction: carry `prior_path`, `prior_fs_code`, and the prior residue fields alongside the existing prior metadata, while retaining the release fault as the primary phase/operation/path and preserving the truthful publication outcome. Strengthen the regression to assert all fields.

### P2 — installed-package parent/child result is not attributable to the production mutex

`scripts/verify-npm-package.mjs:430-470` starts parent and child commands concurrently and asserts one winner. It has no held production-root lock, readiness marker, barrier, or other proof that both installed processes reached the mutex before either published. The row can pass when one process completes before the other finishes preflight, including under an artifact whose root mutex wiring is absent or broken. The comment at lines 430-432 therefore overstates what the test proves.

The source test at `packages/cli/test/init-create-only.test.ts:613-684` now does use `withFilesystemMutationLock`, the production root key, both orders, and ordinary/conventional-child shapes; that part of prior finding 4 is closed. The installed artifact still has only scheduler-timed smoke, so the frozen installed-package proof remains unowned.

Bounded correction: make the installed verifier hold or instrument the production root lock and prove the contenders are excluded until release, then assert exactly one undamaged winner and a conflict-class loser. One installed target shape is sufficient if the source test continues to own the four-order/shape matrix.

## Survived attacks and evidence

- Exact identity: `git rev-parse HEAD` -> `ab2d97fff7fe391e7b46cf3509eef6631008288e`; `git status --short --branch` -> detached and clean.
- Required records read from the primary bundle with explicit `--dir` and auto-pull disabled: `docs/core`, task, frozen plan, all three R0 notes, builder R0 note, rejected exact review, correction note, and `context-notes/pre-compact-main`.
- `npm ci` -> exit 0, 437 packages installed. The first pre-install test attempt failed only because the isolated worktree had no dependencies/dist; it was not product evidence.
- `npm run build` -> exit 0. `./aslite version --json` reported exact commit `ab2d97f...`, `dirty:false`, `channel:local-dev`.
- Full focused create-only suite: `node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/init-create-only.test.ts` -> 41 pass, 0 fail.
- Focused core hardening: `node --test --import ./packages/core/test/ts-loader.mjs ./packages/core/test/filesystem-expected-version.test.ts` -> 1 pass, 0 fail.
- A seven-test correction sample covering binding parity, both target-disappearance paths, real production-mutex ordering, raw publish, release-over-publish, and raw acquire -> 7 pass, 0 fail.
- Corrected direct target disappearance survives: newly created target disappearance at pre-publish and initially pre-existing target disappearance before locked revalidation both fail before publish with phase/operation/path/fs_code and `publication_outcome:not-started`.
- Acquire/raw acquire/raw publish/ordinary release envelopes are typed and carry current phase/operation/path/fs_code where supplied, residue, and a truthful state. Release-over-publish retains truthful outcome but has the provenance finding above.
- Shared binding parsing and the two parent-SHA compatibility cases survive: a symlinked binding file and a binding through a symlink to an existing empty non-bundle target both succeed. Malformed/URL bindings remain fail-closed. The post-resolution disappearance gap is isolated above.
- Static source/test check confirms the create-only coordinator contains no `unlink`, `rmdir`, `rm`, quarantine `rename`, or old verifier. Replacement file/same-byte/symlink/directory states survive release uncertainty.
- Critical section spans locked strict revalidation, component creation, pre-publish revalidation, and expect-absent `index.md` publication; Recipe application remains after successful lock release.
- Ordinary init open/create/idempotence, default/none/named/path Recipe forms, Recipe-before-write failure, exact receipt, hidden-descendant refusal, and residue retention pass in the 41-test suite.
- `currentVersionAt` injected `EIO` hardening passes; directory-shaped `index.md` at the final CAS fails closed rather than publishing, while retaining and naming the failed atomic-write temp path.
- Root-key reasoning/probe: POSIX parent/child keys are `/`; same-spelling Windows drive pairs derive `C:\\`; same-share UNC pairs derive `\\\\server\\share\\`. The source production-mutex test proves the current-platform parent/child key and exclusion in both orderings and target shapes. Case-variant Windows/UNC roots remain a residual cross-platform risk because this exact host cannot execute Windows `realpath` semantics.
- Builder full evidence was audited rather than rerun wholesale: correction note records CLI 1321/1321, core 399/399, scripts 127/127, build/typecheck/package/skill green. The package test construction, not its claimed green exit, is finding 3.
- Diff scope is restricted to the create-only policy, tests, core CAS/lock exports, direct help/skill text, and package verifier. Bot-owned plugin artifacts/manifests are unchanged. `git diff --check origin/main...HEAD` passed.

## Exact probe results

Probe command:

`node --import /private/tmp/aslite-pr212-rereview/packages/cli/test/ts-loader.mjs /private/tmp/pr212-rereview-probe.ts`

Key results:

- double fault: primary `phase=lock`, `operation=release-filesystem-mutation-lock`, exact lock path, `publication_outcome=started-or-uncertain`, exact created-directory residue; prior metadata stopped at `prior_code`, `prior_phase`, `prior_operation` and omitted publish `path`/`fs_code`.
- binding disappearance: `outcome=SUCCESS`, with a published new bundle after physical bound-target `ENOENT`.
- directory-at-publish supplemental probe: `RUNTIME`, `operation=publish-index`, `fs_code=EISDIR`, `publication_outcome=started-or-uncertain`; foreign directory survived and the failed temp-file path was named.

## Result Envelope

- status: COMPLETE
- verdict: CHANGES_REQUESTED
- exact_sha: `ab2d97fff7fe391e7b46cf3509eef6631008288e`
- findings: 1 P1, 2 P2
- summary: direct target disappearance and source production-mutex ordering are corrected, but strict binding disappearance still publishes, release-over-publish loses masked fault provenance, and installed evidence is not attributable to production locking.
- next: apply only the three bounded corrections above, add red/green regressions, then restart exact-SHA Review before QA. No broader product work is implicated.
