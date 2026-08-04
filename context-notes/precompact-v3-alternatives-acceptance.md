---
type: Context Note
title: Revision 3 architecture alternatives acceptance
actor: codex-precompact-v3-alternatives-acceptance
timestamp: '2026-08-04T02:39:41.464Z'
---
# Summary

Status: complete.

Recommendation: **separate lifecycle policy from host conformance, and keep production authority synchronous and invocation-scoped.** `aslite hook run` should call the one `CompactionHandoffAuthority` in the hook process and complete its CAS/read-back transaction before returning. The durable authority is the strict private journal plus the deterministic executable, not a daemon PID. Use fake clock/scheduler/transcript/storage/process adapters for lifecycle policy; use real exact-host tests only for filesystem/multi-process CAS, permissions, helper launch/timeout, and the Claude hook rail.

Do not use detached processes, a resident supervisor, launchd, or tmux as the production handoff authority for revision 3. They solve process lifetime that the current handoff does not require and introduce a worse ambiguity: work may commit after Claude has timed out or killed the hook that submitted it. Reuse audited v5 tmux evidence only as exact-artifact provenance for the tmux predicates it actually measured; it is neither a production dependency nor evidence of SessionStart delivery.

The current exact project/execution identity, head/generation CAS, strict schema, logical expiry, sole event-driven GC owner, version-guarded recovery, and content-free observation requirements remain intact. None depends on a long-lived process.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text, offline-first, and owned by the user.

Proximate goal: recommend the smallest host authority and test architecture that makes Claude compaction handoff durable, exactly resumable, recoverable, and side-effect-free to observe while preserving revision-3 identity/CAS/GC/schema invariants; this serves the ultimate goal by putting continuity discipline in a local harness without turning process supervision into a second product.

## Exact inputs and independence

I read in full:

- `context-notes/precompact-v3-alternatives-review-decision@sha256:30dfc33f4760ac65bef7beaaa91f81443f19e19a78c5f097d881565e1776c011`;
- `docs/core@sha256:58aacb19861269bf27bd73d1ff9abcdfe1c2eaab085e1fcdfb73b146afa2f595`; and
- the current requirements in `designs/pre-compact-multi-session@sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`.

I did not read or communicate with the new architect. I did not run probes, tmux, Claude, auth, network, tests, or child modes, and did not edit source, repository, Plan, task, or design. The distinct acceptance note and required board sync are the only mutations.

## Alternatives matrix

| Alternative | Product fit | External state / permissions | Failure containment | What it really proves | Current Plan invariants |
|---|---|---|---|---|---|
| Ordinary detached processes with pipes/PID/PGID | **Poor** for this handoff. Useful only if work must continue after hook return, which revision 3 does not require. | Process-table state, inherited environment/FDs, pipes or private files, signals and groups; no installer, but orphan state survives the caller. | Weak. Parent death, pipe loss, PID reuse, daemonization, late descendants, and result ownership require a supervisor protocol. A timed-out hook cannot prevent a detached worker from committing later. Observation through PID/process scans is sampled and identity-sensitive. | Proves that a host child can outlive a hook and perhaps publish a result. It does not prove exact Claude identity, CAS selection, delivery freshness, schema, GC, or that the result belongs to the surviving session. | The invariants could be reimplemented, but detachment adds request identity, cancellation/fencing, orphan adoption, and late-commit policy. That is needless new authority. Reject for production. |
| Small purpose-built supervisor | **Medium only if there is genuine long-running child work.** A bounded per-invocation reaper can be an internal primitive, but a resident service is not needed for an atomic handoff transaction. | Private Unix socket/instance files, logs, service lifecycle, version skew, startup ownership, upgrade and uninstall policy; possibly a second journal. | Better child-tree ownership while alive. Without OS supervision the supervisor itself can die; with restart it needs durable request fencing. A client timeout still permits a late commit unless every request has cancellation/epoch semantics. Status must not autostart it. | Proves one component can own/reap a child tree and serialize requests. It does not prove Claude invokes the helper, SessionStart injects context, or the lifecycle policy is correct. | Exact identity/CAS/schema/GC can remain, but IPC request identity, supervisor instance identity, late-response fencing, restart recovery, and compatibility become new load-bearing schemas. Reject unless the product later requires background work. |
| macOS launchd ownership | **Poor now; strongest conditional choice if the human explicitly chooses a persistent macOS service.** | User-global LaunchAgent/launchctl state, plist ownership and permissions, program path/digest, bootstrap/bootout, login-session environment, logs, upgrades and removal. Darwin-only and outside the current private-journal footprint. | Stronger process restart/ownership than a self-daemon. It still does not supply application CAS, request cancellation, exact execution identity, or safe late-write semantics. Job/descendant behavior and side-effect-free inspection need exact-host verification. | Proves that launchd owns and restarts the configured job on a verified host. It does not prove compaction handoff correctness or make a stale supervisor response trustworthy. | The Plan invariants remain necessary and unchanged above launchd. Selecting it expands installation, permissions, platform support, readiness, rollback, and live acceptance. Reject absent an explicit durable-service product requirement. |
| Reuse audited v5 tmux evidence | **Evidence optimization, not an architecture.** | Whatever private sockets/processes the already-completed exact evidence used; no new state if only read. Re-running would reopen the rejected host-probe surface. | No current containment is provided by historical evidence. Its original containment quality bounds what may be inherited. | Proves only the exact tmux predicates, tool bytes, host tuple, and conditions recorded by that evidence. It cannot prove a changed helper, Claude rail, journal CAS, exact identity, schema, delivery, GC, or non-tmux host behavior. | No Plan invariant should depend on it. It may discharge an unchanged tmux-specific subclaim only when the evidence digest, host tuple, predicate, and non-staleness are named exactly. Otherwise treat it as context, not a gate. |
| Host-policy separation with fake scheduler/process adapter | **Best fit.** Policy is the product-adjacent harness; host behavior is a narrow adapter and live conformance layer. Production stays one synchronous executable authority backed by the private journal. | Existing managed Claude hook settings and `~/.agentstate/handoffs/v1` only; test roots are isolated. No daemon, pidfile, socket service, launchd job, or tmux dependency. | Strong fail-closed boundary: PreCompact/compact SessionStart return only after mutation and read-back; a killed process cannot continue a background commit. Filesystem locks/temp files/CAS recover concurrent invocations. Observation operations can be structurally read-only. | Fakes prove lifecycle algebra, identity selection, CAS races, freshness, expiry, GC, recovery, and zero-write observation. Filesystem integration proves process-level CAS and permissions. Exact-host live gates prove Claude event schema, ordering, block/continue behavior, timeout/launch boundary, and context delivery. Each proof stays honest about its layer. | Preserves all current requirements without new production policy. **Recommend.** |

