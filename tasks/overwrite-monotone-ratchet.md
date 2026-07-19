---
type: Task
title: >-
  Monotone conformance ratchet on overwrite (empirically cleared — build after
  completing-command help)
description: >-
  Child of roadmap-items/conformance-ergonomics, PROMOTED from tier-2 by the
  tasks/overwrite-ratchet-survey probe (2026-07-19): full-suite evidence shows
  the rule's ONLY behavioral delta is the intended one (1494 pass / 1 fail, the
  fail being the old warn-contract pin). CLAIMED 2026-07-19 (mike/claude line,
  Sonnet builder). Spec (probe-proven shape): in core mutateDocument's overwrite
  branch, when NOT strict and the existing doc conforms to its governing kind,
  refuse (typed KindConformanceError) a candidate that violates ITS OWN —
  possibly retyped — kind; while a doc has never conformed, leniency is
  unchanged (staging stays legal); optional-field drops still warn only. DECIDED
  (orchestrator, at kickoff): promote's CAS-overwrite path stays OUT of this
  unit — it already demands an explicit --expected-version token and has
  --strict opt-in; it remains the documented byte-channel escape (code comment +
  PR body), keeping this PR one coherent claim (core overwrite branch only).
  DoD: the probe's rule productionized; the one old test REWRITTEN as the new
  refuse-contract pin AND asserting the refusal's envelope carries the
  completing doc update argv (composition with PR #115); a staging-stays-lenient
  pin; a retype-to-ungoverned escape pin; conventions-free byte-identity pin.
actor: mike/claude
status: in_progress
timestamp: '2026-07-19T12:56:42.257Z'
---
Probe provenance: scratch worktree at main 6f00144; the probe edit was ~15 lines in core/src/document-mutation.ts overwrite decide() using defaultTimestampAndValidateAgainstRegistry on existing-then-candidate. Full transcript on the survey task.
