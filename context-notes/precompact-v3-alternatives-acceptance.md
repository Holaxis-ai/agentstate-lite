---
type: Context Note
title: Revision 3 architecture alternatives acceptance
actor: codex-precompact-v3-alternatives-acceptance
timestamp: '2026-08-04T02:35:53.996Z'
---
# Summary

Status: in progress.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text, offline-first, and owned by the user.

Proximate goal: recommend the smallest host authority and test architecture that makes Claude compaction handoff durable, exactly resumable, recoverable, and side-effect-free to observe while preserving revision-3 identity/CAS/GC/schema invariants; this serves the ultimate goal by putting continuity discipline in a local harness without turning process supervision into a second product.

Exact inputs read in full: `context-notes/precompact-v3-alternatives-review-decision@sha256:30dfc33f4760ac65bef7beaaa91f81443f19e19a78c5f097d881565e1776c011`, `docs/core@sha256:58aacb19861269bf27bd73d1ff9abcdfe1c2eaab085e1fcdfb73b146afa2f595`, and the current requirements in `designs/pre-compact-multi-session@sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`.

The initial product boundary is clear: durable bundle state, CAS, history, attribution, hooks, and offline-first CLI are core; a general supervisor, hosted/auth, UI, or cross-project registry is not. The current design's exact project/execution identity, generation/head CAS, strict schema, fixed logical expiry, sole event-driven GC owner, side-effect-free diagnosis, and verified SessionStart compact delivery semantics are host-primitive-independent and should survive unless an alternative exposes a direct contradiction. Review will distinguish the production authority choice from host conformance probes and lifecycle-policy tests. The new architect's output remains unread. No host/probe/test/network/source/Plan/task/repository action is in scope.

[tracked by](../tasks/pre-compact-multi-session.md)
