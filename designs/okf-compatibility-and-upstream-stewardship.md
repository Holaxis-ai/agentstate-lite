---
type: Design
title: OKF compatibility and upstream stewardship
actor: openai/codex
timestamp: '2026-08-05T02:00:30.138Z'
---
# Decision frame

AgentState adopts OKF as its portable document-format boundary, not as its runtime architecture.
Compatibility therefore means that ordinary OKF bundles remain readable, writable, movable, and
useful outside AgentState. It does not require upstreaming AgentState's Kinds, Views, CAS semantics,
storage interfaces, collaboration workflow, or product recipes.

OKF v0.2 supersedes v0.1 and deliberately replaces two v0.1 conventions: `timestamp` with
`generated.at`, and body `# Citations` with structured `sources`. It also adds optional provenance,
verification, lifecycle, freshness, actor, and attested-computation fields. AgentState currently
declares and teaches v0.1, so its compatibility posture must be reassessed before its public claim is
updated.

# Proposed compatibility policy

This is the starting recommendation for the audit to confirm or revise:

1. **Read older bundles.** Continue accepting valid v0.1 documents and the upstream-declared v0.2
   fallbacks. Never require migration merely to open an existing bundle.
2. **Preserve unknown optional fields.** Generic document reads and state-dependent writes must not
   erase v0.2 metadata AgentState does not interpret.
3. **Do not equate fields by spelling alone.** Map `timestamp` to `generated.at` only if their mutation
   semantics are actually compatible. Do not manufacture `verified`, trust, sources, or provenance.
4. **Write one explicit version contract.** New-bundle defaults, migrated-bundle behavior, examples,
   skill guidance, and public claims must all derive from the same decision.
5. **Make migration explicit and idempotent.** If byte changes are necessary, expose an inspectable,
   testable migration rather than rewriting bundles opportunistically.
6. **Test portability at the boundary.** Use representative upstream bundles and small language-neutral
   fixtures to prove parsing, preservation, indexing, links, reserved-file treatment, and round trips.
7. **Contribute evidence, not product-specific schema.** Upstream reports should describe observed
   problems and interoperable fixtures; proposals should remain minimal and producer-independent.

# Upstream contribution boundary

AgentState has useful evidence in areas upstream is actively discussing:

- repeated agent mutation and whether provenance or verification still describes current bytes;
- actor attribution versus authenticated identity;
- typed relationship discovery and link identity;
- nested reserved filenames, path encoding, Unicode, and deterministic indexes;
- deletion, history, and `log.md` as portable projections rather than runtime authorities;
- storage-independent round trips and conformance behavior.

The preferred contribution order is: producer report, fixtures, targeted clarification or bug fix,
then ecosystem listing. Avoid proposing AgentState's complete architecture as an OKF requirement.

# Acceptance criteria

- The audit records read, preserve, write, and migrate behavior for v0.1 and v0.2.
- The chosen policy has one implementation authority and executable compatibility evidence.
- Public documentation no longer makes a version claim broader or older than actual behavior.
- At least one upstream-facing artifact is useful without requiring AgentState.

# Sources

- [OKF v0.2 specification](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [Google Cloud: OKF v0.2 tackles agentic trust](https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals/)
- [Typed relationships proposal](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/148)
- [Current upstream viewer/conformance fixes](https://github.com/GoogleCloudPlatform/knowledge-catalog/pull/262)
