---
type: Context Note
title: Revision 3 T0 feedback-harness builder
actor: codex-precompact-v3-t0-builder
timestamp: '2026-08-03T18:47:42.760Z'
---
# Summary

T0 QA-infrastructure builder orientation for revision-3 compaction handoffs.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: freeze deterministic fixtures, injectable seams, process fault harnesses, and an isolated live-harness contract before the production authority or hook adapter is built; this serves the ultimate goal by making the high-risk session-boundary behavior reproducible and independently attackable instead of dependent on operator intuition.

## Accepted boundary

Work is confined to `/private/tmp/aslite-precompact-v3.RLDTIZ/repo` on `feat/precompact-handoff-v3` and to T0 test/support files. The accepted inputs are design `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`, plan `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`, and plan-gate review `sha256:f7c065ab383568a968564b84406df2a056b9bb42489dc88ec5462e4db32cc3c3`.

T0 will add exact observed event/transcript fixtures, typed dependency contracts, deterministic store/process/killpoint support, foreign-hook preservation goldens, controlled rejected-design probes, and an opt-in `/private/tmp` live-harness skeleton. It will not implement handoff identity, extraction, persistence, lifecycle transitions, hook output mapping, hook installation, readiness, or recovery behavior.

## System model and test oracle

The installed-host order is `PreCompact -> SessionStart(source=compact) -> PostCompact -> first response -> Stop`; PreCompact may run even when compaction is declined. Therefore T0 treats PreCompact preparation and SessionStart restore as load-bearing and PostCompact/Stop as audit/observation boundaries. Project plus full execution identity, generation-addressed retention, CAS/read-back, fixed expiry, exact-version recovery, bounded provenance cards, content-free diagnostics, structural hook ownership, and one candidate digest are explicit future contracts.

Default tests must be deterministic, offline, and confined to temporary roots. Host behavior that requires Claude, auth, a PTY, or real compaction remains opt-in and must abort unless a fresh exact `/private/tmp` root and fresh configuration/journal/project paths are established. Rejected-revision probes are expected to characterize old behavior while marking future contract tests as skipped until T1/T2; default CI may not be intentionally red.

## Phase-end outcome

T0 is implemented as test-only infrastructure under `packages/cli/test`; no production `src` file changed. It adds:

- shape-exact, value-sanitized payload fixtures for installed Claude 2.1.220 PreCompact, SessionStart startup/resume/compact, PostCompact, and Stop events; the SubagentStop fixture is explicitly contract-derived and unverified until L3;
- main/subagent/project-mismatch/malformed/control/oversized JSONL fixtures plus the eight-slot evidence-card and exact 7,999/8,000/8,001-character boundary table;
- injectable clock, UUID, journal-root, project-resolution, transcript-checkpoint, helper-runner, and receipt-validation contracts;
- a generic core-backed true cross-process CAS/killpoint driver, with executable proofs of one-winner head CAS, kill-after-generation orphan publication, and stale exact-version recovery refusal;
- the exact installed foreign SessionStart `printf` golden, with user home paths sanitized in non-load-bearing legacy script fixtures;
- closed store/fault/rejected-design tables and an opt-in red lane covering all thirteen accepted revision-3 defect classes;
- an opt-in live-harness skeleton that refuses without an explicit environment switch, creates only fresh 0700 roots below `/private/tmp/aslite-handoff-live.*`, separates Claude config/project/bundle/journal/manifest paths, inventories writes, and preflights PTY/auth/pinned executable without printing credentials.

Focused evidence after the final change: 27 tests, 14 pass, 0 fail, 13 deliberately skipped red contracts. With `AGENTSTATE_LITE_RUN_HANDOFF_RED_CONTRACTS=1`, the rejected lane exits 1 and all thirteen contracts fail by name. A full CLI-suite attempt reached only pre-existing listener-dependent failures (`listen EPERM 127.0.0.1`) in remote/View tests under this sandbox and then remained open; it was interrupted. No T0-named test failed in that log. The plan already requires the repository gate with listener permission at G0.

Next action: commit this test-only T0 unit and return its exact SHA to the orchestrator for interface review/freeze before T1/T2.

## Unverified assumptions

- The current test loader accepts additional support modules under `packages/cli/test/support` without build-system changes.
- Existing core/CLI process helpers can be reused without exposing a second CAS engine.
- Exact live payload fields captured in the prior probe are recoverable from the private temporary evidence or can be represented from the recorded installed-host shapes without inventing undocumented fields.
- Opt-in live commands can be staged as a skeleton without invoking Claude or touching user-global state during T0.

These assumptions are now proved for the test loader, existing core CAS reuse, and isolated skeleton. Live SubagentStop payload shape and every real negative/compaction host response remain deliberately unproved and are gated at L0/L3. Production authority, adapter, managed-hook transformations, readiness, and live execution remain deferred to T1/T2 and the post-review live gates.
