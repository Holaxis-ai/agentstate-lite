---
type: Context Note
title: PR 212 R0 acceptance-contract critique
description: >-
  Product-owner critique of the PR #212 blocker-repair plan and VAL-001..VAL-009
  contract.
actor: codex-pr212-acceptance-critic
timestamp: '2026-08-07T14:34:29.074Z'
---
# Summary

## Result Envelope

- Status: REJECT AS BUILD AUTHORIZATION; APPROVE DIRECTION AFTER REQUIRED AMENDMENTS.
- Summary: the plan correctly names the two P1 blockers and keeps product scope narrow, but it is not frozen enough to prevent another review loop. Four open design questions still control the safety guarantee, error contract, and feasibility. Most importantly, the plan assumes that provenance can make a later pathname deletion safe without deciding what makes the check-and-delete atomic. Under the review's own foreign-replacement threat model, a hash or file/directory identity check followed by `unlink`/`rmdir` remains racy. The minimal frozen scope should remove directory pruning entirely and either arbitrate cooperating parent/child creates before the publish point or explicitly leave uncertain residue without deleting it.
- Evidence: PR head and live review comment are both exact SHA `81b3c39ff252013e318b1a714b63430a24074d70`. At that SHA `claimCreateOnlyTarget()` returns no receipt; `verifyCreateOnlyIsolation()` swallows downward `readdir` failures, uses `findBundleRoot()` whose `exists()` swallows all upward `stat` failures, unconditionally unlinks `index.md`, prunes empty directories by pathname, and always claims complete rollback. The public error help always recommends `recipe add` or a new path, including states where target safety is uncertain. Existing live race evidence is probabilistic: the prior gate itself records that a real construction bug produced 0/150 manifest failures, so repeated green races cannot be the primary oracle.
- Risks: unsafe deletion survives a naive provenance repair via ABA/path replacement; upward scan uncertainty remains untested; vague residue semantics can make a failed command leave an accidental workspace while claiming otherwise; current VAL-005 can stay green with a broken ordering proof; “plain init remains intact” can reopen already accepted recipe-order/error-precedence decisions.
- Next recommendation: amend and re-freeze this Plan before code. Choose a no-unsafe-delete lifecycle, define the exact threat/visibility boundary and error UX, replace VAL-001..VAL-009 as below, then authorize one implementation/review/QA cycle.

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: freeze the smallest sufficient repair contract for PR #212's unsafe rollback and fail-open isolation blockers, so implementation can proceed once without reopening the prior review rabbit hole. This serves the ultimate goal by making `init --create-only` safe for unattended agent invocation while preserving ordinary `init` compatibility.

## Required Plan amendments

1. Freeze the lifecycle and threat model. State that the parent/child mutual-exclusion guarantee covers cooperating same-user `init --create-only` processes on a coherent local filesystem. Arbitrary raw filesystem writers are in scope for the non-deletion and truthful/fail-closed guarantees, but cannot be prevented from mutating the tree after the final observation. NFS/cache incoherence remains out of scope. Name the linearization/arbitration point and whether a handled failure may leave an invocation-authored `index.md`; do not leave “no successful pair” and “no pair remains” ambiguous.
2. Resolve the consequential rollback question before build. Recommended minimal contract: never prune directories in post-publication cleanup. Empty directories are harmless, retryable because create-only accepts an existing empty target, and not worth a pathname-ownership race. Prefer arbitration before `index.md` publication so ordinary conflict handling has no reserved-file delete. If post-publication removal remains, it must be atomic against every in-scope replacement writer and must detect byte-different, byte-identical ABA, symlink, and directory/path replacement; a content hash or `stat` check followed by `unlink` is insufficient. On any uncertainty, leave residue and report it.
3. Make the isolation proof strict in both directions. The current upward path is also fail-open because `findBundleRoot()` calls `exists()`, which converts every `stat` failure to false. The repair contract must cover `stat`/`lstat`/`readdir`/`realpath` failures, enumerated-child disappearance, and shape/symlink transitions. Only a specifically classified absence at a successfully observed parent may mean absent. Keep this strictness scoped to create-only policy unless an explicit separate decision changes ordinary discovery.
4. Freeze machine-facing UX without adding a new exit class. A known create conflict remains `ALREADY_EXISTS`/exit 5. An observation or cleanup uncertainty is `RUNTIME`/exit 1, with structured details naming `phase`, `operation`, `path`, `cleanup` (`complete|partial|skipped`), and any `residual_paths`. Never emit “nothing remains” unless proved. Do not recommend `recipe add` when the target is unreadable, shape-ambiguous, or has uncertain residue; recommend fixing access/inspecting the named path and retrying or choosing a different explicit target. `recipe add` is appropriate only for a verified existing winner.
5. Pin backward compatibility to the reviewed PR baseline, not a vague historical meaning. Plain `init` keeps its current open-or-create/idempotent behavior. The already accepted recipe-resolution hoist and bad-recipe-versus-unsafe-target precedence stay accepted and are not reopened. Existing/bound/nested/symlink/non-empty preflight refusals remain pre-write. No guide, npm quickstart, plugin bundle/version, release, hook, sync, MCP, or View work enters this unit.
6. Make deterministic scheduling the safety oracle. Tests need injected barriers/faults that force each lifecycle transition and must fail at `81b3c39`; repeated source/built/tarball races are supplemental distribution smoke, not the proof. Red proof can be recorded before the fix; the risky mechanic and its tests land together in the final reviewed unit.

