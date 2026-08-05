---
type: Design
title: OKF compatibility and upstream stewardship
actor: openai/codex
timestamp: '2026-08-05T02:15:27.257Z'
---
# Decision

AgentState Lite remains an OKF v0.1 writer. It accepts v0.2 bundles for permissive reading and
transport, but does not claim v0.2 authoring or mutation conformance yet.

The migration is deliberately gated by semantics, not parser coverage. AgentState already parses
and transports nearly all optional v0.2 frontmatter. The unsafe gap is that a meaningful write can
leave v0.2 provenance stale and can emit a `status` value that a generic v0.2 consumer will interpret
incorrectly.

# Product boundary

OKF is AgentState's portable document-format boundary, not its runtime architecture. Ordinary OKF
bundles should remain readable, movable, and useful outside AgentState. AgentState's Kinds, Views,
CAS semantics, storage interfaces, collaboration workflow, and product recipes remain product-level
extensions.

Compatibility does not mean implementing every optional upstream field. It means making every
version claim truthful and never silently changing the meaning of user data.

# Supported-version contract

## Today

- **OKF v0.1 read/write:** supported.
- **OKF v0.2 read/transport:** supported on a best-effort, unknown-field-preserving basis.
- **OKF v0.2 create/mutate:** unsupported until the write contract below is implemented.
- **Unknown future versions:** readable only through explicitly permissive paths; never authorable
  merely because a caller supplied a string.

The CLI must not let `--okf-version` act as an unverified conformance assertion. Supported write
versions belong to product code, not user input.

## Future v0.2 writer contract

A v0.2 writer must own these invariants at the shared mutation boundary:

1. A meaningful content change advances `generated.at`.
2. `generated.by` is preserved unless an explicit, syntactically valid provenance identity is
   supplied. The mutation actor is not silently promoted into provenance.
3. Verification history may remain, but current trust must be derived relative to the new
   `generated.at`; the writer must not imply that old verification covers new content.
4. Date-only values such as `stale_after` and `sources[].last_modified` retain their date shape.
5. The v0.1 fallback fields remain readable, and migration is lazy rather than an eager bundle
   rewrite.
6. Freshness, recent-document, and history consumers prefer `generated.at` for v0.2 and fall back to
   legacy `timestamp`.
7. Local, memory, and remote backends agree on the resulting document and final version receipt.

# Unresolved field collision

OKF v0.2 defines global `status` as `draft | stable | deprecated`. AgentState Kinds use `status` for
type-specific workflow state (`todo`, `in_progress`, `done`, `queued`, `active`, and others). Both are
valuable; they are not the same concept.

AgentState will not rename mature Kind fields speculatively and will not emit those values under a
v0.2 claim without an explicit interoperability rule. The producer report should ask upstream
whether profiles or namespaced extension fields are the intended solution. The final local choice
must keep workflow authoring ergonomic while giving generic OKF consumers an unambiguous lifecycle.

# Migration sequence

1. Guard unsupported version claims in `init` and any other authoring entry points.
2. Publish the empirical producer report upstream, centered on the `status` collision, date
   preservation, and current-content provenance.
3. Decide the workflow-field/profile mapping based on the product requirement and upstream response.
4. Implement the version-aware mutation clock and non-lossy scalar handling in the shared mutation
   layer.
5. Update freshness/history readers and add cross-backend v0.1/v0.2 agreement fixtures.
6. Only then change defaults, documentation, or the public conformance claim.

# Non-goals

- No eager rewrite of existing v0.1 bundles.
- No automatic conversion of CLI actor labels into `generated.by` identities.
- No trust UI, Attested Computation executor, or structured-source product feature solely to claim
  minimal v0.2 support.
- No coupling of Kinds, Views, recipes, or the storage abstraction to upstream OKF releases.

# Evidence

The detailed compatibility matrix and empirical probes are recorded in
[the audit](../research/okf-v0-2-compatibility-audit.md). The prior ecosystem scan remains in
[the traction note](../context-notes/okf-v0-2-traction-and-contribution-scan-2026-08-04.md).
