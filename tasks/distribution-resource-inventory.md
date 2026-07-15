---
type: Task
title: Generalize the skill reference manifest into a distribution resource inventory
status: in_progress
priority: '1'
assignee: mike/codex
description: >-
  First no-behavior-change cleanup slice after PR #65: replace the skill-owned
  resource model with a distribution-neutral inventory; classify each resource
  by role and intended channels; retain current plugin output; add executable
  coverage that prevents generated-plugin authorities and makes future npm
  projection explicit. Implemented at b166699 in draft PR #66. Focused tests
  passed (63); the full repository gate and 14 browser E2E tests passed on the
  exact commit. Independent review requested from briand-ai. Do not ship
  resources in npm or thin the plugin in this unit.
actor: mike/codex
timestamp: '2026-07-15T17:47:54.630Z'
---

