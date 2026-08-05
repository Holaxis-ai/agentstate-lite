---
type: Context Note
title: Test review of orientation update implementation plan
actor: codex-orientation-test-scout
timestamp: '2026-08-05T20:56:40.243Z'
---
# Summary

**Focused re-review verdict: CHANGES_REQUESTED — one remaining concurrency blocker.**

The amended Decision, normative protocol, and implementation plan close the original findings on complete fixed-path publication, active/cooldown persistence after unavailable/interrupted work, hostile handle-based reads and exact bounds, global test suppression, deterministic hidden-route/byte fixtures, and exact-SHA gate invalidation. One cache/coordination race still permits a second worker inside the 24-hour attempt window unless the plan adds a post-claim cache recheck and keeps stale-active conversion continuously occupied.

Review basis:

- `decisions/version-update-contract` at `sha256:6566f67e2c6c3596a545a8781f4f751a35d6735d1803ac04f191a352c1a45b15`
- `designs/version-update-protocols` at `sha256:9aca5f76a7c42082ad398ca345f616a261c2af457eb1df8c020f2aed024d41ee`
- `plans/orientation-update-notice-implementation` at `sha256:85b231826a247f3f973697cb4527fcdcfe50fb9016057dda600806cffd84dd89`

## Remaining blocker — stale cache decision can outlive the active record

The parent reads cache before attempting the atomic coordination claim. The successful worker writes fresh cache and then removes its matching active record. This legal interleaving remains:

1. Parent B reads the old missing/expired cache while worker A still owns the active record, then B is descheduled before its no-wait claim.
2. A writes the fresh successful cache and removes active A.
3. B resumes, atomically claims active B based on its stale earlier cache decision, and launches a second worker inside A's 24-hour cache/attempt window.

The active/cooldown union does not prevent that check-then-claim race. Add an exact parent invariant: **after winning the fixed-path active claim and before spawn, re-read/revalidate the cache from a fresh safe handle.** If a fresh valid cache now exists, release only the just-won matching active token and return without spawn. A failed/unsafe second read remains fail-closed; it must not turn an unsafe path into network work.

Add a deterministic barrier/IPC test that pauses B after its first cache read, lets A commit cache and remove active, then resumes B. Assert B may claim but performs zero spawn/U3 work and removes only its own token.

The related stale-active transition must not expose an absent fixed-path window. Once an active record is stale, its worker cannot remove/commit because the amended contract requires an **unexpired** matching lease before commit. Convert that stale active record to cooldown by a continuously occupied atomic replacement; do not quarantine it into an observable absence where a successor can claim and reach pre-network validation before cooldown is restored. Extend the controlled race test to schedule a claimant at that boundary and prove no second launch. Quarantine remains appropriate for token-scoped removals, provided no code later unlinks the fixed pathname and a captured successor loses authority before U3.

## Original findings now closed

- Complete lease bytes are written/fsynced to a unique O_EXCL 0600 temp and published by atomic no-replace hard-link claim; a killed publisher cannot leave a partial fixed lock.
- The exact active/cooldown union preserves the original 24-hour attempt window after unavailable checks or post-publication interruption; expired cooldown cleanup is a cleanup-only visit.
- Fixed-path cleanup forbids read/compare/unlink and uses quarantine plus worker token revalidation.
- Cache/coordination readers use no-follow/nonblocking handle + fstat + bounded `limit+1` reads, with literal 65,536/65,537 and 4,096/4,097 cases.
- CLI tests and the focused command globally set `ASLITE_NO_UPDATE_CHECK=1`; N4 opts in only through isolated/injected environments.
- Hidden-route success is tested in-process with injected U3; built probes require no live npm. Pre-change byte fixtures have deterministic dependencies and explicit base-SHA provenance.
- Any post-review source/test repair invalidates the verdict and returns the new SHA to exact review before QA.

## Confidence

High (0.96). The remaining interleaving follows directly from the amended write-cache-then-remove ordering and the parent's pre-claim cache decision; it can be reproduced deterministically without sleeps.
