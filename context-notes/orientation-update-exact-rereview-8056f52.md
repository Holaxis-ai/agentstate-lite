---
type: Context Note
title: Exact-SHA orientation update re-review at 8056f52
actor: codex-orientation-exact-review
timestamp: '2026-08-05T21:56:28.058Z'
---
# Summary

**Exact-SHA re-review verdict: PASS** at replacement candidate `8056f525766551556dedb31928d09e821fc4a58e`.

The blocking expired-cooldown ABA finding from `21a028c418bf30ecb72aa77a0b06a244aee769d0` is closed. No new finding survived the repair-delta review. Adversarial QA may proceed on this exact SHA.

Reviewed in a clean detached worktree with `21a028c` as the repair delta and base `164ba7edb89c31678856020ee794f80530e6c276` as context. No source, GitHub, PR, merge, or shared-board sync mutation was performed.

# Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that humans and an agent fleet can install and use without founder intervention.

Proximate goal: determine whether the exact repair closes the expired-cooldown quarantine ABA so only the surviving matching parent starts a worker, while preserving cache, worker, suppression, output, and privacy semantics. Complete.

# Finding disposition

## F1 — closed

After the post-claim cache reread and exact executable resolution, the parent now calls the existing fixed-path `activeLeaseAuthority` immediately before detached spawn. That authority requires the same 64-hex token, an exact valid active record, safe state directory/file semantics, and a current time inside the active lease.

If authority was lost, the parent returns before invoking the spawn dependency. Crucially, this branch performs no `releaseActiveUpdateLease`, quarantine, cooldown transition, cache write, or other successor-state mutation. The successor's active token therefore remains at the fixed path for its owning parent/worker.

The cleaner-C / parent-A / parent-B IPC regression deterministically replays the original interleaving with pipe barriers rather than sleeps:

1. cleaner C observes the expired cooldown and pauses;
2. parent A cleans, claims token A, and pauses after claim;
3. C captures A and pauses with the fixed path absent;
4. parent B claims token B and starts one worker;
5. C cannot restore A over B and returns occupied;
6. A resumes, fails final authority revalidation, starts zero workers, and leaves token B unchanged.

Observed result: B spawns `1`; A spawns `0`; the final fixed active token is B.

# Independent evidence

- Exact head/branch pin: `8056f525766551556dedb31928d09e821fc4a58e`; merge-base with failed candidate is exactly `21a028c418bf30ecb72aa77a0b06a244aee769d0`; base context is exactly `164ba7edb89c31678856020ee794f80530e6c276`.
- Repair delta: three files only — update-orientation owner, deterministic child fixture, and owner tests; 146 insertions, 12 deletions; `git diff --check` PASS.
- Root build: PASS.
- Orientation owner suite: PASS, 22/22; the deterministic expired-cooldown ABA regression passed.
- External authority-withdrawal control that failed at `21a028c`: PASS, 1/1. It independently replaces A with B after claim and proves zero spawn plus B's token byte/state survival.
- Exact focused plan battery: PASS, 120/120, 0 failures, run with loopback permission.
- Detached worktree remained clean and pinned after verification.

# Regression audit

The repair does not weaken the validated cache or worker contracts:

- cache parsing, recursive exactness, time/size limits, command recomputation, cache-before-release ordering, and atomic writer authority callback are unchanged;
- worker authority checks before U3 and immediately before cache commit are unchanged;
- active/cooldown schemas, continuous stale-active replacement, initial hard-link no-replace claim, and production quarantine matching are unchanged;
- the new quarantine callbacks are deterministic test barriers only; absent callbacks preserve the production path;
- success, unavailable/cooldown, invalid executable, and spawn failure behavior remains as reviewed, while the new authority-loss branch is strictly read-only;
- hidden routing, suppression/JSON zero-work, notice projection/placement, help/privacy, and pre-change byte contracts are untouched by the three-file repair.

# Next gate

Adversarial QA is unblocked at exact SHA `8056f525766551556dedb31928d09e821fc4a58e`. Any source or test change invalidates this PASS and requires another exact-SHA review before QA continues.

Confidence: 0.96.
