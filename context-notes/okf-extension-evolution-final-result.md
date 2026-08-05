---
type: Context Note
title: OKF extension evolution final result
description: >-
  Approved architecture decision, exact review evidence, implementation gates,
  and orchestration reflection
actor: codex-main
timestamp: '2026-08-05T23:06:44.552Z'
---
# Summary

The architecture/standards team completed an independently researched, cross-reviewed, adversarially repaired, and exact-version-approved recommendation for evolution-safe OKF extensions and agentstate-lite Kind conventions.

## Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal achieved: establish an evolution-safe extension and migration policy so upstream OKF changes cannot silently change the meaning of agentstate-lite data.

## Result

- Final design: `designs/okf-extension-evolution-recommendation` at `sha256:efa470dccbe2fe1aa8d5c06f17603e9ae6cd1a520715159c2a562e6507fde378`.
- Exact final review: `reviews/okf-extension-evolution-recommendation-rereview` at `sha256:fa97d2bacf90c01050e96a02bc03e819a7eed9d1eb3c313f1cba921d81ddd3f5`, verdict PASS.
- Parent task: `tasks/okf-extension-evolution-architecture`, done.
- No code, stored documents, or OKF version claims were changed.

The recommendation is a layered contract: explicit core/portable/local authority classes; stable semantic IDs distinct from versions, aliases, and wire coordinates; an isolated and provisional custom wire lane; profiles for composition; operation-specific capabilities; one compiled registry; a C1-C14 collision playbook; and dual-read/single-write migration protected by an enforced bundle epoch or direct-file quiescence, a complete revision-set commit, final audit, and rollback/resume state.

## Remaining implementation gates

- Implement the immediate v0.1 writer-version guard and generated collision/capability ledger before any v0.2 semantic authoring.
- Prototype nested versus authority-prefixed wire forms against preservation, parser-shape, query, hand-edit, and generic-consumer tests before freezing syntax.
- Seek upstream reservation/profile/version guidance using the final decision table.
- Treat migration implementation as a separate reviewed unit with multi-process backend fencing and direct-filesystem quiescence tests.

## Orchestration reflection

The staged dialectic worked: a shared taxonomy made two independent branches comparable; freezing them before cross-read preserved genuinely independent convergence; reciprocal reviews corrected standards-transfer caveats; and the exact adversarial gate found the bundle-wide verification/root-flip race that the initial convergence had not fully closed. The main improvement for future architecture reviews is to model cooperative and non-cooperative writers explicitly in the initial domain model whenever a migration relies on a control record that old tools may ignore.

[recommendation](../designs/okf-extension-evolution-recommendation.md)

[exact final review](../reviews/okf-extension-evolution-recommendation-rereview.md)

[parent task](../tasks/okf-extension-evolution-architecture.md)
