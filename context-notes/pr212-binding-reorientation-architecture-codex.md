---
type: Context Note
title: PR 212 binding reorientation architecture — approved model
actor: codex-pr212-binding-architect
timestamp: '2026-08-07T16:17:33.551Z'
---
# Summary

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: freeze the smallest phase-aware binding-target observation model that restores direct/symlink stable-shape parity without reopening transition fail-closed behavior. This serves the ultimate goal by making unattended create-only selection predictable at the last unresolved PR #212 boundary.

Verdict: **APPROVE the model below for implementation.** It closes the `61ff794` ambiguity with one local observer change, preserves the shared binding parser and zero-delete lifecycle, and introduces no cross-phase receipt or second discovery policy.

## Owning state machine

`existingBundleAt` owns one local observation transaction. It does not retain binding-target state across preflight, locked revalidation, or pre-publish; each coordinator phase invokes the same transaction afresh.

For candidate `C`:

1. `lstat(C)` is the lexical presence/shape observation.
   - `ENOENT` here, before any successful candidate observation, is legitimate initial absence: return no existing bundle.
   - Every other error, including `ENOTDIR`, is structured `RUNTIME` with the caller's current create-only phase.
2. Establish the initial effective-target snapshot `S0`.
   - Direct directory or non-directory: reuse the successful `lstat(C)` stats.
   - Symlink: call `stat(C)` once. This is the only new filesystem capability. Success records the followed target's directory/non-directory shape and `dev`/`ino`. Any error is `RUNTIME`; specifically, `ENOENT` means a dangling binding target, not legitimate absence, because the candidate symlink was already observed present.
3. Call `realpath(C)`. Any error, including `ENOENT`, `ENOTDIR`, or `ELOOP`, is `RUNTIME` because `S0` established an effective target.
4. Call `lstat(P)` on the returned physical path `P`, producing `S1`. Any error is `RUNTIME`.
5. Require `S1` to be non-symlink, to have the same directory/non-directory shape as `S0`, and to have equal `dev` and `ino`. A mismatch is structured `RUNTIME` (`EPATHCHANGED`/`ESHAPE`).
6. If the stable shape is non-directory, return no existing bundle. This is identical for a direct file and a symlink to that file.
7. If the stable shape is directory, strictly inspect `P/index.md`, then `P/.agentstate-lite`, then `P/.agentstate-lite/index.md`. `ENOENT` is absence only for these optional children because their containing physical directory was established. Other probe errors are `RUNTIME`. An own or conventional index returns the existing bundle; otherwise return no existing bundle.

The two effective observations are `S0` (direct `lstat`, or followed `stat` for a symlink) and `S1` (post-`realpath` physical `lstat`). They remain local to one observation call.

## Truth table

Outcomes: `NO_BUNDLE` permits create-only to continue; `INSPECT` means strict own/conventional index inspection, yielding `ALREADY_EXISTS` if an index exists and otherwise `NO_BUNDLE`; `RUNTIME` refuses before publication.

| Initial candidate | Later stable | Later disappears | Later shape/identity changes | Later probe error |
|---|---|---|---|---|
| absent | `NO_BUNDLE`; initial `lstat(C)=ENOENT` is terminal | Not a distinct state: already absent | Not compared in this call; a later coordinator phase invokes the observer afresh | Initial non-`ENOENT` error is `RUNTIME` |
| dir | Same dir `dev`/`ino` -> `INSPECT` | `RUNTIME` | `RUNTIME` | `RUNTIME` |
| file | Same non-dir `dev`/`ino` -> `NO_BUNDLE` | `RUNTIME` | `RUNTIME` | `RUNTIME` |
| symlink -> dir | Followed `stat` and physical `lstat` identify same dir -> `INSPECT` | `RUNTIME` | `RUNTIME` | `RUNTIME` |
| symlink -> file | Followed `stat` and physical `lstat` identify same non-dir -> `NO_BUNDLE` | `RUNTIME` | `RUNTIME` | `RUNTIME` |
| dangling symlink | `RUNTIME` (`stat(C)=ENOENT` after lexical presence) | `RUNTIME` | `RUNTIME` | `RUNTIME` |

