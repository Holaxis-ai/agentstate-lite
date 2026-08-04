---
type: Context Note
title: Revision 3 alternatives skeptic review
actor: codex-precompact-v3-alternatives-skeptic
timestamp: '2026-08-04T02:38:14.814Z'
---
# Summary

Status: complete; independent read-only alternatives review.

Verdict: **REFRAME AND PROCEED CONDITIONALLY**. Confidence: **0.93**.

Recommendation: prove the installed Claude `SessionStart`/`source:"compact"` context-injection rail first with an inert, side-effect-free acceptance fixture. In parallel, specify and test lifecycle policy against a fake scheduler/process adapter. Default Revision 3 to a **resumable bundle-backed handoff with no always-on daemon** unless the product owner explicitly requires uninterrupted computation during compaction. If uninterrupted computation is required, use a small purpose-built supervisor started and owned outside the hook; keep launchd as an opt-in installation adapter, not the core authority. Do not resume tmux-specific work unless tmux is deliberately selected as that executor.

The solution frame must distinguish two durability claims:

1. **Cognitive durability:** exact work state survives context loss and a later session can claim/resume it safely. The existing product—plain-text bundle, CAS, attribution, and SessionStart hook—is structurally suited to this.
2. **Execution durability:** a live computation continues while no Claude session owns it. This requires an OS process authority, recovery protocol, local-only identity, and cleanup owner. It is a separate feature and is not implied by “multi-session memory.”

Building a supervisor to solve the first claim would add non-load-bearing infrastructure to the frozen product surface. Treating a PID file or tmux socket as proof of the second claim would under-build it. The rail is load-bearing for both and cannot be accepted by mocks, a detached-process probe, or old tmux evidence.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: select the smallest evidence and execution architecture that proves safe Claude compaction handoff without confusing durable knowledge with durable processes; this serves the ultimate goal by keeping host-service complexity outside the core unless it is genuinely load-bearing.

## Result Envelope

```yaml
result:
  status: complete
  verdict: REFRAME_AND_PROCEED_CONDITIONALLY
  confidence: 0.93
  recommendation:
    phase_1: installed-host inert SessionStart source=compact rail acceptance
    phase_2: bundle lifecycle authority tested with fake scheduler/process adapter
    default_executor: none; later session resumes exact bundle-backed attempt
    conditional_executor: explicit purpose-built supervisor if uninterrupted computation is required
    optional_platform_adapter: launchd, only after supervisor semantics pass
    rejected_as_default:
      - ordinary detached process
      - launchd-owned core lifecycle
      - tmux selected solely because v5 evidence exists
  live_compaction_required: true
  implementation_authorized: false
  execution_authorized: false
  inputs:
    decision: context-notes/precompact-v3-alternatives-review-decision@sha256:30dfc33f4760ac65bef7beaaa91f81443f19e19a78c5f097d881565e1776c011
    core: docs/core@sha256:58aacb19861269bf27bd73d1ff9abcdfe1c2eaab085e1fcdfb73b146afa2f595
  note: context-notes/precompact-v3-alternatives-skeptic
```

## Review boundary and independence

I read the exact decision artifact and `docs/core` in full. I did not read or contact the new architect or product reviewer. I did not inspect implementation source, run probes/tests/child modes, invoke tmux or Claude, use auth/network, or mutate repository code, Plan, or tasks.

## The frame to challenge first

The stated outcome says a transient hook hands work to a “durable local authority.” That phrase hides the largest decision. The authority can be:

- a durable **record and CAS transition** that a later session interprets; or
- a durable **process** that continues executing and owns children.

Those are not interchangeable. A record survives process death, reboot, logout, and binary upgrade but does no work. A process can continue work but is host-local, version-sensitive, permission-sensitive, and eventually dies. Cross-session correctness must therefore be anchored in logical work identity and durable records even if a supervisor is later added.

Minimum logical identity is not PID/PGID. It is a tuple such as:

```text
workspace_id + handoff_id + attempt_generation + expected_document_version
```

Host-local execution identity may be attached as evidence:

```text
host_id + boot_epoch + pid + start_time + uid + pgid + binary_digest + private_nonce
```

