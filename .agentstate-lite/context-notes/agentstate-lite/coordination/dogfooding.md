---
type: Context Note
title: dogfooding
description: >-
  Delete (fccb067) + kind-aware doc surface (e0349b9) shipped; kind-awareness
  gap CLOSED. Recipes reframed as an OKF-layer standard (profile), lite =
  reference impl. Next fork: AXI experience pass vs work-tracking recipe.
tags:
  - coordination
  - agentstate-lite
  - dogfooding
timestamp: '2026-07-03T04:00:26.318Z'
---
# Summary

TWO units shipped + committed this session, both plan->implement->adversarial-review workflows, both live-verified against the deployed bundle: DELETE (fccb067 — hard-delete across seam/backends/wire/engine/CLI/auth, CAS-guarded, idempotent) and KIND-AWARE DOC SURFACE (e0349b9). The kind-awareness gap that dogfooding surfaced is now CLOSED in both facets: doc read shows ALL frontmatter (status/priority visible), and doc update --<field> patches kind fields (status transition), strict-by-default on enums. The task recipe is finally buildable — this note itself and tasks are now maintained via `doc update`, no pull/promote dance.

# Decisions

- Kind-aware doc surface shipped (e0349b9): extend doc update (not a new verb); strict-by-default for kind fields; doc read shows all keys (no --fields hatch). 509 tests, 0 fail.
- Delete shipped (fccb067): hard-delete, CAS, idempotent, non-cascading, reserved-safe, DELETE writer-role in auth.
- Recipes are an OKF-layer STANDARD (a *profile* of OKF), lite is the reference implementation — NOT folded into OKF core. Captured in designs/recipes ("Altitude" section). Standards-first thinking; still shippable as a lite feature.
- Tasks are a kind convention over docs+links+CAS — the whole arc (build tasks from primitives -> hit gaps -> fix delete + kind-awareness) validates the one-mechanism/kinds architecture end to end.

# Open Questions

- NEXT FORK: the AXI experience pass (tasks/axi-experience-pass — home-as-dashboard, translate parseArgs errors, invocation-correct hints; the originally-queued "broader workflow") vs. spiking the work-tracking RECIPE now that it is unblocked (and now shaped as an OKF-standard artifact). Human to steer.
- LOW follow-up (recorded on tasks/task-ergonomics): a repeated scalar kind flag (--status a --status b) writes a YAML array; needs a kind-field arity guard across new + doc update (a separate unit, deferred to stay consistent with new's grammar).
- Remaining task-ergonomics (tasks/task-ergonomics): status in the DEFAULT list/query row, filter-by-status, runnable/blocked derivation, claim/claim-next sugar.

# Pointers

- [delete unit plan](../../../plans/delete-operation.md)
- [kind-aware doc surface plan](../../../plans/kind-aware-doc-surface.md)
- [recipes design incl. the OKF-standard altitude](../../../designs/recipes.md)
- [remaining ergonomics + the LOW arity follow-up](../../../tasks/task-ergonomics.md)
