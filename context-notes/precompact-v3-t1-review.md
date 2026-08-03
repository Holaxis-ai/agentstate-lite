---
type: Context Note
title: Revision 3 T1 independent review
actor: codex-precompact-v3-t1-reviewer
timestamp: '2026-08-03T19:50:17.389Z'
---
# Summary

## Revision 3 T1 independent review

Verdict: **FAIL** (high confidence, 0.98) for exact commit `a5a5efc269336abb2c76fb54d78d84d74abcfe9e` (`feat/precompact-v3-t1`). The checkout was clean before and after review. This review is against accepted design `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`, accepted plan `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`, repaired T0 review `sha256:ee034c73688c85054c170ca52059960079d067c102857492543719732fc31d4f`, and the T1 builder note.

The implementation advances the design substantially, but T1 cannot pass with five empirically demonstrated contract violations in the production authority/store. These are absent from the committed tests, which all pass.

## Blocking findings

1. **The private journal accepts a symlink ancestor.** `HandoffStore` resolves the configured root lexically and verifies only the root and key descendants (`packages/cli/src/handoff/store.ts:75-93,100-123`). It never walks/validates ancestors of the root. Probe: configure `<scratch>/alias-parent/journal` where `alias-parent` is a symlink to a real 0700 directory; `initialize()` returns successfully and the real root is reached through the symlink. The accepted design requires the journal boundary to refuse symlinks, and the T1 gate explicitly requires symlink/privacy attack coverage. The existing test checks a root that is itself a symlink and a descendant `projects` symlink, not a symlink ancestor (`packages/cli/test/handoff-authority.test.ts:502-523`).

2. **Compact restore is not bound to the transcript that produced the generation.** `restore()` checkpoints the supplied path but applies transcript freshness/path checks only for `source === "resume"` (`packages/cli/src/handoff/authority.ts:426-440`). For `source: compact`, a generation prepared from transcript A is marked delivered using transcript B, and its evidence card is injected. Probe result: `pathsDiffer:true`, `restored:"restored"`, `continue:true`, `contextInjected:true`. This breaks the generation's transcript provenance and causes later Stop checks to bind to B rather than the transcript that generated the card. Compact must require the canonical delivery path (and required freshness relationship) to agree with the stored prepare provenance before mutation/injection.

3. **Exact-version recovery cannot detach a valid head whose selected generation is missing.** Diagnosis correctly reports `HANDOFF_STORE_CORRUPT` and a head version without a generation version (`packages/cli/src/handoff/authority.ts:651-652`), but recovery unconditionally treats missing generation bytes or absent `expectedGenerationVersion` as a version conflict (`:681-684`). There is no version token the caller can supply for an absent record. Probe result: diagnosis corrupt, recovery `conflict/RECOVERY_VERSION_CONFLICT`, exact head remains. This contradicts the operator contract allowing exact-target recovery of corrupt/unsafe current state and leaves this common partial-write/corruption state permanently attached.

4. **Quarantine GC is unbounded and its receipt undercounts physical deletion.** The 25-record counter gates generation deletion only (`packages/cli/src/handoff/authority.ts:598-615`); the subsequent quarantine loop deletes every expired quarantine record without a limit or counter increment (`:617-620`). Probe with 30 expired quarantine records: before 30, after 0, `receipt.deleted:0`. The accepted design gives quarantine its own bounded seven-day, 25-record GC policy. The existing cap test creates only generations (`packages/cli/test/handoff-authority.test.ts:365-378`) and therefore misses this path.

5. **Response observation accepts a rewritten transcript rather than a strict append.** `firstAssistantResponseAfter()` checks path, growth, survival of the old last-visible UUID, and later candidates, but never compares the first `checkpoint.byteLength` bytes or their stored SHA-256 (`packages/cli/src/handoff/transcript.ts:301-322`). Probe: rewrite a byte in the pre-delivery prefix while retaining the checkpoint UUID, append the expected assistant response, and the production function returns an observation. This violates the accepted `strict append beyond the delivery checkpoint` predicate. Observation is informational and does preserve expiry/delivery state, but it still mutates the current generation under evidence the design explicitly disallows.

