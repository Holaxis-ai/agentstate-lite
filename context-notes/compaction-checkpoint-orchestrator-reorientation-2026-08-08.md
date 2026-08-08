---
type: Context Note
title: Compaction checkpoint orchestrator reorientation 2026-08-08
description: >-
  Post-compaction system model, active goal, current phase, and unverified
  lifecycle assumptions.
actor: codex-compaction-orchestrator
timestamp: '2026-08-08T17:47:14.080Z'
---
# Summary

**Ultimate goal:** Make agent work durable across compaction and session boundaries without human checkpoint reminders.

**Proximate goal:** Independently validate the runtime-neutral lifecycle design before decomposing it into implementation work; this protects the ultimate goal from an attractive but host-specific or operationally costly protocol.

## Current system model

The shipped product currently installs exact-owned SessionStart integration for Claude Code, Codex, and OpenCode, backed by durable absolute npm-installed launchers. It renders existing bundle state but does not create or select semantic continuity checkpoints.

The candidate lifecycle adds one shared protocol over the existing bundle/CAS storage seam: an exact-subject mutable selector, immutable same-bearer semantic generations, and sparse material receipts. Codex and Claude may support proactive same-bearer assessment/capture through Turn Tickets and Stop/SubagentStop continuations, subject to empirical probes. PreCompact is only a freshness guard. OpenCode lacks an original-bearer synthesis primitive and therefore remains restore-only/manual. Automatic restore is allowed only for an exact, unambiguous subject and a selector-generation-selector read that remains stable.

The design intentionally rejects transcript or host-summary substitution, hidden journals, daemons, tmux brokers, automatic sync, newest-wins restoration, and Claude-specific product semantics. Runtime adapters may differ only where measured host capabilities require it.

## Verified and unverified assumptions

Verified by current research: the named hook/event surfaces exist; Claude and Codex expose same-bearer Stop-style continuation surfaces; OpenCode's compaction agent is not the original bearer; ordinary bundle docs can express CAS selectors, immutable generations, and receipts.

Still unverified and therefore gated: exact identity mapping, ordering, replay behavior, timeout/failure semantics, one-continuation behavior, first-turn Turn Ticket creation, payload ceilings, concurrent resumes, and whether a PreCompact block reliably returns to the same bearer and later reaches Stop. Marketing/support claims must remain conditional until these probes pass.

## Current phase and next gate

Research and the first design pass are complete. The next gate is an independent design review. No implementation planning or code begins until that review either passes or its findings are repaired and re-reviewed. No one-way-door product decision is currently identified.
