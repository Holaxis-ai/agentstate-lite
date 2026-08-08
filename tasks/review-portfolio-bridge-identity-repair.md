---
type: Task
title: Repair Review portfolio bridge identity and scale boundaries
status: in_progress
priority: '1'
assignee: codex-orchestrator
actor: codex-orchestrator
timestamp: '2026-08-08T17:31:17.250Z'
---
# Ultimate and proximate goals

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions and graph relationships preserve exact OKF identity across every supported surface.

**Proximate goal:** repair the owning v0 selector parser and Review portfolio graph aggregation so open-world Reviews remain discoverable and never acquire false currentness at scale or through identifier normalization; this serves the ultimate goal by keeping the bundle, bridge, View, and CLI on one identity contract.

# Problem

The independently reviewed Review portfolio is correct for the current 19-record corpus but not for the reusable infrastructure it is intended to become. One edge selector accepts at most 32 values while the View can return 500 Reviews, and the selector parser trims leading/trailing whitespace from core-valid opaque IDs. The first can leave a refresh pending at 33+ Reviews; the second can query a different identity while reporting a complete graph.

# Authorized scope

- Preserve every exact nonblank selector string in `packages/view-runtime`; use trimming only to detect an all-whitespace value.
- Batch Review portfolio edge selectors within the shipped v0 maximum and aggregate every batch/direction with strict result-shape and exact-count validation.
- Add source-level parser/service tests, View harness coverage for 0/1/32/33/500 Reviews and whitespace-bearing IDs, and regression coverage for error correlation/fail-closed currentness.
- Update generated/distributed artifacts only through the repository's documented build workflow if source changes require it.
- Do not narrow the OKF concept-ID grammar, duplicate an identity codec in the View, change the v0 message grammar, or weaken existing trust boundaries.

# Gates

Research and acceptance criteria → team-reviewed implementation plan → Builder → independent Reviewer → QA. Code review is a required dependency before QA. Final completion also requires the original architecture-review alignment security gate, scratch portability/browser QA, immutable approval records, full repository checks, branch commit/push, and board sync.

[governed by](../plans/architecture-review-record-alignment.md)

[diagnosed by](../context-notes/architecture-review-alignment-view-command-system-model.md)

[security evidence](../context-notes/architecture-review-alignment-view-source-security-review.md)
