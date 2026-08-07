---
type: Context Note
title: PR 212 binding-observer reorientation falsifier
actor: pr212-binding-falsifier-codex
timestamp: '2026-08-07T16:13:25.107Z'
---
# Summary

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: falsify the proposed binding-target observer before a fourth code cycle and identify the smallest state model and test delta that restores compatibility without weakening demonstrated fail-closed behavior. This serves the ultimate goal by keeping unattended create-only onboarding predictable while preventing the safety review from expanding into an unbounded raw-filesystem identity protocol.

Progress: complete, read-only analysis of exact clean SHA `61ff794a6e1515f662c2005d800c814058da0139` in `/private/tmp/aslite-pr212-final-review`. No product code, tests, git state, or remote state were changed.

Verdict: **approve a narrow branch-sensitive correction; reject a new `stat`/`dev`/`ino` protocol.** The stable symlink-to-regular-file row should be classified as a non-bundle, while the already-observed direct-directory-to-nondirectory mismatch must remain `RUNTIME`. The governing model should say “fail on uncertainty or transitions demonstrated by the observer's ordered results,” not “prove that a raw-writable pathname retained timeless identity.”

## Minimal owning state machine

`existingBundleAt` answers only whether a parsed binding currently resolves to an existing bundle. It does not authorize a write through the bound path; publication occurs at the separately resolved create-only target. Preserve this decision table:

| Initial `lstat(candidate)` | `realpath(candidate)` | required `lstat(physical)` | Result |
|---|---|---|---|
| `ENOENT` | not called | not called | no existing bound bundle |
| direct stable non-directory | not called | not called | no existing bound bundle |
| direct directory | success | same physical directory shape | strictly inspect own/conventional indexes |
| direct directory | success | non-directory or symlink | `RUNTIME`: an observed shape transition |
| symlink | failure, including dangling/loop/access | not reached | `RUNTIME`: unresolved alias |
| symlink | success | stable non-symlink non-directory | no existing bound bundle |
| symlink | success | physical directory | strictly inspect own/conventional indexes |
| symlink | success | symlink | `RUNTIME`: replacement after canonicalization |
| any present row | success | probe failure, including `ENOENT`/`ENOTDIR` | `RUNTIME`: post-realpath uncertainty |

Directory inspection remains unchanged: an own or conventional `index.md` is an existing bound bundle; verified absence is not; all non-`ENOENT` probe faults are `RUNTIME`; a present conventional path with invalid/symlink shape remains `RUNTIME` under the frozen policy.

The corresponding minimal implementation shape is:

1. Keep the initial `lstat` and direct non-directory early return.
2. Keep `realpath` and the required post-realpath `lstat` for initial directories and symlinks.
3. Keep a resolved symlink as `RUNTIME`.
4. If the initial object was a direct directory and the resolved object is no longer a directory, keep `RUNTIME`.
5. If the initial object was a symlink and the resolved object is a non-symlink non-directory, return no bundle.
6. Inspect indexes only for a resolved directory.

This is one branch condition in the existing observer, not another parser, discovery fork, receipt type, or cross-phase store.

## Why a followed `stat` plus `dev`/`ino` comparison is not required

The production root-scoped mutex serializes all cooperating `init --create-only` processes. Preflight is outside the mutex, but locked revalidation supersedes it, and the pre-publish inspection repeats while the same mutex remains held. A cooperating creator therefore cannot mutate the bound target during either locked observation.

Only raw writers, different users, or incoherent filesystems can mutate during the observer. They can also mutate immediately after any final `stat`, inode comparison, repeated `realpath`, or index probe. Adding a followed `stat(candidate)` for symlinks would detect one more interval but would not create a linearization point or close the stated threat boundary. It would add a syscall, a dependency-interface method, cross-platform identity policy, more injected cases, and another false-refusal surface without protecting the product write destination.

`dev`/`ino` continuity is justified for the actual create target because that directory is about to receive `index.md`; the existing create-target state machine already carries and compares that receipt. The binding target is observational only. If its final successful classification is a non-bundle, a same-shape identity swap has no different safety consequence. If it becomes a bundle before a later locked/pre-publish observation, that later observation refuses; if a raw writer changes it after the last observation, no finite metadata sequence can guarantee otherwise.

