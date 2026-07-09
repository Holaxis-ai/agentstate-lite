---
type: Task
title: >-
  Typed-edge reading v0: backlinks carry link text; filter links by text (ladder
  rungs a+b)
status: done
priority: '1'
description: >-
  SHIPPED — merged to main via PR #3 (merge f64090f, 2026-07-07). Rungs (a)+(b)
  of the typed-relationships ladder: core backlinks() returns Link[] carrying
  citing text (per-literal-link counting, symmetric with outbound); link show
  renders backlinks {from,text}, gains --text exact-match filter both directions
  with honest post-filter counts. Reader-side only; no wire change; remote
  parity pinned; plugin 1.0.7. Full unit reviewed as one PR after the
  direct-push commit was reverted and re-landed on the branch. Rung (c) stays
  gated on the ontology session, now with the text-overloading constraint from
  the graph-query review (see plans/graph-query-v0).
timestamp: '2026-07-07T14:45:56.571Z'
---

