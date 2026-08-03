---
type: Context Note
title: Revision 3 T3.5 R5 planner orientation
actor: codex-precompact-v3-t35-r5-planner
timestamp: '2026-08-03T23:33:44.626Z'
---
# Summary

Status: Orient complete; Plan synthesis may begin. Implementation, F0/H0, Claude/auth use, live acceptance, and G0 remain blocked.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: replace rejected T3.5 Plan R4 with one exact R5 that preserves every survived candidate/verification/lifecycle contract while making launch/reap and Darwin evidence causal, executable, measurable, and independently reviewable; this serves the ultimate goal by preventing an unowned late process or unrecomputable receipt from entering the compaction-memory delivery rail.

## Inputs read in full

- `tasks/pre-compact-multi-session` and `context-notes/precompact-v3-orientation` at their current versions.
- Panel synthesis `context-notes/precompact-v3-t35-host-probe-panel-synthesis@sha256:bdee04f5f0d23c77cc97c6b4e0e8432377b880f0b81ab6eb093b61b4d7bf6093`.
- Rejected base `plans/precompact-v3-t35-candidate-acceptance@sha256:d26ed81a61f6035de04252a9d8d3dccbbb9331192e86a51ff2912feb1ed2e812`.
- Exact selected host Research `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`.
- Independent evidence audit, product/acceptance, and adversarial-skeptic notes named by the panel.

## Current system model and planning boundary

R4's transactional one-build/one-pack candidate freeze, factored existing-tarball verifier, campaign history/current and hard-link lock, challenge-bound R0/Q0 assertions, serialized L0, deterministic sequential PreCompact fault wrapper, API-key-only isolated auth boundary, protected snapshots/privacy scans, supported SessionStart(compact) lifecycle oracles, closed verdicts, and immutable candidate chain remain the base. Only launch/reap and the Darwin process/evidence grammar reopen.

The host correction is explicit POSIX `argv[0]`, exact commandless foreground `tmux -D -f /dev/null -S <socket>`, a separately gated `tmux -N` client, no `sess`/SID claim, no post-parent PPID-stability claim, distinct server/pane process groups, creator-before-socket cleanup, and strict `/bin/ps -p`/`-g` parsing that permits zero leading PID spaces. Broker/client spawn-before-record uncertainty is no-auth quarantine and can never establish CLEAN. Release makes uncertainty/survival a non-advancing FAIL. One recoverable destructive reaper owns raw signaling.

The panel explicitly accepts sampled PID/start/uid/PGID revalidation plus `kill` as bounded non-malicious-same-uid pilot risk; it does not claim pidfd-like atomic identity safety. If this threat model changes, the architecture reopens.

The evidence authority must retain validated strict-schema receipts, exact raw pre-fallback process facts, bounded argv/process/final audits, invocation/real-HOME/candidate bindings, and recomputable privacy oracles. Fake scheduling must exhaust every broker/client/reaper/crash/resume interleaving. Later immutable-candidate live gates, not the harmless probe, own real Claude/hook/sub-agent descendant cleanup and manual/automatic/sub-agent compaction.

No internal contradiction remains in the panel decision. R5 can be synthesized without opening code or live/auth gates, and its exact new digest must receive independent product/acceptance and skeptic PASS before test-first implementation.

[tracked by](../tasks/pre-compact-multi-session.md)
