---
type: Context Note
title: Revision 3 T1 final narrow review
actor: codex-precompact-v3-t1-reviewer-r3
timestamp: '2026-08-03T20:17:19.103Z'
---
# Summary

Final narrow T1 review of exact commit `a6af67738a1750b02a201ce4ea51cfdc84a3e23f`: **FAIL**, confidence 0.99. The new generation-key CAS sentinel closes both R2 TOCTOU races exactly and all five R1 fixes remain intact. One load-bearing interruption blocker remains: a process crash after sentinel publication can leave a recovery guard that the authority deliberately excludes from GC and that operator recovery restores byte-for-byte. The guard contains the original raw generation bytes, has no expiry, and remains permanently after quarantine expiry and subsequent successful prepares.

Review inputs: accepted design `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`; accepted plan `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`; R2 review `sha256:8018384072ece7751ab0812b259c04399c52c47c3df71ae1a4a41ec2b5be30dd`; repaired builder note `sha256:776c6637a45a438ebaeebabfa439e73e959dec54b272c41ae44f5d8a725a9c78`.

## Blocking finding: interrupted sentinel has no bounded cleanup path

Recovery first quarantines the exact observed raw bytes, then publishes a recovery guard at the selected generation key using the caller's exact generation version or expect-absent premise (`packages/cli/src/handoff/authority.ts:772-790`). This is a real core-backend per-key CAS fence, not a second lock. Recovery then exact-version deletes the head and releases the fence by restoring the original generation bytes or deleting an expect-absent fence (`:793-815`). The live success/conflict protocol is sound while the process remains alive.

The new guard publication is itself a durable state transition, but it has no killpoint or recovery lifecycle. A real process exit between guard publication and head detachment/release leaves the guard on disk. The guard schema has no creation time or expiry (`:48-55,177-202`). GC unconditionally skips every record recognized as a guard (`:656-662`), including an orphan with no head. Diagnosis reports an attached guard as corrupt. A subsequent exact recovery sets `generationRaw` to the old guard, publishes a nested fence, detaches the head, then `releaseFence()` restores the old guard byte-for-byte. Once the head is absent there is no operator target left through which to remove it.

Actual-process probe evidence against the exact checkout:

- a child used production recovery and exited with code 77 immediately after the production guard `writeRaw` completed;
- interrupted state: exact head still attached, guard present, one quarantine record;
- GC outcome `recorded`, `deleted:0`, guard still present;
- exact operator recovery: diagnosis `HANDOFF_STORE_CORRUPT`, outcome `recovered`, head detached, original guard restored byte-exact;
- after advancing beyond both quarantine expiries: GC deleted both quarantine records, guard still present;
- a later prepare succeeded with a new generation/head, while the old guard remained.

The same permanent orphan occurs even more directly if the process dies after head detachment but before the `finally` release. Because `originalRawBase64` embeds the original corrupt/expired generation, the failure is not only storage leakage but indefinite retention of content the design bounds through quarantine/GC. It violates the accepted every-interruption-boundary requirement and the named bounded GC/self-cleaning contract.

Required repair: make guards durably recoverable and bounded. At minimum, use a strict identity/address-bound guard schema with a timestamp/expiry and define exact GC/recovery transitions for both attached and orphan guards; operator recovery of a pre-existing guard must remove/resolve it rather than restore it. Add true-process exits after fence publication and after head detachment, then prove eventual byte-safe recovery and bounded deletion. Merely adding a `finally` or an in-process killpoint does not cover process termination.

## R2 TOCTOU attacks: repaired

- Absent selected generation recreated during quarantine: fence CAS lost; recovery returned `conflict/RECOVERY_VERSION_CONFLICT`; exact head and recreated healthy generation remained; quarantine count returned to zero.
- Present expired generation advanced by concurrent production PostCompact during quarantine: PostCompact recorded and changed the generation version; fence CAS lost; recovery returned conflict; exact head and updated generation remained; quarantine count returned to zero.

The sentinel is a single CAS fence at the existing generation key. Ordinary authority mutators cannot overwrite it because structured generation reads fail closed, and GC does not reinterpret it as a corrupt generation. Normal successful recovery remains quarantine-first and exact-version guarded; present records are restored byte-exact after detachment and expect-absent fences are removed. The blocking issue is the durable interrupted state, not the live-race protocol.

## R1 repairs remain closed

- Symlink ancestor is rejected `HANDOFF_STORE_UNSAFE`.
- Foreign compact transcript is blocked `TRANSCRIPT_PATH_MISMATCH` without context.
- Same-path rewritten compact prefix is blocked `TRANSCRIPT_NOT_STRICT_APPEND`; a valid strict append restores normally.
- Non-racing missing-generation recovery succeeds with explicit `null`, detaches the head, and quarantines.
- Quarantine GC independently caps and accurately reports 25 deletions (30 to 5).
- Rewritten-prefix Stop is ignored without storing an observation.
- Final 0600 and temporal prepared/delivered/Post constraints remain green; the previously documented post-publication chmod window remains non-blocking hardening.

## Verification evidence

- Exact checkout remained clean at `a6af67738a1750b02a201ce4ea51cfdc84a3e23f`; diff check passed.
- Focused production suite: 47 tests, 34 pass, 13 expected T2 skips, 0 fail.
- `npm run typecheck --workspace packages/cli`: pass.
- Opt-in red lane: 14 pass and exactly the two deferred T2 failures (`unsupported-pre-post-context`, `substring-hook-ownership`).
- `/private/tmp/t1-r2-review-probes.ts` reran both R2 races and every R1 attack; `/private/tmp/t1-r3-crash-probe.ts` performed the true-process interruption and later recovery/GC/prepare checks. Neither modified the worktree.
