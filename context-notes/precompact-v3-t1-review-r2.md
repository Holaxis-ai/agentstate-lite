---
type: Context Note
title: Revision 3 T1 independent repair review
actor: codex-precompact-v3-t1-reviewer-r2
timestamp: '2026-08-03T20:06:36.579Z'
---
# Summary

Revision-3 T1 repair commit `12ec0938e4d4a0e824e1f6a977f0f504b3578f13` receives **FAIL** at high confidence (0.99). The five blockers from review 1 are repaired and empirically closed, but exact-version recovery still has a load-bearing multi-key race: it can detach the current head after the supplied generation-version or generation-absence premise has become stale. This violates the accepted recovery contract that detachment occurs only under the supplied head/generation versions and that a conflict changes nothing.

Review inputs: accepted design `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`; accepted plan `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`; prior T1 FAIL `sha256:df58723f3e78891bf1cc400572a409d20dcd2cb42fe4eaa3303876e48d393c16`; repaired builder note `sha256:704164eb4285f03c545ebbd86f8412b0d021a72e9d930c0dac423c3271d1d1b2`.

## Blocking finding

### Recovery does not CAS-guard the generation premise through head detachment

`recover()` initially checks the exact head version and reads the selected generation (`packages/cli/src/handoff/authority.ts:702-727`). It then quarantines the observed bytes, yields at `after_recovery_quarantine`, and deletes only the head under `expectedHeadVersion` (`:736-741`). It never revalidates or locks the supplied generation version/absence after quarantine. The head and generation use different per-key core locks, so a generation-only mutation leaves the head version unchanged and recovery still detaches it.

Two independent killpoint attacks reproduced unsafe success against the exact commit:

1. Valid head selects a missing generation. Diagnosis reports corrupt with exact head version and no generation version. Start `recover(expectedHeadVersion, expectedGenerationVersion:null)`, pause after quarantine, recreate the exact selected healthy generation, then resume. Actual: recovery `recovered`; `headRemains:false`; `healthyGenerationPresent:true`. The stale absence premise detached a now-healthy handoff instead of returning conflict and changing nothing.
2. Prepare and deliver a generation, advance past fixed expiry, diagnose exact head/generation versions, then start recovery and pause after quarantine. A concurrent production `auditPostCompact()` records against the still-current delivered generation, changing its generation version while preserving the head version. Resume recovery. Actual: audit `recorded`; `generationVersionChanged:true`; recovery `recovered`; `headRemains:false`; updated generation remains orphaned. This is an ordinary authority mutation, not direct raw-file tampering.

The existing recovery interruption test only pauses and retries without changing the selected generation (`packages/cli/test/handoff-authority.test.ts:610-645`), so it does not exercise this stale-premise race. Repair requires an execution-scoped atomic guard/transaction respected by every generation/head mutator, or an equivalent protocol that makes head detachment conditional on the exact generation version/absence at commit time. A non-atomic final re-read narrows but does not eliminate the race.

## Prior five attacks: repaired

- Symlink ancestor: rejected with `HANDOFF_STORE_UNSAFE`; the configured journal was not created through the alias.
- Foreign compact transcript: blocked `TRANSCRIPT_PATH_MISMATCH`, `continue:false`, no context field.
- Same-path rewritten compact prefix plus append: blocked `TRANSCRIPT_NOT_STRICT_APPEND`, `continue:false`, no context field. Positive control with a byte-preserving append restored and injected normally.
- Missing selected generation without a race: diagnosis `HANDOFF_STORE_CORRUPT`; `expectedGenerationVersion:null` recovery succeeded, detached the head, and quarantined one record.
- Quarantine GC: 30 expired records became 5; receipt reported `deleted:25`, `generationDeleted:0`, `quarantineDeleted:25`.
- Rewritten-prefix Stop: ignored as `RESPONSE_OBSERVATION_AMBIGUOUS`; no response observation was stored.

## Mode, temporal, and regression inspection

- Final journal records are asserted 0600 and directories 0700; the ancestor/root/descendant symlink tests pass. The previously noted crash window remains: core publishes a default-mode record before `HandoffStore.writeRaw()` chmods it to 0600 (`packages/cli/src/handoff/store.ts:150-159`). Enclosing 0700 directories mitigate disclosure, so this remains a non-blocking hardening concern rather than the R2 failure.
- Prepared generations now reject response/Post metadata. Delivery cannot predate prepare, response/Post cannot predate delivery, and production PostCompact ignores a prepared generation. These temporal repairs are sound for the reviewed scope.
- Canonical identity, strict structural schemas, transcript extraction/truncation, head/generation CAS/readback, stale Stop rollback, fixed expiry, current-head detach ordering, content-free receipts, and real cross-process core-backend contention remain green.
- No T2 hook-installation or public adapter policy was hidden in T1.

## Verification evidence

- Exact checkout before/after: clean at `12ec0938e4d4a0e824e1f6a977f0f504b3578f13`; `git diff --check` passed.
- Focused production suite: 45 tests, 32 pass, 13 expected T2-red skips, 0 fail.
- `npm run typecheck --workspace packages/cli`: pass.
- `npm run build --workspace packages/cli`: pass.
- Opt-in red lane: 14 pass and exactly the two deferred T2 failures (`unsupported-pre-post-context`, `substring-hook-ownership`).
- `/private/tmp/t1-r2-review-probes.ts` reran all five original attacks, positive controls, and both recovery races against production code; it did not modify the worktree.

Required repair gate: add production serialization/transactionality that keeps the exact generation premise valid through head detachment, add both missing-generation-reappearance and generation-version-change killpoint tests, then rerun the same exact attack/focused/process/red/typecheck/build lanes under a new exact SHA.
