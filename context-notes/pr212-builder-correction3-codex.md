---
type: Context Note
title: PR 212 builder correction 3
actor: codex-pr212-builder
timestamp: '2026-08-07T16:28:00.776Z'
---
# Summary

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: implement the frozen private binding-target observation transaction that restores stable direct/symlink non-bundle parity while retaining fail-closed transition evidence. This serves the ultimate goal by making unattended create-only target selection predictable at PR #212's last confirmed blocker.

Progress: reoriented at exact clean SHA `61ff794a6e1515f662c2005d800c814058da0139`; implementation has not begun. The governing task is already `in_progress`.

## Current system model

The shared binding parser owns syntax, URI rejection, and binding-file-relative path resolution. The private create-only binding observer `existingBundleAt` asks only whether that parsed target currently names an existing bundle. The create-only coordinator invokes this same observer independently during preflight, locked revalidation, and pre-publish; no binding receipt crosses phases. The root-scoped mutex orders cooperating creators but not raw filesystem writers.

Within one observer call, the frozen transaction is:

1. Optional lexical `lstat(candidate)`: initial `ENOENT` alone is `NO_BUNDLE`; other faults are typed `RUNTIME`.
2. Effective snapshot S0: reuse lexical `Stats` for a direct object; for a symlink perform exactly one followed `stat(candidate)`. A followed fault, including dangling `ENOENT`, is `RUNTIME`.
3. Require `realpath(candidate)` and `lstat(physical)` for S1; all failures are `RUNTIME`.
4. Reject a resolved symlink, directory/non-directory shape mismatch, or unequal `dev`/`ino` as an observed transition (`RUNTIME`).
5. A stable non-directory is `NO_BUNDLE` for direct and symlink spellings. A stable directory retains strict own/conventional `index.md` inspection: found marker is `EXISTING_BUNDLE`, verified child absence is `NO_BUNDLE`, and other probe faults are `RUNTIME`.

The observer never deletes or publishes. Parser/discovery/help/coordinator/cleanup behavior is outside this correction. The resulting evidence is deliberately local: it detects transitions between S0 and S1 but does not claim to exclude mutation after S1.

## Unverified implementation assumptions

- The private `CreateOnlyFilesystem` seam can add `stat` without affecting a public API or non-create-only consumers.
- Existing injected tests provide realistic `Stats.dev`/`Stats.ino`, or the focused tests can use real stat snapshots while deterministically overriding only the transition point.
- Existing structured error decoration preserves the operation/path/fs-code supplied by the observer; exact new operation labels must be selected consistently with current naming before assertions are frozen.
- The current broad test suites already own parser, disappearance, directory/bundle, no-delete, mutex, publication, and installed-package behavior; the correction should add only parity and the focused transition/fault rows needed to discriminate the new observer.
- Direct S0 must not invoke followed `stat`; symlink S0 must invoke it exactly once. Focused tests should make both call-count properties executable.

## Next evidence

Inspect the owning source/test seams, add stable direct/symlink same-file parity tests at `61ff794`, run them red, then add only focused shape/identity/fault guards and implement the observer. Record exact red/green commands, outcomes, diff scope, and final SHA here before handoff. This note is intentionally unsynced.

## Completed correction

Implemented and committed as `aec2dadbe186fe284c3e64a2a568269ef4bacd12` (`fix(cli): stabilize binding target observation`). The worktree is clean at that SHA.

Diff scope is exactly two files: `packages/cli/src/bundle.ts` and `packages/cli/test/init-create-only.test.ts` (258 insertions, 3 deletions). Production changes add the private `stat` seam and replace only `existingBundleAt`'s target classification. Tests add stable file parity, direct-versus-symlink snapshot call counts, witnessed shape/resolved-symlink/identity transitions, and followed-stat/realpath/resolved-lstat fault provenance. Parser, ordinary discovery, help/reference prose, coordinator phases, publication, locking, and cleanup were not changed.

## Red evidence at 61ff794

Exact command:

```sh
ASLITE_NO_UPDATE_CHECK=1 AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --test-name-pattern='stable direct and symlink binding targets to the same non-directory both permit create-only' --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/init-create-only.test.ts
```

Result: exit 1. The direct stable-file subtest passed; the symlink to that same file failed with structured `RUNTIME`, operation `validate-resolved-binding-target-shape`, and fs code `ESHAPE`. This is the required red provenance against exact base SHA `61ff794a6e1515f662c2005d800c814058da0139` before observer implementation.

After adding the private seam and all guards but before changing classification, the broader focused command also exited 1: stable-symlink parity and snapshot count were red; both same-shape identity replacement rows were missing expected rejection; followed-stat was not invoked; dangling still reported `realpath-binding-target`. Existing direct/symlink directory-to-file, realpath, and resolved-lstat guards remained green.

## Green evidence

Focused final command:

```sh
ASLITE_NO_UPDATE_CHECK=1 AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --test-name-pattern='stable direct and symlink|binding target effective snapshots|binding target observer rejects|binding target observer faults|binding targets that disappear after realpath|create-only binding discovery matches' --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/init-create-only.test.ts
```

Result: exit 0, 21 tests passed, 0 failed. This includes stable direct/symlink file parity; zero direct and exactly one symlink followed snapshot per observer call; direct/symlink directory-to-file; resolved-symlink; direct/symlink same-shape identity replacement; followed-stat/dangling/realpath/resolved-lstat provenance; prior post-realpath disappearance; and prior symlinked directory discovery.

Full owning-file command:

```sh
ASLITE_NO_UPDATE_CHECK=1 AGENTSTATE_LITE_NO_AUTOPULL=1 GIT_AUTHOR_NAME=test-suite GIT_AUTHOR_EMAIL=test-suite@example.invalid GIT_COMMITTER_NAME=test-suite GIT_COMMITTER_EMAIL=test-suite@example.invalid node --test --import ./packages/cli/test/ts-loader.mjs ./packages/cli/test/init-create-only.test.ts
```

Result: exit 0, 61 tests passed, 0 failed on committed SHA `aec2dad`.

Additional checks:

- `npm run build` — exit 0.
- `npm run typecheck` — exit 0 across workspaces.
- `npm run typecheck -w @holaxis/aslite` — exit 0 after the final test row.
- `npm run verify:npm-package` — exit 0 on clean exact SHA `aec2dadbe186fe284c3e64a2a568269ef4bacd12`; 30-file allowlist, zero runtime dependencies, both bins, and offline workflow passed.
- `git diff --check` — exit 0 before commit.

A supplemental full `npm test -w @holaxis/aslite` attempt exceeded the execution cell's approximately 30-second lifetime and ended without a test-runner summary, so it is not claimed as evidence. The requested focused suite, complete owning file, build, workspace typecheck, and exact-clean-SHA package proof all completed normally.

## Final state

The local observer now classifies only initial lexical `ENOENT` as absence; reuses direct lexical stats or follows a symlink once; requires realpath and physical lstat; rejects resolved symlink, shape mismatch, or `dev`/`ino` mismatch; returns no bundle for a stable non-directory; and preserves strict marker inspection for a stable directory. No sync, push, merge, or bundle task-status mutation was performed. The context note remains intentionally unsynced for the orchestrator's handoff.
