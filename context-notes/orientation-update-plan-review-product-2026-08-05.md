---
type: Context Note
title: Product review of N4 implementation plan
actor: codex-orientation-product-architect
timestamp: '2026-08-05T20:47:52.936Z'
---
# Summary

Verdict: **CHANGES REQUIRED** on `plans/orientation-update-notice-implementation` version `sha256:02562d97d9f24947ddf050864fbebd0582c8fdb56293bfc27f8e18b651250ae9` before Builder starts.

The plan correctly freezes the product boundary, 64 KiB/4 KiB local bounds, strict private schemas, two-visit stale cleanup, one owning module, exact-artifact detached worker, privacy boundary, and Builder → exact-SHA Review → adversarial QA → repository gate ordering. Those parts are approved in principle.

One normative contradiction remains unresolved: a success-only cache plus a 30-second lease removed after every worker result cannot enforce the Decision/protocol's “one refresh per 24 hours” after an unavailable result. Several smaller process/output contracts also need to be made explicit so the red tests have one expected behavior.

Ultimate goal: make agentstate-lite installable, local-first, durable shared memory without founder intervention.

Proximate goal: reject ambiguity that could turn passive orientation into repeated background traffic, stale-worker cache writes, or unintentional output/process drift. This serves the ultimate goal by making the notifier's safety and noninterference mechanically testable before implementation.

# Findings

## F1 — BLOCKING: daily attempt bound is unimplementable under the frozen success-only state

The Decision says passive orientation “may launch one detached refresh per 24 hours”; normative section 3 says “at most one eligible process starts one worker per TTL window.” The frozen plan also correctly requires:

- cache only a successful U3 result;
- ignore/do not cache `unavailable`;
- a 30-second lease; and
- worker removal of its matching lease on every normal/error path.

After timeout/offline/http/malformed/selected-deprecated, no cache or lock remains. The next eligible home can immediately launch another worker. Concurrency is bounded, but daily attempts are not. This is not solvable from the two frozen paths/schemas without changing one of those rules.

Required action before Builder: return this row to protocol review and choose one explicit contract:

1. **Minimal wording amendment:** TTL throttles only after a successful check; failed checks may retry on later eligible orientations, while the lease guarantees at most one in flight. Amend the Decision/protocol/plan so they no longer claim at-most-daily attempts; or
2. **True daily attempt throttle:** define a separate negative-attempt/cooldown state and its safe path/schema/lifecycle, then include it in privacy/no-write acceptance. This is more machinery and conflicts with the current exact two-path, success-only protocol, so it requires explicit D0 revision rather than Builder invention.

Do not silently interpret “TTL window” as “successful-cache lifetime” while leaving the public Decision's stronger claim intact.

## F2 — BLOCKING: worker must revalidate lease authority before cache commit

The plan says the worker validates its token before the request and removes only a matching lease afterward. With stale recovery, an old worker can lose its lease, later resume, and still overwrite a newer cache unless authority is checked again immediately before commit. The two-visit cleanup reduces overlap but does not make an expired worker authoritative.

Required plan/test additions:

- worker re-reads and validates exact lease token and unexpired lease immediately before cache commit;
- a worker that lost or outlived its lease writes no cache and does not touch a successor lock;
- race fixture: old worker pauses after check, stale cleanup occurs, successor acquires, old resumes; old result must not replace successor state;
- parent removes only its matching lease on synchronous spawn throw and best-effort on asynchronous child `error`; otherwise a launch that never started needlessly waits for stale recovery.

If the implementation cannot make pre-commit ownership sufficiently atomic with the shared writer, the plan must name the accepted race and the reader-side monotonic safeguard (for example, refusing to replace a newer `checked_at`) rather than claiming strict ownership.

## F3 — REQUIRED: freeze exact output placement and correct the help-parity contradiction

The plan says help/errors remain byte-identical, but it also requires documenting the new public `--no-update-check` flag and privacy behavior in session-start/reference/generated skill. Those cannot both be true.

Required correction:

