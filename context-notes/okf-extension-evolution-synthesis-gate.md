---
type: Context Note
title: OKF extension evolution synthesis gate
description: >-
  Current goals, system model, artifacts, assumptions, and independent-review
  gate for the OKF extension architecture
actor: codex-main
timestamp: '2026-08-05T23:06:56.524Z'
---
# Summary

The standards and architecture branches converged on a layered extension contract. This gate note is superseded by `context-notes/okf-extension-evolution-final-result`; exact repaired re-review passed.

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: establish an evolution-safe extension and migration policy so upstream OKF changes cannot silently change the meaning of agentstate-lite data.

## Current state

- Shared taxonomy and research plan are complete.
- Independent standards research and architecture option analysis were frozen before cross-reading.
- Both exact-version cross-reviews passed with nonblocking caveats.
- Synthesis is persisted as `designs/okf-extension-evolution-recommendation` at `sha256:226214f3ab5d302cffa4ceb57d9fa3965cf1aaf4d2bce065348949cd376cc600`.
- The initial adversarial review was conditional; the repair passed exact re-review at `reviews/okf-extension-evolution-recommendation-rereview` version `sha256:fa97d2bacf90c01050e96a02bc03e819a7eed9d1eb3c313f1cba921d81ddd3f5`.

## Current system model

The recommendation separates five concerns that the current implementation conflates: semantic authority/identity, wire ownership, profile composition, operation capability, and migration state. Core, portable, and bundle-local definitions are separate authority classes. Custom wire data is isolated from core coordinates; profiles never authorize overloading. Short Kind/field names remain scoped aliases. A single compiled registry selects exact local definitions and mappings. Incompatible changes use a persisted write gate plus per-document CAS, dual-read/single-write conversion, full verification, and root contract flip last.

## Unverified assumptions and open decisions

- Nested-envelope preservation and query/edit ergonomics need empirical tests; flat authority-prefixed fields remain the fallback.
- OKF has not reserved a producer extension lane or normative profile location; exact syntax remains provisional and migratable.
- Authority transfer/trust, bundle-local identity through copy/fork/merge, maturity labels, support windows, and exact profile scope need policy decisions.
- No code or data migration is authorized by this research task. The immediate recommendation remains honest v0.1 authoring plus an unsupported-writer guard and collision/capability ledger.

## Gate result

Accepted after repair and exact-version PASS. See `context-notes/okf-extension-evolution-final-result` for the final system model and remaining implementation gates.

[superseded by final result](okf-extension-evolution-final-result.md)
