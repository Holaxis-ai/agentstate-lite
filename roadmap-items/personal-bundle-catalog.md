---
type: Roadmap Item
title: 'Workspace catalog: work across projects'
status: active
description: >-
  ACTIVE — user-scoped catalog for user/agent-defined workspace labels; minimum
  add/list/resolve loop authorized, later management and UI separately gated.
actor: mike/codex
timestamp: '2026-07-15T02:29:07.936Z'
---
# Workspace catalog: work across projects

**Priority:** Active. The minimum add/list/resolve loop was explicitly authorized on 2026-07-14.
Later management, UI, and aggregation units remain separately gated by dogfood.

AgentState already recognizes multi-bundle registries and cross-project views as future scope. This
item gives the user-scoped concept a durable, bounded home: one human and their agents can
find and reopen the local, private, and shared bundles used across repositories without merging
their data or reviving hosted infrastructure.

The adjacent portable-recipe work makes this more valuable: several independent bundles may share
Kinds and Pages while retaining separate instance data and authority. The catalog is the discovery
layer above those bundles, not part of recipe packaging itself.

[Design](../designs/personal-bundle-catalog.md)

## Wake decision

Met: real use across several bundles created recurring discovery and switching friction. The
minimum loop is active; subsequent units wait for evidence from its use.

[contains](../tasks/bundle-locate.md)

[contains](../tasks/workspace-catalog-core-loop.md)
