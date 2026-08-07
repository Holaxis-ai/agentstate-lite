---
type: Context Note
title: PR 212 R0 architecture and reliability analysis
actor: codex-pr212-architect
timestamp: '2026-08-07T14:37:56.609Z'
---
# Summary

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: identify the smallest cross-platform create-only architecture that prevents parent/child double success, never deletes unowned or replaced filesystem state, and fails closed on scan uncertainty. This serves the ultimate goal by making onboarding creation safely invokable without founder supervision.

Status: recommendation complete; product code remained read-only. The requested shorthand note `context-notes/init-target-safety-guard-exact-sha-review-gate` was absent, so this analysis used the actual current records `context-notes/pr212-review-start-81b3c39`, `context-notes/pr212-exact-review-81b3c39`, `context-notes/init-create-only-gate-complete-81b3c39`, `tasks/init-target-safety-guard`, and `plans/pr212-safety-blocker-repair-2026-08-07`.

## Recommendation

Move all parent/child arbitration before the publish point and remove post-publish rollback entirely.

Use one same-user cross-process create-only mutex per physical path root in the existing private external runtime-lock namespace. On POSIX this is deliberately host-global for create-only initialization; on Windows it is drive or UNC-root scoped. `init` is rare enough that this conservative serialization is cheaper and easier to prove than a hierarchical lock registry. The mutex is an ephemeral runtime artifact with the existing owner-token and fail-closed stale-lock behavior; no claim marker is written into the target tree and no persistent success-time claim is needed.

Recommended state machine:

1. Resolve Recipe before any filesystem mutation, unchanged.
2. Strictly resolve and inspect the logical target to obtain its physical target and canonical path-root lock key. This first inspection is read-only.
3. Acquire the external create-only root mutex.
4. Under the mutex, strictly re-resolve and fully re-inspect the logical target. Refuse if its physical identity changed, it is no longer empty/new, an ancestor bundle or conventional workspace exists, or a binding makes the location unsafe.
5. Create missing directory components one at a time with non-recursive `mkdir`, recording every successful creation in an in-memory `CreateOnlyClaimReceipt`. A pre-existing empty target produces an empty directory receipt. Unexpected `EEXIST`, shape change, or observation failure refuses.
6. Strictly re-inspect once more immediately before publication. This closes changes introduced during component creation. The target-empty rule is stronger than a recursive descendant search: any top-level entry means the target is not genuinely new, so a hidden nested bundle is refused without descending into an unreadable subtree.
7. Call `initBundle(root, { expectNew: true })` while still holding the root mutex. The atomic replacement of `index.md` is the publish point.
8. Release the root mutex, then apply the already-resolved Recipe. There is no post-publication isolation scan and no `unlink` or `rmdir` cleanup path.

On any failure, release the mutex in `finally`. Never remove directories, even those historically created by this invocation. Report the receipt truthfully, for example `residual_created_directories`, so an agent knows empty scaffolding may remain. Empty directories are safe and retryable; deleting a replacement is not.

## Invariants and proof sketch

1. Parent/child mutual exclusion: every create-only invocation under the same physical path root holds the same exclusive runtime mutex from fresh revalidation through `index.md` publication. For ancestor targets A and B, their critical sections are therefore ordered. If A publishes first, B then sees either an enclosing `index.md` when B is the child, or a non-empty target when B is the parent, and B fails before publication. The symmetric order is identical. At most one can publish and report success.
2. No unowned deletion: the create-only path performs no deletion. Directory receipts are historical and diagnostic only; they never authorize `rmdir`. A replaced `index.md`, directory, symlink, or empty pathname cannot be deleted because no failure transition invokes `unlink`, `rename`, `rm`, or `rmdir`.
3. Fail-closed observations: create-only uses a strict, isolation-specific filesystem observer. Only an expected absence result from the exact probe may mean absent. `EACCES`, `EPERM`, `EIO`, unexpected `ENOENT` during a required `readdir`, shape transitions, and `realpath` failures become structured `CliError("RUNTIME")` failures before publication. Generic `exists()` and `findBundleRoot()` must not be used in this path because `exists()` currently converts every `stat` error into false and the reviewed downward scan converts every `readdir` error into an empty subtree.
4. Publish boundary: before the expect-absent atomic `index.md` rename, the directory is not an OKF bundle. There are no validation steps after publication that can demand destructive rollback. Recipe resolution remains before mutation; Recipe application remains after a valid bundle exists, preserving current lifecycle semantics.
5. Compatibility: plain `init` remains open-or-create. Existing create-only conflicts remain `ALREADY_EXISTS` and exit 5; scan or lock uncertainty remains the existing `RUNTIME` exit 1 class with structured phase, operation, and path details. Successful receipt shape and physical root semantics need not change.

## Why the alternatives are rejected

- Explicit ownership receipts plus check-then-unlink are insufficient. A content hash or `Stats` identity can show what occupied a pathname during the check, but another process can replace it before path-based `unlink` or `rmdir`. This is an ABA race, not a missing metadata field.
- A reserved-file conditional delete added to the backend would serialize participating AgentState writers but still cannot atomically couple a byte-version comparison to OS pathname deletion against a raw filesystem replacer. It would not repair the exact review probe.
- Atomic rename to quarantine has the same problem: a replacement can land between the identity check and the pathname rename, causing foreign state to be moved.
- Directory `dev` and `ino` receipts are filesystem-specific identity hints, not a portable conditional-delete primitive. Node exposes them as filesystem-specific values; even a perfect identity comparison is separated from `rmdir` by an asynchronous race window.
- Recursive `mkdir` returns only the first directory created, not the full created set. Exact diagnostic receipts therefore require component-wise non-recursive `mkdir` successes.
- In-tree claim markers can establish pre-publish visibility, but the marker then requires the same unsafe cleanup after success, failure, or crash. Leaving it permanently pollutes the portable bundle and wedges later creation. An external runtime mutex gives the needed ordering without a portable claim artifact.
- A per-target lock is insufficient because parent and child use different path keys. Hierarchical reader/writer locks or a claim registry could preserve unrelated concurrency, but add a new protocol, stale-claim recovery, ordering, and more failure states. Conservative root-scoped serialization is the smallest proportional mechanism.

