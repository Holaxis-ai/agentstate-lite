---
type: Context Note
title: Revision 3 T3.5 R5 planner completion
actor: codex-precompact-v3-t35-r5-planner
timestamp: '2026-08-03T23:44:49.030Z'
---
# Summary

Status: complete. Result: **PASS — R5 Plan authored and CAS-published; exact independent Plan review remains the next hard gate.**

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal completed: replace rejected T3.5 Plan R4 with one exact R5 that preserves every survived candidate/verification/lifecycle contract while making launch/reap and Darwin evidence causal, executable, measurable, and independently reviewable; this serves the ultimate goal by preventing an unowned late process or unrecomputable receipt from entering the compaction-memory rail.

## Exact deliverable

- `plans/precompact-v3-t35-candidate-acceptance@sha256:c7a9e198b6580fbc59519b5b90aa4e9a55cab9c6ded97d818ca5c0ae3977bd4c`
- Title: `Revision 3 T3.5 candidate-acceptance Plan R5`
- The required first mutation used compare-and-swap from rejected R4 `sha256:d26ed81a61f6035de04252a9d8d3dccbbb9331192e86a51ff2912feb1ed2e812`. A readback audit found and repaired two internal cleanup/quarantine phrasings by a second CAS; the digest above is the only review candidate.
- Final body readback version matched the digest above and was byte-identical to the reviewed local body (418 lines, 86013 bytes). Title readback matched exactly.

## Change inventory

- Preserved R4's transactional one-build/one-pack candidate freeze, exact tree/modes, factored existing-tarball verifier, pre/post drift checks, history-before-current campaign ledger and hard-link lock, challenge-bound R0/Q0 assertions, serialized L0, deterministic sequential PreCompact fault wrapper, API-key-only isolated auth boundary, protected snapshots/privacy scans, supported lifecycle/oracle lanes, closed verdicts, red-first graph, exact-SHA Review-before-QA/G0/live, and immutable candidate chain.
- Pinned the exact Darwin arm64 / Node v25.2.1 / tmux 3.6b / `/bin/ps` tuple; required explicit POSIX executable `argv[0]`, commandless foreground `-D`, separately gated no-auth `-N`, no `sess`/SID identity, no post-parent PPID-stability claim, and strict zero-leading-space `/bin/ps -p`/`-g` grammars.
- Added one executable monotone broker/client/server/session/reaper authority with durable reservation and identity before irreversible CAS/read-back release, terminal release fences, no-auth spawn-before-record quarantine, post-release pending FAIL, and one recoverable raw-signal lease.
- Made cleanup causal: fence writers/releases; reap clients; refresh the live pane/tree inventory; reap server; prove separate pane/Claude/hook/sub-agent groups absent; validate/remove stale socket; retain final process/no-autostart proof; then publish CLEAN.
- Accepted sampled PID/start/uid/PGID-to-signal TOCTOU only as bounded non-malicious-same-uid pilot risk, with no atomic-safety claim and an explicit threat-model expiry condition.
- Added standalone strict executable evidence schemas/validators and receipts, raw pre-fallback facts, bounded argv/process/group/final audits, invocation/real-HOME/candidate binding, and recomputable nonsecret privacy evidence.
- Added exhaustive deterministic fake-scheduler acceptance and exact no-auth implementation smoke before G0, plus post-G0 real L1 normal, L2 socket-unlinked TERM, and L3 runner-crash/two-cleaner/KILL descendant-tree gates.
- Closed verdict mapping: unresolved no-secret broker state is `BLOCKED_PENDING_VERIFICATION` plus absorbing pre-release quarantine; any uncertainty or survivor after release records non-advancing FAIL, and unresolved cleanup ends failed quarantine. There is no caveated success state.

## Issues and gate disposition

No unresolved contradiction or product decision remains in the Plan. The accepted sampled-PID limitation is explicit rather than hidden. Implementation, F0/H0, Claude/auth use, live acceptance, and G0 remain blocked until independent product/acceptance and adversarial-skeptic reviewers both PASS this exact R5 digest. Any repair changes the digest and repeats exact Plan review.

Confidence: 0.96 that R5 faithfully integrates the exact panel contract and preserves the survived R4 rail; semantic approval remains deliberately assigned to the independent exact-R5 reviewers.

[tracked by](../tasks/pre-compact-multi-session.md)