## Recommended architecture

### Production path

1. Claude invokes the configured `aslite hook run` command synchronously for one documented event.
2. The event adapter parses and validates only event-specific fields, calls `CompactionHandoffAuthority`, and maps the returned result to legal hook output. It contains no duplicated lifecycle policy.
3. The authority performs one bounded transaction against the private strict journal using exact project/execution identity, storage versions, CAS, and post-write read-back.
4. PreCompact returns success only after the prepared generation is durably visible at the claimed process-level boundary; otherwise it returns an event-valid block. Compact SessionStart returns context only after delivery CAS and final head recheck; otherwise it returns top-level `continue:false`.
5. No production child continues after the helper returns. If a bounded system helper is needed, the same invocation owns and reaps it before output. There is no queue, detached worker, daemon restart, or late result adoption.
6. `status`, `diagnose`, and health checks do not create journal directories, run GC, recover, start a service, select a fallback generation, or mutate content. GC and recovery remain explicitly named mutating authority operations.

This still satisfies “transient hooks hand work to a durable local authority”: authority durability is the validated journal and replayable state machine across independent invocations. A live process is not durable state. Because PreCompact and SessionStart are synchronous gates, continuing work after their caller dies would be a defect, not resilience.

### Test layers

- **Policy layer:** pure/fake clock, scheduler, transcript, storage, filesystem metadata, and process-result adapters. Exhaustively test state transitions, interruptions, retries, CAS losers, transcript freshness, identity collisions, malformed schemas, fixed expiry, GC races, recovery conflicts, truncation, privacy, and no-side-effect observation.
- **Local integration layer:** real isolated filesystem backend and multiple ordinary foreground processes. Prove locks/CAS/read-back, symlink/mode/owner rejection, process death at write boundaries, temp/orphan handling, and that killed helpers produce no later journal mutation. No detached process is required.
- **Exact Claude host layer:** digest-pinned manual/automatic/subagent compaction and the red paths already named in the design: real PreCompact block, compact SessionStart `continue:false`, missing helper, timeout, exact event order, first-response canaries, truncation, and stable `agent_id`.

A fake scheduler must never be presented as proof of process survival or Claude behavior. A live compaction must never be presented as proof of exhaustive CAS/GC policy. The manifest names which layer proves each assertion.

## Plan requirements that remain intact