## Non-blocking risks / follow-ups

- Exact record mode is not established atomically with publication. Core `atomicWrite` creates/renames a default-mode temp (`packages/core/src/backend.ts:114-125`); `HandoffStore.writeRaw()` publishes through `writeBlob` and only then chmods 0600 (`packages/cli/src/handoff/store.ts:131-140`). The enclosing verified 0700 directories mitigate disclosure, and normal completion reaches 0600, but a crash/chmod failure leaves the exact 0600 promise unmet. No test asserts record modes or this interruption window.
- Structural schema validation is strict, but provenance cross-fields are not reconciled: card evidence source hashes/positions need not agree with `transcript.sourceMessageHashes` or `visibleMessageCount` (`packages/cli/src/handoff/schema.ts:195-246,331-390`). A syntactically valid, internally re-rendered record can carry inconsistent transcript provenance.
- Schema/authority permit `postCompactAudit` and `responseObservation` metadata on prepared records (`packages/cli/src/handoff/schema.ts:352-369`); `auditPostCompact()` does not require delivered state. T2 host ordering should normally prevent this, but the claimed single executable authority should enforce temporal invariants itself rather than rely on adapter ordering.
- Receipt validation rejects a short top-level denylist only, not recursively nested content. Current authority receipts contain only scalar hashes/lengths/identifiers and passed the committed privacy validator, so this is hardening rather than an observed leak.

## What survived review

- Canonical project identity, full exact execution tuples, full SHA-256 namespaces, collision separation, and byte-wise stored-identity comparison are production-backed and tested.
- v1 head/generation/quarantine parsing rejects unknown/missing fields, validates identity/key recomputation, canonical timestamps, UUIDs, fixed seven-day expiry, rendered hash/length/truncation, state/delivery relationship, and excludes impossible self storage versions.
- Transcript extraction is deterministic and identity-specific, rejects malformed JSONL, represents unknowns explicitly, excludes tool noise from visible evidence, and preserves current-prompt/next-action priority below 8,000 characters.
- Authority writes use the real core filesystem backend and its same-user cross-process lock/CAS. The two-process test proves two retained generations and exactly one expect-absent head winner. Generation/head readback and most losing-publication/rollback behavior are sound.
- Fresh/stale prepared and delivered resume behavior, fixed expiry, current-head detach-before-generation deletion, corrupt-present-generation exact-version recovery/quarantine, delivery interruption retry, and content-free emitted receipts passed.
- PostCompact remains bounded audit-only. Stop observation does not alter delivery state, expiry, or head. The stale-head race after observation write rolls the generation back byte-exact; no stale Stop rollback overwrite was found.
- T1 does not implement hidden T2 hook installation/event mapping. The red lane has only the two explicitly deferred T2 failures (`unsupported-pre-post-context`, `substring-hook-ownership`).

## Verification evidence

- `npm run typecheck --workspace packages/cli`: PASS.
- Focused production suite (`handoff-identity-schema`, `handoff-transcript`, `handoff-authority`, `handoff-authority-process`, `handoff-rejected-contracts`): 41 tests, 28 pass, 13 expected skips, 0 fail.
- Red-contract lane with `AGENTSTATE_LITE_RUN_HANDOFF_RED_CONTRACTS=1`: 16 tests, 14 pass, exactly 2 expected T2 failures.
- Independent `/private/tmp/t1-review-probes.ts` against the exact checkout reproduced all five blockers above. It did not modify the worktree.
- `git diff --check HEAD^ HEAD`: PASS; final `git status --short`: clean; final SHA unchanged.

Required repair gate: add production fixes and regression tests for all five blockers, extend privacy/mode tests to ancestor symlinks and record modes, cover missing-generation recovery and quarantine cap/accounting, and rerun this exact focused/process/red/typecheck set before a new exact-SHA independent review.
