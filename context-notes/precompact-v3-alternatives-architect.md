---
type: Context Note
title: Revision 3 tmux-independent alternatives architecture
actor: codex-precompact-v3-alternatives-architect
timestamp: '2026-08-04T02:35:39.754Z'
---
# Summary

Fresh architecture review recommends D-plus-E: reuse audited v5 tmux evidence for established host facts, isolate lifecycle policy behind a fake scheduler/process adapter, and add only minimal real-host conformance tests.

# Revision 3 alternatives architecture review

status: complete
recommendation: D-plus-E — reuse audited v5 tmux host evidence only for already-proven negative query/no-autostart facts; isolate remaining lifecycle policy behind a fake scheduler/process adapter, with a small real-host smoke layer for only necessary primitives. Do not build a new supervisor until product requirements demand long-lived ownership.

## Product invariants vs tmux-specific assumptions

Product invariants: transient hook hands off to one durable local authority; exact full session identity; create-only handoff record; CAS-guarded consume; leases/expiry and named GC owner; cleanup/recovery observable and idempotent; observation is read-only and cannot create/destroy work; SessionStart(source=compact) is the supported restore rail; schema/version validation and provenance are explicit.

Tmux-specific assumptions: server/socket/client lifecycle, `tmux -N` negative query, tmux PID receipts, `kill-server`, tmux socket generations, and ps-based tmux discovery. These are host evidence, not product semantics. PID/PGID identity and detached-process behavior are also host-primitive facts, not the handoff contract.

## Alternatives matrix

| Strategy | Proves | Cannot prove | Failure/orphan containment | External state/permissions | Portability | SessionStart fit | Cost | Exact identity/CAS/GC/schema |
|---|---|---|---|---|---|---|---|---|
| A. Direct detached process + pipes/PID/PGID | Basic spawn, pipe closure, exit/EOF, process-group signal on cooperative hosts | Durable authority across crashes; PID reuse; daemonization outside group; robust reaping; cross-session CAS | Orphans likely on parent crash or double-fork; cleanup is best-effort unless PID/PGID provenance is exact | Process table, pipes, signals; same-UID usually enough, but races and permissions vary | Unix-like; weak on Windows and launch semantics | Hook can enqueue a record, but later SessionStart must discover/reconcile an external process safely | Low initial, high edge-case hardening | Policy can meet criteria only with a separate durable store/authority; host process alone is insufficient |
| B. Purpose-built local supervisor | One owned child tree, leases, durable registry, reaping/restart, explicit observation-vs-action boundary | OS-wide guarantees after supervisor kill/host reboot unless supervisor itself is supervised; no proof that Claude rail invokes it correctly | Best containment: supervisor owns process groups, journals state, reconciles unknowns; still needs crash-safe WAL/CAS and stale-owner recovery | Local socket/lock/state dir; daemon permissions and install/lifecycle burden | Portable across Unix with adapter; Windows needs implementation | Strong: hook submits exact identity, SessionStart queries/resumes by ID; supervisor is the authority | Medium-high; design, daemon lifecycle, tests, packaging | Yes, if registry uses exact identity, CAS consume, named GC, schema and observable receipts |
| C. macOS launchd | OS-managed restart/keepalive, boot/session launch, service ownership | Exact per-handoff child identity and transactional consume; portable semantics; arbitrary cleanup of unregistered descendants | launchd contains registered jobs, but misdeclared jobs/orphans can persist; unload/kill semantics require privileged/label-aware control | Plists, launchctl state, user/system domains; macOS permissions and installation | macOS-only | Hook integration indirect; SessionStart must address labels/instance IDs, increasing ambiguity | High operational cost for transient handoffs; low runtime once installed | Possible but awkward; must layer a CAS registry and per-instance labels; schema/GC remain app policy |
| D. Reuse audited v5 tmux evidence + fresh lifecycle facts | Existing exact host evidence for no-autostart/explicit argv, group teardown, stale socket, protected state; fresh tests can target policy seam | Does not prove tmux is product authority; cannot close rejected anomalous daemonization trace; no new supervisor semantics | Reuses known bounded evidence; avoids reopening unsafe negative query; residual lifecycle failures handled by policy adapter and fail-closed reconciliation | tmux/socket/process state only in already-audited evidence; no new permissions | Host evidence is Darwin/tmux-specific, but policy layer portable | Good if hook/SessionStart use registry, not tmux; tmux remains test fixture/instrument | Lowest incremental cost; preserves accepted evidence | Yes when exact identity/CAS/GC/schema are implemented outside tmux; tmux alone no |
| E. Host primitives separate from lifecycle policy; fake scheduler/process adapter | Deterministic CAS, leases, reconciliation, observation non-mutation, exact identity, GC and schema state machine; contract tests independent of host | Real signal/pipe/daemon behavior, kernel PID reuse, launchd/tmux quirks; requires a thin real-host conformance suite | Fake adapter models orphan/error classes; production adapter must fail closed and expose recovery; no accidental cleanup in observers | Minimal in tests; production adapter defines host permissions explicitly | Highest portability; adapters per host | Excellent: SessionStart exercises real registry/policy; host adapter is replaceable and bounded | Medium upfront, lowest long-term iteration cost | Yes—best fit for all app-level criteria, with host-specific criteria tested separately |

## Recommendation

Adopt D-plus-E. Treat the audited v5 tmux package as frozen evidence for tmux-specific facts already established, explicitly exclude the rejected absent-query containment obligation, and build/validate lifecycle policy against a fake scheduler/process adapter first. Add a narrow real-host adapter conformance suite only for spawn/pipe/PGID/exit and receipt semantics that the product actually relies on. Reconsider B only if requirements expand to long-lived background ownership, automatic restart, or multi-client supervision; launchd is a platform deployment option, not the core contract.

## Acceptance criteria and next steps

1. Define a versioned handoff schema containing full session identity, owner, state, lease, timestamps, provenance, and CAS version; duplicate create is idempotent and mismatched consume fails closed.
2. Implement policy tests with fake scheduler/process adapter: hook handoff, exact lookup from compact SessionStart, consume CAS, lease expiry, named GC, crash/restart reconciliation, orphan classification, and observation-only nonmutation.
3. Specify adapter contract: every action has an exact receipt, bounded timeout, closed pipes, reaped child/PGID where applicable, and explicit unknown outcome; observers cannot signal, unlink, or create records.
4. Run only the minimal host conformance tests needed by that contract; cite v5 evidence for tmux negative-query/no-autostart instead of rerunning R6. Any new host primitive requires separate containment review.
5. Exercise manual and automatic compaction acceptance through the real Claude SessionStart(source=compact) rail; verify exact identity resume and no duplicate work.
6. Instrument recovery/GC so orphaned or ambiguous principals are visible, retryable by named owner, and never silently deleted.

## Assumptions challenged

- tmux is an implementation requirement (false; it is evidence/instrument).
- A bounded probe can safely prove a negative query that may daemonize outside its handles (false without an external containment envelope).
- PID/PGID is durable identity (false; only a receipt component with provenance and reuse checks).
- Observation can clean up safely (false; observation must be read-only).
- launchd automatically solves exact handoff semantics (false; it supplies service ownership, not CAS/session identity).