- **Exact identity:** retain the full canonical project tuple and full Claude execution tuple, full SHA-256 keys, stored-byte comparison on every transition, and fail-closed collision handling. No host process identity may replace or weaken these keys.
- **CAS and generation safety:** retain generation-addressed history, mutable head, independent storage versions, exact expected-version mutation, loser quarantine/orphan handling, and final head/generation revalidation. A supervisor queue or PID would add no authority.
- **Strict schema:** retain private Head/Handoff kinds, unknown-key rejection, identity/hash/body disagreement rejection, deterministic card/body, bounded output, and content-free receipts. Fake validation should use the exact production validator, not a parallel test schema.
- **GC and expiry:** retain the sole `CompactionHandoffAuthority.gc` owner, fixed seven-day logical expiry, expired-never-inject rule, expected-version detach/delete, bounded 25-record sweep, and event-driven physical cleanup. No daemon or launchd schedule is needed; the design truthfully does not promise deletion if the authority never runs again.
- **Recovery:** retain exact identity plus expected versions, healthy-state refusal, private quarantine, and conflict-no-op behavior. Observation never performs recovery.
- **Host claim:** retain process-level atomicity only, not kernel/power-loss durability, and retain verified-host scoping for Claude behavior.

## Acceptance criteria for the recommendation

1. **No post-return work:** production code contains no detached spawn, queue, daemon IPC, tmux, launchd, or fire-and-forget promise. Every owned helper is bounded, awaited, and reaped. Killing the hook at every storage boundary produces no mutation after process exit.
2. **Exact supported rail:** only SessionStart `source: compact` is load-bearing for compaction restore; resume follows the design's explicit freshness rules. PreCompact/PostCompact are never treated as context-injection surfaces.
3. **Transactional gate:** successfully invoked PreCompact cannot allow compaction before CAS/read-back success; compact SessionStart cannot inject before delivery CAS and final head recheck. Red live tests prove block and `continue:false` on the exact verified host.
4. **Identity invariants:** project/execution tuple bytes, full keys, role derivation, collision rejection, and cross-project/session/subagent isolation pass both fake and true multi-process tests.
5. **Schema and privacy:** the production validator is the only schema authority. All malformed/unknown/over-budget cases fail closed. Status/logs/errors/receipts and privacy scans expose no card, transcript excerpt, canonical path, or raw identity.
6. **CAS/recovery/GC:** interruption and contention tests cover every mutation boundary; fixed expiry never extends on refresh/observation; sole-owner GC and recovery use expected versions; stale/concurrent operations never delete or deliver the winner.
7. **Side-effect-free observation:** instrumented adapters prove `status`, `diagnose`, and content-free health perform zero journal writes, zero GC/recovery calls, zero hook-setting edits, and zero service/process starts. Missing state remains missing.
8. **Layered evidence:** every acceptance claim identifies policy-fake, filesystem integration, or exact-host evidence. No historical tmux result or fake scheduler is allowed to stand in for a Claude live gate.
9. **Digest lock:** review, QA, negative rail tests, and all live journeys use one manifest digest covering source/package/helper/harness and the exact Claude host tuple. Any drift restarts the applicable chain.
10. **Scope check:** no general supervisor, background scheduler, auth/network, shared-bundle handoff, or scheduled-deletion claim enters revision 3. If later work genuinely must outlive hook invocation, reopen architecture explicitly; the preferred durable-service alternative would be a purpose-built protocol under launchd, with its own request-fencing and installation acceptance—not raw detachment or tmux.

## Disagreements and residual risks

- **“Durable authority” terminology:** some readers may equate durable with resident. The design should say explicitly that durability means journal-backed validated state across invocations. If the intended workload is actually a long-running job rather than a compaction card transaction, this recommendation no longer applies and the product requirement must change first.
- **Late-commit risk is decisive:** a supervisor can survive the hook, but without caller-death fencing it may publish a generation after Claude has treated the hook as failed. Solving that adds request leases/epochs/cancellation and expands the lifecycle authority. Current synchronous semantics avoid the class entirely.
- **Fake confidence:** the fake adapter makes hard policy paths cheap but can diverge from real filesystem or Claude behavior. Shared production validators and mandatory exact-host gates are required.
- **Historical tmux evidence:** reuse is safe only for an unchanged, explicitly named tmux fact on the exact recorded bytes/host. It should not remain in the critical-path acceptance matrix if the recommended production architecture has no tmux dependency.
- **Event-driven GC:** physical expired bytes may remain forever on an abandoned host. This is already an honest nonclaim; launchd should not be introduced merely to turn retention hygiene into a resident service.
- **Invocation kill boundary:** no process can report a failure after the host kills it. Readiness and negative host tests must continue to characterize this boundary; internal code must not overclaim it.

## Result Envelope

Recommendation: **host-policy separation with a synchronous invocation-scoped authority and private CAS journal; no resident process.**

Current identity/CAS/GC/schema requirements: **retain unchanged.**

Production use of direct detachment, resident supervisor, launchd, or tmux: **not recommended for revision 3.**

Audited v5 tmux evidence: **historical narrow-fact reuse only; never rail or authority proof.**

[tracked by](../tasks/pre-compact-multi-session.md)
