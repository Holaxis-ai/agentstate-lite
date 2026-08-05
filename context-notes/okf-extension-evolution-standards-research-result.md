---
type: Context Note
title: OKF extension evolution standards research result
description: >-
  Frozen standards comparison, findings, provenance, and handoff state for
  architecture synthesis.
actor: codex-standards-research
timestamp: '2026-08-05T22:48:12.163Z'
---
# Summary

Standards research is complete and frozen for architecture synthesis. The evidence supports a layered approach combining qualified identity, declared contracts, operation-specific unknown handling, and staged observable migration.

# Standards research result

## Goal state

- **Ultimate goal:** Make agentstate-lite shared, versioned, conflict-safe Markdown memory that a human-and-agent fleet can install and use without founder intervention.
- **Proximate goal:** Derive a reusable, evidence-traceable standards-evolution pattern set so agentstate-lite preserves OKF portability without founder judgment for each future collision.
- **Progress:** Complete. The published research supplies the evidence trail, collision-class mapping, implementer workflow, failure-response matrix, rejected analogies, and confidence/gap ledger needed by the architecture synthesis.

## Frozen artifact

- Deliverable: `research/okf-extension-evolution-standards-patterns`
- Head version after cross-links: `sha256:77dfcfd41704372d5b36c41cf74055de8f609719de2c5fbc83beddb871040c6b`
- Task: `tasks/okf-extension-evolution-standards-research`, completed at `sha256:7efff6cdaeaa7e6b9ed35dc75235b234c981c67ed62042c6958fc166ebe29c89`
- Evidence base: FHIR R5 5.0.0; OAS 3.2.0; Kubernetes v1.36 official documentation; JSON Schema Draft 2020-12; XML Namespaces 1.0 Third Edition and W3C Web Architecture; pinned OKF v0.2 repository spec; pinned local compatibility audit.

## Findings handed to architecture

1. Authority-qualified canonical identity and a human-friendly alias are separate concepts. Core/custom differentiation should be mechanically visible, and custom/custom ownership must still be authority-qualified.
2. Profiles/contracts declare the base standard, active definition versions, invariants, and required/optional support; a declaration selects validation but is not proof of conformance.
3. Unknown handling must be operation-specific: opaque transport is usually safe, while an affected semantic mutation must fail closed when required semantics are unknown.
4. Dialect/profile/extension or Kind schema/migration/logical-product/document-CAS versions are independent axes.
5. Evolution should use maturity-specific change budgets, deterministic loss-aware mappings, dual-read/single-write behavior, CAS rewrites, durable progress state, verification, and staged retirement.
6. Namespacing alone, profiles alone, and migration alone each leave multiple C1-C14 collision classes unresolved.
7. Rejected analogies: do not depend on Kubernetes-style online conversion webhooks; do not grant arbitrary instance fields FHIR-style global modifier power.

## Independence and scope

The first research artifact was completed and published without reading `designs/okf-extension-evolution-options`, preserving the plan's divergent-first requirement. No source or git state was modified; all persistent writes were confined to the agentstate-lite bundle.

[research deliverable](../research/okf-extension-evolution-standards-patterns.md)

[completed task](../tasks/okf-extension-evolution-standards-research.md)
