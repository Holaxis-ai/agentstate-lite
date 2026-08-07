---
type: Context Note
title: PR 212 exact-SHA review at 81b3c39
description: >-
  FAIL: rollback lacks path/byte ownership provenance and can delete user state;
  isolation scanning treats unreadable subtrees as empty and can accept a nested
  bundle.
actor: codex-pr212-reviewer
timestamp: '2026-08-07T14:05:26.746Z'
---
# Summary

Independent review of PR #212 at exact head `81b3c39ff252013e318b1a714b63430a24074d70` against current main `458f44ae8b3ed0021997fb537eca356fb47dea1a`.

Verdict: FAIL — two post-CAS safety blockers remain. The ordinary create/refusal paths, committed focused suite, package proof, and hosted CI pass, but the rollback proof lacks persistent ownership evidence and the downward isolation scan fails open on filesystem read errors.

## Goals

- Ultimate goal: make AgentState Lite safe and low-friction for new users without allowing initialization to overwrite, nest inside, or ambiguously claim an existing workspace.
- Proximate goal: prove that `init --create-only` either creates exactly one isolated new bundle or fails before/with own-write-only rollback, while ordinary `init` remains compatible.
- Progress: normal paths are proven; the post-CAS isolation/rollback phase does not yet satisfy the stated ownership and fail-closed invariants.

## Whole-system model

This area has already required more than two intervention rounds, so the relevant system is recorded explicitly rather than treating the new failures as isolated lines.

Components:

1. Recipe resolution validates the requested content package before target mutation.
2. `assertCreateOnlyTarget` maps the logical path to a physical path and rejects pre-existing/bound/enclosing/ambiguous state without writes.
3. `claimCreateOnlyTarget` creates missing parent/target directories or accepts a pre-existing empty target, but currently returns no record of which directories this invocation created.
4. Core `initBundle(..., { expectNew: true })` performs the cross-process expect-absent CAS for the target's `index.md`.
5. `verifyCreateOnlyIsolation` walks upward and downward after the CAS to arbitrate parent/child creators that wrote different `index.md` files.
6. On conflict, that function directly unlinks `target/index.md` and repeatedly `rmdir`s empty ancestors, then reports that nothing from the run remains.
7. Recipe application starts only after isolation succeeds.

Ordering and external state:

- The claim, CAS, isolation walk, and rollback are separate asynchronous filesystem operations.
- Other same-machine processes can create a parent/child bundle, add or permission a descendant, replace `index.md`, or change directory shape between those operations.
- The CAS proves only that this process created particular `index.md` bytes at one instant; it does not prove those bytes still occupy the path later.
- A successful `mkdir` proves ownership of that one directory, but accepting an existing empty target proves no directory ownership. Recursive parent creation can mix invocation-created and pre-existing empty ancestors.

Required invariants:

- Success means no physical enclosing or nested bundle was observable; uncertainty must fail closed.
- Rollback may remove only unchanged bytes and directories demonstrably created by this invocation.
- A failure receipt must describe residual state honestly; it cannot claim complete rollback after swallowed cleanup errors.
- User/winner bytes and pre-existing filesystem structure survive byte-for-byte.

## Finding 1 — rollback has no ownership/provenance receipt

`claimCreateOnlyTarget` returns `void`, although it can accept a pre-existing empty target and recursively create only some missing ancestors. `verifyCreateOnlyIsolation` receives only the target string, unconditionally unlinks `target/index.md`, and then removes the target plus every empty ancestor until `rmdir` fails.

Deterministic exact-head probes show:

- A target directory that existed empty before the invocation is deleted when an enclosing racer commits after the target's CAS.
- If another writer replaces `target/index.md` after the CAS, rollback deletes the replacement bytes.

This contradicts the PR's own-write-only rollback claim. `rmdir` being non-recursive protects non-empty content, but it does not establish ownership of empty directories; the CAS establishes historical creation, not continuing ownership of the pathname.

Required repair: carry a claim receipt identifying exactly which directories were created and never remove pre-existing ones. Rollback also needs an atomic version/identity guard for `index.md` (or a design that avoids post-CAS deletion); it must not unlink a path whose bytes changed after the CAS. Cleanup errors must produce an honest residual-state error rather than the unconditional "nothing remains" claim.

## Finding 2 — descendant scan errors are treated as an empty subtree

The downward scan uses `fs.readdir(...).catch(() => [])`. EACCES, I/O errors, disappearance, and other uncertainty therefore mean "no nested bundle." An exact-head probe placed a nested `index.md` in a descendant, removed read permission from that directory, and `verifyCreateOnlyIsolation` returned success with both bundles intact.

This invalidates the bidirectional proof under the task's permission/hostile-filesystem boundary and lets the CLI proceed to recipe application and a success receipt without proving isolation.

Required repair: scan errors must fail closed with a typed error and safe, provenance-aware rollback. Add a regression that hides a nested bundle behind an unreadable descendant and proves the command cannot succeed.

## Passing evidence

- Exact PR head and current-main base remained unchanged at verdict time; GitHub reports CLEAN/MERGEABLE.
- `git diff --check` passed.
- Committed focused suite passed 154/154 when run without a concurrent dist-mutating package job.
- Local installed-package proof passed at exact head.
- Hosted Node 20 smoke and Node 22/26 gates passed.
- Independent adversarial probe: 0/3 passed, deterministically reproducing pre-existing-directory deletion, replacement-index deletion, and fail-open unreadable descendant scanning.

## Next state

Keep the task in progress and do not merge PR #212 at this head. Rework the claim/isolation/rollback contract around explicit ownership evidence, add red/green tests for both findings, rerun focused and package gates, then request a new exact-SHA review followed by adversarial QA.

[task](../tasks/init-target-safety-guard.md)

[review start](pr212-review-start-81b3c39.md)

[prior gate](init-create-only-gate-complete-81b3c39.md)
