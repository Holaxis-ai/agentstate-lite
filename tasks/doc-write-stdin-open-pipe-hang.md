---
type: Task
title: >-
  doc write hangs forever when stdin is an open-but-silent pipe (agent-harness
  shape)
description: >-
  DONE — PR #117 merged ad1dfec (2026-07-19), two review rounds. SHIPPED: the
  stdin probe in doc/common.ts's defaultReadStdin (the ONE reader both doc write
  and doc update ride) bounds the wait for the FIRST byte at 200ms — an
  open-but-silent pipe (the agent-harness/CI shape that produced two live hung
  processes) now resolves 'nothing given' per the documented empty-pipe
  semantics; once data starts there is NO mid-stream timeout (600ms-gap
  multi-chunk pin). Round-1 review adjudicated the silent-empty-body tail
  ACCEPTABLE because the destructive branch was already closed (--blank-body
  guard refuses body-dropping overwrites; update's patch semantics never touch
  the body) — the residual case (NEW doc created empty when a slow producer's
  first byte misses the bound) now emits a receipt NOTE via a
  STDIN_SILENT_TIMEOUT sentinel (update side rides the no-field USAGE error,
  same note). Round-1 block was a machine-dependent wall-clock test assertion
  (CI-red); the builder's replacement was endorsed by review as SUPERIOR to the
  prescribed fix: an up-front byte in a never-closed pipe makes both regression
  classes deterministic (probe-consults-stdin → hang → kill-timer;
  byte-as-content → byte-exact failure), no clock anywhere. Red-proofs executed
  live at both rounds. Discovery provenance: this session's ps output,
  2026-07-19.
actor: mike/claude
status: done
timestamp: '2026-07-19T04:08:36.729Z'
---
Evidence: this session's ps output showed two doc write processes sleeping 3+ minutes on the stdin probe; killing them unblocked. Workaround until fixed: append </dev/null or pass --body explicitly.
