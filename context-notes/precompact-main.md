---
type: Context Note
title: 'Pre-compact handoff: revision 3 compaction rail'
description: Handoff state and next actions for a fresh Codex session.
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-04T17:26:26.497Z'
---
# Summary

R0 r6 is implemented and locally tested; exact review and real-Claude live acceptance remain.

# Handoff: revision 3 compaction rail

## Goal

Prove a safe, durable multi-session handoff rail for Claude compaction before implementing the lifecycle authority. The product goal is cognitive durability across sessions; detached execution, resident daemons, launchd, and tmux are out of scope.

## Current status

- R0 structural repair r6 is complete in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`.
- Branch: `feat/precompact-handoff-v3`.
- Targeted deterministic suite: 6/6 passing.
- No lifecycle or tmux code has been started.
- Latest repair adds `scripts/r0-prepare.mjs`, exact `.r0-live/precompact/manifest.json` and `.r0-live/sessionstart/manifest.json` paths, STATIC-only synthetic runs, and runbook guidance for isolated settings, host checks, raw evidence, and restore.
- Git commit may still be blocked by the shared worktree index-lock permission issue.

## Review state

Prior exact reviews repeatedly returned FAIL because the fixture was synthetic: fabricated Claude events, disconnected manifests/settings, missing stdout passthrough and raw adjudication, incomplete automatic/negative cases, and STATIC artifacts claiming LIVE. Those blockers were targeted by r6, but r6 has not yet received a fresh exact-byte skeptic/product review.

## Immediate next action

Dispatch exact-byte skeptic and product acceptance reviews of r6. Do not run Claude or authorize live acceptance unless both pass. If either fails, repair the concrete blocker immediately and re-review. If both pass, run the isolated four-case live matrix: manual positive, automatic positive, automatic PreCompact negative, and SessionStart `continue:false` negative, capturing raw hook input/output, transcript/native-summary, host/settings/version/digest provenance, timing, and restoration evidence.

## Architectural invariants

The eventual authority must be synchronous and invocation-scoped, backed by a private CAS journal; one executable authority owns identity/schema/transitions/claim/GC/recovery; observers are zero-write; delivery is at-least-once with explicit CAS work/resume claims; no production daemon or tmux authority.

## Operating rule

Every subagent result is an event: classify it, update the task, and dispatch the next dependency immediately. Never leave a completed result unprocessed or wait for a user “continue” prompt unless blocked by an external capability, safety boundary, or materially different decision.
