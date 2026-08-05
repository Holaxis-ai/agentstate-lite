---
type: Context Note
title: Summarize upstream OKF issue 272
actor: codex-main
timestamp: '2026-08-05T22:19:50.287Z'
---
# Summary

Recommended navigation policy for the OKF v0.2 `status` collision: keep v0.1 authoring, immediately guard unsupported version claims, preserve v0.2 read/transport behavior, and gate the permanent workflow-state serialization decision on upstream adjudication or an explicit local decision.

# Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: turn upstream issue #272 into a low-risk OKF adoption policy for agentstate-lite, preserving portability while avoiding ambiguous or lossy migration.

# Recommendation

1. Implement the existing `tasks/okf-version-claim-guard` now. This correctness guard does not depend on upstream: agentstate-lite should reject v0.2 and unknown authoring claims while continuing permissive reads.
2. Do not rename fields, bump defaults, dual-write, or eagerly migrate existing v0.1 bundles.
3. Adopt four semantic invariants: the declared OKF version determines ownership of a serialized key; meaning is never inferred from a value; invalid core values are preserved and warned on rather than reinterpreted; ordinary mutation never performs an implicit schema migration.
4. Default the eventual v0.2 design toward a namespaced producer field for workflow state, unless upstream specifies another mechanism that is equally unambiguous to generic consumers. A profile alone is insufficient if unaware consumers still misread top-level `status`.
5. Use dual-read/single-write migration: existing v0.1 `status` remains readable; an explicit, resumable, CAS-protected upgrade writes only the adjudicated v0.2 representation. Do not dual-write two competing sources of truth.
6. Keep the user-facing workflow ergonomic, but decouple logical Kind fields or CLI aliases from serialized keys if necessary so future core-field adoption requires a mapping change rather than another ecosystem-wide data collision.
7. Pin the decision with cross-producer and cross-backend fixtures before enabling a v0.2 writer.

# Decision trigger

Upstream response is useful but not an indefinite blocker. The permanent field mapping is decided when either upstream provides collision semantics or agentstate-lite is otherwise ready to begin the v0.2 writer, whichever comes first. Until then, the write-version guard makes the waiting state safe.

# Existing alignment

This recommendation refines rather than replaces `research/okf-v0-2-compatibility-audit` and `designs/okf-compatibility-and-upstream-stewardship`. The current roadmap and tasks already encode most of it; the immediate actionable unit is `tasks/okf-version-claim-guard`.

[applies](../designs/okf-compatibility-and-upstream-stewardship.md)

[recommends next](../tasks/okf-version-claim-guard.md)