Accordingly, revise invariant 5 in the reorientation note from “shape/identity changes between observations are uncertainty” to: **a shape or identity change demonstrated by already-required ordered observations is uncertainty; the observer does not manufacture additional identity observations solely to chase raw writers outside the exclusion boundary.**

## Smallest discriminating test delta

Add two behavioral assertions plus one three-row fault table around the existing public `withCreateOnlyTarget`/`assertCreateOnlyTarget` seams:

1. **Stable non-directory alias parity (red at `61ff794`).** Bind one project directly to a stable regular file and another through a symlink to the same file. Both must reach the publish callback and return success. The symlink row must still execute successful `realpath` and required resolved-target `lstat`; it is classification, not an early bypass. This one table row pair is the actual review regression.
2. **Naive-fix guard (already green at `61ff794`, but required beside the red row).** Begin with a direct directory `candidateInfo`, then inject a non-directory `physicalInfo` at the required post-realpath `lstat`. Expect `RUNTIME` at `validate-resolved-binding-target-shape`, with no publish. This rejects the tempting but incorrect unconditional `if (!physicalInfo.isDirectory()) return null` patch.
3. **Binding-target raw-fault table (green at `61ff794`, but currently unnamed by committed tests).** Inject `EIO` separately at initial `lstat(candidate)`, `realpath(candidate)`, and required `lstat(physical)`. Expect `RUNTIME` with operations `lstat-binding-target`, `realpath-binding-target`, and `lstat-resolved-binding-target`, exact path/code, and no publish. These are three rows in one test, not three new scenario fixtures.

Do not duplicate existing coverage:

- `binding targets that disappear after realpath fail closed for direct and symlink paths` already proves required post-realpath `ENOENT` is `RUNTIME`, not absence; do not repeat that row.
- `strict create-only observations surface operation, path, and fs code` covers the generic target/binding-file probes, but it does not name the three binding-target operations above. The small `EIO` table closes that precise gap without replaying the full filesystem-code matrix.
- `create-only binding discovery matches ordinary discovery for symlinked binding files and targets` already proves the stable symlink-to-empty-directory row.
- existing bundle-binding coverage proves the directory-to-bundle conflict; adding a symlink form is optional agreement coverage, not necessary to discriminate this correction.

Do **not** add a same-shape inode-replacement test as a merge requirement. Such a test would require the rejected identity protocol and would codify a stronger raw-writer exclusion claim than the mutex or filesystem API can provide. If the product later decides binding paths themselves require snapshot identity, that is a separate policy unit with a named linearization strategy, not part of this P2 correction.

## Counterexamples checked

- **Broad non-directory return:** direct directory first, file second would be mislabeled harmless. The initial-kind branch above prevents it.
- **Treat any resolved non-directory as stable:** a symlink returned by `lstat(physical)` after `realpath` indicates replacement and must remain `RUNTIME`; only a non-symlink non-directory is the stable classification row.
- **Treat dangling symlink as initial absence:** `lstat(candidate)` already established an alias object, so `realpath` `ENOENT` is an unresolved alias, not the same observation as an absent candidate. Keep `RUNTIME`.
- **Use inode comparison to prove safety:** a raw writer can replace the object after the comparison, so the comparison narrows one timing window but cannot prove the claimed invariant.
- **Carry a binding receipt across preflight/locked/pre-publish:** the root lock already orders cooperating writers, each phase repeats the full classification, and a raw writer remains unconstrained. Cross-phase binding receipts add state without a publication-safety benefit.

## Recommended architecture decision

Freeze the observer as a three-outcome classifier: `ABSENT_OR_STABLE_NON_BUNDLE`, `EXISTING_BUNDLE`, or typed `UNCERTAIN`. Its inputs include the initial lexical-object kind so the same resolved non-directory result can be interpreted correctly: stable when reached through an initially observed symlink, transitional when it contradicts an initially observed direct directory. Do not introduce `stat`, inode receipts, or a fourth identity outcome.

After that decision is incorporated into the architecture note/plan, the Builder can make the one-branch correction and two-test delta, followed by a fresh exact-SHA independent Review. QA remains blocked until Review approves.

## Evidence links

- [architecture reorientation](pr212-binding-observer-reorientation-2026-08-07.md)
- [governing task](../tasks/init-target-safety-guard.md)
- [frozen repair plan](../plans/pr212-safety-blocker-repair-2026-08-07.md)
- [final exact review](pr212-final-review-61ff794-codex.md)
- [ultimate product goal](../docs/core.md)
