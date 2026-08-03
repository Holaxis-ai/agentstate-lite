---
type: Context Note
title: 'Revision 3 orientation and domain model: compaction handoffs'
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T23:00:48.885Z'
---
# Summary

Revision 3 reorientation after a Codex context boundary on 2026-08-03.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: exact-host-prove and independently accept the T3.5 launch/reap subsystem before synthesizing a replacement candidate/live-acceptance plan; this serves the ultimate goal by preventing an unverified lifecycle rail from being promoted into shared compaction memory infrastructure.

Loaded skills: holaxis-self-awareness, holaxis-cognitive-ecosystem, agentstate-lite, and holaxis-orchestrator. The active orchestration pattern is a Dynamic-DAG circuit breaker feeding a differentiated architect/product-acceptance/skeptic dialectic, followed by Generator-Critic review. No T3.5 code starts before exact Plan PASS.

## Current whole-system model

The production pilot has five interacting components: Claude Code emits lifecycle events; one managed `aslite hook run` adapter parses and maps event-valid JSON; a private `CompactionHandoffAuthority` owns exact execution identity, extraction, validation, state transitions, and receipts; a host-local 0700 journal stores content outside the project bundle; and isolated automated/live harnesses prove one immutable packed candidate. The installed-host order already observed is `PreCompact -> SessionStart(source=compact) -> PostCompact -> first model response -> Stop`. SessionStart is the only load-bearing restore point, PreCompact prepares the handoff, and PostCompact is audit-only.

The implementation through T4 is accepted at feature HEAD `36c741a8173832d75d61a7ab138b5219c4415c66` in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`. It provides canonical project identity plus full `(runtime, session_id, agent_id|null)` identity, generation-addressed journal records selected by a CAS head, strict schemas, bounded evidence cards, logical expiry with event-driven GC, structural managed-hook ownership, authority-owned journal readiness, and source-owned documentation. No production source has been changed since T4.

The unimplemented T3.5 layer must create and bind one packed candidate, install that exact artifact into isolated lanes, operate real Claude/tmux journeys without touching global auth or configuration, and carry challenge-bound evidence through Review, QA, negative rail, manual main, automatic main, and real sub-agent acceptance. One executable candidate authority, rather than prose split across scripts, must own freeze, validation, campaign ledger, immutable manifest/tree checks, and postflight continuity.

Four T3.5 plans failed independent review. R4's static candidate, deterministic sequential PreCompact fault wrapper, CAS campaign ledger, challenge-bound R0/Q0 assertions, serial L0, auth-tree possession, npm lifecycle validation, and exact fresh-generation checks survived. Its launch/reap subsystem did not: cleanup could publish completion while a live or already-spawned launcher later bound the reserved tmux socket. Its Darwin ps grammar also rejected valid rows with no leading PID whitespace.

The circuit-breaker research converges conditionally on a private no-auth broker whose durable state is visible while a release gate is closed; release and reap are mutually exclusive; a secret is delivered only over an anonymous pipe after durable release; Node 25 `process.execve` replaces the broker with foreground tmux; a separately fenced `tmux -N` client creates the session without server autostart; and cleanup proves creator and descendants absent before stable socket absence. The skeptic correctly retains a Darwin PID/start-to-signal TOCTOU: sampled identity plus `kill` is not an atomic pidfd-like guarantee and must not be described as one.

Ordering and external-state invariants are therefore load-bearing: no auth-bearing spawn before durable release; no cleaner may publish completion while any launch principal can still create or bind; the session client is a separately identified launch principal; the control pipe closes before exec; no unexpected process escapes the owned cleanup set; socket absence is terminal only after creator/descendant absence; all protected repo/global sentinels remain byte-identical; and no API key, Claude process, or global auth/config is involved in the primitive probe.

## Probe evidence and model updates

The exact-host no-auth probe runs only under fresh private temporary roots with sanitized environment, private HOME/TMP, 0600 evidence, nonsecret canaries, and protected-state snapshots. Node is v25.2.1 on Darwin arm64, tmux is 3.6b at `/opt/homebrew/bin/tmux`, and `/bin/ps` is the pinned process source.

Three retained attempts advanced the model without leaving processes behind:

1. `/private/tmp/aslite-t35-launch-probe.tVxMlMAn` failed because the `process.execve` argument vector incorrectly repeated the tmux binary as an argument.
2. `/private/tmp/aslite-t35-launch-probe.C0EXzb5y` correctly rejected a pretty-printed multi-line control frame as extra bytes after the one-frame gate.
3. `/private/tmp/aslite-t35-launch-probe.ejEELPqK` reached tmux after the frame was compacted, then failed with `open terminal failed: not a terminal` before creating a socket.

The third result disproved the assumption that commandless `tmux -D` automatically starts an empty noninteractive server. On this host, the default client command still attempts `new-session`, which requires a terminal. The next bounded hypothesis is an exact lane-local tmux configuration whose `default-client-command` is `start-server` (with exit-empty disabled), still invoked as commandless `tmux -D`; if that does not yield an empty foreground server without a TTY, the proposed architecture is not accepted and must change rather than receive another wording patch. The ps identity field named `sess` also emitted `0`, so the exact Darwin field grammar must be discovered before any Plan pins a session identifier.

Prediction: the config-directed empty server may succeed because the local tmux manual defines `default-client-command` and forbids an explicit command with `-D`, but process topology and teardown remain unknown. Any outcome is evidence; no repeated retry is authorized without a changed hypothesis and a post-attempt process audit.

## Exact evidence and gates

- Accepted design: `designs/pre-compact-multi-session@sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`.
- Accepted original plan: `plans/pre-compact-multi-session-v3@sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`.
- Failed R4 T3.5 plan: `plans/precompact-v3-t35-candidate-acceptance@sha256:d26ed81a61f6035de04252a9d8d3dccbbb9331192e86a51ff2912feb1ed2e812`.
- Architect research: `research/precompact-v3-t35-launch-reaper-architect@sha256:60018b553f55944a78f1631718e0f5c225eef4c72d85a423b76234acc4a19c43`.
- Acceptance research: `research/precompact-v3-t35-launch-reaper-acceptance@sha256:4e05e1e5f39a1fe75d6caf5ad494092587ac490a73c61f4953f02e8d68a012ce`.
- Skeptic research: `research/precompact-v3-t35-launch-reaper-skeptic@sha256:ceba46d2a33f1d1bc4782077a546e043af8d7163ed70d807233c88e8cab07143`.

Required order remains: no-auth host probe -> independent acceptance and skeptic disposition -> replacement Plan synthesis -> exact Plan acceptance and skeptic PASS -> test-first T3.5 implementation -> exact code Review -> full repository gate and candidate freeze -> exact-artifact Review -> adversarial QA -> negative/manual/automatic/sub-agent live gates. No R1-R4 implementation, API-key Claude run, or G0 freeze is authorized now.

[tracked by](../tasks/pre-compact-multi-session.md)
