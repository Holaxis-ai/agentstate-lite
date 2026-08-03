---
type: Context Note
title: Revision 3 T1 final reliability review
actor: codex-precompact-v3-t1-reviewer-r4
timestamp: '2026-08-03T20:31:28.442Z'
---
# Summary

Final T1 reliability review of exact commit `a77ef92fa009ee424497317c129c6a6f88f122ef`: **PASS**, confidence 0.98. The repaired recovery marker is recognizable, identity/address-bound, metadata-only, fixed-expiry, non-nesting, and has exact operator and bounded GC owners for both attached and orphan interruption states. Both ordinary process-interruption tests pass, the prior R2 races remain closed, and the five R1 blockers remain resolved. No ordinary reliability blocker remains in the reviewed T1 scope.

Review inputs: accepted design `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`; accepted plan `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`; prior R3 FAIL `sha256:386383c267c2f60d51f3a955fab062c5801242728bde9a19f58d27a0376e0991`; builder repair note `sha256:13c97076f2ceb35bd1c8f215c5187f7400787a4c130066052a5250160152a4ab`.

## Recovery-marker result

- The strict marker schema contains canonical project/execution identity and full keys, generation address, exact head/original-generation versions, original SHA-256, exact quarantine key/version, and canonical creation/expiry timestamps. Creation and expiry differ by the fixed seven-day handoff lifetime (`packages/cli/src/handoff/authority.ts:50-68,185-255`). Original raw generation bytes are absent; they exist only in the private bounded quarantine.
- Marker parsing validates exact keys, version/hash formats, identity key recomputation, UUID-addressed generation/quarantine keys, and fixed lifetime. `recoveryGuard()` additionally binds the parsed marker to its physical generation path and current target (`:666-704`).
- Attached and orphan markers diagnose as `HANDOFF_RECOVERY_IN_PROGRESS`. Attached recovery validates the referenced quarantine, exact head version, and exact marker version, then detaches the head and removes the marker. Orphan recovery validates the same quarantine premise and exact marker version, then removes the marker directly. Existing markers are resumed rather than wrapped, so marker nesting is eliminated (`:817-876,897-907`).
- New recovery remains quarantine-first. It publishes one generation-key core CAS fence under the caller's exact version/expect-absent premise, exact-version detaches the head, then exact-version removes the marker (`:926-975`). No second lock or duplicate transition authority was introduced.
- GC recognizes markers rather than treating them as generation corruption. An expired attached marker is detached only after exact head/marker rereads and exact deletes. An orphan marker is exact-version deleted through the ordinary generation sweep. Both consume the existing 25-generation cap; quarantine deletion remains independently capped at 25 (`:711-793`).
- Every ordinary interruption window is bounded: before marker publication leaves only bounded quarantine; after marker publication leaves a resumable attached marker; after head detachment leaves a resumable/GC-owned orphan; interrupted marker removal is idempotently retried. Fresh prepare runs GC first and does not select or retain completed markers.

## Process-interruption evidence

The two committed true-process tests were run independently and together:

- `after_recovery_generation_fence`: PASS. Process exit leaves an attached marker. Diagnosis recognizes it, the marker contains no secret canary, exact operator continuation removes it, quarantine expires under GC, and fresh prepare has no old marker residue. A separate no-operator cycle proves expired attached-marker plus quarantine cleanup by GC alone.
- `after_recovery_head_detach`: PASS. Process exit leaves an orphan marker. Diagnosis recognizes it without a head, exact operator continuation removes it, quarantine expires under GC, and fresh prepare is residue-free. A separate no-operator cycle proves orphan-marker plus quarantine cleanup by GC alone.

The dedicated command reported 2 tests, 2 pass, 0 fail. The tests use real child processes exiting with code 77 at production killpoints, not simulated exceptions.

## Prior findings remain resolved

- R2 missing-generation reappearance and concurrent PostCompact generation-version change both return exact conflicts, preserve head/generation bytes, and remove the speculative quarantine.
- Journal ancestor symlinks remain rejected.
- Foreign and rewritten compact transcripts remain blocked without context; a valid strict append restores.
- Non-racing missing-generation exact recovery remains successful.
- Quarantine GC remains independently capped and accurately accounted.
- Rewritten-prefix Stop remains informational and non-mutating.
- Final mode, temporal schema, fixed-expiry, head/generation CAS/readback, stale Stop rollback, canonical identity, strict schema, bounded transcript rendering, content-free receipts, and true cross-process publication contention remain green.
- T1 still contains no hidden T2 hook-installation/event-mapping implementation.

## Verification evidence

- Exact checkout remained clean at `a77ef92fa009ee424497317c129c6a6f88f122ef`; repair diff check passed.
- Dedicated interruption lane: 2 pass, 0 fail.
- Focused identity/schema/transcript/authority/process/contracts lane: 49 tests; 36 pass, 13 expected T2 skips, 0 fail.
- `npm run typecheck --workspace packages/cli`: pass.
- Opt-in frozen red lane: 14 pass with exactly the two intentionally deferred T2 failures (`unsupported-pre-post-context`, `substring-hook-ownership`).

Verdict applies only to T1 at the exact SHA above. T2 adapter/install integration, packed-candidate gates, and live manual/automatic compaction acceptance remain downstream gates and are not implied by this PASS.
