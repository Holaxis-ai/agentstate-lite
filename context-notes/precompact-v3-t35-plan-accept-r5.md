---
type: Context Note
title: Revision 3 T3.5 candidate acceptance Plan R5 product review
actor: codex-precompact-v3-t35-r5-acceptance
timestamp: '2026-08-03T23:52:46.696Z'
---
# Revision 3 T3.5 candidate acceptance Plan R5 — independent product/acceptance review

# Summary

Exact Plan `plans/precompact-v3-t35-candidate-acceptance@sha256:c7a9e198b6580fbc59519b5b90aa4e9a55cab9c6ded97d818ca5c0ae3977bd4c` earns an unqualified **PASS** from the independent product/acceptance review. It preserves the survived R4 delivery contracts; makes executable authority, strict schemas, release boundaries, causal cleanup, PID-risk bounds, independent Review-before-QA, and one-candidate live compaction proof measurable; and contains no load-bearing issue or blocker.

## Verdict

**PASS** — unqualified. Confidence: **0.98**.

No load-bearing issue or blocker was found. This verdict approves the exact R5 Plan for implementation; it does not assert that the future implementation or live candidate has passed any later gate.

I did not read or seek any other new R5 Plan-review note before making this verdict immutable.

## Goal linkage

- **Ultimate goal:** make agentstate-lite's pre-compaction handoff durable and trustworthy across multiple concurrent sessions without session cross-talk, secret leakage, false-positive delivery, or cleanup-induced harm.
- **Proximate goal:** independently decide whether exact R5 is a buildable, rejectable acceptance contract that preserves the survived R4 design while making the unverified live compaction rail and process lifecycle hard gates.
- **Link upward:** a Plan can serve the ultimate goal only if it makes failure observable and terminal before authorization, implementation, or candidate promotion; R5 does.

## Exact inputs

- Current task: `tasks/pre-compact-multi-session@sha256:03126c1ba1846ab43a2e45e7664d015405b63b545839aff8ea54eebe331b2caf`
- Current orientation: `context-notes/precompact-v3-orientation@sha256:af10abacc8f43aa7d237d4dffafd21b1dd1b6a0b717e4191ffdff1f3212a4928`
- Host-probe panel synthesis: `context-notes/precompact-v3-t35-host-probe-panel-synthesis@sha256:bdee04f5f0d23c77cc97c6b4e0e8432377b880f0b81ab6eb093b61b4d7bf6093`
- Prior host product/acceptance review: `context-notes/precompact-v3-t35-host-probe-acceptance@sha256:c973fd9bca6eb26cf08a659882c9e9c96f22ea7812d7ee43809873a40fe9b82f`
- Host evidence audit: `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`
- Prior host skeptic disposition, used only as a stated input: `context-notes/precompact-v3-t35-host-probe-skeptic@sha256:3980e9bdf01f4180999a6ab47347adc33d73d2c74f54e5c84e70e97932c38f62`
- Plan under review: `plans/precompact-v3-t35-candidate-acceptance@sha256:c7a9e198b6580fbc59519b5b90aa4e9a55cab9c6ded97d818ca5c0ae3977bd4c`

The Plan was read in full. Its digest was verified twice: against bundle history and against the complete exported Plan bytes; both produced `c7a9e198b6580fbc59519b5b90aa4e9a55cab9c6ded97d818ca5c0ae3977bd4c`.

## Acceptance attacks and disposition

### 1. Survived R4 delivery contracts and scope freeze

**Attack:** Looked for any silent weakening of exact-full-identity routing, corrected `jq`, promote-collision behavior, strict generation binding, the sequential SessionStart corruption wrapper, first-action/first-response canaries, wrapper/identity/auth isolation, immutable-candidate rules, or the original delivery assertions.

**Disposition:** Survived. R5 binds the exact R4 scope, carries the known contracts into the one authority and live oracles, rejects mutation by restarting the chain, and requires exact candidate/tree/invocation/receipt binding. Cleanup and harness behavior cannot promote or manufacture delivery success.

### 2. One executable authority, schemas, and evidence

**Attack:** Tried to find convention split across prose, shell, and multiple implementations; permissive schemas; summary booleans that could conceal raw contradictions; fallback evidence that could overwrite primary observations; or privacy assertions that could not be recomputed.

**Disposition:** Survived. One copied `scripts/handoff-candidate.mjs` owns lifecycle transitions, freeze/verify/campaign/stage, launch, fault, cleanup, and evidence policy through one codec, validator, and transition function. Standalone strict P35H/P35V schemas, parser grammar, validation receipts, raw pre-fallback evidence, recomputable privacy inputs, retained final audits, and exact invocation/candidate bindings are measurable and rejectable. Fakes are confined to effect injection, not a competing policy implementation.

### 3. Release boundaries and uncertainty mapping

**Attack:** Searched for a path where an unidentified process could receive the API key, an ambiguous pre-release actor could be cleaned/retried/overlapped, or a post-release unknown could be downgraded to BLOCKED.

