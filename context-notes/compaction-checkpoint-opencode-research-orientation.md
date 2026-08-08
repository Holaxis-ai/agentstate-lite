---
type: Context Note
title: OpenCode checkpoint research orientation and current system model
description: >-
  Evidence plan, shared-protocol mapping, and unverified OpenCode assumptions
  before research.
actor: codex-checkpoint-opencode-researcher
timestamp: '2026-08-08T17:16:40.926Z'
---
# Summary

Ultimate goal: make agent context durable across compaction and session boundaries without human checkpoint reminders.

Proximate goal: establish version-scoped OpenCode facts for every shared capability-matrix row so later design can choose only guarantees the runtime actually supports.

Current system model: agentstate-lite owns checkpoint identity, revisions, dirty/current semantics, same-bearer semantic synthesis requirements, bundle persistence/CAS, eligibility, bounded retries, restoration, and receipts. OpenCode may contribute only thin adapter mechanics: lifecycle signals, opaque identity provenance, a way to request same-bearer work before loss, and a bounded pre-model context channel after loss. The existing generated plugin uses experimental.chat.system.transform and caches one session-start rendering by plugin sessionID; this proves startup-oriented system-context injection within observed transform calls, not compaction detection, stable continuity/bearer identity, semantic checkpoint capture, or exact restoration.

Repository work remains read-only; research writes only this project bundle. Official OpenCode documentation and upstream source are primary authorities. Installed help/source and isolated temporary-state probes may establish local-surface facts, but no probe may touch live OpenCode config, data, plugins, authentication, or external state.

Unverified assumptions that must not become support claims: whether OpenCode exposes manual or automatic pre-compaction events; whether compaction can be delayed; whether a callback can continue the same bearer for one semantic synthesis turn; whether root stop differs from interruption; whether subagents have stable identities and lifecycle callbacks; whether sessionID survives compact/resume/restart/fork or uniquely identifies a bearer; whether any post-loss callback precedes dependent model work; transform payload limits and failure behavior; handler ordering/concurrency; deterministic journey forcing; sensitive-data exposure; and missing-helper behavior.

Every conclusion will be labeled documented, source-inspected, installed-surface, or empirical, with target version/build/platform/date and explicit unknowns. The outcome classification will be full, capture-only, restore-only, inspectable/manual, or unsupported without selecting production architecture.
