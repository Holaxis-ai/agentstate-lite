---
type: Decision
title: Runtime-neutral compaction checkpoint ownership
description: >-
  One lifecycle task owns the portable checkpoint protocol; host-specific
  adapters require a proven host constraint.
actor: codex-compaction-reconciliation
timestamp: '2026-08-08T16:39:53.424Z'
---
# Decision

The compaction/context-checkpoint program has one product owner:
`tasks/compaction-context-checkpoint-lifecycle`.

The implementation will be runtime-neutral at its core. Agentstate-lite owns the shared checkpoint
schema, identity, freshness, synthesis, restoration, loop-prevention, and error-reporting contract.
Codex, Claude Code, and OpenCode integrations are thin capability adapters around that contract.

Host-specific implementation is permitted only for a proven host-specific constraint. Before
adding one, the design must name the invariant, show why the portable mechanism cannot satisfy it,
confine the exception to that host adapter, and obtain design review. Claude-specific lifecycle
hooks should be used only where Claude's actual semantics require them. The prior private journal,
tmux controller, broker, and exact-host probe work do not become product architecture by default.

`tasks/pre-compact-multi-session` is canceled as an independent Claude-only pilot, while its
designs, reviews, prototypes, and probes remain research evidence. Its remaining clean-room probe
task is canceled. `tasks/session-end-capture` is also canceled as a separate feature and absorbed as
the ordinary-stop case of the authoritative lifecycle protocol.

The interim `context-notes/pre-compact-main-<session_id>` convention remains useful until the shared
protocol ships, but the fixed `context-notes/pre-compact-main` id remains deprecated because it can
collide across concurrent sessions.

# Goals

**Ultimate goal:** Make agent work durable across turns, compactions, sessions, and handoffs without
requiring a human to notice that context must be saved.

**Proximate goal:** Remove competing task ownership and constrain the design to the smallest
runtime-neutral protocol, preserving host-specific evidence without allowing it to dictate the
architecture.

This serves the ultimate goal by creating one visible owner and a portable contract that can be
implemented consistently across agent runtimes.

# Related records

- [authoritative lifecycle task](../tasks/compaction-context-checkpoint-lifecycle.md)
- [archived Claude pilot](../tasks/pre-compact-multi-session.md)
- [absorbed session-end task](../tasks/session-end-capture.md)
- [deprecated fixed checkpoint](../context-notes/pre-compact-main.md)
