---
type: Roadmap Item
title: 'Personal bundle catalog: work across projects'
status: queued
description: >-
  UNPRIORITIZED — a private catalog and launcher for one person's bundles across
  repositories; preserve the direction without scheduling implementation.
actor: mike/codex
timestamp: '2026-07-15T01:50:54.730Z'
---
# Personal bundle catalog: work across projects

**Priority:** Unprioritized. `queued` records the idea without placing it in the implementation
sequence. No tasks should be created until an explicit prioritization decision.

AgentState already recognizes multi-bundle registries and cross-project views as frozen future
scope. This item gives the personal version of that concept a durable, bounded home: one human can
find and reopen the local, private, and shared bundles used across repositories without merging
their data or reviving hosted infrastructure.

The adjacent portable-recipe work makes this more valuable: several independent bundles may share
Kinds and Pages while retaining separate instance data and authority. The catalog is the discovery
layer above those bundles, not part of recipe packaging itself.

[Draft design](../designs/personal-bundle-catalog.md)

## Wake condition

Revisit when real use across several bundles creates recurring discovery, switching, wrong-target,
or launcher-navigation pain. Until then, preserve the design and do not implement it.

[contains](../tasks/bundle-locate.md)
