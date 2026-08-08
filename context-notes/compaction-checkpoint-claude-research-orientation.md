---
type: Context Note
title: Claude compaction checkpoint research orientation
actor: codex-checkpoint-claude-researcher
timestamp: '2026-08-08T17:17:34.385Z'
---
# Summary

Claude Code runtime research began on 2026-08-08 under task
`tasks/compaction-checkpoint-claude-research`, claimed by
`codex-checkpoint-claude-researcher` at storage version
`sha256:3fb20dfbb57802e8145dcc1f9548f43747da2379a0861c00ea6d82abe71e2fc1`.

**Ultimate goal:** make agent context durable across compaction and session boundaries without
human checkpoint reminders.

**Proximate goal:** establish current, version-scoped Claude Code lifecycle facts for every row of
the runtime-neutral capability matrix; this serves the ultimate goal by identifying only the thin
host adapter behavior that evidence actually requires.

## Current system model

- The shared agentstate-lite protocol owns checkpoint subject identity, context revision and
  dirty/current state, same-bearer semantic synthesis, bundle persistence/CAS, exact selection,
  bounded retries, restoration semantics, receipts, and honest degradation.
- The Claude adapter may only translate evidenced lifecycle events, payloads, identifiers,
  timing/failure behavior, and supported context-delivery channels into that protocol.
- Current `main` implements structurally owned `SessionStart` orientation hooks across Claude,
  Codex, and OpenCode. It does not implement semantic checkpoint synthesis, compaction
  interception, freshness, exact restoration identity, or subagent checkpoint coverage.
- `context-notes/pre-compact-main` is deprecated because concurrent roots collide. The canceled
  Claude revision-3 pilot is bounded historical evidence only; its private journal, generation
  head, transcript card, tmux controller, broker, host probe, and GC architecture are not selected.
- Checkpoints, if later designed, remain ordinary documents in the project bundle; host-local
  evidence or Git state may support but cannot replace same-bearer semantic synthesis.

## Unverified assumptions entering research

- Current Claude Code still exposes `PreCompact` for both manual and automatic triggers and
  compact-sourced `SessionStart` before dependent model work.
- Hook command completion may delay compaction, but whether any hook output or exit status can
  block it, and exact timeout/failure behavior, are not yet established.
- `Stop` and `SubagentStop` may allow one bounded continuation through `decision: block`, but
  whether that is the same bearer and how loop prevention works require current proof.
- `session_id`, `agent_id`, `agent_type`, `transcript_path`, `cwd`, and `permission_mode` may be
  present in relevant payloads; stability across compaction, resume, restart, fork, and concurrent
  resume is not established.
- `SessionStart` hook `additionalContext` may provide delivery acceptance, not consumption proof;
  size, ordering, and truncation limits remain unverified.
- Official documentation may specify handlers as parallel or sequential by hook shape, but exact
  multi-handler failure propagation and deterministic end-to-end forcing still need empirical
  coverage.

No production architecture is selected by this note.