The absent row is deliberately terminal, not a cross-phase promise. Locked revalidation and pre-publish each rerun the complete observer. Carrying the preflight state forward is unnecessary and would misclassify expected product-owned changes when a binding names the create target itself.

## Why `stat` and identity comparison are necessary

`stat` is required only for a symlink candidate: `lstat` observes the link inode, not the effective bound target. Without the pre-`realpath` followed snapshot, stable symlink-to-file and symlink-to-directory changed to file before the physical `lstat` are observationally indistinguishable; returning `null` would repair parity while losing the narrow transition guard.

`dev`/`ino` comparison is required to reject a same-shape replacement between `S0` and `S1`. Shape comparison alone catches dir-to-file/file-to-dir, but not dir A to dir B or file A to file B. The repository already uses `dev`/`ino` for create-target identity, so this is not a new identity theory. It is evidence of a demonstrated local transition, not a claim of atomic protection.

The guarded race is exactly the interval between initial effective observation and physical confirmation: direct dir/file replacement, or a symlink referent retarget/replacement, while `realpath` and the final `lstat` execute. Mutation after `S1` remains possible for raw writers; the frozen boundary does not promise exclusion of them. Repeated strict phase inspection, existing-bundle conflict checks, expect-absent publication, and the no-delete invariant bound the consequence.

## Smallest change from `61ff794`

- Add `stat(p): Promise<Stats>` to the private injected `CreateOnlyFilesystem` and default implementation.
- In `existingBundleAt`, replace the current `directory-or-symlink -> realpath -> require-directory` branch with the `S0 -> realpath -> S1 -> compare -> classify` sequence above.
- Keep `parseProjectBinding`, `strictProjectBinding`, the create-only coordinator, public APIs, error decorator, mutex, publication CAS, and all no-delete behavior unchanged.
- Add one table-driven focused test covering the six initial rows and later stable/disappear/change/error outcomes, including direct-dir-to-file and symlink-dir-to-file races, same-shape inode replacement, stable direct/symlink file parity, existing direct/symlink directory bundles, and dangling `RUNTIME`.

Reject cross-phase binding receipts, repeated whole-tree scans, `open`/file-descriptor pinning, watchers, retry loops, hashing, or parser/discovery forks. They do not exclude raw writers after the final observation, broaden the change beyond the confirmed defect, or conflict with expected binding-to-create-target evolution.

## Proof obligations

1. Direct file and symlink-to-the-same-file both yield `NO_BUNDLE`; direct and symlink directory aliases agree on bundle classification.
2. A successful `S0` followed by disappearance, shape change, or unequal `dev`/`ino` yields `RUNTIME` with exact phase/operation/path/fs code before publication.
3. Only initial candidate `lstat ENOENT` and optional child `lstat ENOENT` under an established directory are absence; dangling and all post-presence errors are `RUNTIME`.
4. Parser output and malformed/URL behavior remain owned by `parseProjectBinding`.
5. No path in the observer or coordinator deletes, prunes, quarantines, or renames product-tree state.
6. At `61ff794`, the stable symlink-to-file parity row is red while the existing direct/symlink directory-to-file guards are green. The correction must make parity green without turning either transition guard red.

No semantic question remains open for the frozen PR #212 raw-writer boundary.

## Result Envelope

- status: COMPLETE
- verdict: APPROVE_MODEL
- exact_sha_reviewed: `61ff794a6e1515f662c2005d800c814058da0139`
- product_changes: none
- bundle_write: this context note only, intentionally unsynced
- next: implement only the private `stat` seam, local observer state machine, and focused table; then restart exact-SHA Review before QA
