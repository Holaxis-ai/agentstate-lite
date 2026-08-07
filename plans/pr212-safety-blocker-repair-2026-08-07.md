---
type: Plan
title: 'Plan: repair PR #212 rollback ownership and fail-closed isolation'
description: >-
  Frozen team plan plus completed three-cycle reorientation: one local
  followed-target observer correction is authorized, then fresh exact-SHA Review
  before QA.
actor: codex-pr212-orchestrator
timestamp: '2026-08-07T16:18:48.042Z'
---
# PR #212 safety-blocker repair — frozen team plan

## Purpose and goals

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: make `init --create-only` truthfully fail closed under cooperating concurrent creates and hostile filesystem transitions, without deleting filesystem state it cannot prove it owns. This serves the ultimate goal by making unattended onboarding safe and predictable.

## Problem statement

Exact SHA `81b3c39ff252013e318b1a714b63430a24074d70` publishes `index.md`, scans for a concurrent parent/child bundle, and then rolls back by pathname. Independent review demonstrated that it can delete a pre-existing empty target and a foreign replacement `index.md`. The recursive scan also treats filesystem errors as an empty subtree; team probes showed the same fail-open behavior in the generic upward `stat` path.

The old lifecycle cannot be repaired by adding a historical hash or inode check before `unlink`/`rmdir`: Node exposes no identity-conditional pathname deletion, so a replacement can occur between check and delete. The design therefore removes post-publication rollback rather than attempting to make it look owned.

## Domain model

- **Logical target**: the path spelling supplied by the caller.
- **Physical target**: the symlink-resolved path derived from the nearest existing ancestor.
- **Strict observation**: an isolation decision where only an explicitly classified absence is absence; access, I/O, resource, disappearance, or shape uncertainty is a typed failure.
- **Create-only arbitration mutex**: an external, private, same-user cross-process runtime lock shared by all targets under one physical path root. POSIX is intentionally host-global; Windows is drive/UNC-root scoped.
- **Critical section**: strict locked revalidation through successful `index.md` expect-absent publication.
- **Directory receipt**: the exact ordered paths created component-by-component by this invocation. It is diagnostic only and never authorizes deletion.
- **Publish point**: the successful expect-absent `index.md` write.
- **Foreign state**: any path or bytes not created by this invocation, including replacements at historically owned pathnames.
- **Residue**: empty directories created before a failed publication. Residue is retained and reported; it is never pruned.

## Frozen threat and compatibility boundary

The mutual-exclusion proof covers cooperating same-user `init --create-only` processes on a coherent local filesystem, matching the repository's existing filesystem-mutation-lock scope. Different OS users, raw filesystem writers that ignore the advisory lock, and incoherent/network filesystem caching cannot be excluded from mutating the tree. They remain in scope for the no-deletion and truthful/fail-closed guarantees.

Plain `init` keeps the current reviewed branch's open-or-create/idempotent behavior. Recipe resolution remains before any write and Recipe application remains after bundle publication. Existing target, binding, enclosing bundle, conventional workspace, symlink, non-directory, and non-empty refusals retain their present user-facing conflict class. No quickstart, npm release, plugin-bundle, hook, sync, MCP, View, or unrelated architecture work enters this unit.

## Approved state machine

1. Resolve the Recipe before mutation, unchanged.
2. Strictly resolve and inspect the logical target, read-only, to obtain the physical target and path-root lock key.
3. Acquire the external create-only arbitration mutex using the repository's existing filesystem lock implementation.
4. Under the mutex, strictly re-resolve and fully re-inspect the original logical target. Refuse if physical resolution changed or the target is no longer genuinely new.
5. Create missing path components with non-recursive `mkdir`, recording every successful creation in an in-memory directory receipt. A pre-existing empty target yields an empty receipt.
6. Strictly re-resolve/re-inspect immediately before publication and require the same physical target. The target must be empty. Any top-level entry proves it is not genuinely new, so recursive descendant scanning is unnecessary.
7. While still holding the mutex, publish `index.md` through `initBundle(..., { expectNew: true })`. This is the only bundle-creation write and the linearization point.
8. Release the mutex, then apply the already-resolved Recipe.

No create-only failure path invokes `unlink`, `rmdir`, `rm`, or rename-to-quarantine. The post-CAS `verifyCreateOnlyIsolation` mechanism is deleted.

## Proof obligations

1. **At most one parent/child success.** Parent and child share one root-scoped mutex. Their critical sections are ordered. After the first publishes, a child second entrant sees an enclosing bundle; a parent second entrant sees a non-empty target. The second fails before publication.
2. **No unowned deletion.** There is no product-tree deletion in the create-only lifecycle. Pre-existing directories, replacement files, symlinks, and path-shape replacements therefore survive every handled failure.
3. **Fail-closed observation.** Create-only policy uses dedicated strict probes rather than generic permissive discovery. Only `ENOENT` at an observation whose containing path was successfully established may mean absent. `EACCES`, `EPERM`, `EIO`, resource errors, unexpected disappearance, `ENOTDIR`, symlink/shape transition, and `realpath` failure are `RUNTIME` uncertainty before publication.
4. **Truthful residue.** No message says "nothing remains" or "nothing was written" when a non-empty directory receipt exists or publication outcome is uncertain. Created empty directories may remain and are safe for retry because create-only accepts an existing empty target.
5. **No lifecycle regression.** Successful create-only returns the same public receipt; ordinary init and all Recipe forms preserve the accepted PR baseline.