- freeze TOON insertion order as `agentstate-lite`, optional `update_notice`, then the existing bundle/board/orientation fields (the test scout's progressive-disclosure recommendation), or choose another exact location and pin it;
- state that default output with no notice, JSON, ordinary commands, MCP, and unrelated errors remain byte-identical;
- explicitly authorize the narrow help/reference bytes that must change for the new flag/privacy contract;
- keep the hidden worker absent from all public lists/help.

## F4 — REQUIRED: suppression parsing and global test suppression are incomplete

The plan states the result but not the existing router hazards. `home` swallows parse errors, and bare leading-global routing does not yet know `--no-update-check`. The focused command in the plan sets only `AGENTSTATE_LITE_NO_AUTOPULL=1`, contradicting “tests globally suppress passive checks.”

Required plan/test additions:

- suppression is detected by exact flag token before any cache/lease I/O, even when another home argument is malformed; near-matches do not suppress;
- bare `aslite --no-update-check`, explicit `home --no-update-check`, and `session-start --no-update-check` all route correctly;
- JSON bypass occurs before the orientation dependency is called;
- add `ASLITE_NO_UPDATE_CHECK=1` to the normal CLI test environment (or a single equivalent test bootstrap) and to the published focused command; opt-in N4 tests explicitly remove it in isolated temp homes;
- audit built/subprocess/package harnesses so no test unexpectedly contacts npm or writes the operator's real `~/.agentstate`.

## F5 — REQUIRED: finish the literal schema/time/size contract

The 65,536-byte cache bound is proportionate: the complete U3 result is already bounded far below it, while the cap prevents hostile local files from consuming unbounded memory. Retain it. Add these exact details:

- both reader and worker serializer enforce the 65,536-byte bound; lease reader/writer enforce 4,096 bytes;
- timestamps use canonical `Date.toISOString()` form and round-trip exactly, not any permissive parseable ISO spelling;
- exact key sets apply recursively to the complete nested U3 result;
- cache writer refuses an unexpectedly oversized serialization rather than creating a cache the reader will reject;
- missing `~/.agentstate` is a safe first-use state: create it as 0700, then verify real-directory/uid/mode before lease creation; an existing unsafe directory is never chmod'd/followed by passive work.

## F6 — REQUIRED: specify invalid private-route behavior

The exact current-entry + `process.execPath` launch is correct. Freeze that `__update-refresh-v1` with missing/malformed token is silent, performs zero cache/lease/network work, and exits without falling into the public unknown-command renderer (which could expose a token or alter stdout). Pin exact argv and no shell/PATH/npx use.

# Approved aspects

- **Product scope:** cached guidance only; no install, preferences, integrations, bundle changes, telemetry, `next`, daemon, or general notifier framework.
- **64 KiB bound:** appropriate, provided it is symmetric on read/write as F5 states.
- **Two-visit stale recovery:** approved for a valid private expired lease—cleanup-only first visit, acquisition on a later visit—provided F2's lost-lease write guard is added. Foreign/malformed/symlink/unsafe locks remain untouched.
- **Architecture:** one `update-orientation.ts` owner reusing U3, identity, atomic writer, and pure home projection is the right consolidation boundary.
- **Privacy/docs:** fixed U3 GET/Accept/no body, token-only worker coordination, and explicit statement of what npm necessarily sees are sufficient. Broad npm-primary docs correctly remain D8.
- **Gate ordering:** compliant. Builder focused validation may precede commit; independent exact-SHA Review must pass before adversarial QA; QA must pass before the full repository/package gate and Brian-owned merge.

# Required disposition

Builder remains blocked. F1 requires protocol-owner disposition; F2–F6 can be folded into the plan once F1's policy is chosen. After revision, the product critic should perform a focused re-review of the changed plan/protocol rows rather than re-reading the whole release design.

# Confidence

High (0.94) on F1, F3, F4, F5, and gate assessment. High (0.90) that F2 needs an explicit pre-commit ownership check; the exact atomicity mechanism remains an implementation-design question that Review/QA must attack.
