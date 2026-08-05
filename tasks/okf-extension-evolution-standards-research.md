---
type: Task
title: Research evolution patterns in FHIR and comparable standards
status: done
priority: '1'
actor: codex-standards-research
timestamp: '2026-08-05T22:47:42.138Z'
---
# Objective

Research how mature standards distinguish core from extensions, prevent or resolve collisions, version artifacts, and guide implementer migration.

# Acceptance

Evidence-backed findings cover FHIR plus at least three relevant comparator ecosystems and identify transferable versus non-transferable mechanisms.

# Outcome

Completed a primary-source comparison of FHIR R5, OpenAPI 3.2.0, Kubernetes v1.36 documentation, JSON Schema Draft 2020-12, and XML Namespaces 1.0/Web Architecture, pinned by edition/status/date and separated into normative facts, documented practice, empirical local facts, and local design inferences.

The research maps mechanisms and failure responses across C1-C14. Its central conclusion is that agentstate-lite needs four complementary layers: authority-qualified/versioned identity with scoped aliases; an explicit profile/contract declaration; operation-specific handling for unknown required versus optional semantics; and staged, loss-aware, observable CAS migration. It explicitly rejects copying Kubernetes online conversion webhooks and FHIR modifier extensions wholesale into a Markdown/YAML local-first system.

[produced](../research/okf-extension-evolution-standards-patterns.md)
