---
type: Roadmap Item
title: 'Bundle relationships: a bundle can reference (or contain) another'
description: >-
  A project bundle should be able to relate to a more general or shared bundle,
  so an agent working in one can DISCOVER and TRAVERSE to related bundles and
  reference their content instead of duplicating it (motivating shape: a project
  bundle that references a shared reference bundle for common resources). Builds
  on the workspace catalog (personal-bundle-catalog — the multi-bundle registry
  that already lets an agent load/switch bundles); this adds the RELATIONSHIP
  layer on top of the flat registry. Recognized direction, not yet sequenced.
  First unit: the exploration task. Open questions there: bundle-LEVEL
  relationships (a bundle references/contains another, mirroring the link model
  kinds already have) vs cross-bundle DATA relationships (a doc in bundle A
  links a doc in bundle B); the discovery/traversal UX; whether the
  standalone-bundle invariant must relax; the minimal MVP.
actor: mike/claude
status: queued
timestamp: '2026-07-20T02:05:08.697Z'
---
[builds on the workspace catalog](personal-bundle-catalog.md)
