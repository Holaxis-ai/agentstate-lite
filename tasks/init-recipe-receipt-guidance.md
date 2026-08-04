---
type: Task
title: Make init success guidance match the installed recipe
status: in_progress
priority: '2'
assignee: openai/codex
description: >-
  Confirmed against npm @holaxis/aslite@0.1.0-pre.3: from an empty bundle,
  'aslite init --recipe work-tracking' succeeds but its receipt recommends
  'aslite new Context Note', while the bundle declares only Task; following the
  suggestion exits 2 with KIND_UNKNOWN and writes nothing. Fix init's
  post-success guidance so it never advertises a kind the selected recipe did
  not install. Cover the default context-notes recipe, work-tracking, roadmap,
  none, and external recipes without inventing recipe-specific command logic
  outside the recipe metadata/receipt authority. Acceptance: every suggested
  mutation is valid for the resulting bundle or omitted, existing
  recipe-discovery commands remain unchanged, focused tests and repository gate
  pass.
actor: openai/codex
timestamp: '2026-08-04T02:01:11.986Z'
---

