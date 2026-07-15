---
type: Roadmap Item
title: 'Workspace catalog: work across projects'
status: active
description: >-
  ACTIVE — foundation shipped in PR #59; the discovery consumer is independently
  approved and in review as PR #60. After merge, dogfood whether agents notice
  labels, resolve correctly, and carry explicit --dir before waking remove,
  --workspace sugar, catalog open, visual navigation, aggregation, or remote
  locator work.
actor: mike/codex
timestamp: '2026-07-15T03:35:39.458Z'
---
# Workspace catalog: work across projects

**Priority:** Active. The minimum add/list/resolve foundation shipped in PR #59 on 2026-07-14.
The next unit makes that primitive visible to agents; later management, convenience, UI, and
aggregation units remain separately gated by dogfood.

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
minimum loop is shipped. The next problem is no longer storage or resolution; it is whether the
catalog enters the agent's natural workflow often enough to deliver value.

## Rough delivery sequence

### 0. Foundation — shipped

Private, versioned, machine-local catalog with explicit `add`, `list`, and `resolve`; stable entry
ids; canonical local locators; one locked mutation boundary; and no crawling, ambient active
workspace, cross-bundle query, or hosted dependency. PR #59 / plugin 1.0.53.

### 1. Discovery consumer — IN REVIEW (PR #60)

Surface a compact workspace block through the existing `home` render, which also makes it appear
at `session-start` without a second integration. Show only a non-empty catalog's count and sorted
labels, plus the explicit `catalog resolve <label> --field path` next action. Do not print absolute
paths or perform live locator probes in orientation output; detailed availability remains in the
explicit `catalog list` command. Empty catalogs add no noise; a malformed or stalled catalog must
fail soft with repair guidance and must never prevent session start.

This is the unit that turns the naming primitive into an agent workflow. It adds no new targeting
semantics, registration, crawling, mutation, or UI.

### 2. Dogfood checkpoint — evidence, not a feature

Register the real bundles used across the founders' work and observe whether agents notice the
home/session-start block, resolve the correct label, and carry the returned path into explicit
`--dir` operations. Record actual failures: stale entries, correction needs, repeated resolution
friction, or demand to open a bundle for a human. Do not wake later units merely because they are
listed here.

### 3. Lifecycle repair — remove first

If dogfood confirms stale or mistaken entries, add `catalog remove <label-or-id>` through the same
locked mutation boundary. Removal deletes only the catalog reference, works when the target bundle
is unavailable, and never deletes bundle data. Consider rename separately only if preserving a
stable entry id through a label change proves valuable; `remove` plus `add` is otherwise adequate.

This refines the design's earlier proposal to group rename and remove into one management unit.

### 4. Explicit targeting sugar — only if the two-step loop hurts

If agents repeatedly fumble or waste calls on resolve-then-`--dir`, consider an explicit
per-invocation `--workspace <label-or-id>` convenience. It must delegate to the same catalog
resolver, be mutually exclusive with `--dir` and `--remote`, and never create mutable global or
process-wide active-workspace state. Record this as the allowed ergonomic direction now; do not
implement it without observed friction.

### 5. Human opening workflow — separately gated

If users repeatedly want to switch bundle UIs, consider `catalog open <selector>` as thin
delegation to the existing one-bundle `ui --dir` path. It must not create a multi-bundle server or
new data plane.

### 6. Visual catalog — explicit views decision required

Only if command-line orientation remains insufficient, consider a thin visual catalog of labels,
availability, and Open actions. This is navigation over independent bundles, not aggregation. The
repository's paused-views gate requires a fresh human decision before implementation.

### 7. Separate future bets — not implied by this sequence

Cross-bundle read aggregation, remote locator kinds, durable cross-machine bundle identity, and
hosted multi-bundle infrastructure each require their own design and wake decision. Preserve the
tagged locator seam, but do not treat its extensibility as a commitment to reopen the hosted path.

[contains](../tasks/bundle-locate.md)

[contains](../tasks/workspace-catalog-core-loop.md)

[contains](../tasks/workspace-catalog-discovery-consumer.md)
