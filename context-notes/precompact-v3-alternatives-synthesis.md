---
type: Context Note
title: Revision 3 alternatives synthesis — synchronous authority plus layered proof
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-04T02:41:20.347Z'
---
# Summary

Three independent roles converged on a reframed revision-3 architecture. Do not resume the tmux-specific R6 probe loop. Treat tmux as historical host evidence only, and separate lifecycle policy from host-process mechanics.

# Decision

Use a synchronous, invocation-scoped `CompactionHandoffAuthority` backed by the private CAS journal. The default product claim is cognitive durability: a later session can resume an exact handoff from bundle-backed state. It is not execution durability: an arbitrary computation continuing after the hook exits.

Production revision 3 must not launch detached/fire-and-forget work, a resident daemon, launchd service, or tmux authority. If uninterrupted computation later becomes an explicit requirement, reopen that as a separate architecture decision for a purpose-built supervisor with leases, epochs, cancellation, IPC, and its own acceptance plan.

# Why this resolves the blocker

The rejected tmux probe tried to prove both lifecycle policy and a dangerous negative host behavior (`tmux -N` must not create a server) in one self-contained experiment. Its failure branch could create a detached server outside the remaining termination envelope. Removing that fresh negative-query obligation avoids manufacturing a new orphan-containment architecture merely to retest an already audited host fact.

The v5 exact-host evidence remains valid for the narrow facts it actually proved: explicit Node-to-tmux execution, no-autostart behavior on that installed tuple, process-group observations, stale-socket handling, and protected-state continuity. It does not prove the Claude rail, production authority, CAS, leases, GC, or live compaction acceptance.

# Layered proof model

1. **Policy layer (fake scheduler/process adapter):** deterministic handoff, full project/execution identity, create-only records, head/generation CAS, consume conflict rejection, fixed logical expiry, sole event-driven GC owner, expected-version recovery/quarantine, strict schema, bounded evidence, and observation-only nonmutation.
2. **Filesystem integration:** private 0700 journal, permissions, atomic writes, CAS/readback, crash/restart reconciliation, and content/privacy bounds.
3. **Exact host layer:** only the host behaviors the policy contract actually relies on—bounded synchronous helper invocation, pipe/EOF/exit semantics, process identity/absence where applicable, and the installed Claude hook schema/order/`continue:false` behavior.
4. **Real Claude acceptance:** installed-version manual and automatic compaction, with SessionStart(source=compact) as the supported restoration rail; verify exact identity resume, no duplicate work, PreCompact CAS/readback, compact delivery CAS/final-head recheck, and safe block behavior.

# Acceptance gates before implementation resumes

- Revise the T3.5 boundary and Plan to remove fresh R6 negative-query/no-autostart execution and cite the exact v5 evidence with explicit nonclaims.
- Write one executable authority contract for the invocation-scoped handoff path; no convention split across shell and prose.
- Add fake-adapter tests for CAS consume, expiry/GC, crash/restart, orphan classification, replay, schema, and observer nonmutation.
- Add filesystem tests for permissions, atomicity, readback, corruption/quarantine, and privacy.
- Add exact installed-Claude tests for SessionStart(source=compact), manual compaction, automatic compaction, first-response restoration, and no duplicate handoff.
- Keep evidence layered and digest-linked: each claim names whether it is fake-policy, filesystem, exact-host, or real-Claude evidence.
- Preserve full identity, collision rejection, named GC owner, strict schema, version-guarded recovery, and privacy/content bounds.

# Alternatives disposition

- Direct detached processes: useful only as a narrow adapter/fixture; weak as production authority because of orphan, PID reuse, cancellation, and late-commit hazards.
- Purpose-built supervisor: conditional future option if uninterrupted work is explicitly required; strongest ownership but substantial IPC/lease/restart surface.
- launchd: optional macOS deployment wrapper, not the app contract; adds global/platform state and does not provide CAS or application identity.
- Fresh tmux probe: rejected for this negative-query obligation; reuse audited v5 facts only.
- Fake scheduler/process adapter plus narrow real-host conformance: selected path; best separation of deterministic policy proof from host variability.

# Exact independent inputs

- Architect: `context-notes/precompact-v3-alternatives-architect@sha256:8e9a8dfee80b0cfbd0e8e762460b2de8b8ef0b7e14e59098a5e4e0579250cb55`.
- Product acceptance: `context-notes/precompact-v3-alternatives-acceptance@sha256:897489c7019480fd1adf1dfb7dcf60c2fc8594cec9db848c635715ffa651701e`.
- Skeptic: `context-notes/precompact-v3-alternatives-skeptic@sha256:97a15981837f63d2576f48f11673e2378c71ed1ee1672c71b8ba5d954bf43546`.
- Circuit breaker preserved as historical evidence: `context-notes/precompact-v3-t35-r6-host-probe-circuit-breaker`.