It must never replace the logical identity, and host-local liveness records must not become live merely because Git synced them to another machine.

## Strategy comparison

### 1. Ordinary detached processes with pipes/PID/PGID

What it can prove:

- the current host can detach an exact child from the launching hook/session;
- closed stdio, process-group separation, exact command/environment, and self-recording can be observed;
- a later process can sometimes rediscover an exact still-running attempt.

Strongest counterarguments:

- A pipe owned by the transient hook is not a cross-session authority. Once its reader/writer dies, a later session cannot inherit that capability.
- `detached`, `setsid`, PID, and PGID do not promise survival across logout, reboot, app termination policy, sleep, or an outer harness that kills descendants.
- The later session has no original child handle. PID/start/UID/PGID observation is sampled, platform-specific, and fail-closed on ambiguity. A PID file alone is unsafe.
- If the creating session crashes after spawn but before durable registration, the process exists without a discoverable logical owner. If it registers first but spawn fails, the record exists without a process. Both need reconciliation.
- Orphan cleanup has no natural owner. Self-expiry helps but does not prove work completion, and wall-clock leases drift across sleep/reboot.
- Observation commands must be strictly read-only; “status” cannot silently respawn a missing worker.

Fit: acceptable as a narrow, replaceable process adapter or short-lived acceptance fixture. Reject as the durable authority.

### 2. Purpose-built local supervisor

What it can prove:

- one process owns and reaps a bounded child tree;
- stable local IPC can separate transient hook/session lifetime from worker lifetime;
- crash recovery, idempotent submission, cancellation, and exact attempt ownership can be centralized;
- observation can be separated from mutation by protocol.

Strongest counterarguments:

- If the hook starts the supervisor, the bootstrap has the same detach/orphan race as option 1. A durable authority must already exist or be started by an explicit installation/start command outside the observation path.
- A socket path is not identity. Require private-root ownership/mode, server nonce, protocol version, executable digest, boot epoch, and a challenge/response bound to the expected supervisor instance.
- Singleton creation needs atomic lock/create semantics and stale-lock recovery; concurrent Claude sessions must not start competing supervisors.
- The supervisor's durable ledger, the bundle's CAS state, and child reality can disagree at every crash point. One executable lifecycle authority must reconcile them; shell convention plus prose is insufficient.
- Upgrade/restart changes authority identity. Old workers must not complete newer attempts, and new code must reject incompatible persisted protocol state.
- An always-on daemon, IPC protocol, install/update/uninstall path, logs, retention, and GC are significant scope relative to the one-page core.

Fit: best executor if uninterrupted work is an explicit requirement and recurring enough to justify infrastructure. Start explicitly; SessionStart should connect/claim/read, never implicitly install or daemonize.

### 3. macOS launchd

What it can prove:

- the OS can own, restart, and reap a declared user agent;
- explicit labels and service configuration can provide a stable bootstrap outside Claude;
- service logs and exit policy can be platform-managed.

Strongest counterarguments:

- A LaunchAgent is tied to the user login domain; survival across logout, reboot, GUI/SSH domains, and sleep must be stated and tested rather than assumed.
- Installation creates external state outside the repo. Plist location, label collisions, bootstrap/bootout, permissions, environment, cwd, logs, code updates, and uninstall become product obligations.
- KeepAlive or socket activation can turn observation into creation. A status check may start the service, violating the no-side-effect observer invariant.
- launchd's label/service identity does not by itself bind the exact executable digest, bundle workspace, logical attempt generation, or child ownership.
- It is macOS-specific while the core is local-first CLI infrastructure. Making it the authority would couple the product's semantics to one host.
- User-level launchd avoids root in the ordinary case, but managed machines may restrict it. Permission failure needs a supported non-launchd path.

Fit: optional deployment adapter for a supervisor whose semantics already pass independently. Reject as the lifecycle model and as a Revision 3 prerequisite.

### 4. Reuse audited v5 tmux evidence

What it can prove without rerunning:

- only the exact host/tool/vector facts retained in that evidence, on the exact pinned versions and assumptions;
- possibly process/group/socket behaviors already independently audited.

Strongest counterarguments:

- tmux evidence does not prove the Claude hook fires, receives the documented installed schema, or injects context after manual/automatic compaction.
- It does not prove bundle CAS, duplicate SessionStart idempotency, logical attempt generation, stale-result rejection, GC, or cross-machine semantics.
- Evidence is not portable across tmux/Node/macOS version drift. Every claimed reuse needs an exact environment tuple and expiry rule.
- Selecting tmux because evidence exists reverses the decision: the executor should follow product requirements, not sunk-cost evidence.
- tmux observation commands may create servers unless the exact negative behavior remains pinned; this is an especially poor fit for “observation does not create work.”
- A tmux socket/server is host-local external state and adds a dependency that the one-page core does not require.

Fit: retain as historical primitive evidence and reuse individual facts only when exact tuples match. Do not treat it as SessionStart or lifecycle acceptance. Do not resume the rejected probe unless tmux is selected for a new, explicit reason.

### 5. Host-policy separation with fake scheduler/process adapter

What it can prove:

- exact lifecycle transitions and CAS preconditions;
- duplicate/reordered SessionStart delivery;
- concurrent sessions claiming one handoff;
- crash points before/after spawn/register/complete/promote;
- stale worker completion rejection;
- lease/expiry interpretation, retry generation, cancellation, and named GC ownership;
- observation-versus-mutation API separation;
- deterministic cleanup/reconciliation decisions for every adapter result.

Strongest counterarguments:

- A fake scheduler proves policy given adapter facts, not the truth of those facts.
- It cannot prove process survival, signal delivery, reaping, PID identity, permissions, socket safety, sleep/reboot behavior, or launchd/tmux semantics.
- It cannot prove Claude invokes the hook or accepts its output schema. Feeding a recorded JSON fixture to the handler is only a unit test.
- If the fake's state vocabulary diverges from the production adapter, it becomes a second authority and tests an imaginary system.

Fit: recommended foundation. Use one production lifecycle function over a narrow adapter interface; the fake and host adapter supply facts but do not independently decide state or verdicts.

## What can be proven without live compaction

The following are static/unit/integration obligations and do not require a real context compaction:

- exact accepted/rejected hook-input schema in the handler, including `source === "compact"`;
- one executable lifecycle authority shared by hook and CLI entrypoints;
- logical identity construction and workspace binding;
- CAS-guarded claim/consume/promote and stale-attempt rejection;
- idempotency under duplicate, reordered, or concurrent SessionStart calls;
- crash matrices for every durable-write/process-adapter ordering;
- fake-adapter lifecycle, retry, expiry, cancellation, and reconciliation behavior;
- observer purity: list/status/read do not spawn, claim, cancel, GC, unlink, or signal;
- named GC owner, retention rules, and exact local-run-directory ownership;
- symlink/type/mode/UID/link-count checks for private host state;
- host-local records excluded from portable/synced liveness authority;
- output construction contains only the documented hook response fields;
- no auth/network/global-home fallback and bounded evidence/logging;
- exact source/config/settings bytes, installation paths, and deterministic rendering.

Documentation or a mocked hook event can prove the code is prepared for a schema. It cannot prove that the installed Claude version emits or consumes it.

## What requires installed-host acceptance

These are hard gates and cannot be delegated to an internal subagent or inferred from unit tests:

1. The installed Claude Code version invokes `SessionStart` for both manual and automatic compaction with `source:"compact"`.
2. Exact stdin fields, cwd/environment, session/workspace identifiers, ordering, timeout, exit-code handling, and repeated-compaction behavior match the implemented contract.
3. The exact supported stdout response injects a unique sentinel into the resumed model's context; schema errors or ignored fields are FAIL.
4. Two simultaneous sessions in one workspace receive/claim only their intended handoffs and duplicates remain idempotent.
5. A real handoff record written before compaction is found, CAS-consumed, rendered, and linked to the resumed logical attempt after compaction.
6. Hook failure, malformed state, stale generation, and missing authority fail visibly without starting or destroying work.
7. If a host executor is selected: exact survival across compaction and parent exit, reconnect, crash/restart, timeout, cleanup, permissions, identity, version drift, and no-create observation on the installed host.
8. Manual and automatic compaction both pass retained-evidence review. One does not stand in for the other.

