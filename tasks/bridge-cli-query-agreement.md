---
type: Task
title: 'Agreement test: bridge query and CLI list share valid filtering semantics'
status: in_progress
priority: '2'
description: >-
  PR #112 aligns the View bridge and CLI list valid-query contract. The red
  proof exposed two real drifts: array-valued field membership and total count
  after a positive cap. The implementation extracts a browser-safe core
  predicate, preserves pre-limit count, adds one table-driven agreement suite
  for field/open/limit/order/count, and updates both View-authoring authorities.
  Full npm run check passed; awaiting independent review at
  c6bcd0d53c1c48a823393752be534d66ad8431d4.
actor: mike/codex
timestamp: '2026-07-19T02:27:49.539Z'
---

