---
type: Context Note
title: Claude Code compaction-checkpoint research result
description: >-
  Completed Claude Code 2.1.226 lifecycle research with adapter constraints and
  explicit validation gaps.
tags:
  - compaction-checkpoint
  - claude-code
  - research-result
actor: codex-checkpoint-claude-researcher
timestamp: '2026-08-08T17:24:42.892Z'
---
# Claude Code runtime research result

# Summary

Research is structurally complete for architecture comparison. Claude Code 2.1.226 provides pre/post compaction events, proactive same-bearer continuation at successful stops, and a bounded restoration channel, but the shared core must supply durability, concurrency, freshness, ambiguity handling, and honest receipts.

## Goals and status

- **Ultimate goal:** make project context durable across compaction and session boundaries without human reminders.
- **Proximate goal:** establish the current Claude Code lifecycle capability boundary so the parent effort can compare architectures without smuggling Claude-specific storage or coordination into the shared protocol.
- **Status:** complete for architecture comparison. The complete 17-row matrix is in [[research/compaction-checkpoint-claude-capabilities]]. Remaining items are explicit isolated implementation-validation probes, not blockers to parent synthesis.

## Evidence scope

Target: Claude Code 2.1.226 on Darwin arm64/macOS 26.6 (25G72), researched 2026-08-08. Evidence includes current official Anthropic hook/session/CLI/context/subagent documentation, installed CLI help/version/binary metadata, inspected agentstate-lite hook installer/tests, and only bounded historical 2.1.220 corroboration. Claude implementation source was unavailable. No live model session and no user Claude state were used.

## Findings the parent should carry forward

1. `PreCompact` is a real synchronous event before manual and automatic compaction. It can delay/block, but its external hook cannot ask the still-live Claude conversation bearer to synthesize semantics. Transcript state may lag.
2. Same-bearer continuation exists at successful `Stop` and `SubagentStop`, with `stop_hook_active` and an eight-block host cap. It is proactive/turn-end coverage, not a universal loss boundary: root Stop is absent on user interrupt, API failures use observational-only `StopFailure`, and abrupt termination has no cleanup event.
3. `SessionStart` with `source: "compact"` is the documented restoration gate before the next prompt. It directly injects at most 10,000 characters; larger output becomes preview-plus-file-path and should be treated as degraded transport.
4. `PostCompact` also occurs after compaction and contains `compact_summary`, but its exact order relative to compact-sourced SessionStart is undocumented.
5. `session_id` is lineage, not a unique active-carrier key: simultaneous resumes can share it and interleave one transcript. Fork gets a new session ID. No documented carrier execution ID or compaction generation exists; child `agent_id` stability through compaction remains a probe gap.
6. Hook execution/parse can provide delivery receipts, but Claude exposes no native proof that the next model actually used a checkpoint. Keep `HANDLER_COMPLETED`, `HOST_ACCEPTED`, and optional active `EFFECT_OBSERVED` distinct.
7. All matching handlers run in parallel. Settings duplicates can dedupe, while plugin/skill copies may still run separately. Shared CAS/idempotence is mandatory; handler order cannot carry protocol semantics.
8. The current repository installer is a sound extension seam: absolute self-reexec, foreign-handler preservation, exact dedupe, idempotent uninstall, and refusal to rewrite malformed settings. It currently manages only SessionStart and needs multi-event/version contract tests before implementation.
9. If agentstate-lite is missing, stale, timed out, or incompatible, the runtime cannot honestly claim readiness. Most failures are nonblocking; exact PreCompact timeout/crash behavior is still a target-version probe gap. Degraded receipts and fail-safe loop limits belong in the shared protocol.

## Adapter boundary

Claude-specific code should only translate events/payloads, identifiers, timeout/exit semantics, parallel delivery, block-mode asymmetry, and the 10,000-character restore channel. Durable storage, checkpoint schema, attempt/generation IDs, freshness, selection, CAS, ambiguity handling, and receipt semantics stay in the runtime-neutral core. Do not revive the historical transcript journal, private model session, broker/daemon, tmux carrier, or transcript-parser architecture.

## Highest-value implementation probes

- Trace manual and forced-auto PreCompact → PostCompact/SessionStart ordering.
- Exercise PreCompact allow/block/exit2/nonzero/malformed/timeout/kill in proactive-auto and API-limit-recovery modes.
- Verify Stop/SubagentStop same-bearer nonce continuation, loop guards, interrupts, errors, child compaction, identity stability, and sibling isolation.
- Test 9,999/10,000/10,001-character Unicode restore payloads and direct-versus-file fallback.
- Test simultaneous resume ambiguity and missing/stale executable behavior in temporary isolated homes/bundles.

No `aslite sync` was run.
