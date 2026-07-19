---
type: Task
title: >-
  Monotone conformance ratchet on overwrite (empirically cleared — build after
  completing-command help)
description: >-
  DONE — PR #119 merged 49907d6 (2026-07-19), one review round,
  APPROVE-WITH-NITS. The monotone ratchet is live in core mutateDocument's
  overwrite branch: a conforming doc cannot be overwritten into nonconformance
  (typed KindConformanceError; never-conformed docs keep staging leniency;
  optional-field drops still warn only; retype-to-ungoverned remains the
  documented escape, as does promote's CAS-overwrite path — comment-only note
  there). Probe prediction CONFIRMED by build: exactly one pre-rewrite suite
  failure (the old warn-contract pin), zero other regressions. The rewritten pin
  proves the #115 composition empirically — the refusal's envelope carries the
  literal completing doc update argv, needing ZERO CLI-layer changes. Review's
  one MEDIUM finding (empirical): conforms()'s timestamp-defaulting disagrees
  with status's raw debt accounting for externally-authored docs missing a
  required timestamp — direction adjudicated acceptable (loud, lossless,
  self-healing), alignment filed as tasks/conforms-raw-alignment with option (a)
  decided. Red-proofs reproduced by the reviewer (exactly 2 'Missing expected
  rejection').
actor: mike/claude
status: done
timestamp: '2026-07-19T13:20:25.351Z'
---
Probe provenance: scratch worktree at main 6f00144; the probe edit was ~15 lines in core/src/document-mutation.ts overwrite decide() using defaultTimestampAndValidateAgainstRegistry on existing-then-candidate. Full transcript on the survey task.
