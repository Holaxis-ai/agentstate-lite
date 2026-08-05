---
type: Context Note
title: OKF extension evolution synthesis gate
description: >-
  Current goals, system model, artifacts, assumptions, and independent-review
  gate for the OKF extension architecture
actor: codex-main
timestamp: '2026-08-05T22:57:51.979Z'
---
# Summary

The standards and architecture branches converged on a layered extension contract; the exact synthesized design is now at its independent adversarial acceptance gate.

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: establish an evolution-safe extension and migration policy so upstream OKF changes cannot silently change the meaning of agentstate-lite data.

## Current state

- Shared taxonomy and research plan are complete.
- Independent standards research and architecture option analysis were frozen before cross-reading.
- Both exact-version cross-reviews passed with nonblocking caveats.
- Synthesis is persisted as `designs/okf-extension-evolution-recommendation` at `sha256:226214f3ab5d302cffa4ceb57d9fa3965cf1aaf4d2bce065348949cd376cc600`.
- An independent adversarial reviewer is testing that exact design through `tasks/okf-extension-evolution-adversarial-review`.

## Current system model

The recommendation separates five concerns that the current implementation conflates: semantic authority/identity, wire ownership, profile composition, operation capability, and migration state. Core, portable, and bundle-local definitions are separate authority classes. Custom wire data is isolated from core coordinates; profiles never authorize overloading. Short Kind/field names remain scoped aliases. A single compiled registry selects exact local definitions and mappings. Incompatible changes use a persisted write gate plus per-document CAS, dual-read/single-write conversion, full verification, and root contract flip last.

## Unverified assumptions and open decisions

- Nested-envelope preservation and query/edit ergonomics need empirical tests; flat authority-prefixed fields remain the fallback.
- OKF has not reserved a producer extension lane or normative profile location; exact syntax remains provisional and migratable.
- Authority transfer/trust, bundle-local identity through copy/fork/merge, maturity labels, support windows, and exact profile scope need policy decisions.
- No code or data migration is authorized by this research task. The immediate recommendation remains honest v0.1 authoring plus an unsupported-writer guard and collision/capability ledger.

## Next gate

Accept only after the exact adversarial review passes. If it is conditional or fails, repair the design and require exact-version re-review before closing the parent task.
