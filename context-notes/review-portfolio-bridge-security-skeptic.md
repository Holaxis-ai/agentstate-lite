---
type: Context Note
title: Review portfolio bridge security skeptic
actor: bridge-security-skeptic
timestamp: '2026-08-08T17:34:34.826Z'
---
# Summary

## Goals

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions and graph relationships preserve exact OKF identity across every supported surface.

**Proximate goal:** adversarially determine the smallest owning-layer and Review-View repair that preserves exact selector identity, correlates invalid-envelope failure, and bounds request/response work; this serves the ultimate goal by preventing a trusted read projection from manufacturing false graph truth or becoming a denial-of-service amplifier.

## Phase-start orientation

Role: read-only security architecture skeptic. Source changes, Plan/Task/artifact mutations, and sync are out of scope. The architecture system note is the working domain model, not an unquestioned conclusion.

Evidence read before source inspection:

- `CLAUDE.md`, `docs/core`, bundle status, and the required agentstate-lite/self-awareness/cognitive-ecosystem skills.
- `tasks/review-portfolio-bridge-identity-repair` at `sha256:c8ed4b39e5213a31e43f2173a47e165f12b59ee6c4b8182a7ff39505b951d6d9`.
- command system model at `sha256:c80b56fd7c205a5d612ebe9fcc5430e61bdcd25f351ec48943c19ec435f72efa`.
- prior source/security review at `sha256:c0a1ee52187459ce60c94a21b391d6e11c76101606c9a99d0b44527e75d108cc`.
- shipped `view-authoring-v0.md`: v0 selector arrays are bounded by implementation, replies echo request ids, edge count is pre-cap total, read access is exact-byte approved, and the embedded client has no timeout.

## Initial hypotheses to attack

1. Exact nonblank-string preservation belongs in the shared selector parser, but its compatibility effect must be tested against queryEdges semantics and prefix matching rather than inferred from core acceptance alone.
2. Correlating errors by a separately parsed valid envelope may be necessary for liveness, but an envelope parser must stay bounded and must not leak rejected payload details or become a duplicate request codec.
3. View-side batching is necessary for the current 32-selector contract, but naïve parallel batching can amplify CPU, memory, response bytes, and stale-generation work at 500 rows.
4. Aggregate completeness must be fail-closed per batch and direction; cross-batch deduplication cannot be used to reconcile contradictory counts.
5. A source repair is scope creep if it changes v0 grammar, narrows IDs, adds pagination, introduces a second identity codec, or silently increases selector/reply limits.

## Next evidence

Inspect parser/service/backend tests and implementations, core ID rules, exact Review View source and harness, then classify mandatory changes, blocking criteria, non-goals, disclosure status, and rollback boundaries.
