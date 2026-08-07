---
type: Plan
title: 'Plan: repair PR #212 rollback ownership and fail-closed isolation'
description: >-
  Team-reviewed repair plan for the two independent-review blockers on PR #212:
  unsafe pathname rollback and fail-open descendant scans.
actor: codex-pr212-orchestrator
timestamp: '2026-08-07T14:27:29.476Z'
---
# Summary

Repair PR #212's two P1 safety blockers by replacing pathname-assumed cleanup with explicit ownership/provenance and by making every uncertain descendant scan fail closed. The repair must preserve the original create-only invariant—no successful nested pair—without deleting pre-existing or concurrently replaced state.

# Goals

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: make `init --create-only` a truthful fail-closed creation primitive under concurrent and hostile filesystem transitions. This serves the ultimate goal by making the onboarding creation boundary safe enough for agents to invoke without founder supervision.

# Domain model and taxonomy

- **Logical target:** the path spelling supplied by the caller.
- **Physical target:** the symlink-resolved local directory selected after preflight.
- **Preflight:** read-only rejection of existing, non-empty, bound, symlinked, or already nested targets.
- **Claim:** the first exclusive filesystem mutation that establishes this invocation's participation in creation.
- **Claim receipt:** immutable evidence of exactly which artifacts and directories this invocation created, including enough identity to distinguish later replacements.
- **Publish point:** creation of `index.md`, which turns a directory into an OKF bundle visible to ordinary discovery.
- **Isolation check:** the bidirectional ancestor/descendant proof that a parent and child create-only race cannot both report success.
- **Rollback:** best-effort removal restricted to artifacts still provably owned by this invocation.
- **Foreign state:** anything that pre-existed the claim or was created/replaced by another writer after it.
- **Uncertainty:** any filesystem observation failure—permission denial, I/O error, disappearance, unexpected shape, or identity mismatch—that prevents proving safety.

Current sequence at reviewed SHA `81b3c39` is: resolve Recipe → preflight physical target → `claimCreateOnlyTarget()` creates missing directories but returns no receipt → `initBundle(expectNew)` publishes `index.md` → `verifyCreateOnlyIsolation()` scans up/down → conflict cleanup unlinks `target/index.md` and rmdirs upward by pathname. The two review blockers are consequences of missing provenance and fail-open scan error handling in that final stage.

# Non-negotiable invariants

1. No invocation reports success when its target is nested inside another bundle or contains a nested bundle.
2. No failure path deletes or overwrites a directory or file that this invocation did not create and still provably own.
3. A won expect-absent write is historical evidence, not perpetual pathname ownership.
4. Every observation error in an isolation proof fails closed; absence may be concluded only from a successful observation.
5. Cleanup messages describe observed outcomes truthfully; never claim “nothing remains” when cleanup was skipped, uncertain, or failed.
6. Recipe resolution remains before the first write, and ordinary `init` without `--create-only` remains backward compatible.
7. The repair stays inside create-only target policy, its tests, generated public help if wording changes, and installed-package proof. It does not absorb npm quickstart, plugin regeneration, release, hook, or install-scope work.

# Validation contract

- **VAL-001 — pre-existing empty target:** force post-claim isolation failure after selecting an empty directory that existed before invocation. The directory remains byte/identity present; only invocation-owned artifacts may be removed.
- **VAL-002 — replaced index:** after this invocation's expect-absent publication, atomically replace `index.md` before conflict handling. The replacement bytes remain exact and the command fails without claiming complete rollback.
- **VAL-003 — unreadable descendant:** hide a nested bundle below a directory whose read fails. Isolation cannot return success; the command emits a typed fail-closed error and preserves the hidden subtree.
- **VAL-004 — scan error matrix:** EACCES plus at least one injected non-permission readdir failure and disappearance/shape transition all fail closed with no foreign deletion.
- **VAL-005 — parent/child race:** repeated built-CLI and installed-package parent/child races produce zero two-success rounds, zero successful nested pairs, and zero damaged winner/foreign state.
- **VAL-006 — directory provenance:** nested missing-parent targets record and remove only directories created by the invocation; pre-existing ancestors and empty target directories survive.
- **VAL-007 — cleanup truth:** injected unlink/rmdir/identity mismatch cannot produce an unconditional complete-cleanup claim.
- **VAL-008 — regressions:** fresh targets and all Recipe forms still succeed; existing/bound/nested/symlink/non-empty targets still refuse before product writes; plain `init` behavior remains intact.
- **VAL-009 — distribution:** focused source tests, built CLI, exact installed tarball, full repository gate, and hosted Node 20/22/26 CI all pass at the final exact SHA.

# Orchestration plan

1. **R0 fan-out:** independent architecture, adversarial-test, and product/acceptance agents review this model and the exact-head reproductions. Read-only except agentstate context notes.
2. **Plan synthesis:** orchestrator reconciles disagreements, updates this Plan, and freezes the implementation boundary before code changes.
3. **Builder:** first commit deterministic red regressions for VAL-001–VAL-004/VAL-007, then implement the smallest design that makes them green. Builder records design rationale and focused evidence.
4. **Independent exact-SHA Review:** a fresh Reviewer receives the frozen criteria and commit, not the builder's reasoning. Any blocker returns to a fresh repair pass, maximum three review cycles.
5. **Adversarial QA:** a fresh QA agent runs built and installed-artifact hostile filesystem/concurrency batteries after Review passes.
6. **Repository/hosted gate:** run full `npm run check`, push the reviewed/QA SHA, monitor Node 20/22/26, and update the PR only when all gates pass.

# Open design questions for R0

- Can the publish-point rollback be made atomically conditional with available cross-platform primitives, or must arbitration move before `index.md` publication so post-CAS deletion disappears entirely?
- What claim representation gives parent/child mutual visibility without mutating unrelated ancestors or relying on stale global locks?
- Which directory identities can be recorded portably enough to prevent removing pre-existing/replaced directories, and where must uncertainty deliberately leave residue?
- How should typed error taxonomy distinguish isolation conflict, scan uncertainty, and incomplete cleanup without weakening existing exit-code compatibility?

[task](../tasks/init-target-safety-guard.md)
[failed exact-SHA review](https://github.com/Holaxis-ai/agentstate-lite/pull/212#issuecomment-5218142850)
[prior gate ledger](../context-notes/init-create-only-gate-complete-81b3c39.md)
