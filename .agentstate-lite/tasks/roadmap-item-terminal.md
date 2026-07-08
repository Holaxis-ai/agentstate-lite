---
type: Task
title: 'Roadmap Item declares terminal: done (recipe seed + live board convention)'
status: todo
priority: '3'
description: >-
  Composition follow-up from PR #21 x PR #20 crossing in flight: the roadmap
  recipe seeds Roadmap Item with the queued/active/done enum but no terminal
  declaration, so list --open will not filter finished roadmap items the way it
  filters done/canceled tasks. Two touches, both tiny: (1) recipes.ts
  ROADMAP_ITEM seed gains terminal: {status: [done]} plus test; (2) the live
  board conventions/roadmap-item doc gains the same declaration. GATED on PR #20
  merging first — before that, main parser warns
  KIND_CONVENTION_UNKNOWN_FIELDS_KEY on fields.terminal.
actor: mike/claude
timestamp: '2026-07-08T23:15:16.864Z'
---

