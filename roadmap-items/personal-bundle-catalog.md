---
type: Roadmap Item
title: 'Workspace catalog: work across projects'
status: active
description: >-
  ACTIVE — catalog foundation PR #59 and discovery PR #60 shipped; dogfood is IN
  PROGRESS with agentstate-lite and mike-tasks registered. Home visibility and
  explicit resolution work. Plugin-refresh expectations and the zsh resolver
  were the first findings; PR #62/plugin 1.0.55 fixed the latter. NEXT:
  fresh-agent cross-workspace reads/writes; later features remain
  evidence-gated.
actor: mike/codex
timestamp: '2026-07-15T14:32:45.943Z'
---
# Workspace catalog: work across projects

**Priority:** Active. The minimum add/list/resolve foundation shipped in PR #59 on 2026-07-14,
and its home/session-start discovery consumer shipped in PR #60 on 2026-07-15. The current unit is
an in-progress dogfood checkpoint; later management, convenience, UI, and aggregation units remain
separately gated by observed friction.

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

Dogfood began on 2026-07-15 with the real `agentstate-lite` and `mike-tasks` bundles registered on
one founder's machine. The catalog, home orientation block, and explicit resolution path all worked;
the remaining proof is whether fresh agents notice and use that path naturally during real work.

## Rough delivery sequence

### 0. Foundation — shipped

Private, versioned, machine-local catalog with explicit `add`, `list`, and `resolve`; stable entry
ids; canonical local locators; one locked mutation boundary; and no crawling, ambient active
workspace, cross-bundle query, or hosted dependency. PR #59 / plugin 1.0.53.

### 1. Discovery consumer — shipped (PR #60 / plugin 1.0.54)

Surface a compact workspace block through the existing `home` render, which also makes it appear
at `session-start` without a second integration. Show only a non-empty catalog's total count, shown
count, and up to 15 sorted labels. Untruncated output gives the explicit
`catalog resolve <label> --field path` next action; truncated output points to `catalog list`.
Do not print absolute paths or perform live locator probes in orientation output; detailed
availability remains in the explicit `catalog list` command. Empty catalogs add no noise; a
malformed or stalled catalog must fail soft with repair guidance and must never prevent session
start.

This is the unit that turns the naming primitive into an agent workflow. It adds no new targeting
semantics, registration, crawling, mutation, or UI.

### 2. Dogfood checkpoint — IN PROGRESS (evidence, not a feature)

The first real setup registered `agentstate-lite` and `mike-tasks`. Both entries report available,
resolve to the correct canonical local bundle roots, and appear in `home`/`session-start` as labels
without leaking paths. The CLI's own top-level, `catalog`, `bundle locate`, `init`, and `sync` help
is sufficient to discover the supported lifecycle without depending on skill prose.

Two setup findings have already paid down friction. First, Codex Git marketplaces are explicit
snapshots: the founder initially expected a merged plugin release to update automatically, then
confirmed that `codex plugin marketplace upgrade agentstate-lite` refreshes the installed version.
Second, the documented skill resolver failed under default zsh when an optional host glob had no
match; PR #62 fixed both `$ASLITE` and `$REFS`, released as plugin 1.0.55, and added exact emitted
Zsh regressions.

Remaining evidence: start fresh agent tasks in each project, observe whether the agent notices the
workspace block without coaching, and complete real cross-workspace reads and writes through
resolve-then-`--dir`. Record stale-entry repair needs, repeated targeting friction, or demand to
open a bundle for a human. Do not wake later units merely because they are listed here.

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

[contains](../tasks/workspace-catalog-dogfood-checkpoint.md)

[contains](../tasks/zsh-skill-resolver.md)