## Frozen validation contract

- **VAL-001 — pre-existing target preservation:** force failures before and after locked revalidation with a pre-existing empty target; assert its identity survives and no removal primitive is called.
- **VAL-002 — zero product-tree deletion:** inject different-byte replacement, identical-byte/path ABA, symlink replacement, and empty-directory replacement around publish/release failures; assert exact foreign state survives. Static/dynamic tests reject any create-only call to `unlink`, `rmdir`, `rm`, or quarantine rename.
- **VAL-003 — strict observation matrix:** deterministically inject EACCES, EPERM, EIO, EMFILE/ENFILE, unexpected ENOENT/ENOTDIR, ELOOP, and shape changes into target, ancestor-own-index, conventional-index, binding, `lstat`, `readdir`, and `realpath` observations. All uncertainty is typed `RUNTIME` before publication with operation/path/code details. A real chmod probe is supplemental only.
- **VAL-004 — hidden descendant:** a target containing any top-level descendant, including an unreadable subtree hiding `index.md`, refuses without descending or succeeding; all subtree bytes survive.
- **VAL-005 — deterministic mutex ordering:** barrier tests force parent-first and child-first ownership of the shared mutex for ordinary and conventional-child shapes. The blocked process cannot enter locked revalidation or reach publish until release. Assert zero two-success cases, zero nested pairs, one undamaged winner at most, and structured loser output. Live repeated races remain supplemental smoke.
- **VAL-006 — exact directory receipt and residue truth:** component-wise creation records only directories this invocation created; no directory is pruned. Failures expose `residual_created_directories` when non-empty and never recommend `recipe add` for unreadable/shape-uncertain targets.
- **VAL-007 — lock uncertainty:** timeout, stale/malformed lock, and release failure remain typed runtime failures with inspectable lock details. A release failure after publication must not trigger product-tree cleanup or claim that no bundle exists.
- **VAL-008 — compatibility:** pin fresh create-only with default/none/named/path Recipes; preflight refusals; bad-Recipe-before-write behavior and corrected retry; plain init create/open/idempotence and Recipe transition; same-target contention and physical-root receipts.
- **VAL-009 — distribution and exact-SHA gates:** focused source tests, build, deterministic built-CLI tests, exact locally packed/installed CLI proof, `npm run check`, and hosted Node 20/22/26 must pass on the same SHA submitted to Review and QA.

Deterministic injected barriers/faults are the safety oracle. Scheduler races and permission-bit behavior are supplemental evidence, not proof.

## Roles, dependencies, and gates

1. **R0 architecture / adversarial-test / acceptance review — complete.** Architecture approved pre-publish root-scoped arbitration; the acceptance critic rejected the draft until deletion and ambiguity were removed; adversarial testing expanded strict observations beyond the reported `readdir` line.
2. **Builder.** In an isolated worktree, first demonstrate the required new regressions red at `81b3c39`, then implement the approved state machine and make focused tests green. The risky mechanism and its tests land in one commit.
3. **Independent Reviewer.** Detach an isolated worktree at the exact builder SHA. Audit the lock-key construction, critical-section boundaries, strict error classification, zero-deletion property, residue truth, and test provenance. Probe at least one criterion red against the old SHA. No editing.
4. **Adversarial QA.** Only after Review approves, use a fresh isolated worktree at the same SHA. Exercise barrier-controlled multi-process orderings, raw path replacement, actual permission behavior where supported, built CLI, and installed tarball. No editing.
5. **Orchestrator.** Run the repository gate, push the reviewed commit to the PR branch, verify hosted Node 20/22/26 on that exact SHA, update the public PR with evidence, and keep the bundle task/plan current.

Builder -> Reviewer -> QA is a hard dependency chain. A code change after Review or QA restarts the exact-SHA gate. Review/fix cycles are capped at three before architectural reorientation.

## Merge-ready definition of done

- The approved state machine is implemented without post-publish product-tree cleanup.
- Every VAL-001..VAL-009 requirement is evidenced on the final SHA.
- Independent exact-SHA Review approves, followed by fresh adversarial QA approval.
- `npm run check`, built CLI, and exact installed-package verification pass locally; hosted Node 20/22/26 pass on the same SHA.
- The PR comment explains the repaired invariants, residue behavior, exact SHA, and evidence. The orchestrator does not merge.

## Team evidence

- Governing [task](../tasks/init-target-safety-guard.md)
- [prior gate ledger](../context-notes/init-create-only-gate-complete-81b3c39.md)
- `context-notes/pr212-r0-architecture-codex`
- `context-notes/pr212-r0-adversarial-tests-codex`
- `context-notes/pr212-r0-acceptance-critic-codex`
- Independent review comment: https://github.com/Holaxis-ai/agentstate-lite/pull/212#issuecomment-5218142850
