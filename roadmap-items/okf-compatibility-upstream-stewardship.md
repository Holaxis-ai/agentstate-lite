---
type: Roadmap Item
title: OKF compatibility and upstream stewardship
status: active
description: >-
  Keep AgentState's OKF-native claim truthful as the format evolves, and
  contribute implementation evidence without coupling the product runtime to the
  specification.
sequence: >-
  Audit complete → guard unsupported authoring claims → publish producer
  evidence → adjudicate status/provenance → implement and prove v0.2 writes →
  update public claim
actor: openai/codex
timestamp: '2026-08-08T03:10:06.513Z'
---
# Outcome

Keep AgentState's OKF-native claim truthful as the Open Knowledge Format evolves, while feeding
evidence from a live multi-agent producer and consumer back into the standard.

This work protects portability without turning AgentState into an implementation of every upstream
proposal. The format remains the interoperability boundary; AgentState's Kinds, mutation authority,
Views, storage backends, and collaboration model remain product-level extensions.

# Governing product requirements

The [compatibility design](../designs/okf-compatibility-and-upstream-stewardship.md) records the
founder-level requirements that govern this roadmap: portability as user value, explicit semantic
authority for extensions, and deliberate rather than automatic edition migration. The
[founder discussion provenance](../context-notes/okf-founder-portability-requirements-2026-08-05.md)
preserves why those requirements were adopted.

# Sequence

1. Audit AgentState's v0.1 behavior against OKF v0.2, including round-trip compatibility.
2. Decide the supported-version, read fallback, write, and migration contract.
3. Implement only the compatibility changes justified by the audit and pin them with fixtures.
4. Publish an upstream producer report based on repeated multi-agent mutation, attribution, trust,
   lifecycle, relationship, and reserved-file experience.
5. Contribute reusable conformance fixtures where upstream accepts them.
6. List AgentState as an ecosystem implementation once its v0.2 posture is accurate.

# Scope guard

- Do not adopt every optional v0.2 field merely because it exists.
- Do not copy OKF runtime concerns into the format or copy AgentState runtime concerns into OKF.
- Do not open speculative implementation tasks before the compatibility audit produces findings.
- Prefer dual-read and explicit migration over silently rewriting existing bundles.
- Treat upstream participation as evidence sharing and interoperability work, not product positioning.

# Success

AgentState can state exactly which OKF versions it reads and writes, its examples and public guidance
match that contract, representative upstream bundles round-trip without semantic loss, and upstream
maintainers have a concrete producer report or fixtures drawn from AgentState's real operating history.

[contains](../tasks/okf-v0-2-compatibility-audit.md)

[design](../designs/okf-compatibility-and-upstream-stewardship.md)

[research](../context-notes/okf-v0-2-traction-and-contribution-scan-2026-08-04.md)

[research](../research/okf-v0-2-compatibility-audit.md)

[contains](../tasks/okf-version-claim-guard.md)

[contains](../tasks/okf-upstream-producer-report.md)

[contains](../tasks/okf-v0-2-write-contract.md)

[contains](../tasks/okf-v0-2-read-transport-fixtures.md)

[contains](../tasks/okf-v0-1-write-policy-extraction.md)

[contains](../tasks/meaningful-change-time-lookup.md)

[contains](../tasks/okf-date-only-scalar-preservation.md)
