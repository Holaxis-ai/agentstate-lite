---
type: Task
title: 'Phase 2: migrate the known bundles off legacy Page/pages-*/bridge forms'
status: todo
priority: '2'
assignee: ''
description: >-
  Per decisions/legacy-deprecation-path (Brian, 2026-07-23). GATED on
  feat/view-access-field merging. Scope: for each KNOWN bundle (this repo's
  board; Mike's bundles — enumerate with him): flip type Page->View; rewrite
  bridge->access; move registry ids pages-registry/->views-registry/ and blob
  keys pages/->views/ WITH inbound-link rewriting (ids are identity, so a move
  is delete+recreate — the small stock, 8 docs here, is what makes this
  tractable now). Ship as a re-runnable migration pass (script or verb —
  decide), leaving the status legacy-stock audit at ZERO for each migrated
  bundle. The audit IS the completion meter. Do not remove any code path in this
  unit.
actor: claude-main-viewauthoring
timestamp: '2026-07-23T21:00:57.040Z'
---