Node filesystem evidence: the official Node fs contract gives `unlink(path)` and `rmdir(path)` path-based operations with no expected-version or identity condition; asynchronous promise operations have no implicit ordering; `Stats.ino` is filesystem-specific; and recursive `mkdir` returns only the first created path. Sources: https://nodejs.org/api/fs.html and the supported-floor reference https://nodejs.org/download/release/v22.17.0/docs/api/fs.html. The repository supports Node >=20 and tests Node 20/22/26, so the design must stay within this common API surface.

## Likely API and file changes

- `packages/cli/src/bundle.ts`: replace `claimCreateOnlyTarget(): Promise<void>` and `verifyCreateOnlyIsolation(target)` with one owning `withCreateOnlyTarget` or `createOnlyAtTarget` coordinator; add strict create-only probes and `CreateOnlyClaimReceipt`; remove all post-CAS `unlink` and `rmdir` code. Keep `assertCreateOnlyTarget` as a read-only wrapper if tests or callers need it, but make it use the strict observer.
- `packages/cli/src/commands/init.ts`: route only the create-only branch through the coordinator and call `initBundle(...expectNew)` as its publish callback. Keep ordinary init and Recipe ordering unchanged. Map VersionConflict as today; enrich failures only with honest residual-directory details.
- `packages/core/src/index.ts`: add an internal-workspace export of the existing `withFilesystemMutationLock` primitive so CLI policy reuses the one lock implementation rather than duplicating it. No new storage-backend or wire API is needed.
- `packages/core/src/backend.ts`: harden `currentVersionAt` so only true absence maps to null; today its blanket catch can turn an index read fault into an expect-absent premise. This is the final publication observation and should fail closed. No `deleteReserved` API should be added.
- `packages/cli/test/init-create-only.test.ts`: replace direct post-CAS verifier tests with coordinator/state-machine tests and deterministic injected filesystem faults.
- `scripts/verify-npm-package.mjs`: extend installed-artifact proof with parent/child concurrency and preservation assertions. Help/reference/generated skill files change only if failure wording is corrected; plugin artifacts remain bot-owned.

## Acceptance and test implications

- Change VAL-006 from remove only owned directories to record and retain every directory created before failure. Absolute no-unowned-deletion and portable pruning cannot both be proven with Node path APIs under replacement.
- Preserve VAL-001: a pre-existing empty target survives a forced pre-publication failure, with an empty created-directory receipt.
- Preserve VAL-002 as a no-cleanup proof: inject a post-publication or lock-release failure after replacing `index.md`; replacement bytes remain exact because no rollback runs.
- VAL-003 and VAL-004: inject `EACCES`, `EPERM` or `EIO`, required-read `ENOENT`, and shape changes into target, ancestor-own-index, conventional-index, and binding probes. Every case is a typed nonzero result before publish; all foreign bytes and hidden subtrees remain exact. Include the actual permission test where the host can enforce it, but deterministic injection must cover Windows and root CI.
- VAL-005: barrier-driven/repeated parent-child and same-target process tests against source-built CLI and exact installed tarball. Assert zero two-success rounds, zero nested pairs, no damaged winner, and no post-failure deletion. Cover conventional `.agentstate-lite`, symlink-resolved ancestors, Windows drive-root key normalization, and a stale runtime lock.
- Test error truth: an empty receipt may say no directories were created; a non-empty receipt must say those paths may remain. Lock-release or publication-outcome uncertainty must never say nothing remains.
- Run focused tests, red-proof the former three adversarial probes, then independent exact-SHA Review, adversarial QA, `npm run check`, installed-package proof, and hosted Node 20/22/26 gates.

## Uncertainty and scope

The proof is for cooperating same-user local create-only processes, matching the repository compatibility contract for filesystem CAS locks. Different OS users use different private lock namespaces; raw writers can ignore advisory application locks; and NFS attribute caching is outside the existing local-filesystem visibility assumption. The design still guarantees no deletion of their state because it performs no deletion, but absolute parent/child exclusion against non-cooperating raw filesystem writers is not implementable with Node path APIs alone. If that broader guarantee is required, the product contract must add a stronger OS or daemon authority rather than claim it from this CLI primitive.

## Result Envelope

- status: COMPLETE
- summary: recommend strict pre-publish root-scoped arbitration, in-memory directory receipts, no persistent target claim, and zero failure-path deletion.
- evidence: exact SHA `81b3c39`; current code at `packages/cli/src/bundle.ts:55-60,363-478,495-546,567-617`, `packages/cli/src/commands/init.ts:122-163`, and `packages/core/src/backend.ts:294-340,390-420`; actual review notes listed above; official Node filesystem contracts.
- risks: conservative POSIX serialization, stale runtime lock requiring inspection, same-user/local-filesystem scope, and empty directory residue on failed pre-publication attempts.
- next recommendation: freeze this state machine, revise VAL-006 to retain directories, then have Builder land deterministic red regressions before replacing the unsafe verifier.
