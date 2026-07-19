---
type: Task
title: >-
  Kind-declared field defaults at create time (PARKED — needs a second concrete
  case)
description: >-
  TIER-2 child of roadmap-items/conformance-ergonomics — PARKED, do not build.
  Idea: a kind convention MAY declare a default for a field (e.g. status: todo),
  auto-filled at doc write with a visible 'defaulted' warning, making omission
  impossible rather than cheap. Design risk that parks it: a default is a small
  lie when the honest answer was 'the agent should have said' — one dogfood case
  (title omission, which a default cannot fix anyway) is not evidence. UNPARK
  TRIGGER: a second concrete case where a default is obviously right (a field
  with one overwhelmingly-common initial value whose omission recurs in
  practice). Mechanism if unparked: core kinds registry (opt-in per bundle,
  conventions-free bundles byte-identical — gate 3), never engine-implicit.
actor: mike/claude
status: todo
timestamp: '2026-07-19T02:51:07.421Z'
---