## VAL-001..VAL-009 disposition

- VAL-001 — NEEDS REWRITING (necessary). Preserve the pre-existing empty target's exact object identity and prove no directory-removal attempt targets it. Define the allowed disposition of this invocation's `index.md` and the exact error details when safe removal is impossible.
- VAL-002 — NEEDS REWRITING (necessary). Cover both different-byte replacement and byte-identical ABA replacement, plus symlink/path-shape replacement. Foreign bytes and path objects remain untouched. A content-version match alone must not authorize deletion.
- VAL-003 — NEEDS REWRITING (necessary). Keep the hidden-nested-bundle case, but require deterministic fault injection plus a real permission probe where the host supports it. Freeze `RUNTIME`/exit 1, structured phase/path/cleanup details, and preservation of the entire hidden subtree.
- VAL-004 — NEEDS REWRITING (necessary). Expand the matrix from downward `readdir` to every observation in both ancestor and descendant proofs: EACCES, injected EIO/non-permission failure, disappearance after enumeration, ENOTDIR/shape transition, and symlink transition. State precisely when ENOENT is safe absence versus uncertainty.
- VAL-005 — NEEDS REWRITING (necessary). Add barrier-controlled orderings that are red at `81b3c39`. Accept zero or one success explicitly, never two; assert no successful nested pair, no damaged winner/foreign state, and truthful loser details. Repeat through source, built CLI, and installed tarball only after deterministic proof exists.
- VAL-006 — REDUNDANT UNDER THE RECOMMENDED FROZEN SCOPE. Delete it and forbid directory pruning. If the team insists on pruning, restore it only after defining an atomic identity-conditional removal primitive and add directory ABA/replacement tests; a receipt plus check-then-`rmdir` is not sufficient.
- VAL-007 — NEEDS REWRITING (necessary). Assert the full structured envelope, not prose alone: error code/exit, phase, operation/path, cleanup state, residual paths, and context-appropriate help. Red-test `unlink`, `rmdir` (if retained), identity mismatch, and scan failure.
- VAL-008 — NEEDS REWRITING (necessary). Split create-only regression from plain-init compatibility. Pin all Recipe forms and preflight refusals, then explicitly preserve the current reviewed baseline's recipe hoist and error precedence. Generated public help changes only when the frozen UX wording changes.
- VAL-009 — NECESSARY, NOT SUFFICIENT. Require focused source tests, built CLI, exact local-dev installed tarball, `npm run check`, and hosted Node 20/22/26 on the same final exact SHA that Review and QA approve. Green distribution gates do not substitute for VAL-001..VAL-008.

No individual VAL is sufficient. The rewritten contract is sufficient only as a conjunction within the frozen threat model.

## Merge-ready definition of done

1. The amended Plan has no open question that changes safety semantics, error taxonomy, residue policy, or implementation authority; design exploration may remain only below that frozen behavioral boundary.
2. Deterministic tests prove red at `81b3c39` and green at the final SHA for: pre-existing-directory preservation; different-byte and identical-byte ABA index replacement; symlink/path-shape replacement; strict ancestor and descendant observation errors; cleanup/residue truth; and every parent/child ordering.
3. The final implementation has no pathname-based directory pruning. It either prevents the parent/child conflict before publish or leaves any post-publish uncertain artifact untouched and reports exact residue. No code path says complete cleanup without proof.
4. Existing/bound/nested/symlink/non-empty targets still refuse before product writes; all supported Recipe forms still create at a fresh target; ordinary `init` preserves the current PR baseline including accepted recipe-resolution ordering.
5. Source, built CLI, and exact installed-tarball adversarial checks pass. `npm run check` passes. Hosted Node 20/22/26 checks pass on the exact same SHA.
6. A fresh independent exact-SHA Review approves after inspecting the provenance/atomicity construction and probing at least one criterion red. Fresh adversarial QA follows Review and exercises hostile filesystem transitions plus real multi-process races. No code changes occur after those approvals without restarting the exact-SHA gate.
7. The diff remains within create-only target policy, its tests, its installed-package proof, and only the generated/public help directly changed by the frozen UX. Bot-owned plugin artifacts/manifests remain untouched.

## Evidence and record caveat

Read: `CLAUDE.md`; required agentstate-lite, self-awareness, and cognitive-ecosystem skills; `docs/core`; `tasks/init-target-safety-guard`; `plans/pr212-safety-blocker-repair-2026-08-07`; `context-notes/pr212-exact-review-81b3c39`; `context-notes/init-create-only-gate-complete-81b3c39`; current product code/tests; live PR comment `5218142850`; and live PR state.

The requested `context-notes/init-target-safety-guard-exact-sha-review-gate` does not exist in the designated bundle. The actual exact-review record and plan-linked prior gate ledger were used instead. No second bundle was created and this note was not synced.
