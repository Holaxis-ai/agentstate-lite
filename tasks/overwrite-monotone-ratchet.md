---
type: Task
title: >-
  Monotone conformance ratchet on overwrite (empirically cleared — build after
  completing-command help)
description: >-
  Child of roadmap-items/conformance-ergonomics, PROMOTED from tier-2 by the
  tasks/overwrite-ratchet-survey probe (2026-07-19): full-suite evidence shows
  the rule's ONLY behavioral delta is the intended one (1494 pass / 1 fail, the
  fail being the old warn-contract pin). Spec (probe-proven shape): in core
  mutateDocument's overwrite branch, when NOT strict and the existing doc
  conforms to its governing kind, refuse (typed KindConformanceError) a
  candidate that violates ITS OWN — possibly retyped — kind; while a doc has
  never conformed, leniency is unchanged (staging stays legal); optional-field
  drops still warn only. Also DECIDE at build: whether promote's CAS-overwrite
  path (direct writeDocVersioned, the byte channel) joins the invariant or stays
  a documented escape — the survey mapped it as the only other overwrite door.
  DoD: the probe's rule productionized with the one old test REWRITTEN as the
  new refuse-contract pin (composing with the completing-argv help), a
  staging-stays-lenient pin, a retype-to-ungoverned escape pin, and the
  conventions-free byte-identity pin. SEQUENCING: build only AFTER
  tasks/kind-error-completing-command merges so the refusal lands already
  carrying its remediation.
actor: mike/claude
status: todo
timestamp: '2026-07-19T03:00:13.902Z'
---
Probe provenance: scratch worktree at main 6f00144; the probe edit was ~15 lines in core/src/document-mutation.ts overwrite decide() using defaultTimestampAndValidateAgainstRegistry on existing-then-candidate. Full transcript on the survey task.
