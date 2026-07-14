---
type: Task
title: 'Architecture explainer: mark enum descriptions shipped'
status: todo
priority: '2'
description: >-
  Refresh the Kinds architecture Page and the review's label audit after PR #52:
  enum-value descriptions are shipped/current on main, not Next or in progress.
  Remove stale not-implemented wording while preserving the evidence gate for
  section descriptions/examples.
actor: codex-main
timestamp: '2026-07-14T17:07:55.587Z'
---
# Required correction

PR #52 is merged and `tasks/kind-enum-value-descriptions` is done. Update the architecture
explainer so its Current / Next / Later / Hypothesis presentation matches the implemented state:

- describe machine-readable enum-value descriptions as shipped/current;
- cite PR #52 as merged rather than in progress;
- remove enum-value descriptions from the not-implemented list;
- keep section descriptions and examples evidence-gated rather than promoting them automatically;
- retain the distinction between semantic descriptions and executable workflow rules.

Update the Review Request's label-audit findings and decision summary as needed so a reader is not
told that this already-shipped work remains pending. Preserve its original Context, Requested
decision, and Acceptance criteria exactly.

# Completion evidence

- The source Page asset and promoted bundle blob agree.
- The rendered Page uses current labels and contains no stale “PR #52 in progress” wording.
- The review still identifies the typed-link identity mismatch as the blocking objection until that
  separate P1 task is resolved.
- Relevant Page/rendering and bundle checks pass.
