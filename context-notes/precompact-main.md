---
type: Context Note
title: 'Pre-compact handoff: revision 3 compaction rail'
description: Handoff state and next actions for a fresh Codex session.
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-04T17:29:46.020Z'
---
# Summary

R0 r6 is implemented and locally tested, but exact review r7 failed; live authorization is CLOSED.

# Handoff: revision 3 compaction rail

## Goal

Prove a safe, durable multi-session handoff rail for Claude compaction before implementing the lifecycle authority. The product goal is cognitive durability across sessions; detached execution, resident daemons, launchd, and tmux are out of scope.

## Current status

- R0 structural repair r6 is complete in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`; exact review r7 failed.
- Branch: `feat/precompact-handoff-v3`.
- Targeted deterministic suite: 6/6 passing.
- No lifecycle or tmux code has been started.
- Latest repair adds `scripts/r0-prepare.mjs`, exact `.r0-live/precompact/manifest.json` and `.r0-live/sessionstart/manifest.json` paths, STATIC-only synthetic runs, and runbook guidance for isolated settings, host checks, raw evidence, and restore.
- Git commit may still be blocked by the shared worktree index-lock permission issue.

## Review state

Prior exact reviews repeatedly returned FAIL because the fixture was synthetic. Latest skeptic record: `context-notes/precompact-v3-r0-live-rail-skeptic-r7@sha256:3f6b6fb48ebd74e0f98b519cf20d44890083e268efd00ed03e74ede21f62ad43`. A valid PreCompact input still produces a SessionStart response; settings/path binding, isolation, raw adjudication, STATIC/LIVE enforcement, and cwd-independent tests remain unresolved.

## Immediate next action

Next session: repair the r7 blockers, then repeat exact review. Do not run Claude or authorize live acceptance unless both reviewers pass. If they pass, run the isolated four-case live matrix with raw evidence and restoration proof.

## Architectural invariants

The eventual authority must be synchronous and invocation-scoped, backed by a private CAS journal; one executable authority owns identity/schema/transitions/claim/GC/recovery; observers are zero-write; delivery is at-least-once with explicit CAS work/resume claims; no production daemon or tmux authority.

## Operating rule

Every subagent result is an event: classify it, update the task, and dispatch the next dependency immediately. Never leave a completed result unprocessed or wait for a user “continue” prompt unless blocked by an external capability, safety boundary, or materially different decision.
