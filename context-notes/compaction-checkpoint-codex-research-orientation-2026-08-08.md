---
type: Context Note
title: Codex compaction checkpoint research orientation
actor: codex-checkpoint-codex-researcher
timestamp: '2026-08-08T17:17:46.227Z'
---
# Summary

Codex lifecycle research is claimed and scoped to the runtime-neutral capability matrix. The
current official Hooks guide (fetched 2026-08-08) already establishes that current Codex exposes
`PreCompact`, `PostCompact`, and compact-sourced `SessionStart`; this materially invalidates the
older SessionStart-only Codex hypothesis, but does not itself prove same-bearer semantic synthesis,
identifier stability, causal use of injected context, or deterministic end-to-end support.

# Goals

**Ultimate goal:** Make agent context durable across compaction/session boundaries without human
checkpoint reminders.

**Proximate goal:** Determine exactly which shared checkpoint invariants Codex can satisfy through
version-scoped documented, source-inspected, and isolated empirical evidence, and name the strongest
honest degraded behavior for every absent or unverified capability.

This serves the ultimate goal by preventing a Codex event name or an outdated host assumption from
becoming shared product architecture.

# Current system model

- agentstate-lite owns subject identity, context revision/freshness, semantic synthesis,
  persistence/CAS, exact restoration eligibility, bounded retries, receipts, and failure truth.
- The Codex adapter may translate host lifecycle events and payloads only; a firing hook is not a
  semantic checkpoint and delivery is not model consumption.
- Existing product code installs a managed Codex `SessionStart` hook and enables Codex hooks, but it
  does not yet implement pre-loss synthesis, compaction freshness, exact restore selection, or
  subagent checkpointing.
- Current official documentation says command hooks receive JSON on stdin; matching handlers run
  concurrently; `PreCompact` runs before manual/automatic compaction and may stop before compaction;
  `PostCompact` runs after; compact-sourced `SessionStart` runs before the next model request and can
  inject additional developer context, including during an automatic mid-turn continuation.
- Checkpoints must remain ordinary bundle documents; transcript format is explicitly unstable and
  cannot be a product contract.

# Unverified assumptions and planned evidence

- Target executable version/build and whether it matches the current documentation.
- Exact ordering among `PreCompact`, `PostCompact`, and compact-sourced `SessionStart` in the target
  build, including handler failure and timeout behavior.
- Whether any bounded continuation surface can cause the same bearer to synthesize unwritten state
  before compaction, and whether that can be proven without mutating live Codex state.
- Stability and lineage of session/root/subagent identifiers across compaction, resume, fork,
  process restart, and concurrent resume.
- Whether ordinary stop, interruption, API failure, and subagent shutdown provide usable
  checkpoint opportunities.
- Exact context-output limits, environment inheritance, credential/network exposure, install
  readiness, and deterministic testability on this build.

# Next action

Inspect the installed Codex build and its read-only command/config surface, then map official and
source evidence row-by-row before deciding whether isolated temporary empirical probes add reliable
facts.
