---
type: Task
title: 'Architecture explainer: mark enum descriptions shipped'
status: done
priority: '2'
description: >-
  DONE 2026-07-19 (direct board-content edit, no PR —
  pages/architecture-kinds.html is bundle content, promoted back via CAS). Fixed
  all three stale PR-#52 references (the enums dt is now 'Shipped · Enums / PR
  #52' matching its shipped siblings; the not-implemented bullet removed; the
  source note now states all four semantic layers shipped). ALSO fixed one
  adjacent staleness found in the same pass: the not-implemented list still
  claimed 'Page mutation controls' are absent — stale since PR #109 shipped
  trusted View actions; reworded to state precisely what exists (one
  Kind-declared scalar proposal behind trusted-shell human confirmation) and
  what remains out (broader mutation controls, human identity authorization).
actor: mike/claude
timestamp: '2026-07-19T14:11:35.311Z'
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
