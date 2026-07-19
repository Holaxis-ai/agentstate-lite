---
type: Task
title: >-
  CANDIDATE: creating a governed doc should be one command, not
  write-then-update
description: >-
  Usability CANDIDATE (2026-07-19, from this line's own dogfooding — filed
  pending validation by an unbiased cold-start Sonnet probe; see
  roadmap-items/conformance-ergonomics for the parent theme). Observed 4x in one
  day by a heavy agent user: doc write cannot set kind-declared fields (--status
  is not a flag it knows), so every governed-doc creation is write-then-update —
  and the two-step is exactly what produced the title-omission failure that
  seeded the conformance-ergonomics work. The kind-aware 'new' command exists
  but nothing steers an agent there; the natural habit is doc write. TWO FIX
  SHAPES (decide at build): (a) teaching — skill/help/refusal surfaces route
  governed types to 'new' (zero code risk); (b) capability — doc write accepts
  declared-field flags when a kind governs the type (grows doc write's surface;
  must stay a no-op for ungoverned types). VALIDATION GATE: build only if the
  cold-start probe independently hits this friction, or Mike overrides.
actor: mike/claude
status: todo
timestamp: '2026-07-19T15:21:22.713Z'
---