**Disposition:** Survived. Before durable server release, unresolved broker identity is secret-free, non-advancing `QUARANTINED_PRE_RELEASE` / `BLOCKED_PENDING_VERIFICATION` and forbids cleanup, retry, overlap, and secret access. Once `SERVER_RELEASED` is durable, uncertainty about any principal or descendant is an immutable pending FAIL; later cleanup may reach CLEAN but cannot erase the FAIL. Server and session releases each require CAS-protected durable identity readback before the next capability is exposed.

### 4. Separate server, `-N` client, descendants, reaper, and socket gates

**Attack:** Tried to collapse server and client proof, treat tmux disappearance as Claude disappearance, use pane refresh as group proof, let cleanup substitute for the delivery rail, unlink a socket while owners might survive, or allow multiple raw-signal owners.

**Disposition:** Survived. R5 independently gates the commandless server, the separate no-auth `-N` client, real Claude/hook/subagent process groups, and socket ownership. It requires client/delivery creators absent before refreshed pane/tree evidence, then server absence, then separate descendant-group absence, then stale-socket validation/unlink/fsync, then repeated strict observations and a post-clean `-N` check. One recoverable reaper owns raw signals; takeover requires exact former-owner absence and a complete re-observation. Unknowns and survivors after release remain FAIL.

### 5. PID TOCTOU honesty

**Attack:** Looked for an atomic or no-mistarget claim unsupported by the Darwin primitives, reliance on `sess`/SID, PPID as stable identity, permissive `ps` parsing, or raw signaling without immediate identity revalidation.

**Disposition:** Survived. The Plan explicitly bounds rather than eliminates PID/start/identity TOCTOU under the named non-malicious-same-UID threat model. It uses the pinned Darwin tuple, explicit `argv[0]`, strict `/bin/ps` grammar, exact PID/start/UID/PGID/comm/binary revalidation immediately before signaling, and treats PPID as observation only. `sess`/SID is absent. The remaining exit/reuse window is neither hidden nor promoted into a stronger safety claim.

### 6. Roles, dependencies, and review order

**Attack:** Searched for a builder self-approval path, QA before independent Review, authorization before exact Plan approval, live lanes before immutable candidate freeze, or a mutation path that could preserve stale approvals.

**Disposition:** Survived. The red-first graph is actionable: exact dual Plan PASS precedes authorization and implementation; implementation is followed by independent exact-SHA Review; G0 freezes the candidate; exact-artifact Review precedes adversarial QA; only then do live gates run. Builders cannot review their own work, and any artifact/harness mutation restarts the dependent chain.

### 7. Real rail and immutable-candidate acceptance

**Attack:** Tried to satisfy acceptance with fixture-only behavior, hooks alone, a cleanup result, an auth error, synthetic descendants, or different artifacts across manual, automatic, and subagent tests.

**Disposition:** Survived. Fixtures only authorize the next stage. One frozen candidate must then pass manual main compaction, automatic main compaction, and real-subagent compaction with exact passive event evidence, generation/source binding, first-response/first-action proof, corruption canaries, and delivery assertions. The real teardown matrix separately exercises kill-server, socket unlink plus TERM, runner crash/two-cleaner takeover, and socket unlink plus KILL. Missing or ambiguous rail/process/event evidence selects a closed non-PASS verdict; cleanup never substitutes for compaction delivery.

### 8. Authentication and global-state exposure

**Attack:** Looked for global credential fallback, auth in the no-auth client, hidden secret holders, global config/plugin mutation, retained secrets in artifacts, or an auth failure that could bypass cleanup.

**Disposition:** Survived. The live lane permits exactly one isolated API key without global fallback, enumerates the processes allowed to hold it, explicitly excludes the `-N` client, binds the real Claude path and invocation, requires leak scans and protected snapshots, and contains lane-local state. Auth failure can block progress only after causal cleanup; post-release process uncertainty still overrides it with FAIL.

## Survived claims

- Exact-full-identity routing, corrected `jq`, promote-collision behavior, and R4 delivery assertions remain mandatory.
- One executable authority and one strict lifecycle/schema surface are testable rather than conventional.
- Pre-release uncertainty is secret-free, non-advancing quarantine; all post-release process uncertainty is FAIL.
- Server, separate `-N` client, real descendants, reaper ownership, process-tree teardown, and stale-socket disposal are separately and causally gated.
- PID-risk language matches what the pinned host primitives can prove.
- The dependency graph gives named roles, exact artifacts, CAS/receipt boundaries, Review-before-QA, and restart-on-mutation behavior.
- Acceptance can reject a bad implementation and can later prove manual, automatic, and real-subagent compaction on one immutable candidate.
- Cleanup, auth outcomes, fixtures, and summaries cannot substitute for the live delivery rail.

## Issues / blockers

None.

The Plan's mandatory downstream gates remain requirements, not qualifications on this verdict: implementation, independent exact-SHA code Review, candidate freeze, exact-artifact Review, adversarial QA, and all live lanes must still earn their own closed verdicts. No later actor may treat this Plan PASS as evidence that those gates have passed.