The rail test should be first because every process architecture is wasted if installed Claude rejects or ignores the context-injection surface.

## Recommended Revision 3 path

### Phase A — rail acceptance before lifecycle implementation

Use the smallest inert fixture: on `SessionStart` with `source:"compact"`, read one pre-created immutable sentinel from an exact private/test path and return only the documented context field. It must not spawn, claim, update, delete, signal, or start a daemon. Retain raw hook stdin/stdout/stderr/exit/timing plus resumed-context evidence. Run manual and automatic compaction on the installed version. Failure blocks Revision 3; it does not trigger another executor redesign.

### Phase B — durable logical handoff

Implement one lifecycle authority over the bundle/CAS substrate with a fake adapter first. Treat a handoff as an exact logical attempt, not a process. SessionStart compact performs only the explicitly authorized CAS consume/claim and context rendering. Duplicate events return the same result or a declared already-consumed result; they never create another attempt. Stale workers cannot write/promote over a newer generation. Name the reconciler/GC owner and make observation read-only.

Default to **resume**: after compaction, the later session continues the claimed attempt from durable state. This directly serves the core product and requires no daemon.

### Phase C — executor only if uninterrupted computation is required

Write an explicit acceptance statement first: “work must continue while no Claude session owns it, across [context compaction / parent exit / logout / reboot].” The bracketed durability horizon selects the mechanism.

- For compaction/parent-exit only, a purpose-built supervisor with explicit start/stop and private IPC is the preferred portable architecture.
- Add launchd only if automatic restart/login-domain ownership is required; it wraps the supervisor and does not define lifecycle policy.
- Use tmux only if it wins a fresh dependency/operability decision; then reuse matching v5 evidence and test only missing facts.
- Ordinary detached processes remain an adapter/fixture, not authority.

The hook must never install or silently start the executor. If absent, it reports an exact recoverable state; an explicit user/CLI action starts or repairs it.

## Acceptance criteria for the selected design

1. **Purpose:** the design explicitly chooses resumable state or uninterrupted execution and names its durability horizon.
2. **Rail:** manual and automatic installed-host compaction inject the exact sentinel/context through supported `SessionStart source=compact` output.
3. **Identity:** logical workspace/handoff/generation/version identity is authoritative; process identity is host-local evidence only.
4. **Concurrency:** two sessions, duplicate hooks, stale completions, and promote collisions are CAS-safe and deterministic.
5. **Authority:** hook and CLI call one lifecycle implementation; fake/host adapters do not duplicate policy.
6. **Observation:** status/read operations are side-effect free; absence never silently creates an executor or work attempt.
7. **Crash recovery:** every write/spawn/complete ordering has an explicit next action and stale attempts cannot mutate current state.
8. **Cleanup:** exact owner, recovery path, hard lifetime, private paths, safe ambiguity behavior, and named GC/reconciler exist for jobs and host artifacts.
9. **Portability:** host-local PID/socket/launchd state is not treated as portable liveness after Git sync or reboot; host/boot/version mismatch forces reconciliation.
10. **Permissions:** ordinary same-user operation, modes/ownership/symlink defenses, install/uninstall behavior, and managed-host denial are tested for any executor.
11. **Evidence reuse:** v5 facts are cited only with exact tool/host/vector tuple and freshness; they never substitute for SessionStart acceptance.
12. **Scope:** no supervisor/launchd/tmux dependency enters core unless uninterrupted work is explicitly load-bearing under the core artifact test.
13. **Installed host:** selected executor semantics and both compaction modes pass retained-evidence audit on the installed versions.
14. **Failure verdict:** schema mismatch, ignored context, identity ambiguity, authority absence, reconciliation conflict, cleanup uncertainty, or bound exhaustion is FAIL—not a shippable caveat.

## Final recommendation

Do not choose among process technologies yet. First prove the real SessionStart compact rail with an inert fixture. Then build the logical handoff against a fake adapter and default to session-resumed work. Escalate to a purpose-built supervisor only after uninterrupted computation is written as an explicit product requirement. Keep launchd optional and tmux evidence historical unless their specific durability horizons are chosen.

This path minimizes external state, aligns with the one-page core, and prevents another cycle in which well-tested process pieces surround an untested load-bearing Claude rail.
