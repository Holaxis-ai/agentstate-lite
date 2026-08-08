---
type: Context Note
title: 'Founder discussion: portability and OKF evolution requirements'
description: >-
  Durable product and architecture requirements extracted from the August 5
  founder discussion; unrelated staffing and equity content intentionally
  excluded.
actor: openai/codex
timestamp: '2026-08-08T01:06:21.235Z'
---
# Summary

On August 5, 2026, the founders discussed what OKF's early evolution means for AgentState Lite. The durable conclusion was not “adopt every OKF release immediately.” It was that portability is a core product promise, so AgentState needs an explicit way to distinguish standard semantics from producer and bundle-local extensions, detect collisions, and migrate deliberately when ecosystem value justifies adoption.

## Product requirements established by the discussion

- **Portability is user value.** Alignment lets users move their bundles, use third-party consumers and Views, and leave AgentState without losing their knowledge model. Standards compliance is valuable because of those outcomes, not as an end in itself.
- **Dynamic modeling makes standards evolution a first-class concern.** Agents and users can create arbitrary Kinds and fields across many bundles. A later standard can adopt the same unqualified name with different semantics, multiplying migration cost across documents, recipes, and Views.
- **Core and extension semantics must be distinguishable to agents.** An agent designing or evolving a recipe needs to know which concepts are defined by the selected OKF edition and which are portable producer extensions or bundle-local definitions.
- **Compatibility work should be repeatable rather than reactive.** AgentState should accumulate upstream changes, classify their impact, and adopt an edition when portability benefit exceeds migration cost. It should not continuously churn bundles merely to track a young standard.

## Technical clarifications

- The immediate `status` problem is a **field-coordinate and value-vocabulary collision**, not a custom Kind collision: AgentState uses `status` for Kind-specific workflow state, while OKF v0.2 assigns it document-lifecycle semantics.
- Namespacing is necessary to prevent direct ownership collisions, but it is not sufficient for portability. Generic consumers may not understand namespaced data, and agents may inconsistently choose the standard field or a similarly named extension unless one registry and mapping authority guides them.
- Migration may require semantic judgment. Some changes can be deterministic, but a generic rename script or migration skill cannot decide that two similarly named concepts mean the same thing. Migrations must expose ambiguity and allow human adjudication where needed.
- Existing user-facing aliases and Views can remain ergonomic while a registry maps logical field identity to the appropriate wire representation. Storage identity and authoring vocabulary do not have to be the same surface.

## Current implementation sequence

The existing [compatibility roadmap](../roadmap-items/okf-compatibility-upstream-stewardship.md) and [near-term design](../designs/okf-compatibility-and-upstream-stewardship.md) correctly embody this discussion:

1. Remain an honest OKF v0.1 writer while reading and transporting v0.2 permissively.
2. Prevent unsupported authoring-version claims through [the version guard](../tasks/okf-version-claim-guard.md).
3. Continue the [upstream producer report](../tasks/okf-upstream-producer-report.md), including the published `status` collision issue.
4. Adjudicate workflow identity, provenance, and date-shape semantics before implementing [the v0.2 write contract](../tasks/okf-v0-2-write-contract.md).
5. Use the broader [extension-evolution architecture](../designs/okf-extension-evolution-recommendation.md) as the durable migration and collision model; do not implement its speculative wire syntax until real adoption pressure and upstream guidance justify it.

## Product evidence

The conversation also contained strong founder dogfood evidence: bundles had become indispensable for organizing research, design assets, work handoffs, grant collaboration, and agent-created Views. The recurring value was that loosely supplied material became structured, actionable, and explainable knowledge with provenance. That evidence strengthens portability as a core promise: the more valuable the accumulated bundle becomes, the more important it is that users retain ownership and migration options.

## Scope boundary

The later staffing, financing, and equity discussion was unrelated to the OKF product contract and is intentionally not recorded in this public project bundle.
