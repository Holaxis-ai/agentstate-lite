---
type: Task
title: 'Bounded read-only simplification audit (codex charter, 2026-07-18)'
status: todo
priority: '3'
description: >-
  GATED: run only after the Page->View sequence settles (#88 merged + teaching
  stable) and never at the expense of the trusted human-action thread. Charter
  per context-notes/simplification-audit-recommendation: fixed main SHA; ~one
  day; READ-ONLY (zero code changes); return AT MOST five ranked opportunities,
  each naming the duplicated authority or mixed responsibility, the
  deletion/consolidation, the parity tests proving safety, expected net
  reduction, risk, and one-claim PR size. Priorities: Page->View transitional
  compat (post-retirement), duplicated policy across adapters, modules mixing
  orchestration with domain decisions (sync/establish state machines are the
  standing candidate), obsolete migration/non-default remote paths,
  generated/reference ownership (distribution machinery — note the
  npm-bundle-bootstrap design is the larger product-gated lever), mutation
  survivors suggesting redundant conditions (survival alone is NOT proof of
  removability). Excluded: style/naming churn, speculative extraction,
  rearrangement without net deletion. Winners execute as separate one-claim PRs;
  no broad cleanup branch.
actor: mike/claude
timestamp: '2026-07-18T02:53:52.904Z'
---
[charter](../context-notes/simplification-audit-recommendation.md)
